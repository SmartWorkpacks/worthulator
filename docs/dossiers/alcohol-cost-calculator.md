# Calculator Build Dossier — `alcohol-cost-calculator`

> The single source of truth for building one calculator to the flagship bar.

---

## 1. Identity & intent
- **Slug:** `alcohol-cost-calculator`
- **Label:** Alcohol Cost Calculator
- **Category:** lifestyle / spending
- **Audience / search intent:** Anyone curious about how much their drinking
  habit costs — both in direct spend and investment opportunity cost.
- **The "wow" fact:** 10 drinks/week at $8 each = $4,160/year. Cut just 3 per
  week and you save $1,248/year — invested at 7%, that's $17,250 in 10 years.
  It's not about quitting; it's about seeing the number.
- **Delivery model:** single-flow.

---

## 2. Fields (inputs)

| name | label | type | unit | min | max | step | default | quickPicks |
|---|---|---|---|---|---|---|---|---|
| drinksPerWeek | Drinks per week | slider | drinks | 1 | 50 | 1 | 10 | 3, 7, 10, 14, 21 |
| costPerDrink | Average cost per drink | slider | $ | 1 | 30 | 0.50 | 8 | 3, 5, 8, 12, 18 |
| reduceDrinksBy | What if you cut (per week) | slider | drinks | 0 | 20 | 1 | 3 | 0, 2, 3, 5, 7 |

### Key design choices
- **`reduceDrinksBy`** is the clever field. Non-judgmental — "what if you cut
  just 3 per week?" Shows the concrete saving without preaching.
- `costPerDrink` at $8 is a reasonable blend of $3–4 home and $12–14 bar drinks.

---

## 3. Outputs

| key | label | format | highlight | sublabel |
|---|---|---|---|---|
| yearlyCost | Annual spend | currency | ✅ | `{drinks}×/wk at ${cost}` |
| monthlyCost | Monthly spend | currency | — | `Average per month` |
| investedValue10yr | Invested instead (10yr) | currency | — | `At 7% annual return` |
| cutYearlySaving | Saving from cutting | currency | — | `Cut {cut} drinks/wk` |
| cutInvested10yr | If cut & invested (10yr) | currency | — | `Cut savings at 7%` |

---

## 4. Formulas & logic

```
weeklySpend         = drinksPerWeek × costPerDrink
yearlyCost          = weeklySpend × 52
monthlyCost         = yearlyCost / 12
investedValue10yr   = FV annuity(yearlyCost, 10, 7%)
investedValue20yr   = FV annuity(yearlyCost, 20, 7%)

cutWeekly           = reduceDrinksBy × costPerDrink
cutYearlySaving     = cutWeekly × 52
cutInvested10yr     = FV annuity(cutYearlySaving, 10, 7%)
reducedYearlyCost   = yearlyCost - cutYearlySaving
```

---

## 5. Constraints & invariants

- `reduceDrinksBy ≤ drinksPerWeek` (clamped)
- `yearlyCost ≥ 0`
- `cutYearlySaving ≥ 0` and `cutYearlySaving ≤ yearlyCost`
- No NaN/Infinity

---

## 6. Datasets

None — pure arithmetic + BLS average ($570/yr).

---

## 7. Insights (existing + upgrade)

| id | severity | category | visual |
|---|---|---|---|
| `alcohol.vs-average` | neutral/warning | comparison | benchmark-bar ✅ |
| `alcohol.decade` | neutral | opportunity-cost | projection-line ✅ |
| `alcohol.cdc-heavy` | warning | warning | (keep as-is) |
| `alcohol.cut-saving` | positive | savings | delta-card (NEW) |

---

## 8. Build checklist

- [ ] Pure calc module + unit tests
- [ ] Config rewritten with reduceDrinksBy
- [ ] Insight generator upgraded with cut-saving delta-card
- [ ] WithInsights wrapper + registry + page
- [ ] All static page content synced (Step 5b)
- [ ] `npx tsc --noEmit` clean, `npm test` green
