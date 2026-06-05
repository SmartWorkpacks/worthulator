# Calculator Build Dossier — `expense-split-calculator`

> The single source of truth for building one calculator to the flagship bar.

---

## 1. Identity & intent
- **Slug:** `expense-split-calculator`
- **Label:** Expense Split Calculator
- **Category:** other (money/sharing)
- **Audience / search intent:** Groups splitting a shared bill who want the exact
  per-person amount including tip/tax, fast.
- **The "wow" fact:** The whole-dollar collection mode turns an awkward $48.33
  into a clean $49 with a visible buffer — no coins, no IOUs.
- **Delivery model:** single-flow.

---

## 2. Fields (inputs)

| name | label | type | unit | min | max | step | default | quickPicks |
|---|---|---|---|---|---|---|---|---|
| amount | Total amount | slider | $ | 5 | 2000 | 5 | 200 | 50, 100, 200, 500 |
| people | Number of people | slider | — | 1 | 30 | 1 | 4 | 2, 4, 6, 10 |
| tipPct | Tip | slider | % | 0 | 30 | 1 | 18 | 0, 15, 18, 20, 25 |
| taxPct | Tax (optional) | slider | % | 0 | 15 | 0.5 | 0 | 0, 6, 8.875, 10 |

---

## 3. Outputs

| key | label | format | highlight | sublabel |
|---|---|---|---|---|
| perPersonTotal | Each person pays | currency | ✅ | ways + tip each |
| grandTotal | Grand total | currency | — | bill + tip (+ tax) |
| roundedPerPerson | Rounded each | currency | — | collection buffer |

---

## 4. Formulas & logic

```
tip          = amount × tipPct/100
tax          = amount × taxPct/100
grandTotal   = amount + tip + tax
perPerson    = grandTotal ÷ people
rounded      = ceil(perPerson)
buffer       = rounded × people − grandTotal
```

---

## 5. Constraints & invariants

- `people ≥ 1`; non-negative inputs.
- Conservation: `perPersonTotal × people = grandTotal`.
- More people ⇒ lower per-person total.
- `buffer ≥ 0`; zero when already whole. No NaN/Infinity.

---

## 6. Datasets

None — pure arithmetic.

---

## 7. Insights

| id | severity | category | description |
|---|---|---|---|
| `expensesplit.headline` | neutral | comparison | Per-person base → all-in — delta-card |
| `expensesplit.composition` | neutral | spending | Bill/tip/tax shares — donut |
| `expensesplit.rounding` | positive | savings | Whole-dollar collection buffer |
| `expensesplit.large-group` | neutral | comparison | Collect-in-advance nudge (8+ people) |

---

## 8. Visuals

| insight | visual |
|---|---|
| headline | delta-card (per-person bill vs all-in) |
| composition | donut (bill / tip / tax) |

---

## 9. Build checklist

- [x] Pure calc module + unit tests (`calculations/shopping/expenseSplit.ts`)
- [x] Config block in `calculatorConfigs.ts`
- [x] Insight generator (`expenseSplitInsights.ts`)
- [x] Registry entry + page wired with `EngineWithInsights`; legacy `InsightTable` removed
- [x] Static page content synced (Step 5b)
- [ ] `npx tsc --noEmit` clean, `npm test` green (batch-verified)
