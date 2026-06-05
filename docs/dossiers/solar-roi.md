# Dossier — Solar Panel ROI Calculator

**Slug:** `solar-roi`
**Archetype:** Engine-config flagship (`EngineWithInsights`).
**Live data:** N/A — user supplies system cost, bill, offset, utility inflation.

## Identity / promise
When solar pays for itself and what it returns over 25 years, with utility-rate
inflation compounded in. Clever under the surface (inflation-compounded lifetime
savings, ROI multiple, payback-with-credit framing); simple on top (four sliders).

## Fields
- **systemCost** · **monthlyBill** · **solarOffset** · **utilityInflation**.

## Formulas
- year1 = bill × 12 × offset% ; each later year grows by inflation%.
- savings25yr = Σ annual over 25 years.
- paybackMonths = cost ÷ (year1 / 12) (conservative flat year-1 rate).
- paybackYears = months ÷ 12 ; roiMultiple = savings25yr ÷ cost.

## Insights / visuals (`solarRoiInsights`)
Payback headline, 25-year savings projection, inflation-protection value, and
grid-independence framing (generator derives extended metrics with fallbacks).

## Step 5c
FAQ/content/InsightStrip/SEO figures ($20k → 13.1 yr full / 9.2 yr after 30%
credit; $1,530 yr-1; $55,783 over 25 yr; bill $202 in 10 yr) recompute at render
via `calculateSolarRoi` — fixed the vague "8–10 years" claim that ignored the
calculator's conservative flat-rate payback.

## Status
✅ Pure module `calculations/energy/solarRoi.ts` + 12 tests · config delegates to
it · wired via `EngineWithInsights` · Step 5c worked examples · dossier added.
