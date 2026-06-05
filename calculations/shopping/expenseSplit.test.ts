import { describe, it, expect } from "vitest";
import { calculateExpenseSplit, ExpenseSplitInputs } from "./expenseSplit";

const base: ExpenseSplitInputs = {
  amount: 200,
  people: 5,
  tipPct: 20,
  taxPct: 0,
};

describe("core split math", () => {
  const r = calculateExpenseSplit(base);

  it("base per person = amount ÷ people", () => {
    expect(r.perPersonBase).toBe(40);
  });

  it("tip = amount × tipPct/100", () => {
    expect(r.tip).toBe(40);
  });

  it("grand total = amount + tip + tax", () => {
    expect(r.grandTotal).toBe(240);
  });

  it("per person with tip = grandTotal ÷ people", () => {
    expect(r.perPersonTotal).toBe(48);
  });
});

describe("tax handling", () => {
  it("adds tax to the grand total", () => {
    const r = calculateExpenseSplit({ amount: 100, people: 2, tipPct: 0, taxPct: 10 });
    expect(r.tax).toBe(10);
    expect(r.grandTotal).toBe(110);
    expect(r.perPersonTotal).toBe(55);
  });
});

describe("whole-dollar collection rounding", () => {
  it("rounds per-person up to the next dollar", () => {
    const r = calculateExpenseSplit({ amount: 100, people: 3, tipPct: 0, taxPct: 0 });
    // 33.33 → 34
    expect(r.perPersonTotal).toBeCloseTo(33.33, 2);
    expect(r.roundedPerPerson).toBe(34);
  });

  it("buffer = rounded×people − grandTotal, and is ≥ 0", () => {
    const r = calculateExpenseSplit({ amount: 100, people: 3, tipPct: 0, taxPct: 0 });
    expect(r.collectionBuffer).toBeCloseTo(34 * 3 - 100, 2);
    expect(r.collectionBuffer).toBeGreaterThanOrEqual(0);
  });

  it("no buffer when the split is already whole", () => {
    const r = calculateExpenseSplit({ amount: 200, people: 5, tipPct: 20, taxPct: 0 });
    expect(r.collectionBuffer).toBe(0);
    expect(r.roundedPerPerson).toBe(48);
  });
});

describe("scaling & monotonicity", () => {
  it("more people ⇒ lower per-person total", () => {
    const few  = calculateExpenseSplit({ ...base, people: 2 });
    const many = calculateExpenseSplit({ ...base, people: 8 });
    expect(many.perPersonTotal).toBeLessThan(few.perPersonTotal);
  });

  it("conservation: per-person totals sum back to grand total", () => {
    const r = calculateExpenseSplit(base);
    expect(r.perPersonTotal * base.people).toBeCloseTo(r.grandTotal, 2);
  });
});

describe("edge cases", () => {
  it("guards people ≥ 1", () => {
    const r = calculateExpenseSplit({ ...base, people: 0 });
    expect(Number.isFinite(r.perPersonTotal)).toBe(true);
  });

  it("zero amount → zero everything", () => {
    const r = calculateExpenseSplit({ amount: 0, people: 4, tipPct: 20, taxPct: 5 });
    expect(r.grandTotal).toBe(0);
    expect(r.perPersonTotal).toBe(0);
  });

  it("never returns NaN or Infinity", () => {
    const r = calculateExpenseSplit({ amount: 0, people: 0, tipPct: 0, taxPct: 0 });
    expect(Object.values(r).every((v) => Number.isFinite(v))).toBe(true);
  });
});
