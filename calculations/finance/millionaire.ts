/**
 * Millionaire Calculator — pure logic module
 *
 * Formula:
 *   Simulate month-by-month compound growth until balance ≥ $1,000,000.
 *   balance(m+1) = balance(m) × (1 + r/12) + monthlyContribution
 *
 * Live layer:
 *   Injects the live FRED CPI rate to answer "but what will $1M be worth?" —
 *   the real (today's-dollars) value of the million at the moment you hit it,
 *   and the extra time needed to accumulate a *real* (inflation-adjusted) million.
 *
 * Sources:
 *   - S&P 500 inflation-adjusted long-run avg: ~7% (Vanguard / Morningstar)
 *   - Target: $1,000,000 nominal
 */

export interface MillionaireInputs {
  currentSavings: number; // $ already invested
  monthlySavings: number; // $ contributed each month
  annualReturn:   number; // % e.g. 7
}

export interface MillionaireData {
  /** Live annual inflation rate (%), injected from FRED CPI. */
  annualInflationPct: number;
}

export interface MillionaireResult {
  yearsToMillion:     number; // 0.1-yr precision; 100 = effectively never
  totalContributed:   number; // savings + contrib × months
  interestEarned:     number; // final balance − totalContributed
  marketShare:        number; // interestEarned / 1_000_000 × 100  (% done by the market)
  marketContribPct:   number; // alias of marketShare for the insight layer
  progressPercent:    number; // currentSavings / 1_000_000 × 100
  yearsFasterWith200: number; // years sooner with +$200/mo
  realValueAtMillion: number; // what $1M buys in today's money when you hit it
  yearsToRealMillion: number; // years to accumulate a real (today's-$) million
  extraYearsForReal:  number; // yearsToRealMillion − yearsToMillion
  [key: string]: number;
}

const TARGET = 1_000_000;
const CAP_MONTHS = 1200; // 100 years

/** Months until a fixed nominal target is reached (CAP_MONTHS = never). */
function monthsToTarget(current: number, monthly: number, monthlyRate: number, target: number): number {
  let balance = Math.max(0, current);
  let months = 0;
  while (balance < target && months < CAP_MONTHS) {
    balance = balance * (1 + monthlyRate) + Math.max(0, monthly);
    months++;
  }
  return months;
}

export function calculateMillionaire(
  inputs: MillionaireInputs,
  data: MillionaireData = { annualInflationPct: 3.2 },
): MillionaireResult {
  const { currentSavings, monthlySavings, annualReturn } = inputs;
  const infl = Math.max(0, data.annualInflationPct) / 100;

  const r = Math.max(0, annualReturn) / 100 / 12;

  // Nominal $1M.
  const months = monthsToTarget(currentSavings, monthlySavings, r, TARGET);
  const reached = months < CAP_MONTHS;
  const yearsToMillion = reached ? Math.round((months / 12) * 10) / 10 : 100;

  const totalContributed = Math.max(0, currentSavings) + Math.max(0, monthlySavings) * months;
  const balanceAtEnd = reached ? TARGET : 0;
  const interestEarned = Math.max(0, Math.min(balanceAtEnd, TARGET) - totalContributed);
  const marketShare = Math.max(0, Math.round((interestEarned / TARGET) * 1000) / 10);

  // +$200/mo accelerator.
  const monthsFaster = monthsToTarget(currentSavings, monthlySavings + 200, r, TARGET);
  const yearsFasterWith200 =
    reached && monthsFaster < CAP_MONTHS
      ? Math.max(0, Math.round(((months - monthsFaster) / 12) * 10) / 10)
      : 0;

  // Real value of the nominal million when reached.
  const realValueAtMillion = reached
    ? Math.round(TARGET / Math.pow(1 + infl, months / 12))
    : 0;

  // Real million: simulate against an inflation-growing target.
  let balance = Math.max(0, currentSavings);
  let rm = 0;
  while (rm < CAP_MONTHS) {
    const target = TARGET * Math.pow(1 + infl, rm / 12);
    if (balance >= target) break;
    balance = balance * (1 + r) + Math.max(0, monthlySavings);
    rm++;
  }
  const realReached = rm < CAP_MONTHS;
  const yearsToRealMillion = realReached ? Math.round((rm / 12) * 10) / 10 : 100;
  const extraYearsForReal = realReached && reached
    ? Math.max(0, Math.round((yearsToRealMillion - yearsToMillion) * 10) / 10)
    : 0;

  return {
    yearsToMillion,
    totalContributed: Math.round(totalContributed),
    interestEarned: Math.round(interestEarned),
    marketShare,
    marketContribPct: marketShare,
    progressPercent: Math.round((Math.max(0, currentSavings) / TARGET) * 1000) / 10,
    yearsFasterWith200,
    realValueAtMillion,
    yearsToRealMillion,
    extraYearsForReal,
  };
}
