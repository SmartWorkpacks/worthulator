// ─── Appliance Energy Cost — Pure Calculation Module ─────────────────────────
//
// PURPOSE:
//   Deterministic running-cost math for the "appliance-energy-cost" calculator.
//   Converts a device's power draw + usage pattern into daily / monthly / annual
//   electricity cost using a live, state-injected residential rate.
//
// RULES:
//   ✅ Pure TypeScript — synchronous, deterministic, no side effects
//   ✅ Every assumption constant is documented with a source
//   ❌ Never import React · never call fetch() · never read datasets directly
//      (the live $/kWh rate is INJECTED by the caller so this stays testable)
//
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Long-run US residential electricity price inflation.
 * EIA Electric Power Monthly shows residential prices rising ~2–3%/yr over the
 * past two decades; 2.5% is a conservative mid-point used for projections.
 */
export const ELECTRICITY_INFLATION = 0.025;

/**
 * Average annual electricity consumption of a US household.
 * EIA RECS / Electric Power Annual: ~10,500 kWh/yr (≈ 877 kWh/month).
 * Used to express a single device's draw as a share of a whole-home bill.
 */
export const AVG_HOME_KWH_PER_YEAR = 10_500;

/**
 * Typical electricity reduction from replacing an old/standard appliance with
 * an efficient (ENERGY STAR-class) model. Manufacturers/DOE cite 20–30%; 27%
 * is used as a representative mid-figure.
 */
export const EFFICIENT_SAVINGS_PCT = 0.27;

const HORIZON_YEARS = 10;
const WEEKS_PER_YEAR = 52;
const MONTHS_PER_YEAR = 12;

// ─── I/O types ────────────────────────────────────────────────────────────────

export interface ApplianceCostInputs {
  /** Power draw in watts */
  watts: number;
  /** Hours the device runs on a day it is used */
  hoursPerDay: number;
  /** Days per week the device is used (1–7) */
  daysPerWeek: number;
  /** Number of identical units (e.g. how many bulbs) */
  quantity: number;
}

export interface ApplianceCostData {
  /** Residential electricity rate in $/kWh (injected from state dataset) */
  electricRate: number;
}

export interface ApplianceCostResult {
  /** Cost on a day the device actually runs */
  dailyCost: number;
  weeklyCost: number;
  monthlyCost: number;
  annualCost: number;
  /** Energy used per year in kWh */
  kWhPerYear: number;
  /** Flat 10-year cost at today's rate */
  tenYearCost: number;
  /** 10-year cost compounded at ELECTRICITY_INFLATION */
  inflatedCost10yr: number;
  /** This device's annual cost as a % of an average home's electricity spend */
  asPercentHomeBill: number;
  /** Annual saving from a 27%-more-efficient replacement */
  efficientSavings: number;
  /** Echoed rate used, for sublabels and insight captions */
  electricRate: number;
  /** Assignable to the engine's CalculatorOutputs (Record<string, number>) */
  [key: string]: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const round2 = (n: number) => Math.round(n * 100) / 100;
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

// ─── Calculation ────────────────────────────────────────────────────────────────

export function calculateApplianceCost(
  inputs: ApplianceCostInputs,
  data: ApplianceCostData,
): ApplianceCostResult {
  const watts = Math.max(0, Number(inputs.watts) || 0);
  const hours = clamp(Number(inputs.hoursPerDay) || 0, 0, 24);
  const days = clamp(Number(inputs.daysPerWeek) || 0, 0, 7);
  const qty = Math.max(1, Math.round(Number(inputs.quantity) || 1));
  const rate = Math.max(0, Number(data.electricRate) || 0);

  // Energy consumed on a day the device runs.
  const kWhPerUseDay = (watts / 1000) * hours * qty;

  const dailyCost = kWhPerUseDay * rate;
  const weeklyCost = dailyCost * days;
  const annualCost = weeklyCost * WEEKS_PER_YEAR;
  const monthlyCost = annualCost / MONTHS_PER_YEAR;
  const kWhPerYear = kWhPerUseDay * days * WEEKS_PER_YEAR;

  const tenYearCost = annualCost * HORIZON_YEARS;

  // Inflation-compounded 10-year cost (year 1 at today's rate).
  let inflated = 0;
  for (let y = 0; y < HORIZON_YEARS; y++) {
    inflated += annualCost * Math.pow(1 + ELECTRICITY_INFLATION, y);
  }

  // Rate cancels here (cost share == energy share), but we compute via cost so
  // the relationship to the displayed dollar figures is explicit.
  const avgHomeAnnualSpend = AVG_HOME_KWH_PER_YEAR * rate;
  const asPercentHomeBill =
    avgHomeAnnualSpend > 0 ? (annualCost / avgHomeAnnualSpend) * 100 : 0;

  return {
    dailyCost: round2(dailyCost),
    weeklyCost: round2(weeklyCost),
    monthlyCost: round2(monthlyCost),
    annualCost: round2(annualCost),
    kWhPerYear: Math.round(kWhPerYear),
    tenYearCost: round2(tenYearCost),
    inflatedCost10yr: round2(inflated),
    asPercentHomeBill: Math.round(asPercentHomeBill * 10) / 10,
    efficientSavings: round2(annualCost * EFFICIENT_SAVINGS_PCT),
    electricRate: rate,
  };
}
