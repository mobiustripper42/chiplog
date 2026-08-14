# Chiplog — Dev Reference

Reference material, not standing rules. The always-loaded `CLAUDE.md` shell points here so this stuff isn't in context every session.

**The shell's `### Deploy + review reference` describes a webapp: `<VersionTag />`, the `NEXT_PUBLIC_` gotcha, Vercel. None of it applies here** — chiplog is a static PWA with no build step, no framework and no Vercel (DEC-001). What follows is the chiplog-shaped equivalent of each part.

## Version surface — a three-way lockstep

There is no `<VersionTag />`. The version appears in the **settings-sheet footer**, read from `APP_VERSION` in `app.js`.

Three files carry the same number and **all three move together**:

| File | Constant | Why it matters |
|---|---|---|
| `package.json` | `version` | What `/retro` and `/bump-major` bump |
| `app.js` | `APP_VERSION` | What the settings-sheet footer displays |
| `sw.js` | `CACHE_VERSION` | **Load-bearing** — the service worker cache name |

**`CACHE_VERSION` is the update mechanism** (DEC-007). If it doesn't change, the service worker serves the previous shell from cache and the new build never reaches the phone. A version bump that misses `sw.js` looks like a successful deploy and ships nothing.

The webapp equivalent of this trap is the `NEXT_PUBLIC_` gotcha that renders `v0.0.0`. Chiplog's version is worse-behaved: a stale `CACHE_VERSION` shows the *old* version number correctly, because the old app is genuinely what's running.

**Checking it landed:** open the settings sheet on the device and read the footer. If it shows the previous version, the SW hasn't updated — hard-reload, or unregister it in DevTools → Application.

## CHANGELOG format

Same as the fleet. One `##` heading per version, newest first, `### Added` / `### Changed` / `### Fixed` beneath. `/retro` writes the minor-bump entry at phase close; `/bump-major` writes its own.

## Deploy

There is no `production` branch and no host to promote to — `/promote-production` gates on `origin/production` and correctly no-ops here.

Deployment is a static folder on **mill-dev**, served over **HTTPS via Tailscale** (`tailscale serve`, tailnet-only — never `funnel`). See `README.md` § Deployment for the commands.

**HTTPS is not optional.** Geolocation, Wake Lock and Service Workers all require a secure context. `localhost` qualifies; a bare LAN IP does not, and the failure is a silent absence of GPS fixes rather than an error message.

## Reviewing a PR from a phone

The GitHub mobile web UI collapses large diffs and hides whitespace changes by default. For chiplog specifically:

- **`sw.js` diffs are the ones to read carefully** — a cache-name change is one line and decides whether anyone gets the update.
- **A diff touching `app.js`'s averaging maths cannot be reviewed from a phone.** It needs the hand-computed check in `.claude/CLAUDE-context.md` § Workflow Mechanisms, at a keyboard.
- Everything else — docs, styles, icons — reviews fine on a phone.
