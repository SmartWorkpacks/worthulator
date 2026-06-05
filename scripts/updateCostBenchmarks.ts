#!/usr/bin/env tsx
// ─── Cost Benchmark Refresh Script ───────────────────────────────────────────
//
// PURPOSE:
//   Scrapes real-world consumer prices from Expatistan via Apify and updates
//   lib/datasets/costs/costBenchmarks.ts in-place.
//
// USAGE:
//   npx tsx scripts/updateCostBenchmarks.ts
//
// ENVIRONMENT:
//   APIFY_TOKEN=<token>      # Required — Expatistan scrape via Apify
//
// STACK:
//   Apify (web-scraper/Puppeteer) → Expatistan → transform → normalize → local dataset
//
//   Macroeconomic assumptions (inflation, rates) → FRED (separate script)
//   Investment assumptions                        → Yahoo Finance (separate script)
//
// WHAT THIS UPDATES:
//   coffeePerCupUs, cigarettesPerPackUs, utilitiesMonthlyUs, restaurantMealUs,
//   gymMonthlyUs, rentNormalMonthlyUs, rentExpensiveMonthlyUs, businessLunchUs,
//   publicTransitMonthlyUs, fuelPerGallonUs (liters→gallons conversion applied),
//   coffeeAnnualIfDaily, cigarettesAnnualIfDaily (derived — recalculated)
//
// CITIES SCRAPED:
//   Nashville, Atlanta, Dallas, Denver, Chicago, Seattle, Boston, Los Angeles
//   (8 cities — no NYC/SF outliers — averaged to a realistic national benchmark)
//
// SAFETY:
//   - Does nothing if APIFY_TOKEN is absent — exits with clear message
//   - Never writes non-finite numbers
//   - Derived fields recalculated from updated base values
//   - All writes are idempotent — safe to run repeatedly

import * as fs from "fs";
import * as path from "path";
import {
  type RawExpatistanCityPage,
  transformExpatistanToBenchmarks,
  summarizeTransformation,
} from "../lib/datasets/costs/costTransformers";

// ─── Config ──────────────────────────────────────────────────────────────────

const BENCHMARKS_FILE = path.resolve(
  __dirname,
  "../lib/datasets/costs/costBenchmarks.ts",
);

const REGIONAL_FILE = path.resolve(
  __dirname,
  "../lib/datasets/regional/usRegionalBenchmarks.ts",
);

const APIFY_TOKEN = process.env.APIFY_TOKEN ?? process.env.APIFY_API_TOKEN ?? undefined;

/**
 * Representative US cities for Expatistan averaging.
 * Deliberately excludes NYC and San Francisco (extreme-cost outliers).
 * 2 low-cost, 2 medium, 2 medium-high, 2 high — weighted distribution.
 */
const EXPATISTAN_CITIES: { display: string; slug: string }[] = [
  { display: "Nashville",   slug: "nashville"   },
  { display: "Atlanta",     slug: "atlanta"     },
  { display: "Dallas",      slug: "dallas"      },
  { display: "Denver",      slug: "denver"      },
  { display: "Chicago",     slug: "chicago"     },
  { display: "Seattle",     slug: "seattle"     },
  { display: "Boston",      slug: "boston"      },
  { display: "Los Angeles", slug: "los-angeles" },
];

