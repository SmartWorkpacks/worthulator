# Dossier — True Hourly Wage Calculator

**Slug:** `true-hourly-wage`
**Archetype:** Engine-config flagship (`TrueHourlyWageWithInsights`).
**Live data:** N/A — pure time→money calculator.

## Identity / promise
Your salary ÷ 40 is a fiction. This shows your *real* hourly rate once the
unpaid-but-job-caused hours are counted: commute (round trip) and daily
decompression. Clever under the surface (annualised over a 5-day/52-week year,
true-vs-advertised ratio, time-robbed weeks); simple on top (four sliders).

## Fields
- **salary** — gross annual.
- **hoursPerWeek** — contracted hours.
- **commuteHrsDay** — one-way commute (doubled internally for the round trip).
- **decompressHrs** — daily time too drained to be productive after work.

## Formulas
- advertisedHourly = salary ÷ (hoursPerWeek × 52)
- extraHoursPerYear = commuteHrsDay×2×260 + decompressHrs×260  (260 = 5×52 work days)
- trueHourly = salary ÷ (contracted + extra hours)
- hourlyLoss = advertised − true ; ratio = true ÷ advertised ; timeRobbedWeeks = extra ÷ 40

## Insights / visuals (`generateTrueHourlyInsights`)
Rate ratio (benchmark-bar true vs advertised), large/moderate gap, time-robbed
weeks, zero-commute bonus, true-annual-value context. 6 rules, 1 visual.

## Step 5c
SEO worked example recomputes from the default inputs via
`calculateTrueHourlyWage` (this fixed a stale example that under-counted the
unpaid hours as 260 instead of 390).

## Status
✅ Pure module `calculations/work/trueHourlyWage.ts` + 13 tests · config delegates
to it · insights wired via `TrueHourlyWageWithInsights` (was unrendered) · Step 5c
worked example · dossier added.
