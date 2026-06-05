# Dossier — Pet Cost Calculator

**Slug:** `pet-cost-calculator`
**Archetype:** Engine-config flagship (`EngineWithInsights`).
**Live data:** N/A — user supplies annual cost categories.

## Identity / promise
The true annual and lifetime cost of pet ownership, plus the compound
opportunity cost of that spend. Clever under the surface (monthly/daily
breakdown, invested-alternative at 7%); simple on top (five sliders).

## Fields
- **food** · **vet** · **insurance** · **misc** · **years** (lifespan).

## Formulas
- yearlyCost = food + vet + insurance + misc ; lifetimeCost = yearly × years.
- monthlyCost = yearly ÷ 12 ; dailyCost = yearly ÷ 365.
- investedAlternative = futureValueAnnuity(yearly, years) at 7%.

## Insights / visuals (`petCostInsights`)
Lifetime-total projection line, emergency-vet / insurance framing, and the
opportunity-cost gap — monthlyCost / dailyCost / investedAlternative were
previously missing from the config (insights fell back to derived values).

## Step 5c
Stat/InsightStrip/SEO figures ($2,100/yr, $29K over 14 yrs, invested
alternative) recompute at render via `calculatePetCost`.

## Status
✅ Pure module `calculations/lifestyle/petCost.ts` + 12 tests · config delegates
to it (now feeds all insight outputs) · wired via `EngineWithInsights` · Step 5c
worked examples · dossier added.
