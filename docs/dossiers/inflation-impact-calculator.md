# Dossier — Inflation Impact Calculator

> **Slug:** `inflation-impact-calculator` · **Domain:** finance · **Engine:** single-flow config
> **Calc core:** `calculations/finance/inflationImpact.ts` (+ test, 17 tests)
> **Insights:** `lib/insights/generators/inflationImpactInsights.ts`
> **Status:** Flagship · live FRED CPI layer

---

## 1. Identity

Shows how inflation erodes purchasing power, framed two ways most calculators
miss: what today's money will be **worth** later, and the mirror — what you'll
**need** later to keep pace. Plus the intuitive "your money halves in N years"
anchor and a benchmark against the live CPI.

## 2. Live data layer

| Layer | Source | Getter | Use |
|---|---|---|---|
| CPI inflation YoY | FRED `CPIAUCSL` (computed YoY) | `getCpiInflationYoY()` | Default inflation rate (~3.2%, Q1 2026) + benchmark for the user's assumption |

## 3. Fields

| Field | Type | Default | Notes |
|---|---|---|---|
| amount | slider $100–1M | 10,000 | Money today |
| rate | slider 0.5–15% (0.1 step) | `getCpiInflationYoY()` | Live CPI default, overridable |
| years | slider 1–50 | 20 | Horizon |

## 4. Formulas / constants

```
growth          = (1 + r)^years
futureValue     = amount / growth            # buying power
loss            = amount − futureValue
lossPercent     = loss / amount × 100
requiredFuture  = amount × growth            # mirror: keep pace
erosionMultiple = growth
firstYearLoss   = amount − amount/(1+r)
dailyLossFirstYear = firstYearLoss / 365
yearsToHalve    = ln(2) / ln(1+r)            # exact, not Rule of 72
realValueRatio  = futureValue / amount
vsCurrentCpi    = rate − currentCpiRate      # data-injected benchmark
```

## 5. Worked example (defaults: $10,000, live 3.2% CPI, 20 yr)

| Output | Value |
|---|---|
| **Future buying power** | **$5,326** |
| Purchasing power lost | $4,674 (46.7%) |
| Needed to keep pace | $18,776 |
| Money halves in | ~22.0 years |
| Year-1 real loss | ~$310 |

## 6. Invariants (tested)

- `futureValue × erosionMultiple ≈ amount`; requiredFuture mirror correct.
- yearsToHalve uses exact log; ↑rate → faster halving.
- Monotonic: ↑rate/↑years → ↑loss; amount scales loss linearly.
- rate 0 → no loss, requiredFuture = amount, yearsToHalve = 0.
- vsCurrentCpi sign matches above/below live CPI.
- lossPercent in (0,100); all outputs finite.

## 7. Insights (6, live CPI-captioned)

erosion benchmark-bar (today vs future) · required-future delta-card · buying-power
decline projection-line · halving-horizon metric · rate-vs-live-CPI benchmark-bar ·
break-even / year-1 erosion framing. Captions: "US CPI x% YoY (FRED Q1 2026)".
