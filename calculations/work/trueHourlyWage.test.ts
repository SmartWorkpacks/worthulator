import { describe, it, expect } from "vitest";
import { calculateTrueHourlyWage, type TrueHourlyWageInputs } from "./trueHourlyWage";

const base: TrueHourlyWageInputs = {
  salary: 65000,
  hoursPerWeek: 40,
  commuteHrsDay: 0.5,
  decompressHrs: 0.5,
};

describe("calculateTrueHourlyWage — known values", () => {
  it("advertised rate = salary ÷ contracted hours", () => {
    const r = calculateTrueHourlyWage(base);
    expect(r.advertisedHourly).toBeCloseTo(65000 / (40 * 52), 2); // 31.25
  });

  it("extra hours = commute (doubled) + decompression, annualised over 260 days", () => {
    const r = calculateTrueHourlyWage(base);
    // 0.5×2×260 = 260 commute + 0.5×260 = 130 decompression = 390
    expect(r.extraHoursPerYear).toBe(390);
  });

  it("true rate divides salary by all job-related hours", () => {
    const r = calculateTrueHourlyWage(base);
    expect(r.trueHourly).toBeCloseTo(65000 / (2080 + 390), 2); // ~26.32
  });

  it("hourly loss = advertised − true", () => {
    const r = calculateTrueHourlyWage(base);
    expect(r.hourlyLoss).toBeCloseTo(r.advertisedHourly - r.trueHourly, 2);
  });

  it("time robbed expressed in 40-hr weeks", () => {
    const r = calculateTrueHourlyWage(base);
    expect(r.timeRobbedWeeks).toBe(Math.round((390 / 40) * 10) / 10); // 9.8
  });
});

describe("calculateTrueHourlyWage — zero-commute case", () => {
  it("no commute or decompression ⇒ true rate equals advertised", () => {
    const r = calculateTrueHourlyWage({ ...base, commuteHrsDay: 0, decompressHrs: 0 });
    expect(r.trueHourly).toBeCloseTo(r.advertisedHourly, 2);
    expect(r.extraHoursPerYear).toBe(0);
    expect(r.trueVsAdvertisedRatio).toBeCloseTo(1, 3);
  });
});

describe("calculateTrueHourlyWage — monotonicity", () => {
  it("longer commute lowers the true rate", () => {
    const lo = calculateTrueHourlyWage({ ...base, commuteHrsDay: 0.25 });
    const hi = calculateTrueHourlyWage({ ...base, commuteHrsDay: 1.5 });
    expect(hi.trueHourly).toBeLessThan(lo.trueHourly);
    expect(hi.hourlyLoss).toBeGreaterThan(lo.hourlyLoss);
  });

  it("more decompression time lowers the true rate", () => {
    const lo = calculateTrueHourlyWage({ ...base, decompressHrs: 0 });
    const hi = calculateTrueHourlyWage({ ...base, decompressHrs: 2 });
    expect(hi.trueHourly).toBeLessThan(lo.trueHourly);
  });

  it("higher salary raises both rates proportionally", () => {
    const lo = calculateTrueHourlyWage({ ...base, salary: 50000 });
    const hi = calculateTrueHourlyWage({ ...base, salary: 100000 });
    expect(hi.trueHourly).toBeGreaterThan(lo.trueHourly);
    expect(hi.advertisedHourly).toBeGreaterThan(lo.advertisedHourly);
  });
});

describe("calculateTrueHourlyWage — invariants", () => {
  it("true rate never exceeds advertised rate", () => {
    const r = calculateTrueHourlyWage(base);
    expect(r.trueHourly).toBeLessThanOrEqual(r.advertisedHourly);
  });

  it("ratio is between 0 and 1", () => {
    const r = calculateTrueHourlyWage(base);
    expect(r.trueVsAdvertisedRatio).toBeGreaterThan(0);
    expect(r.trueVsAdvertisedRatio).toBeLessThanOrEqual(1);
  });

  it("all outputs are finite", () => {
    const r = calculateTrueHourlyWage(base);
    for (const v of Object.values(r)) expect(Number.isFinite(v)).toBe(true);
  });
});
