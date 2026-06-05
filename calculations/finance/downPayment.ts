// ─── Down Payment Countdown calculation module ───────────────────────────────
// Pure functions only. Three accuracy upgrades over a naive "gap ÷ months":
//   1. Interest earned while saving (HYSA) lowers the required monthly amount.
//   2. The target is a MOVING target — home prices appreciate while you save, so
//      the down payment you need at purchase is on the future price.
//   3. Closing costs (~3%) are surfaced so the real cash-to-close is honest.
// Live/dataset values (HYSA APY, CPI) are injected, never read inside.

export interface DownPaymentInputs {
  /** Target home price today ($) */
  homePrice: number;
  /** Down payment percentage (%) */
  downPct: number;
  /** Amount already saved ($) */
  currentSaved: number;
  /** Months until you want to buy */
  months: number;
  /** Expected annual home-price appreciation (%) */
  appreciationPct: number;
}

export interface DownPaymentData {
  /** High-yield savings APY (%), injected dataset value. */
  hysaApyPct: number;
  /** Live annual inflation (%), injected from FRED CPI. */
  annualInflationPct: number;
  /** Closing-cost rate as a fraction (e.g. 0.03). Defaults to 3% when omitted. */
  closingCostRate?: number;
}

export interface DownPaymentResult {
  [key: string]: number;
  /** Monthly savings required, accounting for HYSA interest and the moving target */
  monthlySavings: number;
  /** Naive monthly amount (same target, no interest) — for comparison */
  monthlyNoInterest: number;
  /** Monthly saved by earning HYSA interest (naive − real) */
  monthlyInterestSavings: number;
  /** Down payment at purchase (on the appreciated price) */
  targetDown: number;
  /** Down payment on today's price (the figure naive calculators use) */
  targetDownToday: number;
  /** Extra down payment needed because the home appreciated */
  appreciationGap: number;
  /** Projected home price at purchase */
  futureHomePrice: number;
  /** Interest earned in the HYSA over the saving period */
  interestEarned: number;
  /** Estimated closing costs (~3% of the purchase price) */
  closingCosts: number;
  /** Total cash needed at closing (down payment + closing costs) */
  cashToClose: number;
  /** Remaining to save after current savings */
  remaining: number;
  /** Progress toward the target (%) */
  progressPercent: number;
  /** 1 if down payment ≥ 20% (no PMI), else 0 */
  avoidsPMI: number;
  /** Extra needed to reach 20% down (0 if already ≥ 20%) */
  pmiShortfall: number;
  /** The future down payment expressed in today's dollars (live CPI) */
  realTargetDown: number;
}

const CLOSING_COST_RATE = 0.03;

export function calculateDownPayment(inputs: DownPaymentInputs, data: DownPaymentData): DownPaymentResult {
  const { homePrice, downPct, currentSaved, months } = inputs;
  const years = months / 12;

  const appr = Math.max(0, inputs.appreciationPct) / 100;
  const infl = Math.max(0, data.annualInflationPct) / 100;
  const m = Math.max(0, data.hysaApyPct) / 100 / 12;

  const futureHomePrice = Math.round(homePrice * Math.pow(1 + appr, years));
  const targetDownToday = Math.round((homePrice * downPct) / 100);
  const targetDown = Math.round((futureHomePrice * downPct) / 100);
  const appreciationGap = Math.max(0, targetDown - targetDownToday);

  // Future value of what's already saved, growing in the HYSA.
  const fvCurrent = currentSaved * Math.pow(1 + m, months);
  const neededFromContrib = Math.max(0, targetDown - fvCurrent);
  const annuityFactor = m > 0 ? (Math.pow(1 + m, months) - 1) / m : months;
  const monthlySavings = months > 0 ? Math.round(neededFromContrib / annuityFactor) : 0;

  const monthlyNoInterest = months > 0 ? Math.round(Math.max(0, targetDown - currentSaved) / months) : 0;
  const monthlyInterestSavings = Math.max(0, monthlyNoInterest - monthlySavings);

  const totalContributed = monthlySavings * months + currentSaved;
  const interestEarned = Math.max(0, Math.round(targetDown - totalContributed));

  const closingRate = data.closingCostRate != null && data.closingCostRate > 0
    ? data.closingCostRate
    : CLOSING_COST_RATE;
  const closingCosts = Math.round(futureHomePrice * closingRate);
  const cashToClose = targetDown + closingCosts;

  const remaining = Math.max(0, targetDown - currentSaved);
  const progressPercent = targetDown > 0 ? Math.round((currentSaved / targetDown) * 1000) / 10 : 0;

  const avoidsPMI = downPct >= 20 ? 1 : 0;
  const pmiShortfall = downPct < 20 ? Math.max(0, Math.round(futureHomePrice * 0.2 - targetDown)) : 0;

  const realTargetDown = Math.round(targetDown / Math.pow(1 + infl, years));

  return {
    monthlySavings,
    monthlyNoInterest,
    monthlyInterestSavings,
    targetDown,
    targetDownToday,
    appreciationGap,
    futureHomePrice,
    interestEarned,
    closingCosts,
    cashToClose,
    remaining,
    progressPercent,
    avoidsPMI,
    pmiShortfall,
    realTargetDown,
  };
}
