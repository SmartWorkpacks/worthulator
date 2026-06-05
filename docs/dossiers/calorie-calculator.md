# Calculator Build Dossier - calorie-calculator

## 1. Identity and intent
- Slug: calorie-calculator
- Label: Calorie Calculator
- Category: health
- Audience/search intent: Users want a fast daily calorie target for fat loss, maintenance, or gain using body stats and activity.
- Wow fact: A 180 lb, 30-year-old, 5 ft 10 in moderately active user can swing target intake by hundreds of calories/day by changing activity and pace settings.
- Delivery model: single-flow flagship calculator.

## 2. Fields (inputs)
| name | label | type | unit | min | max | step | default | quickPicks | source of realism |
|---|---|---|---|---|---|---|---|---|---|
| sex | Sex | select | - | - | - | - | male | male/female | Required by Mifflin-St Jeor equations |
| age | Age | number | years | 16 | 90 | 1 | 30 | 25/30/40 | Standard BMR input |
| heightIn | Height | number | in | 48 | 84 | 1 | 70 | 64/70/74 | Converted to cm in engine |
| weightLbs | Weight | number | lb | 70 | 450 | 1 | 180 | 140/180/220 | Converted to kg in engine |
| activityMultiplier | Activity multiplier | slider | x | 1.2 | 1.9 | 0.025 | 1.55 | 1.2/1.375/1.55/1.725/1.9 | Standard TDEE multipliers |
| goal | Goal | select | - | - | - | - | maintain | lose/maintain/gain | Maps to deficit/surplus logic |
| pace | Pace | select | - | - | - | - | moderate | gentle/moderate/aggressive | Controls % adjustment intensity |

## 3. Outputs
| key | label | format | highlight | sublabel |
|---|---|---|---|---|
| targetCalories | Daily calorie target | integer | yes | kcal/day |
| bmr | BMR | integer | no | resting burn |
| tdee | TDEE | integer | no | maintenance estimate |
| weeklyWeightChangeLbs | Weekly change estimate | decimal | no | planning trend |
| proteinGrams | Protein | integer | no | g/day |
| carbsGrams | Carbs | integer | no | g/day |
| fatGrams | Fat | integer | no | g/day |

## 4. Formulas and logic with sources
- kg = lbs * 0.45359237, cm = in * 2.54.
- BMR (male) = 10 * kg + 6.25 * cm - 5 * age + 5.
- BMR (female) = 10 * kg + 6.25 * cm - 5 * age - 161.
  - Source: Mifflin MD, St Jeor ST, et al. Am J Clin Nutr. 1990.
- TDEE = BMR * activityMultiplier.
  - Source: Common activity-factor convention used in sports nutrition and clinical counseling (1.2 to 1.9 range).
- Goal adjustment:
  - Lose: TDEE * (1 - deficitPct) where pace maps to 10%, 20%, 25%.
  - Maintain: TDEE.
  - Gain: TDEE * (1 + surplusPct) where pace maps to 8%, 12%, 15%.
- Daily delta = targetCalories - TDEE.
- Weekly change estimate (lb) = dailyDelta * 7 / 3500.
  - Source: 3,500 kcal per pound planning heuristic (Widely used approximation).
- Macro split:
  - Protein grams = weightLbs * goal protein factor (lose 0.9, maintain 0.75, gain 0.82).
  - Fat calories = targetCalories * goal fat share (lose 28%, maintain 30%, gain 27%).
  - Carb calories = targetCalories - proteinCalories - fatCalories.
  - Protein and carbs use 4 kcal/g, fat uses 9 kcal/g.

## 5. Constraints and invariants
- Guard rails: Non-finite/invalid inputs are clamped to safe numeric ranges.
- Never return NaN or Infinity.
- Calorie floor: if computed target is below 1200 (female) or 1500 (male), floor is applied.
- Macro conservation: protein calories + carb calories + fat calories ~= target calories (rounding tolerance).
- Activity monotonicity: higher activity multiplier must increase TDEE at fixed body profile.

## 6. Datasets
- No live dataset required for this calculator version.
- All defaults are static and formula-derived.

## 7. Insights
- deficit/surplus magnitude insight from daily delta and weekly trend.
- macro composition insight from protein/carbs/fat outputs.
- safety floor warning insight when minimum calories are enforced.

## 8. Visuals
- Impact line chart: target calories across standard activity multipliers.
- Breakdown bar chart: macro calorie composition (protein/carbs/fat).

## 9. Build checklist
- [x] Pure engine with typed inputs/outputs in lib/calculators/calorieEngine.ts
- [x] Vitest coverage >= 6 tests in lib/calculators/calorieEngine.test.ts
- [x] Custom client calculator + staged loader in app/tools/calorie-calculator/
- [x] Server page with metadata, SEO block, FAQ, and JSON-LD
- [x] Dossier written in docs/dossiers/calorie-calculator.md
- [ ] npx tsc --noEmit clean
- [ ] npm run lint clean
- [ ] npm test green
