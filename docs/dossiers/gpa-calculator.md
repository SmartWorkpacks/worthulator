# Calculator Build Dossier — `gpa-calculator`

> The single source of truth for building one calculator to the flagship bar.

---

## 1. Identity & intent
- **Slug:** `gpa-calculator`
- **Label:** GPA Calculator
- **Category:** education
- **Audience / search intent:** Students who want to know the exact GPA they must
  average over their remaining credits to reach a target cumulative GPA — and
  whether that target is still mathematically reachable.
- **The "wow" fact:** Once you've banked 120 credits, a flawless 15-credit
  semester at 4.0 lifts a 3.2 GPA only to ~3.27. GPA momentum is brutal — the
  calculator shows the diminishing returns plainly.
- **Delivery model:** single-flow.

---

## 2. Fields (inputs)

| name | label | type | unit | min | max | step | default | quickPicks |
|---|---|---|---|---|---|---|---|---|
| currentGpa | Current cumulative GPA | slider | — | 0 | 4 | 0.01 | 3.2 | 2.5, 3.0, 3.5 |
| creditsDone | Credits completed | slider | cr | 0 | 200 | 1 | 60 | 30, 60, 90, 120 |
| remainingCredits | Credits remaining | slider | cr | 1 | 120 | 1 | 30 | 15, 30, 60 |
| targetGpa | Target cumulative GPA | slider | — | 0 | 4 | 0.01 | 3.5 | 3.0, 3.5, 3.7, 4.0 |

### Key design choices
- **`remainingCredits`** is the lever that determines feasibility — the fewer
  left, the harder a swing becomes.
- GPAs are clamped to the standard 0–4.0 scale.

---

## 3. Outputs

| key | label | format | highlight | sublabel |
|---|---|---|---|---|
| requiredGpa | GPA needed (remaining credits) | decimal(2) | ✅ | letter-grade + reachable/not |
| maxAchievableGpa | Best possible final GPA | decimal(2) | — | If you ace every remaining credit |
| neededQualityPoints | Quality points to earn | decimal(0) | — | On top of current GPA |

---

## 4. Formulas & logic

```
totalCredits     = creditsDone + remainingCredits
currentQP        = currentGpa × creditsDone
targetQP         = targetGpa × totalCredits
requiredGpa      = (targetQP − currentQP) ÷ remainingCredits
maxAchievableGpa = (currentQP + 4.0 × remainingCredits) ÷ totalCredits
minPossibleGpa   = currentQP ÷ totalCredits
feasible         = 0 ≤ requiredGpa ≤ 4.0
alreadyLocked    = requiredGpa ≤ 0
```

---

## 5. Constraints & invariants

- GPAs clamped to `[0, 4.0]`; `remainingCredits ≥ 1` (no divide-by-zero).
- Higher target ⇒ higher `requiredGpa` (monotonic).
- More remaining credits ⇒ lower `requiredGpa` for the same gap.
- `requiredGpa ≤ maxAchievableGpa` whenever feasible.
- No NaN/Infinity.

---

## 6. Datasets

None — pure arithmetic on the 4.0 quality-point system.

---

## 7. Insights

| id | severity | category | description |
|---|---|---|---|
| `gpa.already-locked` | positive | savings | Target already guaranteed regardless of remaining grades |
| `gpa.required` | neutral/warning/critical | projection/warning | Required GPA vs 4.0 ceiling — benchmark-bar |
| `gpa.range` | neutral | comparison | Best vs worst final GPA — delta-card |
| `gpa.inertia` | neutral | projection | How little one perfect semester moves a large banked GPA |
| `gpa.trajectory` | neutral | projection | Cumulative GPA climb if required average is held — projection-line |

---

## 8. Visuals

| insight | visual |
|---|---|
| required | benchmark-bar (required GPA vs 4.0) |
| range | delta-card (all-F floor vs all-A ceiling vs target) |
| trajectory | projection-line (cumulative GPA per semester) |

---

## 9. Build checklist

- [x] Pure calc module + unit tests (`calculations/education/gpa.ts`)
- [x] Config block in `calculatorConfigs.ts`
- [x] Insight generator (`gpaInsights.ts`)
- [x] Registry entry + page wired with `EngineWithInsights`; legacy `InsightTable` removed
- [x] Static page content synced (Step 5b)
- [ ] `npx tsc --noEmit` clean, `npm test` green (batch-verified)
