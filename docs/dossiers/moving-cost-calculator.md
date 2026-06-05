# Dossier — Moving Cost Calculator

**Slug:** `moving-cost-calculator`
**Category:** finance
**Status:** Flagship
**Module:** `calculations/home/movingCost.ts`
**Tests:** `calculations/home/movingCost.test.ts`
**Insights:** `lib/insights/generators/movingCostInsights.ts`
**Page:** `app/tools/moving-cost-calculator/page.tsx`

---

## 1. Identity

Rolls up the **true cost of a move** from its line items (movers/truck, fuel, packing
supplies, storage, tips & misc), applies a **contingency buffer**, and — when distance is
provided — expresses the move as a **cost per mile**. The framing is "budget for the full
installed price, not just the quote," since real moves routinely run 15–30% over the first
estimate.

## 2. Inputs

| Field | Unit | Type | Default | Range |
|---|---|---|---|---|
| `moversCost` | $ | slider | 1200 | 0–12000 (50) |
| `fuelCost` | $ | slider | 150 | 0–2000 (10) |
| `packingCost` | $ | slider | 120 | 0–1500 (10) |
| `storageCost` | $ | slider | 0 | 0–3000 (25) |
| `miscCost` | $ | slider | 180 | 0–2000 (10) |
| `bufferPct` | % | slider | 15 | 0–40 (1) |
| `miles` | mi | slider | 0 | 0–3500 (10) — 0 skips cost/mile |

## 3. Outputs

| Key | Label | Format |
|---|---|---|
| `total` | Total move budget (highlight) | currency |
| `subtotal` | Line-item subtotal | currency |
| `buffer` | Contingency buffer | currency |
| `costPerMile` | (sublabel / insight) | currency |
| `topLineItem`, `topLineItemShare` | (insight) | currency / % |

## 4. Formulas

```
subtotal    = movers + fuel + packing + storage + misc
buffer      = subtotal × bufferPct/100
total       = subtotal + buffer
costPerMile = miles > 0 ? total / miles : 0
topLineItem = max(line items)
topLineItemShare = topLineItem / subtotal × 100
```

## 5. Constraints / invariants

- Inputs clamped ≥ 0; never NaN/Infinity.
- `bufferPct = 0` → total = subtotal.
- `miles = 0` → `costPerMile = 0`.
- Adding any line item never lowers total; higher buffer raises total.
- Cost per mile decreases as miles increase for a fixed total.

## 6. Datasets

None (static benchmarks: ~$1,200 local, ~$4,890 2BR interstate).

## 7. Insights (`generateMovingInsights`)

1. **Headline (donut)** — line-item breakdown, subtotal + buffer.
2. **Buffer** — positive ≥10%, warning below 10%.
3. **Dominant line item** — fires when one category ≥ 50% of subtotal.
4. **Cost per mile** (benchmark bar vs interstate) when miles > 0, else **move-size benchmark** vs typical local move.

## 8. Notes

- Page already had a clean template-literal formula; swapped `CalculatorEngineLoader` + `InsightTable` for `EngineWithInsights`, added JSON-LD, and Americanized "labour" → "labor".
