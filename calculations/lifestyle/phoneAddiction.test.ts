import { describe, it, expect } from "vitest";
import {
  calculatePhoneAddiction,
  US_AVG_PHONE_HRS,
  WAKING_HOURS,
  type PhoneAddictionInputs,
  type PhoneAddictionData,
} from "./phoneAddiction";

const base: PhoneAddictionInputs = { hoursPerDay: 4, pickupsPerDay: 80, yearsAhead: 10 };
const data: PhoneAddictionData = { medianWage: 23.11 };

describe("calculatePhoneAddiction — known values", () => {
  it("annual opportunity cost = hours × 365 × wage", () => {
    expect(calculatePhoneAddiction(base, data).annualCost).toBe(Math.round(4 * 365 * 23.11));
  });

  it("yearly hours = hours/day × 365", () => {
    expect(calculatePhoneAddiction(base, data).yearlyHours).toBe(1460);
  });

  it("days per year = yearly hours ÷ 24", () => {
    expect(calculatePhoneAddiction(base, data).daysPerYear).toBeCloseTo(60.8, 1);
  });

  it("waking pct = hours ÷ 16 waking hours", () => {
    expect(calculatePhoneAddiction(base, data).wakingPct).toBeCloseTo((4 / WAKING_HOURS) * 100, 1);
  });

  it("pickups per year = pickups/day × 365", () => {
    expect(calculatePhoneAddiction(base, data).pickupsPerYear).toBe(80 * 365);
  });

  it("minutes per pickup = (hours × 60) ÷ pickups", () => {
    expect(calculatePhoneAddiction(base, data).minutesPerPickup).toBeCloseTo((4 * 60) / 80, 1);
  });
});

describe("calculatePhoneAddiction — scaling & monotonicity", () => {
  it("doubling hours roughly doubles opportunity cost", () => {
    const a = calculatePhoneAddiction({ ...base, hoursPerDay: 2 }, data);
    const b = calculatePhoneAddiction({ ...base, hoursPerDay: 4 }, data);
    expect(Math.abs(b.annualCost - a.annualCost * 2)).toBeLessThanOrEqual(1);
  });

  it("more pickups lowers minutes-per-pickup", () => {
    const few = calculatePhoneAddiction({ ...base, pickupsPerDay: 20 }, data);
    const many = calculatePhoneAddiction({ ...base, pickupsPerDay: 150 }, data);
    expect(many.minutesPerPickup).toBeLessThan(few.minutesPerPickup);
  });

  it("higher wage increases opportunity cost", () => {
    const lo = calculatePhoneAddiction(base, { medianWage: 15 });
    const hi = calculatePhoneAddiction(base, { medianWage: 40 });
    expect(hi.annualCost).toBeGreaterThan(lo.annualCost);
  });

  it("lifetime days grow with horizon", () => {
    const short = calculatePhoneAddiction({ ...base, yearsAhead: 5 }, data);
    const long = calculatePhoneAddiction({ ...base, yearsAhead: 30 }, data);
    expect(long.lifetimeDays).toBeGreaterThan(short.lifetimeDays);
  });

  it("invested 30yr exceeds invested 10yr", () => {
    const r = calculatePhoneAddiction(base, data);
    expect(r.invested30yr).toBeGreaterThan(r.invested10yr);
  });

  it("waking pct scales with hours", () => {
    const a = calculatePhoneAddiction({ ...base, hoursPerDay: 2 }, data);
    const b = calculatePhoneAddiction({ ...base, hoursPerDay: 8 }, data);
    expect(b.wakingPct).toBeGreaterThan(a.wakingPct);
  });
});

describe("calculatePhoneAddiction — excess vs US average", () => {
  it("no excess at or below US average", () => {
    const r = calculatePhoneAddiction({ ...base, hoursPerDay: US_AVG_PHONE_HRS }, data);
    expect(r.excessHoursPerDay).toBe(0);
    expect(r.excessAnnualCost).toBe(0);
  });

  it("excess measured above US average", () => {
    const r = calculatePhoneAddiction({ ...base, hoursPerDay: US_AVG_PHONE_HRS + 3 }, data);
    expect(r.excessHoursPerDay).toBeCloseTo(3, 1);
    expect(r.excessAnnualCost).toBeGreaterThan(0);
  });
});

describe("calculatePhoneAddiction — edges & invariants", () => {
  it("zero hours yields zero time costs", () => {
    const r = calculatePhoneAddiction({ ...base, hoursPerDay: 0 }, data);
    expect(r.annualCost).toBe(0);
    expect(r.lifetimeDays).toBe(0);
    expect(r.wakingPct).toBe(0);
  });

  it("zero pickups yields zero minutes-per-pickup (no divide-by-zero)", () => {
    const r = calculatePhoneAddiction({ ...base, pickupsPerDay: 0 }, data);
    expect(r.minutesPerPickup).toBe(0);
    expect(Number.isNaN(r.minutesPerPickup)).toBe(false);
  });

  it("negative inputs clamp to zero", () => {
    const r = calculatePhoneAddiction(
      { hoursPerDay: -4, pickupsPerDay: -10, yearsAhead: -5 },
      { medianWage: -20 },
    );
    expect(r.annualCost).toBe(0);
    expect(r.pickupsPerYear).toBe(0);
    expect(r.stateMedianWage).toBe(0);
  });

  it("never returns NaN for any field", () => {
    const r = calculatePhoneAddiction(base, data);
    for (const v of Object.values(r)) expect(Number.isNaN(v)).toBe(false);
  });
});
