# Store Research Brief — three questions to run down

**Written:** 2026-08-14 · **For:** a fresh Claude Code session, in this repo or standalone
**Status:** open — nothing here is answered yet

This is a **research brief, not a plan**. Its job is to send someone at three specific unknowns
that gate the App Store / Google Play work, and to make sure the answers come back written down
in a form the next person can act on.

**Answer them; do not implement anything.** No scaffolding, no `eas.json`, no account signups.
Several of these have one-way doors behind them (see the warnings inline) and the whole point of
asking first is to not walk through one by accident.

---

## Ground truth — read this before answering anything

Three sibling repos are involved and they are easy to confuse. All three live under `/home/eric/`.
**Read them rather than reasoning from these summaries** — this section exists to stop you
conflating them, not to substitute for the repos.

| Repo | What it is | Stack | Store status |
|---|---|---|---|
| **chiplog** (this repo) | GPS speedometer. One screen, no login, no backend, offline. | Being rebuilt on **Expo / React Native SDK 57**, TypeScript strict (`docs/decisions/DEC-011-*.md`). Currently still a vanilla PWA on disk. | **The rehearsal.** Nothing submitted, no accounts created. |
| **muster** | Crew engine for small-passenger-vessel operators. First and only tenant: **BrewBoat** — 4 inspected party boats, 2 crew each (`/home/eric/muster/.claude/CLAUDE-context.md:11`). Users are captains and mates. | **Next.js App Router on Vercel**, Postgres/Neon, self-rolled magic-link auth, Twilio SMS live in production (`/home/eric/muster/.claude/CLAUDE-context.md` § Stack). | **The real target.** Native form factor is **an open question** — see the note below. Unbuilt either way. |
| **bushel-mobile** | Farm app, mobile client. Users are farm staff. | **Expo / React Native SDK 57**, TypeScript strict (`/home/eric/bushel-mobile/package.json`). | **Also a rehearsal.** Parked mid-phase — its Phase 1.1 merged as bushel-mobile PR #13, never verified on a device. **Exactly 2 Android users** (operator, 2026-08-14). |

**Why chiplog and bushel-mobile both exist:** to make muster buildable. Neither is an end in
itself. chiplog is the store-pipeline rehearsal specifically because it has no login and no
backend — Apple wants working demo credentials for any app with an account, and chiplog has
nothing to hand a reviewer. Both are Expo SDK 57, so the toolchain is being rehearsed twice.

**The fact most likely to be got wrong:** muster is a **crewing app for BrewBoat**, not farm
software. bushel is the farm app. Different products, different users, adjacent repo names.

### muster's native form factor is open — do not inherit an answer

`/home/eric/muster/docs/decisions/DEC-MSG-2-*.md` names a **Capacitor wrap**, and it is easy to
read that as settled. **It is not, and this brief does not assume it.** Read the decision before
relying on it: its topic is *"Messaging, presence & doorbell"*, it is dated to channel research on
2026-06-03, and its entire rationale is push reliability — *"reliable in-app push on iPhone needs
native APNs → Capacitor."* Capacitor appears as the assumed vehicle for APNs, never as an option
compared against alternatives. It then reports resolving the build-plan §7 native-vs-PWA question,
which `/home/eric/muster/docs/SPEC.md:77` parks as *"decided at the infrastructure stage"* — a
stage that has not had that conversation. **No spec work has been done on muster's form factor**
(operator, 2026-08-14).

So when this brief asks about muster's toolchain, it is asking **what a decision would need to be
made on**, not how to execute one. Choosing it is an `@architect` conversation in the muster repo
and a decision record there — not an outcome of this research and not something to settle inside a
store-paperwork doc.

**Hard constraint across everything: there is no Mac and one is not being bought.** Any answer
that ends in "open Xcode" is not an answer. Expo's EAS builds iOS on Expo's servers and
`eas submit` runs on Linux — that is the assumption chiplog is built on. Whether the equivalent
exists for Capacitor is **Q2** below and is genuinely open.

**Not yet purchased:** Apple Developer Program ($99/yr, individual), Google Play Console ($25
one-time), and a used iPhone as the only possible iOS test device. **Do not create either account
while answering these questions** — Q1 and Q2 both bear on which account *type* to create, and
account type is not freely changeable afterwards.

---

## Rules for the answers

This project's `CLAUDE.md` forbids guessing third-party API shapes and requires citing sources.
That applies with force here, because every one of these questions is about a policy that has
changed within the last two years and that a confident-sounding wrong answer will send real money
and real weeks in the wrong direction.

