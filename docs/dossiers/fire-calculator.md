# Calculator Build Dossier — `fire-calculator`

> Single source of truth for building the FIRE Calculator to flagship standard.

---

## 1. Identity & intent

- **Slug:** `fire-calculator` (page at `/tools/fire-calculator`)
- **Label:** FIRE Calculator
- **Category:** finance (Archetype C — compounding)
- **Audience / search intent:** People who want to know their exact FIRE number
  and how many years until they achieve financial independence — and whether they
  can accelerate it. Both serious FIRE practitioners and curious newcomers.
- **The "wow" fact:** At a 10% savings rate, you need 40+ years to reach FIRE
  regardless of income. At 50% savings rate, you need roughly 17 years — also
  regardless of income. That counterintuitive fact (savings rate matters more
  than salary) is the core insight this calculator delivers. Concretely: at the
  default inputs ($4,000/mo expenses, $50,000 saved, $2,000/mo invested at 7%),
  your FIRE number is $1,200,000 and you reach it in 19.6 years with a 33.3%
  savings rate — your current $50,000 already generates $167/month passively.
- **Delivery model:** single-flow.
- **Moat:** pure-math (no regional live data needed — the FIRE formulas are
  universal and dataset-independent). The moat is correctness and depth: the
  right `savingsRate` definition (FIRE standard: savings ÷ (savings + expenses)),
  a genuine month-by-month simulation (not a simplified closed-form), and 6
  outputs that answer every follow-up question immediately.

---

## 2. Fields (inputs)

| name | label | type | unit | min | max | step | default | quickPicks |
|---|---|---|---|---|---|---|---|---|
| monthlyExpenses | Monthly expenses | slider | $ | 500 | 20000 | 100 | 4000 | 2000, 3000, 4000, 6000, 10000 |
| currentSavings | Current savings | slider | $ | 0 | 500000 | 1000 | 50000 | 0, 25000, 50000, 100000, 250000 |
| monthlySavings | Monthly investment | slider | $ | 100 | 10000 | 100 | 2000 | 500, 1000, 2000, 3000, 5000 |
| annualReturn | Annual return | slider | % | 4 | 12 | 0.5 | 7 | 5, 6, 7, 8, 10 |

### Key design choices

- **`monthlyExpenses`** — the single most important input in FIRE math. It
  determines the FIRE number (× 12 × 25) AND the denominator of the savings
  rate. Reducing expenses accelerates FIRE in two ways simultaneously: lower
  target AND higher savings rate. Default $4,000/month → $1,200,000 FIRE number,
  consistent with US median household spending (BLS Consumer Expenditure Survey
  2023: ~$72,000/year ÷ 12 ≈ $6,000 but median is lower; $4,000 represents a
  lean-but-comfortable lifestyle).
- **`currentSavings`** — total invested assets (index funds, 401k, IRA, brokerage
  — not home equity or emergency cash). This seeds the compound-growth simulation
  and provides the `percentFunded` and `passiveIncomeNow` outputs immediately.
  Default $50,000 reflects a realistic early-career saver. The passiveIncomeNow
  output ($167/mo at $50k) is a motivating "you're already there, partially" signal.
- **`monthlySavings`** — monthly investment contribution. Combined with
  `monthlyExpenses`, defines the savings rate. Default $2,000/month = 33.3% of
  a $6,000 gross flow — a realistic aggressive-saver rate. QuickPicks span
  $500 (10% of $5k income) through $5,000 (high-earner scenario).
- **`annualReturn`** — expected nominal return, net of inflation. Default 7% is
  Vanguard's long-run inflation-adjusted S&P 500 estimate (Vanguard 2024 Capital
  Markets Model: 6.9–7.9% real equities). Minimum 4% is deliberately not zero;
  a 0% return scenario is an edge case but not a useful planning default. Range
  4–12% covers conservative (bonds/mixed) to optimistic (100% equities bull).

---

## 3. Outputs

| key | label | format | highlight | sublabel |
|---|---|---|---|---|
| fireNumber | FIRE number | currency | ✅ | "25× annual expenses — 4% safe withdrawal rule" |
| yearsToFire | Years to FIRE | decimal (1) | — | `At $${monthlySavings}/mo at ${annualReturn}% return` |
| savingsRate | Savings rate | decimal (1) | — | "% of total cash flow directed to investments" |
| percentFunded | Funded so far | decimal (1) | — | `$${currentSavings}k of $${fireNumber}k FIRE number` |
| yearsFasterWith500 | +$500/mo saves | decimal (1) | — | "Years faster if you add $500/month" |
| passiveIncomeNow | Passive income now | currency | — | "Monthly at 4% rule on current savings" |

---

## 4. Formulas & logic

