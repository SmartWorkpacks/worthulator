# Calculator Build Dossier — `heating-cost`

> Single source of truth for building the Home Heating Cost calculator to flagship standard.

---

## 1. Identity & intent

- **Slug:** `heating-cost` (page at `/tools/heating-cost`)
- **Label:** Home Heating Cost Calculator
- **Category:** energy / home (Archetype A — live energy)
- **Audience / search intent:** Homeowners and renters who want to understand
  what their heating actually costs — broken down by fuel type, home size, and
  insulation quality — using real current prices for their state.
- **The "wow" fact:** Natural gas $/therm ranges from ~$0.82 (Louisiana) to
  ~$1.90 (Maine, New Hampshire) — more than a 2× spread. A 1,500 sq ft home
  in New England can cost $2,200+/yr to heat; the same home in the South costs
  under $600. State live data makes this personal.
- **Delivery model:** single-flow.
- **Moat:** live state natural gas $/therm (new dataset, EIA-sourced, Apify-refreshed).
  Plus electric resistance and propane comparison so users understand their real
  options.

---

## 2. Fields (inputs)

| name | label | type | unit | min | max | step | default | quickPicks/options |
|---|---|---|---|---|---|---|---|---|
| state | Your state | dropdown | — | — | — | — | National | US_ENERGY_STATE_OPTIONS |
| heatingDays | Heating days per year | slider | days | 30 | 250 | 5 | 150 | 60, 100, 150, 200, 250 |
| homeSqFt | Home size | slider | sq ft | 500 | 5000 | 100 | 1500 | 800, 1200, 1500, 2000, 3000 |
| heatSource | Primary heat source | select | — | — | — | — | "gas" | gas, electric, propane, oil |
| insulation | Insulation quality | select | — | — | — | — | "average" | poor, average, good, excellent |

### Key design choices

- **`state`** (LIVE DATA) — loads state natural gas $/therm from
  `usStateNaturalGasPrices.ts`. The single biggest pricing variable in home
  heating cost; almost 2× range across states.
- **`heatingDays`** — more honest than "annual kBtu" inputs. Users know their
  climate intuitively ("cold 6 months" = ~180 days). Correlates with HDD
  (heating degree days) without requiring technical knowledge.
- **`heatSource`** — enables cross-fuel comparison. Gas users see what electric
  or propane would cost; electric users see their premium vs. gas. For electric,
  we use the live `usStateElectricityPrices.ts` rate too.
- **`insulation`** — the most impactful lever homeowners control. Poor insulation
  (1970s un-retrofitted) uses ~40% more energy than an excellent home (modern
  spray foam + air sealing). Surfacing this as a multiplier makes the efficiency
  insight concrete.

---

## 3. Outputs

| key | label | format | highlight | sublabel |
|---|---|---|---|---|
| annualHeatingCost | Annual heating cost | currency | ✅ | `{state} gas at live $/therm` |
| monthlyCost | Monthly average | currency | — | `annualHeatingCost ÷ 12` |
| costPerHeatingDay | Cost per heating day | currency | — | `On a day you heat` |
| annualKBtu | Heat energy used | decimal (0) | — | `kBtu per year` |

---

## 4. Formulas & logic

```
// ── Insulation efficiency multiplier ──────────────────────────────────────
insulationMultiplier:
  "poor"      → 1.40   (pre-1980 minimal insulation)
  "average"   → 1.00   (reference — code-min 2000s)
  "good"      → 0.80   (well-insulated, low air leakage)
  "excellent" → 0.65   (modern passive-house-class)

// ── Base heat load (kBtu/heating day) ─────────────────────────────────────
BASE_KBTU_PER_SQFT_PER_DAY = 0.035   // US avg residential, ASHRAE 90.1 proxy

baseKBtuPerDay = homeSqFt × BASE_KBTU_PER_SQFT_PER_DAY × insulationMultiplier
annualKBtu     = baseKBtuPerDay × heatingDays

// ── Gas ─────────────────────────────────────────────────────────────────────
gasPrice  = getUSStateNaturalGasPrice(state)    // $/therm, live
thermsNeeded = annualKBtu / KBTU_PER_THERM      // KBTU_PER_THERM = 100
annualGasCost  = thermsNeeded / GAS_FURNACE_EFFICIENCY × gasPrice
                                                 // GAS_FURNACE_EFFICIENCY = 0.80

// ── Electric resistance ─────────────────────────────────────────────────────
electricRate  = getUSStateElectricityPrice(state) // $/kWh, live
annualElecKwh = annualKBtu / KBTU_PER_KWH        // KBTU_PER_KWH = 3.412
annualElecCost = annualElecKwh × electricRate

// ── Propane ──────────────────────────────────────────────────────────────────
propanePrice  = US_PROPANE_NATIONAL_AVG           // $/gallon, national avg
gallonsPropane = annualKBtu / KBTU_PER_PROPANE_GAL // KBTU_PER_PROPANE_GAL = 91.5
annualPropaneCost = gallonsPropane / PROPANE_FURNACE_EFFICIENCY × propanePrice
                                                 // PROPANE_FURNACE_EFFICIENCY = 0.80

// ── Selected fuel cost (the highlighted output) ────────────────────────────
annualHeatingCost = annualGasCost | annualElecCost | annualPropaneCost
                    (whichever fuel the user selected)

monthlyCost      = annualHeatingCost / 12
costPerHeatingDay = annualHeatingCost / heatingDays
```

