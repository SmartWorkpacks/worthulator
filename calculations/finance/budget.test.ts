import { describe, it, expect } from "vitest";
import { calculateBudget } from "./budget";

const base = {
  inputs: { income: 5000, housing: 1500, food: 600, transport: 400, debt: 300, other: 500 },
  data: { salesTaxRate: 7.12, groceryExempt: false },
};

describe("calculateBudget", () => {
  // ── Core totals ───────────────────────────────────────────────────────────

  it("default: $3,300 expenses, $1,700 leftover, 34% savings rate", () => {
    const r = calculateBudget(base.inputs, base.data);
    expect(r.totalExpenses).toBe(3300);
    expect(r.leftover).toBe(1700);
    expect(r.savingsRate).toBeCloseTo(34, 1);
  });

  it("expenseRatio + savingsRate = 100", () => {
    const r = calculateBudget(base.inputs, base.data);
    expect(r.expenseRatio + r.savingsRate).toBeCloseTo(100, 1);
  });

  it("annualLeftover = leftover × 12", () => {
    const r = calculateBudget(base.inputs, base.data);
    expect(r.annualLeftover).toBe(1700 * 12);
  });

  it("overspending → negative leftover and savings rate", () => {
    const r = calculateBudget({ ...base.inputs, housing: 4000 }, base.data);
    expect(r.leftover).toBeLessThan(0);
    expect(r.savingsRate).toBeLessThan(0);
  });

  // ── 50/30/20 ────────────────────────────────────────────────────────────

  it("needs = housing+food+transport+debt; wants = other", () => {
    const r = calculateBudget(base.inputs, base.data);
    expect(r.needs).toBe(2800);
    expect(r.wants).toBe(500);
  });

  it("targets are 50/30/20 of income", () => {
    const r = calculateBudget(base.inputs, base.data);
    expect(r.needsTarget).toBe(2500);
    expect(r.wantsTarget).toBe(1500);
    expect(r.savingsTarget).toBe(1000);
  });

  it("needsRatio reflects share of income", () => {
    const r = calculateBudget(base.inputs, base.data);
    expect(r.needsRatio).toBeCloseTo(56, 1);
  });

  it("gapTo20 is 0 when already above the 20% target", () => {
    const r = calculateBudget(base.inputs, base.data); // 34% > 20%
    expect(r.gapTo20).toBe(0);
  });

  it("gapTo20 positive when below the 20% target", () => {
    const r = calculateBudget({ ...base.inputs, other: 1300 }, base.data); // leftover 900 < 1000
    expect(r.gapTo20).toBeGreaterThan(0);
  });

  // ── Ratios ────────────────────────────────────────────────────────────────

  it("housingRatio = housing / income", () => {
    const r = calculateBudget(base.inputs, base.data);
    expect(r.housingRatio).toBeCloseTo(30, 1);
  });

  it("debtRatio = debt / income", () => {
    const r = calculateBudget(base.inputs, base.data);
    expect(r.debtRatio).toBeCloseTo(6, 1);
  });

  // ── Sales tax layer ────────────────────────────────────────────────────────

  it("sales tax applies to food + other when groceries are taxed", () => {
    const r = calculateBudget(base.inputs, base.data);
    expect(r.taxableMonthly).toBe(1100);
    expect(r.salesTaxAnnual).toBe(Math.round(1100 * 0.0712 * 12));
  });

  it("grocery-exempt state excludes food from the taxable base", () => {
    const r = calculateBudget(base.inputs, { salesTaxRate: 7.12, groceryExempt: true });
    expect(r.taxableMonthly).toBe(500); // other only
    expect(r.salesTaxAnnual).toBeLessThan(
      calculateBudget(base.inputs, { salesTaxRate: 7.12, groceryExempt: false }).salesTaxAnnual,
    );
  });

  it("zero tax rate → no sales tax", () => {
    const r = calculateBudget(base.inputs, { salesTaxRate: 0, groceryExempt: false });
    expect(r.salesTaxAnnual).toBe(0);
  });

  it("higher rate → more sales tax", () => {
    const low = calculateBudget(base.inputs, { salesTaxRate: 4, groceryExempt: false });
    const high = calculateBudget(base.inputs, { salesTaxRate: 10, groceryExempt: false });
    expect(high.salesTaxAnnual).toBeGreaterThan(low.salesTaxAnnual);
  });

  // ── Investment / monotonicity ──────────────────────────────────────────────

  it("tenYearIfInvested grows the surplus and is 0 when overspending", () => {
    const surplus = calculateBudget(base.inputs, base.data);
    expect(surplus.tenYearIfInvested).toBeGreaterThan(surplus.annualLeftover * 10);
    const deficit = calculateBudget({ ...base.inputs, housing: 5000 }, base.data);
    expect(deficit.tenYearIfInvested).toBe(0);
  });

  it("cutting an expense raises leftover", () => {
    const more = calculateBudget({ ...base.inputs, other: 200 }, base.data);
    expect(more.leftover).toBeGreaterThan(calculateBudget(base.inputs, base.data).leftover);
  });

  it("all outputs are finite", () => {
    const r = calculateBudget(base.inputs, base.data);
    for (const [k, v] of Object.entries(r)) {
      expect(Number.isFinite(v), `${k} finite`).toBe(true);
    }
  });
});
