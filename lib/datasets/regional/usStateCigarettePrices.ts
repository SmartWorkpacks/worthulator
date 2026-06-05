// ─── US State Cigarette Prices Dataset ───────────────────────────────────────
//
// PURPOSE:
//   State-level average retail price for a pack of cigarettes ($/pack), for the
//   quit-smoking calculator's "your cost vs your state average" benchmark.
//
// RULES:
//   ✅ Pure TypeScript only — no async, no fetch, no React
//   ✅ SSR-safe — safe to import in server and client components
//   ✅ getUSStateCigarettePrice() always returns a number — never throws
//   ✅ Intentionally mutable — refresh scripts may overwrite at runtime
//   ❌ Never import from components/ or app/
//   ❌ Never call fetch() or any I/O here
//
// USAGE:
//   import { getUSStateCigarettePrice } from "@/lib/datasets/regional/usStateCigarettePrices";
//   const price = getUSStateCigarettePrice("New York");   // → 11.96
//   const price = getUSStateCigarettePrice("National");   // → 8.00 (fallback)
//
// DATA SOURCE:
//   CDC "Tax Burden on Tobacco" + Tax Foundation state cigarette excise data,
//   2024–2025 average retail pack price (incl. state excise + sales tax).
//   Prices in USD per 20-cigarette pack.
//   High-price states (NY, IL, CT, WA, RI, MA, DC) are driven by high state
//   excise taxes; low-price states (MO, GA, ND, NC, TN) by minimal excise.
//
// ─────────────────────────────────────────────────────────────────────────────

export interface USStateCigaretteDataset {
  /** State name → average price per pack ($) */
  states: Record<string, number>;
  /** US national average — fallback when state is unknown / "National" */
  national: number;
  /** ISO 8601 date — when these defaults were last verified */
  lastUpdated: string;
  /** Human-readable vintage for UI captions, e.g. "May 2026" */
  currentPeriodLabel: string;
  version: number;
}

// ─── State Prices ($/pack) ────────────────────────────────────────────────────

const STATE_CIGARETTE_PRICES: Record<string, number> = {
  "Alabama":              6.18,
  "Alaska":               9.79,
  "Arizona":              8.14,
  "Arkansas":             6.55,
  "California":           8.97,
  "Colorado":             7.42,
  "Connecticut":          11.43,
  "Delaware":             6.96,
  "Florida":              7.31,
  "Georgia":              5.95,
  "Hawaii":               10.36,
  "Idaho":                6.38,
  "Illinois":             11.59,
  "Indiana":              6.61,
  "Iowa":                 7.43,
  "Kansas":               7.06,
  "Kentucky":             6.56,
  "Louisiana":            6.74,
  "Maine":                8.79,
  "Maryland":             8.85,
  "Massachusetts":        10.69,
  "Michigan":             8.18,
  "Minnesota":            9.69,
  "Mississippi":          6.43,
  "Missouri":             6.11,
  "Montana":              7.46,
  "Nebraska":             6.85,
  "Nevada":               8.27,
  "New Hampshire":        7.18,
  "New Jersey":           9.16,
  "New Mexico":           7.95,
  "New York":             11.96,
  "North Carolina":       6.14,
  "North Dakota":         6.27,
  "Ohio":                 7.38,
  "Oklahoma":             7.27,
  "Oregon":               8.55,
  "Pennsylvania":         8.91,
  "Rhode Island":         11.05,
  "South Carolina":       6.42,
  "South Dakota":         7.02,
  "Tennessee":            6.30,
  "Texas":                7.49,
  "Utah":                 7.84,
  "Vermont":              9.62,
  "Virginia":             6.42,
  "Washington":           10.14,
  "West Virginia":        6.49,
  "Wisconsin":            8.62,
  "Wyoming":              6.35,
  "District of Columbia": 10.88,
};

// ─── Mutable Dataset Export ───────────────────────────────────────────────────

export const usStateCigaretteDataset: USStateCigaretteDataset = {
  states:             STATE_CIGARETTE_PRICES,
  national:           8.00,
  lastUpdated:        "2026-05-31",
  currentPeriodLabel: "May 2026",
  version:            1,
};

// ─── Getter ───────────────────────────────────────────────────────────────────

/**
 * Returns the average cigarette pack price ($) for a US state.
 * Falls back to the national average for "National" or unknown values.
 * Never throws — always returns a positive number.
 */
export function getUSStateCigarettePrice(state: string): number {
  if (!state || state === "National") return usStateCigaretteDataset.national;
  return usStateCigaretteDataset.states[state] ?? usStateCigaretteDataset.national;
}
