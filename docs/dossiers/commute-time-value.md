# Dossier — Commute Time Value Calculator

**Slug:** `commute-time-value`
**Archetype:** Engine-config + live insights (`EngineWithInsights`).
**Live data:** N/A — user supplies commute minutes, wage, work days.

## Identity / promise
The hidden tax of commuting: annual hours lost, dollar value of that time,
% of salary consumed, and the true effective hourly rate. Insights extend it
with the effective-rate trap, an invest-the-cost projection, the remote-day
lever, and a career-scale total.

## Fields
- **dailyMins** (both ways) · **hourlyWage** · **workDays**.

## Formulas
- annualHours = (dailyMins ÷ 60) × workDays ; annualCost = hours × wage.
- salaryLostPct = cost ÷ (wage × 2080) × 100.
- effectiveHourlyRate = (wage × 2080 − cost) ÷ (2080 + hours).

## Insights / visuals (`commuteTimeValueInsights`)
1. Headline hours + full days + dollar value (time-loss).
2. Effective rate drop — delta-card stated → effective rate.
3. Salary % consumed vs ~10% typical — benchmark-bar.
4. Invest-the-cost — 10yr/30yr at 7%, projection-line.
5. Remote-day lever — one WFH day/week returns 20% of the cost.
6. Career-scale total over 40 years.

## Status
✅ Generator `commuteTimeValueInsights` + export + registry entry · page rewired
from bare `CalculatorEngineLoader` to `EngineWithInsights` (live cards) · dossier
added. Follow-up (option b): pure module + tests + Step 5c (note: hero/FAQ copy
treats commute "each way" vs the config's "both ways combined" default — worth
reconciling in the Step 5c pass).
