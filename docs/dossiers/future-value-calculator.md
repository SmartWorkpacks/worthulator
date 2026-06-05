# Dossier — Future Value Calculator

**Slug:** `future-value` · **Page:** `/tools/future-value-calculator` · **Category:** finance
**Status:** ✅ Flagship · **Last built:** 2026-06-01

---

## 1. Identity / promise
Show what an investment grows to with compound interest **and** monthly
contributions — then, crucially, what that balance actually **buys in today's
dollars**, deflated by the live FRED CPI inflation rate. Most future-value
calculators stop at the misleadingly-large nominal number; this one tells the
truth about purchasing power.

## 2. Live data layer
- **FRED CPI (YoY inflation)** via `lib/datasets/finance/fredBenchmarks.ts`
  (`getCpiInflationYoY()`), refreshed by `npm run fred:refresh`.
  - Used to deflate the nominal balance: `realFV = FV / (1 + i)^years`.
  - Surfaced as the `realFutureValue` output + a live-captioned delta-card.
- No new dataset required — reuses the existing FRED layer.

## 3. Fields (and why each matters)
| Field | Why |
|---|---|
| Initial investment | Starting lump sum (can be $0). Compounds for the full horizon. |
| Monthly contribution | The habit that dominates long horizons — most of the balance comes from these + their growth. |
| Annual return rate | Nominal expected return. Hint anchors to S&P long-run (~10% nominal / ~7% real). |
| Time horizon | The single biggest lever — compounding is back-loaded, so years > dollars. |

All fields independent (engine has no cross-field reactions).

## 4. Formula / constants
```
FV      = PV·(1+r)^n + PMT·(((1+r)^n − 1) / r)    r = annualRate/12, n = years·12
Real FV = FV / (1 + i)^years                       i = live FRED CPI
```
Constants (documented in `calculations/finance/futureValue.ts`):
- `SP500_LONGRUN_NOMINAL_RETURN = 10` (benchmark only)
- `LONGRUN_CPI_AVERAGE = 3.3` (fallback only; live CPI injected via `data`)

## 5. Worked example (defaults)
`initial 10000, monthly 500, rate 7, years 20`, CPI 3.2%:
- Future value **$300,851**; invested **$130,000**; compound growth **$170,851** (56.8% of balance)
- Real (today's $) **$160,235**; inflation drag **$140,616**
- Growth multiple **2.31×**; final-year growth **$20,061**; doubling **~9.9 yr**

## 6. Invariants (pinned in tests — 18 total)
- `totalInvested = initial + monthly·months`; `totalInterest = FV − invested ≥ 0`
- zero rate → simple sum, multiple = 1; zero inputs → zeros (no NaN)
- real < nominal when inflation > 0; real = nominal at 0% inflation; monotonic in inflation
- FV monotonic in rate, years, monthly; interest share ∈ (0,100); doubling ≈ rule-of-72

## 7. Insights (6, ≥1 live-captioned visual)
1. **donut** — you invested vs compound growth (share of final balance)
2. **delta-card (live CPI)** — nominal → today's dollars + inflation drag
3. **projection-line** — balance growth curve (back-loaded)
4. **benchmark-bar** — money in vs money out (the multiple)
5. doubling cadence (rule of 72)
6. value of one more year / cost of delay

## 8. Architecture
- Pure module `calculations/finance/futureValue.ts` (data-injected CPI)
- Generator `lib/insights/generators/futureValueInsights.ts` → re-exported in `lib/insights/index.ts`
- Registry entry + `components/worthcore/FutureValueWithInsights.tsx`
- Page wired; legacy `InsightsSection`/`InsightTable` removed; Step 5b synced
