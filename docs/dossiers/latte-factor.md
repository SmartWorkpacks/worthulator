# Calculator Build Dossier — `latte-factor`

> The single source of truth for building one calculator to the flagship bar.

---

## 1. Identity & intent
- **Slug:** `latte-factor`
- **Label:** Latte Factor Calculator
- **Category:** finance / opportunity cost
- **Audience / search intent:** Anyone curious how small daily habits — coffee,
  snacks, energy drinks, takeout — add up over years, and what that money would
  be worth if invested instead.
- **The "wow" fact:** A $6/day weekday coffee habit invested at 7% grows to
  ~$160,000 in 30 years. You only contribute ~$47k in cash — compound interest
  does the rest. And if the price rises 3%/yr (it does), the true lifetime spend
  is ~$71k, making the opportunity cost even larger.
- **Delivery model:** single-flow.

---

## 2. Fields (inputs)

| name | label | type | unit | min | max | step | default | quickPicks | source of realism |
|---|---|---|---|---|---|---|---|---|---|
| dailySpend | Daily spend | slider | $ | 1 | 25 | 0.50 | 6 | 3, 5, 6, 8, 10 | Average specialty coffee ~$5–7 |
| daysPerWeek | Days per week | slider | days | 1 | 7 | 1 | 5 | 3, 5, 6, 7 | Most people buy on workdays (5), not 7 |
| costGrowth | Annual price increase | slider | % | 0 | 8 | 0.5 | 3 | 0, 2, 3, 4, 6 | Coffee CPI ~3%/yr over past decade |
| annualReturn | Investment return | slider | % | 0 | 12 | 0.5 | 7 | 4, 5, 7, 9, 10 | S&P 500 real ~7%/yr |
| years | Time horizon | slider | yrs | 1 | 40 | 1 | 30 | 5, 10, 20, 30, 40 | — |

### Key design choices
- **`daysPerWeek`** replaces the assumption that every habit is 7/7. Most coffee
  purchases are weekday-only (5/7). This distinction is ~29% of the bill.
- **`costGrowth`** makes the projection honest: coffee/food prices inflate. A
  $6 latte today is a $8 latte in 10 years at 3%. The invested-value formula
  uses growing annuity math so both the spend and the opportunity cost are real.

---

## 3. Outputs

| key | label | format | highlight | sublabel |
|---|---|---|---|---|
| investedValue | If invested instead | currency | ✅ | `${dailySpend}/day × ${daysPerWeek} days at ${annualReturn}% over ${years} yrs` |
| totalSpent | Total spent on habit | currency | — | `Includes ${costGrowth}% annual price increase` |
| compoundGrowth | Compound gain | currency | — | `Growth above total contributions` |
| annualSpendNow | Annual spend (year 1) | currency | — | `${dailySpend} × ${daysPerWeek} × 52` |
| annualSpendFinal | Annual spend (final year) | currency | — | `After ${years} yrs of ${costGrowth}%/yr inflation` |
| growthPct | Growth ratio | decimal (0) | — | `% of invested value that is compound gain` |

---

## 4. Formulas & logic

```
weeksPerYear   = 52
annualSpend(y) = dailySpend × daysPerWeek × 52 × (1 + costGrowth)^y

totalSpent = Σ annualSpend(y) for y = 0..years-1

investedValue uses a growing-annuity FV:
  if annualReturn ≠ costGrowth:
    FV = annualSpend(0) × [((1+r)^n - (1+g)^n) / (r - g)]
  else:
    FV = annualSpend(0) × n × (1+r)^(n-1)

  where r = annualReturn/100, g = costGrowth/100, n = years

compoundGrowth = investedValue - totalSpent
growthPct      = (compoundGrowth / investedValue) × 100
annualSpendFinal = annualSpend(years - 1)
```

**Sources:**
- Growing annuity FV formula: standard financial mathematics
- Coffee CPI: BLS CPI for "coffee" category, ~3%/yr average 2014–2024
- S&P 500 real return: ~7%/yr long-run average (Shiller data)

---

## 5. Constraints & invariants

- `investedValue ≥ totalSpent` always (returns ≥ 0%)
- `compoundGrowth = investedValue - totalSpent` (exact)
- `growthPct ∈ [0, 100)` for positive returns
- Zero return → `investedValue === totalSpent`, `compoundGrowth === 0`
- Zero cost growth → `annualSpendFinal === annualSpendNow`
- 7 days/week should match the old formula (daily × 365 ≈ daily × 7 × 52)
- No NaN/Infinity

---

## 6. Datasets

None — this is a pure math calculator with no live data dependency.

---

## 7. Insights

| id | severity | category | description |
|---|---|---|---|
| `latte.opportunity-cost` | neutral | opportunity-cost | Headline: invested value vs total spent — benchmark-bar |
| `latte.compound-power` | neutral | investment | Donut: contributions vs compound growth share |
| `latte.growth-curve` | neutral | projection | Projection-line: invested value over time |
| `latte.half-habit` | positive | savings | Delta-card: full habit vs cutting it in half |
| `latte.price-inflation` | neutral/warning | spending | Year 1 vs final year spend — what price inflation does |

---

## 8. Visuals

| insight | visual | live caption? |
|---|---|---|
| opportunity-cost | benchmark-bar (spent vs invested) | — |
| compound-power | donut (contributions vs growth) | — |
| growth-curve | projection-line (value over years) | — |
| half-habit | delta-card (full vs half spend) | — |

---

## 9. Build checklist

- [ ] Pure calc module + unit tests
- [ ] Config rewritten with daysPerWeek + costGrowth
- [ ] Insight generator upgraded
- [ ] WithInsights wrapper + registry + page
- [ ] All static page content synced (Step 5b)
- [ ] `npx tsc --noEmit` clean, `npm test` green
