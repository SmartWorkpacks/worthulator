/**
 * ─── Savings Calculator Engine ───────────────────────────────────────────────
 * Calculates future savings with compound interest.
 * Supports monthly, quarterly, semi-annual, and annual compounding.
 */

export type CompoundFrequency = "monthly" | "quarterly" | "semi-annual" | "annual";

export interface SavingsInput {
  initialBalance: number;   // Starting savings amount
  monthlyContribution: number;
  annualRate: number;       // As a percentage, e.g. 4.5
  years: number;
  compoundFrequency?: CompoundFrequency;
}

export interface SavingsResult {
  finalBalance: number;
  totalContributions: number;  // monthly × months (excludes initial)
  totalInterest: number;
  totalDeposited: number;      // initial + totalContributions
  growthMultiplier: number;    // finalBalance / totalDeposited
}

const PERIODS: Record<CompoundFrequency, number> = {
  monthly:     12,
  quarterly:    4,
  "semi-annual": 2,
  annual:        1,
};

export function calculateSavings({
  initialBalance,
  monthlyContribution,
  annualRate,
  years,
  compoundFrequency = "monthly",
}: SavingsInput): SavingsResult {
  const n = PERIODS[compoundFrequency];   // compounds per year
  const r = annualRate / 100 / n;         // rate per compound period
  const t = years * n;                    // total compound periods

  // Monthly contributions converted to per-period
  // (each compound period = 12/n months)
  const periodicContribution = monthlyContribution * (12 / n);

  let finalBalance: number;

  if (r === 0) {
    finalBalance = initialBalance + periodicContribution * t;
  } else {
    // FV of initial lump sum
    const fvLump = initialBalance * Math.pow(1 + r, t);
    // FV of regular periodic contributions (annuity)
    const fvAnnuity = periodicContribution * ((Math.pow(1 + r, t) - 1) / r);
    finalBalance = fvLump + fvAnnuity;
  }

  const totalContributions = monthlyContribution * years * 12;
  const totalDeposited = initialBalance + totalContributions;
  const totalInterest = finalBalance - totalDeposited;
  const growthMultiplier = totalDeposited > 0 ? finalBalance / totalDeposited : 1;

  return {
    finalBalance:        Math.round(finalBalance),
    totalContributions:  Math.round(totalContributions),
    totalInterest:       Math.round(Math.max(0, totalInterest)),
    totalDeposited:      Math.round(totalDeposited),
    growthMultiplier:    Math.round(growthMultiplier * 10) / 10,
  };
}

/** Returns savings balance at a specific year milestone */
export function balanceAtYear(input: SavingsInput, year: number): number {
  return calculateSavings({ ...input, years: year }).finalBalance;
}
