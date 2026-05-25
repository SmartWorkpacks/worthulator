// ─── Base ingestion worker ────────────────────────────────────────────────────
// All vertical workers extend this. Provides:
//   - retry-wrapped fetching
//   - rate limiting
//   - dedup
//   - stale filtering
//   - source quality recording
//   - DB storage

import chalk from 'chalk';
import type { RawListing, EnrichedListing, VerticalSlug, SourceSlug, WorkerRunResult } from '../../types';
import { getLimiter }          from '../rateLimit';
import { withRetryLogged }     from '../retry';
import { getDedupStore, fingerprint } from '../dedup';
import { isStaleForVertical }  from '../stale';
import { recordRunOutcome }    from '../sourceScorer';
import { insertRawListings }   from '../../db/queries';

export interface WorkerFetchResult {
  listings: RawListing[];
  source:   SourceSlug;
  errors:   string[];
}

export abstract class BaseWorker {
  abstract readonly vertical: VerticalSlug;
  abstract readonly sources:  SourceSlug[];

  /** Fetch raw listings from one source. Implemented by each vertical worker. */
  protected abstract fetchFromSource(source: SourceSlug): Promise<RawListing[]>;

  /** Apply source-specific enrichment (adapter layer). */
  protected enrich(listing: RawListing, _source: SourceSlug): EnrichedListing {
    return { ...listing, sourceTrust: 0.5, fingerprint: '' };
  }

  // ─── Main run ───────────────────────────────────────────────────────────────

  async run(runId: string | null): Promise<WorkerRunResult[]> {
    const results: WorkerRunResult[] = [];
    const dedup = getDedupStore();

    for (const source of this.sources) {
      const start = Date.now();
      const errors: string[] = [];
      let fetched = 0, deduplicated = 0, stored = 0;

      try {
        // ── Rate limit ────────────────────────────────────────────────────────
        await getLimiter(source).throttle();

        // ── Fetch with retry ──────────────────────────────────────────────────
        const raw = await withRetryLogged(
          `${this.vertical}/${source}`,
          () => this.fetchFromSource(source),
          3,
        );
        fetched = raw.length;

        // ── Enrich + dedup + stale filter ─────────────────────────────────────
        const toStore: RawListing[] = [];

        for (const listing of raw) {
          const enriched = this.enrich(listing, source);

          // Stale check
          const freshness = isStaleForVertical(enriched.timestamp, this.vertical);
          if (freshness === 'expired') continue;

          // Dedup check
          const fp = fingerprint(enriched);
          enriched.fingerprint = fp;

          const dedupResult = dedup.check(enriched);
          if (dedupResult.isDuplicate) { deduplicated++; continue; }

          dedup.register(enriched);
          toStore.push(enriched);
        }

        // ── DB storage ────────────────────────────────────────────────────────
        if (runId && toStore.length > 0) {
          await insertRawListings(runId, toStore);
        }
        stored = toStore.length;

        // ── Source quality ─────────────────────────────────────────────────────
        const pricedCount      = toStore.filter((l) => l.price !== null).length;
        const entityMatchCount = Math.round(stored * 0.8);   // updated after Phase 7 is wired
        recordRunOutcome(source, true, fetched, pricedCount, entityMatchCount);

        console.log(
          `  [${source}] ${chalk.green(stored)} stored  ` +
          `${chalk.yellow(deduplicated)} duped  ${chalk.gray(fetched - stored - deduplicated)} dropped (stale/sane)`,
        );

      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        errors.push(msg);
        recordRunOutcome(source, false, fetched, 0, 0);
        console.warn(`  [${source}] ${chalk.red('FAILED')}: ${msg}`);
      }

      results.push({
        vertical:     this.vertical,
        source,
        fetched,
        deduplicated,
        stored,
        errors,
        durationMs: Date.now() - start,
      });
    }

    return results;
  }
}
