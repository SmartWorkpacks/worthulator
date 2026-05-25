// ─── US State Sales Tax Dataset ───────────────────────────────────────────────
//
// Source: Tax Foundation 2026 estimates (state statutory rates + avg local rates).
// Deterministic, SSR-safe, no runtime fetches.
// Used by: sales-tax-calculator [state] routes + insight generator.
//
// ─────────────────────────────────────────────────────────────────────────────

export interface StateSalesTaxData {
  /** 2-letter state/DC code */
  code: string;
  /** Full state name */
  name: string;
  /** URL slug — lowercase, words joined with hyphens */
  slug: string;
  /** Statutory statewide rate (%) — 0 for no-tax states */
  stateRate: number;
  /** Estimated average combined rate (state + avg local) (%) */
  combinedRate: number;
  /** Combined rank — 1 = highest combined rate in the US */
  rank: number;
  /** True when state has no statewide sales tax */
  noTax: boolean;
  /** True when unprepared groceries are fully exempt */
  groceryExempt: boolean;
  /** One-line human note about local rate variation */
  localNote: string;
  /** Slugs of geographic neighbors — for comparison insights */
  neighbors: string[];
}

// National average combined rate (Tax Foundation 2026)
export const NATIONAL_AVG_SALES_TAX = 7.12;

