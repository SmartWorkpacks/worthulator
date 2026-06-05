// ─── Commute Cost — Pure Calculation Module ───────────────────────────────────
//
// PURPOSE:
//   Deterministic fuel + wear cost math for the "commute-cost" calculator.
//   Converts one-way distance, MPG, and office schedule into a precise annual
//   cost using a live, state-injected gas price.
//
// RULES:
//   ✅ Pure TypeScript — synchronous, deterministic, no side effects
//   ✅ Every constant documented with a source
//   ❌ Never import React · never call fetch()
//   ❌ Never read datasets directly — gasPrice is INJECTED so this stays testable
//
// ─────────────────────────────────────────────────────────────────────────────

/**
 * IRS/AAA wear-and-tear cost per mile: covers oil, tires, brakes, minor
 * repairs — excludes insurance, registration, and depreciation.
 * Source: IRS standard mileage rate breakdown / AAA "Your Driving Costs" 2024.
 */
export const WEAR_COST_PER_MILE = 0.10;

/**
 * Long-run annual US gasoline price inflation.
 * Source: EIA Annual Energy Review — historical retail gasoline prices show
 * ~3%/yr average increase over the past two decades.
 */
export const GAS_INFLATION = 0.03;

/**
 * US EPA/NHTSA average fuel economy for passenger cars, MY 2023–24.
 * Used as the national benchmark in per-mile cost comparison.
 * Source: EPA Automotive Trends Report 2024.
 */
export const NATIONAL_AVG_MPG = 28.0;

/**
 * US Census ACS 2023 mean one-way commute distance for car commuters.
 * Used to contextualise whether a commute is short, average, or long.
 */
export const NATIONAL_AVG_MILES_ONE_WAY = 16.0;

const HORIZON_YEARS = 10;

// ─── I/O types ────────────────────────────────────────────────────────────────

export interface CommuteCostInputs {
  /** One-way distance in miles */
  milesOneWay: number;
  /** Vehicle fuel economy in miles per gallon */
  mpg: number;
  /** Days per week the commuter drives to the office (1–5) */
  officeDaysPerWeek: number;
  /** Weeks per year the commuter drives to the office (accounts for vacation) */
  weeksPerYear: number;
}

export interface CommuteCostData {
  /** Live state gasoline price in $/gal (injected from dataset) */
  gasPrice: number;
}

export interface CommuteCostResult {
  /** Annual fuel cost ($) */
  annualFuelCost: number;
  /** Monthly fuel cost (annualFuelCost / 12) */
  monthlyCost: number;
  /** Fuel cost for one round-trip commute day */
  costPerDay: number;
  /** Total round-trip miles driven per year */
  annualMiles: number;
  /** Fuel cost per mile driven (gasPrice / mpg) */
  fuelCostPerMile: number;
  /** Annual wear-and-tear cost (annualMiles × WEAR_COST_PER_MILE) */
  wearCostPerYear: number;
  /** True annual cost: fuel + wear */
  totalCostPerYear: number;
  /** Effective commute days per year (officeDaysPerWeek × weeksPerYear) */
  effectiveDaysPerYear: number;
  /**
   * What this commute would cost at 5 days/wk × 52 weeks (full-time baseline).
   * Used to compute the WFH saving vs the max-commute scenario.
   */
  fiveDay52AnnualFuelCost: number;
  /**
   * Annual fuel saving vs commuting 5 days/wk × 52 weeks full-time.
   * Positive = user's schedule is cheaper than full-time in-office.
   */
  wfhSavingVs5Days: number;
  /**
   * 10-year cumulative fuel cost compounded at GAS_INFLATION per year.
   * Shows how much prices rise matters over a decade.
   */
  tenYearInflatedCost: number;
  /** Echoed gas price for sublabels and insight captions */
  gasPrice: number;
  /** Required for CalculatorOutputs assignability */
  [key: string]: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const round2 = (n: number) => Math.round(n * 100) / 100;
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

// ─── Calculation ──────────────────────────────────────────────────────────────

export function calculateCommuteCost(
  inputs: CommuteCostInputs,
  data: CommuteCostData,
): CommuteCostResult {
  const miles = Math.max(0, Number(inputs.milesOneWay) || 0);
  const mpg   = Math.max(1, Number(inputs.mpg) || 1);          // guard /0
  const days  = clamp(Number(inputs.officeDaysPerWeek) || 0, 0, 5);
  const weeks = clamp(Number(inputs.weeksPerYear) || 0, 0, 52);
  const price = Math.max(0, Number(data.gasPrice) || 0);

  const effectiveDaysPerYear  = days * weeks;
  const roundTripMiles        = miles * 2;
  const costPerDay            = round2((roundTripMiles / mpg) * price);
  const annualFuelCost        = round2(costPerDay * effectiveDaysPerYear);
  const monthlyCost           = round2(annualFuelCost / 12);
  const annualMiles           = Math.round(roundTripMiles * effectiveDaysPerYear);
  const fuelCostPerMile       = round2(price / mpg);
  const wearCostPerYear       = round2(annualMiles * WEAR_COST_PER_MILE);
  const totalCostPerYear      = round2(annualFuelCost + wearCostPerYear);

  const fiveDay52AnnualFuelCost = round2((roundTripMiles / mpg) * price * 5 * 52);
  const wfhSavingVs5Days        = round2(fiveDay52AnnualFuelCost - annualFuelCost);

  // Inflation-compounded 10-year cumulative fuel cost.
  let tenYearInflated = 0;
  for (let y = 0; y < HORIZON_YEARS; y++) {
    tenYearInflated += annualFuelCost * Math.pow(1 + GAS_INFLATION, y);
  }

  return {
    annualFuelCost,
    monthlyCost,
    costPerDay,
    annualMiles,
    fuelCostPerMile,
    wearCostPerYear,
    totalCostPerYear,
    effectiveDaysPerYear,
    fiveDay52AnnualFuelCost,
    wfhSavingVs5Days,
    tenYearInflatedCost: round2(tenYearInflated),
    gasPrice: price,
  };
}
