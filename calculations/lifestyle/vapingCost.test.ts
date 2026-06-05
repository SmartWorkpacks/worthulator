import { describe, it, expect } from "vitest";
import { calculateVapingCost, SMOKING_DAILY_COST, VapingCostInputs } from "./vapingCost";

const base: VapingCostInputs = { dailyCost: 6, cutDailyBy: 2 };

describe("core vaping cost", () => {
  const r = calculateVapingCost(base);

  it("yearlyCost = daily × 365", () => {
    expect(r.yearlyCost).toBe(6 * 365); // 2190
  });

  it("monthlyCost = yearly / 12", () => {
    expect(r.monthlyCost).toBeCloseTo(2190 / 12, 1);
  });

  it("tenYearCost = yearly × 10", () => {
    expect(r.tenYearCost).toBe(21900);
  });
});

describe("investment projection", () => {
  const r = calculateVapingCost(base);

  it("investedValue10yr > tenYearCost", () => {
    expect(r.investedValue10yr).toBeGreaterThan(r.tenYearCost);
  });

  it("investedValue20yr > investedValue10yr", () => {
    expect(r.investedValue20yr).toBeGreaterThan(r.investedValue10yr);
  });
});

describe("cut savings", () => {
  const r = calculateVapingCost(base);

  it("cutYearlySaving = cut × 365", () => {
    expect(r.cutYearlySaving).toBe(2 * 365); // 730
  });

  it("reducedYearlyCost = yearly - cutSaving", () => {
    expect(r.reducedYearlyCost).toBe(r.yearlyCost - r.cutYearlySaving);
  });

  it("cutInvested10yr > cutYearlySaving × 10", () => {
    expect(r.cutInvested10yr).toBeGreaterThan(r.cutYearlySaving * 10);
  });

  it("zero cut → zero savings", () => {
    const r2 = calculateVapingCost({ dailyCost: 6, cutDailyBy: 0 });
    expect(r2.cutYearlySaving).toBe(0);
    expect(r2.reducedYearlyCost).toBe(r2.yearlyCost);
  });
});

describe("vs smoking comparison", () => {
  it("smokingAnnual uses $10/day default", () => {
    const r = calculateVapingCost(base);
    expect(r.smokingAnnual).toBe(SMOKING_DAILY_COST * 365);
  });

  it("vsSmokingDiff is positive when vaping is cheaper", () => {
    const r = calculateVapingCost({ dailyCost: 6, cutDailyBy: 0 });
    expect(r.vsSmokingDiff).toBe(3650 - 2190); // 1460
  });

  it("vsSmokingDiff is negative when vaping costs more", () => {
    const r = calculateVapingCost({ dailyCost: 12, cutDailyBy: 0 });
    expect(r.vsSmokingDiff).toBeLessThan(0);
  });
});

describe("edge cases", () => {
  it("cut clamped to dailyCost", () => {
    const r = calculateVapingCost({ dailyCost: 5, cutDailyBy: 20 });
    expect(r.cutYearlySaving).toBe(r.yearlyCost);
    expect(r.reducedYearlyCost).toBe(0);
  });

  it("never returns NaN or Infinity", () => {
    const r = calculateVapingCost({ dailyCost: 0, cutDailyBy: 0 });
    expect(Object.values(r).every(v => Number.isFinite(v))).toBe(true);
  });
});
