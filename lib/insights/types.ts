// ─── WorthCore Insight Engine — Core Types ────────────────────────────────────
//
// PURPOSE:
//   Strongly-typed structures for the Insight Rule System.
//   These types define the shape of every insight produced by any generator.
//
// RULES:
//   ✅ Pure TypeScript — no React, no async, no fetch
//   ✅ SSR-safe — safe to import in server and client modules
//   ❌ Never import from components/, app/, or any calculator code
//
// ─────────────────────────────────────────────────────────────────────────────

// ─── Severity ────────────────────────────────────────────────────────────────

/**
 * How the insight should be visually emphasised.
 *
 * positive  → good news, green styling
 * neutral   → informational, blue styling
 * warning   → something to consider, amber styling
 * critical  → action required, red styling
 */
export type InsightSeverity = "positive" | "neutral" | "warning" | "critical";

// ─── Category ────────────────────────────────────────────────────────────────

/**
 * The semantic domain of the insight — used for filtering and grouping.
 *
 * savings          → money already saved or being preserved
 * spending         → money being spent, with cost context
 * investment       → opportunity to grow money
 * affordability    → can the user afford this?
 * opportunity-cost → what could this money do instead?
 * comparison       → vs. national / state / average benchmarks
 * warning          → a direct actionable warning
 * projection       → forward-looking estimate at a future horizon
 */
export type InsightCategory =
  | "savings"
  | "spending"
  | "investment"
  | "affordability"
  | "opportunity-cost"
  | "comparison"
  | "warning"
  | "projection"
  // extended categories used by generators
  | "hidden-cost"
  | "benchmark-comparison"
  | "investment-opportunity"
  | "affordability-pressure"
  | "financial-stress"
  | "debt-burden"
  | "time-loss"
  | "impact"
  | "habit"
  | "neutral";

// ─── Supporting Structures ───────────────────────────────────────────────────

/**
 * An optional highlighted metric displayed alongside the insight body.
 * Rendered as a prominent number + label in the insight card.
 */
export interface InsightMetric {
  /** Short label describing the number, e.g. "Annual fuel cost" */
  label: string;
  /** Pre-formatted display value, e.g. "$3,850" or "+12%" */
  value: string;
}

/**
 * Runtime context passed to an insight generator.
 * Generators use this to produce state- or region-aware insights.
 */
export interface InsightContext {
  /**
   * User-selected US state name (e.g. "Texas") or "National" for the
   * national average. Used by benchmarks that compare to state averages.
   */
  state?: string;
}

// ─── Core Insight ─────────────────────────────────────────────────────────────

/**
 * A single deterministic insight produced by a rule-based generator.
 *
 * Insights are:
 *   - Computed from calculator outputs + WorthCore datasets
 *   - Never AI-generated
 *   - Never produced by running new calculations
 *   - Always synchronous and deterministic
 */
export interface Insight {
  /**
   * Stable, unique identifier for this insight.
   * Format: "<calculator>.<rule-name>"
   * Example: "commute.above-national-fuel"
   */
  id: string;

  // ── New-format fields ────────────────────────────────────────────────────
  category?: InsightCategory;
  severity?: InsightSeverity;

  /** One short headline displayed at the top of the insight card */
  title?: string;

  /** Full explanation — 1-3 sentences with specific numbers */
  body?: string;

  // ── Legacy-format fields (older generators) ──────────────────────────────
  /** @deprecated use severity instead */
  type?: string;
  /** @deprecated use title instead */
  message?: string;
  /** @deprecated use body instead */
  detail?: string;

  /**
   * Optional highlighted metric shown in the card corner.
   * Use for the single most important number in this insight.
   */
  metric?: InsightMetric;

  /**
   * Optional visual to render above the text block.
   * When present, the insight renders as: [visual] → [title + body].
   */
  visualization?: InsightVisualization;

  /** Higher number = shown first. Used to sort insights within a generator. */
  priority?: number;
}

// ─── Visualization Data ────────────────────────────────────────────────────────
//
// Pure data structures — no React, no rendering logic.
// Consumed by InsightVisual.tsx to render the appropriate visual primitive.
//
// ─────────────────────────────────────────────────────────────────────────────

export type InsightVisFormat = "currency" | "percent" | "number";

/** Two horizontal bars: user value vs a national/regional benchmark */
export interface BenchmarkBarVisualization {
  type:           "benchmark-bar";
  userValue:      number;
  userLabel:      string;
  benchmarkValue: number;
  benchmarkLabel: string;
  format:         InsightVisFormat;
}

/** Before/After columns + a delta column */
export interface DeltaCardVisualization {
  type:   "delta-card";
  before: { label: string; value: string };
  after:  { label: string; value: string };
  delta:  { label: string; value: string; positive: boolean };
}

/** A line chart showing growth over time */
export interface ProjectionLineVisualization {
  type:    "projection-line";
  points:  Array<{ label: string; value: number }>;
  format:  InsightVisFormat;
  yLabel?: string;
  color?:  string;
}

/** A donut/pie chart for spending breakdown */
export interface DonutVisualization {
  type:         "donut";
  segments:     Array<{ label: string; value: number; color: string }>;
  centerLabel?: string;
  format:       InsightVisFormat;
}

export type InsightVisualization =
  | BenchmarkBarVisualization
  | DeltaCardVisualization
  | ProjectionLineVisualization
  | DonutVisualization;
