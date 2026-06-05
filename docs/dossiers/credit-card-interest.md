# Dossier — Credit Card Interest Calculator

**Slug:** `credit-card-interest`
**Archetype:** Engine-config flagship (`EngineWithInsights`).
**Live data:** N/A — pure amortisation.

## Identity / promise
What carrying a balance really costs: months to clear, total interest, the
share of every payment lost to interest, and a warning when the payment can't
even cover the monthly interest. Clever under the surface (impossible-payoff
detection, daily-drain framing); simple on top (three sliders).

## Fields
- **balance** · **apr** · **monthlyPayment**.

## Formulas
- Loop monthly: if payment ≤ balance × apr/12 → impossible (months = 600 cap).
- Else balance += interest − payment; count months until cleared.
- totalPaid = months × payment ; totalInterest = totalPaid − balance.
- interestOfTotal = interest ÷ totalPaid ; dailyInterestCost = balance × apr ÷ 365.

## Insights / visuals (`creditCardPayoffInsights` family)
Payoff timeline, interest share of payments, daily drain, and the
payment-too-low warning.

## Step 5c
FAQ/stat/content/InsightStrip figures ($3,000 @ $60/mo → 11.4 yrs / $5,220;
$100→$200 saves 26 months / $800; $5,000 daily drain $3.01/day) recompute at
render via `calculateCreditCardInterest` — previously hardcoded and inaccurate
(claimed 8 yrs / $2,500).

## Status
✅ Pure module `calculations/finance/creditCardInterest.ts` + 13 tests · config
delegates to it · wired via `EngineWithInsights` · Step 5c worked examples ·
dossier added.
