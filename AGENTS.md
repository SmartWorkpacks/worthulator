<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:protected-files -->
# Protected files — Cursor (Owner A) only

Multiple AI agents (Cursor, GitHub Copilot, Claude Code) work in this repo in
parallel on the calculator rollout. To prevent collisions and keep shared
foundations consistent, the files/areas below are **owned by Cursor (Owner A)**.

**If you are NOT Cursor:** you may **read** these, but you must **NOT create,
edit, move, or delete** them. If your task needs a change here, **STOP and ask
Cursor (Owner A) for permission** — describe the change you need and wait. Do not
work around it (e.g. never add a runtime data fetch to dodge the dataset layer,
never fork a shared component into your calculator).

Protected:
- `src/**` — all shared infrastructure (Insight Kit, templates, shared components, config, lib)
- `lib/datasets/**`, `lib/dataStore.ts` — live-data layer (refreshed by automation)
- `scripts/**` — refresh + planning scripts
- `.github/workflows/**` — data-refresh + CI automation
- `docs/FLAGSHIP-CALCULATOR-STANDARD.md`, `docs/PHASE2-ROLLOUT-BRIEFS.md`
- `docs/research/**`, `docs/briefs/**` — the rollout plan + per-owner assignments
- `AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md` — the agent contract

Everything else (your assigned `app/tools/<slug>/**` and
`lib/calculators/<name>Engine.ts`) is yours to build per
`docs/FLAGSHIP-CALCULATOR-STANDARD.md`.
<!-- END:protected-files -->
