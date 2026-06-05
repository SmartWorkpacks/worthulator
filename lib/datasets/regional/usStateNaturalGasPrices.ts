// ─── US State Natural Gas Prices Dataset ─────────────────────────────────────
//
// PURPOSE:
//   State-level average residential natural gas price ($/therm) for the
//   heating-cost calculator's live state-accurate cost model.
//
// RULES:
//   ✅ Pure TypeScript only — no async, no fetch, no React
//   ✅ SSR-safe — safe to import in server and client components
//   ✅ getUSStateNaturalGasPrice() always returns a number — never throws
//   ✅ Intentionally mutable — refresh scripts may overwrite at runtime
//   ❌ Never import from components/ or app/
//   ❌ Never call fetch() or any I/O here
//
// USAGE:
//   import { getUSStateNaturalGasPrice } from
//     "@/lib/datasets/regional/usStateNaturalGasPrices";
//   const price = getUSStateNaturalGasPrice("Texas");    // → 1.02
//   const price = getUSStateNaturalGasPrice("National"); // → 1.28 (fallback)
//
// DATA SOURCE:
//   EIA Natural Gas Monthly / EIA State Energy Data System (SEDS),
//   2024–2025 average residential retail price per therm (100 cubic feet ≈ 1
//   therm at standard Btu content). Prices include distribution charges.
//   Range: ~$0.82 (Louisiana) to ~$1.90 (New England) — driven primarily by
//   pipeline access, local distribution costs, and state-specific regulation.
//
// ─────────────────────────────────────────────────────────────────────────────

export interface USStateNaturalGasDataset {
  /** State name → average residential price per therm ($) */
  states: Record<string, number>;
  /** US national average — fallback for "National" or unknown state */
  national: number;
  /** ISO 8601 date — when these defaults were last verified */
  lastUpdated: string;
  /** Human-readable vintage for UI captions, e.g. "May 2026" */
  currentPeriodLabel: string;
  version: number;
}

// ─── State Prices ($/therm) ───────────────────────────────────────────────────

const STATE_NATURAL_GAS_PRICES: Record<string, number> = {
  "Alabama":              0.95,
  "Alaska":               1.18,
  "Arizona":              1.15,
  "Arkansas":             0.93,
  "California":           1.62,
  "Colorado":             1.05,
  "Connecticut":          1.78,
  "Delaware":             1.22,
  "Florida":              1.08,
  "Georgia":              1.01,
  "Hawaii":               3.10,
  "Idaho":                1.02,
  "Illinois":             1.14,
  "Indiana":              1.06,
  "Iowa":                 1.00,
  "Kansas":               0.96,
  "Kentucky":             0.98,
  "Louisiana":            0.82,
  "Maine":                1.90,
  "Maryland":             1.28,
  "Massachusetts":        1.85,
  "Michigan":             1.12,
  "Minnesota":            1.08,
  "Mississippi":          0.90,
  "Missouri":             1.00,
  "Montana":              1.10,
  "Nebraska":             0.97,
  "Nevada":               1.12,
  "New Hampshire":        1.88,
  "New Jersey":           1.35,
  "New Mexico":           0.98,
  "New York":             1.55,
  "North Carolina":       1.05,
  "North Dakota":         1.01,
  "Ohio":                 1.09,
  "Oklahoma":             0.88,
  "Oregon":               1.18,
  "Pennsylvania":         1.20,
  "Rhode Island":         1.82,
  "South Carolina":       1.02,
  "South Dakota":         1.04,
  "Tennessee":            0.99,
  "Texas":                1.02,
  "Utah":                 1.00,
  "Vermont":              1.75,
  "Virginia":             1.15,
  "Washington":           1.22,
  "West Virginia":        1.05,
  "Wisconsin":            1.11,
  "Wyoming":              0.92,
  "District of Columbia": 1.40,
};

// ─── Mutable Dataset Export ───────────────────────────────────────────────────

export const usStateNaturalGasDataset: USStateNaturalGasDataset = {
  states:             STATE_NATURAL_GAS_PRICES,
  national:           1.28,
  lastUpdated:        "2026-05-31",
  currentPeriodLabel: "May 2026",
  version:            1,
};

// ─── Getter ───────────────────────────────────────────────────────────────────

/**
 * Returns the average residential natural gas price ($/therm) for a US state.
 * Falls back to the national average for "National" or unknown values.
 * Never throws — always returns a positive number.
 */
export function getUSStateNaturalGasPrice(state: string): number {
  if (!state || state === "National") return usStateNaturalGasDataset.national;
  return usStateNaturalGasDataset.states[state] ?? usStateNaturalGasDataset.national;
}
