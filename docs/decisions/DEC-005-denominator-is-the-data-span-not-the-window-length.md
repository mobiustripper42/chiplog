---
id: DEC-005
title: "Denominator is the data span, not the window length"
topic: "Measurement & maths"
---

## DEC-005: Denominator is the data span, not the window length

**Decision:** Divide total distance by (newest − oldest accepted fix), not by the configured window.
**Why:** With only 6 minutes of fixes in a 15-minute window — just started, or a GPS gap — dividing by 15 min under-reports the true average over the track you actually logged. Dividing by the real span gives the correct average over the data you have.
**Tradeoff:** Early in a session the average is computed over a short span and is noisier until the buffer fills. The status row shows window-fill % so the helm knows how much data backs the number. This is SPEC's explicit veto point; we took the read-correct path over the read-low path.
