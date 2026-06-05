import { describe, it, expect } from "vitest";
import { calculateMortgagePayoff } from "./mortgagePayoffEngine";

const base = { currentBalance: 280_000, annualRatePct: 6.5, remainingTermYears: 25 };

describe("calculateMortgagePayoff", () => {
  it("baseline payoff ≈ the remaining term, with no plan no savings", () => {
    const r = calculateMortgagePayoff(base);
    expect(r.baselinePayoffMonths).toBeGreaterThanOrEqual(25 * 12 - 1);
    expect(r.baselinePayoffMonths).toBeLessThanOrEqual(25 * 12 + 1);
    expect(r.monthsSaved).toBe(0);
    expect(r.interestSaved).toBe(0);
  });

  it("extra monthly payments shorten payoff and cut interest", () => {
    const r = calculateMortgagePayoff({ ...base, extraMonthly: 300 });
    expect(r.monthsSaved).toBeGreaterThan(0);
    expect(r.interestSaved).toBeGreaterThan(0);
    expect(r.newPayoffMonths).toBeLessThan(r.baselinePayoffMonths);
  });

  it("a lump sum shortens payoff and cuts interest", () => {
    const r = calculateMortgagePayoff({ ...base, lumpSum: 40_000 });
    expect(r.monthsSaved).toBeGreaterThan(0);
    expect(r.interestSaved).toBeGreaterThan(0);
  });

  it("biweekly payments shorten payoff", () => {
    const r = calculateMortgagePayoff({ ...base, biweekly: true });
    expect(r.monthsSaved).toBeGreaterThan(0);
    expect(r.newPayoffMonths).toBeLessThan(r.baselinePayoffMonths);
  });

  it("interest saved = baseline - new interest, and a % is reported", () => {
    const r = calculateMortgagePayoff({ ...base, extraMonthly: 500 });
    expect(r.interestSaved).toBeCloseTo(r.baselineTotalInterest - r.newTotalInterest, 0);
    expect(r.interestSavedPct).toBeGreaterThan(0);
  });

  it("savings-by-extra increases monotonically with the extra amount", () => {
    const r = calculateMortgagePayoff(base);
    for (let i = 1; i < r.savingsByExtra.length; i++) {
      expect(r.savingsByExtra[i].y).toBeGreaterThanOrEqual(r.savingsByExtra[i - 1].y);
    }
    expect(r.savingsByExtra[0].y).toBe(0); // $0 extra saves nothing
  });

  it("guards zero/negative inputs (no NaN)", () => {
    const zero = calculateMortgagePayoff({ currentBalance: 0, annualRatePct: 6.5, remainingTermYears: 25 });
    expect(zero.monthlyPayment).toBe(0);
    expect(zero.monthsSaved).toBe(0);
    const neg = calculateMortgagePayoff({ currentBalance: -1, annualRatePct: -2, remainingTermYears: 0 });
    expect(Number.isFinite(neg.monthlyPayment)).toBe(true);
  });

  it("handles 0% interest without dividing by zero", () => {
    const r = calculateMortgagePayoff({ currentBalance: 120_000, annualRatePct: 0, remainingTermYears: 10, extraMonthly: 500 });
    expect(Number.isFinite(r.monthlyPayment)).toBe(true);
    expect(r.monthsSaved).toBeGreaterThan(0);
    expect(r.baselineTotalInterest).toBe(0);
  });
});
