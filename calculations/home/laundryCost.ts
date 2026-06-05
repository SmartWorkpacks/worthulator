// ─── Laundry Cost — Pure Calculation Module ───────────────────────────────────
//
// PURPOSE:
//   Deterministic per-load and annual laundry cost math, driven by a live
//   state electricity rate, machine type, water temperature, and detergent.
//
// RULES:
//   ✅ Pure TypeScript — synchronous, deterministic, no side effects
//   ✅ Every constant documented with a source
//   ❌ Never import React · never call fetch()
//   ❌ Never read datasets directly — electricRate is INJECTED
//
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Water cost per load: ~30 gallons × $0.004/gal.
 * Source: EPA WaterSense / AWWA rate survey 2024.
 */
export const WATER_COST_PER_LOAD = 0.12;

/**
 * Average laundromat cost per load (wash + dry).
 * Source: Coin Laundry Association industry data 2023–24.
 */
export const LAUNDROMAT_COST_PER_LOAD = 3.50;

/**
 * Machine profiles: washer kWh and dryer kWh per load.
 * Sources:
 *   - HE front-loader: Energy Star Most Efficient 2024 spec
 *   - Modern top-loader: Energy Star certified baseline
 *   - Standard: DOE federal standard baseline
 *   - Older: Pre-2010 non-Energy-Star average (DOE historical data)
 */
export const MACHINE_PROFILES = {
  he_front:  { label: "HE front-loader",       washerKwh: 0.15, dryerKwh: 2.5 },
  modern:    { label: "Modern top-loader",      washerKwh: 0.30, dryerKwh: 3.0 },
  standard:  { label: "Standard",               washerKwh: 0.50, dryerKwh: 3.3 },
  older:     { label: "Older / less efficient",  washerKwh: 0.80, dryerKwh: 4.5 },
} as const;

export type MachineKey = keyof typeof MACHINE_PROFILES;

/**
 * Water temperature multipliers applied to washer kWh only.
 * ~90% of wash-cycle energy goes to heating water (DOE).
 * Cold uses ~20% of the warm baseline; hot uses ~180%.
 */
export const WATER_TEMP_MULTIPLIERS = {
  cold: 0.20,
  warm: 1.00,
  hot:  1.80,
} as const;

export type WaterTempKey = keyof typeof WATER_TEMP_MULTIPLIERS;

// ─── I/O types ────────────────────────────────────────────────────────────────

export interface LaundryCostInputs {
  loadsPerWeek:  number;
  machineType:   MachineKey;
  waterTemp:     WaterTempKey;
  detergentCost: number;
}

export interface LaundryCostData {
  electricRate: number;
}

export interface LaundryCostResult {
  costPerLoad:            number;
  weeklyCost:             number;
  annualCost:             number;
  electricityCostPerLoad: number;
  electricityPct:         number;
  waterCostPerLoad:       number;
  detergentCostPerLoad:   number;
  annualKwh:              number;
  totalKwhPerLoad:        number;
  washerKwhAdj:           number;
  dryerKwh:               number;
  electricRate:           number;
  /** Annual cost if using HE front-loader with cold water */
  heFrontColdAnnual:      number;
  /** Annual cost at a laundromat */
  laundromatAnnual:       number;
  [key: string]: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const round2 = (n: number) => Math.round(n * 100) / 100;

// ─── Calculation ──────────────────────────────────────────────────────────────

export function calculateLaundryCost(
  inputs: LaundryCostInputs,
  data: LaundryCostData,
): LaundryCostResult {
  const loads     = Math.max(0, Math.round(Number(inputs.loadsPerWeek) || 0));
  const detergent = Math.max(0, Number(inputs.detergentCost) || 0);
  const rate      = Math.max(0, Number(data.electricRate) || 0);

  const machine  = MACHINE_PROFILES[inputs.machineType] ?? MACHINE_PROFILES.standard;
  const tempMult = WATER_TEMP_MULTIPLIERS[inputs.waterTemp] ?? 1;

  const washerKwhAdj  = round2(machine.washerKwh * tempMult);
  const dryerKwh      = machine.dryerKwh;
  const totalKwhPerLoad = round2(washerKwhAdj + dryerKwh);

  const electricityCostPerLoad = round2(totalKwhPerLoad * rate);
  const waterCostPerLoad       = WATER_COST_PER_LOAD;
  const costPerLoad            = round2(electricityCostPerLoad + waterCostPerLoad + detergent);

  const weeklyCost = round2(costPerLoad * loads);
  const annualCost = round2(weeklyCost * 52);
  const electricityPct = costPerLoad > 0
    ? Math.round((electricityCostPerLoad / costPerLoad) * 100)
    : 0;
  const annualKwh = Math.round(totalKwhPerLoad * loads * 52);

  // Comparison scenarios
  const heProfile    = MACHINE_PROFILES.he_front;
  const heWasherAdj  = round2(heProfile.washerKwh * WATER_TEMP_MULTIPLIERS.cold);
  const heTotalKwh   = round2(heWasherAdj + heProfile.dryerKwh);
  const heCostPerLoad = round2(heTotalKwh * rate + WATER_COST_PER_LOAD + detergent);
  const heFrontColdAnnual = round2(heCostPerLoad * loads * 52);

  const laundromatAnnual = round2(LAUNDROMAT_COST_PER_LOAD * loads * 52);

  return {
    costPerLoad,
    weeklyCost,
    annualCost,
    electricityCostPerLoad,
    electricityPct,
    waterCostPerLoad,
    detergentCostPerLoad: detergent,
    annualKwh,
    totalKwhPerLoad,
    washerKwhAdj,
    dryerKwh,
    electricRate: rate,
    heFrontColdAnnual,
    laundromatAnnual,
  };
}
