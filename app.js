/* Chiplog — rolling-average GPS speed over ground, in knots.
 *
 * Average SOG = (sum of great-circle distance between consecutive accepted
 * fixes in the window) / (elapsed time between oldest and newest accepted
 * fix in the window). Distance-over-time, not mean-of-samples (SPEC.md).
 */
"use strict";

const APP_VERSION = "0.1.0"; // shown in settings; keep in step with sw.js CACHE_VERSION

// ---- Constants ----
const EARTH_R = 6371000;          // metres (haversine)
const MS_TO_KN = 1.94384;         // m/s → knots
const INST_FLOOR_KN = 0.3;        // below this, instantaneous reads 0.0 (anti phantom-crawl)
const STALE_MS = 5000;            // fix older than this → STALE
const DEFAULTS = { windowMin: 15, accuracyGate: 25, theme: "dark" };
const SETTINGS_KEY = "chiplog.settings";

// ---- State ----
let settings = loadSettings();
let buffer = [];                  // accepted fixes: { t, lat, lon, acc } (t = ms epoch)
let running = false;
let watchId = null;
let wakeLock = null;
let lastFixAt = 0;                // ms epoch of most recent accepted fix
let lastRawAcc = null;            // accuracy of most recent raw fix (accepted or not)
let tick = null;                  // 1 Hz UI refresh (staleness)

// ---- DOM ----
const $ = (id) => document.getElementById(id);
const el = {
  avg: $("avg"), avgSub: $("avg-sub"), inst: $("inst"),
  gpsDot: $("gps-dot"), gpsAcc: $("gps-acc"), fill: $("fill"), stale: $("stale"),
  toggle: $("toggle"), msg: $("msg"),
  settings: $("settings"), openSettings: $("open-settings"), closeSettings: $("close-settings"),
  windowInput: $("window"), windowVal: $("window-val"),
  gateInput: $("gate"), gateVal: $("gate-val"),
  themeSeg: $("theme-seg"),
  themeMeta: $("theme-color-meta"), appVersion: $("app-version"),
};

// ---- Settings persistence ----
function loadSettings() {
  try {
    const s = JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {};
    return {
      windowMin: clamp(s.windowMin ?? DEFAULTS.windowMin, 1, 60),
      accuracyGate: clamp(s.accuracyGate ?? DEFAULTS.accuracyGate, 5, 100),
      theme: ["dark", "red", "light"].includes(s.theme) ? s.theme : DEFAULTS.theme,
    };
  } catch { return { ...DEFAULTS }; }
}
function saveSettings() { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); }
function clamp(n, lo, hi) { return Math.min(hi, Math.max(lo, Number(n))); }

