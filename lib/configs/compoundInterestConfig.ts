// ─── Compound Interest Calculator Config ────────────────────────────────────

export interface CompoundInterestConfig {
  defaults: {
    principal: number;          // $10,000
    monthlyContribution: number; // $200
    annualRatePct: number;       // 7%
    years: number;               // 20
  };
  compoundingOptions: { label: string; periodsPerYear: number }[];
  ratePresets: { label: string; rate: number; description: string }[];
}

export const compoundInterestConfig: CompoundInterestConfig = {
  defaults: {
    principal: 10000,
    monthlyContribution: 200,
    annualRatePct: 7,
    years: 20,
  },
  compoundingOptions: [
    { label: "Monthly",    periodsPerYear: 12 },
    { label: "Quarterly",  periodsPerYear: 4  },
    { label: "Annually",   periodsPerYear: 1  },
  ],
  ratePresets: [
    { label: "Conservative",  rate: 4,  description: "Bonds / balanced fund" },
    { label: "Moderate",      rate: 7,  description: "S&P 500 historical avg" },
    { label: "Aggressive",    rate: 10, description: "Growth stocks (higher risk)" },
  ],
};

// ─── Types ───────────────────────────────────────────────────────────────────

export interface GrowthRow {
  year: number;
  balance: number;
  totalContributions: number;
  totalInterest: number;
  /** Contributions added this year (principal + monthly × 12) — 0 in year 0 */
  yearlyContribution: number;
  /** Interest earned this year */
  yearlyInterest: number;
}

export interface CompoundResult {
  finalBalance: number;
  totalContributions: number;
  totalInterest: number;
  /** Year-by-year breakdown, index 0 = start (year 0) */
  schedule: GrowthRow[];
}

// ─── Pure calculation functions ───────────────────────────────────────────────

/**
 * Build a year-by-year compound growth schedule.
 *
 * @param principal            Starting lump sum
 * @param monthlyContribution  Fixed monthly addition
 * @param annualRatePct        Annual interest rate as a percentage (e.g. 7 for 7%)
 * @param years                Investment horizon in years
 * @param periodsPerYear       Compounding frequency (12 = monthly, 4 = quarterly, 1 = annual)
 */
export function buildCompoundSchedule(
  principal: number,
  monthlyContribution: number,
  annualRatePct: number,
  years: number,
  periodsPerYear: number = 12,
): CompoundResult {
  const r = annualRatePct / 100 / periodsPerYear; // rate per period
  const monthlyPerPeriod = periodsPerYear === 12
    ? monthlyContribution                                     // monthly → 1 deposit/period
    : monthlyContribution * 12 / periodsPerYear;             // rescale to deposit per period

  const schedule: GrowthRow[] = [];

  // Year 0 — starting state
  schedule.push({
    year: 0,
    balance: principal,
    totalContributions: principal,
    totalInterest: 0,
    yearlyContribution: principal,
    yearlyInterest: 0,
  });

  let balance = principal;
  let totalContributions = principal;

  for (let y = 1; y <= years; y++) {
    const periodsThisYear = periodsPerYear;
    const balanceAtStart = balance;
    const contribThisYear = monthlyPerPeriod * periodsThisYear;

    // Compound each period within the year
    for (let p = 0; p < periodsThisYear; p++) {
      balance = balance * (1 + r) + monthlyPerPeriod;
    }

    totalContributions += contribThisYear;
    const totalInterest = balance - totalContributions;
    const yearlyInterest = balance - balanceAtStart - contribThisYear;

    schedule.push({
      year: y,
      balance,
      totalContributions,
      totalInterest,
      yearlyContribution: contribThisYear,
      yearlyInterest: Math.max(0, yearlyInterest),
    });
  }

  const last = schedule[schedule.length - 1];
  return {
    finalBalance: last.balance,
    totalContributions: last.totalContributions,
    totalInterest: last.totalInterest,
    schedule,
  };
}

/**
 * Quick helper — final balance only (no schedule).
 * Uses the closed-form annuity formula for monthly compounding.
 */
export function calcFinalBalance(
  principal: number,
  monthlyContribution: number,
  annualRatePct: number,
  years: number,
): number {
  if (annualRatePct === 0) {
    return principal + monthlyContribution * 12 * years;
  }
  const rm = annualRatePct / 100 / 12;
  const n = years * 12;
  const fv = principal * Math.pow(1 + rm, n) + monthlyContribution * ((Math.pow(1 + rm, n) - 1) / rm);
  return fv;
}

// ─── Phase 2: Advanced calculation functions ─────────────────────────────────

export interface AdvancedCompoundResult extends CompoundResult {
  /** Final monthly contribution — equals monthlyContribution when contributionGrowthPct = 0 */
  finalMonthlyContribution: number;
}

/**
 * Extended schedule with optional annual contribution growth.
 * When contributionGrowthPct = 0, results are identical to buildCompoundSchedule.
 */
export function buildCompoundScheduleAdvanced(
  principal: number,
  monthlyContribution: number,
  annualRatePct: number,
  years: number,
  periodsPerYear: number = 12,
  contributionGrowthPct: number = 0,
): AdvancedCompoundResult {
  const r = annualRatePct / 100 / periodsPerYear;
  const schedule: GrowthRow[] = [];

  schedule.push({
    year: 0,
    balance: principal,
    totalContributions: principal,
    totalInterest: 0,
    yearlyContribution: principal,
    yearlyInterest: 0,
  });

  let balance = principal;
  let totalContributions = principal;
  let currentMonthly = monthlyContribution;

  for (let y = 1; y <= years; y++) {
    if (y > 1 && contributionGrowthPct > 0) {
      currentMonthly = currentMonthly * (1 + contributionGrowthPct / 100);
    }
    const contribPerPeriod =
      periodsPerYear === 12 ? currentMonthly : (currentMonthly * 12) / periodsPerYear;
    const balanceAtStart = balance;
    const contribThisYear = contribPerPeriod * periodsPerYear;

    for (let p = 0; p < periodsPerYear; p++) {
      balance = balance * (1 + r) + contribPerPeriod;
    }

    totalContributions += contribThisYear;
    const totalInterest = balance - totalContributions;
    const yearlyInterest = balance - balanceAtStart - contribThisYear;

    schedule.push({
      year: y,
      balance,
      totalContributions,
      totalInterest,
      yearlyContribution: contribThisYear,
      yearlyInterest: Math.max(0, yearlyInterest),
    });
  }

  const last = schedule[schedule.length - 1];
  return {
    finalBalance: last.balance,
    totalContributions: last.totalContributions,
    totalInterest: last.totalInterest,
    schedule,
    finalMonthlyContribution: currentMonthly,
  };
}

/**
 * Deflate a future nominal value to today's purchasing power.
 */
export function adjustForInflation(
  nominalValue: number,
  inflationPct: number,
  years: number,
): { realValue: number; inflationDrag: number } {
  if (inflationPct <= 0 || years <= 0) {
    return { realValue: nominalValue, inflationDrag: 0 };
  }
  const realValue = nominalValue / Math.pow(1 + inflationPct / 100, years);
  return { realValue, inflationDrag: nominalValue - realValue };
}

/**
 * Apply a flat tax rate to investment gains (interest only — not contributions).
 */
export function calcAfterTax(
  finalBalance: number,
  totalContributions: number,
  taxRatePct: number,
): { afterTaxBalance: number; taxPaid: number } {
  const interest = Math.max(0, finalBalance - totalContributions);
  const taxPaid = interest * (taxRatePct / 100);
  return { afterTaxBalance: finalBalance - taxPaid, taxPaid };
}
