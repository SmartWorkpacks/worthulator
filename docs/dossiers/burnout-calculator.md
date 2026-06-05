# Dossier — Burnout Risk Calculator

**Slug:** `burnout-calculator`
**Archetype:** Engine-config flagship (`EngineWithInsights`).
**Live data:** N/A — self-reported hours, stress, sleep.

## Identity / promise
A 0–100 burnout risk score from the three core load/recovery dimensions. Clever
under the surface (annual overwork hours, weekly sleep debt, recovery-weeks
estimate); simple on top (three sliders).

## Fields
- **hours** · **stress** (1–10) · **sleep** (hrs/night).

## Formulas
- score = (hours/60)×40 + (stress/10)×30 + (sleep<6 ? 20 : 0), capped at 100.
- overworkHoursPerYear = max(0, hours−40) × 52.
- sleepDebtWeekly = max(0, 8−sleep) × 7 ; recoveryWeeksNeeded = round(score/25).

## Insights / visuals (`generateBurnoutInsights`)
Critical/moderate/low banding, overwork hours, sleep-debt framing, and recovery
estimate (overwork/sleep-debt/recovery now provided by the module).

## Step 5c
SEO worked example (45h, stress 6, 6.5h sleep → 48/100, moderate) recomputes at
render via `calculateBurnout`.

## Status
✅ Pure module `calculations/work/burnout.ts` + 12 tests · config delegates to it
· wired via `EngineWithInsights` · Step 5c worked example · dossier added.
