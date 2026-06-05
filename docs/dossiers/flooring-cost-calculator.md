# Dossier — Flooring Cost Calculator

**Slug:** `flooring-cost-calculator`
**Category:** construction (home improvement)
**Status:** Flagship
**Module:** `calculations/home/flooringCost.ts`
**Tests:** `calculations/home/flooringCost.test.ts`
**Insights:** `lib/insights/generators/flooringCostInsights.ts`
**Page:** `app/tools/flooring-cost-calculator/page.tsx`

---

## 1. Identity

Estimates the **total installed cost** of a flooring project from room dimensions, a
**material price per ft²**, and a **labor price per ft²**. Material and labor are priced
**independently** — a deliberate departure from the old stub's fixed "labor = 40% of
material" rule, which badly misrepresents the spread between cheap-to-install LVP and
expensive-to-install hardwood. Setting labor to `0` produces a DIY (materials-only) estimate.

## 2. Inputs

| Field | Unit | Type | Default | Range | Notes |
|---|---|---|---|---|---|
| `roomLength` | ft | slider | 15 | 1–100 (0.5) | |
| `roomWidth` | ft | slider | 12 | 1–100 (0.5) | |
| `materialPerSqFt` | $/ft² | slider | 4 | 0.5–40 (0.5) | Laminate $1–5 · LVP $2–7 · engineered $4–12 · solid $5–15 |
| `laborPerSqFt` | $/ft² | slider | 3 | 0–20 (0.5) | 0 = DIY estimate |
| `wastePct` | % | slider | 10 | 0–25 (1) | 10 standard · 15–20 diagonal · 20–25 herringbone |

## 3. Outputs

| Key | Label | Format |
|---|---|---|
| `totalCost` | Total project cost (highlight) | currency |
| `materialCost` | Material cost (incl. waste) | currency |
| `laborCost` | Labor cost | currency |
| `costPerSqFtInstalled` | (sublabel / insight) | currency |
| `laborShare` | (sublabel / insight) | % |
| `area`, `areaWithWaste` | (internal / insight) | — |

## 4. Formulas

```
area          = roomLength × roomWidth
areaWithWaste = area × (1 + wastePct/100)
materialCost  = areaWithWaste × materialPerSqFt   // waste applies to material only
laborCost     = area × laborPerSqFt               // labor on actual area
totalCost     = materialCost + laborCost
costPerSqFtInstalled = totalCost / area
laborShare    = laborCost / totalCost × 100
```

## 5. Constraints / invariants

- All inputs clamped to ≥ 0; never returns NaN/Infinity.
- Waste increases material quantity, **not** labor.
- Zero room → zero cost and zero `costPerSqFtInstalled`.
- DIY (`laborPerSqFt = 0`) → `laborCost = 0`, `laborShare = 0`, total = material.
- Doubling both dimensions quadruples area and total.

## 6. Datasets

None (static cost guidance only; rates are user-entered).

## 7. Insights (`generateFlooringInsights`)

1. **Headline (donut)** — material vs labor split, total cost, installed $/ft².
2. **Benchmark bar** — installed $/ft² vs LVP value ceiling ($8/ft²).
3. **DIY saving (positive)** — labor cost as the amount removed by self-installing (shown only when labor > 0).
4. **Hidden-cost warning** — subfloor prep, removal, transitions, trim not included; shows area incl. waste.

## 8. Notes

- Page uses `EngineWithInsights`; `InsightTable` removed.
- Replaced metric/UK "labour" copy with US "labor" and added independent labor-rate framing.
