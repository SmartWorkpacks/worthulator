// ─── Core shared types for the Worthulator Recon System ─────────────────────

export type VerticalSlug   = 'electronics' | 'luxury' | 'sneakers' | 'home-services';
export type SourceSlug     = 'amazon' | 'ebay' | 'stockx' | 'google-maps' | 'angi' | 'fixture';
export type ConditionNorm  = 'new' | 'used' | 'refurbished' | 'unknown';
export type MatchType      = 'exact' | 'pattern' | 'fuzzy' | 'brand-only' | 'unmatched';
export type ConfidenceBand = 'high' | 'medium' | 'low';
export type FreshnessReq   = 'realtime' | 'daily' | 'weekly' | 'monthly';
export type Verdict        = 'build' | 'watch' | 'skip';

// ─── Raw listing straight off the ingestion source ───────────────────────────

export interface RawListing {
  id:         string;
  source:     SourceSlug;
  vertical:   VerticalSlug;
  title:      string;
  price:      number | null;
  currency:   string;           // raw — may be "USD", "$", "GBP", etc.
  condition:  string | null;    // raw — "Used", "Like New", "Grade B", etc.
  url:        string;
  region:     string;
  timestamp:  string;           // ISO 8601
  raw:        Record<string, unknown>;
}

// ─── Entity resolution result ─────────────────────────────────────────────────

export interface ResolvedEntity {
  input:         string;
  canonicalName: string;
  brand:         string;
  model:         string;
  category:      string;
  subcategory:   string;
  confidence:    number;     // 0–1
  matchType:     MatchType;
}

// ─── Fully normalized listing (after entity resolution + normalization) ───────

export interface NormalizedListing {
  id:               string;
  entity:           string;
  model:            string;
  brand:            string;
  category:         string;
  subcategory:      string;
  source:           SourceSlug;
  vertical:         VerticalSlug;
  price:            number;
  currency:         'USD';
  timestamp:        Date;
  condition:        ConditionNorm;
  region:           string;
  entityConfidence: number;   // 0–1
}

// ─── Price estimate for one entity + condition pair ───────────────────────────

export interface PriceEstimate {
  entity:    string;
  condition: ConditionNorm;
  count:     number;
  min:       number;
  p25:       number;
  median:    number;
  p75:       number;
  max:       number;
  mean:      number;
  stdDev:    number;
  cv:        number;             // coefficient of variation — price volatility proxy
  confidence: ConfidenceBand;
  sources:   SourceSlug[];
  freshestAt: string;
}

// ─── Per-vertical analysis output ─────────────────────────────────────────────

export interface VerticalAnalysis {
  vertical:             VerticalSlug;
  rawCount:             number;
  normalizedCount:      number;
  pricedCount:          number;
  uniqueEntities:       number;
  avgEntityConfidence:  number;
  avgCV:                number;    // avg price volatility across entities
  missingPriceRatio:    number;    // fraction of raw listings with no price
  matchBreakdown:       Record<MatchType, number>;
  estimates:            PriceEstimate[];
}

// ─── Feasibility score per vertical ──────────────────────────────────────────

export interface FeasibilityScore {
  vertical:                 VerticalSlug;
  dataRichness:             number;   // 0–10
  normalizationDifficulty:  number;   // 0–10  higher = harder
  entityMatchDifficulty:    number;   // 0–10  higher = harder
  monetizationPotential:    number;   // 0–10
  scalability:              number;   // 0–10
  freshnessRequirement:     FreshnessReq;
  seoPotential:             number;   // 0–10
  overallScore:             number;   // weighted aggregate
  verdict:                  Verdict;
  notes:                    string;
}

// ─── Full feasibility report ──────────────────────────────────────────────────

