// ─── DRIP (Dividend Reinvestment) calculation module ────────────────────────
// Pure functions only. Properly separates the two engines of total return —
// price appreciation and reinvested dividends — so the calculator can show the
// thing that actually defines DRIP: how much *more* you end up with by
// reinvesting dividends versus taking them as cash. Real value via injected CPI.

export interface DripCalcInputs {
  /** Initial lump sum ($) */
  initial: number;
  /** Monthly contribution ($) */
  monthlyAdd: number;
  /** Annual dividend yield (%) */
  dividendYield: number;
  /** Annual price appreciation (%) */
  priceGrowth: number;
  /** Years invested */
  years: number;
}

export interface DripCalcData {
  /** Live annual inflation rate (%), injected from FRED CPI. */
  annualInflationPct: number;
}

export interface DripCalcResult {
  [key: string]: number;
  /** Final portfolio value with dividends reinvested */
  finalValue: number;
  /** Initial + all monthly contributions */
  totalContributed: number;
  /** Final value − contributions */
  totalGain: number;
  /** finalValue / totalContributed */
  returnMultiple: number;
  /** Total dividends reinvested over the horizon */
  reinvestedDividends: number;
  /** Annual dividend income the portfolio throws off in the final year */
  annualDividendAtEnd: number;
  /** Final value if dividends were taken as (uninvested) cash instead */
  noReinvestValue: number;
  /** finalValue − noReinvestValue: the DRIP advantage */
  dripAdvantage: number;
  /** Years to double at the combined return (rule of 72) */
  doubleTimeYears: number;
  /** Final value in today's purchasing power */
  realValue: number;
}

export function calculateDrip(inputs: DripCalcInputs, data: DripCalcData): DripCalcResult {
  const { initial, monthlyAdd, dividendYield, priceGrowth, years } = inputs;
  const months = Math.round(years * 12);
  const gp = priceGrowth / 100 / 12;       // monthly price growth
  const dy = dividendYield / 100 / 12;      // monthly dividend yield

  let value = initial;            // DRIP path
  let reinvestedDividends = 0;
  let priceOnly = initial;        // no-reinvest path (price growth only)
  let cashDividends = 0;          // dividends taken as cash, left uninvested

  for (let m = 0; m < months; m++) {
    // DRIP: dividend computed on current value, then reinvested alongside price growth + contribution.
    const div = value * dy;
    reinvestedDividends += div;
    value = value * (1 + gp) + div + monthlyAdd;

    // No-reinvest: dividend paid out as cash (not compounding); shares grow on price only.
    cashDividends += priceOnly * dy;
    priceOnly = priceOnly * (1 + gp) + monthlyAdd;
  }

  const finalValue = Math.round(value);
  const totalContributed = Math.round(initial + monthlyAdd * months);
  const totalGain = finalValue - totalContributed;
  const returnMultiple = totalContributed > 0 ? Math.round((finalValue / totalContributed) * 100) / 100 : 0;
  const annualDividendAtEnd = Math.round(value * (dividendYield / 100));
  const noReinvestValue = Math.round(priceOnly + cashDividends);
  const dripAdvantage = Math.max(0, finalValue - noReinvestValue);
  const combined = dividendYield + priceGrowth;
  const doubleTimeYears = combined > 0 ? Math.round((72 / combined) * 10) / 10 : 0;
  const realValue = Math.round(value / Math.pow(1 + Math.max(0, data.annualInflationPct) / 100, years));

  return {
    finalValue,
    totalContributed,
    totalGain,
    returnMultiple,
    reinvestedDividends: Math.round(reinvestedDividends),
    annualDividendAtEnd,
    noReinvestValue,
    dripAdvantage,
    doubleTimeYears,
    realValue,
  };
}
