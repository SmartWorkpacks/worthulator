// ─── 401(k) projection calculation module ────────────────────────────────────
// Pure functions only. Models a 401(k) the way it actually works: percent-of-
// salary employee deferrals, an employer match capped at a % of salary, the IRS
// elective-deferral limit, annual raises, and monthly compounding. Surfaces the
// "free money left on the table" when you contribute below the full match.

/** IRS 401(k) employee elective-deferral limit (under-50), 2026. */
export const EMPLOYEE_DEFERRAL_LIMIT_2026 = 24_500;

export interface Retirement401kInputs {
  /** Current 401(k) balance ($) */
  currentBalance: number;
  /** Annual gross salary ($) */
  salary: number;
  /** Employee contribution as % of salary */
  contributionPct: number;
  /** Employer match rate — cents matched per $1 you contribute, as % (e.g. 50 = $0.50/$1) */
  employerMatchPct: number;
  /** Employer matches only up to this % of salary */
  matchLimitPct: number;
  /** Expected annual return (%) */
  rate: number;
  /** Years until retirement */
  years: number;
  /** Expected annual salary growth (%) */
  annualRaisePct: number;
}

export interface Retirement401kData {
  /** Live annual inflation rate (%), injected from FRED CPI. */
  annualInflationPct: number;
}

export interface Retirement401kResult {
  [key: string]: number;
  /** Projected balance at retirement */
  balance: number;
  /** Total employee contributions */
  yourContributions: number;
  /** Total employer match received */
  employerMatch: number;
  /** Investment growth (balance − current − contributions − match) */
  growth: number;
  /** Balance in today's purchasing power */
  realBalance: number;
  /** Employer match received in year 1 (annual free money) */
  firstYearMatch: number;
  /** Total employer match forgone by contributing below the match cap */
  matchLeftOnTable: number;
  /** 1 if you're capturing the full employer match, else 0 */
  fullMatchCaptured: number;
}

const round = (v: number) => Math.round(v);

export function calculate401k(
  inputs: Retirement401kInputs,
  data: Retirement401kData,
): Retirement401kResult {
  const {
    currentBalance, salary, contributionPct, employerMatchPct,
    matchLimitPct, rate, years, annualRaisePct,
  } = inputs;

  if (years <= 0 || salary <= 0) {
    return {
      balance: round(currentBalance), yourContributions: 0, employerMatch: 0, growth: 0,
      realBalance: round(currentBalance), firstYearMatch: 0, matchLeftOnTable: 0,
      fullMatchCaptured: contributionPct >= matchLimitPct ? 1 : 0,
    };
  }

  const monthlyRate = rate / 100 / 12;
  const months = Math.round(years * 12);

  let bal = currentBalance;
  let curSalary = salary;
  let totalEmployee = 0;
  let totalMatch = 0;
  let totalUnclaimed = 0;
  let firstYearMatch = 0;

  for (let m = 0; m < months; m++) {
    if (m > 0 && m % 12 === 0) curSalary *= 1 + annualRaisePct / 100;

    // Employee deferral, capped by the IRS annual limit.
    const annualEmployee = Math.min(
      curSalary * (contributionPct / 100),
      EMPLOYEE_DEFERRAL_LIMIT_2026,
    );
    const monthlyEmployee = annualEmployee / 12;

    // Employer match: on the lesser of what you contribute and the cap.
    const matchedBasePct = Math.min(contributionPct, matchLimitPct);
    const annualMatch = curSalary * (matchedBasePct / 100) * (employerMatchPct / 100);
    const monthlyMatch = annualMatch / 12;

    // Match you forfeit by under-contributing relative to the cap.
    const unclaimedPct = Math.max(0, matchLimitPct - contributionPct);
    const annualUnclaimed = curSalary * (unclaimedPct / 100) * (employerMatchPct / 100);

    bal = bal * (1 + monthlyRate) + monthlyEmployee + monthlyMatch;
    totalEmployee += monthlyEmployee;
    totalMatch += monthlyMatch;
    totalUnclaimed += annualUnclaimed / 12;
    if (m < 12) firstYearMatch += monthlyMatch;
  }

  const balance = round(bal);
  const yourContributions = round(totalEmployee);
  const employerMatch = round(totalMatch);
  const growth = Math.max(0, balance - round(currentBalance) - yourContributions - employerMatch);
  const realBalance = round(bal / Math.pow(1 + data.annualInflationPct / 100, years));

  return {
    balance,
    yourContributions,
    employerMatch,
    growth,
    realBalance,
    firstYearMatch: round(firstYearMatch),
    matchLeftOnTable: round(totalUnclaimed),
    fullMatchCaptured: contributionPct >= matchLimitPct ? 1 : 0,
  };
}