const NUMBEO_CITIES: { display: string; slug: string }[] = [
  // 47 cities — one per US state where Numbeo has sufficient data.
  // Delaware, Maine, West Virginia excluded (no unambiguous Numbeo city; keep existing STATE_INDEX).
  { display: "Huntsville",      slug: "Huntsville"      }, // Alabama
  { display: "Anchorage",       slug: "Anchorage"       }, // Alaska
  { display: "Phoenix",         slug: "Phoenix"         }, // Arizona
  { display: "Little Rock",     slug: "Little-Rock"     }, // Arkansas
  { display: "Los Angeles",     slug: "Los-Angeles"     }, // California
  { display: "Denver",          slug: "Denver"          }, // Colorado
  { display: "Hartford",        slug: "Hartford"        }, // Connecticut
  { display: "Miami",           slug: "Miami"           }, // Florida
  { display: "Atlanta",         slug: "Atlanta"         }, // Georgia
  { display: "Honolulu",        slug: "Honolulu"        }, // Hawaii
  { display: "Boise",           slug: "Boise"           }, // Idaho
  { display: "Chicago",         slug: "Chicago"         }, // Illinois
  { display: "Indianapolis",    slug: "Indianapolis"    }, // Indiana
  { display: "Des Moines",      slug: "Des-Moines"      }, // Iowa
  { display: "Wichita",         slug: "Wichita"         }, // Kansas
  { display: "Louisville",      slug: "Louisville"      }, // Kentucky
  { display: "New Orleans",     slug: "New-Orleans"     }, // Louisiana
  { display: "Baltimore",       slug: "Baltimore"       }, // Maryland
  { display: "Boston",          slug: "Boston"          }, // Massachusetts
  { display: "Detroit",         slug: "Detroit"         }, // Michigan
  { display: "Minneapolis",     slug: "Minneapolis"     }, // Minnesota
  { display: "Jackson",         slug: "Jackson"         }, // Mississippi
  { display: "Saint Louis",     slug: "Saint-Louis"     }, // Missouri
  { display: "Billings",        slug: "Billings"        }, // Montana
  { display: "Omaha",           slug: "Omaha"           }, // Nebraska
  { display: "Las Vegas",       slug: "Las-Vegas"       }, // Nevada
  { display: "Nashua",          slug: "Nashua"          }, // New Hampshire
  { display: "Jersey City",     slug: "Jersey-City"     }, // New Jersey
  { display: "Albuquerque",     slug: "Albuquerque"     }, // New Mexico
  { display: "New York",        slug: "New-York"        }, // New York
  { display: "Charlotte",       slug: "Charlotte"       }, // North Carolina
  { display: "Fargo",           slug: "Fargo"           }, // North Dakota
  { display: "Columbus",        slug: "Columbus"        }, // Ohio
  { display: "Oklahoma City",   slug: "Oklahoma-City"   }, // Oklahoma
  { display: "Portland",        slug: "Portland"        }, // Oregon
  { display: "Philadelphia",    slug: "Philadelphia"    }, // Pennsylvania
  { display: "Providence",      slug: "Providence"      }, // Rhode Island
  { display: "Charleston",      slug: "Charleston"      }, // South Carolina
  { display: "Sioux Falls",     slug: "Sioux-Falls"     }, // South Dakota
  { display: "Nashville",       slug: "Nashville"       }, // Tennessee
  { display: "Dallas",          slug: "Dallas"          }, // Texas
  { display: "Salt Lake City",  slug: "Salt-Lake-City"  }, // Utah
  { display: "Burlington",      slug: "Burlington"      }, // Vermont
  { display: "Richmond",        slug: "Richmond"        }, // Virginia
  { display: "Seattle",         slug: "Seattle"         }, // Washington
  { display: "Milwaukee",       slug: "Milwaukee"       }, // Wisconsin
  { display: "Cheyenne",        slug: "Cheyenne"        }, // Wyoming
];

// ─── Grocery Basket Definition ─────────────────────────────────────────────
//
// 14-item tracked basket — single adult, moderate diet.
// Patterns match Numbeo "Markets" item names (lowercased, substring match).
// Expansion factor: tracked items ≈ 40% of real grocery spend → × 2.5 = full budget.
// Calibration anchor: BLS CEX 2024 single-consumer-unit food-at-home spend.

