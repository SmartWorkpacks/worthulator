# Dossier — Procrastination Cost Calculator

> **Slug:** `procrastination-cost` · **Domain:** work/time
> **Calc core:** `calculations/work/procrastinationCost.ts` (+ test, 15 tests)
> **Insights:** `lib/insights/generators/procrastinationCostInsights.ts`
> **Status:** Flagship · live state-wage layer (reuses BLS wages) + custom-rate override

---

## 1. Identity

Quantifies the financial cost of daily procrastination by valuing wasted work
hours at the user's **state median hourly wage**, then projects the compounded
career-long drain and the payoff of small improvements.

## 2. Live data layer

| Layer | Source | Getter | Use |
|---|---|---|---|
| Median hourly wage | BLS OEWS May 2024 via Apify (`usStateMedianWages.ts`) | `getUSStateMedianWage()` | Values lost work hours; default national ($23.11/hr) |

## 3. Fields

| Field | Type | Default | Notes |
|---|---|---|---|
| state | dropdown | National | Loads state median wage |
| hoursPerDay | slider 0.25–8 | 2 | Hours lost per work day (workplace avg ~2.09) |
| daysPerYear | slider 100–300 | 250 | Working days/year |
| hourlyRateOverride | slider 0–200 | 0 | **Optional** — user's real hourly rate; `>0` overrides the state median. `$0` = use live BLS wage |

## 4. Formulas / constants

```
US_AVG_PROCRASTINATION_HRS = 2.09 · MARKET_RETURN = 0.07
dailyLoss   = hoursPerDay × wage
annualLoss  = dailyLoss × daysPerYear
weekly/monthly = annual scaled
halfHourSaving = 0.5 × wage × daysPerYear
excessHoursPerDay = max(0, hoursPerDay − 2.09)
excessAnnualLoss  = excessHoursPerDay × daysPerYear × wage
tenYearLoss/careerLoss = futureValueAnnuity(annualLoss, n) @ 7%
annualHoursLost = hoursPerDay × daysPerYear ; daysLostPerYear = /24
```

## 5. Worked example (defaults: National $23.11/hr, 2 hr/day, 250 days)

| Output | Value |
|---|---|
| Daily loss | ~$46 |
| **Annual loss** | **~$11,555** |
| 30-min/day improvement saving | ~$2,889/yr |
| 10-year compounded loss | ~$160k |

## 6. Invariants (tested)

- annual = daily × daysPerYear; weekly/monthly consistent.
- Monotonic: ↑hours/↑wage/↑days → ↑loss.
- excessHours floored at 0 below avg.
- compounded loss > simple sum.
- All outputs finite.

## 7. Insights (6, live-captioned "BLS OEWS")

annual loss vs workplace-avg benchmark-bar · compound projection-line · 30-min
improvement delta-card · above-average flag · monthly Roth-IRA framing · state-wage context.

## 8. Custom-rate override (accuracy)

When `hourlyRateOverride > 0`, the config injects the user's rate as `medianWage`
instead of the state median. The generator detects the override and:
- relabels insight bodies from "{state}'s median wage" → "your rate";
- flips the visual caption to `live: false` ("Your entered rate") so we never
  falsely claim BLS provenance for a user-supplied number;
- suppresses the state-vs-national comparison insight (meaningless under override).
