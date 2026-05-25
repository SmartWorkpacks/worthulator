// ─── Shared Calculator Core — Insight Types ──────────────────────────────────
//
// ORIGIN:  Extracted from Worthulator (lib/insights/types.ts)
// USAGE:   Shared type definitions for all insight generators.
// RULES:   Pure TypeScript. No React. No site deps. SSR-safe.
//
// ─────────────────────────────────────────────────────────────────────────────

export type InsightSeverity =
  | "positive"   // good news — green
  | "neutral"    // informational — gray/blue
  | "warning"    // consider this — amber
  | "critical";  // action required — red

export type InsightCategory =
  | "savings"
  | "spending"
  | "investment"
  | "affordability"
  | "opportunity-cost"
  | "comparison"
  | "warning"
  | "projection"
  | "hidden-cost"
  | "benchmark-comparison"
  | "investment-opportunity"
  | "affordability-pressure"
  | "financial-stress"
  | "debt-burden"
  | "time-loss"
  | "impact"
  | "neutral"
  // Energy / VPPExchange additions
  | "roi"
  | "benchmark"
  | "habit";

/** An optional highlighted metric rendered alongside the insight body. */
export interface InsightMetric {
  label: string;
  value: string;
}

/** Runtime context passed to an insight generator. */
export interface InsightContext {
  /** User-selected region/state name, or "National" for national average */
  region?: string;
  /** ISO country code — e.g. "US", "AU" */
  country?: string;
  /** Any additional domain-specific context values */
  [key: string]: unknown;
}

// ─── Visualization Spec ───────────────────────────────────────────────────────
// Optional inline chart/visual embedded inside an insight card.

export type VisualizationType = "bar" | "line" | "donut" | "comparison" | "progress";

export interface VisualizationDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface InsightVisualization {
  type:   VisualizationType;
  data:   VisualizationDataPoint[];
  title?: string;
  unit?:  string;
}

// ─── Core Insight ─────────────────────────────────────────────────────────────

export interface Insight {
  /** Stable dot-notation ID: "<calculator>.<rule-name>" e.g. "vpp-roi.payback-period" */
  id:            string;
  severity:      InsightSeverity;
  category:      InsightCategory;
  title:         string;
  body:          string;
  metric?:       InsightMetric;
  visualization?: InsightVisualization;
  /** Raw numeric value driving this insight (for charting / sorting) */
  value?:        number;
  /** Display unit for `value`, e.g. "$/yr", "years", "kWh" */
  unit?:         string;
  /** Confidence score 0–1 (optional, for display or filtering) */
  confidence?:   number;
  /** @deprecated Use `severity` */
  type?:    InsightSeverity;
  /** @deprecated Use `title` */
  message?: string;
  /** @deprecated Use `body` */
  detail?:  string;
}

// ─── Generator Contract ───────────────────────────────────────────────────────

/**
 * All insight generators must conform to this signature.
 * Inputs/outputs are typed generically — narrow to your calculator's types inside.
 */
export type InsightGenerator<
  TInputs  = Record<string, unknown>,
  TOutputs = Record<string, unknown>,
> = (inputs: TInputs, outputs: TOutputs, context?: InsightContext) => Insight[];
