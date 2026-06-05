import { describe, expect, it } from "vitest";
import { calculateTimecard, type TimecardDay, type TimecardInputs } from "./timecardEngine";

function day(label: string, enabled: boolean, start: number, end: number, brk: number): TimecardDay {
  return { label, enabled, startMinutes: start, endMinutes: end, breakMinutes: brk };
}

// Mon–Fri 9:00–17:00 with a 30-min break; weekend off.
const WEEKDAYS: TimecardDay[] = [
  day("Mon", true, 9 * 60, 17 * 60, 30),
  day("Tue", true, 9 * 60, 17 * 60, 30),
  day("Wed", true, 9 * 60, 17 * 60, 30),
  day("Thu", true, 9 * 60, 17 * 60, 30),
  day("Fri", true, 9 * 60, 17 * 60, 30),
  day("Sat", false, 9 * 60, 17 * 60, 0),
  day("Sun", false, 9 * 60, 17 * 60, 0),
];

const BASE: TimecardInputs = {
  days: WEEKDAYS,
  hourlyRate: 0,
  weeklyOvertimeThresholdHours: 40,
};

describe("calculateTimecard", () => {
  it("sums a standard week with no overtime", () => {
    const r = calculateTimecard(BASE);
    // 5 days × 7.5h = 37.5h, all regular.
    expect(r.totalWorkedHours).toBeCloseTo(37.5, 2);
    expect(r.regularHours).toBeCloseTo(37.5, 2);
    expect(r.overtimeHours).toBe(0);
    expect(r.daysWorked).toBe(5);
    expect(r.averageDailyHours).toBeCloseTo(7.5, 2);
  });

  it("splits weekly overtime past the 40-hour threshold", () => {
    // 6 days × 8h (no break) = 48h → 40 regular + 8 overtime.
    const sixEights: TimecardDay[] = Array.from({ length: 6 }, (_, i) =>
      day(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][i], true, 8 * 60, 16 * 60, 0),
    ).concat(day("Sun", false, 0, 0, 0));
    const r = calculateTimecard({ ...BASE, days: sixEights });
    expect(r.totalWorkedHours).toBeCloseTo(48, 2);
    expect(r.regularHours).toBeCloseTo(40, 2);
    expect(r.overtimeHours).toBeCloseTo(8, 2);
  });

  it("computes pay with the overtime premium", () => {
    const sixEights: TimecardDay[] = Array.from({ length: 6 }, (_, i) =>
      day(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][i], true, 8 * 60, 16 * 60, 0),
    ).concat(day("Sun", false, 0, 0, 0));
    const r = calculateTimecard({ ...BASE, days: sixEights, hourlyRate: 20 });
    // 40 × 20 + 8 × 20 × 1.5 = 800 + 240 = 1,040.
    expect(r.hasPay).toBe(true);
    expect(r.regularPay).toBeCloseTo(800, 1);
    expect(r.overtimePay).toBeCloseTo(240, 1);
    expect(r.totalPay).toBeCloseTo(1_040, 1);
  });

  it("keeps regular and overtime hours summing to the total", () => {
    const r = calculateTimecard({ ...BASE, hourlyRate: 25 });
    expect(round2(r.regularHours + r.overtimeHours)).toBeCloseTo(r.totalWorkedHours, 2);
    expect(round2(r.regularPay + r.overtimePay)).toBeCloseTo(r.totalPay, 2);
  });

  it("handles an overnight shift and excludes disabled days", () => {
    const overnight: TimecardDay[] = [
      day("Mon", true, 22 * 60, 6 * 60, 30), // 22:00 → 06:00 = 8h − 0.5 = 7.5h
      day("Tue", false, 9 * 60, 17 * 60, 0), // disabled → 0
    ];
    const r = calculateTimecard({ ...BASE, days: overnight });
    expect(r.days[0].isOvernight).toBe(true);
    expect(r.days[0].workedHours).toBeCloseTo(7.5, 2);
    expect(r.days[1].workedMinutes).toBe(0);
    expect(r.totalWorkedHours).toBeCloseTo(7.5, 2);
    expect(r.daysWorked).toBe(1);
  });

  it("increases total pay as worked hours rise", () => {
    const base = calculateTimecard({ ...BASE, hourlyRate: 20 });
    const moreDays = calculateTimecard({
      ...BASE,
      hourlyRate: 20,
      days: WEEKDAYS.map((d) => ({ ...d, enabled: true })),
    });
    expect(moreDays.totalWorkedHours).toBeGreaterThan(base.totalWorkedHours);
    expect(moreDays.totalPay).toBeGreaterThan(base.totalPay);
  });

  it("guards NaN inputs from producing non-finite values", () => {
    const r = calculateTimecard({
      days: [day("Mon", true, Number.NaN, Number.NaN, Number.NaN)],
      hourlyRate: Number.NaN,
      weeklyOvertimeThresholdHours: Number.NaN,
    });
    expect(Number.isFinite(r.totalWorkedHours)).toBe(true);
    expect(Number.isFinite(r.totalPay)).toBe(true);
    expect(r.totalWorkedHours).toBeGreaterThanOrEqual(0);
  });
});

function round2(n: number) {
  return Math.round(n * 100) / 100;
}
