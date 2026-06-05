import { describe, it, expect } from "vitest";
import { calculateMovingCost, MovingInputs } from "./movingCost";

const base: MovingInputs = {
  moversCost: 1200,
  fuelCost: 150,
  packingCost: 120,
  storageCost: 0,
  miscCost: 180,
  bufferPct: 15,
  miles: 0,
};

describe("core moving math", () => {
  const r = calculateMovingCost(base);

  it("subtotal sums all line items", () => {
    expect(r.subtotal).toBe(1200 + 150 + 120 + 0 + 180);
  });

  it("buffer = subtotal × bufferPct", () => {
    expect(r.buffer).toBeCloseTo(1650 * 0.15, 2);
  });

  it("total = subtotal + buffer", () => {
    expect(r.total).toBeCloseTo(1650 * 1.15, 2);
  });
});

describe("cost per mile", () => {
  it("is 0 when miles = 0", () => {
    expect(calculateMovingCost(base).costPerMile).toBe(0);
  });

  it("= total ÷ miles when distance given", () => {
    const r = calculateMovingCost({ ...base, miles: 100 });
    expect(r.costPerMile).toBeCloseTo(r.total / 100, 2);
  });

  it("decreases as miles increase (fixed total)", () => {
    const near = calculateMovingCost({ ...base, miles: 50 });
    const far = calculateMovingCost({ ...base, miles: 500 });
    expect(far.costPerMile).toBeLessThan(near.costPerMile);
  });
});

describe("top line item", () => {
  it("identifies the largest single cost", () => {
    const r = calculateMovingCost(base);
    expect(r.topLineItem).toBe(1200);
  });

  it("share is between 0 and 100", () => {
    const r = calculateMovingCost(base);
    expect(r.topLineItemShare).toBeGreaterThan(0);
    expect(r.topLineItemShare).toBeLessThanOrEqual(100);
  });
});

describe("monotonicity", () => {
  it("adding a line item never lowers the total", () => {
    const a = calculateMovingCost(base);
    const b = calculateMovingCost({ ...base, storageCost: 300 });
    expect(b.total).toBeGreaterThan(a.total);
  });

  it("higher buffer % raises the total", () => {
    const lo = calculateMovingCost({ ...base, bufferPct: 10 });
    const hi = calculateMovingCost({ ...base, bufferPct: 25 });
    expect(hi.total).toBeGreaterThan(lo.total);
  });
});

describe("edge cases", () => {
  it("zero everything → zero total", () => {
    const r = calculateMovingCost({ moversCost: 0, fuelCost: 0, packingCost: 0, storageCost: 0, miscCost: 0, bufferPct: 15, miles: 0 });
    expect(r.total).toBe(0);
    expect(r.topLineItemShare).toBe(0);
  });

  it("zero buffer → total equals subtotal", () => {
    const r = calculateMovingCost({ ...base, bufferPct: 0 });
    expect(r.total).toBe(r.subtotal);
  });

  it("never returns NaN or Infinity", () => {
    const r = calculateMovingCost({ moversCost: 0, fuelCost: 0, packingCost: 0, storageCost: 0, miscCost: 0, bufferPct: 0, miles: 0 });
    expect(Object.values(r).every((v) => Number.isFinite(v))).toBe(true);
  });
});
