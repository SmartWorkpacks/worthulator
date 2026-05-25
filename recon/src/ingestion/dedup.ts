// ─── Deduplication engine ─────────────────────────────────────────────────────
// Fingerprint-based dedup. Fingerprint = SHA-256 of (source + normalised title + rounded price).
// In-memory store for a single run; DB-backed for cross-run dedup.

import { createHash } from 'crypto';
import type { RawListing, DedupResult } from '../types';

// ─── Fingerprint generation ───────────────────────────────────────────────────

function normaliseTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/\b(brand new|new in box|deadstock|ds|nib|nwt|nwob|oem|retail)\b/g, '')
    .replace(/[^a-z0-9 ]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function fingerprint(listing: Pick<RawListing, 'source' | 'title' | 'price'>): string {
  const price  = listing.price !== null ? Math.round(listing.price) : 'null';
  const input  = `${listing.source}|${normaliseTitle(listing.title)}|${price}`;
  return createHash('sha256').update(input).digest('hex').slice(0, 16);
}

// ─── In-memory dedup store ────────────────────────────────────────────────────

export class DedupStore {
  private seen = new Map<string, string>();   // fingerprint → listing id

  check(listing: RawListing): DedupResult {
    const fp  = fingerprint(listing);
    const dup = this.seen.has(fp);
    return {
      isDuplicate: dup,
      fingerprint: fp,
      existingId:  dup ? this.seen.get(fp) : undefined,
    };
  }

  register(listing: RawListing): string {
    const fp = fingerprint(listing);
    this.seen.set(fp, listing.id);
    return fp;
  }

  /** Seed from DB to enable cross-run dedup */
  seed(entries: Array<{ fingerprint: string; listingId: string }>): void {
    for (const { fingerprint: fp, listingId } of entries) {
      this.seen.set(fp, listingId);
    }
  }

  size(): number { return this.seen.size; }
  clear(): void  { this.seen.clear(); }
}

// ─── Singleton per-run store ──────────────────────────────────────────────────

let _store: DedupStore | null = null;

export function getDedupStore(): DedupStore {
  if (!_store) _store = new DedupStore();
  return _store;
}

export function resetDedupStore(): void {
  _store = null;
}
