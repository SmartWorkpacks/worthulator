import { describe, it, expect } from "vitest";
import { calculateFutureValue, type FutureValueInputs } from "./futureValue";

const DATA = { annualInflationPct: 3.2 };
const base: FutureValueInputs = { initial: 10000, monthly: 500, rate: 7, years: 20 };

describe("calculateFutureValue", () => {
  it("matches a hand-computed known value (10k + 500/mo, 7%, 20y)", () => {
    const r = calculateFutureValue(base, DATA);
    // FV ≈ 10000·(1.0058333)^240 + 500·(((1.0058333)^240−1)/0.0058333)
    expect(r.futureValue).toBeGreaterThan(298000);
    expect(r.futureValue).toBeLessThan(304000);
  });

  it("totalInvested = initial + monthly·months", () => {
    const r = calculateFutureValue(base, DATA);
    expect(r.totalInvested).toBe(10000 + 500 * 240);
    expect(r.totalContributions).toBe(500 * 240);
  });

  it("totalInterest = futureValue − totalInvested (never negative)", () => {
    const r = calculateFutureValue(base, DATA);
    expect(r.totalInterest).toBe(r.futureValue - r.totalInvested);
    expect(r.totalInterest).toBeGreaterThan(0);
  });

  it("zero rate degrades to simple sum (no growth)", () => {
    const r = calculateFutureValue({ ...base, rate: 0 }, DATA);
    expect(r.futureValue).toBe(10000 + 500 * 240);
    expect(r.totalInterest).toBe(0);
    expect(r.growthMultiple).toBe(1);
  });

  it("zero contributions grows the lump sum only", () => {
    const r = calculateFutureValue({ ...base, monthly: 0 }, DATA);
    // 10000·(1.0058333)^240 ≈ 40,387
    expect(r.futureValue).toBeGreaterThan(39000);
    expect(r.futureValue).toBeLessThan(42000);
    expect(r.totalContributions).toBe(0);
  });

  it("zero everything returns zeros, not NaN", () => {
    const r = calculateFutureValue({ initial: 0, monthly: 0, rate: 7, years: 20 }, DATA);
    expect(r.futureValue).toBe(0);
    expect(Number.isNaN(r.realFutureValue)).toBe(false);
  });

  it("real future value is below nominal when inflation > 0", () => {
    const r = calculateFutureValue(base, DATA);
    expect(r.realFutureValue).toBeLessThan(r.futureValue);
    expect(r.inflationLoss).toBe(r.futureValue - r.realFutureValue);
  });

  it("real equals nominal when inflation is zero", () => {
    const r = calculateFutureValue(base, { annualInflationPct: 0 });
    expect(r.realFutureValue).toBe(r.futureValue);
    expect(r.inflationLoss).toBe(0);
  });

  it("higher inflation lowers real value (monotonic)", () => {
    const lo = calculateFutureValue(base, { annualInflationPct: 2 });
    const hi = calculateFutureValue(base, { annualInflationPct: 6 });
    expect(hi.realFutureValue).toBeLessThan(lo.realFutureValue);
  });

  it("future value increases monotonically with rate", () => {
    const a = calculateFutureValue({ ...base, rate: 5 }, DATA);
    const b = calculateFutureValue({ ...base, rate: 9 }, DATA);
    expect(b.futureValue).toBeGreaterThan(a.futureValue);
  });

  it("future value increases monotonically with years", () => {
    const a = calculateFutureValue({ ...base, years: 10 }, DATA);
    const b = calculateFutureValue({ ...base, years: 30 }, DATA);
    expect(b.futureValue).toBeGreaterThan(a.futureValue);
  });

  it("future value increases monotonically with monthly contribution", () => {
    const a = calculateFutureValue({ ...base, monthly: 200 }, DATA);
    const b = calculateFutureValue({ ...base, monthly: 800 }, DATA);
    expect(b.futureValue).toBeGreaterThan(a.futureValue);
  });

  it("interest share is between 0 and 100", () => {
    const r = calculateFutureValue(base, DATA);
    expect(r.interestSharePct).toBeGreaterThan(0);
    expect(r.interestSharePct).toBeLessThan(100);
  });

  it("growth multiple = futureValue / totalInvested", () => {
    const r = calculateFutureValue(base, DATA);
    expect(r.growthMultiple).toBeCloseTo(r.futureValue / r.totalInvested, 1);
    expect(r.growthMultiple).toBeGreaterThan(1);
  });

  it("doubling years follows rule-of-72 ballpark at 7% (~10 years)", () => {
    const r = calculateFutureValue(base, DATA);
    expect(r.doublingYears).toBeGreaterThan(9);
    expect(r.doublingYears).toBeLessThan(11);
  });

  it("doubling years is 0 (n/a) when rate is 0", () => {
    const r = calculateFutureValue({ ...base, rate: 0 }, DATA);
    expect(r.doublingYears).toBe(0);
  });

  it("final-year interest is positive and below total interest for long horizons", () => {
    const r = calculateFutureValue(base, DATA);
    expect(r.finalYearInterest).toBeGreaterThan(0);
    expect(r.finalYearInterest).toBeLessThan(r.totalInterest);
  });

  it("rejects negative inputs gracefully", () => {
    const r = calculateFutureValue({ initial: -100, monthly: 500, rate: 7, years: 20 }, DATA);
    expect(r.futureValue).toBe(0);
  });
});
