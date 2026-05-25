// ─── StockX adapter ───────────────────────────────────────────────────────────
// StockX-specific enrichment. StockX data is authenticated, so trust is high.
// Extracts: size, colorway, last sale date, trade count.

import type { RawListing, EnrichedListing } from '../../types';
import { getSourceTrust } from '../sourceScorer';

// StockX actor returns structured items — pull through extra fields
interface StockXRaw extends Record<string, unknown> {
  size?:          string;
  colorway?:      string;
  lastSaleDate?:  string;
  tradeCount?:    number;
  askCount?:      number;
}

export function adaptStockX(listing: RawListing): EnrichedListing {
  const raw    = listing.raw as StockXRaw;
  const sizeRaw = raw.size ?? null;

  return {
    ...listing,
    sourceTrust:  getSourceTrust('stockx'),
    fingerprint:  '',            // set by dedup engine
    sizeInfo:     sizeRaw ? normaliseSize(String(sizeRaw)) : undefined,
    extractedSpecs: {
      colorway:      raw.colorway,
      lastSaleDate:  raw.lastSaleDate,
      tradeCount:    raw.tradeCount,
      askCount:      raw.askCount,
    },
  };
}

function normaliseSize(raw: string): string {
  // "10" → "US 10", "10.5" → "US 10.5", already "US 10" → keep
  if (/^us\s*[\d.]+/i.test(raw)) return raw.toUpperCase();
  return `US ${raw.trim()}`;
}