```
// ── Constants ─────────────────────────────────────────────────────────────────
// 4% safe withdrawal rule: Bengen (1994) — 4% annual withdrawal from a
// diversified portfolio survives 30+ years historically. FIRE number = 25×
// because 1 ÷ 4% = 25. Confirmed by Trinity Study (1998): 95% success rate
// over 30-year periods at 4% withdrawal rate.
//
// 7% default return: Vanguard Capital Markets Model 2024 projects 6.9–7.9%
// nominal returns for US equities over 10 years. S&P 500 long-run inflation-
// adjusted average ≈ 7% (Morningstar / Vanguard long-run estimates).

FIRE_MULTIPLIER = 25               // 1 / 0.04 — the 4% rule
WITHDRAWAL_RATE = 0.04             // Bengen 1994 / Trinity Study 1998
DEFAULT_RETURN  = 7                // % nominal, Vanguard 2024 Capital Markets

// ── Core outputs ─────────────────────────────────────────────────────────────
fireNumber    = monthlyExpenses × 12 × FIRE_MULTIPLIER
             = monthlyExpenses × 300

savingsRate   = monthlySavings / (monthlySavings + monthlyExpenses) × 100
             // FIRE-movement standard (not contribution/income, which
             // inflates the rate and is income-dependent)

percentFunded = min(100, currentSavings / fireNumber × 100)

passiveIncomeNow = currentSavings × WITHDRAWAL_RATE / 12
                 = currentSavings × 0.04 / 12
                 // monthly passive income at 4% rule TODAY

// ── Month-by-month simulation ─────────────────────────────────────────────────
// Grows balance until ≥ fireNumber or 1200 months (100 years)
monthlyRate = annualReturn / 100 / 12

loop (months = 0; balance < fireNumber; months++):
  balance = balance × (1 + monthlyRate) + monthlySavings

yearsToFire = months / 12    (0.1-year precision; 100 when months ≥ 1200)

// ── Accelerator ───────────────────────────────────────────────────────────────
monthsWith500  = same simulation with (monthlySavings + 500)
yearsFasterWith500 = max(0, (months - monthsWith500) / 12)  (capped at 0 when already funded)
```

### Default scenario walkthrough

At defaults ($4,000/mo expenses, $50,000 saved, $2,000/mo invested, 7% return):
- `fireNumber` = $4,000 × 300 = **$1,200,000**
- `savingsRate` = 2,000 / (2,000 + 4,000) × 100 = **33.3%**
- `percentFunded` = 50,000 / 1,200,000 × 100 = **4.2%**
- `passiveIncomeNow` = 50,000 × 0.04 / 12 = **$167/month**
- `yearsToFire` ≈ **19.6 years** (month simulation; closed-form cross-check:
  n = ln((FIREnum × r + PMT) / (PV × r + PMT)) / ln(1 + r) ≈ 235 months)
- `yearsFasterWith500` ≈ **2.1 years** (with $2,500/mo → ~17.5 years)

---

## 5. Constraints & invariants

1. `fireNumber ≥ 0` always; equals 0 only when `monthlyExpenses = 0`.
2. `yearsToFire = 0` when `currentSavings ≥ fireNumber` (already at FIRE).
3. `yearsToFire = 100` when `monthlySavings = 0` and `currentSavings = 0` and
   `monthlyExpenses > 0` — unreachable at 0% without contributions (capped at
   100 = 1200 months).
4. `percentFunded` is capped at 100 — never exceeds 100 even when overfunded.
5. `savingsRate` is always in [0, 100]; equals 0 when `monthlySavings = 0`;
   approaches 100 as expenses approach 0 (but undefined at expenses = 0,
   returns 0 by convention since there is no denominator).
6. `passiveIncomeNow ≥ 0`; scales linearly with `currentSavings`.
7. Higher `monthlySavings` → fewer months (monotonicity of simulation).
8. Higher `annualReturn` → fewer months (monotonicity).
9. Lower `monthlyExpenses` → lower `fireNumber` AND fewer years (both effects
   compound: smaller target and larger effective savings rate).
10. At zero return rate (`annualReturn = 0`): years = (fireNumber − currentSavings)
    / monthlySavings / 12 — purely linear, no compounding.

---

## 6. Datasets

**No live dataset used.** The FIRE calculation is entirely mathematical — it
depends only on the four inputs and the documented universal constants (4% rule,
compound growth). There is no regional or state-level pricing variable in this
formula. Unlike energy calculators, where $/kWh varies 3× by state, the 4% rule
and compound growth math is the same everywhere in the US.

This is a deliberate archetype choice: pure-math calculators (Archetype C in
the playbook) do not need live data to be excellent. The moat is formula
correctness and output depth — six immediately useful outputs, a correct savings
rate definition, and a simulation-based timeline.

---

## 7. Insights

| id | severity | category | visual | description |
|---|---|---|---|---|
| `fire.already-there` | positive | savings | metric | Fires only when already at FIRE (progress ≥ 100%) |
| `fire.progress` | neutral | projection | **benchmark-bar** (savings vs FIRE number) | Always shown when not at FIRE; current % funded |
| `fire.passive-income-now` | positive | savings | metric | Monthly passive income from current savings |
| `fire.accelerator-500` | positive | opportunity-cost | **delta-card** (timeline before/after +$500/mo) | Fires when yearsFasterWith500 ≥ 1 |
| `fire.high-savings-rate` | positive/neutral | comparison | metric | Fires when savingsRate ≥ 33%; benchmarks vs 50% target |
| `fire.long-timeline` | neutral | projection | **projection-line** (portfolio growth curve) | Fires when yearsToFire ≥ 20 |

At least 3 insights have a visualization (benchmark-bar, delta-card,
projection-line). No live captions needed — pure-math calculator.

---

## 8. Build checklist

- [x] Pure calc module (`calculations/finance/fireCost.ts`) — correct savingsRate
      definition (FIRE standard: savings ÷ (savings + expenses)), all 6 outputs,
      `[key: string]: number` index signature
- [x] Unit tests expanded to 17 (`calculations/finance/fireCost.test.ts`)
- [x] Config block in `calculatorConfigs.ts` (4 inputs, 6 outputs, factual insight)
- [x] Insight generator upgraded (`lib/insights/generators/fireInsights.ts`):
      delta-card on accelerator-500, projection-line on long-timeline
- [x] `FireWithInsights` wrapper + `LiveInsightBlock` registry entry
- [x] Page at `app/tools/fire-calculator/page.tsx`
- [x] All static page content synced (Step 5b) — all FAQ examples recomputed
      to match formula defaults
- [x] `npx tsc --noEmit` clean, `npx vitest run calculations/finance/fireCost.test.ts` green
