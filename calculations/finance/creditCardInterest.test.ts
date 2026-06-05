import { describe, it, expect } from "vitest";
import { calculateCreditCardInterest } from "./creditCardInterest";

describe("calculateCreditCardInterest", () => {
  const base = { balance: 3000, apr: 22, monthlyPayment: 100 };

  it("clears a typical balance within the cap", () => {
    const r = calculateCreditCardInterest(base);
    expect(r.monthsToPayoff).toBeGreaterThan(36);
    expect(r.monthsToPayoff).toBeLessThan(600);
  });

  it("totalPaid equals months × payment when cleared", () => {
    const r = calculateCreditCardInterest(base);
    expect(r.totalPaid).toBe(r.monthsToPayoff * base.monthlyPayment);
  });

  it("totalInterest is totalPaid minus the balance", () => {
    const r = calculateCreditCardInterest(base);
    expect(r.totalInterest).toBe(r.totalPaid - base.balance);
  });

  it("interestOfTotal is the interest share of payments", () => {
    const r = calculateCreditCardInterest(base);
    expect(r.interestOfTotal).toBeCloseTo((r.totalInterest / r.totalPaid) * 100, 4);
  });

  it("payment that cannot cover interest hits the 600 cap with zeroed totals", () => {
    const r = calculateCreditCardInterest({ balance: 5000, apr: 25, monthlyPayment: 100 });
    expect(r.monthsToPayoff).toBe(600);
    expect(r.totalInterest).toBe(0);
    expect(r.totalPaid).toBe(0);
  });

  it("zero APR: no interest and clean division", () => {
    const r = calculateCreditCardInterest({ balance: 1200, apr: 0, monthlyPayment: 100 });
    expect(r.totalInterest).toBe(0);
    expect(r.monthsToPayoff).toBe(12);
  });

  it("higher payment clears faster and cheaper", () => {
    const slow = calculateCreditCardInterest({ ...base, monthlyPayment: 100 });
    const fast = calculateCreditCardInterest({ ...base, monthlyPayment: 300 });
    expect(fast.monthsToPayoff).toBeLessThan(slow.monthsToPayoff);
    expect(fast.totalInterest).toBeLessThan(slow.totalInterest);
  });

  it("higher APR costs more interest", () => {
    const low = calculateCreditCardInterest({ ...base, apr: 12 });
    const high = calculateCreditCardInterest({ ...base, apr: 30 });
    expect(high.totalInterest).toBeGreaterThan(low.totalInterest);
  });

  it("daily interest cost tracks APR and balance", () => {
    const r = calculateCreditCardInterest(base);
    expect(r.dailyInterestCost).toBeCloseTo((3000 * 0.22) / 365, 1);
  });

  it("yearsToPayoff matches months/12", () => {
    const r = calculateCreditCardInterest(base);
    expect(r.yearsToPayoff).toBeCloseTo(r.monthsToPayoff / 12, 1);
  });

  it("yearsToPayoff is zero when capped", () => {
    const r = calculateCreditCardInterest({ balance: 5000, apr: 25, monthlyPayment: 100 });
    expect(r.yearsToPayoff).toBe(0);
  });

  it("interestToBalanceRatio is zero for a zero balance", () => {
    const r = calculateCreditCardInterest({ balance: 0, apr: 22, monthlyPayment: 100 });
    expect(r.interestToBalanceRatio).toBe(0);
  });

  it("interest share is below 100%", () => {
    const r = calculateCreditCardInterest(base);
    expect(r.interestOfTotal).toBeLessThan(100);
    expect(r.interestOfTotal).toBeGreaterThan(0);
  });
});
