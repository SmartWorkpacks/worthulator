# Dossier — PTO Calculator

**Slug:** `pto-calculator`
**Archetype:** Engine-config flagship (`EngineWithInsights`).
**Live data:** N/A — user supplies hourly rate and PTO balance.

## Identity / promise
The cash value of unused PTO, reframed as compensation already earned. Clever
under the surface (per-day value, weeks framing, use-it-or-lose-it risk); simple
on top (three sliders).

## Fields
- **hourlyRate** · **ptoHoursRemaining** · **hoursPerDay**.

## Formulas
- cashValue = rate × hours ; daysRemaining = hours ÷ hoursPerDay.
- weeklyEarningRate = rate × hoursPerDay × 5 ; dailyCashValue = rate × hoursPerDay.
- ptoDaysAsWeeks = daysRemaining ÷ 5.

## Insights / visuals (`generatePtoInsights`)
Daily value framing, high-balance risk, large-cash-value awareness, and a weeks
framing (dailyCashValue/ptoDaysAsWeeks now provided by the module).

## Step 5c
FAQ worked example ($35/hr × 80h → $2,800, 10 days) recomputes at render via
`calculatePto`.

## Status
✅ Pure module `calculations/work/pto.ts` + 12 tests · config delegates to it ·
wired via `EngineWithInsights` · Step 5c worked example · dossier added.
