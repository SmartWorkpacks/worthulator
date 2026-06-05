import { describe, it, expect } from "vitest";
import { calculateSolarRoi } from "./solarRoi";

describe("calculateSolarRoi", () => {
  const base = { systemCost: 20000, monthlyBill: 150, solarOffset: 85, utilityInflation: 3 };

  it("year-1 savings is bill × 12 × offset", () => {
    const r = calculateSolarRoi(base);
    expect(r.year1Savings).toBe(Math.round(150 * 12 * 0.85));
  });

  it("payback months is cost / monthly year-1 saving", () => {
    const r = calculateSolarRoi(base);
    const y1 = 150 * 12 * 0.85;
    expect(r.paybackMonths).toBe(Math.round(20000 / (y1 / 12)));
  });

  it("25-year savings exceeds undiscounted year-1 × 25 due to inflation", () => {
    const r = calculateSolarRoi(base);
    expect(r.savings25yr).toBeGreaterThan(r.year1Savings * 25);
  });

  it("zero inflation gives exactly year-1 × 25", () => {
    const r = calculateSolarRoi({ ...base, utilityInflation: 0 });
    expect(r.savings25yr).toBe(r.year1Savings * 25);
  });

  it("higher bill shortens payback", () => {
    const low = calculateSolarRoi({ ...base, monthlyBill: 80 });
    const high = calculateSolarRoi({ ...base, monthlyBill: 300 });
    expect(high.paybackMonths).toBeLessThan(low.paybackMonths);
  });

  it("higher system cost lengthens payback", () => {
    const cheap = calculateSolarRoi({ ...base, systemCost: 8000 });
    const dear = calculateSolarRoi({ ...base, systemCost: 40000 });
    expect(dear.paybackMonths).toBeGreaterThan(cheap.paybackMonths);
  });

  it("higher offset increases savings", () => {
    const low = calculateSolarRoi({ ...base, solarOffset: 60 });
    const high = calculateSolarRoi({ ...base, solarOffset: 100 });
    expect(high.savings25yr).toBeGreaterThan(low.savings25yr);
  });

  it("higher utility inflation increases lifetime savings", () => {
    const low = calculateSolarRoi({ ...base, utilityInflation: 1 });
    const high = calculateSolarRoi({ ...base, utilityInflation: 6 });
    expect(high.savings25yr).toBeGreaterThan(low.savings25yr);
  });

  it("payback years matches months / 12", () => {
    const r = calculateSolarRoi(base);
    expect(r.paybackYears).toBeCloseTo(r.paybackMonths / 12, 1);
  });

  it("roi multiple is 25-year savings / system cost", () => {
    const r = calculateSolarRoi(base);
    expect(r.roiMultiple).toBeCloseTo(r.savings25yr / 20000, 1);
  });

  it("a healthy system returns more than its cost over its lifetime", () => {
    const r = calculateSolarRoi(base);
    expect(r.roiMultiple).toBeGreaterThan(1);
  });

  it("zero bill produces no savings and no payback", () => {
    const r = calculateSolarRoi({ ...base, monthlyBill: 0 });
    expect(r.year1Savings).toBe(0);
    expect(r.paybackMonths).toBe(0);
  });
});
