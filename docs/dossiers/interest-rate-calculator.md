# Interest Rate Calculator — Dossier

**Slug:** `interest-rate-calculator`
**Owner:** A (Cursor)
**Category:** Finance / Loans
**Intent:** Commercial — "what interest rate am I actually paying?"

## What it does
The inverse of an amortization calc: given loan amount, monthly payment, and term,
it solves for the implied interest rate (APR), then shows total paid, total interest,
and how the implied rate shifts with the monthly payment.

## Differentiation
- vs `loan-payment-calculator` / `amortization-calculator`: those go rate → payment.
  This goes **payment → rate** (reverse solver). Cross-linked both ways.
- vs `apr-calculator`: APR calc folds in fees; this solves the pure loan rate.

## Inputs
- Loan amount, monthly payment, term (years).

## Engine — `lib/calculators/interestRateEngine.ts`
- No closed-form solution → **bisection** on the monthly rate (payment is strictly
  increasing in rate, so bisection is reliable; 200 iters, 1e-12 tolerance).
- Handles edge cases: `M = P/n` → 0%; `M < P/n` → `paymentTooLow` flag (loan can
  never amortize).
- Returns APR, monthly rate, total paid, total interest, interest % of principal,
  `rateByPayment` series, and a principal-vs-interest breakdown.
- 8 tests passing, including **round-trip** checks against `amortizationEngine`
  (solve a rate, feed it back, recover the original payment).

## Live data
None — this is a pure solver. No live badge.

## Visuals
- `ImpactLineChart` — implied APR across a band of monthly payments, reference line
  on the user's payment (hidden when paymentTooLow).
- `BreakdownBarChart` — principal vs interest.

## Page copy
All numbers derive from one worked example (`$25k, $500/mo, 5yr`).

## Status
- ✅ Engine + 8 tests passing (incl. amortization round-trip)
- ✅ eslint clean · page renders 200
