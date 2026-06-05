import { describe, it, expect } from "vitest";
import { calculateHeloc } from "./helocEngine";
import { calculateAmortization } from "./amortizationEngine";

const base = {
  homeValue: 500_000,
  mortgageBalance: 300_000,
  maxCltvPct: 85,
  drawAmount: 100_000,
  annualRatePct: 8,
  drawYears: 10,
  repayYears: 20,
};

describe("calculateHeloc", () => {
  it("computes current equity and the max line from CLTV", () => {
    const r = calculateHeloc(base);
    expect(r.currentEquity).toBe(200_000); // 500k - 300k
    expect(r.currentEquityPct).toBe(40);
    expect(r.maxLine).toBe(125_000); // 500k*0.85 - 300k
  });

  it("clamps the draw to the available line and flags over-limit requests", () => {
    const over = calculateHeloc({ ...base, drawAmount: 200_000 });
    expect(over.borrowed).toBe(125_000);
    expect(over.exceedsLimit).toBe(true);
    const ok = calculateHeloc({ ...base, drawAmount: 100_000 });
    expect(ok.exceedsLimit).toBe(false);
  });

  it("interest-only payment = balance x monthly rate", () => {
    const r = calculateHeloc(base);
    expect(r.interestOnlyPayment).toBeCloseTo((100_000 * 0.08) / 12, 1);
  });

  it("repayment payment matches the amortization engine", () => {
    const r = calculateHeloc(base);
    const a = calculateAmortization({ loanAmount: 100_000, annualRatePct: 8, termYears: 20 });
    expect(r.repaymentPayment).toBeCloseTo(a.monthlyPayment, 2);
  });

  it("payment shock: repayment payment exceeds interest-only, multiple > 1", () => {
    const r = calculateHeloc(base);
    expect(r.repaymentPayment).toBeGreaterThan(r.interestOnlyPayment);
    expect(r.paymentShockMultiple).toBeGreaterThan(1);
  });

  it("builds a timeline spanning draw + repayment with a jump at draw end", () => {
    const r = calculateHeloc(base);
    expect(r.paymentTimeline.length).toBe(30); // 10 + 20
    expect(r.paymentTimeline[9].y).toBeCloseTo(r.interestOnlyPayment, 1); // last draw year
    expect(r.paymentTimeline[10].y).toBeCloseTo(r.repaymentPayment, 1); // first repay year
    expect(r.paymentTimeline[10].y).toBeGreaterThan(r.paymentTimeline[9].y);
  });

  it("total cost equals borrowed plus total interest", () => {
    const r = calculateHeloc(base);
    expect(r.totalCost).toBeCloseTo(r.borrowed + r.totalInterest, 0);
  });

  it("guards zero/negative inputs (no NaN) and zero equity", () => {
    const zero = calculateHeloc({ ...base, homeValue: 0 });
    expect(zero.maxLine).toBe(0);
    expect(zero.borrowed).toBe(0);
    expect(Number.isFinite(zero.repaymentPayment)).toBe(true);
    const underwater = calculateHeloc({ ...base, homeValue: 250_000 }); // owes more than CLTV allows
    expect(underwater.maxLine).toBe(0);
  });
});
