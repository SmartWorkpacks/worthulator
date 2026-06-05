import { describe, it, expect } from "vitest";
import { calculateTaxBracket, TaxBracketInputs } from "./taxBracket";

const base: TaxBracketInputs = {
  grossIncome: 75000,
  filingStatus: "single",
  pretaxContributions: 0,
};

describe("core progressive tax (single, $75k)", () => {
  const r = calculateTaxBracket(base);

  it("applies the standard deduction", () => {
    // taxable = 75,000 − 15,000 = 60,000
    expect(r.taxableIncome).toBe(60000);
  });

  it("computes tax across brackets", () => {
    // 11,925×.10 + (48,475−11,925)×.12 + (60,000−48,475)×.22
    const expected = 11925 * 0.1 + (48475 - 11925) * 0.12 + (60000 - 48475) * 0.22;
    expect(r.federalTax).toBeCloseTo(expected, 2);
  });

  it("marginal rate is the top bracket reached (22%)", () => {
    expect(r.marginalRate).toBe(22);
  });

  it("effective rate is below the marginal rate", () => {
    expect(r.effectiveRate).toBeLessThan(r.marginalRate);
  });
});

describe("filing status changes the result", () => {
  it("married owes less than single at the same income", () => {
    const single = calculateTaxBracket({ ...base, filingStatus: "single" });
    const married = calculateTaxBracket({ ...base, filingStatus: "married" });
    expect(married.federalTax).toBeLessThan(single.federalTax);
  });

  it("married uses the $30k standard deduction", () => {
    const married = calculateTaxBracket({ ...base, filingStatus: "married" });
    expect(married.standardDeduction).toBe(30000);
    expect(married.taxableIncome).toBe(45000);
  });

  it("head of household sits between single and married", () => {
    const single = calculateTaxBracket({ ...base, filingStatus: "single" }).federalTax;
    const married = calculateTaxBracket({ ...base, filingStatus: "married" }).federalTax;
    const hoh = calculateTaxBracket({ ...base, filingStatus: "hoh" }).federalTax;
    expect(hoh).toBeLessThanOrEqual(single);
    expect(hoh).toBeGreaterThanOrEqual(married);
  });
});

describe("pre-tax contributions", () => {
  it("reduce taxable income and tax owed", () => {
    const without = calculateTaxBracket(base);
    const withK = calculateTaxBracket({ ...base, pretaxContributions: 10000 });
    expect(withK.taxableIncome).toBe(without.taxableIncome - 10000);
    expect(withK.federalTax).toBeLessThan(without.federalTax);
  });
});

describe("monotonicity & invariants", () => {
  it("more income never lowers tax", () => {
    const a = calculateTaxBracket({ ...base, grossIncome: 50000 });
    const b = calculateTaxBracket({ ...base, grossIncome: 150000 });
    expect(b.federalTax).toBeGreaterThan(a.federalTax);
  });

  it("marginal rate is non-decreasing with income", () => {
    const a = calculateTaxBracket({ ...base, grossIncome: 40000 });
    const b = calculateTaxBracket({ ...base, grossIncome: 300000 });
    expect(b.marginalRate).toBeGreaterThanOrEqual(a.marginalRate);
  });

  it("after-tax income = gross − federal tax", () => {
    const r = calculateTaxBracket(base);
    expect(r.afterTaxIncome).toBeCloseTo(75000 - r.federalTax, 2);
  });
});

describe("edge cases", () => {
  it("income below the standard deduction owes no tax", () => {
    const r = calculateTaxBracket({ ...base, grossIncome: 12000 });
    expect(r.taxableIncome).toBe(0);
    expect(r.federalTax).toBe(0);
    expect(r.effectiveRate).toBe(0);
    expect(r.marginalRate).toBe(0);
  });

  it("zero income → all zeros, no NaN", () => {
    const r = calculateTaxBracket({ ...base, grossIncome: 0 });
    expect(r.federalTax).toBe(0);
    expect(Number.isFinite(r.effectiveRate)).toBe(true);
    expect(Number.isFinite(r.effectiveOnTaxable)).toBe(true);
  });

  it("top bracket reached at very high income (37%)", () => {
    const r = calculateTaxBracket({ ...base, grossIncome: 1_000_000 });
    expect(r.marginalRate).toBe(37);
  });
});
