// ─── Alcohol Cost — Pure Calculation Module ───────────────────────────────────
//
// PURPOSE:
//   Calculate the annual cost of a drinking habit, the investment opportunity
//   cost, and the savings from cutting a few drinks per week.
//
// RULES:
//   ✅ Pure TypeScript — synchronous, deterministic, no side effects
//   ❌ Never import React · never call fetch()
//
// ─────────────────────────────────────────────────────────────────────────────

const RETURN_RATE = 0.07;
const WEEKS_PER_YEAR = 52;

// ─── I/O types ────────────────────────────────────────────────────────────────

export interface AlcoholCostInputs {
  drinksPerWeek:  number;
  costPerDrink:   number;
  reduceDrinksBy: number;
}

export interface AlcoholCostResult {
  weeklySpend:       number;
  yearlyCost:        number;
  monthlyCost:       number;
  tenYearCost:       number;
  investedValue10yr: number;
  investedValue20yr: number;
  /** Annual saving from cutting drinks */
  cutYearlySaving:   number;
  /** 10-year invested value of the cut saving */
  cutInvested10yr:   number;
  /** Yearly cost after cutting */
  reducedYearlyCost: number;
  /** Daily equivalent spend */
  dailyCost:         number;
  [key: string]: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const round2 = (n: number) => Math.round(n * 100) / 100;

function fvAnnuity(annual: number, years: number): number {
  if (annual <= 0 || years <= 0) return 0;
  return annual * ((Math.pow(1 + RETURN_RATE, years) - 1) / RETURN_RATE);
}

// ─── Calculation ──────────────────────────────────────────────────────────────

export function calculateAlcoholCost(inputs: AlcoholCostInputs): AlcoholCostResult {
  const drinks = Math.max(0, Math.round(Number(inputs.drinksPerWeek) || 0));
  const cost   = Math.max(0, Number(inputs.costPerDrink) || 0);
  const cut    = Math.min(drinks, Math.max(0, Math.round(Number(inputs.reduceDrinksBy) || 0)));

  const weeklySpend = round2(drinks * cost);
  const yearlyCost  = round2(weeklySpend * WEEKS_PER_YEAR);
  const monthlyCost = round2(yearlyCost / 12);
  const tenYearCost = round2(yearlyCost * 10);
  const dailyCost   = round2(yearlyCost / 365);

  const investedValue10yr = Math.round(fvAnnuity(yearlyCost, 10));
  const investedValue20yr = Math.round(fvAnnuity(yearlyCost, 20));

  const cutWeekly       = round2(cut * cost);
  const cutYearlySaving = round2(cutWeekly * WEEKS_PER_YEAR);
  const cutInvested10yr = Math.round(fvAnnuity(cutYearlySaving, 10));
  const reducedYearlyCost = round2(yearlyCost - cutYearlySaving);

  return {
    weeklySpend,
    yearlyCost,
    monthlyCost,
    tenYearCost,
    dailyCost,
    investedValue10yr,
    investedValue20yr,
    cutYearlySaving,
    cutInvested10yr,
    reducedYearlyCost,
  };
}
