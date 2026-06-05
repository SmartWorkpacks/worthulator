import { describe, it, expect } from "vitest";
import { calculateInterestRate } from "./interestRateEngine";
import { calculateAmortization } from "./amortizationEngine";

describe("calculateInterestRate", () => {
  it("round-trips an amortization payment back to the correct rate", () => {
    // 20k @ 6% over 5 yrs → some payment; solving should recover ~6%.
    const amort = calculateAmortization({ loanAmount: 20_000, annualRatePct: 6, termYears: 5 });
    const r = calculateInterestRate({
      loanAmount: 20_000,
      monthlyPayment: amort.monthlyPayment,
      termYears: 5,
    });
    expect(r.annualRatePct).toBeCloseTo(6, 1);
  });

  it("returns 0% when payments exactly repay principal with no interest", () => {
    const r = calculateInterestRate({ loanAmount: 24_000, monthlyPayment: 1_000, termYears: 2 });
    expect(r.annualRatePct).toBe(0);
    expect(r.paymentTooLow).toBe(false);
  });

  it("flags payments too low to ever amortize the loan", () => {
    // 24k over 2 yrs needs ≥ $1,000/mo at 0%; $500 can never pay it off.
    const r = calculateInterestRate({ loanAmount: 24_000, monthlyPayment: 500, termYears: 2 });
    expect(r.paymentTooLow).toBe(true);
    expect(r.annualRatePct).toBe(0);
  });

  it("a higher payment implies a higher interest rate (same loan & term)", () => {
    const low = calculateInterestRate({ loanAmount: 20_000, monthlyPayment: 400, termYears: 5 });
    const high = calculateInterestRate({ loanAmount: 20_000, monthlyPayment: 450, termYears: 5 });
    expect(high.annualRatePct).toBeGreaterThan(low.annualRatePct);
  });

  it("total interest equals total paid minus principal", () => {
    const r = calculateInterestRate({ loanAmount: 20_000, monthlyPayment: 400, termYears: 5 });
    expect(r.totalInterest).toBe(r.totalPaid - 20_000);
  });

  it("rate-by-payment series is monotonically increasing", () => {
    const r = calculateInterestRate({ loanAmount: 20_000, monthlyPayment: 400, termYears: 5 });
    for (let i = 1; i < r.rateByPayment.length; i++) {
      expect(r.rateByPayment[i].y).toBeGreaterThanOrEqual(r.rateByPayment[i - 1].y);
    }
  });

  it("solved rate reproduces the payment when fed back through amortization", () => {
    const r = calculateInterestRate({ loanAmount: 30_000, monthlyPayment: 600, termYears: 5 });
    const check = calculateAmortization({
      loanAmount: 30_000,
      annualRatePct: r.annualRatePct,
      termYears: 5,
    });
    expect(check.monthlyPayment).toBeCloseTo(600, 0);
  });

  it("guards zero/negative inputs (no NaN)", () => {
    const r = calculateInterestRate({ loanAmount: 0, monthlyPayment: 0, termYears: 0 });
    expect(r.annualRatePct).toBe(0);
    expect(Number.isFinite(r.totalInterest)).toBe(true);
  });
});
