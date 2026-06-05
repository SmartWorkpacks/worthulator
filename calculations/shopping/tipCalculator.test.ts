import { describe, it, expect } from "vitest";
import { calculateTip, TipInputs } from "./tipCalculator";

const base: TipInputs = {
  bill: 60,
  tipPct: 20,
  people: 2,
  diningFrequency: 8,
};

describe("core tip math", () => {
  const r = calculateTip(base);

  it("tip = bill × tipPct / 100", () => {
    expect(r.tipAmount).toBe(12.00);
  });

  it("totalBill = bill + tip", () => {
    expect(r.totalBill).toBe(72.00);
  });

  it("tipPerPerson = tip ÷ people", () => {
    expect(r.tipPerPerson).toBe(6.00);
  });

  it("totalPerPerson = totalBill ÷ people", () => {
    expect(r.totalPerPerson).toBe(36.00);
  });
});

describe("cash round-up", () => {
  it("rounds up to nearest $5", () => {
    const r = calculateTip({ bill: 47, tipPct: 18, people: 3, diningFrequency: 4 });
    // tip = 8.46, total = 55.46, perPerson = 18.49
    expect(r.roundedTotal).toBe(20);
    expect(r.roundUpCost).toBeCloseTo(20 - r.totalPerPerson, 2);
  });

  it("already-round amount stays the same", () => {
    const r = calculateTip({ bill: 50, tipPct: 20, people: 2, diningFrequency: 1 });
    // tip = 10, total = 60, perPerson = 30 — already on $5 boundary
    expect(r.roundedTotal).toBe(30);
    expect(r.roundUpCost).toBe(0);
  });
});

describe("annual spending", () => {
  it("annualTipSpend = tipAmount × freq × 12", () => {
    const r = calculateTip(base);
    expect(r.annualTipSpend).toBe(12 * 8 * 12); // 1152
  });

  it("annualDining = totalBill × freq × 12", () => {
    const r = calculateTip(base);
    expect(r.annualDining).toBe(72 * 8 * 12); // 6912
  });

  it("zero frequency → zero annual", () => {
    const r = calculateTip({ ...base, diningFrequency: 0 });
    expect(r.annualTipSpend).toBe(0);
    expect(r.annualDining).toBe(0);
  });
});

describe("tip bracket comparison", () => {
  it("computes 15/20/25% brackets", () => {
    const r = calculateTip(base);
    expect(r.tip15).toBe(9.00);
    expect(r.tip20).toBe(12.00);
    expect(r.tip25).toBe(15.00);
  });
});

describe("edge cases", () => {
  it("zero tip % → no tip, roundedTotal still works", () => {
    const r = calculateTip({ ...base, tipPct: 0 });
    expect(r.tipAmount).toBe(0);
    expect(r.totalPerPerson).toBe(30);
    expect(r.roundedTotal).toBe(30);
  });

  it("single person → no splitting", () => {
    const r = calculateTip({ ...base, people: 1 });
    expect(r.tipPerPerson).toBe(r.tipAmount);
    expect(r.totalPerPerson).toBe(r.totalBill);
  });

  it("never returns NaN or Infinity", () => {
    const r = calculateTip({ bill: 0, tipPct: 0, people: 0, diningFrequency: 0 });
    expect(Object.values(r).every(v => Number.isFinite(v))).toBe(true);
  });
});
