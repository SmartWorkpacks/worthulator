// ─── WorthCore Refresh Registry ──────────────────────────────────────────────
//
// PURPOSE:
//   Single source of truth for all benchmark data acquisition.
//   Defines WHAT exists, WHERE it lives, HOW OFTEN it refreshes, and
//   WHERE the data comes from.
//
// ARCHITECTURE:
//   source → refresh script → local benchmark dataset → WorthCore intelligence → calculators
//
// PRIMARY STACK:
//   Apify          → consumer pricing intelligence (real-world, city-level)
//   FRED           → macroeconomic rates (mortgage, savings, inflation)
//   Yahoo Finance  → market assumptions (returns, yields, volatility)
//
// CALCULATORS NEVER:
//   - Fetch live APIs
//   - Depend on runtime acquisition
//   - Call refresh scripts
//   Calculators import ONLY from local dataset files.
//
// CADENCE SUMMARY:
//   daily     — mortgage rates, savings rates, fuel, market assumptions
//   weekly    — consumer prices: groceries, utilities, transport, restaurant
//   monthly   — salaries, rent/housing, childcare, subscriptions
//   quarterly — construction materials, contractor labor rates
//
// USAGE (from refresh scripts or orchestrators):
//   import { getByStatus, getByDataset, REFRESH_REGISTRY } from "@/lib/datasets/refreshRegistry";
//   const active = getByStatus("active");
//   const daily  = REFRESH_REGISTRY.filter((e) => e.cadence === "daily");

// ─── Types ───────────────────────────────────────────────────────────────────

/** How often a benchmark dataset should be refreshed */
export type RefreshCadence = "daily" | "weekly" | "monthly" | "quarterly";

/**
 * Where benchmark data originates.
 * Apify is the primary consumer intelligence layer.
 * FRED and Yahoo Finance handle macroeconomic and market assumptions.
 * BLS is retained for the salary domain — published monthly, stable series.
 * manual-survey covers annual reports (Care.com, Forbes, etc.).
 */
export type DataSource =
  | "apify-expatistan"  // Apify cheerio-scraper → Expatistan city pages
  | "apify-energy"     // Apify web-scraper → AAA gas + ChooseEnergy electricity tables
  | "fred"             // St. Louis Fed FRED API (free, stable, global access)
  | "yahoo-finance"    // Yahoo Finance quote/screener API
  | "bls"             // Bureau of Labor Statistics public API (salary only)
  | "manual-survey";  // Annual survey data — updated manually each cycle

/** Whether the refresh script is built and operational */
export type RefreshStatus = "active" | "planned";

export interface RefreshEntry {
  /** Human-readable label for this refresh entry */
  readonly label:   string;

  /** Path to the refresh script, relative to project root */
  readonly script:  string;

  /** Path to the local dataset file this script updates, relative to project root */
  readonly dataset: string;

  /** Recommended refresh cadence */
  readonly cadence: RefreshCadence;

  /** Primary data source */
  readonly source:  DataSource;

  /** Whether the script is built and operational */
  readonly status:  RefreshStatus;

  /**
   * Dataset field names updated by this script.
   * Must match the actual field names in the corresponding benchmark interface.
   */
  readonly fields:  readonly string[];

  /** Optional notes on source series, survey names, or acquisition approach */
  readonly notes?:  string;
}

// ─── Registry ─────────────────────────────────────────────────────────────────

