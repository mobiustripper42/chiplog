# Chiplog — Brand Direction

## Name
Chiplog — after the chip log, the knotted line streamed astern that gave the **knot** its name.

## Tagline
"One honest average number." (Internal north star, not a marketing line.)

## Philosophy
An honest instrument, not an app. The helm trusts it the way they'd trust a bulkhead gauge: it shows the real average speed over the track actually logged, and it doesn't flatter, gamify, or chatter. Every pixel is in service of one number being legible at arm's length, at night, on a moving boat.

In practice this means:
- The average SOG is the largest thing on the screen by a wide margin. Everything else is support.
- No celebration, no streaks, no "great job." It's a gauge.
- When the data is thin or stale, the app says so plainly (window-fill %, STALE badge) rather than faking confidence.

## Voice
Plain, terse, nautical-literate without kitsch. Labels are lowercase and short: `now`, `avg · 15 min`, `STALE`. Error messages state the problem and the fix in one sentence ("Location permission denied. Enable it for this site and tap Start."). Never cute, never apologetic.

What it should NOT sound like: a consumer fitness app, a chatbot, anything that says "Oops!" or "Let's get started!"

## Visual Direction
- **Style:** monochrome instrument. Grayscale surfaces, a single accent used only for the hero number, the running-state button, and the "good" GPS dot.
- **Default mode:** Dark. Night helm is the primary context.
- **Themes:** Dark / Red night / Light, switched via `[data-theme]` + CSS custom properties. Red night is a true dark-adaptation mode — every token becomes a shade of red on black, with **no** green or blue anywhere (GPS dots encode quality by luminance in red mode).
- **Font:** DM Sans (variable, self-hosted). Body + heading + numerals. No second typeface.
- **Numerals:** always `tabular-nums` so the readout doesn't reflow as digits change.
- **Border radius:** one scale — buttons/sheet `~14–20px`, segmented controls `~11px`. Pick from the existing values; don't introduce new ones.
- **Color approach:** semantic CSS variables (`--bg`, `--surface`, `--text`, `--muted`, `--accent`, `--dot-*`). No hardcoded hex in markup; theme overrides live in `styles.css` `:root` / `[data-theme=...]` blocks.

## Anti-patterns
- **No nautical kitsch** — no ropes, anchors, portholes, compass roses, weathered wood, brass.
- **No earthy tones** (house rule). No serif. No gradients-for-decoration.
- **No color for color's sake** — accent is a signal (the number, the running state), not decoration. Amber/red on the GPS dot are UX signals, allowed.
- No hero imagery, no splash screen beyond the PWA icon, no onboarding.

## Priority
Function over form, but for an instrument legibility *is* function. Contrast and numeral size are not "polish phase" — they're the product. Cosmetic refinement (animation, micro-spacing) is the only genuinely deferrable layer.
