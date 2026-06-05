import { describe, it, expect } from "vitest";
import {
  calculateSalaryIncrease,
  type SalaryIncreaseInput,
} from "./salaryIncreaseEngine";

const base: SalaryIncreaseInput = {
  currentSalary: 60000,
  raiseType: "percentage",
  raiseValue: 5,
  years: 10,
  annualRaiseRepeat: false,
  inflationRatePct: 3.2,
  taxRatePct: 22,
  annualBonus: 0,
};

describe("calculateSalaryIncrease — known values", () => {
  it("percentage raise: raiseAmount = salary × pct", () => {
    const r = calculateSalaryIncrease(base);
    expect(r.raiseAmount).toBe(3000);
    expect(r.newSalary).toBe(63000);
  });

  it("flat raise: raiseAmount = the flat value", () => {
    const r = calculateSalaryIncrease({ ...base, raiseType: "flat", raiseValue: 5000 });
    expect(r.raiseAmount).toBe(5000);
    expect(r.newSalary).toBe(65000);
  });

  it("monthly increase = raise ÷ 12", () => {
    const r = calculateSalaryIncrease(base);
    expect(r.monthlyIncrease).toBe(Math.round(3000 / 12));
  });

  it("after-tax raise applies the marginal rate", () => {
    const r = calculateSalaryIncrease(base);
    expect(r.postTaxRaiseEstimate).toBe(Math.round(3000 * (1 - 0.22)));
  });

  it("inflation-adjusted raise divides by (1 + inflation)", () => {
    const r = calculateSalaryIncrease(base);
    expect(r.inflationAdjustedRaise).toBe(Math.round(3000 / 1.032));
  });
});

describe("calculateSalaryIncrease — lifetime impact", () => {
  it("one-time raise: lifetime diff = raise × years (bonus cancels)", () => {
    const r = calculateSalaryIncrease({ ...base, annualBonus: 8000 });
    expect(r.lifetimeEarningsDiff).toBe(3000 * 10);
  });

  it("compounding raises beat a one-time raise over the horizon", () => {
    const once = calculateSalaryIncrease({ ...base, annualRaiseRepeat: false });
    const repeat = calculateSalaryIncrease({ ...base, annualRaiseRepeat: true });
    expect(repeat.lifetimeEarningsDiff).toBeGreaterThan(once.lifetimeEarningsDiff);
  });

  it("growth series has years + 1 points", () => {
    const r = calculateSalaryIncrease({ ...base, years: 15 });
    expect(r.salaryGrowthSeries).toHaveLength(16);
    expect(r.salaryGrowthSeries[0].year).toBe(0);
  });

  it("future projected salary compounds when repeat is on", () => {
    const r = calculateSalaryIncrease({ ...base, annualRaiseRepeat: true });
    expect(r.futureProjectedSalary).toBeGreaterThan(r.newSalary);
  });
});

describe("calculateSalaryIncrease — monotonicity", () => {
  it("bigger raise % yields a bigger new salary and lifetime diff", () => {
    const lo = calculateSalaryIncrease({ ...base, raiseValue: 3 });
    const hi = calculateSalaryIncrease({ ...base, raiseValue: 10 });
    expect(hi.newSalary).toBeGreaterThan(lo.newSalary);
    expect(hi.lifetimeEarningsDiff).toBeGreaterThan(lo.lifetimeEarningsDiff);
  });

  it("higher inflation lowers the real value of the raise", () => {
    const lo = calculateSalaryIncrease({ ...base, inflationRatePct: 1 });
    const hi = calculateSalaryIncrease({ ...base, inflationRatePct: 7 });
    expect(hi.inflationAdjustedRaise).toBeLessThan(lo.inflationAdjustedRaise);
  });

  it("higher marginal tax lowers the after-tax raise", () => {
    const lo = calculateSalaryIncrease({ ...base, taxRatePct: 10 });
    const hi = calculateSalaryIncrease({ ...base, taxRatePct: 40 });
    expect(hi.postTaxRaiseEstimate).toBeLessThan(lo.postTaxRaiseEstimate);
  });
});

describe("calculateSalaryIncrease — edges & invariants", () => {
  it("zero raise yields zero everywhere", () => {
    const r = calculateSalaryIncrease({ ...base, raiseValue: 0 });
    expect(r.raiseAmount).toBe(0);
    expect(r.newSalary).toBe(60000);
    expect(r.lifetimeEarningsDiff).toBe(0);
  });

  it("after-tax raise never exceeds the gross raise", () => {
    const r = calculateSalaryIncrease(base);
    expect(r.postTaxRaiseEstimate).toBeLessThanOrEqual(r.raiseAmount);
  });

  it("real raise never exceeds the nominal raise when inflation ≥ 0", () => {
    const r = calculateSalaryIncrease(base);
    expect(r.inflationAdjustedRaise).toBeLessThanOrEqual(r.raiseAmount);
  });

  it("all numeric outputs are finite", () => {
    const r = calculateSalaryIncrease(base);
    for (const v of [
      r.newSalary, r.raiseAmount, r.monthlyIncrease, r.postTaxRaiseEstimate,
      r.inflationAdjustedRaise, r.lifetimeEarningsDiff, r.cumulativeEarningsNew,
    ]) {
      expect(Number.isFinite(v)).toBe(true);
    }
  });
});
