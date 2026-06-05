# Calculator Build Dossier — `working-days-calculator`

> The single source of truth for building one calculator to the flagship bar.

---

## 1. Identity & intent
- **Slug:** `working-days-calculator`
- **Label:** Working Days Calculator
- **Category:** work
- **Audience / search intent:** People estimating business days in a span for
  deadlines, contracts, SLAs, and project planning.
- **The "wow" fact:** A standard US work year is only 249 working days — and a
  6-day work week meaningfully changes the count over the same calendar span.
- **Delivery model:** single-flow (numeric reframe — no date pickers needed).

---

## 2. Fields (inputs)

| name | label | type | unit | min | max | step | default | quickPicks |
|---|---|---|---|---|---|---|---|---|
| calendarDays | Calendar days in range | slider | d | 1 | 730 | 1 | 90 | 7, 30, 90, 180, 365 |
| holidays | Public holidays in range | slider | — | 0 | 30 | 1 | 0 | 0, 1, 2, 5, 11 |
| workDaysPerWeek | Work days per week | slider | d | 1 | 7 | 1 | 5 | 4, 5, 6 |

### Key design choices
- **`workDaysPerWeek`** is the clever twist — supports 6-day retail/hospitality
  weeks instead of assuming Mon–Fri.

---

## 3. Outputs

| key | label | format | highlight | sublabel |
|---|---|---|---|---|
| workingDays | Working days | integer | ✅ | % of calendar span |
| weekendDays | Non-working days | integer | — | weekends in range |
| workingWeeks | Working weeks | decimal(1) | — | at work-week length |

---

## 4. Formulas & logic

```
weekdayEstimate = calendarDays × (workDaysPerWeek ÷ 7)
workingDays     = max(0, weekdayEstimate − holidays)
weekendDays     = calendarDays − weekdayEstimate
workingWeeks    = workingDays ÷ workDaysPerWeek
pctWorking      = workingDays ÷ calendarDays × 100
```

---

## 5. Constraints & invariants

- `workDaysPerWeek` clamped to 1–7; non-negative inputs.
- Holidays reduce working days one-for-one; never negative.
- 6-day week ⇒ more working days than 5-day for the same span.
- 7-day week ⇒ zero weekend days.
- No NaN/Infinity.

---

## 6. Datasets

None — ratio approximation. Constant: 249-day US work year.

---

## 7. Insights

| id | severity | category | description |
|---|---|---|---|
| `workingdays.headline` | neutral | comparison | Working days vs calendar span — benchmark-bar |
| `workingdays.holidays` | neutral | comparison | Holiday impact — delta-card |
| `workingdays.weekends` | neutral | comparison | Non-working days in span |
| `workingdays.year-benchmark` | neutral | comparison | Work-year equivalent for long spans |

---

## 8. Visuals

| insight | visual |
|---|---|
| headline | benchmark-bar (working vs calendar days) |
| holidays | delta-card (weekdays → working days) |

---

## 9. Build checklist

- [x] Pure calc module + unit tests (`calculations/time/workingDays.ts`)
- [x] Config block in `calculatorConfigs.ts`
- [x] Insight generator (`workingDaysInsights.ts`)
- [x] Registry entry + page wired with `EngineWithInsights`; legacy `InsightTable` removed
- [x] Static page content synced (Step 5b)
- [ ] `npx tsc --noEmit` clean, `npm test` green (batch-verified)
