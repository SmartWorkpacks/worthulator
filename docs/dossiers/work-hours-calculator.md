# Calculator Build Dossier — `work-hours-calculator`

> The single source of truth for building one calculator to the flagship bar.

---

## 1. Identity & intent
- **Slug:** `work-hours-calculator`
- **Label:** Work Hours Calculator
- **Category:** work
- **Audience / search intent:** Timesheet/invoice/scheduling users who want total
  hours for a period — and, cleverly, the overtime split and gross pay too.
- **The "wow" fact:** A 50-hour week isn't just "10 extra hours" — those 10 are
  overtime at 1.5×, worth materially more per hour than the first 40.
- **Delivery model:** single-flow.

---

## 2. Fields (inputs)

| name | label | type | unit | min | max | step | default | quickPicks |
|---|---|---|---|---|---|---|---|---|
| hoursPerDay | Hours per day | slider | hr | 0.5 | 16 | 0.25 | 8 | 4, 6, 8, 10, 12 |
| daysPerWeek | Days per week | slider | d | 1 | 7 | 1 | 5 | 3, 4, 5, 6 |
| weeksWorked | Weeks in period | slider | wk | 1 | 52 | 1 | 52 | 1, 2, 4, 26, 52 |
| hourlyRate | Hourly rate (optional) | slider | $ | 0 | 200 | 1 | 25 | 0, 15, 25, 50, 100 |

### Key design choices
- **`hourlyRate` is optional (0 = skip).** Keeps the tool a pure hours counter
  unless the user wants earnings — overrides stay silent per the playbook.
- Overtime is computed on the **weekly** FLSA basis, then scaled by weeks.

---

## 3. Outputs

| key | label | format | highlight | sublabel |
|---|---|---|---|---|
| totalHours | Total hours | decimal(1) | ✅ | FTE multiple |
| weeklyHours | Hours per week | decimal(1) | — | over/under 40h line |
| overtimeHours | Overtime hours | decimal(1) | — | hours over 40/week |
| grossPay | Gross pay | currency | — | at $rate before tax |

---

## 4. Formulas & logic

```
weeklyHours   = hoursPerDay × daysPerWeek
totalHours    = weeklyHours × weeksWorked
overtime/wk   = max(0, weeklyHours − 40)
regularHours  = min(weeklyHours, 40) × weeksWorked
overtimeHours = overtime/wk × weeksWorked
grossPay      = regularHours × rate + overtimeHours × rate × 1.5
fte           = totalHours ÷ 2080
```

---

## 5. Constraints & invariants

- `daysPerWeek` clamped to 7; non-negative inputs.
- No overtime at ≤ 40 h/week; overtime priced at 1.5×.
- `grossPay = regularPay + overtimePay`.
- Doubling weeks doubles total hours (linear scaling).
- No NaN/Infinity.

---

## 6. Datasets

None — pure arithmetic. (Constants: 2,080 full-time hours, 40h FLSA threshold, 1.5× multiplier.)

---

## 7. Insights

| id | severity | category | description |
|---|---|---|---|
| `workhours.total` | neutral | comparison | Total vs 2,080-hour year — benchmark-bar |
| `workhours.overtime` | warning | warning | Overtime hours over the 40h line |
| `workhours.earnings` | positive | savings | Gross pay split regular/overtime — delta-card |
| `workhours.long-days` | warning | warning | 10h+ days vs the 4–6h productive ceiling |
| `workhours.part-time` | neutral | comparison | Sub-0.75 FTE framing |

---

## 8. Visuals

| insight | visual |
|---|---|
| total | benchmark-bar (your hours vs 2,080) |
| earnings | delta-card (regular vs overtime pay → gross) |

---

## 9. Build checklist

- [x] Pure calc module + unit tests (`calculations/work/workHours.ts`)
- [x] Config block in `calculatorConfigs.ts`
- [x] Insight generator (`workHoursInsights.ts`)
- [x] Registry entry + page wired with `EngineWithInsights`; legacy `InsightTable` removed
- [x] Static page content synced (Step 5b)
- [ ] `npx tsc --noEmit` clean, `npm test` green (batch-verified)
