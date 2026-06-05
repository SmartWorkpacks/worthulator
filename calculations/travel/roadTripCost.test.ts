import { describe, it, expect } from "vitest";
import {
  calculateRoadTripCost,
  EPA_HWY_BONUS,
  EPA_CITY_PENALTY,
  RoadTripInputs,
  RoadTripData,
} from "./roadTripCost";

const base: RoadTripInputs = {
  distanceMiles: 300,
  mpg: 28,
  highwayPct: 85,
  tolls: 0,
  passengers: 1,
};

const data: RoadTripData = { gasPrice: 3.85 };

describe("core economics", () => {
  const r = calculateRoadTripCost(base, data);

  it("computes effective MPG from highway/city blend", () => {
    const expected = 28 * (0.85 * (1 + EPA_HWY_BONUS) + 0.15 * (1 - EPA_CITY_PENALTY));
    expect(r.effectiveMpg).toBeCloseTo(expected, 0);
    expect(r.effectiveMpg).toBeGreaterThan(28);
  });

  it("computes gallons from distance and effective MPG", () => {
    expect(r.gallonsOneWay).toBeCloseTo(300 / r.effectiveMpg, 0);
    expect(r.gallonsRoundTrip).toBeCloseTo(r.gallonsOneWay * 2, 0);
  });

  it("roundTripFuelCost equals 2× oneWayFuelCost within rounding", () => {
    expect(Math.abs(r.roundTripFuelCost - r.oneWayFuelCost * 2)).toBeLessThanOrEqual(0.02);
  });

  it("totalTripCost equals roundTripFuelCost when tolls are 0", () => {
    expect(r.totalTripCost).toBe(r.roundTripFuelCost);
  });

  it("costPerPerson equals totalTripCost when passengers is 1", () => {
    expect(r.costPerPerson).toBe(r.totalTripCost);
  });

  it("echoes gasPrice", () => {
    expect(r.gasPrice).toBe(3.85);
  });
});

describe("tolls and passengers", () => {
  it("totalTripCost = fuel + tolls", () => {
    const r = calculateRoadTripCost({ ...base, tolls: 40 }, data);
    expect(r.totalTripCost).toBeCloseTo(r.roundTripFuelCost + 40, 2);
  });

  it("costPerPerson splits evenly among passengers", () => {
    const r = calculateRoadTripCost({ ...base, tolls: 20, passengers: 4 }, data);
    expect(r.costPerPerson).toBeCloseTo(r.totalTripCost / 4, 2);
  });
});

describe("linear scaling", () => {
  it("doubling distance doubles fuel cost within rounding tolerance", () => {
    const a = calculateRoadTripCost(base, data);
    const b = calculateRoadTripCost({ ...base, distanceMiles: 600 }, data);
    // gallonsOneWay is round1'd, so doubling amplifies that ±0.05 × price
    expect(Math.abs(b.roundTripFuelCost - a.roundTripFuelCost * 2)).toBeLessThanOrEqual(1.0);
  });

  it("doubling gas price doubles fuel cost within rounding tolerance", () => {
    const a = calculateRoadTripCost(base, data);
    const b = calculateRoadTripCost(base, { gasPrice: 7.70 });
    expect(Math.abs(b.roundTripFuelCost - a.roundTripFuelCost * 2)).toBeLessThanOrEqual(1.0);
  });
});

describe("highway/city blending", () => {
  it("100% highway yields higher effective MPG than 50% highway", () => {
    const hwy = calculateRoadTripCost({ ...base, highwayPct: 100 }, data);
    const mix = calculateRoadTripCost({ ...base, highwayPct: 50 }, data);
    expect(hwy.effectiveMpg).toBeGreaterThan(mix.effectiveMpg);
  });

  it("all-highway cost is less than all-city cost", () => {
    const r = calculateRoadTripCost(base, data);
    expect(r.allHighwayCost).toBeLessThan(r.allCityCost);
  });

  it("100% highway: effectiveMpg equals mpg × (1 + bonus)", () => {
    const r = calculateRoadTripCost({ ...base, highwayPct: 100 }, data);
    expect(r.effectiveMpg).toBeCloseTo(28 * (1 + EPA_HWY_BONUS), 1);
  });
});

describe("edge cases", () => {
  it("zero distance yields zero cost", () => {
    const r = calculateRoadTripCost({ ...base, distanceMiles: 0 }, data);
    expect(r.roundTripFuelCost).toBe(0);
    expect(r.oneWayFuelCost).toBe(0);
    expect(r.gallonsOneWay).toBe(0);
    expect(r.costPerMile).toBe(0);
  });

  it("zero gas price yields zero fuel cost but tolls still count", () => {
    const r = calculateRoadTripCost({ ...base, tolls: 30 }, { gasPrice: 0 });
    expect(r.roundTripFuelCost).toBe(0);
    expect(r.totalTripCost).toBe(30);
    expect(r.costPerPerson).toBe(30);
  });

  it("never returns NaN or Infinity", () => {
    const r = calculateRoadTripCost(
      { distanceMiles: 0, mpg: 0, highwayPct: 0, tolls: 0, passengers: 0 },
      { gasPrice: 0 },
    );
    const vals = Object.values(r);
    expect(vals.every((v) => Number.isFinite(v))).toBe(true);
  });
});
