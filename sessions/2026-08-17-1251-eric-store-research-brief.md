---
session: 2
dev: eric
slug: store-research-brief
branch: task/store-research-brief
started: 2026-08-17T12:51:27Z
ended: 2026-08-17T13:05:16Z
points: 0
pr_numbers: []
status: closed
transcript: /home/eric/.claude/projects/-home-eric-chiplog/40d01fa2-dbc1-5b24-9809-9f36f6d421b6.jsonl
---

# Session 2 — store-research-brief

<!-- Task blocks appended by /kill-this, one per task. -->

No code shipped. Session goal was operational: get the PWA installed on the Pixel. Done, verified offline.

**Next Steps:**
- The carried-over work is untouched: `docs/SPEC.md` § Tech and § Deployment still describe the PWA and are materially false post-DEC-011; `docs/PROJECT_PLAN.md` still has PWA phases 1–3.
- `d35badd` (store research brief + `docs/STORE_PIPELINE.md` skeleton) sits on `task/store-research-brief` with **no PR opened**. Either PR it via `/kill-this` or decide it stays local.
- `README.md:48` writes the tailnet URL as `https://mill-dev.<tailnet>.ts.net`. Small real gap: the reader can't tap it. Fix is a line telling them to run `tailscale status` for their own FQDN — **not** the literal name (see Context).
- Session 1 (`2026-08-14-0415-eric-main.md`) is still `status: open` and was left that way deliberately, pending a decision on how to stamp its `ended:`.

**Context:**
- **chiplog is a PUBLIC GitHub repo** (`gh repo view --json visibility`). This settles the question the prior session stopped on: the real tailnet FQDN must not be committed to README.md.
- Phone install worked over a **fully non-persistent** serve. `tailscale serve <target>` defaults to `--bg=false` (foreground) — `tailscale serve --help`, v1.102.2 — so the config exists only while the process runs and disappears on Ctrl-C. `--bg` was the only thing writing persistent state. `tailscale serve reset` clears a stuck config.
- **Port 8080 is occupied on mill-dev** by something unidentified (`ss -ltnp` needs root; the listener is on `127.0.0.1:8080`). `python3 -m http.server 8080` fails with `EADDRINUSE`. Used 8081 instead — the README's 8080 is not a safe default on this box.
- Confirmed the PWA offline claim at `README.md:53` empirically: after Ctrl-C on both processes, the home-screen icon still loads. The service worker cache is doing its job. Worth remembering when weighing how urgently the native rewrite has to land — the current thing works on the phone today.
- Drift vs seeds at session open: 7 `logic`-class files differ (`scripts/check-decisions.mjs`, `check-decisions.test.mjs`, `gen-decisions-index.mjs`, `.claude/skills/read-the-tape/SKILL.md`, `.claude/agents/doc-consistency.md`, `docs/VELOCITY_AND_POKER_GUIDE.md`, plus the `CLAUDE.md` shell). seeds-version 5 vs 5 — no migration owed. Not acted on.
- `.sessions-worktree/` was absent at session start and had to be re-attached from `origin/sessions`.
