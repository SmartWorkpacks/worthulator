// ─── Stale data detection ─────────────────────────────────────────────────────
// Each vertical has a freshness requirement. A listing is stale if its
// scraped_at is older than the requirement window.

import type { FreshnessReq, StaleStatus, VerticalSlug } from '../types';
import { VERTICAL_CONFIGS } from '../config/verticals';

// ─── Window durations ─────────────────────────────────────────────────────────

const WINDOW_MS: Record<FreshnessReq, number> = {
  realtime: 1  * 60 * 60 * 1000,       // 1 hour
  daily:    24 * 60 * 60 * 1000,       // 24 hours
  weekly:   7  * 24 * 60 * 60 * 1000,  // 7 days
  monthly:  30 * 24 * 60 * 60 * 1000,  // 30 days
};

// ─── Per-listing freshness check ──────────────────────────────────────────────

export function checkFreshness(
  scrapedAt: string | Date,
  freshness: FreshnessReq,
  now:       Date = new Date(),
): StaleStatus {
  const scraped   = new Date(scrapedAt).getTime();
  const ageMs     = now.getTime() - scraped;
  const window    = WINDOW_MS[freshness];

  if (ageMs <= window)           return 'fresh';
  if (ageMs <= window * 2)       return 'stale';
  return 'expired';
}

// ─── Per-vertical helper ──────────────────────────────────────────────────────

export function isStaleForVertical(
  scrapedAt: string | Date,
  vertical:  VerticalSlug,
  now?:      Date,
): StaleStatus {
  const req = VERTICAL_CONFIGS[vertical].priors.freshnessRequirement;
  return checkFreshness(scrapedAt, req, now);
}

// ─── Bulk filter ──────────────────────────────────────────────────────────────

export interface WithTimestamp { timestamp: string; }

export function filterFresh<T extends WithTimestamp>(
  items:    T[],
  vertical: VerticalSlug,
  now?:     Date,
): { fresh: T[]; stale: T[]; expired: T[] } {
  const fresh: T[] = [], stale: T[] = [], expired: T[] = [];
  for (const item of items) {
    const status = isStaleForVertical(item.timestamp, vertical, now);
    if      (status === 'fresh')   fresh.push(item);
    else if (status === 'stale')   stale.push(item);
    else                           expired.push(item);
  }
  return { fresh, stale, expired };
}
