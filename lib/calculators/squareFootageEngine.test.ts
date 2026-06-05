import { describe, expect, it } from "vitest";
import { calculateSquareFootage, type SquareFootageInputs } from "./squareFootageEngine";

const BASE: SquareFootageInputs = {
  shape: "rectangle",
  dimA: 12,
  dimB: 10,
  unit: "ft",
  quantity: 1,
  wastePct: 10,
  pricePerSqFt: 4,
};

describe("calculateSquareFootage", () => {
  it("computes a rectangle area with waste and unit conversions", () => {
    const r = calculateSquareFootage(BASE);
    // 12 ft × 10 ft = 120 sq ft.
    expect(r.totalSqFt).toBeCloseTo(120, 1);
    // +10% waste = 132 sq ft, of which 12 is the allowance.
    expect(r.withWasteSqFt).toBeCloseTo(132, 1);
    expect(r.wasteSqFt).toBeCloseTo(12, 1);
    expect(r.totalSqYd).toBeCloseTo(120 / 9, 2);
    expect(r.totalSqM).toBeCloseTo(11.148, 2);
    // cost = 132 × $4.
    expect(r.materialCost).toBeCloseTo(528, 1);
  });

  it("handles each shape's area formula", () => {
    const square = calculateSquareFootage({ ...BASE, shape: "square", dimA: 10 });
    const circle = calculateSquareFootage({ ...BASE, shape: "circle", dimA: 10 });
    const triangle = calculateSquareFootage({ ...BASE, shape: "triangle", dimA: 12, dimB: 10 });
    expect(square.totalSqFt).toBeCloseTo(100, 1);
    expect(circle.totalSqFt).toBeCloseTo(Math.PI * 25, 1); // diameter 10 → r 5
    expect(triangle.totalSqFt).toBeCloseTo(60, 1);
  });

  it("converts inches to square feet", () => {
    // 144 in × 120 in = 12 ft × 10 ft = 120 sq ft.
    const r = calculateSquareFootage({ ...BASE, unit: "in", dimA: 144, dimB: 120 });
    expect(r.totalSqFt).toBeCloseTo(120, 1);
  });

  it("converts meters to square feet", () => {
    // 1 m × 1 m = 1 m² ≈ 10.7639 sq ft.
    const r = calculateSquareFootage({ ...BASE, shape: "square", unit: "m", dimA: 1 });
    expect(r.totalSqFt).toBeCloseTo(10.764, 2);
    expect(r.totalSqM).toBeCloseTo(1, 3);
  });

  it("multiplies the area by quantity", () => {
    const one = calculateSquareFootage(BASE);
    const two = calculateSquareFootage({ ...BASE, quantity: 2 });
    expect(two.totalSqFt).toBeCloseTo(one.totalSqFt * 2, 1);
  });

  it("only ever adds waste, and zero waste matches the base area", () => {
    const noWaste = calculateSquareFootage({ ...BASE, wastePct: 0 });
    const someWaste = calculateSquareFootage(BASE);
    expect(noWaste.withWasteSqFt).toBeCloseTo(noWaste.totalSqFt, 1);
    expect(someWaste.withWasteSqFt).toBeGreaterThan(someWaste.totalSqFt);
  });

  it("keeps cost and unit conversions consistent", () => {
    const r = calculateSquareFootage({ ...BASE, pricePerSqFt: 6.5 });
    expect(r.materialCost).toBeCloseTo(r.withWasteSqFt * 6.5, 1);
    // sq ft and sq yd describe the same area.
    expect(r.totalSqFt).toBeCloseTo(r.totalSqYd * 9, 1);
    const sum = r.breakdown.reduce((acc, b) => acc + b.amount, 0);
    expect(sum).toBeCloseTo(r.withWasteSqFt, 1);
  });

  it("guards NaN inputs from producing non-finite values", () => {
    const r = calculateSquareFootage({
      shape: "rectangle",
      dimA: Number.NaN,
      dimB: Number.NaN,
      unit: "ft",
      quantity: Number.NaN,
      wastePct: Number.NaN,
      pricePerSqFt: Number.NaN,
    });
    expect(Number.isFinite(r.totalSqFt)).toBe(true);
    expect(Number.isFinite(r.materialCost)).toBe(true);
    expect(r.totalSqFt).toBeGreaterThanOrEqual(0);
  });
});