export const REFRESH_REGISTRY = [

  // ╔══════════════════════════════════════════════════════════════════════════╗
  // ║  DAILY                                                                   ║
  // ╚══════════════════════════════════════════════════════════════════════════╝

  {
    label:   "FRED Macroeconomic Rates",
    script:  "scripts/updateFredBenchmarks.ts",
    dataset: "lib/datasets/finance/fredBenchmarks.ts",
    cadence: "daily" as RefreshCadence,
    source:  "fred" as DataSource,
    status:  "planned" as RefreshStatus,
    fields:  [
      "mortgageRate30yr",
      "mortgageRate15yr",
      "fedFundsRate",
      "savingsRateNational",
      "cpiYoY",
    ],
    notes: "FRED series: MORTGAGE30US, MORTGAGE15US, FEDFUNDS, CPIAUCSL. Free API, no key required.",
  },

  {
    label:   "Yahoo Finance Market Benchmarks",
    script:  "scripts/updateMarketBenchmarks.ts",
    dataset: "lib/datasets/finance/marketBenchmarks.ts",
    cadence: "daily" as RefreshCadence,
    source:  "yahoo-finance" as DataSource,
    status:  "planned" as RefreshStatus,
    fields:  [
      "sp500AnnualReturnAvg",
      "treasuryYield10yr",
      "treasuryYield2yr",
      "vixIndex",
    ],
    notes: "Yahoo Finance: ^GSPC, ^TNX, ^IRX, ^VIX. Used for investment projections in calculators.",
  },

  // ╔══════════════════════════════════════════════════════════════════════════╗
  // ║  WEEKLY                                                                  ║
  // ╚══════════════════════════════════════════════════════════════════════════╝

  {
    label:   "Apify Consumer Cost Benchmarks",
    script:  "scripts/updateCostBenchmarks.ts",
    dataset: "lib/datasets/costs/costBenchmarks.ts",
    cadence: "weekly" as RefreshCadence,
    source:  "apify-expatistan" as DataSource,
    status:  "active" as RefreshStatus,
    fields:  [
      "fuelPerGallonUs",
      "groceriesMonthlyUs",
      "groceriesAnnualUs",
      "utilitiesMonthlyUs",
      "coffeePerCupUs",
      "coffeeAnnualIfDaily",
      "cigarettesPerPackUs",
      "cigarettesAnnualIfDaily",
      "restaurantMealUs",
      "gymMonthlyUs",
      "publicTransitMonthlyUs",
      "businessLunchUs",
      "rentNormalMonthlyUs",
      "rentExpensiveMonthlyUs",
    ],
    notes:
      "Expatistan 8-city US average: Nashville, Atlanta, Dallas, Denver, Chicago, Seattle, Boston, LA. " +
      "Fuel converted from liters → gallons. Run: npx tsx scripts/updateCostBenchmarks.ts",
  },

  {
    label:   "Apify State Energy Prices (EV vs Gas)",
    script:  "scripts/updateEnergyPrices.ts",
    dataset: "lib/datasets/usStateFuelPrices.ts",
    cadence: "weekly" as RefreshCadence,
    source:  "apify-energy" as DataSource,
    status:  "active" as RefreshStatus,
    fields:  [
      "states",       // per-state gas $/gal (usStateFuelPrices.ts)
      "national",
    ],
    notes:
      "Scrapes AAA state gas averages + ChooseEnergy residential electricity rates via Apify web-scraper. " +
      "Also patches lib/datasets/regional/usStateElectricityPrices.ts. " +
      "Safe no-op without a token or on parse failure (keeps static fallback). Run: npm run energy:refresh",
  },

  // ╔══════════════════════════════════════════════════════════════════════════╗
  // ║  MONTHLY                                                                 ║
  // ╚══════════════════════════════════════════════════════════════════════════╝

  {
    label:   "BLS Salary & Labor Benchmarks",
    script:  "scripts/updateBlsBenchmarks.ts",
    dataset: "lib/datasets/salary/salaryBenchmarks.ts",
    cadence: "monthly" as RefreshCadence,
    source:  "bls" as DataSource,
    status:  "active" as RefreshStatus,
    fields:  [
      "avgHourlyWageUs",
      "avgWeeklyHoursUs",
      "unemploymentRateUs",
      "inflationRateUs",
      "impliedAnnualSalaryUs",
    ],
    notes:
      "BLS series: CES0500000003 (hourly wage), CES0500000007 (weekly hours), " +
      "LNS14000000 (unemployment), CUUR0000SA0 (CPI). " +
      "Run: npx tsx scripts/updateBlsBenchmarks.ts",
  },

  {
    label:   "Apify Rental & Housing Benchmarks",
    script:  "scripts/updateHousingBenchmarks.ts",
    dataset: "lib/datasets/housing/housingBenchmarks.ts",
    cadence: "monthly" as RefreshCadence,
    source:  "apify-expatistan" as DataSource,
    status:  "planned" as RefreshStatus,
    fields:  [
      "medianRentStudioUs",
      "medianRent1BrUs",
      "medianRent2BrUs",
      "medianHomePriceUs",
      "rentersInsuranceMonthlyUs",
    ],
    notes: "Expatistan city pages + Zillow/Rentometer via Apify. Complements rentNormalMonthlyUs in costBenchmarks.",
  },

  {
    label:   "Annual Survey: Childcare & Subscriptions",
    script:  "scripts/updateSurveyBenchmarks.ts",
    dataset: "lib/datasets/costs/costBenchmarks.ts",
    cadence: "monthly" as RefreshCadence,
    source:  "manual-survey" as DataSource,
    status:  "planned" as RefreshStatus,
    fields:  [
      "childcareMonthlyUs",
      "subscriptionsMonthlyUs",
      "streamingOnlyMonthlyUs",
    ],
    notes:
      "Sources: Care.com Annual Cost of Care Survey (refresh Feb), " +
      "Forbes/Chase Annual Subscription Spend Survey (refresh Q1). " +
      "Low volatility — manual patch acceptable.",
  },

  // ╔══════════════════════════════════════════════════════════════════════════╗
  // ║  QUARTERLY                                                               ║
  // ╚══════════════════════════════════════════════════════════════════════════╝

  {
    label:   "Construction Material Benchmarks",
    script:  "scripts/updateConstructionBenchmarks.ts",
    dataset: "lib/datasets/construction/constructionBenchmarks.ts",
    cadence: "quarterly" as RefreshCadence,
    source:  "apify-expatistan" as DataSource,
    status:  "planned" as RefreshStatus,
    fields:  [
      "flooringCostPerSqFtUs",
      "paintCostPerGallonUs",
      "tileCostPerSqFtUs",
      "concretePerCubicYardUs",
      "laborRateDrywall",
      "laborRatePlumbing",
      "laborRateElectrical",
      "laborRatePainting",
    ],
    notes: "HomeAdvisor / Angi / Thumbtack via Apify. Low-volatility category — quarterly cadence sufficient.",
  },

] as const satisfies RefreshEntry[];

// ─── Accessors ────────────────────────────────────────────────────────────────

/** All entries for a given refresh status */
export function getByStatus(status: RefreshStatus): RefreshEntry[] {
  return REFRESH_REGISTRY.filter((e) => e.status === status);
}

/** All entries that update a given dataset file */
export function getByDataset(dataset: string): RefreshEntry[] {
  return REFRESH_REGISTRY.filter((e) => e.dataset === dataset);
}

/** All entries for a given cadence */
export function getByCadence(cadence: RefreshCadence): RefreshEntry[] {
  return REFRESH_REGISTRY.filter((e) => e.cadence === cadence);
}

/** All entries for a given data source */
export function getBySource(source: DataSource): RefreshEntry[] {
  return REFRESH_REGISTRY.filter((e) => e.source === source);
}

/** Look up the entry responsible for a specific benchmark field */
export function getByField(field: string): RefreshEntry | undefined {
  return REFRESH_REGISTRY.find((e) =>
    (e.fields as readonly string[]).includes(field),
  );
}
