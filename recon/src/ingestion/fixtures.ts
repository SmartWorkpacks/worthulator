// ─── Fixture loader ────────────────────────────────────────────────────────────
// Loads mock JSON data from recon/fixtures/*.json.
// Used when --mock flag is set or APIFY_TOKEN is absent.

import * as fs   from 'fs';
import * as path from 'path';
import type { RawListing, VerticalSlug } from '../types';

const FIXTURES_DIR = path.resolve(__dirname, '../../fixtures');

export function loadFixtures(vertical: VerticalSlug): RawListing[] {
  const filePath = path.join(FIXTURES_DIR, `${vertical}.json`);
  if (!fs.existsSync(filePath)) {
    console.warn(`  [fixtures] no fixture file found for vertical "${vertical}" at ${filePath}`);
    return [];
  }
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as RawListing[];
  console.log(`  [fixtures] loaded ${raw.length} mock listings for "${vertical}"`);
  return raw;
}
