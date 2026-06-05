import { describe, it, expect } from "vitest";
import { calculateNetWorth, type NetWorthInputs } from "./netWorthEngine";

const base: NetWorthInputs = {
  cashSavings: 5000, checkingAccounts: 3000, investments: 20000, retirementAccounts: 30000,
  homeValue: 0, otherRealEstate: 0, vehicles: 10000, otherAssets: 0,
  mortgageBalance: 0, carLoans: 8000, studentLoans: 15000, creditCardDebt: 3000, otherDebt: 0,
  age: 30, annualGrowthPct: 7, projectionYears: 20,
};

describe("calculateNetWorth", () => {
  it("totals assets and liabilities correctly", () => {
    const r = calculateNetWorth(base);
    expect(r.totalAssets).toBe(5000 + 3000 + 20000 + 30000 + 10000);
    expect(r.totalLiabilities).toBe(8000 + 15000 + 3000);
    expect(r.netWorth).toBe(r.totalAssets - r.totalLiabilities);
  });

  it("net worth can be negative", () => {
    const r = calculateNetWorth({ ...base, creditCardDebt: 100000 });
    expect(r.netWorth).toBeLessThan(0);
    expect(r.milestoneLabel).toMatch(/negative/i);
  });

  it("debt-to-asset ratio is a percentage", () => {
    const r = calculateNetWorth(base);
    expect(r.debtToAssetRatio).toBeCloseTo((26000 / 68000) * 100, 1);
  });

  it("labels a millionaire correctly", () => {
    const r = calculateNetWorth({ ...base, investments: 1_200_000 });
    expect(r.milestoneLabel).toMatch(/millionaire/i);
    expect(r.yearsToMillion).toBe(0);
  });

  it("years to million is set when below $1M with growth", () => {
    const r = calculateNetWorth(base);
    expect(r.yearsToMillion).toBeGreaterThan(0);
  });

  it("projection grows net worth over the horizon", () => {
    const r = calculateNetWorth(base);
    expect(r.projectedNetWorth).toBeGreaterThan(r.netWorth);
    expect(r.growthSeries.length).toBe(base.projectionYears + 1);
  });

  it("attaches an age-based percentile from the dataset", () => {
    const r = calculateNetWorth(base);
    expect(r.percentile).toBeGreaterThanOrEqual(1);
    expect(r.percentile).toBeLessThanOrEqual(99);
    expect(r.bracketLabel).toBe("under 35");
    expect(r.bracketMedian).toBeGreaterThan(0);
  });

  it("higher net worth yields a higher percentile for the same age", () => {
    const lo = calculateNetWorth(base);
    const hi = calculateNetWorth({ ...base, investments: 500000 });
    expect(hi.percentile).toBeGreaterThan(lo.percentile);
  });

  it("supports an injected percentile function (testability)", () => {
    const r = calculateNetWorth(base, {
      percentileFn: () => ({ percentile: 42, bracketLabel: "test", bracketMedian: 100, medianMultiple: 1.5 }),
    });
    expect(r.percentile).toBe(42);
    expect(r.bracketLabel).toBe("test");
  });

  it("asset breakdown percentages are present and bounded", () => {
    const r = calculateNetWorth(base);
    for (const b of r.assetBreakdown) {
      expect(b.pct).toBeGreaterThanOrEqual(0);
      expect(b.pct).toBeLessThanOrEqual(100);
    }
  });

  it("handles zero assets without dividing by zero", () => {
    const zero: NetWorthInputs = {
      ...base,
      cashSavings: 0, checkingAccounts: 0, investments: 0, retirementAccounts: 0, vehicles: 0,
      carLoans: 0, studentLoans: 0, creditCardDebt: 0,
    };
    const r = calculateNetWorth(zero);
    expect(r.netWorth).toBe(0);
    expect(r.debtToAssetRatio).toBe(0);
  });
});
