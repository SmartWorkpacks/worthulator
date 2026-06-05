# Calculator Build Dossier — `ev-vs-gas`

> Backfilled dossier — `ev-vs-gas` was the pilot build, completed before the
> dossier step was formalized. Logic/config/insights/page already conform.

---

## 1. Identity & intent
- **Slug:** `ev-vs-gas`
- **Label:** EV vs Gas Cost Calculator
- **Category:** finance / live energy (Archetype A)
- **Audience / search intent:** Drivers deciding between an EV and a gas car who
  want a real, state-accurate annual fuel-cost comparison — not a generic one.
- **The "wow" fact:** EV savings are **not universal**. With cheap hydro power
  (WA/ID) an EV is dramatically cheaper; in high-rate states (HI/CA/New England)
  with an efficient gas car, the EV can actually cost *more* to fuel. The
  calculator reports the real sign instead of flooring at zero — that honesty is
  the differentiator.
- **Delivery model:** single-flow.
- **Moat:** live state gas + residential electricity prices (Apify-refreshed).

---

## 2. Fields (inputs)

| name | label | type | unit | min | max | step | default | notes |
|---|---|---|---|---|---|---|---|---|
| state | Your state | dropdown | — | — | — | — | National | Loads live gas + home electricity rate |
| milesPerYear | Miles per year | slider | mi | 1000 | 30000 | 500 | 12000 | US avg ~13,500 |
| mpg | Gas car MPG | slider | — | 10 | 55 | 1 | 28 | The comparison gas car |
| kwhPer100mi | EV efficiency | slider | kWh/100mi | 20 | 50 | 1 | 30 | Most EVs 25–35 |
| publicChargingPct | Public fast-charging % | slider | % | 0 | 100 | 5 | 10 | DC fast charge ≈ 3× home |

### Key design choices
- **`state`** drives live gas + electricity — the moat. Without it this is a
  generic calculator anyone can clone.
- **`publicChargingPct`** is the clever field: blends home rate with public
  DC fast-charging (~$0.43/kWh), so a road-tripper's EV economics differ from a
  home-charger's. Most competing calculators ignore this entirely.

---

## 3. Outputs

| key | label | format | highlight |
|---|---|---|---|
| annualSavings | Annual savings with EV | currency | ✅ |
| annualGasCost | Annual gas cost | currency | — |
| annualEvCost | Annual EV fuel cost | currency | — |
| (derived) gasCostPerMile, evCostPerMile, effectiveKwhRate, breakEvenYears, fiveYearSavings, tenYearSavings, fuelInflationSavings10yr, maintenanceSavings10yr, totalAdvantage10yr | | | |

---

## 4. Formulas & logic

```
effectiveKwhRate = homeRate × (1 − publicPct) + PUBLIC_DCFC_RATE × publicPct
annualGasCost    = (miles / mpg) × gasPrice            # live state gas
annualEvCost     = (miles / 100) × kwhPer100mi × effectiveKwhRate
annualSavings    = annualGasCost − annualEvCost        # may be negative
breakEvenYears   = EV_PRICE_PREMIUM / annualSavings    # vs $7,500 premium
# 10-yr widening gap with gas inflation (electricity held flat):
fuelInflationSavings10yr = Σ max(0, annualGasCost·(1+0.04)^i − annualEvCost)
totalAdvantage10yr = fuelInflationSavings10yr + maintenanceSavings10yr
```

### Documented constants (all sourced in calc module)
- `PUBLIC_DCFC_RATE = 0.43` — blended public DC fast-charge price (US 2025).
- `EV_PRICE_PREMIUM = 7,500` — Cox/KBB median EV-vs-gas transaction gap.
- `GAS_INFLATION = 0.04` — long-run gasoline price inflation.
- `EV_MAINT_SAVINGS_PER_YEAR = 800` — Consumer Reports lifetime maintenance.

---

## 5. Constraints & invariants
- Invalid/≤0 miles, mpg, or kWh → all-zero result (no NaN/Infinity).
- `annualSavings` may be negative (reported honestly, not floored).
- `effectiveKwhRate` ∈ [homeRate, PUBLIC_DCFC_RATE].
- `breakEvenYears = 99` sentinel when savings ≤ 0.

---

## 6. Datasets (the moat)
- `lib/datasets/usStateFuelPrices.ts` — state gas $/gal (EIA/AAA vintage).
- `lib/datasets/regional/usStateElectricityPrices.ts` — state residential
  $/kWh, **all-in** (delivery + transmission), EIA-based.
- Refreshed by `scripts/updateEnergyPrices.ts` (`npm run energy:refresh`) via the
  Apify `web-scraper` actor; provenance (`lastUpdated`, `currentPeriodLabel`)
  is surfaced to users via the insight `liveCaption.asOf`.

---

## 7. Insights
| id | severity | category | visual | live caption |
|---|---|---|---|---|
| headline savings | positive/warning | comparison | benchmark-bar (gas vs EV $/mi) | ✅ asOf vintage |
| 10-yr advantage | positive | projection | projection-line | inflation note |
| break-even | neutral | comparison | delta-card | — |

---

## 8. Build checklist
- [x] Pure calc module (`calculations/finance/evVsGas.ts`) + unit tests
- [x] Config uses live state gas + electricity
- [x] Insight generator with live-captioned visuals
- [x] `EvVsGasWithInsights` wrapper + registry + page wired (no legacy components)
- [x] Static page content synced
- [x] `npx tsc --noEmit` clean, `npm test` green
- [x] Dossier (this file — backfilled)
