// ─── Phase runners ────────────────────────────────────────────────────────────
// One export per phase. Each is self-contained and returns structured output.
// CLI wires these together; they can also be called independently.

import chalk from 'chalk';
import Table from 'cli-table3';

import { loadFixtures }              from '../ingestion/fixtures';
import { fetchAmazon, fetchEbay, fetchStockX, fetchGoogleMaps } from '../ingestion/sources';
import { hasApifyToken }             from '../ingestion/apify';
import { EntityResolver, PHASE2_TEST_INPUTS } from '../entity/resolver';
import { normaliseBatch }            from '../normalization/pipeline';
import { analyseVertical }           from '../scoring/engine';
import { generateReport }            from '../report/generator';
import { createRun, completeRun, insertRawListings, insertNormalizedListings, insertReport } from '../db/queries';
import { hasDb }                     from '../db/client';
import { VERTICAL_CONFIGS, ALL_VERTICALS, getVertical } from '../config/verticals';

import type { RawListing, VerticalSlug, MatchType, VerticalAnalysis, FeasibilityReport } from '../types';

// ─── Shared options ───────────────────────────────────────────────────────────

export interface RunOptions {
  mock:      boolean;
  verticals: VerticalSlug[];
  verbose:   boolean;
}

// ─── Phase 1 — Data Source Testing ───────────────────────────────────────────

export async function phase1(opts: RunOptions): Promise<Record<VerticalSlug, RawListing[]>> {
  console.log(chalk.bold.cyan('\n═══ PHASE 1 — Data Source Testing ═══'));
  const result: Partial<Record<VerticalSlug, RawListing[]>> = {};

  for (const slug of opts.verticals) {
    const vc = getVertical(slug);
    console.log(chalk.bold(`\n▶ ${vc.label}`));

    let listings: RawListing[] = [];

    if (opts.mock || !hasApifyToken()) {
      listings = loadFixtures(slug);
    } else {
      // Live Apify ingestion
      const queries = vc.catalog.slice(0, 2).map((b) => b.brand);  // top 2 brands as queries
      for (const q of queries) {
        for (const src of vc.sources) {
          try {
            let batch: RawListing[] = [];
            if (src === 'amazon')       batch = await fetchAmazon(q, slug, 30);
            if (src === 'ebay')         batch = await fetchEbay(q, slug, 40);
            if (src === 'stockx')       batch = await fetchStockX(q, slug, 30);
            if (src === 'google-maps')  batch = await fetchGoogleMaps(q, slug, 20);
            listings.push(...batch);
          } catch (e: unknown) {
            console.warn(chalk.yellow(`  [${src}] failed for "${q}": ${(e as Error).message}`));
          }
        }
      }
    }

    console.log(`  raw listings ingested: ${chalk.green(listings.length)}`);
    const priced = listings.filter((l) => l.price !== null).length;
    console.log(`  with price: ${chalk.green(priced)} / ${listings.length}`);
    result[slug] = listings;
  }

  return result as Record<VerticalSlug, RawListing[]>;
}

// ─── Phase 2 — Entity Resolution Test ────────────────────────────────────────

export function phase2(opts: RunOptions): void {
  console.log(chalk.bold.cyan('\n═══ PHASE 2 — Entity Resolution Test ═══'));

  const resolver = new EntityResolver(
    opts.verticals.map((v) => VERTICAL_CONFIGS[v]),
  );

  const table = new Table({
    head: ['Input', 'Canonical', 'Match Type', 'Confidence'],
    colWidths: [35, 35, 14, 12],
    style: { head: ['cyan'] },
  });

  let exact = 0, pattern = 0, fuzzy = 0, brandOnly = 0, unmatched = 0;

  for (const input of PHASE2_TEST_INPUTS) {
    const r = resolver.resolve(input);
    const confColor = r.confidence >= 0.8 ? chalk.green : r.confidence >= 0.5 ? chalk.yellow : chalk.red;
    table.push([
      input.slice(0, 33),
      r.canonicalName.slice(0, 33),
      r.matchType,
      confColor(r.confidence.toFixed(2)),
    ]);
    if (r.matchType === 'exact')       exact++;
    else if (r.matchType === 'pattern') pattern++;
    else if (r.matchType === 'fuzzy')   fuzzy++;
    else if (r.matchType === 'brand-only') brandOnly++;
    else unmatched++;
  }

  console.log(table.toString());
  console.log(`  exact: ${chalk.green(exact)}  pattern: ${chalk.green(pattern)}  fuzzy: ${chalk.yellow(fuzzy)}  brand-only: ${chalk.yellow(brandOnly)}  unmatched: ${chalk.red(unmatched)}`);
}

// ─── Phase 3 — Normalization ──────────────────────────────────────────────────

export function phase3(
  rawByVertical: Record<VerticalSlug, RawListing[]>,
  opts: RunOptions,
): Record<VerticalSlug, ReturnType<typeof normaliseBatch>> {
  console.log(chalk.bold.cyan('\n═══ PHASE 3 — Data Normalization ═══'));

  const resolver = new EntityResolver(
    opts.verticals.map((v) => VERTICAL_CONFIGS[v]),
  );

  const result: Partial<Record<VerticalSlug, ReturnType<typeof normaliseBatch>>> = {};

  for (const slug of opts.verticals) {
    const raw = rawByVertical[slug] ?? [];
    const out = normaliseBatch(raw, (title) => resolver.resolve(title));
    result[slug] = out;
    console.log(
      `  ${chalk.bold(getVertical(slug).label)}: ` +
      `${chalk.green(out.normalized.length)} normalized, ` +
      `${chalk.red(out.dropped)} dropped`,
    );
  }

  return result as Record<VerticalSlug, ReturnType<typeof normaliseBatch>>;
}

