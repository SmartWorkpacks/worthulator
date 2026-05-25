// ─── Shared types for the Worthulator Value Engine ────────────────────────────
// WVE is a CONTEXTUAL ECONOMIC INTERPRETATION PLATFORM.
// Pure TypeScript — no runtime side-effects, SSR-safe, no imports from recon/

export type EstimationType = 'market-value' | 'service-estimate' | 'appreciation';

export type VerticalSlug = 'electronics' | 'luxury' | 'sneakers' | 'home-services';

// ── Economic Entity Classes ────────────────────────────────────────────────
// The foundational abstraction of WVE. Every entity belongs to exactly one class.
// Entity class determines: economic model, monetization strategy, trust framing,
// SEO semantics, AI reasoning approach, and graph relationship types.
export type EconomicEntityClass =
  | 'services'              // project economics — roofing, HVAC, remodeling
  | 'products'              // ownership / depreciation / resale — phones, watches, sneakers
  | 'assets'                // appreciation / investment — homes, land, collectibles
  | 'utilities'             // recurring cost burden — electricity, water, groceries
  | 'ownership-economics'   // lifecycle ownership burden — Tesla, boat, pool, vacation home
  | 'investments'           // future value / volatility — Bitcoin, ETFs, gold
  | 'life-events'           // timeline economics — weddings, college, retirement
  | 'business-economics';   // operational economics — SaaS CAC, payroll, cloud costs

// ── Economic Interpretation Models ────────────────────────────────────────
// Describes HOW a WVE estimate should be interpreted — the economic lens applied.
export type EconomicModel =
  | 'project-economics'      // one-time project with labor + materials cost
  | 'depreciation'           // asset losing value over time
  | 'appreciation'           // asset gaining value over time
  | 'resale-value'           // current secondary market price
  | 'recurring-burden'       // ongoing monthly/annual cost
  | 'ownership-burden'       // total cost of ownership over lifecycle
  | 'future-value'           // investment projection with volatility
  | 'timeline-economics'     // phased spending over a life milestone
  | 'operational-economics'; // business operational cost structure

// ── Lifecycle Type ──────────────────────────────────────────────────────────
// How this entity moves through time economically.
export type LifecycleType =
  | 'one-time-purchase'   // single transaction
  | 'recurring-cost'      // repeating indefinitely
  | 'project-based'       // bounded project with start/end
  | 'lifecycle-asset'     // held, maintained, eventually sold/disposed
  | 'milestone-event'     // time-bounded life event
  | 'perpetual-holding';  // investment held indefinitely

// ── Volatility Profile ──────────────────────────────────────────────────────
// How predictable is the estimate? Used for trust framing and AI reasoning.
export interface VolatilityProfile {
  /** How much the estimate can swing regionally (0–10) */
  regionalVariance: number;
  /** How much the estimate changes over time (0–10) */
  temporalVariance: number;
  /** How sensitive the estimate is to market conditions (0–10) */
  marketSensitivity: number;
  /** Narrative label for UI trust messaging */
  volatilityLabel: 'stable' | 'moderate' | 'volatile' | 'highly-volatile';
}

// ── Regional Economic Profile ───────────────────────────────────────────────
// First-class regional intelligence — not just a price modifier.
// Describes the economic environment of the user's region.
export interface RegionalEconomicProfile {
  /** Region identifier: US state code, 'UK', 'CA', or 'nationwide' */
  regionId: string;
  /** Human-readable label */
  label: string;
  /** Labor cost tier relative to national average */
  laborTier: 'premium' | 'above-average' | 'average' | 'below-average' | 'low-cost';
  /** Material/goods cost volatility (0–10) */
  materialVolatility: number;
  /** Propensity for financing uptake (0–10) */
  financingPressure: number;
  /** CPI inflation pressure in this region (0–10) */
  inflationPressure: number;
  /** Disaster/risk exposure (hurricane, wildfire, flood) affecting insurance + urgency */
  disasterExposure: 'high' | 'moderate' | 'low' | 'minimal';
  /** Regulatory environment intensity (permits, building codes) */
  regulationIntensity: 'strict' | 'moderate' | 'light';
  /** Insurance cost pressure (0–10) */
  insurancePressure: number;
  /** Lead monetization value multiplier for this region (0.5–2.0) */
  monetizationMultiplier: number;
  /** Confidence in regional data (0–10) */
  regionalConfidence: number;
}

// ── Entity search result (mirrors EntityRecord from recon) ──────────────────
export interface EntitySearchResult {
  id: string;
  canonicalName: string;
  brand: string;
  model: string;
  category: string;
  subcategory: string;
  vertical: VerticalSlug;
  aliases: string[];
  priceRangeLow?: number;
  priceRangeHigh?: number;
}

// ── Economic Interpretation — resolved at route time ──────────────────────
// The full economic context for an entity at routing time.
export interface EconomicInterpretation {
  entityClass: EconomicEntityClass;
  economicModel: EconomicModel;
  lifecycleType: LifecycleType;
  volatility?: VolatilityProfile;
}

// ── Routing intent ─────────────────────────────────────────────────────────
export interface IntentRoute {
  type: EstimationType;
  label: string;
  entityId: string;
  serviceType?: string;     // populated for service-estimate
  canonicalName: string;
  category: string;
  vertical: VerticalSlug;
  href: string;             // fully formed Next.js path
  /** Economic interpretation resolved at route time */
  interpretation?: EconomicInterpretation;
}

// ── Estimate payloads ──────────────────────────────────────────────────────
export interface CostAdjustment {
  name: string;
  multiplier: number;
  reason: string;
}

export interface ServiceEstimateResult {
  serviceType: string;
  region: string;
  low: number;
  average: number;
  premium: number;
  confidenceRange: [number, number];
  regionalMultiplier: number;
  baseCost: number;
  adjustments: CostAdjustment[];
  dataSource: 'formula';
}

export interface MarketValueResult {
  low: number;
  average: number;
  premium: number;
  confidenceRange: [number, number];
  volatilityScore: number;
  liquidityScore: number;
  dataSource: 'market' | 'registry-range' | 'registry';
  condition?: string;
  region?: string;
}

export interface EstimatePayload {
  type: EstimationType;
  entityId: string;
  entityName: string;
  category: string;
  vertical: VerticalSlug;
  service?: ServiceEstimateResult;
  market?: MarketValueResult;
  region: string;
  generatedAt: string;
}

// ── AI escalation scaffold ─────────────────────────────────────────────────
export interface EscalationScore {
  projectValue: number;     // 0–10: based on estimate $ amount
  engagement: number;       // 0–10: page time
  monetization: number;     // 0–10: vertical lead potential
  interactionDepth: number; // 0–10: input interactions
  composite: number;        // weighted average (0–10)
  shouldEscalate: boolean;  // composite >= 7.0
}

// ── Projection point for charts ────────────────────────────────────────────
export interface ProjectionPoint {
  year: number;
  low: number;
  average: number;
  premium: number;
}

// ── Contextual lead suggestion ─────────────────────────────────────────────
export interface LeadSuggestion {
  headline: string;
  body: string;
  cta: string;
  href: string;
}
