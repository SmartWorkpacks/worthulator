# Dossier — Job Offer Comparison Calculator

**Slug:** `job-offer-comparison`
**Archetype:** Engine-config flagship (shared `CalculatorEngine` + WorthCore
insights via `JobOfferComparisonWithInsights`).
**Live data:** N/A — pure-comparison calculator (like `freelance-rate`). No
price/rate feed applies; the only assumption is a documented 7% invested-return
used for the wealth-gap projection, injected via the module `data` arg.

## Identity / promise
Stop comparing job offers on headline salary. Compute **total effective
compensation** — salary + annual benefits value − annual commute cost — for two
offers, then surface the annual gap, the monthly take-home difference, the
multi-year cumulative gap, and the 10-year wealth gap if the monthly difference
were invested. Clever under the surface (benefits/commute deltas, after-tax
commute framing, compounding projection); simple on top (six sliders, auto-reveal).

## Fields
- **salaryA / salaryB** — gross annual salary for each offer.
- **commuteCostA / commuteCostB** — annual commute cost (fuel/transit/parking).
- **benefitsValueA / benefitsValueB** — annual value of health, 401(k) match, equity, PTO.

## Formulas
- effective = salary + benefits − commute
- difference = effectiveA − effectiveB ; monthlyGap = difference ÷ 12
- fiveYearGap = difference × 5 ; tenYearGap = difference × 10
- benefitsGap = benefitsA − benefitsB ; commuteGap = commuteA − commuteB
- tenYearInvestedGap = FV of |monthlyGap| invested 120 months at 7%/12 (ordinary annuity), signed by the difference.

## Insights / visuals (`jobOfferComparisonInsights`)
1. Headline winner / tie — **benchmark-bar** (effective comp A vs B).
2. Multi-year wealth gap — **projection-line** (Now→10yr cumulative gap).
3. Benefits differentiator — **delta-card** (benefits A vs B).
4. Commute "tax" — after-tax gross-up framing.
5. Salary-vs-comp flip — warning when the higher salary loses on total comp.

## Step 5c
SEO worked example recomputes from the default inputs via `calculateJobOffer`
at render time, so it can never drift from the engine. STATS/FAQ figures are
industry teaching values (BLS commute, employer 401k match) kept static.

## Status
✅ Pure module `calculations/work/jobOffer.ts` + 15 tests · config now returns
full output set · insight generator upgraded to visual style + wired via
`JobOfferComparisonWithInsights` (was previously unrendered) · Step 5c worked
example · dossier added.
