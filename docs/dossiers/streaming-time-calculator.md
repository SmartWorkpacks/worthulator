# Dossier — Streaming Time Calculator

**Slug:** `streaming-time-calculator`
**Archetype:** Time/lifestyle realism with live-wage opportunity cost (mirrors `screen-time-impact`).

## Identity / promise
Show what a streaming habit really costs across three honest dimensions: the
**time** (days/years of life), the **opportunity cost** of that time at the
user's state median wage (live BLS data), and the hard **subscription spend** —
plus a cost-per-hour-watched "value read" that exposes services you pay for but
barely use. Clever under the surface (live wage, value lens, investment
projection); simple on top (great defaults, one optional override).

## Fields (and why each matters)
- **state** (dropdown, live median wage) — opportunity cost realism + the live-data moat. Default `National`.
- **hoursPerDay** (slider, default 3) — the core driver; US average ≈ 3.1 hrs/day (Nielsen The Gauge).
- **monthlySubCost** (slider, default $50) — the hard cash cost; enables the cost-per-hour value read.
- **yearsAhead** (slider, default 10) — projection horizon for lifetime days + invested cost.
- **hourlyRateOverride** (optional, 0 = use live wage) — unadvertised accuracy override.

## Outputs
`annualCost` (highlight, opportunity cost), `lifetimeDays`, `subTotalCost`,
`costPerHourWatched`, `combinedAnnualCost` (+ supporting: monthlyCost, dailyCost,
weeklyHours, yearlyHours, daysPerYear, excess vs average, invested 10/30yr).

## Formulas
- yearlyHours = hoursPerDay × 365
- daysPerYear = yearlyHours ÷ 24
- annualCost (opportunity) = hoursPerDay × 365 × wage
- annualSubCost = monthlySubCost × 12 ; subTotalCost = annualSubCost × years
- costPerHourWatched = annualSubCost ÷ yearlyHours
- combinedAnnualCost = annualCost + annualSubCost
- lifetimeDays = hoursPerDay × 365 × years ÷ 24
- invested = futureValue of annuity at 7%

## Constants (sourced)
- `US_AVG_STREAM_HRS = 3.1` — Nielsen "The Gauge" daily streaming average.
- `MARKET_RETURN = 0.07` — S&P 500 long-run nominal average.

## Data
- `getUSStateMedianWage(state)` + `usStateMedianWageDataset` (BLS OEWS, live).

## Insights (6; ≥1 live-captioned visual)
1. Annual opportunity cost — **benchmark-bar** vs US avg streaming hrs (live caption).
2. Subscription spend + value read — **delta-card** (per-hour-watched).
3. Invested opportunity cost — **projection-line** (live caption).
4. Cut 1 hour/day — **delta-card**.
5. Combined drain (time value + subs) — metric.
6. Lifetime perspective (years ≥ 20) — metric.

## Provenance honesty
When `hourlyRateOverride > 0`, captions flip `live: false` and relabel "your rate".

## Status
✅ Module + 18 tests · config · generator · registry + wrapper + page wired (legacy
`InsightTable` removed) · Step 5b/5c copy derived from live wage.
