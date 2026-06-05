# Dossier — Savings Goal Calculator

**Slug:** `savings-goal-calculator` · **Page:** `/tools/savings-goal-calculator` · **Category:** finance
**Status:** ✅ Flagship · **Last built:** 2026-06-01

---

## 1. Identity / promise
Turn any target into a monthly deposit — accounting for growth on both the
existing balance and each contribution — and then tell the harder truth: what
the goal **really costs in future dollars** once inflation is factored in, plus
the deposit needed to actually keep pace.

## 2. Live data layer
- **FRED CPI** (`getCpiInflationYoY()`) deflates/inflates the goal:
  `inflationAdjustedGoal = goal × (1 + i)^years`, then re-solves the monthly.
- Reuses the existing FRED layer — no new dataset.

## 3. Fields
| Field | Why |
|---|---|
| Savings goal | The target. |
| Current savings | Grows on its own and reduces the required deposit. |
| Years to goal | Biggest lever on the monthly number. |
| Annual return | HYSA ~4–5% / stocks ~7–10%; growth does part of the work. |

## 4. Formula
```
PV Grown = current × (1+r)^n
Monthly  = (goal − PV Grown) × r / ((1+r)^n − 1)      r = annualReturn/12, n = years·12
Inflation-Adjusted Goal = goal × (1 + i)^years         i = live FRED CPI
```

## 5. Worked example (defaults: 20000 goal, 2000 current, 3y, 4%, CPI 3.2%)
- Monthly **$464.77** (vs **$500** with 0% return → growth saves **$35.23/mo**)
- Total deposited **$16,732**; growth **$1,268** (6.3% of goal)
- Inflation-adjusted goal **$21,982**; keep-pace deposit **$516.68/mo**

## 6. Invariants (16 tests)
- Solved monthly round-trips to the goal; zero-return → (goal−current)/n
- monthly ↓ as return/years/current ↑, ↑ as goal ↑
- growth never makes it harder than 0% path; real goal > nominal under inflation;
  real-goal monthly > nominal monthly; zeros (no NaN); already-met → 0

## 7. Insights (5, ≥1 live-captioned visual)
1. **benchmark-bar** — deposit at chosen return vs at 0%
2. **donut** — deposits vs growth vs starting balance
3. **delta-card (live CPI)** — nominal goal → inflation-adjusted goal
4. **projection-line** — balance climbing to the goal
5. out-of-pocket reality / automation nudge

## 8. Architecture
- `calculations/finance/savingsGoal.ts` (+ 16 tests, CPI injected via `data`)
- `lib/insights/generators/savingsGoalInsights.ts` → re-exported in index
- Registry entry + `SavingsGoalWithInsights.tsx`; page Step 5b synced
