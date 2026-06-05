// ─── US State Fuel Prices Dataset ────────────────────────────────────────────
//
// PURPOSE:
//   State-level average regular unleaded gasoline prices for contextual
//   assumption injection into fuel-consuming engine calculators.
//
// RULES:
//   ✅ Pure TypeScript only — no async, no fetch, no React
//   ✅ SSR-safe — safe to import in server and client components
//   ✅ getUSStateFuelPrice() always returns a number — never throws
//   ✅ Intentionally mutable — Layer 2 / Phase 5C can overwrite at runtime
//   ❌ Never import from components/ or app/
//   ❌ Never call fetch() or any I/O here
//
// USAGE:
//   import { getUSStateFuelPrice, US_STATE_LIST } from "@/lib/datasets/usStateFuelPrices";
//   const price = getUSStateFuelPrice("Texas"); // → 2.95
//   const price = getUSStateFuelPrice("Unknown"); // → 3.85 (national fallback)
//
// DATA SOURCE:
//   EIA Weekly Retail Gasoline Prices — 2024–2025 state averages.
//   Prices in USD per gallon, regular unleaded.
//
// ─────────────────────────────────────────────────────────────────────────────

// ─── Types ────────────────────────────────────────────────────────────────────

export interface USStateFuelDataset {
  /** State name → average price per gallon ($) */
  states: Record<string, number>;
  /** US national average — fallback when state is unknown */
  national: number;
  /** ISO 8601 date — when these defaults were last verified */
  lastUpdated: string;
  /** Human-readable vintage for UI captions, e.g. "May 2026" */
  currentPeriodLabel?: string;
  version: number;
}

// ─── State Prices ─────────────────────────────────────────────────────────────
// Ordered alphabetically. All prices in USD per gallon, regular unleaded.
// Reflects 2024–2025 EIA state averages. High-price states driven by:
//   - CA: blend requirements + LCFS + refinery capacity constraints
//   - HI/AK: geographic isolation
//   - WA/OR: carbon pricing + blend requirements
//   - IL/PA/NY: high state excise taxes

const STATE_FUEL_PRICES: Record<string, number> = {
  "Alabama":              3.96,
  "Alaska":               5.22,
  "Arizona":              4.69,
  "Arkansas":             3.95,
  "California":           6.03,
  "Colorado":             4.38,
  "Connecticut":          4.53,
  "Delaware":             4.13,
  "Florida":              4.07,
  "Georgia":              3.85,
  "Hawaii":               5.64,
  "Idaho":                4.62,
  "Illinois":             4.78,
  "Indiana":              3.69,
  "Iowa":                 3.98,
  "Kansas":               3.91,
  "Kentucky":             4.04,
  "Louisiana":            3.87,
  "Maine":                4.39,
  "Maryland":             4.19,
  "Massachusetts":        4.40,
  "Michigan":             4.38,
  "Minnesota":            4.15,
  "Mississippi":          3.87,
  "Missouri":             4.01,
  "Montana":              4.51,
  "Nebraska":             4.11,
  "Nevada":               5.15,
  "New Hampshire":        4.38,
  "New Jersey":           4.39,
  "New Mexico":           4.14,
  "New York":             4.54,
  "North Carolina":       3.97,
  "North Dakota":         4.02,
  "Ohio":                 4.36,
  "Oklahoma":             3.83,
  "Oregon":               5.23,
  "Pennsylvania":         4.50,
  "Rhode Island":         4.31,
  "South Carolina":       3.92,
  "South Dakota":         4.17,
  "Tennessee":            3.96,
  "Texas":                3.82,
  "Utah":                 4.55,
  "Vermont":              4.48,
  "Virginia":             4.18,
  "Washington":           5.71,
  "West Virginia":        4.34,
  "Wisconsin":            4.17,
  "Wyoming":              4.43,
  "District of Columbia": 4.60,
};

// ─── Mutable Dataset Export ───────────────────────────────────────────────────

export const usStateFuelDataset: USStateFuelDataset = {
  states:             STATE_FUEL_PRICES,
  national:           3.85,
  lastUpdated:        "2026-05-31",
  currentPeriodLabel: "May 2026",
  version:            1,
};

// ─── Sorted State List ────────────────────────────────────────────────────────

/**
 * Alphabetically sorted list of all state names in the dataset.
 * Useful for populating select/dropdown UI elements.
 */
export const US_STATE_LIST: string[] = Object.keys(STATE_FUEL_PRICES).sort();

// ─── Getters ──────────────────────────────────────────────────────────────────

/**
 * Returns the average fuel price per gallon for a given US state.
 * Falls back to the national average if the state name is unrecognised.
 * Never throws — always returns a positive number.
 *
 * @example
 *   getUSStateFuelPrice("California")   // → 4.80
 *   getUSStateFuelPrice("Texas")        // → 2.95
 *   getUSStateFuelPrice("Unknown")      // → 3.85 (national fallback)
 */
export function getUSStateFuelPrice(state: string): number {
  return usStateFuelDataset.states[state] ?? usStateFuelDataset.national;
}
