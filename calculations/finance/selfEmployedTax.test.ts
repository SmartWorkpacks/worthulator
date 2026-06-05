import { describe, it, expect } from "vitest";
import { calculateSelfEmployedTax } from "./selfEmployedTax";

describe("calculateSelfEmployedTax", () => {
  const base = { grossIncome: 80000, businessExpenses: 8000, federalRate: 22 };

  it("matches the SE + federal formula on a known case", () => {
    const r = calculateSelfEmployedTax(base);
    const net = 72000;
    const seTax = net * 0.9235 * 0.153;
    const fed = (net - seTax / 2) * 0.22;
    expect(r.annualTaxEstimate).toBe(Math.round(seTax + fed));
  });

  it("quarterly payment is annual / 4", () => {
    const r = calculateSelfEmployedTax(base);
    expect(r.quarterlyPayment).toBe(Math.round(r.annualTaxEstimate / 4));
  });

  it("monthly reserve is annual / 12", () => {
    const r = calculateSelfEmployedTax(base);
    expect(r.monthlyReserve).toBe(Math.round(r.annualTaxEstimate / 12));
  });

  it("SE tax is 15.3% of 92.35% of net earnings", () => {
    const r = calculateSelfEmployedTax(base);
    expect(r.seTaxAmount).toBe(Math.round(72000 * 0.9235 * 0.153));
  });

  it("net after tax is net earnings minus total tax", () => {
    const r = calculateSelfEmployedTax(base);
    expect(r.netAfterTax).toBe(Math.round(72000 - r.annualTaxEstimate));
  });

  it("net monthly is net after tax / 12", () => {
    const r = calculateSelfEmployedTax(base);
    expect(r.netMonthly).toBe(Math.round(r.netAfterTax / 12));
  });

  it("effective tax rate is total / gross", () => {
    const r = calculateSelfEmployedTax(base);
    expect(r.effectiveTaxRate).toBeCloseTo((r.annualTaxEstimate / 80000) * 100, 1);
  });

  it("more expenses lower the tax owed", () => {
    const low = calculateSelfEmployedTax({ ...base, businessExpenses: 0 });
    const high = calculateSelfEmployedTax({ ...base, businessExpenses: 30000 });
    expect(high.annualTaxEstimate).toBeLessThan(low.annualTaxEstimate);
  });

  it("higher federal bracket raises the tax owed", () => {
    const low = calculateSelfEmployedTax({ ...base, federalRate: 12 });
    const high = calculateSelfEmployedTax({ ...base, federalRate: 37 });
    expect(high.annualTaxEstimate).toBeGreaterThan(low.annualTaxEstimate);
  });

  it("higher income raises the tax owed", () => {
    const low = calculateSelfEmployedTax({ ...base, grossIncome: 40000 });
    const high = calculateSelfEmployedTax({ ...base, grossIncome: 200000 });
    expect(high.annualTaxEstimate).toBeGreaterThan(low.annualTaxEstimate);
  });

  it("expenses above income clamp net to zero", () => {
    const r = calculateSelfEmployedTax({ grossIncome: 30000, businessExpenses: 50000, federalRate: 22 });
    expect(r.annualTaxEstimate).toBe(0);
    expect(r.seTaxAmount).toBe(0);
  });

  it("effective rate is zero when gross is zero", () => {
    const r = calculateSelfEmployedTax({ grossIncome: 0, businessExpenses: 0, federalRate: 22 });
    expect(r.effectiveTaxRate).toBe(0);
  });
});
