# Chiplog

A phone-based GPS speedometer: **speed over ground (SOG) in knots, averaged over a rolling window** (default 15 min). Single-screen PWA, offline after install, no backend, no accounts. Built for the helm — a big, honest average instead of a bouncing instantaneous number.

*The chip log — a knotted line streamed astern to measure a vessel's speed — is where the **knot** comes from.*

## What it does

- Reads position via `watchPosition` (high accuracy) and keeps a rolling buffer of accepted fixes.
- **Average SOG = total great-circle distance between consecutive accepted fixes ÷ elapsed time between the oldest and newest accepted fix.** Distance-over-time, not mean-of-samples. The denominator is the actual data span, so a half-full window reads correct, not low.
- Discards fixes worse than an accuracy gate (default 25 m) to kill stationary scatter.
- Shows instantaneous SOG small; floors it to `0.0` below ~0.3 kn (no phantom crawl at anchor).
- Status row: GPS accuracy + quality dot, sample count / window fill, and a STALE badge if the last fix is older than ~5 s.
- Keeps the screen awake; re-acquires the wake lock on resume.
- Three themes — dark (default), red night, light — persisted with the window and gate in `localStorage`.

See `docs/SPEC.md` for the full behavior and the explicit Not-V1 list.

## Run it locally

No build step. Any static server over a **secure context** works (Geolocation, Wake Lock, and Service Workers all require HTTPS or `localhost`):

```sh
python3 -m http.server 8080      # then open http://localhost:8080
```

`localhost` counts as secure, so geolocation works there for desktop testing. On a phone you need real HTTPS — see Deployment.

**Build check (no bundler):**

```sh
node --check app.js sw.js
python3 -c "import json; json.load(open('manifest.webmanifest'))"
```

**Regenerate icons** (pure stdlib, no dependencies):

```sh
python3 scripts/make-icons.py
```

## Deployment (mill-dev + Tailscale)

Host the static folder on **mill-dev**, served over HTTPS via **Tailscale** (tailnet-only). The non-negotiable is HTTPS — `http://<tailnet-ip>` and `file://` both fail the secure-context requirement.

1. Tailnet admin console → enable **MagicDNS** and **HTTPS certificates**.
2. On mill-dev, serve the folder: `python3 -m http.server 8080` (or Caddy / `npx serve`).
3. Front it with TLS: `tailscale serve --bg 8080` → publishes at `https://mill-dev.<tailnet>.ts.net` with a real Let's Encrypt cert. (`tailscale serve --help` — flag syntax shifts across versions.)
4. Pixel on the tailnet → open that URL → **Add to Home Screen**.

Use `tailscale serve` (tailnet-only), **not** `funnel` (public internet — wrong for a personal tool).

**Runtime:** after install, the service worker caches the shell, so the app launches from the home-screen icon and reads GPS **fully offline, off-tailnet, anywhere on the water**. mill-dev only needs to be reachable for the initial install and for pushing updates.

**Updates:** bump `CACHE_VERSION` in `sw.js` (and `APP_VERSION` in `app.js` + the `package.json` version — all three move together) so the cache invalidates; re-open the app on the tailnet once to pull the new shell.

## Project layout

```
index.html  styles.css  app.js  sw.js  manifest.webmanifest
fonts/dm-sans-var.woff2          bundled variable font (offline)
icons/                           PWA icons (generated)
scripts/make-icons.py            icon generator (stdlib PNG)
docs/                            SPEC, DECISIONS, BRAND, PLAN, stories, workflow
.claude/                         agents, skills, settings, design system
```

Stack and conventions live in `CLAUDE.md`; architectural choices in `docs/DECISIONS.md`.
