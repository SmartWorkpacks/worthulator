import { describe, it, expect } from "vitest";
import { calculateSalesTax, NATIONAL_AVG_RATE } from "./salesTax";

const baseInputs = { price: 100, monthlySpend: 800, state: "US Average" };
const baseData = {
  combinedRate: 7.12,
  stateRate: 7.12,
  groceryExempt: false,
  neighbors: [],
  neighborRates: [],
  localNote: "",
};

describe("calculateSalesTax", () => {
  // ── Known-value tests ────────────────────────────────────────────────────

  it("$100 at 7.12% → $7.12 tax, $107.12 total", () => {
    const r = calculateSalesTax(baseInputs, baseData);
    expect(r.taxAmount).toBeCloseTo(7.12, 2);
    expect(r.totalPrice).toBeCloseTo(107.12, 2);
  });

  it("$500 at 9.55% (Tennessee) → $47.75 tax", () => {
    const r = calculateSalesTax(
      { ...baseInputs, price: 500 },
      { ...baseData, combinedRate: 9.55 },
    );
    expect(r.taxAmount).toBeCloseTo(47.75, 2);
    expect(r.totalPrice).toBeCloseTo(547.75, 2);
  });

  it("$100 at 0% (Oregon) → $0 tax, $100 total", () => {
    const r = calculateSalesTax(baseInputs, {
      ...baseData,
      combinedRate: 0,
      groceryExempt: true,
    });
    expect(r.taxAmount).toBe(0);
    expect(r.totalPrice).toBe(100);
  });

  // ── Annual burden tests ──────────────────────────────────────────────────

  it("$800/month at 7.12% → monthly burden $56.96, annual $683.52", () => {
    const r = calculateSalesTax(baseInputs, baseData);
    expect(r.monthlyTaxBurden).toBeCloseTo(56.96, 2);
    expect(r.annualTaxBurden).toBeCloseTo(683.52, 2);
  });

  it("$2000/month at 9.55% → monthly burden $191, annual $2292", () => {
    const r = calculateSalesTax(
      { ...baseInputs, monthlySpend: 2000 },
      { ...baseData, combinedRate: 9.55 },
    );
    expect(r.monthlyTaxBurden).toBeCloseTo(191, 0);
    expect(r.annualTaxBurden).toBeCloseTo(2292, 0);
  });

  // ── Daily burden ─────────────────────────────────────────────────────────

  it("daily burden = annual / 365", () => {
    const r = calculateSalesTax(baseInputs, baseData);
    expect(r.dailyTaxBurden).toBeCloseTo(r.annualTaxBurden / 365, 1);
  });

  // ── Investment opportunity cost ──────────────────────────────────────────

  it("10-year invested value > 10× annual burden (compound growth)", () => {
    const r = calculateSalesTax(baseInputs, baseData);
    expect(r.annualIfInvested10yr).toBeGreaterThan(r.annualTaxBurden * 10);
  });

  it("zero spend → zero invested value", () => {
    const r = calculateSalesTax({ ...baseInputs, monthlySpend: 0 }, baseData);
    expect(r.annualIfInvested10yr).toBe(0);
  });

  // ── Neighbor comparison ──────────────────────────────────────────────────

  it("neighborAvgRate is mean of neighbor rates", () => {
    const r = calculateSalesTax(baseInputs, {
      ...baseData,
      combinedRate: 8.0,
      neighborRates: [6.0, 7.0, 9.0],
    });
    expect(r.neighborAvgRate).toBeCloseTo(7.33, 2);
    expect(r.vsNeighborsDelta).toBeCloseTo(0.67, 2);
  });

  it("no neighbors → fallback to national average", () => {
    const r = calculateSalesTax(baseInputs, baseData);
    expect(r.neighborAvgRate).toBe(NATIONAL_AVG_RATE);
  });

  // ── Grocery exemption ────────────────────────────────────────────────────

  it("grocery exempt → savings = $7,500 × rate/100", () => {
    const r = calculateSalesTax(baseInputs, {
      ...baseData,
      combinedRate: 8.0,
      groceryExempt: true,
    });
    expect(r.grocerySaving).toBe(Math.round(7500 * 0.08));
    expect(r.effectiveOnGroceries).toBe(0);
  });

  it("grocery NOT exempt → savings = 0, effective rate = combined rate", () => {
    const r = calculateSalesTax(baseInputs, {
      ...baseData,
      combinedRate: 9.55,
      groceryExempt: false,
    });
    expect(r.grocerySaving).toBe(0);
    expect(r.effectiveOnGroceries).toBe(9.55);
  });

  // ── Monotonicity ─────────────────────────────────────────────────────────

  it("higher rate → higher tax on same price", () => {
    const low = calculateSalesTax(baseInputs, {
      ...baseData,
      combinedRate: 5.0,
    });
    const high = calculateSalesTax(baseInputs, {
      ...baseData,
      combinedRate: 10.0,
    });
    expect(high.taxAmount).toBeGreaterThan(low.taxAmount);
    expect(high.annualTaxBurden).toBeGreaterThan(low.annualTaxBurden);
  });

  it("higher monthly spend → higher annual burden", () => {
    const low = calculateSalesTax(
      { ...baseInputs, monthlySpend: 500 },
      baseData,
    );
    const high = calculateSalesTax(
      { ...baseInputs, monthlySpend: 2000 },
      baseData,
    );
    expect(high.annualTaxBurden).toBeGreaterThan(low.annualTaxBurden);
  });

  // ── Invariants ───────────────────────────────────────────────────────────

  it("totalPrice = price + taxAmount always", () => {
    const r = calculateSalesTax(
      { price: 1234.56, monthlySpend: 999, state: "test" },
      { ...baseData, combinedRate: 6.25 },
    );
    expect(r.totalPrice).toBeCloseTo(r.taxAmount + 1234.56, 1);
  });

  it("resolvedRate matches data.combinedRate", () => {
    const r = calculateSalesTax(baseInputs, {
      ...baseData,
      combinedRate: 4.44,
    });
    expect(r.resolvedRate).toBe(4.44);
  });

  it("all outputs are finite numbers", () => {
    const r = calculateSalesTax(baseInputs, baseData);
    for (const [key, val] of Object.entries(r)) {
      expect(Number.isFinite(val), `${key} should be finite`).toBe(true);
    }
  });
});
