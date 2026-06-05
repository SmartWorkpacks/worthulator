// ─── Vaping Cost — Pure Calculation Module ────────────────────────────────────
//
// PURPOSE:
//   Calculate the annual cost of vaping, investment opportunity cost, savings
//   from cutting daily spend, and a comparison to cigarette smoking.
//
// RULES:
//   ✅ Pure TypeScript — synchronous, deterministic, no side effects
//   ❌ Never import React · never call fetch()
//
// ─────────────────────────────────────────────────────────────────────────────

const RETURN_RATE = 0.07;

/** National average pack cost for comparison ($10/pack, 1 pack/day) */
export const SMOKING_DAILY_COST = 10;

// ─── I/O types ────────────────────────────────────────────────────────────────

export interface VapingCostInputs {
  dailyCost:  number;
  cutDailyBy: number;
}

export interface VapingCostResult {
  yearlyCost:        number;
  monthlyCost:       number;
  tenYearCost:       number;
  dailyCostEcho:     number;
  investedValue10yr: number;
  investedValue20yr: number;
  cutYearlySaving:   number;
  cutInvested10yr:   number;
  reducedYearlyCost: number;
  /** Smoking annual cost for comparison (1 pack/day at $10) */
  smokingAnnual:     number;
  /** Positive = vaping is cheaper than smoking by this amount */
  vsSmokingDiff:     number;
  [key: string]: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const round2 = (n: number) => Math.round(n * 100) / 100;

function fvAnnuity(annual: number, years: number): number {
  if (annual <= 0 || years <= 0) return 0;
  return annual * ((Math.pow(1 + RETURN_RATE, years) - 1) / RETURN_RATE);
}

// ─── Calculation ──────────────────────────────────────────────────────────────

export function calculateVapingCost(inputs: VapingCostInputs): VapingCostResult {
  const daily = Math.max(0, Number(inputs.dailyCost) || 0);
  const cut   = Math.min(daily, Math.max(0, Number(inputs.cutDailyBy) || 0));

  const yearlyCost  = round2(daily * 365);
  const monthlyCost = round2(yearlyCost / 12);
  const tenYearCost = round2(yearlyCost * 10);

  const investedValue10yr = Math.round(fvAnnuity(yearlyCost, 10));
  const investedValue20yr = Math.round(fvAnnuity(yearlyCost, 20));

  const cutYearlySaving   = round2(cut * 365);
  const cutInvested10yr   = Math.round(fvAnnuity(cutYearlySaving, 10));
  const reducedYearlyCost = round2(yearlyCost - cutYearlySaving);

  const smokingAnnual = round2(SMOKING_DAILY_COST * 365);
  const vsSmokingDiff = round2(smokingAnnual - yearlyCost);

  return {
    yearlyCost,
    monthlyCost,
    tenYearCost,
    dailyCostEcho: round2(daily),
    investedValue10yr,
    investedValue20yr,
    cutYearlySaving,
    cutInvested10yr,
    reducedYearlyCost,
    smokingAnnual,
    vsSmokingDiff,
  };
}
