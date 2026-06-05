# Dossier — Sales Tax Calculator

> **Slug:** `sales-tax` (page `sales-tax-calculator`) · **Domain:** finance/shopping
> **Calc core:** `calculations/shopping/salesTax.ts` (+ `salesTax.test.ts`, 17 tests)
> **Insights:** `lib/insights/generators/salesTaxInsights.ts`
> **Status:** Flagship · live state-rate layer

---

## 1. Identity

Computes tax on a purchase **and** the often-invisible annual burden of sales tax
on everyday spending, using each state's live combined rate — then contextualises
it with neighbor-state comparison, grocery-exemption rules, and investment
opportunity cost.

## 2. Live data layer

| Layer | Source | Getter | Use |
|---|---|---|---|
| Combined sales tax % | Tax Foundation 2026 (`salesTaxRates.ts`) | `SALES_TAX_RATE_BY_NAME`, `SALES_TAX_RATES` | Per-state combined rate, grocery-exempt flag, neighbor slugs/rates, local note |

## 3. Fields

| Field | Type | Default | Notes |
|---|---|---|---|
| state | dropdown | US Average (7.12%) | Loads live combined rate + neighbors + grocery rule |
| price | slider $1–5,000 | 100 | A single taxable purchase |
| monthlySpend | slider $100–5,000 | 800 | Typical monthly taxable spend (US avg ~$800) |

## 4. Formulas / constants

```
NATIONAL_AVG_RATE = 7.12 · MARKET_RETURN = 0.07
taxAmount        = price × rate/100
totalPrice       = price + taxAmount
monthlyTaxBurden = monthlySpend × rate/100
annualTaxBurden  = monthlyTaxBurden × 12
dailyTaxBurden   = annualTaxBurden / 365
annualIfInvested10yr = futureValueAnnuity(annualTaxBurden, 10) @ 7%
neighborAvgRate  = mean(neighbor combined rates)
vsNeighborsDelta = rate − neighborAvgRate
grocerySaving    = groceryExempt ? grocerySpend(7,500/yr) × rate/100 : 0
```

## 5. Worked example (defaults: US Average 7.12%, $100 purchase, $800/mo)

| Output | Value |
|---|---|
| Tax on purchase | $7.12 |
| Total price | $107.12 |
| Monthly tax burden | $56.96 |
| **Annual tax burden** | **$683** |
| Daily | ~$1.87 |
| If invested 10 yr @7% | ~$9,400 |

## 6. Invariants (tested)

- 0% rate → taxAmount 0, total = price.
- annual = monthly×12; daily = annual/365.
- Monotonic: ↑rate → ↑tax; ↑spend → ↑burden.
- groceryExempt false → grocerySaving 0; true → >0.
- vsNeighborsDelta sign matches above/below neighbor avg.
- All outputs finite.

## 7. Insights (6, live-captioned)

annual burden vs national benchmark-bar · neighbor-state benchmark-bar ·
grocery exemption delta-card (or taxed warning) · no-tax-state framing ·
10-yr opportunity projection-line · large-purchase framing. Captions: "Tax Foundation 2026".
