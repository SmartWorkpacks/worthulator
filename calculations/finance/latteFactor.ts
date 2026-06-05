// ─── Latte Factor — Pure Calculation Module ───────────────────────────────────
//
// PURPOSE:
//   Growing-annuity compound math for the "latte-factor" calculator.
//   Converts a small daily spend into lifetime opportunity cost, accounting
//   for both investment returns AND annual price inflation on the habit.
//
// RULES:
//   ✅ Pure TypeScript — synchronous, deterministic, no side effects
//   ✅ Every constant documented with a source
//   ❌ Never import React · never call fetch()
//
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Weeks per year used for annualising daily × daysPerWeek.
 * 52 is the standard financial convention (52 × 7 = 364 ≈ 365).
 */
export const WEEKS_PER_YEAR = 52;

// ─── I/O types ────────────────────────────────────────────────────────────────

export interface LatteFactorInputs {
  /** Cost per occurrence ($) */
  dailySpend: number;
  /** How many days per week the habit occurs (1–7) */
  daysPerWeek: number;
  /** Annual price inflation on the habit (%, e.g. 3 = 3%) */
  costGrowth: number;
  /** Expected annual investment return (%, e.g. 7 = 7%) */
  annualReturn: number;
  /** Time horizon in years */
  years: number;
}

export interface LatteFactorResult {
  /** Future value if the annual spend were invested instead */
  investedValue: number;
  /** Total cash spent on the habit over the horizon (with price inflation) */
  totalSpent: number;
  /** investedValue − totalSpent */
  compoundGrowth: number;
  /** (compoundGrowth / investedValue) × 100 */
  growthPct: number;
  /** Annual spend in year 1 */
  annualSpendNow: number;
  /** Annual spend in the final year (inflated) */
  annualSpendFinal: number;
  /** investedValue with the habit cut in half (for delta-card insight) */
  halfHabitInvested: number;
  [key: string]: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Future value of a growing annuity paid at the START of each period.
 * PMT grows at rate `g` each year; invested at rate `r`.
 *
 * FV = PMT × [((1+r)^n − (1+g)^n) / (r − g)]   when r ≠ g
 * FV = PMT × n × (1+r)^(n−1)                     when r ≈ g
 */
function growingAnnuityFV(pmt: number, n: number, r: number, g: number): number {
  if (n <= 0 || pmt <= 0) return 0;
  if (Math.abs(r - g) < 1e-9) {
    return pmt * n * Math.pow(1 + r, n - 1);
  }
  return pmt * ((Math.pow(1 + r, n) - Math.pow(1 + g, n)) / (r - g));
}

/**
 * Total spent with annual price growth: Σ PMT × (1+g)^y for y = 0..n-1
 */
function totalWithGrowth(pmt: number, n: number, g: number): number {
  if (n <= 0 || pmt <= 0) return 0;
  if (Math.abs(g) < 1e-9) return pmt * n;
  return pmt * ((Math.pow(1 + g, n) - 1) / g);
}

// ─── Calculation ──────────────────────────────────────────────────────────────

export function calculateLatteFactor(inputs: LatteFactorInputs): LatteFactorResult {
  const daily = Math.max(0, Number(inputs.dailySpend) || 0);
  const dpw   = Math.max(1, Math.min(7, Math.round(Number(inputs.daysPerWeek) || 5)));
  const g     = Math.max(0, (Number(inputs.costGrowth) || 0)) / 100;
  const r     = Math.max(0, (Number(inputs.annualReturn) || 0)) / 100;
  const n     = Math.max(0, Math.round(Number(inputs.years) || 0));

  const annualSpendNow   = Math.round(daily * dpw * WEEKS_PER_YEAR);
  const annualSpendFinal = n > 0 ? Math.round(annualSpendNow * Math.pow(1 + g, n - 1)) : annualSpendNow;

  const investedValue  = Math.round(growingAnnuityFV(annualSpendNow, n, r, g));
  const totalSpent     = Math.round(totalWithGrowth(annualSpendNow, n, g));
  const compoundGrowth = Math.max(0, investedValue - totalSpent);
  const growthPct      = investedValue > 0 ? Math.round((compoundGrowth / investedValue) * 100) : 0;

  const halfAnnual         = Math.round((daily / 2) * dpw * WEEKS_PER_YEAR);
  const halfHabitInvested  = Math.round(growingAnnuityFV(halfAnnual, n, r, g));

  return {
    investedValue,
    totalSpent,
    compoundGrowth,
    growthPct,
    annualSpendNow,
    annualSpendFinal,
    halfHabitInvested,
  };
}

/**
 * Compute the invested value at a specific year (for projection-line points).
 */
export function latteFactorAtYear(
  annualSpendNow: number,
  year: number,
  r: number,
  g: number,
): number {
  return Math.round(growingAnnuityFV(annualSpendNow, year, r, g));
}
