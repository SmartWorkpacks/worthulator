# Calculator Build Dossier — How Much House Can I Afford Calculator

## 1. Identity
- **Slug:** `how-much-house-can-i-afford-calculator`
- **Route:** `/tools/how-much-house-can-i-afford-calculator`
- **Primary keyword:** "how much house can i afford" · 135k/mo · KD 68 · Informational
- **One-line value:** Turn your income, debts, and down payment into a realistic
  maximum home price using lender DTI ratios and today's mortgage rate, with a full
  monthly-payment breakdown and a rate-sensitivity curve.
- **Owner:** Owner B (Copilot)

## 2. Inputs
| Field | Type | Default | Notes |
|---|---|---|---|
| Annual income | number | 90,000 | Gross household income |
| Monthly debts | number | 500 | Car, student, card minimums (excl. housing) |
| Down payment | number | 40,000 | Cash toward purchase |
| Mortgage rate | % | **live** `mortgage30yr` | Freddie Mac 30-yr fixed, FRED — editable default |
| Loan term | years | 30 | 10–40 |
| Property tax rate | % / yr | 1.1 | Annual % of home value |
| Home insurance | $ / yr | 1,800 | Fixed annual premium |
| HOA | $ / mo | 0 | Optional monthly dues |
| Front-end DTI | % | 28 | Housing ÷ gross income cap |
| Back-end DTI | % | 36 | (Housing + debts) ÷ gross income cap |

## 3. Outputs
- Maximum home price (hero).
- Loan amount, monthly payment (PITI + HOA).
- Monthly breakdown: principal & interest, property tax, insurance, HOA.
- The binding constraint (front-end vs back-end DTI).
- Max home price across a band of mortgage rates (rate sensitivity).

## 4. Formulas + sources
The maximum housing budget is the lower of the two standard lender ratios; the home
price is then solved algebraically (price is linear once tax is proportional to price).
```
monthlyIncome = annualIncome / 12
frontCap      = monthlyIncome × frontDTI
backCap       = monthlyIncome × backDTI − monthlyDebts
maxHousing    = max(0, min(frontCap, backCap))          (PITI + HOA budget)

available     = maxHousing − insurance/12 − hoa          (left for P&I + tax)
piFactor      = r / (1 − (1+r)^−n)      (r = monthly rate, n = term months; r=0 ⇒ 1/n)
taxFactor     = propertyTaxRate / 100 / 12

  available = (H − D)·piFactor + H·taxFactor
⇒ H = (available + D·piFactor) / (piFactor + taxFactor)

loan          = max(0, H − downPayment)
P&I           = loan × piFactor
```
- DTI ratios: the conventional **28/36 rule** used by lenders (Fannie/Freddie
  conforming guidance; 43% is the QM back-end ceiling, offered as an upper option).
- **Mortgage rate default is live:** `fredBenchmarks.mortgage30yr` (Freddie Mac
  MORTGAGE30US via FRED), "as of"-stamped with `currentPeriodLabel` / `lastUpdated`.

## 5. Invariants / guardrails
- `maxHomePrice ≥ downPayment` (you can always buy with cash on hand).
- `loanAmount = maxHomePrice − downPayment`, never negative.
- Monthly payment components sum to the total PITI + HOA.
- Higher mortgage rate → lower (or equal) max home price (monotonic).
- Higher income → higher max home price; higher existing debts → lower.
- Binding constraint correctly reported as front-end or back-end.
- All outputs finite for NaN/empty inputs; rates and ratios clamped.

## 6. Live datasets
- **`lib/datasets/finance/fredBenchmarks.ts` → `mortgage30yr`** (Freddie Mac 30-yr
  fixed). Used as the editable default rate and surfaced as a dated "as of" stat.
  Refreshed by `scripts/updateFredBenchmarks.ts` (Owner A). No runtime fetch.

## 7. Insights
- Which lender ratio is the binding constraint, and the dollar gap to the other.
- Share of the monthly payment that is principal & interest vs taxes/insurance.
- How much buying power shifts per point of mortgage rate.

## 8. Visuals
- `ResultHeroCard`: max home price, with loan / monthly payment / down-payment sub-stats.
- `ImpactLineChart`: max home price across a mortgage-rate band (rate sensitivity).
- `BreakdownBarChart`: monthly payment split (P&I, tax, insurance, HOA).

## 9. Build checklist
- [x] Pure engine `lib/calculators/houseAffordabilityEngine.ts` + ≥6 Vitest tests
- [x] Client component using Insight Kit
- [x] Dynamic `ssr:false` loader
- [x] Server `page.tsx` with metadata, hero, SEO block, FAQ, JSON-LD, dated live rate
- [x] `npx tsc --noEmit`, lint, tests green
