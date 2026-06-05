# Calculator Build Dossier — Car Payment Calculator

## 1. Identity
- **Slug:** `car-payment-calculator`
- **Route:** `/tools/car-payment-calculator`
- **Primary keyword:** "car payment calculator" · 450k/mo · KD 80 · Informational
- **One-line value:** Turn a vehicle price, down payment, trade-in, sales tax, and
  today's auto-loan APR into a real monthly payment, with total interest, an
  amortization curve, and the full cost composition.
- **Owner:** Owner B (Copilot)

## 2. Inputs
| Field | Type | Default | Notes |
|---|---|---|---|
| Vehicle condition | enum | `new` | Picks the live default APR (new vs used) |
| Vehicle price | number | 35,000 | Negotiated/sticker price |
| Down payment | number | 5,000 | Cash toward the purchase |
| Trade-in value | number | 0 | Reduces taxable amount + financed total |
| Sales tax rate | % | 7.0 | Editable default (varies widely by state/locality) |
| APR | % | **live** auto-loan rate | New = `autoLoanNew48moAPR`; used = + `usedCarPremium` |
| Loan term | months | 60 | 12–96 |

## 3. Outputs
- Monthly payment (hero).
- Amount financed, total interest, total cost of the car.
- Amortization (loan balance over the term).
- Cost composition: vehicle price, sales tax, interest.

## 4. Formulas + sources
```
salesTax       = max(0, vehiclePrice − tradeIn) × salesTaxRate/100   (trade-in credit)
amountFinanced = max(0, vehiclePrice + salesTax − downPayment − tradeIn)
r              = APR/100/12
monthlyPayment = amountFinanced × r / (1 − (1+r)^−n)     (r=0 ⇒ amountFinanced/n)
totalLoanPaid  = monthlyPayment × n
totalInterest  = totalLoanPaid − amountFinanced
totalCost      = vehiclePrice + salesTax + totalInterest
```
- Standard loan amortization (time value of money). No external data beyond the rate.
- **APR default is live:** `fredBenchmarks.autoLoanNew48moAPR` (FRED TERMCBAUTO48NS),
  with `usedCarPremium` added for used vehicles. "As of"-stamped via
  `currentPeriodLabel` / `lastUpdated`. Sales tax is a user-editable default (no live
  sales-tax series exists; **flag Owner A** if one is wanted).

## 5. Invariants / guardrails
- `totalInterest = totalLoanPaid − amountFinanced` (always, ≥ 0).
- Zero APR → total interest is 0; payment = amountFinanced / term.
- Higher APR or longer term → more total interest.
- Larger down payment / trade-in → smaller amount financed and payment.
- Amortization balance is monotonically non-increasing and ends at ~0.
- All outputs finite for NaN/empty inputs; APR, tax, term clamped.

## 6. Live datasets
- **`lib/datasets/finance/fredBenchmarks.ts`** → `autoLoanNew48moAPR`, `usedCarPremium`.
  Used as the editable default APR and surfaced as a dated stat. No runtime fetch.

## 7. Insights
- Total interest as the "cost of financing" on top of the sticker price.
- How the loan term trades a lower monthly payment for more total interest.
- Share of the all-in cost that is interest vs tax vs price.

## 8. Visuals
- `ResultHeroCard`: monthly payment, with financed / interest / total-cost sub-stats.
- `ImpactLineChart`: loan balance over the term (amortization).
- `BreakdownBarChart`: vehicle price vs sales tax vs interest.

## 9. Build checklist
- [x] Pure engine `lib/calculators/carPaymentEngine.ts` + ≥6 Vitest tests
- [x] Client component using Insight Kit
- [x] Dynamic `ssr:false` loader
- [x] Server `page.tsx` with metadata, hero, SEO block, FAQ, JSON-LD, dated live APR
- [x] `npx tsc --noEmit`, lint, tests green
