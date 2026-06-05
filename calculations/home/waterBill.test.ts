import { describe, it, expect } from "vitest";
import {
  calculateWaterBill,
  BASE_GPCD,
  WATER_ONLY_FRACTION,
  LEAK_WASTE_PCT,
  WATER_INFLATION,
} from "./waterBill";

const nationalData = {
  combinedRatePer1000Gal: 8.0,
  nationalRatePer1000Gal: 8.0,
};

const baseInputs = {
  householdSize:   3,
  usageLevel:      "average" as const,
  outdoorWatering: "none" as const,
  billingType:     "combined" as const,
};

describe("calculateWaterBill — core math", () => {
  it("computes gallons from EPA GPCD × household", () => {
    const r = calculateWaterBill(baseInputs, nationalData);
    expect(r.gallonsPerDay).toBe(3 * BASE_GPCD);
    expect(r.annualGallons).toBe(3 * BASE_GPCD * 365);
  });

  it("annual cost = (annualGallons / 1000) × rate", () => {
    const r = calculateWaterBill(baseInputs, nationalData);
    const expected = (r.annualGallons / 1000) * 8.0;
    expect(r.annualWaterCost).toBeCloseTo(expected, 2);
  });

  it("monthly = annual / 12 and daily = annual / 365", () => {
    const r = calculateWaterBill(baseInputs, nationalData);
    expect(r.monthlyCost).toBeCloseTo(r.annualWaterCost / 12, 2);
    expect(r.dailyCost).toBeCloseTo(r.annualWaterCost / 365, 2);
  });

  it("cost per person = annual / household size", () => {
    const r = calculateWaterBill(baseInputs, nationalData);
    expect(r.costPerPerson).toBeCloseTo(r.annualWaterCost / 3, 2);
  });
});

describe("usage and outdoor scaling", () => {
  it("high usage increases gallons and cost vs average", () => {
    const avg = calculateWaterBill(baseInputs, nationalData);
    const hi  = calculateWaterBill({ ...baseInputs, usageLevel: "high" }, nationalData);
    expect(hi.gallonsPerDay).toBeGreaterThan(avg.gallonsPerDay);
    expect(hi.annualWaterCost).toBeGreaterThan(avg.annualWaterCost);
  });

  it("heavy outdoor watering increases gallons linearly", () => {
    const none   = calculateWaterBill(baseInputs, nationalData);
    const heavy  = calculateWaterBill({ ...baseInputs, outdoorWatering: "heavy" }, nationalData);
    expect(heavy.gallonsPerDay / none.gallonsPerDay).toBeCloseTo(1.45, 2);
  });

  it("household size scales cost linearly", () => {
    const three = calculateWaterBill(baseInputs, nationalData);
    const six   = calculateWaterBill({ ...baseInputs, householdSize: 6 }, nationalData);
    expect(six.annualWaterCost / three.annualWaterCost).toBeCloseTo(2, 2);
  });
});

describe("billing type", () => {
  it("water_only applies WATER_ONLY_FRACTION to rate", () => {
    const combined = calculateWaterBill(baseInputs, nationalData);
    const water    = calculateWaterBill({ ...baseInputs, billingType: "water_only" }, nationalData);
    expect(water.effectiveRate).toBeCloseTo(8.0 * WATER_ONLY_FRACTION, 2);
    expect(water.annualWaterCost).toBeCloseTo(combined.annualWaterCost * WATER_ONLY_FRACTION, 2);
  });
});

describe("benchmarks and savings", () => {
  it("vsNationalPct is 0 at national rate", () => {
    const r = calculateWaterBill(baseInputs, nationalData);
    expect(r.vsNationalPct).toBe(0);
  });

  it("higher state rate yields positive vsNationalPct", () => {
    const r = calculateWaterBill(baseInputs, {
      combinedRatePer1000Gal: 12.0,
      nationalRatePer1000Gal: 8.0,
    });
    expect(r.vsNationalPct).toBeGreaterThan(0);
  });

  it("lowUsageSaving is positive when usage is above low", () => {
    const r = calculateWaterBill({ ...baseInputs, usageLevel: "high" }, nationalData);
    expect(r.lowUsageSaving).toBeGreaterThan(0);
  });

  it("leakFixSaving is 10% of annual cost", () => {
    const r = calculateWaterBill(baseInputs, nationalData);
    expect(r.leakFixSaving).toBeCloseTo(r.annualWaterCost * LEAK_WASTE_PCT, 2);
  });
});

describe("10-year projection", () => {
  it("inflatedCost10yr exceeds flat tenYearCost", () => {
    const r = calculateWaterBill(baseInputs, nationalData);
    expect(r.inflatedCost10yr).toBeGreaterThan(r.tenYearCost);
    let expected = 0;
    for (let y = 0; y < 10; y++) {
      expected += r.annualWaterCost * Math.pow(1 + WATER_INFLATION, y);
    }
    expect(r.inflatedCost10yr).toBeCloseTo(Math.round(expected * 100) / 100, 2);
  });
});

describe("edge cases", () => {
  it("zero household returns zero costs", () => {
    const r = calculateWaterBill({ ...baseInputs, householdSize: 0 }, nationalData);
    expect(r.gallonsPerDay).toBe(0);
    expect(r.annualWaterCost).toBe(0);
    expect(r.monthlyCost).toBe(0);
  });

  it("never returns NaN for bad inputs", () => {
    const r = calculateWaterBill(
      { householdSize: NaN, usageLevel: "average", outdoorWatering: "none", billingType: "combined" },
      { combinedRatePer1000Gal: NaN, nationalRatePer1000Gal: 8 },
    );
    expect(Number.isFinite(r.annualWaterCost)).toBe(true);
  });
});
