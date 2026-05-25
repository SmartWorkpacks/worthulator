// ─── VPPExchange Energy Engine — Types ───────────────────────────────────────
//
// PURPOSE:
//   Strongly-typed interfaces for all VPPExchange energy calculators.
//   Covers VPP participation, battery storage, solar ROI, utility billing,
//   and regional utility intelligence.
//
// RULES:
//   ✅ Pure TypeScript — no React, no async, no fetch
//   ✅ SSR-safe
//   ❌ Never import from components/ or app/
//
// ─────────────────────────────────────────────────────────────────────────────

// ─── Utility Rate Structures ─────────────────────────────────────────────────

/** Residential electricity tariff structure */
export interface UtilityRateStructure {
  /** Flat rate in $/kWh */
  flatRate?: number;
  /** Time-of-use tiers */
  touTiers?: TouTier[];
  /** Tiered volumetric pricing */
  volumeTiers?: VolumeTier[];
  /** Monthly fixed/demand charge in $ */
  fixedMonthlyCharge?: number;
  /** Net metering export rate ($/kWh) — may differ from import rate */
  netMeteringRate?: number;
  /** Feed-in tariff ($/kWh) — for markets with FiT programs */
  feedInTariff?: number;
}

export interface TouTier {
  name:        string;          // e.g. "On-peak", "Off-peak", "Super off-peak"
  ratePerKwh:  number;
  startHour:   number;          // 0–23
  endHour:     number;          // 0–23
  daysOfWeek?: number[];        // 0=Sun, 6=Sat — omit for all days
}

export interface VolumeTier {
  name:         string;
  upToKwh:      number;         // Infinity for the last tier
  ratePerKwh:   number;
}

// ─── Battery Storage ─────────────────────────────────────────────────────────

export interface BatterySystemSpec {
  /** Usable capacity in kWh */
  capacityKwh:      number;
  /** Round-trip efficiency (0–1, e.g. 0.9 for 90%) */
  efficiency:       number;
  /** Rated power output in kW */
  powerKw:          number;
  /** Degradation per year (0–1, e.g. 0.02 for 2%/yr) */
  annualDegradation?: number;
  /** Warranty period in years */
  warrantyYears?:   number;
  /** Installed cost in $ */
  installedCost?:   number;
}

export interface BatteryRoiInputs {
  system:              BatterySystemSpec;
  utilityRate:         UtilityRateStructure;
  /** Daily average kWh load that battery supports */
  dailyLoadKwh:        number;
  /** Hours per day the battery discharges into the grid / home */
  dailyDischargeHours: number;
  /** Local state/utility for regional benchmark comparison */
  region?:             string;
}

export interface BatteryRoiOutputs {
  annualSavingsEstimate:   number;
  paybackPeriodYears:      number;
  tenYearNetValue:         number;
  twentyYearNetValue:      number;
  lifetimeKwhGenerated:    number;
  co2OffsetTonnes:         number;
}

// ─── Solar PV ─────────────────────────────────────────────────────────────────

export interface SolarSystemSpec {
  /** System size in kW (DC) */
  systemSizeKw:       number;
  /** Module efficiency (0–1) */
  moduleEfficiency:   number;
  /** Performance ratio (0–1, accounts for soiling, shading etc.) */
  performanceRatio:   number;
  /** Annual degradation rate (0–1, e.g. 0.005 for 0.5%/yr) */
  annualDegradation?: number;
  /** Installed cost in $ */
  installedCost:      number;
  /** Federal/state tax credit applied to cost (0–1) */
  taxCreditRate?:     number;
}

export interface SolarRoiInputs {
  system:           SolarSystemSpec;
  utilityRate:      UtilityRateStructure;
  /** Peak sun hours per day for the installation location */
  peakSunHours:     number;
  /** Monthly baseline grid consumption in kWh (pre-solar) */
  monthlyBaselineKwh: number;
  region?:          string;
}

export interface SolarRoiOutputs {
  annualProductionKwh:     number;
  annualSavings:           number;
  paybackPeriodYears:      number;
  twentyFiveYearNetValue:  number;
  breakEvenYear:           number;
  co2OffsetTonnesPerYear:  number;
  effectiveCostAfterCredit: number;
}

// ─── VPP Participation ────────────────────────────────────────────────────────

export interface VppProgramSpec {
  /** Program name / utility provider */
  name:                  string;
  /** Per-kWh incentive rate during dispatch events ($/kWh) */
  dispatchRatePerKwh:    number;
  /** Annual capacity payment for program enrollment ($) */
  annualCapacityPayment?: number;
  /** Average number of dispatch events per year */
  dispatchEventsPerYear: number;
  /** Average duration of each event in hours */
  eventDurationHours:    number;
  /** Maximum kWh the battery can export per event */
  maxExportPerEventKwh:  number;
}

export interface VppParticipationInputs {
  battery:       BatterySystemSpec;
  program:       VppProgramSpec;
  utilityRate:   UtilityRateStructure;
  region?:       string;
}

export interface VppParticipationOutputs {
  annualVppRevenue:         number;
  annualGridArbitrageSavings: number;
  totalAnnualBenefit:       number;
  fiveYearBenefit:          number;
  tenYearBenefit:           number;
  paybackPeriodYears:       number;
  revenuePerKwh:            number;
}

// ─── Regional Utility Intelligence ───────────────────────────────────────────

export interface RegionalUtilityBenchmark {
  state:                 string;
  averageRatePerKwh:     number;   // $/kWh residential average
  peakRateMultiplier:    number;   // Peak rate ÷ flat rate (TOU index)
  netMeteringAvailable:  boolean;
  vppProgramsActive:     boolean;
  avgPeakSunHours:       number;
  co2IntensityKgPerKwh:  number;   // kg CO₂ per kWh generated
}

// ─── Energy Insight Context ───────────────────────────────────────────────────

export interface EnergyInsightContext {
  region?:              string;
  utilityProvider?:     string;
  programType?:         "vpp" | "solar" | "battery" | "combined";
  hasNetMetering?:      boolean;
  hasTouRates?:         boolean;
}
