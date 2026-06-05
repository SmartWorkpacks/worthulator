import { describe, it, expect } from "vitest";
import {
  calculateTimeBetween,
  AVG_DAYS_PER_MONTH,
  AVG_DAYS_PER_YEAR,
} from "./timeBetweenDates";

describe("core conversions", () => {
  it("weeks = days ÷ 7", () => {
    expect(calculateTimeBetween({ days: 70 }).weeks).toBe(10);
  });

  it("months = days ÷ 30.44 (avg)", () => {
    const r = calculateTimeBetween({ days: 91 });
    expect(r.months).toBeCloseTo(91 / AVG_DAYS_PER_MONTH, 1);
    expect(r.months).toBe(3); // ~2.99 → rounds to 3.0
  });

  it("years = days ÷ 365.25", () => {
    const r = calculateTimeBetween({ days: 365 });
    expect(r.years).toBeCloseTo(365 / AVG_DAYS_PER_YEAR, 2);
  });

  it("hours = days × 24", () => {
    expect(calculateTimeBetween({ days: 5 }).hours).toBe(120);
  });
});

describe("business days", () => {
  it("≈ days × 5/7", () => {
    expect(calculateTimeBetween({ days: 70 }).businessDays).toBe(50);
  });
});

describe("weeks + remainder breakdown", () => {
  it("100 days = 14 full weeks + 2 days", () => {
    const r = calculateTimeBetween({ days: 100 });
    expect(r.fullWeeks).toBe(14);
    expect(r.remainderDays).toBe(2);
  });

  it("exact multiple of 7 has zero remainder", () => {
    const r = calculateTimeBetween({ days: 49 });
    expect(r.fullWeeks).toBe(7);
    expect(r.remainderDays).toBe(0);
  });
});

describe("monotonicity & scaling", () => {
  it("more days ⇒ more weeks", () => {
    expect(calculateTimeBetween({ days: 200 }).weeks).toBeGreaterThan(
      calculateTimeBetween({ days: 100 }).weeks,
    );
  });

  it("doubling days doubles weeks", () => {
    const a = calculateTimeBetween({ days: 35 });
    const b = calculateTimeBetween({ days: 70 });
    expect(b.weeks).toBeCloseTo(a.weeks * 2, 6);
  });
});

describe("edge cases", () => {
  it("zero days → all zero", () => {
    const r = calculateTimeBetween({ days: 0 });
    expect(r.weeks).toBe(0);
    expect(r.months).toBe(0);
    expect(r.fullWeeks).toBe(0);
  });

  it("negative input is clamped to zero", () => {
    const r = calculateTimeBetween({ days: -10 });
    expect(r.weeks).toBe(0);
  });

  it("never returns NaN or Infinity", () => {
    const r = calculateTimeBetween({ days: 0 });
    expect(Object.values(r).every((v) => Number.isFinite(v))).toBe(true);
  });
});
