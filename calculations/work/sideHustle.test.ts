import { describe, it, expect } from "vitest";
import { calculateSideHustle, type SideHustleInputs } from "./sideHustle";

const base: SideHustleInputs = {
  hoursPerWeek: 10,
  rate: 35,
  expensePct: 15,
  taxRate: 25,
};

const WPM = 52 / 12;

describe("calculateSideHustle — known values", () => {
  it("monthly revenue = hours × rate × 4.33", () => {
    const r = calculateSideHustle(base);
    expect(r.monthlyRevenue).toBe(Math.round(10 * 35 * WPM));
  });

  it("net applies expenses then tax on the post-expense amount", () => {
    const r = calculateSideHustle(base);
    const rev = 10 * 35 * WPM;
    const net = rev * (1 - 0.15) * (1 - 0.25);
    expect(r.netMonthly).toBe(Math.round(net));
  });

  it("yearly net = monthly net × 12", () => {
    const r = calculateSideHustle(base);
    const rev = 10 * 35 * WPM;
    const net = rev * 0.85 * 0.75;
    expect(r.yearlyNet).toBe(Math.round(net * 12));
  });

  it("effective hourly = net ÷ monthly hours", () => {
    const r = calculateSideHustle(base);
    const rev = 10 * 35 * WPM;
    const net = rev * 0.85 * 0.75;
    expect(r.hourlyEffective).toBeCloseTo(net / (10 * WPM), 1);
  });

  it("five-year net = yearly net × 5", () => {
    const r = calculateSideHustle(base);
    expect(r.fiveYearNet).toBe(Math.round((10 * 35 * WPM * 0.85 * 0.75) * 12 * 5));
  });
});

describe("calculateSideHustle — tax & expense behaviour", () => {
  it("annual tax is positive and below annual revenue", () => {
    const r = calculateSideHustle(base);
    expect(r.annualTaxPaid).toBeGreaterThan(0);
    expect(r.annualTaxPaid).toBeLessThan(r.monthlyRevenue * 12);
  });

  it("zero tax and zero expenses ⇒ effective rate equals the headline rate", () => {
    const r = calculateSideHustle({ ...base, expensePct: 0, taxRate: 0 });
    expect(r.hourlyEffective).toBeCloseTo(35, 1);
  });

  it("higher tax lowers the net", () => {
    const lo = calculateSideHustle({ ...base, taxRate: 10 });
    const hi = calculateSideHustle({ ...base, taxRate: 40 });
    expect(hi.netMonthly).toBeLessThan(lo.netMonthly);
  });

  it("higher expenses lower the net", () => {
    const lo = calculateSideHustle({ ...base, expensePct: 5 });
    const hi = calculateSideHustle({ ...base, expensePct: 50 });
    expect(hi.netMonthly).toBeLessThan(lo.netMonthly);
  });
});

describe("calculateSideHustle — monotonicity", () => {
  it("more hours raises monthly net but leaves the effective rate unchanged", () => {
    const lo = calculateSideHustle({ ...base, hoursPerWeek: 5 });
    const hi = calculateSideHustle({ ...base, hoursPerWeek: 20 });
    expect(hi.netMonthly).toBeGreaterThan(lo.netMonthly);
    expect(hi.hourlyEffective).toBeCloseTo(lo.hourlyEffective, 1);
  });

  it("a higher rate raises the effective hourly rate", () => {
    const lo = calculateSideHustle({ ...base, rate: 20 });
    const hi = calculateSideHustle({ ...base, rate: 100 });
    expect(hi.hourlyEffective).toBeGreaterThan(lo.hourlyEffective);
  });
});

describe("calculateSideHustle — invariants", () => {
  it("effective rate never exceeds the headline rate", () => {
    const r = calculateSideHustle(base);
    expect(r.hourlyEffective).toBeLessThanOrEqual(base.rate);
  });

  it("all outputs are finite", () => {
    const r = calculateSideHustle(base);
    for (const v of Object.values(r)) expect(Number.isFinite(v)).toBe(true);
  });
});
