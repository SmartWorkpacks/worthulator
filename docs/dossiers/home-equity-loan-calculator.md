# Home Equity Loan Calculator — Dossier

**Slug:** `home-equity-loan-calculator`
**Owner:** A (Cursor)
**Category:** Finance / Loans
**Intent:** Commercial — "how much can I borrow against my home and what's the payment?"

## What it does
Sizes a home equity loan — a fixed-rate, lump-sum **second mortgage**. Computes
available equity, the maximum borrowable under an 85% combined-LTV (CLTV) cap, the
fixed monthly payment, total interest, total cost, and a payment-by-term comparison.

## Differentiation
- **vs HELOC** (`heloc-calculator`): home equity loan = fixed-rate lump sum, fixed
  payment, no payment shock. HELOC = revolving variable line with draw/repay phases.
  The copy and an insight explicitly contrast the two and cross-link.
- **vs home-equity-calculator**: that one measures equity; this one borrows against it.

## Inputs
- Home value, Mortgage balance, Loan amount, APR (fixed), Term (years).

## Engine — `lib/calculators/homeEquityLoanEngine.ts`
- `availableEquity = homeValue − mortgageBalance`
- `maxLoan = homeValue × 85% − mortgageBalance` (CLTV cap configurable)
- `exceedsMax` flag when requested > maxLoan
- Fixed payment / total interest via `amortizationEngine` (no duplicate math)
- `combinedLtvPct` after borrowing
- `paymentByTerm` series (5/10/15/20/30 yr) for the comparison chart
- 8 tests passing.

## Live data
No dedicated home-equity-loan rate exists in FRED, so the default fixed APR is
`mortgage30yr + HE_LOAN_SPREAD_OVER_MORTGAGE (2.0 pts)` — a documented spread, fully
live and "as of"-stamped via `currentPeriodLabel`. Bump the spread only if reality shifts.

## Visuals
- `ImpactLineChart` — monthly payment by term, reference line on the chosen term.
- `BreakdownBarChart` — amount borrowed vs interest.

## Page copy
All stats / FAQ / SEO numbers derive from one live worked example
(`$500k home, $250k mortgage, borrow $100k / 15yr`) so copy tracks FRED refreshes.

## Status
- ✅ Engine + 8 tests passing
- ✅ tsc clean · eslint clean
- ✅ Page renders 200
