# Dossier — Biological Age Calculator

**Slug:** `biological-age-calculator`
**Archetype:** Engine-config flagship (`EngineWithInsights`).
**Live data:** N/A — lifestyle inputs only.

## Identity / promise
A lifestyle-adjusted estimate of biological age plus an improvable risk score.
Clever under the surface (age delta, risk-factor count, improvement potential);
simple on top (four sliders + a smoker toggle).

## Fields
- **age** · **sleep** · **exercise** · **bmi** · **smoker** (0/1 → boolean).

## Formulas
- Penalties: sleep<6 → +5 ; exercise<2 → +4 ; smoker → +8 ; bmi>30 → +6.
- biologicalAge = age + Σ penalties ; riskScore = min(Σ × 10, 100).
- ageDelta = Σ penalties ; riskFactorCount = count of triggered penalties.

## Insights / visuals (`biologicalAgeInsights`)
Age-delta headline, risk-factor breakdown, and improvement potential (ageDelta /
riskFactorCount / improvementPotential were previously missing from the config).

## Step 5c
SEO worked example (35-yr-old, 5h sleep, 1 day exercise → +9 yrs, bio age 44,
90/100, 2 factors) recomputes at render via `calculateBiologicalAge`.

## Status
✅ Pure module `calculations/health/biologicalAge.ts` + 13 tests · config
delegates to it (now feeds all insight outputs) · wired via `EngineWithInsights`
· Step 5c worked example · dossier added.