- **Cite the official source with a URL and a retrieval date** for every factual claim: Apple
  Developer / App Store Review Guidelines / App Store Connect Help, or Google Play Console Help /
  Play Console itself. A blog post, a Stack Overflow answer, or a Reddit thread is a *lead*, not a
  citation — chase it to the primary doc before writing it down.
- **Where the primary source is ambiguous, say so** and quote the ambiguous sentence. "The docs do
  not state X" is a real, useful answer. An invented specific is not.
- **Where the answer differs for individual vs organization accounts, give both.** That distinction
  is the hinge on more than one of these.
- **Do not answer from model memory.** All three questions concern policies with recent churn, and
  training data will be confidently stale.

---

## Q1 — Google Play: the closed-testing gate, and whether it is per-account or per-app

**The question.** Before a Play developer account can publish an app to production, Google has
required a period of **closed testing** with a minimum number of testers, sustained for a minimum
continuous duration, with some engagement expectation. Establish, from Play Console Help and from
the Play Console UI itself:

1. Does this requirement currently exist? For which account types — **individual/personal only, or
   organization accounts too?**
2. If it exists: the **exact tester count**, the **exact continuous duration**, and what counts as
   an engaged/opted-in tester (does installing suffice, or is there an activity expectation?).
3. **Is the requirement satisfied once per developer account, or once per app?** State how you
   determined this and quote the sentence you determined it from.
4. What identity/address verification does an individual account require, and what is the typical
   elapsed time before it clears?
5. For an **organization** account: is a D-U-N-S number still required, what does obtaining one
   cost and take, and does organization status change or remove the closed-testing requirement?

**Why this one is first.** It is the longest pole in the whole schedule and the only item that can
add weeks that no amount of coding removes. And sub-question 3 is worth more than the rest combined:

- **If per-account:** chiplog's rehearsal satisfies the gate once, and muster inherits a clear
  runway. The rehearsal pays for itself on this fact alone.
- **If per-app:** muster needs its own cohort and its own continuous window, which means that clock
  should start as early as possible — potentially in parallel with chiplog rather than after it.
  This changes the order of the entire project.

**The constraint that makes this sharp: Android testers are the scarce resource in this whole
plan.** BrewBoat has **~20 employees, most of them on iPhone** (operator, 2026-08-14). bushel has
**2** Android users. So the pool of humans who can install an Android closed-testing build is a
small handful, and the crew roster does not solve it — the number that matters is the **Android
subset of the 20**, not the 20. iOS is comfortable by comparison: TestFlight has no minimum tester
count (confirm this in Q2), and ~20 iPhones is ample.

**The asymmetry to carry into any recommendation:** chiplog's testers do not need to be real
users. Anyone with an Android phone can meaningfully exercise a GPS speedometer by walking around
and watching the number. muster's crew app cannot be tested by a stranger — a tester who is not on
BrewBoat's roster cannot answer a shift ask. So if the gate is **per-account**, chiplog is the
right app to absorb it with a scraped-together cohort. If it is **per-app**, muster has a problem
that sequencing does not fix, and that finding is the most important thing this question can
return.

**Open input needed from the operator:** the actual count of Android devices among the ~20.

**Also worth checking while you are in there:** are testers invited by email list, Google Group, or
opt-in URL, and can the tester list be edited mid-window without restarting the clock? The
answer determines how a bounced or wrong account on day nine is handled.

**Record the answer in:** a new `docs/STORE_PIPELINE.md` in this repo (create it), under
`## Google Play — account and testing gate`. Note explicitly whether the account should be created
as individual or organization, and **why** — that recommendation is the deliverable, not the
research.

---

## Q2 — iOS without a Mac: does the no-Mac path exist for *both* toolchains?

**The question.** Establish the complete path from "no Apple account" to "app installed on a
physical iPhone via TestFlight" on a **Linux-only** machine, for each of the two toolchains:

**(a) Expo / EAS — chiplog's path.**
1. What does EAS need in order to sign an iOS build: an App Store Connect API key, Apple ID
   credentials, or both? What is created on Expo's servers vs. in the Apple developer portal?
2. Does `eas build --platform ios` genuinely require nothing local beyond the CLI? Does
   `eas submit` to App Store Connect run on Linux?
3. What is created automatically vs. what must be created by hand in App Store Connect first
   (the app record, the bundle identifier, the API key)?

