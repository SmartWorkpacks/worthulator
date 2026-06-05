# Calculator Build Dossier — `tip-calculator`

> The single source of truth for building one calculator to the flagship bar.

---

## 1. Identity & intent
- **Slug:** `tip-calculator`
- **Label:** Tip Calculator
- **Category:** everyday / quick math
- **Audience / search intent:** Anyone splitting a restaurant bill who wants the
  exact per-person tip, per-person total, and a cash-friendly rounded total —
  plus the annual picture of their tipping spend.
- **The "wow" fact:** Americans who dine out twice a week at a $60 average bill
  with 20% tip spend **~$1,248/year on tips alone**. Showing this turns a
  mundane one-shot tool into a real financial awareness moment.
- **Delivery model:** single-flow.

---

## 2. Fields (inputs)

| name | label | type | unit | min | max | step | default | quickPicks |
|---|---|---|---|---|---|---|---|---|
| bill | Bill amount | slider | $ | 5 | 500 | 5 | 60 | 20, 40, 60, 100, 150 |
| tipPct | Tip percentage | slider | % | 0 | 30 | 1 | 20 | 10, 15, 18, 20, 25 |
| people | Number of people | slider | — | 1 | 20 | 1 | 2 | 1, 2, 3, 4, 6 |
| diningFrequency | Dining out per month | slider | — | 1 | 30 | 1 | 8 | 2, 4, 8, 12, 20 |

### Key design choices
- **`diningFrequency`** is the clever field. Default 8 = twice a week, which is
  about average for Americans who dine out regularly. It turns a one-shot
  calculation into annual spending insight.
- **`tipPct` default is 20** — the current US norm for good service.

---

## 3. Outputs

| key | label | format | highlight | sublabel |
|---|---|---|---|---|
| tipAmount | Total tip | currency | — | `{tipPct}% of ${bill}` |
| totalBill | Total to pay | currency | — | `Bill + tip` |
| tipPerPerson | Tip per person | currency | ✅ | `Split {people} ways` |
| totalPerPerson | Total per person | currency | — | `Each person pays` |
| roundedTotal | Rounded total/person | currency | — | `Rounded up to nearest $5 — easy for cash` |
| annualTipSpend | Annual tip spend | currency | — | `Dining {freq}×/mo at this rate` |

---

## 4. Formulas & logic

```
tipAmount       = bill × tipPct / 100
totalBill       = bill + tipAmount
tipPerPerson    = tipAmount / people
totalPerPerson  = totalBill / people
roundedTotal    = ceil(totalPerPerson / 5) × 5   // round up to nearest $5
annualTipSpend  = tipAmount × diningFrequency × 12
annualDining    = totalBill × diningFrequency × 12  // for insight reference
```

---

## 5. Constraints & invariants

- `tipAmount ≥ 0`
- `people ≥ 1`
- `totalPerPerson ≤ totalBill`
- `roundedTotal ≥ totalPerPerson`
- `annualTipSpend > 0` when tipPct > 0 and diningFrequency > 0
- No NaN/Infinity

---

## 6. Datasets

None — pure arithmetic.

---

## 7. Insights

| id | severity | category | description |
|---|---|---|---|
| `tip.headline` | neutral | comparison | Headline: per-person tip and total — benchmark-bar (tip vs food) |
| `tip.annual-spend` | neutral/warning | spending | Annual tipping spend at this frequency — delta-card |
| `tip.round-up-cost` | neutral | spending | How much the cash round-up adds per person |
| `tip.bracket-compare` | neutral | comparison | Your chosen % vs the 15/20/25 brackets — benchmark-bar |

---

## 8. Visuals

| insight | visual |
|---|---|
| headline | benchmark-bar (tip portion vs food portion per person) |
| annual-spend | delta-card (annual food spend vs annual tip spend) |

---

## 9. Build checklist

- [ ] Pure calc module + unit tests
- [ ] Config rewritten with diningFrequency
- [ ] Insight generator
- [ ] WithInsights wrapper + registry + page
- [ ] All static page content synced (Step 5b)
- [ ] `npx tsc --noEmit` clean, `npm test` green