// ---- Geometry ----
function haversine(a, b) {
  const φ1 = a.lat * Math.PI / 180, φ2 = b.lat * Math.PI / 180;
  const dφ = (b.lat - a.lat) * Math.PI / 180;
  const dλ = (b.lon - a.lon) * Math.PI / 180;
  const h = Math.sin(dφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(dλ / 2) ** 2;
  return 2 * EARTH_R * Math.asin(Math.min(1, Math.sqrt(h)));
}

// ---- Core: ingest a fix ----
function onPosition(pos) {
  const c = pos.coords;
  lastRawAcc = c.accuracy;

  // Accuracy gate: discard fixes worse than the threshold. Kills stationary scatter.
  if (c.accuracy != null && c.accuracy > settings.accuracyGate) {
    render(); // still refresh the GPS-quality dot from the rejected fix
    return;
  }

  const t = pos.timestamp || Date.now();
  buffer.push({ t, lat: c.latitude, lon: c.longitude, acc: c.accuracy });
  lastFixAt = t;
  prune();
  render();
}

function onError(err) {
  const map = {
    1: "Location permission denied. Enable it for this site and tap Start.",
    2: "Position unavailable — no GPS fix yet.",
    3: "GPS timed out — still searching.",
  };
  showMsg(map[err.code] || err.message || "Geolocation error.");
}

// Drop fixes older than the window relative to the newest accepted fix.
function prune() {
  if (!buffer.length) return;
  const cutoff = buffer[buffer.length - 1].t - settings.windowMin * 60000;
  let i = 0;
  while (i < buffer.length - 1 && buffer[i].t < cutoff) i++;
  if (i > 0) buffer = buffer.slice(i);
}

// Average SOG over the buffered track, in knots. null if < 2 fixes or zero span.
function averageKn() {
  if (buffer.length < 2) return null;
  const span = (buffer[buffer.length - 1].t - buffer[0].t) / 1000; // s
  if (span <= 0) return null;
  let dist = 0;
  for (let i = 1; i < buffer.length; i++) dist += haversine(buffer[i - 1], buffer[i]);
  return (dist / span) * MS_TO_KN;
}

// Instantaneous SOG from the last two fixes, in knots. null if < 2 fixes.
function instantKn() {
  const n = buffer.length;
  if (n < 2) return null;
  const a = buffer[n - 2], b = buffer[n - 1];
  const dt = (b.t - a.t) / 1000;
  if (dt <= 0) return null;
  return (haversine(a, b) / dt) * MS_TO_KN;
}

// ---- Render ----
function fmt(kn) { return kn == null ? "—" : kn.toFixed(1); }

function render() {
  // Hero average
  el.avg.textContent = fmt(averageKn());
  el.avgSub.textContent = `avg · ${settings.windowMin} min`;

  // Instantaneous (floored to 0.0 below the crawl threshold)
  let inst = instantKn();
  if (inst != null && inst < INST_FLOOR_KN) inst = 0;
  el.inst.textContent = fmt(inst);

  // GPS quality dot + accuracy. Thresholds scale with the gate.
  if (lastRawAcc == null) {
    el.gpsDot.dataset.level = "none";
    el.gpsAcc.textContent = "— m";
  } else {
    el.gpsAcc.textContent = `${Math.round(lastRawAcc)} m`;
    el.gpsDot.dataset.level =
      lastRawAcc <= settings.accuracyGate ? "good" :
      lastRawAcc <= settings.accuracyGate * 2 ? "warn" : "bad";
  }

  // Sample count + window fill
  const span = buffer.length >= 2 ? buffer[buffer.length - 1].t - buffer[0].t : 0;
  const fillPct = Math.min(100, Math.round((span / (settings.windowMin * 60000)) * 100));
  el.fill.textContent = `${buffer.length} fix · ${fillPct}%`;

  updateStale();
}

function updateStale() {
  const stale = running && lastFixAt > 0 && (Date.now() - lastFixAt) > STALE_MS;
  el.stale.hidden = !stale;
  document.body.classList.toggle("is-stale", stale);
}

function showMsg(text) { el.msg.textContent = text || ""; el.msg.hidden = !text; }

// ---- Start / stop ----
async function start() {
  if (!("geolocation" in navigator)) { showMsg("This device has no Geolocation API."); return; }
  buffer = [];
  lastFixAt = 0;
  lastRawAcc = null;
  showMsg("");
  running = true;
  el.toggle.textContent = "Stop";
  el.toggle.classList.add("running");
  watchId = navigator.geolocation.watchPosition(onPosition, onError, {
    enableHighAccuracy: true, maximumAge: 0, timeout: 8000,
  });
  await acquireWakeLock();
  tick = setInterval(updateStale, 1000);
  render();
}

function stop() {
  running = false;
  el.toggle.textContent = "Start";
  el.toggle.classList.remove("running");
  if (watchId != null) { navigator.geolocation.clearWatch(watchId); watchId = null; }
  releaseWakeLock();
  if (tick) { clearInterval(tick); tick = null; }
  el.stale.hidden = true;
  document.body.classList.remove("is-stale");
}

// ---- Screen Wake Lock ----
async function acquireWakeLock() {
  if (!("wakeLock" in navigator)) return;
  try {
    wakeLock = await navigator.wakeLock.request("screen");
    wakeLock.addEventListener("release", () => { wakeLock = null; });
  } catch { /* user may deny; not fatal */ }
}
function releaseWakeLock() {
  if (wakeLock) { wakeLock.release().catch(() => {}); wakeLock = null; }
}
document.addEventListener("visibilitychange", () => {
  if (running && document.visibilityState === "visible" && !wakeLock) acquireWakeLock();
});

// ---- Theme ----
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  // Match the status bar / browser chrome to the new background.
  const bg = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim();
  if (bg) el.themeMeta.setAttribute("content", bg);
  for (const b of el.themeSeg.querySelectorAll(".seg-btn"))
    b.setAttribute("aria-pressed", String(b.dataset.themeVal === theme));
}

// ---- Settings UI ----
function syncSettingsUI() {
  el.windowInput.value = settings.windowMin;
  el.windowVal.textContent = `${settings.windowMin} min`;
  el.gateInput.value = settings.accuracyGate;
  el.gateVal.textContent = `${settings.accuracyGate} m`;
}
function openSettings() { syncSettingsUI(); el.settings.hidden = false; }
function closeSettings() { el.settings.hidden = true; }

// ---- Wire up ----
el.toggle.addEventListener("click", () => (running ? stop() : start()));
el.openSettings.addEventListener("click", openSettings);
el.closeSettings.addEventListener("click", closeSettings);
el.settings.addEventListener("click", (e) => { if (e.target === el.settings) closeSettings(); });

el.windowInput.addEventListener("input", () => {
  settings.windowMin = clamp(el.windowInput.value, 1, 60);
  el.windowVal.textContent = `${settings.windowMin} min`;
  saveSettings();
  prune();            // a shorter window may evict fixes immediately
  render();
});
el.gateInput.addEventListener("input", () => {
  settings.accuracyGate = clamp(el.gateInput.value, 5, 100);
  el.gateVal.textContent = `${settings.accuracyGate} m`;
  saveSettings();
  render();           // re-colour the quality dot; gate applies to future fixes
});
el.themeSeg.addEventListener("click", (e) => {
  const btn = e.target.closest(".seg-btn");
  if (!btn) return;
  settings.theme = btn.dataset.themeVal;
  saveSettings();
  applyTheme(settings.theme);
});

// ---- Init ----
applyTheme(settings.theme);
syncSettingsUI();
el.appVersion.textContent = `v${APP_VERSION}`;
render();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}