const GROCERY_BASKET: { pattern: string; monthlyQty: number }[] = [
  // Patterns match lowercased Numbeo "Markets" item names (substring, US-unit format served to Apify)
  // Qty unit: liters (milk), loaves (bread), dozens (eggs), heads (lettuce), 50-oz bottles (water),
  //           and lbs for everything else (Numbeo shows $/lb in US, converted from kg: ×2.2046)
  { pattern: "milk (regular",    monthlyQty: 8   }, // "Milk (Regular, 1 Liter)"  – price per liter
  { pattern: "fresh white bread", monthlyQty: 4  }, // "Fresh White Bread (1 lb Loaf)" – price per lb loaf
  { pattern: "white rice",       monthlyQty: 4.4 }, // "White Rice (1 lb)"  – 2 kg/mo → 4.4 lb
  { pattern: "eggs (12",         monthlyQty: 2   }, // "Eggs (12, Large Size)"
  { pattern: "local cheese",     monthlyQty: 1.1 }, // "Local Cheese (1 lb)" – 0.5 kg → 1.1 lb
  { pattern: "chicken fillets",  monthlyQty: 3.3 }, // "Chicken Fillets (1 lb)" – 1.5 kg → 3.3 lb
  { pattern: "beef round",       monthlyQty: 1.1 }, // "Beef Round … (1 lb)" – 0.5 kg → 1.1 lb
  { pattern: "apples",           monthlyQty: 4.4 }, // "Apples (1 lb)" – 2 kg → 4.4 lb
  { pattern: "bananas",          monthlyQty: 4.4 }, // "Bananas (1 lb)" – 2 kg → 4.4 lb
  { pattern: "tomatoes",         monthlyQty: 4.4 }, // "Tomatoes (1 lb)" – 2 kg → 4.4 lb
  { pattern: "potatoes",         monthlyQty: 4.4 }, // "Potatoes (1 lb)" – 2 kg → 4.4 lb
  { pattern: "onions",           monthlyQty: 2.2 }, // "Onions (1 lb)" – 1 kg → 2.2 lb
  { pattern: "lettuce (1 head)", monthlyQty: 4   }, // "Lettuce (1 Head)"
  { pattern: "bottled water (50", monthlyQty: 8  }, // "Bottled Water (50 oz)" – ≈1.5 L, markets section
];

// Tracked items cover ~40% of total single-adult grocery spend.
// × 2.5 expansion → full monthly budget. Empirically calibrated to ~$300 nationally.
const GROCERY_EXPANSION_FACTOR = 2.5;

// Numbeo city slug → US state name (matches STATE_INDEX keys in usRegionalBenchmarks.ts)
const CITY_TO_STATE: Record<string, string> = {
  "Huntsville":    "Alabama",
  "Anchorage":     "Alaska",
  "Phoenix":       "Arizona",
  "Little-Rock":   "Arkansas",
  "Los-Angeles":   "California",
  "Denver":        "Colorado",
  "Hartford":      "Connecticut",
  "Miami":         "Florida",
  "Atlanta":       "Georgia",
  "Honolulu":      "Hawaii",
  "Boise":         "Idaho",
  "Chicago":       "Illinois",
  "Indianapolis":  "Indiana",
  "Des-Moines":    "Iowa",
  "Wichita":       "Kansas",
  "Louisville":    "Kentucky",
  "New-Orleans":   "Louisiana",
  "Baltimore":     "Maryland",
  "Boston":        "Massachusetts",
  "Detroit":       "Michigan",
  "Minneapolis":   "Minnesota",
  "Jackson":       "Mississippi",
  "Saint-Louis":   "Missouri",
  "Billings":      "Montana",
  "Omaha":         "Nebraska",
  "Las-Vegas":     "Nevada",
  "Nashua":        "New Hampshire",
  "Jersey-City":   "New Jersey",
  "Albuquerque":   "New Mexico",
  "New-York":      "New York",
  "Charlotte":     "North Carolina",
  "Fargo":         "North Dakota",
  "Columbus":      "Ohio",
  "Oklahoma-City": "Oklahoma",
  "Portland":      "Oregon",
  "Philadelphia":  "Pennsylvania",
  "Providence":    "Rhode Island",
  "Charleston":    "South Carolina",
  "Sioux-Falls":   "South Dakota",
  "Nashville":     "Tennessee",
  "Dallas":        "Texas",
  "Salt-Lake-City":"Utah",
  "Burlington":    "Vermont",
  "Richmond":      "Virginia",
  "Seattle":       "Washington",
  "Milwaukee":     "Wisconsin",
  "Cheyenne":      "Wyoming",
};

