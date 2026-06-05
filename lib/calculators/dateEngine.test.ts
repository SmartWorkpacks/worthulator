import { describe, expect, it } from "vitest";
import { calculateDate, type DateInputs } from "./dateEngine";

const DIFF_BASE: DateInputs = {
  mode: "difference",
  startDate: "2025-01-01",
  endDate: "2025-01-31",
  includeEndDay: false,
  amount: 0,
  unit: "days",
  direction: "add",
};

const ADD_BASE: DateInputs = {
  mode: "add",
  startDate: "2025-01-01",
  endDate: "",
  includeEndDay: false,
  amount: 90,
  unit: "days",
  direction: "add",
};

describe("calculateDate — difference", () => {
  it("computes a known 30-day span with business days", () => {
    const r = calculateDate(DIFF_BASE);
    expect(r.totalDays).toBe(30);
    expect(r.days).toBe(30); // Y/M/D remainder
    expect(r.weeks).toBe(4);
    expect(r.remainderDays).toBe(2);
    expect(r.weekdays).toBe(22);
    expect(r.weekends).toBe(8);
    expect(r.totalHours).toBe(720);
    expect(r.totalMinutes).toBe(43_200);
  });

  it("counts the end day when includeEndDay is set", () => {
    const r = calculateDate({ ...DIFF_BASE, includeEndDay: true });
    expect(r.totalDays).toBe(31);
    expect(r.weekdays).toBe(23);
    expect(r.weekends).toBe(8);
  });

  it("produces a clean Y/M/D breakdown across months and years", () => {
    const r = calculateDate({ ...DIFF_BASE, startDate: "2023-01-15", endDate: "2024-03-20" });
    expect(r.years).toBe(1);
    expect(r.months).toBe(2);
    expect(r.days).toBe(5);
  });

  it("handles reversed inputs via absolute difference", () => {
    const r = calculateDate({ ...DIFF_BASE, startDate: "2025-02-01", endDate: "2025-01-01" });
    expect(r.reversed).toBe(true);
    expect(r.totalDays).toBe(31);
  });

  it("keeps weekdays + weekends equal to the span", () => {
    const r = calculateDate({ ...DIFF_BASE, startDate: "2020-01-01", endDate: "2023-12-31" });
    expect(r.weekdays + r.weekends).toBe(r.totalDays);
    expect(r.totalDays).toBeGreaterThan(0);
  });

  it("flags invalid dates without producing NaN", () => {
    const r = calculateDate({ ...DIFF_BASE, endDate: "not-a-date" });
    expect(r.valid).toBe(false);
    expect(r.totalDays).toBe(0);
    expect(Number.isFinite(r.totalDays)).toBe(true);
  });
});

describe("calculateDate — add", () => {
  it("adds days across month boundaries", () => {
    const r = calculateDate(ADD_BASE);
    expect(r.resultISO).toBe("2025-04-01");
    expect(r.resultWeekday).toBe("Tuesday");
    expect(r.offsetDays).toBe(90);
  });

  it("clamps day-of-month when adding months", () => {
    const r = calculateDate({ ...ADD_BASE, startDate: "2025-01-31", amount: 1, unit: "months" });
    expect(r.resultISO).toBe("2025-02-28");
  });

  it("clamps leap day when adding years", () => {
    const r = calculateDate({ ...ADD_BASE, startDate: "2024-02-29", amount: 1, unit: "years" });
    expect(r.resultISO).toBe("2025-02-28");
  });

  it("subtracts across a year boundary", () => {
    const r = calculateDate({ ...ADD_BASE, startDate: "2025-01-01", amount: 1, unit: "days", direction: "subtract" });
    expect(r.resultISO).toBe("2024-12-31");
  });

  it("treats a NaN amount as zero offset", () => {
    const r = calculateDate({ ...ADD_BASE, amount: Number.NaN });
    expect(r.valid).toBe(true);
    expect(r.resultISO).toBe("2025-01-01");
    expect(r.offsetDays).toBe(0);
  });
});
