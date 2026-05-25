// ─── Luxury watches ingestion worker ─────────────────────────────────────────
// Sources: eBay (highest volume of secondary market) → Chrono24 via eBay proxy

import type { RawListing, EnrichedListing, SourceSlug } from '../../types';
import { BaseWorker }   from './base';
import { fetchEbay }    from '../sources';
import { adaptEbay }    from '../adapters/ebay';
import { loadFixtures } from '../fixtures';

const WATCH_QUERIES = [
  'Rolex Submariner 126610LN', 'Rolex GMT-Master II Pepsi',
  'Rolex Datejust 41', 'Omega Seamaster 300M', 'Omega Speedmaster Moonwatch',
];

export class LuxuryWorker extends BaseWorker {
  readonly vertical = 'luxury' as const;
  readonly sources: SourceSlug[] = ['ebay'];

  constructor(private readonly mode: 'mock' | 'live') { super(); }

  protected async fetchFromSource(source: SourceSlug): Promise<RawListing[]> {
    if (this.mode === 'mock') return loadFixtures('luxury');

    const all: RawListing[] = [];
    for (const query of WATCH_QUERIES) {
      if (source === 'ebay') all.push(...await fetchEbay(query, 'luxury', 50));
    }
    return all;
  }

  protected enrich(listing: RawListing, _source: SourceSlug): EnrichedListing {
    return adaptEbay(listing);
  }
}
