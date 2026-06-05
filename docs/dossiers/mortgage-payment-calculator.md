# Dossier — Mortgage Payment Calculator

**Slug:** `mortgage-payment-calculator` · **Category:** Finance & Loans
**Volume:** ~201k/mo · **Owner:** A (Cursor) · **Pattern:** Flagship custom-loader + Insight Kit

## Identity
The full **PITI** payment tool — Principal, Interest, Taxes, Insurance, plus PMI
and HOA — answering "what will I *actually* pay per month?" rather than the P&I-only
figure most calculators stop at. Distinct from `amortization-calculator` (schedule)
and `mortgage-calculator` (affordability/scenarios): this one nails the true monthly cost.

## Inputs
| Field | Default | Range | Notes |
|---|---|---|---|
| Home price | $400,000 | 10k–10M | Purchase price |
| Down payment % | 20% | 0–50% | <20% triggers PMI; shows LTV + $ down |
| Interest rate (APR) | **live** 30-yr fixed (`fredBenchmarks.mortgage30yr`) | 0–15% | Stamped "as of" |
| Term (years) | 30 | 5–40 | 15/20/30 common |
| Property tax rate | 1.1%/yr | 0–4% | US median ≈0.9–1.1% (Tax Foundation 2024) |
| Home insurance | $1,800/yr | 0–50k | US avg ≈$1,700–2,000 (NAIC 2024–25) |
| HOA dues | $0/mo | 0–5k | Optional |

PMI default 0.5%/yr of loan (typical 0.3–1.5%), applied only while down < 20%.

## Formulas (engine: `lib/calculators/mortgagePaymentEngine.ts`)
```
loan = price − price·down%
P&I  = calculateAmortization(loan, rate, term).monthlyPayment   ← reuses amortization engine
tax/mo = price·taxRate/12 ; ins/mo = insAnnual/12
PMI/mo = down<20% ? loan·pmiRate/12 : 0
total = P&I + tax + ins + PMI + HOA
```
Guards: price≤0 or term≤0 → all-zero result. paymentByDownPayment series at 3/5/10/15/20/25/30%.

## Live data
- **Source:** FRED `MORTGAGE30US` via `fredBenchmarks.mortgage30yr`.
- Default rate + **all page copy** (stat chips, FAQ, content cards, InsightStrip, hero)
  computed at render from a `$400k / 20% down / 30yr / live-rate` example (plus a 10%-down
  variant to quantify PMI), each stamped `(AS_OF)`. Auto-updates with the weekly FRED pull.

## Insights (in-component)
- P&I as a share of true PITI payment.
- PMI: cost/mo + the $ down needed to hit 20% and remove it (or "no PMI" when ≥20%).
- Escrow (tax + insurance + HOA) added per month.
- Live-rate provenance with "as of" stamp.

## Visuals
- `BreakdownBarChart` — monthly components (P&I, tax, insurance, PMI, HOA).
- `ImpactLineChart` — total payment vs down-payment %, with a **vertical reference line
  at 20%** (the PMI cliff). Added an optional `referenceX`/`referenceXLabel` prop to the
  shared `ImpactLineChart` for this (backward-compatible).

## Status
✅ Engine reuses amortization · 8 tests · live FRED 30-yr default · copy synced + auto-updating · dossier added.
