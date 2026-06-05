import { describe, expect, it } from "vitest";
import { calculateCarPayment, type CarPaymentInputs } from "./carPaymentEngine";

const BASE: CarPaymentInputs = {
  vehiclePrice: 35_000,
  downPayment: 5_000,
  tradeInValue: 0,
  salesTaxPct: 7,
  aprPct: 7.9,
  termMonths: 60,
};

describe("calculateCarPayment", () => {
  it("computes the financed amount and a known monthly payment", () => {
    const r = calculateCarPayment(BASE);
    // sales tax = 35,000 × 7% = 2,450; financed = 35,000 + 2,450 − 5,000 = 32,450.
    expect(r.salesTax).toBeCloseTo(2_450, 1);
    expect(r.amountFinanced).toBeCloseTo(32_450, 1);
    // 32,450 over 60 months at 7.9% APR ≈ $656/mo.
    expect(r.monthlyPayment).toBeGreaterThan(654);
    expect(r.monthlyPayment).toBeLessThan(659);
  });

  it("charges no interest at a zero APR", () => {
    const r = calculateCarPayment({ ...BASE, aprPct: 0, salesTaxPct: 0, downPayment: 0, vehiclePrice: 30_000 });
    // financed 30,000 over 60 months, no interest → exactly 500/mo.
    expect(r.amountFinanced).toBeCloseTo(30_000, 1);
    expect(r.monthlyPayment).toBeCloseTo(500, 1);
    expect(r.totalInterest).toBe(0);
  });

  it("applies the trade-in credit to the taxable amount", () => {
    const r = calculateCarPayment({ ...BASE, tradeInValue: 10_000 });
    // taxable = 35,000 − 10,000 = 25,000 → tax = 1,750.
    expect(r.salesTax).toBeCloseTo(1_750, 1);
    // financed = 35,000 + 1,750 − 5,000 − 10,000 = 21,750.
    expect(r.amountFinanced).toBeCloseTo(21_750, 1);
  });

  it("increases total interest with APR and with term", () => {
    const base = calculateCarPayment(BASE);
    const higherApr = calculateCarPayment({ ...BASE, aprPct: 12 });
    const longer = calculateCarPayment({ ...BASE, termMonths: 84 });
    expect(higherApr.totalInterest).toBeGreaterThan(base.totalInterest);
    expect(longer.totalInterest).toBeGreaterThan(base.totalInterest);
    // A longer term lowers the monthly payment even as total interest rises.
    expect(longer.monthlyPayment).toBeLessThan(base.monthlyPayment);
  });

  it("shrinks the payment with a bigger down payment", () => {
    const more = calculateCarPayment({ ...BASE, downPayment: 15_000 });
    expect(more.amountFinanced).toBeLessThan(calculateCarPayment(BASE).amountFinanced);
    expect(more.monthlyPayment).toBeLessThan(calculateCarPayment(BASE).monthlyPayment);
  });

  it("keeps interest and the cost breakdown internally consistent", () => {
    const r = calculateCarPayment(BASE);
    expect(round2(r.totalLoanPaid - r.amountFinanced)).toBeCloseTo(r.totalInterest, 1);
    const sum = r.breakdown.reduce((acc, b) => acc + b.amount, 0);
    expect(sum).toBeCloseTo(r.totalCost, 1);
  });

  it("amortizes the balance monotonically down to zero", () => {
    const r = calculateCarPayment({ ...BASE, termMonths: 48 });
    const last = r.schedule[r.schedule.length - 1];
    expect(last.month).toBe(48);
    expect(last.balance).toBeCloseTo(0, 1);
    for (let i = 1; i < r.schedule.length; i++) {
      expect(r.schedule[i].balance).toBeLessThanOrEqual(r.schedule[i - 1].balance);
    }
  });

  it("guards NaN inputs from producing non-finite values", () => {
    const r = calculateCarPayment({
      vehiclePrice: Number.NaN,
      downPayment: Number.NaN,
      tradeInValue: Number.NaN,
      salesTaxPct: Number.NaN,
      aprPct: Number.NaN,
      termMonths: Number.NaN,
    });
    expect(Number.isFinite(r.monthlyPayment)).toBe(true);
    expect(Number.isFinite(r.totalInterest)).toBe(true);
    expect(r.monthlyPayment).toBeGreaterThanOrEqual(0);
  });
});

function round2(n: number) {
  return Math.round(n * 100) / 100;
}
