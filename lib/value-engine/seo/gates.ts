// ─── WVE SEO Quality Gates — Phase 13 ────────────────────────────────────────
// Centralized quality-gating functions for route generation and sitemap.
// All decisions flow through computeQuality — never the static registry flags alone.

import { registry } from "../entityRegistry";
import type { RegistryEntity } from "../entityRegistry/types";
import { computeQuality } from "../quality/scorer";
import type { QualityAssessment } from "../quality/types";

/** Threshold map for SEO priority → sitemap priority score */
const SITEMAP_PRIORITY: Record<string, number> = {
  high:   0.9,
  medium: 0.8,
  low:    0.7,
};

/** Convert YYYY-MM benchmark date to a JS Date for lastModified */
function benchmarkDate(lastUpdated: string): Date {
  const [year, month] = lastUpdated.split("-");
  if (year && month) {
    return new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
  }
  return new Date();
}

// ── Core gate queries ─────────────────────────────────────────────────────────

/**
 * All entities whose COMPUTED quality makes them route-eligible.
 * routeEligible = static flag + computed score >= minQualityGate.
 * Used by generateStaticParams.
 */
export function getRouteEligibleEntities(): RegistryEntity[] {
  return registry.all().filter((e) => computeQuality(e).routeEligible);
}

/**
 * All entities whose COMPUTED quality makes them index-eligible.
 * indexEligible = routeEligible + tier is premium or standard.
 * Used for robots.index decisions.
 */
export function getIndexEligibleEntities(): RegistryEntity[] {
  return registry.all().filter((e) => computeQuality(e).indexEligible);
}

/**
 * Entities for inclusion in the sitemap.
 * Must be index-eligible AND have seo.includeInSitemap = true.
 * Sorted by SEO priority descending.
 */
export function getSitemapEntities(): Array<{
  entity: RegistryEntity;
  quality: QualityAssessment;
}> {
  return registry
    .all()
    .map((e) => ({ entity: e, quality: computeQuality(e) }))
    .filter(({ entity, quality }) => entity.seo.includeInSitemap && quality.indexEligible)
    .sort((a, b) => {
      const pa = SITEMAP_PRIORITY[a.entity.seo.priority] ?? 0.7;
      const pb = SITEMAP_PRIORITY[b.entity.seo.priority] ?? 0.7;
      return pb - pa;
    });
}

/**
 * Full quality gate check for a single entity.
 * Returns the assessment + gating decision.
 */
export function evaluateGate(entityId: string): {
  routeEligible: boolean;
  indexEligible: boolean;
  quality: QualityAssessment;
} | null {
  const entity = registry.get(entityId);
  if (!entity) return null;
  const quality = computeQuality(entity);
  return {
    routeEligible: quality.routeEligible,
    indexEligible: quality.indexEligible,
    quality,
  };
}

/** Build a sitemap entry object from an entity + quality result */
export function toSitemapEntry(
  entity: RegistryEntity,
  baseUrl: string,
): {
  url: string;
  lastModified: Date;
  changeFrequency: "monthly" | "weekly";
  priority: number;
} {
  return {
    url:             `${baseUrl}/value-engine/result/${entity.id}`,
    lastModified:    benchmarkDate(entity.benchmark.lastUpdated),
    changeFrequency: entity.seo.priority === "high" ? "weekly" : "monthly",
    priority:        SITEMAP_PRIORITY[entity.seo.priority] ?? 0.7,
  };
}
