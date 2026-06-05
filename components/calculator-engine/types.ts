// ─── Calculator Engine — Type definitions ────────────────────────────────────

export type InputType = "slider" | "select" | "number" | "dropdown" | "multiselect";
export type OutputFormat = "integer" | "decimal" | "currency" | "percent";
export type Region = "US" | "UK";

/**
 * Top-level category clusters. Add new clusters here as the platform grows.
 * Used for navigation, filtering, and the tools index page.
 */
export type CalculatorCategory =
  | "construction"
  | "finance"
  | "work"
  | "health"
  | "legal"
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
  /** Required when type === "select" */
  options?: SelectOption[];
  /** Helper text rendered below the slider */
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
  /** Use emerald highlight card for the primary result */
  highlight?: boolean;
  /** Optional sub-label rendered below the value */
  sublabel?: (inputs: CalculatorValues, outputs: CalculatorOutputs) => string;
  /**
   * Currency symbol for "currency" format outputs.
   * Defaults to "$". Use "£" for UK calculators.
   */
  currencySymbol?: string;
}

// ─── Calculator ───────────────────────────────────────────────────────────────

export type CalculatorValues = Record<string, number | string>;
export type CalculatorOutputs = Record<string, number>;

export interface CalculatorConfig {
  id: string;
  label: string;
  /** Top-level category cluster — used for navigation and filtering */
  category: CalculatorCategory;
  /** Optional short description shown on index/browse pages */
  description?: string;
  inputs: InputConfig[];
  outputs: OutputConfig[];
  /** Pure function: inputs → computed outputs */
  calculate: (inputs: CalculatorValues) => CalculatorOutputs;
  /** Optional summary sentence rendered in the results panel */
  insight?: (inputs: CalculatorValues, outputs: CalculatorOutputs) => string;
  /**
   * Optional override for the staged "calculating…" loader copy.
   * Falls back to a warm, generic 4-step sequence when omitted.
   * The last entry should read as a completion line.
   */
  calcSteps?: string[];
  /**
   * If set, an amber ready-mix callout appears when outputs["volume"]
   * exceeds this threshold (cubic yards / metres).
   */
  readyMixThreshold?: number;
}

/** The global registry — keyed by calculator ID (e.g. "concrete-bag", "concrete-bag-uk") */
export type CalculatorRegistry = Record<string, CalculatorConfig>;
