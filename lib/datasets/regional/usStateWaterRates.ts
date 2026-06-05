// ─── US State Water Rates Dataset ────────────────────────────────────────────
//
// PURPOSE:
//   State-level average combined residential water + sewer price ($/1,000 gal)
//   for the water-bill-calculator's live state-accurate cost model.
//
// RULES:
//   ✅ Pure TypeScript only — no async, no fetch, no React
//   ✅ SSR-safe — safe to import in server and client components
//   ✅ getUSStateWaterRate() always returns a number — never throws
//   ✅ Intentionally mutable — refresh scripts may overwrite at runtime
//   ❌ Never import from components/ or app/
//
// USAGE:
//   import { getUSStateWaterRate } from "@/lib/datasets/regional/usStateWaterRates";
//   const rate = getUSStateWaterRate("Texas");    // → 6.80
//   const rate = getUSStateWaterRate("National"); // → 8.00 (fallback)
//
// DATA SOURCE:
//   AWWA / Bluefield Research / state utility commission residential averages,
//   2024–2025 combined water + sewer ($/1,000 gallons). Refreshed via Apify
//   from published state average monthly bill tables (converted using EPA
//   reference household usage). Range: ~$5.40 (West Virginia) to ~$14.50
//   (Hawaii) — driven by infrastructure age, drought pricing, and sewer surcharges.
//
// ─────────────────────────────────────────────────────────────────────────────

export interface USStateWaterRatesDataset {
  /** State name → combined water + sewer $/1,000 gallons */
  states: Record<string, number>;
  /** US national average — fallback for "National" or unknown state */
  national: number;
  /** ISO 8601 date — when these defaults were last verified */
  lastUpdated: string;
  /** Human-readable vintage for UI captions, e.g. "Jun 2026" */
  currentPeriodLabel: string;
  version: number;
}

// ─── State Rates ($/1,000 gal combined water + sewer) ─────────────────────────

const STATE_WATER_RATES: Record<string, number> = {
  "Alabama":              6.90,
  "Alaska":              14.20,
  "Arizona":             11.40,
  "Arkansas":             6.20,
  "California":          12.80,
  "Colorado":             9.10,
  "Connecticut":         10.60,
  "Delaware":             8.40,
  "Florida":              7.60,
  "Georgia":              7.20,
  "Hawaii":              14.50,
  "Idaho":                6.80,
  "Illinois":             8.20,
  "Indiana":              7.40,
  "Iowa":                 6.50,
  "Kansas":               7.00,
  "Kentucky":             6.40,
  "Louisiana":            6.10,
  "Maine":                9.20,
  "Maryland":             9.80,
  "Massachusetts":       10.40,
  "Michigan":             7.80,
  "Minnesota":            7.30,
  "Mississippi":          5.90,
  "Missouri":             7.10,
  "Montana":              7.50,
  "Nebraska":             6.60,
  "Nevada":              10.20,
  "New Hampshire":        9.50,
  "New Jersey":          10.80,
  "New Mexico":           7.70,
  "New York":            10.20,
  "North Carolina":       7.50,
  "North Dakota":         6.30,
  "Ohio":                 7.90,
  "Oklahoma":             6.70,
  "Oregon":               9.40,
  "Pennsylvania":         8.60,
  "Rhode Island":        10.00,
  "South Carolina":       7.30,
  "South Dakota":         6.50,
  "Tennessee":            7.00,
  "Texas":                6.80,
  "Utah":                 7.40,
  "Vermont":              9.80,
  "Virginia":             8.10,
  "Washington":           9.20,
  "West Virginia":        5.40,
  "Wisconsin":            5.80,
  "Wyoming":              6.90,
  "District of Columbia": 11.50,
};

// ─── Mutable Dataset Export ───────────────────────────────────────────────────

export const usStateWaterRatesDataset: USStateWaterRatesDataset = {
  states:             STATE_WATER_RATES,
  national:           8.00,
  lastUpdated:        "2026-06-01",
  currentPeriodLabel: "Jun 2026",
  version:            1,
};

// ─── Getter ───────────────────────────────────────────────────────────────────

/**
 * Returns the average combined residential water + sewer rate ($/1,000 gal)
 * for a US state. Falls back to national for "National" or unknown values.
 * Never throws — always returns a positive number.
 */
export function getUSStateWaterRate(state: string): number {
  if (!state || state === "National") return usStateWaterRatesDataset.national;
  return usStateWaterRatesDataset.states[state] ?? usStateWaterRatesDataset.national;
}
