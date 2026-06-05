# Dossier — Payroll Calculator

**Slug:** `payroll-calculator`
**Category:** finance
**Status:** Flagship
**Module:** `calculations/finance/payroll.ts`
**Tests:** `calculations/finance/payroll.test.ts`
**Insights:** `lib/insights/generators/payrollInsights.ts`
**Page:** `app/tools/payroll-calculator/page.tsx`

---

## 1. Identity

Computes the **true, fully-loaded cost of a workforce**: gross payroll + employer payroll
taxes + benefits. Surfaces cost per employee, the **burden rate** (extra cost above
salary), and an all-in **cost per billable hour** that a service business must clear to
break even.

## 2. Inputs

| Field | Unit | Type | Default | Range |
|---|---|---|---|---|
| `employees` | — | slider | 10 | 1–500 (1) |
| `avgSalary` | $ | slider | 60000 | 0–300,000 (1,000) |
| `employerTaxPct` | % | slider | 10 | 0–20 (0.1) |
| `benefitsPerEmployee` | $ | slider | 15000 | 0–50,000 (500) |
| `billableHours` | hrs | slider | 1800 | 0–2500 (50) — 0 skips cost/hr |

## 3. Outputs

| Key | Label | Format |
|---|---|---|
| `totalCost` | Total workforce cost (highlight) | currency |
| `costPerEmployee` | Cost per employee | currency |
| `employerTaxes` | Employer taxes | currency |
| `grossPayroll`, `benefitsTotal`, `burdenPct`, `costPerBillableHour` | (insight/sublabel) | — |

## 4. Formulas

```
grossPayroll        = employees × avgSalary
employerTaxes       = grossPayroll × employerTaxPct/100
benefitsTotal       = employees × benefitsPerEmployee
totalCost           = grossPayroll + employerTaxes + benefitsTotal
costPerEmployee     = totalCost / employees
burdenPct           = (costPerEmployee − avgSalary) / avgSalary × 100
costPerBillableHour = billableHours > 0 ? costPerEmployee / billableHours : 0
```

## 5. Constraints / invariants

- `employees` floored to an integer; all inputs clamped ≥ 0; never NaN/Infinity.
- Cost per employee is independent of headcount; total scales linearly with headcount.
- Burden rises with tax % and with benefits.
- Zero taxes + zero benefits → cost per employee = salary, burden = 0.
- Cost per billable hour decreases as billable hours rise; 0 when hours = 0.

## 6. Datasets

None (static benchmarks: FICA 7.65%, 25–40% typical burden, ~$15k avg health contribution).

## 7. Insights (`generatePayrollInsights`)

1. **Salary vs true cost (delta-card)** — base salary → true cost, +burden%.
2. **Workforce cost split (donut)** — salaries / employer taxes / benefits.
3. **Burden benchmark (bar)** — burden % vs typical ~33%; warning above 40%.
4. **Cost per billable hour** — break-even pricing anchor (when billable hours > 0).

## 8. Notes

- Page already had JSON-LD; swapped `CalculatorEngineLoader` + `InsightTable` for `EngineWithInsights` and converted the formula to a multi-line template literal.
- All related links verified to exist.
