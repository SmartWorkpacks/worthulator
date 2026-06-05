import { describe, expect, it } from "vitest";
import { calculateRmd, distributionPeriodForAge, type RmdInputs } from "./rmdEngine";

const BASE: RmdInputs = {
  accountBalance: 500_000,
  age: 73,
  expectedReturnPct: 5,
};

describe("calculateRmd", () => {
  it("computes the RMD as balance ÷ Uniform Lifetime factor", () => {
    const r = calculateRmd(BASE);
    // Age 73 factor = 26.5 → 500,000 / 26.5 = 18,867.92.
    expect(r.distributionPeriod).toBe(26.5);
    expect(r.rmdAmount).toBeCloseTo(18_867.92, 1);
    expect(r.rmdPct).toBeCloseTo((1 / 26.5) * 100, 2);
    expect(r.monthlyEquivalent).toBeCloseTo(r.rmdAmount / 12, 1);
  });

  it("matches known factors from the IRS table", () => {
    expect(distributionPeriodForAge(72)).toBe(27.4);
    expect(distributionPeriodForAge(75)).toBe(24.6);
    expect(distributionPeriodForAge(80)).toBe(20.2);
    expect(distributionPeriodForAge(90)).toBe(12.2);
    expect(distributionPeriodForAge(120)).toBe(2.0);
  });

  it("clamps ages outside the table to its bounds", () => {
    expect(distributionPeriodForAge(60)).toBe(27.4); // below 72 → 72 factor
    expect(distributionPeriodForAge(130)).toBe(2.0); // above 120 → 120 factor
  });

  it("raises the RMD percentage as the holder ages", () => {
    const younger = calculateRmd({ ...BASE, age: 73 });
    const older = calculateRmd({ ...BASE, age: 85 });
    expect(older.rmdPct).toBeGreaterThan(younger.rmdPct);
    expect(older.rmdAmount).toBeGreaterThan(younger.rmdAmount);
  });

  it("splits the balance into RMD and what stays invested", () => {
    const r = calculateRmd(BASE);
    const sum = r.breakdown.reduce((acc, b) => acc + b.amount, 0);
    expect(sum).toBeCloseTo(500_000, 0);
    expect(r.remainingBalance).toBeCloseTo(500_000 - r.rmdAmount, 1);
  });

  it("projects RMDs forward with ascending ages", () => {
    const r = calculateRmd(BASE);
    expect(r.projection.length).toBe(10);
    expect(r.projection[0].age).toBe(73);
    for (let i = 1; i < r.projection.length; i++) {
      expect(r.projection[i].age).toBeGreaterThanOrEqual(r.projection[i - 1].age);
      expect(Number.isFinite(r.projection[i].rmd)).toBe(true);
    }
  });

  it("flags whether the holder has reached the required beginning age", () => {
    expect(calculateRmd({ ...BASE, age: 72 }).isRequiredAge).toBe(false);
    expect(calculateRmd({ ...BASE, age: 73 }).isRequiredAge).toBe(true);
  });

  it("guards NaN and zero inputs", () => {
    const r = calculateRmd({ accountBalance: Number.NaN, age: Number.NaN, expectedReturnPct: Number.NaN });
    expect(Number.isFinite(r.rmdAmount)).toBe(true);
    expect(r.rmdAmount).toBeGreaterThanOrEqual(0);
    const zero = calculateRmd({ accountBalance: 0, age: 75, expectedReturnPct: 5 });
    expect(zero.rmdAmount).toBe(0);
  });
});
