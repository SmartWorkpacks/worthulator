import { describe, it, expect } from "vitest";
import { calculateHomeLoan } from "./homeLoanEngine";
import { calculateAmortization } from "./amortizationEngine";

const base = { homePrice: 400_000, downPaymentPct: 20, annualRatePct: 6.5, termYears: 30 };

describe("calculateHomeLoan", () => {
  it("derives loan amount and down payment from price and down %", () => {
    const r = calculateHomeLoan(base);
    expect(r.downPaymentAmount).toBe(80_000);
    expect(r.loanAmount).toBe(320_000);
  });

  it("P&I matches the standalone amortization engine", () => {
    const r = calculateHomeLoan(base);
    const a = calculateAmortization({ loanAmount: 320_000, annualRatePct: 6.5, termYears: 30 });
    expect(r.monthlyPI).toBeCloseTo(a.monthlyPayment, 2);
  });

  it("total cost equals price plus total interest", () => {
    const r = calculateHomeLoan(base);
    expect(r.totalCost).toBeCloseTo(400_000 + r.totalInterest, 0);
    expect(r.totalOfPayments).toBeCloseTo(r.loanAmount + r.totalInterest, 0);
  });

  it("equity starts at the down payment and ends near the full price", () => {
    const r = calculateHomeLoan(base);
    expect(r.equityCurve[0]).toEqual({ x: 0, y: 80_000 });
    const last = r.equityCurve[r.equityCurve.length - 1];
    expect(last.y).toBeGreaterThan(399_000);
  });

  it("reports years-to-equity milestones (20% down reaches 20% on day one)", () => {
    const r = calculateHomeLoan(base);
    expect(r.yearsTo20Equity).toBe(0);
    expect(r.yearsTo50Equity).toBeGreaterThan(0);
    const low = calculateHomeLoan({ ...base, downPaymentPct: 5 });
    expect(low.yearsTo20Equity).toBeGreaterThan(0);
  });

  it("saves interest and time with an extra monthly payment", () => {
    const r = calculateHomeLoan({ ...base, extraMonthlyPayment: 300 });
    expect(r.interestSaved).toBeGreaterThan(0);
    expect(r.monthsSaved).toBeGreaterThan(0);
    expect(r.payoffMonths).toBeLessThan(360);
  });

  it("cost breakdown sums to total cost", () => {
    const r = calculateHomeLoan(base);
    const sum = r.costBreakdown.reduce((a, b) => a + b.amount, 0);
    expect(sum).toBeCloseTo(r.totalCost, 0);
  });

  it("guards zero/negative inputs (no NaN)", () => {
    const zero = calculateHomeLoan({ homePrice: 0, downPaymentPct: 20, annualRatePct: 6.5, termYears: 30 });
    expect(zero.totalCost).toBe(0);
    expect(zero.monthlyPI).toBe(0);
    const neg = calculateHomeLoan({ homePrice: -1, downPaymentPct: -5, annualRatePct: -1, termYears: 0 });
    expect(Number.isFinite(neg.monthlyPI)).toBe(true);
  });
});
