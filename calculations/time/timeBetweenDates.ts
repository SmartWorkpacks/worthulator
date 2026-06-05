// ─── Time Between Dates Calculator — Pure Calculation Module ──────────────────
//
// PURPOSE:
//   Convert a span of calendar days into weeks, months, years, business days,
//   and a "W weeks, D days" breakdown — using accurate average-length constants
//   (365.25 days/year, 30.4375 days/month) so conversions don't drift.
//
// RULES:
//   ✅ Pure TypeScript — synchronous, deterministic, no side effects
//   ❌ Never import React · never call fetch()
//
// ─────────────────────────────────────────────────────────────────────────────

/** Average days per year accounting for leap years (365.25). */
export const AVG_DAYS_PER_YEAR = 365.25;
/** Average days per calendar month (365.25 ÷ 12). */
export const AVG_DAYS_PER_MONTH = AVG_DAYS_PER_YEAR / 12;

export interface TimeBetweenInputs {
  days: number;
}

export interface TimeBetweenResult {
  weeks:        number;
  months:       number;
  years:        number;
  businessDays: number;
  hours:        number;
  /** Whole weeks in the span */
  fullWeeks:    number;
  /** Leftover days after whole weeks */
  remainderDays: number;
  [key: string]: number;
}

const round1 = (n: number) => Math.round(n * 10) / 10;

export function calculateTimeBetween(inputs: TimeBetweenInputs): TimeBetweenResult {
  const days = Math.max(0, Number(inputs.days) || 0);

  return {
    weeks:         round1(days / 7),
    months:        round1(days / AVG_DAYS_PER_MONTH),
    years:         Math.round((days / AVG_DAYS_PER_YEAR) * 100) / 100,
    businessDays:  Math.round(days * (5 / 7)),
    hours:         days * 24,
    fullWeeks:     Math.floor(days / 7),
    remainderDays: Math.round(days % 7),
  };
}
