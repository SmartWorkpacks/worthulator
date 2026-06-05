// ─── Phone Addiction — Pure Calculation Module ───────────────────────────────
//
// Quantifies a smartphone habit: the time (days/years of life), the share of
// your WAKING day it consumes, the pickup/checking frequency and minutes per
// pickup, and the opportunity cost of the time at the user's state median wage
// (live BLS data) — with a 7% investment projection of that reclaimable value.
//
// Injected data: state median hourly wage (BLS OEWS via dataset).
// Result assignable to CalculatorOutputs (index signature present).
//
// ─────────────────────────────────────────────────────────────────────────────

/** data.ai "State of Mobile" 2024: US daily smartphone use (hrs/day). */
export const US_AVG_PHONE_HRS = 4.5;

/** Typical daily phone pickups (Asurion / industry checking studies). */
export const US_AVG_PICKUPS = 86;

/** Assumed waking hours per day — the denominator for "share of your day". */
export const WAKING_HOURS = 16;

/** S&P 500 long-run nominal average return. */
const MARKET_RETURN = 0.07;

const HOURS_PER_DAY = 24;

export interface PhoneAddictionInputs {
  hoursPerDay: number;
  pickupsPerDay: number;
  yearsAhead: number;
}

export interface PhoneAddictionData {
  /** State median hourly wage ($/hr) — drives the opportunity cost. */
  medianWage: number;
}

export interface PhoneAddictionResult {
  annualCost: number;
  monthlyCost: number;
  dailyCost: number;
  yearlyHours: number;
  weeklyHours: number;
  daysPerYear: number;
  lifetimeDays: number;
  stateMedianWage: number;
  /** Share of a 16-hour waking day spent on the phone (%). */
  wakingPct: number;
  pickupsPerYear: number;
  minutesPerPickup: number;
  excessHoursPerDay: number;
  excessAnnualCost: number;
  oneHourAnnualSaving: number;
  oneHourInvested10yr: number;
  invested10yr: number;
  invested30yr: number;
  [key: string]: number;
}

export function calculatePhoneAddiction(
  inputs: PhoneAddictionInputs,
  data: PhoneAddictionData,
): PhoneAddictionResult {
  const hoursPerDay = Math.max(0, Number(inputs.hoursPerDay) || 0);
  const pickupsPerDay = Math.max(0, Number(inputs.pickupsPerDay) || 0);
  const yearsAhead = Math.max(0, Number(inputs.yearsAhead) || 0);
  const wage = Math.max(0, Number(data.medianWage) || 0);

  const yearlyHours = Math.round(hoursPerDay * 365);
  const weeklyHours = Math.round(hoursPerDay * 7 * 10) / 10;
  const daysPerYear = Math.round(((hoursPerDay * 365) / HOURS_PER_DAY) * 10) / 10;
  const lifetimeDays =
    Math.round(((hoursPerDay * 365 * yearsAhead) / HOURS_PER_DAY) * 10) / 10;

  const annualCost = Math.round(hoursPerDay * 365 * wage);
  const monthlyCost = Math.round(annualCost / 12);
  const dailyCost = Math.round(hoursPerDay * wage * 100) / 100;

  const wakingPct = Math.round((hoursPerDay / WAKING_HOURS) * 1000) / 10;
  const pickupsPerYear = Math.round(pickupsPerDay * 365);
  const minutesPerPickup =
    pickupsPerDay > 0 ? Math.round(((hoursPerDay * 60) / pickupsPerDay) * 10) / 10 : 0;

  const excessHoursPerDay = Math.max(0, hoursPerDay - US_AVG_PHONE_HRS);
  const excessAnnualCost = Math.round(excessHoursPerDay * 365 * wage);

  const oneHourAnnualSaving = Math.round(wage * 365);
  const r = MARKET_RETURN;
  const fv = (annual: number, years: number) =>
    annual > 0 && years > 0
      ? Math.round(annual * ((Math.pow(1 + r, years) - 1) / r))
      : 0;

  return {
    annualCost,
    monthlyCost,
    dailyCost,
    yearlyHours,
    weeklyHours,
    daysPerYear,
    lifetimeDays,
    stateMedianWage: wage,
    wakingPct,
    pickupsPerYear,
    minutesPerPickup,
    excessHoursPerDay: Math.round(excessHoursPerDay * 10) / 10,
    excessAnnualCost,
    oneHourAnnualSaving,
    oneHourInvested10yr: fv(oneHourAnnualSaving, 10),
    invested10yr: fv(annualCost, 10),
    invested30yr: fv(annualCost, 30),
  };
}
