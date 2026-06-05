# Calculator Build Dossier — `grocery-unit-price`

> The single source of truth for building one calculator to the flagship bar.

---

## 1. Identity & intent
- **Slug:** `grocery-unit-price`
- **Label:** Grocery Unit Price Calculator
- **Category:** shopping / everyday value
- **Audience / search intent:** Shoppers comparing two sizes or brands to find
  the better deal per unit — and wanting to know how much that choice saves
  them annually on items they buy repeatedly.
- **The "wow" fact:** A 24% unit-price saving on an item you buy 40 times a
  year (weekly grocery staple) saves $40–$80/year on that single product. Apply
  that across 10 staples and it's $400–$800/year — serious money from a few
  seconds of comparison.
- **Delivery model:** single-flow.

---

## 2. Fields (inputs)

| name | label | type | unit | min | max | step | default | quickPicks |
|---|---|---|---|---|---|---|---|---|
| item1Price | Item A — price | slider | $ | 0.25 | 30 | 0.25 | 3.50 | 1, 2, 3.50, 5, 8 |
| item1Size | Item A — size | slider | oz | 1 | 128 | 1 | 16 | 8, 12, 16, 24, 32 |
| item2Price | Item B — price | slider | $ | 0.25 | 60 | 0.25 | 8.00 | 4, 6, 8, 12, 20 |
| item2Size | Item B — size | slider | oz | 1 | 256 | 1 | 48 | 24, 32, 48, 64, 128 |
| purchasesPerYear | Purchases per year | slider | — | 1 | 100 | 1 | 24 | 6, 12, 24, 36, 52 |

### Key design choices
- **`purchasesPerYear`** is the new clever field. It turns a one-time comparison
  into an annual savings figure. Default 24 = roughly every other week, which is
  a common frequency for grocery staples.
- Items are labelled A/B (not small/large) because sometimes the smaller item
  IS the better deal.

---

## 3. Outputs

| key | label | format | highlight | sublabel |
|---|---|---|---|---|
| unitPriceA | Item A — per unit | decimal (3) | — | `${price} ÷ ${size} oz` |
| unitPriceB | Item B — per unit | decimal (3) | — | `${price} ÷ ${size} oz` |
| savingsPct | Unit price difference | decimal (1) | ✅ | `Item {winner} is cheaper` |
| savingsPerUnit | Savings per unit | decimal (4) | — | `$/oz saved on the cheaper item` |
| annualSavings | Annual savings | currency | — | `Buying the cheaper item {purchases}×/yr` |
| winner | — (echoed) | — | — | 1 = A wins, 2 = B wins, 0 = tied |

---

## 4. Formulas & logic

```
unitPriceA     = item1Price / item1Size
unitPriceB     = item2Price / item2Size
cheaper        = min(unitPriceA, unitPriceB)
dearer         = max(unitPriceA, unitPriceB)
savingsPerUnit = dearer - cheaper
savingsPct     = (savingsPerUnit / dearer) × 100
winner         = unitPriceA < unitPriceB ? 1 : unitPriceB < unitPriceA ? 2 : 0

// Annual savings: pick the WINNING item's size as the unit purchased
winnerSize     = winner === 1 ? item1Size : item2Size
annualUnits    = winnerSize × purchasesPerYear
annualSavings  = savingsPerUnit × annualUnits
```

---

## 5. Constraints & invariants

- `savingsPct ∈ [0, 100)`
- `savingsPerUnit ≥ 0` always
- When tied (unitPriceA === unitPriceB): `savingsPerUnit = 0`, `savingsPct = 0`
- `annualSavings = savingsPerUnit × winnerSize × purchasesPerYear`
- No NaN/Infinity

---

## 6. Datasets

None — pure comparison math.

---

## 7. Insights

| id | severity | category | description |
|---|---|---|---|
| `grocery.winner` | positive | comparison | Headline: which item wins and by how much — benchmark-bar |
| `grocery.annual-impact` | positive/neutral | savings | Annual savings from choosing the cheaper item — delta-card |
| `grocery.bulk-trap` | warning (conditional) | spending | When the smaller item is actually cheaper — a surprise |
| `grocery.ten-staples` | neutral | projection | If you applied this discipline to 10 staples |

---

## 8. Visuals

| insight | visual | live caption? |
|---|---|---|
| winner | benchmark-bar (A vs B per unit) | — |
| annual-impact | delta-card (expensive vs cheap item annual) | — |

---

## 9. Build checklist

- [ ] Pure calc module + unit tests
- [ ] Config rewritten with purchasesPerYear
- [ ] Insight generator
- [ ] WithInsights wrapper + registry + page
- [ ] All static page content synced (Step 5b)
- [ ] `npx tsc --noEmit` clean, `npm test` green
