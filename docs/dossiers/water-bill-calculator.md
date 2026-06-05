# Calculator Build Dossier — `water-bill-calculator`

> Single source of truth for building the Water Bill Calculator to flagship standard.

---

## 1. Identity & intent

- **Slug:** `water-bill-calculator` (page at `/tools/water-bill-calculator`)
- **Label:** Water Bill Calculator
- **Category:** other (home utility)
- **Audience / search intent:** Homeowners and renters who want to know what their
  water (and sewer) bill should cost based on household size, usage habits, and
  their state's real utility rates — not a generic national average.
- **The "wow" fact:** Combined water + sewer rates vary from ~$5.40/1,000 gal
  (West Virginia) to ~$14.50/1,000 gal (Hawaii) — nearly 3× for the same
  household. Outdoor watering and a running toilet can add more than the rate
  spread. State live data makes this personal.
- **Delivery model:** single-flow.
- **Moat:** live state combined water + sewer $/1,000 gal (new dataset,
  AWWA/utility-survey sourced, Apify-refreshed).

---

## 2. Fields (inputs)

| name | label | type | unit | min | max | step | default | options / quickPicks |
|---|---|---|---|---|---|---|---|---|
| state | Your state | dropdown | — | — | — | — | National | US_ENERGY_STATE_OPTIONS |
| householdSize | People in household | slider | people | 1 | 8 | 1 | 3 | 1, 2, 3, 4, 5 |
| usageLevel | Indoor water use | select | — | — | — | — | average | low, average, high |
| outdoorWatering | Outdoor watering | select | — | — | — | — | none | none, seasonal, heavy |
| billingType | Bill includes sewer? | select | — | — | — | — | combined | combined, water_only |

### Key design choices

- **`state`** (LIVE DATA) — loads combined residential water + sewer $/1,000 gal.
  The single biggest pricing variable; ~3× range across states.
- **`householdSize`** — EPA per-capita use (82 GPCD) scales linearly with people.
  US avg household ≈ 2.5–3 people.
- **`usageLevel`** — low/average/high maps to 75%/100%/135% of EPA baseline
  (fixtures, shower length, dishwasher frequency). More honest than asking
  gallons directly.
- **`outdoorWatering`** — lawn/garden irrigation can add 20–45% to annual use in
  dry climates; separate from indoor habits.
- **`billingType`** — many users on private septic pay water-only; we apply a
  documented water-only fraction (52%) of the combined rate.

---

## 3. Outputs

| key | label | format | highlight | sublabel |
|---|---|---|---|---|
| annualWaterCost | Annual water bill | currency | ✅ | `{state} live $/1,000 gal` |
| monthlyCost | Monthly average | currency | — | `Annual ÷ 12` |
| dailyCost | Daily water cost | currency | — | `Per calendar day` |
| gallonsPerDay | Water used per day | decimal (0) | — | `Gallons for your household` |

---

## 4. Formulas & logic

```
BASE_GPCD = 82                    // EPA WaterSense 2024 US residential avg
USAGE_MULTIPLIERS:
  low → 0.75, average → 1.00, high → 1.35
OUTDOOR_MULTIPLIERS:
  none → 1.00, seasonal → 1.20, heavy → 1.45

dailyGallons = householdSize × BASE_GPCD × usageMult × outdoorMult
annualGallons = dailyGallons × 365

effectiveRate = combinedRatePer1000Gal
  × (billingType === "water_only" ? WATER_ONLY_FRACTION : 1.0)
  // WATER_ONLY_FRACTION = 0.52 — typical water share of combined bill (AWWA)

annualWaterCost = (annualGallons / 1000) × effectiveRate
monthlyCost     = annualWaterCost / 12
dailyCost       = annualWaterCost / 365

// Insight helpers (internal outputs)
lowUsageAnnualCost      = cost at "low" usage, same other inputs
leakFixSaving           = annualWaterCost × LEAK_WASTE_PCT (0.10 — EPA WaterSense)
tenYearCost / inflatedCost10yr — 3%/yr utility inflation (AWWA trend)
vsNationalRefAnnual     = same usage at national avg rate
```

---

## 5. Constraints & invariants

- All cost outputs ≥ 0; zero people → zero gallons and zero cost.
- `monthlyCost = annualWaterCost / 12`; `dailyCost = annualWaterCost / 365`.
- `householdSize` scales gallons and cost linearly.
- `usageLevel` and `outdoorWatering` scale gallons linearly; rate unchanged.
- Doubling rate doubles cost; gallons unchanged.
- No NaN / Infinity on any edge input.

---

## 6. Datasets

- **`lib/datasets/regional/usStateWaterRates.ts`** (LIVE — NEW) — state combined
  residential water + sewer $/1,000 gal; refreshed via Apify. Getter:
  `getUSStateWaterRate(state)`.

---

## 7. Insights

| id | severity | category | visual | live caption |
|---|---|---|---|---|
| `water.annual-cost` | neutral/warning | spending | benchmark-bar (your bill vs national ref) | ✅ asOf |
| `water.usage-share` | neutral | spending | donut (indoor vs outdoor portion of gallons) | — |
| `water.conservation` | positive | savings | delta-card (current vs low-usage saving) | — |
| `water.leak-opportunity` | positive | hidden-cost | delta-card (fix leaks ~10% saving) | — |
| `water.ten-year-projection` | neutral/warning | projection | projection-line (3% inflation) | ✅ asOf |
| `water.high-rate-state` | neutral | comparison | text metric (cond. rate > 1.25× national) | — |

---

## 8. Build checklist

- [x] `lib/datasets/regional/usStateWaterRates.ts` + getter (51 states/DC)
- [x] Apify source + parser in `scripts/updateEnergyPrices.ts`
- [x] GitHub Action updated to git-add new dataset
- [x] Pure calc module + 18 unit tests
- [x] Config block (5 inputs, 4 outputs)
- [x] Insight generator (6 insights) + index export
- [x] `WaterBillWithInsights` + `LiveInsightBlock` registry
- [x] Page + Step 5b static content (all 5 SEO steps)
- [x] `tsc` clean, tests green, `LIVE-DATA-MOAT-STATUS.md` updated
