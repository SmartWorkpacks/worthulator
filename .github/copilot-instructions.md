# Copilot instructions — Worthulator

This is a Next.js 16 financial/lifestyle calculator app. Multiple AI agents
(Cursor, GitHub Copilot, Claude Code) build calculators here in parallel.

## Before writing code
- This is **not** the Next.js in your training data — APIs and conventions differ.
  Read the relevant guide in `node_modules/next/dist/docs/` before Next-specific code.
- Read `docs/FLAGSHIP-CALCULATOR-STANDARD.md` (the build standard + Definition of Done)
  and your batch brief `docs/briefs/copilot-batch.md`.
- Build each calculator using the shared Insight Kit in `src/templates/insights/`
  (copy the `freelance-rate-calculator` reference). Do not re-implement its components.

## Protected files — Cursor (Owner A) only. Ask permission before changing.
You may **read** these but must **NOT create, edit, move, or delete** them. If a
change is needed, **STOP and ask Cursor (Owner A)** — do not work around it.
- `src/**` — all shared infrastructure (Insight Kit, templates, components, config, lib)
- `lib/datasets/**`, `lib/dataStore.ts` — live-data layer
- `scripts/**`, `.github/workflows/**` — automation
- `docs/FLAGSHIP-CALCULATOR-STANDARD.md`, `docs/PHASE2-ROLLOUT-BRIEFS.md`, `docs/research/**`, `docs/briefs/**`
- `AGENTS.md`, `CLAUDE.md`, `.github/copilot-instructions.md`

## Your sandbox
Only the slugs in `docs/briefs/copilot-batch.md`. For each, you own:
`app/tools/<slug>/**` and `lib/calculators/<name>Engine.ts` (+ tests + dossier).
Do not touch another owner's calculator files.

## Live data — derive, never hardcode
If a calculator's default depends on a market rate or regional price, consume the
existing dataset in `lib/datasets/**` (calculators never fetch at runtime). Any
data-derived number in page copy must be computed at render and "as of"-stamped
(see `app/tools/ev-vs-gas/page.tsx`). Need a series that doesn't exist? Ask Owner A.

## Done means
`npx tsc --noEmit` clean, `npm run lint` clean, `npm test` green, page renders 200.
