// ─── VPPExchange Energy Engine — Assumptions ─────────────────────────────────
//
// PURPOSE:
//   VPP Energy Defaults (VED) — sensible national averages for all energy
//   calculator inputs. All values cite their source + year.
//
// USAGE:
//   import { VED, US_UTILITY_BENCHMARKS } from "../energy/assumptions";
//   const rate = VED.utilityRatePerKwh;
//
// RULES:
//   ✅ Pure object constants — no logic, no async, no React
//   ✅ Values can be overridden per-region at runtime via getRegionalRate()
//   ✅ Update annually when EIA/NREL data refreshes
//
// SOURCES:
//   - EIA Electric Power Monthly (2024)       — utility rates
//   - NREL PVWatts (2024)                     — sun hours, performance ratios
//   - EPA eGrid (2024)                        — CO₂ intensity
//   - BloombergNEF BNEF (2024)                — battery costs
//   - Rocky Mountain Institute VPP Market 2024 — VPP program data
//
// ─────────────────────────────────────────────────────────────────────────────

import type { RegionalUtilityBenchmark, UtilityRateStructure } from "./types";

// ─── VPP Energy Defaults (VED) ───────────────────────────────────────────────

export const VED = {
  // ── Utility rates ──────────────────────────────────────────────────────────
  /** US residential average retail price (EIA 2024, $/kWh) */
  utilityRatePerKwh:         0.1659,
  /** TOU on-peak premium multiplier (1.0 = flat) */
  peakRateMultiplier:        1.55,
  /** Average fixed monthly charge ($) */
  fixedMonthlyCharge:        12,

  // ── Solar ──────────────────────────────────────────────────────────────────
  /** National average peak sun hours/day (NREL 2024) */
  avgPeakSunHours:           4.5,
  /** Typical module efficiency (monocrystalline 400W panel) */
  moduleEfficiency:          0.20,
  /** System performance ratio (losses: soiling, wiring, inverter) */
  performanceRatio:          0.80,
  /** Annual panel degradation rate */
  solarDegradationRate:      0.005,
  /** Installed cost per watt ($/W) — utility-scale 2024 avg */
  solarCostPerWatt:          2.95,
  /** Federal ITC (Inflation Reduction Act, through 2032) */
  federalTaxCreditRate:      0.30,

  // ── Battery storage ────────────────────────────────────────────────────────
  /** Installed cost for 10 kWh system ($) — BNEF 2024 */
  batteryInstalledCost10Kwh: 11_500,
  /** Typical residential battery capacity (kWh) */
  batteryCapacityKwh:        10,
  /** Round-trip efficiency */
  batteryEfficiency:         0.90,
  /** Power output (kW) */
  batteryPowerKw:            5,
  /** Annual capacity degradation */
  batteryDegradationRate:    0.02,
  /** Warranty years (industry standard) */
  batteryWarrantyYears:      10,

  // ── VPP programs ───────────────────────────────────────────────────────────
  /** Average dispatch incentive rate ($/kWh) — RMI 2024 */
  vppDispatchRatePerKwh:     0.15,
  /** Typical dispatch events per year */
  vppDispatchEventsPerYear:  15,
  /** Average dispatch event duration (hours) */
  vppEventDurationHours:     3,
  /** Annual capacity enrollment payment ($) */
  vppAnnualCapacityPayment:  100,

  // ── Grid / environment ──────────────────────────────────────────────────────
  /** US average grid carbon intensity (EPA eGrid 2024, kg CO₂/kWh) */
  gridCarbonIntensityKgPerKwh: 0.386,

  // ── Financial ──────────────────────────────────────────────────────────────
  /** Electricity price inflation assumption (per year) */
  electricityInflationRate:  0.027,
  /** Discount rate for NPV calculations */
  discountRate:              0.05,
  /** 20-year US Treasury as equity alternative for opportunity cost */
  stockMarketReturn:         0.07,
} as const;

// ─── Default utility rate structure (flat national average) ──────────────────

export const DEFAULT_UTILITY_RATE: UtilityRateStructure = {
  flatRate:            VED.utilityRatePerKwh,
  fixedMonthlyCharge:  VED.fixedMonthlyCharge,
  netMeteringRate:     VED.utilityRatePerKwh,
};

// ─── Per-state utility benchmarks ────────────────────────────────────────────
// EIA Form 861 (2024) + EPA eGrid (2024).
// ⚠️ Update via scripts/updateEnergyBenchmarks.ts

