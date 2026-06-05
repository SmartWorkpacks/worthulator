# Dossier — Millionaire Calculator

**Slug:** `millionaire-calculator`
**Category:** finance
**Status:** flagship
**Differentiation:** Most "years to $1M" tools stop at the nominal number. This one answers the
question that actually matters — **what will that million be worth?** It deflates the million by
live CPI to show today's-dollars buying power, and computes the extra years needed to reach a
*real* (inflation-adjusted) million.

## Live data layer

- **FRED CPI (YoY inflation)** via `getCpiInflationYoY()` / `fredBenchmarks`:
  - `realValueAtMillion` — $1M deflated by years-to-million.
  - `yearsToRealMillion` — simulate against an inflation-growing target `$1M·(1+infl)^t`.
  - `extraYearsForReal` — the gap between the nominal and real timelines.
  - Captioned `live: true` in the real-value delta-card.

## Fields

| field          | unit | default | range        |
|----------------|------|---------|--------------|
| currentSavings | $    | 10,000  | 0 – 500,000  |
| monthlySavings | $    | 500     | 100 – 5,000  |
| annualReturn   | %    | 7       | 4 – 12       |

## Outputs

`yearsToMillion` (highlight), `realValueAtMillion` (live CPI), `interestEarned` (+ `marketShare`),
`yearsToRealMillion` (+ `extraYearsForReal`); internal `totalContributed`, `progressPercent`,
`marketContribPct`, `yearsFasterWith200`.

## Formula

```
Balance(m+1) = Balance(m)·(1+r/12) + monthly      → months until ≥ $1,000,000
Today's $    = $1,000,000 / (1 + inflation)^years
Real target  = $1,000,000·(1 + inflation)^t       → months until Balance ≥ target
```

## Worked example (defaults, CPI 3.2%)

- yearsToMillion **34.8**, contributed **$219,000**, market growth **$781,000** (78.1%)
- realValueAtMillion **$333,803**
- yearsToRealMillion **61.7** (+**26.9** extra)
- +$200/mo reaches $1M **3.9** years sooner

## Invariants (15 tests)

0 years when already ≥ $1M · faster with higher return / contribution · contributed + interest ≈ $1M ·
caps at 100 yr when no contributions · marketShare ∈ [0,100] · progressPercent = savings/$1M ·
+$200/mo > 0 years saved · real value < $1M and > 0 · real million takes longer (extraYears > 0) ·
higher inflation lowers real value + raises extra years · marketContribPct mirrors marketShare ·
inflation defaults safely (no NaN).

## Insights (≤6, conditional)

1. Already-there (if savings ≥ $1M) — short-circuits
2. Progress bar — benchmark-bar (savings vs $1M)
3. **Real value of the million** — delta-card (live CPI) ← flagship add
4. Market does the heavy lifting — delta-card (if growth ≥ 40%)
5. +$200/mo accelerator — metric (if ≥ 1 yr saved)
6. Trajectory — projection-line

## Architecture

- `calculations/finance/millionaire.ts` (+ `.test.ts`) — pure, optional data arg (CPI)
- config: `components/calculator-engine/calculatorConfigs.ts` → `millionaire-calculator`
- insights: `lib/insights/generators/millionaireInsights.ts` (export `millionaireInsights`)
- registry: `components/worthcore/LiveInsightBlock.tsx` → `millionaire-calculator`
- wrapper: `components/worthcore/MillionaireWithInsights.tsx`
- page: `app/tools/millionaire-calculator/page.tsx`
