// ─── Savings Goal calculation module ─────────────────────────────────────────
// Pure functions only. No UI, no data fetching, no module-level state.
// Solves the monthly deposit needed to reach a target, accounting for growth on
// both the current balance and the contributions — plus a live-inflation layer
// that shows what the goal must really be to buy the same thing later.

export interface SavingsGoalInputs {
  /** Target amount ($) */
  goalAmount: number;
  /** Money already saved ($) */
  currentSavings: number;
  /** Years to reach the goal */
  years: number;
  /** Expected annual return (%) on the balance */
  annualReturn: number;
}

export interface SavingsGoalData {
  /** Live annual inflation rate (%), injected from FRED CPI. */
  annualInflationPct: number;
}

export interface SavingsGoalResult {
  [key: string]: number;
  /** Monthly deposit needed to hit the nominal goal */
  monthlyContribution: number;
  /** Sum of monthly deposits over the horizon */
  totalContributed: number;
  /** Growth earned on balance + deposits */
  interestEarned: number;
  /** Share of the goal funded by returns rather than deposits (%) */
  interestSharePct: number;
  /** Monthly deposit if the balance earned 0% (deposits only) */
  monthlyNoGrowth: number;
  /** Monthly saved by earning a return instead of 0% */
  monthlySavedByGrowth: number;
  /** Goal restated in future dollars to preserve today's buying power */
  inflationAdjustedGoal: number;
  /** Monthly deposit needed to hit the inflation-adjusted goal */
  monthlyForRealGoal: number;
}

const EMPTY: SavingsGoalResult = {
  monthlyContribution: 0, totalContributed: 0, interestEarned: 0, interestSharePct: 0,
  monthlyNoGrowth: 0, monthlySavedByGrowth: 0, inflationAdjustedGoal: 0, monthlyForRealGoal: 0,
};

/** Monthly deposit to grow `pv` into `fv` over `n` months at monthly rate `r`. */
function solveMonthly(fv: number, pv: number, r: number, n: number): number {
  if (n <= 0) return 0;
  const pvGrown = pv * Math.pow(1 + r, n);
  if (r === 0) return Math.max(0, (fv - pvGrown) / n);
  const annuityFactor = (Math.pow(1 + r, n) - 1) / r;
  return Math.max(0, (fv - pvGrown) / annuityFactor);
}

export function calculateSavingsGoal(
  inputs: SavingsGoalInputs,
  data: SavingsGoalData,
): SavingsGoalResult {
  const goal = Number(inputs.goalAmount);
  const current = Number(inputs.currentSavings);
  const years = Number(inputs.years);
  const annualReturn = Number(inputs.annualReturn);
  const inflPct = Number(data.annualInflationPct);

  if (
    !isFinite(goal) || !isFinite(current) || !isFinite(years) || !isFinite(annualReturn) ||
    years <= 0 || goal <= 0 || current < 0
  ) {
    return { ...EMPTY };
  }

  const r = annualReturn / 100 / 12;
  const n = Math.round(years * 12);

  const monthlyContribution = solveMonthly(goal, current, r, n);
  const totalContributed = monthlyContribution * n;
  const interestEarned = Math.max(0, goal - current - totalContributed);
  const interestSharePct = goal > 0 ? (interestEarned / goal) * 100 : 0;

  const monthlyNoGrowth = Math.max(0, (goal - current) / n);
  const monthlySavedByGrowth = Math.max(0, monthlyNoGrowth - monthlyContribution);

  const infl = (isFinite(inflPct) ? inflPct : 3.3) / 100;
  const inflationAdjustedGoal = goal * Math.pow(1 + infl, years);
  const monthlyForRealGoal = solveMonthly(inflationAdjustedGoal, current, r, n);

  return {
    monthlyContribution: Math.round(monthlyContribution * 100) / 100,
    totalContributed: Math.round(totalContributed),
    interestEarned: Math.round(interestEarned),
    interestSharePct: Math.round(interestSharePct * 10) / 10,
    monthlyNoGrowth: Math.round(monthlyNoGrowth * 100) / 100,
    monthlySavedByGrowth: Math.round(monthlySavedByGrowth * 100) / 100,
    inflationAdjustedGoal: Math.round(inflationAdjustedGoal),
    monthlyForRealGoal: Math.round(monthlyForRealGoal * 100) / 100,
  };
}
