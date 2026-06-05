# Rent Calculator — Dossier

**Slug:** `rent-calculator`
**Owner:** A (Cursor)
**Category:** Finance / Housing
**Intent:** Informational — "how much rent can I afford?"

## What it does
Computes an affordable rent budget from gross income and monthly debts using three
common US guidelines: the 30% rule, a 36% rent+debt ceiling, and the landlord 3×
income rule. Shows a recommended rent, a conservative→stretch band, and an
"affordable rent by income" curve.

## Differentiation
- **vs `rent-vs-buy-calculator`**: that compares renting vs buying. This answers the
  upstream question — how much rent fits your income. Cross-linked.

## Inputs
- Gross annual income, monthly debt payments, target rent-to-income % (slider).

## Engine — `lib/calculators/rentAffordabilityEngine.ts`
- `comfortable = grossMonthly × 30%`; conservative 25%, stretch 35%.
- `debtAdjustedMax = grossMonthly × 36% − monthlyDebt`.
- `recommended = min(target%, debtAdjustedMax)` (debt-aware).
- `incomeNeededForRecommended = rent × 3 × 12` (landlord rule).
- `affordabilityByIncome` series for the chart.
- 8 tests passing (30% rule, ordering, debt ceiling, debt caps recommended, target
  rent-to-income, monotonic series, guards).

## Live data
None — rent affordability is rule-based, not rate-driven. No live badge.

## Visuals
- `ImpactLineChart` — affordable rent by income, reference line on the user's income.
- `BreakdownBarChart` — conservative / comfortable / stretch range.

## Page copy
All numbers derive from one worked example (`$72k income, no debt, 30%`).

## Status
- ✅ Engine + 8 tests passing
- ✅ tsc clean · eslint clean
- ✅ Page renders 200
