# Calculator Build Dossier — `road-trip-cost`

> The single source of truth for building one calculator to the flagship bar.
> Fill this out BEFORE writing code. The bar is set by two exemplars:
> meal-prep (data + logic + flow + quiet realism) and future-value (UI).

---

## 1. Identity & intent
- **Slug:** `road-trip-cost`
- **Label:** Road Trip Cost Calculator
- **Category:** travel / transport
- **Audience / search intent:** Anyone planning a car trip who wants to know the
  real fuel cost before leaving — whether it's a weekend getaway or a cross-country
  drive. Often compared against flight prices.
- **The "wow" fact:** A 600-mile round trip in a 25 MPG car costs ~$90 in fuel in
  Texas but ~$140 in California — same car, same trip, >50% more. And with 4
  passengers, each person pays less than a bus ticket.
- **Delivery model:** single-flow — one input set → instant result + insights.

---

## 2. Fields (inputs)

| name | label | type | unit | min | max | step | default | quickPicks | source of realism |
|---|---|---|---|---|---|---|---|---|---|
| state | Your state | dropdown | — | — | — | — | National | — | Live dataset; drives gas price |
| distanceMiles | One-way distance | slider | mi | 10 | 3000 | 10 | 300 | 50, 100, 200, 500, 1000 | — |
| mpg | Fuel economy | slider | MPG | 10 | 60 | 1 | 28 | 15, 20, 28, 35, 45 | EPA avg ~28 MPG for passenger vehicles |
| highwayPct | Highway driving | slider | % | 50 | 100 | 5 | 85 | 50, 70, 85, 95, 100 | Blends city/hwy efficiency; road trips are ~85% hwy |
| tolls | Estimated tolls | slider | $ | 0 | 200 | 5 | 0 | 0, 10, 25, 50, 100 | Round-trip total |
| passengers | Passengers | slider | — | 1 | 8 | 1 | 1 | 1, 2, 3, 4, 6 | For per-person split |

### Key design choices
- **State dropdown** replaces the manual gas price slider. Live gas price is the
  moat — the user doesn't have to look it up.
- **`highwayPct`** replaces the blunt 10% degradation factor. Highway driving at
  ~10% better than EPA combined, city at ~15% worse. Blending gives a real-world
  effective MPG that's more accurate and educates the user.
- **Tolls** stay as user input (no reliable national toll dataset).
- **Passengers** up to 8 (minivans, SUVs).

---

## 3. Outputs

| key | label | format | highlight | sublabel |
|---|---|---|---|---|
| roundTripFuelCost | Round-trip fuel cost | currency | ✅ | `{distance} mi each way · {effectiveMpg} eff. MPG · ${gasPrice}/gal in {state}` |
| oneWayFuelCost | One-way fuel cost | currency | — | `{gallonsOneWay} gallons needed` |
| totalTripCost | Total trip cost | currency | — | `Fuel + ${tolls} tolls` |
| costPerPerson | Cost per person | currency | — | `Split {passengers} way(s)` |
| costPerMile | Cost per mile | decimal (3) | — | `Fuel only, round trip` |
| gallonsRoundTrip | Gallons needed (round trip) | decimal (1) | — | `At {effectiveMpg} effective MPG` |
| effectiveMpg | Effective MPG | decimal (1) | — | `Blended {highwayPct}% highway / {100-highwayPct}% city` |
| gasPrice | Gas price used | — (echoed) | — | For sublabels/captions |

---

## 4. Formulas & logic (with sources)

```
EPA_HWY_BONUS   = 0.10          // Highway is ~10% better than EPA combined
EPA_CITY_PENALTY = 0.15          // City is ~15% worse than EPA combined
effectiveMpg     = mpg × (highwayPct/100 × (1 + EPA_HWY_BONUS)
                        + (1 - highwayPct/100) × (1 - EPA_CITY_PENALTY))
gallonsOneWay    = distanceMiles / effectiveMpg
gallonsRoundTrip = gallonsOneWay × 2
oneWayFuelCost   = gallonsOneWay × gasPrice
roundTripFuelCost = gallonsRoundTrip × gasPrice
totalTripCost    = roundTripFuelCost + tolls
costPerPerson    = totalTripCost / passengers
costPerMile      = roundTripFuelCost / (distanceMiles × 2)
```

**Sources:**
- EPA_HWY_BONUS / EPA_CITY_PENALTY: EPA "Your MPG Will Vary" methodology;
  real-world data from fueleconomy.gov shows highway typically 5–15% above combined,
  city 10–20% below.
- Gas prices: `usStateFuelPrices.ts` — live state-level averages (EIA/AAA sourced
  via Apify scraper).

---

## 5. Constraints & invariants

- `effectiveMpg > 0` always (guarded by mpg ≥ 10 and highwayPct ≥ 50).
- `roundTripFuelCost === oneWayFuelCost × 2` (within rounding).
- `totalTripCost === roundTripFuelCost + tolls` (exact).
- `costPerPerson × passengers === totalTripCost` (within rounding).
- Zero tolls → `totalTripCost === roundTripFuelCost` (exact).
- Passengers = 1 → `costPerPerson === totalTripCost` (exact).
- Doubling distance doubles fuel cost (exact, because no per-day rounding layer).
- No NaN/Infinity on any input combination within bounds.

---

## 6. Datasets

| field needed | dataset file | live? | source | cadence | fallback |
|---|---|---|---|---|---|
| gasPrice | `lib/datasets/usStateFuelPrices.ts` | ✅ | EIA/AAA via Apify | weekly | $3.85 national avg |

No new dataset work required — reuses existing infrastructure.

---

## 7. Insights

| id | severity | category | description |
|---|---|---|---|
| `road-trip.fuel-cost` | neutral/warning | spending | Headline: round-trip fuel cost with state context |
| `road-trip.per-mile` | positive/neutral | comparison | Your cost/mile vs national avg cost/mile — benchmark-bar (live) |
| `road-trip.carpool-saving` | positive | savings | Solo cost vs split N ways — delta-card |
| `road-trip.vs-flight` | neutral | comparison | Fuel cost vs rough flight estimate — at what passenger count does driving win? |
| `road-trip.highway-vs-city` | neutral | efficiency | What your effective MPG means: all-highway vs all-city cost comparison |
| `road-trip.high-distance` | warning (conditional) | spending | >500 mi one-way: fatigue/hotel cost reminder |

---

## 8. Visuals

| insight | visual | live caption? |
|---|---|---|
| per-mile | benchmark-bar (you vs national avg) | ✅ state gas price vintage |
| carpool-saving | delta-card (solo → split) | — |
| vs-flight | benchmark-bar (driving vs flying) | — |
| highway-vs-city | delta-card (all-hwy vs all-city cost) | — |

---

## 9. Build checklist (Definition of Done)

- [ ] Custom fields + flow in `calculatorConfigs.ts` (state dropdown, highwayPct)
- [ ] Pure calc module in `calculations/travel/roadTripCost.ts`
- [ ] Unit tests covering known values + every invariant in section 5
- [ ] Dataset wired (reuses existing usStateFuelPrices)
- [ ] Custom insight generator in `lib/insights/generators/roadTripCostInsights.ts`
- [ ] Visuals assigned and live-data aware
- [ ] `WithInsights` wrapper + registry + page rewired
- [ ] All static page content synced (Step 5b): metadata, hero, formula, steps,
      stat chips, content cards, FAQ (all worked examples recomputed)
- [ ] `npx tsc --noEmit` clean, `npm test` green
