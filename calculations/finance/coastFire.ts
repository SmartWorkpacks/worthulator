// ─── Coast FIRE calculation module ───────────────────────────────────────────
// Pure functions only. Coast FIRE = the amount invested today that, with NO
// further contributions, grows to your FIRE target by retirement.
//
// Accuracy note: the FIRE target (25× today's expenses) is in today's dollars,
// so growth must use a REAL (inflation-adjusted) return — not the nominal rate.
// We inject live CPI and apply the Fisher relation. The module also returns the
// naive nominal figure so the UI can show how much that common mistake
// under-states the real coast number.

export interface CoastFireInputs {
  /** Current invested assets ($) */
  current: number;
  /** FIRE target in today's dollars ($) */
  target: number;
  /** Expected nominal annual return (%) */
  rate: number;
  /** Years until retirement */
  years: number;
}

export interface CoastFireData {
  /** Live annual inflation rate (%), injected from FRED CPI. */
  annualInflationPct: number;
}

export interface CoastFireResult {
  [key: string]: number;
  /** Real annual return (%) = Fisher(nominal, inflation) */
  realRatePct: number;
  /** Coast FIRE number today, using the REAL return (the honest figure) */
  requiredNow: number;
  /** Naive coast number using the nominal return (too low) */
  requiredNowNominal: number;
  /** Extra needed today because of inflation (requiredNow − nominal) */
  inflationPenalty: number;
  /** Projected value of current savings at retirement, in today's dollars */
  coastValue: number;
  /** current / requiredNow */
  coastRatio: number;
  /** max(0, requiredNow − current) */
  coastShortfall: number;
  /** max(0, current − requiredNow) */
  coastSurplus: number;
  /** 1 if already coasting (current ≥ requiredNow), else 0 */
  alreadyCoasting: number;
}

export function calculateCoastFire(inputs: CoastFireInputs, data: CoastFireData): CoastFireResult {
  const { current, target, rate, years } = inputs;
  const infl = Math.max(0, data.annualInflationPct) / 100;
  const nominal = rate / 100;

  // Fisher real return: (1+nominal)/(1+inflation) − 1
  const real = (1 + nominal) / (1 + infl) - 1;
  const realRatePct = Math.round(real * 1000) / 10;

  const realGrowth = Math.pow(1 + real, years);
  const nominalGrowth = Math.pow(1 + nominal, years);

  const requiredNow = Math.round(target / realGrowth);
  const requiredNowNominal = Math.round(target / nominalGrowth);
  const inflationPenalty = Math.max(0, requiredNow - requiredNowNominal);

  // Current savings projected forward at the real rate → today's-dollars value.
  const coastValue = Math.round(current * realGrowth);

  const coastRatio = requiredNow > 0 ? Math.round((current / requiredNow) * 1000) / 1000 : 0;
  const coastShortfall = Math.max(0, requiredNow - current);
  const coastSurplus = Math.max(0, current - requiredNow);
  const alreadyCoasting = current >= requiredNow ? 1 : 0;

  return {
    realRatePct,
    requiredNow,
    requiredNowNominal,
    inflationPenalty,
    coastValue,
    coastRatio,
    coastShortfall,
    coastSurplus,
    alreadyCoasting,
  };
}
