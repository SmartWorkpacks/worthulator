# Dossier — Salary Negotiation Calculator

**Slug:** `salary-negotiation-calculator`
**Archetype:** Engine-config flagship (`EngineWithInsights`).
**Live data:** N/A — user supplies offer, market range, experience, fit, urgency.

## Identity / promise
A data-driven recommended ask and a leverage score before you walk into the
room. Clever under the surface (leverage blend of experience/fit/urgency, ask =
max(market mid, offer × leverage multiplier)); simple on top (five sliders + a
select).

## Fields
- **currentOffer** · **marketLow** · **marketHigh** · **experienceYears** ·
  **skillMatch** · **offerUrgency** (low/high → boolean).

## Formulas
- marketMid = (low + high) / 2.
- leverage = experience/10 + skillMatch/100 + (urgencyHigh ? 0.2 : 0).
- recommendedAsk = max(marketMid, offer × (1.1 + leverage × 0.05)).
- confidenceScore = min(leverage × 100, 100).

## Insights / visuals (`salaryNegotiationInsights` family)
Recommended ask vs offer, leverage breakdown, and the lifetime value of a single
negotiation.

## Step 5c
SEO worked example ($65k offer, $60–85k range, 5 yrs, 75% fit → ~$75,563 ask,
100/100 leverage) recomputes at render via `calculateSalaryNegotiation`.

## Status
✅ Pure module `calculations/work/salaryNegotiation.ts` + 11 tests · config
delegates to it · wired via `EngineWithInsights` · Step 5c worked example ·
dossier added.
