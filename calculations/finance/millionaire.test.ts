import { describe, it, expect } from "vitest";
import { calculateMillionaire } from "./millionaire";

const DATA = { annualInflationPct: 3.2 };

describe("calculateMillionaire", () => {
  it("returns 0 years when already at or above $1M", () => {
    const r = calculateMillionaire({ currentSavings: 1_000_000, monthlySavings: 500, annualReturn: 7 });
    expect(r.yearsToMillion).toBe(0);
  });

  it("higher return reaches $1M faster", () => {
    const low  = calculateMillionaire({ currentSavings: 10000, monthlySavings: 500, annualReturn: 5 });
    const high = calculateMillionaire({ currentSavings: 10000, monthlySavings: 500, annualReturn: 10 });
    expect(high.yearsToMillion).toBeLessThan(low.yearsToMillion);
  });

  it("higher monthly contribution reaches $1M faster", () => {
    const slow = calculateMillionaire({ currentSavings: 0, monthlySavings: 300,  annualReturn: 7 });
    const fast = calculateMillionaire({ currentSavings: 0, monthlySavings: 1500, annualReturn: 7 });
    expect(fast.yearsToMillion).toBeLessThan(slow.yearsToMillion);
  });

  it("totalContributed = currentSavings + monthlySavings × months", () => {
    const r = calculateMillionaire({ currentSavings: 0, monthlySavings: 1000, annualReturn: 7 });
    // yearsToMillion × 12 months × $1000/mo + $0 initial
    const expectedContrib = Math.round(r.yearsToMillion * 12) * 1000;
    // Allow ±1 month rounding
    expect(Math.abs(r.totalContributed - expectedContrib)).toBeLessThan(1100);
  });

  it("interestEarned is non-negative", () => {
    const r = calculateMillionaire({ currentSavings: 5000, monthlySavings: 500, annualReturn: 7 });
    expect(r.interestEarned).toBeGreaterThanOrEqual(0);
  });

  it("caps at 100 years when contribution is zero and no savings", () => {
    const r = calculateMillionaire({ currentSavings: 0, monthlySavings: 0, annualReturn: 7 });
    expect(r.yearsToMillion).toBe(100);
  });

  it("marketShare is between 0 and 100", () => {
    const r = calculateMillionaire({ currentSavings: 10000, monthlySavings: 500, annualReturn: 7 });
    expect(r.marketShare).toBeGreaterThanOrEqual(0);
    expect(r.marketShare).toBeLessThanOrEqual(100);
  });

  it("totalContributed + interestEarned ≈ $1M at completion", () => {
    const r = calculateMillionaire({ currentSavings: 0, monthlySavings: 1000, annualReturn: 7 });
    if (r.yearsToMillion < 100) {
      expect(Math.abs(r.totalContributed + r.interestEarned - 1_000_000)).toBeLessThan(5000);
    }
  });

  it("progressPercent reflects current savings against $1M", () => {
    const r = calculateMillionaire({ currentSavings: 250_000, monthlySavings: 500, annualReturn: 7 }, DATA);
    expect(r.progressPercent).toBeCloseTo(25, 1);
  });

  it("+$200/mo reaches $1M sooner (yearsFasterWith200 > 0)", () => {
    const r = calculateMillionaire({ currentSavings: 10000, monthlySavings: 500, annualReturn: 7 }, DATA);
    expect(r.yearsFasterWith200).toBeGreaterThan(0);
  });

  it("real value of $1M is below $1M under inflation", () => {
    const r = calculateMillionaire({ currentSavings: 10000, monthlySavings: 500, annualReturn: 7 }, DATA);
    expect(r.realValueAtMillion).toBeGreaterThan(0);
    expect(r.realValueAtMillion).toBeLessThan(1_000_000);
  });

  it("a real (inflation-adjusted) million takes longer than a nominal one", () => {
    const r = calculateMillionaire({ currentSavings: 10000, monthlySavings: 500, annualReturn: 7 }, DATA);
    expect(r.yearsToRealMillion).toBeGreaterThan(r.yearsToMillion);
    expect(r.extraYearsForReal).toBeGreaterThan(0);
  });

  it("higher inflation erodes the real value of the million further", () => {
    const lo = calculateMillionaire({ currentSavings: 10000, monthlySavings: 1500, annualReturn: 7 }, { annualInflationPct: 2 });
    const hi = calculateMillionaire({ currentSavings: 10000, monthlySavings: 1500, annualReturn: 7 }, { annualInflationPct: 4 });
    expect(hi.realValueAtMillion).toBeLessThan(lo.realValueAtMillion);
    // both scenarios reach a real million; higher inflation needs more time
    expect(hi.extraYearsForReal).toBeGreaterThan(lo.extraYearsForReal);
  });

  it("marketContribPct mirrors marketShare", () => {
    const r = calculateMillionaire({ currentSavings: 10000, monthlySavings: 500, annualReturn: 7 }, DATA);
    expect(r.marketContribPct).toBe(r.marketShare);
  });

  it("defaults inflation when no data is provided (no NaN)", () => {
    const r = calculateMillionaire({ currentSavings: 10000, monthlySavings: 500, annualReturn: 7 });
    expect(Number.isNaN(r.realValueAtMillion)).toBe(false);
    expect(r.yearsToRealMillion).toBeGreaterThan(0);
  });
});
