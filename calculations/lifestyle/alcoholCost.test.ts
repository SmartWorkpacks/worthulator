import { describe, it, expect } from "vitest";
import { calculateAlcoholCost, AlcoholCostInputs } from "./alcoholCost";

const base: AlcoholCostInputs = {
  drinksPerWeek:  10,
  costPerDrink:   8,
  reduceDrinksBy: 3,
};

describe("core alcohol cost math", () => {
  const r = calculateAlcoholCost(base);

  it("weeklySpend = drinks × cost", () => {
    expect(r.weeklySpend).toBe(80);
  });

  it("yearlyCost = weekly × 52", () => {
    expect(r.yearlyCost).toBe(4160);
  });

  it("monthlyCost = yearly / 12", () => {
    expect(r.monthlyCost).toBeCloseTo(4160 / 12, 2);
  });

  it("tenYearCost = yearly × 10", () => {
    expect(r.tenYearCost).toBe(41600);
  });

  it("dailyCost = yearly / 365", () => {
    expect(r.dailyCost).toBeCloseTo(4160 / 365, 1);
  });
});

describe("investment projection", () => {
  const r = calculateAlcoholCost(base);

  it("investedValue10yr > tenYearCost (compound growth)", () => {
    expect(r.investedValue10yr).toBeGreaterThan(r.tenYearCost);
  });

  it("investedValue20yr > investedValue10yr", () => {
    expect(r.investedValue20yr).toBeGreaterThan(r.investedValue10yr);
  });
});

describe("cut drinks savings", () => {
  const r = calculateAlcoholCost(base);

  it("cutYearlySaving = cut × cost × 52", () => {
    expect(r.cutYearlySaving).toBe(3 * 8 * 52); // 1248
  });

  it("reducedYearlyCost = yearly - cutSaving", () => {
    expect(r.reducedYearlyCost).toBe(r.yearlyCost - r.cutYearlySaving);
  });

  it("cutInvested10yr > cutYearlySaving × 10", () => {
    expect(r.cutInvested10yr).toBeGreaterThan(r.cutYearlySaving * 10);
  });

  it("zero cut → zero savings", () => {
    const r2 = calculateAlcoholCost({ ...base, reduceDrinksBy: 0 });
    expect(r2.cutYearlySaving).toBe(0);
    expect(r2.cutInvested10yr).toBe(0);
    expect(r2.reducedYearlyCost).toBe(r2.yearlyCost);
  });
});

describe("edge cases", () => {
  it("cut clamped to drinksPerWeek", () => {
    const r = calculateAlcoholCost({ drinksPerWeek: 5, costPerDrink: 10, reduceDrinksBy: 20 });
    expect(r.cutYearlySaving).toBe(r.yearlyCost);
    expect(r.reducedYearlyCost).toBe(0);
  });

  it("zero drinks → zero everything", () => {
    const r = calculateAlcoholCost({ drinksPerWeek: 0, costPerDrink: 8, reduceDrinksBy: 0 });
    expect(r.yearlyCost).toBe(0);
    expect(r.investedValue10yr).toBe(0);
  });

  it("never returns NaN or Infinity", () => {
    const r = calculateAlcoholCost({ drinksPerWeek: 0, costPerDrink: 0, reduceDrinksBy: 0 });
    expect(Object.values(r).every(v => Number.isFinite(v))).toBe(true);
  });
});
