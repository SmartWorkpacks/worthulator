# Calculator Build Dossier — `laundry-cost-calculator`

> The single source of truth for building one calculator to the flagship bar.

---

## 1. Identity & intent
- **Slug:** `laundry-cost-calculator`
- **Label:** Laundry Cost Calculator
- **Category:** home / everyday costs
- **Audience / search intent:** Homeowners and renters curious about the real
  per-load and annual cost of laundry — and what levers actually move the bill
  (machine efficiency, electricity rate, water temperature, detergent choice).
- **The "wow" fact:** A family running 8 loads/week with an older machine in
  California pays ~$780/year on home laundry — in Louisiana it's ~$380. Same
  family, same habits, half the cost just from the electricity rate.
- **Delivery model:** single-flow.

---

## 2. Fields (inputs)

| name | label | type | unit | min | max | step | default | quickPicks | source of realism |
|---|---|---|---|---|---|---|---|---|---|
| state | Your state | dropdown | — | — | — | — | National | — | Live electricity rate from dataset |
| loadsPerWeek | Loads per week | slider | — | 1 | 20 | 1 | 5 | 2, 4, 6, 8, 10 | AHAM: avg US household 5–8 loads/wk |
| machineType | Machine type | select | — | — | — | — | standard | — | Drives combined kWh/load |
| waterTemp | Water temperature | select | — | — | — | — | warm | — | Hot uses ~5× the wash-cycle energy of cold |
| detergentCost | Detergent per load | slider | $ | 0.05 | 1.50 | 0.05 | 0.25 | 0.10, 0.15, 0.25, 0.40, 0.75 | — |

### Machine type options & kWh per load
| label | washer kWh | dryer kWh | total kWh | source |
|---|---|---|---|---|
| HE front-loader | 0.15 | 2.5 | 2.65 | Energy Star spec + heat-pump dryer data |
| Modern top-loader | 0.30 | 3.0 | 3.30 | Energy Star certified standard |
| Standard (default) | 0.50 | 3.3 | 3.80 | DOE reference baseline |
| Older / less efficient | 0.80 | 4.5 | 5.30 | Pre-2010 non-Energy-Star avg |

### Water temperature options & wash-cycle multiplier
| label | multiplier on washer kWh | source |
|---|---|---|
| Cold | 0.20 | ~90% of wash energy is heating water (DOE) |
| Warm (default) | 1.00 | baseline — mixed hot/cold fill |
| Hot | 1.80 | full hot cycle |

### Key design choices
- **State dropdown** replaces the manual electricity rate slider. Live data moat.
- **Water temperature** is a new field. It dramatically affects the washer's
  energy use (cold cuts it 80%) but has negligible effect on the dryer. We apply
  it to the washer kWh only.
- **Machine type** is a select with 4 realistic options mapping to documented
  kWh/load pairs rather than a bare kWh slider.
- **Water cost per load** is a documented constant ($0.12/load — 30 gal × $0.004/gal,
  EPA/AWWA 2024), not a user input, since it varies little and would add clutter.

---

## 3. Outputs

| key | label | format | highlight | sublabel |
|---|---|---|---|---|
| costPerLoad | Cost per load | currency | ✅ | `Electricity + water + detergent at ${rate}/kWh in {state}` |
| weeklyCost | Weekly cost | currency | — | `{loadsPerWeek} loads/week` |
| annualCost | Annual cost | currency | — | `52 weeks` |
| electricityCostPerLoad | Electricity per load | currency | — | `{totalKwh} kWh × ${rate}/kWh` |
| electricityPct | Electricity share | decimal (0) | — | `% of per-load cost` |
| annualKwh | Annual kWh | decimal (0) | — | `{loadsPerWeek} × 52 × {totalKwh}` |
| electricRate | Electricity rate | — (echoed) | — | For sublabels |
| totalKwhPerLoad | Total kWh per load | — (echoed) | — | For sublabels |

---

## 4. Formulas & logic (with sources)

```
WATER_COST_PER_LOAD = 0.12       // 30 gal × $0.004/gal (EPA/AWWA 2024)

washerKwh (base)   = machineType.washerKwh
washerKwh (adj)    = washerKwh × waterTempMultiplier
dryerKwh           = machineType.dryerKwh
totalKwhPerLoad    = washerKwh (adj) + dryerKwh

electricityCostPerLoad = totalKwhPerLoad × electricRate
costPerLoad            = electricityCostPerLoad + WATER_COST_PER_LOAD + detergentCost
weeklyCost             = costPerLoad × loadsPerWeek
annualCost             = weeklyCost × 52
electricityPct         = (electricityCostPerLoad / costPerLoad) × 100
annualKwh              = totalKwhPerLoad × loadsPerWeek × 52
```

---

## 5. Constraints & invariants

- `costPerLoad === electricityCostPerLoad + WATER_COST_PER_LOAD + detergentCost` (exact)
- `annualCost === weeklyCost × 52` (within rounding)
- `electricityPct ∈ [0, 100]`
- Cold water → washer kWh drops ~80% vs warm → total kWh drops meaningfully
  but dryer stays the same
- Machine upgrade (older → HE): total kWh drops ~50%, annual cost drops accordingly
- Zero loads → zero cost (all outputs 0)
- No NaN/Infinity

---

## 6. Datasets

| field needed | dataset file | live? | source | cadence | fallback |
|---|---|---|---|---|---|
| electricRate | `lib/datasets/regional/usStateElectricityPrices.ts` | ✅ | EIA all-in via Apify | weekly | $0.16 national avg |

No new dataset work required.

---

## 7. Insights

| id | severity | category | description |
|---|---|---|---|
| `laundry.annual-cost` | neutral/warning | spending | Headline: annual laundry cost with state context |
| `laundry.electricity-share` | neutral | spending | Donut: electricity vs water vs detergent per load |
| `laundry.cold-water-saving` | positive | savings | Delta-card: warm → cold water saving |
| `laundry.machine-upgrade` | positive/neutral | savings | Delta-card: current machine → HE front-loader |
| `laundry.vs-laundromat` | positive | comparison | Benchmark-bar: at-home cost vs laundromat ($3.50/load avg) |
| `laundry.high-rate-state` | warning (conditional) | spending | High electricity rate state warning |

---

## 8. Visuals

| insight | visual | live caption? |
|---|---|---|
| electricity-share | donut (elec vs water vs detergent) | ✅ state rate |
| cold-water-saving | delta-card (warm → cold) | — |
| machine-upgrade | delta-card (current → HE) | — |
| vs-laundromat | benchmark-bar (home vs laundromat) | — |

---

## 9. Build checklist

- [ ] Custom fields + flow in `calculatorConfigs.ts`
- [ ] Pure calc module in `calculations/home/laundryCost.ts`
- [ ] Unit tests covering invariants
- [ ] Dataset wired (reuses usStateElectricityPrices)
- [ ] Insight generator
- [ ] WithInsights wrapper + registry + page
- [ ] All static page content synced (Step 5b)
- [ ] `npx tsc --noEmit` clean, `npm test` green
