// ─── Shared Calculator Core — Engine Types ───────────────────────────────────
//
// ORIGIN:  Extracted from Worthulator (components/calculator-engine/types.ts)
// USAGE:   Import in any project consuming shared-calculator-core.
// RULES:   Pure TypeScript. No React. No site-specific content. SSR-safe.
//
// ─────────────────────────────────────────────────────────────────────────────

export type InputType    = "slider" | "select" | "number" | "dropdown" | "multiselect";
export type OutputFormat = "integer" | "decimal" | "currency" | "percent";
export type Region       = "US" | "UK";

/** Top-level category clusters. Extend as the platform grows. */
export type CalculatorCategory =
  | "energy"
  | "finance"
  | "construction"
  | "work"
  | "health"
  | "other";

// ─── Input ────────────────────────────────────────────────────────────────────

export interface SelectOption {
  label: string;
  value: number | string;
}

export interface InputConfig {
  /** Unique key — used to read/write state */
  name: string;
  label: string;
  unit?: string;
  /** Defaults to "slider" */
  type?: InputType;
  min?: number;
  max?: number;
  step?: number;
  default: number | string;
  /** Required when type === "select" or "dropdown" */
  options?: SelectOption[];
  /** Helper text rendered below the input */
  hint?: string;
  /** Quick-pick chip values rendered below the slider */
  quickPicks?: number[];
  /**
   * Dynamic upper bound — called with the current values on every render.
   * Takes precedence over `max` when provided.
   */
  maxFn?: (values: CalculatorValues) => number;
}

// ─── Output ───────────────────────────────────────────────────────────────────

export interface OutputConfig {
  key: string;
  label: string;
  unit?: string;
  /** Defaults to "decimal" */
  format?: OutputFormat;
  /** For "decimal" format — defaults to 2 */
  decimalPlaces?: number;
  /** Use primary-color highlight card for the main result */
  highlight?: boolean;
  /** Override the currency symbol (default: "$") */
  currencySymbol?: string;
  /** Dynamic sub-label rendered below the value */
  sublabel?: (inputs: CalculatorValues, outputs: CalculatorOutputs) => string;
}

// ─── Calculator Config ────────────────────────────────────────────────────────

export type CalculatorValues  = Record<string, number | string>;
export type CalculatorOutputs = Record<string, number>;

export interface CalculatorConfig {
  inputs:    InputConfig[];
  calculate: (values: CalculatorValues) => CalculatorOutputs;
  outputs:   OutputConfig[];
  /** Short contextual insight string shown below results */
  insight?:  (outputs: CalculatorOutputs) => string;
  /** Category used for filtering in tools index */
  category?: CalculatorCategory;
}

export type CalculatorRegistry = Record<string, CalculatorConfig>;
