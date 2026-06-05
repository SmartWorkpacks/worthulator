import { describe, expect, it } from "vitest";
import { calculateInterest, type InterestInputs } from "./interestEngine";

const BASE: InterestInputs = {
  mode: "compound",
  principal: 10_000,
  annualRatePct: 5,
  years: 10,
  compounding: "annually",
  monthlyContribution: 0,
};

describe("calculateInterest", () => {
  it("matches the compound interest formula for a lump sum (annual compounding)", () => {
    const r = calculateInterest({ ...BASE, principal: 1_000 });
    // 1000 * 1.05^10 = 1628.894...
    expect(r.finalBalance).toBeCloseTo(1628.89, 1);
    expect(r.totalInterest).toBeCloseTo(628.89, 1);
    expect(r.totalDeposited).toBe(1_000);
  });

  it("matches the simple interest formula for a lump sum", () => {
    const r = calculateInterest({ ...BASE, mode: "simple", principal: 1_000 });
    // 1000 * (1 + 0.05*10) = 1500
    expect(r.finalBalance).toBeCloseTo(1500, 1);
    expect(r.totalInterest).toBeCloseTo(500, 1);
  });

  it("compounds more frequently for a higher balance at the same nominal rate", () => {
    const annual = calculateInterest({ ...BASE, compounding: "annually" });
    const monthly = calculateInterest({ ...BASE, compounding: "monthly" });
    const daily = calculateInterest({ ...BASE, compounding: "daily" });
    expect(monthly.finalBalance).toBeGreaterThan(annual.finalBalance);
    expect(daily.finalBalance).toBeGreaterThanOrEqual(monthly.finalBalance);
    expect(monthly.effectiveAnnualRatePct).toBeGreaterThan(5);
  });

  it("adds monthly contributions to the final balance and interest", () => {
    const none = calculateInterest({ ...BASE });
    const withPmt = calculateInterest({ ...BASE, monthlyContribution: 100 });
    expect(withPmt.finalBalance).toBeGreaterThan(none.finalBalance);
    expect(withPmt.totalContributions).toBe(100 * 120);
    expect(withPmt.totalInterest).toBeGreaterThan(none.totalInterest);
  });

  it("keeps totalInterest equal to finalBalance minus totalDeposited", () => {
    const r = calculateInterest({ ...BASE, compounding: "monthly", monthlyContribution: 250 });
    expect(round2(r.finalBalance - r.totalDeposited)).toBeCloseTo(r.totalInterest, 1);
  });

  it("earns no interest at a zero rate", () => {
    const r = calculateInterest({ ...BASE, annualRatePct: 0, monthlyContribution: 100 });
    expect(r.totalInterest).toBe(0);
    expect(r.finalBalance).toBe(r.totalDeposited);
  });

  it("grows more with a higher rate (compound)", () => {
    const lo = calculateInterest({ ...BASE, annualRatePct: 3 });
    const hi = calculateInterest({ ...BASE, annualRatePct: 8 });
    expect(hi.finalBalance).toBeGreaterThan(lo.finalBalance);
  });

  it("guards NaN inputs from producing non-finite values", () => {
    const r = calculateInterest({
      ...BASE,
      principal: Number.NaN,
      annualRatePct: Number.NaN,
      years: Number.NaN,
      monthlyContribution: Number.NaN,
    });
    expect(Number.isFinite(r.finalBalance)).toBe(true);
    expect(Number.isFinite(r.totalInterest)).toBe(true);
    expect(r.finalBalance).toBeGreaterThanOrEqual(0);
  });
});

function round2(n: number) {
  return Math.round(n * 100) / 100;
}
