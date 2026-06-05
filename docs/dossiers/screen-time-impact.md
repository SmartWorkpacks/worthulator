# Dossier — Screen Time Impact Calculator

> **Slug:** `screen-time-impact` · **Domain:** lifestyle/time
> **Calc core:** `calculations/lifestyle/screenTime.ts` (+ `screenTime.test.ts`, 16 tests)
> **Insights:** `lib/insights/generators/screenTimeInsights.ts`
> **Status:** Flagship · live state-wage layer

---

## 1. Identity

Translates daily screen time into its **opportunity cost** in money and life-days,
benchmarking against the US average and valuing time at the user's **state median
hourly wage** — so the "what your scrolling is worth" number is state-accurate.

## 2. Live data layer

| Layer | Source | Getter | Use |
|---|---|---|---|
| Median hourly wage | BLS OEWS May 2024 via Apify (`usStateMedianWages.ts`) | `getUSStateMedianWage()` | Values screen-time hours; default = national ($23.11/hr) |

## 3. Fields

| Field | Type | Default | Notes |
|---|---|---|---|
| state | dropdown (US_WAGE_STATE_OPTIONS) | National | Loads state median wage; no manual hourly rate needed |
| hoursPerDay | slider 0.5–16 | 4 | Daily recreational screen hours (US avg 4.37) |
| years | slider 1–50 | 30 | Projection horizon |

## 4. Formulas / constants

```
US_AVG_SCREEN_HRS = 4.37 · MARKET_RETURN = 0.07
weeklyHours      = hoursPerDay × 7
annualCost       = hoursPerDay × 365 × stateMedianWage
excessHoursPerDay= max(0, hoursPerDay − US_AVG_SCREEN_HRS)
excessAnnualCost = excessHoursPerDay × 365 × wage
oneHourAnnualSaving = 365 × wage
lifetimeDays     = hoursPerDay × 365 × years / 24
invested10yr/30yr = futureValueAnnuity(annualCost, n) @ 7%
```

## 5. Worked example (defaults: National $23.11/hr, 4 hr/day, 30 yr)

| Output | Value |
|---|---|
| Weekly hours | 28 |
| **Annual opportunity cost** | **~$33,740** |
| One-hour/day reduction saving | ~$8,435/yr |
| Lifetime days (30 yr) | ~1,825 days (~5 yr) |

## 6. Invariants (tested)

- stateMedianWage injected from data (CA > MS etc.).
- Monotonic: ↑hours → ↑cost & days; ↑wage → ↑cost; ↑years → ↑days.
- excessHours floored at 0 when below US avg.
- oneHourAnnualSaving = 365 × wage.
- All outputs finite.

## 7. Insights (6, live-captioned "BLS OEWS")

annual cost vs US-avg benchmark-bar · investment projection-line · above-average
usage flag · one-hour-reduction delta-card · state-wage context · lifetime-days framing.
