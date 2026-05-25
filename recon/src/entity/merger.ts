// ─── Entity merger — Phase 7 ──────────────────────────────────────────────────
// Detects candidate duplicate entities and merges them.
// Merge = redirect all aliases from source → target, then soft-delete source.

import { randomUUID } from 'crypto';
import Fuse           from 'fuse.js';
import type { EntityRecord, MergeRecord } from '../types';
import { getRegistry }  from './registry';
import { getDb }        from '../db/client';

export interface MergeCandidate {
  source:     EntityRecord;
  target:     EntityRecord;
  similarity: number;       // 0–1
  reason:     string;
}

// ─── Find merge candidates ────────────────────────────────────────────────────

export function findMergeCandidates(
  threshold: number = 0.85,
): MergeCandidate[] {
  const registry   = getRegistry();
  const all        = registry.all();
  const candidates: MergeCandidate[] = [];

  const fuse = new Fuse(all, {
    keys:         ['canonicalName'],
    threshold:    1 - threshold,
    includeScore: true,
  });

  const merged = new Set<string>();

  for (const entity of all) {
    if (merged.has(entity.id)) continue;

    const results = fuse.search(entity.canonicalName, { limit: 5 });

    for (const result of results) {
      const candidate = result.item;
      if (candidate.id === entity.id) continue;
      if (merged.has(candidate.id))   continue;

      const similarity = result.score !== undefined ? 1 - result.score : 0;
      if (similarity < threshold) continue;

      // Same vertical required for merge
      if (candidate.vertical !== entity.vertical) continue;

      candidates.push({
        source:     candidate,
        target:     entity,
        similarity: Math.round(similarity * 100) / 100,
        reason:     `canonical name similarity ${(similarity * 100).toFixed(1)}%`,
      });
      merged.add(candidate.id);
    }
  }

  return candidates;
}

// ─── Execute a merge ──────────────────────────────────────────────────────────

export async function mergeEntities(
  sourceId:   string,
  targetId:   string,
  reason:     string,
  confidence: number,
): Promise<MergeRecord | null> {
  const registry = getRegistry();
  const source   = registry.getById(sourceId);
  const target   = registry.getById(targetId);

  if (!source || !target) {
    console.warn(`[merger] entity not found: ${sourceId} or ${targetId}`);
    return null;
  }

  // Transfer aliases from source → target
  for (const alias of source.aliases) {
    registry.addAlias(targetId, alias, 'manual', confidence);
  }
  registry.addAlias(targetId, source.canonicalName, 'manual', confidence);

  const record: MergeRecord = {
    id:             randomUUID(),
    sourceEntityId: sourceId,
    targetEntityId: targetId,
    reason,
    confidence,
    createdAt:      new Date().toISOString(),
  };

  await persistMerge(record);
  console.log(`[merger] merged "${source.canonicalName}" → "${target.canonicalName}" (${(confidence * 100).toFixed(0)}%)`);
  return record;
}

// ─── DB persistence ───────────────────────────────────────────────────────────

async function persistMerge(record: MergeRecord): Promise<void> {
  const db = getDb();
  if (!db) return;
  await db.from('recon_entity_merges').insert({
    id:               record.id,
    source_entity_id: record.sourceEntityId,
    target_entity_id: record.targetEntityId,
    reason:           record.reason,
    confidence:       record.confidence,
  });
}
