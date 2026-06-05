import { describe, it, expect } from "vitest";
import { calculateTile, TileInputs } from "./tile";

const base: TileInputs = {
  roomLength: 12,
  roomWidth: 10,
  tileAreaSqFt: 1, // 12×12 in
  wastePct: 10,
  pricePerTile: 5,
};

describe("core tile math", () => {
  const r = calculateTile(base);

  it("room area = length × width", () => {
    expect(r.roomArea).toBe(120);
  });

  it("base tiles = ceil(area ÷ tile area)", () => {
    expect(r.baseTiles).toBe(120); // 120 / 1
  });

  it("tiles needed adds the waste allowance, rounded up", () => {
    // 120 × 1.10 = 132
    expect(r.tilesNeeded).toBe(132);
    expect(r.wasteTiles).toBe(12);
  });

  it("material cost = tiles × price", () => {
    expect(r.materialCost).toBe(132 * 5);
  });
});

describe("tile size effects", () => {
  it("larger tiles ⇒ fewer tiles needed", () => {
    const small = calculateTile({ ...base, tileAreaSqFt: 1 });
    const large = calculateTile({ ...base, tileAreaSqFt: 4 }); // 24×24
    expect(large.tilesNeeded).toBeLessThan(small.tilesNeeded);
  });

  it("24×24 tiles (4 ft²) for a 120 ft² room", () => {
    const r = calculateTile({ ...base, tileAreaSqFt: 4 });
    // base 30, with 10% → 33
    expect(r.baseTiles).toBe(30);
    expect(r.tilesNeeded).toBe(33);
  });
});

describe("waste allowance", () => {
  it("higher waste ⇒ more tiles", () => {
    const ten = calculateTile({ ...base, wastePct: 10 });
    const fifteen = calculateTile({ ...base, wastePct: 15 });
    expect(fifteen.tilesNeeded).toBeGreaterThanOrEqual(ten.tilesNeeded);
  });

  it("zero waste ⇒ tilesNeeded equals baseTiles", () => {
    const r = calculateTile({ ...base, wastePct: 0 });
    expect(r.tilesNeeded).toBe(r.baseTiles);
    expect(r.wasteTiles).toBe(0);
  });
});

describe("cost", () => {
  it("zero price ⇒ zero cost, count still computed", () => {
    const r = calculateTile({ ...base, pricePerTile: 0 });
    expect(r.materialCost).toBe(0);
    expect(r.tilesNeeded).toBe(132);
  });
});

describe("edge cases", () => {
  it("guards tile area > 0 (no divide by zero)", () => {
    const r = calculateTile({ ...base, tileAreaSqFt: 0 });
    expect(Number.isFinite(r.tilesNeeded)).toBe(true);
  });

  it("zero room → zero tiles", () => {
    const r = calculateTile({ ...base, roomLength: 0, roomWidth: 0 });
    expect(r.roomArea).toBe(0);
    expect(r.tilesNeeded).toBe(0);
  });

  it("never returns NaN or Infinity", () => {
    const r = calculateTile({ roomLength: 0, roomWidth: 0, tileAreaSqFt: 0, wastePct: 0, pricePerTile: 0 });
    expect(Object.values(r).every((v) => Number.isFinite(v))).toBe(true);
  });
});
