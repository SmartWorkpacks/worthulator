# Dossier — Savings Calculator

**Slug:** `savings-calculator`
**Category:** finance
**Status:** flagship
**Differentiation:** Positioned as the "is my savings beating inflation?" tool. Shares the
future-value compounding math but reframes outputs around the **real return** (APY − inflation),
the balance in **today's dollars**, and the **high-yield vs legacy-bank** gap. (Pure projection of
a known lump sum lives in `future-value`; solving for a required deposit lives in `savings-goal-calculator`.)

## Live data layer

- **FRED CPI (YoY inflation)** via `getCpiInflationYoY()` / `fredBenchmarks`.
  - Used to deflate the nominal balance to today's dollars and to compute the real return
    (`APY − inflation`) and beats-inflation flag.
  - Captioned in the insight visuals (`live: true`, period label from `fredBenchmarks.currentPeriodLabel`).
- Static benchmark constant: `LEGACY_BANK_APY = 0.45%` (FDIC national average savings rate, 2026)
  used for the high-yield advantage contrast.

## Fields

| field   | unit | default | range            |
|---------|------|---------|------------------|
| initial | $    | 5,000   | 0 – 50,000       |
| monthly | $    | 300     | 0 – 2,000        |
| rate    | %    | 4.5     | 0.5 – 10 (APY)   |
| years   | yr   | 10      | 1 – 30           |

## Outputs

`balance`, `realBalance` (today's $), `interestEarned` (+ `interestSharePct`), `realReturnPct`
(+ `beatsInflation`), plus internal `totalDeposited`, `inflationLoss`, `hysaAdvantage`.

## Formula

```
Balance   = P·(1+r/12)^(12t) + PMT·(((1+r/12)^(12t) − 1)/(r/12))
Today's $ = Balance / (1 + inflation)^t
Real ret  = APY − inflation
```

## Worked example (defaults, CPI 3.2%)

- balance **$53,194**, deposited **$41,000**, interest **$12,194** (22.9% of balance)
- today's $ **$38,821**, inflation drag **$14,373**
- real return **+1.3%** → beats inflation
- HYSA advantage vs 0.45% bank **$11,149**

## Invariants (14 tests)

deposited = initial + monthly·months · interest = balance − deposited ≥ 0 ·
real < nominal under inflation · real return = APY − CPI · beats-inflation flag flips at the
crossover · HYSA advantage > 0 above legacy rate, ≈0 at legacy rate · monotonic in rate/years/monthly ·
zero inputs → zeros (no NaN) · higher inflation lowers real balance + real return.

## Insights (5)

1. **Beat inflation?** — benchmark-bar, APY vs live CPI (live caption), positive/warning by flag
2. **Nominal vs today's $** — delta-card (live CPI)
3. **Deposits vs interest** — donut
4. **High-yield vs legacy bank** — benchmark-bar (interest gap)
5. **Growth path** — projection-line

## Architecture

- `calculations/finance/savingsGrowth.ts` (+ `.test.ts`) — pure, data-injected, wraps `calculateFutureValue`
- config: `components/calculator-engine/calculatorConfigs.ts` → `savings-calculator`
- insights: `lib/insights/generators/savingsGrowthInsights.ts` → re-exported from `lib/insights/index.ts`
- registry: `components/worthcore/LiveInsightBlock.tsx` → `savings-calculator`
- wrapper: `components/worthcore/SavingsCalcWithInsights.tsx`
- page: `app/tools/savings-calculator/page.tsx` (legacy `InsightsSection`/`InsightTable` removed)
