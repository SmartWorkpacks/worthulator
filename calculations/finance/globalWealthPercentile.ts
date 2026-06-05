// ─── Global Wealth Percentile — Pure Calculation Module ───────────────────────
//
// PURPOSE:
//   Estimate where a person ranks among the world's adults by NET WORTH and by
//   ANNUAL INCOME, using log-normal approximations of the global distributions
//   calibrated to published anchors (Credit Suisse Global Wealth Report; common
//   global income thresholds). Also returns the implied "top X%" and a daily
//   income figure for the gut-check comparison against the $2.15/day poverty line.
//
//   These are ESTIMATES — precise per-individual global data does not exist — but
//   the calibration reproduces the headline thresholds within a sensible margin.
//
// CALIBRATION (log-normal: percentile = Φ((ln x − μ) / σ)):
//   Wealth — μ = ln(8,654) median, σ = 2.0
//            ⇒ ~90th pct ≈ $112k, ~99th pct ≈ $908k  (vs ~$100k / ~$1M anchors)
//   Income — μ = ln(3,000) median, σ = 1.05
//            ⇒ ~90th pct ≈ $11.4k, ~99th pct ≈ $34k   (common global anchors)
//
// RULES:
//   ✅ Pure TypeScript — synchronous, deterministic, no side effects
//   ❌ Never import React · never call fetch()
//
// ─────────────────────────────────────────────────────────────────────────────

export interface WealthPercentileInputs {
  netWorth:     number;  // $ USD (nominal)
  annualIncome: number;  // $ USD / year (nominal)
}

export interface WealthPercentileResult {
  wealthPercentile: number;   // 0–100
  incomePercentile: number;   // 0–100
  wealthTopPct:     number;   // 100 − wealthPercentile
  incomeTopPct:     number;   // 100 − incomePercentile
  dailyIncome:      number;   // $ / day
  /** Estimated number of adults worldwide with less net worth */
  adultsBelowWealth: number;
  [key: string]: number;
}

const WEALTH_MU = Math.log(8_654);
const WEALTH_SIGMA = 2.0;
const INCOME_MU = Math.log(3_000);
const INCOME_SIGMA = 1.05;
const GLOBAL_ADULTS = 5_400_000_000; // ~5.4B adults

// Abramowitz & Stegun 7.1.26 error-function approximation.
function erf(x: number): number {
  const sign = x < 0 ? -1 : 1;
  const ax = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * ax);
  const y =
    1 -
    (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) *
      t *
      Math.exp(-ax * ax);
  return sign * y;
}

function normalCdf(z: number): number {
  return 0.5 * (1 + erf(z / Math.SQRT2));
}

function percentileFor(value: number, mu: number, sigma: number): number {
  if (value <= 0) return 0;
  const z = (Math.log(value) - mu) / sigma;
  const pct = normalCdf(z) * 100;
  // Clamp away from exactly 0/100 so "top X%" stays meaningful.
  return Math.min(99.99, Math.max(0.01, Math.round(pct * 100) / 100));
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export function calculateGlobalWealthPercentile(
  inputs: WealthPercentileInputs,
): WealthPercentileResult {
  const netWorth     = Number(inputs.netWorth) || 0;        // may be negative (debt)
  const annualIncome = Math.max(0, Number(inputs.annualIncome) || 0);

  const wealthPercentile = percentileFor(netWorth, WEALTH_MU, WEALTH_SIGMA);
  const incomePercentile = percentileFor(annualIncome, INCOME_MU, INCOME_SIGMA);

  return {
    wealthPercentile,
    incomePercentile,
    wealthTopPct:      round2(100 - wealthPercentile),
    incomeTopPct:      round2(100 - incomePercentile),
    dailyIncome:       round2(annualIncome / 365),
    adultsBelowWealth: Math.round((wealthPercentile / 100) * GLOBAL_ADULTS),
  };
}
