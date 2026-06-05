# Dossier — Car Affordability Calculator

**Slug:** `car-affordability` (route `/tools/car-affordability-calculator`)
**Archetype:** Engine-config + live insights (`EngineWithInsights`).
**Live data:** N/A — user supplies income, term, and rate.

## Identity / promise
Maximum car payment, loan amount, and target price from income (15% rule)
with real annuity math — plus insights on the true cost of ownership, total
interest, the 20/4/10 rule, and the opportunity cost of the payment.

## Fields
- **monthlyIncome** · **loanTermMonths** · **annualRate**.

## Formulas
- maxMonthlyPayment = income × 0.15.
- maxLoanAmount = payment × (1 − (1+r)^−n) ÷ r (PV of annuity).
- recommendedCarPrice = loan ÷ 0.80 (20% down).

## Insights / visuals (`carAffordabilityInsights`)
1. Headline affordability — benchmark-bar payment vs income.
2. True cost of ownership — delta-card adding ~$375/mo (insurance/fuel/maint).
3. Total interest over the term (debt-burden).
4. 20/4/10 term warning when term > 48 months.
5. Opportunity cost — payment invested 10yr at 7%, projection-line.

## Status
✅ Generator `carAffordabilityInsights` + export + registry entry · page rewired
from static `InsightsSection` to `EngineWithInsights` (live cards) · dossier added.
Follow-up (option b): pure module + tests + Step 5c worked examples.
