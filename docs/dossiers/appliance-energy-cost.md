# Build Dossier — Appliance Energy Cost Calculator

**Slug:** `appliance-energy-cost` · **Category:** energy / utility · **Type:** single-flow
**Archetype:** live-electricity (reuses the state residential-rate dataset, like `ev-vs-gas`)

## 1. Identity & promise
"How much does it actually cost to run this device?" — turn a wattage + usage
pattern into daily / monthly / annual cost at the user's **live state electricity
rate**, then contextualise it (share of a home bill, efficient-swap saving,
10-year inflation-adjusted cost).

## 2. Fields
| Field | Type | Default | Why it matters |
|---|---|---|---|
| `state` | dropdown | National | Loads the **live** residential $/kWh; makes the result local, not generic. |
| `watts` | slider 1–5000 (step 5) | 200 | Primary power draw. Hint maps common devices; quickPicks 10/100/200/800/1500. |
| `hoursPerDay` | slider 0.25–24 | 8 | Hours on a day it's used. |
| `daysPerWeek` | slider 1–7 | 7 | Realism — a dryer runs ~3 days, a fridge 7. |
| `quantity` | slider 1–20 | 1 | Identical units (e.g. light bulbs) — clever multiplier. |

Rate is **injected** into the pure calc module (not entered) so logic stays testable.

## 3. Outputs
- **annualCost** (highlight), `monthlyCost`, `dailyCost` (cost on a day used).
- Internal: `weeklyCost`, `kWhPerYear`, `tenYearCost`, `inflatedCost10yr`,
  `asPercentHomeBill`, `efficientSavings`, `electricRate` (echoed for captions).

## 4. Formulas
```
kWhPerUseDay = (watts / 1000) × hoursPerDay × quantity
dailyCost    = kWhPerUseDay × rate
weeklyCost   = dailyCost × daysPerWeek
annualCost   = weeklyCost × 52
monthlyCost  = annualCost / 12
kWhPerYear   = kWhPerUseDay × daysPerWeek × 52
tenYearCost      = annualCost × 10
inflatedCost10yr = Σ_{y=0..9} annualCost × (1+ELECTRICITY_INFLATION)^y
asPercentHomeBill = annualCost / (AVG_HOME_KWH_PER_YEAR × rate) × 100   // == kWh share
efficientSavings  = annualCost × EFFICIENT_SAVINGS_PCT
```

## 5. Constants (documented in calc module)
- `ELECTRICITY_INFLATION = 0.025` — EIA long-run residential price growth (~2–3%/yr).
- `AVG_HOME_KWH_PER_YEAR = 10500` — EIA average US household electricity use.
- `EFFICIENT_SAVINGS_PCT = 0.27` — ENERGY STAR-class replacement (20–30% less).

## 6. Constraints / invariants (pinned by tests)
- `monthlyCost == annualCost / 12`; `weeklyCost × 52 == annualCost`.
- `daysPerWeek` scales annual linearly (3/7 of 7-day); `quantity` scales linearly.
- Doubling rate doubles cost, leaves `kWhPerYear` unchanged.
- `asPercentHomeBill` is rate-independent (energy share).
- `inflatedCost10yr > tenYearCost`, matches the geometric series.
- Zero watts → all zero, never NaN; hours>24 / days>7 are clamped.

## 7. Datasets
- `lib/datasets/regional/usStateElectricityPrices.ts` (live, Apify-refreshed,
  all-in EIA-based residential averages — same source as EV charging cost).

## 8. Insights (all live-captioned where rate-driven)
1. **Annual cost headline** — metric + framing.
2. **Donut** — device vs rest of an average home bill (`asPercentHomeBill`).
3. **Delta-card** — efficient replacement saving (~27%).
4. **Projection-line** — 10-year inflation-adjusted cumulative cost.
5. **Always-on** (cond.) — idle-trim saving when ≥20h/day, 7d/wk.
6. **Expensive-state** (cond.) — when rate > 1.25× national.

## 9. Wiring
- Pure: `calculations/energy/applianceCost.ts` (+ `.test.ts`).
- Generator: `lib/insights/generators/applianceEnergyInsights.ts`.
- Registry: `appliance-energy-cost` in `LiveInsightBlock.tsx`.
- Wrapper: `components/worthcore/ApplianceEnergyWithInsights.tsx` → used on page.
