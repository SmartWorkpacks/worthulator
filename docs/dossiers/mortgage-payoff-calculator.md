# Dossier — Mortgage Payoff Calculator

**Slug:** `mortgage-payoff-calculator` · **Category:** Finance & Loans
**Volume:** ~50k/mo · **Owner:** A (Cursor) · **Pattern:** Flagship custom-loader + Insight Kit

## Identity
For an **existing** mortgage: how much sooner can you be mortgage-free, and how much
interest do you save, via extra monthly payments, a one-time lump sum, and/or biweekly
payments. Distinct from amortization (schedule), mortgage-payment (monthly PITI on a new
buy), home-loan (lifetime cost/equity). The acceleration/payoff angle (biweekly + lump sum).

## Inputs
| Field | Default | Range | Notes |
|---|---|---|---|
| Current balance | $280,000 | 1k–10M | Remaining principal, not original loan |
| Interest rate (APR) | **live** 30-yr fixed (`fredBenchmarks.mortgage30yr`) | 0–15% | Stamped "as of" |
| Years remaining | 25 | 1–40 | Establishes baseline payment |
| Extra monthly | $200 | 0–50k | Added to principal each month |
| Lump sum | $0 | 0–5M | Applied to principal now |
| Biweekly | off | toggle | ≈ one extra monthly payment/yr |

## Formulas (engine: `lib/calculators/mortgagePayoffEngine.ts`)
```
monthlyPayment = calculateAmortization(balance, rate, yearsRemaining).monthlyPayment
baseline  = simulate(balance, r, monthlyPayment)                       (FIXED payment)
biweeklyExtra = biweekly ? monthlyPayment/12 : 0
accel     = simulate(balance − lumpSum, r, monthlyPayment + extra + biweeklyExtra)
monthsSaved = baseline.months − accel.months ; interestSaved = baseline.int − accel.int
savingsByExtra: months saved at extra ∈ {0,50,100,200,300,500}
```
**Key:** a lump sum reduces the starting balance but keeps the SAME payment (that's what
accelerates payoff) — so we simulate at a fixed payment, not via the amortization recompute.
Guards: balance/term ≤ 0 → zeros; payment ≤ interest → non-amortizing handled; 0% rate ok; no NaN.

## Live data
- **Source:** FRED `MORTGAGE30US` via `fredBenchmarks.mortgage30yr`.
- Default rate + **all page copy** (stat chips, FAQ, content cards, InsightStrip, hero)
  computed at render from a `$280k / 25yr / live-rate / +$200`-mo example (plus a biweekly-only
  variant), stamped `(AS_OF)`. Auto-updates with the weekly FRED pull.

## Insights (in-component)
- Time saved (new vs baseline payoff) and interest saved + %.
- Biweekly explainer when enabled.
- Baseline framing when no plan is set yet.
- Live-rate provenance, stamped "as of".

## Visuals
- `ImpactLineChart` — months saved by extra-monthly amount, vertical `referenceX` at the user's extra.
- `BreakdownBarChart` — total interest: current plan vs payoff plan.

## Status
✅ Engine reuses amortization (payment) + fixed-payment sim · 8 tests · live FRED 30-yr default · copy synced + auto-updating · dossier added.
