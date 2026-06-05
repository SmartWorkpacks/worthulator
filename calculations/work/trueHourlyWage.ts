// ─── True Hourly Wage ─────────────────────────────────────────────────────────
//
// Your real hourly rate once job-related-but-unpaid time is counted: commute
// (doubled for the round trip) and daily decompression, both annualised over a
// 5-day, 52-week year, added to contracted hours. Pure module: no dataset reads.
// ─────────────────────────────────────────────────────────────────────────────

export interface TrueHourlyWageInputs {
  salary: number;
  hoursPerWeek: number;
  commuteHrsDay: number;  // one-way; doubled internally
  decompressHrs: number;  // per day
}

export interface TrueHourlyWageResult {
  /** Real rate: salary ÷ (contracted + commute + decompression hours) */
  trueHourly: number;
  /** Headline rate: salary ÷ contracted hours only */
  advertisedHourly: number;
  /** Unpaid job-related hours per year (commute + decompression) */
  extraHoursPerYear: number;
  /** advertisedHourly − trueHourly */
  hourlyLoss: number;
  /** trueHourly ÷ advertisedHourly (0–1) */
  trueVsAdvertisedRatio: number;
  /** extraHoursPerYear expressed as 40-hour work weeks */
  timeRobbedWeeks: number;
  [key: string]: number;
}

const WORK_DAYS_PER_YEAR = 5 * 52; // 260

export function calculateTrueHourlyWage(
  inputs: TrueHourlyWageInputs,
): TrueHourlyWageResult {
  const salary = inputs.salary;
  const contractedHrs = inputs.hoursPerWeek * 52;
  const commuteHrs = inputs.commuteHrsDay * 2 * WORK_DAYS_PER_YEAR;
  const decompressHrs = inputs.decompressHrs * WORK_DAYS_PER_YEAR;
  const extraHoursPerYear = commuteHrs + decompressHrs;
  const totalHrs = contractedHrs + extraHoursPerYear;

  const trueHourly = totalHrs > 0 ? salary / totalHrs : 0;
  const advertisedHourly = contractedHrs > 0 ? salary / contractedHrs : 0;
  const hourlyLoss = advertisedHourly - trueHourly;

  return {
    trueHourly: Math.round(trueHourly * 100) / 100,
    advertisedHourly: Math.round(advertisedHourly * 100) / 100,
    extraHoursPerYear: Math.round(extraHoursPerYear),
    hourlyLoss: Math.round(hourlyLoss * 100) / 100,
    trueVsAdvertisedRatio: advertisedHourly > 0 ? Math.round((trueHourly / advertisedHourly) * 1000) / 1000 : 1,
    timeRobbedWeeks: Math.round((extraHoursPerYear / 40) * 10) / 10,
  };
}