// ─── Apify Web Scraper Page Functions ────────────────────────────────────────
//
// Expatistan HTML structure (May 2026): plain 3-column table
//   td[0] = icon/empty  |  td[1] = item name  |  td[2] = price

const EXPATISTAN_PAGE_FUNCTION = `
async function pageFunction(context) {
  const { request, log } = context;
  var slug = request.url.replace(/.*\\/cost-of-living\\//, '').replace(/[?#].*/, '');

  // Wait up to 8s for any table to appear
  try { await context.waitFor('table', { timeoutMillis: 8000 }); } catch(_) {}

  var pageTitle   = document.title || '';
  var allRows     = document.querySelectorAll('tr');
  var allTables   = document.querySelectorAll('table');
  var bodySnippet = (document.body ? document.body.innerText : '').slice(0, 300).replace(/\\n/g, ' ');

  log.info('TITLE: ' + pageTitle);
  log.info('TABLES: ' + allTables.length + '  ROWS: ' + allRows.length);
  log.info('BODY: ' + bodySnippet);

  var items = [];
  for (var i = 0; i < allRows.length; i++) {
    var row   = allRows[i];
    var cells = row.querySelectorAll('td');
    if (cells.length < 3) continue;
    var itemName = cells[1].textContent.trim().toLowerCase();
    var rawPrice = cells[2].textContent.trim().replace(/[^0-9.]/g, '');
    var priceUsd = parseFloat(rawPrice);
    if (!itemName || !isFinite(priceUsd) || priceUsd <= 0) continue;
    items.push({ itemName: itemName, priceUsd: priceUsd });
  }

  log.info(slug + ': extracted ' + items.length + ' items');
  return { slug: slug, items: items, _title: pageTitle, _rows: allRows.length };
}
`;

// ─── Numbeo Page Function ────────────────────────────────────────────────────
//
// Numbeo HTML structure: 3-column table (name | price | range)
//   td[0] = item name  |  td[1] = price  |  td[2] = range (ignored)

const NUMBEO_PAGE_FUNCTION = `
async function pageFunction(context) {
  var { request, log } = context;
  var slug = request.url.replace(/.*\\/cost-of-living\\/in\\//, '').replace(/[?#].*/, '');

  try { await context.waitFor('table', { timeoutMillis: 8000 }); } catch(_) {}

  var items = [];
  var rows = document.querySelectorAll('tr');
  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    var cells = row.querySelectorAll('td');
    if (cells.length < 2) continue;
    var itemName = cells[0].textContent.trim().toLowerCase();
    var rawPrice = cells[1].textContent.trim().replace(/[^0-9.]/g, '');
    var priceUsd = parseFloat(rawPrice);
    if (!itemName || !isFinite(priceUsd) || priceUsd <= 0) continue;
    items.push({ itemName: itemName, priceUsd: priceUsd });
  }

  log.info(slug + ': extracted ' + items.length + ' items');
  return { slug: slug, items: items };
}
`;

// ─── Types ───────────────────────────────────────────────────────────────────

interface ApifyDatasetItem {
  slug:  string;
  items: { itemName: string; priceUsd: number }[];
}

// ─── Apify Fetcher ────────────────────────────────────────────────────────────

