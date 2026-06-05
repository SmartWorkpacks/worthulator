import { describe, it, expect } from "vitest";
import { calculateDays, type DaysInputs } from "./daysEngine";

const base: DaysInputs = {
  mode: "between",
  asOfDate: "2025-06-01",
  targetDate: "2025-06-11",
  pastDate: "2025-05-22",
  startDate: "2025-01-01",
  endDate: "2025-12-31",
  businessOnly: false,
  includeEndDay: false,
};

describe("calculateDays — between mode", () => {
  it("counts calendar days across a full year (exclusive vs inclusive)", () => {
    const ex = calculateDays({ ...base, startDate: "2025-01-01", endDate: "2025-12-31" });
    expect(ex.valid).toBe(true);
    expect(ex.calendarDays).toBe(364);
    expect(ex.totalDays).toBe(364);
    const inc = calculateDays({ ...base, includeEndDay: true });
    expect(inc.calendarDays).toBe(365);
  });

  it("restates the span in weeks", () => {
    const r = calculateDays({ ...base, startDate: "2025-01-01", endDate: "2025-01-15" });
    expect(r.calendarDays).toBe(14);
    expect(r.wholeWeeks).toBe(2);
    expect(r.remainderDays).toBe(0);
    expect(r.totalWeeks).toBeCloseTo(2.0, 1);
  });

  it("produces a calendar Y/M/D breakdown", () => {
    const r = calculateDays({ ...base, startDate: "2024-01-01", endDate: "2025-03-15" });
    expect(r.years).toBe(1);
    expect(r.months).toBe(2);
    expect(r.days).toBe(14);
  });
});

describe("calculateDays — business days", () => {
  it("counts only weekdays when businessOnly is set", () => {
    // 2025-01-01 is a Wednesday; the 7-day span Wed..Tue has 5 weekdays, 2 weekend days.
    const r = calculateDays({
      ...base,
      startDate: "2025-01-01",
      endDate: "2025-01-08",
      businessOnly: true,
    });
    expect(r.businessDays).toBe(5);
    expect(r.weekendDays).toBe(2);
    expect(r.totalDays).toBe(5); // business-only headline
    expect(r.calendarDays).toBe(7);
    expect(r.countedLabel).toBe("business days");
  });

  it("business + weekend days always sum to the calendar span", () => {
    const r = calculateDays({ ...base, startDate: "2025-03-01", endDate: "2025-04-15" });
    expect(r.businessDays + r.weekendDays).toBe(r.calendarDays);
    expect(r.totalDays).toBeLessThanOrEqual(r.calendarDays);
  });
});

describe("calculateDays — until & since modes", () => {
  it("counts days until a future target date", () => {
    const r = calculateDays({ ...base, mode: "until", asOfDate: "2025-06-01", targetDate: "2025-06-11" });
    expect(r.totalDays).toBe(10);
    expect(r.reversed).toBe(false);
    expect(r.fromISO).toBe("2025-06-01");
    expect(r.toISO).toBe("2025-06-11");
  });

  it("flags reversed when the 'until' target is already in the past", () => {
    const r = calculateDays({ ...base, mode: "until", asOfDate: "2025-06-11", targetDate: "2025-06-01" });
    expect(r.totalDays).toBe(10); // magnitude is order-independent
    expect(r.reversed).toBe(true);
  });

  it("counts days since a past date", () => {
    const r = calculateDays({ ...base, mode: "since", asOfDate: "2025-06-11", pastDate: "2025-06-01" });
    expect(r.totalDays).toBe(10);
    expect(r.reversed).toBe(false);
    expect(r.toISO).toBe("2025-06-11"); // 'to' is today in since mode
  });
});

describe("calculateDays — guards", () => {
  it("returns invalid for an unparseable date", () => {
    const r = calculateDays({ ...base, mode: "between", startDate: "nope", endDate: "2025-01-01" });
    expect(r.valid).toBe(false);
    expect(r.breakdown).toHaveLength(0);
  });

  it("never returns NaN and keeps counts non-negative", () => {
    const r = calculateDays({ ...base, startDate: "2025-12-31", endDate: "2025-01-01" });
    expect(r.valid).toBe(true);
    expect(r.reversed).toBe(true);
    expect(Number.isFinite(r.totalDays)).toBe(true);
    expect(r.totalDays).toBeGreaterThanOrEqual(0);
    expect(r.calendarDays).toBe(364);
  });
});
