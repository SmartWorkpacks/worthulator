import { describe, expect, it } from "vitest";
import { calculateTax, type TaxInputs } from "./taxEngine";

const US_BASE: TaxInputs = {
  country: "US",
  annualIncome: 75_000,
  filingStatus: "single",
  stateRatePct: 0,
  year: 2026,
};

describe("calculateTax", () => {
  it("computes a known US single-filer tax burden", () => {
    const r = calculateTax(US_BASE);
    // taxable = 75,000 − 14,600 = 60,400 → federal ≈ 8,089 at 2026 brackets.
    expect(r.taxableIncome).toBeCloseTo(60_400, 1);
    expect(r.incomeTax).toBeCloseTo(8_089, 0);
    // FICA: SS 75,000 × 6.2% = 4,650; Medicare 75,000 × 1.45% = 1,087.5.
    expect(r.socialSecurity).toBeCloseTo(4_650, 1);
    expect(r.medicare).toBeCloseTo(1_087.5, 1);
    expect(r.totalTax).toBeCloseTo(13_826.5, 0);
    expect(r.afterTaxIncome).toBeCloseTo(61_173.5, 0);
    expect(r.marginalRate).toBeCloseTo(0.22, 5);
    expect(r.effectiveTaxRate).toBeCloseTo(0.184, 2);
  });

  it("taxes married filers no more than single filers at the same income", () => {
    const single = calculateTax(US_BASE);
    const married = calculateTax({ ...US_BASE, filingStatus: "married" });
    expect(married.totalTax).toBeLessThanOrEqual(single.totalTax);
  });

  it("is progressive — higher income means a higher effective rate", () => {
    const low = calculateTax({ ...US_BASE, annualIncome: 40_000 });
    const high = calculateTax({ ...US_BASE, annualIncome: 200_000 });
    expect(high.totalTax).toBeGreaterThan(low.totalTax);
    expect(high.effectiveTaxRate).toBeGreaterThan(low.effectiveTaxRate);
    // The income-impact series rises monotonically in income.
    const series = calculateTax(US_BASE).incomeImpact;
    for (let i = 1; i < series.length; i++) {
      expect(series[i].totalTax).toBeGreaterThanOrEqual(series[i - 1].totalTax);
    }
  });

  it("adds state income tax to the total", () => {
    const noState = calculateTax(US_BASE);
    const withState = calculateTax({ ...US_BASE, stateRatePct: 5 });
    expect(withState.stateTax).toBeCloseTo(75_000 * 0.05, 1);
    expect(withState.totalTax).toBeCloseTo(noState.totalTax + 75_000 * 0.05, 1);
  });

  it("keeps the breakdown and after-tax figures consistent", () => {
    const r = calculateTax({ ...US_BASE, stateRatePct: 4 });
    const sum = r.breakdown.reduce((acc, b) => acc + b.amount, 0);
    expect(sum).toBeCloseTo(r.totalTax, 1);
    expect(r.afterTaxIncome).toBeCloseTo(r.grossIncome - r.totalTax, 1);
    // The income-tax marginal band rate sits at or above the income tax's own effective
    // rate (progressivity). The total effective rate can exceed it once FICA/state stack on.
    expect(r.marginalRate).toBeGreaterThanOrEqual(r.incomeTaxEffectiveRate);
  });

  it("models the UK with income tax and National Insurance only", () => {
    const r = calculateTax({ country: "UK", annualIncome: 50_000, filingStatus: "single", stateRatePct: 0, year: 2026 });
    expect(r.currency).toBe("GBP");
    expect(r.socialSecurity).toBe(0);
    expect(r.medicare).toBe(0);
    expect(r.stateTax).toBe(0);
    expect(r.incomeTax).toBeGreaterThan(0);
    expect(r.nationalInsurance).toBeGreaterThan(0);
    expect(r.totalTax).toBeCloseTo(r.incomeTax + r.nationalInsurance, 1);
  });

  it("guards NaN inputs from producing non-finite values", () => {
    const r = calculateTax({
      country: "US",
      annualIncome: Number.NaN,
      filingStatus: "single",
      stateRatePct: Number.NaN,
      year: 2026,
    });
    expect(Number.isFinite(r.totalTax)).toBe(true);
    expect(Number.isFinite(r.effectiveTaxRate)).toBe(true);
    expect(r.totalTax).toBeGreaterThanOrEqual(0);
    expect(r.afterTaxIncome).toBeGreaterThanOrEqual(0);
  });
});
