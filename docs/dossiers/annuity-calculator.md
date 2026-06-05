# Annuity Calculator — Dossier

**Slug:** `annuity-calculator`
**Owner:** A (Cursor)
**Category:** Finance / Retirement
**Intent:** Commercial — "how much income will an annuity pay me?"

## What it does
Models a fixed, period-certain immediate annuity: given a premium, crediting rate,
and payout length, it computes the guaranteed monthly/annual income, total payout,
payout multiple, and interest earned — plus a payout-by-length comparison.

## Inputs
- Premium (lump sum), crediting rate %, payout length (years).

## Engine — `lib/calculators/annuityEngine.ts`
- Payout = level-payment formula `P·r/(1−(1+r)^−n)` — the mirror of loan amortization,
  so it **reuses `amortizationEngine`** (no duplicate math).
- Returns monthly/annual payout, total payout, interest earned, payout multiple,
  `payoutByTerm` series, and a premium-vs-interest `breakdown`.
- 8 tests passing (formula match, 0% case, total≈monthly×n within rounding, interest,
  longer term → smaller payment, higher rate → bigger payout, multiple, guards).

## Note on rounding
`totalPayout` is derived from the precise (unrounded) monthly figure for accuracy, so
it can differ from `roundedMonthly × n` by a few dollars — the test allows for this.

## Live data
None — annuity crediting rates are product/insurer-specific, so the default rate is
illustrative. No live badge. Strong disclaimer about product types (lifetime vs
period-certain, fixed vs variable), fees, and surrender charges.

## Visuals
- `ImpactLineChart` — monthly payout by payout length, reference line on chosen term.
- `BreakdownBarChart` — premium returned vs interest earned.

## Page copy
All numbers derive from one worked example (`$500k premium, 5%, 20yr`).

## Status
- ✅ Engine + 8 tests passing
- ✅ tsc clean (own files) · eslint clean
- ✅ Page renders 200
