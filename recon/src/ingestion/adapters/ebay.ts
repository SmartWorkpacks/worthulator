// ─── eBay adapter ─────────────────────────────────────────────────────────────
// eBay-specific enrichment. Variable trust depending on condition and seller.
// Extracts: seller rating, condition tier, listing type (auction vs BIN).

import type { RawListing, EnrichedListing } from '../../types';
import { getSourceTrust } from '../sourceScorer';

// Known low-trust indicators in eBay titles
const REPLICA_SIGNALS = [
  /\breplica\b/i, /\bfake\b/i, /\bdo not buy\b/i,
  /\bknock.?off\b/i, /\bAAA\+\b/i,
];

interface EbayRaw extends Record<string, unknown> {
  sellerFeedback?:  number;
  sellerRating?:    number;
  listingType?:     'BuyItNow' | 'Auction' | string;
  endTime?:         string;
}

export function adaptEbay(listing: RawListing): EnrichedListing {
  const raw  = listing.raw as EbayRaw;
  const isReplica = REPLICA_SIGNALS.some((re) => re.test(listing.title));

  // Lower trust if replica signals detected or seller has low feedback
  let trust = getSourceTrust('ebay');
  if (isReplica) trust *= 0.1;
  if (typeof raw.sellerFeedback === 'number' && raw.sellerFeedback < 50) trust *= 0.7;

  return {
    ...listing,
    sourceTrust: Math.round(trust * 100) / 100,
    fingerprint: '',
    extractedSpecs: {
      sellerFeedback: raw.sellerFeedback,
      sellerRating:   raw.sellerRating,
      listingType:    raw.listingType,
      isReplica,
    },
  };
}
