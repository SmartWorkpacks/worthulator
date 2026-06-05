import { describe, it, expect } from "vitest";
import { calculateCreditCardPayoff } from "./creditCardPayoff";

describe("calculateCreditCardPayoff", () => {
  const base = { balance: 5000, apr: 22, payment: 200 };

  it("pays off a typical balance in a sane number of months", () => {
    const r = calculateCreditCardPayoff(base);
    expect(r.months).toBeGreaterThan(24);
    expect(r.months).toBeLessThan(40);
  });

  it("totalPaid equals interest plus principal", () => {
    const r = calculateCreditCardPayoff(base);
    expect(r.totalPaid).toBe(r.interest + base.balance);
  });

  it("first-month interest is balance × monthly rate", () => {
    const r = calculateCreditCardPayoff(base);
    expect(r.monthlyInterestFirst).toBe(Math.round(5000 * (0.22 / 12)));
  });

  it("daily interest cost is APR-based", () => {
    const r = calculateCreditCardPayoff(base);
    expect(r.dailyInterestCost).toBeCloseTo((5000 * 0.22) / 365, 1);
  });

  it("zero-interest card: interest is zero and payoff is balance/payment", () => {
    const r = calculateCreditCardPayoff({ balance: 2000, apr: 0, payment: 200 });
    expect(r.interest).toBe(0);
    expect(r.months).toBe(10);
    expect(r.totalPaid).toBe(2000);
  });

  it("higher payment clears the balance faster", () => {
    const slow = calculateCreditCardPayoff({ ...base, payment: 150 });
    const fast = calculateCreditCardPayoff({ ...base, payment: 400 });
    expect(fast.months).toBeLessThan(slow.months);
  });

  it("higher payment costs less total interest", () => {
    const slow = calculateCreditCardPayoff({ ...base, payment: 150 });
    const fast = calculateCreditCardPayoff({ ...base, payment: 400 });
    expect(fast.interest).toBeLessThan(slow.interest);
  });

  it("higher APR increases total interest", () => {
    const low = calculateCreditCardPayoff({ ...base, apr: 12 });
    const high = calculateCreditCardPayoff({ ...base, apr: 28 });
    expect(high.interest).toBeGreaterThan(low.interest);
  });

  it("larger balance takes longer to pay off", () => {
    const small = calculateCreditCardPayoff({ ...base, balance: 2000 });
    const big = calculateCreditCardPayoff({ ...base, balance: 10000 });
    expect(big.months).toBeGreaterThan(small.months);
  });

  it("payment below monthly interest hits the 600-month safety cap", () => {
    const r = calculateCreditCardPayoff({ balance: 10000, apr: 25, payment: 50 });
    expect(r.months).toBe(600);
  });

  it("interestToBalanceRatio reflects interest relative to principal", () => {
    const r = calculateCreditCardPayoff(base);
    expect(r.interestToBalanceRatio).toBeCloseTo(r.interest / base.balance, 1);
  });

  it("payoffYears is months expressed in years", () => {
    const r = calculateCreditCardPayoff(base);
    expect(r.payoffYears).toBeCloseTo(r.months / 12, 1);
  });

  it("ratio is zero when balance is zero", () => {
    const r = calculateCreditCardPayoff({ balance: 0, apr: 22, payment: 200 });
    expect(r.interestToBalanceRatio).toBe(0);
    expect(r.months).toBe(0);
  });

  it("interest is always non-negative", () => {
    const r = calculateCreditCardPayoff(base);
    expect(r.interest).toBeGreaterThanOrEqual(0);
  });
});
