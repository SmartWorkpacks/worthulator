import { describe, it, expect } from "vitest";
import { calculateApy } from "./apyEngine";

const base = {
  principal: 10_000,
  nominalRatePct: 5,
  compounding: "monthly" as const,
  termYears: 1,
};

describe("calculateApy", () => {
  it("applies the APY formula for monthly compounding", () => {
    // (1 + .05/12)^12 - 1 = 5.1162%
    const r = calculateApy(base);
    expect(r.apyPct).toBeCloseTo(5.1162, 3);
  });

  it("APY equals the nominal rate when compounding annually", () => {
    const r = calculateApy({ ...base, compounding: "annually" });
    expect(r.apyPct).toBeCloseTo(5, 4);
    expect(r.compoundingBonusPct).toBeCloseTo(0, 4);
  });

  it("APY rises with more frequent compounding (daily > monthly > quarterly > annually)", () => {
    const r = calculateApy(base);
    const byLabel = Object.fromEntries(r.apyByFrequency.map((f) => [f.label, f.amount]));
    expect(byLabel.Daily).toBeGreaterThan(byLabel.Monthly);
    expect(byLabel.Monthly).toBeGreaterThan(byLabel.Quarterly);
    expect(byLabel.Quarterly).toBeGreaterThan(byLabel.Annually);
  });

  it("balance after term matches the compound-interest formula", () => {
    // 10000 * (1 + .05/12)^12 over 1 year
    const r = calculateApy(base);
    const expected = 10_000 * Math.pow(1 + 0.05 / 12, 12);
    expect(r.balanceAfterTerm).toBe(Math.round(expected));
  });

  it("interest earned equals balance minus principal", () => {
    const r = calculateApy({ ...base, termYears: 5 });
    expect(r.interestEarned).toBe(r.balanceAfterTerm - base.principal);
  });

  it("first-year interest equals principal × APY", () => {
    const r = calculateApy(base);
    expect(r.firstYearInterest).toBe(Math.round(base.principal * (r.apyPct / 100)));
  });

  it("compounding bonus is APY minus nominal rate", () => {
    const r = calculateApy(base);
    expect(r.compoundingBonusPct).toBeCloseTo(r.apyPct - r.nominalRatePct, 4);
  });

  it("guards zero/negative inputs (no NaN)", () => {
    const r = calculateApy({ principal: 0, nominalRatePct: 0, compounding: "daily", termYears: 0 });
    expect(r.apyPct).toBe(0);
    expect(r.balanceAfterTerm).toBe(0);
    expect(Number.isFinite(r.interestEarned)).toBe(true);
  });
});
