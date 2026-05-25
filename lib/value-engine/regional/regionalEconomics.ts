// ─── WVE Regional Intelligence — Economics Engine ─────────────────────────────
// Pure functions for applying regional economic context to estimates.
// Drives: adjusted estimates, trust signals, monetization enrichment.
// Pure, SSR-safe, zero side-effects.

import type { EconomicEntityClass, RegionalEconomicProfile } from "../types";
import type {
  RegionalTrustSignal,
  RegionalMonetizationSignal,
  ResolvedRegionalContext,
  RegionalContextParams,
} from "./profileTypes";
import { REGIONAL_PROFILES } from "./regionalProfiles";

// ── Profile lookup ──────────────────────────────────────────────────────────
export function getRegionalProfile(regionId: string): RegionalEconomicProfile {
  return REGIONAL_PROFILES[regionId] ?? REGIONAL_PROFILES["nationwide"];
}

export function getMonetizationMultiplier(regionId: string): number {
  return getRegionalProfile(regionId).monetizationMultiplier;
}

// ── Labor-tier cost multipliers ────────────────────────────────────────────
const LABOR_MULTIPLIERS: Record<RegionalEconomicProfile["laborTier"], number> = {
  "premium":       1.30,
  "above-average": 1.15,
  "average":       1.00,
  "below-average": 0.90,
  "low-cost":      0.80,
};

// ── Apply regional cost adjustment ─────────────────────────────────────────
export function applyRegionalModifier(
  baseLow: number,
  baseMid: number,
  baseHigh: number,
  regionId: string,
): { lowUSD: number; midUSD: number; highUSD: number } {
  const profile = getRegionalProfile(regionId);
  const multiplier = LABOR_MULTIPLIERS[profile.laborTier];
  return {
    lowUSD:  Math.round(baseLow  * multiplier),
    midUSD:  Math.round(baseMid  * multiplier),
    highUSD: Math.round(baseHigh * multiplier),
  };
}

// ── Regional trust signals ─────────────────────────────────────────────────
export function getRegionalTrustSignals(
  regionId: string,
  entityClass?: EconomicEntityClass,
): RegionalTrustSignal[] {
  const profile = getRegionalProfile(regionId);
  const signals: RegionalTrustSignal[] = [];

  // Labor premium warning
  if (profile.laborTier === "premium") {
    signals.push({
      label: "High-Cost Region",
      message: `Labor costs in ${profile.label} are significantly above the national average. Estimates reflect local rates.`,
      severity: "caution",
    });
  } else if (profile.laborTier === "below-average" || profile.laborTier === "low-cost") {
    signals.push({
      label: "Below-Average Labor Costs",
      message: `Labor costs in ${profile.label} are below the national average, which may lower your actual cost.`,
      severity: "info",
    });
  }

  // Disaster exposure — relevant for services and assets
  if (
    profile.disasterExposure === "high" &&
    (entityClass === "services" || entityClass === "assets" || !entityClass)
  ) {
    signals.push({
      label: "High-Risk Region",
      message: `${profile.label} has elevated natural disaster exposure. This increases insurance requirements and may accelerate maintenance cycles.`,
      severity: "warning",
    });
  }

  // Insurance pressure for ownership and assets
  if (
    profile.insurancePressure >= 8 &&
    (entityClass === "ownership-economics" || entityClass === "assets" || !entityClass)
  ) {
    signals.push({
      label: "High Insurance Costs",
      message: `Insurance rates in ${profile.label} are among the highest in the country. Factor this into your total ownership cost.`,
      severity: "warning",
    });
  }

  // Strict regulation note for services
  if (profile.regulationIntensity === "strict" && entityClass === "services") {
    signals.push({
      label: "Permit Requirements",
      message: `${profile.label} has strict building codes and permit requirements. Budget additional time and cost for compliance.`,
      severity: "caution",
    });
  }

  // Inflation note for utilities and life events
  if (
    profile.inflationPressure >= 7 &&
    (entityClass === "utilities" || entityClass === "life-events")
  ) {
    signals.push({
      label: "Above-Average Inflation",
      message: `Cost inflation in ${profile.label} is running above the national average. Projections may be conservative.`,
      severity: "caution",
    });
  }

  // Investment volatility for investment entities
  if (entityClass === "investments" && profile.monetizationMultiplier >= 1.4) {
    signals.push({
      label: "Active Market",
      message: `${profile.label} is an active market for this asset class. Prices may move faster than national benchmarks.`,
      severity: "info",
    });
  }

  return signals;
}

// ── Regional monetization enrichment ───────────────────────────────────────
export function getRegionalMonetizationSignal(
  regionId: string,
  baseLead: number,
  baseAffiliate: number,
  financingPropensity: number,
): RegionalMonetizationSignal {
  const profile = getRegionalProfile(regionId);
  const m = profile.monetizationMultiplier;

  const adjustedLeadPriority      = Math.min(10, Math.round(baseLead      * m));
  const adjustedAffiliatePriority = Math.min(10, Math.round(baseAffiliate * m));
  const financingAmplified        = financingPropensity >= 6 && profile.financingPressure >= 6;

  const leadValueNote =
    m >= 1.5 ? `Leads in ${profile.label} carry premium value — high contractor density and strong market demand.`
  : m >= 1.2 ? `${profile.label} is a solid lead market with above-average conversion rates.`
  :            `Lead value in ${profile.label} is at the national baseline.`;

  return {
    adjustedLeadPriority,
    adjustedAffiliatePriority,
    financingAmplified,
    leadValueNote,
  };
}

// ── Full regional context resolver ─────────────────────────────────────────
export function resolveRegionalContext(
  params: RegionalContextParams,
): ResolvedRegionalContext {
  const {
    regionId,
    baseLowUSD,
    baseMidUSD,
    baseHighUSD,
    entityClass,
    leadSuitability,
    affiliateSuitability,
    financingPropensity,
  } = params;

  const profile          = getRegionalProfile(regionId);
  const adjustedEstimate = applyRegionalModifier(baseLowUSD, baseMidUSD, baseHighUSD, regionId);
  const trustSignals     = getRegionalTrustSignals(regionId, entityClass);
  const monetization     = getRegionalMonetizationSignal(
    regionId,
    leadSuitability,
    affiliateSuitability,
    financingPropensity,
  );

  return {
    regionId,
    label:           profile.label,
    adjustedEstimate,
    trustSignals,
    monetization,
    confidence:      profile.regionalConfidence,
  };
}
