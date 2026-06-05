// ─── Pomodoro Calculator — Pure Calculation Module ────────────────────────────
//
// PURPOSE:
//   Given the hours available, a session length, a break length, and days per
//   week, compute how many complete focus sessions fit (accounting for the
//   breaks between them), the resulting deep-work hours, focus density, and the
//   weekly totals.
//
// METHOD:
//   A day is filled with [session][break][session][break]… — the final session
//   needs no trailing break, so:
//     sessions = floor((availableMin + breakMin) / (sessionMin + breakMin))
//
// RULES:
//   ✅ Pure TypeScript — synchronous, deterministic, no side effects
//   ❌ Never import React · never call fetch()
//
// ─────────────────────────────────────────────────────────────────────────────

/** Cal Newport's rule-of-thumb daily ceiling for genuine deep work (hours). */
export const DEEP_WORK_CEILING_HOURS = 4;

export interface PomodoroInputs {
  hoursAvailable: number;
  sessionMinutes: number;
  breakMinutes:   number;
  daysPerWeek:    number;
}

export interface PomodoroResult {
  sessions:          number;
  deepWorkHours:     number;
  deepWorkMinutes:   number;
  breakMinutes:      number;
  /** Focused minutes ÷ available minutes × 100 */
  focusDensity:      number;
  weeklySessions:    number;
  weeklyDeepHours:   number;
  /** Long breaks earned (one per 4 completed sessions) */
  longBreaks:        number;
  [key: string]: number;
}

const round1 = (n: number) => Math.round(n * 10) / 10;

export function calculatePomodoro(inputs: PomodoroInputs): PomodoroResult {
  const hoursAvailable = Math.max(0, Number(inputs.hoursAvailable) || 0);
  const sessionMinutes = Math.max(1, Number(inputs.sessionMinutes) || 25);
  const breakMinutes   = Math.max(0, Number(inputs.breakMinutes) || 0);
  const daysPerWeek    = Math.min(7, Math.max(0, Number(inputs.daysPerWeek) || 0));

  const availableMin = hoursAvailable * 60;
  const cycle        = sessionMinutes + breakMinutes;
  const sessions     = cycle > 0 ? Math.floor((availableMin + breakMinutes) / cycle) : 0;

  const deepWorkMinutes = sessions * sessionMinutes;
  const deepWorkHours   = deepWorkMinutes / 60;
  const breakTotal      = Math.max(0, sessions - 1) * breakMinutes;
  const focusDensity    = availableMin > 0 ? (deepWorkMinutes / availableMin) * 100 : 0;

  return {
    sessions,
    deepWorkHours:   round1(deepWorkHours),
    deepWorkMinutes: Math.round(deepWorkMinutes),
    breakMinutes:    Math.round(breakTotal),
    focusDensity:    round1(focusDensity),
    weeklySessions:  sessions * daysPerWeek,
    weeklyDeepHours: round1(deepWorkHours * daysPerWeek),
    longBreaks:      Math.floor(sessions / 4),
  };
}
