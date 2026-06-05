import { describe, it, expect } from "vitest";
import { calculateCarLoan } from "./carLoan";

const base = {
  inputs: {
    vehiclePrice: 28000,
    downPayment: 3000,
    tradeIn: 0,
    interestRate: 7.9,
    termMonths: 60,
    state: "US Average",
  },
  data: { salesTaxRate: 7.12, tradeInReducesTax: true },
};

describe("calculateCarLoan", () => {
  // ── Sales tax layer ───────────────────────────────────────────────────────

  it("sales tax = price × rate when no trade-in", () => {
    const r = calculateCarLoan(base.inputs, base.data);
    expect(r.salesTax).toBe(Math.round(28000 * 0.0712));
  });

  it("trade-in reduces taxable base when state allows", () => {
    const r = calculateCarLoan(
      { ...base.inputs, tradeIn: 8000 },
      base.data,
    );
    expect(r.salesTax).toBe(Math.round((28000 - 8000) * 0.0712));
  });

  it("trade-in does NOT reduce tax when state disallows", () => {
    const r = calculateCarLoan(
      { ...base.inputs, tradeIn: 8000 },
      { salesTaxRate: 7.12, tradeInReducesTax: false },
    );
    expect(r.salesTax).toBe(Math.round(28000 * 0.0712));
  });

  it("zero sales tax state → salesTax = 0, outTheDoor = price", () => {
    const r = calculateCarLoan(base.inputs, {
      salesTaxRate: 0,
      tradeInReducesTax: true,
    });
    expect(r.salesTax).toBe(0);
    expect(r.outTheDoorPrice).toBe(28000);
  });

  it("outTheDoorPrice = price + salesTax", () => {
    const r = calculateCarLoan(base.inputs, base.data);
    expect(r.outTheDoorPrice).toBe(28000 + r.salesTax);
  });

  // ── Financing ─────────────────────────────────────────────────────────────

  it("loanAmount = outTheDoor − down − tradeIn", () => {
    const r = calculateCarLoan(
      { ...base.inputs, tradeIn: 5000 },
      base.data,
    );
    const tax = Math.round((28000 - 5000) * 0.0712);
    expect(r.loanAmount).toBe(28000 + tax - 3000 - 5000);
  });

  it("monthly payment is in a sane range for the default loan", () => {
    const r = calculateCarLoan(base.inputs, base.data);
    // ~$26,994 financed at 7.9% over 60mo ≈ $545/mo
    expect(r.monthlyPayment).toBeGreaterThan(450);
    expect(r.monthlyPayment).toBeLessThan(650);
  });

  it("zero interest → monthly = loanAmount / term", () => {
    const r = calculateCarLoan(
      { ...base.inputs, interestRate: 0 },
      base.data,
    );
    expect(r.monthlyPayment).toBeCloseTo(r.loanAmount / 60, 0);
    expect(r.totalInterest).toBe(0);
  });

  it("totalInterest = monthly × term − loanAmount", () => {
    const r = calculateCarLoan(base.inputs, base.data);
    expect(r.totalInterest).toBeCloseTo(
      r.monthlyPayment * 60 - r.loanAmount,
      0,
    );
  });

  it("totalCost = downPayment + monthly × term", () => {
    const r = calculateCarLoan(base.inputs, base.data);
    expect(r.totalCost).toBeCloseTo(3000 + r.monthlyPayment * 60, 0);
  });

  // ── Tax-financed interest ─────────────────────────────────────────────────

  it("taxFinancedInterest > 0 when tax is financed at a positive rate", () => {
    const r = calculateCarLoan(base.inputs, base.data);
    expect(r.taxFinancedInterest).toBeGreaterThan(0);
  });

  it("taxFinancedInterest = 0 in a no-tax state", () => {
    const r = calculateCarLoan(base.inputs, {
      salesTaxRate: 0,
      tradeInReducesTax: true,
    });
    expect(r.taxFinancedInterest).toBe(0);
  });

  // ── Ratios ────────────────────────────────────────────────────────────────

  it("downPaymentRatio = down / price × 100", () => {
    const r = calculateCarLoan(base.inputs, base.data);
    expect(r.downPaymentRatio).toBeCloseTo((3000 / 28000) * 100, 1);
  });

  it("annualPaymentBurden = monthly × 12", () => {
    const r = calculateCarLoan(base.inputs, base.data);
    expect(r.annualPaymentBurden).toBe(Math.round(r.monthlyPayment * 12));
  });

  // ── Monotonicity ──────────────────────────────────────────────────────────

  it("higher APR → higher total interest", () => {
    const low = calculateCarLoan({ ...base.inputs, interestRate: 4 }, base.data);
    const high = calculateCarLoan({ ...base.inputs, interestRate: 12 }, base.data);
    expect(high.totalInterest).toBeGreaterThan(low.totalInterest);
  });

  it("longer term → lower monthly but more interest", () => {
    const short = calculateCarLoan({ ...base.inputs, termMonths: 36 }, base.data);
    const long = calculateCarLoan({ ...base.inputs, termMonths: 84 }, base.data);
    expect(long.monthlyPayment).toBeLessThan(short.monthlyPayment);
    expect(long.totalInterest).toBeGreaterThan(short.totalInterest);
  });

  it("higher sales tax → larger loan and higher monthly", () => {
    const low = calculateCarLoan(base.inputs, { salesTaxRate: 0, tradeInReducesTax: true });
    const high = calculateCarLoan(base.inputs, { salesTaxRate: 9.55, tradeInReducesTax: true });
    expect(high.loanAmount).toBeGreaterThan(low.loanAmount);
    expect(high.monthlyPayment).toBeGreaterThan(low.monthlyPayment);
  });

  it("bigger down payment → smaller loan", () => {
    const small = calculateCarLoan({ ...base.inputs, downPayment: 1000 }, base.data);
    const big = calculateCarLoan({ ...base.inputs, downPayment: 10000 }, base.data);
    expect(big.loanAmount).toBeLessThan(small.loanAmount);
  });

  // ── Guards ─────────────────────────────────────────────────────────────────

  it("down + tradeIn exceeding out-the-door → loanAmount floored at 0", () => {
    const r = calculateCarLoan(
      { ...base.inputs, downPayment: 30000, tradeIn: 10000 },
      base.data,
    );
    expect(r.loanAmount).toBe(0);
    expect(r.monthlyPayment).toBe(0);
  });

  it("all outputs are finite numbers", () => {
    const r = calculateCarLoan(base.inputs, base.data);
    for (const [key, val] of Object.entries(r)) {
      expect(Number.isFinite(val), `${key} should be finite`).toBe(true);
    }
  });
});
