// ─── Shared Calculator Core — Projection Helpers ─────────────────────────────
//
// ORIGIN:  Extracted from Worthulator (lib/insights/projections.ts)
// CHANGES: Removed WorthCore dataStore imports. Accepts explicit rate params
//          or falls back to generic defaults. No site-specific dependencies.
// RULES:   Pure functions. Deterministic. SSR-safe. No async.
//
// ─────────────────────────────────────────────────────────────────────────────

// ─── Generic defaults (override by passing explicit params) ───────────────────
const DEFAULT_RETURN_RATE    = 7.0;   // S&P 500 inflation-adjusted long-run avg
const DEFAULT_INFLATION_RATE = 3.2;   // US CPI long-run average

// ─── Future Value ─────────────────────────────────────────────────────────────

/**
 * Future value of regular END-OF-YEAR annual contributions (ordinary annuity).
 *
 * FV = PMT × ( (1 + r)^n − 1 ) / r
 *
 * @example
 *   futureValueAnnuity(5000, 10)      // $5k/yr for 10 years at 7%
 *   futureValueAnnuity(5000, 10, 8)   // same at 8%
 */
export function futureValueAnnuity(
  annualContribution: number,
  years:              number,
  annualReturnRate:   number = DEFAULT_RETURN_RATE,
): number {
  if (annualContribution <= 0 || years <= 0) return 0;
  const r = annualReturnRate / 100;
  if (r === 0) return annualContribution * years;
  return annualContribution * ((Math.pow(1 + r, years) - 1) / r);
}

/**
 * Future value of a daily habit redirected to an investment.
 *
 * @example
 *   opportunityCostDaily(4, 30)    // $4/day coffee habit over 30 years
 */
export function opportunityCostDaily(
  dailyAmount:      number,
  years:            number,
  annualReturnRate: number = DEFAULT_RETURN_RATE,
): number {
  return futureValueAnnuity(dailyAmount * 365, years, annualReturnRate);
}

/**
 * Future value of a lump sum (compound interest).
 *
 * FV = PV × (1 + r)^n
 *
 * @example
 *   futureValueLumpSum(10000, 10)    // $10k invested for 10 years at 7%
 */
export function futureValueLumpSum(
  presentValue:     number,
  years:            number,
  annualReturnRate: number = DEFAULT_RETURN_RATE,
): number {
  if (presentValue <= 0 || years <= 0) return presentValue;
  return presentValue * Math.pow(1 + annualReturnRate / 100, years);
}

/**
 * Inflation-adjusted (real) value of a future cash flow.
 *
 * @example
 *   inflationAdjustedValue(50000, 10)    // $50k in 10 years in today's dollars
 */
export function inflationAdjustedValue(
  nominalValue:  number,
  years:         number,
  inflationRate: number = DEFAULT_INFLATION_RATE,
): number {
  if (years <= 0) return nominalValue;
  return nominalValue / Math.pow(1 + inflationRate / 100, years);
}

/**
 * Years required to grow a lump sum to a target value.
 *
 * @example
 *   yearsToTarget(10000, 1_000_000, 7)   // years to reach $1M from $10k at 7%
 */
export function yearsToTarget(
  presentValue:     number,
  targetValue:      number,
  annualReturnRate: number = DEFAULT_RETURN_RATE,
): number {
  if (presentValue <= 0 || targetValue <= presentValue) return 0;
  const r = annualReturnRate / 100;
  if (r === 0) return Infinity;
  return Math.log(targetValue / presentValue) / Math.log(1 + r);
}

/**
 * Simple payback period — how many years to recover an upfront cost.
 *
 * @example
 *   paybackPeriod(10000, 1800)   // $10k system, $1800/yr savings → 5.6 years
 */
export function paybackPeriod(
  upfrontCost:    number,
  annualSavings:  number,
): number {
  if (annualSavings <= 0) return Infinity;
  return upfrontCost / annualSavings;
}

/**
 * Simple ROI percentage over a period.
 *
 * @example
 *   roiPercent(10000, 18000, 10)   // 10yr gain of $18k on $10k → 80%
 */
export function roiPercent(
  initialCost: number,
  totalReturn: number,
): number {
  if (initialCost <= 0) return 0;
  return ((totalReturn - initialCost) / initialCost) * 100;
}
