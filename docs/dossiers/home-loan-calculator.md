# Dossier — Home Loan Calculator

**Slug:** `home-loan-calculator` · **Category:** Finance & Loans
**Volume:** ~74k/mo · **Owner:** A (Cursor) · **Pattern:** Flagship custom-loader + Insight Kit

## Identity
The "big picture" home-loan tool: monthly P&I, the **true lifetime cost** of the
home (price + all interest), and the **equity build-up curve** over the years.
Distinct from `mortgage-payment-calculator` (monthly PITI snapshot), `amortization-calculator`
(month/year schedule), and `house-affordability-calculator` (how much you can borrow).

## Inputs
| Field | Default | Range | Notes |
|---|---|---|---|
| Home price | $400,000 | 10k–10M | Purchase price |
| Down payment % | 20% | 0–50% | Day-one equity; smaller = more interest |
| Interest rate (APR) | **live** 30-yr fixed (`fredBenchmarks.mortgage30yr`) | 0–15% | Stamped "as of" |
| Term (years) | 30 | 5–40 | |
| Extra monthly payment | 0 | 0–20k | Optional; straight to principal |

## Formulas (engine: `lib/calculators/homeLoanEngine.ts`)
```
loan = price − price·down% ; Monthly P&I via calculateAmortization
totalOfPayments = P&I × n ; trueTotalCost = downPayment + totalOfPayments (= price + interest)
equity(year) = price − remainingBalance     (day-one equity = down payment)
yearsTo20/50Equity = first year equity ≥ 20% / 50% of price
```
Equity ignores price appreciation (conservative). Guards: price≤0 or term≤0 → zeros; no NaN.

## Live data
- **Source:** FRED `MORTGAGE30US` via `fredBenchmarks.mortgage30yr`.
- Default rate + **all page copy** (stat chips, FAQ, content cards, InsightStrip, hero)
  computed at render from a `$400k / 20% down / 30yr / live-rate` example, stamped `(AS_OF)`.
  Auto-updates with the weekly FRED pull.

## Insights (in-component)
- True total cost vs sticker price + interest as % of price (warning if ≥60%).
- Years to 50% equity (slow early build because interest is front-loaded).
- Extra-payment savings (interest + time to outright ownership) when extra > 0, else a prompt.
- Live-rate provenance, stamped "as of".

## Visuals
- `ImpactLineChart` — equity build-up by year, with a horizontal `referenceValue` at 50% of price.
- `BreakdownBarChart` — true total cost = down payment + financed principal + interest.

## Status
✅ Engine reuses amortization · 8 tests · live FRED 30-yr default · copy synced + auto-updating · dossier added.
