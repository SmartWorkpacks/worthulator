import { describe, it, expect } from "vitest";
import {
  calculateScreenTime,
  US_AVG_SCREEN_HRS,
} from "./screenTime";

const base = {
  inputs: { hoursPerDay: 4, yearsAhead: 10, state: "National" },
  data: { medianWage: 23.11 },
};

describe("calculateScreenTime", () => {
  // ── Known values ─────────────────────────────────────────────────────────

  it("4h/day at $23.11/hr → annualCost = 4 × 365 × 23.11 ≈ $33,741", () => {
    const r = calculateScreenTime(base.inputs, base.data);
    expect(r.annualCost).toBe(Math.round(4 * 365 * 23.11));
  });

  it("weeklyHours = 4 × 7 = 28", () => {
    const r = calculateScreenTime(base.inputs, base.data);
    expect(r.weeklyHours).toBe(28);
  });

  it("lifetimeDays = (4 × 365 × 10) / 24 ≈ 608.3", () => {
    const r = calculateScreenTime(base.inputs, base.data);
    expect(r.lifetimeDays).toBeCloseTo(608.3, 0);
  });

  it("daysPerYear = (4 × 365) / 24 ≈ 60.8", () => {
    const r = calculateScreenTime(base.inputs, base.data);
    expect(r.daysPerYear).toBeCloseTo(60.8, 0);
  });

  // ── State wage injection ─────────────────────────────────────────────────

  it("California wage ($27.30) → higher annual cost than national", () => {
    const nat = calculateScreenTime(base.inputs, base.data);
    const ca = calculateScreenTime(base.inputs, { medianWage: 27.3 });
    expect(ca.annualCost).toBeGreaterThan(nat.annualCost);
    expect(ca.stateMedianWage).toBe(27.3);
  });

  it("Mississippi wage ($17.30) → lower annual cost than national", () => {
    const nat = calculateScreenTime(base.inputs, base.data);
    const ms = calculateScreenTime(base.inputs, { medianWage: 17.3 });
    expect(ms.annualCost).toBeLessThan(nat.annualCost);
  });

  // ── Excess hours ─────────────────────────────────────────────────────────

  it("6h/day → excessHoursPerDay = 6 - 4.37 = 1.6", () => {
    const r = calculateScreenTime(
      { ...base.inputs, hoursPerDay: 6 },
      base.data,
    );
    expect(r.excessHoursPerDay).toBeCloseTo(1.6, 1);
    expect(r.excessAnnualCost).toBeGreaterThan(0);
  });

  it("2h/day → excessHoursPerDay = 0 (below US avg)", () => {
    const r = calculateScreenTime(
      { ...base.inputs, hoursPerDay: 2 },
      base.data,
    );
    expect(r.excessHoursPerDay).toBe(0);
    expect(r.excessAnnualCost).toBe(0);
  });

  // ── One-hour saving ──────────────────────────────────────────────────────

  it("oneHourAnnualSaving = wage × 365", () => {
    const r = calculateScreenTime(base.inputs, base.data);
    expect(r.oneHourAnnualSaving).toBe(Math.round(23.11 * 365));
  });

  it("oneHourInvested10yr > oneHourAnnualSaving × 10 (compound growth)", () => {
    const r = calculateScreenTime(base.inputs, base.data);
    expect(r.oneHourInvested10yr).toBeGreaterThan(r.oneHourAnnualSaving * 10);
  });

  // ── Monotonicity ─────────────────────────────────────────────────────────

  it("more hours → higher annual cost", () => {
    const low = calculateScreenTime(
      { ...base.inputs, hoursPerDay: 2 },
      base.data,
    );
    const high = calculateScreenTime(
      { ...base.inputs, hoursPerDay: 8 },
      base.data,
    );
    expect(high.annualCost).toBeGreaterThan(low.annualCost);
  });

  it("higher wage → higher annual cost", () => {
    const low = calculateScreenTime(base.inputs, { medianWage: 15 });
    const high = calculateScreenTime(base.inputs, { medianWage: 40 });
    expect(high.annualCost).toBeGreaterThan(low.annualCost);
  });

  it("more years → more lifetime days", () => {
    const short = calculateScreenTime(
      { ...base.inputs, yearsAhead: 5 },
      base.data,
    );
    const long = calculateScreenTime(
      { ...base.inputs, yearsAhead: 30 },
      base.data,
    );
    expect(long.lifetimeDays).toBeGreaterThan(short.lifetimeDays);
  });

  // ── Invariants ───────────────────────────────────────────────────────────

  it("monthlyCost = annualCost / 12", () => {
    const r = calculateScreenTime(base.inputs, base.data);
    expect(r.monthlyCost).toBe(Math.round(r.annualCost / 12));
  });

  it("invested10yr > annualCost × 10 (compound growth)", () => {
    const r = calculateScreenTime(base.inputs, base.data);
    expect(r.invested10yr).toBeGreaterThan(r.annualCost * 10);
  });

  it("all outputs are finite numbers", () => {
    const r = calculateScreenTime(base.inputs, base.data);
    for (const [key, val] of Object.entries(r)) {
      expect(Number.isFinite(val), `${key} should be finite`).toBe(true);
    }
  });
});
