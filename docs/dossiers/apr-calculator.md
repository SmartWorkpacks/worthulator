# APR Calculator — Dossier

**Slug:** `apr-calculator`
**Owner:** A (Cursor)
**Category:** Finance / Loans
**Intent:** Commercial — "what's the true cost of this loan including fees?"

## What it does
Computes the true APR of a loan by folding upfront fees/points into an effective
annual rate, and contrasts it with the note (interest) rate. Shows the APR premium,
net amount received, total cost, and how APR rises as fees increase.

## Differentiation
- **vs `interest-rate-calculator`**: that solves rate from a payment (no fees). This
  folds **fees** into the rate to get the legally-disclosed APR. Cross-linked.

## Inputs
- Loan amount, note rate, term, total upfront fees & points.

## Engine — `lib/calculators/aprEngine.ts`
- Payment computed on the full loan at the note rate (reuses `amortizationEngine`).
- Net received = loan − fees. APR = the rate that amortizes the **net** to the same
  payment, solved by **bisection**, × 12.
- Returns APR, note rate, APR premium, monthly payment, net received, total payments,
  total interest, total cost, `aprByFees` series, interest-vs-fees breakdown.
- 8 tests passing (no-fee → APR=note, fees raise APR, monotonic in fees, net received,
  payment matches amortization, **round-trip** APR→amortize(net)→same payment, guards).

## Live data
Default note rate = live `fredBenchmarks.mortgage30yr`, "as of"-stamped.

## Visuals
- `ImpactLineChart` — APR by fee amount, reference line on the user's fees.
- `BreakdownBarChart` — interest vs upfront fees.

## Page copy
All numbers derive from one live worked example (`$300k, mortgage30yr, $6k fees, 30yr`).

## Status
- ✅ Engine + 8 tests passing (incl. amortization round-trip)
- ✅ eslint clean
- ⏳ Live render check pending (dev server was stopped)
