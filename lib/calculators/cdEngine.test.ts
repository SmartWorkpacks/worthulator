import { describe, expect, it } from "vitest";
import { calculateCd, type CdInputs } from "./cdEngine";

const BASE: CdInputs = {
  deposit: 10_000,
  apyPct: 5,
  termMonths: 12,
  penaltyMonths: 3,
};

describe("calculateCd", () => {
  it("matches the APY definition for a 1-year CD", () => {
    const r = calculateCd(BASE);
    // APY is effective annual, so 1 year of 5% on 10,000 is exactly 10,500.
    expect(r.maturityValue).toBeCloseTo(10_500, 1);
    expect(r.totalInterest).toBeCloseTo(500, 1);
    expect(r.termYears).toBe(1);
  });

  it("compounds the APY across multiple years", () => {
    const r = calculateCd({ ...BASE, termMonths: 24 });
    // 10,000 * 1.05^2 = 11,025
    expect(r.maturityValue).toBeCloseTo(11_025, 0);
    expect(r.totalInterest).toBeCloseTo(1_025, 0);
  });

  it("earns no interest at a zero APY", () => {
    const r = calculateCd({ ...BASE, apyPct: 0 });
    expect(r.maturityValue).toBe(10_000);
    expect(r.totalInterest).toBe(0);
    expect(r.earlyWithdrawalPenalty).toBe(0);
  });

  it("grows more with a higher APY and a longer term", () => {
    const lo = calculateCd({ ...BASE, apyPct: 3 });
    const hi = calculateCd({ ...BASE, apyPct: 6 });
    const longer = calculateCd({ ...BASE, termMonths: 60 });
    expect(hi.maturityValue).toBeGreaterThan(lo.maturityValue);
    expect(longer.maturityValue).toBeGreaterThan(BASE.deposit);
  });

  it("scales the early-withdrawal penalty with penalty months", () => {
    const none = calculateCd({ ...BASE, penaltyMonths: 0 });
    const six = calculateCd({ ...BASE, penaltyMonths: 6 });
    expect(none.earlyWithdrawalPenalty).toBe(0);
    expect(six.earlyWithdrawalPenalty).toBeGreaterThan(calculateCd(BASE).earlyWithdrawalPenalty);
  });

  it("keeps totalInterest equal to maturity minus principal", () => {
    const r = calculateCd({ ...BASE, deposit: 25_000, apyPct: 4.25, termMonths: 36 });
    expect(round2(r.maturityValue - r.deposit)).toBeCloseTo(r.totalInterest, 1);
  });

  it("produces a monotonically increasing balance schedule ending at maturity", () => {
    const r = calculateCd({ ...BASE, termMonths: 18 });
    const last = r.schedule[r.schedule.length - 1];
    expect(last.month).toBe(18);
    expect(last.balance).toBeCloseTo(r.maturityValue, 1);
    for (let i = 1; i < r.schedule.length; i++) {
      expect(r.schedule[i].balance).toBeGreaterThanOrEqual(r.schedule[i - 1].balance);
    }
  });

  it("guards NaN inputs from producing non-finite values", () => {
    const r = calculateCd({
      deposit: Number.NaN,
      apyPct: Number.NaN,
      termMonths: Number.NaN,
      penaltyMonths: Number.NaN,
    });
    expect(Number.isFinite(r.maturityValue)).toBe(true);
    expect(Number.isFinite(r.earlyWithdrawalPenalty)).toBe(true);
    expect(r.maturityValue).toBeGreaterThanOrEqual(0);
  });
});

function round2(n: number) {
  return Math.round(n * 100) / 100;
}
