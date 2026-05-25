// ─── Scoring engine ───────────────────────────────────────────────────────────
// Computes statistical summaries, confidence scores, and price estimates
// from a set of NormalizedListings.

import type {
  NormalizedListing,
  PriceEstimate,
  ConfidenceBand,
  ConditionNorm,
  SourceSlug,
  VerticalAnalysis,
  VerticalSlug,
  MatchType,
} from '../types';

// ─── Descriptive statistics ───────────────────────────────────────────────────

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const idx = (p / 100) * (sorted.length - 1);
  const lo  = Math.floor(idx);
  const hi  = Math.ceil(idx);
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
}

function mean(values: number[]): number {
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function stdDev(values: number[], avg: number): number {
  const variance = values.reduce((s, v) => s + (v - avg) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

// ─── Confidence band ──────────────────────────────────────────────────────────
//
// high:   ≥10 data points, CV < 0.30, multiple sources
// medium: ≥4 data points, CV < 0.60
// low:    anything else

function confidenceBand(
  count:   number,
  cv:      number,
  sources: SourceSlug[],
): ConfidenceBand {
  const multiSource = new Set(sources).size > 1;
  if (count >= 10 && cv < 0.30 && multiSource) return 'high';
  if (count >= 4  && cv < 0.60)                return 'medium';
  return 'low';
}

// ─── Build estimates for one entity + condition group ─────────────────────────

function estimateGroup(
  entity:    string,
  condition: ConditionNorm,
  listings:  NormalizedListing[],
): PriceEstimate | null {
  if (listings.length === 0) return null;

  const prices = listings.map((l) => l.price).sort((a, b) => a - b);
  const avg    = mean(prices);
  const sd     = stdDev(prices, avg);
  const cv     = avg > 0 ? sd / avg : 0;
  const srcs   = listings.map((l) => l.source);

  return {
    entity,
    condition,
    count:      prices.length,
    min:        Math.round(prices[0] * 100) / 100,
    p25:        Math.round(percentile(prices, 25) * 100) / 100,
    median:     Math.round(percentile(prices, 50) * 100) / 100,
    p75:        Math.round(percentile(prices, 75) * 100) / 100,
    max:        Math.round(prices[prices.length - 1] * 100) / 100,
    mean:       Math.round(avg * 100) / 100,
    stdDev:     Math.round(sd * 100) / 100,
    cv:         Math.round(cv * 1000) / 1000,
    confidence: confidenceBand(prices.length, cv, srcs),
    sources:    [...new Set(srcs)],
    freshestAt: listings
      .map((l) => l.timestamp.toISOString())
      .sort()
      .at(-1) ?? new Date().toISOString(),
  };
}

// ─── Full vertical analysis ───────────────────────────────────────────────────

export function analyseVertical(
  vertical:    VerticalSlug,
  raw:         { count: number },
  normalized:  NormalizedListing[],
  matchCounts: Record<MatchType, number>,
): VerticalAnalysis {
  // Group by entity + condition
  const groups = new Map<string, NormalizedListing[]>();
  for (const l of normalized) {
    const key = `${l.entity}||${l.condition}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(l);
  }

  const estimates: PriceEstimate[] = [];
  for (const [key, listings] of groups) {
    const [entity, condition] = key.split('||') as [string, ConditionNorm];
    const est = estimateGroup(entity, condition, listings);
    if (est) estimates.push(est);
  }

  const uniqueEntities      = new Set(normalized.map((l) => l.entity)).size;
  const avgEntityConfidence = normalized.length > 0
    ? Math.round(mean(normalized.map((l) => l.entityConfidence)) * 100) / 100
    : 0;
  const avgCV = estimates.length > 0
    ? Math.round(mean(estimates.map((e) => e.cv)) * 1000) / 1000
    : 0;
  const missingPriceRatio = raw.count > 0
    ? Math.round(((raw.count - normalized.length) / raw.count) * 100) / 100
    : 0;

  return {
    vertical,
    rawCount:            raw.count,
    normalizedCount:     normalized.length,
    pricedCount:         normalized.filter((l) => l.price > 0).length,
    uniqueEntities,
    avgEntityConfidence,
    avgCV,
    missingPriceRatio,
    matchBreakdown:      matchCounts,
    estimates,
  };
}
