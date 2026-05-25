// ─── Electronics ingestion worker ────────────────────────────────────────────
// Sources: Amazon (retail / new) → eBay (used / secondary market)

import type { RawListing, EnrichedListing, SourceSlug } from '../../types';
import { BaseWorker }          from './base';
import { fetchAmazon, fetchEbay } from '../sources';
import { adaptAmazon }         from '../adapters/amazon';
import { adaptEbay }           from '../adapters/ebay';
import { loadFixtures }        from '../fixtures';

const ELECTRONICS_QUERIES = [
  'Ninja Air Fryer', 'Dyson V15 Detect', 'Dyson V11',
  'MacBook Air M2', 'Samsung QLED TV',
];

export class ElectronicsWorker extends BaseWorker {
  readonly vertical = 'electronics' as const;
  readonly sources: SourceSlug[] = ['amazon', 'ebay'];

  constructor(private readonly mode: 'mock' | 'live') { super(); }

  protected async fetchFromSource(source: SourceSlug): Promise<RawListing[]> {
    if (this.mode === 'mock') return loadFixtures('electronics');

    const all: RawListing[] = [];
    for (const query of ELECTRONICS_QUERIES) {
      if (source === 'amazon') all.push(...await fetchAmazon(query, 'electronics', 40));
      if (source === 'ebay')   all.push(...await fetchEbay(query, 'electronics', 60));
    }
    return all;
  }

  protected enrich(listing: RawListing, source: SourceSlug): EnrichedListing {
    if (source === 'amazon') return adaptAmazon(listing);
    if (source === 'ebay')   return adaptEbay(listing);
    return { ...listing, sourceTrust: 0.5, fingerprint: '' };
  }
}