// ─── Phase 4 — Estimation Validation ─────────────────────────────────────────

export function phase4(
  rawByVertical:  Record<VerticalSlug, RawListing[]>,
  normByVertical: Record<VerticalSlug, ReturnType<typeof normaliseBatch>>,
  opts:           RunOptions,
): VerticalAnalysis[] {
  console.log(chalk.bold.cyan('\n═══ PHASE 4 — Estimation Validation ═══'));

  const resolver = new EntityResolver(
    opts.verticals.map((v) => VERTICAL_CONFIGS[v]),
  );

  const analyses: VerticalAnalysis[] = [];

  for (const slug of opts.verticals) {
    const raw   = rawByVertical[slug]  ?? [];
    const norm  = normByVertical[slug] ?? { normalized: [], dropped: 0 };

    // Rebuild match type counts
    const matchCounts: Record<MatchType, number> = {
      exact: 0, pattern: 0, fuzzy: 0, 'brand-only': 0, unmatched: 0,
    };
    for (const r of raw) {
      const m = resolver.resolve(r.title).matchType;
      matchCounts[m]++;
    }

    const analysis = analyseVertical(
      slug,
      { count: raw.length },
      norm.normalized,
      matchCounts,
    );
    analyses.push(analysis);

    console.log(chalk.bold(`\n  ${getVertical(slug).label}`));
    console.log(`    unique entities:      ${analysis.uniqueEntities}`);
    console.log(`    avg entity conf:      ${analysis.avgEntityConfidence}`);
    console.log(`    avg price volatility: ${analysis.avgCV} (CV — lower is better)`);
    console.log(`    missing price ratio:  ${(analysis.missingPriceRatio * 100).toFixed(1)}%`);

    if (opts.verbose && analysis.estimates.length > 0) {
      const estTable = new Table({
        head: ['Entity', 'Cond', 'n', 'Median', 'Min', 'Max', 'CV', 'Confidence'],
        style: { head: ['cyan'] },
      });
      for (const e of analysis.estimates.slice(0, 10)) {
        const confColor = e.confidence === 'high' ? chalk.green : e.confidence === 'medium' ? chalk.yellow : chalk.red;
        estTable.push([
          e.entity.slice(0, 28), e.condition, e.count,
          `$${e.median.toLocaleString()}`,
          `$${e.min.toLocaleString()}`,
          `$${e.max.toLocaleString()}`,
          e.cv.toFixed(2),
          confColor(e.confidence),
        ]);
      }
      console.log(estTable.toString());
    }
  }

  return analyses;
}

// ─── Phase 5 — Feasibility Report ────────────────────────────────────────────

export async function phase5(
  analyses:  VerticalAnalysis[],
  mode:      'mock' | 'live',
  runId:     string | null,
): Promise<FeasibilityReport> {
  console.log(chalk.bold.cyan('\n═══ PHASE 5 — Feasibility Report ═══'));

  const report = generateReport(mode, analyses);

  const scoreTable = new Table({
    head: ['Vertical', 'Data', 'Norm↑', 'Entity↑', 'Monetise', 'Scale', 'SEO', 'OVERALL', 'Verdict'],
    style: { head: ['cyan'] },
  });

  for (const s of report.scores) {
    const v = s.verdict === 'build' ? chalk.green(s.verdict) : s.verdict === 'watch' ? chalk.yellow(s.verdict) : chalk.red(s.verdict);
    scoreTable.push([
      s.vertical,
      s.dataRichness,
      s.normalizationDifficulty,
      s.entityMatchDifficulty,
      s.monetizationPotential,
      s.scalability,
      s.seoPotential,
      chalk.bold(s.overallScore),
      v,
    ]);
  }

  console.log(scoreTable.toString());
  console.log(chalk.bold(`\n  Top vertical: ${chalk.green(report.topVertical)}`));
  console.log(`  ${report.recommendation}\n`);

  if (runId) {
    await insertReport(runId, report);
    console.log(chalk.gray(`  [db] report saved`));
  }

  return report;
}

// ─── All phases ───────────────────────────────────────────────────────────────

export async function runAll(opts: RunOptions): Promise<FeasibilityReport> {
  const mode  = opts.mock ? 'mock' : 'live';
  const runId = hasDb() ? await createRun(mode, opts.verticals) : null;

  if (runId) console.log(chalk.gray(`  [db] run created: ${runId}`));

  const raw  = await phase1(opts);
  phase2(opts);
  const norm = phase3(raw, opts);

  if (runId) {
    for (const slug of opts.verticals) {
      await insertRawListings(runId, raw[slug] ?? []);
      await insertNormalizedListings(runId, norm[slug]?.normalized ?? []);
    }
  }

  const analyses = phase4(raw, norm, opts);
  const report   = await phase5(analyses, mode, runId);

  if (runId) await completeRun(runId);

  return report;
}
