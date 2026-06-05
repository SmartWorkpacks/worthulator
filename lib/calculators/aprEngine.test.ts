import { describe, it, expect } from "vitest";
import { calculateApr } from "./aprEngine";
import { calculateAmortization } from "./amortizationEngine";

const base = {
  loanAmount: 300_000,
  noteRatePct: 6.5,
  fees: 6_000,
  termYears: 30,
};

describe("calculateApr", () => {
  it("APR equals the note rate when there are no fees", () => {
    const r = calculateApr({ ...base, fees: 0 });
    expect(r.aprPct).toBeCloseTo(base.noteRatePct, 2);
    expect(r.aprPremiumPct).toBeCloseTo(0, 2);
  });

  it("APR exceeds the note rate when fees are charged", () => {
    const r = calculateApr(base);
    expect(r.aprPct).toBeGreaterThan(base.noteRatePct);
    expect(r.aprPremiumPct).toBeGreaterThan(0);
  });

  it("higher fees produce a higher APR", () => {
    const low = calculateApr({ ...base, fees: 3_000 });
    const high = calculateApr({ ...base, fees: 12_000 });
    expect(high.aprPct).toBeGreaterThan(low.aprPct);
  });

  it("net received is loan minus fees", () => {
    const r = calculateApr(base);
    expect(r.netReceived).toBe(300_000 - 6_000);
  });

  it("monthly payment matches amortization on the full loan at the note rate", () => {
    const r = calculateApr(base);
    const amort = calculateAmortization({ loanAmount: 300_000, annualRatePct: 6.5, termYears: 30 });
    expect(r.monthlyPayment).toBe(Math.round(amort.monthlyPayment));
  });

  it("the solved APR amortizes the net amount to the same payment", () => {
    const r = calculateApr(base);
    // Feed APR back through amortization on the net received → same payment.
    const check = calculateAmortization({
      loanAmount: r.netReceived,
      annualRatePct: r.aprPct,
      termYears: 30,
    });
    expect(check.monthlyPayment).toBeCloseTo(r.monthlyPayment, 0);
  });

  it("APR-by-fees series is monotonically increasing", () => {
    const r = calculateApr(base);
    for (let i = 1; i < r.aprByFees.length; i++) {
      expect(r.aprByFees[i].y).toBeGreaterThanOrEqual(r.aprByFees[i - 1].y);
    }
  });

  it("guards zero/negative inputs (no NaN)", () => {
    const r = calculateApr({ loanAmount: 0, noteRatePct: 0, fees: 0, termYears: 0 });
    expect(r.aprPct).toBe(0);
    expect(Number.isFinite(r.totalCost)).toBe(true);
  });
});
