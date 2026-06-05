# Live-Data Moat — Status & Roadmap

> **Single source of truth** for which calculators use live (Apify-refreshed)
> data, how the refresh pipeline works, and what's planned. Update this whenever
> a calculator gains/loses live data or the pipeline changes.
>
> Last updated: 2026-06-01

---

## 1. The moat in one sentence

State-accurate, regularly-refreshed real-world prices (gas, electricity,
cigarettes) injected into calculators — so the answers are *current and local*,
not generic constants any competitor can copy.

---

## 2. Refresh pipeline

| Piece | Location | Notes |
|---|---|---|
| Scraper | `scripts/updateEnergyPrices.ts` | Apify `web-scraper` actor → generic table extractor |
| Run command | `npm run energy:refresh` | Loads `APIFY_API_TOKEN` from `.env.local` |
| Automation | `.github/workflows/refresh-live-data.yml` | **Scheduled weekly** + manual `workflow_dispatch` |
| Safety | built-in | <40 states parsed → keep static fallback; never writes NaN; app never breaks |
| Provenance | dataset `lastUpdated` + `currentPeriodLabel` | Surfaced to users via insight `liveCaption.asOf` |

### Live datasets
| Dataset | File | Source | Consumed by |
|---|---|---|---|
| Gas $/gal | `lib/datasets/usStateFuelPrices.ts` | AAA / EIA | ev-vs-gas, commute-cost, road-trip-cost |
| Electricity $/kWh (all-in) | `lib/datasets/regional/usStateElectricityPrices.ts` | EIA / electricchoice.com | ev-vs-gas, laundry-cost, appliance-energy, ev-charging-cost, heating-cost |
| Cigarettes $/pack | `lib/datasets/regional/usStateCigarettePrices.ts` | CDC / Tax Foundation | quit-smoking |
| Natural gas $/therm | `lib/datasets/regional/usStateNaturalGasPrices.ts` | EIA Natural Gas Monthly | heating-cost |
| Water + sewer $/1k gal | `lib/datasets/regional/usStateWaterRates.ts` | AWWA / utility surveys (via Apify) | water-bill-calculator |
| Sales tax (combined %) | `lib/datasets/tax/salesTaxRates.ts` | Tax Foundation 2026 | sales-tax-calculator, **car-loan-calculator**, **budget-calculator** |
| Median hourly wage | `lib/datasets/regional/usStateMedianWages.ts` | BLS OEWS May 2024 (via Apify) | screen-time-impact, procrastination-cost, meeting-cost |
| Net worth percentiles by age | `lib/datasets/netWorthPercentiles.ts` | Federal Reserve SCF 2022 (static reference, ~3-yr cadence) | **net-worth-calculator** (age-bracket percentile rank + median comparison) |
| Macro lending/inflation rates | `lib/datasets/finance/fredBenchmarks.ts` | St. Louis Fed — FRED CSV (`npm run fred:refresh`) | **car-loan-calculator** (auto APR), **debt-payoff-calculator** (credit-card APR default), **inflation-impact-calculator** (CPI rate), **future-value** (CPI → real value), **savings-goal-calculator** (CPI → inflation-adjusted goal), **savings-calculator** (CPI → real return + today's-dollars balance), **401k-calculator** (CPI → today's-dollars retirement balance), **millionaire-calculator** (CPI → real value of $1M + years to a real million), **emergency-fund-calculator** (CPI → inflation drift vs HYSA interest on the target), **drip-calculator** (CPI → today's-dollars portfolio value), **coast-fire-calculator** (CPI → real-return coast number vs naive nominal figure), **down-payment-countdown** (HYSA APY + CPI → interest while saving, moving target, today's-dollars value), **compound-interest-calculator** (CPI → inflation default for today's-dollars view, stamped), **roi-calculator** (CPI → inflation default for real-return analysis); planned: mortgage |

> **Multi-layer note:** `car-loan-calculator` stacks **two** live layers for bazooka accuracy — FRED auto-loan APR (default rate) + state sales tax (financed into the out-the-door price, with the trade-in tax credit applied per state).

---

## 3. Flagship calculators — live-data status

| # | Calculator | Live data? | Source | Notes |
|---|---|---|---|---|
| 1 | `ev-vs-gas` | ✅ gas + electricity | state | Blended home/public charge rate |
| 2 | `commute-cost` | ✅ gas | state | |
| 3 | `road-trip-cost` | ✅ gas | state | |
| 4 | `laundry-cost-calculator` | ✅ electricity | state | |
| 5 | `appliance-energy-cost` | ✅ electricity | state | |
| 6 | `ev-charging-cost` | ✅ electricity | state | home/public split, TOU rate savings |
| 7 | `heating-cost` | ✅ gas + electricity | state | live gas $/therm + cross-fuel comparison |
| 8 | `water-bill-calculator` | ✅ water + sewer | state | **NEW** — live $/1,000 gal + usage/outdoor/leak insights |
| 9 | `quit-smoking` | ✅ cigarettes | state | state pack-price benchmark |
| 9 | `latte-factor` | ➖ pure-math | — | Habit cost, user-entered. No meaningful regional feed |
| 10 | `grocery-unit-price` | ➖ pure-math | — | Comparison of user's two items. (Future: national staple benchmark) |
| 11 | `tip-calculator` | ➖ by nature | — | Tipping norms are cultural constants, not live data |
| 12 | `alcohol-cost-calculator` | ➖ pure-math | — | "Cost per drink" too personal/blended. (Future: state alcohol-tax context) |
| 13 | `vaping-cost-calculator` | ➖ pure-math | — | No clean regional vape-price dataset; brand-driven |

**Live-data coverage: 9 / 14 flagship calculators.**

---

## 4. Assessment of the 6 non-live calculators

| Calculator | Plausibility | Decision | Rationale |
|---|---|---|---|
| `quit-smoking` | **HIGH** | ✅ **DONE** | Cigarette pack price varies $6 (MO) → $12+ (NY) by state excise. Strong, scrapeable, directly relevant. |
| `grocery-unit-price` | MEDIUM | 🔜 Future | Could add live national average unit-prices for common staples as a "good deal vs national?" benchmark. Needs a per-product price feed — heavier lift. |
| `alcohol-cost-calculator` | LOW–MED | ❌ Not now | State alcohol excise data exists, but per-drink cost blends home/bar and is highly personal. Live feed would be weak signal. |
| `vaping-cost-calculator` | LOW | ❌ Not now | No reliable regional vape-price dataset; pricing is brand/device-driven, not geographic. |
| `latte-factor` | LOW | ❌ By nature | Daily spend is user-entered habit cost. A national coffee-price benchmark adds little. |
| `tip-calculator` | N/A | ❌ By nature | Tipping is a cultural constant (15/20/25%), not a live regional price. |

---

## 5. Roadmap / open items

- [x] Scheduled GitHub Action so data refreshes without a human (moat = real).
- [x] Add live state cigarette prices → quit-smoking.
- [x] Build `ev-charging-cost` with live electricity rates + TOU savings insight.
- [x] Build `heating-cost` — new `usStateNaturalGasPrices` dataset (EIA), live gas + electricity, cross-fuel + insulation insights.
- [x] Build `water-bill-calculator` — new `usStateWaterRates` dataset (AWWA/utility surveys via Apify), live $/1,000 gal + conservation/leak insights.
- [ ] (Future) Grocery staple national-average benchmark dataset for grocery-unit-price.
- [ ] (Future) Harden scrapers against source HTML changes (add a 2nd fallback source per metric).
- [ ] (Future) Add a visible "data as of {month}" badge on calculator pages, not just inside insights.

---

## 6. How to verify the moat is live

1. Ensure `APIFY_API_TOKEN` is set as a GitHub repo secret.
2. The Action runs weekly (Mondays) and on manual dispatch.
3. Check a dataset file's `lastUpdated` — it should track recent runs.
4. Local manual run: `npm run energy:refresh`.
