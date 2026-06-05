import { describe, it, expect } from "vitest";
import {
  calculateStreamingTime,
  US_AVG_STREAM_HRS,
  type StreamingTimeInputs,
  type StreamingTimeData,
} from "./streamingTime";

const base: StreamingTimeInputs = { hoursPerDay: 3, yearsAhead: 10, monthlySubCost: 50 };
const data: StreamingTimeData = { medianWage: 23.11 };

describe("calculateStreamingTime — known values", () => {
  it("annual opportunity cost = hours × 365 × wage", () => {
    const r = calculateStreamingTime(base, data);
    expect(r.annualCost).toBe(Math.round(3 * 365 * 23.11));
  });

  it("yearly hours = hours/day × 365", () => {
    expect(calculateStreamingTime(base, data).yearlyHours).toBe(1095);
  });

  it("days per year = yearly hours ÷ 24", () => {
    const r = calculateStreamingTime(base, data);
    expect(r.daysPerYear).toBeCloseTo(45.6, 1);
  });

  it("annual subscription cost = monthly × 12", () => {
    expect(calculateStreamingTime(base, data).annualSubCost).toBe(600);
  });

  it("subscription total = annual sub × years", () => {
    expect(calculateStreamingTime(base, data).subTotalCost).toBe(6000);
  });

  it("cost per hour watched = annual sub ÷ yearly hours", () => {
    const r = calculateStreamingTime(base, data);
    expect(r.costPerHourWatched).toBeCloseTo(600 / 1095, 2);
  });

  it("combined annual cost = opportunity + subscription", () => {
    const r = calculateStreamingTime(base, data);
    expect(r.combinedAnnualCost).toBe(r.annualCost + r.annualSubCost);
  });
});

describe("calculateStreamingTime — scaling & monotonicity", () => {
  it("doubling hours doubles opportunity cost", () => {
    const a = calculateStreamingTime({ ...base, hoursPerDay: 2 }, data);
    const b = calculateStreamingTime({ ...base, hoursPerDay: 4 }, data);
    expect(Math.abs(b.annualCost - a.annualCost * 2)).toBeLessThanOrEqual(1);
  });

  it("more hours lowers cost-per-hour-watched (better sub value)", () => {
    const light = calculateStreamingTime({ ...base, hoursPerDay: 1 }, data);
    const heavy = calculateStreamingTime({ ...base, hoursPerDay: 6 }, data);
    expect(heavy.costPerHourWatched).toBeLessThan(light.costPerHourWatched);
  });

  it("higher wage increases opportunity cost but not subscription spend", () => {
    const lo = calculateStreamingTime(base, { medianWage: 15 });
    const hi = calculateStreamingTime(base, { medianWage: 40 });
    expect(hi.annualCost).toBeGreaterThan(lo.annualCost);
    expect(hi.annualSubCost).toBe(lo.annualSubCost);
  });

  it("lifetime days grows with the projection horizon", () => {
    const short = calculateStreamingTime({ ...base, yearsAhead: 5 }, data);
    const long = calculateStreamingTime({ ...base, yearsAhead: 30 }, data);
    expect(long.lifetimeDays).toBeGreaterThan(short.lifetimeDays);
  });

  it("invested 30yr exceeds invested 10yr", () => {
    const r = calculateStreamingTime(base, data);
    expect(r.invested30yr).toBeGreaterThan(r.invested10yr);
  });
});

describe("calculateStreamingTime — excess vs US average", () => {
  it("no excess cost at or below the US average", () => {
    const r = calculateStreamingTime({ ...base, hoursPerDay: US_AVG_STREAM_HRS }, data);
    expect(r.excessHoursPerDay).toBe(0);
    expect(r.excessAnnualCost).toBe(0);
  });

  it("excess hours measured above the US average", () => {
    const r = calculateStreamingTime({ ...base, hoursPerDay: US_AVG_STREAM_HRS + 2 }, data);
    expect(r.excessHoursPerDay).toBeCloseTo(2, 1);
    expect(r.excessAnnualCost).toBeGreaterThan(0);
  });
});

describe("calculateStreamingTime — edges & invariants", () => {
  it("zero hours yields zero time-based costs", () => {
    const r = calculateStreamingTime({ ...base, hoursPerDay: 0 }, data);
    expect(r.annualCost).toBe(0);
    expect(r.lifetimeDays).toBe(0);
    expect(r.costPerHourWatched).toBe(0);
  });

  it("zero subscription cost yields zero sub spend but keeps time cost", () => {
    const r = calculateStreamingTime({ ...base, monthlySubCost: 0 }, data);
    expect(r.annualSubCost).toBe(0);
    expect(r.annualCost).toBeGreaterThan(0);
  });

  it("negative inputs are clamped to zero", () => {
    const r = calculateStreamingTime(
      { hoursPerDay: -3, yearsAhead: -5, monthlySubCost: -10 },
      { medianWage: -20 },
    );
    expect(r.annualCost).toBe(0);
    expect(r.subTotalCost).toBe(0);
    expect(r.stateMedianWage).toBe(0);
  });

  it("never returns NaN for any numeric field", () => {
    const r = calculateStreamingTime(base, data);
    for (const v of Object.values(r)) expect(Number.isNaN(v)).toBe(false);
  });
});
