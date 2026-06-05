// ─── Procrastination Cost — Pure Calculation Module ──────────────────────────
//
// Injected data: state median hourly wage (BLS OEWS via dataset).
// Result assignable to CalculatorOutputs (index signature present).
//
// ─────────────────────────────────────────────────────────────────────────────

/** Salary.com 2012: employees waste avg 2.09 hrs/day on personal activities. */
export const US_AVG_PROCRASTINATION_HRS = 2.09;

/** S&P 500 long-run nominal average return. */
const MARKET_RETURN = 0.07;

export interface ProcrastinationInputs {
  hoursPerDay: number;
  daysPerYear: number;
  state: string;
}

export interface ProcrastinationData {
  medianWage: number;
}

export interface ProcrastinationResult {
  dailyLoss: number;
  weeklyLoss: number;
  monthlyLoss: number;
  annualLoss: number;
  tenYearLoss: number;
  careerLoss: number;
  stateMedianWage: number;
  halfHourSaving: number;
  excessHoursPerDay: number;
  excessAnnualLoss: number;
  annualHoursLost: number;
  daysLostPerYear: number;
  [key: string]: number;
}

export function calculateProcrastinationCost(
  inputs: ProcrastinationInputs,
  data: ProcrastinationData,
): ProcrastinationResult {
  const { hoursPerDay, daysPerYear } = inputs;
  const wage = data.medianWage;

  const dailyLoss = Math.round(hoursPerDay * wage * 100) / 100;
  const weeklyLoss = Math.round(dailyLoss * 5);
  const annualLoss = Math.round(dailyLoss * daysPerYear);
  const monthlyLoss = Math.round(annualLoss / 12);

  const r = MARKET_RETURN;
  const fv = (annual: number, years: number) =>
    annual > 0 && years > 0
      ? Math.round(annual * ((Math.pow(1 + r, years) - 1) / r))
      : 0;

  const tenYearLoss = fv(annualLoss, 10);
  const careerLoss = fv(annualLoss, 20);

  const halfHourSaving = Math.round((annualLoss / hoursPerDay) * 0.5);

  const excessHoursPerDay = Math.max(
    0,
    Math.round((hoursPerDay - US_AVG_PROCRASTINATION_HRS) * 10) / 10,
  );
  const excessAnnualLoss = Math.round(excessHoursPerDay * wage * daysPerYear);

  const annualHoursLost = Math.round(hoursPerDay * daysPerYear);
  const daysLostPerYear = Math.round((annualHoursLost / 24) * 10) / 10;

  return {
    dailyLoss,
    weeklyLoss,
    monthlyLoss,
    annualLoss,
    tenYearLoss,
    careerLoss,
    stateMedianWage: wage,
    halfHourSaving,
    excessHoursPerDay,
    excessAnnualLoss,
    annualHoursLost,
    daysLostPerYear,
  };
}
