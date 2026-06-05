import { describe, it, expect } from "vitest";
import {
  calculateEvChargingCost,
  touDiscount,
  PUBLIC_DCFC_RATE,
  TOU_BASIC_DISCOUNT,
  TOU_EV_RATE_DISCOUNT,
  ELECTRICITY_INFLATION,
  type EvChargingInputs,
  type EvChargingData,
} from "./evChargingCost";

const BASE_INPUTS: EvChargingInputs = {
  milesPerYear:      12000,
  kwhPer100mi:       30,
  publicChargingPct: 10,
  touPlan:           "none",
};

const BASE_DATA: EvChargingData = {
  homeRateRaw: 0.165, // national average
};

// ─── Core math ────────────────────────────────────────────────────────────────

describe("core math", () => {
  const r = calculateEvChargingCost(BASE_INPUTS, BASE_DATA);

  it("homeAnnualCost = homeMiles × kwhPerMile × homeRate", () => {
    // 12000 × 0.90 = 10800 home miles; kwhPerMile = 0.30; rate = 0.165
    const expected = 10800 * 0.30 * 0.165;
    expect(r.homeAnnualCost).toBeCloseTo(expected, 1);
  });

  it("publicAnnualCost = publicMiles × kwhPerMile × DCFC_RATE", () => {
    // 12000 × 0.10 = 1200 public miles; kwhPerMile = 0.30; rate = 0.43
    const expected = 1200 * 0.30 * PUBLIC_DCFC_RATE;
    expect(r.publicAnnualCost).toBeCloseTo(expected, 1);
  });

  it("annualTotalCost = homeAnnualCost + publicAnnualCost", () => {
    expect(r.annualTotalCost).toBeCloseTo(r.homeAnnualCost + r.publicAnnualCost, 2);
  });

  it("monthlyCost = annualTotalCost / 12", () => {
    expect(r.monthlyCost).toBeCloseTo(r.annualTotalCost / 12, 1);
  });

  it("costPerMileCents = (total / miles) × 100", () => {
    expect(r.costPerMileCents).toBeCloseTo((r.annualTotalCost / 12000) * 100, 1);
  });

  it("touAnnualSaving = 0 with no TOU plan", () => {
    expect(r.touAnnualSaving).toBe(0);
  });
});

// ─── TOU plans ────────────────────────────────────────────────────────────────

describe("TOU discount function", () => {
  it("none → 0 discount", () => expect(touDiscount("none")).toBe(0));
  it("basic → TOU_BASIC_DISCOUNT", () => expect(touDiscount("basic")).toBe(TOU_BASIC_DISCOUNT));
  it("ev_rate → TOU_EV_RATE_DISCOUNT", () => expect(touDiscount("ev_rate")).toBe(TOU_EV_RATE_DISCOUNT));
});

describe("TOU basic (20% off home rate)", () => {
  const r = calculateEvChargingCost({ ...BASE_INPUTS, touPlan: "basic" }, BASE_DATA);

  it("effectiveHomeRate = rawRate × (1 - 0.20)", () => {
    expect(r.effectiveHomeRate).toBeCloseTo(0.165 * 0.80, 4);
  });

  it("touAnnualSaving > 0", () => {
    expect(r.touAnnualSaving).toBeGreaterThan(0);
  });

  it("annualTotalCost < no-TOU cost", () => {
    expect(r.annualTotalCost).toBeLessThan(r.noTouAnnualCost);
  });

  it("saving = noTouAnnualCost - annualTotalCost", () => {
    expect(r.touAnnualSaving).toBeCloseTo(r.noTouAnnualCost - r.annualTotalCost, 2);
  });
});

describe("TOU ev_rate (35% off home rate)", () => {
  const rBasic  = calculateEvChargingCost({ ...BASE_INPUTS, touPlan: "basic"   }, BASE_DATA);
  const rEvRate = calculateEvChargingCost({ ...BASE_INPUTS, touPlan: "ev_rate" }, BASE_DATA);

  it("ev_rate saves more than basic TOU", () => {
    expect(rEvRate.touAnnualSaving).toBeGreaterThan(rBasic.touAnnualSaving);
  });

  it("effectiveHomeRate = rawRate × (1 - 0.35)", () => {
    expect(rEvRate.effectiveHomeRate).toBeCloseTo(0.165 * 0.65, 4);
  });
});

