import { describe, it, expect } from "vitest";
import { calculateWfhSavings, type WfhSavingsInputs } from "./wfhSavings";

const base: WfhSavingsInputs = {
  dailyCommuteCost: 15,
  officeDays: 3,
  dailyFood: 18,
  commuteMinutes: 45,
};

describe("calculateWfhSavings — known values", () => {
  it("yearly savings = (commute + food) × officeDays × 52", () => {
    const r = calculateWfhSavings(base);
    expect(r.yearlySavings).toBe((15 + 18) * 3 * 52); // 5,148
  });

  it("monthly savings = yearly ÷ 12", () => {
    const r = calculateWfhSavings(base);
    expect(r.monthlySavings).toBe(Math.round(5148 / 12));
  });

  it("time saved = round-trip minutes × officeDays × 52 ÷ 60", () => {
    const r = calculateWfhSavings(base);
    expect(r.timeSavedHours).toBe(Math.round((45 * 2 * 3 * 52) / 60)); // 234
  });

  it("ten-year direct savings = yearly × 10", () => {
    const r = calculateWfhSavings(base);
    expect(r.tenYearSavings).toBe(5148 * 10);
  });

  it("hourly value recovered = yearly ÷ hours saved", () => {
    const r = calculateWfhSavings(base);
    expect(r.hourlyValueRecovered).toBeCloseTo(5148 / 234, 1);
  });
});

describe("calculateWfhSavings — invested projection", () => {
  it("invested 10-year value exceeds direct 10-year savings", () => {
    const r = calculateWfhSavings(base);
    expect(r.investedSavings10yr).toBeGreaterThan(r.tenYearSavings);
  });

  it("a higher assumed return grows the invested value", () => {
    const lo = calculateWfhSavings(base, { investReturnPct: 3 });
    const hi = calculateWfhSavings(base, { investReturnPct: 10 });
    expect(hi.investedSavings10yr).toBeGreaterThan(lo.investedSavings10yr);
  });
});

describe("calculateWfhSavings — monotonicity", () => {
  it("more office days saved raises yearly savings and time recovered", () => {
    const lo = calculateWfhSavings({ ...base, officeDays: 1 });
    const hi = calculateWfhSavings({ ...base, officeDays: 5 });
    expect(hi.yearlySavings).toBeGreaterThan(lo.yearlySavings);
    expect(hi.timeSavedHours).toBeGreaterThan(lo.timeSavedHours);
  });

  it("a longer commute recovers more time", () => {
    const lo = calculateWfhSavings({ ...base, commuteMinutes: 15 });
    const hi = calculateWfhSavings({ ...base, commuteMinutes: 90 });
    expect(hi.timeSavedHours).toBeGreaterThan(lo.timeSavedHours);
  });

  it("higher daily costs raise yearly savings", () => {
    const lo = calculateWfhSavings({ ...base, dailyCommuteCost: 5, dailyFood: 8 });
    const hi = calculateWfhSavings({ ...base, dailyCommuteCost: 30, dailyFood: 35 });
    expect(hi.yearlySavings).toBeGreaterThan(lo.yearlySavings);
  });
});

describe("calculateWfhSavings — edges & invariants", () => {
  it("zero costs and zero commute yield zero savings without NaN", () => {
    const r = calculateWfhSavings({ dailyCommuteCost: 0, officeDays: 3, dailyFood: 0, commuteMinutes: 0 });
    expect(r.yearlySavings).toBe(0);
    expect(r.hourlyValueRecovered).toBe(0);
    expect(Number.isFinite(r.investedSavings10yr)).toBe(true);
  });

  it("all outputs are finite", () => {
    const r = calculateWfhSavings(base);
    for (const v of Object.values(r)) expect(Number.isFinite(v)).toBe(true);
  });
});
