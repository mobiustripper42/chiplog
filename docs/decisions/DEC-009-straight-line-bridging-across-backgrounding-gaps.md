---
id: DEC-009
title: "Straight-line bridging across backgrounding gaps (V1)"
topic: "Measurement & maths"
---

## DEC-009: Straight-line bridging across backgrounding gaps (V1)

**Decision:** When the app is backgrounded and `watchPosition` stops, accept the resulting time gap as a single great-circle segment between the last pre-gap fix and the first post-gap fix. No gap detection, no buffer splitting — the average stays `total distance ÷ total span` across the gap.
**Why:** It's already correct for steady cruising, which is the main use: straight-line distance over elapsed time is still an honest average speed. The only error case is a course change *during* the gap, where the chord under-measures the path sailed and the average reads slightly low. Not worth pre-solving before on-water observation shows it actually matters.
**Tradeoff:** Averages spanning a long gap with a turn in it read low. The status row's window-fill % gives the helm a tell that the buffer has thin/odd coverage.
**Future (option B, not V1):** detect gaps longer than N seconds and split the buffer — average only the most recent contiguous run, or drop the bridging segment. A real feature with its own task when/if field testing justifies it; consult @architect then.
