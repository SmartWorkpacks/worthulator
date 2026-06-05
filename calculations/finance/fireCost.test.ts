import { describe, it, expect } from "vitest";
import { calculateFire } from "./fireCost";

describe("calculateFire", () => {

  // ── Core formula ─────────────────────────────────────────────────────────────

  it("computes FIRE number as 25× annual expenses", () => {
    const result = calculateFire({ monthlyExpenses: 4000, currentSavings: 0, monthlySavings: 2000, annualReturn: 7 });
    expect(result.fireNumber).toBe(4000 * 12 * 25); // $1,200,000
  });

  it("$4,000/mo expenses → FIRE number exactly $1,200,000", () => {
    const result = calculateFire({ monthlyExpenses: 4000, currentSavings: 50000, monthlySavings: 2000, annualReturn: 7 });
    expect(result.fireNumber).toBe(1_200_000);
  });

  it("savingsRate = 33.3% at $2,000 invest + $4,000 expenses (FIRE standard)", () => {
    const result = calculateFire({ monthlyExpenses: 4000, currentSavings: 50000, monthlySavings: 2000, annualReturn: 7 });
    // 2000 / (2000 + 4000) × 100 = 33.333...
    expect(result.savingsRate).toBeCloseTo(33.3, 1);
  });

  it("savingsRate = 25% at $1,000 invest + $3,000 expenses", () => {
    const result = calculateFire({ monthlyExpenses: 3000, currentSavings: 0, monthlySavings: 1000, annualReturn: 7 });
    // 1000 / (1000 + 3000) = 25%
    expect(result.savingsRate).toBeCloseTo(25, 0);
  });

  it("savingsRate = 0 when monthly contribution is 0 and expenses > 0", () => {
    const result = calculateFire({ monthlyExpenses: 4000, currentSavings: 50000, monthlySavings: 0, annualReturn: 7 });
    expect(result.savingsRate).toBe(0);
  });

  // ── passiveIncomeNow ─────────────────────────────────────────────────────────

  it("passiveIncomeNow = currentSavings × 0.04 / 12 (4% rule)", () => {
    const result = calculateFire({ monthlyExpenses: 4000, currentSavings: 50000, monthlySavings: 2000, annualReturn: 7 });
    expect(result.passiveIncomeNow).toBe(Math.round(50_000 * 0.04 / 12)); // $167
  });

  it("passiveIncomeNow = $333 for $100,000 in savings", () => {
    const result = calculateFire({ monthlyExpenses: 4000, currentSavings: 100_000, monthlySavings: 2000, annualReturn: 7 });
    expect(result.passiveIncomeNow).toBe(Math.round(100_000 * 0.04 / 12)); // $333
  });

  // ── percentFunded ────────────────────────────────────────────────────────────

  it("percentFunded is proportional to currentSavings / fireNumber", () => {
    const result = calculateFire({ monthlyExpenses: 4000, currentSavings: 600_000, monthlySavings: 2000, annualReturn: 7 });
    // 600,000 / 1,200,000 = 50%
    expect(result.percentFunded).toBe(50);
  });

  it("percentFunded is capped at 100 when overfunded", () => {
    const result = calculateFire({ monthlyExpenses: 1000, currentSavings: 1_000_000, monthlySavings: 500, annualReturn: 7 });
    expect(result.percentFunded).toBe(100);
  });

  // ── yearsToFire ──────────────────────────────────────────────────────────────

  it("returns 0 years when already funded", () => {
    const result = calculateFire({ monthlyExpenses: 2000, currentSavings: 700_000, monthlySavings: 1000, annualReturn: 7 });
    expect(result.yearsToFire).toBe(0);
    expect(result.percentFunded).toBe(100);
  });

  it("caps yearsToFire at 100 when contribution is zero and no savings", () => {
    const result = calculateFire({ monthlyExpenses: 4000, currentSavings: 0, monthlySavings: 0, annualReturn: 7 });
    expect(result.yearsToFire).toBe(100);
  });

  it("zero return rate → deterministic linear years to FIRE", () => {
    // At 0% return: balance grows by $2,000/month from $50,000 to $1,200,000
    // = (1,200,000 - 50,000) / 2,000 = 575 months = 47.9 years
    const result = calculateFire({ monthlyExpenses: 4000, currentSavings: 50_000, monthlySavings: 2000, annualReturn: 0 });
    const expectedMonths = Math.ceil((4000 * 12 * 25 - 50_000) / 2000); // 575 months
    expect(result.yearsToFire).toBeCloseTo(expectedMonths / 12, 0);
  });

  it("zero expenses → fireNumber = 0 and yearsToFire = 0", () => {
    const result = calculateFire({ monthlyExpenses: 0, currentSavings: 0, monthlySavings: 500, annualReturn: 7 });
    expect(result.fireNumber).toBe(0);
    expect(result.yearsToFire).toBe(0);
  });

  // ── Monotonicity ─────────────────────────────────────────────────────────────

  it("higher return rate reaches FIRE faster (monotonicity)", () => {
    const low  = calculateFire({ monthlyExpenses: 3000, currentSavings: 50_000, monthlySavings: 1500, annualReturn: 5 });
    const high = calculateFire({ monthlyExpenses: 3000, currentSavings: 50_000, monthlySavings: 1500, annualReturn: 10 });
    expect(high.yearsToFire).toBeLessThan(low.yearsToFire);
  });

  it("higher monthly savings reaches FIRE faster (monotonicity)", () => {
    const low  = calculateFire({ monthlyExpenses: 3000, currentSavings: 0, monthlySavings: 500,  annualReturn: 7 });
    const high = calculateFire({ monthlyExpenses: 3000, currentSavings: 0, monthlySavings: 2000, annualReturn: 7 });
    expect(high.yearsToFire).toBeLessThan(low.yearsToFire);
  });

  it("lower expenses → lower FIRE number AND fewer years (double effect)", () => {
    const high = calculateFire({ monthlyExpenses: 5000, currentSavings: 50_000, monthlySavings: 2000, annualReturn: 7 });
    const low  = calculateFire({ monthlyExpenses: 3000, currentSavings: 50_000, monthlySavings: 2000, annualReturn: 7 });
    expect(low.fireNumber).toBeLessThan(high.fireNumber);
    expect(low.yearsToFire).toBeLessThan(high.yearsToFire);
  });

  // ── yearsFasterWith500 ───────────────────────────────────────────────────────

  it("yearsFasterWith500 is positive when not already funded", () => {
    const result = calculateFire({ monthlyExpenses: 4000, currentSavings: 50_000, monthlySavings: 2000, annualReturn: 7 });
    expect(result.yearsFasterWith500).toBeGreaterThan(0);
  });

  it("yearsFasterWith500 is 0 when already at or beyond FIRE number", () => {
    const result = calculateFire({ monthlyExpenses: 1000, currentSavings: 600_000, monthlySavings: 500, annualReturn: 7 });
    // currentSavings ($600k) > fireNumber ($300k) — already there
    expect(result.yearsFasterWith500).toBe(0);
  });

});
