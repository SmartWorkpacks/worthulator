import { describe, expect, it } from "vitest";
import { calculateIncomeTax, type IncomeTaxInputs } from "./incomeTaxEngine";

const US_BASE: IncomeTaxInputs = {
  country: "US",
  annualIncome: 80_000,
  filingStatus: "single",
  stateRatePct: 0,
  year: 2026,
};

describe("calculateIncomeTax", () => {
  it("computes a known US single-filer income tax with per-bracket detail", () => {
    const r = calculateIncomeTax(US_BASE);
    // taxable = 80,000 − 14,600 = 65,400 → spans the 10/12/22% bands.
    expect(r.taxableIncome).toBeCloseTo(65_400, 1);
    expect(r.federalTax).toBeCloseTo(9_189, 0);
    expect(r.marginalRate).toBeCloseTo(0.22, 5);
    expect(r.brackets).toHaveLength(3);
    // The per-bracket tax reconstructs the federal total exactly.
    const bracketSum = r.brackets.reduce((acc, b) => acc + b.tax, 0);
    expect(bracketSum).toBeCloseTo(r.federalTax, 1);
  });

  it("makes the breakdown reconstruct the total income tax", () => {
    const r = calculateIncomeTax({ ...US_BASE, stateRatePct: 5 });
    expect(r.stateTax).toBeCloseTo(80_000 * 0.05, 1);
    expect(r.totalIncomeTax).toBeCloseTo(r.federalTax + r.stateTax, 1);
    const sum = r.breakdown.reduce((acc, b) => acc + b.amount, 0);
    expect(sum).toBeCloseTo(r.totalIncomeTax, 1);
    // The state line is appended when a state rate is set.
    expect(r.breakdown.some((b) => b.label === "State income tax")).toBe(true);
  });

  it("only counts brackets the income actually reaches", () => {
    const r = calculateIncomeTax({ ...US_BASE, annualIncome: 20_000 });
    // taxable = 20,000 − 14,600 = 5,400 → only the 10% band applies.
    expect(r.brackets).toHaveLength(1);
    expect(r.brackets[0].ratePct).toBeCloseTo(10, 5);
    expect(r.marginalRate).toBeCloseTo(0.1, 5);
    expect(r.federalTax).toBeCloseTo(540, 1);
  });

  it("taxes married filers no more than single filers at the same income", () => {
    const single = calculateIncomeTax(US_BASE);
    const married = calculateIncomeTax({ ...US_BASE, filingStatus: "married" });
    expect(married.federalTax).toBeLessThanOrEqual(single.federalTax);
  });

  it("is progressive — higher income raises the effective rate", () => {
    const low = calculateIncomeTax({ ...US_BASE, annualIncome: 40_000 });
    const high = calculateIncomeTax({ ...US_BASE, annualIncome: 250_000 });
    expect(high.totalIncomeTax).toBeGreaterThan(low.totalIncomeTax);
    expect(high.effectiveTaxRate).toBeGreaterThan(low.effectiveTaxRate);
    expect(r0(US_BASE).marginalRate).toBeGreaterThanOrEqual(r0(US_BASE).effectiveTaxRate);
    const series = calculateIncomeTax(US_BASE).incomeImpact;
    for (let i = 1; i < series.length; i++) {
      expect(series[i].incomeTax).toBeGreaterThanOrEqual(series[i - 1].incomeTax);
    }
  });

  it("models the UK with income tax only and no state tax", () => {
    const r = calculateIncomeTax({ country: "UK", annualIncome: 60_000, filingStatus: "single", stateRatePct: 0, year: 2026 });
    expect(r.currency).toBe("GBP");
    expect(r.stateTax).toBe(0);
    expect(r.federalTax).toBeGreaterThan(0);
    expect(r.brackets.length).toBeGreaterThan(0);
    const bracketSum = r.brackets.reduce((acc, b) => acc + b.tax, 0);
    expect(bracketSum).toBeCloseTo(r.federalTax, 1);
  });

  it("guards NaN inputs from producing non-finite values", () => {
    const r = calculateIncomeTax({
      country: "US",
      annualIncome: Number.NaN,
      filingStatus: "single",
      stateRatePct: Number.NaN,
      year: 2026,
    });
    expect(Number.isFinite(r.totalIncomeTax)).toBe(true);
    expect(Number.isFinite(r.effectiveTaxRate)).toBe(true);
    expect(r.totalIncomeTax).toBeGreaterThanOrEqual(0);
    expect(r.afterTaxIncome).toBeGreaterThanOrEqual(0);
  });
});

function r0(input: IncomeTaxInputs) {
  return calculateIncomeTax(input);
}