**(b) Capacitor — a candidate for muster, not a settled choice.**
4. **Can a Capacitor iOS app be built and submitted without macOS at all?** The conventional
   Capacitor flow is `npx cap open ios` into Xcode. Establish whether a supported no-Mac route
   exists — a hosted macOS build service, a CI runner, or otherwise — what it costs, and whether
   it is a first-class supported path or a workaround.
5. If no such route exists, **say so plainly.** It is a load-bearing negative finding: the no-Mac
   constraint would then be an argument against Capacitor that did not exist when DEC-MSG-2 was
   taken on push-reliability grounds. Report it as input to muster's open form-factor decision;
   do not make that decision here.

**Do not scope the Expo-vs-Capacitor tradeoff in this brief beyond the build-toolchain facts
above.** It is a real architectural question with weight on both sides — Capacitor wraps a web app
that already exists, while Expo/RN would mean building the crew UI natively against an API, which
muster's server-rendering-by-default decision does not survive (read it at
`/home/eric/muster/docs/decisions/`, the one titled *"Server rendering is the default, islands are
earned"*). That belongs to `@architect` in the muster repo. What *this* research owes it is the
narrow, checkable input: which toolchains can reach the App Store from a Linux-only machine.

**And for both:**
6. Does the **used iPhone** need to be registered by UDID, or does TestFlight avoid that? What
   minimum iOS version must it run — see the SDK 57 section below, and **settle this before the
   phone is bought**, because a cheap enough used iPhone will be under whatever the floor is.
7. Does Apple's enrollment differ meaningfully between individual and organization
   (D-U-N-S, verification time, what name appears as the seller)? Individual enrollment publishes
   under a personal name — confirm whether that is the case and flag it, since it is visible on
   every listing and is not trivially changed later.

**Why this one.** (a) is expected to be routine and mostly needs confirming. (b) is the one that
could invalidate a plan: if Capacitor iOS genuinely needs a Mac, then the rehearsal teaches
chiplog's pipeline but muster still hits a wall, and better to know that now than after the
Apple account is paid for.

**Record in:** `docs/STORE_PIPELINE.md` under `## iOS from Linux`, with the two toolchains as
separate subsections so the muster-specific finding is not buried in chiplog's.

---

## Q3 — Privacy declarations and the minimum-functionality risk, both stores

**The question.** Two related things that both get decided at submission time and are painful to
get wrong.

**Privacy paperwork:**
1. **Apple App Privacy** questionnaire in App Store Connect: what does it ask, and — for an app
   that reads GPS purely on-device, transmits nothing, and has no accounts — is "Data Not
   Collected" the correct and accepted answer? What disqualifies an app from that answer?
2. **iOS privacy manifest** (`PrivacyInfo.xcprivacy`) and required-reason APIs: which of the APIs a
   chiplog-shaped app touches require a declared reason? Async storage wrapping `UserDefaults` is
   the specific one to check. **Does Expo SDK 57 generate this automatically, or is it hand-written?**
3. **Play Data safety** form: same app, same answer? What does Play require declared for
   *foreground-only* location?
4. **Privacy policy URL:** confirm Play requires one for a location-permission app, and confirm
   whether Apple does too. **It must be publicly reachable** — this project's existing hosting is
   Tailscale-only and tailnet-private (`docs/SPEC.md` § Deployment), so a public URL has to come
   from somewhere. Note what the cheapest correct option is.
5. **Foreground vs background location:** confirm what Play requires for background location
   specifically — a separate declaration, a demo video, extended review? This matters beyond
   chiplog: `docs/decisions/DEC-009-*.md` parks a future feature that would need it, and knowing
   the cost now decides whether that feature is ever worth building.

**Review risk (Guideline 4.2, minimum functionality):**
6. Read the current App Store Review Guidelines § 4.2 and report what it actually says, not what it
   is remembered to say. Then assess two specific exposures:
   - **chiplog:** a genuinely native single-screen utility whose *entire function is unobservable
     without physical motion*. A reviewer at a desk sees `—` or `0.0`. This is the same shape of
     problem that demo credentials exist to solve, arriving through a different door. What is the
     supported mitigation — App Review Notes? A demo mode? Something else? Find out what Apple
     actually expects here rather than inventing a workaround.
   - **muster:** report how 4.2 applies to a **web-view-wrapped** app generally, since that is one
     of the candidate form factors and is closer to what 4.2 was written to reject. Note whether
     substantial native functionality — push via APNs being the obvious one — is understood to be
     a sufficient defense, and what else such an app is expected to carry. This is input to
     muster's open form-factor decision, and may well be the strongest 4.2-shaped argument in it.
