// ─── PTO Cash Value ───────────────────────────────────────────────────────────
//
// Converts unused paid-time-off hours into a cash value at the user's pay rate,
// plus days remaining, weekly earning rate, per-day value, and a weeks framing.
// Pure module — no datasets.
// ─────────────────────────────────────────────────────────────────────────────

export interface PtoInputs {
  hourlyRate: number;
  ptoHoursRemaining: number;
  hoursPerDay: number;
}

export interface PtoResult {
  cashValue: number;
  daysRemaining: number;
  weeklyEarningRate: number;
  dailyCashValue: number;
  ptoDaysAsWeeks: number;
  [key: string]: number;
}

export function calculatePto(inputs: PtoInputs): PtoResult {
  const rate = inputs.hourlyRate;
  const hours = inputs.ptoHoursRemaining;
  const perDay = inputs.hoursPerDay;
  const daysRemaining = perDay > 0 ? Math.round((hours / perDay) * 10) / 10 : 0;

  return {
    cashValue: Math.round(rate * hours),
    daysRemaining,
    weeklyEarningRate: Math.round(rate * perDay * 5),
    dailyCashValue: Math.round(rate * perDay),
    ptoDaysAsWeeks: Math.round((daysRemaining / 5) * 10) / 10,
  };
}
