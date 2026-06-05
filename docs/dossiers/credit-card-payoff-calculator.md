# Dossier — Credit Card Payoff Calculator

**Slug:** `credit-card-payoff-calculator`
**Archetype:** Engine-config flagship (`EngineWithInsights`).
**Live data:** N/A — pure amortisation (user supplies balance / APR / payment).

## Identity / promise
How long until the card is clear, and what the debt really costs. Clever under
the surface (month-by-month interest accrual, daily-drain framing, first-month
interest, interest-to-balance ratio); simple on top (three sliders).

## Fields
- **balance** · **apr** · **payment** (fixed monthly, above minimum).

## Formulas
- Loop monthly: interest = balance × (apr/12); balance += interest − payment.
- months counted until balance ≤ 0 (600-month / 50-yr safety cap).
- interest = Σ monthly interest ; totalPaid = interest + balance.
- dailyInterestCost = balance × apr ÷ 365 ; monthlyInterestFirst = balance × apr/12.
- interestToBalanceRatio = interest ÷ balance ; payoffYears = months ÷ 12.

## Insights / visuals (`creditCardPayoffInsights`)
Headline payoff timeline, daily interest drain, the cost of paying only the
minimum, and the payment-increase leverage.

## Step 5c
SEO/FAQ/stat/content figures (e.g. $100/mo → 11.4 yrs / $8,678 interest; $300/mo
→ 21 mo / $1,022) are recomputed at render time via `calculateCreditCardPayoff`
on a $5,000 @ 22% example — previously hardcoded and inaccurate.

## Status
✅ Pure module `calculations/finance/creditCardPayoff.ts` + 14 tests · config
delegates to it · wired via `EngineWithInsights` (was unrendered) · Step 5c
worked examples · dossier added.