export const US_UTILITY_BENCHMARKS: RegionalUtilityBenchmark[] = [
  { state: "Hawaii",         averageRatePerKwh: 0.3844, peakRateMultiplier: 1.4, netMeteringAvailable: true,  vppProgramsActive: true,  avgPeakSunHours: 5.7, co2IntensityKgPerKwh: 0.606 },
  { state: "California",     averageRatePerKwh: 0.2902, peakRateMultiplier: 2.0, netMeteringAvailable: true,  vppProgramsActive: true,  avgPeakSunHours: 5.4, co2IntensityKgPerKwh: 0.213 },
  { state: "Massachusetts",  averageRatePerKwh: 0.2714, peakRateMultiplier: 1.6, netMeteringAvailable: true,  vppProgramsActive: true,  avgPeakSunHours: 4.1, co2IntensityKgPerKwh: 0.358 },
  { state: "Connecticut",    averageRatePerKwh: 0.2632, peakRateMultiplier: 1.7, netMeteringAvailable: true,  vppProgramsActive: false, avgPeakSunHours: 4.0, co2IntensityKgPerKwh: 0.355 },
  { state: "Rhode Island",   averageRatePerKwh: 0.2513, peakRateMultiplier: 1.5, netMeteringAvailable: true,  vppProgramsActive: false, avgPeakSunHours: 4.0, co2IntensityKgPerKwh: 0.320 },
  { state: "New Hampshire",  averageRatePerKwh: 0.2291, peakRateMultiplier: 1.5, netMeteringAvailable: true,  vppProgramsActive: false, avgPeakSunHours: 4.0, co2IntensityKgPerKwh: 0.321 },
  { state: "New York",       averageRatePerKwh: 0.2269, peakRateMultiplier: 1.8, netMeteringAvailable: true,  vppProgramsActive: true,  avgPeakSunHours: 4.2, co2IntensityKgPerKwh: 0.246 },
  { state: "Vermont",        averageRatePerKwh: 0.2017, peakRateMultiplier: 1.4, netMeteringAvailable: true,  vppProgramsActive: false, avgPeakSunHours: 4.0, co2IntensityKgPerKwh: 0.155 },
  { state: "Maine",          averageRatePerKwh: 0.1995, peakRateMultiplier: 1.5, netMeteringAvailable: true,  vppProgramsActive: false, avgPeakSunHours: 4.1, co2IntensityKgPerKwh: 0.295 },
  { state: "New Jersey",     averageRatePerKwh: 0.1892, peakRateMultiplier: 1.6, netMeteringAvailable: true,  vppProgramsActive: true,  avgPeakSunHours: 4.3, co2IntensityKgPerKwh: 0.348 },
  { state: "Texas",          averageRatePerKwh: 0.1529, peakRateMultiplier: 1.6, netMeteringAvailable: false, vppProgramsActive: true,  avgPeakSunHours: 5.2, co2IntensityKgPerKwh: 0.411 },
  { state: "Florida",        averageRatePerKwh: 0.1389, peakRateMultiplier: 1.5, netMeteringAvailable: true,  vppProgramsActive: true,  avgPeakSunHours: 5.3, co2IntensityKgPerKwh: 0.453 },
  { state: "Arizona",        averageRatePerKwh: 0.1363, peakRateMultiplier: 1.7, netMeteringAvailable: true,  vppProgramsActive: true,  avgPeakSunHours: 6.1, co2IntensityKgPerKwh: 0.417 },
  { state: "Georgia",        averageRatePerKwh: 0.1330, peakRateMultiplier: 1.4, netMeteringAvailable: false, vppProgramsActive: false, avgPeakSunHours: 5.0, co2IntensityKgPerKwh: 0.496 },
  { state: "Washington",     averageRatePerKwh: 0.1166, peakRateMultiplier: 1.4, netMeteringAvailable: true,  vppProgramsActive: true,  avgPeakSunHours: 4.3, co2IntensityKgPerKwh: 0.120 },
  { state: "Colorado",       averageRatePerKwh: 0.1385, peakRateMultiplier: 1.5, netMeteringAvailable: true,  vppProgramsActive: true,  avgPeakSunHours: 5.4, co2IntensityKgPerKwh: 0.573 },
  { state: "Illinois",       averageRatePerKwh: 0.1490, peakRateMultiplier: 1.5, netMeteringAvailable: true,  vppProgramsActive: true,  avgPeakSunHours: 4.1, co2IntensityKgPerKwh: 0.419 },
  { state: "National Average", averageRatePerKwh: VED.utilityRatePerKwh, peakRateMultiplier: VED.peakRateMultiplier, netMeteringAvailable: true, vppProgramsActive: false, avgPeakSunHours: VED.avgPeakSunHours, co2IntensityKgPerKwh: VED.gridCarbonIntensityKgPerKwh },
];

/** Look up benchmark for a state (falls back to national average) */
export function getBenchmark(state: string): RegionalUtilityBenchmark {
  return (
    US_UTILITY_BENCHMARKS.find(
      (b) => b.state.toLowerCase() === state.toLowerCase()
    ) ?? US_UTILITY_BENCHMARKS.find((b) => b.state === "National Average")!
  );
}
