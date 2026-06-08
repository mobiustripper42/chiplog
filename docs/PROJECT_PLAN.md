# Chiplog — Project Plan

**Start date:** 2026-06-08
**V1 target:** TBD (work-defined phases, not time-boxed)
**Critical path:** an honest rolling-average SOG on the Pixel, installed as a PWA, readable at night, fully offline after install.

---

## Estimation Method

Fibonacci scale (2, 3, 5, 8, 13). See `VELOCITY_AND_POKER_GUIDE.md`. No 1s (just do it), no 13s if avoidable (break them down). Tests/proofs are baked into each estimate — for this project a "test" is a Node math check or an on-device observation, not Playwright.

**Velocity baseline:** not yet established. Update after the first few sessions at `/retro`.

---

## Phase 0: Scaffold + working V1 (bootstrap)

Done in the initial bootstrap commit (this is the seeds-template install + a first end-to-end build). Listed so the velocity table has a Phase 0 row.

| # | Task | Effort | Notes |
|---|------|--------|-------|
| 0.1 | Seeds workflow install — CLAUDE.md, docs, agents, skills, `.claude/*` | 3 | project-type `tool`, seeds-version 4 |
| 0.2 | App shell — `index.html` + `styles.css`, three themes, settings sheet | 5 | DM Sans bundled, safe-area, tabular numerals |
| 0.3 | Core algorithm — accuracy gate → rolling buffer → haversine → avg SOG | 5 | distance/span; instant floor; Node math check |
| 0.4 | PWA plumbing — `manifest.webmanifest`, `sw.js` cache-first shell | 3 | CACHE_VERSION update story |
| 0.5 | Icons — pure-stdlib PNG generator + generated icons | 2 | `scripts/make-icons.py`, maskable variant |
| 0.6 | Wake lock + visibilitychange re-acquire | 2 | |

**Phase 0 total: 20 pts** (bootstrap — counted at first `/retro`)

**Demo:** serve the folder over HTTPS on the tailnet → install on the Pixel → Start → watch the average settle while moving.

---

## Phase 1: On-water hardening

Make the readout trustworthy in the field. Everything here needs **on-device observation**, not just a math check.

| # | Task | Effort | Notes |
|---|------|--------|-------|
| 1.1 | On-water field test — verify avg vs. a known reference (chartplotter / second phone) | 3 | acceptance: within ~0.2 kn at steady speed |
| 1.2 | Gap/backgrounding behavior — decide DEC-TBD (buffer split vs. straight-line) | 5 | @architect first |
| 1.3 | STALE + reacquisition UX — confirm dimming/hold reads right when GPS drops | 3 | |
| 1.4 | Accuracy-gate tuning pass — sane default + range validated against real scatter | 2 | |
| 1.5 | Install/offline verification — cold launch off-tailnet, airplane mode | 2 | the whole point; observe, don't assume |

**Phase 1 total: 15 pts**

**Ejection point:** the number is trusted at the helm and the app launches offline, anywhere.

---

## Phase 2: Polish

Cosmetic + ergonomic refinement only. Nothing here changes the number.

| # | Task | Effort | Notes |
|---|------|--------|-------|
| 2.1 | Theme transition + status-bar color polish | 2 | |
| 2.2 | Settings-sheet micro-interactions, slider feel | 2 | |
| 2.3 | Icon/typography review with @ui-reviewer at phase boundary | 2 | |

**Phase 2 total: 6 pts**

---

## Velocity Table

Updated at each `/retro`.

| Phase | Active Hours | Effort Points | Hrs/Pt | Notes |
|-------|-------------|---------------|--------|-------|
| 0 | — | 20 | — | bootstrap |
| 1 | — | — | — | |

**Lifetime velocity:** — hrs/pt

---

## Estimation Poker — Standing Disagreements

| Task | Claude says | You say | Question |
|------|------------|---------|----------|
| 1.2 | 5 | — | gap handling could be a 3 if we just accept straight-line bridging |

---

## Phase Boundary Checklist

1. `node --check app.js sw.js` clean; `manifest.webmanifest` valid JSON.
2. Math check still produces a known-track → known-knots result.
3. On-device smoke: Start, move, confirm the average behaves.
4. @ui-reviewer pass if UI changed.
5. `/retro` — velocity, version bumps, retro notes.

---

## Cuttable Tasks (if behind)

| Task | Why it's cuttable | Defer to |
|------|------------------|---------|
| 2.x (all of Phase 2) | Pure polish; the instrument works without it | V1.1 |
| 1.2 | Straight-line gap bridging is already "honest enough" | V1.1 |
