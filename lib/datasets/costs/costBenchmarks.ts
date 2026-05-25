// ─── WorthCore Cost Benchmarks ────────────────────────────────────────────────
//
// PURPOSE:
//   The ONLY layer calculators should consume for cost-of-living benchmarks.
//   Provides flat, national-average benchmarks across 8 cost categories.
//   City-level overrides live in lib/datasets/usCostOfLiving.ts.
//
//   Refresh by running:
//     npx tsx scripts/updateCostBenchmarks.ts
//
// RULES (read before editing):
//   ✅ Pure TypeScript only — no async, no fetch, no React
//   ✅ SSR-safe — safe to import in server components and client components
//   ✅ Always returns a valid number — never throws, never undefined
//   ✅ Intentionally mutable at module level — updateCostBenchmarks.ts overwrites
//      the values block and the `lastUpdated` field
//   ❌ Calculators must NEVER fetch live data — import from here instead
//   ❌ Never import from components/ or app/ (circular deps)
//   ❌ Never call fetch() here
//
// DATA FLOW:
//   Apify/Expatistan (8-city avg) → scripts/updateCostBenchmarks.ts → this file → calculators
//
// RELATIONSHIP TO usCostOfLiving.ts:
//   usCostOfLiving.ts  = per-city data for coffee / cigarettes / fuel / meal
//   costBenchmarks.ts  = national flat benchmarks for budgeting & affordability
//   Both can be imported together — no overlap in what they provide.
//
// USAGE PATTERN IN CALCULATORS:
//   import { costBenchmarks } from "@/lib/datasets/costs/costBenchmarks";
//   const { groceriesMonthlyUs, fuelPerGallonUs, gymMonthlyUs } = costBenchmarks;
//
// DATA SOURCES:
//   Groceries:        USDA Official Food Plans 2025 (Moderate-cost, 2-adult)
//   Utilities:        EIA / BLS CES CXUUTILHOSELB0101M — also Expatistan (8-city avg)
//   Childcare:        HHS / Care.com 2025 Cost of Care Survey
//   Subscriptions:    Forbes Advisor / Chase 2025 Subscription Spend Survey
//   Fuel:             EIA EMD_EPD2D_PTE_NUS_DPG (weekly average, May 2026)
//   Coffee:           Expatistan 8-city US average — cappuccino, expat area
//   Cigarettes:       Expatistan 8-city US average / CDC STATE System 2025
//   Restaurant meal:  Expatistan 8-city avg — "dinner for two" ÷ 2
//   Gym:              Expatistan 8-city avg — "1 month gym membership"
//   Rent (normal):    Expatistan 8-city avg — 900 sqft furnished, normal area
//   Rent (expensive): Expatistan 8-city avg — 900 sqft furnished, expensive area
//   Business lunch:   Expatistan 8-city avg — lunchtime menu, business district
//   Public transit:   Expatistan 8-city avg — monthly public transport ticket
//
// LAST UPDATED:
//   2026-05-19 — sourced from EIA DEMO_KEY + static survey data

// ─── Interface ───────────────────────────────────────────────────────────────

export interface CostBenchmarks {
  // ── Household monthly costs (USD/month) ────────────────────────────────

  /** Average monthly grocery spend for a 2-adult US household (USD) */
  groceriesMonthlyUs: number;

  /** Average monthly utilities cost (electricity, gas, water) per household (USD) */
  utilitiesMonthlyUs: number;

  /** Average monthly cost of center-based infant childcare, national (USD) */
  childcareMonthlyUs: number;

  /** Average monthly household spend across all digital subscriptions (USD) */
  subscriptionsMonthlyUs: number;

  // ── Per-unit costs ──────────────────────────────────────────────────────

  /** Average retail price per gallon of regular unleaded gasoline, US national (USD) */
  fuelPerGallonUs: number;

  /** Average café price per cup of drip coffee or latte, US national (USD) */
  coffeePerCupUs: number;

  /** Average retail price per pack of cigarettes, national weighted avg incl. taxes (USD) */
  cigarettesPerPackUs: number;

  /** Average cost per person for a sit-down restaurant meal, US national (USD) */
  restaurantMealUs: number;

  // ── Derived annual values ───────────────────────────────────────────────

  /** Daily coffee habit cost if purchased every day (coffeePerCupUs × 365) */
  coffeeAnnualIfDaily: number;

  /** Daily cigarette habit annual cost at 1 pack/day (cigarettesPerPackUs × 365) */
  cigarettesAnnualIfDaily: number;

  /** Annual grocery spend (groceriesMonthlyUs × 12) */
  groceriesAnnualUs: number;

  // ── Expatistan-sourced benchmarks (multi-city US average) ──────────────

  /**
   * Average monthly gym membership in business/expat area, 8-city US average (USD).
   * Source: Expatistan — "1 month of gym membership in business district"
   */
  gymMonthlyUs: number;

  /**
   * Average monthly rent for 900 sqft furnished apartment, normal area, 8-city US avg (USD).
   * Source: Expatistan — "Monthly rent for 85 m2 (900 sqft) furnished accommodation in normal area"
   */
  rentNormalMonthlyUs: number;

  /**
   * Average monthly rent for 900 sqft furnished apartment, expensive area, 8-city US avg (USD).
   * Source: Expatistan — "Monthly rent for 85 m2 (900 sqft) furnished accommodation in expensive area"
   */
  rentExpensiveMonthlyUs: number;

