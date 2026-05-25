// ─── Historical storage queries — Phase 8 ────────────────────────────────────

import { randomUUID } from 'crypto';
import { getDb }      from './client';
import type {
  MarketListing, NormalizedPrice, HistoricalSnapshot, ConditionNorm, ConfidenceBand
} from '../types';

// ─── Market listings ──────────────────────────────────────────────────────────

export async function insertMarketListings(
  listings: MarketListing[],
): Promise<void> {
  const db = getDb();
  if (!db || listings.length === 0) return;

  const rows = listings.map((l) => ({
    id:         l.id,
    entity_id:  l.entityId,
    run_id:     l.runId,
    source:     l.source,
    price_usd:  l.priceUsd,
    condition:  l.condition,
    region:     l.region,
    url:        l.url,
    scraped_at: l.scrapedAt,
  }));

  const { error } = await db.from('recon_market_listings').insert(rows);
  if (error) console.error('[db] insertMarketListings error:', error.message);
}

export async function fetchMarketListings(
  entityId:  string,
  condition: ConditionNorm,
  limitDays: number = 90,
): Promise<MarketListing[]> {
  const db = getDb();
  if (!db) return [];

  const since = new Date(Date.now() - limitDays * 86_400_000).toISOString();

  const { data, error } = await db
    .from('recon_market_listings')
    .select('*')
    .eq('entity_id',  entityId)
    .eq('condition',  condition)
    .gte('scraped_at', since)
    .order('scraped_at', { ascending: false });

  if (error) { console.error('[db] fetchMarketListings error:', error.message); return []; }

  return (data ?? []).map((row) => ({
    id:        row.id,
    entityId:  row.entity_id,
    source:    row.source,
    priceUsd:  row.price_usd,
    condition: row.condition,
    region:    row.region,
    url:       row.url,
    scrapedAt: row.scraped_at,
    runId:     row.run_id,
  }));
}

// ─── Normalized prices ────────────────────────────────────────────────────────

export async function upsertNormalizedPrice(np: NormalizedPrice): Promise<void> {
  const db = getDb();
  if (!db) return;

  const { error } = await db.from('recon_normalized_prices').upsert({
    id:           np.id,
    entity_id:    np.entityId,
    condition:    np.condition,
    p25:          np.p25,
    median:       np.median,
    p75:          np.p75,
    mean:         np.mean,
    std_dev:      np.stdDev,
    cv:           np.cv,
    confidence:   np.confidence,
    sample_count: np.sampleCount,
    computed_at:  np.computedAt,
  }, { onConflict: 'entity_id,condition' });

  if (error) console.error('[db] upsertNormalizedPrice error:', error.message);
}

export async function fetchNormalizedPrice(
  entityId:  string,
  condition: ConditionNorm,
): Promise<NormalizedPrice | null> {
  const db = getDb();
  if (!db) return null;

  const { data, error } = await db
    .from('recon_normalized_prices')
    .select('*')
    .eq('entity_id', entityId)
    .eq('condition',  condition)
    .single();

  if (error || !data) return null;

  return {
    id:          data.id,
    entityId:    data.entity_id,
    condition:   data.condition as ConditionNorm,
    p25:         data.p25,
    median:      data.median,
    p75:         data.p75,
    mean:        data.mean,
    stdDev:      data.std_dev,
    cv:          data.cv,
    confidence:  data.confidence as ConfidenceBand,
    sampleCount: data.sample_count,
    computedAt:  data.computed_at,
  };
}

// ─── Historical snapshots ─────────────────────────────────────────────────────

export async function insertSnapshot(snap: HistoricalSnapshot): Promise<void> {
  const db = getDb();
  if (!db) return;

  const { error } = await db.from('recon_historical_snapshots').insert({
    id:            snap.id,
    entity_id:     snap.entityId,
    snapshot_date: snap.snapshotDate,
    price_usd:     snap.priceUsd,
    source:        snap.source,
    condition:     snap.condition,
    region:        snap.region,
  });

  if (error) console.error('[db] insertSnapshot error:', error.message);
}

export async function fetchSnapshots(
  entityId:  string,
  condition: ConditionNorm,
  days:      number = 365,
): Promise<HistoricalSnapshot[]> {
  const db = getDb();
  if (!db) return [];

  const since = new Date(Date.now() - days * 86_400_000).toISOString().slice(0, 10);

  const { data, error } = await db
    .from('recon_historical_snapshots')
    .select('*')
    .eq('entity_id',  entityId)
    .eq('condition',  condition)
    .gte('snapshot_date', since)
    .order('snapshot_date', { ascending: true });

  if (error) { console.error('[db] fetchSnapshots error:', error.message); return []; }

  return (data ?? []).map((row) => ({
    id:           row.id,
    entityId:     row.entity_id,
    snapshotDate: row.snapshot_date,
    priceUsd:     row.price_usd,
    source:       row.source,
    condition:    row.condition,
    region:       row.region,
  }));
}

// ─── Snapshot builder — converts market listings to daily snapshots ───────────

export async function materialiseSnapshots(
  listings: MarketListing[],
): Promise<void> {
  const db = getDb();
  if (!db || listings.length === 0) return;

  const snaps: HistoricalSnapshot[] = listings.map((l) => ({
    id:           randomUUID(),
    entityId:     l.entityId,
    snapshotDate: new Date(l.scrapedAt).toISOString().slice(0, 10),
    priceUsd:     l.priceUsd,
    source:       l.source,
    condition:    l.condition,
    region:       l.region,
  }));

  const rows = snaps.map((s) => ({
    id:            s.id,
    entity_id:     s.entityId,
    snapshot_date: s.snapshotDate,
    price_usd:     s.priceUsd,
    source:        s.source,
    condition:     s.condition,
    region:        s.region,
  }));

  // Ignore conflicts (same entity+date+source already stored)
  const { error } = await db.from('recon_historical_snapshots').upsert(rows, {
    onConflict:     'id',
    ignoreDuplicates: true,
  });

  if (error) console.error('[db] materialiseSnapshots error:', error.message);
}
