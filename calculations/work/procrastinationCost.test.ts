import { describe, it, expect } from "vitest";
import {
  calculateProcrastinationCost,
  US_AVG_PROCRASTINATION_HRS,
} from "./procrastinationCost";

const base = {
  inputs: { hoursPerDay: 2, daysPerYear: 250, state: "National" },
  data: { medianWage: 23.11 },
};

describe("calculateProcrastinationCost", () => {
  it("2h/day at $23.11/hr × 250 days → $11,555/yr", () => {
    const r = calculateProcrastinationCost(base.inputs, base.data);
    expect(r.annualLoss).toBe(Math.round(2 * 23.11 * 250));
  });

  it("dailyLoss = 2 × 23.11 = $46.22", () => {
    const r = calculateProcrastinationCost(base.inputs, base.data);
    expect(r.dailyLoss).toBeCloseTo(46.22, 2);
  });

  it("weeklyLoss = dailyLoss × 5", () => {
    const r = calculateProcrastinationCost(base.inputs, base.data);
    expect(r.weeklyLoss).toBe(Math.round(r.dailyLoss * 5));
  });

  it("monthlyLoss = annualLoss / 12", () => {
    const r = calculateProcrastinationCost(base.inputs, base.data);
    expect(r.monthlyLoss).toBe(Math.round(r.annualLoss / 12));
  });

  it("California wage → higher loss than national", () => {
    const nat = calculateProcrastinationCost(base.inputs, base.data);
    const ca = calculateProcrastinationCost(base.inputs, {
      medianWage: 27.3,
    });
    expect(ca.annualLoss).toBeGreaterThan(nat.annualLoss);
    expect(ca.stateMedianWage).toBe(27.3);
  });

  it("tenYearLoss > annualLoss × 10 (compound growth)", () => {
    const r = calculateProcrastinationCost(base.inputs, base.data);
    expect(r.tenYearLoss).toBeGreaterThan(r.annualLoss * 10);
  });

  it("careerLoss (20yr) > tenYearLoss", () => {
    const r = calculateProcrastinationCost(base.inputs, base.data);
    expect(r.careerLoss).toBeGreaterThan(r.tenYearLoss);
  });

  it("halfHourSaving = (annualLoss / hoursPerDay) × 0.5", () => {
    const r = calculateProcrastinationCost(base.inputs, base.data);
    expect(r.halfHourSaving).toBe(
      Math.round((r.annualLoss / 2) * 0.5),
    );
  });

  it("3h/day → excessHoursPerDay = 3 - 2.09 = 0.9", () => {
    const r = calculateProcrastinationCost(
      { ...base.inputs, hoursPerDay: 3 },
      base.data,
    );
    expect(r.excessHoursPerDay).toBeCloseTo(0.9, 1);
    expect(r.excessAnnualLoss).toBeGreaterThan(0);
  });

  it("1h/day → excessHoursPerDay = 0 (below average)", () => {
    const r = calculateProcrastinationCost(
      { ...base.inputs, hoursPerDay: 1 },
      base.data,
    );
    expect(r.excessHoursPerDay).toBe(0);
    expect(r.excessAnnualLoss).toBe(0);
  });

  it("annualHoursLost = hoursPerDay × daysPerYear", () => {
    const r = calculateProcrastinationCost(base.inputs, base.data);
    expect(r.annualHoursLost).toBe(500);
  });

  it("higher hours → higher annual loss", () => {
    const low = calculateProcrastinationCost(
      { ...base.inputs, hoursPerDay: 1 },
      base.data,
    );
    const high = calculateProcrastinationCost(
      { ...base.inputs, hoursPerDay: 4 },
      base.data,
    );
    expect(high.annualLoss).toBeGreaterThan(low.annualLoss);
  });

  it("more working days → higher annual loss", () => {
    const low = calculateProcrastinationCost(
      { ...base.inputs, daysPerYear: 200 },
      base.data,
    );
    const high = calculateProcrastinationCost(
      { ...base.inputs, daysPerYear: 260 },
      base.data,
    );
    expect(high.annualLoss).toBeGreaterThan(low.annualLoss);
  });

  it("custom rate override replaces the state median wage exactly", () => {
    // The config injects the user's rate as medianWage when the override is set.
    const r = calculateProcrastinationCost(base.inputs, { medianWage: 100 });
    expect(r.stateMedianWage).toBe(100);
    expect(r.annualLoss).toBe(Math.round(2 * 100 * 250));
  });

  it("all outputs are finite numbers", () => {
    const r = calculateProcrastinationCost(base.inputs, base.data);
    for (const [key, val] of Object.entries(r)) {
      expect(Number.isFinite(val), `${key} should be finite`).toBe(true);
    }
  });
});
