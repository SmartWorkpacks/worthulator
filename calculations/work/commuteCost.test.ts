import { describe, it, expect } from "vitest";
import {
  calculateCommuteCost,
  WEAR_COST_PER_MILE,
  GAS_INFLATION,
  NATIONAL_AVG_MPG,
} from "./commuteCost";

// ─── Base case: 15 miles one-way, 28 MPG, 5 days/wk, 49 weeks, $3.85/gal ───
const base   = { milesOneWay: 15, mpg: 28, officeDaysPerWeek: 5, weeksPerYear: 49 };
const data   = { gasPrice: 3.85 };

describe("calculateCommuteCost — core economics", () => {
  it("computes a known base case correctly", () => {
    const r = calculateCommuteCost(base, data);
    // Round trip = 30 mi; 30/28 * 3.85 = 4.125/day → round2 = 4.13
    expect(r.costPerDay).toBeCloseTo(4.13, 2);
    // effectiveDays = 5 * 49 = 245
    expect(r.effectiveDaysPerYear).toBe(245);
    // annualFuel = 4.13 * 245 = 1011.85
    expect(r.annualFuelCost).toBeCloseTo(4.13 * 245, 0);
    // monthly = annual / 12
    expect(r.monthlyCost).toBeCloseTo(r.annualFuelCost / 12, 1);
    expect(r.gasPrice).toBe(3.85);
  });

  it("annualMiles = milesOneWay * 2 * effectiveDays", () => {
    const r = calculateCommuteCost(base, data);
    expect(r.annualMiles).toBe(30 * 245);
  });

  it("wearCostPerYear = annualMiles * WEAR_COST_PER_MILE", () => {
    const r = calculateCommuteCost(base, data);
    expect(r.wearCostPerYear).toBeCloseTo(r.annualMiles * WEAR_COST_PER_MILE, 1);
  });

  it("totalCostPerYear = annualFuelCost + wearCostPerYear", () => {
    const r = calculateCommuteCost(base, data);
    expect(r.totalCostPerYear).toBeCloseTo(r.annualFuelCost + r.wearCostPerYear, 1);
  });
});

describe("linear scaling", () => {
  it("doubling milesOneWay doubles annualFuelCost and annualMiles", () => {
    const a = calculateCommuteCost(base, data);
    const b = calculateCommuteCost({ ...base, milesOneWay: 30 }, data);
    // costPerDay is rounded to cents before ×days, so doubling amplifies that
    // sub-cent rounding by ~effectiveDays. Allow a little over ±1¢ per commute day.
    const tol = a.effectiveDaysPerYear * 0.02;
    expect(Math.abs(b.annualFuelCost - a.annualFuelCost * 2)).toBeLessThanOrEqual(tol);
    expect(b.annualMiles).toBe(a.annualMiles * 2);
  });

  it("doubling MPG halves annualFuelCost", () => {
    const a = calculateCommuteCost(base, data);
    const b = calculateCommuteCost({ ...base, mpg: 56 }, data);
    const tol = a.effectiveDaysPerYear * 0.02;
    expect(Math.abs(b.annualFuelCost - a.annualFuelCost / 2)).toBeLessThanOrEqual(tol);
  });

  it("officeDaysPerWeek scales annualFuelCost linearly", () => {
    const five = calculateCommuteCost(base, data);
    const two  = calculateCommuteCost({ ...base, officeDaysPerWeek: 2 }, data);
    expect(two.annualFuelCost).toBeCloseTo(five.annualFuelCost * (2 / 5), 0);
  });
});

describe("WFH saving vs 5 days × 52 weeks", () => {
  it("fiveDay52 is always >= annualFuelCost", () => {
    const r = calculateCommuteCost(base, data);
    expect(r.fiveDay52AnnualFuelCost).toBeGreaterThanOrEqual(r.annualFuelCost);
  });

  it("wfhSavingVs5Days is positive when officeDaysPerWeek < 5 or weeksPerYear < 52", () => {
    const r = calculateCommuteCost({ ...base, officeDaysPerWeek: 3 }, data);
    expect(r.wfhSavingVs5Days).toBeGreaterThan(0);
  });

  it("fiveDay52 - annualFuelCost = wfhSavingVs5Days", () => {
    const r = calculateCommuteCost({ ...base, officeDaysPerWeek: 3 }, data);
    expect(r.wfhSavingVs5Days).toBeCloseTo(r.fiveDay52AnnualFuelCost - r.annualFuelCost, 1);
  });
});

describe("10-year inflation projection", () => {
  it("tenYearInflatedCost > annualFuelCost * 10", () => {
    const r = calculateCommuteCost(base, data);
    expect(r.tenYearInflatedCost).toBeGreaterThan(r.annualFuelCost * 10);
  });

  it("matches the geometric series sum", () => {
    const r = calculateCommuteCost(base, data);
    const expected =
      r.annualFuelCost * ((Math.pow(1 + GAS_INFLATION, 10) - 1) / GAS_INFLATION);
    expect(r.tenYearInflatedCost).toBeCloseTo(expected, 0);
  });
});

describe("edge cases", () => {
  it("zero miles → all zero, never NaN", () => {
    const r = calculateCommuteCost({ ...base, milesOneWay: 0 }, data);
    expect(r.annualFuelCost).toBe(0);
    expect(r.wearCostPerYear).toBe(0);
    expect(Number.isNaN(r.tenYearInflatedCost)).toBe(false);
  });

  it("zero gas price → zero fuel costs, wear still zero", () => {
    const r = calculateCommuteCost(base, { gasPrice: 0 });
    expect(r.annualFuelCost).toBe(0);
    expect(r.costPerDay).toBe(0);
  });

  it("clamps officeDaysPerWeek above 5", () => {
    const clamped = calculateCommuteCost({ ...base, officeDaysPerWeek: 9 }, data);
    const five    = calculateCommuteCost({ ...base, officeDaysPerWeek: 5 }, data);
    expect(clamped.annualFuelCost).toBeCloseTo(five.annualFuelCost, 1);
  });
});
