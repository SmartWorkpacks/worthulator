// ─── Payroll Calculator — Pure Calculation Module ─────────────────────────────
//
// PURPOSE:
//   Compute the true, fully-loaded cost of a workforce: gross payroll + employer
//   payroll taxes + benefits. Returns cost per employee, the burden rate (extra
//   cost above salary), and an all-in cost per billable hour for pricing.
//
// RULES:
//   ✅ Pure TypeScript — synchronous, deterministic, no side effects
//   ❌ Never import React · never call fetch()
//
// ─────────────────────────────────────────────────────────────────────────────

export interface PayrollInputs {
  employees:           number;  // headcount
  avgSalary:           number;  // $ / year
  employerTaxPct:      number;  // % of gross payroll (FICA + FUTA/SUTA)
  benefitsPerEmployee: number;  // $ / year (health, 401k match, etc.)
  billableHours:       number;  // hours/year per employee (0 = skip)
}

export interface PayrollResult {
  grossPayroll:        number;
  employerTaxes:       number;
  benefitsTotal:       number;
  totalCost:           number;
  costPerEmployee:     number;
  /** Cost above base salary, as a % of salary */
  burdenPct:           number;
  /** All-in cost per billable hour (0 when billableHours = 0) */
  costPerBillableHour: number;
  [key: string]: number;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export function calculatePayroll(inputs: PayrollInputs): PayrollResult {
  const employees      = Math.max(0, Math.floor(Number(inputs.employees) || 0));
  const avgSalary      = Math.max(0, Number(inputs.avgSalary) || 0);
  const employerTaxPct = Math.max(0, Number(inputs.employerTaxPct) || 0);
  const benefits       = Math.max(0, Number(inputs.benefitsPerEmployee) || 0);
  const billableHours  = Math.max(0, Number(inputs.billableHours) || 0);

  const grossPayroll  = employees * avgSalary;
  const employerTaxes = grossPayroll * (employerTaxPct / 100);
  const benefitsTotal = employees * benefits;
  const totalCost     = grossPayroll + employerTaxes + benefitsTotal;

  const costPerEmployee = employees > 0 ? totalCost / employees : 0;

  return {
    grossPayroll:        round2(grossPayroll),
    employerTaxes:       round2(employerTaxes),
    benefitsTotal:       round2(benefitsTotal),
    totalCost:           round2(totalCost),
    costPerEmployee:     round2(costPerEmployee),
    burdenPct:           avgSalary > 0 ? round2(((costPerEmployee - avgSalary) / avgSalary) * 100) : 0,
    costPerBillableHour: billableHours > 0 ? round2(costPerEmployee / billableHours) : 0,
  };
}
