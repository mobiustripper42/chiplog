---
id: DEC-010
title: "The sync machinery three of these decisions argue from is gone — the holdings stand, the reasons changed"
topic: "Workflow & tooling"
amends:
  - id: DEC-002
    relation: refines
    scope: "the rationale only — `project-type` is still `tool`; nothing pushes templates at this repo any more, so the type gate is documentation rather than a filter"
  - id: DEC-003
    relation: refines
    scope: "the rationale only — `@ui-reviewer` still stays; there is no type gate left for it to be kept 'despite'"
  - id: DEC-008
    relation: refines
    scope: "the tradeoff and the closing paragraph — the de-webapp'd agents stand, but no sync will ever see them, and the `/pull-seeds` clean-diff contract no longer exists"
---

## DEC-010: The sync machinery three of these decisions argue from is gone — the holdings stand, the reasons changed

**Decision:** DEC-002, DEC-003 and DEC-008 keep their holdings unchanged. Their **rationales** cite machinery that seeds retired — `@sync-config`, the nightly Routine, `/pull-seeds`, `/push-seeds`, the file-class gate, and the `webapp`/`tool` type filter — none of which exists. Recorded here rather than edited into those files, so the record still shows what was believed when each was taken.

**What actually changed, upstream:** seeds DEC-S038 switched the nightly sync Routine off (2026-08-04), and DEC-S040 deleted the whole apparatus (2026-08-06): both sync skills, the classifier agent, and the Routine directory. Template changes now reach a project only because a person copies a file. The file-class registry and the type manifest kept their contents and lost every automated reader — they are reference for a human running `cp`.

**Read against that, the three decisions say:**

| Decision | The sentence that no longer describes anything | Still true? |
|---|---|---|
| DEC-002 | *"Setting `webapp` would make `@sync-config` push Next/Supabase templates at a project that can't use them."* | **The holding, yes.** `project-type` is `tool`. But nothing pushes anything, so the value now tells a *person* which files to skip when copying. |
| DEC-002 | *"the nightly sync will mark it `Type-gated`… accept the one-line Type-gated skip in sync PRs."* | **No.** There are no sync PRs. |
| DEC-003 | *"Keep `@ui-reviewer` **despite the type gate**"* | **The holding, yes** — it earns its keep on a UI-forward app. There is no gate to keep it despite; the title is now historical. |
| DEC-008 | *"The nightly sync's `@sync-config` will see project-side edits… and treat them as project-specific substitutions (skip)"* | **No mechanism**, but the outcome is the same and stronger: nothing can overwrite them because nothing runs. |
| DEC-008 | *"Editing them breaks the `/pull-seeds` clean-diff contract"* | **No.** `/pull-seeds` is deleted. The reason to leave `.claude/skills/**` byte-identical is now different and better: they are `logic` class, seeds is canonical, and a local edit is invisible drift that nothing will ever reconcile. |

**Why this is one decision and not three edits.** Editing the originals would erase the reasoning that was actually used, which is the point of keeping a record at all. Each of those decisions was correct when taken, on premises that held at the time. A reader arriving at DEC-008 by citation lands in its body and now finds a banner pointing here.

**What replaces the safety the sync provided.** Nothing automatic, deliberately. `drift.mjs` (run from a seeds checkout, and by `/its-alive` at session start) enumerates which `logic`-class files differ from the templates and whether this repo owes a schema migration. It reports and stops there — it never copies and has no opinion about which side is right. So DEC-008's de-webapp'd agents are safe by construction, and the cost is that a genuine improvement to a seeds reviewer template will never surface here on its own.

**Not revisited here:** whether the three agents should still be de-webapp'd. They should — DEC-001 stands, and inert webapp guidance is still a hazard. Only the mechanism-shaped reasoning around them is corrected.
