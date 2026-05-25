// ─── Expatistan Cost Transformers ─────────────────────────────────────────────
//
// PURPOSE:
//   Pure transformation layer that converts raw Expatistan price items (scraped
//   via Apify) into normalized WorthCore benchmark values.
//
//   This file is the ONLY place where Expatistan item names are mapped to
//   WorthCore field names. If Expatistan renames an item, update the patterns
//   here — no other file needs to change.
//
// RULES:
//   ✅ Pure TypeScript — no async, no fetch, no side effects
//   ✅ SSR-safe — safe to import anywhere
//   ✅ Deterministic — same input always produces same output
//   ✅ Fallback-safe — missing items produce no output (not errors)
//   ❌ Never import from components/ or app/
//   ❌ Never call fetch() here
//
// USAGE (in scripts/updateCostBenchmarks.ts):
//   const items = await apifyFetch(...);
//   const benchmarks = transformExpatistanToBenchmarks(items);
//   // benchmarks is Partial<CostBenchmarks> — patch only what changed
//
// CITY WEIGHTING:
//   The 8 representative US cities used for averaging are chosen to avoid
//   distortion from extreme-cost outliers (NYC, San Francisco) while still
//   covering high-cost metros (Seattle, Boston, LA). This produces a realistic
//   "national average" rather than a metro-elite benchmark.
//
//   Cities: Nashville · Atlanta · Dallas · Denver · Chicago · Seattle · Boston · Los Angeles

import type { CostBenchmarks } from "./costBenchmarks";

// ─── Raw Apify Output Types ───────────────────────────────────────────────────

/** A single price item returned from the Apify Expatistan scrape */
export interface RawExpatistanItem {
  /** Expatistan URL slug, e.g. "chicago" or "los-angeles" */
  slug:       string;
  /** Full item label as scraped from the page, lowercased */
  itemName:   string;
  /** Price in USD — already parsed to number, > 0 */
  priceUsd:   number;
}

/** Output from one scraped Expatistan city page */
export interface RawExpatistanCityPage {
  /** The city URL slug */
  slug:  string;
  /** All items scraped from this city page */
  items: Pick<RawExpatistanItem, "itemName" | "priceUsd">[];
}

// ─── Item Pattern Map ─────────────────────────────────────────────────────────
// Maps a WorthCore benchmark key to a substring pattern that matches the
// Expatistan item name (lowercase). The FIRST matching pattern wins.
//
// Item names are matched via String.includes() on the lowercased item name.
// If Expatistan renames an item, update the pattern string here.

type ExpatistanMappedKey =
  | "coffeePerCupUs"
  | "cigarettesPerPackUs"
  | "utilitiesMonthlyUs"
  | "restaurantMealUs"
  | "gymMonthlyUs"
  | "rentNormalMonthlyUs"
  | "rentExpensiveMonthlyUs"
  | "businessLunchUs"
  | "publicTransitMonthlyUs"
  | "fastFoodComboUs"
  | "inexpensiveRestaurantMealUs"
  | "fuelPerGallonUs"; // unit conversion required

interface PatternEntry {
  key:       ExpatistanMappedKey;
  /** Substring to match in the lowercased item name */
  pattern:   string;
  /**
   * Optional transform applied to the raw USD price before storing.
   * Use for unit conversions (e.g. liters → gallons) or per-person splits.
   */
  transform?: (raw: number) => number;
  /**
   * Optional secondary pattern that must ALSO be absent (exclusion guard).
   * Prevents "in expensive area" matching the "in normal area" rule.
   */
  exclude?: string;
}

const LITERS_PER_GALLON = 3.785411784;

