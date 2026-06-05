# Dossier — Airbnb Profit Estimator

**Slug:** `airbnb-profit`
**Archetype:** Engine-config flagship (`EngineWithInsights`).
**Live data:** N/A — user supplies nightly rate, occupancy, fee, expenses.

## Identity / promise
Real take-home from a short-term rental after platform fees and expenses, plus
break-even occupancy and a 10-year horizon. Clever under the surface (break-even
occupancy, margin, revenue-to-expense coverage, 10-yr profit); simple on top
(four sliders).

## Fields
- **nightlyRate** · **occupancyPct** · **platformFeePct** · **monthlyExpenses**.

## Formulas
- gross = nightlyRate × 30 × occupancy% ; net = gross × (1 − fee%) − expenses.
- annualProfit = net × 12 ; tenYearProfit = net × 120.
- breakEvenOcc = expenses ÷ (nightlyRate × 30 × (1 − fee%)).
- profitMarginPct = net ÷ gross ; revenueToExpenseRatio = gross ÷ expenses.

## Insights / visuals (`airbnbProfitInsights`)
Headline monthly net, break-even occupancy, margin health, and 10-year profit —
the break-even/margin/10-yr outputs were previously missing from the config.

## Step 5c
SEO worked example (default $150/night, 70% occ, 15% fee → gross, net, annual,
margin, break-even) recomputes at render via `calculateAirbnbProfit`.

## Status
✅ Pure module `calculations/finance/airbnbProfit.ts` + 12 tests · config
delegates to it (now feeds all insight outputs) · wired via `EngineWithInsights`
· Step 5c worked example · dossier added.