### Documented constants (sourced in calc module)

- `BASE_KBTU_PER_SQFT_PER_DAY = 0.035` — US average residential heating load
  proxy derived from ASHRAE 90.1 and EIA RECS 2020; represents a reference
  code-min 2000s home in a moderate climate.
- `GAS_FURNACE_EFFICIENCY = 0.80` — median efficiency of installed US gas
  furnaces (EIA RECS 2020: ~80% AFUE is the mode; 96% high-efficiency units
  exist but are a minority of the installed base).
- `KBTU_PER_THERM = 100` — exact conversion.
- `KBTU_PER_KWH = 3.412` — exact conversion.
- `KBTU_PER_PROPANE_GAL = 91.5` — propane energy content (EIA).
- `PROPANE_FURNACE_EFFICIENCY = 0.80` — same as gas (most propane furnaces
  are effectively the same equipment).
- `US_PROPANE_NATIONAL_AVG = 2.60` — EIA monthly average 2024–2025 $/gallon.

---

## 5. Constraints & invariants

- All cost outputs ≥ 0.
- `annualHeatingCost = selected fuel's annual cost`.
- `costPerHeatingDay = annualHeatingCost / heatingDays` (never divide by zero — min days is 30).
- `annualKBtu` is always positive when home size > 0.
- Insulation multiplier always in (0, 2] — no NaN / Infinity.
- If `heatSource = "electric"`, electricity rate is used (second live feed).

---

## 6. Datasets

- **`lib/datasets/regional/usStateNaturalGasPrices.ts`** (LIVE — NEW) — state
  residential natural gas $/therm; refreshed via Apify + EIA source added to
  `scripts/updateEnergyPrices.ts`. Getter: `getUSStateNaturalGasPrice(state)`.
- **`lib/datasets/regional/usStateElectricityPrices.ts`** (LIVE — existing) —
  used when `heatSource = "electric"`.

---

## 7. Insights

| id | severity | category | visual | live caption |
|---|---|---|---|---|
| `heating.annual-cost` | neutral/warning | spending | benchmark-bar (your cost vs national avg) | ✅ asOf |
| `heating.fuel-comparison` | neutral/positive | comparison | delta-card (your fuel vs cheapest alternative) | ✅ asOf |
| `heating.insulation-opportunity` | positive | investment-opportunity | delta-card (current vs excellent insulation saving) | — |
| `heating.ten-year-projection` | neutral/warning | projection | projection-line (inflation-adjusted) | ✅ asOf |
| `heating.high-rate-state` | neutral | comparison | text metric | — |

---

## 8. Build checklist

- [x] `lib/datasets/regional/usStateNaturalGasPrices.ts` + getter (51 states/DC)
- [x] Apify source + parser added to `scripts/updateEnergyPrices.ts`
- [x] GitHub Action updated to git-add the new dataset file
- [x] Pure calc module (`calculations/energy/heatingCost.ts`) + 24 unit tests
- [x] Config block in `calculatorConfigs.ts` (state dropdown, 5 inputs, 4 outputs)
- [x] Insight generator + `lib/insights/index.ts` export (5 insights)
- [x] `HeatingCostWithInsights` wrapper + `LiveInsightBlock` registry entry
- [x] Page at `app/tools/heating-cost/page.tsx`
- [x] All static page content synced (Step 5b) — all example numbers verified
- [x] `npx tsc --noEmit` clean, `npx vitest run` green (216 tests)
- [x] `LIVE-DATA-MOAT-STATUS.md` updated (8/13 live)
