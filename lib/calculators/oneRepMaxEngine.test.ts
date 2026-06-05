import { describe, expect, it } from "vitest";
import { calculateOneRepMax, type OneRepMaxInputs } from "./oneRepMaxEngine";

const BASE: OneRepMaxInputs = {
  weight: 225,
  reps: 5,
  unit: "lb",
};

describe("calculateOneRepMax", () => {
  it("returns the lifted weight as the 1RM for a single rep", () => {
    const r = calculateOneRepMax({ ...BASE, reps: 1 });
    expect(r.oneRepMax).toBeCloseTo(225, 1);
    expect(r.spreadLow).toBeCloseTo(225, 1);
    expect(r.spreadHigh).toBeCloseTo(225, 1);
    // The 100% row of the training table equals the 1RM.
    expect(r.percentTable[0].pct).toBe(100);
    expect(r.percentTable[0].weight).toBeCloseTo(225, 1);
  });

  it("matches Epley/Brzycki at 10 reps (a known coincidence)", () => {
    // Both Epley and Brzycki give exactly 1.3333× the weight at 10 reps.
    const r = calculateOneRepMax({ weight: 100, reps: 10, unit: "lb" });
    const epley = r.formulaEstimates.find((f) => f.name === "Epley");
    const brzycki = r.formulaEstimates.find((f) => f.name === "Brzycki");
    expect(epley?.value).toBeCloseTo(133.3, 0);
    expect(brzycki?.value).toBeCloseTo(133.3, 0);
    // The averaged estimate sits within the formula spread.
    expect(r.oneRepMax).toBeGreaterThanOrEqual(r.spreadLow);
    expect(r.oneRepMax).toBeLessThanOrEqual(r.spreadHigh);
    expect(r.oneRepMax).toBeGreaterThan(125);
    expect(r.oneRepMax).toBeLessThan(140);
  });

  it("estimates a higher 1RM than the weight actually lifted for multi-rep sets", () => {
    const r = calculateOneRepMax(BASE);
    expect(r.oneRepMax).toBeGreaterThan(BASE.weight);
  });

  it("increases the 1RM with more reps and with more weight", () => {
    const base = calculateOneRepMax(BASE);
    const moreReps = calculateOneRepMax({ ...BASE, reps: 8 });
    const moreWeight = calculateOneRepMax({ ...BASE, weight: 275 });
    expect(moreReps.oneRepMax).toBeGreaterThan(base.oneRepMax);
    expect(moreWeight.oneRepMax).toBeGreaterThan(base.oneRepMax);
  });

  it("builds a descending training table and an ascending rep count", () => {
    const r = calculateOneRepMax(BASE);
    for (let i = 1; i < r.percentTable.length; i++) {
      expect(r.percentTable[i].weight).toBeLessThanOrEqual(r.percentTable[i - 1].weight);
      expect(r.percentTable[i].reps).toBeGreaterThanOrEqual(r.percentTable[i - 1].reps);
    }
    // Rep-max loads fall as the target rep count rises.
    for (let i = 1; i < r.repMaxes.length; i++) {
      expect(r.repMaxes[i].weight).toBeLessThanOrEqual(r.repMaxes[i - 1].weight);
    }
  });

  it("keeps the averaged estimate within the six-formula spread", () => {
    const r = calculateOneRepMax({ weight: 185, reps: 6, unit: "kg" });
    expect(r.formulaEstimates).toHaveLength(6);
    expect(r.spreadLow).toBeLessThanOrEqual(r.oneRepMax);
    expect(r.oneRepMax).toBeLessThanOrEqual(r.spreadHigh);
    expect(r.unit).toBe("kg");
  });

  it("guards NaN inputs from producing non-finite values", () => {
    const r = calculateOneRepMax({ weight: Number.NaN, reps: Number.NaN, unit: "lb" });
    expect(Number.isFinite(r.oneRepMax)).toBe(true);
    expect(r.oneRepMax).toBeGreaterThanOrEqual(0);
    expect(r.percentTable.every((p) => Number.isFinite(p.weight))).toBe(true);
  });
});
