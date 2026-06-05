# Calculator Build Dossier — `protein-intake-calculator`

> The single source of truth for building one calculator to the flagship bar.

---

## 1. Identity & intent
- **Slug:** `protein-intake-calculator`
- **Label:** Protein Intake Calculator
- **Category:** health
- **Audience / search intent:** People wanting a daily protein gram target from
  weight + activity, plus how to distribute it.
- **The "wow" fact:** Your body uses only ~20–40 g per meal for muscle synthesis,
  so the per-meal split matters as much as the daily total.
- **Delivery model:** single-flow.

---

## 2. Fields (inputs)

| name | label | type | unit | min | max | step | default | options/quickPicks |
|---|---|---|---|---|---|---|---|---|
| weight | Body weight | slider | — | 30 | 400 | 1 | 160 | 120, 150, 180, 220 |
| weightIsKg | Weight unit | select | — | — | — | — | 0 (lb) | lb / kg |
| multiplier | Activity level | select | g/kg | — | — | — | 1.6 | 0.8 / 1.2 / 1.6 / 2.0 / 2.4 |
| mealsPerDay | Meals per day | slider | — | 1 | 6 | 1 | 4 | 3, 4, 5 |

---

## 3. Outputs

| key | label | format | highlight | sublabel |
|---|---|---|---|---|
| proteinGrams | Daily protein (g) | integer | ✅ | × RDA minimum |
| perMealGrams | Per meal (g) | integer | — | across N meals |
| caloriesFromProtein | Calories from protein | integer | — | 4 kcal/g |

---

## 4. Formulas & logic

```
weightKg     = weightIsKg ? weight : weight ÷ 2.2046
proteinGrams = weightKg × multiplier
calories     = proteinGrams × 4
perMeal      = proteinGrams ÷ mealsPerDay
rangeLow     = weightKg × 1.6
rangeHigh    = weightKg × 2.2
rdaMultiple  = multiplier ÷ 0.8
```

Sources: WHO RDA 0.8 g/kg; ISSN 1.4–2.0 g/kg (up to 2.2 in deficit); 20–40 g/meal synthesis ceiling; 4 kcal/g.

---

## 5. Constraints & invariants

- lb↔kg conversion consistent; same grams for equivalent weights.
- Higher multiplier ⇒ more protein; more meals ⇒ less per meal.
- `mealsPerDay ≥ 1`; no NaN/Infinity.

---

## 6. Datasets

None — documented nutrition constants.

---

## 7. Insights

| id | severity | category | description |
|---|---|---|---|
| `protein.headline` | positive | comparison | Daily target vs RDA floor — benchmark-bar |
| `protein.per-meal` | neutral/warning | comparison | Per-meal split vs ~40 g ceiling |
| `protein.range` | neutral | comparison | Muscle-building band — delta-card |
| `protein.equivalents` | neutral | comparison | Whole-food equivalents (chicken/eggs) |

---

## 8. Visuals

| insight | visual |
|---|---|
| headline | benchmark-bar (target vs RDA) |
| range | delta-card (1.6 vs 2.2 g/kg) |

---

## 9. Build checklist

- [x] Pure calc module + unit tests (`calculations/health/proteinIntake.ts`)
- [x] Config block in `calculatorConfigs.ts`
- [x] Insight generator (`proteinIntakeInsights.ts`)
- [x] Registry entry + page wired with `EngineWithInsights`; legacy `InsightTable` removed
- [x] Static page content synced (Step 5b)
- [ ] `npx tsc --noEmit` clean, `npm test` green (batch-verified)
