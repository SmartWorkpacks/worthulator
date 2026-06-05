import { describe, it, expect } from "vitest";
import { calculate401k, EMPLOYEE_DEFERRAL_LIMIT_2026, type Retirement401kInputs } from "./retirement401k";

const DATA = { annualInflationPct: 3.2 };
const base: Retirement401kInputs = {
  currentBalance: 15000,
  salary: 65000,
  contributionPct: 6,
  employerMatchPct: 50,
  matchLimitPct: 6,
  rate: 7,
  years: 30,
  annualRaisePct: 3,
};

describe("calculate401k", () => {
  it("projects a large balance for the default 30-year scenario", () => {
    const r = calculate401k(base, DATA);
    expect(r.balance).toBeGreaterThan(700000);
    expect(r.balance).toBeLessThan(1200000);
  });

  it("employer match is positive and below employee contributions at 50% match", () => {
    const r = calculate401k(base, DATA);
    expect(r.employerMatch).toBeGreaterThan(0);
    expect(r.employerMatch).toBeLessThan(r.yourContributions);
  });

  it("balance = current + contributions + match + growth (no double count)", () => {
    const r = calculate401k(base, DATA);
    const sum = 15000 + r.yourContributions + r.employerMatch + r.growth;
    expect(Math.abs(r.balance - sum)).toBeLessThanOrEqual(2);
  });

  it("captures the full match when contribution ≥ match cap", () => {
    const r = calculate401k(base, DATA);
    expect(r.fullMatchCaptured).toBe(1);
    expect(r.matchLeftOnTable).toBe(0);
  });

  it("leaves match on the table when under-contributing", () => {
    const r = calculate401k({ ...base, contributionPct: 3 }, DATA);
    expect(r.fullMatchCaptured).toBe(0);
    expect(r.matchLeftOnTable).toBeGreaterThan(0);
  });

  it("contributing up to the cap recovers the forgone match", () => {
    const under = calculate401k({ ...base, contributionPct: 3 }, DATA);
    const full = calculate401k({ ...base, contributionPct: 6 }, DATA);
    expect(full.employerMatch).toBeGreaterThan(under.employerMatch);
  });

  it("real balance is below nominal under inflation", () => {
    const r = calculate401k(base, DATA);
    expect(r.realBalance).toBeLessThan(r.balance);
  });

  it("higher return → higher balance", () => {
    const lo = calculate401k({ ...base, rate: 4 }, DATA);
    const hi = calculate401k({ ...base, rate: 9 }, DATA);
    expect(hi.balance).toBeGreaterThan(lo.balance);
  });

  it("more years → higher balance", () => {
    const a = calculate401k({ ...base, years: 10 }, DATA);
    const b = calculate401k({ ...base, years: 40 }, DATA);
    expect(b.balance).toBeGreaterThan(a.balance);
  });

  it("higher contribution % → more employee contributions", () => {
    const a = calculate401k({ ...base, contributionPct: 6 }, DATA);
    const b = calculate401k({ ...base, contributionPct: 12 }, DATA);
    expect(b.yourContributions).toBeGreaterThan(a.yourContributions);
  });

  it("caps employee deferral at the IRS limit for very high contributions", () => {
    // 50% of $300k = $150k would blow past the limit; should clamp near the cap.
    const r = calculate401k(
      { ...base, salary: 300000, contributionPct: 50, years: 1, annualRaisePct: 0, rate: 0, currentBalance: 0 },
      DATA,
    );
    expect(r.yourContributions).toBeLessThanOrEqual(EMPLOYEE_DEFERRAL_LIMIT_2026 + 5);
    expect(r.yourContributions).toBeGreaterThan(EMPLOYEE_DEFERRAL_LIMIT_2026 - 50);
  });

  it("no employer match when match rate is 0", () => {
    const r = calculate401k({ ...base, employerMatchPct: 0 }, DATA);
    expect(r.employerMatch).toBe(0);
  });

  it("first-year match is positive and far below total match over 30 years", () => {
    const r = calculate401k(base, DATA);
    expect(r.firstYearMatch).toBeGreaterThan(0);
    expect(r.firstYearMatch).toBeLessThan(r.employerMatch);
  });

  it("zero years returns the current balance unchanged", () => {
    const r = calculate401k({ ...base, years: 0 }, DATA);
    expect(r.balance).toBe(15000);
    expect(r.yourContributions).toBe(0);
  });

  it("higher inflation lowers the real balance", () => {
    const lo = calculate401k(base, { annualInflationPct: 2 });
    const hi = calculate401k(base, { annualInflationPct: 6 });
    expect(hi.realBalance).toBeLessThan(lo.realBalance);
  });

  it("salary raises increase contributions vs a flat salary", () => {
    const flat = calculate401k({ ...base, annualRaisePct: 0 }, DATA);
    const rising = calculate401k({ ...base, annualRaisePct: 4 }, DATA);
    expect(rising.yourContributions).toBeGreaterThan(flat.yourContributions);
  });
});
