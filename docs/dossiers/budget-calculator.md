# Dossier — Budget Calculator

> **Slug:** `budget-calculator` · **Domain:** finance · **Engine:** single-flow config
> **Calc core:** `calculations/finance/budget.ts` (+ test, 18 tests)
> **Insights:** `lib/insights/generators/budgetInsights.ts`
> **Status:** Flagship · live sales-tax layer

---

## 1. Identity

Breaks take-home pay into the **50/30/20** framework (needs / wants / savings),
shows the savings rate vs the 20% target, and reveals the **sales tax hidden in
spending** using the state's live combined rate. Replaces the old version, which
only output `leftover` and left the insight generator running on zeros.

## 2. Live data layer

| Layer | Source | Getter | Use |
|---|---|---|---|
| Combined sales tax % + grocery rule | Tax Foundation 2026 (`salesTaxRates.ts`) | `SALES_TAX_RATE_BY_NAME`, `SALES_TAX_RATES[].groceryExempt` | Estimates tax on taxable spending; grocery-exempt states drop food from the base |

## 3. Fields

| Field | Type | Default | Notes |
|---|---|---|---|
| state | dropdown | US Average | Drives the sales-tax layer + grocery rule |
| income | slider $500–20k | 5,000 | Monthly take-home |
| housing | slider | 1,500 | Need (rent/mortgage + utilities) |
| food | slider | 600 | Need; taxable only where groceries are taxed |
| transport | slider | 400 | Need |
| debt | slider | 300 | Need (minimum payments) |
| other | slider | 500 | Wants / discretionary — always taxable |

## 4. Formulas / constants

```
MARKET_RETURN = 0.07
totalExpenses = housing + food + transport + debt + other
leftover      = income − totalExpenses
savingsRate   = leftover / income × 100
needs = housing+food+transport+debt ; wants = other
needsTarget=0.5·income ; wantsTarget=0.3·income ; savingsTarget=0.2·income
gapTo20 = max(0, savingsTarget − max(0,leftover))

taxableMonthly  = other + (groceryExempt ? 0 : food)
salesTaxAnnual  = taxableMonthly × rate/100 × 12
tenYearIfInvested = fvAnnuity(annualLeftover, 10) @ 7%
```

## 5. Worked example (defaults: $5,000, US-avg 7.12%, groceries taxed)

| Output | Value |
|---|---|
| Total expenses | $3,300 |
| **Leftover** | **$1,700** |
| Savings rate | 34% |
| Expense ratio | 66% (needs 56% · wants 10%) |
| Housing ratio | 30% |
| Sales tax in spending | ~$940/yr (~$78/mo) |
| Surplus invested 10 yr | ~$281,855 |

## 6. Invariants (tested)

- expenseRatio + savingsRate = 100; annualLeftover = leftover×12.
- Overspending → negative leftover & savings rate.
- needs/wants/targets follow 50/30/20; gapTo20 ≥ 0, 0 when above target.
- grocery-exempt state excludes food → lower sales tax; rate 0 → 0 tax.
- Monotonic: ↑rate → ↑tax; cutting an expense → ↑leftover.
- tenYearIfInvested = 0 when overspending; all outputs finite.

## 7. Insights (live-captioned)

savings-rate vs 4.6% US avg benchmark-bar · housing ratio · debt burden ·
surplus compound projection-line · gap-to-20% · **50/30/20 needs benchmark-bar** ·
**live sales-tax delta-card** (Tax Foundation 2026 caption).
