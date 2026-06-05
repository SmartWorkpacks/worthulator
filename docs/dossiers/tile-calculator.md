# Calculator Build Dossier — `tile-calculator`

> The single source of truth for building one calculator to the flagship bar.

---

## 1. Identity & intent
- **Slug:** `tile-calculator`
- **Label:** Tile Calculator
- **Category:** construction
- **Audience / search intent:** DIYers/renovators working out how many tiles to
  order for a room, with waste and optional cost.
- **The "wow" fact:** The waste margin doubles as a dye-lot repair stash — a tile
  bought next year rarely matches today's batch.
- **Delivery model:** single-flow (US units: room in ft, tile size preset in ft²).

---

## 2. Fields (inputs)

| name | label | type | unit | min | max | step | default | options/quickPicks |
|---|---|---|---|---|---|---|---|---|
| roomLength | Room length | slider | ft | 1 | 100 | 0.5 | 12 | 8, 10, 12, 16 |
| roomWidth | Room width | slider | ft | 1 | 100 | 0.5 | 10 | 8, 10, 12, 16 |
| tileAreaSqFt | Tile size | select | — | — | — | — | 1 | 12×12 / 18×18 / 24×24 / 12×24 / plank / subway |
| wastePct | Waste allowance | slider | % | 0 | 25 | 1 | 10 | 10, 15, 20 |
| pricePerTile | Price per tile (optional) | slider | $ | 0 | 50 | 0.5 | 0 | 0, 2, 5, 10 |

---

## 3. Outputs

| key | label | format | highlight | sublabel |
|---|---|---|---|---|
| tilesNeeded | Tiles to order | integer | ✅ | incl. spares at waste% |
| roomArea | Area to tile | decimal(1) | — | square feet |
| materialCost | Tile cost | currency | — | at $/tile |

---

## 4. Formulas & logic

```
roomArea     = length × width
baseTiles    = ceil(roomArea ÷ tileAreaSqFt)
tilesNeeded  = ceil((roomArea ÷ tileAreaSqFt) × (1 + waste/100))
wasteTiles   = tilesNeeded − baseTiles
materialCost = tilesNeeded × pricePerTile
```

---

## 5. Constraints & invariants

- `tileAreaSqFt ≥ 0.01` (no divide by zero); non-negative inputs.
- Larger tiles ⇒ fewer tiles; higher waste ⇒ more tiles.
- Zero waste ⇒ tilesNeeded = baseTiles. No NaN/Infinity.

---

## 6. Datasets

None — geometry + optional price.

---

## 7. Insights

| id | severity | category | description |
|---|---|---|---|
| `tile.headline` | neutral | comparison | Count with waste broken out — delta-card |
| `tile.cost` | neutral | spending | Material cost + $/ft² |
| `tile.dye-lot` | positive | savings | Keep spares for dye-lot matching |
| `tile.pattern-waste` | neutral | comparison | Bump to 15% for diagonal/herringbone |

---

## 8. Visuals

| insight | visual |
|---|---|
| headline | delta-card (bare floor → with waste) |

---

## 9. Build checklist

- [x] Pure calc module + unit tests (`calculations/home/tile.ts`)
- [x] Config block in `calculatorConfigs.ts`
- [x] Insight generator (`tileInsights.ts`)
- [x] Registry entry + page wired with `EngineWithInsights`; legacy `InsightTable` removed
- [x] Static page content synced (Step 5b)
- [ ] `npx tsc --noEmit` clean, `npm test` green (batch-verified)
