import { describe, it, expect } from "vitest";
import {
  calculateHeatingCost,
  BASE_KBTU_PER_SQFT_PER_DAY,
  GAS_FURNACE_EFFICIENCY,
  KBTU_PER_THERM,
  KBTU_PER_KWH,
  INSULATION_MULTIPLIERS,
  US_PROPANE_NATIONAL_AVG,
  KBTU_PER_PROPANE_GALLON,
  PROPANE_FURNACE_EFFICIENCY,
  type HeatingCostInputs,
  type HeatingCostData,
} from "./heatingCost";

const BASE_INPUTS: HeatingCostInputs = {
  heatingDays: 150,
  homeSqFt:    1500,
  heatSource:  "gas",
  insulation:  "average",
};

const BASE_DATA: HeatingCostData = {
  gasPrice:    1.28,  // national average
  electricRate: 0.165, // national average
};

// ─── Core gas math ────────────────────────────────────────────────────────────

describe("core gas math", () => {
  const r = calculateHeatingCost(BASE_INPUTS, BASE_DATA);

  it("annualKBtu = sqFt × baseLoad × insulMult × days", () => {
    const expected = 1500 * BASE_KBTU_PER_SQFT_PER_DAY * INSULATION_MULTIPLIERS.average * 150;
    expect(r.annualKBtu).toBeCloseTo(expected, 0);
  });

  it("thermsEquivalent = annualKBtu / 100", () => {
    expect(r.thermsEquivalent).toBeCloseTo(r.annualKBtu / KBTU_PER_THERM, 1);
  });

  it("annualGasCost = (therms / efficiency) × gasPrice", () => {
    const therms   = r.annualKBtu / KBTU_PER_THERM;
    const expected = (therms / GAS_FURNACE_EFFICIENCY) * 1.28;
    expect(r.annualGasCost).toBeCloseTo(expected, 0);
  });

  it("annualHeatingCost = annualGasCost when heatSource is gas", () => {
    expect(r.annualHeatingCost).toBeCloseTo(r.annualGasCost, 2);
  });

  it("monthlyCost = annualHeatingCost / 12", () => {
    expect(r.monthlyCost).toBeCloseTo(r.annualHeatingCost / 12, 1);
  });

  it("costPerHeatingDay = annualHeatingCost / heatingDays", () => {
    expect(r.costPerHeatingDay).toBeCloseTo(r.annualHeatingCost / 150, 2);
  });
});

// ─── Electric heating ─────────────────────────────────────────────────────────

describe("electric heating", () => {
  const r = calculateHeatingCost({ ...BASE_INPUTS, heatSource: "electric" }, BASE_DATA);

  it("annualHeatingCost = annualElecCost when heatSource is electric", () => {
    expect(r.annualHeatingCost).toBeCloseTo(r.annualElecCost, 2);
  });

  it("annualElecCost = annualKBtu / KBTU_PER_KWH × electricRate", () => {
    const kwh = r.annualKBtu / KBTU_PER_KWH;
    expect(r.annualElecCost).toBeCloseTo(kwh * 0.165, 0);
  });

  it("electric is more expensive than gas at national averages", () => {
    const rGas = calculateHeatingCost({ ...BASE_INPUTS, heatSource: "gas"      }, BASE_DATA);
    const rElec = calculateHeatingCost({ ...BASE_INPUTS, heatSource: "electric" }, BASE_DATA);
    expect(rElec.annualHeatingCost).toBeGreaterThan(rGas.annualHeatingCost);
  });
});

// ─── Propane heating ──────────────────────────────────────────────────────────

describe("propane heating", () => {
  const r = calculateHeatingCost({ ...BASE_INPUTS, heatSource: "propane" }, BASE_DATA);

  it("annualHeatingCost = annualPropaneCost when heatSource is propane", () => {
    expect(r.annualHeatingCost).toBeCloseTo(r.annualPropaneCost, 2);
  });

  it("annualPropaneCost formula", () => {
    const gallons  = r.annualKBtu / KBTU_PER_PROPANE_GALLON;
    const expected = (gallons / PROPANE_FURNACE_EFFICIENCY) * US_PROPANE_NATIONAL_AVG;
    expect(r.annualPropaneCost).toBeCloseTo(expected, 0);
  });
});

// ─── Insulation ───────────────────────────────────────────────────────────────