async function fetchExpatistanViaApify(
  token: string,
): Promise<RawExpatistanCityPage[]> {
  const startUrls = EXPATISTAN_CITIES.map((c) => ({
    url: `https://www.expatistan.com/cost-of-living/${c.slug}`,
  }));

  const input = {
    startUrls,
    pageFunction: EXPATISTAN_PAGE_FUNCTION,
    pseudoUrls:   [],
    proxyConfiguration: { useApifyProxy: true },
  };

  console.log(
    `  Starting Apify web-scraper for ${startUrls.length} cities...`,
  );
  console.log(`  Cities: ${EXPATISTAN_CITIES.map((c) => c.display).join(", ")}`);

  // run-sync-get-dataset-items: starts run, waits for completion, returns items directly
  const res = await fetch(
    `https://api.apify.com/v2/acts/apify~web-scraper/run-sync-get-dataset-items?token=${token}&memory=1024&timeout=300`,
    {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(input),
    },
  );

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Apify HTTP ${res.status}: ${body.slice(0, 200)}`);
  }

  const items = (await res.json()) as ApifyDatasetItem[];
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Apify returned empty dataset");
  }

  console.log(`  ✓ Apify returned ${items.length} city pages`);

  const pages: RawExpatistanCityPage[] = items
    .filter(
      (item): item is ApifyDatasetItem =>
        typeof item.slug === "string" &&
        Array.isArray(item.items) &&
        item.items.length > 0,
    )
    .map((item) => ({
      slug:  item.slug,
      items: item.items.filter(
        (i) =>
          typeof i.itemName === "string" &&
          Number.isFinite(i.priceUsd) &&
          i.priceUsd > 0,
      ),
    }));

  console.log(`  ✓ Valid pages with items: ${pages.length} / ${items.length}`);
  return pages;
}

// ─── Numbeo Fetcher ──────────────────────────────────────────────────────────

async function fetchNumbeoViaApify(
  token: string,
): Promise<RawExpatistanCityPage[]> {
  const startUrls = NUMBEO_CITIES.map((c) => ({
    url: `https://www.numbeo.com/cost-of-living/in/${c.slug}`,
  }));

  const input = {
    startUrls,
    pageFunction: NUMBEO_PAGE_FUNCTION,
    pseudoUrls:   [],
    // No proxy — Numbeo doesn't require one (no Cloudflare)
  };

  console.log(`  Starting Apify web-scraper for ${startUrls.length} Numbeo cities...`);

  // Use async run + poll — run-sync-get-dataset-items has a hard 300s platform limit
  const startRes = await fetch(
    `https://api.apify.com/v2/acts/apify~web-scraper/runs?token=${token}&memory=1024&timeout=900`,
    {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(input),
    },
  );
  if (!startRes.ok) {
    const body = await startRes.text().catch(() => "");
    throw new Error(`Numbeo Apify start HTTP ${startRes.status}: ${body.slice(0, 200)}`);
  }
  const startData = (await startRes.json()) as { data: { id: string; defaultDatasetId: string } };
  const runId      = startData.data.id;
  const datasetId  = startData.data.defaultDatasetId;
  console.log(`  Run ${runId} started — polling...`);

  // Poll until the run finishes (max 1200s / 20 min)
  const pollDeadline = Date.now() + 1_200_000;
  let runStatus = "RUNNING";
  while (["RUNNING", "READY", "INITIALIZING"].includes(runStatus)) {
    if (Date.now() > pollDeadline) throw new Error("Numbeo Apify run poll timeout (20 min)");
    await new Promise((r) => setTimeout(r, 15_000));
    const statusRes = await fetch(
      `https://api.apify.com/v2/acts/apify~web-scraper/runs/${runId}?token=${token}`,
    );
    if (!statusRes.ok) continue;
    const statusData = (await statusRes.json()) as { data: { status: string } };
    runStatus = statusData.data.status;
    console.log(`  Run status: ${runStatus}`);
  }
  if (runStatus !== "SUCCEEDED") {
    throw new Error(`Numbeo Apify run finished with status: ${runStatus}`);
  }

  // Fetch dataset items
  const dataRes = await fetch(
    `https://api.apify.com/v2/datasets/${datasetId}/items?token=${token}&limit=500`,
  );
  if (!dataRes.ok) {
    const body = await dataRes.text().catch(() => "");
    throw new Error(`Numbeo Apify dataset HTTP ${dataRes.status}: ${body.slice(0, 200)}`);
  }

  const items = (await dataRes.json()) as ApifyDatasetItem[];
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Numbeo Apify returned empty dataset");
  }

  console.log(`  ✓ Numbeo returned ${items.length} city pages`);

  return items
    .filter(
      (item): item is ApifyDatasetItem =>
        typeof item.slug === "string" &&
        Array.isArray(item.items) &&
        item.items.length > 0,
    )
    .map((item) => ({
      slug:  item.slug,
      items: item.items.filter(
        (i) =>
          typeof i.itemName === "string" &&
          Number.isFinite(i.priceUsd) &&
          i.priceUsd > 0,
      ),
    }));
}

