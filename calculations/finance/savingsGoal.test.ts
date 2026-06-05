import { describe, it, expect } from "vitest";
import { calculateSavingsGoal, type SavingsGoalInputs } from "./savingsGoal";

const DATA = { annualInflationPct: 3.2 };
const base: SavingsGoalInputs = { goalAmount: 20000, currentSavings: 2000, years: 3, annualReturn: 4 };

describe("calculateSavingsGoal", () => {
  it("solves a sensible monthly deposit for the default scenario", () => {
    const r = calculateSavingsGoal(base, DATA);
    // ~ $465/mo to reach 20k in 3y from 2k at 4%
    expect(r.monthlyContribution).toBeGreaterThan(440);
    expect(r.monthlyContribution).toBeLessThan(490);
  });

  it("the solved deposit actually reaches the goal (round-trip)", () => {
    const r = calculateSavingsGoal(base, DATA);
    const mr = 0.04 / 12, n = 36;
    const fv = 2000 * Math.pow(1 + mr, n) + r.monthlyContribution * ((Math.pow(1 + mr, n) - 1) / mr);
    expect(fv).toBeCloseTo(20000, -1); // within ~$10
  });

  it("zero return → deposits-only path equals (goal − current)/months", () => {
    const r = calculateSavingsGoal({ ...base, annualReturn: 0 }, DATA);
    expect(r.monthlyContribution).toBeCloseTo((20000 - 2000) / 36, 1);
    expect(r.interestEarned).toBe(0);
  });

  it("interestEarned = goal − current − totalContributed (≥0)", () => {
    const r = calculateSavingsGoal(base, DATA);
    expect(r.interestEarned).toBe(20000 - 2000 - r.totalContributed);
    expect(r.interestEarned).toBeGreaterThanOrEqual(0);
  });

  it("higher return lowers the required monthly deposit", () => {
    const lo = calculateSavingsGoal({ ...base, annualReturn: 2 }, DATA);
    const hi = calculateSavingsGoal({ ...base, annualReturn: 10 }, DATA);
    expect(hi.monthlyContribution).toBeLessThan(lo.monthlyContribution);
  });

  it("longer horizon lowers the required monthly deposit", () => {
    const a = calculateSavingsGoal({ ...base, years: 2 }, DATA);
    const b = calculateSavingsGoal({ ...base, years: 6 }, DATA);
    expect(b.monthlyContribution).toBeLessThan(a.monthlyContribution);
  });

  it("bigger goal raises the required monthly deposit", () => {
    const a = calculateSavingsGoal({ ...base, goalAmount: 10000 }, DATA);
    const b = calculateSavingsGoal({ ...base, goalAmount: 40000 }, DATA);
    expect(b.monthlyContribution).toBeGreaterThan(a.monthlyContribution);
  });

  it("more current savings lowers the required monthly deposit", () => {
    const a = calculateSavingsGoal({ ...base, currentSavings: 0 }, DATA);
    const b = calculateSavingsGoal({ ...base, currentSavings: 10000 }, DATA);
    expect(b.monthlyContribution).toBeLessThan(a.monthlyContribution);
  });

  it("growth makes the deposit no harder than the no-growth path", () => {
    const r = calculateSavingsGoal(base, DATA);
    expect(r.monthlyContribution).toBeLessThanOrEqual(r.monthlyNoGrowth + 0.01);
    expect(r.monthlySavedByGrowth).toBeGreaterThanOrEqual(0);
  });

  it("no-growth path saves nothing via growth", () => {
    const r = calculateSavingsGoal({ ...base, annualReturn: 0 }, DATA);
    expect(r.monthlySavedByGrowth).toBe(0);
  });

  it("inflation-adjusted goal exceeds the nominal goal when inflation > 0", () => {
    const r = calculateSavingsGoal(base, DATA);
    expect(r.inflationAdjustedGoal).toBeGreaterThan(20000);
  });

  it("inflation-adjusted goal equals nominal at 0% inflation", () => {
    const r = calculateSavingsGoal(base, { annualInflationPct: 0 });
    expect(r.inflationAdjustedGoal).toBe(20000);
  });

  it("real-goal monthly is higher than nominal-goal monthly under inflation", () => {
    const r = calculateSavingsGoal(base, DATA);
    expect(r.monthlyForRealGoal).toBeGreaterThan(r.monthlyContribution);
  });

  it("interest share is between 0 and 100", () => {
    const r = calculateSavingsGoal(base, DATA);
    expect(r.interestSharePct).toBeGreaterThanOrEqual(0);
    expect(r.interestSharePct).toBeLessThan(100);
  });

  it("invalid inputs return zeros (no NaN)", () => {
    const r = calculateSavingsGoal({ goalAmount: 0, currentSavings: 0, years: 0, annualReturn: 4 }, DATA);
    expect(r.monthlyContribution).toBe(0);
    expect(Number.isNaN(r.inflationAdjustedGoal)).toBe(false);
  });

  it("goal already met by current savings needs ~0 deposit", () => {
    const r = calculateSavingsGoal({ ...base, currentSavings: 25000 }, DATA);
    expect(r.monthlyContribution).toBe(0);
  });
});
