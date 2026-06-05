# Dossier — Debt Payoff Calculator

> **Slug:** `debt-payoff-calculator`
> **Domain:** finance · **Engine:** custom multi-debt React calculator (`app/tools/debt-payoff-calculator/DebtPayoffCalculator.tsx`)
> **Calc core:** `lib/calculators/debtPayoffEngine.ts`
> **Status:** Flagship (multi-debt; not the single-flow engine pattern)

---

## 1. Identity

Models payoff of **up to 6 debts** simultaneously using three strategies —
**avalanche** (highest interest first), **snowball** (lowest balance first), and
**minimum-only** — with optional extra monthly payment and a one-time lump sum.
Runs a full month-by-month simulation and always computes a minimum-only baseline
so the user sees **interest saved** and **months saved** versus doing nothing extra.

This is intentionally **not** a single-flow engine calculator: a debt list with
per-row balance/APR/minimum can't be expressed as a flat slider config, and the
custom UI already renders rich results (hero debt-free date, burn-down chart,
payoff order, what-if buttons). The flagship upgrade keeps that UI and adds: a
**live FRED credit-card APR default**, a **tested engine**, and **accurate copy**.

## 2. Live data layer

| Layer | Source | Use |
|---|---|---|
| Credit-card APR | FRED `TERMCBCCALLNS` via `getCreditCardAPR()` (`fredBenchmarks.ts`) | Default APR for the seeded "Credit card" debt row, so the calculator opens at the **current** average rate (~21.5%, Q1 2026), not a stale guess. User overrides per row. |

The car-loan row keeps a representative 6.5% (secured rates are individual and not
a single national series we model here).

## 3. Field design

| Field | Type | Default | Rationale |
|---|---|---|---|
| Debts (1–6) | repeatable {name, balance, APR, min} | CC $5,000 @ live APR, $100 min · Car $12,000 @ 6.5%, $220 min | Real households carry a *mix*; per-row APR is what makes avalanche vs snowball meaningful. |
| Strategy | select | avalanche | Avalanche is math-optimal; snowball is behaviour-optimal; minimum is the do-nothing baseline. |
| Extra monthly | slider $0–2,000 | $200 | The single biggest lever; rolls into the priority debt on top of freed minimums. |
| Lump sum | slider $0–50,000 | $0 | Tax refund / bonus applied immediately. |

## 4. Formulas / mechanics

```
Monthly interest (per debt) = Balance × (APR / 100 / 12)
Balance += Monthly interest
Payment  = min(Balance, Minimum)         # minimums applied to every debt
Balance -= Payment

Priority (avalanche) = sort active debts by APR desc
Priority (snowball)  = sort active debts by Balance asc

Freed minimum: when a debt hits $0, its minimum is added to the pool of extra
money attacking the priority debt next month (the "snowball" rollover).

Extra pool each month = extraMonthly + (sum of freed minimums)
  → applied to the priority debt(s) until exhausted.
  (minimum-only strategy does NOT roll freed payments — money returns to pocket,
   which is the realistic baseline and what makes "interest saved" meaningful.)

Lump sum: applied once at month 0, split evenly across the debts.

Interest saved = minimumOnly.totalInterest − strategy.totalInterest
Months saved   = minimumOnly.months − strategy.months
Safety cap: 600 months (50 yr).
```

**Modeling note (important for copy accuracy):** minimums are **fixed dollar
amounts**, not a declining % of balance. So a fixed $200/mo on $10,000 clears in
~128 months — *not* the 20–30 years quoted for percentage-based minimums. All
page copy reflects the fixed-minimum model the engine actually runs.

## 5. Worked example (default inputs, CC @ 21.5% Q1 2026)

CC $5,000 @ 21.5% / $100 min + Car $12,000 @ 6.5% / $220 min, **+$200 extra, avalanche**:

| Output | Value |
|---|---|
| Debt-free | **43 months** (Jan 2030) |
| Total interest (strategy) | $2,684 |
| Minimum-only months | 128 |
| Minimum-only interest | $9,999 |
| **Interest saved** | **$7,315** |
| **Months saved** | **85** |
| Payoff order | Credit card → Car loan |
| Current monthly interest burn | $155 |

(Avalanche = snowball here, since the CC is both the highest-rate *and* the
smallest-balance debt.)

## 6. Reference table (single $10,000 @ 21.5%, fixed payment, minimum-only)

| Payment | Months | Interest |
|---|---|---|
| $200/mo | 128 (~10.7 yr) | $15,474 |
| $300/mo | 52 (~4.3 yr) | $5,363 |
| $400/mo | 34 (~2.8 yr) | $3,382 |
| $500/mo | 25 (~2.1 yr) | $2,493 |

## 7. Invariants (tested)

- Higher APR → more interest; higher payment → fewer months + less interest.
- Avalanche total interest ≤ snowball total interest (math-optimal).
- Extra payment and lump sum both strictly reduce months and interest.
- Interest saved / months saved are ≥ 0 and 0 when strategy = minimum.
- Payoff order respects strategy sort (avalanche by APR, snowball by balance).
- Simulation terminates (≤ 600 months) for any solvent input.
- All numeric outputs finite; rounding stable.

## 8. Tests

`lib/calculators/debtPayoffEngine.test.ts` — known-value payoff, monotonicity
(APR, payment, extra, lump), avalanche-vs-snowball ordering & cost, freed-minimum
rollover, minimum-only baseline, interest/months saved, and termination guards.
