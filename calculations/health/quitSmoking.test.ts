import { describe, it, expect } from "vitest";
import {
  calculateQuitSmoking,
  MINUTES_PER_CIGARETTE,
  CIGS_PER_PACK,
  QuitSmokingInputs,
} from "./quitSmoking";

const base: QuitSmokingInputs = {
  packsPerDay:   1,
  packCost:      10,
  daysSinceQuit: 365,
};

describe("core smoking math", () => {
  const r = calculateQuitSmoking(base);

  it("moneySaved = packs × cost × days", () => {
    expect(r.moneySaved).toBe(1 * 10 * 365); // 3650
  });

  it("cigarettesAvoided = packs × 20 × days", () => {
    expect(r.cigarettesAvoided).toBe(1 * CIGS_PER_PACK * 365); // 7300
  });

  it("daysOfLifeRegained based on 11 min/cigarette", () => {
    const expected = (7300 * MINUTES_PER_CIGARETTE) / 60 / 24;
    expect(r.daysOfLifeRegained).toBeCloseTo(expected, 1);
  });

  it("annualSaving = packs × cost × 365", () => {
    expect(r.annualSaving).toBe(3650);
  });
});

describe("investment projection", () => {
  const r = calculateQuitSmoking(base);

  it("investedValue10yr > total contributed (compound growth)", () => {
    expect(r.investedValue10yr).toBeGreaterThan(r.totalContributed10yr);
  });

  it("investedValue20yr > investedValue10yr", () => {
    expect(r.investedValue20yr).toBeGreaterThan(r.investedValue10yr);
  });

  it("compoundGrowth10yr = invested - contributed", () => {
    expect(r.compoundGrowth10yr).toBe(r.investedValue10yr - r.totalContributed10yr);
  });

  it("10yr value is approximately $50,500 for $3,650/yr at 7%", () => {
    expect(r.investedValue10yr).toBeCloseTo(50_474, -2);
  });
});

describe("scaling", () => {
  it("doubling packs doubles moneySaved", () => {
    const a = calculateQuitSmoking(base);
    const b = calculateQuitSmoking({ ...base, packsPerDay: 2 });
    expect(b.moneySaved).toBeCloseTo(a.moneySaved * 2, 0);
  });

  it("doubling cost doubles moneySaved", () => {
    const a = calculateQuitSmoking(base);
    const b = calculateQuitSmoking({ ...base, packCost: 20 });
    expect(b.moneySaved).toBeCloseTo(a.moneySaved * 2, 0);
  });
});

describe("state average benchmark", () => {
  it("vsStateAvgPct is 0 when no state data provided", () => {
    const r = calculateQuitSmoking(base);
    expect(r.stateAvgPackPrice).toBe(0);
    expect(r.vsStateAvgPct).toBe(0);
  });

  it("positive vsStateAvgPct when pack cost above state average", () => {
    const r = calculateQuitSmoking({ ...base, packCost: 12 }, { stateAvgPackPrice: 10 });
    expect(r.stateAvgPackPrice).toBe(10);
    expect(r.vsStateAvgPct).toBeCloseTo(20, 1);
  });

  it("negative vsStateAvgPct when pack cost below state average", () => {
    const r = calculateQuitSmoking({ ...base, packCost: 8 }, { stateAvgPackPrice: 10 });
    expect(r.vsStateAvgPct).toBeCloseTo(-20, 1);
  });

  it("never returns NaN when state price is zero", () => {
    const r = calculateQuitSmoking(base, { stateAvgPackPrice: 0 });
    expect(Number.isFinite(r.vsStateAvgPct)).toBe(true);
    expect(r.vsStateAvgPct).toBe(0);
  });
});

describe("edge cases", () => {
  it("zero days → zero everything", () => {
    const r = calculateQuitSmoking({ ...base, daysSinceQuit: 0 });
    expect(r.moneySaved).toBe(0);
    expect(r.cigarettesAvoided).toBe(0);
    expect(r.daysOfLifeRegained).toBe(0);
  });

  it("never returns NaN or Infinity", () => {
    const r = calculateQuitSmoking({ packsPerDay: 0, packCost: 0, daysSinceQuit: 0 });
    expect(Object.values(r).every(v => Number.isFinite(v))).toBe(true);
  });
});
