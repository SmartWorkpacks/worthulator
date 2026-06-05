# Dossier — Child Support Calculator

**Slug:** `child-support-calculator`
**Archetype:** Engine-config + live insights (`EngineWithInsights`).
**Live data:** N/A — user supplies both incomes, children, custody split.

## Identity / promise
A ballpark monthly/annual child-support figure using the income-shares model,
with insights on share-of-income pressure, custody leverage, the national
median benchmark, multi-year totals, and an estimate-only reminder.

## Fields
- **payerIncome** · **receiverIncome** · **children** · **custodySplit**.

## Formulas
- combined = payer + receiver ; pct from guideline table by # children.
- payerObligation = combined × pct × (payer ÷ combined).
- support = max(0, payerObligation − payerObligation × custody%/100).

## Insights / visuals (`childSupportInsights`)
1. Headline monthly + annual — delta-card (income → support, share %).
2. Share of payer income (affordability pressure; warning ≥ 25%).
3. Custody leverage — ~obligation × 10% per extra 10% custody time.
4. Benchmark vs ~$500 US median monthly order — benchmark-bar.
5. Cumulative 5yr/10yr total — projection-line.
6. Estimate-only reminder (warning).

## Status
✅ Generator `childSupportInsights` + export + registry entry · page rewired
from bare `CalculatorEngineLoader` to `EngineWithInsights` (live cards) · dossier
added. Follow-up (option b): pure module + tests + Step 5c worked examples.