const RAW: Omit<StateSalesTaxData, "slug">[] = [
  // ── High-rate states ──────────────────────────────────────────────────────
  {
    code: "TN", name: "Tennessee",
    stateRate: 7.0,  combinedRate: 9.55, rank: 1,
    noTax: false, groceryExempt: false,
    localNote: "Local rates up to 2.75% push the combined total well above 9%.",
    neighbors: ["kentucky", "virginia", "north-carolina", "georgia", "alabama", "mississippi", "arkansas", "missouri"],
  },
  {
    code: "LA", name: "Louisiana",
    stateRate: 4.45, combinedRate: 9.52, rank: 2,
    noTax: false, groceryExempt: true,
    localNote: "Parish-level rates commonly add 4–5% on top of the state rate.",
    neighbors: ["texas", "arkansas", "mississippi"],
  },
  {
    code: "AR", name: "Arkansas",
    stateRate: 6.5,  combinedRate: 9.48, rank: 3,
    noTax: false, groceryExempt: false,
    localNote: "City and county rates vary — some areas exceed 3% in local additions.",
    neighbors: ["missouri", "tennessee", "mississippi", "louisiana", "texas", "oklahoma"],
  },
  {
    code: "WA", name: "Washington",
    stateRate: 6.5,  combinedRate: 9.38, rank: 4,
    noTax: false, groceryExempt: true,
    localNote: "City rates add up to 3.9% — Seattle's combined rate sits around 10.25%.",
    neighbors: ["oregon", "idaho"],
  },
  {
    code: "AL", name: "Alabama",
    stateRate: 4.0,  combinedRate: 9.29, rank: 5,
    noTax: false, groceryExempt: false,
    localNote: "County and city rates are among the highest local additions in the country.",
    neighbors: ["tennessee", "georgia", "florida", "mississippi"],
  },
  {
    code: "OK", name: "Oklahoma",
    stateRate: 4.5,  combinedRate: 8.99, rank: 6,
    noTax: false, groceryExempt: true,
    localNote: "City rates range widely — Tulsa and Oklahoma City both exceed 8.5% combined.",
    neighbors: ["kansas", "missouri", "arkansas", "texas", "new-mexico", "colorado"],
  },
  {
    code: "IL", name: "Illinois",
    stateRate: 6.25, combinedRate: 8.85, rank: 7,
    noTax: false, groceryExempt: false,
    localNote: "Chicago's combined rate hits 10.25% — one of the highest in any major US city.",
    neighbors: ["wisconsin", "iowa", "missouri", "kentucky", "indiana"],
  },
  {
    code: "KS", name: "Kansas",
    stateRate: 6.5,  combinedRate: 8.73, rank: 8,
    noTax: false, groceryExempt: false,
    localNote: "Nearly all localities add a city/county rate on top of the state base.",
    neighbors: ["nebraska", "missouri", "oklahoma", "colorado"],
  },
  {
    code: "CA", name: "California",
    stateRate: 7.25, combinedRate: 8.68, rank: 9,
    noTax: false, groceryExempt: true,
    localNote: "Local district taxes vary by county — Los Angeles sits at 10.25% combined.",
    neighbors: ["oregon", "nevada", "arizona"],
  },
  {
    code: "NY", name: "New York",
    stateRate: 4.0,  combinedRate: 8.53, rank: 10,
    noTax: false, groceryExempt: true,
    localNote: "NYC's combined rate is 8.875%. Most clothing under $110 is exempt.",
    neighbors: ["vermont", "massachusetts", "connecticut", "new-jersey", "pennsylvania"],
  },
  {
    code: "MO", name: "Missouri",
    stateRate: 4.225, combinedRate: 8.36, rank: 11,
    noTax: false, groceryExempt: false,
    localNote: "St. Louis City and Kansas City both exceed 9.6% with local additions.",
    neighbors: ["iowa", "illinois", "kentucky", "tennessee", "arkansas", "oklahoma", "kansas", "nebraska"],
  },
  {
    code: "AZ", name: "Arizona",
    stateRate: 5.6,  combinedRate: 8.37, rank: 12,
    noTax: false, groceryExempt: true,
    localNote: "Local transaction privilege taxes vary — Phoenix is around 8.6%.",
    neighbors: ["california", "nevada", "utah", "colorado", "new-mexico"],
  },
  {
    code: "NV", name: "Nevada",
    stateRate: 6.85, combinedRate: 8.35, rank: 13,
    noTax: false, groceryExempt: true,
    localNote: "Clark County (Las Vegas) combined rate is 8.375%.",
    neighbors: ["oregon", "idaho", "utah", "arizona", "california"],
  },
  {
    code: "TX", name: "Texas",
    stateRate: 6.25, combinedRate: 8.20, rank: 14,
    noTax: false, groceryExempt: true,
    localNote: "Cities and counties can add up to 2% — most major cities hit the 8.25% cap.",
    neighbors: ["new-mexico", "oklahoma", "arkansas", "louisiana"],
  },
  {
    code: "MN", name: "Minnesota",
    stateRate: 6.875, combinedRate: 8.12, rank: 15,
    noTax: false, groceryExempt: true,
    localNote: "Minneapolis and Saint Paul each add local rates bringing totals near 8.5%.",
    neighbors: ["north-dakota", "south-dakota", "iowa", "wisconsin"],
  },
  {
    code: "CO", name: "Colorado",
    stateRate: 2.9,  combinedRate: 7.81, rank: 16,
    noTax: false, groceryExempt: true,
    localNote: "Hundreds of local jurisdictions — Denver's combined rate exceeds 8.81%.",
    neighbors: ["wyoming", "nebraska", "kansas", "oklahoma", "new-mexico", "arizona", "utah"],
  },
  {
    code: "NM", name: "New Mexico",
    stateRate: 5.0,  combinedRate: 7.83, rank: 17,
    noTax: false, groceryExempt: true,
    localNote: "Gross receipts tax model — local additions bring most areas above 8%.",
    neighbors: ["colorado", "oklahoma", "texas", "arizona", "utah"],
  },
  {
    code: "SC", name: "South Carolina",
    stateRate: 6.0,  combinedRate: 7.46, rank: 18,
    noTax: false, groceryExempt: false,
    localNote: "Counties can add up to 1% — most areas stay between 7% and 8%.",
    neighbors: ["north-carolina", "georgia"],
  },
  {
    code: "GA", name: "Georgia",
    stateRate: 4.0,  combinedRate: 7.38, rank: 19,
    noTax: false, groceryExempt: false,
    localNote: "Most counties add a SPLOST bringing the combined rate to 7%–8%.",
    neighbors: ["tennessee", "north-carolina", "south-carolina", "florida", "alabama"],
  },
  {
    code: "OH", name: "Ohio",
    stateRate: 5.75, combinedRate: 7.25, rank: 20,
    noTax: false, groceryExempt: true,
    localNote: "County rates vary — Cuyahoga County (Cleveland) hits 8%.",
    neighbors: ["michigan", "pennsylvania", "west-virginia", "kentucky", "indiana"],
  },
  {
    code: "MS", name: "Mississippi",
    stateRate: 7.0,  combinedRate: 7.07, rank: 21,
    noTax: false, groceryExempt: false,
    localNote: "Local additions are minimal — most areas stay close to the 7% state rate.",
    neighbors: ["tennessee", "alabama", "louisiana", "arkansas"],
  },
  {
    code: "IN", name: "Indiana",
    stateRate: 7.0,  combinedRate: 7.0, rank: 22,
    noTax: false, groceryExempt: true,
    localNote: "Indiana allows no local sales taxes — the rate is uniform statewide.",
    neighbors: ["michigan", "ohio", "kentucky", "illinois"],
  },
  {
    code: "UT", name: "Utah",
    stateRate: 4.85, combinedRate: 7.19, rank: 23,
    noTax: false, groceryExempt: false,
    localNote: "Salt Lake County combined rate is around 7.75%. Food is taxed at a reduced 3%.",
    neighbors: ["idaho", "wyoming", "colorado", "new-mexico", "arizona", "nevada"],
  },
  {
    code: "KY", name: "Kentucky",
    stateRate: 6.0,  combinedRate: 6.0, rank: 24,
    noTax: false, groceryExempt: true,
    localNote: "Kentucky has no local sales taxes — the rate is a flat 6% everywhere.",
    neighbors: ["illinois", "indiana", "ohio", "west-virginia", "virginia", "tennessee", "missouri"],
  },
  {
    code: "MI", name: "Michigan",
    stateRate: 6.0,  combinedRate: 6.0, rank: 25,
    noTax: false, groceryExempt: true,
    localNote: "Michigan has no local sales taxes — the rate is a flat 6% everywhere.",
    neighbors: ["ohio", "indiana", "illinois", "wisconsin"],
  },
  {
    code: "NC", name: "North Carolina",
    stateRate: 4.75, combinedRate: 6.97, rank: 26,
    noTax: false, groceryExempt: true,
    localNote: "Most counties add 2%–2.25% — the statewide average lands close to 7%.",
    neighbors: ["virginia", "tennessee", "georgia", "south-carolina"],
  },
  {
    code: "ND", name: "North Dakota",
    stateRate: 5.0,  combinedRate: 6.96, rank: 27,
    noTax: false, groceryExempt: true,
    localNote: "City rates add 1%–3% in most areas — Fargo combined rate is around 7.5%.",
    neighbors: ["minnesota", "south-dakota", "montana"],
  },
  {
    code: "NE", name: "Nebraska",
    stateRate: 5.5,  combinedRate: 6.94, rank: 28,
    noTax: false, groceryExempt: true,
    localNote: "Omaha and Lincoln each add about 1.5% in city rate on top of the state rate.",
    neighbors: ["south-dakota", "iowa", "missouri", "kansas", "colorado", "wyoming"],
  },
  {
    code: "IA", name: "Iowa",
    stateRate: 6.0,  combinedRate: 6.94, rank: 29,
    noTax: false, groceryExempt: true,
    localNote: "Local option taxes of up to 1% apply in many cities.",
    neighbors: ["minnesota", "wisconsin", "illinois", "missouri", "nebraska", "south-dakota"],
  },
  {
    code: "FL", name: "Florida",
    stateRate: 6.0,  combinedRate: 7.02, rank: 30,
    noTax: false, groceryExempt: true,
    localNote: "County discretionary surtaxes add 0.5%–1% in most Florida counties.",
    neighbors: ["georgia", "alabama"],
  },
  {
    code: "SD", name: "South Dakota",
    stateRate: 4.2,  combinedRate: 6.40, rank: 31,
    noTax: false, groceryExempt: false,
    localNote: "Most municipalities add 1%–2% — Sioux Falls sits at about 6.2% combined.",
    neighbors: ["north-dakota", "minnesota", "iowa", "nebraska", "wyoming", "montana"],
  },
  {
    code: "ID", name: "Idaho",
    stateRate: 6.0,  combinedRate: 6.02, rank: 32,
    noTax: false, groceryExempt: false,
    localNote: "Local additions are very small — the statewide rate is close to the full picture.",
    neighbors: ["washington", "oregon", "nevada", "utah", "wyoming", "montana"],
  },
  {
    code: "CT", name: "Connecticut",
    stateRate: 6.35, combinedRate: 6.35, rank: 33,
    noTax: false, groceryExempt: true,
    localNote: "Connecticut has no local sales taxes — the rate is a uniform 6.35%.",
    neighbors: ["new-york", "massachusetts", "rhode-island"],
  },
  {
    code: "MD", name: "Maryland",
    stateRate: 6.0,  combinedRate: 6.0, rank: 34,
    noTax: false, groceryExempt: true,
    localNote: "Maryland has no local sales taxes — the rate is a flat 6% everywhere.",
    neighbors: ["pennsylvania", "delaware", "virginia", "west-virginia"],
  },
  {
    code: "DC", name: "District of Columbia",
    stateRate: 6.0,  combinedRate: 6.0, rank: 35,
    noTax: false, groceryExempt: true,
    localNote: "DC operates as a unified jurisdiction — no separate local rate applies.",
    neighbors: ["maryland", "virginia"],
  },
  {
    code: "WV", name: "West Virginia",
    stateRate: 6.0,  combinedRate: 6.35, rank: 36,
    noTax: false, groceryExempt: true,
    localNote: "Counties can add up to 1% — most areas stay between 6% and 7%.",
    neighbors: ["pennsylvania", "maryland", "virginia", "kentucky", "ohio"],
  },
  {
    code: "PA", name: "Pennsylvania",
    stateRate: 6.0,  combinedRate: 6.34, rank: 37,
    noTax: false, groceryExempt: true,
    localNote: "Allegheny County (Pittsburgh) adds 1%; Philadelphia city adds 2%.",
    neighbors: ["new-york", "new-jersey", "delaware", "maryland", "west-virginia", "ohio"],
  },
  {
    code: "VT", name: "Vermont",
    stateRate: 6.0,  combinedRate: 6.18, rank: 38,
    noTax: false, groceryExempt: true,
    localNote: "Some localities add a 1% local option tax.",
    neighbors: ["new-york", "new-hampshire", "massachusetts"],
  },
  {
    code: "RI", name: "Rhode Island",
    stateRate: 7.0,  combinedRate: 7.0, rank: 39,
    noTax: false, groceryExempt: true,
    localNote: "Rhode Island has no local sales taxes — the rate is a uniform 7%.",
    neighbors: ["connecticut", "massachusetts"],
  },
  {
    code: "MA", name: "Massachusetts",
    stateRate: 6.25, combinedRate: 6.25, rank: 40,
    noTax: false, groceryExempt: true,
    localNote: "Massachusetts has no local sales taxes — the rate is a flat 6.25%.",
    neighbors: ["new-york", "vermont", "new-hampshire", "rhode-island", "connecticut"],
  },
  {
    code: "NJ", name: "New Jersey",
    stateRate: 6.625, combinedRate: 6.60, rank: 41,
    noTax: false, groceryExempt: true,
    localNote: "Urban Enterprise Zones charge only 3.3125% — New Jersey's unique local reduction.",
    neighbors: ["new-york", "pennsylvania", "delaware"],
  },
  {
    code: "VA", name: "Virginia",
    stateRate: 5.3,  combinedRate: 5.73, rank: 42,
    noTax: false, groceryExempt: true,
    localNote: "Regional transportation districts add 0.3%–0.7% in Northern Virginia and Hampton Roads.",
    neighbors: ["west-virginia", "maryland", "north-carolina", "tennessee", "kentucky"],
  },
  {
    code: "WI", name: "Wisconsin",
    stateRate: 5.0,  combinedRate: 5.43, rank: 43,
    noTax: false, groceryExempt: true,
    localNote: "Counties can add up to 0.5% — Milwaukee County combined rate is about 5.6%.",
    neighbors: ["minnesota", "iowa", "illinois", "michigan"],
  },
  {
    code: "WY", name: "Wyoming",
    stateRate: 4.0,  combinedRate: 5.44, rank: 44,
    noTax: false, groceryExempt: true,
    localNote: "Counties add up to 2% — most areas land between 5% and 6%.",
    neighbors: ["montana", "south-dakota", "nebraska", "colorado", "utah", "idaho"],
  },
  {
    code: "HI", name: "Hawaii",
    stateRate: 4.0,  combinedRate: 4.44, rank: 45,
    noTax: false, groceryExempt: false,
    localNote: "Hawaii's GET (General Excise Tax) is applied at the wholesale level and passed through — effective consumer burden is higher than the nominal rate suggests.",
    neighbors: [],
  },
  // ── No-tax / near-zero states ─────────────────────────────────────────────
  {
    code: "AK", name: "Alaska",
    stateRate: 0,    combinedRate: 1.76, rank: 46,
    noTax: true, groceryExempt: true,
    localNote: "No statewide sales tax, but boroughs and cities can levy their own — Juneau is around 5%.",
    neighbors: [],
  },
  {
    code: "MT", name: "Montana",
    stateRate: 0,    combinedRate: 0, rank: 47,
    noTax: true, groceryExempt: true,
    localNote: "No sales tax at any level — a rare advantage for large purchases.",
    neighbors: ["idaho", "wyoming", "south-dakota", "north-dakota"],
  },
  {
    code: "OR", name: "Oregon",
    stateRate: 0,    combinedRate: 0, rank: 48,
    noTax: true, groceryExempt: true,
    localNote: "No sales tax at any level. Oregon offsets this with higher income taxes.",
    neighbors: ["washington", "idaho", "nevada", "california"],
  },
  {
    code: "NH", name: "New Hampshire",
    stateRate: 0,    combinedRate: 0, rank: 49,
    noTax: true, groceryExempt: true,
    localNote: "No sales tax. New Hampshire funds services through property taxes instead.",
    neighbors: ["vermont", "maine", "massachusetts"],
  },
  {
    code: "DE", name: "Delaware",
    stateRate: 0,    combinedRate: 0, rank: 50,
    noTax: true, groceryExempt: true,
    localNote: "No sales tax at any level. Delaware is a popular shopping destination for residents of neighboring states.",
    neighbors: ["pennsylvania", "new-jersey", "maryland"],
  },
  // ── Remaining states ──────────────────────────────────────────────────────
  {
    code: "ME", name: "Maine",
    stateRate: 5.5,  combinedRate: 5.5, rank: 51,
    noTax: false, groceryExempt: true,
    localNote: "Maine has no local sales taxes — the rate is a uniform 5.5%.",
    neighbors: ["new-hampshire"],
  },
];

