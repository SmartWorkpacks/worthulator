import { describe, it, expect } from "vitest";
import { calculatePayroll, PayrollInputs } from "./payroll";

const base: PayrollInputs = {
  employees: 10,
  avgSalary: 60000,
  employerTaxPct: 10,
  benefitsPerEmployee: 15000,
  billableHours: 1800,
};

describe("core payroll math", () => {
  const r = calculatePayroll(base);

  it("gross payroll = employees × salary", () => {
    expect(r.grossPayroll).toBe(600000);
  });

  it("employer taxes = gross × tax%", () => {
    expect(r.employerTaxes).toBe(60000);
  });

  it("benefits total = employees × benefits", () => {
    expect(r.benefitsTotal).toBe(150000);
  });

  it("total = gross + taxes + benefits", () => {
    expect(r.totalCost).toBe(600000 + 60000 + 150000);
  });

  it("cost per employee = total ÷ headcount", () => {
    expect(r.costPerEmployee).toBe(81000);
  });
});

describe("burden rate", () => {
  it("is cost above salary as % of salary", () => {
    const r = calculatePayroll(base);
    // (81,000 − 60,000) / 60,000 = 35%
    expect(r.burdenPct).toBeCloseTo(35, 2);
  });

  it("rises with employer tax %", () => {
    const lo = calculatePayroll({ ...base, employerTaxPct: 8 });
    const hi = calculatePayroll({ ...base, employerTaxPct: 15 });
    expect(hi.burdenPct).toBeGreaterThan(lo.burdenPct);
  });

  it("rises with benefits", () => {
    const lo = calculatePayroll({ ...base, benefitsPerEmployee: 5000 });
    const hi = calculatePayroll({ ...base, benefitsPerEmployee: 25000 });
    expect(hi.burdenPct).toBeGreaterThan(lo.burdenPct);
  });
});

describe("cost per billable hour", () => {
  it("= cost per employee ÷ billable hours", () => {
    const r = calculatePayroll(base);
    expect(r.costPerBillableHour).toBeCloseTo(81000 / 1800, 2);
  });

  it("is 0 when billable hours = 0", () => {
    expect(calculatePayroll({ ...base, billableHours: 0 }).costPerBillableHour).toBe(0);
  });

  it("decreases as billable hours rise", () => {
    const few = calculatePayroll({ ...base, billableHours: 1000 });
    const many = calculatePayroll({ ...base, billableHours: 2000 });
    expect(many.costPerBillableHour).toBeLessThan(few.costPerBillableHour);
  });
});

describe("scaling & invariants", () => {
  it("cost per employee is independent of headcount", () => {
    const a = calculatePayroll({ ...base, employees: 1 });
    const b = calculatePayroll({ ...base, employees: 50 });
    expect(b.costPerEmployee).toBeCloseTo(a.costPerEmployee, 2);
  });

  it("total scales linearly with headcount", () => {
    const a = calculatePayroll({ ...base, employees: 10 });
    const b = calculatePayroll({ ...base, employees: 20 });
    expect(b.totalCost).toBeCloseTo(a.totalCost * 2, 2);
  });
});

describe("edge cases", () => {
  it("zero employees → zero everything, no NaN", () => {
    const r = calculatePayroll({ ...base, employees: 0 });
    expect(r.totalCost).toBe(0);
    expect(r.costPerEmployee).toBe(0);
    expect(Number.isFinite(r.burdenPct)).toBe(true);
    expect(Number.isFinite(r.costPerBillableHour)).toBe(true);
  });

  it("no taxes or benefits → cost per employee equals salary", () => {
    const r = calculatePayroll({ ...base, employerTaxPct: 0, benefitsPerEmployee: 0 });
    expect(r.costPerEmployee).toBe(60000);
    expect(r.burdenPct).toBe(0);
  });

  it("never returns NaN or Infinity", () => {
    const r = calculatePayroll({ employees: 0, avgSalary: 0, employerTaxPct: 0, benefitsPerEmployee: 0, billableHours: 0 });
    expect(Object.values(r).every((v) => Number.isFinite(v))).toBe(true);
  });
});
