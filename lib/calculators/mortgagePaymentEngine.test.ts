import { describe, it, expect } from "vitest";
import { calculateMortgagePayment } from "./mortgagePaymentEngine";
import { calculateAmortization } from "./amortizationEngine";

const base = {
  homePrice: 400_000,
  downPaymentPct: 20,
  annualRatePct: 6.5,
  termYears: 30,
};

describe("calculateMortgagePayment", () => {
  it("derives loan amount and down payment from price and down %", () => {
    const r = calculateMortgagePayment(base);
    expect(r.downPaymentAmount).toBe(80_000);
    expect(r.loanAmount).toBe(320_000);
    expect(r.ltvPct).toBe(80);
  });

  it("P&I matches the standalone amortization engine", () => {
    const r = calculateMortgagePayment(base);
    const amort = calculateAmortization({ loanAmount: 320_000, annualRatePct: 6.5, termYears: 30 });
    expect(r.monthlyPI).toBeCloseTo(amort.monthlyPayment, 2);
  });

  it("applies PMI when down payment < 20% and drops it at >= 20%", () => {
    const withPmi = calculateMortgagePayment({ ...base, downPaymentPct: 10 });
    const noPmi = calculateMortgagePayment({ ...base, downPaymentPct: 20 });
    expect(withPmi.pmiActive).toBe(true);
    expect(withPmi.monthlyPMI).toBeGreaterThan(0);
    expect(noPmi.pmiActive).toBe(false);
    expect(noPmi.monthlyPMI).toBe(0);
  });

  it("computes monthly tax as price x rate / 12", () => {
    const r = calculateMortgagePayment({ ...base, propertyTaxRatePct: 1.2 });
    expect(r.monthlyTax).toBeCloseTo((400_000 * 0.012) / 12, 2);
  });

  it("total monthly equals the sum of its components", () => {
    const r = calculateMortgagePayment({ ...base, downPaymentPct: 10, hoaMonthly: 150 });
    const sum = r.monthlyPI + r.monthlyTax + r.monthlyInsurance + r.monthlyPMI + r.monthlyHOA;
    expect(r.totalMonthly).toBeCloseTo(sum, 1);
  });

  it("lowers the loan and P&I as the down payment rises", () => {
    const low = calculateMortgagePayment({ ...base, downPaymentPct: 5 });
    const high = calculateMortgagePayment({ ...base, downPaymentPct: 30 });
    expect(high.loanAmount).toBeLessThan(low.loanAmount);
    expect(high.monthlyPI).toBeLessThan(low.monthlyPI);
  });

  it("produces a down-payment series that is monotonically decreasing", () => {
    const r = calculateMortgagePayment(base);
    for (let i = 1; i < r.paymentByDownPayment.length; i++) {
      expect(r.paymentByDownPayment[i].y).toBeLessThanOrEqual(r.paymentByDownPayment[i - 1].y);
    }
  });

  it("guards zero/negative inputs (no NaN)", () => {
    const zero = calculateMortgagePayment({ homePrice: 0, downPaymentPct: 20, annualRatePct: 6.5, termYears: 30 });
    expect(zero.totalMonthly).toBe(0);
    expect(Number.isFinite(zero.monthlyPI)).toBe(true);
    const neg = calculateMortgagePayment({ homePrice: -100, downPaymentPct: -5, annualRatePct: -1, termYears: 0 });
    expect(Number.isFinite(neg.totalMonthly)).toBe(true);
  });
});
