# Dossier — Markup Calculator

**Slug:** `markup-calculator`
**Archetype:** Engine-config + live insights (`EngineWithInsights`).
**Live data:** N/A — user supplies cost price and markup %.

## Identity / promise
Selling price, per-unit profit, and gross margin from a cost and markup %,
with insights that surface the markup-vs-margin gap, the keystone benchmark,
and annualised profit at volume.

## Fields
- **costPrice** · **markupPercent**.

## Formulas
- sellingPrice = cost × (1 + markup ÷ 100) ; profit = selling − cost.
- marginPercent = profit ÷ selling × 100.

## Insights / visuals (`markupInsights`)
1. Headline selling price + per-unit profit — delta-card (cost → selling).
2. Markup-vs-margin — benchmark-bar (markup always the larger number).
3. Keystone comparison — vs the 100% (2×) retail standard, when markup < 100%.
4. Annualised profit at 100 units/month — projection framing.
5. Thin-markup warning when markup < 15%.

## Status
✅ Generator `markupInsights` + export + registry entry · page rewired from
static `InsightsSection` to `EngineWithInsights` (live cards) · dossier added.
Follow-up (option b): pure module + tests + Step 5c worked examples.
