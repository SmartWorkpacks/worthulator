// ─── Salary Negotiation ───────────────────────────────────────────────────────
//
// Recommends an opening ask from market range, experience, skill match, and
// hiring urgency. Leverage score blends experience (÷10), skill match (÷100),
// and an urgency bonus. The ask is the greater of the market midpoint and the
// current offer scaled up by leverage. Pure module — no datasets.
// ─────────────────────────────────────────────────────────────────────────────

export interface SalaryNegotiationInputs {
  currentOffer: number;
  marketLow: number;
  marketHigh: number;
  experienceYears: number;
  skillMatch: number;
  offerUrgencyHigh: boolean;
}

export interface SalaryNegotiationResult {
  marketMid: number;
  recommendedAsk: number;
  confidenceScore: number;
  [key: string]: number;
}

const URGENCY_BONUS = 0.2;

export function calculateSalaryNegotiation(
  inputs: SalaryNegotiationInputs,
): SalaryNegotiationResult {
  const marketMid = (inputs.marketLow + inputs.marketHigh) / 2;
  const leverageScore =
    inputs.experienceYears / 10 +
    inputs.skillMatch / 100 +
    (inputs.offerUrgencyHigh ? URGENCY_BONUS : 0);
  const recommendedAsk = Math.max(
    marketMid,
    inputs.currentOffer * (1.1 + leverageScore * 0.05),
  );

  return {
    marketMid: Math.round(marketMid),
    recommendedAsk: Math.round(recommendedAsk),
    confidenceScore: Math.min(leverageScore * 100, 100),
  };
}
