// ─── WVE AI Context — Types — Phase 13/14 ────────────────────────────────────
// Defines the structured context payload used for AI API preparation.
// Phase 14: entity class, economic model, lifecycle, volatility, regional economics.
// Pure TypeScript types. No runtime dependencies.

import type { EstimationType, VerticalSlug, EconomicEntityClass, EconomicModel, LifecycleType, VolatilityProfile } from "../types";
import type { QualityTier } from "../quality/types";

/** Top-level context payload passed to any AI integration */
export interface AIContextPayload {
  // ── Entity identity ─────────────────────────────────────────────────────
  entityId: string;
  entityName: string;
  estimationType: EstimationType;
  vertical: VerticalSlug;
  category: string;
  serviceType?: string;

  // ── Economic interpretation (Phase 14) ───────────────────────────────────
  /** The economic entity class — determines reasoning approach */
  entityClass: EconomicEntityClass;
  /** The economic model — the interpretation lens for this estimate */
  economicModel: EconomicModel;
  /** How this entity moves through time economically */
  lifecycleType: LifecycleType;
  /** Volatility profile — how predictable the estimate is */
  volatility?: VolatilityProfile;

  // ── Estimate ─────────────────────────────────────────────────────────────
  estimateRange: {
    lowUSD: number;
    midUSD: number;
    highUSD: number;
  };
  /** Current user-specific estimate in USD (if known) */
  estimateAmount?: number;
  region?: string;

  // ── Regional economics (Phase 14) ─────────────────────────────────────────
  /** Resolved regional economic context when regionId is known */
  regionalEconomics?: {
    regionId: string;
    label: string;
    laborTier: string;
    inflationPressure: number;
    disasterExposure: string;
    insurancePressure: number;
    monetizationMultiplier: number;
    regionalConfidence: number;
  };

  // ── Quality ──────────────────────────────────────────────────────────────
  quality: {
    score: number;        // 0-100
    tier: QualityTier;
    confidenceLabel: string;
    benchmarkSource: string;
    lastUpdated: string;  // YYYY-MM
  };

  // ── Monetization ─────────────────────────────────────────────────────────
  monetization: {
    leadSuitability: number;       // 0-10
    affiliateSuitability: number;  // 0-10
    estimatedLTV: number;          // USD
    revenueTier: "high" | "medium" | "low";
  };

  // ── Related entities (top 3) ──────────────────────────────────────────────
  relatedEntities: Array<{
    id: string;
    name: string;
    benchmarkMidUSD: number;
    strength: number;  // 0-1
    economicClass?: EconomicEntityClass;
  }>;

  // ── User context ──────────────────────────────────────────────────────────
  userContext: {
    isRepeatVisit: boolean;
    viewCount: number;
    sessionEstimateCount: number;
  };

  // ── Metadata ──────────────────────────────────────────────────────────────
  generatedAt: string;   // ISO timestamp
  schemaVersion: string;
}

/** Options for prompt generation */
export interface AIPromptConfig {
  /** Tone of generated prompts */
  tone?: "informative" | "sales" | "advisory";
  /** Max tokens hint for truncating context */
  maxContextTokens?: number;
  /** Whether to include monetization signals in prompt (default: false) */
  includeMonetization?: boolean;
}
