import { describe, it, expect } from "vitest";
import { calculateRentAffordability } from "./rentAffordabilityEngine";

const base = {
  grossAnnualIncome: 72_000, // $6,000/mo
  monthlyDebt: 0,
  targetRentPct: 30,
};

describe("calculateRentAffordability", () => {
  it("comfortable rent is 30% of gross monthly", () => {
    const r = calculateRentAffordability(base);
    expect(r.comfortableRent).toBe(1_800);
  });

  it("conservative < comfortable < stretch", () => {
    const r = calculateRentAffordability(base);
    expect(r.conservativeRent).toBeLessThan(r.comfortableRent);
    expect(r.comfortableRent).toBeLessThan(r.stretchRent);
  });

  it("debt-adjusted max is 36% of gross minus monthly debt", () => {
    const r = calculateRentAffordability({ ...base, monthlyDebt: 600 });
    // 6000 * 0.36 = 2160; minus 600 = 1560
    expect(r.debtAdjustedMax).toBe(1_560);
  });

  it("debt lowers the debt-adjusted ceiling", () => {
    const noDebt = calculateRentAffordability(base);
    const withDebt = calculateRentAffordability({ ...base, monthlyDebt: 1_000 });
    expect(withDebt.debtAdjustedMax).toBeLessThan(noDebt.debtAdjustedMax);
  });

  it("recommended rent is capped by the debt-adjusted ceiling", () => {
    // Heavy debt pulls the 36% ceiling below the 30% target.
    const r = calculateRentAffordability({ ...base, monthlyDebt: 1_000 });
    expect(r.recommendedRent).toBe(r.debtAdjustedMax);
    expect(r.recommendedRent).toBeLessThan(r.comfortableRent);
  });

  it("rent-to-income sits at the target when there's no debt", () => {
    const r = calculateRentAffordability(base);
    expect(r.rentToIncomePct).toBe(30);
  });

  it("affordable rent by income is monotonically increasing", () => {
    const r = calculateRentAffordability(base);
    for (let i = 1; i < r.affordabilityByIncome.length; i++) {
      expect(r.affordabilityByIncome[i].y).toBeGreaterThan(r.affordabilityByIncome[i - 1].y);
    }
  });

  it("guards zero/negative inputs (no NaN)", () => {
    const r = calculateRentAffordability({ grossAnnualIncome: 0, monthlyDebt: 0 });
    expect(r.recommendedRent).toBe(0);
    expect(r.debtAdjustedMax).toBe(0);
    expect(Number.isFinite(r.rentToIncomePct)).toBe(true);
  });
});
