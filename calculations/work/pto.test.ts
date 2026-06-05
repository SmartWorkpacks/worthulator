import { describe, it, expect } from "vitest";
import { calculatePto } from "./pto";

describe("calculatePto", () => {
  const base = { hourlyRate: 40, ptoHoursRemaining: 80, hoursPerDay: 8 };

  it("cash value is rate × hours", () => {
    const r = calculatePto(base);
    expect(r.cashValue).toBe(40 * 80);
  });

  it("days remaining is hours / hours-per-day", () => {
    const r = calculatePto(base);
    expect(r.daysRemaining).toBe(10);
  });

  it("weekly earning rate is rate × hours-per-day × 5", () => {
    const r = calculatePto(base);
    expect(r.weeklyEarningRate).toBe(40 * 8 * 5);
  });

  it("daily cash value is rate × hours-per-day", () => {
    const r = calculatePto(base);
    expect(r.dailyCashValue).toBe(40 * 8);
  });

  it("pto days expressed as weeks", () => {
    const r = calculatePto(base);
    expect(r.ptoDaysAsWeeks).toBe(2);
  });

  it("more hours means more cash value", () => {
    const low = calculatePto({ ...base, ptoHoursRemaining: 40 });
    const high = calculatePto({ ...base, ptoHoursRemaining: 160 });
    expect(high.cashValue).toBeGreaterThan(low.cashValue);
  });

  it("higher rate scales the cash value", () => {
    const low = calculatePto({ ...base, hourlyRate: 20 });
    const high = calculatePto({ ...base, hourlyRate: 80 });
    expect(high.cashValue).toBe(low.cashValue * 4);
  });

  it("shorter work day means more days from the same hours", () => {
    const long = calculatePto({ ...base, hoursPerDay: 8 });
    const short = calculatePto({ ...base, hoursPerDay: 6 });
    expect(short.daysRemaining).toBeGreaterThan(long.daysRemaining);
  });

  it("zero hours yields zero everywhere", () => {
    const r = calculatePto({ ...base, ptoHoursRemaining: 0 });
    expect(r.cashValue).toBe(0);
    expect(r.daysRemaining).toBe(0);
  });

  it("guards a zero hours-per-day", () => {
    const r = calculatePto({ ...base, hoursPerDay: 0 });
    expect(r.daysRemaining).toBe(0);
  });

  it("cash value equals daily value × days for whole-day balances", () => {
    const r = calculatePto(base);
    expect(r.cashValue).toBeCloseTo(r.dailyCashValue * r.daysRemaining, 0);
  });

  it("never returns negative figures", () => {
    const r = calculatePto(base);
    expect(r.cashValue).toBeGreaterThanOrEqual(0);
    expect(r.weeklyEarningRate).toBeGreaterThanOrEqual(0);
  });
});
