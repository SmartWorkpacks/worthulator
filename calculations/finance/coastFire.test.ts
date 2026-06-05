import { describe, it, expect } from "vitest";
import { calculateCoastFire, type CoastFireInputs } from "./coastFire";

const DATA = { annualInflationPct: 3.2 };
const base: CoastFireInputs = { current: 100000, target: 1500000, rate: 7, years: 25 };

describe("calculateCoastFire", () => {
  it("real rate is below the nominal rate under inflation", () => {
    const r = calculateCoastFire(base, DATA);
    expect(r.realRatePct).toBeLessThan(7);
    expect(r.realRatePct).toBeGreaterThan(0);
  });

  it("real coast number exceeds the naive nominal figure", () => {
    const r = calculateCoastFire(base, DATA);
    expect(r.requiredNow).toBeGreaterThan(r.requiredNowNominal);
    expect(r.inflationPenalty).toBe(r.requiredNow - r.requiredNowNominal);
  });

  it("with zero inflation, real and nominal coast numbers match", () => {
    const r = calculateCoastFire(base, { annualInflationPct: 0 });
    expect(r.requiredNow).toBe(r.requiredNowNominal);
    expect(r.inflationPenalty).toBe(0);
    expect(r.realRatePct).toBeCloseTo(7, 1);
  });

  it("coast number discounts the target back to today", () => {
    const r = calculateCoastFire(base, DATA);
    expect(r.requiredNow).toBeLessThan(base.target);
    expect(r.requiredNow).toBeGreaterThan(0);
  });

  it("coast ratio = current / requiredNow", () => {
    const r = calculateCoastFire(base, DATA);
    expect(r.coastRatio).toBeCloseTo(base.current / r.requiredNow, 2);
  });

  it("shortfall and surplus are mutually exclusive", () => {
    const r = calculateCoastFire(base, DATA);
    expect(Math.min(r.coastShortfall, r.coastSurplus)).toBe(0);
  });

  it("flags already-coasting when current exceeds the coast number", () => {
    const r = calculateCoastFire({ ...base, current: 700000 }, DATA);
    expect(r.alreadyCoasting).toBe(1);
    expect(r.coastSurplus).toBeGreaterThan(0);
    expect(r.coastShortfall).toBe(0);
  });

  it("flags not-coasting with a shortfall when below", () => {
    const r = calculateCoastFire({ ...base, current: 50000 }, DATA);
    expect(r.alreadyCoasting).toBe(0);
    expect(r.coastShortfall).toBeGreaterThan(0);
    expect(r.coastSurplus).toBe(0);
  });

  it("more years lowers the coast number (more time to grow)", () => {
    const short = calculateCoastFire({ ...base, years: 10 }, DATA);
    const long  = calculateCoastFire({ ...base, years: 35 }, DATA);
    expect(long.requiredNow).toBeLessThan(short.requiredNow);
  });

  it("higher return lowers the coast number", () => {
    const lo = calculateCoastFire({ ...base, rate: 5 }, DATA);
    const hi = calculateCoastFire({ ...base, rate: 10 }, DATA);
    expect(hi.requiredNow).toBeLessThan(lo.requiredNow);
  });

  it("higher inflation raises the coast number", () => {
    const lo = calculateCoastFire(base, { annualInflationPct: 2 });
    const hi = calculateCoastFire(base, { annualInflationPct: 5 });
    expect(hi.requiredNow).toBeGreaterThan(lo.requiredNow);
  });

  it("coast value projects current forward in today's dollars", () => {
    const r = calculateCoastFire(base, DATA);
    expect(r.coastValue).toBeGreaterThan(base.current);
  });

  it("when exactly at the coast number, projected value ≈ target", () => {
    const r = calculateCoastFire(base, DATA);
    const atCoast = calculateCoastFire({ ...base, current: r.requiredNow }, DATA);
    expect(Math.abs(atCoast.coastValue - base.target)).toBeLessThan(base.target * 0.01);
  });
});
