# Days Calculator — Build Dossier

**Slug:** `days-calculator` · **Engine:** `lib/calculators/daysEngine.ts`
**Volume/KD:** 50k/mo · KD 72 · Informational, Transactional · Category: Date & Time

## Identity
A focused **day-counting** tool. Three intents in one:
- **Days until** a future date (a countdown — events, deadlines, holidays, due dates).
- **Days since** a past date (a counter — anniversaries, "how long ago").
- **Days between** any two dates.

Distinct from `date-calculator` (368k), which is general date *arithmetic* — it leads
with the full years/months/days duration breakdown and an add/subtract-any-unit mode
(returning a resulting date). `days-calculator` leads with a single, prominent **day
count** and the countdown/counter framing, plus an optional **business-days-only**
mode. No live data; no invented statistics — pure calendar math.

## Inputs
- `mode`: `until` | `since` | `between`.
- `asOfDate` (ISO yyyy-mm-dd) — "today"; passed explicitly so results are deterministic for SSR/tests.
- `targetDate` (ISO) — the future date (**until** mode).
- `pastDate` (ISO) — the past date (**since** mode).
- `startDate`, `endDate` (ISO) — the two dates (**between** mode).
- `businessOnly` (bool) — count only weekdays (Mon–Fri), excluding Sat/Sun.
- `includeEndDay` (bool) — count the final day itself (inclusive span).

## Formulas + sources
Plain Gregorian calendar arithmetic in UTC (no DST/leap-second drift).
- The two endpoints are ordered `a ≤ b`; `reversed` flags when the user's inputs were
  out of the expected order (target before today, etc.).
- `spanDays = round((b − a) / 1 day) + (includeEndDay ? 1 : 0)`.
- `businessDays` / `weekendDays`: iterate each day-slot `a + i` for `i in [0, spanDays)`;
  weekday (Mon–Fri, UTC getUTCDay 1–5) increments business, else weekend. (Public
  holidays vary by country and are intentionally not subtracted — stated in copy.)
- `totalDays = businessOnly ? businessDays : spanDays` (the headline count).
- `totalWeeks = spanDays / 7` (1 dp); `wholeWeeks = floor(spanDays/7)`, `remainderDays = spanDays − 7·wholeWeeks`.
- Calendar `years/months/days` breakdown via borrow-from-month subtraction on the raw
  `a → b` difference (same convention as `date-calculator`).

Sources: standard Gregorian calendar day-count conventions (no external dataset).

## Outputs
- `totalDays` (headline), `calendarDays` (raw span regardless of businessOnly),
  `businessDays`, `weekendDays`, `countedLabel` ("business days"|"days").
- `totalWeeks`, `wholeWeeks`, `remainderDays`; calendar `years/months/days`.
- Endpoints: `fromISO/fromLabel`, `toISO/toLabel`, `toWeekday`.
- `reversed` flag for messaging.
- `breakdown` for the chart: business days vs weekend days.

## Guards / invariants
- Unparseable date(s) ⇒ `valid: false`; UI shows a prompt, no numbers.
- Never returns NaN/Infinity; counts are ≥ 0.
- Business + weekend days always sum to `spanDays`.
- `totalDays ≤ calendarDays` (equal only when `businessOnly` is off).
- Order-independent: swapping the two endpoints gives the same magnitude (sets `reversed`).

## Worked examples (computed in tests + page from the engine)
- Between 2025-01-01 and 2025-12-31 (exclusive) = **364 days** (52 weeks); inclusive = 365.
- 2025-01-01 (Wed) → 2025-01-08, business-only = **5** weekdays, 2 weekend days.
- Days until: as of 2025-06-01, target 2025-06-11 = **10 days**.

## Distinctness
`date-calculator` owns "duration in Y/M/D + add/subtract a date". `days-calculator`
owns the **count-of-days / countdown** intent and business-day counting, and anchors
the related `days-between-dates-calculator` (18k) and `hours-worked`/clock cluster via
cross-links. Not a redirect: different primary output and UX.
