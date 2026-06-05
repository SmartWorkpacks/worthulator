import { describe, it, expect } from "vitest";
import {
  calculateGroceryUnitPrice,
  GroceryUnitPriceInputs,
} from "./groceryUnitPrice";

const base: GroceryUnitPriceInputs = {
  item1Price: 3.50,
  item1Size:  16,
  item2Price: 8.00,
  item2Size:  48,
  purchasesPerYear: 24,
};

describe("core comparison", () => {
  const r = calculateGroceryUnitPrice(base);

  it("computes unit prices correctly", () => {
    expect(r.unitPriceA).toBeCloseTo(3.50 / 16, 3);
    expect(r.unitPriceB).toBeCloseTo(8.00 / 48, 3);
  });

  it("identifies the cheaper item as the winner", () => {
    expect(r.unitPriceB).toBeLessThan(r.unitPriceA);
    expect(r.winner).toBe(2);
  });

  it("savingsPerUnit is the absolute difference", () => {
    expect(r.savingsPerUnit).toBeCloseTo(r.unitPriceA - r.unitPriceB, 3);
  });

  it("savingsPct is within 0-100", () => {
    expect(r.savingsPct).toBeGreaterThan(0);
    expect(r.savingsPct).toBeLessThan(100);
  });
});

describe("annual savings", () => {
  it("annualSavings uses the winner's size × purchases × savingsPerUnit", () => {
    const r = calculateGroceryUnitPrice(base);
    const expected = r.savingsPerUnit * base.item2Size * base.purchasesPerYear;
    expect(r.annualSavings).toBeCloseTo(expected, 0);
  });

  it("annualCostA = item1Price × purchasesPerYear", () => {
    const r = calculateGroceryUnitPrice(base);
    expect(r.annualCostA).toBeCloseTo(3.50 * 24, 2);
  });

  it("tenStapleSaving = annualSavings × 10", () => {
    const r = calculateGroceryUnitPrice(base);
    expect(r.tenStapleSaving).toBeCloseTo(r.annualSavings * 10, 1);
  });
});

describe("item A wins", () => {
  it("detects when smaller item is cheaper per unit", () => {
    const r = calculateGroceryUnitPrice({
      item1Price: 2.00,
      item1Size:  32,
      item2Price: 5.00,
      item2Size:  48,
      purchasesPerYear: 12,
    });
    expect(r.unitPriceA).toBeLessThan(r.unitPriceB);
    expect(r.winner).toBe(1);
  });
});

describe("tied prices", () => {
  it("reports winner=0 and zero savings when equal", () => {
    const r = calculateGroceryUnitPrice({
      item1Price: 4.00,
      item1Size:  16,
      item2Price: 8.00,
      item2Size:  32,
      purchasesPerYear: 10,
    });
    expect(r.unitPriceA).toBeCloseTo(r.unitPriceB, 3);
    expect(r.winner).toBe(0);
    expect(r.savingsPerUnit).toBe(0);
    expect(r.annualSavings).toBe(0);
  });
});

describe("edge cases", () => {
  it("zero purchases yields zero annual savings", () => {
    const r = calculateGroceryUnitPrice({ ...base, purchasesPerYear: 0 });
    expect(r.annualSavings).toBe(0);
    expect(r.annualCostA).toBe(0);
  });

  it("never returns NaN or Infinity", () => {
    const r = calculateGroceryUnitPrice({
      item1Price: 0, item1Size: 0, item2Price: 0, item2Size: 0, purchasesPerYear: 0,
    });
    expect(Object.values(r).every((v) => Number.isFinite(v))).toBe(true);
  });
});
