import { describe, it, expect } from "vitest";
import { calculateSavingsGrowth, type SavingsGrowthInputs } from "./savingsGrowth";

const DATA = { annualInflationPct: 3.2 };
const base: SavingsGrowthInputs = { initial: 5000, monthly: 300, rate: 4.5, years: 10 };

describe("calculateSavingsGrowth", () => {
  it("computes a sensible balance for the default scenario", () => {
    const r = calculateSavingsGrowth(base, DATA);
    // 5000 grown + 300/mo for 10y at 4.5% ≈ $53k
    expect(r.balance).toBeGreaterThan(50000);
    expect(r.balance).toBeLessThan(56000);
  });

  it("totalDeposited = initial + monthly·months", () => {
    const r = calculateSavingsGrowth(base, DATA);
    expect(r.totalDeposited).toBe(5000 + 300 * 120);
  });

  it("interestEarned = balance − totalDeposited (≥0)", () => {
    const r = calculateSavingsGrowth(base, DATA);
    expect(r.interestEarned).toBe(r.balance - r.totalDeposited);
    expect(r.interestEarned).toBeGreaterThan(0);
  });

  it("real balance is below nominal under inflation", () => {
    const r = calculateSavingsGrowth(base, DATA);
    expect(r.realBalance).toBeLessThan(r.balance);
  });

  it("real return = APY − inflation", () => {
    const r = calculateSavingsGrowth(base, DATA);
    expect(r.realReturnPct).toBeCloseTo(4.5 - 3.2, 1);
    expect(r.beatsInflation).toBe(1);
  });

  it("flags when the APY loses to inflation", () => {
    const r = calculateSavingsGrowth({ ...base, rate: 2 }, DATA);
    expect(r.realReturnPct).toBeLessThan(0);
    expect(r.beatsInflation).toBe(0);
  });

  it("HYSA advantage is positive vs the legacy 0.45% account", () => {
    const r = calculateSavingsGrowth(base, DATA);
    expect(r.hysaAdvantage).toBeGreaterThan(0);
  });

  it("HYSA advantage is ~0 when the rate equals the legacy rate", () => {
    const r = calculateSavingsGrowth({ ...base, rate: 0.45 }, DATA);
    expect(r.hysaAdvantage).toBeLessThan(5);
  });

  it("balance increases with rate", () => {
    const a = calculateSavingsGrowth({ ...base, rate: 1 }, DATA);
    const b = calculateSavingsGrowth({ ...base, rate: 5 }, DATA);
    expect(b.balance).toBeGreaterThan(a.balance);
  });

  it("balance increases with years", () => {
    const a = calculateSavingsGrowth({ ...base, years: 5 }, DATA);
    const b = calculateSavingsGrowth({ ...base, years: 20 }, DATA);
    expect(b.balance).toBeGreaterThan(a.balance);
  });

  it("balance increases with monthly deposit", () => {
    const a = calculateSavingsGrowth({ ...base, monthly: 100 }, DATA);
    const b = calculateSavingsGrowth({ ...base, monthly: 600 }, DATA);
    expect(b.balance).toBeGreaterThan(a.balance);
  });

  it("zero everything returns zeros (no NaN)", () => {
    const r = calculateSavingsGrowth({ initial: 0, monthly: 0, rate: 4.5, years: 10 }, DATA);
    expect(r.balance).toBe(0);
    expect(Number.isNaN(r.realBalance)).toBe(false);
  });

  it("interest share between 0 and 100", () => {
    const r = calculateSavingsGrowth(base, DATA);
    expect(r.interestSharePct).toBeGreaterThan(0);
    expect(r.interestSharePct).toBeLessThan(100);
  });

  it("higher inflation lowers real balance and real return", () => {
    const lo = calculateSavingsGrowth(base, { annualInflationPct: 2 });
    const hi = calculateSavingsGrowth(base, { annualInflationPct: 6 });
    expect(hi.realBalance).toBeLessThan(lo.realBalance);
    expect(hi.realReturnPct).toBeLessThan(lo.realReturnPct);
  });
});
