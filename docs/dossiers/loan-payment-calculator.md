# Dossier — Loan Payment Calculator

**Slug:** `loan-payment-calculator` · **Category:** Finance & Loans
**Volume:** ~110k/mo · **Owner:** A (Cursor) · **Pattern:** Flagship custom-loader + Insight Kit

## Identity
The general-purpose installment-loan tool: monthly payment, total interest, and
payoff for any fixed-rate loan. Differentiated from `amortization-calculator`
(schedule) and `mortgage-payment-calculator` (PITI) by **loan-type presets that
load live FRED APRs** and a **payment-by-term comparison** (the core borrowing decision).

## Inputs
| Field | Default | Range | Notes |
|---|---|---|---|
| Loan type | Personal | personal / auto-new / auto-used / mortgage / custom | Preset sets live APR + typical term/amount |
| Loan amount | $25,000 | 500–5M | |
| Interest rate (APR) | **live** by type (`fredBenchmarks`) | 0–30% | personal 12.3% / auto-new 7.9% / auto-used ≈11.3% / mortgage 6.7% (Q1 2026) |
| Term (years) | 5 | 1–40 | Biggest cost lever |
| Extra monthly payment | 0 | 0–20k | Optional; straight to principal |

Editing rate/amount/term flips the type to "Custom".

## Formulas (engine: `lib/calculators/loanPaymentEngine.ts`)
```
M = P·r / (1 − (1+r)^−n)   (reuses calculateAmortization for P&I, totals, extra-payment)
paymentByTerm: recompute M + total interest at terms {2,3,4,5,6,7} ∪ {chosen}
```
Guards inherited from the amortization engine (P≤0 / n≤0 → zeros; no NaN).

## Live data
- **Source:** FRED via `fredBenchmarks` — `personalLoan24moAPR` (TERMCBPER24NS),
  `autoLoanNew48moAPR` (TERMCBAUTO48NS), used-car = new + documented premium, `mortgage30yr` (MORTGAGE30US).
- Preset defaults + **all page copy** (stat chips, FAQ, content cards, InsightStrip)
  computed at render from `$25k / personal-rate / 5yr` (plus a 3-yr variant for the term
  trade-off), stamped `(AS_OF)`. Auto-updates with the weekly FRED pull.

## Insights (in-component)
- Total interest + % of principal.
- Term trade-off: payment delta vs interest saved choosing the next-shorter term.
- Extra-payment savings (interest + time) when extra > 0, else a prompt.
- Live-rate provenance for the selected loan type, stamped "as of".

## Visuals
- `ImpactLineChart` — monthly payment by term, with a vertical `referenceX` at the chosen term.
- `BreakdownBarChart` — principal vs total interest.

## Status
✅ Engine reuses amortization · 8 tests · live FRED APR presets · copy synced + auto-updating · dossier added.
