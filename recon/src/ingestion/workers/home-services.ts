// ─── Home services ingestion worker ──────────────────────────────────────────
// Uses the FORMULA ESTIMATION ENGINE — not market scraping.
// Real ingestion: Angi cost guides + Google Maps for geo coverage.
// Fixtures provide realistic regional cost estimates.

import type { RawListing, EnrichedListing, SourceSlug } from '../../types';
import { BaseWorker }        from './base';
import { fetchGoogleMaps }   from '../sources';
import { adaptAngi }         from '../adapters/angi';
import { loadFixtures }      from '../fixtures';

const SERVICE_QUERIES = [
  'roof replacement contractor',
  'HVAC installation',
  'kitchen remodel contractor',
  'solar panel installation',
];

export class HomeServicesWorker extends BaseWorker {
  readonly vertical = 'home-services' as const;
  readonly sources: SourceSlug[] = ['angi', 'google-maps'];

  constructor(private readonly mode: 'mock' | 'live') { super(); }

  protected async fetchFromSource(source: SourceSlug): Promise<RawListing[]> {
    if (this.mode === 'mock') return loadFixtures('home-services');

    const all: RawListing[] = [];
    // Google Maps gives us geo coverage even without price data
    if (source === 'google-maps') {
      for (const query of SERVICE_QUERIES) {
        all.push(...await fetchGoogleMaps(query, 'home-services', 20));
      }
    }
    // Angi is handled separately via web scraping — placeholder for live mode
    return all;
  }

  protected enrich(listing: RawListing, source: SourceSlug): EnrichedListing {
    if (source === 'angi') return adaptAngi(listing);
    return { ...listing, sourceTrust: 0.4, fingerprint: '' };
  }
}
