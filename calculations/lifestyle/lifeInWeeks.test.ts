import { describe, it, expect } from "vitest";
import { calculateLifeInWeeks } from "./lifeInWeeks";

describe("calculateLifeInWeeks", () => {
  const base = { age: 30, lifeExpectancy: 80 };

  it("weeks lived is age × 52", () => {
    const r = calculateLifeInWeeks(base);
    expect(r.weeksLived).toBe(30 * 52);
  });

  it("weeks remaining is (lifeExpectancy - age) × 52", () => {
    const r = calculateLifeInWeeks(base);
    expect(r.weeksRemaining).toBe(50 * 52);
  });

  it("percent used is age / lifeExpectancy", () => {
    const r = calculateLifeInWeeks(base);
    expect(r.percentUsed).toBeCloseTo((30 / 80) * 100, 1);
  });

  it("lived plus remaining equals the full lifespan in weeks", () => {
    const r = calculateLifeInWeeks(base);
    expect(r.weeksLived + r.weeksRemaining).toBe(80 * 52);
  });

  it("years remaining is lifeExpectancy minus age", () => {
    const r = calculateLifeInWeeks(base);
    expect(r.yearsRemaining).toBe(50);
  });

  it("days remaining is weeks remaining × 7", () => {
    const r = calculateLifeInWeeks(base);
    expect(r.daysRemaining).toBe(r.weeksRemaining * 7);
  });

  it("summer weeks is ~13 per remaining year", () => {
    const r = calculateLifeInWeeks(base);
    expect(r.summerWeeksRemaining).toBe(50 * 13);
  });

  it("older age means fewer weeks remaining", () => {
    const young = calculateLifeInWeeks({ ...base, age: 20 });
    const old = calculateLifeInWeeks({ ...base, age: 60 });
    expect(old.weeksRemaining).toBeLessThan(young.weeksRemaining);
  });

  it("higher life expectancy means more weeks remaining", () => {
    const low = calculateLifeInWeeks({ ...base, lifeExpectancy: 70 });
    const high = calculateLifeInWeeks({ ...base, lifeExpectancy: 95 });
    expect(high.weeksRemaining).toBeGreaterThan(low.weeksRemaining);
  });

  it("percent used rises with age", () => {
    const young = calculateLifeInWeeks({ ...base, age: 20 });
    const old = calculateLifeInWeeks({ ...base, age: 70 });
    expect(old.percentUsed).toBeGreaterThan(young.percentUsed);
  });

  it("at half the lifespan, ~50% is used", () => {
    const r = calculateLifeInWeeks({ age: 40, lifeExpectancy: 80 });
    expect(r.percentUsed).toBeCloseTo(50, 1);
  });

  it("percent used is zero at birth", () => {
    const r = calculateLifeInWeeks({ age: 0, lifeExpectancy: 80 });
    expect(r.percentUsed).toBe(0);
    expect(r.weeksLived).toBe(0);
  });
});
