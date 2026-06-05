// ─── US State Median Hourly Wage Dataset ─────────────────────────────────────
//
// PURPOSE:
//   State-level median hourly wages for contextual assumption injection into
//   time-based calculators (screen-time-impact, procrastination-cost,
//   meeting-cost, freelance-rate-calculator).
//
// DATA SOURCE:
//   BLS Occupational Employment and Wage Statistics (OEWS), May 2024.
//   All-occupations median hourly wage by state.
//   https://www.bls.gov/oes/current/oes_nat.htm
//
// RULES:
//   ✅ Pure TypeScript — no async, no fetch, no React
//   ✅ SSR-safe — safe to import in server and client components
//   ✅ getUSStateMedianWage() always returns a number — never throws
//   ❌ Never import from components/ or app/
//
// USAGE:
//   import { getUSStateMedianWage } from "@/lib/datasets/regional/usStateMedianWages";
//   const wage = getUSStateMedianWage("California"); // → 27.30
//   const wage = getUSStateMedianWage("National");   // → 23.11 (fallback)
//
// ─────────────────────────────────────────────────────────────────────────────

export interface USStateMedianWageDataset {
  states: Record<string, number>;
  national: number;
  lastUpdated: string;
  currentPeriodLabel: string;
  version: number;
}

// BLS OEWS May 2024 — all-occupations median hourly wage by state
export const usStateMedianWageDataset: USStateMedianWageDataset = {
  national: 23.11,
  lastUpdated: "2025-03-28",
  currentPeriodLabel: "May 2024",
  version: 1,
  states: {
    "Alabama":              19.29,
    "Alaska":               27.25,
    "Arizona":              22.13,
    "Arkansas":             18.25,
    "California":           27.30,
    "Colorado":             26.01,
    "Connecticut":          27.58,
    "Delaware":             23.52,
    "District of Columbia": 39.93,
    "Florida":              20.63,
    "Georgia":              21.19,
    "Hawaii":               25.15,
    "Idaho":                20.70,
    "Illinois":             24.05,
    "Indiana":              20.72,
    "Iowa":                 21.08,
    "Kansas":               20.82,
    "Kentucky":             19.92,
    "Louisiana":            18.88,
    "Maine":                22.72,
    "Maryland":             26.43,
    "Massachusetts":        29.88,
    "Michigan":             22.01,
    "Minnesota":            25.00,
    "Mississippi":          17.30,
    "Missouri":             21.06,
    "Montana":              21.30,
    "Nebraska":             21.10,
    "Nevada":               21.62,
    "New Hampshire":        24.37,
    "New Jersey":           27.05,
    "New Mexico":           20.38,
    "New York":             27.07,
    "North Carolina":       21.34,
    "North Dakota":         23.05,
    "Ohio":                 21.42,
    "Oklahoma":             19.44,
    "Oregon":               24.87,
    "Pennsylvania":         22.71,
    "Rhode Island":         24.62,
    "South Carolina":       19.69,
    "South Dakota":         19.75,
    "Tennessee":            20.17,
    "Texas":                21.67,
    "Utah":                 22.56,
    "Vermont":              23.29,
    "Virginia":             25.12,
    "Washington":           29.34,
    "West Virginia":        18.52,
    "Wisconsin":            22.45,
    "Wyoming":              22.09,
  },
};

/** Get median hourly wage for a state. Falls back to national average. */
export function getUSStateMedianWage(state: string): number {
  if (!state || state === "National") return usStateMedianWageDataset.national;
  return (
    usStateMedianWageDataset.states[state] ??
    usStateMedianWageDataset.national
  );
}

/** Dropdown options for calculators using wage data. */
export const US_WAGE_STATE_OPTIONS: { label: string; value: string }[] = [
  { label: "National average ($23.11/hr)", value: "National" },
  ...Object.entries(usStateMedianWageDataset.states)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([name, wage]) => ({
      label: `${name} — $${wage.toFixed(2)}/hr`,
      value: name,
    })),
];
