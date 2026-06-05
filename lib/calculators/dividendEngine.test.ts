import { describe, it, expect } from "vitest";
import { calculateDividend } from "./dividendEngine";

const base = {
  investmentAmount: 100_000,
  dividendYieldPct: 4,
  dividendGrowthPct: 0,
  priceGrowthPct: 0,
  years: 10,
  reinvest: false,
};

describe("calculateDividend", () => {
  it("year-1 annual income equals investment × yield", () => {
    const r = calculateDividend(base);
    expect(r.annualIncomeYear1).toBe(4_000);
  });

  it("monthly income is annual ÷ 12", () => {
    const r = calculateDividend(base);
    expect(r.monthlyIncomeYear1).toBe(Math.round(4_000 / 12));
  });

  it("with no growth and no reinvest, total dividends = annual × years", () => {
    const r = calculateDividend(base);
    expect(r.totalDividends).toBe(4_000 * 10);
  });

  it("dividend growth raises final-year income above year 1", () => {
    const r = calculateDividend({ ...base, dividendGrowthPct: 7 });
    expect(r.finalAnnualIncome).toBeGreaterThan(r.annualIncomeYear1);
  });

  it("reinvesting yields a higher final value than taking cash (positive yield)", () => {
    const cash = calculateDividend({ ...base, priceGrowthPct: 5 });
    const drip = calculateDividend({ ...base, priceGrowthPct: 5, reinvest: true });
    expect(drip.finalValue).toBeGreaterThan(cash.finalValue);
  });

  it("yield on cost rises with dividend growth", () => {
    const flat = calculateDividend(base);
    const grow = calculateDividend({ ...base, dividendGrowthPct: 8 });
    expect(grow.yieldOnCostPct).toBeGreaterThan(flat.yieldOnCostPct);
  });

  it("income series grows when dividends grow or are reinvested", () => {
    const r = calculateDividend({ ...base, dividendGrowthPct: 5 });
    for (let i = 1; i < r.incomeByYear.length; i++) {
      expect(r.incomeByYear[i].y).toBeGreaterThan(r.incomeByYear[i - 1].y);
    }
  });

  it("guards zero/negative inputs (no NaN)", () => {
    const r = calculateDividend({ ...base, investmentAmount: 0, dividendYieldPct: 0 });
    expect(r.annualIncomeYear1).toBe(0);
    expect(r.totalDividends).toBe(0);
    expect(Number.isFinite(r.finalValue)).toBe(true);
    expect(Number.isFinite(r.yieldOnCostPct)).toBe(true);
  });
});
