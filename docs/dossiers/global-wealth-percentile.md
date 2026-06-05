# Dossier — Global Wealth Percentile Calculator

**Slug:** `global-wealth-percentile`
**Category:** finance
**Status:** Flagship
**Module:** `calculations/finance/globalWealthPercentile.ts`
**Tests:** `calculations/finance/globalWealthPercentile.test.ts`
**Insights:** `lib/insights/generators/globalWealthPercentileInsights.ts`
**Page:** `app/tools/global-wealth-percentile/page.tsx`

---

## 1. Identity

Estimates where a person ranks among the world's adults by **net worth** and **annual
income**, using **log-normal approximations** of the global distributions calibrated to
published anchors. Also returns the implied "top X%", a daily-income figure, and an
estimated count of adults below the user — to reframe how high developed-world residents
actually rank globally.

**These are estimates** — precise per-individual global data does not exist — but the
calibration reproduces the headline thresholds.

## 2. Inputs

| Field | Unit | Type | Default | Range |
|---|---|---|---|---|
| `netWorth` | $ | slider | 250000 | 0–5,000,000 (1,000) |
| `annualIncome` | $ | slider | 60000 | 0–1,000,000 (1,000) |

## 3. Outputs

| Key | Label | Format |
|---|---|---|
| `wealthPercentile` | Wealth percentile (highlight) | percent (1dp) |
| `incomePercentile` | Income percentile | percent (1dp) |
| `dailyIncome` | Daily income | currency |
| `wealthTopPct`, `incomeTopPct`, `adultsBelowWealth` | (insight/sublabel) | — |

## 4. Model

```
percentile = Φ( (ln value − μ) / σ ) × 100      // Φ = standard normal CDF
Wealth:  μ = ln(8,654),  σ = 2.0
Income:  μ = ln(3,000),  σ = 1.05
dailyIncome       = annualIncome / 365
wealthTopPct      = 100 − wealthPercentile
adultsBelowWealth = wealthPercentile/100 × 5.4B adults
```

Φ implemented via the Abramowitz & Stegun 7.1.26 erf approximation.

**Calibration checks (reproduced by tests):**
- Wealth: $8.6k ≈ 50th · $100k ≈ top 10% · $1M ≈ top 1%.
- Income: $3k ≈ 50th · $34k ≈ top 1%.

## 5. Constraints / invariants

- `value ≤ 0` → percentile 0 (zero/negative wealth or income).
- Percentiles clamped to (0.01, 99.99) for positive inputs; never NaN/Infinity.
- More wealth/income never lowers the respective percentile (monotonic).
- `wealthTopPct = 100 − wealthPercentile`; `dailyIncome = income / 365`.

## 6. Datasets

None live — statutory/observed anchors are hard-coded constants (Credit Suisse Global
Wealth Report; World Bank). Refresh μ/σ if distributional data shifts materially.

## 7. Insights (`generateGlobalWealthPercentileInsights`)

1. **Wealth rank (benchmark bar)** — percentile vs the global top-10% line; positive when top 10%.
2. **Wealth vs income (delta-card)** — which rank is higher and what it implies.
3. **People-count reframe (positive)** — billions of adults below the user.
4. **Daily income vs poverty line** — $/day as a multiple of the $2.15/day extreme-poverty line.

## 8. Notes

- Page swapped to `EngineWithInsights`; `InsightTable` removed; JSON-LD added; formula block updated to the actual log-normal model. All related links verified.
