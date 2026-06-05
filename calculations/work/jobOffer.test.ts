import { describe, it, expect } from "vitest";
import { calculateJobOffer, type JobOfferInputs } from "./jobOffer";

const base: JobOfferInputs = {
  salaryA: 85000,
  salaryB: 95000,
  commuteCostA: 3000,
  commuteCostB: 500,
  benefitsValueA: 12000,
  benefitsValueB: 8000,
};

describe("calculateJobOffer — known values", () => {
  it("effective comp = salary + benefits − commute", () => {
    const r = calculateJobOffer(base);
    expect(r.effectiveA).toBe(85000 + 12000 - 3000); // 94,000
    expect(r.effectiveB).toBe(95000 + 8000 - 500); // 102,500
  });

  it("difference = effectiveA − effectiveB (B wins here)", () => {
    const r = calculateJobOffer(base);
    expect(r.difference).toBe(94000 - 102500); // -8,500
  });

  it("monthly gap = difference ÷ 12", () => {
    const r = calculateJobOffer(base);
    expect(r.monthlyGap).toBe(Math.round(-8500 / 12));
  });

  it("five- and ten-year nominal gaps scale linearly", () => {
    const r = calculateJobOffer(base);
    expect(r.fiveYearGap).toBe(-8500 * 5);
    expect(r.tenYearGap).toBe(-8500 * 10);
  });

  it("benefits and commute gaps are A − B", () => {
    const r = calculateJobOffer(base);
    expect(r.benefitsGap).toBe(12000 - 8000);
    expect(r.commuteGap).toBe(3000 - 500);
  });
});

describe("calculateJobOffer — total comp can flip the headline", () => {
  it("higher-salary offer can lose on effective comp", () => {
    const r = calculateJobOffer(base);
    // Job B has the higher salary (95k > 85k) but…
    expect(base.salaryB).toBeGreaterThan(base.salaryA);
    // …Job B still wins here because of richer benefits/commute on B.
    expect(r.difference).toBeLessThan(0);
  });

  it("a fat benefits package can overturn a salary deficit", () => {
    const r = calculateJobOffer({ ...base, benefitsValueA: 30000, benefitsValueB: 0 });
    expect(r.difference).toBeGreaterThan(0); // A now wins despite lower salary
  });
});

describe("calculateJobOffer — monotonicity", () => {
  it("raising Job A salary raises A's effective comp and the difference", () => {
    const lo = calculateJobOffer({ ...base, salaryA: 80000 });
    const hi = calculateJobOffer({ ...base, salaryA: 120000 });
    expect(hi.effectiveA).toBeGreaterThan(lo.effectiveA);
    expect(hi.difference).toBeGreaterThan(lo.difference);
  });

  it("a higher commute cost lowers that job's effective comp", () => {
    const lo = calculateJobOffer({ ...base, commuteCostA: 0 });
    const hi = calculateJobOffer({ ...base, commuteCostA: 10000 });
    expect(hi.effectiveA).toBeLessThan(lo.effectiveA);
  });
});

describe("calculateJobOffer — invested wealth gap", () => {
  it("invested 10-year gap exceeds the nominal 10-year gap in magnitude", () => {
    const r = calculateJobOffer(base);
    expect(Math.abs(r.tenYearInvestedGap)).toBeGreaterThan(Math.abs(r.tenYearGap));
  });

  it("a higher assumed return grows the invested gap", () => {
    const lo = calculateJobOffer(base, { investReturnPct: 4 });
    const hi = calculateJobOffer(base, { investReturnPct: 10 });
    expect(Math.abs(hi.tenYearInvestedGap)).toBeGreaterThan(Math.abs(lo.tenYearInvestedGap));
  });

  it("invested gap keeps the sign of the difference", () => {
    const r = calculateJobOffer(base);
    expect(Math.sign(r.tenYearInvestedGap)).toBe(Math.sign(r.difference));
  });
});

describe("calculateJobOffer — edges & invariants", () => {
  it("identical offers yield zero everywhere", () => {
    const eq: JobOfferInputs = {
      salaryA: 90000, salaryB: 90000,
      commuteCostA: 2000, commuteCostB: 2000,
      benefitsValueA: 10000, benefitsValueB: 10000,
    };
    const r = calculateJobOffer(eq);
    expect(r.difference).toBe(0);
    expect(r.monthlyGap).toBe(0);
    expect(r.tenYearInvestedGap).toBe(0);
  });

  it("difference is anti-symmetric when offers are swapped", () => {
    const r1 = calculateJobOffer(base);
    const r2 = calculateJobOffer({
      salaryA: base.salaryB, salaryB: base.salaryA,
      commuteCostA: base.commuteCostB, commuteCostB: base.commuteCostA,
      benefitsValueA: base.benefitsValueB, benefitsValueB: base.benefitsValueA,
    });
    expect(r2.difference).toBe(-r1.difference);
  });

  it("all outputs are finite", () => {
    const r = calculateJobOffer(base);
    for (const v of Object.values(r)) expect(Number.isFinite(v)).toBe(true);
  });
});
