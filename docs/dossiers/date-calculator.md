# Calculator Build Dossier — Date Calculator

## 1. Identity
- **Slug:** `date-calculator`
- **Route:** `/tools/date-calculator`
- **Primary keyword:** "date calculator" · 368k/mo · KD 83 · Informational, Transactional
- **One-line value:** Find the exact duration between two dates (years/months/days,
  total days, weeks, business days) or add/subtract a span from a date to get the
  resulting date and weekday.
- **Owner:** Owner B (Copilot)

## 2. Inputs
| Field | Type | Default | Notes |
|---|---|---|---|
| Mode | enum | `difference` | `difference` (between two dates) / `add` (add/subtract span) |
| Start date | ISO `yyyy-mm-dd` | today | First date |
| End date | ISO `yyyy-mm-dd` | +30d | Difference mode |
| Include end day | bool | false | Count the end date itself (inclusive duration) |
| Amount | number | 90 | Add mode — span size |
| Unit | enum | `days` | days / weeks / months / years |
| Direction | enum | `add` | add / subtract |

## 3. Outputs
- **Difference:** total days (hero), Y/M/D breakdown, total weeks, weekdays (business
  days), weekend days, total hours, total minutes.
- **Add:** resulting date + weekday (hero), ISO date, day-of-year, ISO week number.

## 4. Formulas + sources
All math is done in **UTC** to avoid DST/timezone drift (standard JS `Date.UTC`).
```
totalDays   = (endMs − startMs) / 86,400,000
inclusive   = totalDays + (includeEndDay ? 1 : 0)
Y/M/D       = calendar diff with day/month borrow
weeks       = floor(totalDays / 7); remainder = totalDays mod 7
weekdays    = count of Mon–Fri across the span
weekends    = span − weekdays
add mode    = startDate shifted by ±amount in unit (month/year overflow handled)
```
- No external data. Pure calendar arithmetic (Gregorian).
- ISO-8601 week number for the add-mode week stat (Monday-first, week 1 = first
  week with a Thursday).

## 5. Invariants / guardrails
- Invalid/empty dates → `valid: false`, all numeric outputs 0 (never NaN).
- `weekdays + weekends === inclusive span count`.
- Reversed inputs (start > end) are handled by absolute difference + a `reversed` flag.
- `totalDays ≥ 0`; add-mode result date is always a valid calendar date.
- Weekday iteration capped at 200,000 days for pathological ranges.

## 6. Live datasets
- **None.** Pure date math. No "Live" badge.

## 7. Insights
- Business-day vs calendar-day count (the gap matters for deadlines/payroll).
- Duration restated in multiple units (weeks, hours).
- Add-mode: resulting weekday (e.g. lands on a weekend).

## 8. Visuals
- `ResultHeroCard`: total days (difference) / offset + result date (add).
- `BreakdownBarChart`: weekdays vs weekend days (difference mode).

## 9. Build checklist
- [x] Pure engine `lib/calculators/dateEngine.ts` + ≥6 Vitest tests
- [x] Client component using Insight Kit
- [x] Dynamic `ssr:false` loader
- [x] Server `page.tsx` with metadata, hero, SEO block, FAQ, JSON-LD
- [x] `npx tsc --noEmit`, lint, tests green
