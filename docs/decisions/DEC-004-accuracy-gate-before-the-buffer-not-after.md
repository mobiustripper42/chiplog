---
id: DEC-004
title: "Accuracy gate before the buffer, not after"
topic: "Measurement & maths"
---

## DEC-004: Accuracy gate before the buffer, not after

**Decision:** A fix is discarded the moment `coords.accuracy` exceeds the threshold (default 25 m, range 5–100). Only accepted fixes enter the rolling buffer; the average never sees a rejected fix.
**Why:** Stationary GPS scatter is the dominant error source at the helm — a moored boat "drifts" tens of metres per minute in raw fixes. Gating at ingest keeps that noise out of both the distance sum and the time span. The raw fix's accuracy still drives the GPS-quality dot so the helm can see when reception is poor.
**Tradeoff:** In bad reception every fix may be rejected and the readout holds / goes STALE rather than showing garbage. That's the correct failure mode for an "honest number" app, but it's why the gate is user-adjustable.
