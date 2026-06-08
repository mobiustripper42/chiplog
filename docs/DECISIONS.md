# Chiplog — Architectural Decisions

Decisions are numbered DEC-NNN. "DEC-TBD" means flagged but unresolved — consult @architect before building.

The `DEC-S###` IDs referenced elsewhere are **seeds** workflow decisions (the template's own history), not Chiplog's. Chiplog's product decisions start at DEC-001 below.

---

## DEC-001: Vanilla static PWA, no framework, no build step
**Decision:** Plain `index.html` + `styles.css` + `app.js` + `sw.js` + `manifest.webmanifest`. No React, no Vite, no bundler, no npm runtime dependencies.
**Why:** It's one screen. The SPEC's own recommendation: "Recommend vanilla — it's one screen." A framework here is ceremony — build tooling, a dependency tree to keep patched, and a transpile step to debug, all to render a single number. Vanilla also makes the offline story trivial: the files the service worker caches *are* the app, with nothing generated.
**Tradeoff:** No component library, no lint/CI-out-of-the-box, no TypeScript types. We give up the seeds "webapp" ergonomics. State lives as module-level variables in `app.js` instead of in a framework's store.
**The fallback we declined:** SPEC offers Vite + React + TS "to keep it in the seeds family." Rejected — the cost (toolchain, deps) buys nothing for a one-screen readout. Revisit only if the app grows a second screen or real view state.
**Revisit if:** scope expands past a single screen, or client state outgrows a handful of module-level variables.

## DEC-002: project-type = `tool`, not `webapp`
**Decision:** `.claude/project-type` is `tool`.
**Why:** The seeds `webapp` type means the Next.js / React / shadcn / Supabase / Vercel shape (`.claude/type-manifest.yaml`). Chiplog is none of those — it's vanilla static files on a Node-stdlib/shell footing, which is what `tool` describes. Setting `webapp` would make `@sync-config` push Next/Supabase templates at a project that can't use them.
**Tradeoff:** `agents/ui-reviewer.md` is `webapp`-gated in the manifest, so the nightly sync will mark it `Type-gated`. We keep it anyway (DEC-003) — Chiplog has a real UI worth reviewing — and accept the one-line Type-gated skip in sync PRs.
**Revisit if:** a `static-pwa` (or similar) project type gets added to the seeds manifest.

## DEC-003: Keep @ui-reviewer despite the type gate
**Decision:** Retain `.claude/agents/ui-reviewer.md` and drive it with a project-specific `.claude/ui-context.md`.
**Why:** Chiplog is UI-forward — a high-contrast hero number, three themes, night-helm legibility. The SPEC has a whole UI section. UI review earns its keep here even though the agent template was written for shadcn projects.
**Tradeoff:** The agent body still references Playwright + shadcn (inert for us). `ui-context.md` carries the real design system and overrides those assumptions; screenshots are manual (open `index.html`), not Playwright-driven.

## DEC-004: Accuracy gate before the buffer, not after
**Decision:** A fix is discarded the moment `coords.accuracy` exceeds the threshold (default 25 m, range 5–100). Only accepted fixes enter the rolling buffer; the average never sees a rejected fix.
**Why:** Stationary GPS scatter is the dominant error source at the helm — a moored boat "drifts" tens of metres per minute in raw fixes. Gating at ingest keeps that noise out of both the distance sum and the time span. The raw fix's accuracy still drives the GPS-quality dot so the helm can see when reception is poor.
**Tradeoff:** In bad reception every fix may be rejected and the readout holds / goes STALE rather than showing garbage. That's the correct failure mode for an "honest number" app, but it's why the gate is user-adjustable.

## DEC-005: Denominator is the data span, not the window length
**Decision:** Divide total distance by (newest − oldest accepted fix), not by the configured window.
**Why:** With only 6 minutes of fixes in a 15-minute window — just started, or a GPS gap — dividing by 15 min under-reports the true average over the track you actually logged. Dividing by the real span gives the correct average over the data you have.
**Tradeoff:** Early in a session the average is computed over a short span and is noisier until the buffer fills. The status row shows window-fill % so the helm knows how much data backs the number. This is SPEC's explicit veto point; we took the read-correct path over the read-low path.

## DEC-006: Bundle DM Sans; don't fetch it at runtime
**Decision:** Self-host the DM Sans variable woff2 in `fonts/` and `@font-face` it locally; the service worker caches it with the shell.
**Why:** SPEC requires the app to run with no network at runtime. A Google Fonts `<link>` would break offline launch and leak a request on every cold start. One ~37 KB variable woff2 covers every weight we use.
**Tradeoff:** The font is checked into the repo and must be refreshed by hand if we ever change typeface. Worth it for a genuinely offline app.

## DEC-007: Cache-version string is the update mechanism
**Decision:** `sw.js` `CACHE_VERSION` is bumped on every shell change; `activate` deletes non-matching caches. `APP_VERSION` (app.js) and `package.json` version move in lockstep.
**Why:** No build hash to rely on. A monotonic version string in the service worker is the entire cache-busting story (SPEC § Updates): bump it, re-open the app once on the tailnet, the new shell is pulled.
**Tradeoff:** Forgetting to bump it means clients keep the old shell. The versioning section in `CLAUDE.md` calls out all three places to change, and `/retro` owns the bump.

---

## DEC-TBD: Pause/resume of the rolling buffer across app backgrounding
**Question:** When the app is backgrounded (screen off despite wake lock, or OS suspends the tab) and resumes, fixes stop arriving. On resume the buffer has a time gap. Current behavior: the gap is bridged by a single long haversine segment, which is correct for *average* distance/time but assumes a straight line across the gap.
**Options:** (A) accept it — average over a gap is still honest distance/time; (B) split the buffer on gaps longer than N seconds and only average the most recent contiguous run.
**Consult @architect before building.** Not a V1 blocker — note and move on.
