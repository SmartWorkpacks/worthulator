# Dividend Calculator — Dossier

**Slug:** `dividend-calculator`
**Owner:** A (Cursor)
**Category:** Finance / Investing
**Intent:** Informational — "how much dividend income will this generate?"

## What it does
Projects the INCOME from a dividend-paying investment: year-1 annual/monthly income,
how it grows as the company raises its payout, yield on cost over time, total
dividends collected, and final value — with an optional DRIP (reinvest) toggle.

## Differentiation
- **vs `drip-calculator`**: DRIP focuses on reinvestment-vs-cash and final portfolio
  value. This tool's hero is the **income stream and yield on cost**. Copy + an FAQ
  explicitly contrast the two and cross-link.

## Inputs
- Investment amount, dividend yield, dividend growth rate, share-price growth,
  years held, reinvest (DRIP) toggle.

## Engine — `lib/calculators/dividendEngine.ts`
- Annual model: `priceₜ = price₀(1+gPrice)^(t−1)`, `dpsₜ = dps₀(1+gDiv)^(t−1)`,
  `incomeₜ = shares·dpsₜ`; reinvest buys `incomeₜ/priceₜ` shares.
- Returns year-1 income (annual + monthly), final annual income, total dividends,
  yield on cost %, final value (reinvest-aware), total return, `incomeByYear` curve,
  and a dividends-vs-appreciation `returnBreakdown`.
- 8 tests passing (year-1 income, monthly split, flat-case total, growth lifts final
  income, reinvest > cash, yield-on-cost rises with growth, monotonic series, guards).

## Live data
None — dividend yield and growth are holding-specific, so defaults are clearly
illustrative (3.5% yield / 6% growth, "e.g. SCHD"). No live badge.

## Visuals
- `ImpactLineChart` — annual dividend income by year.
- `BreakdownBarChart` — dividends collected vs price appreciation.

## Page copy
All numbers derive from one worked example (`$100k, 3.5% yield, 6% growth, 4% price, 20yr, DRIP`).

## Status
- ✅ Engine + 8 tests passing
- ✅ tsc clean · eslint clean
- ✅ Page renders 200
