#!/usr/bin/env tsx
// ─── Recon CLI entry point ────────────────────────────────────────────────────
//
// Usage:
//   npm run recon -- all               Run all 5 phases (mock mode)
//   npm run recon -- all --live        Run with real Apify data
//   npm run recon -- phase1            Ingest data only
//   npm run recon -- phase2            Entity resolution test only
//   npm run recon -- phase3            Normalization only
//   npm run recon -- phase4            Estimation validation only
//   npm run recon -- phase5            Generate report from last run
//   npm run recon -- all --vertical electronics,sneakers
//   npm run recon -- all --output report.json

import 'dotenv/config';
import { Command } from 'commander';
import chalk       from 'chalk';
import * as fs     from 'fs';

import { ALL_VERTICALS } from './config/verticals';
import {
  runAll,
  phase1,
  phase2,
  phase3,
  phase4,
  phase5,
  type RunOptions,
} from './phases/runner';
import type { VerticalSlug } from './types';

const program = new Command();

program
  .name('recon')
  .description('Worthulator Estimator — Data Feasibility & Entity Coverage Test')
  .version('0.1.0');

// ─── Shared options ───────────────────────────────────────────────────────────

function parseOpts(cmd: { mock?: boolean; live?: boolean; vertical?: string; verbose?: boolean }): RunOptions {
  const verticals: VerticalSlug[] = cmd.vertical
    ? (cmd.vertical.split(',').map((v) => v.trim()) as VerticalSlug[])
    : ALL_VERTICALS;

  return {
    mock:      !cmd.live,
    verticals,
    verbose:   cmd.verbose ?? false,
  };
}

// ─── all ─────────────────────────────────────────────────────────────────────

program
  .command('all')
  .description('Run all 5 phases end-to-end')
  .option('--live',             'Use live Apify data (requires APIFY_TOKEN)')
  .option('--vertical <slugs>', 'Comma-separated vertical slugs, e.g. electronics,luxury')
  .option('--output <file>',    'Write full JSON report to file')
  .option('--verbose',          'Show per-entity estimate tables in Phase 4')
  .action(async (cmd) => {
    const opts   = parseOpts(cmd);
    console.log(chalk.bold.white(`\n  Worthulator Recon  —  mode: ${opts.mock ? 'mock' : 'LIVE'}  —  verticals: ${opts.verticals.join(', ')}\n`));

    const report = await runAll(opts);

    if (cmd.output) {
      fs.writeFileSync(cmd.output, JSON.stringify(report, null, 2));
      console.log(chalk.green(`\n  Report written to ${cmd.output}`));
    }
  });

// ─── phase1 ──────────────────────────────────────────────────────────────────

program
  .command('phase1')
  .description('Data source ingestion test')
  .option('--live',             'Use live Apify data')
  .option('--vertical <slugs>', 'Comma-separated verticals')
  .action(async (cmd) => {
    await phase1(parseOpts(cmd));
  });

// ─── phase2 ──────────────────────────────────────────────────────────────────

program
  .command('phase2')
  .description('Entity resolution test on predefined messy inputs')
  .option('--vertical <slugs>', 'Comma-separated verticals to load catalog from')
  .action((cmd) => {
    phase2(parseOpts(cmd));
  });

// ─── phase3 ──────────────────────────────────────────────────────────────────

program
  .command('phase3')
  .description('Normalization pipeline test')
  .option('--live',             'Use live Apify data')
  .option('--vertical <slugs>', 'Comma-separated verticals')
  .action(async (cmd) => {
    const opts = parseOpts(cmd);
    const raw  = await phase1(opts);
    phase3(raw, opts);
  });

// ─── phase4 ──────────────────────────────────────────────────────────────────

program
  .command('phase4')
  .description('Estimation validation — price statistics + confidence scoring')
  .option('--live',             'Use live Apify data')
  .option('--vertical <slugs>', 'Comma-separated verticals')
  .option('--verbose',          'Show per-entity estimate tables')
  .action(async (cmd) => {
    const opts = parseOpts(cmd);
    const raw  = await phase1(opts);
    const norm = phase3(raw, opts);
    phase4(raw, norm, opts);
  });

// ─── phase5 ──────────────────────────────────────────────────────────────────

program
  .command('phase5')
  .description('Feasibility report — ranks verticals by viability')
  .option('--live',             'Use live Apify data')
  .option('--vertical <slugs>', 'Comma-separated verticals')
  .option('--output <file>',    'Write full JSON report to file')
  .action(async (cmd) => {
    const opts     = parseOpts(cmd);
    const raw      = await phase1(opts);
    const norm     = phase3(raw, opts);
    const analyses = phase4(raw, norm, opts);
    const report   = await phase5(analyses, opts.mock ? 'mock' : 'live', null);
    if (cmd.output) {
      fs.writeFileSync(cmd.output, JSON.stringify(report, null, 2));
      console.log(chalk.green(`\n  Report written to ${cmd.output}`));
    }
  });

program.parse(process.argv);
