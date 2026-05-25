// ─── WVE Entity Registry Types — Phase 13/14 ────────────────────────────────
// Type definitions for the scalable entity ingestion system.
// WVE is a CONTEXTUAL ECONOMIC INTERPRETATION PLATFORM.
// Pure TypeScript — no runtime side-effects, SSR-safe.

import type {
  EstimationType,
  VerticalSlug,
  EconomicEntityClass,
  EconomicModel,
  LifecycleType,
  VolatilityProfile,
} from "../types";

// ── Core entity structure ──────────────────────────────────────────────────
export interface RegistryEntity {
  /** Unique slug — used as URL intent slug and formula engine key */
  id: string;

  /** Display name shown to users */
  canonicalName: string;

  /** All known aliases, typo variants, and common search terms */
  aliases: string[];

  /** Vertical classification */
  vertical: VerticalSlug;

  /** Human-readable category (Roofing, HVAC, Electronics, etc.) */
  category: string;

  /** Optional subcategory for deeper classification */
  subcategory?: string;

  /** Primary estimation type this entity supports */
  estimationType: EstimationType;

  /** Formula engine key — required when estimationType is 'service-estimate' */
  serviceType?: string;

  /** Benchmark profile: cost/value ranges and confidence metadata */
  benchmark: BenchmarkProfile;

  /** Regional applicability metadata */
  regional: RegionalProfile;

  /** Monetization metadata: lead value, affiliate, financing signals */
  monetization: MonetizationProfile;

  /** SEO metadata: priority, keywords, sitemap inclusion */
  seo: SeoProfile;

  /** Quality and confidence metadata */
  quality: QualityProfile;

  // ── Economic Intelligence Fields (Phase 14) ─────────────────────────────
  /**
   * Economic entity class — the foundational WVE abstraction.
   * Determines monetization strategy, trust framing, SEO semantics,
   * AI reasoning, and graph relationship types.
   * Optional for backward compatibility — defaults inferred from vertical.
   */
  entityClass?: EconomicEntityClass;

  /**
   * Economic interpretation model — the lens applied to the estimate.
   * Examples: project-economics, depreciation, recurring-burden
   */
  economicModel?: EconomicModel;

  /**
   * Lifecycle type — how this entity moves through time economically.
   */
  lifecycleType?: LifecycleType;

  /**
   * Volatility profile — how predictable is the estimate.
   * Used for trust framing, confidence UI, and AI reasoning.
   */
  volatilityProfile?: VolatilityProfile;
}

// ── Sub-profiles ──────────────────────────────────────────────────────────
export interface BenchmarkProfile {
  /** National low estimate in USD */
  lowUSD: number;
  /** National mid estimate in USD */
  midUSD: number;
  /** National high estimate in USD */
  highUSD: number;
  /** Confidence in the benchmark data */
  confidenceLevel: "high" | "moderate" | "preliminary";
  /** Description of data source */
  benchmarkSource: string;
  /** YYYY-MM — when benchmarks were last reviewed */
  lastUpdated: string;
}

export interface RegionalProfile {
  /** True if relevant in all 50 states */
  nationwide: boolean;
  /** States/regions with strongest demand (optional) */
  topMarkets?: string[];
  /** States/regions where this entity is not applicable */
  excludedMarkets?: string[];
  /**
   * Regional sensitivity tier — how much the estimate varies by region.
   * high = large swings (e.g. solar: CA vs. MT); low = nationally flat.
   */
  regionalSensitivity?: "high" | "moderate" | "low";
  /**
   * Regional monetization tier — how valuable leads are in this entity's markets.
   * Influences lead action priority and escalation scoring.
   */
  regionalMonetizationTier?: "premium" | "standard" | "low";
}

export interface MonetizationProfile {
  /**
   * Lead suitability — 0–10.
   * 9–10 = high contractor/dealer lead value
   * 6–8 = moderate (buy/sell advisory)
   * 0–5 = low (informational only)
   */
  leadSuitability: number;
  /**
   * Affiliate link suitability — 0–10.
   * High for product categories, moderate for services.
   */
  affiliateSuitability: number;
  /**
   * Financing propensity — 0–10.
   * High for large projects where consumers typically need credit.
   */
  financingPropensity: number;
  /** Estimated average deal/project value in USD */
  averageOrderValue: number;
  /** Commercial weight tier */
  commercialWeight: "high" | "medium" | "low";
}

export interface SeoProfile {
  /** Priority for crawl and sitemap generation */
  priority: "high" | "medium" | "low";
  /** Estimated monthly search volume tier */
  searchVolumeTier: "high" | "medium" | "low" | "niche";
  /** Primary target keyword */
  primaryKeyword: string;
  /** Additional semantically related keywords */
  relatedKeywords: string[];
  /** Whether to include this entity in the auto-generated sitemap */
  includeInSitemap: boolean;
  /** Minimum quality gate score required before generating a route (0–100) */
  minQualityGate: number;
}

export interface QualityProfile {
  /** Source of estimate data */
  dataQuality: "live" | "benchmarked" | "estimated";
  /** Estimate confidence 0–100 */
  estimateConfidence: number;
  /** Reliability of 5-year projection */
  projectionReliability: "high" | "moderate" | "low";
  /** Minimum data completeness before entity is route-eligible */
  routeEligible: boolean;
}

// ── Query API ─────────────────────────────────────────────────────────────
export interface RegistryQueryFilters {
  vertical?: VerticalSlug;
  category?: string;
  estimationType?: EstimationType;
  commercialWeight?: "high" | "medium" | "low";
  seoMinPriority?: "high" | "medium" | "low";
  routeEligibleOnly?: boolean;
  sitemapOnly?: boolean;
  /** Filter by economic entity class */
  entityClass?: EconomicEntityClass;
  /** Filter by economic model */
  economicModel?: EconomicModel;
  /** Filter by lifecycle type */
  lifecycleType?: LifecycleType;
}
