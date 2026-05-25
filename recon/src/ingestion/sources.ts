// ─── Source connectors ────────────────────────────────────────────────────────
// One function per source. Each returns RawListing[].
// All use runActor() internally; callers never touch Apify directly.

import { randomUUID } from 'crypto';
import type { RawListing, VerticalSlug } from '../types';
import { runActor } from './apify';

// ─── Amazon ───────────────────────────────────────────────────────────────────

interface AmazonItem {
  asin?:          string;
  title?:         string;
  price?:         number;
  currency?:      string;
  url?:           string;
  availability?:  string;
  [k: string]:    unknown;
}

export async function fetchAmazon(
  query:    string,
  vertical: VerticalSlug,
  maxItems: number = 50,
): Promise<RawListing[]> {
  const items = await runActor<AmazonItem>('apify/amazon-product-scraper', {
    searchQuery: query,
    maxItems,
    country:     'US',
  });

  return items.map((item) => ({
    id:        item.asin ?? randomUUID(),
    source:    'amazon' as const,
    vertical,
    title:     item.title ?? '',
    price:     typeof item.price === 'number' ? item.price : null,
    currency:  item.currency ?? 'USD',
    condition: 'new',   // Amazon listings are new by default
    url:       item.url ?? '',
    region:    'US',
    timestamp: new Date().toISOString(),
    raw:       item as Record<string, unknown>,
  }));
}

// ─── eBay ─────────────────────────────────────────────────────────────────────

interface EbayItem {
  itemId?:      string;
  title?:       string;
  price?:       number;
  currency?:    string;
  condition?:   string;
  itemLocation?: string;
  url?:         string;
  [k: string]:  unknown;
}

export async function fetchEbay(
  query:    string,
  vertical: VerticalSlug,
  maxItems: number = 80,
): Promise<RawListing[]> {
  const items = await runActor<EbayItem>('apify/ebay-scraper', {
    search:   query,
    maxItems,
    country:  'US',
  });

  return items.map((item) => ({
    id:        item.itemId ?? randomUUID(),
    source:    'ebay' as const,
    vertical,
    title:     item.title ?? '',
    price:     typeof item.price === 'number' ? item.price : null,
    currency:  item.currency ?? 'USD',
    condition: item.condition ?? null,
    url:       item.url ?? '',
    region:    item.itemLocation ?? 'US',
    timestamp: new Date().toISOString(),
    raw:       item as Record<string, unknown>,
  }));
}

// ─── StockX ───────────────────────────────────────────────────────────────────

interface StockXItem {
  styleId?:      string;
  name?:         string;
  retailPrice?:  number;
  lastSalePrice?: number;
  lowestAsk?:    number;
  highestBid?:   number;
  url?:          string;
  [k: string]:   unknown;
}

export async function fetchStockX(
  query:    string,
  vertical: VerticalSlug,
  maxItems: number = 60,
): Promise<RawListing[]> {
  const items = await runActor<StockXItem>('bebity/stockx-scraper', {
    searchQuery: query,
    maxItems,
  });

  return items.map((item) => ({
    id:        item.styleId ?? randomUUID(),
    source:    'stockx' as const,
    vertical,
    title:     item.name ?? '',
    // lastSalePrice is the most recent verified transaction
    price:     typeof item.lastSalePrice === 'number' ? item.lastSalePrice : null,
    currency:  'USD',
    condition: 'new',   // StockX only handles deadstock (new) product
    url:       item.url ?? '',
    region:    'US',
    timestamp: new Date().toISOString(),
    raw:       item as Record<string, unknown>,
  }));
}

// ─── Google Maps (home services) ──────────────────────────────────────────────

interface GoogleMapsItem {
  placeId?:     string;
  title?:       string;
  price?:       string;   // Google Maps price range — "$", "$$", "No price info"
  address?:     string;
  url?:         string;
  [k: string]:  unknown;
}

export async function fetchGoogleMaps(
  query:    string,
  vertical: VerticalSlug,
  maxItems: number = 40,
): Promise<RawListing[]> {
  const items = await runActor<GoogleMapsItem>('apify/google-maps-scraper', {
    searchStringsArray: [query],
    maxCrawledPlaces:   maxItems,
    language:           'en',
    countryCode:        'us',
  });

  return items.map((item) => ({
    id:        item.placeId ?? randomUUID(),
    source:    'google-maps' as const,
    vertical,
    title:     item.title ?? '',
    price:     null,    // GMaps gives tier symbols not $-amounts; price comes from Angi
    currency:  'USD',
    condition: null,
    url:       item.url ?? '',
    region:    item.address ?? 'US',
    timestamp: new Date().toISOString(),
    raw:       item as Record<string, unknown>,
  }));
}
