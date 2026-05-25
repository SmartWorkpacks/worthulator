// ─── Entity DB queries — Phase 7 ─────────────────────────────────────────────

import { getDb }      from './client';
import type { EntityRecord, AliasRecord } from '../types';

export async function upsertEntity(record: EntityRecord): Promise<void> {
  const db = getDb();
  if (!db) return;

  const { error } = await db.from('recon_entities').upsert({
    id:              record.id,
    canonical_name:  record.canonicalName,
    brand:           record.brand,
    model:           record.model,
    category:        record.category,
    subcategory:     record.subcategory,
    vertical:        record.vertical,
    aliases:         record.aliases,
    price_range_low: record.priceRangeLow,
    price_range_high:record.priceRangeHigh,
    updated_at:      record.updatedAt,
  }, { onConflict: 'id' });

  if (error) console.error('[db] upsertEntity error:', error.message);
}

export async function insertAlias(record: AliasRecord): Promise<void> {
  const db = getDb();
  if (!db) return;

  const { error } = await db.from('recon_entity_aliases').upsert({
    id:         record.id,
    entity_id:  record.entityId,
    alias:      record.alias,
    source:     record.source,
    confidence: record.confidence,
  }, { onConflict: 'entity_id,alias' });

  if (error && !error.message.includes('unique')) {
    console.error('[db] insertAlias error:', error.message);
  }
}

export async function fetchAllEntities(): Promise<EntityRecord[]> {
  const db = getDb();
  if (!db) return [];

  const { data, error } = await db
    .from('recon_entities')
    .select('*')
    .eq('is_deleted', false);

  if (error) { console.error('[db] fetchAllEntities error:', error.message); return []; }

  return (data ?? []).map((row) => ({
    id:              row.id,
    canonicalName:   row.canonical_name,
    brand:           row.brand,
    model:           row.model,
    category:        row.category,
    subcategory:     row.subcategory,
    vertical:        row.vertical,
    aliases:         row.aliases ?? [],
    priceRangeLow:   row.price_range_low,
    priceRangeHigh:  row.price_range_high,
    createdAt:       row.created_at,
    updatedAt:       row.updated_at,
  }));
}

export async function searchEntitiesByName(
  query:   string,
  limit:   number = 10,
): Promise<EntityRecord[]> {
  const db = getDb();
  if (!db) return [];

  const { data, error } = await db
    .from('recon_entities')
    .select('*')
    .ilike('canonical_name', `%${query}%`)
    .eq('is_deleted', false)
    .limit(limit);

  if (error) { console.error('[db] searchEntities error:', error.message); return []; }

  return (data ?? []).map((row) => ({
    id:            row.id,
    canonicalName: row.canonical_name,
    brand:         row.brand,
    model:         row.model,
    category:      row.category,
    subcategory:   row.subcategory,
    vertical:      row.vertical,
    aliases:       row.aliases ?? [],
    priceRangeLow: row.price_range_low,
    priceRangeHigh:row.price_range_high,
    createdAt:     row.created_at,
    updatedAt:     row.updated_at,
  }));
}