describe("insulation levels", () => {
  const poor      = calculateHeatingCost({ ...BASE_INPUTS, insulation: "poor"      }, BASE_DATA);
  const average   = calculateHeatingCost({ ...BASE_INPUTS, insulation: "average"   }, BASE_DATA);
  const good      = calculateHeatingCost({ ...BASE_INPUTS, insulation: "good"      }, BASE_DATA);
  const excellent = calculateHeatingCost({ ...BASE_INPUTS, insulation: "excellent" }, BASE_DATA);

  it("poor > average > good > excellent insulation cost", () => {
    expect(poor.annualHeatingCost).toBeGreaterThan(average.annualHeatingCost);
    expect(average.annualHeatingCost).toBeGreaterThan(good.annualHeatingCost);
    expect(good.annualHeatingCost).toBeGreaterThan(excellent.annualHeatingCost);
  });

  it("poor is 1.40× average", () => {
    expect(poor.annualHeatingCost / average.annualHeatingCost).toBeCloseTo(
      INSULATION_MULTIPLIERS.poor / INSULATION_MULTIPLIERS.average, 2
    );
  });

  it("insulationUpgradeSaving = 0 when already excellent", () => {
    expect(excellent.insulationUpgradeSaving).toBe(0);
  });

  it("insulationUpgradeSaving > 0 for poor insulation", () => {
    expect(poor.insulationUpgradeSaving).toBeGreaterThan(0);
  });

  it("insulationUpgradeSaving < annualHeatingCost", () => {
    expect(poor.insulationUpgradeSaving).toBeLessThan(poor.annualHeatingCost);
  });
});

// ─── Scaling ─────────────────────────────────────────────────────────────────

describe("scaling", () => {
  it("doubling homeSqFt doubles annualHeatingCost", () => {
    const a = calculateHeatingCost(BASE_INPUTS, BASE_DATA);
    const b = calculateHeatingCost({ ...BASE_INPUTS, homeSqFt: 3000 }, BASE_DATA);
    expect(b.annualHeatingCost).toBeCloseTo(a.annualHeatingCost * 2, 0);
  });

  it("doubling heatingDays doubles annualHeatingCost", () => {
    const a = calculateHeatingCost(BASE_INPUTS, BASE_DATA);
    const b = calculateHeatingCost({ ...BASE_INPUTS, heatingDays: 300 }, BASE_DATA);
    expect(b.annualHeatingCost).toBeCloseTo(a.annualHeatingCost * 2, 0);
  });

  it("doubling gasPrice doubles annualGasCost", () => {
    const a = calculateHeatingCost(BASE_INPUTS, BASE_DATA);
    const b = calculateHeatingCost(BASE_INPUTS, { ...BASE_DATA, gasPrice: 2.56 });
    expect(b.annualGasCost).toBeCloseTo(a.annualGasCost * 2, 0);
  });
});

// ─── 10-year projection ───────────────────────────────────────────────────────

describe("10-year projection", () => {
  const r = calculateHeatingCost(BASE_INPUTS, BASE_DATA);

  it("tenYearCost = annualHeatingCost × 10", () => {
    expect(r.tenYearCost).toBeCloseTo(r.annualHeatingCost * 10, 1);
  });

  it("inflatedCost10yr > tenYearCost", () => {
    expect(r.inflatedCost10yr).toBeGreaterThan(r.tenYearCost);
  });
});

// ─── Edge cases ───────────────────────────────────────────────────────────────

describe("edge cases", () => {
  it("zero sq ft → zero heating cost", () => {
    const r = calculateHeatingCost({ ...BASE_INPUTS, homeSqFt: 0 }, BASE_DATA);
    expect(r.annualHeatingCost).toBe(0);
  });

  it("zero gas price → zero gas cost but electric still positive", () => {
    const r = calculateHeatingCost(
      { ...BASE_INPUTS, heatSource: "electric" },
      { gasPrice: 0, electricRate: 0.165 },
    );
    expect(r.annualElecCost).toBeGreaterThan(0);
    expect(r.annualGasCost).toBe(0);
  });

  it("never returns NaN or Infinity", () => {
    const r = calculateHeatingCost(
      { heatingDays: 0, homeSqFt: 0, heatSource: "gas", insulation: "average" },
      { gasPrice: 0, electricRate: 0 },
    );
    expect(Object.values(r).every(v => Number.isFinite(v))).toBe(true);
  });
});
