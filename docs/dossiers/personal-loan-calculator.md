# Calculator Build Dossier — Personal Loan Calculator

## 1. Identity
- **Slug:** `personal-loan-calculator`
- **Route:** `/tools/personal-loan-calculator`
- **Primary keyword:** "personal loan calculator" · 61k/mo · KD 65 · Commercial
- **One-line value:** Turn a personal-loan amount, today's bank APR, term, and any
  origination fee into a real monthly payment, total interest, the true APR including
  the fee, and an amortization curve.
- **Owner:** Owner B (Copilot)

## 2. Inputs
| Field | Type | Default | Notes |
|---|---|---|---|
| Loan amount | number | 15,000 | Principal borrowed |
| APR | % | **live** `personalLoan24moAPR` | Commercial-bank 24-mo personal-loan rate (FRED), editable |
| Loan term | months | 36 | 6–84 |
| Origination fee | % | 0 | Deducted up front; common on personal loans (1–8%) |

## 3. Outputs
- Monthly payment (hero).
- Total interest, total repaid, origination fee ($), net cash disbursed.
- Effective APR including the fee (cost of borrowing).
- Amortization (balance over the term).
- Cost composition: principal vs interest vs origination fee.

## 4. Formulas + sources
```
r              = APR/100/12
monthlyPayment = principal × r / (1 − (1+r)^−n)     (r=0 ⇒ principal/n)
totalRepaid    = monthlyPayment × n
totalInterest  = totalRepaid − principal
originationFee = principal × originationFeePct/100
netDisbursed   = principal − originationFee
totalCost      = totalInterest + originationFee
effectiveApr   = APR implied by financing `principal` but only receiving
                 `netDisbursed` (solved by bisection on the monthly IRR)
```
- Standard loan amortization (time value of money).
- **APR default is live:** `fredBenchmarks.personalLoan24moAPR` (FRED TERMCBPER24NS,
  commercial-bank 24-month personal loan), "as of"-stamped via `currentPeriodLabel` /
  `lastUpdated`. No runtime fetch.
- Effective-APR method: the fee raises the real cost because you repay on the full
  principal while receiving less cash; solved numerically (bisection) for the rate that
  equates the payment stream to the net amount disbursed.

## 5. Invariants / guardrails
- `totalInterest = totalRepaid − principal` (always, ≥ 0).
- Zero APR + zero fee → effective APR 0; payment = principal / term.
- A non-zero origination fee makes `effectiveApr ≥ aprPct`.
- Higher APR or longer term → more total interest.
- Amortization balance is monotonically non-increasing and ends at ~0.
- All outputs finite for NaN/empty inputs; APR, fee, term clamped.

## 6. Live datasets
- **`lib/datasets/finance/fredBenchmarks.ts` → `personalLoan24moAPR`** (12.3% as of
  the dataset vintage). Editable default + dated stat. Refreshed by Owner A's script.

## 7. Insights
- Total interest as the cost of borrowing on top of the principal.
- How the origination fee lifts the effective APR above the headline rate.
- The term trade-off: lower monthly payment vs more total interest.

## 8. Visuals
- `ResultHeroCard`: monthly payment, with interest / total-repaid / effective-APR sub-stats.
- `ImpactLineChart`: loan balance over the term (amortization).
- `BreakdownBarChart`: principal vs interest vs origination fee.

## 9. Build checklist
- [x] Pure engine `lib/calculators/personalLoanEngine.ts` + ≥6 Vitest tests
- [x] Client component using Insight Kit
- [x] Dynamic `ssr:false` loader
- [x] Server `page.tsx` with metadata, hero, SEO block, FAQ, JSON-LD, dated live APR
- [x] `npx tsc --noEmit`, lint, tests green
