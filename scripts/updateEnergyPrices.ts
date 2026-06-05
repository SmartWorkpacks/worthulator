// ─── Live Energy Price Refresh (Apify) ───────────────────────────────────────
//
// PURPOSE:
//   Scrape current US state-level gasoline and residential electricity prices
//   via the Apify web-scraper actor and patch them into the static datasets:
//     - lib/datasets/usStateFuelPrices.ts          (gas, $/gal)
//     - lib/datasets/regional/usStateElectricityPrices.ts (electricity, $/kWh)
//     - lib/datasets/regional/usStateWaterRates.ts           (water, $/1,000 gal)
//
// CONSUMED BY:
//   ev-vs-gas calculator (calculations/finance/evVsGas.ts)
//
// ENVIRONMENT:
//   APIFY_API_TOKEN or APIFY_TOKEN   # auto-loaded from .env.local if present
//
// RUN:
//   npm run energy:refresh
//
// SAFETY:
//   - No token, or a source returns too few states → that source is skipped and
//     the existing static fallback values are kept untouched. The app never
//     breaks; it simply keeps the last good numbers.
//   - Only numeric values inside sane ranges are written; never NaN/Infinity.
//
// ─────────────────────────────────────────────────────────────────────────────

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

// ─── Minimal .env.local loader (no dotenv dependency) ─────────────────────────

function loadEnvLocal(): void {
  const p = resolve(process.cwd(), ".env.local");
  if (!existsSync(p)) return;
  for (const line of readFileSync(p, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
}
loadEnvLocal();

const APIFY_TOKEN = process.env.APIFY_API_TOKEN ?? process.env.APIFY_TOKEN ?? "";

const FUEL_FILE        = resolve(process.cwd(), "lib/datasets/usStateFuelPrices.ts");
const ELECTRICITY_FILE = resolve(process.cwd(), "lib/datasets/regional/usStateElectricityPrices.ts");
const CIGARETTE_FILE   = resolve(process.cwd(), "lib/datasets/regional/usStateCigarettePrices.ts");
const NATURAL_GAS_FILE = resolve(process.cwd(), "lib/datasets/regional/usStateNaturalGasPrices.ts");
const WATER_FILE       = resolve(process.cwd(), "lib/datasets/regional/usStateWaterRates.ts");
const WAGE_FILE        = resolve(process.cwd(), "lib/datasets/regional/usStateMedianWages.ts");

const SOURCES = {
  gas: "https://gasprices.aaa.com/state-gas-price-averages/",
  // EIA-based ALL-IN residential averages (includes delivery/transmission).
  // We deliberately avoid energy-only "supply rate" tables (e.g. ChooseEnergy),
  // which understate true cost in deregulated states like Texas and Ohio.
  electricity: "https://www.electricchoice.com/electricity-prices-by-state/",
  // Average retail pack price by state (incl. state excise + sales tax).
  cigarettes: "https://www.cdc.gov/statesystem/factsheets/CigarettePrice/CigarettePrice.html",
  // EIA residential natural gas $/therm by state — from the EIA State Energy portal.
  naturalGas: "https://www.eia.gov/dnav/ng/ng_pri_sum_dcu_nus_m.htm",
  // Published state average monthly water bill (combined water + sewer).
  // Converted to $/1,000 gal using EPA reference household usage in parseWaterRates().
  water: "https://worldpopulationreview.com/state-rankings/average-water-bill-by-state",
  // BLS OEWS all-occupations median hourly wage by state.
  wages: "https://worldpopulationreview.com/state-rankings/average-hourly-wage-by-state",
};

// ─── Known states (validation + name normalization) ───────────────────────────

const STATE_NAMES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut",
  "Delaware","Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa",
  "Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan",
  "Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire",
  "New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio",
  "Oklahoma","Oregon","Pennsylvania","Rhode Island","South Carolina","South Dakota",
  "Tennessee","Texas","Utah","Vermont","Virginia","Washington","West Virginia",
  "Wisconsin","Wyoming","District of Columbia",
];

const STATE_LOOKUP = new Map<string, string>();
for (const s of STATE_NAMES) STATE_LOOKUP.set(s.toLowerCase(), s);
STATE_LOOKUP.set("washington d.c.", "District of Columbia");
STATE_LOOKUP.set("washington dc",   "District of Columbia");
STATE_LOOKUP.set("d.c.",            "District of Columbia");

function normalizeState(raw: string): string | null {
  const cleaned = raw.replace(/\s+/g, " ").trim().toLowerCase();
  return STATE_LOOKUP.get(cleaned) ?? null;
}

// ─── Apify generic table-row extractor ────────────────────────────────────────

const TABLE_PAGE_FUNCTION = `
async function pageFunction(context) {
  const { request, log } = context;
  try { await context.waitFor('table', { timeoutMillis: 10000 }); } catch (_) {}
  var rows = [];
  document.querySelectorAll('tr').forEach(function (tr) {
    var cells = [];
    tr.querySelectorAll('th,td').forEach(function (c) {
      cells.push((c.innerText || '').replace(/\\s+/g, ' ').trim());
    });
    if (cells.length >= 2) rows.push(cells);
  });
  log.info('ROWS: ' + rows.length);
  return { url: request.url, rows: rows };
}`;

interface TableResult { url: string; rows: string[][] }

async function scrapeTable(url: string, proxy: boolean): Promise<string[][]> {
  const input = {
    startUrls: [{ url }],
    pageFunction: TABLE_PAGE_FUNCTION,
    pseudoUrls: [],
    ...(proxy ? { proxyConfiguration: { useApifyProxy: true } } : {}),
  };
  const res = await fetch(
    `https://api.apify.com/v2/acts/apify~web-scraper/run-sync-get-dataset-items?token=${APIFY_TOKEN}&memory=2048&timeout=300`,
    { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input) },
  );
  if (!res.ok) {
    throw new Error(`Apify HTTP ${res.status}: ${(await res.text().catch(() => "")).slice(0, 200)}`);
  }
  const items = (await res.json()) as TableResult[];
  const rows = items.flatMap((i) => (Array.isArray(i.rows) ? i.rows : []));
  if (rows.length === 0) throw new Error("Apify returned no rows");
  return rows;
}

