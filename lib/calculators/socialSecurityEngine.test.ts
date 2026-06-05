import { describe, it, expect } from "vitest";
import { calculateSocialSecurity, fraMonths, SSA } from "./socialSecurityEngine";

describe("calculateSocialSecurity", () => {
  it("computes FRA from birth year (67 for 1960+, 66 for 1943–1954)", () => {
    expect(fraMonths(1985)).toBe(67 * 12);
    expect(fraMonths(1950)).toBe(66 * 12);
    expect(fraMonths(1956)).toBe(66 * 12 + 4); // +2mo/yr after 1954
  });

  it("applies the PIA bend-point formula to AIME", () => {
    // income 72,000 → AIME 6,000. PIA = .9*1226 + .32*(6000-1226) = 1103.4 + 1527.68
    const r = calculateSocialSecurity({ birthYear: 1985, annualIncome: 72_000, claimingAge: 67 });
    expect(r.aime).toBe(6_000);
    expect(r.pia).toBe(Math.round(0.9 * SSA.bendPoint1 + 0.32 * (6000 - SSA.bendPoint1)));
  });

  it("pays exactly the PIA when claiming at FRA", () => {
    const r = calculateSocialSecurity({ birthYear: 1985, annualIncome: 72_000, claimingAge: 67 });
    expect(r.monthlyBenefit).toBe(r.pia);
    expect(r.pctOfPia).toBe(100);
  });

  it("reduces to ~70% of PIA when claiming at 62 (FRA 67)", () => {
    const r = calculateSocialSecurity({ birthYear: 1985, annualIncome: 72_000, claimingAge: 62 });
    expect(r.benefitAt62 / r.pia).toBeCloseTo(0.7, 2);
  });

  it("boosts to ~124% of PIA when claiming at 70 (FRA 67)", () => {
    const r = calculateSocialSecurity({ birthYear: 1985, annualIncome: 72_000, claimingAge: 70 });
    expect(r.benefitAt70 / r.pia).toBeCloseTo(1.24, 2);
  });

  it("benefit increases monotonically with claiming age", () => {
    const r = calculateSocialSecurity({ birthYear: 1985, annualIncome: 90_000, claimingAge: 67 });
    for (let i = 1; i < r.benefitByAge.length; i++) {
      expect(r.benefitByAge[i].y).toBeGreaterThan(r.benefitByAge[i - 1].y);
    }
  });

  it("caps earnings at the taxable wage base", () => {
    const atCap = calculateSocialSecurity({ birthYear: 1985, annualIncome: SSA.wageBase, claimingAge: 67 });
    const overCap = calculateSocialSecurity({ birthYear: 1985, annualIncome: SSA.wageBase + 500_000, claimingAge: 67 });
    expect(overCap.pia).toBe(atCap.pia);
  });

  it("guards zero/negative inputs (no NaN)", () => {
    const zero = calculateSocialSecurity({ birthYear: 1985, annualIncome: 0, claimingAge: 67 });
    expect(zero.pia).toBe(0);
    expect(zero.monthlyBenefit).toBe(0);
    expect(Number.isFinite(zero.pctOfPia)).toBe(true);
  });
});
