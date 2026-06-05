// ─── Future Value calculation module ─────────────────────────────────────────
// Pure functions only. No UI, no data fetching, no module-level state.
// Compound growth of an initial lump sum plus fixed monthly contributions,
// with a live-inflation layer that deflates the nominal result into today's
// dollars (real future value) for an honest, "what it actually buys" answer.

// ── Documented constants ─────────────────────────────────────────────────────

/**
 * Long-run nominal total return of the S&P 500 including reinvested dividends
 * (~10%/yr, 1926–2024, per official index data). Used only as a benchmark in
 * insights — never as a silent default.
 */
export const SP500_LONGRUN_NOMINAL_RETURN = 10;

/**
 * Long-run US CPI inflation average (~3.3%/yr, 1914–2024, BLS). Fallback only;
 * the live FRED CPI is injected via the `data` arg.
 */
export const LONGRUN_CPI_AVERAGE = 3.3;

// ── Types ─────────────────────────────────────────────────────────────────────

export interface FutureValueInputs {
  /** Starting lump sum ($, ≥ 0) */
  initial: number;
  /** Fixed monthly contribution ($, ≥ 0) */
  monthly: number;
  /** Annual nominal return rate (%) */
  rate: number;
  /** Time horizon in years */
  years: number;
}

export interface FutureValueData {
  /** Live annual inflation rate (%), injected from FRED CPI. */
  annualInflationPct: number;
}

export interface FutureValueResult {
  [key: string]: number;
  /** Nominal balance at the horizon */
  futureValue: number;
  /** Initial + all contributions (the money you actually put in) */
  totalInvested: number;
  /** Sum of monthly contributions only (excludes the initial lump) */
  totalContributions: number;
  /** Compound growth on top of what you invested */
  totalInterest: number;
  /** Future value expressed in today's purchasing power */
  realFutureValue: number;
  /** Nominal − real: purchasing power lost to inflation */
  inflationLoss: number;
  /** Share of the final balance that is pure compounding (%) */
  interestSharePct: number;
  /** Final balance ÷ total invested (e.g. 2.3 = your money 2.3×'d) */
  growthMultiple: number;
  /** Interest earned in the final 12 months — shows late-stage compounding power */
  finalYearInterest: number;
  /** Years for the balance to double at this rate (rule-of-72 exact) */
  doublingYears: number;
}

const EMPTY: FutureValueResult = {
  futureValue: 0, totalInvested: 0, totalContributions: 0, totalInterest: 0,
  realFutureValue: 0, inflationLoss: 0, interestSharePct: 0, growthMultiple: 0,
  finalYearInterest: 0, doublingYears: 0,
};

/** Balance after `months` of monthly compounding. */
function balanceAfter(initial: number, monthly: number, rMonthly: number, months: number): number {
  if (months <= 0) return initial;
  if (rMonthly === 0) return initial + monthly * months;
  const pow = Math.pow(1 + rMonthly, months);
  return initial * pow + monthly * ((pow - 1) / rMonthly);
}

/**
 * Future value of an initial lump sum plus fixed monthly contributions,
 * compounded monthly (contributions at period end).
 *
 *   FV = P(1+r)^n + C · ((1+r)^n − 1) / r      (r = annualRate/12, n = years·12)
 *
 * The real (inflation-adjusted) value deflates FV by the live annual inflation
 * rate over the horizon: realFV = FV / (1 + infl)^years.
 */
export function calculateFutureValue(
  inputs: FutureValueInputs,
  data: FutureValueData,
): FutureValueResult {
  const initial = Number(inputs.initial);
  const monthly = Number(inputs.monthly);
  const annualRate = Number(inputs.rate);
  const years = Number(inputs.years);
  const inflPct = Number(data.annualInflationPct);

  if (
    !isFinite(initial) || !isFinite(monthly) || !isFinite(annualRate) ||
    !isFinite(years) || years < 0 || initial < 0 || monthly < 0
  ) {
    return { ...EMPTY };
  }

  const r = annualRate / 100 / 12;
  const n = Math.round(years * 12);

  const fv = balanceAfter(initial, monthly, r, n);
  const totalContributions = monthly * n;
  const totalInvested = initial + totalContributions;
  const totalInterest = Math.max(0, fv - totalInvested);

  const infl = (isFinite(inflPct) ? inflPct : LONGRUN_CPI_AVERAGE) / 100;
  const realFutureValue = years > 0 ? fv / Math.pow(1 + infl, years) : fv;
  const inflationLoss = Math.max(0, fv - realFutureValue);

  const interestSharePct = fv > 0 ? (totalInterest / fv) * 100 : 0;
  const growthMultiple = totalInvested > 0 ? fv / totalInvested : 0;

  const finalYearInterest =
    n >= 12 ? Math.max(0, fv - balanceAfter(initial, monthly, r, n - 12) - monthly * 12) : totalInterest;

  // Exact doubling time for the lump at this rate (continuous-ish, monthly basis)
  const doublingYears = r > 0 ? Math.log(2) / Math.log(1 + r) / 12 : Infinity;

  return {
    futureValue: Math.round(fv),
    totalInvested: Math.round(totalInvested),
    totalContributions: Math.round(totalContributions),
    totalInterest: Math.round(totalInterest),
    realFutureValue: Math.round(realFutureValue),
    inflationLoss: Math.round(inflationLoss),
    interestSharePct: Math.round(interestSharePct * 10) / 10,
    growthMultiple: Math.round(growthMultiple * 100) / 100,
    finalYearInterest: Math.round(finalYearInterest),
    doublingYears: isFinite(doublingYears) ? Math.round(doublingYears * 10) / 10 : 0,
  };
}
