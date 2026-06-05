import { describe, it, expect } from "vitest";
import {
  calculateLatteFactor,
  latteFactorAtYear,
  WEEKS_PER_YEAR,
  LatteFactorInputs,
} from "./latteFactor";

const base: LatteFactorInputs = {
  dailySpend:   6,
  daysPerWeek:  5,
  costGrowth:   3,
  annualReturn: 7,
  years:        30,
};

describe("core economics", () => {
  const r = calculateLatteFactor(base);

  it("annualSpendNow = daily × daysPerWeek × 52", () => {
    expect(r.annualSpendNow).toBe(6 * 5 * 52);
  });

  it("compoundGrowth = investedValue − totalSpent", () => {
    expect(r.compoundGrowth).toBe(r.investedValue - r.totalSpent);
  });

  it("investedValue >= totalSpent (positive return)", () => {
    expect(r.investedValue).toBeGreaterThanOrEqual(r.totalSpent);
  });

  it("growthPct is between 0 and 100", () => {
    expect(r.growthPct).toBeGreaterThanOrEqual(0);
    expect(r.growthPct).toBeLessThanOrEqual(100);
  });

  it("annualSpendFinal > annualSpendNow when costGrowth > 0", () => {
    expect(r.annualSpendFinal).toBeGreaterThan(r.annualSpendNow);
  });

  it("halfHabitInvested is roughly half of investedValue", () => {
    expect(r.halfHabitInvested).toBeCloseTo(r.investedValue / 2, -3);
  });
});

describe("zero return", () => {
  it("investedValue equals totalSpent when return is 0%", () => {
    const r = calculateLatteFactor({ ...base, annualReturn: 0 });
    expect(r.investedValue).toBe(r.totalSpent);
    expect(r.compoundGrowth).toBe(0);
    expect(r.growthPct).toBe(0);
  });
});

describe("zero cost growth", () => {
  it("annualSpendFinal equals annualSpendNow", () => {
    const r = calculateLatteFactor({ ...base, costGrowth: 0 });
    expect(r.annualSpendFinal).toBe(r.annualSpendNow);
  });

  it("totalSpent = annualSpendNow × years", () => {
    const r = calculateLatteFactor({ ...base, costGrowth: 0 });
    expect(r.totalSpent).toBe(r.annualSpendNow * base.years);
  });
});

describe("daysPerWeek scaling", () => {
  it("7 days/week costs more than 5 days/week", () => {
    const five = calculateLatteFactor(base);
    const seven = calculateLatteFactor({ ...base, daysPerWeek: 7 });
    expect(seven.annualSpendNow).toBeGreaterThan(five.annualSpendNow);
    expect(seven.investedValue).toBeGreaterThan(five.investedValue);
  });

  it("annualSpendNow ratio matches daysPerWeek ratio", () => {
    const five = calculateLatteFactor(base);
    const seven = calculateLatteFactor({ ...base, daysPerWeek: 7 });
    expect(seven.annualSpendNow / five.annualSpendNow).toBeCloseTo(7 / 5, 2);
  });
});

describe("r equals g edge case", () => {
  it("handles r === g without NaN and still produces compound growth", () => {
    const r = calculateLatteFactor({ ...base, annualReturn: 3, costGrowth: 3 });
    expect(Number.isFinite(r.investedValue)).toBe(true);
    expect(r.investedValue).toBeGreaterThan(0);
    expect(r.investedValue).toBeGreaterThan(r.totalSpent);
  });
});

describe("edge cases", () => {
  it("zero daily spend yields zero everything", () => {
    const r = calculateLatteFactor({ ...base, dailySpend: 0 });
    expect(r.investedValue).toBe(0);
    expect(r.totalSpent).toBe(0);
    expect(r.compoundGrowth).toBe(0);
  });

  it("zero years yields zero", () => {
    const r = calculateLatteFactor({ ...base, years: 0 });
    expect(r.investedValue).toBe(0);
    expect(r.totalSpent).toBe(0);
  });

  it("never returns NaN or Infinity", () => {
    const r = calculateLatteFactor({
      dailySpend: 0, daysPerWeek: 0, costGrowth: 0, annualReturn: 0, years: 0,
    });
    expect(Object.values(r).every((v) => Number.isFinite(v))).toBe(true);
  });
});

describe("latteFactorAtYear", () => {
  it("matches investedValue at the full horizon", () => {
    const r = calculateLatteFactor(base);
    const atEnd = latteFactorAtYear(r.annualSpendNow, base.years, 0.07, 0.03);
    expect(atEnd).toBe(r.investedValue);
  });

  it("year 0 returns 0", () => {
    expect(latteFactorAtYear(1560, 0, 0.07, 0.03)).toBe(0);
  });
});
