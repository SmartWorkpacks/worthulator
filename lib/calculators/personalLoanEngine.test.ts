import { describe, expect, it } from "vitest";
import { calculatePersonalLoan, type PersonalLoanInputs } from "./personalLoanEngine";

const BASE: PersonalLoanInputs = {
  loanAmount: 15_000,
  aprPct: 12.3,
  termMonths: 36,
  originationFeePct: 0,
};

describe("calculatePersonalLoan", () => {
  it("computes a known monthly payment and total interest", () => {
    const r = calculatePersonalLoan(BASE);
    // 15,000 over 36 months at 12.3% APR ≈ $500.7/mo.
    expect(r.monthlyPayment).toBeGreaterThan(499);
    expect(r.monthlyPayment).toBeLessThan(503);
    expect(r.totalInterest).toBeCloseTo(r.totalRepaid - r.loanAmount, 1);
    expect(r.totalInterest).toBeGreaterThan(0);
  });

  it("charges no interest at a zero APR", () => {
    const r = calculatePersonalLoan({ ...BASE, aprPct: 0, loanAmount: 12_000, termMonths: 24 });
    // 12,000 over 24 months, no interest → exactly 500/mo.
    expect(r.monthlyPayment).toBeCloseTo(500, 1);
    expect(r.totalInterest).toBe(0);
    expect(r.effectiveAprPct).toBe(0);
  });

  it("raises the effective APR above the headline rate when a fee applies", () => {
    const noFee = calculatePersonalLoan(BASE);
    const withFee = calculatePersonalLoan({ ...BASE, originationFeePct: 5 });
    expect(noFee.effectiveAprPct).toBeCloseTo(BASE.aprPct, 0);
    expect(withFee.effectiveAprPct).toBeGreaterThan(withFee.aprPct);
    // 5% fee on a 3-year loan adds a few points of effective APR.
    expect(withFee.effectiveAprPct).toBeGreaterThan(noFee.effectiveAprPct);
    expect(withFee.originationFee).toBeCloseTo(750, 1);
    expect(withFee.netDisbursed).toBeCloseTo(14_250, 1);
  });

  it("increases total interest with APR and with term", () => {
    const base = calculatePersonalLoan(BASE);
    const higherApr = calculatePersonalLoan({ ...BASE, aprPct: 20 });
    const longer = calculatePersonalLoan({ ...BASE, termMonths: 60 });
    expect(higherApr.totalInterest).toBeGreaterThan(base.totalInterest);
    expect(longer.totalInterest).toBeGreaterThan(base.totalInterest);
    // A longer term lowers the monthly payment even as total interest rises.
    expect(longer.monthlyPayment).toBeLessThan(base.monthlyPayment);
  });

  it("keeps the cost breakdown consistent with totals", () => {
    const r = calculatePersonalLoan({ ...BASE, originationFeePct: 3 });
    expect(round2(r.totalRepaid - r.loanAmount)).toBeCloseTo(r.totalInterest, 1);
    expect(round2(r.totalInterest + r.originationFee)).toBeCloseTo(r.totalCost, 1);
    // breakdown = principal + interest + fee.
    const sum = r.breakdown.reduce((acc, b) => acc + b.amount, 0);
    expect(sum).toBeCloseTo(r.loanAmount + r.totalInterest + r.originationFee, 1);
  });

  it("amortizes the balance monotonically down to zero", () => {
    const r = calculatePersonalLoan({ ...BASE, termMonths: 48 });
    const last = r.schedule[r.schedule.length - 1];
    expect(last.month).toBe(48);
    expect(last.balance).toBeCloseTo(0, 1);
    for (let i = 1; i < r.schedule.length; i++) {
      expect(r.schedule[i].balance).toBeLessThanOrEqual(r.schedule[i - 1].balance);
    }
  });

  it("guards NaN inputs from producing non-finite values", () => {
    const r = calculatePersonalLoan({
      loanAmount: Number.NaN,
      aprPct: Number.NaN,
      termMonths: Number.NaN,
      originationFeePct: Number.NaN,
    });
    expect(Number.isFinite(r.monthlyPayment)).toBe(true);
    expect(Number.isFinite(r.totalInterest)).toBe(true);
    expect(Number.isFinite(r.effectiveAprPct)).toBe(true);
    expect(r.monthlyPayment).toBeGreaterThanOrEqual(0);
  });
});

function round2(n: number) {
  return Math.round(n * 100) / 100;
}
