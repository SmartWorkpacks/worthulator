// ─── Sneakers ingestion worker ────────────────────────────────────────────────
// Priority: StockX (authenticated market) → eBay (secondary / used market)

import type { RawListing, EnrichedListing, SourceSlug } from '../../types';
import { BaseWorker }        from './base';
import { fetchStockX, fetchEbay } from '../sources';
import { adaptStockX }       from '../adapters/stockx';
import { adaptEbay }         from '../adapters/ebay';
import { loadFixtures }      from '../fixtures';

const SNEAKER_QUERIES = [
  'Nike Dunk Low', 'Air Jordan 1 Chicago', 'Air Jordan 4',
  'Yeezy 350 V2', 'Nike Air Force 1',
];

export class SneakersWorker extends BaseWorker {
  readonly vertical = 'sneakers' as const;
  readonly sources: SourceSlug[] = ['stockx', 'ebay'];

  constructor(private readonly mode: 'mock' | 'live') { super(); }

  protected async fetchFromSource(source: SourceSlug): Promise<RawListing[]> {
    if (this.mode === 'mock') return loadFixtures('sneakers');

    const all: RawListing[] = [];
    for (const query of SNEAKER_QUERIES) {
      if (source === 'stockx') all.push(...await fetchStockX(query, 'sneakers', 40));
      if (source === 'ebay')   all.push(...await fetchEbay(query, 'sneakers', 60));
    }
    return all;
  }

  protected enrich(listing: RawListing, source: SourceSlug): EnrichedListing {
    if (source === 'stockx') return adaptStockX(listing);
    if (source === 'ebay')   return adaptEbay(listing);
    return { ...listing, sourceTrust: 0.5, fingerprint: '' };
  }
}
