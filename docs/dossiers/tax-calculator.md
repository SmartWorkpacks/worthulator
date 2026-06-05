# Calculator Build Dossier — Tax Calculator

## 1. Identity
- **Slug:** `tax-calculator`
- **Route:** `/tools/tax-calculator`
- **Primary keyword:** "tax calculator" · 165k/mo · KD 78 · Informational, Commercial
- **One-line value:** Estimate your total annual tax burden — income tax plus payroll
  tax (US FICA / UK National Insurance) and state income tax — with your effective and
  marginal rates and after-tax income.
- **Owner:** Owner B (Copilot)
- **Sibling differentiation:** `paycheck-calculator` answers "what's my take-home per
  paycheck"; `income-tax-calculator` (next) is an income-tax-only bracket deep-dive.
  This one is the **annual all-in tax burden** headline.

## 2. Inputs
| Field | Type | Default | Notes |
|---|---|---|---|
| Country | enum | `US` | `US` / `UK` |
| Annual income | number | 75,000 | Gross income |
| Filing status | enum | `single` | US only — selects brackets + standard deduction |
| State income tax rate | % | 0 | US only — top marginal state rate (0 = no state tax) |

## 3. Outputs
- Total tax owed (hero).
- Effective tax rate, marginal rate, after-tax income.
- Breakdown of the total tax: income tax, payroll (FICA / NI), state tax.
- Total tax across a band of incomes (progressivity curve).

## 4. Formulas + sources
US (annual):
```
standardDeduction = single 14,600 / married 29,200          (IRS, dataStore TAX_DEFAULTS)
taxableIncome     = max(0, gross − standardDeduction)
federalIncomeTax  = progressive over IRS brackets (data/tax/us_2026)
socialSecurity    = min(gross, ssWageBase) × 6.2%            (FICA)
medicare          = gross × 1.45% + max(0, gross − thr) × 0.9%   (ACA add'l)
stateTax          = gross × stateRate
totalTax          = federalIncomeTax + socialSecurity + medicare + stateTax
```
UK (annual):
```
personalAllowance = £12,570, tapered £1 per £2 over £100,000   (HMRC, data/tax/uk_2026)
taxableIncome     = max(0, gross − personalAllowance)
incomeTax         = progressive over UK bands
nationalInsurance = employee NI over primary/upper thresholds
totalTax          = incomeTax + nationalInsurance
```
- Brackets/allowances/NI: `data/tax/{us_2026,uk_2026}` via `getUSTaxData`/`getUKTaxData`
  (static, year-stamped — IRS Rev. Proc. 2025-28 / HMRC). FICA + standard-deduction
  constants sourced from `lib/dataStore.ts` TAX_DEFAULTS. These are **not live** market
  series; they update on the statutory schedule.

## 5. Invariants / guardrails
- `totalTax = incomeTax + payroll + stateTax` (always).
- `afterTaxIncome = gross − totalTax`; `effectiveRate = totalTax / gross`.
- Higher income → higher total tax and ≥ effective rate (progressive).
- `marginalRate ≥ effectiveRate` for positive income.
- Married brackets give ≤ tax vs single at the same income.
- All outputs finite for NaN/empty inputs; income/state-rate clamped.

## 6. Live datasets
- **None (statutory tax tables, not live market data).** Year-stamped via the tax-table
  `taxYear`. No "Live" badge.

## 7. Insights
- Effective vs marginal rate (what you actually pay vs your top bracket).
- How payroll tax (FICA/NI) compares with income tax in the total.
- How the total tax scales as income rises (progressivity).

## 8. Visuals
- `ResultHeroCard`: total tax, with effective-rate / marginal-rate / after-tax sub-stats.
- `ImpactLineChart`: total tax across an income band.
- `BreakdownBarChart`: income tax vs payroll vs state tax.

## 9. Build checklist
- [x] Pure engine `lib/calculators/taxEngine.ts` + ≥6 Vitest tests
- [x] Client component using Insight Kit
- [x] Dynamic `ssr:false` loader
- [x] Server `page.tsx` with metadata, hero, SEO block, FAQ, JSON-LD (year-stamped)
- [x] `npx tsc --noEmit`, lint, tests green
