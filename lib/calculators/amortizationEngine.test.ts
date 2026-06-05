import { describe, it, expect } from "vitest";
import { calculateAmortization } from "./amortizationEngine";

describe("calculateAmortization", () => {
  it("matches the textbook payment ($200k, 6%, 30yr ≈ $1199.10/mo)", () => {
    const r = calculateAmortization({ loanAmount: 200_000, annualRatePct: 6, termYears: 30 });
    expect(r.monthlyPayment).toBeCloseTo(1199.1, 0);
    expect(r.scheduledPayments).toBe(360);
  });

  it("handles a 0% loan as simple division with no interest", () => {
    const r = calculateAmortization({ loanAmount: 12_000, annualRatePct: 0, termYears: 1 });
    expect(r.monthlyPayment).toBeCloseTo(1000, 2);
    expect(r.totalInterest).toBe(0);
    expect(r.totalPaid).toBeCloseTo(12_000, 0);
  });

  it("keeps totalPaid = principal + interest, and ≈ payment × months", () => {
    const r = calculateAmortization({ loanAmount: 250_000, annualRatePct: 5.5, termYears: 30 });
    expect(r.totalPaid).toBeCloseTo(250_000 + r.totalInterest, 0);
    // Payment × n is within a few dollars of totalPaid (final-payment rounding aside).
    expect(Math.abs(r.monthlyPayment * r.scheduledPayments - r.totalPaid)).toBeLessThan(5);
  });

  it("increases total interest as the rate rises (monotonic)", () => {
    const low = calculateAmortization({ loanAmount: 100_000, annualRatePct: 4, termYears: 30 });
    const high = calculateAmortization({ loanAmount: 100_000, annualRatePct: 8, termYears: 30 });
    expect(high.totalInterest).toBeGreaterThan(low.totalInterest);
  });

  it("saves interest and time with an extra monthly payment", () => {
    const base = calculateAmortization({ loanAmount: 300_000, annualRatePct: 6.7, termYears: 30 });
    const extra = calculateAmortization({
      loanAmount: 300_000,
      annualRatePct: 6.7,
      termYears: 30,
      extraMonthlyPayment: 300,
    });
    expect(extra.payoffMonths).toBeLessThan(base.scheduledPayments);
    expect(extra.interestSaved).toBeGreaterThan(0);
    expect(extra.monthsSaved).toBeGreaterThan(0);
    expect(extra.totalInterestWithExtra).toBeLessThan(base.totalInterest);
  });

  it("produces a year-by-year schedule that amortizes to ~zero", () => {
    const r = calculateAmortization({ loanAmount: 100_000, annualRatePct: 5, termYears: 15 });
    expect(r.schedule.length).toBe(15);
    expect(r.schedule[r.schedule.length - 1].endingBalance).toBeLessThan(1);
    // Balance curve starts at the full principal.
    expect(r.balanceCurve[0]).toEqual({ x: 0, y: 100_000 });
  });

  it("splits principal vs interest summing to total paid", () => {
    const r = calculateAmortization({ loanAmount: 180_000, annualRatePct: 6, termYears: 30 });
    const sum = r.principalVsInterest.reduce((a, b) => a + b.amount, 0);
    expect(sum).toBeCloseTo(r.totalPaid, 0);
  });

  it("guards zero/negative inputs (no NaN/Infinity)", () => {
    const zero = calculateAmortization({ loanAmount: 0, annualRatePct: 6, termYears: 30 });
    expect(zero.monthlyPayment).toBe(0);
    expect(zero.totalInterest).toBe(0);
    const neg = calculateAmortization({ loanAmount: -5000, annualRatePct: -3, termYears: 0 });
    expect(Number.isFinite(neg.monthlyPayment)).toBe(true);
    expect(neg.monthlyPayment).toBe(0);
  });
});