// ─── Row parsers ──────────────────────────────────────────────────────────────

/** First number in a cell matching a regex, else null. */
function firstNumber(cells: string[], re: RegExp): number | null {
  for (const c of cells) {
    const m = c.match(re);
    if (m) {
      const v = parseFloat(m[1]);
      if (Number.isFinite(v)) return v;
    }
  }
  return null;
}

/** Gas: state in cell[0], price like $3.21 or 3.21 in range [1.5, 8] $/gal. */
function parseGasPrices(rows: string[][]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const cells of rows) {
    const state = normalizeState(cells[0] ?? "");
    if (!state) continue;
    const price = firstNumber(cells.slice(1), /\$?\s*([0-9]\.[0-9]{2,3})/);
    if (price != null && price >= 1.5 && price <= 8) out[state] = Math.round(price * 100) / 100;
  }
  return out;
}

/** Electricity: state in cell[0], rate like 15.34 (¢/kWh) in range [4, 60] → $/kWh. */
function parseElectricityPrices(rows: string[][]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const cells of rows) {
    const state = normalizeState(cells[0] ?? "");
    if (!state) continue;
    const cents = firstNumber(cells.slice(1), /([0-9]{1,2}(?:\.[0-9]+)?)\s*(?:¢|c|cents)?/i);
    if (cents != null && cents >= 4 && cents <= 60) out[state] = Math.round((cents / 100) * 1000) / 1000;
  }
  return out;
}

/**
 * Natural gas: state in cell[0], residential price in $/Mcf (thousand cubic
 * feet) or $/therm. EIA reports $/Mcf; 1 Mcf ≈ 10.37 therms at standard Btu
 * content, so we divide by 10.37 to get $/therm.
 * Range guard: $/Mcf [6, 40] → $/therm [0.58, 3.86].
 * We also accept direct $/therm values in [0.5, 4.0] without conversion.
 */
function parseNaturalGasPrices(rows: string[][]): Record<string, number> {
  const out: Record<string, number> = {};
  const MCF_TO_THERM = 10.37;
  for (const cells of rows) {
    const state = normalizeState(cells[0] ?? "");
    if (!state) continue;
    // Try raw float from any cell
    const raw = firstNumber(cells.slice(1), /\$?\s*([0-9]{1,2}\.[0-9]{1,3})/);
    if (raw == null) continue;
    let perTherm: number;
    if (raw >= 0.5 && raw <= 4.0) {
      // Already $/therm
      perTherm = raw;
    } else if (raw >= 6 && raw <= 40) {
      // $/Mcf → $/therm
      perTherm = raw / MCF_TO_THERM;
    } else {
      continue;
    }
    out[state] = Math.round(perTherm * 1000) / 1000;
  }
  return out;
}

