# Calculator Build Dossier — `ev-charging-cost`

> Single source of truth for building the EV Charging Cost calculator to flagship standard.

---

## 1. Identity & intent

- **Slug:** `ev-charging-cost` (page at `/tools/ev-charging-cost`)
- **Label:** EV Charging Cost Calculator
- **Category:** energy / transport (Archetype A — live electricity)
- **Audience / search intent:** EV owners who want to know exactly what they
  pay to keep their car charged — broken down by home vs. public, and adjusted
  for their state's actual electricity rate.
- **The "wow" fact:** Charging an EV in Hawaii (~$0.36/kWh) costs over **3×**
  more per mile than in Washington (~$0.11/kWh). And drivers on a dedicated
  EV overnight rate can slash their home-charging bill by 35% vs. the standard
  residential rate — a saving most EV owners leave on the table.
- **Delivery model:** single-flow.
- **Moat:** live state residential electricity rate (Apify-refreshed). Plus the
  TOU/overnight rate field, which no competitor surfaces.

---

## 2. Fields (inputs)

| name | label | type | unit | min | max | step | default | quickPicks/options |
|---|---|---|---|---|---|---|---|---|
| state | Your state | dropdown | — | — | — | — | National | US_ENERGY_STATE_OPTIONS |
| milesPerYear | Miles driven per year | slider | mi | 1000 | 30000 | 500 | 12000 | 5000, 10000, 12000, 15000, 20000 |
| kwhPer100mi | EV efficiency | slider | kWh/100mi | 20 | 50 | 1 | 30 | 24, 28, 30, 34, 40 |
| publicChargingPct | Public fast-charging % | slider | % | 0 | 100 | 5 | 10 | 0, 10, 25, 50, 100 |
| touPlan | Home charging rate plan | select | — | — | — | — | "none" | none, basic, ev_rate |

### Key design choices

- **`state`** (LIVE DATA) — injects the all-in residential $/kWh from
  `usStateElectricityPrices.ts`. The single biggest variable in EV charging
  cost; ignored by most competing calculators.
- **`kwhPer100mi`** — the right unit (how manufacturers specify EV efficiency).
  Corresponds directly to EPA labels (e.g. Tesla Model 3 = 26 kWh/100mi,
  Rivian R1T = 44 kWh/100mi).
- **`publicChargingPct`** — DC fast-charging costs ~3× home charging.
  Road-trippers vs. home-sleepers have dramatically different economics.
- **`touPlan`** — the clever differentiator. "None" = standard rate.
  "Basic TOU" = ~20% off overnight (most utilities). "EV overnight rate" =
  ~35% off (dedicated EV rider plans: PG&E E-ELEC, Xcel EV Accelerate, etc.).
  Applied as a discount on the home-charging portion only.

---

## 3. Outputs

| key | label | format | highlight | sublabel |
|---|---|---|---|---|
| annualTotalCost | Annual charging cost | currency | ✅ | `Home + public at {state} rates` |
| monthlyCost | Monthly average | currency | — | `annualTotalCost ÷ 12` |
| costPerMileCents | Cost per mile | decimal (2dp) | — | `¢/mile` |
| homeAnnualCost | Home charging / yr | currency | — | `{100−pct}% of miles` |

---

## 4. Formulas & logic

```
// ── Live injection ──────────────────────────────────────────────────────────
homeRateRaw     = getUSStateElectricityPrice(state)   // $/kWh, live
touDiscount     = 0 | 0.20 | 0.35                     // none / basic / ev-rate
effectiveHomeRate = homeRateRaw × (1 − touDiscount)

// ── Energy splits ───────────────────────────────────────────────────────────
homeMiles    = milesPerYear × (1 − publicChargingPct / 100)
publicMiles  = milesPerYear × (publicChargingPct / 100)

// ── Annual costs ────────────────────────────────────────────────────────────
homeAnnualCost   = homeMiles   × kwhPer100mi / 100 × effectiveHomeRate
publicAnnualCost = publicMiles × kwhPer100mi / 100 × PUBLIC_DCFC_RATE
annualTotalCost  = homeAnnualCost + publicAnnualCost

// ── Derived ─────────────────────────────────────────────────────────────────
monthlyCost      = annualTotalCost / 12
costPerMileCents = (annualTotalCost / milesPerYear) × 100   // ¢/mile

// ── TOU counterfactual (for insight) ────────────────────────────────────────
noTouAnnualCost  = homeMiles × kwhPer100mi / 100 × homeRateRaw + publicAnnualCost
touAnnualSaving  = noTouAnnualCost − annualTotalCost

// ── Home-only counterfactual (for insight) ──────────────────────────────────
homeOnlyAnnualCost   = milesPerYear × kwhPer100mi / 100 × effectiveHomeRate
publicOnlyAnnualCost = milesPerYear × kwhPer100mi / 100 × PUBLIC_DCFC_RATE
```

### Documented constants (sourced in calc module)

- `PUBLIC_DCFC_RATE = 0.43` $/kWh — blended US average for DC fast-charging
  networks (ChargePoint, EVgo, Electrify America), 2025 (ICCT / BloombergNEF).
- `TOU_BASIC_DISCOUNT = 0.20` — typical off-peak discount from standard
  residential tariff (EPRI/ACEEE 2024 utility survey).
- `TOU_EV_RATE_DISCOUNT = 0.35` — dedicated EV overnight rider plans
  (PG&E E-ELEC, Xcel EV Accelerate, SCE TOU-D-PRIME — 30–40% off, median 35%).
- `ELECTRICITY_INFLATION = 0.025` — EIA long-run residential price growth.
- `HORIZON_YEARS = 10`

---

## 5. Constraints & invariants

- All cost outputs ≥ 0.
- `homeAnnualCost + publicAnnualCost = annualTotalCost`.
- `effectiveHomeRate ≤ homeRateRaw` (TOU never increases rate).
- `touAnnualSaving = 0` when `touPlan = "none"`.
- No NaN / Infinity even on zero inputs.

---

## 6. Datasets

- **`lib/datasets/regional/usStateElectricityPrices.ts`** (LIVE) — all-in
  residential $/kWh by state. Refreshed via `npm run energy:refresh`; provenance
  surfaced via insight `liveCaption.asOf`.

---

## 7. Insights

| id | severity | category | visual | live caption |
|---|---|---|---|---|
| `ev-charging.annual-cost` | neutral/warning | spending | benchmark-bar (your rate vs national avg) | ✅ asOf |
| `ev-charging.home-vs-public` | neutral | comparison | donut (home $ vs public $) | ✅ asOf |
| `ev-charging.tou-opportunity` | positive | investment-opportunity | delta-card (current vs w/ TOU) | — |
| `ev-charging.ten-year-projection` | neutral/warning | projection | projection-line | ✅ asOf |
| `ev-charging.high-rate-state` | neutral | comparison | (text only) | — |

---

## 8. Build checklist

- [x] Pure calc module (`calculations/energy/evChargingCost.ts`) + 27 unit tests
- [x] Config block in `calculatorConfigs.ts` (state dropdown, 5 inputs, 4 outputs)
- [x] Insight generator `lib/insights/generators/evChargingInsights.ts` + index.ts
- [x] `EvChargingWithInsights` wrapper + `LiveInsightBlock` registry entry
- [x] Page at `app/tools/ev-charging-cost/page.tsx` (new route)
- [x] All static page content synced (Step 5b) — all example numbers verified
- [x] `npx tsc --noEmit` clean, `npx vitest run` green (192 tests)
- [x] `LIVE-DATA-MOAT-STATUS.md` updated (7/12 live)
