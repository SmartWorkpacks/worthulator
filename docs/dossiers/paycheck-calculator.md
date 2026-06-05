# Calculator Build Dossier — Paycheck Calculator

## 1. Identity
- **Slug:** `paycheck-calculator`
- **Route:** `/tools/paycheck-calculator`
- **Primary keyword:** "paycheck calculator" · 450k/mo · KD 87 · Informational, Commercial
- **One-line value:** Turn an annual salary into a realistic take-home paycheck after
  federal income tax, FICA (Social Security + Medicare), and state income tax — for
  any US state, filing status, and pay frequency (UK income tax + National Insurance
  supported via the region model).
- **Owner:** Owner B (Copilot)

## 2. Inputs
| Field | Type | Default | Range / options | Notes |
|---|---|---|---|---|
| Country | enum | `US` | `US`, `UK` | Switches tax model |
| Gross annual pay | number | 65,000 | 0 – 2,000,000 | Salary before any deductions |
| Pay frequency | enum | `biweekly` | weekly / biweekly / semimonthly / monthly / annual | Drives per-paycheck math |
| Filing status (US) | enum | `single` | single / married | Selects federal bracket set + standard deduction |
| State (US) | enum | `CA` | 50 states + DC | Applies top marginal state income tax rate |
| Pre-tax retirement % | number | 5 | 0 – 50 | Traditional 401(k)/pension, capped at the annual limit |

## 3. Outputs
- Net (take-home) pay per paycheck — **hero number**.
- Net annual, take-home %.
- Federal income tax, Social Security, Medicare, State income tax (US).
- Income tax, National Insurance (UK).
- Retirement contribution (annual).
- Effective tax rate, marginal income-tax rate.
- Deduction breakdown (chart-ready, shares of gross).
- Net-pay-vs-salary impact curve.

## 4. Formulas + sources
**US**
```
retirement      = min(gross × pct%, 401k limit)
federalTaxable  = max(0, gross − retirement − standardDeduction)
federalTax      = progressive marginal sum over IRS brackets(filingStatus)
socialSecurity  = min(gross, ssWageBase) × 6.2%
medicare        = gross × 1.45% + max(0, gross − addlThreshold) × 0.9%
stateTax        = max(0, gross − retirement) × stateTopMarginalRate%
net             = gross − retirement − federalTax − SS − medicare − stateTax
```
**UK**
```
pension     = min(gross × pct%, £60,000 annual allowance)
incomeForTax= max(0, gross − pension)
PA          = personalAllowance, tapered £1 per £2 of income over £100,000
taxable     = max(0, incomeForTax − PA)
incomeTax   = progressive marginal sum over HMRC bands
NI          = 8% between primary & upper earnings limit, 2% above
net         = gross − pension − incomeTax − NI
```

**Sources (all static constants in-repo — calculators never fetch at runtime):**
- US federal brackets, SS wage base, FICA rates: `data/tax/us_2026.ts` (IRS Rev. Proc. 2025-28; SSA wage base).
- US standard deductions + 401(k) limit: `lib/dataStore.ts` `TAX_DEFAULTS` (IRS).
- Additional Medicare tax 0.9% over $200k single / $250k married (IRS, ACA).
- State top marginal income tax rates: `src/lib/stateTax.ts` `stateTaxRates`.
- UK income tax bands, personal allowance taper, NI: `data/tax/uk_2026.ts` (HMRC, Autumn Budget 2024).

> **Approximation note:** State tax uses each state's *top marginal* rate as a flat
> rate (consistent with the existing take-home-pay tool). It overstates tax for low
> earners in graduated-rate states; framed as an estimate in copy.

## 5. Invariants / guardrails
- Net pay never negative, never NaN/Infinity (all divisions guarded, inputs clamped).
- Higher gross → higher net annual (monotonic).
- Higher-tax state → lower net at equal gross.
- Retirement contribution never exceeds the annual limit.
- Deduction shares + take-home share ≈ 100% of gross.
- `0 ≤ effectiveTaxRate < 1`.

## 6. Live datasets
- **None.** All tax data is static (confirmed: no `tax`/`bracket`/`fica` series in
  `lib/datasets/refreshRegistry.ts`). No "Live" badge is shown.

## 7. Insights
- Take-home % and the single biggest deduction line.
- Marginal vs effective rate gap.
- FICA is charged on gross even on pre-tax 401(k) dollars (Social Security/Medicare aren't reduced).
- State choice swing (no-tax state vs current).

## 8. Visuals
- `ResultHeroCard`: net per paycheck, with annual/effective-rate/take-home sub-stats.
- `BreakdownBarChart`: where each gross dollar goes (take-home + each tax + retirement).
- `ImpactLineChart`: net per paycheck across a salary range.

## 9. Build checklist
- [x] Pure engine `lib/calculators/paycheckEngine.ts` + ≥6 Vitest tests
- [x] Client component using Insight Kit (`useStagedReveal`, `ResultHeroCard`, `InsightList`, charts)
- [x] Dynamic `ssr:false` loader
- [x] Server `page.tsx` with metadata, hero, SEO block, FAQ, JSON-LD — copy recomputed from engine
- [x] `npx tsc --noEmit`, `npm run lint`, `npm test` green
