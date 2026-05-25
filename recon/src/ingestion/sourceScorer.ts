// ─── Source quality scorer ────────────────────────────────────────────────────
// Tracks per-source reliability over time. Composite reliability score (0–10)
// is used to weight estimates during valuation.

import type { SourceSlug, SourceQuality } from '../types';

// ─── Per-source baseline priors ───────────────────────────────────────────────
// Seeded from domain knowledge; updated by actual run outcomes.

const PRIORS: Record<SourceSlug, Omit<SourceQuality, 'totalRuns' | 'lastRunAt'>> = {
  stockx: {
    source:               'stockx',
    successRate:          0.95,
    avgItemsPerRun:       50,
    avgPriceCompleteness: 0.98,   // StockX always has price
    avgEntityMatchRate:   0.85,
    reliabilityScore:     9.0,    // authenticated market — highest trust
  },
  amazon: {
    source:               'amazon',
    successRate:          0.90,
    avgItemsPerRun:       40,
    avgPriceCompleteness: 0.92,
    avgEntityMatchRate:   0.80,
    reliabilityScore:     7.5,
  },
  ebay: {
    source:               'ebay',
    successRate:          0.88,
    avgItemsPerRun:       60,
    avgPriceCompleteness: 0.85,
    avgEntityMatchRate:   0.72,
    reliabilityScore:     6.5,    // high volume but noisy
  },
  angi: {
    source:               'angi',
    successRate:          0.80,
    avgItemsPerRun:       20,
    avgPriceCompleteness: 0.70,   // many listings are "get a quote" only
    avgEntityMatchRate:   0.75,
    reliabilityScore:     6.0,
  },
  'google-maps': {
    source:               'google-maps',
    successRate:          0.75,
    avgItemsPerRun:       15,
    avgPriceCompleteness: 0.20,   // GMaps almost never has a price
    avgEntityMatchRate:   0.60,
    reliabilityScore:     3.0,    // useful for geo coverage, not price data
  },
  fixture: {
    source:               'fixture',
    successRate:          1.00,
    avgItemsPerRun:       20,
    avgPriceCompleteness: 0.95,
    avgEntityMatchRate:   0.90,
    reliabilityScore:     5.0,    // mock only — not for production weighting
  },
};

// ─── In-memory store ──────────────────────────────────────────────────────────

const _stats = new Map<SourceSlug, SourceQuality>();

function getOrInit(source: SourceSlug): SourceQuality {
  if (!_stats.has(source)) {
    _stats.set(source, {
      ...(PRIORS[source] ?? {
        source,
        successRate: 0.5,
        avgItemsPerRun: 0,
        avgPriceCompleteness: 0.5,
        avgEntityMatchRate:   0.5,
        reliabilityScore:     5.0,
      }),
      totalRuns: 0,
      lastRunAt: new Date().toISOString(),
    });
  }
  return _stats.get(source)!;
}

// ─── Record a run outcome ─────────────────────────────────────────────────────

export function recordRunOutcome(
  source:            SourceSlug,
  success:           boolean,
  itemCount:         number,
  pricedCount:       number,
  entityMatchCount:  number,
): void {
  const s = getOrInit(source);
  const n = s.totalRuns + 1;

  // Rolling average update
  const lerp = (prev: number, next: number) => (prev * (n - 1) + next) / n;

  s.totalRuns             = n;
  s.successRate           = lerp(s.successRate, success ? 1 : 0);
  s.avgItemsPerRun        = lerp(s.avgItemsPerRun, itemCount);
  s.avgPriceCompleteness  = itemCount > 0 ? lerp(s.avgPriceCompleteness, pricedCount / itemCount) : s.avgPriceCompleteness;
  s.avgEntityMatchRate    = itemCount > 0 ? lerp(s.avgEntityMatchRate, entityMatchCount / itemCount) : s.avgEntityMatchRate;
  s.lastRunAt             = new Date().toISOString();

  // Recompute reliability score
  s.reliabilityScore = Math.round((
    s.successRate          * 3.0 +
    s.avgPriceCompleteness * 3.5 +
    s.avgEntityMatchRate   * 2.5 +
    Math.min(s.avgItemsPerRun / 50, 1) * 1.0
  ) * 10) / 10;
}

// ─── Public accessors ─────────────────────────────────────────────────────────

export function getSourceQuality(source: SourceSlug): SourceQuality {
  return getOrInit(source);
}

export function getSourceTrust(source: SourceSlug): number {
  return getOrInit(source).reliabilityScore / 10;   // normalise to 0–1
}

export function getAllSourceStats(): SourceQuality[] {
  return [..._stats.values()];
}
