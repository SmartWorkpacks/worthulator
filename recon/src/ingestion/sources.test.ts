// ─── fetchGoogleMaps offline test ─────────────────────────────────────────────
// The Apify client is mocked, so nothing calls Apify and no token is needed.
// Run from recon/:  npx tsx --test src/ingestion/sources.test.ts

import { describe, it, afterEach, mock } from 'node:test';
import assert from 'node:assert/strict';
import { ApifyClient } from 'apify-client';
import { fetchGoogleMaps } from './sources';

// Dataset items shaped like johnvc/google-maps-places-api output (made-up places).
const PLACES = [
  {
    searchTerm:   'roof replacement contractor',
    position:     1,
    title:        'Summit Ridge Roofing',
    address:      '1200 Example Ave, Denver, CO 80202',
    latitude:     39.7392,
    longitude:    -104.9903,
    rating:       4.8,
    ratingCount:  312,
    type:         'Roofing contractor',
    types:        ['Roofing contractor'],
    phoneNumber:  '(303) 555-0142',
    website:      'https://summitridge.example/',
    openingHours: { Monday: '7 AM-6 PM', Saturday: 'Closed' },
    cid:          '1234567890123456789',
    placeId:      'ChIJexamplePlace0001',
  },
  {
    searchTerm:   'roof replacement contractor',
    position:     2,
    title:        'Mile High Roof & Gutter',
    address:      '45 Sample St, Aurora, CO 80010',
    rating:       4.5,
    ratingCount:  87,
    priceLevel:   '$$',
    type:         'Roofing contractor',
    placeId:      'ChIJexamplePlace0002',
  },
  {
    searchTerm:   'roof replacement contractor',
    position:     3,
    title:        'Front Range Roofing',
  },
];

process.env.APIFY_TOKEN = 'test-token';

function mockApify(items: unknown[]) {
  const calls: { actorId: string; input: unknown }[] = [];
  mock.method(ApifyClient.prototype, 'actor', (actorId: string) => ({
    call: async (input: unknown) => {
      calls.push({ actorId, input });
      return { defaultDatasetId: 'dataset-1' };
    },
  }));
  mock.method(ApifyClient.prototype, 'dataset', () => ({
    listItems: async () => ({ items }),
  }));
  return calls;
}

afterEach(() => mock.restoreAll());

describe('fetchGoogleMaps', () => {
  it('runs johnvc/google-maps-places-api with its input fields', async () => {
    const calls = mockApify(PLACES);
    await fetchGoogleMaps('roof replacement contractor', 'home-services', 20);

    assert.equal(calls.length, 1);
    assert.equal(calls[0].actorId, 'johnvc/google-maps-places-api');
    assert.deepEqual(calls[0].input, {
      searchTerms:         ['roof replacement contractor'],
      maxResultsPerSearch: 20,
      location:            'United States',
      language:            'en',
    });
  });

  it('maps place rows onto RawListing', async () => {
    mockApify(PLACES);
    const listings = await fetchGoogleMaps('roof replacement contractor', 'home-services', 20);

    assert.equal(listings.length, 3);
    const [first, second] = listings;
    assert.equal(first.id, 'ChIJexamplePlace0001');
    assert.equal(first.source, 'google-maps');
    assert.equal(first.vertical, 'home-services');
    assert.equal(first.title, 'Summit Ridge Roofing');
    assert.equal(first.price, null);
    assert.equal(first.currency, 'USD');
    assert.equal(first.region, '1200 Example Ave, Denver, CO 80202');
    assert.equal(
      first.url,
      'https://www.google.com/maps/search/?api=1&query=Summit%20Ridge%20Roofing&query_place_id=ChIJexamplePlace0001',
    );
    assert.deepEqual(first.raw, PLACES[0]);
    assert.equal(
      second.url,
      'https://www.google.com/maps/search/?api=1&query=Mile%20High%20Roof%20%26%20Gutter&query_place_id=ChIJexamplePlace0002',
    );
  });

  it('falls back when a row has no place ID or address', async () => {
    mockApify(PLACES);
    const listings = await fetchGoogleMaps('roof replacement contractor', 'home-services', 20);
    const third = listings[2];

    assert.match(third.id, /^[0-9a-f-]{36}$/);
    assert.equal(third.title, 'Front Range Roofing');
    assert.equal(third.url, '');
    assert.equal(third.region, 'US');
  });
});
