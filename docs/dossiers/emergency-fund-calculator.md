# Dossier — Emergency Fund Calculator

**Slug:** `emergency-fund-calculator`
**Category:** finance / savings
**Status:** flagship (custom UI)
**Architecture note:** This is a **bespoke client component** (recharts area chart, expense
breakdown, what-if buttons), not the shared `CalculatorEngine`. It uses its own pure engine
`lib/calculators/emergencyFundEngine.ts` and renders its own visuals — it does **not** go through
the `LiveInsightBlock` generator registry.

## Live data layer (added in flagship audit)

- **FRED CPI (YoY inflation)** via `getCpiInflationYoY()`:
  - `inflationDriftPerYear` — extra dollars needed next year to keep the same months of coverage.
  - `annualHysaInterest` — interest the target earns in a representative HYSA (`HYSA_APY = 4.4%`).
  - `hysaCoversInflation` — whether HYSA interest offsets the inflation drift.
  - Surfaced as a **live-stamped "Where to keep it"** card in the results (live CPI dot + rate).

## Fields

7 essential monthly expenses (rent, food, utilities, transport, insurance, subscriptions, other),
`targetMonths` (1/3/6/9/12), `currentSavings`, `monthlySavingsRate`.

## Outputs

`totalMonthlyExpenses`, `targetAmount`, `amountNeeded`, `currentCoverageMonths`, `isFullyFunded`,
`monthsToGoal`, `completionDate`, `fundingPct`, `savingsProgress[]`, `expenseBreakdown[]`,
+ `inflationDriftPerYear`, `annualHysaInterest`, `hysaCoversInflation`.

## Formula

```
Total monthly = Σ expenses
Target        = Total monthly × target months
Coverage (mo) = Current savings / Total monthly
Needed        = max(0, Target − Current)
Months to goal= ceil(Needed / Monthly rate)
Drift/yr      = Target × inflation       (live CPI)
HYSA int/yr   = Target × 4.4%
```

## Worked example (defaults, CPI 3.2%)

expenses $2,800/mo · 6-month target **$16,800** · current $2,000 → needed **$14,800** ·
coverage 0.7 mo · HYSA interest **~$739/yr** vs inflation drift **~$538/yr** → fund holds real value.

## UX

Hybrid auto-reveal: staged loader plays once on mount, results then update live as inputs change
(consistent with the engine-based flagships). Legacy `<InsightTable>` removed from the page.

## Invariants (16 tests)

expense sum · target = sum × months · needed floored at 0 · overfunded → fully funded / 100% ·
coverage = savings/expenses · months-to-goal = ceil(needed/rate) · null path when rate 0 ·
fundingPct capped 100 · breakdown excludes zeros & ~sums to 100 · progress monotonic, ≤ target,
reaches target within window · all-zero expenses safe · HYSA interest = target×APY · drift scales
with CPI · hysaCoversInflation flips at the crossover · inflation defaults when no data arg.

## Files

- `lib/calculators/emergencyFundEngine.ts` (+ `.test.ts`)
- `app/tools/emergency-fund-calculator/EmergencyFundCalculator.tsx` (custom UI, auto-reveal, live card)
- `app/tools/emergency-fund-calculator/EmergencyFundCalculatorLoader.tsx`
- `app/tools/emergency-fund-calculator/page.tsx` (legacy InsightTable removed, SEO synced)
