// ─── Missed Investment ────────────────────────────────────────────────────────
//
// What a past purchase would be worth today if it had been invested instead.
// Pure compound-growth lump sum: FV = amount × (1 + r)^years. Reports the gain,
// multiplier, % growth forfeited, and the gain spread across the window.
// ─────────────────────────────────────────────────────────────────────────────

export interface MissedInvestmentInputs {
  amount: number;
  yearsAgo: number;
  annualReturn: number;
}

export interface MissedInvestmentResult {
  currentValue: number;
  totalGain: number;
  multiplier: number;
  growthLostPct: number;
  monthlyEquivalent: number;
  [key: string]: number;
}

export function calculateMissedInvestment(
  inputs: MissedInvestmentInputs,
): MissedInvestmentResult {
  const amount = inputs.amount;
  const rate = inputs.annualReturn / 100;
  const years = inputs.yearsAgo;
  const fv = amount * Math.pow(1 + rate, years);
  const gain = fv - amount;

  return {
    currentValue: fv,
    totalGain: gain,
    multiplier: amount > 0 ? fv / amount : 0,
    growthLostPct: amount > 0 ? (gain / amount) * 100 : 0,
    monthlyEquivalent: gain / Math.max(years * 12, 1),
  };
}
