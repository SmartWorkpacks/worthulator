import { describe, it, expect } from "vitest";
import { calculateGlobalWealthPercentile, WealthPercentileInputs } from "./globalWealthPercentile";

const base: WealthPercentileInputs = {
  netWorth: 250000,
  annualIncome: 60000,
};

describe("calibration anchors (wealth)", () => {
  it("median net worth (~$8.6k) lands near the 50th percentile", () => {
    const r = calculateGlobalWealthPercentile({ netWorth: 8654, annualIncome: 0 });
    expect(r.wealthPercentile).toBeGreaterThan(45);
    expect(r.wealthPercentile).toBeLessThan(55);
  });

  it("~$100k net worth is roughly the global top 10%", () => {
    const r = calculateGlobalWealthPercentile({ netWorth: 100000, annualIncome: 0 });
    expect(r.wealthPercentile).toBeGreaterThan(85);
    expect(r.wealthPercentile).toBeLessThan(95);
  });

  it("~$1M net worth is roughly the global top 1%", () => {
    const r = calculateGlobalWealthPercentile({ netWorth: 1000000, annualIncome: 0 });
    expect(r.wealthPercentile).toBeGreaterThan(97);
    expect(r.wealthPercentile).toBeLessThan(99.99);
  });
});

describe("calibration anchors (income)", () => {
  it("~$34k income is roughly the global top 1%", () => {
    const r = calculateGlobalWealthPercentile({ netWorth: 0, annualIncome: 34000 });
    expect(r.incomePercentile).toBeGreaterThan(96);
    expect(r.incomePercentile).toBeLessThan(99.99);
  });

  it("median income (~$3k) lands near the 50th percentile", () => {
    const r = calculateGlobalWealthPercentile({ netWorth: 0, annualIncome: 3000 });
    expect(r.incomePercentile).toBeGreaterThan(45);
    expect(r.incomePercentile).toBeLessThan(55);
  });
});

describe("monotonicity", () => {
  it("more net worth never lowers the wealth percentile", () => {
    const a = calculateGlobalWealthPercentile({ ...base, netWorth: 50000 });
    const b = calculateGlobalWealthPercentile({ ...base, netWorth: 500000 });
    expect(b.wealthPercentile).toBeGreaterThan(a.wealthPercentile);
  });

  it("more income never lowers the income percentile", () => {
    const a = calculateGlobalWealthPercentile({ ...base, annualIncome: 20000 });
    const b = calculateGlobalWealthPercentile({ ...base, annualIncome: 200000 });
    expect(b.incomePercentile).toBeGreaterThan(a.incomePercentile);
  });
});

describe("derived figures", () => {
  it("top % = 100 − percentile", () => {
    const r = calculateGlobalWealthPercentile(base);
    expect(r.wealthTopPct).toBeCloseTo(100 - r.wealthPercentile, 2);
    expect(r.incomeTopPct).toBeCloseTo(100 - r.incomePercentile, 2);
  });

  it("daily income = annual ÷ 365", () => {
    const r = calculateGlobalWealthPercentile(base);
    expect(r.dailyIncome).toBeCloseTo(60000 / 365, 2);
  });

  it("adults below scales with the percentile", () => {
    const r = calculateGlobalWealthPercentile({ netWorth: 1000000, annualIncome: 0 });
    expect(r.adultsBelowWealth).toBeGreaterThan(5_000_000_000);
  });
});

describe("edge cases", () => {
  it("zero/negative net worth → 0 percentile, no NaN", () => {
    const r = calculateGlobalWealthPercentile({ netWorth: -5000, annualIncome: 0 });
    expect(r.wealthPercentile).toBe(0);
    expect(Object.values(r).every((v) => Number.isFinite(v))).toBe(true);
  });

  it("percentiles are bounded to (0, 100)", () => {
    const r = calculateGlobalWealthPercentile({ netWorth: 1e12, annualIncome: 1e12 });
    expect(r.wealthPercentile).toBeLessThanOrEqual(99.99);
    expect(r.incomePercentile).toBeLessThanOrEqual(99.99);
    expect(r.wealthPercentile).toBeGreaterThan(0);
  });

  it("zero income → zero daily income, no NaN", () => {
    const r = calculateGlobalWealthPercentile({ netWorth: 100000, annualIncome: 0 });
    expect(r.dailyIncome).toBe(0);
    expect(r.incomePercentile).toBe(0);
  });
});
