// ─── Work Hours Calculator — Pure Calculation Module ──────────────────────────
//
// PURPOSE:
//   Turn a daily-hours × days-per-week × weeks schedule into total hours, then
//   layer the clever extras: FLSA-style weekly overtime (anything over 40 h/week
//   at 1.5×), gross earnings at an optional hourly rate, and a full-time-
//   equivalent (FTE) comparison against the standard 2,080-hour work year.
//
// METHOD:
//   weeklyHours      = hoursPerDay × daysPerWeek
//   overtime is computed PER WEEK (FLSA basis), then scaled by weeks worked.
//
// RULES:
//   ✅ Pure TypeScript — synchronous, deterministic, no side effects
//   ❌ Never import React · never call fetch()
//
// ─────────────────────────────────────────────────────────────────────────────

/** Standard full-time work year (40 h/week × 52 weeks). */
export const FULL_TIME_YEAR_HOURS = 2080;
/** FLSA weekly overtime threshold (hours). */
export const OVERTIME_THRESHOLD = 40;
/** FLSA overtime multiplier. */
export const OVERTIME_MULTIPLIER = 1.5;

export interface WorkHoursInputs {
  hoursPerDay: number;
  daysPerWeek: number;
  weeksWorked: number;
  /** Optional hourly rate; 0 = skip earnings */
  hourlyRate:  number;
}

export interface WorkHoursResult {
  totalHours:    number;
  weeklyHours:   number;
  daysWorked:    number;
  regularHours:  number;
  overtimeHours: number;
  regularPay:    number;
  overtimePay:   number;
  grossPay:      number;
  /** Total hours ÷ 2,080 — fraction of a full-time work year */
  fte:           number;
  /** Average hours per day worked */
  avgPerDay:     number;
  [key: string]: number;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export function calculateWorkHours(inputs: WorkHoursInputs): WorkHoursResult {
  const hoursPerDay = Math.max(0, Number(inputs.hoursPerDay) || 0);
  const daysPerWeek = Math.min(7, Math.max(0, Number(inputs.daysPerWeek) || 0));
  const weeksWorked = Math.max(0, Number(inputs.weeksWorked) || 0);
  const hourlyRate  = Math.max(0, Number(inputs.hourlyRate) || 0);

  const weeklyHours = hoursPerDay * daysPerWeek;
  const totalHours  = weeklyHours * weeksWorked;
  const daysWorked  = daysPerWeek * weeksWorked;

  const regularWeekly  = Math.min(weeklyHours, OVERTIME_THRESHOLD);
  const overtimeWeekly = Math.max(0, weeklyHours - OVERTIME_THRESHOLD);
  const regularHours   = regularWeekly * weeksWorked;
  const overtimeHours  = overtimeWeekly * weeksWorked;

  const regularPay  = regularHours * hourlyRate;
  const overtimePay = overtimeHours * hourlyRate * OVERTIME_MULTIPLIER;
  const grossPay    = regularPay + overtimePay;

  return {
    totalHours:    round2(totalHours),
    weeklyHours:   round2(weeklyHours),
    daysWorked:    round2(daysWorked),
    regularHours:  round2(regularHours),
    overtimeHours: round2(overtimeHours),
    regularPay:    round2(regularPay),
    overtimePay:   round2(overtimePay),
    grossPay:      round2(grossPay),
    fte:           round2(totalHours / FULL_TIME_YEAR_HOURS),
    avgPerDay:     round2(hoursPerDay),
  };
}
