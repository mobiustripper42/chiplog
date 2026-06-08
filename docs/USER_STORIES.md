# Chiplog — User Stories

Single role: **the helm** (HM). One person, at the wheel, with a Pixel. No other roles — no admin, no crew, no accounts.

---

## The Helm

### Reading speed
- HM-1: As the helm, I want a big average SOG in knots so I can judge real progress without staring at the bouncing instantaneous number.
- HM-2: As the helm, I want the average taken over a configurable window (default 15 min) so it matches how I think about "are we making way."
- HM-3: As the helm, I want the average computed as distance-over-time so a few noisy fixes or a GPS gap don't throw the number off.
- HM-4: As the helm, I want a small instantaneous SOG too, so I can see a puff or a lull as it happens.
- HM-5: As the helm, I want speeds under ~0.3 kn to read `0.0` so the boat doesn't appear to crawl at anchor.

### Trusting the number
- HM-6: As the helm, I want bad fixes discarded by an accuracy gate so stationary scatter doesn't inflate the average.
- HM-7: As the helm, I want to see GPS fix quality (accuracy + a colored dot) so I know whether to trust the reading.
- HM-8: As the helm, I want a STALE warning when the last fix is more than a few seconds old so I don't read a frozen number as current.
- HM-9: As the helm, I want to see how full the window is (sample count / fill %) so I know how much data backs the average.

### Conditions at the helm
- HM-10: As the helm, I want a dark-first screen and a red night mode so the display doesn't wreck my dark adaptation.
- HM-11: As the helm, I want the screen to stay awake while running so I'm not tapping it back on every minute.
- HM-12: As the helm, I want large numerals legible at arm's length on a moving boat.

### Install & offline
- HM-13: As the helm, I want to install Chiplog to my home screen and run it full-screen like a real instrument.
- HM-14: As the helm, I want it to work fully offline, off-tailnet, anywhere on the water — only GPS, no signal.
- HM-15: As the helm, I want my window/gate/theme settings remembered between sessions.

### Out of scope (named so they don't sneak in — see SPEC § Out of scope)
- Not HM: speed through water, course/heading, max speed, trip distance, track export, history, charts, any backend or sync.