// ─── Numbeo Transform ─────────────────────────────────────────────────────────

const NUMBEO_PATTERNS: { key: string; pattern: string }[] = [
  { key: "inexpensiveRestaurantMealUs", pattern: "meal at an inexpensive restaurant" },
];

function transformNumbeoToBenchmarks(
  pages:      RawExpatistanCityPage[],
  minSamples: number,
): Record<string, number> {
  const totals: Record<string, { sum: number; count: number }> = {};

  for (const page of pages) {
    for (const { key, pattern } of NUMBEO_PATTERNS) {
      const match = page.items.find((i) => i.itemName.includes(pattern));
      if (!match) continue;
      if (!totals[key]) totals[key] = { sum: 0, count: 0 };
      totals[key].sum   += match.priceUsd;
      totals[key].count += 1;
    }
  }

  const result: Record<string, number> = {};
  const missing: string[] = [];
  for (const { key } of NUMBEO_PATTERNS) {
    const t = totals[key];
    if (t && t.count >= minSamples) {
      result[key] = Math.round((t.sum / t.count) * 100) / 100;
    } else {
      missing.push(key);
    }
  }
  if (missing.length > 0) {
    console.log(`  ⚠️  Numbeo: not enough samples for: ${missing.join(", ")}`);
  }
  return result;
}

// ─── Grocery Data Compute ────────────────────────────────────────────────────

/**
 * Derives per-city grocery basket costs from Numbeo scraped items, then computes:
 *   nationalBaseline — 8-city avg basket × expansion factor  → new NATIONAL.groceryMonthly
 *   cityIndices      — each city's ratio vs national avg      → updated STATE_INDEX values
 * Cities with fewer than 8/14 basket items matched are excluded.
 */
function computeGroceryData(pages: RawExpatistanCityPage[]): {
  nationalBaseline: number;
  cityIndices: Record<string, number>;
} {
  const cityBaskets: Record<string, number> = {};

  for (const page of pages) {
    let cost       = 0;
    let matchCount = 0;
    const missed: string[] = [];
    for (const { pattern, monthlyQty } of GROCERY_BASKET) {
      const match = page.items.find((i) => i.itemName.includes(pattern));
      if (match) {
        cost       += match.priceUsd * monthlyQty;
        matchCount += 1;
      } else {
        missed.push(pattern);
      }
    }
    if (matchCount >= 8) {
      cityBaskets[page.slug] = cost;
      console.log(`  [basket] ${page.slug}: $${cost.toFixed(2)} (${matchCount}/14 items)`);
    } else {
      console.log(`  [basket] ${page.slug}: skipped — only ${matchCount}/14 items matched`);
      // Debug first city only: show missed patterns + candidate items
      if (Object.keys(cityBaskets).length === 0 && missed.length > 0) {
        console.log(`  [debug]  Missed: ${missed.join(" | ")}`);
        console.log(`  [debug]  All ${page.items.length} scraped items from ${page.slug}:`);
        page.items.slice(0, 60).forEach((i) => console.log(`           "${i.itemName}" = $${i.priceUsd}`));
      }
    }
  }

  const values = Object.values(cityBaskets);
  if (values.length === 0) return { nationalBaseline: 0, cityIndices: {} };

  const avgBasket        = values.reduce((a, b) => a + b, 0) / values.length;
  const nationalBaseline = Math.round(avgBasket * GROCERY_EXPANSION_FACTOR);

  console.log(`  [basket] national avg tracked basket = $${avgBasket.toFixed(2)}`);
  console.log(`  [basket] groceryMonthly = $${nationalBaseline} (avg × ${GROCERY_EXPANSION_FACTOR})`);

  const cityIndices: Record<string, number> = {};
  for (const [slug, cost] of Object.entries(cityBaskets)) {
    const state = CITY_TO_STATE[slug];
    if (state) cityIndices[state] = Math.round((cost / avgBasket) * 100) / 100;
  }

  return { nationalBaseline, cityIndices };
}

