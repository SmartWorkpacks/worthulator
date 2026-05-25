// ─── Angi adapter ─────────────────────────────────────────────────────────────
// Angi (home services) specific enrichment.
// Extracts service category, job size, licensing status.

import type { RawListing, EnrichedListing } from '../../types';
import { getSourceTrust } from '../sourceScorer';

interface AngiRaw extends Record<string, unknown> {
  category?:       string;
  licensed?:       boolean;
  reviewCount?:    number;
  averageRating?:  number;
  yearsInBusiness?: number;
}

// Service-type extraction from title
const SERVICE_PATTERNS: Array<[RegExp, string]> = [
  [/roof.*replac/i,                'asphalt-shingle-roof'],
  [/metal.*roof/i,                 'metal-roof'],
  [/\bac\b|central air|air condit/i, 'central-ac'],
  [/furnace/i,                     'furnace'],
  [/heat pump/i,                   'heat-pump'],
  [/kitchen.*remodel|remodel.*kitchen/i, 'kitchen-remodel'],
  [/solar/i,                       'solar'],
];

export function adaptAngi(listing: RawListing): EnrichedListing {
  const raw = listing.raw as AngiRaw;

  let detectedService: string | undefined;
  for (const [pattern, serviceType] of SERVICE_PATTERNS) {
    if (pattern.test(listing.title)) { detectedService = serviceType; break; }
  }

  // Boost trust if pro is licensed and has reviews
  let trust = getSourceTrust('angi');
  if (raw.licensed === true) trust = Math.min(trust + 0.05, 1);
  if (typeof raw.reviewCount === 'number' && raw.reviewCount > 10) trust = Math.min(trust + 0.05, 1);

  return {
    ...listing,
    sourceTrust: Math.round(trust * 100) / 100,
    fingerprint: '',
    extractedSpecs: {
      detectedService,
      category:       raw.category,
      licensed:       raw.licensed,
      reviewCount:    raw.reviewCount,
      averageRating:  raw.averageRating,
    },
  };
}
