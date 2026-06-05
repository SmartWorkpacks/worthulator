// ─── Savings Growth calculation module ───────────────────────────────────────
// Pure functions only. Frames compound growth around the question that actually
// matters for a savings account: are you beating inflation? Reuses the shared
// future-value math and layers on the real (after-inflation) return.

import { calculateFutureValue } from "./futureValue";

export interface SavingsGrowthInputs {
  /** Starting balance ($, ≥ 0) */
  initial: number;
  /** Monthly deposit ($, ≥ 0) */
  monthly: number;
  /** Account APY (%) */
  rate: number;
  /** Years saving */
  years: number;
}

export interface SavingsGrowthData {
  /** Live annual inflation rate (%), injected from FRED CPI. */
  annualInflationPct: number;
}

export interface SavingsGrowthResult {
  [key: string]: number;
  /** Nominal balance at the horizon */
  balance: number;
  /** Initial + all deposits */
  totalDeposited: number;
  /** Interest earned on balance + deposits */
  interestEarned: number;
  /** Balance in today's purchasing power */
  realBalance: number;
  /** Nominal − real: value lost to inflation */
  inflationLoss: number;
  /** Share of the balance that is interest (%) */
  interestSharePct: number;
  /** Real return = APY − inflation (percentage points) */
  realReturnPct: number;
  /** 1 if the APY beats inflation, else 0 */
  beatsInflation: number;
  /** Extra interest vs a typical 0.45% legacy bank account over the horizon */
  hysaAdvantage: number;
}

/** Documented benchmark: FDIC national average savings rate ≈ 0.45% APY (2026). */
export const LEGACY_BANK_APY = 0.45;

const round1 = (v: number) => Math.round(v * 10) / 10;

export function calculateSavingsGrowth(
  inputs: SavingsGrowthInputs,
  data: SavingsGrowthData,
): SavingsGrowthResult {
  const fv = calculateFutureValue(
    { initial: inputs.initial, monthly: inputs.monthly, rate: inputs.rate, years: inputs.years },
    data,
  );

  if (fv.futureValue <= 0 && fv.totalInvested <= 0) {
    return {
      balance: 0, totalDeposited: 0, interestEarned: 0, realBalance: 0, inflationLoss: 0,
      interestSharePct: 0, realReturnPct: 0, beatsInflation: 0, hysaAdvantage: 0,
    };
  }

  const realReturnPct = round1(Number(inputs.rate) - Number(data.annualInflationPct));

  // Interest a legacy 0.45% account would earn on the same deposits, for contrast.
  const legacy = calculateFutureValue(
    { initial: inputs.initial, monthly: inputs.monthly, rate: LEGACY_BANK_APY, years: inputs.years },
    data,
  );
  const hysaAdvantage = Math.max(0, fv.totalInterest - legacy.totalInterest);

  return {
    balance: fv.futureValue,
    totalDeposited: fv.totalInvested,
    interestEarned: fv.totalInterest,
    realBalance: fv.realFutureValue,
    inflationLoss: fv.inflationLoss,
    interestSharePct: fv.interestSharePct,
    realReturnPct,
    beatsInflation: realReturnPct > 0 ? 1 : 0,
    hysaAdvantage: Math.round(hysaAdvantage),
  };
}
