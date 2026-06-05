# Calculator Build Dossier — Timecard Calculator

## 1. Identity
- **Slug:** `timecard-calculator`
- **Route:** `/tools/timecard-calculator`
- **Primary keyword:** "timecard calculator" · 61k/mo · KD 62 · Informational
- **One-line value:** Add up a full week of clock-in/out times with unpaid breaks to
  get daily and weekly hours, split weekly overtime past 40, and turn it into gross pay.
- **Owner:** Owner B (Copilot)
- **Distinct from:** `hours-calculator` (201k) computes a *single* shift with *daily*
  overtime. This is a *weekly grid* (up to 7 days) with *weekly* overtime at 40 hours —
  the classic timecard / timesheet workflow.

## 2. Inputs
| Field | Type | Default | Notes |
|---|---|---|---|
| Days (×7) | grid | Mon–Fri 9:00–17:00, 30-min break | Each: enabled, start, end, break |
| Hourly rate | number | 0 | Optional; 0 hides pay |
| Weekly overtime threshold | hours | 40 | Hours/week above which overtime applies |

Each day: `enabled` (worked?), `startMinutes`, `endMinutes` (overnight-aware), `breakMinutes`.

## 3. Outputs
- Weekly total hours (hero).
- Per-day worked hours (overnight-aware).
- Regular vs overtime hours (weekly split at the threshold).
- Days worked, average daily hours.
- Gross pay: regular + overtime (1.5×).

## 4. Formulas + sources
```
perDay:  gross = end − start ; if gross ≤ 0 → +1440 (overnight)
         worked = max(0, gross − break)
weekly:  totalWorked = Σ worked over enabled days
         regularHours  = min(totalHours, threshold)
         overtimeHours = max(0, totalHours − threshold)
pay:     regularPay  = regularHours × rate
         overtimePay = overtimeHours × rate × 1.5
         totalPay    = regularPay + overtimePay
```
- Overtime multiplier 1.5× and 40-hour weekly threshold follow the common
  **FLSA** convention for non-exempt US workers. Both are user-editable.
- **No live data** — all inputs are user-entered times and an optional rate.

## 5. Invariants / guardrails
- `regularHours + overtimeHours = totalWorkedHours` (always).
- Disabled days contribute zero.
- Overnight shifts (end ≤ start) roll to the next day (+24h).
- `totalPay = regularPay + overtimePay`; pay is 0 when rate is 0.
- More worked hours → more pay (monotonic) at a fixed rate.
- All outputs finite for NaN/empty inputs; minutes clamped to 0–1439.

## 6. Live datasets
- **None.** No "Live" badge.

## 7. Insights
- Whether the week crosses into overtime and by how much.
- The pay premium overtime adds versus straight time.
- Average day length across the days actually worked.

## 8. Visuals
- `ResultHeroCard`: weekly hours, with regular / overtime / pay sub-stats.
- `BreakdownBarChart`: hours worked per day across the week.
- (Pay split surfaced via sub-stats and insights.)

## 9. Build checklist
- [x] Pure engine `lib/calculators/timecardEngine.ts` + ≥6 Vitest tests
- [x] Client component using Insight Kit (weekly grid of time fields)
- [x] Dynamic `ssr:false` loader
- [x] Server `page.tsx` with metadata, hero, SEO block, FAQ, JSON-LD
- [x] `npx tsc --noEmit`, lint, tests green