// ─── Home vs public counterfactuals ──────────────────────────────────────────

describe("home vs public counterfactuals", () => {
  const r = calculateEvChargingCost(BASE_INPUTS, BASE_DATA);

  it("100% home charging is cheapest at national rate", () => {
    // home rate (0.165) < DCFC rate (0.43)
    expect(r.homeOnlyAnnualCost).toBeLessThan(r.publicOnlyAnnualCost);
  });

  it("homeOnlyAnnualCost = miles × kwhPerMile × homeRate", () => {
    expect(r.homeOnlyAnnualCost).toBeCloseTo(12000 * 0.30 * 0.165, 1);
  });

  it("publicOnlyAnnualCost = miles × kwhPerMile × DCFC_RATE", () => {
    expect(r.publicOnlyAnnualCost).toBeCloseTo(12000 * 0.30 * PUBLIC_DCFC_RATE, 1);
  });
});

// ─── Scaling ─────────────────────────────────────────────────────────────────

describe("scaling", () => {
  it("doubling milesPerYear doubles annualTotalCost", () => {
    const a = calculateEvChargingCost(BASE_INPUTS, BASE_DATA);
    const b = calculateEvChargingCost({ ...BASE_INPUTS, milesPerYear: 24000 }, BASE_DATA);
    expect(b.annualTotalCost).toBeCloseTo(a.annualTotalCost * 2, 0);
  });

  it("doubling kwhPer100mi doubles annualTotalCost", () => {
    const a = calculateEvChargingCost(BASE_INPUTS, BASE_DATA);
    const b = calculateEvChargingCost({ ...BASE_INPUTS, kwhPer100mi: 60 }, BASE_DATA);
    expect(b.annualTotalCost).toBeCloseTo(a.annualTotalCost * 2, 0);
  });

  it("100% public charging raises cost vs 100% home (national avg rate)", () => {
    const home   = calculateEvChargingCost({ ...BASE_INPUTS, publicChargingPct: 0   }, BASE_DATA);
    const pub    = calculateEvChargingCost({ ...BASE_INPUTS, publicChargingPct: 100 }, BASE_DATA);
    expect(pub.annualTotalCost).toBeGreaterThan(home.annualTotalCost);
  });
});

// ─── 10-year projection ───────────────────────────────────────────────────────

describe("10-year projection", () => {
  const r = calculateEvChargingCost(BASE_INPUTS, BASE_DATA);

  it("inflatedCost10yr > tenYearCost (inflation premium)", () => {
    expect(r.inflatedCost10yr).toBeGreaterThan(r.tenYearCost);
  });

  it("tenYearCost = annualTotalCost × 10", () => {
    expect(r.tenYearCost).toBeCloseTo(r.annualTotalCost * 10, 1);
  });

  it("inflation factor ≈ sum of (1+r)^0..(1+r)^9", () => {
    let expected = 0;
    for (let y = 0; y < 10; y++) expected += r.annualTotalCost * Math.pow(1 + ELECTRICITY_INFLATION, y);
    expect(r.inflatedCost10yr).toBeCloseTo(expected, 0);
  });
});

// ─── Edge cases ───────────────────────────────────────────────────────────────

describe("edge cases", () => {
  it("zero miles → all outputs zero", () => {
    const r = calculateEvChargingCost({ ...BASE_INPUTS, milesPerYear: 0 }, BASE_DATA);
    expect(r.annualTotalCost).toBe(0);
    expect(r.costPerMileCents).toBe(0);
  });

  it("zero rate → public cost still applies", () => {
    const r = calculateEvChargingCost({ ...BASE_INPUTS, publicChargingPct: 50 }, { homeRateRaw: 0 });
    expect(r.publicAnnualCost).toBeGreaterThan(0);
    expect(r.homeAnnualCost).toBe(0);
  });

  it("never returns NaN or Infinity", () => {
    const r = calculateEvChargingCost(
      { milesPerYear: 0, kwhPer100mi: 0, publicChargingPct: 0, touPlan: "none" },
      { homeRateRaw: 0 },
    );
    expect(Object.values(r).every(v => Number.isFinite(v))).toBe(true);
  });
});
