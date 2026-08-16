# Chiplog — Architectural Decisions

This index is **generated** — run `npm run gen:decisions` after editing any decision. The decisions themselves live one per file in `docs/decisions/`; edit those.

Chiplog's own decisions are numbered `DEC-001` upward. The `DEC-S###` ids cited in workflow docs and skills are **seeds** decisions — the template library's own history, not chiplog's — and they deliberately do not resolve here.

An unresolved decision is recorded as a normal decision file whose body says it is open, rather than as a placeholder id. That keeps every id in this record pointing at a file that exists.

---

## Index

### Measurement & maths
- DEC-004 — Accuracy gate before the buffer, not after
- DEC-005 — Denominator is the data span, not the window length
- DEC-009 — Straight-line bridging across backgrounding gaps (V1)

### Architecture & stack
- DEC-001 — Vanilla static PWA, no framework, no build step _(reversed by DEC-011 — the whole holding — framework, bundler, build step and npm dependencies all arrive with Expo. Only the taste behind it survives: still one screen, still no backend)_
- DEC-011 — Chiplog becomes a native store-published app; the PWA is retired

### Offline, PWA & updates
- DEC-006 — Bundle DM Sans; don't fetch it at runtime _(revised by DEC-011 — the mechanism, not the principle — the font is still bundled rather than fetched, but delivered by `expo-font` instead of an `@font-face` woff2 the service worker caches. Whether the single-variable-file leg survives is unconfirmed)_
- DEC-007 — Cache-version string is the update mechanism _(retired by DEC-011 — the service-worker leg only — there is no `CACHE_VERSION` and no cache to bust. The version-lockstep leg is not retired but unsettled, and is parked as an open question in DEC-011)_

### Workflow & tooling
- DEC-002 — project-type = `tool`, not `webapp` _(refined by DEC-010 — the rationale only — `project-type` is still `tool`; nothing pushes templates at this repo any more, so the type gate is documentation rather than a filter)_
- DEC-003 — Keep @ui-reviewer despite the type gate _(refined by DEC-010 — the rationale only — `@ui-reviewer` still stays; there is no type gate left for it to be kept 'despite')_
- DEC-008 — De-webapp the project's agents _(refined by DEC-010 — the tradeoff and the closing paragraph — the de-webapp'd agents stand, but no sync will ever see them, and the `/pull-seeds` clean-diff contract no longer exists)_
- DEC-010 — The sync machinery three of these decisions argue from is gone — the holdings stand, the reasons changed

_**This file is GENERATED** by `npm run gen:decisions` —
edit `docs/decisions/DEC-*.md`, not this file. `npm run check:decisions` fails on a stale index, a
duplicate id, an unknown topic, an unknown relation, a forward-pointing amendment, or a
reference to a decision that does not exist._
