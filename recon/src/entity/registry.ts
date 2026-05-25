// ─── Entity Registry — Phase 7 ────────────────────────────────────────────────
// In-memory registry backed optionally by Supabase.
// On startup: loads from DB (if available).
// On lookup: in-memory only (fast).
// On write:  updates both memory + DB.

import { randomUUID } from 'crypto';
import Fuse           from 'fuse.js';
import type { EntityRecord, AliasRecord, VerticalSlug } from '../types';
import { getDb }      from '../db/client';

// ─── Bootstrap from catalog (Phase 1–5 VerticalConfigs) ──────────────────────

import { ALL_VERTICALS, VERTICAL_CONFIGS } from '../config/verticals';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface EntityLookupResult {
  entity:     EntityRecord;
  confidence: number;
  matchType:  'exact' | 'alias' | 'fuzzy' | 'none';
}

// ─── Registry class ───────────────────────────────────────────────────────────

export class EntityRegistry {
  private entities   = new Map<string, EntityRecord>();    // id → entity
  private byName     = new Map<string, string>();          // normalised name → id
  private aliasMaps  = new Map<string, string>();          // normalised alias → entity id
  private fuse!:     Fuse<EntityRecord>;
  private aliases:   AliasRecord[] = [];

  constructor() {
    this.bootstrapFromConfig();
    this.rebuildFuse();
  }

  // ─── Bootstrap canonical entities from vertical configs ─────────────────────

  private bootstrapFromConfig(): void {
    for (const slug of ALL_VERTICALS) {
      const vc = VERTICAL_CONFIGS[slug];
      for (const brand of vc.catalog) {
        for (const model of brand.models) {
          const existing = [...this.entities.values()].find(
            (e) => e.canonicalName === model.canonical,
          );
          if (existing) continue;

          // Derive a model ID from the canonical name (last token after brand)
          const modelId = model.canonical.replace(brand.brand, '').trim();

          // Flatten priceRange: take 'new' range first, then 'used', else undefined
          const rangeNew  = model.priceRange?.new;
          const rangeUsed = model.priceRange?.used;
          const range     = rangeNew ?? rangeUsed;

          const record: EntityRecord = {
            id:              randomUUID(),
            canonicalName:   model.canonical,
            brand:           brand.brand,
            model:           modelId,
            category:        vc.label,
            subcategory:     brand.brand,
            vertical:        slug,
            aliases:         model.aliases ?? [],
            priceRangeLow:   range?.[0],
            priceRangeHigh:  range?.[1],
            createdAt:       new Date().toISOString(),
            updatedAt:       new Date().toISOString(),
          };

          this.registerInternal(record);
        }
      }
    }
  }

  private registerInternal(record: EntityRecord): void {
    this.entities.set(record.id, record);
    this.byName.set(norm(record.canonicalName), record.id);
    for (const alias of record.aliases) {
      this.aliasMaps.set(norm(alias), record.id);
    }
  }

  private rebuildFuse(): void {
    this.fuse = new Fuse([...this.entities.values()], {
      keys:               ['canonicalName', 'brand', 'model', 'aliases'],
      threshold:           0.40,
      includeScore:        true,
    });
  }

  // ─── Lookup ──────────────────────────────────────────────────────────────────

  lookup(input: string): EntityLookupResult {
    const n = norm(input);

    // 1. Exact canonical name
    const exactId = this.byName.get(n);
    if (exactId) {
      return { entity: this.entities.get(exactId)!, confidence: 1.0, matchType: 'exact' };
    }

    // 2. Alias match
    const aliasId = this.aliasMaps.get(n);
    if (aliasId) {
      return { entity: this.entities.get(aliasId)!, confidence: 0.95, matchType: 'alias' };
    }

    // 3. Fuzzy
    const results = this.fuse.search(input);
    if (results.length > 0 && results[0].score !== undefined && results[0].score < 0.5) {
      const confidence = Math.round((1 - results[0].score) * 100) / 100;
      return { entity: results[0].item, confidence, matchType: 'fuzzy' };
    }

    // 4. None
    const stub = this.makeStub(input);
    return { entity: stub, confidence: 0.1, matchType: 'none' };
  }

  private makeStub(input: string): EntityRecord {
    return {
      id:            'unresolved',
      canonicalName: input,
      brand:         '',
      model:         '',
      category:      'unknown',
      subcategory:   'unknown',
      vertical:      'electronics',   // fallback
      aliases:       [],
      createdAt:     new Date().toISOString(),
      updatedAt:     new Date().toISOString(),
    };
  }

  // ─── Registration ────────────────────────────────────────────────────────────

  register(record: EntityRecord): void {
    this.registerInternal(record);
    this.rebuildFuse();
    this.persistEntity(record);
  }

  addAlias(entityId: string, alias: string, source: string, confidence: number): void {
    const entity = this.entities.get(entityId);
    if (!entity) return;

    const n = norm(alias);
    if (this.aliasMaps.has(n)) return;   // already known

    entity.aliases.push(alias);
    entity.updatedAt = new Date().toISOString();
    this.aliasMaps.set(n, entityId);

    const record: AliasRecord = {
      id:         randomUUID(),
      entityId,
      alias,
      source:     source as AliasRecord['source'],
      confidence,
      createdAt:  new Date().toISOString(),
    };
    this.aliases.push(record);
    this.rebuildFuse();
    this.persistAlias(record);
  }

  // ─── DB persistence (optional) ──────────────────────────────────────────────

  private async persistEntity(record: EntityRecord): Promise<void> {
    const db = getDb();
    if (!db) return;
    await db.from('recon_entities').upsert({
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
  }

  private async persistAlias(record: AliasRecord): Promise<void> {
    const db = getDb();
    if (!db) return;
    await db.from('recon_entity_aliases').insert({
      id:         record.id,
      entity_id:  record.entityId,
      alias:      record.alias,
      source:     record.source,
      confidence: record.confidence,
    });
  }

  async loadFromDb(): Promise<void> {
    const db = getDb();
    if (!db) return;

    const { data: rows } = await db.from('recon_entities').select('*');
    if (!rows) return;

    for (const row of rows) {
      const record: EntityRecord = {
        id:              row.id,
        canonicalName:   row.canonical_name,
        brand:           row.brand,
        model:           row.model,
        category:        row.category,
        subcategory:     row.subcategory,
        vertical:        row.vertical as VerticalSlug,
        aliases:         row.aliases ?? [],
        priceRangeLow:   row.price_range_low,
        priceRangeHigh:  row.price_range_high,
        createdAt:       row.created_at,
        updatedAt:       row.updated_at,
      };
      this.registerInternal(record);
    }
    this.rebuildFuse();
  }

  // ─── Accessors ───────────────────────────────────────────────────────────────

  getById(id: string): EntityRecord | undefined { return this.entities.get(id); }
  count():    number { return this.entities.size; }
  all():      EntityRecord[] { return [...this.entities.values()]; }
  allAliases(): AliasRecord[] { return this.aliases; }

  search(query: string, limit = 10): EntityRecord[] {
    return this.fuse.search(query, { limit }).map((r) => r.item);
  }
}

// ─── Normalise for comparison ─────────────────────────────────────────────────

function norm(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
}

// ─── Singleton ────────────────────────────────────────────────────────────────

let _registry: EntityRegistry | null = null;

export function getRegistry(): EntityRegistry {
  if (!_registry) _registry = new EntityRegistry();
  return _registry;
}

export function resetRegistry(): void { _registry = null; }
