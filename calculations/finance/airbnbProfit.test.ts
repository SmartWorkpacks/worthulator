import { describe, it, expect } from "vitest";
import { calculateAirbnbProfit } from "./airbnbProfit";

describe("calculateAirbnbProfit", () => {
  const base = { nightlyRate: 150, occupancyPct: 70, platformFeePct: 15, monthlyExpenses: 800 };

  it("computes gross revenue as rate × 30 × occupancy", () => {
    const r = calculateAirbnbProfit(base);
    expect(r.monthlyRevenue).toBe(Math.round(150 * 30 * 0.7));
  });

  it("net profit subtracts the platform fee and expenses", () => {
    const r = calculateAirbnbProfit(base);
    const gross = 150 * 30 * 0.7;
    expect(r.monthlyProfit).toBe(Math.round(gross * 0.85 - 800));
  });

  it("annual profit is monthly net × 12", () => {
    const r = calculateAirbnbProfit(base);
    const gross = 150 * 30 * 0.7;
    expect(r.annualProfit).toBe(Math.round((gross * 0.85 - 800) * 12));
  });

  it("ten-year profit is roughly annual × 10", () => {
    const r = calculateAirbnbProfit(base);
    expect(Math.abs(r.tenYearProfit - r.annualProfit * 10)).toBeLessThanOrEqual(10);
  });

  it("break-even occupancy is expenses / (rate × 30 × feeMult)", () => {
    const r = calculateAirbnbProfit(base);
    expect(r.breakEvenOcc).toBeCloseTo((800 / (150 * 30 * 0.85)) * 100, 1);
  });

  it("higher occupancy increases profit", () => {
    const low = calculateAirbnbProfit({ ...base, occupancyPct: 40 });
    const high = calculateAirbnbProfit({ ...base, occupancyPct: 90 });
    expect(high.monthlyProfit).toBeGreaterThan(low.monthlyProfit);
  });

  it("higher platform fee reduces profit", () => {
    const low = calculateAirbnbProfit({ ...base, platformFeePct: 3 });
    const high = calculateAirbnbProfit({ ...base, platformFeePct: 18 });
    expect(high.monthlyProfit).toBeLessThan(low.monthlyProfit);
  });

  it("higher expenses reduce profit and raise break-even", () => {
    const low = calculateAirbnbProfit({ ...base, monthlyExpenses: 300 });
    const high = calculateAirbnbProfit({ ...base, monthlyExpenses: 2000 });
    expect(high.monthlyProfit).toBeLessThan(low.monthlyProfit);
    expect(high.breakEvenOcc).toBeGreaterThan(low.breakEvenOcc);
  });

  it("profit margin is between -inf and 100%", () => {
    const r = calculateAirbnbProfit(base);
    expect(r.profitMarginPct).toBeLessThanOrEqual(100);
  });

  it("revenue-to-expense ratio reflects coverage", () => {
    const r = calculateAirbnbProfit(base);
    expect(r.revenueToExpenseRatio).toBeCloseTo((150 * 30 * 0.7) / 800, 1);
  });

  it("can produce a loss when expenses exceed net revenue", () => {
    const r = calculateAirbnbProfit({ ...base, monthlyExpenses: 5000 });
    expect(r.monthlyProfit).toBeLessThan(0);
  });

  it("zero expenses yields a zero break-even and a finite ratio", () => {
    const r = calculateAirbnbProfit({ ...base, monthlyExpenses: 0 });
    expect(r.breakEvenOcc).toBeCloseTo(0, 5);
    expect(r.revenueToExpenseRatio).toBe(0);
  });
});
