// ─── Home Heating Cost — Pure Calculation Module ──────────────────────────────
//
// PURPOSE:
//   State-accurate annual home heating cost by fuel type (gas, electric,
//   propane), adjusted for home size and insulation quality. Produces
//   cross-fuel comparison outputs so users can evaluate switching options.
//
// RULES:
//   ✅ Pure TypeScript — synchronous, deterministic, no side effects
//   ✅ Every constant documented with a source
//   ✅ Live prices INJECTED via `data` arg (keeps module testable)
//   ❌ Never import React · never call fetch() · never read datasets directly
//
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Baseline residential heating load: kBtu lost per square foot per heating day
 * for a reference code-minimum 2000s home in a moderate US climate.
 * Derived from EIA RECS 2020 (avg 77 MMBtu/yr for gas homes, avg 150 HDD×sqft
 * proxy) and ASHRAE 90.1 envelope assumptions.
 * Units: kBtu / (sqft × heating-day)
 */
export const BASE_KBTU_PER_SQFT_PER_DAY = 0.035;

/**
 * Median AFUE (Annual Fuel Utilization Efficiency) of the installed US gas
 * furnace fleet. EIA RECS 2020 shows ~80% AFUE is the modal value; high-
 * efficiency 96% units are growing but remain a minority.
 */
export const GAS_FURNACE_EFFICIENCY = 0.80;

/**
 * Propane furnaces use the same AFUE distribution as gas; most propane
 * systems are converted gas equipment.
 */
export const PROPANE_FURNACE_EFFICIENCY = 0.80;

/**
 * Exact conversion factor: 1 therm = 100,000 Btu = 100 kBtu.
 * Used to convert kBtu heat load to therms of gas.
 */
export const KBTU_PER_THERM = 100;

/**
 * Exact conversion factor: 1 kWh = 3,412 Btu = 3.412 kBtu.
 * Electric resistance heating is effectively 100% efficient (COP = 1).
 */
export const KBTU_PER_KWH = 3.412;

/**
 * Propane energy content: 1 gallon = 91,500 Btu = 91.5 kBtu.
 * Source: EIA propane energy content table.
 */
export const KBTU_PER_PROPANE_GALLON = 91.5;

/**
 * National average propane price ($/gallon), 2024–2025.
 * Source: EIA Weekly Propane Residential Prices. Range across states is
 * narrower than gas, so a national average is an adequate proxy here.
 */
export const US_PROPANE_NATIONAL_AVG = 2.60;

/**
 * Long-run US residential energy price inflation used for projections.
 * EIA long-term energy outlook: 2–3%/yr for residential fuels; 2.5% is the
 * conservative mid-point.
 */
export const ENERGY_INFLATION = 0.025;

const HORIZON_YEARS   = 10;
const MONTHS_PER_YEAR = 12;

// ─── Insulation multipliers ───────────────────────────────────────────────────

/**
 * Insulation quality → energy use multiplier relative to the reference
 * "average" home (1.00).
 *
 * "poor"      1.40  Pre-1980 minimal insulation; R-11 walls, single-pane glass.
 * "average"   1.00  Reference — code-min 2000s; R-19 walls, double-pane.
 * "good"      0.80  Well-insulated; R-21+ walls, air-sealed, thermal bridging
 *                   addressed. Represents a well-maintained modern home.
 * "excellent" 0.65  Passive-house-class; R-30+ walls, triple-pane, balanced
 *                   HRV/ERV. ~35% less energy than code-min.
 *
 * Source: DOE Building America Research; ACEEE residential efficiency data.
 */
export const INSULATION_MULTIPLIERS: Record<string, number> = {
  poor:      1.40,
  average:   1.00,
  good:      0.80,
  excellent: 0.65,
};

export type HeatSource = "gas" | "electric" | "propane";
export type InsulationLevel = "poor" | "average" | "good" | "excellent";

// ─── I/O types ────────────────────────────────────────────────────────────────

export interface HeatingCostInputs {
  /** Heating days per year (climate proxy) */
  heatingDays: number;
  /** Conditioned floor area in square feet */
  homeSqFt: number;
  /** Primary heat source */
  heatSource: HeatSource;
  /** Insulation quality tier */
  insulation: InsulationLevel;
}

export interface HeatingCostData {
  /** Residential natural gas $/therm for selected state (injected) */
  gasPrice: number;
  /** All-in residential electricity $/kWh for selected state (injected) */
  electricRate: number;
  /** Propane $/gallon (injected). Falls back to the US national average. */
  propanePrice?: number;
}

