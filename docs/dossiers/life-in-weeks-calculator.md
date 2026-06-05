# Dossier — Life in Weeks Calculator

**Slug:** `life-in-weeks-calculator`
**Archetype:** Engine-config flagship (`EngineWithInsights`).
**Live data:** N/A — age and life-expectancy inputs.

## Identity / promise
A lifespan rendered in weeks — lived, remaining, % used — for perspective and
intention. Clever under the surface (years/days remaining, "summers left"
framing); simple on top (two sliders).

## Fields
- **age** · **lifeExpectancy**.

## Formulas
- weeksLived = age × 52 ; weeksRemaining = (lifeExpectancy − age) × 52.
- percentUsed = lived ÷ (lifeExpectancy × 52).
- yearsRemaining = lifeExpectancy − age ; daysRemaining = weeksRemaining × 7.
- summerWeeksRemaining = yearsRemaining × 13.

## Insights / visuals (`lifeInWeeksInsights`)
Core scarcity framing, % used, summers remaining, and the intentional-living
prompt (years/days/summers now provided by the module).

## Step 5c
Stat/InsightStrip (4,160 weeks in an 80-yr life) and SEO worked example (age 30
→ 1,560 lived / 2,600 remaining / 37.5% used) recompute at render via
`calculateLifeInWeeks`.

## Status
✅ Pure module `calculations/lifestyle/lifeInWeeks.ts` + 12 tests · config
delegates to it · wired via `EngineWithInsights` · Step 5c worked examples ·
dossier added.
