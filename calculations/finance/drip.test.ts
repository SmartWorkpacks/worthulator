import { describe, it, expect } from "vitest";
import { calculateDrip, type DripCalcInputs } from "./drip";

const DATA = { annualInflationPct: 3.2 };
const base: DripCalcInputs = { initial: 10000, monthlyAdd: 200, dividendYield: 4, priceGrowth: 5, years: 20 };

describe("calculateDrip", () => {
  it("produces a sensible final value for the default scenario", () => {
    const r = calculateDrip(base, DATA);
    expect(r.finalValue).toBeGreaterThan(100000);
    expect(r.finalValue).toBeLessThan(300000);
  });

  it("totalContributed = initial + monthlyAdd × months", () => {
    const r = calculateDrip(base, DATA);
    expect(r.totalContributed).toBe(10000 + 200 * 240);
  });

  it("totalGain = finalValue − totalContributed", () => {
    const r = calculateDrip(base, DATA);
    expect(r.totalGain).toBe(r.finalValue - r.totalContributed);
  });

  it("reinvesting beats taking dividends as cash (dripAdvantage > 0)", () => {
    const r = calculateDrip(base, DATA);
    expect(r.finalValue).toBeGreaterThan(r.noReinvestValue);
    expect(r.dripAdvantage).toBeGreaterThan(0);
  });

  it("no DRIP advantage when dividend yield is 0", () => {
    const r = calculateDrip({ ...base, dividendYield: 0 }, DATA);
    expect(r.dripAdvantage).toBeLessThanOrEqual(1);
    expect(r.reinvestedDividends).toBe(0);
  });

  it("higher dividend yield increases the DRIP advantage", () => {
    const lo = calculateDrip({ ...base, dividendYield: 2 }, DATA);
    const hi = calculateDrip({ ...base, dividendYield: 6 }, DATA);
    expect(hi.dripAdvantage).toBeGreaterThan(lo.dripAdvantage);
  });

  it("return multiple > 1 for a growing portfolio", () => {
    const r = calculateDrip(base, DATA);
    expect(r.returnMultiple).toBeGreaterThan(1);
  });

  it("annual dividend at end = final value × yield", () => {
    const r = calculateDrip(base, DATA);
    expect(r.annualDividendAtEnd).toBe(Math.round(r.finalValue * 0.04));
  });

  it("real value is below nominal under inflation", () => {
    const r = calculateDrip(base, DATA);
    expect(r.realValue).toBeLessThan(r.finalValue);
  });

  it("higher inflation lowers the real value", () => {
    const lo = calculateDrip(base, { annualInflationPct: 2 });
    const hi = calculateDrip(base, { annualInflationPct: 6 });
    expect(hi.realValue).toBeLessThan(lo.realValue);
  });

  it("more years → higher final value", () => {
    const a = calculateDrip({ ...base, years: 10 }, DATA);
    const b = calculateDrip({ ...base, years: 30 }, DATA);
    expect(b.finalValue).toBeGreaterThan(a.finalValue);
  });

  it("doubling time follows the rule of 72", () => {
    const r = calculateDrip(base, DATA);
    expect(r.doubleTimeYears).toBeCloseTo(72 / (4 + 5), 1);
  });

  it("reinvested dividends are positive and below total gain", () => {
    const r = calculateDrip(base, DATA);
    expect(r.reinvestedDividends).toBeGreaterThan(0);
    expect(r.reinvestedDividends).toBeLessThan(r.totalGain);
  });

  it("zero contributions still compounds the initial lump sum", () => {
    const r = calculateDrip({ ...base, monthlyAdd: 0 }, DATA);
    expect(r.totalContributed).toBe(10000);
    expect(r.finalValue).toBeGreaterThan(10000);
  });
});
