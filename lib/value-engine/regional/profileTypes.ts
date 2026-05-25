// ─── WVE Regional Intelligence — Profile Types ────────────────────────────────
// Additional regional-specific types beyond the core RegionalEconomicProfile.
// Pure TypeScript — no runtime side-effects, SSR-safe.

import type { EconomicEntityClass } from "../types";

/** A resolved trust signal surfaced on the result page for a given region */
export interface RegionalTrustSignal {
  /** Short label for badge display */
  label: string;
  /** Full explanatory text for tooltip or body copy */
  message: string;
  /** Visual severity — informs badge color */
  severity: "info" | "caution" | "warning";
}

/** Monetization signal enriched with regional context */
export interface RegionalMonetizationSignal {
  /** Adjusted lead priority after applying regional multiplier (0–10) */
  adjustedLeadPriority: number;
  /** Adjusted affiliate priority after applying regional multiplier (0–10) */
  adjustedAffiliatePriority: number;
  /** Whether financing is especially relevant in this region */
  financingAmplified: boolean;
  /** Human-readable regional lead value note */
  leadValueNote: string;
}

/** Full resolved regional context for a single estimate session */
export interface ResolvedRegionalContext {
  regionId: string;
  label: string;
  /** Low/mid/high estimate after regional adjustment */
  adjustedEstimate: {
    lowUSD: number;
    midUSD: number;
    highUSD: number;
  };
  /** Trust signals to surface in the UI */
  trustSignals: RegionalTrustSignal[];
  /** Monetization signals adjusted for region */
  monetization: RegionalMonetizationSignal;
  /** Regional confidence for trust badge */
  confidence: number;
}

/** Inputs to resolveRegionalContext() */
export interface RegionalContextParams {
  regionId: string;
  baseLowUSD: number;
  baseMidUSD: number;
  baseHighUSD: number;
  entityClass?: EconomicEntityClass;
  leadSuitability: number;
  affiliateSuitability: number;
  financingPropensity: number;
}
