import { describe, it, expect } from "vitest";
import {
  buildCompoundSchedule,
  buildCompoundScheduleAdvanced,
  calcFinalBalance,
  adjustForInflation,
  calcAfterTax,
} from "./compoundInterestConfig";

describe("buildCompoundSchedule", () => {
  it("year 0 reflects the starting principal with no interest", () => {
    const r = buildCompoundSchedule(10000, 200, 7, 20, 12);
    expect(r.schedule[0]).toMatchObject({ year: 0, balance: 10000, totalInterest: 0 });
  });

  it("schedule length is years + 1 (includes year 0)", () => {
    const r = buildCompoundSchedule(10000, 200, 7, 20, 12);
    expect(r.schedule).toHaveLength(21);
  });

  it("total contributions = principal + monthly × 12 × years", () => {
    const r = buildCompoundSchedule(10000, 200, 7, 20, 12);
    expect(r.totalContributions).toBeCloseTo(10000 + 200 * 12 * 20, 2);
  });

  it("final balance = contributions + interest", () => {
    const r = buildCompoundSchedule(10000, 200, 7, 20, 12);
    expect(r.finalBalance).toBeCloseTo(r.totalContributions + r.totalInterest, 2);
  });

  it("with 0% rate, balance equals contributions and interest is zero", () => {
    const r = buildCompoundSchedule(10000, 200, 0, 20, 12);
    expect(r.totalInterest).toBeCloseTo(0, 2);
    expect(r.finalBalance).toBeCloseTo(10000 + 200 * 12 * 20, 2);
  });

  it("balance is monotonically increasing for positive rate", () => {
    const r = buildCompoundSchedule(10000, 200, 7, 20, 12);
    for (let i = 1; i < r.schedule.length; i++) {
      expect(r.schedule[i].balance).toBeGreaterThan(r.schedule[i - 1].balance);
    }
  });

  it("higher rate produces a higher final balance", () => {
    const lo = buildCompoundSchedule(10000, 200, 4, 20, 12);
    const hi = buildCompoundSchedule(10000, 200, 10, 20, 12);
    expect(hi.finalBalance).toBeGreaterThan(lo.finalBalance);
  });

  it("monthly compounding ≈ closed-form annuity formula", () => {
    const r = buildCompoundSchedule(10000, 200, 7, 20, 12);
    const closed = calcFinalBalance(10000, 200, 7, 20);
    expect(r.finalBalance).toBeCloseTo(closed, 0);
  });
});

describe("calcFinalBalance", () => {
  it("0% rate is pure sum of contributions", () => {
    expect(calcFinalBalance(10000, 200, 0, 20)).toBe(10000 + 200 * 12 * 20);
  });

  it("lump sum only grows by the compound factor", () => {
    const fv = calcFinalBalance(10000, 0, 7, 10);
    expect(fv).toBeCloseTo(10000 * Math.pow(1 + 0.07 / 12, 120), 2);
  });
});

describe("buildCompoundScheduleAdvanced", () => {
  it("matches the basic schedule when contribution growth is 0", () => {
    const basic = buildCompoundSchedule(10000, 200, 7, 20, 12);
    const adv = buildCompoundScheduleAdvanced(10000, 200, 7, 20, 12, 0);
    expect(adv.finalBalance).toBeCloseTo(basic.finalBalance, 2);
    expect(adv.finalMonthlyContribution).toBeCloseTo(200, 2);
  });

  it("contribution growth raises the final monthly contribution and balance", () => {
    const flat = buildCompoundScheduleAdvanced(10000, 200, 7, 20, 12, 0);
    const grow = buildCompoundScheduleAdvanced(10000, 200, 7, 20, 12, 3);
    expect(grow.finalMonthlyContribution).toBeGreaterThan(200);
    expect(grow.finalBalance).toBeGreaterThan(flat.finalBalance);
  });
});

describe("adjustForInflation", () => {
  it("deflates a future value to a smaller real value", () => {
    const { realValue, inflationDrag } = adjustForInflation(500000, 2.5, 30);
    expect(realValue).toBeLessThan(500000);
    expect(inflationDrag).toBeCloseTo(500000 - realValue, 2);
  });

  it("returns the nominal value unchanged at 0% inflation", () => {
    const { realValue, inflationDrag } = adjustForInflation(500000, 0, 30);
    expect(realValue).toBe(500000);
    expect(inflationDrag).toBe(0);
  });

  it("higher inflation erodes more purchasing power", () => {
    const lo = adjustForInflation(500000, 2, 30);
    const hi = adjustForInflation(500000, 5, 30);
    expect(hi.realValue).toBeLessThan(lo.realValue);
  });
});

describe("calcAfterTax", () => {
  it("taxes only the gains, never the contributions", () => {
    const { afterTaxBalance, taxPaid } = calcAfterTax(150000, 100000, 22);
    expect(taxPaid).toBeCloseTo(50000 * 0.22, 2);
    expect(afterTaxBalance).toBeCloseTo(150000 - taxPaid, 2);
  });

  it("no tax when there are no gains", () => {
    const { afterTaxBalance, taxPaid } = calcAfterTax(90000, 100000, 22);
    expect(taxPaid).toBe(0);
    expect(afterTaxBalance).toBe(90000);
  });
});
