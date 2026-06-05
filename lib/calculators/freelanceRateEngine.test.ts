import { describe, it, expect } from "vitest";
import {
  calculateFreelanceRate,
  type FreelanceRateInputs,
} from "./freelanceRateEngine";

const base: FreelanceRateInputs = {
  desiredAnnualIncome: 80000,
  hoursPerWeek: 40,
  weeksWorked: 48,
  utilizationPct: 70,
  annualBusinessExpenses: 12000,
  taxRatePct: 28,
  profitMarginPct: 15,
  currentHourlyRate: 75,
  platformFeePct: 0,
  scopeCreepBufferPct: 0,
  mode: "survival",
};

describe("calculateFreelanceRate — known values", () => {
  it("billable hours = hours/week × weeks × utilization", () => {
    const r = calculateFreelanceRate(base);
    expect(r.billableHoursPerYear).toBe(Math.round(40 * 48 * 0.7));
  });

  it("gross-up: required revenue covers tax + expenses + margin", () => {
    const r = calculateFreelanceRate(base);
    const gross = 80000 / (1 - 0.28);
    const expected = (gross + 12000) / (1 - 0.15);
    expect(r.requiredRevenue).toBeCloseTo(expected, 0);
  });

  it("with no platform/scope fees, revenueWithFees equals requiredRevenue", () => {
    const r = calculateFreelanceRate(base);
    expect(r.requiredRevenueWithFees).toBeCloseTo(r.requiredRevenue, 0);
  });

  it("survival hourly rate = revenueWithFees ÷ billable hours", () => {
    const r = calculateFreelanceRate(base);
    expect(r.minimumHourlyRate).toBeCloseTo(r.requiredRevenueWithFees / r.billableHoursPerYear, 2);
  });
});

describe("calculateFreelanceRate — mode multipliers", () => {
  it("comfortable ≈ survival × 1.2, premium ≈ survival × 1.5", () => {
    const r = calculateFreelanceRate(base);
    expect(Math.abs(r.rateByMode.comfortable - r.rateByMode.survival * 1.2)).toBeLessThanOrEqual(1);
    expect(Math.abs(r.rateByMode.premium - r.rateByMode.survival * 1.5)).toBeLessThanOrEqual(1);
  });

  it("premium mode raises the minimum hourly rate vs survival", () => {
    const surv = calculateFreelanceRate({ ...base, mode: "survival" });
    const prem = calculateFreelanceRate({ ...base, mode: "premium" });
    expect(prem.minimumHourlyRate).toBeGreaterThan(surv.minimumHourlyRate);
  });
});

describe("calculateFreelanceRate — monotonicity", () => {
  it("higher desired income raises the required rate", () => {
    const lo = calculateFreelanceRate({ ...base, desiredAnnualIncome: 60000 });
    const hi = calculateFreelanceRate({ ...base, desiredAnnualIncome: 120000 });
    expect(hi.minimumHourlyRate).toBeGreaterThan(lo.minimumHourlyRate);
  });

  it("higher utilization lowers the required rate", () => {
    const lo = calculateFreelanceRate({ ...base, utilizationPct: 50 });
    const hi = calculateFreelanceRate({ ...base, utilizationPct: 90 });
    expect(hi.minimumHourlyRate).toBeLessThan(lo.minimumHourlyRate);
  });

  it("higher tax rate raises the required rate", () => {
    const lo = calculateFreelanceRate({ ...base, taxRatePct: 20 });
    const hi = calculateFreelanceRate({ ...base, taxRatePct: 40 });
    expect(hi.minimumHourlyRate).toBeGreaterThan(lo.minimumHourlyRate);
  });

  it("platform fee grosses the required revenue up", () => {
    const none = calculateFreelanceRate({ ...base, platformFeePct: 0 });
    const upwork = calculateFreelanceRate({ ...base, platformFeePct: 20 });
    expect(upwork.requiredRevenueWithFees).toBeGreaterThan(none.requiredRevenueWithFees);
  });

  it("scope creep buffer raises the required rate", () => {
    const none = calculateFreelanceRate({ ...base, scopeCreepBufferPct: 0 });
    const buffered = calculateFreelanceRate({ ...base, scopeCreepBufferPct: 25 });
    expect(buffered.minimumHourlyRate).toBeGreaterThan(none.minimumHourlyRate);
  });
});

describe("calculateFreelanceRate — undercharging detection", () => {
  it("flags undercharging when current rate is below the minimum", () => {
    const r = calculateFreelanceRate({ ...base, currentHourlyRate: 10 });
    expect(r.isUndercharging).toBe(true);
    expect(r.rateGap).toBeLessThan(0);
  });

  it("does not flag undercharging when current rate clears the minimum", () => {
    const r = calculateFreelanceRate({ ...base, currentHourlyRate: 500 });
    expect(r.isUndercharging).toBe(false);
    expect(r.rateGap).toBeGreaterThan(0);
  });
});

describe("calculateFreelanceRate — invariants", () => {
  it("cost breakdown sums to the survival hourly rate", () => {
    const r = calculateFreelanceRate({ ...base, platformFeePct: 15, scopeCreepBufferPct: 20, mode: "survival" });
    const sum = r.costBreakdown.reduce((s, c) => s + c.amount, 0);
    expect(sum).toBeCloseTo(r.minimumHourlyRate, 2);
  });

  it("utilization impact curve is strictly decreasing", () => {
    const r = calculateFreelanceRate(base);
    const rates = r.utilizationImpact.map((u) => u.hourlyRate);
    for (let i = 1; i < rates.length; i++) {
      expect(rates[i]).toBeLessThanOrEqual(rates[i - 1]);
    }
  });

  it("project rate = hourly × estimated project hours when provided", () => {
    const r = calculateFreelanceRate({ ...base, estimatedProjectHours: 40 });
    expect(r.estimatedProjectRate).toBeCloseTo(r.minimumHourlyRate * 40, 2);
  });

  it("zero billable hours yields zero rate without NaN/Infinity", () => {
    const r = calculateFreelanceRate({ ...base, utilizationPct: 0 });
    expect(r.minimumHourlyRate).toBe(0);
    expect(Number.isFinite(r.minimumHourlyRate)).toBe(true);
  });
});
