import { describe, it, expect } from "vitest";
import { calculateDownPayment, type DownPaymentInputs } from "./downPayment";

const DATA = { hysaApyPct: 4.4, annualInflationPct: 3.2 };
const base: DownPaymentInputs = { homePrice: 400000, downPct: 20, currentSaved: 5000, months: 36, appreciationPct: 4 };

describe("calculateDownPayment", () => {
  it("target down today = price × down%", () => {
    const r = calculateDownPayment(base, DATA);
    expect(r.targetDownToday).toBe(80000);
  });

  it("appreciation raises the target above today's figure", () => {
    const r = calculateDownPayment(base, DATA);
    expect(r.targetDown).toBeGreaterThan(r.targetDownToday);
    expect(r.appreciationGap).toBe(r.targetDown - r.targetDownToday);
    expect(r.futureHomePrice).toBeGreaterThan(base.homePrice);
  });

  it("zero appreciation keeps the target flat", () => {
    const r = calculateDownPayment({ ...base, appreciationPct: 0 }, DATA);
    expect(r.targetDown).toBe(r.targetDownToday);
    expect(r.appreciationGap).toBe(0);
  });

  it("HYSA interest lowers the required monthly amount", () => {
    const r = calculateDownPayment(base, DATA);
    expect(r.monthlySavings).toBeLessThan(r.monthlyNoInterest);
    expect(r.monthlyInterestSavings).toBe(r.monthlyNoInterest - r.monthlySavings);
  });

  it("with zero APY, real and naive monthly amounts match", () => {
    const r = calculateDownPayment(base, { ...DATA, hysaApyPct: 0 });
    expect(r.monthlySavings).toBe(r.monthlyNoInterest);
    expect(r.monthlyInterestSavings).toBe(0);
  });

  it("contributing the monthly amount reaches the target (within rounding)", () => {
    const r = calculateDownPayment(base, DATA);
    const m = DATA.hysaApyPct / 100 / 12;
    const fvCurrent = base.currentSaved * Math.pow(1 + m, base.months);
    const fvContrib = r.monthlySavings * ((Math.pow(1 + m, base.months) - 1) / m);
    expect(Math.abs(fvCurrent + fvContrib - r.targetDown)).toBeLessThan(r.monthlySavings + 1);
  });

  it("interest earned is non-negative", () => {
    const r = calculateDownPayment(base, DATA);
    expect(r.interestEarned).toBeGreaterThanOrEqual(0);
  });

  it("cash to close = down payment + closing costs", () => {
    const r = calculateDownPayment(base, DATA);
    expect(r.cashToClose).toBe(r.targetDown + r.closingCosts);
    expect(r.closingCosts).toBeGreaterThan(0);
  });

  it("flags no PMI at 20% down", () => {
    const r = calculateDownPayment(base, DATA);
    expect(r.avoidsPMI).toBe(1);
    expect(r.pmiShortfall).toBe(0);
  });

  it("flags PMI and a shortfall below 20% down", () => {
    const r = calculateDownPayment({ ...base, downPct: 10 }, DATA);
    expect(r.avoidsPMI).toBe(0);
    expect(r.pmiShortfall).toBeGreaterThan(0);
  });

  it("progress percent reflects current savings vs target", () => {
    const r = calculateDownPayment(base, DATA);
    expect(r.progressPercent).toBeCloseTo((base.currentSaved / r.targetDown) * 100, 0);
  });

  it("more months lowers the required monthly amount", () => {
    const short = calculateDownPayment({ ...base, months: 12 }, DATA);
    const long  = calculateDownPayment({ ...base, months: 60 }, DATA);
    expect(long.monthlySavings).toBeLessThan(short.monthlySavings);
  });

  it("real target (today's dollars) is below the nominal future target", () => {
    const r = calculateDownPayment(base, DATA);
    expect(r.realTargetDown).toBeLessThan(r.targetDown);
  });

  it("more current savings lowers the monthly requirement", () => {
    const lo = calculateDownPayment({ ...base, currentSaved: 0 },      DATA);
    const hi = calculateDownPayment({ ...base, currentSaved: 40000 },  DATA);
    expect(hi.monthlySavings).toBeLessThan(lo.monthlySavings);
  });

  it("remaining never goes negative when already over target", () => {
    const r = calculateDownPayment({ ...base, currentSaved: 200000 }, DATA);
    expect(r.remaining).toBe(0);
    expect(r.monthlySavings).toBe(0);
  });
});
