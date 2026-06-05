# Calculator Build Dossier — `time-between-dates-calculator`

> The single source of truth for building one calculator to the flagship bar.

---

## 1. Identity & intent
- **Slug:** `time-between-dates-calculator`
- **Label:** Time Between Dates Calculator
- **Category:** other (utility)
- **Audience / search intent:** People converting a day count into weeks/months/
  years/business days for deadlines, countdowns, and planning.
- **The "wow" fact:** A flat 30-day month drifts 5 days over a year; using the
  true 30.44-day average keeps conversions honest.
- **Delivery model:** single-flow (numeric reframe — enter the day count).

---

## 2. Fields (inputs)

| name | label | type | unit | min | max | step | default | quickPicks |
|---|---|---|---|---|---|---|---|---|
| days | Days between the dates | slider | d | 1 | 3650 | 1 | 90 | 30, 90, 180, 365, 730 |

---

## 3. Outputs

| key | label | format | highlight | sublabel |
|---|---|---|---|---|
| weeks | Weeks | decimal(1) | ✅ | full weeks + remainder days |
| months | Months | decimal(1) | — | using 30.44-day average |
| businessDays | Business days | integer | — | weekdays only (≈ days × 5/7) |

---

## 4. Formulas & logic

```
weeks         = days ÷ 7
months        = days ÷ 30.4375
years         = days ÷ 365.25
businessDays  = round(days × 5/7)
fullWeeks     = floor(days ÷ 7)
remainderDays = days mod 7
hours         = days × 24
```

---

## 5. Constraints & invariants

- Negative input clamped to 0.
- Doubling days doubles weeks (linear).
- `fullWeeks × 7 + remainderDays = days` (whole-day spans).
- No NaN/Infinity.

---

## 6. Datasets

None. Constants: 365.25 days/year, 30.4375 days/month, 5/7 weekday ratio.

---

## 7. Insights

| id | severity | category | description |
|---|---|---|---|
| `timebetween.breakdown` | neutral | comparison | Weeks + days breakdown |
| `timebetween.business-days` | neutral | comparison | Business days vs calendar — benchmark-bar |
| `timebetween.years` | neutral | comparison | Year/month framing (long spans) |
| `timebetween.short-range` | neutral | comparison | Full-weeks framing (short spans) |

---

## 8. Visuals

| insight | visual |
|---|---|
| business-days | benchmark-bar (business vs calendar days) |

---

## 9. Build checklist

- [x] Pure calc module + unit tests (`calculations/time/timeBetweenDates.ts`)
- [x] Config block in `calculatorConfigs.ts`
- [x] Insight generator (`timeBetweenDatesInsights.ts`)
- [x] Registry entry + page wired with `EngineWithInsights`; legacy `InsightTable` removed
- [x] Static page content synced (Step 5b)
- [ ] `npx tsc --noEmit` clean, `npm test` green (batch-verified)
