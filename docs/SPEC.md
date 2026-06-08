# Chiplog — SPEC.md

A phone-based GPS speedometer that shows **speed over ground (SOG) in knots, averaged over a rolling window** (default 15 min, configurable). Single-screen PWA, offline, no backend, no accounts.

*The chip log — a knotted line streamed astern to measure a vessel's speed — is where the **knot** as a unit comes from. Fitting name for a knots readout.*

---

## Purpose

You're at the helm with a Pixel. You want a big, honest average SOG so you can judge real progress without watching the instantaneous number bounce around. That's the whole app.

---

## Core behavior

- Continuously read position via the Geolocation API (`watchPosition`, high accuracy).
- Keep a rolling buffer of accepted fixes `{t, lat, lon, accuracy}`, pruned to the configured window.
- **Average SOG = total great-circle distance between consecutive accepted fixes in the window ÷ elapsed time between the oldest and newest accepted fix in the window.** Convert m/s → knots (× 1.94384).
- Recompute on every fix. Display the average prominently; show instantaneous SOG small.
- Keep the screen awake while running.

### Why distance-over-time, not mean-of-samples
Averaging instantaneous speeds over-weights noisy fixes and gaps. Total-distance/total-elapsed is the true average speed over the track you actually logged.

### Why denominator = data span, not fixed window length
If you only have 6 min of fixes in a 15-min window (just started, or a GPS gap), dividing by 15 min under-reports. Dividing by the actual span (oldest→newest accepted fix) gives the correct average over the data you have. **Veto point if you'd rather it read low until the buffer fills.**

### Jitter handling (captain-grade, not toy)
- **Accuracy gate:** discard any fix with `coords.accuracy` worse than the threshold (default 25 m). This kills most stationary scatter.
- Ignore the device's `coords.speed` field — it's frequently null/unreliable. Compute speed ourselves from position deltas.
- Instantaneous readout below ~0.3 kn is shown as `0.0` to avoid phantom crawl at anchor.

---

## Settings (persisted in localStorage)

| Setting | Default | Range |
|---|---|---|
| Averaging window | 15 min | 1–60 min |
| Accuracy gate | 25 m | 5–100 m |
| Theme | Dark | Dark / Red night / Light |

---

## UI

- **Hero number:** average SOG, one decimal, big and high-contrast, with `kn` and a `avg · 15 min` subtitle that reflects the current window.
- **Secondary:** instantaneous SOG, small.
- **Status row:** GPS fix quality (current accuracy in m, or a green/amber/red dot), sample count / window fill, and a **STALE** warning if the last fix is older than ~5 s.
- **Controls:** start/stop, settings (gear), nothing else on the main screen.
- Dark-first for night helm use; red night mode toggle for dark adaptation.
- Type/color follows house style: DM Sans, mono/gray palette, single accent. No serif, no earthy tones.

---

## Tech

- **Single static PWA:** `index.html` + `manifest.webmanifest` + `sw.js` + icons. Vanilla JS. No build step required.
- Service worker caches the shell so it loads with no signal once installed. App needs **no network at runtime** — only GPS.
- Must be served over **HTTPS** (Geolocation + PWA install require it). See Deployment.
- `navigator.geolocation.watchPosition` with `{ enableHighAccuracy: true, maximumAge: 0, timeout: 8000 }`.
- **Screen Wake Lock API** to hold the screen on; re-acquire on `visibilitychange`.
- Great-circle distance via haversine (R = 6,371,000 m).
- Installable to the Pixel home screen; full-screen `display: standalone`.

**Fallback:** if you'd rather keep it in the seeds family with components/lint/CI, Vite + React + TS. Same logic, more ceremony. Recommend vanilla — it's one screen.

---

## Deployment

Host the static folder on **mill-dev**, served over HTTPS via **Tailscale**. No Vercel/Netlify, no public exposure. Install once; runs offline forever after.

The non-negotiable is HTTPS — geolocation, wake lock, and service workers all require a secure context. Plain `http://<tailnet-ip>` and `file://` both fail for exactly this reason. Tailscale's cert/MagicDNS provides the secure context.

**One-time setup:**

1. Tailnet admin console → enable **MagicDNS** and **HTTPS certificates**.
2. On mill-dev, serve the folder on a local port: `python -m http.server 8080` (or Caddy / `npx serve` for something tidier).
3. Front it with TLS: `tailscale serve --bg 8080` → publishes at `https://mill-dev.<tailnet>.ts.net` with a real Let's Encrypt cert. (`tailscale serve --help` — flag syntax has shifted across versions.)
4. Pixel on the tailnet → open that URL → **Add to Home Screen**.

Use `serve` (tailnet-only), **not** `funnel` (public internet — wrong for a personal tool).

**Runtime:** after install, the service worker caches the shell, so the app launches from the home-screen icon and reads GPS **fully offline, off-tailnet, anywhere on the water**. mill-dev only needs to be reachable for the initial install and for pushing updates — which, sitting on your desk, it always is.

**Updates:** bump a version string in the service worker so the cache invalidates; re-open the app on the tailnet once to pull the new shell.

---

## Out of scope (v1) — naming these so they don't sneak in

- **Speed through water (STW)** from boat instruments. A phone only knows SOG. STW means NMEA 2000 / SignalK ingestion — a different, much larger project. Not now.
- Course over ground, heading, max speed, trip distance, track recording/export.
- Multi-window comparison, charts, history.
- Any backend, sync, or accounts.

These are the obvious shiny v1.1+ adds. Hold the line on v1 = "one honest average number."

---

## Open question

You said "boat speed" — confirmed assumption is **GPS speed over ground from the phone**, since that's all a handset can measure. Spec is built on that. If you ever want true water speed, that's the STW/NMEA path above and a separate build.
