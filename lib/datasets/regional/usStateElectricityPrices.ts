// ─── US State Residential Electricity Prices Dataset ─────────────────────────
//
// PURPOSE:
//   State-level average residential electricity prices ($/kWh) for contextual
//   assumption injection into energy-consuming engine calculators
//   (primarily the EV vs Gas calculator's home-charging cost).
//
// RULES:
//   ✅ Pure TypeScript only — no async, no fetch, no React
//   ✅ SSR-safe — safe to import in server and client components
//   ✅ getUSStateElectricityPrice() always returns a number — never throws
//   ✅ Intentionally mutable — refresh scripts may overwrite at runtime
//   ❌ Never import from components/ or app/
//   ❌ Never call fetch() or any I/O here
//
// USAGE:
//   import { getUSStateElectricityPrice } from "@/lib/datasets/regional/usStateElectricityPrices";
//   const rate = getUSStateElectricityPrice("California"); // → 0.31
//   const rate = getUSStateElectricityPrice("National");   // → 0.165 (fallback)
//
// DATA SOURCE:
//   EIA Electric Power Monthly — average residential retail price by state.
//   Prices in USD per kWh. Reflects 2024-2025 EIA state averages.
//
// ─────────────────────────────────────────────────────────────────────────────

export interface USStateElectricityDataset {
  /** State name → average residential price per kWh ($) */
  states: Record<string, number>;
  /** US national average — fallback when state is unknown / "National" */
  national: number;
  /** ISO 8601 date — when these defaults were last verified */
  lastUpdated: string;
  /** Human-readable vintage for UI captions, e.g. "May 2026" */
  currentPeriodLabel: string;
  version: number;
}

// ─── State Prices ($/kWh, residential) ────────────────────────────────────────
// EIA 2024-25 residential averages. High-price states driven by:
//   - HI: imported oil-fired generation
//   - CA/New England (CT/MA/RI/NH/ME): high delivery + clean-energy costs
//   - Pacific NW (WA/OR/ID) + Plains/Mountain (UT/ND/WY): cheap hydro/coal

const STATE_ELECTRICITY_PRICES: Record<string, number> = {
  "Alabama":              0.162,
  "Alaska":               0.258,
  "Arizona":              0.160,
  "Arkansas":             0.127,
  "California":           0.332,
  "Colorado":             0.168,
  "Connecticut":          0.308,
  "Delaware":             0.163,
  "Florida":              0.158,
  "Georgia":              0.141,
  "Hawaii":               0.430,
  "Idaho":                0.126,
  "Illinois":             0.178,
  "Indiana":              0.161,
  "Iowa":                 0.127,
  "Kansas":               0.151,
  "Kentucky":             0.134,
  "Louisiana":            0.129,
  "Maine":                0.322,
  "Maryland":             0.201,
  "Massachusetts":        0.305,
  "Michigan":             0.200,
  "Minnesota":            0.154,
  "Mississippi":          0.147,
  "Missouri":             0.122,
  "Montana":              0.133,
  "Nebraska":             0.118,
  "Nevada":               0.144,
  "New Hampshire":        0.265,
  "New Jersey":           0.231,
  "New Mexico":           0.151,
  "New York":             0.300,
  "North Carolina":       0.146,
  "North Dakota":         0.116,
  "Ohio":                 0.175,
  "Oklahoma":             0.129,
  "Oregon":               0.146,
  "Pennsylvania":         0.203,
  "Rhode Island":         0.295,
  "South Carolina":       0.161,
  "South Dakota":         0.132,
  "Tennessee":            0.128,
  "Texas":                0.154,
  "Utah":                 0.133,
  "Vermont":              0.233,
  "Virginia":             0.160,
  "Washington":           0.141,
  "West Virginia":        0.144,
  "Wisconsin":            0.187,
  "Wyoming":              0.130,
  "District of Columbia": 0.240,
};

// ─── Mutable Dataset Export ───────────────────────────────────────────────────

export const usStateElectricityDataset: USStateElectricityDataset = {
  states:             STATE_ELECTRICITY_PRICES,
  national:           0.165,
  lastUpdated:        "2026-05-31",
  currentPeriodLabel: "May 2026",
  version:            1,
};

// ─── Getter ───────────────────────────────────────────────────────────────────

/**
 * Returns the average residential electricity price ($/kWh) for a US state.
 * Falls back to the national average for "National" or unknown values.
 * Never throws — always returns a positive number.
 */
export function getUSStateElectricityPrice(state: string): number {
  if (!state || state === "National") return usStateElectricityDataset.national;
  return usStateElectricityDataset.states[state] ?? usStateElectricityDataset.national;
}
