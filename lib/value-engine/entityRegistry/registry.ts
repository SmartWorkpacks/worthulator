// ─── WVE Entity Registry — Phase 13 ─────────────────────────────────────────
// Scalable registry class for systematic entity ingestion and querying.
// Singleton pattern — import `registry` for all registry operations.

import type { VerticalSlug, EstimationType } from "../types";
import type { RegistryEntity, RegistryQueryFilters } from "./types";

// ── Priority ordering ─────────────────────────────────────────────────────
const SEO_PRIORITY_RANK = { high: 3, medium: 2, low: 1 };
const COMMERCIAL_RANK   = { high: 3, medium: 2, low: 1 };

export class EntityRegistry {
  private _entities: Map<string, RegistryEntity> = new Map();

  // ── Write ───────────────────────────────────────────────────────────────

  /** Register a single entity. Overwrites on duplicate id. */
  register(entity: RegistryEntity): void {
    this._entities.set(entity.id, entity);
  }

  /** Register multiple entities at once */
  registerAll(entities: RegistryEntity[]): void {
    for (const e of entities) this.register(e);
  }

  // ── Read ────────────────────────────────────────────────────────────────

  get(id: string): RegistryEntity | undefined {
    return this._entities.get(id);
  }

  has(id: string): boolean {
    return this._entities.has(id);
  }

  all(): RegistryEntity[] {
    return Array.from(this._entities.values());
  }

  count(): number {
    return this._entities.size;
  }

  // ── Query ───────────────────────────────────────────────────────────────

  query(filters: RegistryQueryFilters = {}): RegistryEntity[] {
    let results = this.all();

    if (filters.vertical)
      results = results.filter((e) => e.vertical === filters.vertical);

    if (filters.category)
      results = results.filter((e) => e.category === filters.category);

    if (filters.estimationType)
      results = results.filter((e) => e.estimationType === filters.estimationType);

    if (filters.commercialWeight)
      results = results.filter((e) => e.monetization.commercialWeight === filters.commercialWeight);

    if (filters.routeEligibleOnly)
      results = results.filter((e) => e.quality.routeEligible);

    if (filters.sitemapOnly)
      results = results.filter((e) => e.seo.includeInSitemap && e.quality.routeEligible);

    if (filters.seoMinPriority) {
      const minRank = SEO_PRIORITY_RANK[filters.seoMinPriority];
      results = results.filter((e) => SEO_PRIORITY_RANK[e.seo.priority] >= minRank);
    }

    return results;
  }

  byVertical(vertical: VerticalSlug): RegistryEntity[] {
    return this.query({ vertical });
  }

  byCategory(category: string): RegistryEntity[] {
    return this.query({ category });
  }

  /** All entities eligible for sitemap + route generation */
  forSitemap(): RegistryEntity[] {
    return this.query({ sitemapOnly: true }).sort(
      (a, b) => SEO_PRIORITY_RANK[b.seo.priority] - SEO_PRIORITY_RANK[a.seo.priority],
    );
  }

  /** High-value entities for monetization prioritisation */
  highCommercialValue(): RegistryEntity[] {
    return this.query({ commercialWeight: "high", routeEligibleOnly: true }).sort(
      (a, b) => b.monetization.averageOrderValue - a.monetization.averageOrderValue,
    );
  }

  /** Fuzzy search across canonicalName and aliases */
  search(q: string, limit = 10): RegistryEntity[] {
    const lower = q.toLowerCase().trim();
    if (!lower) return [];

    const scored: Array<{ entity: RegistryEntity; score: number }> = [];

    for (const entity of this._entities.values()) {
      let score = 0;

      if (entity.id === lower)                                    score = 100;
      else if (entity.canonicalName.toLowerCase() === lower)      score = 95;
      else if (entity.canonicalName.toLowerCase().startsWith(lower)) score = 80;
      else if (entity.canonicalName.toLowerCase().includes(lower)) score = 60;
      else if (entity.seo.primaryKeyword.toLowerCase().includes(lower)) score = 50;
      else {
        for (const alias of entity.aliases) {
          if (alias.toLowerCase() === lower)      { score = Math.max(score, 70); break; }
          if (alias.toLowerCase().includes(lower)) { score = Math.max(score, 40); }
        }
        for (const kw of entity.seo.relatedKeywords) {
          if (kw.toLowerCase().includes(lower)) { score = Math.max(score, 30); }
        }
      }

      if (score > 0) scored.push({ entity, score });
    }

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((s) => s.entity);
  }

  /** Build a URL for a registry entity */
  buildHref(entity: RegistryEntity): string {
    const params = new URLSearchParams({
      type: entity.estimationType,
      name: entity.canonicalName,
      vertical: entity.vertical,
      category: entity.category,
      ...(entity.serviceType ? { serviceType: entity.serviceType } : {}),
    });
    return `/value-engine/result/${entity.id}?${params.toString()}`;
  }
}
