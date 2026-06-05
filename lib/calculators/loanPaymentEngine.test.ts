import { describe, it, expect } from "vitest";
import { calculateLoanPayment } from "./loanPaymentEngine";
import { calculateAmortization } from "./amortizationEngine";

describe("calculateLoanPayment", () => {
  it("matches the amortization engine for the chosen term", () => {
    const r = calculateLoanPayment({ loanAmount: 25_000, annualRatePct: 12, termYears: 5 });
    const a = calculateAmortization({ loanAmount: 25_000, annualRatePct: 12, termYears: 5 });
    expect(r.monthlyPayment).toBeCloseTo(a.monthlyPayment, 2);
    expect(r.totalInterest).toBeCloseTo(a.totalInterest, 2);
  });

  it("keeps total interest = total paid - principal", () => {
    const r = calculateLoanPayment({ loanAmount: 30_000, annualRatePct: 8, termYears: 6 });
    expect(r.totalInterest).toBeCloseTo(r.totalPaid - 30_000, 0);
  });

  it("handles a 0% loan with no interest", () => {
    const r = calculateLoanPayment({ loanAmount: 24_000, annualRatePct: 0, termYears: 2 });
    expect(r.monthlyPayment).toBeCloseTo(1000, 2);
    expect(r.totalInterest).toBe(0);
  });

  it("payment-by-term: longer term lowers the monthly but raises total interest", () => {
    const r = calculateLoanPayment({ loanAmount: 25_000, annualRatePct: 10, termYears: 5 });
    const t = r.paymentByTerm;
    for (let i = 1; i < t.length; i++) {
      expect(t[i].monthlyPayment).toBeLessThan(t[i - 1].monthlyPayment);
      expect(t[i].totalInterest).toBeGreaterThan(t[i - 1].totalInterest);
    }
  });

  it("includes the chosen term in the comparison set", () => {
    const r = calculateLoanPayment({ loanAmount: 10_000, annualRatePct: 9, termYears: 10 });
    expect(r.paymentByTerm.some((p) => p.termYears === 10)).toBe(true);
  });

  it("saves interest and time with an extra monthly payment", () => {
    const extra = calculateLoanPayment({ loanAmount: 25_000, annualRatePct: 12, termYears: 5, extraMonthlyPayment: 100 });
    expect(extra.interestSaved).toBeGreaterThan(0);
    expect(extra.monthsSaved).toBeGreaterThan(0);
    expect(extra.payoffMonths).toBeLessThan(60);
  });

  it("principal vs interest sums to total paid", () => {
    const r = calculateLoanPayment({ loanAmount: 18_000, annualRatePct: 7, termYears: 4 });
    const sum = r.principalVsInterest.reduce((a, b) => a + b.amount, 0);
    expect(sum).toBeCloseTo(r.totalPaid, 0);
  });

  it("guards zero/negative inputs (no NaN)", () => {
    const zero = calculateLoanPayment({ loanAmount: 0, annualRatePct: 10, termYears: 5 });
    expect(zero.monthlyPayment).toBe(0);
    expect(zero.totalInterest).toBe(0);
    const neg = calculateLoanPayment({ loanAmount: -1, annualRatePct: -1, termYears: 0 });
    expect(Number.isFinite(neg.monthlyPayment)).toBe(true);
  });
});
