// ─── Water Bill — Pure Calculation Module ────────────────────────────────────
//
// PURPOSE:
//   State-accurate annual residential water (and optional sewer) bill based on
//   household size, usage habits, outdoor watering, and a live injected rate.
//
// RULES:
//   ✅ Pure TypeScript — synchronous, deterministic, no side effects
//   ✅ Live rate INJECTED via `data` arg — never read datasets directly
//   ❌ Never import React · never call fetch()
//
// ─────────────────────────────────────────────────────────────────────────────

/**
 * EPA WaterSense 2024 US residential average: gallons per capita per day.
 * Source: https://www.epa.gov/watersense/statistics-and-facts
 */
export const BASE_GPCD = 82;

/**
 * Typical water-only share of a combined water + sewer bill when sewer is
 * volume-linked. AWWA rate surveys: sewer often 45–55% of combined; 0.52
 * is the mid-point used when user selects water-only billing.
 */
export const WATER_ONLY_FRACTION = 0.52;

/**
 * EPA WaterSense: household leaks waste ~10,000 gal/yr on average (~10% of
 * indoor use for homes with a leak). Used for the leak-fix opportunity insight.
 */
export const LEAK_WASTE_PCT = 0.10;

/**
 * Long-run US water/sewer utility price inflation. AWWA and Bluefield Research
 * cite ~3–5%/yr; 3% is a conservative mid-point for projections.
 */
export const WATER_INFLATION = 0.03;

/** Indoor usage tier multipliers relative to EPA average. */
export const USAGE_MULTIPLIERS: Record<string, number> = {
  low:     0.75,
  average: 1.00,
  high:    1.35,
};

/** Outdoor irrigation multiplier applied to total household GPCD. */
export const OUTDOOR_MULTIPLIERS: Record<string, number> = {
  none:     1.00,
  seasonal: 1.20,
  heavy:    1.45,
};

export type UsageLevel = "low" | "average" | "high";
export type OutdoorLevel = "none" | "seasonal" | "heavy";
export type BillingType = "combined" | "water_only";

const HORIZON_YEARS   = 10;
const MONTHS_PER_YEAR = 12;
const DAYS_PER_YEAR   = 365;

// ─── I/O types ────────────────────────────────────────────────────────────────

export interface WaterBillInputs {
  householdSize:   number;
  usageLevel:      UsageLevel;
  outdoorWatering: OutdoorLevel;
  billingType:     BillingType;
}

export interface WaterBillData {
  /** Combined water + sewer $/1,000 gal (injected from state dataset) */
  combinedRatePer1000Gal: number;
  /** National reference rate for benchmark comparisons */
  nationalRatePer1000Gal: number;
}

export interface WaterBillResult {
  annualWaterCost:      number;
  monthlyCost:          number;
  dailyCost:            number;
  gallonsPerDay:        number;
  annualGallons:        number;
  effectiveRate:        number;
  costPerPerson:        number;
  lowUsageAnnualCost:   number;
  lowUsageSaving:       number;
  leakFixSaving:        number;
  nationalRefAnnual:    number;
  vsNationalPct:        number;
  tenYearCost:          number;
  inflatedCost10yr:     number;
  indoorGallonsPct:     number;
  /** Echoed combined rate before water-only adjustment */
  combinedRate:         number;
  [key: string]: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const round2 = (n: number) => Math.round(n * 100) / 100;

function effectiveRate(combinedRate: number, billing: BillingType): number {
  const base = Math.max(0, combinedRate);
  return billing === "water_only" ? base * WATER_ONLY_FRACTION : base;
}

function computeGallons(
  householdSize: number,
  usage: UsageLevel,
  outdoor: OutdoorLevel,
): { daily: number; annual: number } {
  const people   = Math.max(0, Math.round(Number(householdSize) || 0));
  const usageMult  = USAGE_MULTIPLIERS[usage]   ?? 1.0;
  const outdoorMult = OUTDOOR_MULTIPLIERS[outdoor] ?? 1.0;
  const daily    = people * BASE_GPCD * usageMult * outdoorMult;
  const annual   = daily * DAYS_PER_YEAR;
  return { daily, annual };
}

function computeCost(annualGallons: number, rate: number): number {
  return round2((annualGallons / 1000) * rate);
}

// ─── Calculation ──────────────────────────────────────────────────────────────

export function calculateWaterBill(
  inputs: WaterBillInputs,
  data: WaterBillData,
): WaterBillResult {
  const usage   = (inputs.usageLevel      ?? "average") as UsageLevel;
  const outdoor = (inputs.outdoorWatering ?? "none")    as OutdoorLevel;
  const billing = (inputs.billingType     ?? "combined") as BillingType;

  const combinedRate = Math.max(0, Number(data.combinedRatePer1000Gal) || 0);
  const nationalRate = Math.max(0, Number(data.nationalRatePer1000Gal) || 0);
  const rate         = effectiveRate(combinedRate, billing);

  const { daily, annual } = computeGallons(Number(inputs.householdSize), usage, outdoor);
  const people = Math.max(0, Math.round(Number(inputs.householdSize) || 0));

  const annualWaterCost = computeCost(annual, rate);
  const monthlyCost     = people > 0 ? round2(annualWaterCost / MONTHS_PER_YEAR) : 0;
  const dailyCost       = people > 0 ? round2(annualWaterCost / DAYS_PER_YEAR)   : 0;
  const costPerPerson   = people > 0 ? round2(annualWaterCost / people)          : 0;

  // Low-usage counterfactual (same outdoor + billing)
  const lowGallons      = computeGallons(people, "low", outdoor);
  const lowUsageAnnualCost = computeCost(lowGallons.annual, rate);
  const lowUsageSaving     = round2(Math.max(0, annualWaterCost - lowUsageAnnualCost));

  const leakFixSaving = round2(annualWaterCost * LEAK_WASTE_PCT);

  const nationalRefAnnual = computeCost(
    annual,
    effectiveRate(nationalRate, billing),
  );
  const vsNationalPct = nationalRefAnnual > 0
    ? round2(((annualWaterCost - nationalRefAnnual) / nationalRefAnnual) * 100)
    : 0;

  const tenYearCost = round2(annualWaterCost * HORIZON_YEARS);
  let inflated = 0;
  for (let y = 0; y < HORIZON_YEARS; y++) {
    inflated += annualWaterCost * Math.pow(1 + WATER_INFLATION, y);
  }
  const inflatedCost10yr = round2(inflated);

  // Indoor share of gallons (outdoor portion for donut insight)
  const outdoorMult = OUTDOOR_MULTIPLIERS[outdoor] ?? 1.0;
  const indoorGallonsPct = outdoorMult > 1
    ? round2((1 / outdoorMult) * 100)
    : 100;

  return {
    annualWaterCost,
    monthlyCost,
    dailyCost,
    gallonsPerDay:      Math.round(daily),
    annualGallons:      Math.round(annual),
    effectiveRate:      round2(rate),
    costPerPerson,
    lowUsageAnnualCost,
    lowUsageSaving,
    leakFixSaving,
    nationalRefAnnual,
    vsNationalPct,
    tenYearCost,
    inflatedCost10yr,
    indoorGallonsPct,
    combinedRate:       round2(combinedRate),
  };
}
