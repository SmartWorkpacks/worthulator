import { describe, it, expect } from "vitest";
import { calculateAnnuity } from "./annuityEngine";

const base = {
  principal: 500_000,
  annualRatePct: 5,
  payoutYears: 20,
};

describe("calculateAnnuity", () => {
  it("payout matches the level-payment (amortization) formula", () => {
    // 500k @ 5% over 20 yrs ≈ $3,300/mo
    const r = calculateAnnuity(base);
    expect(r.monthlyPayout).toBeGreaterThan(3_200);
    expect(r.monthlyPayout).toBeLessThan(3_400);
  });

  it("at 0% the monthly payout is simply principal ÷ months", () => {
    const r = calculateAnnuity({ ...base, annualRatePct: 0 });
    expect(r.monthlyPayout).toBe(Math.round(500_000 / (20 * 12)));
  });

  it("total payout equals monthly × months (within rounding)", () => {
    const r = calculateAnnuity(base);
    // totalPayout uses the precise monthly figure; allow for per-month rounding.
    expect(Math.abs(r.totalPayout - r.monthlyPayout * 20 * 12)).toBeLessThan(240);
  });

  it("interest earned equals total payout minus principal", () => {
    const r = calculateAnnuity(base);
    expect(r.interestEarned).toBe(r.totalPayout - base.principal);
  });

  it("longer payout periods give smaller monthly payments", () => {
    const r = calculateAnnuity(base);
    for (let i = 1; i < r.payoutByTerm.length; i++) {
      expect(r.payoutByTerm[i].y).toBeLessThan(r.payoutByTerm[i - 1].y);
    }
  });

  it("a higher rate produces a higher payout", () => {
    const low = calculateAnnuity({ ...base, annualRatePct: 3 });
    const high = calculateAnnuity({ ...base, annualRatePct: 7 });
    expect(high.monthlyPayout).toBeGreaterThan(low.monthlyPayout);
  });

  it("payout multiple is total payout ÷ premium and exceeds 1 when rate > 0", () => {
    const r = calculateAnnuity(base);
    expect(r.payoutMultiple).toBeCloseTo(r.totalPayout / base.principal, 1);
    expect(r.payoutMultiple).toBeGreaterThan(1);
  });

  it("guards zero/negative inputs (no NaN)", () => {
    const r = calculateAnnuity({ principal: 0, annualRatePct: 0, payoutYears: 0 });
    expect(r.monthlyPayout).toBe(0);
    expect(r.totalPayout).toBe(0);
    expect(Number.isFinite(r.payoutMultiple)).toBe(true);
  });
});
