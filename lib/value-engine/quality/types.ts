// ─── WVE Estimation Quality System — Types — Phase 13 ────────────────────────

/** Weighted score per quality dimension (0–100) */
export interface QualityDimension {
  score: number;
  weight: number;
  label: string;
  note?: string;
}

/** Quality tier derived from the final weighted score */
export type QualityTier = "premium" | "standard" | "draft" | "blocked";

/** Full quality assessment for a single entity */
export interface QualityAssessment {
  /** Entity id from registry */
  entityId: string;
  /** Final weighted score 0–100 */
  score: number;
  /** Human tier label */
  tier: QualityTier;
  /** Whether this entity should have a public route */
  routeEligible: boolean;
  /** Whether Google should index this entity's route */
  indexEligible: boolean;
  /** Per-dimension breakdown */
  breakdown: {
    estimateConfidence: QualityDimension;
    benchmarkConfidence: QualityDimension;
    dataFreshness: QualityDimension;
    seoCompleteness: QualityDimension;
    profileCompleteness: QualityDimension;
  };
  /** Human-readable flags describing quality issues */
  flags: string[];
}

/** Aggregate quality summary across all registered entities */
export interface QualityReport {
  total: number;
  premium: number;
  standard: number;
  draft: number;
  blocked: number;
  routeEligible: number;
  averageScore: number;
  entities: QualityAssessment[];
}
