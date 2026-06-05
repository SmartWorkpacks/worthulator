import { describe, it, expect } from "vitest";
import {
  calculateApplianceCost,
  ELECTRICITY_INFLATION,
  AVG_HOME_KWH_PER_YEAR,
  EFFICIENT_SAVINGS_PCT,
} from "./applianceCost";

const base = { watts: 200, hoursPerDay: 8, daysPerWeek: 7, quantity: 1 };
const rate = { electricRate: 0.165 };

describe("calculateApplianceCost — core economics", () => {
  it("computes a known 200W / 8h/day / 7day case at $0.165/kWh", () => {
    const r = calculateApplianceCost(base, rate);
    // 0.2 kWh * 8h = 1.6 kWh/day → * 0.165 = $0.264/day
    expect(r.dailyCost).toBeCloseTo(0.26, 2);
    // 1.6 kWh/day * 7 * 52 = 582.4 kWh/yr → round 582
    expect(r.kWhPerYear).toBe(582);
    // annual = 0.264 * 7 * 52 = 96.10
    expect(r.annualCost).toBeCloseTo(96.1, 1);
    expect(r.monthlyCost).toBeCloseTo(96.1 / 12, 1);
    expect(r.tenYearCost).toBeCloseTo(961, 0);
    expect(r.electricRate).toBe(0.165);
  });

  it("monthly is exactly annual / 12 and weekly*52 equals annual", () => {
    const r = calculateApplianceCost(base, rate);
    expect(r.monthlyCost).toBeCloseTo(r.annualCost / 12, 1);
    // weekly is rounded to cents independently, so ×52 may drift up to a few cents
    expect(r.weeklyCost * 52).toBeCloseTo(r.annualCost, 0);
  });
});

describe("usage scaling", () => {
  it("3 days/week costs 3/7 of the 7-day annual cost", () => {
    const seven = calculateApplianceCost(base, rate);
    const three = calculateApplianceCost({ ...base, daysPerWeek: 3 }, rate);
    expect(three.annualCost).toBeCloseTo((seven.annualCost * 3) / 7, 1);
  });

  it("quantity scales cost linearly", () => {
    const one = calculateApplianceCost(base, rate);
    const four = calculateApplianceCost({ ...base, quantity: 4 }, rate);
    expect(four.annualCost).toBeCloseTo(one.annualCost * 4, 1);
    // kWh is rounded to whole units; ±a couple kWh of rounding drift is expected
    expect(Math.abs(four.kWhPerYear - one.kWhPerYear * 4)).toBeLessThanOrEqual(2);
  });

  it("doubling the rate doubles the cost but not the kWh", () => {
    const a = calculateApplianceCost(base, { electricRate: 0.15 });
    const b = calculateApplianceCost(base, { electricRate: 0.30 });
    expect(b.annualCost).toBeCloseTo(a.annualCost * 2, 1);
    expect(b.kWhPerYear).toBe(a.kWhPerYear);
  });
});

describe("home-bill share is rate-independent (energy share)", () => {
  it("equals kWhPerYear / avg-home-kWh regardless of rate", () => {
    const r1 = calculateApplianceCost(base, { electricRate: 0.10 });
    const r2 = calculateApplianceCost(base, { electricRate: 0.40 });
    const expected = (r1.kWhPerYear / AVG_HOME_KWH_PER_YEAR) * 100;
    expect(r1.asPercentHomeBill).toBeCloseTo(expected, 1);
    expect(r2.asPercentHomeBill).toBeCloseTo(r1.asPercentHomeBill, 1);
  });
});

describe("efficient-replacement and inflation", () => {
  it("efficient savings is EFFICIENT_SAVINGS_PCT of annual cost", () => {
    const r = calculateApplianceCost(base, rate);
    expect(r.efficientSavings).toBeCloseTo(r.annualCost * EFFICIENT_SAVINGS_PCT, 1);
  });

  it("inflated 10yr exceeds flat 10yr and matches the geometric series", () => {
    const r = calculateApplianceCost(base, rate);
    expect(r.inflatedCost10yr).toBeGreaterThan(r.tenYearCost);
    const factor = (Math.pow(1 + ELECTRICITY_INFLATION, 10) - 1) / ELECTRICITY_INFLATION;
    expect(r.inflatedCost10yr).toBeCloseTo(r.annualCost * factor, 0);
  });
});

describe("edge cases", () => {
  it("zero watts → all zero, never NaN", () => {
    const r = calculateApplianceCost({ ...base, watts: 0 }, rate);
    expect(r.annualCost).toBe(0);
    expect(r.asPercentHomeBill).toBe(0);
    expect(Number.isNaN(r.inflatedCost10yr)).toBe(false);
  });

  it("clamps hours above 24 and days above 7", () => {
    const clamped = calculateApplianceCost({ ...base, hoursPerDay: 30, daysPerWeek: 9 }, rate);
    const max = calculateApplianceCost({ ...base, hoursPerDay: 24, daysPerWeek: 7 }, rate);
    expect(clamped.annualCost).toBeCloseTo(max.annualCost, 2);
  });
});
