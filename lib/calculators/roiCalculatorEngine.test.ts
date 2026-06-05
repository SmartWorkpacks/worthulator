import { describe, it, expect } from "vitest";
import { calculateROI, type ROIInput } from "./roiCalculatorEngine";

const base: ROIInput = {
  initialInvestment: 10000,
  finalValue: 20000,
  years: 10,
  annualContribution: 0,
  annualFeePct: 1,
  taxRatePct: 15,
  inflationRatePct: 2.5,
  benchmarkReturnPct: 7,
};

describe("calculateROI — gross / CAGR", () => {
  it("gross ROI = profit / invested × 100", () => {
    const r = calculateROI(base);
    expect(r.grossROIPct).toBeCloseTo(100, 1);
  });

  it("doubling over 10 years ≈ 7.2% CAGR", () => {
    const r = calculateROI(base);
    expect(r.annualisedReturn).toBeCloseTo(7.2, 1);
  });

  it("investment multiple = final / invested", () => {
    const r = calculateROI(base);
    expect(r.investmentMultiple).toBeCloseTo(2, 1);
  });

  it("total invested includes annual contributions", () => {
    const r = calculateROI({ ...base, annualContribution: 1000 });
    expect(r.totalInvested).toBe(10000 + 1000 * 10);
  });
});

describe("calculateROI — fees, tax, inflation ordering", () => {
  it("net ROI is below gross ROI (fees + tax reduce it)", () => {
    const r = calculateROI(base);
    expect(r.netROIPct).toBeLessThan(r.grossROIPct);
  });

  it("real ROI is below net ROI (inflation reduces it)", () => {
    const r = calculateROI(base);
    expect(r.realROIPct).toBeLessThan(r.netROIPct);
  });

  it("higher fees increase fee drag and lower net ROI", () => {
    const lo = calculateROI({ ...base, annualFeePct: 0.2 });
    const hi = calculateROI({ ...base, annualFeePct: 2.5 });
    expect(hi.feeDragTotal).toBeGreaterThan(lo.feeDragTotal);
    expect(hi.netROIPct).toBeLessThan(lo.netROIPct);
  });

  it("higher inflation increases erosion and lowers real purchasing power", () => {
    const lo = calculateROI({ ...base, inflationRatePct: 1 });
    const hi = calculateROI({ ...base, inflationRatePct: 6 });
    expect(hi.inflationErosion).toBeGreaterThan(lo.inflationErosion);
    expect(hi.realPurchasingPower).toBeLessThan(lo.realPurchasingPower);
  });

  it("zero fees, tax, and inflation make net ≈ gross and real ≈ net", () => {
    const r = calculateROI({ ...base, annualFeePct: 0, taxRatePct: 0, inflationRatePct: 0 });
    expect(r.netROIPct).toBeCloseTo(r.grossROIPct, 0);
    expect(r.realROIPct).toBeCloseTo(r.netROIPct, 0);
  });

  it("tax only applies to gains, never to losses", () => {
    const loss = calculateROI({ ...base, finalValue: 6000, taxRatePct: 30 });
    expect(loss.taxDragTotal).toBe(0);
  });
});

describe("calculateROI — losses (no clamping to 0%)", () => {
  it("a final value below invested produces a negative gross ROI", () => {
    const r = calculateROI({ ...base, finalValue: 6000 });
    expect(r.grossROIPct).toBeLessThan(0);
    expect(r.totalProfit).toBeLessThan(0);
  });

  it("real purchasing power on a loss stays below the invested amount", () => {
    const r = calculateROI({ ...base, finalValue: 6000 });
    expect(r.realPurchasingPower).toBeLessThan(r.totalInvested);
  });
});

describe("calculateROI — benchmark", () => {
  it("outperformance is positive when final beats the benchmark", () => {
    const r = calculateROI({ ...base, finalValue: 40000 });
    expect(r.benchmarkOutperformance).toBeGreaterThan(0);
  });

  it("outperformance is negative when final trails the benchmark", () => {
    const r = calculateROI({ ...base, finalValue: 15000 });
    expect(r.benchmarkOutperformance).toBeLessThan(0);
  });

  it("benchmark final value grows the initial at the benchmark rate", () => {
    const r = calculateROI({ ...base, benchmarkReturnPct: 7, annualContribution: 0 });
    expect(r.benchmarkFinalValue).toBeCloseTo(Math.round(10000 * Math.pow(1.07, 10)), -1);
  });
});

describe("calculateROI — growth series", () => {
  it("series length is years + 1 and starts at the initial value", () => {
    const r = calculateROI(base);
    expect(r.growthSeries).toHaveLength(11);
    expect(r.growthSeries[0]).toMatchObject({ year: 0, gross: 10000, net: 10000, benchmark: 10000 });
  });

  it("real series is at or below the gross series at every point", () => {
    const r = calculateROI(base);
    for (const pt of r.growthSeries) {
      expect(pt.real).toBeLessThanOrEqual(pt.gross + 1);
    }
  });
});
