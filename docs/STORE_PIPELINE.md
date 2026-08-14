# Store Pipeline — App Store and Google Play, start to finish

**Status: skeleton. Nothing below is answered yet.**

This is the runbook chiplog exists to produce. The app is the rehearsal; **this file is the
deliverable** — muster inherits it, and the details worth having in three months (what each form
actually asked, which wait took how long, what the one-way doors turned out to be) are exactly the
ones that evaporate once something works.

Fill it in **as you go**, not afterwards. A step reconstructed from memory a fortnight later is
the step that quietly loses the detail nobody could have derived.

The questions that populate these headings are specified in
[`docs/STORE_RESEARCH_BRIEF.md`](STORE_RESEARCH_BRIEF.md). Every claim recorded here carries a URL
and a retrieval date, because all of this is third-party policy that changes and that this
project's `CLAUDE.md` forbids asserting from memory.

---

## One-way doors

The running list of decisions that are expensive or impossible to reverse. **Add to this the moment
one is identified, before it is walked through.** Known or suspected so far, none yet confirmed:

| Door | Why it's one-way | Confirmed? |
|---|---|---|
| Developer account type (individual vs organization) | Changing it after enrolment is not a settings toggle; it also sets the seller name shown on every listing | ☐ |
| Bundle identifier / Android `applicationId` | Permanent once published on either store | ☐ |
| Android upload keystore | Under Play App Signing the developer holds the upload key; losing it is a recovery process, not an undo | ☐ |
| iOS `buildNumber` / Android `versionCode` | Monotonic; a number burned is burned | ☐ |

---

## Google Play — account and testing gate

*Brief Q1. Unanswered.*

Needs: whether the closed-testing requirement currently applies and to which account types; exact
tester count, continuous duration, and what counts as engagement; **whether it is satisfied
per-account or per-app**; individual verification time; the organization/D-U-N-S alternative and
whether it changes the requirement.

**The pivot in here:** per-account means chiplog's rehearsal clears muster's runway. Per-app means
muster needs its own cohort and its own clock, starting far earlier than currently planned.

**Android testers are the scarce resource in this whole plan.** BrewBoat has ~20 employees, most
on iPhone (operator, 2026-08-14); bushel has 2 Android users. iOS is comfortable — TestFlight has
no minimum and ~20 iPhones is ample — but the Android pool is a handful of people and the crew
roster does not fix it.

**The asymmetry that follows:** chiplog's testers need not be real users (anyone with an Android
phone can walk around and watch the number), while muster's cannot be strangers (a tester off the
roster cannot answer a shift ask). So chiplog is the right app to absorb a closed-testing window
**if** the gate is per-account. If it is per-app, muster has a problem sequencing does not solve.

**Open input needed from the operator:** the count of Android devices among the ~20.

---

## iOS from Linux

*Brief Q2. Unanswered.* **Hard constraint: there is no Mac and one is not being bought.**

### Expo / EAS — chiplog's path

Needs: what EAS requires to sign (App Store Connect API key vs Apple ID); what is created on
Expo's side vs. in Apple's portal vs. by hand first; whether `eas build` and `eas submit` genuinely
run start-to-finish on Linux.

### Capacitor — a candidate for muster, not a settled choice

Needs: **whether a Capacitor iOS build and submission is possible at all without macOS**, since the
conventional flow opens Xcode.

muster's form factor is genuinely open — `DEC-MSG-2` names Capacitor, but as the assumed vehicle
for APNs inside a *messaging* decision, not as a compared option, and no spec work has been done
on it. If the no-Mac route does not exist, that is an argument against Capacitor which did not
exist when that decision was taken. **Record it as input; the choice is an `@architect`
conversation and a decision record in the muster repo.**

### Test device

Needs: TestFlight vs UDID registration; and the **minimum iOS version for Expo SDK 57**, which sets
the floor on which used iPhone is worth buying. **Answer before purchasing.**

---

## Privacy declarations

*Brief Q3.1–3.5. Unanswered.*

Needs: Apple App Privacy questionnaire and whether "Data Not Collected" is correct for an app that
reads GPS purely on-device; the `PrivacyInfo.xcprivacy` manifest and required-reason APIs (and
whether SDK 57 generates it); Play Data safety for foreground-only location; the **publicly
reachable** privacy policy URL requirement — this project's hosting is tailnet-private, so a public
URL has to come from somewhere; and what Play requires for background location specifically, which
prices the future feature parked in `docs/decisions/DEC-009-straight-line-bridging-across-backgrounding-gaps.md`.

---

## Review risk

*Brief Q3.6–3.7. Unanswered.*

Needs: what App Store Review Guideline 4.2 currently says, read rather than recalled. Then the two
exposures — **chiplog**, whose entire function is unobservable to a reviewer sitting still, and
**muster**, whose Capacitor wrap of a web app is closer to what 4.2 was written to reject (its
native APNs push being the candidate defense). Plus what Apple expects as demo credentials for a
**magic-link, passwordless** app, which muster will need and chiplog was specifically chosen to
avoid.

---

## Order of operations

*Unanswered — confirm or correct against what the research finds.*

Current working assumption, from the session that opened this file: **the store paperwork is the
critical path, not the code.** Enrolment, verification, any Play testing window, and a shipped
iPhone are wall-clock waits; the port has no latency and runs underneath them. Android goes first
(no enrolment wait, no device to buy, the operator's Pixel is already the target); iOS follows via
TestFlight.

Separate the pure waiting from the actual work when this is rewritten — they schedule differently.

---

## Log

Append-only. Date, what was done, what it cost, how long it actually took, and what surprised you.
The surprises are the part muster needs.

| Date | Step | Elapsed | Cost | Notes |
|---|---|---|---|---|
| — | — | — | — | *nothing done yet* |
