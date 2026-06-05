#!/usr/bin/env tsx
// ─── FRED Macroeconomic Rate Refresh ─────────────────────────────────────────
//
// PURPOSE:
//   Refresh lib/datasets/finance/fredBenchmarks.ts from the St. Louis Fed (FRED)
//   using the free public CSV endpoint (no API key required). Patches the macro
//   lending/inflation rates that seed the finance calculators' default values.
//
// RUN:
//   npx tsx scripts/updateFredBenchmarks.ts
//   (also wired into npm run data:refresh / weekly GitHub Action)
//
// SAFETY:
//   - No network / parse failure → that series is skipped, static fallback kept.
//   - Only finite values inside sane ranges are written; never NaN/Infinity.
//   - The app never breaks; it keeps the last good numbers.
//
// ─────────────────────────────────────────────────────────────────────────────

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const FRED_FILE = resolve(process.cwd(), "lib/datasets/finance/fredBenchmarks.ts");

/** FRED series → dataset field + sane [min,max] range guard. */
const SERIES: Record<
  string,
  { field: string; min: number; max: number; decimals: number }
> = {
  TERMCBAUTO48NS: { field: "autoLoanNew48moAPR", min: 2, max: 20, decimals: 1 },
  TERMCBCCALLNS: { field: "creditCardAPR", min: 8, max: 35, decimals: 1 },
  TERMCBPER24NS: { field: "personalLoan24moAPR", min: 4, max: 25, decimals: 1 },
  MORTGAGE30US: { field: "mortgage30yr", min: 2, max: 12, decimals: 1 },
  MORTGAGE15US: { field: "mortgage15yr", min: 2, max: 12, decimals: 1 },
  FEDFUNDS: { field: "fedFundsRate", min: 0, max: 10, decimals: 1 },
};

const FRED_CSV = (id: string) =>
  `https://fred.stlouisfed.org/graph/fredgraph.csv?id=${id}`;

interface CsvRow {
  date: string;
  value: number;
}

/** Fetch a FRED series CSV and return finite (date,value) rows, newest last. */
async function fetchSeries(id: string): Promise<CsvRow[]> {
  const res = await fetch(FRED_CSV(id));
  if (!res.ok) throw new Error(`FRED HTTP ${res.status} for ${id}`);
  const text = await res.text();
  const lines = text.trim().split(/\r?\n/);
  const rows: CsvRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const [date, raw] = lines[i].split(",");
    const value = parseFloat(raw);
    if (date && Number.isFinite(value)) rows.push({ date, value });
  }
  if (rows.length === 0) throw new Error(`FRED returned no rows for ${id}`);
  return rows;
}

/** Latest observation in a series. */
function latest(rows: CsvRow[]): CsvRow {
  return rows[rows.length - 1];
}

/** Patch a single numeric field in the dataset file. */
function patchField(text: string, field: string, value: number, decimals: number): string {
  const re = new RegExp(`(${field}:\\s*)[0-9]+\\.?[0-9]*`);
  if (re.test(text)) return text.replace(re, `$1${value.toFixed(decimals)}`);
  return text;
}

function quarterLabel(d: Date): string {
  return `Q${Math.floor(d.getMonth() / 3) + 1} ${d.getFullYear()}`;
}

async function main(): Promise<void> {
  console.log("─────────────────────────────────");
  console.log(" FRED Macro Rate Refresh");
  console.log("─────────────────────────────────");

  let text = readFileSync(FRED_FILE, "utf8");
  let patched = 0;

  for (const [id, cfg] of Object.entries(SERIES)) {
    try {
      const rows = await fetchSeries(id);
      const v = latest(rows).value;
      if (v >= cfg.min && v <= cfg.max) {
        const before = text;
        text = patchField(text, cfg.field, v, cfg.decimals);
        if (text !== before) {
          patched++;
          console.log(`   ✓ ${cfg.field} = ${v.toFixed(cfg.decimals)} (${id})`);
        }
      } else {
        console.warn(`   ⚠ ${id} value ${v} out of range — keeping static.`);
      }
    } catch (err) {
      console.warn(`   ⚠ ${id} failed (${(err as Error).message}). Keeping static.`);
    }
  }

  // CPI year-over-year inflation from CPIAUCSL (latest vs 12 months prior).
  try {
    const rows = await fetchSeries("CPIAUCSL");
    if (rows.length >= 13) {
      const newest = rows[rows.length - 1].value;
      const yearAgo = rows[rows.length - 13].value;
      const yoy = Math.round(((newest / yearAgo - 1) * 100) * 10) / 10;
      if (yoy >= -2 && yoy <= 20) {
        const before = text;
        text = patchField(text, "cpiInflationYoY", yoy, 1);
        if (text !== before) {
          patched++;
          console.log(`   ✓ cpiInflationYoY = ${yoy.toFixed(1)} (CPIAUCSL YoY)`);
        }
      }
    }
  } catch (err) {
    console.warn(`   ⚠ CPIAUCSL failed (${(err as Error).message}). Keeping static.`);
  }

  const today = new Date();
  text = text.replace(/(lastUpdated:\s*)"[^"]*"/, `$1"${today.toISOString().slice(0, 10)}"`);
  text = text.replace(/(currentPeriodLabel:\s*)"[^"]*"/, `$1"${quarterLabel(today)}"`);

  writeFileSync(FRED_FILE, text, "utf8");
  console.log(`\nDone. Patched ${patched} field(s).`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
