// ─── WVE Search Intelligence — Public API — Phase 13 ─────────────────────────
// Unified smart search: exact → expansion → fuzzy fallback.

import { registry } from "../entityRegistry";
import type { RegistryEntity } from "../entityRegistry/types";
import { fuzzyScore } from "./fuzzy";
import { expandQuery } from "./queryExpander";

/**
 * Unified smart search across the entity registry.
 *
 * Strategy:
 *   1. Registry exact/prefix/contains search with original query
 *   2. If < 3 results, re-run with each expanded variant
 *   3. If still < 2 results, fuzzy-match against all canonical names + aliases
 *   4. Deduplicate by id, sort by score, return top `limit`
 */
export function smartSearch(q: string, limit = 8): RegistryEntity[] {
  const trimmed = q.trim();
  if (!trimmed || trimmed.length < 2) return [];

  const seen   = new Set<string>();
  const scored: Array<{ entity: RegistryEntity; score: number }> = [];

  function add(entities: RegistryEntity[], baseScore: number): void {
    for (const e of entities) {
      if (seen.has(e.id)) continue;
      seen.add(e.id);
      scored.push({ entity: e, score: baseScore });
    }
  }

  // Round 1: registry exact/prefix/contains search
  add(registry.search(trimmed, 20), 100);

  // Round 2: expanded variants
  if (scored.length < 3) {
    const expansions = expandQuery(trimmed);
    for (const variant of expansions.slice(1)) {
      add(registry.search(variant, 10), 80);
    }
  }

  // Round 3: character-level fuzzy across all entities
  if (scored.length < 2) {
    const lower = trimmed.toLowerCase();
    for (const entity of registry.all()) {
      if (seen.has(entity.id)) continue;
      const nameScore  = fuzzyScore(lower, entity.canonicalName);
      const aliasScore = entity.aliases.reduce(
        (best, alias) => Math.max(best, fuzzyScore(lower, alias)),
        0,
      );
      const best = Math.max(nameScore, aliasScore);
      if (best >= 40) {
        seen.add(entity.id);
        scored.push({ entity, score: best * 0.6 });
      }
    }
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.entity);
}

export { fuzzyScore } from "./fuzzy";
export { expandQuery } from "./queryExpander";
