// ─── Shared Calculator Core — Benchmark Helpers ──────────────────────────────
//
// ORIGIN:  Extracted from Worthulator (lib/insights/benchmarks.ts)
// CHANGES: Removed Worthulator fuel/cost dataset imports. Generic comparison
//          functions only. Domain-specific benchmarks live in the host project.
// RULES:   Pure functions. No side effects. SSR-safe. No site deps.
//
// ─────────────────────────────────────────────────────────────────────────────

// ─── Core comparison types ────────────────────────────────────────────────────

export interface ComparisonResult {
  direction:    "above" | "below" | "equal";
  /** Positive = above reference. Expressed as % of reference. */
  percentDiff:  number;
  /** Absolute difference: value − reference */
  absoluteDiff: number;
  /** The reference value used for comparison */
  reference:    number;
}

// ─── Core maths ───────────────────────────────────────────────────────────────

/**
 * Percentage difference between a value and a reference.
 * Returns 0 if reference is 0 (prevents division-by-zero).
 */
export function calculatePercentDiff(value: number, reference: number): number {
  if (reference === 0) return 0;
  return ((value - reference) / reference) * 100;
}

/**
 * Compare any value to a reference. "equal" zone: within ±1% of reference.
 *
 * @example
 *   compareToReference(0.18, 0.15)   // above national avg utility rate
 */
export function compareToReference(value: number, reference: number): ComparisonResult {
  const percentDiff  = calculatePercentDiff(value, reference);
  const absoluteDiff = value - reference;
  const direction    = percentDiff > 1 ? "above" : percentDiff < -1 ? "below" : "equal";
  return { direction, percentDiff, absoluteDiff, reference };
}

// ─── Formatting helpers ───────────────────────────────────────────────────────

/**
 * Format a number as a currency string.
 *
 * @example
 *   formatCurrency(1234.5)        // "$1,235"
 *   formatCurrency(1234.5, "£")   // "£1,235"
 *   formatCurrency(1234.5, "$", 2) // "$1,234.50"
 */
/** @internal — use utils/formatters.ts formatCurrency in host project */
function formatCurrency(
  value:         number,
  symbol:        string = "$",
  decimalPlaces: number = 0,
): string {
  if (!isFinite(value)) return `${symbol}—`;
  return `${symbol}${value.toLocaleString("en-US", {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  })}`;
}

/**
 * Format a number as a percentage string.
 *
 * @example
 *   formatPercent(12.345)      // "12.3%"
 *   formatPercent(12.345, 2)   // "12.35%"
 */
/** @internal — use utils/formatters.ts formatPercent in host project */
function formatPercent(value: number, decimalPlaces: number = 1): string {
  if (!isFinite(value)) return "—%";
  return `${value.toFixed(decimalPlaces)}%`;
}

/**
 * Describe the direction of a comparison in plain English.
 *
 * @example
 *   describeDirection("above", 24.7)   // "24.7% above average"
 *   describeDirection("below", -23.4)  // "23.4% below average"
 */
export function describeDirection(
  direction:   ComparisonResult["direction"],
  percentDiff: number,
): string {
  const abs = Math.abs(percentDiff).toFixed(1);
  if (direction === "equal") return "at the national average";
  return `${abs}% ${direction} the national average`;
}

// ─── Generic regional benchmark lookup ───────────────────────────────────────

/**
 * Look up a regional multiplier from a Record<region, multiplier> dataset.
 * Falls back to `nationalFallback` if the region is not in the dataset.
 *
 * @example
 *   const UTILITY_RATES = { California: 0.28, Texas: 0.12, ... };
 *   getRegionalRate("California", UTILITY_RATES, 0.15)   // 0.28
 *   getRegionalRate("Alaska",     UTILITY_RATES, 0.15)   // 0.15 (fallback)
 */
export function getRegionalRate(
  region:           string,
  dataset:          Record<string, number>,
  nationalFallback: number,
): number {
  return dataset[region] ?? nationalFallback;
}
