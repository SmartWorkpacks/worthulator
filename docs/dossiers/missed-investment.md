# Dossier — Missed Investment Calculator

**Slug:** `missed-investment`
**Archetype:** Engine-config flagship (`EngineWithInsights`).
**Live data:** N/A — pure compound growth (user supplies return assumption).

## Identity / promise
The opportunity cost of any past (or future) purchase, expressed as what it
would be worth invested. Clever under the surface (multiplier, % growth
forfeited, monthly-equivalent framing); simple on top (three sliders).

## Fields
- **amount** · **yearsAgo** · **annualReturn** (defaults 10% S&P benchmark).

## Formulas
- currentValue = amount × (1 + return)^years (lump-sum compounding).
- totalGain = currentValue − amount ; multiplier = currentValue ÷ amount.
- growthLostPct = (multiplier − 1) × 100 ; monthlyEquivalent = gain ÷ (years×12).

## Insights / visuals (`missedInvestmentInsights`)
Headline worth-today, multiplier framing, decade projection line, and the
forward-planning "true price tag" framing.

## Step 5c
FAQ/stat/content/InsightStrip examples ($1,000@10% over 10/25/30 yrs; $5,000@7%
over 40 yrs → ~$75k; $10,000@7% over 35 yrs → ~$107k; year-30 growth) recompute
at render via `calculateMissedInvestment` — fixed several inaccurate hardcoded
figures (e.g. $87k → $75k; $76k → $107k).

## Status
✅ Pure module `calculations/finance/missedInvestment.ts` + 12 tests · config
delegates to it · wired via `EngineWithInsights` · Step 5c worked examples ·
dossier added.
