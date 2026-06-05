// ─── Streaming Time — Pure Calculation Module ────────────────────────────────
//
// Quantifies a streaming habit three ways: the time itself (days/years), the
// opportunity cost of that time at the user's state median wage (live BLS data),
// and the hard subscription spend — plus the "value" lens of cost-per-hour-watched
// that exposes services you pay for but barely use.
//
// Injected data: state median hourly wage (BLS OEWS via dataset).
// Result assignable to CalculatorOutputs (index signature present).
//
// ─────────────────────────────────────────────────────────────────────────────

/** Nielsen "The Gauge" 2024: average US time on dedicated streaming/video per day. */
export const US_AVG_STREAM_HRS = 3.1;

/** S&P 500 long-run nominal average return. */
const MARKET_RETURN = 0.07;

/** Hours in a day — for converting hours to "full days". */
const HOURS_PER_DAY = 24;

export interface StreamingTimeInputs {
  hoursPerDay: number;
  yearsAhead: number;
  monthlySubCost: number;
}

export interface StreamingTimeData {
  /** State median hourly wage ($/hr) — drives the opportunity cost. */
  medianWage: number;
}

export interface StreamingTimeResult {
  /** Opportunity cost of streaming time for one year, at median wage. */
  annualCost: number;
  monthlyCost: number;
  dailyCost: number;
  weeklyHours: number;
  yearlyHours: number;
  daysPerYear: number;
  lifetimeDays: number;
  stateMedianWage: number;
  /** Hard subscription spend. */
  annualSubCost: number;
  subTotalCost: number;
  /** Subscription $ per hour actually watched — the "value" read. */
  costPerHourWatched: number;
  /** Combined drain: opportunity cost + subscription spend, per year. */
  combinedAnnualCost: number;
  excessHoursPerDay: number;
  excessAnnualCost: number;
  oneHourAnnualSaving: number;
  oneHourInvested10yr: number;
  invested10yr: number;
  invested30yr: number;
  subInvested10yr: number;
  [key: string]: number;
}

export function calculateStreamingTime(
  inputs: StreamingTimeInputs,
  data: StreamingTimeData,
): StreamingTimeResult {
  const hoursPerDay = Math.max(0, Number(inputs.hoursPerDay) || 0);
  const yearsAhead = Math.max(0, Number(inputs.yearsAhead) || 0);
  const monthlySubCost = Math.max(0, Number(inputs.monthlySubCost) || 0);
  const wage = Math.max(0, Number(data.medianWage) || 0);

  const yearlyHours = Math.round(hoursPerDay * 365);
  const weeklyHours = Math.round(hoursPerDay * 7 * 10) / 10;
  const daysPerYear = Math.round(((hoursPerDay * 365) / HOURS_PER_DAY) * 10) / 10;
  const lifetimeDays =
    Math.round(((hoursPerDay * 365 * yearsAhead) / HOURS_PER_DAY) * 10) / 10;

  const annualCost = Math.round(hoursPerDay * 365 * wage);
  const monthlyCost = Math.round(annualCost / 12);
  const dailyCost = Math.round(hoursPerDay * wage * 100) / 100;

  const annualSubCost = Math.round(monthlySubCost * 12);
  const subTotalCost = Math.round(annualSubCost * yearsAhead);
  const costPerHourWatched =
    yearlyHours > 0 ? Math.round((annualSubCost / yearlyHours) * 100) / 100 : 0;
  const combinedAnnualCost = annualCost + annualSubCost;

  const excessHoursPerDay = Math.max(0, hoursPerDay - US_AVG_STREAM_HRS);
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
    weeklyHours,
    yearlyHours,
    daysPerYear,
    lifetimeDays,
    stateMedianWage: wage,
    annualSubCost,
    subTotalCost,
    costPerHourWatched,
    combinedAnnualCost,
    excessHoursPerDay: Math.round(excessHoursPerDay * 10) / 10,
    excessAnnualCost,
    oneHourAnnualSaving,
    oneHourInvested10yr: fv(oneHourAnnualSaving, 10),
    invested10yr: fv(annualCost, 10),
    invested30yr: fv(annualCost, 30),
    subInvested10yr: fv(annualSubCost, 10),
  };
}
