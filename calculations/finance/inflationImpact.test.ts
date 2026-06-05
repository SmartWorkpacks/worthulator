import { describe, it, expect } from "vitest";
import { calculateInflationImpact } from "./inflationImpact";

const base = {
  inputs: { amount: 10000, rate: 3.2, years: 20 },
  data: { currentCpiRate: 3.2 },
};

describe("calculateInflationImpact", () => {
  // ── Known values ────────────────────────────────────────────────────────

  it("default: $10k at 3.2% over 20yr buys ~$5,326", () => {
    const r = calculateInflationImpact(base.inputs, base.data);
    expect(r.futureValue).toBe(5326);
    expect(r.loss).toBe(4674);
    expect(r.lossPercent).toBeCloseTo(46.7, 1);
  });

  it("requiredFuture mirrors futureValue: $10k needs ~$18,776 later", () => {
    const r = calculateInflationImpact(base.inputs, base.data);
    expect(r.requiredFuture).toBe(18776);
  });

  it("erosionMultiple = (1+r)^years", () => {
    const r = calculateInflationImpact(base.inputs, base.data);
    expect(r.erosionMultiple).toBeCloseTo(Math.pow(1.032, 20), 1);
  });

  it("futureValue × erosionMultiple ≈ amount (within rounding)", () => {
    const r = calculateInflationImpact(base.inputs, base.data);
    expect(r.futureValue * r.erosionMultiple).toBeCloseTo(10000, -2);
  });

  // ── Halving ────────────────────────────────────────────────────────────

  it("yearsToHalve uses exact log, ~22yr at 3.2%", () => {
    const r = calculateInflationImpact(base.inputs, base.data);
    expect(r.yearsToHalve).toBeCloseTo(Math.log(2) / Math.log(1.032), 0);
    expect(r.yearsToHalve).toBeGreaterThan(21);
    expect(r.yearsToHalve).toBeLessThan(23);
  });

  it("higher rate → faster halving", () => {
    const low = calculateInflationImpact({ ...base.inputs, rate: 2 }, base.data);
    const high = calculateInflationImpact({ ...base.inputs, rate: 8 }, base.data);
    expect(high.yearsToHalve).toBeLessThan(low.yearsToHalve);
  });

  // ── First-year erosion ────────────────────────────────────────────────────

  it("firstYearLoss = amount − amount/(1+r)", () => {
    const r = calculateInflationImpact(base.inputs, base.data);
    expect(r.firstYearLoss).toBe(Math.round(10000 - 10000 / 1.032));
  });

  it("dailyLossFirstYear = firstYearLoss / 365", () => {
    const r = calculateInflationImpact(base.inputs, base.data);
    expect(r.dailyLossFirstYear).toBeCloseTo(r.firstYearLoss / 365, 1);
  });

  // ── Benchmark vs live CPI ──────────────────────────────────────────────────

  it("vsCurrentCpi = assumed rate − current CPI", () => {
    const r = calculateInflationImpact({ ...base.inputs, rate: 6 }, { currentCpiRate: 3.2 });
    expect(r.vsCurrentCpi).toBeCloseTo(2.8, 1);
  });

  it("vsCurrentCpi negative when assumed below current CPI", () => {
    const r = calculateInflationImpact({ ...base.inputs, rate: 2 }, { currentCpiRate: 3.2 });
    expect(r.vsCurrentCpi).toBeLessThan(0);
  });

  // ── Monotonicity ──────────────────────────────────────────────────────────

  it("higher rate → more loss", () => {
    const low = calculateInflationImpact({ ...base.inputs, rate: 2 }, base.data);
    const high = calculateInflationImpact({ ...base.inputs, rate: 8 }, base.data);
    expect(high.loss).toBeGreaterThan(low.loss);
  });

  it("more years → more loss and higher requiredFuture", () => {
    const short = calculateInflationImpact({ ...base.inputs, years: 5 }, base.data);
    const long = calculateInflationImpact({ ...base.inputs, years: 40 }, base.data);
    expect(long.loss).toBeGreaterThan(short.loss);
    expect(long.requiredFuture).toBeGreaterThan(short.requiredFuture);
  });

  it("larger amount scales loss proportionally", () => {
    const a = calculateInflationImpact({ ...base.inputs, amount: 10000 }, base.data);
    const b = calculateInflationImpact({ ...base.inputs, amount: 20000 }, base.data);
    expect(b.loss).toBeCloseTo(a.loss * 2, -1);
  });

  // ── Edge cases / guards ─────────────────────────────────────────────────

  it("zero rate → no loss, requiredFuture = amount", () => {
    const r = calculateInflationImpact({ ...base.inputs, rate: 0 }, base.data);
    expect(r.loss).toBe(0);
    expect(r.futureValue).toBe(10000);
    expect(r.requiredFuture).toBe(10000);
    expect(r.yearsToHalve).toBe(0);
  });

  it("lossPercent between 0 and 100", () => {
    const r = calculateInflationImpact({ amount: 50000, rate: 12, years: 50 }, base.data);
    expect(r.lossPercent).toBeGreaterThan(0);
    expect(r.lossPercent).toBeLessThan(100);
  });

  it("realValueRatio = futureValue / amount", () => {
    const r = calculateInflationImpact(base.inputs, base.data);
    expect(r.realValueRatio).toBeCloseTo(r.futureValue / 10000, 2);
  });

  it("all outputs are finite", () => {
    const r = calculateInflationImpact(base.inputs, base.data);
    for (const [k, v] of Object.entries(r)) {
      expect(Number.isFinite(v), `${k} finite`).toBe(true);
    }
  });
});
