import { describe, it, expect } from "vitest";
import {
  calculateSubscriptionAuditor,
  monthlyAnnuityFV,
  DEFAULT_CUT_PCT,
  DEFAULT_ANNUAL_RETURN,
} from "./subscriptionAuditor";

const data = { avgMonthlySubscriptions: 91, avgStreamingOnly: 47 };

const base = {
  streaming: 45,
  software:  30,
  fitness:   40,
  newsMedia: 15,
  other:     20,
  annualReturn: DEFAULT_ANNUAL_RETURN,
};

describe("calculateSubscriptionAuditor — totals", () => {
  it("monthlyTotal sums all categories", () => {
    const r = calculateSubscriptionAuditor(base, data);
    expect(r.monthlyTotal).toBe(150);
  });

  it("annualTotal = monthly × 12", () => {
    const r = calculateSubscriptionAuditor(base, data);
    expect(r.annualTotal).toBe(1800);
  });

  it("dailyCost = annual / 365", () => {
    const r = calculateSubscriptionAuditor(base, data);
    expect(r.dailyCost).toBeCloseTo(1800 / 365, 2);
  });

  it("twentyYearCost = annual × 20", () => {
    const r = calculateSubscriptionAuditor(base, data);
    expect(r.twentyYearCost).toBe(36000);
  });
});

describe("category percentages", () => {
  it("category pcts sum to ~100", () => {
    const r = calculateSubscriptionAuditor(base, data);
    const sum = r.streamingPct + r.softwarePct + r.fitnessPct + r.newsMediaPct + r.otherPct;
    expect(sum).toBeCloseTo(100, 1);
  });

  it("fitness is largest category at defaults", () => {
    const r = calculateSubscriptionAuditor(base, data);
    expect(r.fitnessPct).toBeCloseTo(26.67, 1);
  });
});

describe("benchmark comparison", () => {
  it("vsAvgMonthly at defaults (150 vs 91)", () => {
    const r = calculateSubscriptionAuditor(base, data);
    expect(r.vsAvgMonthly).toBe(59);
  });

  it("vsAvgPct positive when above benchmark", () => {
    const r = calculateSubscriptionAuditor(base, data);
    expect(r.vsAvgPct).toBeGreaterThan(0);
  });
});

describe("investment opportunity cost", () => {
  it("investedValue10 uses monthly annuity FV", () => {
    const r = calculateSubscriptionAuditor(base, data);
    expect(r.investedValue10).toBe(monthlyAnnuityFV(150, 120, 7));
  });

  it("investedValue20 > investedValue10", () => {
    const r = calculateSubscriptionAuditor(base, data);
    expect(r.investedValue20).toBeGreaterThan(r.investedValue10);
  });

  it("higher return increases investedValue10", () => {
    const low  = calculateSubscriptionAuditor({ ...base, annualReturn: 5 }, data);
    const high = calculateSubscriptionAuditor({ ...base, annualReturn: 9 }, data);
    expect(high.investedValue10).toBeGreaterThan(low.investedValue10);
  });
});

describe("20% cut scenario", () => {
  it("cutTwentyAnnualSaving = 20% of annual", () => {
    const r = calculateSubscriptionAuditor(base, data);
    expect(r.cutTwentyAnnualSaving).toBe(1800 * DEFAULT_CUT_PCT);
  });

  it("cutTwentyInvested10 < investedValue10", () => {
    const r = calculateSubscriptionAuditor(base, data);
    expect(r.cutTwentyInvested10).toBeLessThan(r.investedValue10);
  });
});

describe("monthlyAnnuityFV", () => {
  it("zero payment → zero", () => {
    expect(monthlyAnnuityFV(0, 120, 7)).toBe(0);
  });

  it("zero return → linear sum", () => {
    expect(monthlyAnnuityFV(100, 12, 0)).toBe(1200);
  });
});

describe("edge cases", () => {
  it("all zeros → zero outputs, no NaN", () => {
    const r = calculateSubscriptionAuditor(
      { streaming: 0, software: 0, fitness: 0, newsMedia: 0, other: 0, annualReturn: 7 },
      data,
    );
    expect(r.monthlyTotal).toBe(0);
    expect(r.investedValue10).toBe(0);
    expect(Number.isFinite(r.vsAvgPct)).toBe(true);
  });
});
