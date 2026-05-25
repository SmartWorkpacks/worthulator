// ─── WVE AI Context — Builder — Phase 13/14 ──────────────────────────────────
// Assembles a structured AIContextPayload from registry + quality + graph.
// Phase 14: entity class, economic model, lifecycle, volatility, regional profile.
// Pure data transformation — no API calls, no side-effects, SSR-safe.

import { registry } from "../entityRegistry";
import { computeQuality } from "../quality/scorer";
import { getRelatedEntities, getCrossClassRelated } from "../entityGraph";
import { getRegionalProfile } from "../regional";
import type { AIContextPayload } from "./types";
import type { EconomicEntityClass, EconomicModel, LifecycleType } from "../types";

// ── Class/model derivation maps (mirrors intentRouter — no circular import) ──
const VERTICAL_TO_CLASS: Record<string, EconomicEntityClass> = {
  "home-services": "services",
  "electronics":   "products",
  "luxury":        "investments",
  "sneakers":      "products",
};

const TYPE_TO_MODEL: Record<string, EconomicModel> = {
  "service-estimate": "project-economics",
  "market-value":     "resale-value",
  "appreciation":     "appreciation",
};

const TYPE_TO_LIFECYCLE: Record<string, LifecycleType> = {
  "service-estimate": "project-based",
  "market-value":     "one-time-purchase",
  "appreciation":     "lifecycle-asset",
};

export interface BuildAIContextParams {
  entityId: string;
  estimateAmount?: number;
  region?: string;
  isRepeatVisit?: boolean;
  viewCount?: number;
  sessionEstimateCount?: number;
}

/**
 * Build a full AIContextPayload for the given entity.
 * Returns null if the entity is not found in the registry.
 */
export function buildAIContext(params: BuildAIContextParams): AIContextPayload | null {
  const entity = registry.get(params.entityId);
  if (!entity) return null;

  const quality = computeQuality(entity);

  // ── Economic interpretation ────────────────────────────────────────────
  const entityClass: EconomicEntityClass =
    entity.entityClass ?? VERTICAL_TO_CLASS[entity.vertical] ?? "products";
  const economicModel: EconomicModel =
    entity.economicModel ?? TYPE_TO_MODEL[entity.estimationType] ?? "resale-value";
  const lifecycleType: LifecycleType =
    entity.lifecycleType ?? TYPE_TO_LIFECYCLE[entity.estimationType] ?? "one-time-purchase";

  // ── Related entities — graph + cross-class ─────────────────────────────
  const graphRelated  = getRelatedEntities(entity.serviceType ?? entity.id, entity.vertical, 3);
  const crossRelated  = getCrossClassRelated(entity.id, 2);
  const allRelated    = [...graphRelated, ...crossRelated].slice(0, 4);

  const relatedEntities = allRelated.map((rel) => {
    const regEntity = rel.entityId ? registry.get(rel.entityId) : undefined;
    return {
      id:             rel.entityId ?? rel.serviceType,
      name:           rel.name,
      benchmarkMidUSD: regEntity
        ? Math.round((regEntity.benchmark.lowUSD + regEntity.benchmark.highUSD) / 2)
        : 0,
      strength:       rel.strength,
      economicClass:  rel.economicClass,
    };
  });

  // ── Monetization summary ───────────────────────────────────────────────
  const mon = entity.monetization;
  const revenueTier: "high" | "medium" | "low" =
    mon.commercialWeight === "high"   ? "high" :
    mon.commercialWeight === "medium" ? "medium" : "low";

  const estimatedLTV = Math.round(
    mon.averageOrderValue * (mon.leadSuitability / 10) * 0.03,
  );

  // ── Regional economics ─────────────────────────────────────────────────
  const regionId = params.region;
  const regionalEconomics = regionId
    ? (() => {
        const rp = getRegionalProfile(regionId);
        return {
          regionId:               rp.regionId,
          label:                  rp.label,
          laborTier:              rp.laborTier,
          inflationPressure:      rp.inflationPressure,
          disasterExposure:       rp.disasterExposure,
          insurancePressure:      rp.insurancePressure,
          monetizationMultiplier: rp.monetizationMultiplier,
          regionalConfidence:     rp.regionalConfidence,
        };
      })()
    : undefined;

  return {
    entityId:       entity.id,
    entityName:     entity.canonicalName,
    estimationType: entity.estimationType,
    vertical:       entity.vertical,
    category:       entity.category,
    serviceType:    entity.serviceType,

    entityClass,
    economicModel,
    lifecycleType,
    volatility:    entity.volatilityProfile,

    estimateRange: {
      lowUSD:  entity.benchmark.lowUSD,
      midUSD:  entity.benchmark.midUSD,
      highUSD: entity.benchmark.highUSD,
    },
    estimateAmount: params.estimateAmount,
    region:         regionId,
    regionalEconomics,

    quality: {
      score:           quality.score,
      tier:            quality.tier,
      confidenceLabel: entity.benchmark.confidenceLevel,
      benchmarkSource: entity.benchmark.benchmarkSource,
      lastUpdated:     entity.benchmark.lastUpdated,
    },

    monetization: {
      leadSuitability:      mon.leadSuitability,
      affiliateSuitability: mon.affiliateSuitability,
      estimatedLTV,
      revenueTier,
    },

    relatedEntities,

    userContext: {
      isRepeatVisit:        params.isRepeatVisit ?? false,
      viewCount:            params.viewCount ?? 1,
      sessionEstimateCount: params.sessionEstimateCount ?? 1,
    },

    generatedAt:   new Date().toISOString(),
    schemaVersion: "2.0",
  };
}
