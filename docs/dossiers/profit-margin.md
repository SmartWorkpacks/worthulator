# Dossier — Profit Margin Calculator

**Slug:** `profit-margin` (route `/tools/profit-margin-calculator`)
**Archetype:** Engine-config + live insights (`EngineWithInsights`).
**Live data:** N/A — user supplies revenue and cost.

## Identity / promise
Gross profit, margin %, and markup % from revenue and cost — plus the live
insight layer that explains the margin-vs-markup trap and pricing leverage.
Clever under the surface (benchmarks, 1% pricing lever); simple on top
(two sliders).

## Fields
- **revenue** · **cost**.

## Formulas
- grossProfit = revenue − cost.
- marginPercent = profit ÷ revenue × 100 ; markupPercent = profit ÷ cost × 100.

## Insights / visuals (`profitMarginInsights`)
1. Headline gross profit + margin — delta-card (revenue → cost → profit).
2. Markup-vs-margin — benchmark-bar of the two percentages.
3. Pricing lever — a 1% price rise adds `revenue × 0.01` of pure profit.
4. Benchmark vs the 30% healthy product-business margin — benchmark-bar.
5. Loss warning (critical) when profit < 0.

## Status
✅ Generator `profitMarginInsights` + export + registry entry · page rewired
from static `InsightsSection` to `EngineWithInsights` (live cards) · dossier added.
Follow-up (option b): pure module + tests + Step 5c worked examples.
