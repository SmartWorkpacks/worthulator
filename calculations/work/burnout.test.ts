import { describe, it, expect } from "vitest";
import { calculateBurnout } from "./burnout";

describe("calculateBurnout", () => {
  const base = { hours: 45, stress: 6, sleep: 6.5 };

  it("matches the scoring formula on a known case", () => {
    const r = calculateBurnout(base);
    expect(r.burnoutRisk).toBe(Math.round((45 / 60) * 40 + (6 / 10) * 30));
  });

  it("adds the short-sleep penalty below 6 hours", () => {
    const rested = calculateBurnout({ ...base, sleep: 7 });
    const tired = calculateBurnout({ ...base, sleep: 5 });
    expect(tired.burnoutRisk - rested.burnoutRisk).toBe(20);
  });

  it("more hours increases risk", () => {
    const low = calculateBurnout({ ...base, hours: 30 });
    const high = calculateBurnout({ ...base, hours: 70 });
    expect(high.burnoutRisk).toBeGreaterThan(low.burnoutRisk);
  });

  it("more stress increases risk", () => {
    const low = calculateBurnout({ ...base, stress: 2 });
    const high = calculateBurnout({ ...base, stress: 10 });
    expect(high.burnoutRisk).toBeGreaterThan(low.burnoutRisk);
  });

  it("score is capped at 100", () => {
    const r = calculateBurnout({ hours: 80, stress: 10, sleep: 4 });
    expect(r.burnoutRisk).toBeLessThanOrEqual(100);
  });

  it("score is never negative", () => {
    const r = calculateBurnout({ hours: 20, stress: 1, sleep: 9 });
    expect(r.burnoutRisk).toBeGreaterThanOrEqual(0);
  });

  it("overwork hours per year is weekly excess over 40 × 52", () => {
    const r = calculateBurnout({ ...base, hours: 50 });
    expect(r.overworkHoursPerYear).toBe(10 * 52);
  });

  it("no overwork below 40 hours", () => {
    const r = calculateBurnout({ ...base, hours: 35 });
    expect(r.overworkHoursPerYear).toBe(0);
  });

  it("sleep debt is the shortfall under 8 hours × 7", () => {
    const r = calculateBurnout({ ...base, sleep: 6 });
    expect(r.sleepDebtWeekly).toBeCloseTo(2 * 7, 1);
  });

  it("no sleep debt at 8 hours", () => {
    const r = calculateBurnout({ ...base, sleep: 8 });
    expect(r.sleepDebtWeekly).toBe(0);
  });

  it("recovery weeks scale with the risk score", () => {
    const low = calculateBurnout({ hours: 25, stress: 2, sleep: 8 });
    const high = calculateBurnout({ hours: 70, stress: 9, sleep: 5 });
    expect(high.recoveryWeeksNeeded).toBeGreaterThan(low.recoveryWeeksNeeded);
  });

  it("a balanced profile sits in the low-risk band", () => {
    const r = calculateBurnout({ hours: 38, stress: 3, sleep: 8 });
    expect(r.burnoutRisk).toBeLessThan(40);
  });
});
