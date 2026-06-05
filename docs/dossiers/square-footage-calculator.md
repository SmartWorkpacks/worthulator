# Calculator Build Dossier — Square Footage Calculator

## 1. Identity
- **Slug:** `square-footage-calculator`
- **Route:** `/tools/square-footage-calculator`
- **Primary keyword:** "square footage calculator" · 74k/mo · KD 42 · Informational
- **One-line value:** Measure the area of a room or space in any unit, multiply across
  identical rooms, add a waste allowance, and estimate the flooring/material you need
  and what it costs.
- **Owner:** Owner B (Copilot)
- **Category:** Area / Home Improvement.

## 2. Inputs
| Field | Type | Default | Notes |
|---|---|---|---|
| Shape | enum | `rectangle` | `rectangle` / `square` / `circle` / `triangle` |
| Dimension A | number | 12 | Length / side / diameter / base |
| Dimension B | number | 10 | Width / height (rectangle & triangle only) |
| Unit | enum | `ft` | `ft` / `in` / `yd` / `m` — linear unit of the inputs |
| Quantity | number | 1 | Number of identical areas (e.g. rooms) |
| Waste allowance | % | 10 | Extra material for cuts, pattern match, breakage |
| Price per sq ft | number | 4 | Optional material cost (flooring/tile) |

## 3. Outputs
- Total square footage (hero).
- Material to buy (area + waste), estimated cost, area in m² and yd².
- Usable area vs waste-allowance breakdown.
- Material cost across a band of prices per sq ft.

## 4. Formulas + sources
All linear inputs are converted to feet, so area comes out directly in square feet.
```
toFeet:  ft ×1 · in ÷12 · yd ×3 · m ×3.280839895
areaPerUnit (sq ft):
   rectangle = A × B
   square    = A²
   circle    = π × (A/2)²        (A = diameter)
   triangle  = ½ × A × B         (A = base, B = height)
totalSqFt   = areaPerUnit × quantity
withWaste   = totalSqFt × (1 + waste%/100)
materialCost = withWaste × pricePerSqFt
m² = sqFt ÷ 10.7639 · yd² = sqFt ÷ 9
```
- Standard geometric area formulas and exact unit conversions (1 m = 3.280839895 ft;
  1 ft² = 0.09290304 m²). No external data.

## 5. Invariants / guardrails
- `withWaste ≥ totalSqFt` (waste only adds); waste 0 → equal.
- `materialCost = withWaste × price` and scales linearly with price and area.
- Same area is consistent across units: `sqFt = m² × 10.7639 = yd² × 9`.
- Doubling quantity doubles the total square footage.
- All outputs finite for NaN/empty inputs; dimensions, waste, price clamped ≥ 0.

## 6. Live datasets
- **None.** All inputs user-supplied; material price is an editable default (not live).

## 7. Insights
- Total area in the units people actually buy materials in.
- How much of the purchase is waste allowance.
- How the material budget moves with the price per square foot.

## 8. Visuals
- `ResultHeroCard`: total square footage, with material / cost / m² sub-stats.
- `BreakdownBarChart`: usable area vs waste allowance.
- `ImpactLineChart`: material cost across price-per-sq-ft.

## 9. Build checklist
- [x] Pure engine `lib/calculators/squareFootageEngine.ts` + ≥6 Vitest tests
- [x] Client component using Insight Kit
- [x] Dynamic `ssr:false` loader
- [x] Server `page.tsx` with metadata, hero, SEO block, FAQ, JSON-LD
- [x] `npx tsc --noEmit`, lint, tests green