export interface HeatingCostResult {
  /** Annual heating cost for the selected fuel */
  annualHeatingCost: number;
  /** Monthly average */
  monthlyCost: number;
  /** Cost on an average heating day */
  costPerHeatingDay: number;
  /** Total heat energy required per year */
  annualKBtu: number;
  /** Annual cost if using natural gas (for comparison) */
  annualGasCost: number;
  /** Annual cost if using electric resistance (for comparison) */
  annualElecCost: number;
  /** Annual cost if using propane (for comparison) */
  annualPropaneCost: number;
  /** Annual therms of gas used (or equivalent for other fuels) */
  thermsEquivalent: number;
  /** Saving from upgrading insulation from current level to "excellent" */
  insulationUpgradeSaving: number;
  /** Flat 10-year cost at today's rates */
  tenYearCost: number;
  /** 10-year cost with energy price inflation */
  inflatedCost10yr: number;
  /** Echoed gas price for sublabels/insights */
  gasPrice: number;
  /** Echoed electric rate for sublabels/insights */
  electricRate: number;
  /** Echoed propane price for sublabels/insights */
  propanePrice: number;
  /** Required for CalculatorOutputs assignability */
  [key: string]: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const round2 = (n: number) => Math.round(n * 100) / 100;

function computeAnnualGasCost(annualKBtu: number, gasPrice: number): number {
  const therms = annualKBtu / KBTU_PER_THERM;
  return round2((therms / GAS_FURNACE_EFFICIENCY) * gasPrice);
}

function computeAnnualElecCost(annualKBtu: number, electricRate: number): number {
  const kwh = annualKBtu / KBTU_PER_KWH;
  // Electric resistance = COP 1.00 (100% efficient)
  return round2(kwh * electricRate);
}

function computeAnnualPropaneCost(annualKBtu: number, propanePrice: number): number {
  const gallons = annualKBtu / KBTU_PER_PROPANE_GALLON;
  return round2((gallons / PROPANE_FURNACE_EFFICIENCY) * propanePrice);
}

// ─── Calculation ──────────────────────────────────────────────────────────────

export function calculateHeatingCost(
  inputs: HeatingCostInputs,
  data: HeatingCostData,
): HeatingCostResult {
  const days        = Math.max(1, Math.round(Number(inputs.heatingDays) || 1));
  const sqFt        = Math.max(0, Number(inputs.homeSqFt)   || 0);
  const heatSource  = (inputs.heatSource  ?? "gas")     as HeatSource;
  const insulation  = (inputs.insulation  ?? "average") as InsulationLevel;
  const gasPrice    = Math.max(0, Number(data.gasPrice)     || 0);
  const electricRate = Math.max(0, Number(data.electricRate) || 0);
  const propanePrice = Math.max(0, Number(data.propanePrice) || US_PROPANE_NATIONAL_AVG);

  const insulMult   = INSULATION_MULTIPLIERS[insulation] ?? 1.0;

  // Heat energy needed per year (kBtu)
  const baseKBtuPerDay = sqFt * BASE_KBTU_PER_SQFT_PER_DAY * insulMult;
  const annualKBtu     = round2(baseKBtuPerDay * days);

  // Per-fuel annual costs
  const annualGasCost     = computeAnnualGasCost(annualKBtu, gasPrice);
  const annualElecCost    = computeAnnualElecCost(annualKBtu, electricRate);
  const annualPropaneCost = computeAnnualPropaneCost(annualKBtu, propanePrice);

  // Selected fuel cost
  const annualHeatingCost =
    heatSource === "electric" ? annualElecCost
    : heatSource === "propane" ? annualPropaneCost
    : annualGasCost;

  const monthlyCost      = round2(annualHeatingCost / MONTHS_PER_YEAR);
  const costPerHeatingDay = round2(annualHeatingCost / days);

  // Therms equivalent (for "how much fuel do you use?" context)
  const thermsEquivalent = round2(annualKBtu / KBTU_PER_THERM);

  // Insulation upgrade saving: what if they had "excellent" insulation?
  const excellentMult    = INSULATION_MULTIPLIERS.excellent;
  const excellentKBtu    = round2(sqFt * BASE_KBTU_PER_SQFT_PER_DAY * excellentMult * days);
  const excellentCost    =
    heatSource === "electric" ? computeAnnualElecCost(excellentKBtu, electricRate)
    : heatSource === "propane" ? computeAnnualPropaneCost(excellentKBtu, propanePrice)
    : computeAnnualGasCost(excellentKBtu, gasPrice);
  const insulationUpgradeSaving = round2(Math.max(0, annualHeatingCost - excellentCost));

  // 10-year projections
  const tenYearCost = round2(annualHeatingCost * HORIZON_YEARS);
  let inflated = 0;
  for (let y = 0; y < HORIZON_YEARS; y++) {
    inflated += annualHeatingCost * Math.pow(1 + ENERGY_INFLATION, y);
  }
  const inflatedCost10yr = round2(inflated);

  return {
    annualHeatingCost,
    monthlyCost,
    costPerHeatingDay,
    annualKBtu,
    annualGasCost,
    annualElecCost,
    annualPropaneCost,
    thermsEquivalent,
    insulationUpgradeSaving,
    tenYearCost,
    inflatedCost10yr,
    gasPrice: round2(gasPrice),
    electricRate: Math.round(electricRate * 10000) / 10000,
    propanePrice: round2(propanePrice),
  };
}
