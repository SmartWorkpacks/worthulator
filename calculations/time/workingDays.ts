// ─── Working Days Calculator — Pure Calculation Module ────────────────────────
//
// PURPOSE:
//   Estimate working (business) days within a span of calendar days using the
//   weekdays-per-week ratio, minus public holidays. Supports non-standard work
//   weeks (e.g. 6-day retail/hospitality schedules) via workDaysPerWeek.
//
// METHOD (approximation, accurate to ±1 day for most ranges):
//   workingDays ≈ calendarDays × (workDaysPerWeek / 7) − holidays
//
// RULES:
//   ✅ Pure TypeScript — synchronous, deterministic, no side effects
//   ❌ Never import React · never call fetch()
//
// ─────────────────────────────────────────────────────────────────────────────

/** Working days in a standard US year after the 11 federal holidays (260 − 11). */
export const US_WORK_YEAR_DAYS = 249;

export interface WorkingDaysInputs {
  calendarDays:    number;
  holidays:        number;
  workDaysPerWeek: number;
}

export interface WorkingDaysResult {
  workingDays:    number;
  weekendDays:    number;
  workingWeeks:   number;
  /** Working days as a % of the calendar span */
  pctWorking:     number;
  /** Raw weekday estimate before subtracting holidays */
  weekdayEstimate: number;
  [key: string]: number;
}

const round1 = (n: number) => Math.round(n * 10) / 10;

export function calculateWorkingDays(inputs: WorkingDaysInputs): WorkingDaysResult {
  const calendarDays    = Math.max(0, Number(inputs.calendarDays) || 0);
  const holidays        = Math.max(0, Number(inputs.holidays) || 0);
  const workDaysPerWeek = Math.min(7, Math.max(1, Number(inputs.workDaysPerWeek) || 5));

  const weekdayEstimate = calendarDays * (workDaysPerWeek / 7);
  const workingDays     = Math.max(0, weekdayEstimate - holidays);
  const weekendDays     = calendarDays - weekdayEstimate;
  const workingWeeks    = workingDays / workDaysPerWeek;
  const pctWorking      = calendarDays > 0 ? (workingDays / calendarDays) * 100 : 0;

  return {
    workingDays:     Math.round(workingDays),
    weekendDays:     Math.round(Math.max(0, weekendDays)),
    workingWeeks:    round1(workingWeeks),
    pctWorking:      round1(pctWorking),
    weekdayEstimate: round1(weekdayEstimate),
  };
}