  /**
   * Average cost of a business-district lunch (including drink), 8-city US avg (USD).
   * Source: Expatistan — "Basic lunchtime menu (including a drink) in the business district"
   */
  businessLunchUs: number;

  /**
   * Average monthly public transit pass cost, 8-city US average (USD).
   * Source: Expatistan — "Monthly ticket public transport"
   */
  publicTransitMonthlyUs: number;
  // ── Food & dining behavior benchmarks ──────────────────────────────────────

  /**
   * Average cost of a fast food combo meal (McDonald's-tier), 8-city US avg (USD).
   * Source: Expatistan — "Combo meal at McDonalds or similar"
   */
  fastFoodComboUs: number;

  /**
   * Average cost per person at an inexpensive restaurant (1 course), 8-city US avg (USD).
   * Source: Expatistan — "Inexpensive restaurant, 1 person, 1 course"
   */
  inexpensiveRestaurantMealUs: number;

  /**
   * Average total delivery app order cost per meal (food + platform fee + tip estimate).
   * Derived: inexpensiveRestaurantMealUs × 1.38 — reflects DoorDash/Uber Eats typical markup.
   */
  deliveryAppMealUs: number;
  // ── Context benchmarks ──────────────────────────────────────────────────

  /**
   * Typical "entry budget" grocery spend — single adult, thrifty plan (USD/month).
   * Source: USDA Thrifty Food Plan 2025
   */
  groceriesThriftyAdultUs: number;

  /**
   * National average spend on streaming subscriptions only (USD/month).
   * Subset of subscriptionsMonthlyUs — useful for subscription-auditor framing.
   */
  streamingOnlyMonthlyUs: number;

  // ── Metadata ───────────────────────────────────────────────────────────

  /** ISO 8601 timestamp of the last successful refresh */
  lastUpdated: string;

  /** Human-readable label for the current data vintage (e.g. "May 2026") */
  currentPeriodLabel: string;

  /** Data schema version — increment when fields are added or removed */
  version: number;
}

// ─── Benchmark Dataset ───────────────────────────────────────────────────────

export const costBenchmarks: CostBenchmarks = {
  // ── Monthly household costs ───────────────────────────────────────────
  groceriesMonthlyUs:      770,    // USDA moderate-cost plan, 2-adult, 2025
  utilitiesMonthlyUs:      221.5,   // Expatistan 8-city US avg — May 2026
  childcareMonthlyUs:     1650,    // Care.com 2025 — center-based infant, national avg
  subscriptionsMonthlyUs:   91,    // Forbes/Chase 2025 — avg household, all digital subs

  // ── Per-unit costs ────────────────────────────────────────────────────
  fuelPerGallonUs:          3.65,   // Expatistan 8-city US avg — May 2026
  coffeePerCupUs:           6.57,   // Expatistan 8-city US avg — May 2026
  cigarettesPerPackUs:      12.13,   // Expatistan 8-city US avg — May 2026
  restaurantMealUs:        35.25,   // Expatistan 8-city US avg — May 2026

  // ── Derived annual values (recalculated by updateCostBenchmarks.ts) ───
  coffeeAnnualIfDaily:      Math.round(4.90 * 365),       // 1,789
  cigarettesAnnualIfDaily:  Math.round(9.80 * 365),       // 3,577
  groceriesAnnualUs:        Math.round(770 * 12),         // 9,240

  // ── Expatistan 8-city US averages (Nashville, Atlanta, Dallas, Denver, ─────
  //    Chicago, Seattle, Boston, Los Angeles — May 2026)                   ─────
  gymMonthlyUs:            85.25,   // Expatistan 8-city US avg — May 2026
  rentNormalMonthlyUs:   2408.88,   // Expatistan 8-city US avg — May 2026
  rentExpensiveMonthlyUs: 3404.25,   // Expatistan 8-city US avg — May 2026
  businessLunchUs:          23.13,   // Expatistan 8-city US avg — May 2026
  publicTransitMonthlyUs:   95.63,   // Expatistan 8-city US avg — May 2026
  // ── Food & dining behavior benchmarks (Expatistan 8-city avg + derived) ────
  fastFoodComboUs:             13,   // Expatistan 8-city US avg — May 2026
  inexpensiveRestaurantMealUs: 20.75,   // Numbeo 8-city US avg — May 2026
  deliveryAppMealUs:           28.64,   // derived: inexpensive restaurant × 1.38 delivery markup
  // ── Context benchmarks ────────────────────────────────────────────────
  groceriesThriftyAdultUs:   320,  // USDA Thrifty Food Plan — single adult, 2025
  streamingOnlyMonthlyUs:     47,  // Antenna/Forbes — avg household streaming-only spend

  // ── Metadata ──────────────────────────────────────────────────────────
  lastUpdated:        "2026-05-22T17:25:47.088Z",
  currentPeriodLabel: "May 2026",
  version:            2,
};

// ─── Convenience accessor ────────────────────────────────────────────────────

/**
 * Returns the named benchmark value, or `fallback` if the value is not finite.
 * Protects calculators against runtime mutation errors during a mid-write refresh.
 */
export function getCostBenchmark(
  key: Exclude<keyof CostBenchmarks, "lastUpdated" | "currentPeriodLabel" | "version">,
  fallback: number,
): number {
  const v = costBenchmarks[key] as number;
  return Number.isFinite(v) ? v : fallback;
}
