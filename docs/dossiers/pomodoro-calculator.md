# Calculator Build Dossier — `pomodoro-calculator`

> The single source of truth for building one calculator to the flagship bar.

---

## 1. Identity & intent
- **Slug:** `pomodoro-calculator`
- **Label:** Pomodoro Calculator
- **Category:** work
- **Audience / search intent:** People planning focused work — how many sessions
  and deep-work hours fit a day, and what that compounds to per week.
- **The "wow" fact:** Packing 5–6 hours of "focus" into a day usually backfires —
  the sustainable deep-work ceiling is ~4 hours. The tool flags when you cross it.
- **Delivery model:** single-flow.

---

## 2. Fields (inputs)

| name | label | type | unit | min | max | step | default | options/quickPicks |
|---|---|---|---|---|---|---|---|---|
| hoursAvailable | Hours available | slider | hr | 0.5 | 12 | 0.5 | 6 | 2, 4, 6, 8 |
| sessionMinutes | Session length | select | min | — | — | — | 25 | 25 / 45 / 52 / 90 |
| breakMinutes | Break length | slider | min | 0 | 30 | 1 | 5 | 5, 10, 17, 20 |
| daysPerWeek | Days per week | slider | d | 1 | 7 | 1 | 5 | 3, 5, 6, 7 |

---

## 3. Outputs

| key | label | format | highlight | sublabel |
|---|---|---|---|---|
| sessions | Sessions per day | integer | ✅ | deep-work hours |
| focusDensity | Focus density | percent | — | share working |
| weeklyDeepHours | Weekly deep-work hours | decimal(1) | — | weekly sessions |

---

## 4. Formulas & logic

```
cycle           = sessionMinutes + breakMinutes
sessions        = floor((availableMin + breakMinutes) ÷ cycle)
deepWorkMinutes = sessions × sessionMinutes
focusDensity    = deepWorkMinutes ÷ availableMin × 100
weeklyDeepHours = deepWorkHours × daysPerWeek
longBreaks      = floor(sessions ÷ 4)
```

---

## 5. Constraints & invariants

- `daysPerWeek` clamped to 7; `sessionMinutes ≥ 1`.
- Longer sessions ⇒ fewer sessions.
- Zero break ⇒ higher focus density than with breaks.
- `focusDensity` in [0, 100]; no NaN/Infinity.

---

## 6. Datasets

None. Constant: ~4-hour deep-work ceiling (Newport).

---

## 7. Insights

| id | severity | category | description |
|---|---|---|---|
| `pomodoro.headline` | positive/warning | comparison | Deep-work hours vs 4h ceiling — benchmark-bar |
| `pomodoro.density` | neutral | comparison | Focus density vs recovery |
| `pomodoro.weekly` | neutral | projection | Cumulative weekly deep-work — projection-line |
| `pomodoro.session-length` / `pomodoro.deep-blocks` | neutral | comparison | Session-length guidance |

---

## 8. Visuals

| insight | visual |
|---|---|
| headline | benchmark-bar (deep work vs ~4h) |
| weekly | projection-line (cumulative deep-work hours) |

---

## 9. Build checklist

- [x] Pure calc module + unit tests (`calculations/work/pomodoro.ts`)
- [x] Config block in `calculatorConfigs.ts`
- [x] Insight generator (`pomodoroInsights.ts`)
- [x] Registry entry + page wired with `EngineWithInsights`; legacy `InsightTable` removed
- [x] Static page content synced (Step 5b)
- [ ] `npx tsc --noEmit` clean, `npm test` green (batch-verified)
