import { describe, it, expect } from "vitest";
import {
  calculateLaundryCost,
  WATER_COST_PER_LOAD,
  LAUNDROMAT_COST_PER_LOAD,
  MACHINE_PROFILES,
  WATER_TEMP_MULTIPLIERS,
  LaundryCostInputs,
  LaundryCostData,
} from "./laundryCost";

const base: LaundryCostInputs = {
  loadsPerWeek:  5,
  machineType:   "standard",
  waterTemp:     "warm",
  detergentCost: 0.25,
};

const data: LaundryCostData = { electricRate: 0.16 };

describe("core economics", () => {
  const r = calculateLaundryCost(base, data);

  it("costPerLoad = electricity + water + detergent", () => {
    expect(r.costPerLoad).toBeCloseTo(
      r.electricityCostPerLoad + WATER_COST_PER_LOAD + base.detergentCost,
      2,
    );
  });

  it("weeklyCost = costPerLoad × loads", () => {
    expect(r.weeklyCost).toBeCloseTo(r.costPerLoad * base.loadsPerWeek, 2);
  });

  it("annualCost = weeklyCost × 52", () => {
    expect(r.annualCost).toBeCloseTo(r.weeklyCost * 52, 1);
  });

  it("electricityPct is between 0 and 100", () => {
    expect(r.electricityPct).toBeGreaterThanOrEqual(0);
    expect(r.electricityPct).toBeLessThanOrEqual(100);
  });

  it("totalKwhPerLoad = adjusted washer + dryer", () => {
    const expected =
      MACHINE_PROFILES.standard.washerKwh * WATER_TEMP_MULTIPLIERS.warm +
      MACHINE_PROFILES.standard.dryerKwh;
    expect(r.totalKwhPerLoad).toBeCloseTo(expected, 1);
  });

  it("echoes electricRate", () => {
    expect(r.electricRate).toBe(0.16);
  });
});

describe("water temperature effect", () => {
  it("cold water reduces total kWh vs warm", () => {
    const warm = calculateLaundryCost(base, data);
    const cold = calculateLaundryCost({ ...base, waterTemp: "cold" }, data);
    expect(cold.totalKwhPerLoad).toBeLessThan(warm.totalKwhPerLoad);
    expect(cold.annualCost).toBeLessThan(warm.annualCost);
  });

  it("hot water increases total kWh vs warm", () => {
    const warm = calculateLaundryCost(base, data);
    const hot  = calculateLaundryCost({ ...base, waterTemp: "hot" }, data);
    expect(hot.totalKwhPerLoad).toBeGreaterThan(warm.totalKwhPerLoad);
    expect(hot.annualCost).toBeGreaterThan(warm.annualCost);
  });

  it("cold water only affects washer kWh, not dryer", () => {
    const warm = calculateLaundryCost(base, data);
    const cold = calculateLaundryCost({ ...base, waterTemp: "cold" }, data);
    expect(cold.dryerKwh).toBe(warm.dryerKwh);
    expect(cold.washerKwhAdj).toBeLessThan(warm.washerKwhAdj);
  });
});

describe("machine type effect", () => {
  it("HE front-loader uses less kWh than standard", () => {
    const std = calculateLaundryCost(base, data);
    const he  = calculateLaundryCost({ ...base, machineType: "he_front" }, data);
    expect(he.totalKwhPerLoad).toBeLessThan(std.totalKwhPerLoad);
    expect(he.annualCost).toBeLessThan(std.annualCost);
  });

  it("older machine uses more kWh than standard", () => {
    const std   = calculateLaundryCost(base, data);
    const older = calculateLaundryCost({ ...base, machineType: "older" }, data);
    expect(older.totalKwhPerLoad).toBeGreaterThan(std.totalKwhPerLoad);
    expect(older.annualCost).toBeGreaterThan(std.annualCost);
  });
});

describe("comparison scenarios", () => {
  it("heFrontColdAnnual is less than annualCost for standard/warm", () => {
    const r = calculateLaundryCost(base, data);
    expect(r.heFrontColdAnnual).toBeLessThan(r.annualCost);
  });

  it("laundromatAnnual uses the constant per-load rate", () => {
    const r = calculateLaundryCost(base, data);
    expect(r.laundromatAnnual).toBeCloseTo(
      LAUNDROMAT_COST_PER_LOAD * base.loadsPerWeek * 52,
      2,
    );
  });
});

describe("edge cases", () => {
  it("zero loads yields zero cost", () => {
    const r = calculateLaundryCost({ ...base, loadsPerWeek: 0 }, data);
    expect(r.annualCost).toBe(0);
    expect(r.weeklyCost).toBe(0);
    expect(r.annualKwh).toBe(0);
  });

  it("zero electricity rate makes electricity cost zero", () => {
    const r = calculateLaundryCost(base, { electricRate: 0 });
    expect(r.electricityCostPerLoad).toBe(0);
    expect(r.electricityPct).toBe(0);
    expect(r.costPerLoad).toBeCloseTo(WATER_COST_PER_LOAD + base.detergentCost, 2);
  });

  it("never returns NaN or Infinity", () => {
    const r = calculateLaundryCost(
      { loadsPerWeek: 0, machineType: "standard", waterTemp: "warm", detergentCost: 0 },
      { electricRate: 0 },
    );
    expect(Object.values(r).every((v) => Number.isFinite(v))).toBe(true);
  });
});