/**
 * Water: state in cell[0], average monthly combined bill in range [$15, $130].
 * Converted to $/1,000 gal using EPA reference household (2.58 people × 82 GPCD).
 */
function parseWaterRates(rows: string[][]): Record<string, number> {
  const REF_HOUSEHOLD = 2.58;
  const REF_GPCD = 82;
  const monthlyGallons = (REF_HOUSEHOLD * REF_GPCD * 365) / 12;
  const out: Record<string, number> = {};
  for (const cells of rows) {
    const state = normalizeState(cells[0] ?? "");
    if (!state) continue;
    const monthlyBill = firstNumber(cells.slice(1), /\$?\s*([0-9]{1,3}(?:\.[0-9]{1,2})?)/);
    if (monthlyBill == null || monthlyBill < 15 || monthlyBill > 130) continue;
    const per1000 = (monthlyBill * 1000) / monthlyGallons;
    if (per1000 >= 4 && per1000 <= 18) {
      out[state] = Math.round(per1000 * 100) / 100;
    }
  }
  return out;
}

/** Cigarettes: state in cell[0], pack price like $6.55 or 6.55 in range [4, 16] $/pack. */
function parseCigarettePrices(rows: string[][]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const cells of rows) {
    const state = normalizeState(cells[0] ?? "");
    if (!state) continue;
    const price = firstNumber(cells.slice(1), /\$?\s*([0-9]{1,2}\.[0-9]{2})/);
    if (price != null && price >= 4 && price <= 16) out[state] = Math.round(price * 100) / 100;
  }
  return out;
}

/**
 * Wages: state in cell[0], median hourly wage like $23.11 or 23.11 in range [$12, $50].
 * BLS OEWS all-occupations median hourly wage.
 */
function parseWageRates(rows: string[][]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const cells of rows) {
    const state = normalizeState(cells[0] ?? "");
    if (!state) continue;
    const wage = firstNumber(cells.slice(1), /\$?\s*([0-9]{1,2}\.[0-9]{2})/);
    if (wage != null && wage >= 12 && wage <= 50) out[state] = Math.round(wage * 100) / 100;
  }
  return out;
}

// ─── Dataset file patcher ─────────────────────────────────────────────────────

function periodLabel(d: Date): string {
  return d.toLocaleString("en-US", { month: "short", year: "numeric" });
}

