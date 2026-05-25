// ─── Entity resolver ──────────────────────────────────────────────────────────
// Resolves messy user/marketplace input strings to canonical entities.
//
// Resolution order:
//   1. Exact alias match
//   2. Pattern match (regex per model)
//   3. Fuzzy match via Fuse.js (across all canonical names)
//   4. Brand-only match
//   5. Unmatched

import Fuse from 'fuse.js';
import type { ResolvedEntity, MatchType } from '../types';
import type { BrandCatalog, EntityModel, VerticalConfig } from '../config/verticals';

// ─── Normalise a raw string for comparison ────────────────────────────────────

function normalise(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')   // remove punctuation
    .replace(/\s+/g, ' ')
    .trim();
}

// ─── Build a flat lookup structure from all verticals ─────────────────────────

interface CatalogEntry {
  canonical:   string;
  brand:       string;
  model:       string;
  category:    string;
  subcategory: string;
  aliases:     string[];
  patterns:    RegExp[];
}

function buildEntries(configs: VerticalConfig[]): CatalogEntry[] {
  const entries: CatalogEntry[] = [];
  for (const vc of configs) {
    for (const bc of vc.catalog) {
      for (const m of bc.models) {
        entries.push({
          canonical:   m.canonical,
          brand:       bc.brand,
          model:       m.canonical.replace(bc.brand, '').trim(),
          category:    bc.category,
          subcategory: bc.subcategory,
          aliases:     m.aliases.map(normalise),
          patterns:    m.patterns,
        });
      }
    }
  }
  return entries;
}

// ─── Resolver class ───────────────────────────────────────────────────────────

export class EntityResolver {
  private entries: CatalogEntry[];
  private fuse:    Fuse<CatalogEntry>;

  constructor(configs: VerticalConfig[]) {
    this.entries = buildEntries(configs);

    // Fuse on canonical name + aliases for fuzzy fallback
    this.fuse = new Fuse(this.entries, {
      keys:              ['canonical', 'aliases'],
      threshold:         0.45,   // lower = stricter
      includeScore:      true,
      ignoreLocation:    true,
      useExtendedSearch: false,
    });
  }

  resolve(input: string): ResolvedEntity {
    const norm = normalise(input);

    // 1. Exact alias match ────────────────────────────────────────────────────
    for (const entry of this.entries) {
      if (entry.aliases.includes(norm)) {
        return this.toResult(input, entry, 'exact', 1.0);
      }
    }

    // 2. Pattern match ────────────────────────────────────────────────────────
    for (const entry of this.entries) {
      for (const pattern of entry.patterns) {
        if (pattern.test(input)) {
          return this.toResult(input, entry, 'pattern', 0.85);
        }
      }
    }

    // 3. Fuzzy match ──────────────────────────────────────────────────────────
    const results = this.fuse.search(norm);
    if (results.length > 0 && results[0].score !== undefined) {
      const best  = results[0];
      const score = best.score!;             // Fuse score: 0 = perfect, 1 = worst
      const conf  = Math.round((1 - score) * 100) / 100;
      if (conf >= 0.6) {
        return this.toResult(input, best.item, 'fuzzy', conf);
      }
    }

    // 4. Brand-only match ─────────────────────────────────────────────────────
    const brandMatch = this.entries.find((e) =>
      norm.includes(e.brand.toLowerCase()),
    );
    if (brandMatch) {
      return {
        input,
        canonicalName: `${brandMatch.brand} (unknown model)`,
        brand:         brandMatch.brand,
        model:         'unknown',
        category:      brandMatch.category,
        subcategory:   brandMatch.subcategory,
        confidence:    0.3,
        matchType:     'brand-only',
      };
    }

    // 5. Unmatched ────────────────────────────────────────────────────────────
    return {
      input,
      canonicalName: input,
      brand:         'unknown',
      model:         'unknown',
      category:      'unknown',
      subcategory:   'unknown',
      confidence:    0.1,
      matchType:     'unmatched',
    };
  }

  private toResult(
    input:    string,
    entry:    CatalogEntry,
    type:     MatchType,
    conf:     number,
  ): ResolvedEntity {
    return {
      input,
      canonicalName: entry.canonical,
      brand:         entry.brand,
      model:         entry.model,
      category:      entry.category,
      subcategory:   entry.subcategory,
      confidence:    conf,
      matchType:     type,
    };
  }
}

// ─── Phase 2 test cases ───────────────────────────────────────────────────────
// Intentionally messy inputs that mirror real user/marketplace behavior.

export const PHASE2_TEST_INPUTS: string[] = [
  // Electronics
  'ninja air fryer xyz',
  'ninja af101',
  'Dyson V15 Detect vacuum cleaner',
  'dyson v15',
  'MacBook Air M2 barely used',
  'apple macbook air m2 13inch 2023',
  // Luxury
  'rolex sub',
  'rolex submariner black dial',
  'Rolex Sub 126610LN',
  'omega speedmaster moonwatch professional',
  'omega seamaster diver 300',
  // Sneakers
  'nike dunk low panda black white',
  'jordan 1 chicago retro',
  'yeezy 350 v2 zebra size 10',
  'aj1 chicago',
  // Home services
  'roof replacement asphalt shingle',
  'central ac install',
  'full kitchen remodel gut',
  '10kw solar panels install',
  // Edge cases
  'completely random product xyz 9999',
  'iPhone 15 Pro',          // known brand, not in catalog
  'rolex',                   // brand only
];
