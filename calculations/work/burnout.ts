// ─── Burnout Risk ─────────────────────────────────────────────────────────────
//
// Composite 0–100 burnout risk score from weekly hours, self-rated stress, and
// nightly sleep. Hours contribute up to 40 pts (relative to a 60h ceiling),
// stress up to 30 pts, and short sleep (<6h) adds a flat 20 pts. Pure module.
// Also surfaces annual overwork hours, weekly sleep debt, and recovery weeks.
// ─────────────────────────────────────────────────────────────────────────────

export interface BurnoutInputs {
  hours: number;
  stress: number;
  sleep: number;
}

export interface BurnoutResult {
  burnoutRisk: number;
  overworkHoursPerYear: number;
  sleepDebtWeekly: number;
  recoveryWeeksNeeded: number;
  [key: string]: number;
}

export function calculateBurnout(inputs: BurnoutInputs): BurnoutResult {
  const score =
    (inputs.hours / 60) * 40 +
    (inputs.stress / 10) * 30 +
    (inputs.sleep < 6 ? 20 : 0);
  const burnoutRisk = Math.min(Math.round(score), 100);

  return {
    burnoutRisk,
    overworkHoursPerYear: Math.max(0, inputs.hours - 40) * 52,
    sleepDebtWeekly: Math.round(Math.max(0, 8 - inputs.sleep) * 7 * 10) / 10,
    recoveryWeeksNeeded: Math.round(burnoutRisk / 25),
  };
}
