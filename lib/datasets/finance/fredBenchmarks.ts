// ─── FRED Macroeconomic Rate Benchmarks ──────────────────────────────────────
//
// PURPOSE:
//   Live US macroeconomic lending/inflation rates used as smart DEFAULTS across
//   the finance calculators (car-loan, debt-payoff, inflation-impact, mortgage,
//   personal-loan, student-loan). Users can always override these in the UI —
//   the dataset provides the current market default so the calculator opens with
//   a real, current number instead of a guess.
//
// DATA SOURCE:
//   St. Louis Fed — FRED (Federal Reserve Economic Data). Refreshed via
//   scripts/updateFredBenchmarks.ts using the free FRED CSV endpoint (no key).
//   Series:
//     autoLoanNew48moAPR   → TERMCBAUTO48NS  (Commercial bank 48-mo new car loan)
//     creditCardAPR        → TERMCBCCALLNS   (Commercial bank credit card plans)
//     personalLoan24moAPR  → TERMCBPER24NS   (Commercial bank 24-mo personal loan)
//     mortgage30yr         → MORTGAGE30US    (Freddie Mac 30-yr fixed)
//     mortgage15yr         → MORTGAGE15US    (Freddie Mac 15-yr fixed)
//     fedFundsRate         → FEDFUNDS        (Effective federal funds rate)
//     cpiInflationYoY      → CPIAUCSL        (CPI-U, computed as YoY % change)
//
//   usedCarPremium is a documented spread over the new-car rate (FRED does not
//   publish a clean used-car APR series). Used APR ≈ new APR + premium.
//
// RULES:
//   ✅ Pure TypeScript — no async, no fetch, no React
//   ✅ SSR-safe; getters never throw
//   ✅ Intentionally mutable — refresh script overwrites values in place
//   ❌ Never import from components/ or app/
//
// ─────────────────────────────────────────────────────────────────────────────

export interface FredBenchmarksDataset {
  /** Commercial bank 48-month new car loan APR (%) */
  autoLoanNew48moAPR: number;
  /** Documented spread (percentage points) added to new-car APR for used cars */
  usedCarPremium: number;
  /** Commercial bank credit card plan APR (%) — accounts assessed interest */
  creditCardAPR: number;
  /** Commercial bank 24-month personal loan APR (%) */
  personalLoan24moAPR: number;
  /** 30-year fixed mortgage rate (%) */
  mortgage30yr: number;
  /** 15-year fixed mortgage rate (%) */
  mortgage15yr: number;
  /** Effective federal funds rate (%) */
  fedFundsRate: number;
  /** CPI-U year-over-year inflation (%) */
  cpiInflationYoY: number;
  /** ISO 8601 date — when these defaults were last verified/refreshed */
  lastUpdated: string;
  /** Human-readable vintage for UI captions, e.g. "Q1 2026" */
  currentPeriodLabel: string;
  version: number;
}

// FRED values as of Q1 2026 (commercial-bank average rates).
export const fredBenchmarks: FredBenchmarksDataset = {
  autoLoanNew48moAPR: 7.4,
  usedCarPremium: 3.4,
  creditCardAPR: 21.0,
  personalLoan24moAPR: 11.4,
  mortgage30yr: 6.5,
  mortgage15yr: 5.8,
  fedFundsRate: 3.6,
  cpiInflationYoY: 4.3,
  lastUpdated: "2026-06-15",
  currentPeriodLabel: "Q2 2026",
  version: 1,
};

/** New-car loan APR (%). */
export function getAutoLoanNewAPR(): number {
  return fredBenchmarks.autoLoanNew48moAPR;
}

/** Used-car loan APR (%) — new-car APR plus the documented used-car premium. */
export function getAutoLoanUsedAPR(): number {
  return (
    Math.round((fredBenchmarks.autoLoanNew48moAPR + fredBenchmarks.usedCarPremium) * 10) /
    10
  );
}

/** Credit card APR (%). */
export function getCreditCardAPR(): number {
  return fredBenchmarks.creditCardAPR;
}

/** CPI-U year-over-year inflation (%). */
export function getCpiInflationYoY(): number {
  return fredBenchmarks.cpiInflationYoY;
}
