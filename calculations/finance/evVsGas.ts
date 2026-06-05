// ─── EV vs Gas calculation module ────────────────────────────────────────────
// Pure functions only. No UI, no data fetching, no module-level mutable state.
// State-level gas + electricity prices are injected via `data` (from the
// fuel/electricity datasets), keeping this module deterministic and testable.
//
// CLEVER REALISM (verified by tests):
//   - EV charging is rarely 100% at home. The effective $/kWh is a BLEND of the
//     home rate and public DC fast-charging (which is ~3x more expensive), so a
//     road-tripper's EV economics differ from a home-charger's.
//   - Savings can go negative in high-electricity states with an efficient gas
//     car — the model reports the real sign rather than flooring at zero.

import type { CalculatorValues, CalculatorOutputs } from "@/components/calculator-engine/types";

// ─── Documented model constants ───────────────────────────────────────────────

/**
 * Average public DC fast-charging price, US 2025 (~$0.40-0.45/kWh).
 * Source: blended public-network pricing (Electrify America, EVgo, etc.).
 */
export const PUBLIC_DCFC_RATE = 0.43;

/**
 * Average EV purchase-price premium over a comparable gas vehicle, US 2025.
 * Source: Cox Automotive / Kelley Blue Book median transaction price gap
 * (~$50,000 EV median vs ~$42,500 gas median). Used for break-even framing.
 */
export const EV_PRICE_PREMIUM = 7_500;

/** Historical long-run gasoline price inflation (~4%/yr). Used for projection. */
export const GAS_INFLATION = 0.04;

/**
 * EV annual maintenance savings vs a comparable ICE vehicle (~$800/yr):
 * no oil changes, fewer brake jobs (regen braking), no transmission service.
 * Source: Consumer Reports lifetime maintenance analysis.
 */
export const EV_MAINT_SAVINGS_PER_YEAR = 800;

const PROJECTION_YEARS = 10;

// ─── Data interface ─────────────────────────────────────────────────────────

/** State-level energy prices required by the model. */
export interface EvVsGasData {
  /** Regular unleaded gasoline price ($/gallon) */
  gasPrice: number;
  /** Residential electricity price ($/kWh) for home charging */
  homeElectricRate: number;
}

// ─── Module ───────────────────────────────────────────────────────────────────

export function calculateEvVsGas(
  inputs: CalculatorValues,
  data: EvVsGasData,
): CalculatorOutputs {
  const miles       = Number(inputs.milesPerYear);
  const mpg         = Number(inputs.mpg);
  const kwhPer100mi = Number(inputs.kwhPer100mi);
  const publicPct   = Math.max(0, Math.min(100, Number(inputs.publicChargingPct ?? 0))) / 100;

  const gasPrice = Number(data.gasPrice);
  const homeRate = Number(data.homeElectricRate);

  if (
    !isFinite(miles) || !isFinite(mpg) || !isFinite(kwhPer100mi) ||
    miles <= 0 || mpg <= 0 || kwhPer100mi <= 0
  ) {
    return {
      annualSavings: 0, annualGasCost: 0, annualEvCost: 0,
      gasCostPerMile: 0, evCostPerMile: 0, effectiveKwhRate: 0,
      gasPrice: 0, homeElectricRate: 0,
      fiveYearSavings: 0, tenYearSavings: 0, breakEvenYears: 0,
      fuelInflationSavings10yr: 0, maintenanceSavings10yr: 0, totalAdvantage10yr: 0,
    };
  }

  // Blended cost of a kWh given the home/public charging mix.
  const effectiveKwhRate = homeRate * (1 - publicPct) + PUBLIC_DCFC_RATE * publicPct;

  const annualGasCost = (miles / mpg) * gasPrice;
  const annualEvCost  = (miles / 100) * kwhPer100mi * effectiveKwhRate;
  const annualSavings = annualGasCost - annualEvCost;

  const gasCostPerMile = gasPrice / mpg;
  const evCostPerMile  = (kwhPer100mi / 100) * effectiveKwhRate;

  const fiveYearSavings = annualSavings * 5;
  const tenYearSavings  = annualSavings * PROJECTION_YEARS;

  const breakEvenYears =
    annualSavings > 0 ? Math.round((EV_PRICE_PREMIUM / annualSavings) * 10) / 10 : 99;

  // Gas prices drift up ~4%/yr; EV electricity cost held flat. Sum the widening
  // annual gap over 10 years (never letting a single year go negative).
  let fuelInflationSavings10yr = 0;
  for (let i = 0; i < PROJECTION_YEARS; i++) {
    fuelInflationSavings10yr += Math.max(0, annualGasCost * Math.pow(1 + GAS_INFLATION, i) - annualEvCost);
  }

  const maintenanceSavings10yr = EV_MAINT_SAVINGS_PER_YEAR * PROJECTION_YEARS;
  const totalAdvantage10yr     = fuelInflationSavings10yr + maintenanceSavings10yr;

  return {
    annualSavings:   Math.round(annualSavings),
    annualGasCost:   Math.round(annualGasCost),
    annualEvCost:    Math.round(annualEvCost),
    gasCostPerMile:  Math.round(gasCostPerMile * 1000) / 1000,
    evCostPerMile:   Math.round(evCostPerMile * 1000) / 1000,
    effectiveKwhRate: Math.round(effectiveKwhRate * 1000) / 1000,
    gasPrice:        Math.round(gasPrice * 100) / 100,
    homeElectricRate: Math.round(homeRate * 1000) / 1000,
    fiveYearSavings: Math.round(fiveYearSavings),
    tenYearSavings:  Math.round(tenYearSavings),
    breakEvenYears,
    fuelInflationSavings10yr: Math.round(fuelInflationSavings10yr),
    maintenanceSavings10yr:   Math.round(maintenanceSavings10yr),
    totalAdvantage10yr:       Math.round(totalAdvantage10yr),
  };
}
