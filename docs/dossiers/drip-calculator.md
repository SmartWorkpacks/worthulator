# Dossier — DRIP (Dividend Reinvestment) Calculator

**Slug:** `drip-calculator`
**Category:** finance
**Status:** flagship
**Differentiation:** Simulates dividends and price growth **separately** (month by month) instead
of lumping them into one rate, so it can show the number that actually defines DRIP: the
**reinvest-vs-take-as-cash advantage**, plus the dividend snowball and value in today's dollars.

## Live data layer

- **FRED CPI (YoY inflation)** via `getCpiInflationYoY()` → `realValue` (today's-dollars portfolio),
  surfaced in a live-captioned delta-card.

## Fields

| field         | unit | default | range          |
|---------------|------|---------|----------------|
| initial       | $    | 10,000  | 1,000 – 500,000|
| monthlyAdd    | $    | 200     | 0 – 2,000      |
| dividendYield | %    | 4       | 1 – 10         |
| priceGrowth   | %    | 5       | 0 – 12         |
| years         | yr   | 20      | 1 – 40         |

## Outputs

`finalValue` (highlight), `realValue` (live CPI), `dripAdvantage`, `annualDividendAtEnd`;
internal `totalContributed`, `totalGain`, `returnMultiple`, `reinvestedDividends`,
`noReinvestValue`, `doubleTimeYears`.

## Formula

```
monthly: dividend = value × yield/12
         value    = value·(1 + priceGrowth/12) + dividend + contribution
no-reinvest: dividends paid as uninvested cash; shares grow on price only
dripAdvantage = finalValue − noReinvestValue
Today's $     = finalValue / (1 + inflation)^years
```

## Worked example (defaults, CPI 3.2%)

finalValue **$193,669** · contributed **$58,000** · gain **$135,669** · multiple **3.34×** ·
reinvested dividends **$60,297** · final-year dividends **$7,747** · no-reinvest **$150,400** →
**DRIP advantage $43,269** · real value **$103,149** · doubles every **8** yrs.

## Invariants (14 tests)

sensible final value · contributed = initial + monthly·months · gain = final − contributed ·
DRIP > cash (advantage > 0) · zero yield → no advantage / no reinvested divs · advantage rises with
yield · multiple > 1 · final-year dividend = value×yield · real < nominal · higher inflation lowers
real · more years → higher value · rule-of-72 doubling · reinvested divs ∈ (0, gain) · zero
contributions still compounds.

## Insights (up to 8, conditional)

0. **DRIP advantage** — benchmark-bar (reinvest vs cash) ← flagship add
1. Gains exceed deposits — delta-card
2. Return multiple
3. Annual dividend income
4. Rule-of-72 doubling — projection-line
5. Low-yield note
6. Long-horizon reward
7. **Real value** — delta-card (live CPI) ← flagship add

## Architecture

- `calculations/finance/drip.ts` (+ `.test.ts`) — pure, data-injected
- config: `components/calculator-engine/calculatorConfigs.ts` → `drip-calculator`
- insights: `lib/insights/generators/dripInsights.ts` (export `generateDripInsights`)
- registry: `components/worthcore/LiveInsightBlock.tsx` → `drip-calculator`
- wrapper: `components/worthcore/DripWithInsights.tsx`
- page: `app/tools/drip-calculator/page.tsx` (now uses the wrapper; fixed wrong subscription STATS; SEO synced)
