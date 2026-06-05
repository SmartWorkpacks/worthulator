import { describe, it, expect } from "vitest";
import { calculateFlooringCost, FlooringInputs } from "./flooringCost";

const base: FlooringInputs = {
  roomLength: 15,
  roomWidth: 12,
  materialPerSqFt: 4,
  laborPerSqFt: 3,
  wastePct: 10,
};

describe("core flooring math", () => {
  const r = calculateFlooringCost(base);

  it("area = length × width", () => {
    expect(r.area).toBe(180);
  });

  it("material cost applies waste to area", () => {
    // 180 × 1.10 × 4 = 792
    expect(r.materialCost).toBe(792);
  });

  it("labor cost is on actual area (no waste)", () => {
    // 180 × 3 = 540
    expect(r.laborCost).toBe(540);
  });

  it("total = material + labor", () => {
    expect(r.totalCost).toBe(792 + 540);
  });

  it("installed cost per sq ft = total ÷ area", () => {
    expect(r.costPerSqFtInstalled).toBeCloseTo((792 + 540) / 180, 2);
  });
});

describe("DIY (no labor)", () => {
  it("zero labor ⇒ material-only total", () => {
    const r = calculateFlooringCost({ ...base, laborPerSqFt: 0 });
    expect(r.laborCost).toBe(0);
    expect(r.totalCost).toBe(r.materialCost);
    expect(r.laborShare).toBe(0);
  });
});

describe("labor share", () => {
  it("is between 0 and 100", () => {
    const r = calculateFlooringCost(base);
    expect(r.laborShare).toBeGreaterThan(0);
    expect(r.laborShare).toBeLessThan(100);
  });

  it("higher labor rate ⇒ higher labor share", () => {
    const lo = calculateFlooringCost({ ...base, laborPerSqFt: 2 });
    const hi = calculateFlooringCost({ ...base, laborPerSqFt: 8 });
    expect(hi.laborShare).toBeGreaterThan(lo.laborShare);
  });
});

describe("scaling", () => {
  it("doubling both dimensions quadruples area and total", () => {
    const a = calculateFlooringCost(base);
    const b = calculateFlooringCost({ ...base, roomLength: 30, roomWidth: 24 });
    expect(b.area).toBeCloseTo(a.area * 4, 6);
    expect(b.totalCost).toBeCloseTo(a.totalCost * 4, 6);
  });
});

describe("edge cases", () => {
  it("zero room → zero cost", () => {
    const r = calculateFlooringCost({ ...base, roomLength: 0, roomWidth: 0 });
    expect(r.totalCost).toBe(0);
    expect(r.costPerSqFtInstalled).toBe(0);
  });

  it("never returns NaN or Infinity", () => {
    const r = calculateFlooringCost({ roomLength: 0, roomWidth: 0, materialPerSqFt: 0, laborPerSqFt: 0, wastePct: 0 });
    expect(Object.values(r).every((v) => Number.isFinite(v))).toBe(true);
  });
});