// ─── Regional File Patchers ───────────────────────────────────────────────────

function patchRegionalGrocery(src: string, newVal: number, comment: string): string {
  return src.replace(
    /groceryMonthly:\s*[\d.]+,([ \t]*\/\/[^\n]*)?/,
    `groceryMonthly: ${newVal},   // ${comment}`,
  );
}

function patchStateIndex(src: string, state: string, newIdx: number): string {
  return src.replace(
    new RegExp(`("${state}":\\s*)[\\d.]+,([ \\t]*\\/\\/[^\\n]*)?`),
    `$1${newIdx},`,
  );
}

// ─── File Patcher ─────────────────────────────────────────────────────────────

function patchField(
  src:     string,
  field:   string,
  newVal:  string,
  comment: string,
): string {
  // Try with inline comment first
  const withComment = new RegExp(`([ \\t]+${field}:\\s*)[\\d.]+,([ \\t]*\\/\\/[^\\n]*)`, "g");
  if (withComment.test(src)) {
    return src.replace(
      new RegExp(`([ \\t]+${field}:\\s*)[\\d.]+,([ \\t]*\\/\\/[^\\n]*)`, "g"),
      `$1${newVal},   // ${comment}`,
    );
  }
  // Without inline comment
  return src.replace(
    new RegExp(`([ \\t]+${field}:\\s*)[\\d.]+,`, "g"),
    `$1${newVal},   // ${comment}`,
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log("WorthCore Cost Benchmark Refresh");
  console.log("─────────────────────────────────");

  if (!APIFY_TOKEN) {
    console.error("Error: APIFY_TOKEN is not set.");
    console.error("  Set it in .env.local: APIFY_TOKEN=your_token");
    console.error("  Obtain a token at: https://console.apify.com/account/integrations");
    process.exit(1);
  }

  const updates: Record<string, { value: number; comment: string }> = {};
  const label = new Date().toLocaleString("en-US", { month: "long", year: "numeric" });
  const iso   = new Date().toISOString();

  // ── Apify + Expatistan ────────────────────────────────────────────────────
  console.log("\nApify + Expatistan scrape...");
  try {
    const pages      = await fetchExpatistanViaApify(APIFY_TOKEN);
    const benchmarks = transformExpatistanToBenchmarks(pages, 3);

    console.log("\n" + summarizeTransformation(pages, benchmarks));

    for (const [key, value] of Object.entries(benchmarks) as [string, number][]) {
      if (Number.isFinite(value) && value > 0) {
        updates[key] = { value, comment: `Expatistan 8-city US avg — ${label}` };
      }
    }
  } catch (err) {
    console.error(`\nApify scrape failed: ${(err as Error).message}`);
    console.error("costBenchmarks.ts was NOT modified.");
    process.exit(1);
  }

  // ── Apify + Numbeo ────────────────────────────────────────────────────────
  console.log("\nApify + Numbeo scrape...");
  try {
    const numbeoPages = await fetchNumbeoViaApify(APIFY_TOKEN);

    // ── Restaurant meal price ───────────────────────────────────────────────
    const numbeoBenchmarks = transformNumbeoToBenchmarks(numbeoPages, 3);
    for (const [key, value] of Object.entries(numbeoBenchmarks) as [string, number][]) {
      if (Number.isFinite(value) && value > 0) {
        updates[key] = { value, comment: `Numbeo 8-city US avg — ${label}` };
        console.log(`  ✓ ${key} = ${value}`);
      }
    }

    // ── Grocery basket → NATIONAL.groceryMonthly + STATE_INDEX ─────────────
    console.log("\nComputing grocery basket...");
    const { nationalBaseline, cityIndices } = computeGroceryData(numbeoPages);
    if (nationalBaseline > 0) {
      console.log("\nPatching usRegionalBenchmarks.ts...");
      let regional = fs.readFileSync(REGIONAL_FILE, "utf-8");
      regional = patchRegionalGrocery(
        regional,
        nationalBaseline,
        `Numbeo 8-city basket × ${GROCERY_EXPANSION_FACTOR} expansion — ${label}`,
      );
      console.log(`  ✓ NATIONAL.groceryMonthly = ${nationalBaseline}`);
      let idxCount = 0;
      for (const [state, idx] of Object.entries(cityIndices)) {
        regional = patchStateIndex(regional, state, idx);
        console.log(`  ✓ STATE_INDEX["${state}"] = ${idx}`);
        idxCount++;
      }
      fs.writeFileSync(REGIONAL_FILE, regional, "utf-8");
      console.log(`  ✓ usRegionalBenchmarks.ts — ${idxCount} state indices refreshed.`);
    } else {
      console.log("  ⚠️  Grocery basket: no cities with ≥ 8 matched items — skipping regional patch");
    }
  } catch (err) {
    console.warn(`  ⚠️  Numbeo scrape failed (non-fatal): ${(err as Error).message}`);
  }

  // ── Apply ──────────────────────────────────────────────────────────────────

  if (Object.keys(updates).length === 0) {
    console.log("\n⚠️  No benchmarks extracted. costBenchmarks.ts was NOT modified.");
    process.exit(1);
  }

  let source = fs.readFileSync(BENCHMARKS_FILE, "utf-8");
  console.log("\nPatching costBenchmarks.ts...");

  for (const [field, { value, comment }] of Object.entries(updates)) {
    source = patchField(source, field, String(value), comment);
    console.log(`  ✓ ${field} = ${value}`);
  }

  // Recalculate volatile derived fields from updated base values
  const coffeeVal = source.match(/coffeePerCupUs:\s*([\d.]+)/)?.[1];
  const cigsVal   = source.match(/cigarettesPerPackUs:\s*([\d.]+)/)?.[1];
  if (coffeeVal) {
    const v = parseFloat(coffeeVal);
    source = patchField(source, "coffeeAnnualIfDaily", String(Math.round(v * 365)), `derived: ${v} × 365`);
  }
  if (cigsVal) {
    const v = parseFloat(cigsVal);
    source = patchField(source, "cigarettesAnnualIfDaily", String(Math.round(v * 365)), `derived: ${v} × 365`);
  }
  const inexpensiveVal = source.match(/inexpensiveRestaurantMealUs:\s*([\d.]+)/)?.[1];
  if (inexpensiveVal) {
    const v = parseFloat(inexpensiveVal);
    const delivery = Math.round(v * 1.38 * 100) / 100;
    source = patchField(source, "deliveryAppMealUs", String(delivery), `derived: inexpensive restaurant × 1.38 delivery markup`);
  }

  // Metadata
  source = source.replace(/lastUpdated:\s*"[^"]*"/, `lastUpdated:        "${iso}"`);
  source = source.replace(/currentPeriodLabel:\s*"[^"]*"/, `currentPeriodLabel: "${label}"`);
  source = source.replace(
    /\/\/ LAST UPDATED:\n\/\/\s+[^\n]+/,
    `// LAST UPDATED:\n//   ${iso.slice(0, 10)} — Apify/Expatistan`,
  );

  fs.writeFileSync(BENCHMARKS_FILE, source, "utf-8");

  console.log(`\n✅ costBenchmarks.ts updated — ${Object.keys(updates).length} fields refreshed.`);
  console.log(`   Path:   ${BENCHMARKS_FILE}`);
  console.log(`   Period: ${label}`);
}

main().catch((err) => {
  console.error("Unhandled error:", err);
  process.exit(1);
});
