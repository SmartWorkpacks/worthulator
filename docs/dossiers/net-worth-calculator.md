# Dossier — Net Worth Calculator

**Slug:** `net-worth-calculator`
**Category:** finance / wealth
**Status:** flagship (custom UI)
**Architecture note:** Bespoke client component (recharts projection, asset/liability breakdowns,
what-if buttons) with its own pure engine `lib/calculators/netWorthEngine.ts`. Not on the shared
`CalculatorEngine` and not in the `LiveInsightBlock` registry.

## Data layer (added in flagship pass)

- **Net-worth percentiles by age** — `lib/datasets/netWorthPercentiles.ts`, derived from the
  Federal Reserve **Survey of Consumer Finances (SCF) 2022**. Static reference (SCF releases every
  ~3 years), so not Apify/live — a documented benchmark.
  - `getNetWorthPercentile(age, netWorth)` → percentile (1–99) via piecewise-linear interpolation
    across per-bracket anchors, plus `bracketLabel`, `bracketMedian`, `medianMultiple`.
  - Injected into the engine via `deps.percentileFn` (defaults to the dataset getter) for testability.
  - Surfaced as a prominent **"Where you rank · ages X"** card with a percentile bar + SCF citation.

## Fields

Assets (cash, checking, investments, retirement, home, other real estate, vehicles, other),
liabilities (mortgage, car, student, credit card, other), projection (age, growth %, years).

## Outputs

`totalAssets`, `totalLiabilities`, `netWorth`, `debtToAssetRatio`, `milestoneLabel`,
`projectedNetWorth`, `yearsToMillion`, breakdowns, `growthSeries`,
+ `percentile`, `bracketLabel`, `bracketMedian`, `medianMultiple`.

## Worked example (defaults, age 30)

assets $68,000 − liabilities $26,000 = **net worth $42,000** · debt-to-asset 38% ·
**~51st percentile** for under-35 (bracket median $39,000, ~1.08× median).

## UX

Hybrid auto-reveal (loader once on mount, then live updates). Legacy `<InsightTable>` removed.

## Invariants (engine 11 + dataset 8 = 19 tests)

asset/liability totals · net worth can be negative · debt ratio % · millionaire label + years-0 ·
projection grows + series length · percentile attached and bounded [1,99] · higher net worth →
higher percentile · injected percentileFn honoured · breakdown pcts bounded · zero assets safe ·
bracket selection by age · median anchor ≈ p50 · percentile monotonic + clamped + interpolated ·
median multiple · ascending anchors · older brackets richer.

## Files

- `lib/datasets/netWorthPercentiles.ts` (+ `.test.ts`)
- `lib/calculators/netWorthEngine.ts` (+ `.test.ts`)
- `app/tools/net-worth-calculator/NetWorthCalculator.tsx` (custom UI, auto-reveal, percentile card)
- `app/tools/net-worth-calculator/page.tsx` (legacy InsightTable removed, SEO synced)
