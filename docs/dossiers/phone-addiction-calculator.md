# Dossier — Phone Addiction Calculator

**Slug:** `phone-addiction-calculator`
**Archetype:** Time/lifestyle realism with live-wage opportunity cost (mirrors `screen-time-impact`).

## Identity / promise
Quantify a smartphone habit honestly: days/years of life, the **share of your
waking day** it consumes, the **checking frequency** (pickups/year + minutes per
pickup — the attention-fragmentation tell), and the **opportunity cost** of the
time at the user's state median wage (live BLS data). Clever under the surface
(live wage, waking-day donut, pickup math, investment projection); simple on top.

## Fields (and why each matters)
- **state** (dropdown, live median wage) — opportunity-cost realism + moat. Default `National`.
- **hoursPerDay** (slider, default 4.5) — core driver; US avg ≈ 4.5 hrs/day (data.ai).
- **pickupsPerDay** (slider, default 86) — checking frequency; enables minutes-per-pickup + the fragmentation insight.
- **yearsAhead** (slider, default 10) — projection horizon.
- **hourlyRateOverride** (optional, 0 = live wage) — unadvertised accuracy override.

## Outputs
`annualCost` (highlight), `wakingPct`, `lifetimeDays`, `pickupsPerYear`,
`minutesPerPickup` (+ monthlyCost, dailyCost, weeklyHours, yearlyHours,
daysPerYear, excess vs average, invested 10/30yr).

## Formulas
- yearlyHours = hoursPerDay × 365 ; daysPerYear = yearlyHours ÷ 24
- wakingPct = hoursPerDay ÷ 16 waking hours
- annualCost = hoursPerDay × 365 × wage
- pickupsPerYear = pickupsPerDay × 365 ; minutesPerPickup = (hoursPerDay × 60) ÷ pickupsPerDay
- lifetimeDays = hoursPerDay × 365 × years ÷ 24
- invested = futureValue annuity at 7%

## Constants (sourced)
- `US_AVG_PHONE_HRS = 4.5` — data.ai "State of Mobile".
- `US_AVG_PICKUPS = 86` — industry checking-frequency studies (Asurion etc.).
- `WAKING_HOURS = 16` — waking-day denominator.
- `MARKET_RETURN = 0.07` — S&P 500 long-run nominal average.

## Data
- `getUSStateMedianWage(state)` + `usStateMedianWageDataset` (BLS OEWS, live).

## Insights (6; ≥1 live-captioned visual)
1. Annual opportunity cost — **benchmark-bar** vs US avg phone hrs (live caption).
2. Share of waking day — **donut**.
3. Checking frequency — metric (pickups/year, min per pickup).
4. Invested opportunity cost — **projection-line** (live caption).
5. Above-average usage — metric.
6. Cut 1 hour/day — **delta-card**.

## Provenance honesty
When `hourlyRateOverride > 0`, captions flip `live: false` and relabel "your rate".

## Status
✅ Module + 19 tests · config · generator · registry + wrapper + page wired (legacy
`InsightTable` removed) · Step 5b/5c copy derived from live wage.
