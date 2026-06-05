// ─── Meeting Cost — Pure Calculation Module ──────────────────────────────────
//
// Injected data: state median hourly wage (BLS OEWS via dataset).
// Result assignable to CalculatorOutputs (index signature present).
//
// The clever part: this is the TRUE cost to the employer (loaded with benefits +
// overhead), scaled by who is actually in the room (seniority), and annualized
// by how often the meeting recurs — the number nobody computes.
//
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fully-loaded employer cost multiplier over base wage.
 * BLS Employer Costs for Employee Compensation (ECEC) 2024: benefits + payroll
 * taxes are ~30% of total compensation (wages ≈ 70%). We use 1.4 to also fold
 * in baseline overhead (facilities, equipment, software seats).
 */
export const LOADED_COST_MULTIPLIER = 1.4;

/**
 * Seniority multiplier applied to the state ALL-OCCUPATIONS median wage.
 * Meeting rooms skew toward salaried knowledge workers who earn above the
 * all-occupation median, so even "junior" sits slightly above 1.0.
 *   junior     → early-career individual contributors
 *   mixed      → a typical cross-level team meeting
 *   senior     → senior ICs / managers
 *   leadership → directors / executives
 */
export const SENIORITY_MULTIPLIERS: Record<string, number> = {
  junior: 1.1,
  mixed: 1.5,
  senior: 2.2,
  leadership: 3.5,
};

/** Frequency → meetings per year. "daily" = working days/year (52 wks × 5). */
export const FREQUENCY_PER_YEAR: Record<string, number> = {
  "one-off": 1,
  monthly: 12,
  biweekly: 26,
  weekly: 52,
  daily: 260,
};

/**
 * Context-switch ("refocus") tax per attendee, per meeting occurrence.
 * UC Irvine — Gloria Mark, "The Cost of Interrupted Work" (2008): it takes an
 * average of ~23 minutes to fully resume a task after an interruption. A meeting
 * is a scheduled interruption, so each attendee loses roughly this much focused
 * time around it. This is the cost almost every meeting calculator ignores.
 */
export const REFOCUS_MINUTES_PER_ATTENDEE = 23;

/** Standard 8-hour workday — used to express attendee-hours as workdays. */
export const HOURS_PER_WORKDAY = 8;

export interface MeetingCostInputs {
  attendees: number;
  durationMinutes: number;
  seniority: string;
  frequency: string;
  state: string;
}

export interface MeetingCostData {
  medianWage: number;
}

export interface MeetingCostResult {
  totalCost: number;
  costPerMinute: number;
  costPerAttendee: number;
  annualizedCost: number;
  loadedHourlyRate: number;
  attendeeHours: number;
  trim15Saving: number;
  dropOneAttendeeSaving: number;
  asyncSaving: number;
  meetingsPerYear: number;
  /** Context-switch (refocus) cost for the whole room, per occurrence */
  refocusCostPerMeeting: number;
  /** In-meeting cost + refocus tax, per occurrence */
  trueCostPerMeeting: number;
  /** Annualized true cost including the refocus tax */
  trueAnnualizedCost: number;
  /** Full 8-hour workdays of team time this meeting consumes per year */
  annualWorkdays: number;
  [key: string]: number;
}

export function calculateMeetingCost(
  inputs: MeetingCostInputs,
  data: MeetingCostData,
): MeetingCostResult {
  const { attendees, durationMinutes, seniority, frequency } = inputs;

  const seniorityMult = SENIORITY_MULTIPLIERS[seniority] ?? 1.5;
  const meetingsPerYear = FREQUENCY_PER_YEAR[frequency] ?? 1;

  // Loaded hourly rate = state median × seniority × benefits/overhead
  const loadedHourlyRate =
    Math.round(data.medianWage * seniorityMult * LOADED_COST_MULTIPLIER * 100) /
    100;

  const hours = durationMinutes / 60;
  const attendeeHours = Math.round(attendees * hours * 100) / 100;
  const totalCost = Math.round(attendees * loadedHourlyRate * hours);

  const costPerMinute = Math.round((totalCost / durationMinutes) * 100) / 100;
  const costPerAttendee = Math.round(totalCost / attendees);
  const annualizedCost = Math.round(totalCost * meetingsPerYear);

  // Trim 15 minutes per occurrence → annual saving
  const trimMinutes = Math.min(15, durationMinutes);
  const trim15Saving = Math.round(
    attendees * loadedHourlyRate * (trimMinutes / 60) * meetingsPerYear,
  );

  // Dropping one non-essential attendee → annual saving
  const dropOneAttendeeSaving = Math.round(
    loadedHourlyRate * hours * meetingsPerYear,
  );

  // Async alternative: a written update costs ~10% of a live meeting (read time)
  const asyncSaving = Math.round(annualizedCost * 0.9);

  // Context-switch (refocus) tax — the hidden cost most calculators ignore.
  const refocusCostPerMeeting = Math.round(
    attendees * (REFOCUS_MINUTES_PER_ATTENDEE / 60) * loadedHourlyRate,
  );
  const trueCostPerMeeting = totalCost + refocusCostPerMeeting;
  const trueAnnualizedCost = Math.round(trueCostPerMeeting * meetingsPerYear);

  // Human-scale framing: full 8-hour workdays of team time consumed per year.
  const annualWorkdays =
    Math.round(((attendeeHours * meetingsPerYear) / HOURS_PER_WORKDAY) * 10) / 10;

  return {
    totalCost,
    costPerMinute,
    costPerAttendee,
    annualizedCost,
    loadedHourlyRate,
    attendeeHours,
    trim15Saving,
    dropOneAttendeeSaving,
    asyncSaving,
    meetingsPerYear,
    refocusCostPerMeeting,
    trueCostPerMeeting,
    trueAnnualizedCost,
    annualWorkdays,
  };
}