export const EXPATISTAN_PATTERN_MAP: PatternEntry[] = [
  // ── Entertainment ─────────────────────────────────────────────────────────
  {
    key:     "coffeePerCupUs",
    pattern: "cappuccino in expat area",
  },
  {
    key:     "gymMonthlyUs",
    pattern: "gym membership in business district",
  },
  {
    // "basic dinner out for two in neighborhood pub" → per-person
    key:      "restaurantMealUs",
    pattern:  "dinner out for two in neighborhood pub",
    transform: (raw) => Math.round(raw / 2),
  },

  // ── Personal Care ─────────────────────────────────────────────────────────
  {
    key:     "cigarettesPerPackUs",
    pattern: "package of marlboro cigarettes",
  },

  // ── Housing ───────────────────────────────────────────────────────────────
  {
    // Must NOT contain "expensive" — that's the expensive-area rule
    key:     "rentNormalMonthlyUs",
    pattern: "monthly rent for 85 m2 (900 sqft) furnished accommodation in normal area",
  },
  {
    key:     "rentExpensiveMonthlyUs",
    pattern: "monthly rent for 85 m2 (900 sqft) furnished accommodation in expensive area",
  },
  {
    // "utilities 1 month (heating, electricity, gas ...) for 2 people in 85m2 flat"
    key:     "utilitiesMonthlyUs",
    pattern: "utilities 1 month",
    // Only match the 2-person / 85m2 version (not the studio version)
    exclude: "45 m2",
  },

  // ── Food ──────────────────────────────────────────────────────────────────
  {
    key:     "businessLunchUs",
    pattern: "basic lunchtime menu (including a drink) in the business district",
  },  {
    key:     "fastFoodComboUs",
    pattern: "combo meal in fast food restaurant",
  },
  {
    key:     "inexpensiveRestaurantMealUs",
    pattern: "inexpensive restaurant, 1 person",
  },
  // ── Transportation ────────────────────────────────────────────────────────
  {
    key:       "fuelPerGallonUs",
    // Expatistan reports per-liter; convert to per-gallon for WorthCore
    pattern:   "1 liter (1/4 gallon) of gas",
    transform: (raw) => Math.round(raw * LITERS_PER_GALLON * 100) / 100,
  },
  {
    key:     "publicTransitMonthlyUs",
    pattern: "monthly ticket public transport",
  },
];

// ─── Core Transform ───────────────────────────────────────────────────────────

/**
 * Matches a single item name against the pattern map.
 * Returns `{ key, value }` if matched, or `null` if no pattern matches.
 */
export function matchExpatistanItem(
  itemName: string,
  priceUsd: number,
): { key: ExpatistanMappedKey; value: number } | null {
  const lower = itemName.toLowerCase().trim();

  for (const entry of EXPATISTAN_PATTERN_MAP) {
    if (!lower.includes(entry.pattern)) continue;
    if (entry.exclude && lower.includes(entry.exclude)) continue;

    const value = entry.transform ? entry.transform(priceUsd) : priceUsd;
    if (!Number.isFinite(value) || value <= 0) continue;

    return { key: entry.key, value };
  }

  return null;
}

/**
 * Aggregates raw Expatistan city pages into per-key price buckets.
 * Each key accumulates all matched values across all cities for averaging.
 */
function aggregate(
  pages: RawExpatistanCityPage[],
): Map<ExpatistanMappedKey, number[]> {
  const buckets = new Map<ExpatistanMappedKey, number[]>();

  for (const page of pages) {
    for (const item of page.items) {
      if (!item.itemName || !Number.isFinite(item.priceUsd) || item.priceUsd <= 0) continue;
      const match = matchExpatistanItem(item.itemName, item.priceUsd);
      if (!match) continue;

      if (!buckets.has(match.key)) buckets.set(match.key, []);
      buckets.get(match.key)!.push(match.value);
    }
  }

  return buckets;
}

/**
 * Transforms an array of raw Expatistan city pages into a partial
 * `CostBenchmarks` object containing only the fields that could be derived.
 *
 * - Averages across all cities for each matched key
 * - Rounds to 2 decimal places
 * - Silently skips keys with no data (returns no partial update for that key)
 *
 * @param pages   Array of scraped city pages from Apify
 * @param minCities Minimum number of valid city samples required before
 *                  accepting a key's value (default: 3). Keys with fewer
 *                  samples are excluded from the output.
 */
export function transformExpatistanToBenchmarks(
  pages:      RawExpatistanCityPage[],
  minCities = 3,
): Partial<Pick<CostBenchmarks, ExpatistanMappedKey>> {
  const buckets = aggregate(pages);
  const result: Partial<Pick<CostBenchmarks, ExpatistanMappedKey>> = {};

  for (const [key, values] of buckets.entries()) {
    if (values.length < minCities) continue;

    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const rounded = Math.round(avg * 100) / 100;

    if (!Number.isFinite(rounded) || rounded <= 0) continue;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (result as any)[key] = rounded;
  }

  return result;
}

// ─── Diagnostic Helper ────────────────────────────────────────────────────────

/**
 * Returns a human-readable summary of transformation results.
 * Useful for logging in the update script.
 */
export function summarizeTransformation(
  pages:  RawExpatistanCityPage[],
  result: Partial<Pick<CostBenchmarks, ExpatistanMappedKey>>,
): string {
  const lines: string[] = [
    `Expatistan transform: ${pages.length} cities → ${Object.keys(result).length} benchmark fields`,
  ];

  for (const [key, value] of Object.entries(result) as [ExpatistanMappedKey, number][]) {
    lines.push(`  ${key}: ${value}`);
  }

  const missing = EXPATISTAN_PATTERN_MAP
    .map((e) => e.key)
    .filter((k) => !(k in result));

  if (missing.length) {
    lines.push(`  ⚠️  Not enough city samples for: ${missing.join(", ")}`);
  }

  return lines.join("\n");
}
