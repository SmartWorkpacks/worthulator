// ─── WVE Monetization Intelligence Types — Phase 13/14 ──────────────────────

import type { EstimationType, EconomicEntityClass } from "../types";

/** A single commercial action the UI can render */
export interface MonetizationAction {
  type:
    | "lead_form"          // services: contractor/dealer quote request
    | "affiliate_links"    // products: marketplace buy/sell links
    | "financing_cta"      // high-value: financing options
    | "comparison_tool"    // products/investments: side-by-side comparison
    | "advisory"           // high engagement: expert consultation
    | "resale_marketplace" // products: direct resale platform link
    | "savings_offer"      // utilities: switching/savings recommendation
    | "broker_affiliate"   // investments: broker/exchange affiliate
    | "insurance_cta";     // ownership/assets: insurance recommendation
  /** Lower number = higher priority */
  priority: number;
  label: string;
  description: string;
  ctaText: string;
  href?: string;
}

/** Full monetization assessment for a single estimate session */
export interface MonetizationAssessment {
  /** Revenue tier for this entity + context combination */
  revenueTier: "high" | "medium" | "low";
  /** Lead generation priority 0–10 */
  leadPriority: number;
  /** Affiliate link priority 0–10 */
  affiliatePriority: number;
  /** Whether to surface a financing CTA */
  showFinancing: boolean;
  /** Estimated lead lifetime value in USD */
  estimatedLTV: number;
  /** Monetization score 0–10 used to override escalation baseline */
  monetizationScore: number;
  /** Prioritised list of commercial actions to render in the UI */
  actions: MonetizationAction[];
  /** Entity class that drove the action selection */
  entityClass?: EconomicEntityClass;
  /** Regional monetization note (populated when regionId is provided) */
  regionalNote?: string;
}

/** Inputs to the monetization engine */
export interface MonetizationContext {
  estimateAmount: number;
  estimationType: EstimationType;
  /** Composite engagement score 0–10 from escalationScorer */
  engagementScore: number;
  /**
   * Registry entity id — when provided the engine uses the entity's
   * monetization profile for precise scoring.
   */
  entityId?: string;
  /** Explicit financing flag override from calling context */
  financingDetected?: boolean;
  /**
   * Economic entity class — when provided, overrides vertical-derived defaults
   * for action selection. Enables class-specific monetization strategies.
   */
  entityClass?: EconomicEntityClass;
  /**
   * Region id (e.g. "CA", "TX", "nationwide") — when provided, applies
   * regional monetization multiplier and enriches the assessment note.
   */
  regionId?: string;
}
