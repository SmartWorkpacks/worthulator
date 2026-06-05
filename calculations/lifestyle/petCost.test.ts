import { describe, it, expect } from "vitest";
import { calculatePetCost } from "./petCost";

describe("calculatePetCost", () => {
  const base = { food: 800, vet: 600, insurance: 400, misc: 300, years: 12 };

  it("yearly cost sums all categories", () => {
    const r = calculatePetCost(base);
    expect(r.yearlyCost).toBe(800 + 600 + 400 + 300);
  });

  it("lifetime cost is yearly × years", () => {
    const r = calculatePetCost(base);
    expect(r.lifetimeCost).toBe(2100 * 12);
  });

  it("monthly cost is yearly / 12", () => {
    const r = calculatePetCost(base);
    expect(r.monthlyCost).toBe(Math.round(2100 / 12));
  });

  it("daily cost is yearly / 365", () => {
    const r = calculatePetCost(base);
    expect(r.dailyCost).toBeCloseTo(2100 / 365, 1);
  });

  it("invested alternative grows beyond the simple lifetime sum", () => {
    const r = calculatePetCost(base);
    expect(r.investedAlternative).toBeGreaterThan(r.lifetimeCost);
  });

  it("more spend in any category raises the yearly cost", () => {
    const low = calculatePetCost({ ...base, vet: 200 });
    const high = calculatePetCost({ ...base, vet: 2000 });
    expect(high.yearlyCost).toBeGreaterThan(low.yearlyCost);
  });

  it("longer lifespan raises the lifetime cost", () => {
    const short = calculatePetCost({ ...base, years: 5 });
    const long = calculatePetCost({ ...base, years: 18 });
    expect(long.lifetimeCost).toBeGreaterThan(short.lifetimeCost);
  });

  it("longer lifespan raises the invested alternative", () => {
    const short = calculatePetCost({ ...base, years: 5 });
    const long = calculatePetCost({ ...base, years: 18 });
    expect(long.investedAlternative).toBeGreaterThan(short.investedAlternative);
  });

  it("zero costs yield zero everywhere", () => {
    const r = calculatePetCost({ food: 0, vet: 0, insurance: 0, misc: 0, years: 10 });
    expect(r.yearlyCost).toBe(0);
    expect(r.lifetimeCost).toBe(0);
    expect(r.investedAlternative).toBe(0);
  });

  it("monthly × 12 approximates yearly", () => {
    const r = calculatePetCost(base);
    expect(Math.abs(r.monthlyCost * 12 - r.yearlyCost)).toBeLessThanOrEqual(12);
  });

  it("lifetime equals yearly × years exactly", () => {
    const r = calculatePetCost({ ...base, years: 1 });
    expect(r.lifetimeCost).toBe(r.yearlyCost);
  });

  it("scales food contribution linearly into yearly", () => {
    const a = calculatePetCost({ ...base, food: 0 });
    const b = calculatePetCost({ ...base, food: 1000 });
    expect(b.yearlyCost - a.yearlyCost).toBe(1000);
  });
});
