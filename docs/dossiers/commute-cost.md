# Build Dossier — Commute Cost Calculator

**Slug:** `commute-cost` · **Page:** `/tools/commute-cost-calculator` · **Category:** work
**Archetype:** live-fuel (reuses `usStateFuelPrices`, same pattern as `ev-vs-gas`)

---

## 1. Identity & promise
"How much does your commute actually cost?" — turn a route + schedule into a
precise annual fuel cost using your **state's live gas price**, then surface the
hidden costs (wear & tear, inflation, WFH opportunity) that most commuters never
calculate.

The "clever realism" hooks:
- State dropdown auto-loads live $/gal (no manual entry)
- `officeDaysPerWeek` (not a buried "work days per year") — maps to how people
  actually think about hybrid schedules in 2026
- `weeksPerYear` accounts for vacation/sick leave
- Wear-and-tear cost is computed alongside fuel (per IRS/AAA) to show true cost

---

## 2. Fields

| Field | Type | Default | Why it matters |
|---|---|---|---|
| `state` | dropdown | National | Injects live $/gal — the key differentiator vs generic calculators |
| `milesOneWay` | slider 1–100 | 15 | One-way distance; calc doubles for round trip |
| `mpg` | slider 10–60 | 28 | Fuel economy; US average is ~28 MPG for cars |
| `officeDaysPerWeek` | slider 1–5 | 5 | Clearer than "work days/year" for hybrid workers |
| `weeksPerYear` | slider 40–52 | 49 | 52 − ~3 weeks vacation/holidays |

---

## 3. Outputs

- **`annualFuelCost`** (highlight) — the primary number
- `monthlyCost` — annualFuelCost / 12
- `costPerDay` — per commute day, round trip
- Internal (for insights): `annualMiles`, `fuelCostPerMile`, `gasPrice` (echoed),
  `wearCostPerYear`, `totalCostPerYear`, `effectiveDaysPerYear`,
  `fiveDay52AnnualFuelCost` (vs full-time benchmark), `wfhSavingVs5Days`,
  `tenYearInflatedCost`

---

## 4. Formulas

```
effectiveDaysPerYear   = officeDaysPerWeek × weeksPerYear
annualMiles            = milesOneWay × 2 × effectiveDaysPerYear
costPerDay             = (milesOneWay × 2 / mpg) × gasPrice
annualFuelCost         = costPerDay × effectiveDaysPerYear
monthlyCost            = annualFuelCost / 12
fuelCostPerMile        = gasPrice / mpg
wearCostPerYear        = annualMiles × WEAR_COST_PER_MILE        [IRS/AAA: $0.10/mi]
totalCostPerYear       = annualFuelCost + wearCostPerYear

fiveDay52AnnualFuel    = (milesOneWay × 2 / mpg) × gasPrice × 5 × 52
wfhSavingVs5Days       = fiveDay52AnnualFuel - annualFuelCost

tenYearInflatedCost    = Σ_{y=0..9} annualFuelCost × (1+GAS_INFLATION)^y
```

---

## 5. Constants (with sources)

- `WEAR_COST_PER_MILE = 0.10` — IRS/AAA: oil, tires, brakes (excludes depreciation/insurance)
- `GAS_INFLATION = 0.03` — EIA long-run average US gasoline price inflation
- `NATIONAL_AVG_MPG = 28.0` — EPA/NHTSA fleet average for passenger cars 2023–24
- `NATIONAL_AVG_MILES_ONE_WAY = 16.0` — US Census ACS 2023 mean commute distance

---

## 6. Constraints / invariants (pinned by tests)

- `monthlyCost ≈ annualFuelCost / 12`
- `costPerDay × effectiveDaysPerYear = annualFuelCost`
- Doubling `milesOneWay` doubles `annualFuelCost` and `annualMiles`
- Doubling `mpg` halves `annualFuelCost`
- `officeDaysPerWeek` scales `annualFuelCost` linearly vs 5-day baseline
- `wearCostPerYear = annualMiles × 0.10` exactly
- `totalCostPerYear = annualFuelCost + wearCostPerYear`
- Zero miles / zero days → all zero, never NaN
- `tenYearInflatedCost > annualFuelCost × 10` (inflation adds to flat cost)

---

## 7. Dataset

- `lib/datasets/usStateFuelPrices.ts` — live $/gal by state (AAA-scraped)
- `usStateFuelDataset.currentPeriodLabel` for caption vintage

---

## 8. Insight set

1. **Annual fuel cost headline** — severity by size, metric card
2. **Benchmark-bar** (live caption) — user $/mile vs national avg commuter $/mile
3. **Delta-card** — WFH savings: hybrid vs 5-day full-time; "1 WFH day/wk saves $X"
4. **Projection-line** (live caption) — 10-yr cumulative fuel cost, inflation-adjusted
5. **True cost reveal** — fuel + wear total vs fuel-only (always fires if >$200 wear)
6. **Low MPG opportunity** (conditional, mpg < 22) — savings from upgrading to 30 MPG

---

## 9. Wiring

- Pure: `calculations/work/commuteCost.ts` + `.test.ts`
- Generator: `lib/insights/generators/commuteInsights.ts` (rewrite)
- Registry: `commute-cost` in `LiveInsightBlock.tsx` (update adapter)
- Wrapper: `components/worthcore/CommuteCostWithInsights.tsx`
- Page: `app/tools/commute-cost-calculator/page.tsx` (update hero + remove old components)
