// ─── EV Charging Cost — Pure Calculation Module ───────────────────────────────
//
// PURPOSE:
//   State-accurate, TOU-aware cost breakdown for charging an electric vehicle.
//   Covers home charging (live state rate, optional TOU discount) and public
//   DC fast-charging (national blended rate).
//
// RULES:
//   ✅ Pure TypeScript — synchronous, deterministic, no side effects
//   ✅ Every constant documented with a source
//   ✅ Live electricity rate INJECTED via `data` arg (keeps module testable)
//   ❌ Never import React · never call fetch() · never read datasets directly
//
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Blended US average price for DC fast-charging at public networks
 * (ChargePoint, EVgo, Electrify America), including session/per-minute fees.
 * Source: ICCT / BloombergNEF EV Charging Cost Analysis, 2025.
 * Units: $/kWh effective
 */
export const PUBLIC_DCFC_RATE = 0.43;

/**
 * Typical off-peak discount vs standard residential tariff on a "basic" TOU
 * (Time-of-Use) rate plan. EPRI/ACEEE 2024 utility survey across major US
 * utilities shows off-peak discounts of 15–25%; 20% is the median.
 */
export const TOU_BASIC_DISCOUNT = 0.20;

/**
 * Discount from dedicated EV overnight rider programmes (PG&E E-ELEC, Xcel
 * EV Accelerate, SCE TOU-D-PRIME, Georgia Power TOU-EV-A). These plans run
 * 30–40% below the standard residential rate; 35% is the median.
 */
export const TOU_EV_RATE_DISCOUNT = 0.35;

/**
 * Long-run US residential electricity price inflation.
 * EIA Electric Power Monthly shows ~2–3%/yr over the past two decades;
 * 2.5% is a conservative mid-point.
 */
export const ELECTRICITY_INFLATION = 0.025;

const HORIZON_YEARS  = 10;
const MONTHS_PER_YEAR = 12;
const CENTS_PER_DOLLAR = 100;

// ─── I/O types ────────────────────────────────────────────────────────────────

/** TOU plan tiers available to EV owners. */
export type TouPlan = "none" | "basic" | "ev_rate";

export interface EvChargingInputs {
  /** Miles driven per year */
  milesPerYear: number;
  /** EPA-rated efficiency of the EV — kWh consumed per 100 miles */
  kwhPer100mi: number;
  /** Percentage of miles charged at public DC fast-chargers (0–100) */
  publicChargingPct: number;
  /** Time-of-use or overnight rate plan: none | basic | ev_rate */
  touPlan: TouPlan;
}

export interface EvChargingData {
  /** All-in residential $/kWh for the selected state (injected from dataset) */
  homeRateRaw: number;
}

export interface EvChargingResult {
  /** Home charging cost per year at effective rate */
  homeAnnualCost: number;
  /** Public DC fast-charging cost per year */
  publicAnnualCost: number;
  /** Total annual charging cost (home + public) */
  annualTotalCost: number;
  /** Monthly average */
  monthlyCost: number;
  /** Cost per mile in US cents */
  costPerMileCents: number;
  /** What annualTotalCost would be without any TOU discount */
  noTouAnnualCost: number;
  /** Annual saving from the selected TOU plan (0 if none) */
  touAnnualSaving: number;
  /** Hypothetical annual cost if ALL miles were charged at home */
  homeOnlyAnnualCost: number;
  /** Hypothetical annual cost if ALL miles were charged publicly */
  publicOnlyAnnualCost: number;
  /** Effective home rate after TOU discount (echoed for sublabels/insights) */
  effectiveHomeRate: number;
  /** Raw state home rate before TOU discount (echoed for insights) */
  homeRateRaw: number;
  /** Inflation-adjusted total cost over HORIZON_YEARS years */
  inflatedCost10yr: number;
  /** Flat (no inflation) cost over HORIZON_YEARS years */
  tenYearCost: number;
  /** Required for CalculatorOutputs assignability */
  [key: string]: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const round2 = (n: number) => Math.round(n * 100) / 100;
/** Round to 4 decimal places — used for rates ($/kWh) to preserve precision. */
const round4 = (n: number) => Math.round(n * 10000) / 10000;

/** Map the touPlan string to its fractional discount. */
export function touDiscount(plan: TouPlan): number {
  if (plan === "basic")   return TOU_BASIC_DISCOUNT;
  if (plan === "ev_rate") return TOU_EV_RATE_DISCOUNT;
  return 0;
}

// ─── Calculation ──────────────────────────────────────────────────────────────

export function calculateEvChargingCost(
  inputs: EvChargingInputs,
  data: EvChargingData,
): EvChargingResult {
  const miles   = Math.max(0, Number(inputs.milesPerYear)       || 0);
  const kwh100  = Math.max(0, Number(inputs.kwhPer100mi)        || 0);
  const pubPct  = Math.min(100, Math.max(0, Number(inputs.publicChargingPct) || 0));
  const plan    = (inputs.touPlan ?? "none") as TouPlan;
  const rawRate = Math.max(0, Number(data.homeRateRaw)          || 0);

  // Keep rates at full float precision for calculations; only round echoed outputs.
  const discount          = touDiscount(plan);
  const effectiveHomeRate = rawRate * (1 - discount);   // unrounded for math

  const homeMiles   = miles * (1 - pubPct / 100);
  const publicMiles = miles * (pubPct / 100);
  const kwhPerMile  = kwh100 / 100;

  const homeAnnualCost   = round2(homeMiles   * kwhPerMile * effectiveHomeRate);
  const publicAnnualCost = round2(publicMiles * kwhPerMile * PUBLIC_DCFC_RATE);
  const annualTotalCost  = round2(homeAnnualCost + publicAnnualCost);

  const monthlyCost      = round2(annualTotalCost / MONTHS_PER_YEAR);
  const costPerMileCents = miles > 0
    ? round2((annualTotalCost / miles) * CENTS_PER_DOLLAR)
    : 0;

  // TOU counterfactual — what they'd pay on the unmodified residential rate
  const noTouHomeAnnual  = round2(homeMiles * kwhPerMile * rawRate);
  const noTouAnnualCost  = round2(noTouHomeAnnual + publicAnnualCost);
  const touAnnualSaving  = round2(noTouAnnualCost - annualTotalCost);

  // 100 % home vs 100 % public counterfactuals
  const homeOnlyAnnualCost   = round2(miles * kwhPerMile * effectiveHomeRate);
  const publicOnlyAnnualCost = round2(miles * kwhPerMile * PUBLIC_DCFC_RATE);

  // 10-year costs
  const tenYearCost = round2(annualTotalCost * HORIZON_YEARS);
  let inflated = 0;
  for (let y = 0; y < HORIZON_YEARS; y++) {
    inflated += annualTotalCost * Math.pow(1 + ELECTRICITY_INFLATION, y);
  }
  const inflatedCost10yr = round2(inflated);

  return {
    homeAnnualCost,
    publicAnnualCost,
    annualTotalCost,
    monthlyCost,
    costPerMileCents,
    noTouAnnualCost,
    touAnnualSaving,
    homeOnlyAnnualCost,
    publicOnlyAnnualCost,
    // echoed rates: round4 preserves 3-sig-fig precision for display
    effectiveHomeRate: round4(effectiveHomeRate),
    homeRateRaw:       round4(rawRate),
    inflatedCost10yr,
    tenYearCost,
  };
}
