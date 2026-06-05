# Dossier — Amortization Calculator

**Slug:** `amortization-calculator` · **Category:** Finance & Loans
**Volume:** ~246k/mo · **Owner:** A (Cursor) · **Pattern:** Flagship custom-loader + Insight Kit

## Identity
The definitive "what's my monthly payment and how much interest will I really pay"
tool for any fixed-rate, fully-amortizing loan (mortgage, auto, personal, student).
Leads with the monthly payment, then exposes the lifetime interest, the year-by-year
balance curve, the principal-vs-interest split, and the savings from extra payments.

## Inputs
| Field | Default | Range | Notes |
|---|---|---|---|
| Loan amount | $300,000 | 1k–5M | Principal (price − down payment) |
| Interest rate (APR) | **live** 30-yr fixed (`fredBenchmarks.mortgage30yr`) | 0–15% | Stamped "as of" `currentPeriodLabel` |
| Term (years) | 30 | 1–40 | 15/20/30 most common |
| Extra monthly payment | 0 | 0–20k | Optional; straight to principal |

## Formulas (engine: `lib/calculators/amortizationEngine.ts`)
```
r = APR/100/12 ; n = years×12
M = P·r / (1 − (1+r)^−n)        (r=0 → M = P/n)
monthly: interest = balance·r ; principal = payment − interest ; balance −= principal
totalInterest = (M·n) − P
```
Extra payment: re-simulate with payment = M + extra → payoffMonths, interestSaved, monthsSaved.
Guards: P≤0 or n≤0 → zeros; payment ≤ interest → bails (no infinite loop / NaN).

## Live data
- **Source:** FRED `MORTGAGE30US` via `lib/datasets/finance/fredBenchmarks.ts` (`mortgage30yr`).
- **Default rate** loads from it; **all page copy** (stat chips, FAQ, content cards,
  InsightStrip, hero) is computed at render from a `$300k / 30yr / live-rate` worked
  example and stamped `(AS_OF)` — so it refreshes automatically with the weekly FRED pull.

## Insights (in-component)
- Total interest + % of principal (warning if ≥50%).
- First-year interest vs principal (early payments are interest-heavy).
- Extra-payment savings (interest saved + time saved) when extra > 0, else a prompt.
- Live-rate provenance line with "as of" stamp.

## Visuals
- `ImpactLineChart` — remaining balance by year.
- `BreakdownBarChart` — principal vs total interest.

## Status
✅ Engine + 8 tests · live FRED 30-yr default · page copy synced + auto-updating · dossier added.
