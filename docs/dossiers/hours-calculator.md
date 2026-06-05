# Calculator Build Dossier — Hours Calculator

## 1. Identity
- **Slug:** `hours-calculator`
- **Route:** `/tools/hours-calculator`
- **Primary keyword:** "hours calculator" · 201k/mo · KD 82 · Informational
- **One-line value:** Work out how many hours and minutes are between a start and end
  time (including overnight shifts), subtract unpaid breaks, convert to decimal hours,
  and optionally turn it into pay with regular/overtime split.
- **Owner:** Owner B (Copilot)

## 2. Inputs
| Field | Type | Default | Notes |
|---|---|---|---|
| Start time | minutes from midnight | 09:00 | Clock-in |
| End time | minutes from midnight | 17:00 | Clock-out (overnight if before start) |
| Unpaid break | minutes | 30 | Subtracted from worked time |
| Hourly rate | number | 0 | Optional — 0 hides pay |
| Overtime threshold | hours/day | 8 | Hours above this are overtime |

## 3. Outputs
- Worked hours — decimal (hero) and HH:MM.
- Gross (clock) hours, break hours.
- Regular vs overtime hours.
- Daily pay, plus regular/overtime pay split (when a rate is given).
- Worked-vs-break breakdown.

## 4. Formulas + sources
```
gross   = endMin − startMin; if ≤ 0 then gross += 1440 (overnight)
worked  = max(0, gross − breakMin)
hours   = worked ÷ 60
H:MM    = floor(worked/60) : worked mod 60
regular = min(hours, otThreshold)
overtime= max(0, hours − otThreshold)
pay     = regular × rate + overtime × rate × 1.5   (when rate > 0)
```
- Pure clock arithmetic. Overtime premium uses the common 1.5× ("time and a half")
  convention (US FLSA-style); shown as an estimate, not legal advice.
- No external data, no live datasets.

## 5. Invariants / guardrails
- Worked time never negative; break larger than the shift floors worked to 0.
- `regular + overtime === worked hours`.
- Overnight shifts (end ≤ start) add 24h exactly once.
- All outputs finite for NaN/empty inputs (return 0).
- Decimal hours rounded to 2dp; pay rounded to 2dp.

## 6. Live datasets
- **None.** No "Live" badge.

## 7. Insights
- Decimal vs HH:MM (payroll systems use decimal hours).
- Overtime hours/pay when the shift exceeds the threshold.
- Break impact on take-home hours.

## 8. Visuals
- `ResultHeroCard`: decimal worked hours, with HH:MM, gross, and pay sub-stats.
- `BreakdownBarChart`: worked vs break (and regular vs overtime where relevant).

## 9. Build checklist
- [x] Pure engine `lib/calculators/hoursEngine.ts` + ≥6 Vitest tests
- [x] Client component using Insight Kit
- [x] Dynamic `ssr:false` loader
- [x] Server `page.tsx` with metadata, hero, SEO block, FAQ, JSON-LD
- [x] `npx tsc --noEmit`, lint, tests green
