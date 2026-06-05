# Calculator Build Dossier — Maintenance Calorie Calculator

## 1. Identity
- **Slug:** `maintenance-calorie-calculator`
- **Route:** `/tools/maintenance-calorie-calculator`
- **Primary keyword:** "maintenance calorie calculator" · 74k/mo · KD 54 · Informational
- **One-line value:** Find the daily calories that keep your weight steady (TDEE) from
  your stats and activity level, with BMR, a balanced macro split, and ready-made cut
  and bulk targets.
- **Owner:** Owner B (Copilot)
- **Category:** Health / Nutrition.

## 2. Inputs
| Field | Type | Default | Notes |
|---|---|---|---|
| Sex | enum | `male` | `male` / `female` — Mifflin-St Jeor constant |
| Age | number | 30 | Years (clamped 1–120) |
| Height | number | 70 | Inches (imperial) |
| Weight | number | 175 | Pounds (imperial) |
| Activity level | enum | `1.55` | 1.2 / 1.375 / 1.55 / 1.725 / 1.9 |

## 3. Outputs
- Maintenance calories / TDEE (hero).
- BMR (resting burn), cut target (−500), lean-bulk target (+300).
- Balanced macro split (protein / carbs / fat).
- Maintenance across all five activity levels.

## 4. Formulas + sources
```
BMR (Mifflin-St Jeor, 1990):
   men:   10·kg + 6.25·cm − 5·age + 5
   women: 10·kg + 6.25·cm − 5·age − 161
maintenance = BMR × activity factor
cut  = max(floor, maintenance − 500)     (≈ 1 lb/week, 3500 kcal/lb)
bulk = maintenance + 300
protein = 0.75 g/lb · fat = 30% kcal · carbs = remainder
```
- Mifflin-St Jeor resting-energy equation; standard 1.2–1.9 activity factors; the
  3,500 kcal ≈ 1 lb rule of thumb. No external data.

## 5. Invariants / guardrails
- `maintenance = BMR × activity` (within rounding).
- Maintenance increases monotonically with activity level.
- Macros sum back to maintenance calories (protein·4 + carbs·4 + fat·9 ≈ maintenance).
- Female BMR < male BMR for identical stats (constant differs by 166 kcal).
- Protein scales with bodyweight.
- Calorie floors (1500 m / 1200 f) protect the cut target; all outputs finite on
  NaN/empty inputs; inputs clamped to sane ranges.

## 6. Live datasets
- **None.** All inputs user-supplied; no market data involved.

## 7. Insights
- The single weight-stable baseline number, framed plainly.
- How much activity (not BMR) drives the result.
- Cut and bulk targets so the baseline is immediately actionable.

## 8. Visuals
- `ResultHeroCard`: maintenance calories, with cut / bulk / protein sub-stats.
- `BreakdownBarChart`: macro split at maintenance.
- `ImpactLineChart`: maintenance calories across activity levels.

## 9. Build checklist
- [x] Pure engine `lib/calculators/maintenanceCalorieEngine.ts` + ≥6 Vitest tests
- [x] Client component using Insight Kit
- [x] Dynamic `ssr:false` loader
- [x] Server `page.tsx` with metadata, hero, SEO block, FAQ, JSON-LD
- [x] `npx tsc --noEmit`, lint, tests green
