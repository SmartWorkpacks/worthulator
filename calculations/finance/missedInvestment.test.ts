import { describe, it, expect } from "vitest";
import { calculateMissedInvestment } from "./missedInvestment";

describe("calculateMissedInvestment", () => {
  const base = { amount: 1000, yearsAgo: 5, annualReturn: 10 };

  it("matches the compound-growth formula", () => {
    const r = calculateMissedInvestment(base);
    expect(r.currentValue).toBeCloseTo(1000 * Math.pow(1.1, 5), 4);
  });

  it("totalGain is currentValue minus the original amount", () => {
    const r = calculateMissedInvestment(base);
    expect(r.totalGain).toBeCloseTo(r.currentValue - base.amount, 6);
  });

  it("multiplier is currentValue / amount", () => {
    const r = calculateMissedInvestment(base);
    expect(r.multiplier).toBeCloseTo(r.currentValue / base.amount, 6);
  });

  it("growthLostPct equals (multiplier - 1) × 100", () => {
    const r = calculateMissedInvestment(base);
    expect(r.growthLostPct).toBeCloseTo((r.multiplier - 1) * 100, 4);
  });

  it("monthlyEquivalent spreads the gain over the window", () => {
    const r = calculateMissedInvestment(base);
    expect(r.monthlyEquivalent).toBeCloseTo(r.totalGain / (5 * 12), 6);
  });

  it("doubles roughly every ~7 years at 10% (rule of 72)", () => {
    const r = calculateMissedInvestment({ amount: 1000, yearsAgo: 7, annualReturn: 10 });
    expect(r.multiplier).toBeGreaterThan(1.9);
    expect(r.multiplier).toBeLessThan(2.1);
  });

  it("longer horizon grows more", () => {
    const short = calculateMissedInvestment({ ...base, yearsAgo: 2 });
    const long = calculateMissedInvestment({ ...base, yearsAgo: 20 });
    expect(long.currentValue).toBeGreaterThan(short.currentValue);
  });

  it("higher return grows more", () => {
    const low = calculateMissedInvestment({ ...base, annualReturn: 4 });
    const high = calculateMissedInvestment({ ...base, annualReturn: 15 });
    expect(high.currentValue).toBeGreaterThan(low.currentValue);
  });

  it("larger principal scales the gain proportionally", () => {
    const a = calculateMissedInvestment({ ...base, amount: 1000 });
    const b = calculateMissedInvestment({ ...base, amount: 2000 });
    expect(b.totalGain).toBeCloseTo(a.totalGain * 2, 4);
  });

  it("multiplier is identical regardless of principal", () => {
    const a = calculateMissedInvestment({ ...base, amount: 500 });
    const b = calculateMissedInvestment({ ...base, amount: 5000 });
    expect(a.multiplier).toBeCloseTo(b.multiplier, 6);
  });

  it("zero return yields no gain", () => {
    const r = calculateMissedInvestment({ amount: 1000, yearsAgo: 5, annualReturn: 0 });
    expect(r.totalGain).toBeCloseTo(0, 6);
    expect(r.multiplier).toBeCloseTo(1, 6);
  });

  it("current value always meets or exceeds the amount for non-negative returns", () => {
    const r = calculateMissedInvestment(base);
    expect(r.currentValue).toBeGreaterThanOrEqual(base.amount);
  });
});
