// ─── Market Value Engine — Phase 9 ───────────────────────────────────────────
// For: sneakers, luxury watches, electronics
// Deterministic statistical aggregation over normalized listings.
// NO AI — pure math + source weighting.

import type {
  ValuationInput, MarketValuation, NormalizedListing,
  ConditionNorm, ConfidenceBand,
} from '../types';
import { getSourceTrust }      from '../ingestion/sourceScorer';

// ─── Regional price index ─────────────────────────────────────────────────────
// Relative to national baseline (1.0). Used to adjust for cost-of-living.

const REGIONAL_INDEX: Record<string, number> = {
  'New York':     1.22,  'New York, NY':  1.22,
  'San Francisco':1.28,  'California':    1.15,
  'Boston':       1.18,  'Seattle':       1.12,
  'Chicago':      1.05,  'Los Angeles':   1.14,
  'Denver':       0.99,  'Austin':        0.96,
  'Dallas':       0.93,  'Phoenix':       0.91,
  'Nashville':    0.96,  'Atlanta':       0.94,
  'Miami':        1.02,  'Tampa':         0.93,
  'US':           1.00,  'default':       1.00,
};

function regionalMultiplier(region?: string): number {
  if (!region) return 1.0;
  for (const [key, mult] of Object.entries(REGIONAL_INDEX)) {
    if (region.toLowerCase().includes(key.toLowerCase())) return mult;
  }
  return 1.0;
}

// ─── Time-decay weighting ─────────────────────────────────────────────────────
// More recent data gets higher weight. Half-life = 14 days.

const DECAY_HALF_LIFE_MS = 14 * 24 * 60 * 60 * 1000;

function timeWeight(scrapedAt: string | Date, now: Date = new Date()): number {
  const age = now.getTime() - new Date(scrapedAt).getTime();
  return Math.exp(-Math.LN2 * (age / DECAY_HALF_LIFE_MS));
}

// ─── Stats helpers ────────────────────────────────────────────────────────────

function weightedPercentile(
  values:  number[],
  weights: number[],
  p:       number,        // 0–1
): number {
  if (values.length === 0) return 0;
  const pairs  = values.map((v, i) => ({ v, w: weights[i] })).sort((a, b) => a.v - b.v);
  const total  = pairs.reduce((s, x) => s + x.w, 0);
  let   cum    = 0;
  const target = total * p;
  for (const pair of pairs) {
    cum += pair.w;
    if (cum >= target) return pair.v;
  }
  return pairs[pairs.length - 1].v;
}

function weightedMean(values: number[], weights: number[]): number {
  const total = weights.reduce((s, w) => s + w, 0);
  if (total === 0) return 0;
  return values.reduce((s, v, i) => s + v * weights[i], 0) / total;
}

function confidenceBand(count: number, cv: number): ConfidenceBand {
  if (count >= 10 && cv < 0.30) return 'high';
  if (count >=  4 && cv < 0.60) return 'medium';
  return 'low';
}

// ─── Condition depreciation factors ──────────────────────────────────────────

const CONDITION_FACTOR: Record<ConditionNorm, number> = {
  new:         1.00,
  refurbished: 0.82,
  used:        0.68,
  unknown:     0.80,
};

// ─── Main engine ──────────────────────────────────────────────────────────────

export class MarketValueEngine {
  /** Accepts in-memory normalized listings from Phase 3/4. */
  valuate(
    input:    ValuationInput,
    listings: NormalizedListing[],
  ): MarketValuation {
    const now = input.timestamp ?? new Date();

    // Filter to matching entity + condition
    const matching = listings.filter(
      (l) =>
        l.entity.toLowerCase() === input.entity.toLowerCase() &&
        l.condition === input.condition,
    );

    if (matching.length === 0) {
      return this.fallback(input);
    }

    // Build weighted price array
    const prices:  number[] = [];
    const weights: number[] = [];

    for (const l of matching) {
      const sourceW = getSourceTrust(l.source);
      const timeW   = timeWeight(l.timestamp, now);
      prices.push(l.price);
      weights.push(sourceW * timeW);
    }

    const p10    = weightedPercentile(prices, weights, 0.10);
    const p25    = weightedPercentile(prices, weights, 0.25);
    const median = weightedPercentile(prices, weights, 0.50);
    const p75    = weightedPercentile(prices, weights, 0.75);
    const p90    = weightedPercentile(prices, weights, 0.90);
    const mean   = weightedMean(prices, weights);
    const cv     = mean > 0 ? Math.sqrt(weights.reduce((s, w, i) => s + w * Math.pow(prices[i] - mean, 2), 0) / weights.reduce((s, w) => s + w, 0)) / mean : 0;

    // Regional adjustment
    const regMult   = regionalMultiplier(input.region);
    const adjusted  = regMult !== 1.0;

    const low     = Math.round(p25   * regMult);
    const average = Math.round(median * regMult);
    const premium = Math.round(p75   * regMult);
    const ciLow   = Math.round(p10   * regMult);
    const ciHigh  = Math.round(p90   * regMult);

    // Volatility: 0–10 (CV scaled — 0.5 CV = 10/10 volatility)
    const volatilityScore = Math.min(Math.round(cv / 0.05), 10);

    // Liquidity: proxy for source count and volume
    const sources        = [...new Set(matching.map((l) => l.source))];
    const liquidityScore = Math.min(
      Math.round((sources.length * 2 + Math.min(matching.length / 10, 4)) * 10) / 10,
      10,
    );

    const freshestAt = matching
      .map((l) => l.timestamp)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0]
      .toISOString();

    return {
      entity:                    input.entity,
      condition:                 input.condition,
      low,
      average,
      premium,
      confidenceRange:           [ciLow, ciHigh],
      volatilityScore,
      liquidityScore,
      confidence:                confidenceBand(matching.length, cv),
      sampleCount:               matching.length,
      freshestDataAt:            freshestAt,
      regionalAdjustmentApplied: adjusted,
    };
  }

  private fallback(input: ValuationInput): MarketValuation {
    return {
      entity:                    input.entity,
      condition:                 input.condition,
      low:                       0,
      average:                   0,
      premium:                   0,
      confidenceRange:           [0, 0],
      volatilityScore:           0,
      liquidityScore:            0,
      confidence:                'low',
      sampleCount:               0,
      freshestDataAt:            new Date().toISOString(),
      regionalAdjustmentApplied: false,
    };
  }
}
