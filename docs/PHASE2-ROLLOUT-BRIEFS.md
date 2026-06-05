# Phase 2 — Rollout Briefs (Copilot / Claude Code / sub-agents)

> **Phase 1 (foundation) is done:** the Insight Kit lives at
> `src/templates/insights/`, the standard is `docs/FLAGSHIP-CALCULATOR-STANDARD.md`,
> and the **Freelance Rate Calculator** is the fixed gold reference.
>
> Phase 2 migrates the remaining calculators to that standard. It is
> parallelizable across multiple AI agents **as long as each agent owns a
> disjoint set of files.** Assign whole calculators (all four files of one slug)
> to one agent at a time — never split a calculator across agents, and never let
> two agents edit shared files (`src/templates/**`, `components/**`) at once.

---

## Current landscape (approximate)

- ~17 calculators already use a custom `*Loader.tsx` (closest to standard — may
  just need to adopt the Insight Kit instead of bespoke copies).
- ~12 dedicated engines in `lib/calculators/`.
- 100+ calculators are still served by the **config engine** (via
  `components/calculator-engine/calculatorConfigs.ts` and the `/tools/[slug]`
  route) — these need full migration to the custom-loader archetype.

**Step 0 (do this first, ONE agent):** produce an inventory at
`docs/calculator-migration-inventory.md` classifying every calculator as
`conforms` / `custom-needs-kit` / `config-needs-migration`, then assign batches.

---

## Batching rules

- One agent = one batch = a list of **non-overlapping slugs**.
- Batch by category (finance, work, energy, lifestyle, home, health, time…) so
  related data/patterns are reused.
- Shared-file edits (extending the Insight Kit) are **serialized**: only the
  foundation owner touches `src/templates/insights/**`. If a batch needs a new
  shared piece, it requests it; it is added once, then all batches use it.
- Each agent runs `npx tsc --noEmit` + `npm run lint` + `npm test` before handing back.

---

## Paste-ready brief (fill in the blanks, give to Copilot or Claude Code)

> **Task: migrate a batch of Worthulator calculators to the flagship standard.**
>
> Read first, in order:
> 1. `AGENTS.md` — this is Next.js 16 with breaking changes; before any
>    Next-specific code, read the relevant guide in `node_modules/next/dist/docs/`.
> 2. `docs/FLAGSHIP-CALCULATOR-STANDARD.md` — the canonical standard and the
>    Definition of Done. Follow it exactly.
> 3. The gold reference files for the Freelance Rate Calculator (listed in the
>    standard) — copy their structure.
> 4. The shared Insight Kit at `src/templates/insights/` — use these components;
>    do NOT re-implement count-up hooks, hero cards, insight cards, charts, or the
>    staged-reveal loop.
>
> **Your batch (do ONLY these slugs, touch ONLY their files):**
> `<slug-1>`, `<slug-2>`, `<slug-3>` …
>
> For EACH slug:
> - Write/confirm a dossier `docs/dossiers/<slug>.md`.
> - Build/confirm a pure engine `lib/calculators/<name>Engine.ts` with ≥6 Vitest
>   tests (known values + invariants + zero/NaN guards). Document constants with sources.
> - Build the client component `app/tools/<slug>/<Name>Calculator.tsx` using the
>   Insight Kit (`useStagedReveal`, `ResultHeroCard`, `InsightList`, and ≥1 of
>   `ImpactLineChart`/`BreakdownBarChart`), plus a `*Loader.tsx` (dynamic, ssr:false).
> - Rewrite `app/tools/<slug>/page.tsx` so ALL copy matches the engine (Step 5b):
>   metadata, hero, `SEOTextBlock` formula (exact), steps, stat chips, content
>   cards, FAQ worked examples (recompute the numbers), and JSON-LD.
> - Remove any legacy `InsightTable`/`InsightsSection` and any config-engine entry
>   that is now superseded (confirm the `/tools/[slug]` route still resolves).
>
> **Hard rules:**
> - Do NOT edit files outside your assigned slugs except to READ shared code.
> - Do NOT modify `src/templates/**` or other batches' calculators.
> - No invented statistics; no misleading "Live" badge unless a real live dataset is used.
> - Before finishing: `npx tsc --noEmit` clean, `npm run lint` clean, `npm test` green.
>
> Report back: slugs completed, any shared-kit gaps you hit (so the foundation
> owner can add them), and the final test/tsc/lint status.

---

## Suggested first batches (adjust after Step 0 inventory)

| Batch | Category | Example slugs |
|---|---|---|
| A | Work | `pto-calculator`, `meeting-cost-calculator`, `side-hustle-calculator`, `true-hourly-wage` |
| B | Energy | `road-trip-cost`, `ev-charging-cost`, `heating-cost`, `solar-roi` |
| C | Lifestyle | `alcohol-cost-calculator`, `vaping-cost-calculator`, `pet-cost-calculator`, `streaming-time-calculator` |
| D | Home | `flooring-cost-calculator`, `tile-calculator`, `moving-cost-calculator`, `water-bill-calculator` |
| E | Finance | `latte-factor`, `subscription-auditor`, `millionaire-calculator`, `future-value-calculator` |

Keep batches to ~4–6 slugs so each agent stays focused and reviewable.
