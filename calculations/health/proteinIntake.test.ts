import { describe, it, expect } from "vitest";
import { calculateProtein, ProteinInputs, LB_PER_KG } from "./proteinIntake";

const base: ProteinInputs = {
  weight: 70,
  weightIsKg: 1,
  multiplier: 1.6,
  mealsPerDay: 4,
};

describe("core protein math", () => {
  const r = calculateProtein(base);

  it("grams = weightKg × multiplier", () => {
    expect(r.proteinGrams).toBe(112); // 70 × 1.6
  });

  it("calories = grams × 4", () => {
    expect(r.caloriesFromProtein).toBe(112 * 4);
  });

  it("perMeal = grams ÷ meals", () => {
    expect(r.perMealGrams).toBe(28); // 112 / 4
  });

  it("rdaMultiple = multiplier ÷ 0.8", () => {
    expect(r.rdaMultiple).toBe(2); // 1.6 / 0.8
  });
});

describe("unit conversion", () => {
  it("converts pounds to kilograms", () => {
    const r = calculateProtein({ weight: 154, weightIsKg: 0, multiplier: 1.6, mealsPerDay: 4 });
    expect(r.weightKg).toBeCloseTo(154 / LB_PER_KG, 1); // ≈ 69.9
    expect(r.proteinGrams).toBe(Math.round((154 / LB_PER_KG) * 1.6));
  });

  it("kg and equivalent lb give the same grams", () => {
    const kg = calculateProtein({ weight: 70, weightIsKg: 1, multiplier: 1.6, mealsPerDay: 4 });
    const lb = calculateProtein({ weight: 70 * LB_PER_KG, weightIsKg: 0, multiplier: 1.6, mealsPerDay: 4 });
    expect(lb.proteinGrams).toBe(kg.proteinGrams);
  });
});

describe("muscle-building range", () => {
  it("rangeLow/High bracket the 1.6–2.2 g/kg band", () => {
    const r = calculateProtein(base);
    expect(r.rangeLow).toBe(Math.round(70 * 1.6));
    expect(r.rangeHigh).toBe(Math.round(70 * 2.2));
    expect(r.rangeHigh).toBeGreaterThan(r.rangeLow);
  });
});

describe("monotonicity", () => {
  it("higher multiplier ⇒ more protein", () => {
    const lo = calculateProtein({ ...base, multiplier: 0.8 });
    const hi = calculateProtein({ ...base, multiplier: 2.2 });
    expect(hi.proteinGrams).toBeGreaterThan(lo.proteinGrams);
  });

  it("more meals ⇒ less per meal", () => {
    const few  = calculateProtein({ ...base, mealsPerDay: 3 });
    const many = calculateProtein({ ...base, mealsPerDay: 6 });
    expect(many.perMealGrams).toBeLessThan(few.perMealGrams);
  });
});

describe("edge cases", () => {
  it("guards mealsPerDay ≥ 1", () => {
    const r = calculateProtein({ ...base, mealsPerDay: 0 });
    expect(Number.isFinite(r.perMealGrams)).toBe(true);
    expect(r.perMealGrams).toBe(r.proteinGrams);
  });

  it("zero weight → zero protein", () => {
    const r = calculateProtein({ ...base, weight: 0 });
    expect(r.proteinGrams).toBe(0);
  });

  it("never returns NaN or Infinity", () => {
    const r = calculateProtein({ weight: 0, weightIsKg: 1, multiplier: 0, mealsPerDay: 0 });
    expect(Object.values(r).every((v) => Number.isFinite(v))).toBe(true);
  });
});
