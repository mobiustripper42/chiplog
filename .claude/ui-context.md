# Chiplog — UI Context (read by @ui-reviewer)

This is a **vanilla static PWA** — no shadcn, no React, no Playwright harness. Ignore the shadcn/Playwright assumptions in the `@ui-reviewer` template body; this file is authoritative.

**How to screenshot:** there's no test runner. Open `index.html` in a browser (or serve the folder) and capture the single screen in each theme + at a phone width (~412px, Pixel) and a desktop width. Geolocation won't fire in a plain browser without a secure context — review layout/typography/contrast against source + a mocked number if needed.

## Brand tokens (from `styles.css`)

Semantic CSS variables, overridden per `[data-theme]`:

| Token | Dark | Red night | Light |
|-------|------|-----------|-------|
| `--bg` | `#0b0d0e` | `#000000` | `#f6f7f8` |
| `--surface` | `#15181a` | `#0c0303` | `#ffffff` |
| `--text` | `#f2f4f5` | `#ff5a4d` | `#0b0d0e` |
| `--muted` | `#8b9398` | `#a8362e` | `#5b6166` |
| `--accent` | `#4ea3ff` | `#ff5a4d` | `#1f6fe0` |
| `--dot-good/warn/bad` | green/amber/red | red luminance ramp | green/amber/red |

- **Font:** DM Sans variable, self-hosted (`fonts/dm-sans-var.woff2`). The only typeface.
- **Numerals:** `tabular-nums` everywhere a number appears.

## Surfaces & layout

- Single screen, `grid-template-rows: auto 1fr auto auto` — status row, hero (fills), secondary, controls.
- Settings is a bottom sheet (`.sheet-backdrop` / `.sheet`), not a route.
- Safe-area insets honored (`env(safe-area-inset-*)`) for notch/home-indicator.
- Max width 640px, centered (tablet/desktop don't stretch the readout absurdly).

## Typography scale

- Hero number: `clamp(5.5rem, 42vw, 13rem)`, weight 600, accent, tabular.
- Hero unit (`kn`) + subtitle: muted, much smaller.
- Secondary (instant): `1.5rem`.
- Status row + labels: `11–13px`, muted/faint, uppercase tracking on micro-labels.

## What to Check (Chiplog checklist)

1. **Hero dominance** — the average SOG is unmistakably the largest, highest-contrast element. Nothing competes with it.
2. **Contrast** — hero and secondary numbers meet WCAG AA against `--bg` in all three themes. Red-night must stay legible without any green/blue.
3. **Red-night purity** — no green or blue pixels in red mode (check GPS dots, running button, slider thumbs, segmented control).
4. **Tabular numerals** — the readout doesn't shift horizontally as digits change (1.0 → 11.0 → 0.0).
5. **STALE / thin-data honesty** — STALE badge and window-fill % are visible but not alarming; the dimmed-readout state reads as "hold" not "broken."
6. **Touch targets** — Start/Stop and gear are ≥ 56px; slider thumbs ≥ 26px. Usable with wet/cold hands.
7. **Safe area** — nothing clipped by notch or home indicator in standalone mode (portrait).
8. **One accent** — accent appears only on the hero number, running-state button, and good-dot. Flag stray accent use.
9. **Theme switch** — `meta[theme-color]` updates with the theme (status bar matches background in standalone).

Use the standard `@ui-reviewer` output format and scoring. "Clean Bill of Health" if nothing's wrong — don't manufacture findings.
