SEEDS WORKFLOW CHEATSHEET                                v2026-05-05

  /its-alive  ->  [ work ]  ->  /kill-this  ->  /its-dead
                     ^                              v
                     +--- /pause-this <--- /restart-this


SESSION
  /its-alive       start. stamps time, opens session file, reads
                   context, recommends task. waits for confirmation.
  /pause-this      walking away. build check + WIP commit.
  /restart-this    resume from /pause-this. reloads context.
  /kill-this       end pt 1. build + commit + PR + @code-review.
  /its-dead        end pt 2. duration + points + finalize file.
                   arg: "subtract 30 minutes for lunch"

PHASE
  /start-phase     materialize current phase as Issues
                   ( phase:N + points:X labels )
  /retro           close phase. mark [x], reconcile drift,
                   compute velocity, write retro, bump minor.

SEMVER  ( dev projects only — needs package.json )
  /bump-major      breaking change. manual. tag on main.
  /promote-production main->prod ff-merge + push.
                   ( needs origin/production — DEC-S022 )
  patch bumps      automatic in /its-dead on PR merge.

REFLECT
  /read-the-tape   scan sessions for anti-patterns; writes to seeds.
                   --queue drains what the SessionEnd hook captured.
                   bare: number, file path, or none = latest.
  /doc-consistency-check
                   cross-ref facts across docs. report-only.

  moving files between seeds and this repo is BY HAND now.
  run seeds' drift.mjs to see what differs.

INFRA
  /update-config
  /fewer-permission-prompts
  /keybindings-help
  /claude-api
  /simplify
  /loop <interval> <cmd>           BUILT-IN
  /init                              /review
                                     /security-review

DEV IDENTITY      ~/.claude/devname  ( one line, e.g. "eric" )
SESSION FILE      sessions/YYYY-MM-DD-HHMM-<dev>-<slug>.md
TRANSCRIPT PATH   in YAML frontmatter, captured at /its-alive


THE SHORT VERSION
  start of work:     /its-alive
  break:             /pause-this    ->  /restart-this
  end of work:       /kill-this     ->  /its-dead
  start of phase:    /start-phase
  end of phase:      /retro
  drain the tape:    /read-the-tape --queue
