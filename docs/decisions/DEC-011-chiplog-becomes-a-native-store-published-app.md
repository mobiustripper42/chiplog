---
id: DEC-011
title: "Chiplog becomes a native store-published app; the PWA is retired"
topic: "Architecture & stack"
amends:
  - id: DEC-001
    relation: reverses
    scope: "the whole holding — framework, bundler, build step and npm dependencies all arrive with Expo. Only the taste behind it survives: still one screen, still no backend"
  - id: DEC-006
    relation: revises
    scope: "the mechanism, not the principle — the font is still bundled rather than fetched, but delivered by `expo-font` instead of an `@font-face` woff2 the service worker caches. Whether the single-variable-file leg survives is unconfirmed"
  - id: DEC-007
    relation: retires
    scope: "the service-worker leg only — there is no `CACHE_VERSION` and no cache to bust. The version-lockstep leg is not retired but unsettled, and is parked as an open question in DEC-011"
---

## DEC-011: Chiplog becomes a native store-published app; the PWA is retired

**Decision:** Chiplog is rebuilt as a native app on Expo / React Native (SDK 57) with TypeScript strict, matching the stack in `../bushel-mobile`, and published to the Apple App Store and Google Play. The PWA is retired: no service worker, no web manifest, no Add-to-Home-Screen, no Tailscale-served static folder. Builds and submissions run through EAS from Linux — no Mac is bought, and none is needed.

**Why — and this is not about chiplog.** `muster` needs to ship as store-installed apps on both platforms, and nobody here has taken an app through either store before. Chiplog goes first as the rehearsal: the point of this project is now the *pipeline* as much as the app.

**Why chiplog and not bushel-mobile is the rehearsal:** Apple requires working demo credentials for App Review on any app with an account. bushel-mobile's login would mean handing an unknown reviewer an admin account into a live farm's order system. Chiplog has nothing to hand over — one screen, GPS, offline, no login, no backend. It is the smallest possible surface on which to learn signing, privacy declarations and review.

**Why not a WebView wrapper around the existing PWA:** Apple's minimum-functionality rule (Review Guideline 4.2) rejects thin web wrappers. This is a real rewrite, not a repackage.

**What ports and what does not.** Four functions and two constants, and that is the whole of it: `haversine` (`app.js:57-63`), `prune` (`:93-99`), `averageKn` (`:102-109`), `instantKn` (`:112-119`), with `EARTH_R` and `MS_TO_KN` (`:12-13`). They operate on `{t, lat, lon, acc}` records and touch no DOM. Note what is *not* in that list even though it sits among them: `onPosition` and `onError` (`:66-90`) call `render()` and `showMsg()`, and `INST_FLOOR_KN` / `STALE_MS` / `DEFAULTS` are consumed only by the display layer. Those go with the shell.

The port is close to verbatim but not literally so — `averageKn`, `instantKn` and `prune` take no arguments and close over the module-level `buffer` and `settings` (`:20-21`). Turning those reads into parameters *is* the extraction, and it is what finally makes the maths **testable**, closing the standing gap that it has no automated coverage (`.claude/CLAUDE-context.md`, § Workflow Mechanisms). Everything around it is browser-shaped and is replaced, not migrated: `watchPosition` → `expo-location`, Wake Lock API → `expo-keep-awake`, `localStorage` → async storage, CSS themes → RN styles, `sw.js` + `manifest.webmanifest` → deleted.

**Tradeoff:** every cost DEC-001 bought its way out of now arrives at once — a dependency tree to keep patched, a build step to debug, a bundler, and a release process with two external gatekeepers who can say no. Shipping a fix stops being "bump a string, re-open on the tailnet" and becomes a store review. The instrument gets slower to change, in exchange for being installable by anyone and for teaching us the pipeline muster needs.

**And it costs money on a schedule, which the PWA did not.** The Apple Developer Program is $99/yr and recurs whether or not anything ships; Google Play is $25 one-time. A used iPhone is required to run the iOS build at all, since there is no Mac and therefore no Simulator. Stated here because the previous architecture's running cost was zero and this one's is not.

**What DEC-001's own revisit condition did *not* catch.** DEC-001 said to revisit "if scope expands past a single screen, or client state outgrows a handful of module-level variables." Neither happened — it is still one screen with a handful of variables. What killed it was a **distribution** requirement from outside the app entirely. Worth noting because it is the failure mode of a well-written revisit condition: it watches the axis you were thinking about.

**Unchanged, deliberately:** DEC-004 (accuracy gate before the buffer), DEC-005 (denominator is the data span) and DEC-009 (straight-line bridging across gaps) are statements about the maths and survive the rewrite untouched. They are the asset. DEC-009 does acquire a new *cost* on the other side, though: closing backgrounding gaps properly would mean background location, which on Google Play carries a separate permission declaration and video review. That is now a store-review decision, not only a maths one.

**Left open, not decided here** — each needs its own decision when it is actually settled:
- Bundle identifier / Android `applicationId`. Permanent once published on either store.
- Foreground-only location vs. background location.
- Where a publicly-reachable privacy policy is hosted (the tailnet is not publicly reachable, and Play requires a public URL for a location-permission app).
- Whether `.claude/project-type` stays `tool` now that the project carries lint, typecheck and a test runner.
- **What replaces DEC-007's version lockstep.** That decision held two things; only the service-worker half is retired here. An Expo build carries `package.json` version, `app.json` version, and separately iOS `buildNumber` and Android `versionCode` — the last two monotonic and permanent-once-published, the same one-way class as the bundle identifier above. `APP_VERSION` is currently on-screen (`app.js:9`) and `/retro` bumps `package.json`; neither has a stated successor.

**Also true, and not fixed here:** `docs/SPEC.md` § Tech and § Deployment now describe an architecture that no longer exists — single static PWA, service worker, Tailscale-served folder — and a reader landing there directly gets no signal. The declare-once `amends_spec` mechanism cannot reach it: `scripts/check-decisions.mjs:125` requires a *numbered* SPEC section and chiplog's SPEC has none. It needs a direct edit, as part of the implementation work rather than this record.

**Revisit if:** the App Store rejects chiplog under Guideline 4.2 despite a genuine native build, or the Play testing-and-verification burden proves heavier than muster can carry — either would mean the rehearsal has returned its answer early, and the answer is that this route is not the one. Nothing short of that reverts the app to a PWA; the distribution requirement that drove this does not go away.