export interface FeasibilityReport {
  generatedAt:    string;
  mode:           'mock' | 'live';
  verticals:      VerticalAnalysis[];
  scores:         FeasibilityScore[];
  topVertical:    VerticalSlug;
  recommendation: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 6 — LIVE INGESTION LAYER
// ═══════════════════════════════════════════════════════════════════════════════

export interface EnrichedListing extends RawListing {
  sourceTrust:      number;              // 0–1  how reliable is this source?
  fingerprint:      string;             // dedup hash: source+title_norm+price
  sizeInfo?:        string;             // sneakers: "US 10", "US 10.5"
  extractedSpecs?:  Record<string, unknown>;
}

export interface WorkerRunResult {
  vertical:       VerticalSlug;
  source:         SourceSlug;
  fetched:        number;
  deduplicated:   number;
  stored:         number;
  errors:         string[];
  durationMs:     number;
}

export interface DedupResult {
  isDuplicate:  boolean;
  fingerprint:  string;
  existingId?:  string;
}

export type StaleStatus = 'fresh' | 'stale' | 'expired';

export interface SourceQuality {
  source:                 SourceSlug;
  totalRuns:              number;
  successRate:            number;          // 0–1
  avgItemsPerRun:         number;
  avgPriceCompleteness:   number;          // fraction with price present
  avgEntityMatchRate:     number;          // fraction that resolved to entity
  lastRunAt:              string;
  reliabilityScore:       number;          // 0–10  composite
}

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 7 — ENTITY GRAPH
// ═══════════════════════════════════════════════════════════════════════════════

export interface EntityRecord {
  id:              string;           // UUID
  canonicalName:   string;
  brand:           string;
  model:           string;
  category:        string;
  subcategory:     string;
  vertical:        VerticalSlug;
  aliases:         string[];
  priceRangeLow?:  number;
  priceRangeHigh?: number;
  createdAt:       string;
  updatedAt:       string;
}

export interface AliasRecord {
  id:         string;
  entityId:   string;
  alias:      string;
  source:     SourceSlug | 'manual';
  confidence: number;
  createdAt:  string;
}

export interface MergeRecord {
  id:             string;
  sourceEntityId: string;
  targetEntityId: string;
  reason:         string;
  confidence:     number;
  createdAt:      string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 8 — HISTORICAL STORAGE
// ═══════════════════════════════════════════════════════════════════════════════

export interface MarketListing {
  id:         string;
  entityId:   string;
  source:     SourceSlug;
  priceUsd:   number;
  condition:  ConditionNorm;
  region:     string;
  url:        string;
  scrapedAt:  string;
  runId?:     string;
}

export interface NormalizedPrice {
  id:          string;
  entityId:    string;
  condition:   ConditionNorm;
  p25:         number;
  median:      number;
  p75:         number;
  mean:        number;
  stdDev:      number;
  cv:          number;
  confidence:  ConfidenceBand;
  sampleCount: number;
  computedAt:  string;
}

export interface HistoricalSnapshot {
  id:           string;
  entityId:     string;
  snapshotDate: string;          // YYYY-MM-DD
  priceUsd:     number;
  source:       SourceSlug;
  condition:    ConditionNorm;
  region:       string;
}

export interface ConfidenceScoreRecord {
  id:         string;
  entityId:   string;
  condition:  ConditionNorm;
  score:      number;            // 0–1
  band:       ConfidenceBand;
  reason:     string;
  computedAt: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 9 — VALUATION ENGINES
// ═══════════════════════════════════════════════════════════════════════════════

// --- Market Value Engine (products: sneakers, watches, electronics) -----------

export interface ValuationInput {
  entity:      string;           // canonical entity name
  condition:   ConditionNorm;
  region?:     string;
  timestamp?:  Date;
}

export interface MarketValuation {
  entity:                     string;
  condition:                  ConditionNorm;
  low:                        number;
  average:                    number;
  premium:                    number;
  confidenceRange:            [number, number];   // [p10, p90]
  volatilityScore:            number;             // 0–10
  liquidityScore:             number;             // 0–10
  confidence:                 ConfidenceBand;
  sampleCount:                number;
  freshestDataAt:             string;
  regionalAdjustmentApplied:  boolean;
}

// --- Formula Estimation Engine (home services: roofing, HVAC, solar, etc.) ---

export interface FormulaInput {
  serviceType:  string;          // 'asphalt-shingle-roof' | 'central-ac' | ...
  region:       string;
  specs: {
    squareFootage?: number;
    tonage?:        number;      // HVAC tons
    kw?:            number;      // solar kW
    qualityTier?:   'budget' | 'standard' | 'premium';
    [key: string]:  unknown;
  };
}

export interface CostAdjustment {
  name:       string;
  multiplier: number;
  reason:     string;
}

export interface FormulaEstimate {
  serviceType:         string;
  region:              string;
  low:                 number;
  average:             number;
  premium:             number;
  confidenceRange:     [number, number];
  regionalMultiplier:  number;
  baseCost:            number;
  adjustments:         CostAdjustment[];
  dataSource:          'formula' | 'market';
}

// ═══════════════════════════════════════════════════════════════════════════════
// PHASE 10 — INTERNAL API
// ═══════════════════════════════════════════════════════════════════════════════

export interface ApiEstimateRequest {
  entity?:      string;
  serviceType?: string;
  condition?:   ConditionNorm;
  region?:      string;
  specs?:       FormulaInput['specs'];
}

export interface ApiResponse<T> {
  success:      boolean;
  data?:        T;
  error?:       string;
  requestedAt:  string;
}
