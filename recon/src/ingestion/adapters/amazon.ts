// ─── Amazon adapter ───────────────────────────────────────────────────────────
// Amazon-specific enrichment. ASIN-based dedup, ratings extraction.
// Amazon items are almost always new retail — high price completeness.

import type { RawListing, EnrichedListing } from '../../types';
import { getSourceTrust } from '../sourceScorer';

interface AmazonRaw extends Record<string, unknown> {
  asin?:            string;
  stars?:           number;
  reviewsCount?:    number;
  isPrime?:         boolean;
  brand?:           string;
}

export function adaptAmazon(listing: RawListing): EnrichedListing {
  const raw = listing.raw as AmazonRaw;

  return {
    ...listing,
    sourceTrust: getSourceTrust('amazon'),
    fingerprint: '',
    extractedSpecs: {
      asin:         raw.asin,
      stars:        raw.stars,
      reviewsCount: raw.reviewsCount,
      isPrime:      raw.isPrime,
    },
  };
}
