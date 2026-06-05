import { describe, expect, it } from "vitest";
import { calculateHours, type HoursInputs } from "./hoursEngine";

const BASE: HoursInputs = {
  startMinutes: 9 * 60, // 09:00
  endMinutes: 17 * 60, // 17:00
  breakMinutes: 60,
  hourlyRate: 20,
  overtimeThresholdHours: 8,
};

describe("calculateHours", () => {
  it("computes a standard 9-to-5 with a 1-hour break", () => {
    const r = calculateHours(BASE);
    expect(r.grossMinutes).toBe(480);
    expect(r.workedMinutes).toBe(420);
    expect(r.workedHours).toBe(7);
    expect(r.hoursPart).toBe(7);
    expect(r.minutesPart).toBe(0);
    expect(r.totalPay).toBe(140);
    expect(r.isOvernight).toBe(false);
  });

  it("handles an overnight shift crossing midnight", () => {
    const r = calculateHours({ ...BASE, startMinutes: 22 * 60, endMinutes: 6 * 60, breakMinutes: 30 });
    expect(r.isOvernight).toBe(true);
    expect(r.workedMinutes).toBe(450);
    expect(r.workedHours).toBe(7.5);
    expect(r.hoursPart).toBe(7);
    expect(r.minutesPart).toBe(30);
  });

  it("splits regular and overtime with a 1.5x premium", () => {
    const r = calculateHours({ ...BASE, startMinutes: 8 * 60, endMinutes: 19 * 60, breakMinutes: 0 });
    expect(r.workedHours).toBe(11);
    expect(r.regularHours).toBe(8);
    expect(r.overtimeHours).toBe(3);
    // 8 * 20 + 3 * 20 * 1.5 = 160 + 90 = 250
    expect(r.totalPay).toBe(250);
    expect(r.regularPay).toBe(160);
    expect(r.overtimePay).toBe(90);
  });

  it("floors worked time to zero when the break exceeds the shift", () => {
    const r = calculateHours({ ...BASE, startMinutes: 9 * 60, endMinutes: 10 * 60, breakMinutes: 120 });
    expect(r.workedMinutes).toBe(0);
    expect(r.workedHours).toBe(0);
    expect(r.totalPay).toBe(0);
  });

  it("keeps regular + overtime equal to worked hours", () => {
    const r = calculateHours({ ...BASE, startMinutes: 6 * 60, endMinutes: 20 * 60, breakMinutes: 45 });
    expect(Math.round((r.regularHours + r.overtimeHours) * 100) / 100).toBe(r.workedHours);
  });

  it("hides pay when no hourly rate is given", () => {
    const r = calculateHours({ ...BASE, hourlyRate: 0 });
    expect(r.hasPay).toBe(false);
    expect(r.totalPay).toBe(0);
    expect(r.workedHours).toBe(7);
  });

  it("guards NaN inputs from producing non-finite values", () => {
    const r = calculateHours({
      startMinutes: Number.NaN,
      endMinutes: Number.NaN,
      breakMinutes: Number.NaN,
      hourlyRate: Number.NaN,
      overtimeThresholdHours: Number.NaN,
    });
    expect(Number.isFinite(r.workedHours)).toBe(true);
    expect(Number.isFinite(r.totalPay)).toBe(true);
    expect(r.workedHours).toBeGreaterThanOrEqual(0);
  });

  it("rounds pay and decimal hours to two places", () => {
    const r = calculateHours({ ...BASE, startMinutes: 9 * 60, endMinutes: 16 * 60 + 30, breakMinutes: 0, hourlyRate: 15.5 });
    expect(r.workedHours).toBe(7.5);
    expect(r.totalPay).toBe(116.25); // 7.5 * 15.5
  });
});
