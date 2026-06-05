# Calculator Build Dossier — Income Tax Calculator

## 1. Identity
- **Slug:** `income-tax-calculator`
- **Route:** `/tools/income-tax-calculator`
- **Primary keyword:** "income tax calculator" · 91k/mo · KD 79 · Informational
- **One-line value:** See your income tax broken down bracket by bracket — how much
  comes from each rate band, plus state income tax, your effective and marginal rates,
  and income after income tax.
- **Owner:** Owner B (Copilot)
- **Sibling differentiation:** `tax-calculator` shows the all-in burden including
  payroll tax; this one is **income tax only** with a bracket-by-bracket breakdown.

## 2. Inputs
| Field | Type | Default | Notes |
|---|---|---|---|
| Country | enum | `US` | `US` / `UK` |
| Annual income | number | 80,000 | Gross income |
| Filing status | enum | `single` | US only — selects brackets + standard deduction |
| State income tax rate | % | 0 | US only — top marginal state rate (0 = no state tax) |

## 3. Outputs
- Total income tax (federal + state) (hero).
- Effective income-tax rate, marginal rate, income after income tax.
- **Per-bracket breakdown:** tax contributed by each rate band (+ state).
- Income tax across a band of incomes.

## 4. Formulas + sources
```
taxableIncome = max(0, gross − standardDeduction)        (UK: − tapered personal allowance)
For each bracket [lower, up) at rate:
    taxedInBracket = max(0, min(taxableIncome, up) − lower)
    taxInBracket   = taxedInBracket × rate
federalTax    = Σ taxInBracket          (UK: income tax over HMRC bands)
stateTax      = gross × stateRate        (US, top marginal estimate)
totalIncomeTax = federalTax + stateTax
effectiveRate = totalIncomeTax ÷ gross
```
- US brackets + standard deduction: `data/tax/us_2026` via `getUSTaxData` (IRS Rev.
  Proc. 2025-28; standard deduction from `lib/dataStore.ts` TAX_DEFAULTS — single
  14,600 / married 29,200). UK bands + tapered personal allowance: `data/tax/uk_2026`
  via `getUKTaxData` (HMRC). **Income tax only — payroll tax (FICA / NI) is excluded.**
- **Not live** market data; statutory tables, year-stamped via `taxYear`.

## 5. Invariants / guardrails
- `federalTax = Σ per-bracket tax` (the breakdown reconstructs the total exactly).
- `totalIncomeTax = federalTax + stateTax`.
- Higher income → higher tax and ≥ effective rate; `marginalRate ≥ effectiveRate`
  for the income-tax-only figure.
- Married brackets give ≤ federal tax vs single at the same income.
- Only brackets the income reaches contribute tax; below-threshold bands contribute 0.
- All outputs finite for NaN/empty inputs; income/state-rate clamped.

## 6. Live datasets
- **None (statutory tax tables).** No "Live" badge; year-stamped.

## 7. Insights
- Which bracket contributes the most tax.
- Effective vs marginal rate gap (why your top bracket overstates what you pay).
- How state income tax adds to the federal bill.

## 8. Visuals
- `ResultHeroCard`: total income tax, with effective / marginal / after-tax sub-stats.
- `BreakdownBarChart`: tax contributed by each rate bracket (+ state).
- `ImpactLineChart`: income tax across an income band.

## 9. Build checklist
- [x] Pure engine `lib/calculators/incomeTaxEngine.ts` + ≥6 Vitest tests
- [x] Client component using Insight Kit
- [x] Dynamic `ssr:false` loader
- [x] Server `page.tsx` with metadata, hero, SEO block, FAQ, JSON-LD (year-stamped)
- [x] `npx tsc --noEmit`, lint, tests green
