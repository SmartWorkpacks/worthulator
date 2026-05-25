// ─── Normalization pipeline ───────────────────────────────────────────────────
// Takes a RawListing + resolved entity and produces a NormalizedListing.
// Handles: price cleaning, currency conversion, condition mapping.

import { randomUUID } from 'crypto';
import type { RawListing, NormalizedListing, ConditionNorm } from '../types';
import type { ResolvedEntity } from '../types';

// ─── Static exchange rates (refresh monthly in production) ────────────────────
// Source: approximate spot rates, May 2026

const FX_TO_USD: Record<string, number> = {
  USD: 1.0,
  GBP: 1.27,
  EUR: 1.08,
  CAD: 0.73,
  AUD: 0.65,
  JPY: 0.0067,
};

// ─── Condition mapping ────────────────────────────────────────────────────────

const CONDITION_MAP: [RegExp, ConditionNorm][] = [
  [/\b(brand\s*new|new\s*with\s*tags|nwt|factory\s*sealed|sealed|deadstock|ds)\b/i, 'new'],
  [/\b(refurb|refurbished|certified\s*pre.?owned|cpo|renewed|reconditioned)\b/i,     'refurbished'],
  [/\b(used|pre.?owned|preowned|open\s*box|open\s*item|like\s*new|lightly\s*used|very\s*good|good|acceptable|fair|grade\s*[abc])\b/i, 'used'],
];

function normaliseCondition(raw: string | null): ConditionNorm {
  if (!raw) return 'unknown';
  for (const [re, norm] of CONDITION_MAP) {
    if (re.test(raw)) return norm;
  }
  if (/^new$/i.test(raw.trim())) return 'new';
  return 'unknown';
}

// ─── Price cleaning ───────────────────────────────────────────────────────────

function cleanPrice(raw: number | null, currency: string): number | null {
  if (raw === null || !isFinite(raw) || raw <= 0) return null;
  const rate = FX_TO_USD[currency.toUpperCase()] ?? null;
  if (!rate) return null;
  const usd = Math.round(raw * rate * 100) / 100;
  return usd;
}

// ─── Outlier guard ────────────────────────────────────────────────────────────
// Reject prices that are clearly test data, listing errors, or junk.

function isSanePrice(price: number, vertical: string): boolean {
  if (vertical === 'home-services') return price >= 500 && price <= 500_000;
  if (vertical === 'luxury')        return price >= 100 && price <= 500_000;
  return price >= 1 && price <= 50_000;
}

// ─── Main pipeline ────────────────────────────────────────────────────────────

export function normalise(
  raw:      RawListing,
  resolved: ResolvedEntity,
): NormalizedListing | null {
  const price = cleanPrice(raw.price, raw.currency);
  if (price === null) return null;
  if (!isSanePrice(price, raw.vertical)) return null;

  return {
    id:               randomUUID(),
    entity:           resolved.canonicalName,
    model:            resolved.model,
    brand:            resolved.brand,
    category:         resolved.category,
    subcategory:      resolved.subcategory,
    source:           raw.source,
    vertical:         raw.vertical,
    price,
    currency:         'USD',
    timestamp:        new Date(raw.timestamp),
    condition:        normaliseCondition(raw.condition),
    region:           raw.region || 'US',
    entityConfidence: resolved.confidence,
  };
}

export function normaliseBatch(
  rawListings: RawListing[],
  resolver:    (input: string) => ResolvedEntity,
): { normalized: NormalizedListing[]; dropped: number } {
  let dropped = 0;
  const normalized: NormalizedListing[] = [];

  for (const raw of rawListings) {
    const resolved = resolver(raw.title);
    const result   = normalise(raw, resolved);
    if (result) {
      normalized.push(result);
    } else {
      dropped++;
    }
  }

  return { normalized, dropped };
}
