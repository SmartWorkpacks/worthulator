# Dossier — WFH Savings Calculator

**Slug:** `wfh-savings-calculator`
**Archetype:** Engine-config flagship (`WfhSavingsWithInsights`).
**Live data:** N/A — pure savings calculator; 7% invested-return injected via `data`.

## Identity / promise
Quantify the real financial value of working from home: avoided commute + food
costs, hours of life reclaimed, and the 10-year value if those savings are
invested rather than absorbed by lifestyle inflation. Clever under the surface
(after-tax-vs-gross-salary equivalence, invested-savings projection, time→money);
simple on top (four sliders).

## Fields
- **dailyCommuteCost** · **officeDays** (normally commuted) · **dailyFood** · **commuteMinutes** (one-way, doubled).

## Formulas
- yearlySavings = (commute + food) × officeDays × 52
- timeSavedHours = commuteMinutes × 2 × officeDays × 52 ÷ 60
- tenYearSavings = yearly × 10 ; investedSavings10yr = yearly × ((1.07^10−1)/0.07)
- hourlyValueRecovered = yearly ÷ timeSavedHours

## Insights / visuals (`wfhSavingsInsights`)
Annual savings (benchmark-bar after-tax vs gross-salary equivalent), time
recovered, invested-savings (delta-card direct vs invested), office food cost
stack. 4 rules.

## Step 5c
Config now returns the full output set (`tenYearSavings`, `investedSavings10yr`,
`hourlyValueRecovered`) — previously the invested-savings insight never fired and
the time insight showed $0/hr. SEO worked example recomputes from default inputs.

## Status
✅ Pure module `calculations/work/wfhSavings.ts` + 12 tests · config delegates to
it (feeds all insight outputs) · wired via `WfhSavingsWithInsights` (was
unrendered) · Step 5c worked example · dossier added.
