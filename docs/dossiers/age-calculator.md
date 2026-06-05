# Dossier — Age Calculator

**Slug:** `age-calculator` · "age calculator" · 823k/mo · KD 76 · Navigational
**Archetype:** Custom-loader flagship (Insight Kit).
**Live data:** N/A — pure calendar math. One sourced constant (US life expectancy).

## Identity / promise
"How old am I, exactly?" — exact calendar age (years · months · days), the full
day/week/hour/second counts, a next-birthday countdown with weekday, and
round-number milestones (1,000-day marks, the 1-billion-second moment).
Clever under the surface (calendar borrowing, leap-day convention, milestone
projection); simple on top (one date input, optional "as of" override).

## Fields
- **birthDateISO** — date of birth (native date field; default 1990-06-15 so the
  page is useful before any input).
- **asOfDateISO** — optional "calculate on this date" override; defaults to today
  (computed client-side; loader is ssr:false so no hydration drift).

## Formulas (engine: `lib/calculators/ageEngine.ts`)
- **Calendar age** = borrow-based diff: `d<0 → borrow daysInMonth(month before
  asOf)`, then `m<0 → borrow 12`. Standard civil-age convention.
- **daysLived** = whole days between the dates, both anchored at **noon UTC**
  (DST/timezone-proof, always an exact integer).
- weeks = ⌊days/7⌋ (+ remainder) · hours = days×24 · minutes = ×60 · seconds = ×60.
- **Next birthday** = first occurrence of birth month+day on/after asOf.
  **Feb 29 → celebrated Feb 28 in common years** (documented convention; the
  calendar diff itself stays pure, so a leap-day person is "24, turning 25 today"
  on Feb 28 — both facts true and tested).
- **Milestones**: next 1,000-day multiple (+date); 1-billion-second date =
  birth + 1e9 s (≈ 31.69 yrs — derived: 1e9 ÷ (365.2425 × 86,400)).
- **Lifespan share** = decimal age ÷ **79.0 yrs** — US life expectancy at birth,
  CDC/NCHS Data Brief No. 548, "Mortality in the United States, 2024". Framed in
  copy as a population average, **not** a prediction.
- Birthday projection: next 10 birthdays {turning, date, weekday, daysFromNow,
  totalDaysLived} → feeds the chart + weekday table.
- Guards: malformed ISO, impossible dates, birth > asOf → `valid:false` + zeroed
  result. No NaN/Infinity anywhere (tested).

## Component (`app/tools/age-calculator/AgeCalculator.tsx`)
- Insight Kit: `useStagedReveal` + `WorthulatorProgressLoader`/`ResultReveal`,
  `ResultHeroCard` (years headline + months/weeks/days/hours sub-stats),
  `InsightList`, `ImpactLineChart`.
- Chart: **days lived at each of your next 10 birthdays** with a reference line
  at the next 1,000-day milestone — shows when you cross it.
- Local widget (calculator-specific, allowed): **birthday weekday table** — next
  5 birthdays with weekday + countdown (party-planning insight).
- Insights: day/week/hour counts · next-birthday weekday countdown · next
  1,000-day milestone · billion-second status · lifespan share (neutral tone,
  "average, not a prediction").

## Step 5b
Formula block mirrors the engine exactly (borrowing, noon-UTC day counts, Feb-29
rule, billion-second + lifespan-share lines). FAQ worked example (born
1990-06-15, as of 2026-01-01) is **computed at render via `calculateAge`** —
never hardcoded. Stat chips: 79.0 yrs (CDC/NCHS 2024), 366-day leap years,
~31.7-yr billion-second mark (derived at render from the constant).

## Status
✅ Engine + 16 Vitest tests · custom-loader UI on the Insight Kit · page copy
synced (Step 5b) · dossier.