function patchDatasetFile(
  file: string,
  prices: Record<string, number>,
  decimals: number,
): number {
  let text = readFileSync(file, "utf8");
  let patched = 0;
  for (const [state, value] of Object.entries(prices)) {
    const esc = state.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`("${esc}":\\s*)[0-9]+\\.?[0-9]*`);
    if (re.test(text)) {
      text = text.replace(re, `$1${value.toFixed(decimals)}`);
      patched++;
    }
  }
  const today = new Date();
  text = text.replace(/(lastUpdated:\s*)"[^"]*"/, `$1"${today.toISOString().slice(0, 10)}"`);
  text = text.replace(/(currentPeriodLabel:\s*)"[^"]*"/, `$1"${periodLabel(today)}"`);
  writeFileSync(file, text, "utf8");
  return patched;
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log("─────────────────────────────────");
  console.log(" Live Energy Price Refresh (Apify)");
  console.log("─────────────────────────────────");

  if (!APIFY_TOKEN) {
    console.error("APIFY token not set (APIFY_API_TOKEN or APIFY_TOKEN).");
    console.error("Keeping existing static fallback values. Nothing changed.");
    process.exit(0);
  }

  // ── Gas ──
  try {
    console.log(`\n⛽ Scraping gas prices — ${SOURCES.gas}`);
    const rows = await scrapeTable(SOURCES.gas, true);
    const prices = parseGasPrices(rows);
    const count = Object.keys(prices).length;
    console.log(`   Parsed ${count} states.`);
    if (count >= 40) {
      const n = patchDatasetFile(FUEL_FILE, prices, 2);
      console.log(`   ✓ Patched ${n} gas prices into usStateFuelPrices.ts`);
    } else {
      console.warn(`   ⚠ Only ${count} states (<40) — skipping gas patch, keeping static.`);
    }
  } catch (err) {
    console.warn(`   ⚠ Gas scrape failed (${(err as Error).message}). Keeping static.`);
  }

  // ── Electricity ──
  try {
    console.log(`\n⚡ Scraping electricity prices — ${SOURCES.electricity}`);
    const rows = await scrapeTable(SOURCES.electricity, true);
    const prices = parseElectricityPrices(rows);
    const count = Object.keys(prices).length;
    console.log(`   Parsed ${count} states.`);
    if (count >= 40) {
      const n = patchDatasetFile(ELECTRICITY_FILE, prices, 3);
      console.log(`   ✓ Patched ${n} electricity prices into usStateElectricityPrices.ts`);
    } else {
      console.warn(`   ⚠ Only ${count} states (<40) — skipping electricity patch, keeping static.`);
    }
  } catch (err) {
    console.warn(`   ⚠ Electricity scrape failed (${(err as Error).message}). Keeping static.`);
  }

  // ── Cigarettes ──
  try {
    console.log(`\n🚬 Scraping cigarette prices — ${SOURCES.cigarettes}`);
    const rows = await scrapeTable(SOURCES.cigarettes, true);
    const prices = parseCigarettePrices(rows);
    const count = Object.keys(prices).length;
    console.log(`   Parsed ${count} states.`);
    if (count >= 40) {
      const n = patchDatasetFile(CIGARETTE_FILE, prices, 2);
      console.log(`   ✓ Patched ${n} cigarette prices into usStateCigarettePrices.ts`);
    } else {
      console.warn(`   ⚠ Only ${count} states (<40) — skipping cigarette patch, keeping static.`);
    }
  } catch (err) {
    console.warn(`   ⚠ Cigarette scrape failed (${(err as Error).message}). Keeping static.`);
  }

  // ── Natural Gas ──
  try {
    console.log(`\n🔥 Scraping natural gas prices — ${SOURCES.naturalGas}`);
    const rows = await scrapeTable(SOURCES.naturalGas, true);
    const prices = parseNaturalGasPrices(rows);
    const count = Object.keys(prices).length;
    console.log(`   Parsed ${count} states.`);
    if (count >= 40) {
      const n = patchDatasetFile(NATURAL_GAS_FILE, prices, 3);
      console.log(`   ✓ Patched ${n} natural gas prices into usStateNaturalGasPrices.ts`);
    } else {
      console.warn(`   ⚠ Only ${count} states (<40) — skipping natural gas patch, keeping static.`);
    }
  } catch (err) {
    console.warn(`   ⚠ Natural gas scrape failed (${(err as Error).message}). Keeping static.`);
  }

  // ── Water ──
  try {
    console.log(`\n💧 Scraping water rates — ${SOURCES.water}`);
    const rows = await scrapeTable(SOURCES.water, true);
    const prices = parseWaterRates(rows);
    const count = Object.keys(prices).length;
    console.log(`   Parsed ${count} states.`);
    if (count >= 40) {
      const n = patchDatasetFile(WATER_FILE, prices, 2);
      console.log(`   ✓ Patched ${n} water rates into usStateWaterRates.ts`);
    } else {
      console.warn(`   ⚠ Only ${count} states (<40) — skipping water patch, keeping static.`);
    }
  } catch (err) {
    console.warn(`   ⚠ Water scrape failed (${(err as Error).message}). Keeping static.`);
  }

  // ── Wages ──
  try {
    console.log(`\n💰 Scraping median wages — ${SOURCES.wages}`);
    const rows = await scrapeTable(SOURCES.wages, true);
    const prices = parseWageRates(rows);
    const count = Object.keys(prices).length;
    console.log(`   Parsed ${count} states.`);
    if (count >= 40) {
      const n = patchDatasetFile(WAGE_FILE, prices, 2);
      console.log(`   ✓ Patched ${n} wage rates into usStateMedianWages.ts`);
    } else {
      console.warn(`   ⚠ Only ${count} states (<40) — skipping wage patch, keeping static.`);
    }
  } catch (err) {
    console.warn(`   ⚠ Wage scrape failed (${(err as Error).message}). Keeping static.`);
  }

  console.log("\nDone.");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
