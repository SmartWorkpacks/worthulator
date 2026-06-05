import { describe, it, expect } from "vitest";
import {
  calculateWorkHours,
  WorkHoursInputs,
  FULL_TIME_YEAR_HOURS,
} from "./workHours";

const base: WorkHoursInputs = {
  hoursPerDay: 8,
  daysPerWeek: 5,
  weeksWorked: 52,
  hourlyRate: 25,
};

describe("core hours math", () => {
  const r = calculateWorkHours(base);

  it("weeklyHours = hoursPerDay × daysPerWeek", () => {
    expect(r.weeklyHours).toBe(40);
  });

  it("totalHours = weeklyHours × weeks", () => {
    expect(r.totalHours).toBe(FULL_TIME_YEAR_HOURS);
  });

  it("daysWorked = daysPerWeek × weeks", () => {
    expect(r.daysWorked).toBe(260);
  });

  it("a standard full-time year is exactly 1.0 FTE", () => {
    expect(r.fte).toBe(1);
  });
});

describe("overtime (FLSA weekly basis)", () => {
  it("no overtime at or below 40 h/week", () => {
    const r = calculateWorkHours(base);
    expect(r.overtimeHours).toBe(0);
    expect(r.regularHours).toBe(2080);
  });

  it("hours over 40/week are overtime", () => {
    // 10h × 5d = 50/week → 10 OT/week × 4 weeks = 40 OT hours
    const r = calculateWorkHours({ hoursPerDay: 10, daysPerWeek: 5, weeksWorked: 4, hourlyRate: 20 });
    expect(r.weeklyHours).toBe(50);
    expect(r.overtimeHours).toBe(40);
    expect(r.regularHours).toBe(160);
  });

  it("overtime is paid at 1.5×", () => {
    const r = calculateWorkHours({ hoursPerDay: 10, daysPerWeek: 5, weeksWorked: 1, hourlyRate: 20 });
    // regular 40×20 = 800, OT 10×20×1.5 = 300
    expect(r.regularPay).toBe(800);
    expect(r.overtimePay).toBe(300);
    expect(r.grossPay).toBe(1100);
  });
});

describe("earnings", () => {
  it("grossPay = regular + overtime pay", () => {
    const r = calculateWorkHours(base);
    expect(r.grossPay).toBe(2080 * 25);
  });

  it("zero rate → zero pay, hours still computed", () => {
    const r = calculateWorkHours({ ...base, hourlyRate: 0 });
    expect(r.grossPay).toBe(0);
    expect(r.totalHours).toBe(2080);
  });
});

describe("scaling & monotonicity", () => {
  it("doubling weeks doubles total hours", () => {
    const a = calculateWorkHours({ ...base, weeksWorked: 10 });
    const b = calculateWorkHours({ ...base, weeksWorked: 20 });
    expect(b.totalHours).toBeCloseTo(a.totalHours * 2, 6);
  });

  it("more daily hours ⇒ more total hours", () => {
    const a = calculateWorkHours({ ...base, hoursPerDay: 6 });
    const b = calculateWorkHours({ ...base, hoursPerDay: 9 });
    expect(b.totalHours).toBeGreaterThan(a.totalHours);
  });
});

describe("edge cases", () => {
  it("clamps daysPerWeek to 7", () => {
    const r = calculateWorkHours({ ...base, daysPerWeek: 10 });
    expect(r.weeklyHours).toBe(8 * 7);
  });

  it("handles partial (decimal) hours", () => {
    const r = calculateWorkHours({ hoursPerDay: 7.5, daysPerWeek: 5, weeksWorked: 1, hourlyRate: 0 });
    expect(r.weeklyHours).toBe(37.5);
  });

  it("never returns NaN or Infinity", () => {
    const r = calculateWorkHours({ hoursPerDay: 0, daysPerWeek: 0, weeksWorked: 0, hourlyRate: 0 });
    expect(Object.values(r).every((v) => Number.isFinite(v))).toBe(true);
  });
});
