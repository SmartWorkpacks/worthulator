// ─── Screen Time Impact — Pure Calculation Module ────────────────────────────
//
// Injected data: state median hourly wage (BLS OEWS via dataset).
// Result assignable to CalculatorOutputs (index signature present).
//
// ─────────────────────────────────────────────────────────────────────────────

/** Nielsen 2024: average US non-work screen time. */
export const US_AVG_SCREEN_HRS = 4.37;

/** S&P 500 long-run nominal average return. */
const MARKET_RETURN = 0.07;

export interface ScreenTimeInputs {
  hoursPerDay: number;
  yearsAhead: number;
  state: string;
}

export interface ScreenTimeData {
  medianWage: number;
}

export interface ScreenTimeResult {
  annualCost: number;
  weeklyHours: number;
  lifetimeDays: number;
  monthlyCost: number;
  dailyCost: number;
  stateMedianWage: number;
  excessHoursPerDay: number;
  excessAnnualCost: number;
  oneHourAnnualSaving: number;
  oneHourInvested10yr: number;
  invested10yr: number;
  invested30yr: number;
  daysPerYear: number;
  [key: string]: number;
}

export function calculateScreenTime(
  inputs: ScreenTimeInputs,
  data: ScreenTimeData,
): ScreenTimeResult {
  const { hoursPerDay, yearsAhead } = inputs;
  const wage = data.medianWage;

  const annualCost = Math.round(hoursPerDay * 365 * wage);
  const monthlyCost = Math.round(annualCost / 12);
  const dailyCost = Math.round(hoursPerDay * wage * 100) / 100;
  const weeklyHours = Math.round(hoursPerDay * 7 * 10) / 10;
  const lifetimeDays =
    Math.round(((hoursPerDay * 365 * yearsAhead) / 24) * 10) / 10;
  const daysPerYear =
    Math.round(((hoursPerDay * 365) / 24) * 10) / 10;

  const excessHoursPerDay = Math.max(0, hoursPerDay - US_AVG_SCREEN_HRS);
  const excessAnnualCost = Math.round(excessHoursPerDay * 365 * wage);

  const oneHourAnnualSaving = Math.round(wage * 365);
  const r = MARKET_RETURN;
  const fv = (annual: number, years: number) =>
    annual > 0 && years > 0
      ? Math.round(annual * ((Math.pow(1 + r, years) - 1) / r))
      : 0;

  const oneHourInvested10yr = fv(oneHourAnnualSaving, 10);
  const invested10yr = fv(annualCost, 10);
  const invested30yr = fv(annualCost, 30);

  return {
    annualCost,
    weeklyHours,
    lifetimeDays,
    monthlyCost,
    dailyCost,
    stateMedianWage: wage,
    excessHoursPerDay:
      Math.round(excessHoursPerDay * 10) / 10,
    excessAnnualCost,
    oneHourAnnualSaving,
    oneHourInvested10yr,
    invested10yr,
    invested30yr,
    daysPerYear,
  };
}
