# Calculator Build Dossier — One-Rep Max (1RM) Calculator

## 1. Identity
- **Slug:** `1-rep-max-calculator` (canonical)
- **Consolidates:** `1rm-calculator` (61k, KD 50) → 308 redirect to this page.
  Both keywords are the same intent; this slug has the lower KD (38) so it is canonical.
- **Route:** `/tools/1-rep-max-calculator`
- **Primary keyword:** "1 rep max calculator" · 61k/mo · KD 38 · Informational
  (also targets "1rm calculator" · 61k/mo · KD 50)
- **One-line value:** Estimate your one-rep max from a set you actually lifted using
  six established strength formulas, then get a full training-percentage table and
  rep-max targets to program your lifts.
- **Owner:** Owner B (Copilot)

## 2. Inputs
| Field | Type | Default | Notes |
|---|---|---|---|
| Weight lifted | number | 225 | The load used for the set |
| Reps performed | number | 5 | 1–20 (accuracy falls above ~10–12) |
| Unit | enum | `lb` | `lb` / `kg` (display only; math is unit-agnostic) |

## 3. Outputs
- Estimated 1RM (hero) — average of six formulas.
- Per-formula estimates (Epley, Brzycki, Lombardi, Mayhew, O'Conner, Wathan) + the spread.
- Training-percentage table: weight and approximate reps at 100%→60% of 1RM.
- Rep-max targets: estimated weight for a 2/3/5/8/10/12-rep max.

## 4. Formulas + sources
All are published 1RM estimators (w = weight, r = reps):
```
Epley     : 1RM = w × (1 + r/30)
Brzycki   : 1RM = w × 36 / (37 − r)
Lombardi  : 1RM = w × r^0.10
Mayhew    : 1RM = 100w / (52.2 + 41.9 × e^(−0.055r))
O'Conner  : 1RM = w × (1 + r/40)
Wathan    : 1RM = 100w / (48.8 + 53.8 × e^(−0.075r))
estimate  = mean of the six   (when r = 1, 1RM = w exactly)

Training table:  weightAt(pct) = 1RM × pct/100
                 repsAt(pct)   = max(1, round(30 × (100/pct − 1)))     (Epley inverse)
Rep-max target:  weightForReps(r) = 1RM / (1 + r/30)                   (Epley inverse)
```
- Sources: Epley (1985), Brzycki (1993), Lombardi (1989), Mayhew et al. (1992),
  O'Conner et al. (1989), Wathan (1994) — standard NSCA-cited 1RM prediction equations.
- **No live data.** All inputs are user-supplied; estimates are physiological models.

## 5. Invariants / guardrails
- `reps = 1` → 1RM equals the weight lifted exactly (all formulas collapse to w).
- More reps at the same weight → higher estimated 1RM (monotonic).
- More weight at the same reps → higher estimated 1RM (monotonic, linear in w).
- `spreadLow ≤ estimate ≤ spreadHigh` across the six formulas.
- Training-table weight decreases as the percentage decreases; reps increase.
- All outputs finite for NaN/empty inputs; reps clamped to 1–20, weight ≥ 0.

## 6. Live datasets
- **None.** No "Live" badge.

## 7. Insights
- The averaged 1RM and how wide the six-formula spread is (estimate confidence).
- The "never actually max out" angle: train off percentages of the estimate.
- Where the input set falls on the rep-max curve.

## 8. Visuals
- `ResultHeroCard`: estimated 1RM, with spread / formula-count / input-set sub-stats.
- `ImpactLineChart`: the rep-max curve (estimated weight vs reps).
- `BreakdownBarChart`: the six per-formula 1RM estimates (the spread).

## 9. Build checklist
- [x] Pure engine `lib/calculators/oneRepMaxEngine.ts` + ≥6 Vitest tests
- [x] Client component using Insight Kit
- [x] Dynamic `ssr:false` loader
- [x] Server `page.tsx` with metadata, hero, SEO block, FAQ, JSON-LD
- [x] `1rm-calculator` 308 redirect to this canonical page
- [x] `npx tsc --noEmit`, lint, tests green