7. Note anything the guidelines say about apps that require an account, since muster has
   magic-link auth and **will** need demo credentials — the exact problem chiplog was chosen to
   avoid. What form does Apple want them in for a passwordless/magic-link app? This is a known
   future obstacle worth scoping now rather than discovering at muster's submission.

**Record in:** `docs/STORE_PIPELINE.md` under `## Privacy declarations` and `## Review risk`.

---

## Expo SDK 57 — the smaller questions

These are lower-stakes and faster to resolve; the operator may chase them conversationally rather
than through this brief. Listed so they are not lost either way. Reference point: bushel-mobile is
already on SDK 57 (`/home/eric/bushel-mobile/package.json`) and its `app.json` is a working example
of the config shape — read it rather than starting from a blank file.

1. **Minimum iOS deployment target for SDK 57**, and the minimum Android API level. The iOS number
   is a purchasing decision, not a technical one — it sets the floor on which used iPhone is worth
   buying, and it needs answering first.
2. **`expo-location`:** the API for a foreground high-accuracy watch equivalent to
   `navigator.geolocation.watchPosition({ enableHighAccuracy: true, maximumAge: 0, timeout: 8000 })`
   (`app.js:171-173`). What the permission flow looks like, what the accuracy field is called and
   in what units, and what the iOS `Info.plist` purpose string requires. **The purpose string text
   is read by App Review as well as by the user** — a vague one is a rejection risk, so find out
   what a good one looks like.
3. **`expo-keep-awake`:** confirm it is the right replacement for the Screen Wake Lock API
   (`app.js:191-203`), and whether it needs re-acquiring on foreground the way the web API does.
4. **Settings persistence:** which storage library is idiomatic for SDK 57 for a handful of
   non-secret settings. bushel-mobile uses `expo-secure-store`, but chiplog's settings are a
   window length, an accuracy threshold and a theme name — not secrets. Note what the required-reason
   API implications are (this ties back to Q3.2).
5. **Fonts:** can `expo-font` load a **variable** font, or does it need one file per weight? This
   decides whether `docs/decisions/DEC-006-*.md`'s single-file leg survives — DEC-011 currently
   flags it as unconfirmed rather than asserting either way, and it should be settled rather than
   left hanging.
6. **Tabular numerals:** `styles.css` relies on `font-variant-numeric: tabular-nums` so the readout
   digits do not jump. Establish the React Native equivalent and **whether it behaves identically on
   both platforms** — this is load-bearing for an app that is one big number, and it is the kind of
   thing that works on one platform and quietly does not on the other.
7. **EAS:** neither chiplog nor bushel-mobile has an `eas.json`, and `eas` is not on PATH. What
   does a minimal `eas.json` need for internal-distribution Android and TestFlight iOS?
8. **Android upload keystore:** confirm EAS generates and stores it, and confirm how to **download
   and back it up**. Under Play App Signing, Google holds the app signing key and the developer
   holds the upload key — establish what actually happens if the upload key is lost, so the backup
   step is understood rather than cargo-culted.

---

## What to hand back

1. **`docs/STORE_PIPELINE.md`**, created in this repo, structured by the headings named above.
   Every claim cited with a URL and a retrieval date. Ambiguities preserved as ambiguities.
2. **A short list of one-way doors** — every decision identified along the way that is expensive or
   impossible to reverse (account type, bundle identifier, upload keystore, seller name, anything
   else found). This list is the most valuable output of the exercise; the operator has not been
   through either store before and these are exactly what is invisible until too late.
3. **A recommended order of operations**, with the items that are pure waiting clearly separated
   from the items that are work. The current working assumption — **start the store clocks first
   and port the code underneath them** — should be confirmed or corrected against what you find.
4. **Anything that turns out to need a decision rather than a fact** goes back as a proposed
   decision record (`docs/decisions/DEC-<next>-<slug>.md`, then `npm run gen:decisions`) — not as a
   choice made quietly inside a research doc. The next free id is the one after the highest in
   `docs/decisions/`.

**Do not:** create either developer account, buy anything, scaffold Expo, write an `eas.json`, or
edit `docs/SPEC.md` / `docs/PROJECT_PLAN.md`. Those are separate tasks with their own approval.
