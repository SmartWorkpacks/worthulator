// ─── Life in Weeks ────────────────────────────────────────────────────────────
//
// Visualises a lifespan in weeks: lived, remaining, and % elapsed, using a
// 52-week year. Also surfaces years and days remaining and "summers left"
// (~13 summer weeks per year). Pure module — no datasets.
// ─────────────────────────────────────────────────────────────────────────────

export interface LifeInWeeksInputs {
  age: number;
  lifeExpectancy: number;
}

export interface LifeInWeeksResult {
  weeksLived: number;
  weeksRemaining: number;
  percentUsed: number;
  yearsRemaining: number;
  daysRemaining: number;
  summerWeeksRemaining: number;
  [key: string]: number;
}

const WEEKS_PER_YEAR = 52;
const SUMMER_WEEKS_PER_YEAR = 13;

export function calculateLifeInWeeks(
  inputs: LifeInWeeksInputs,
): LifeInWeeksResult {
  const totalWeeks = inputs.lifeExpectancy * WEEKS_PER_YEAR;
  const lived = inputs.age * WEEKS_PER_YEAR;
  const weeksRemaining = Math.round(totalWeeks - lived);
  const yearsRemaining = Math.round(inputs.lifeExpectancy - inputs.age);

  return {
    weeksLived: Math.round(lived),
    weeksRemaining,
    percentUsed: totalWeeks > 0 ? Math.round((lived / totalWeeks) * 1000) / 10 : 0,
    yearsRemaining,
    daysRemaining: Math.round(weeksRemaining * 7),
    summerWeeksRemaining: Math.round(yearsRemaining * SUMMER_WEEKS_PER_YEAR),
  };
}
