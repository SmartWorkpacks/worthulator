import { describe, it, expect } from "vitest";
import { calculateHomeEquityLoan } from "./homeEquityLoanEngine";

const base = {
  homeValue: 500_000,
  mortgageBalance: 250_000,
  loanAmount: 100_000,
  annualRatePct: 8.7,
  termYears: 15,
  maxCltvPct: 85,
};

describe("calculateHomeEquityLoan", () => {
  it("computes available equity as value minus mortgage", () => {
    const r = calculateHomeEquityLoan(base);
    expect(r.availableEquity).toBe(250_000);
  });

  it("computes max loan from the CLTV cap", () => {
    // 85% of 500k = 425k; minus 250k mortgage = 175k max.
    const r = calculateHomeEquityLoan(base);
    expect(r.maxLoan).toBe(175_000);
  });

  it("flags when the requested loan exceeds the max", () => {
    const ok = calculateHomeEquityLoan({ ...base, loanAmount: 150_000 });
    expect(ok.exceedsMax).toBe(false);
    const over = calculateHomeEquityLoan({ ...base, loanAmount: 200_000 });
    expect(over.exceedsMax).toBe(true);
  });

  it("produces a fixed monthly payment matching standard amortization", () => {
    const r = calculateHomeEquityLoan(base);
    // 100k @ 8.7%/15yr ≈ $999/mo
    expect(r.monthlyPayment).toBeGreaterThan(900);
    expect(r.monthlyPayment).toBeLessThan(1_100);
  });

  it("total cost equals principal plus total interest", () => {
    const r = calculateHomeEquityLoan(base);
    expect(r.totalCost).toBe(r.loanAmount + r.totalInterest);
  });

  it("computes combined LTV after borrowing", () => {
    // (250k + 100k) / 500k = 70%
    const r = calculateHomeEquityLoan(base);
    expect(r.combinedLtvPct).toBeCloseTo(70, 1);
  });

  it("shorter terms have higher monthly payments but the series is monotonic down", () => {
    const r = calculateHomeEquityLoan(base);
    for (let i = 1; i < r.paymentByTerm.length; i++) {
      expect(r.paymentByTerm[i].y).toBeLessThan(r.paymentByTerm[i - 1].y);
    }
  });

  it("guards zero/negative inputs (no NaN)", () => {
    const r = calculateHomeEquityLoan({ ...base, homeValue: 0, mortgageBalance: 0, loanAmount: 0 });
    expect(r.availableEquity).toBe(0);
    expect(r.maxLoan).toBe(0);
    expect(Number.isFinite(r.monthlyPayment)).toBe(true);
    expect(Number.isFinite(r.combinedLtvPct)).toBe(true);
  });
});
