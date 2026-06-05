import { describe, it, expect } from "vitest";
import { calculateEmergencyFund, HYSA_APY, type EmergencyFundInputs } from "./emergencyFundEngine";

const expenses = {
  rent: 1500, food: 400, utilities: 150, transport: 300,
  insurance: 200, subscriptions: 50, other: 200,
};
const base: EmergencyFundInputs = {
  expenses,
  targetMonths: 6,
  currentSavings: 2000,
  monthlySavingsRate: 300,
};
const DATA = { annualInflationPct: 3.2 };

describe("calculateEmergencyFund", () => {
  it("sums monthly expenses correctly", () => {
    const r = calculateEmergencyFund(base, DATA);
    expect(r.totalMonthlyExpenses).toBe(2800);
  });

  it("target = monthly expenses × target months", () => {
    const r = calculateEmergencyFund(base, DATA);
    expect(r.targetAmount).toBe(2800 * 6);
  });

  it("amount needed = target − current (floored at 0)", () => {
    const r = calculateEmergencyFund(base, DATA);
    expect(r.amountNeeded).toBe(16800 - 2000);
  });

  it("never returns negative amount needed when overfunded", () => {
    const r = calculateEmergencyFund({ ...base, currentSavings: 50000 }, DATA);
    expect(r.amountNeeded).toBe(0);
    expect(r.isFullyFunded).toBe(true);
    expect(r.fundingPct).toBe(100);
  });

  it("current coverage months = savings / monthly expenses", () => {
    const r = calculateEmergencyFund({ ...base, currentSavings: 5600 }, DATA);
    expect(r.currentCoverageMonths).toBeCloseTo(2, 1);
  });

  it("months to goal = ceil(needed / monthly rate)", () => {
    const r = calculateEmergencyFund(base, DATA);
    expect(r.monthsToGoal).toBe(Math.ceil(14800 / 300));
  });

  it("no completion path when monthly savings is 0", () => {
    const r = calculateEmergencyFund({ ...base, monthlySavingsRate: 0 }, DATA);
    expect(r.monthsToGoal).toBeNull();
    expect(r.completionDate).toMatch(/monthly savings/i);
  });

  it("funding percent is capped at 100", () => {
    const r = calculateEmergencyFund({ ...base, currentSavings: 999999 }, DATA);
    expect(r.fundingPct).toBe(100);
  });

  it("expense breakdown excludes zero categories and sums to ~100%", () => {
    const r = calculateEmergencyFund({ ...base, expenses: { ...expenses, subscriptions: 0 } }, DATA);
    expect(r.expenseBreakdown.find((e) => e.category === "Subscriptions")).toBeUndefined();
    const pctSum = r.expenseBreakdown.reduce((s, e) => s + e.pct, 0);
    expect(Math.abs(pctSum - 100)).toBeLessThanOrEqual(2);
  });

  it("savings progress starts at current and reaches target when goal is within the window", () => {
    const r = calculateEmergencyFund({ ...base, monthlySavingsRate: 1000 }, DATA);
    expect(r.savingsProgress[0].balance).toBe(2000);
    expect(r.savingsProgress[r.savingsProgress.length - 1].balance).toBe(r.targetAmount);
  });

  it("progress balance is monotonic and never exceeds target", () => {
    const r = calculateEmergencyFund(base, DATA);
    for (let i = 1; i < r.savingsProgress.length; i++) {
      expect(r.savingsProgress[i].balance).toBeGreaterThanOrEqual(r.savingsProgress[i - 1].balance);
      expect(r.savingsProgress[i].balance).toBeLessThanOrEqual(r.targetAmount);
    }
  });

  it("handles all-zero expenses without dividing by zero", () => {
    const zero = { rent: 0, food: 0, utilities: 0, transport: 0, insurance: 0, subscriptions: 0, other: 0 };
    const r = calculateEmergencyFund({ ...base, expenses: zero, currentSavings: 0 }, DATA);
    expect(r.targetAmount).toBe(0);
    expect(r.currentCoverageMonths).toBe(0);
    expect(r.fundingPct).toBe(100);
  });

  it("HYSA interest = target × HYSA APY", () => {
    const r = calculateEmergencyFund(base, DATA);
    expect(r.annualHysaInterest).toBe(Math.round(16800 * (HYSA_APY / 100)));
  });

  it("inflation drift scales with the injected CPI rate", () => {
    const lo = calculateEmergencyFund(base, { annualInflationPct: 2 });
    const hi = calculateEmergencyFund(base, { annualInflationPct: 6 });
    expect(hi.inflationDriftPerYear).toBeGreaterThan(lo.inflationDriftPerYear);
  });

  it("flags whether HYSA interest covers inflation drift", () => {
    // At 3.2% CPI vs 4.4% HYSA, interest should cover drift.
    const covered = calculateEmergencyFund(base, { annualInflationPct: 3.2 });
    expect(covered.hysaCoversInflation).toBe(1);
    // At very high inflation it should not.
    const notCovered = calculateEmergencyFund(base, { annualInflationPct: 8 });
    expect(notCovered.hysaCoversInflation).toBe(0);
  });

  it("defaults inflation when no data arg is passed", () => {
    const r = calculateEmergencyFund(base);
    expect(r.inflationDriftPerYear).toBeGreaterThan(0);
  });
});
