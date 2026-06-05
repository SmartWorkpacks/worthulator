// ─── Work-From-Home Savings ───────────────────────────────────────────────────
//
// What WFH actually saves: avoided commute + food costs, time reclaimed, and the
// 10-year value if those savings are invested rather than absorbed by lifestyle.
// Pure module — no datasets. Investment return assumption injected via `data`.
// ─────────────────────────────────────────────────────────────────────────────

export interface WfhSavingsInputs {
  dailyCommuteCost: number;
  officeDays: number;      // days/week normally commuted
  dailyFood: number;       // bought lunch/coffee per office day
  commuteMinutes: number;  // one-way; doubled internally
}

export interface WfhSavingsData {
  /** Annual investment return for the 10-year projection (%). Default 7. */
  investReturnPct?: number;
}

export interface WfhSavingsResult {
  yearlySavings: number;
  monthlySavings: number;
  timeSavedHours: number;
  tenYearSavings: number;
  investedSavings10yr: number;
  hourlyValueRecovered: number;
  [key: string]: number;
}

const WEEKS = 52;

export function calculateWfhSavings(
  inputs: WfhSavingsInputs,
  data: WfhSavingsData = {},
): WfhSavingsResult {
  const r = (data.investReturnPct ?? 7) / 100;

  const commuteCostYear = inputs.dailyCommuteCost * inputs.officeDays * WEEKS;
  const foodCostYear = inputs.dailyFood * inputs.officeDays * WEEKS;
  const yearly = commuteCostYear + foodCostYear;
  const timeSavedHours = (inputs.commuteMinutes * 2 * inputs.officeDays * WEEKS) / 60;

  // Future value of the annual savings invested for 10 years (ordinary annuity).
  const fvFactor = r > 0 ? (Math.pow(1 + r, 10) - 1) / r : 10;
  const investedSavings10yr = yearly * fvFactor;

  return {
    yearlySavings: Math.round(yearly),
    monthlySavings: Math.round(yearly / 12),
    timeSavedHours: Math.round(timeSavedHours),
    tenYearSavings: Math.round(yearly * 10),
    investedSavings10yr: Math.round(investedSavings10yr),
    hourlyValueRecovered: timeSavedHours > 0 ? Math.round((yearly / timeSavedHours) * 100) / 100 : 0,
  };
}
