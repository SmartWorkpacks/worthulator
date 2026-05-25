// ─── WVE Monetization Engine — Phase 13/14 ────────────────────────────────────
// Converts entity + session context into a prioritised commercial action plan.
// Phase 14: entity-class-aware action selection + regional multiplier support.
// Pure, SSR-safe, zero side-effects.

import { registry } from "../entityRegistry";
import { getMonetizationMultiplier } from "../regional";
import type { MonetizationAction, MonetizationAssessment, MonetizationContext } from "./types";
import type { EconomicEntityClass } from "../types";

// ── Fallback baselines (when no registry entity found) ─────────────────────
const BASELINE_LEAD: Record<string, number> = {
  "service-estimate": 9,
  "market-value":     4,
  "appreciation":     6,
};
const BASELINE_AFFILIATE: Record<string, number> = {
  "service-estimate": 3,
  "market-value":     8,
  "appreciation":     5,
};

// ── Revenue tier thresholds ─────────────────────────────────────────────────
function revenueTier(ltv: number): MonetizationAssessment["revenueTier"] {
  if (ltv >= 10_000) return "high";
  if (ltv >= 1_000)  return "medium";
  return "low";
}

// ── Estimated LTV calculator ─────────────────────────────────────────────────
// LTV = averageOrderValue × (leadSuitability / 10) × conversionRate
// Conversion rate is implied at ~3% for high-lead entities, 1.5% otherwise.
function estimateLTV(averageOrderValue: number, leadSuitability: number): number {
  const conversionRate = leadSuitability >= 8 ? 0.03 : 0.015;
  return Math.round(averageOrderValue * (leadSuitability / 10) * conversionRate * 100) / 100;
}

// ── Action builders ─────────────────────────────────────────────────────────
function buildLeadAction(leadPriority: number): MonetizationAction {
  return {
    type:        "lead_form",
    priority:    leadPriority >= 8 ? 1 : leadPriority >= 5 ? 2 : 3,
    label:       "Contractor Quotes",
    description: "Connect with local contractors for verified pricing on this project.",
    ctaText:     "Get Free Quotes",
    href:        "/contact",
  };
}

function buildAffiliateAction(affiliatePriority: number): MonetizationAction {
  return {
    type:        "affiliate_links",
    priority:    affiliatePriority >= 8 ? 1 : affiliatePriority >= 5 ? 2 : 3,
    label:       "Marketplace Prices",
    description: "See current buy/sell prices across major platforms.",
    ctaText:     "Browse Live Prices",
    href:        "/tools",
  };
}

function buildFinancingAction(estimateAmount: number): MonetizationAction {
  return {
    type:        "financing_cta",
    priority:    2,
    label:       "Financing Options",
    description: `Projects around $${estimateAmount.toLocaleString()} may qualify for 0% intro financing or home equity products.`,
    ctaText:     "Explore Financing",
    href:        "/tools",
  };
}

function buildAdvisoryAction(): MonetizationAction {
  return {
    type:        "advisory",
    priority:    4,
    label:       "Expert Consultation",
    description: "Speak with a specialist to validate this estimate for your specific situation.",
    ctaText:     "Talk to an Expert",
    href:        "/contact",
  };
}

// ── Class-specific action builders (Phase 14) ──────────────────────────────

function buildResaleMarketplaceAction(): MonetizationAction {
  return {
    type:        "resale_marketplace",
    priority:    2,
    label:       "Resale Platforms",
    description: "See live buy/sell prices on StockX, eBay, and other resale marketplaces.",
    ctaText:     "Browse Resale Prices",
    href:        "/tools",
  };
}

function buildSavingsOfferAction(): MonetizationAction {
  return {
    type:        "savings_offer",
    priority:    1,
    label:       "Reduce This Cost",
    description: "Compare providers and find savings opportunities for this recurring expense.",
    ctaText:     "Find Savings",
    href:        "/tools",
  };
}

function buildBrokerAffiliateAction(): MonetizationAction {
  return {
    type:        "broker_affiliate",
    priority:    2,
    label:       "Investment Platforms",
    description: "Compare exchanges, brokers, and platforms for this asset class.",
    ctaText:     "Compare Platforms",
    href:        "/tools",
  };
}

function buildInsuranceCTAAction(): MonetizationAction {
  return {
    type:        "insurance_cta",
    priority:    3,
    label:       "Insurance Estimate",
    description: "High-value assets and ownership decisions typically require updated insurance coverage.",
    ctaText:     "Get Insurance Quote",
    href:        "/contact",
  };
}

