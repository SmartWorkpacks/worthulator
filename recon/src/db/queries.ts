// ─── DB queries ───────────────────────────────────────────────────────────────
// All DB writes are optional — each function no-ops silently when getDb() is null.

import { getDb } from './client';
import type { RawListing, NormalizedListing, FeasibilityReport } from '../types';

export async function createRun(
  mode:      'mock' | 'live',
  verticals: string[],
): Promise<string | null> {
  const db = getDb();
  if (!db) return null;

  const { data, error } = await db
    .from('recon_runs')
    .insert({ mode, verticals, status: 'running' })
    .select('id')
    .single();

  if (error) { console.error('[db] createRun error:', error.message); return null; }
  return data.id as string;
}

export async function completeRun(runId: string): Promise<void> {
  const db = getDb();
  if (!db || !runId) return;
  await db.from('recon_runs').update({ status: 'done', completed_at: new Date().toISOString() }).eq('id', runId);
}

export async function insertRawListings(
  runId:    string | null,
  listings: RawListing[],
): Promise<void> {
  const db = getDb();
  if (!db || !runId || listings.length === 0) return;

  const rows = listings.map((l) => ({
    run_id:   runId,
    source:   l.source,
    vertical: l.vertical,
    title:    l.title,
    price:    l.price,
    currency: l.currency,
    condition: l.condition,
    url:      l.url,
    region:   l.region,
    raw_data: l.raw,
  }));

  const { error } = await db.from('recon_listings_raw').insert(rows);
  if (error) console.error('[db] insertRawListings error:', error.message);
}

export async function insertNormalizedListings(
  runId:    string | null,
  listings: NormalizedListing[],
): Promise<void> {
  const db = getDb();
  if (!db || !runId || listings.length === 0) return;

  const rows = listings.map((l) => ({
    run_id:            runId,
    entity:            l.entity,
    brand:             l.brand,
    model:             l.model,
    category:          l.category,
    subcategory:       l.subcategory,
    source:            l.source,
    vertical:          l.vertical,
    price:             l.price,
    currency:          l.currency,
    condition:         l.condition,
    region:            l.region,
    entity_confidence: l.entityConfidence,
  }));

  const { error } = await db.from('recon_listings_normalized').insert(rows);
  if (error) console.error('[db] insertNormalizedListings error:', error.message);
}

export async function insertReport(
  runId:  string | null,
  report: FeasibilityReport,
): Promise<void> {
  const db = getDb();
  if (!db || !runId) return;

  const { error } = await db
    .from('recon_reports')
    .insert({ run_id: runId, report });

  if (error) console.error('[db] insertReport error:', error.message);
}
