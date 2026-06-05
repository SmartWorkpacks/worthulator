import { describe, it, expect } from "vitest";
import { calculateWorkingDays, WorkingDaysInputs } from "./workingDays";

const base: WorkingDaysInputs = {
  calendarDays: 365,
  holidays: 11,
  workDaysPerWeek: 5,
};

describe("core working-days math", () => {
  it("≈ calendarDays × 5/7 − holidays for a standard year", () => {
    const r = calculateWorkingDays(base);
    // 365 × 5/7 = 260.7 → −11 ≈ 249.7 → 250 rounded
    expect(r.workingDays).toBe(250);
  });

  it("70-day span at 5/7 = 50 weekdays", () => {
    const r = calculateWorkingDays({ calendarDays: 70, holidays: 0, workDaysPerWeek: 5 });
    expect(r.workingDays).toBe(50);
    expect(r.weekendDays).toBe(20);
  });

  it("holidays reduce working days one-for-one", () => {
    const none = calculateWorkingDays({ calendarDays: 70, holidays: 0, workDaysPerWeek: 5 });
    const two  = calculateWorkingDays({ calendarDays: 70, holidays: 2, workDaysPerWeek: 5 });
    expect(none.workingDays - two.workingDays).toBe(2);
  });
});

describe("non-standard work weeks", () => {
  it("6-day week yields more working days than 5-day", () => {
    const five = calculateWorkingDays({ calendarDays: 70, holidays: 0, workDaysPerWeek: 5 });
    const six  = calculateWorkingDays({ calendarDays: 70, holidays: 0, workDaysPerWeek: 6 });
    expect(six.workingDays).toBeGreaterThan(five.workingDays);
  });

  it("7-day week means no weekend days", () => {
    const r = calculateWorkingDays({ calendarDays: 70, holidays: 0, workDaysPerWeek: 7 });
    expect(r.weekendDays).toBe(0);
    expect(r.workingDays).toBe(70);
  });
});

describe("derived figures", () => {
  it("workingWeeks = workingDays ÷ workDaysPerWeek", () => {
    const r = calculateWorkingDays({ calendarDays: 70, holidays: 0, workDaysPerWeek: 5 });
    expect(r.workingWeeks).toBe(10);
  });

  it("pctWorking is between 0 and 100", () => {
    const r = calculateWorkingDays(base);
    expect(r.pctWorking).toBeGreaterThan(0);
    expect(r.pctWorking).toBeLessThanOrEqual(100);
  });
});

describe("edge cases", () => {
  it("clamps workDaysPerWeek to 1–7", () => {
    const r = calculateWorkingDays({ calendarDays: 70, holidays: 0, workDaysPerWeek: 99 });
    expect(r.workingDays).toBe(70);
  });

  it("never goes negative when holidays exceed weekdays", () => {
    const r = calculateWorkingDays({ calendarDays: 5, holidays: 50, workDaysPerWeek: 5 });
    expect(r.workingDays).toBe(0);
  });

  it("zero calendar days → zero working days", () => {
    const r = calculateWorkingDays({ calendarDays: 0, holidays: 0, workDaysPerWeek: 5 });
    expect(r.workingDays).toBe(0);
    expect(r.pctWorking).toBe(0);
  });

  it("never returns NaN or Infinity", () => {
    const r = calculateWorkingDays({ calendarDays: 0, holidays: 0, workDaysPerWeek: 0 });
    expect(Object.values(r).every((v) => Number.isFinite(v))).toBe(true);
  });
});