// ── Class → action strategy map ──────────────────────────────────────────────
// Returns the class-specific action(s) to inject based on entity class.
function classActions(
  entityClass: EconomicEntityClass,
  leadPriority: number,
  affiliatePriority: number,
): MonetizationAction[] {
  switch (entityClass) {
    case "services":
      return leadPriority >= 4 ? [buildLeadAction(leadPriority)] : [];

    case "products":
      return [
        ...(affiliatePriority >= 5 ? [buildAffiliateAction(affiliatePriority)] : []),
        buildResaleMarketplaceAction(),
      ];

    case "assets":
    case "ownership-economics":
      return [
        buildInsuranceCTAAction(),
        ...(leadPriority >= 4 ? [buildLeadAction(leadPriority)] : []),
      ];

    case "utilities":
      return [buildSavingsOfferAction()];

    case "investments":
      return [
        buildBrokerAffiliateAction(),
        ...(affiliatePriority >= 5 ? [buildAffiliateAction(affiliatePriority)] : []),
      ];

    case "life-events":
      return [
        buildComparisonAction(),
        ...(leadPriority >= 4 ? [buildLeadAction(leadPriority)] : []),
      ];

    case "business-economics":
      return [
        buildAdvisoryAction(),
        ...(affiliatePriority >= 5 ? [buildAffiliateAction(affiliatePriority)] : []),
      ];

    default:
      return [
        ...(leadPriority >= 4      ? [buildLeadAction(leadPriority)]           : []),
        ...(affiliatePriority >= 5 ? [buildAffiliateAction(affiliatePriority)] : []),
      ];
  }
}

function buildComparisonAction(): MonetizationAction {
  return {
    type:        "comparison_tool",
    priority:    3,
    label:       "Compare Options",
    description: "See how this estimate compares to alternative products or approaches.",
    ctaText:     "Compare Now",
    href:        "/tools",
  };
}

// ── Main engine ─────────────────────────────────────────────────────────────

/** Compute a full monetization assessment for an estimate session */
export function computeMonetization(ctx: MonetizationContext): MonetizationAssessment {
  const entity = ctx.entityId ? registry.get(ctx.entityId) : undefined;

  // ── Signal sources ───────────────────────────────────────────────────────
  const leadSuitability = entity?.monetization.leadSuitability
    ?? BASELINE_LEAD[ctx.estimationType] ?? 5;

  const affiliateSuitability = entity?.monetization.affiliateSuitability
    ?? BASELINE_AFFILIATE[ctx.estimationType] ?? 4;

  const financingPropensity = entity?.monetization.financingPropensity ?? 0;
  const averageOrderValue   = entity?.monetization.averageOrderValue ?? ctx.estimateAmount;

  // ── Regional multiplier (Phase 14) ───────────────────────────────────────
  const regionalMultiplier = ctx.regionId ? getMonetizationMultiplier(ctx.regionId) : 1.0;

  // ── Engagement amplifier (high engagement boosts lead urgency) ───────────
  // engagementScore 0–10 → multiplier 0.8–1.2
  const engagementMultiplier = 0.8 + (ctx.engagementScore / 10) * 0.4;

  const leadPriority      = Math.min(Math.round(leadSuitability * engagementMultiplier * regionalMultiplier * 10) / 10, 10);
  const affiliatePriority = Math.min(Math.round(affiliateSuitability * regionalMultiplier * 10) / 10, 10);

  // Financing: registry propensity > 6, OR explicit detection, OR large project
  const showFinancing = ctx.financingDetected
    ?? (financingPropensity >= 6 || ctx.estimateAmount >= 8_000);

  // ── LTV calculation ──────────────────────────────────────────────────────
  const estimatedLTV = estimateLTV(averageOrderValue, leadSuitability);

  // ── Monetization composite score (feeds back into escalationScorer) ──────
  // Blends lead + affiliate + financing signals into a 0–10 score
  const monetizationScore = Math.min(
    Math.round(
      (leadPriority * 0.55 + affiliatePriority * 0.30 + (showFinancing ? 2 : 0) * 0.15) * 10,
    ) / 10,
    10,
  );

  // ── Resolve entity class (Phase 14) ──────────────────────────────────────
  // ctx.entityClass overrides registry field; registry field overrides estimation type fallback
  const FALLBACK_CLASS: Record<string, EconomicEntityClass> = {
    "service-estimate": "services",
    "market-value":     "products",
    "appreciation":     "investments",
  };
  const entityClass: EconomicEntityClass =
    ctx.entityClass
    ?? entity?.entityClass
    ?? FALLBACK_CLASS[ctx.estimationType]
    ?? "products";

  // ── Build action list (class-aware) ──────────────────────────────────────
  const actions: MonetizationAction[] = classActions(entityClass, leadPriority, affiliatePriority);

  // Financing CTA appended regardless of class when threshold met
  if (showFinancing && !actions.some((a) => a.type === "financing_cta"))
    actions.push(buildFinancingAction(ctx.estimateAmount));

  // Comparison tool for market-value/appreciation types that don't already have one
  if (
    (ctx.estimationType === "market-value" || ctx.estimationType === "appreciation") &&
    !actions.some((a) => a.type === "comparison_tool")
  ) actions.push(buildComparisonAction());

  // Advisory as low-priority catch-all when engagement is high
  if (ctx.engagementScore >= 6 && !actions.some((a) => a.type === "advisory"))
    actions.push(buildAdvisoryAction());

  // Sort by priority (ascending)
  actions.sort((a, b) => a.priority - b.priority);

  // ── Regional note ─────────────────────────────────────────────────────────
  const regionalNote = (ctx.regionId && regionalMultiplier > 1.2)
    ? `Lead values in this region are ${Math.round((regionalMultiplier - 1) * 100)}% above the national baseline.`
    : undefined;

  return {
    revenueTier:      revenueTier(estimatedLTV),
    leadPriority,
    affiliatePriority,
    showFinancing,
    estimatedLTV,
    monetizationScore,
    actions,
    entityClass,
    ...(regionalNote ? { regionalNote } : {}),
  };
}
