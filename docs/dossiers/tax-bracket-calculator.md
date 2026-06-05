# Dossier — Tax Bracket Calculator

**Slug:** `tax-bracket-calculator`
**Category:** finance
**Status:** Flagship
**Module:** `calculations/finance/taxBracket.ts`
**Tests:** `calculations/finance/taxBracket.test.ts`
**Insights:** `lib/insights/generators/taxBracketInsights.ts`
**Page:** `app/tools/tax-bracket-calculator/page.tsx`

---

## 1. Identity

Computes **US federal income tax from first principles** using the 2025 progressive
brackets and the standard deduction for the filing status, then surfaces the two numbers
people confuse — the **marginal** bracket (rate on the last dollar) and the **effective**
rate (total tax ÷ gross). Replaces the old stub, which simply divided a user-entered
"taxes paid" by income.

**Scope:** federal ordinary income tax only — excludes FICA, state tax, and credits.

## 2. Inputs

| Field | Unit | Type | Default | Notes |
|---|---|---|---|---|
| `grossIncome` | $ | slider | 75000 | 0–750,000 (1,000) |
| `filingStatus` | — | select | single | single · married (MFJ) · hoh |
| `pretaxContributions` | $ | slider | 0 | 401(k)/HSA/IRA, reduces taxable income |

## 3. Outputs

| Key | Label | Format |
|---|---|---|
| `federalTax` | Federal income tax (highlight) | currency |
| `marginalRate` | Marginal bracket | percent (0dp) |
| `effectiveRate` | Effective rate | percent |
| `taxableIncome`, `afterTaxIncome`, `standardDeduction`, `effectiveOnTaxable` | (insight/sublabel) | — |

## 4. Formulas

```
taxableIncome = max(0, gross − pretax − standardDeduction[status])
federalTax    = Σ (income within each bracket × bracket rate)   // progressive
effectiveRate = federalTax / gross × 100
marginalRate  = rate of the highest bracket reached (0 if no taxable income)
afterTaxIncome = gross − federalTax
```

2025 standard deductions: single $15,000 · MFJ $30,000 · HoH $22,500.
2025 brackets (taxable income) encoded per status: 10/12/22/24/32/35/37%.

## 5. Constraints / invariants

- Inputs clamped ≥ 0; never NaN/Infinity.
- Income ≤ deduction → 0 taxable, 0 tax, 0% effective, 0% marginal.
- More income never lowers tax; marginal rate non-decreasing with income.
- Effective rate < marginal rate whenever multiple brackets are spanned.
- Married owes ≤ single; head of household sits between, at equal income.
- Pre-tax contributions reduce both taxable income and tax owed.

## 6. Datasets

None (statutory 2025 brackets are hard-coded constants; update annually).

## 7. Insights (`generateTaxBracketInsights`)

1. **Myth-buster (delta-card)** — marginal bracket vs effective rate, points lower.
2. **Take-home vs tax (donut)** — after-tax income vs federal tax, center = effective %.
3. **Benchmark bar** — effective rate vs ~13.3% US average.
4. **Pre-tax lever (positive)** — tax saved per $1,000 sheltered at the marginal rate.
5. **Standard deduction context** — amount taxed at 0%; itemize-only-if note.

## 8. Notes

- Page swapped to `EngineWithInsights`; `InsightTable` removed; JSON-LD added.
- Related links repaired (removed deleted pay-stub / dream-salary; self-employed path is `/tools/self-employed-tax`).
- Brackets are 2025 tax year (filed in 2026); refresh constants each year.
