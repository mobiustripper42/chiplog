---
id: DEC-011
title: "Chiplog becomes a native store-published app; the PWA is retired"
topic: "Architecture & stack"
amends:
  - id: DEC-001
    relation: reverses
    scope: "the whole holding — framework, bundler, build step and npm dependencies all arrive with Expo. Only the taste behind it survives: still one screen, still no backend"
  - id: DEC-006
    relation: refines
    scope: "the mechanism only — the font is still bundled rather than fetched, but via `expo-font` and a TTF/OTF, not an `@font-face` woff2 the service worker caches"
  - id: DEC-007
    relation: retires
    scope: "the mechanism entirely — there is no service worker to version. The concern it existed for (a shipped fix actually reaching the device) moves to store release versioning"
---

## DEC-011: Chiplog becomes a native store-published app; the PWA is retired

**Decision:** Chiplog is rebuilt as a native app on Expo / React Native (SDK 57) with TypeScript strict, matching the stack in `../bushel-mobile`, and published to the Apple App Store and Google Play. The PWA is retired: no service worker, no web manifest, no Add-to-Home-Screen, no Tailscale-served static folder. Builds and submissions run through EAS from Linux — no Mac is bought, and none is needed.

**Why — and this is not about chiplog.** `muster` needs to ship as store-installed apps on both platforms, and nobody here has taken an app through either store before. Chiplog goes first as the rehearsal: the point of this project is now the *pipeline* as much as the app.

**Why chiplog and not bushel-mobile is the rehearsal:** Apple requires working demo credentials for App Review on any app with an account. bushel-mobile's login would mean handing an unknown reviewer an admin account into a live farm's order system. Chiplog has nothing to hand over — one screen, GPS, offline, no login, no backend. It is the smallest possible surface on which to learn signing, privacy declarations and review.

**Why not a WebView wrapper around the existing PWA:** Apple's minimum-functionality rule (Review Guideline 4.2) rejects thin web wrappers. This is a real rewrite, not a repackage.

**What ports and what does not.** The averaging logic is pure JavaScript over `{t, lat, lon, acc}` records with no DOM or browser dependency — `haversine`, `averageKn`, `instantKn`, `prune` and their constants (`app.js:11-16`, `:54-119`). It ports to TypeScript essentially verbatim, and extracting it as a module is what finally makes it **testable**, closing the standing gap that the maths has no automated coverage (`.claude/CLAUDE-context.md`, § Workflow Mechanisms). Everything around it is browser-shaped and is replaced, not migrated: `watchPosition` → `expo-location`, Wake Lock API → `expo-keep-awake`, `localStorage` → async storage, CSS themes → RN styles, `sw.js` + `manifest.webmanifest` → deleted.

**Tradeoff:** every cost DEC-001 bought its way out of now arrives at once — a dependency tree to keep patched, a build step to debug, a bundler, and a release process with two external gatekeepers who can say no. Shipping a fix stops being "bump a string, re-open on the tailnet" and becomes a store review. The instrument gets slower to change, in exchange for being installable by anyone and for teaching us the pipeline muster needs.

**What DEC-001's own revisit condition did *not* catch.** DEC-001 said to revisit "if scope expands past a single screen, or client state outgrows a handful of module-level variables." Neither happened — it is still one screen with a handful of variables. What killed it was a **distribution** requirement from outside the app entirely. Worth noting because it is the failure mode of a well-written revisit condition: it watches the axis you were thinking about.

**Unchanged, deliberately:** DEC-004 (accuracy gate before the buffer), DEC-005 (denominator is the data span) and DEC-009 (straight-line bridging across gaps) are statements about the maths and survive the rewrite untouched. They are the asset. DEC-009 does acquire a new *cost* on the other side, though: closing backgrounding gaps properly would mean background location, which on Google Play carries a separate permission declaration and video review. That is now a store-review decision, not only a maths one.

**Left open, not decided here** — each needs its own decision when it is actually settled:
- Bundle identifier / Android `applicationId`. Permanent once published on either store.
- Foreground-only location vs. background location.
- Where a publicly-reachable privacy policy is hosted (the tailnet is not publicly reachable, and Play requires a public URL for a location-permission app).
- Whether `.claude/project-type` stays `tool` now that the project carries lint, typecheck and a test runner.

**Revisit if:** the store pipeline turns out to be cheap and repeatable enough that muster can adopt it directly, at which point chiplog's job as a rehearsal is done and the only question left is whether the app is worth maintaining on its own merits.