// Build the full dataset with auto-generated slugs
function nameToSlug(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

export const SALES_TAX_RATES: StateSalesTaxData[] = RAW.map((r) => ({
  ...r,
  slug: nameToSlug(r.name),
}));

// ── Lookup helpers ────────────────────────────────────────────────────────────

/** Dropdown options for the calculator engine dropdown input */
export const SALES_TAX_STATE_OPTIONS: { label: string; value: string }[] = [
  { label: "US Average (7.12%)", value: "US Average" },
  ...SALES_TAX_RATES.map((s) => ({
    label: s.noTax && s.combinedRate === 0
      ? `${s.name} — No sales tax`
      : `${s.name} — ${s.combinedRate}%`,
    value: s.name,
  })),
];

/** Fast lookup: state name → combined rate. Falls back to national average. */
export const SALES_TAX_RATE_BY_NAME: Record<string, number> = {
  "US Average": NATIONAL_AVG_SALES_TAX,
  ...Object.fromEntries(SALES_TAX_RATES.map((s) => [s.name, s.combinedRate])),
};
export function getSalesTaxBySlug(slug: string): StateSalesTaxData | null {
  return SALES_TAX_RATES.find((s) => s.slug === slug) ?? null;
}

/** Get state data by 2-letter code (e.g. "CA", "TX"). Case-insensitive. */
export function getSalesTaxByCode(code: string): StateSalesTaxData | null {
  return SALES_TAX_RATES.find((s) => s.code === code.toUpperCase()) ?? null;
}

/** All state slugs — used for generateStaticParams. */
export const ALL_SALES_TAX_SLUGS: string[] = SALES_TAX_RATES.map((s) => s.slug);

/** States sorted by combined rate descending (highest first). */
export const SALES_TAX_BY_RATE: StateSalesTaxData[] = [...SALES_TAX_RATES].sort(
  (a, b) => b.combinedRate - a.combinedRate,
);

/** No-tax states */
export const NO_TAX_STATES: StateSalesTaxData[] = SALES_TAX_RATES.filter((s) => s.noTax);
