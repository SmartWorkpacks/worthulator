// ─── Rent Affordability Engine ────────────────────────────────────────────────
//
// Answers "how much rent can I afford?" using the common US guidelines:
//   • 30% rule       — rent ≤ 30% of gross monthly income
//   • Landlord 3× rule — many landlords require income ≥ 3× rent (rent ≤ income/3)
//   • Debt-adjusted   — rent + monthly debts ≤ 36% of gross income
//
// Returns a recommended rent, a conservative/stretch band, a debt-aware ceiling,
// and an "affordable rent by income" series for the chart.
//
// Pure & synchronous. Guards zero/negative/NaN.

export interface RentAffordabilityInputs {
  grossAnnualIncome: number;
  /** Other monthly debt payments (car, student loans, credit cards, etc.) */
  monthlyDebt: number;
  /** Target share of gross income for rent (default 30%) */
  targetRentPct?: number;
}

export interface RentAffordabilityResult {
  grossMonthly: number;
  recommendedRent: number;     // targetRentPct of gross monthly (debt-aware)
  conservativeRent: number;    // 25%
  comfortableRent: number;     // 30%
  stretchRent: number;         // 35%
  /** Rent + debts ≤ 36% of gross → ceiling after subtracting debts */
  debtAdjustedMax: number;
  /** Income a landlord typically wants for the recommended rent (3× rule) */
  incomeNeededForRecommended: number;
  rentToIncomePct: number;     // recommendedRent ÷ grossMonthly
  /** Affordable rent (target %) across a range of incomes, for a line chart */
  affordabilityByIncome: { x: number; y: number }[];
}

const round = (n: number) => Math.round(n);

export function calculateRentAffordability(
  inputs: RentAffordabilityInputs,
): RentAffordabilityResult {
  const grossAnnualIncome = Math.max(0, inputs.grossAnnualIncome || 0);
  const monthlyDebt = Math.max(0, inputs.monthlyDebt || 0);
  const targetPct = Math.min(60, Math.max(10, inputs.targetRentPct ?? 30)) / 100;

  const grossMonthly = grossAnnualIncome / 12;

  const comfortableRent = grossMonthly * 0.3;
  const conservativeRent = grossMonthly * 0.25;
  const stretchRent = grossMonthly * 0.35;

  const debtAdjustedMax = Math.max(0, grossMonthly * 0.36 - monthlyDebt);

  // Recommended = target % of gross, but never above the debt-adjusted ceiling.
  const targetRent = grossMonthly * targetPct;
  const recommendedRent = Math.max(0, Math.min(targetRent, debtAdjustedMax));

  const incomeNeededForRecommended = recommendedRent * 3 * 12; // annual, 3× rule

  const affordabilityByIncome = [40_000, 60_000, 80_000, 100_000, 125_000, 150_000].map(
    (inc) => ({
      x: inc,
      y: round((inc / 12) * targetPct),
    }),
  );

  return {
    grossMonthly: round(grossMonthly),
    recommendedRent: round(recommendedRent),
    conservativeRent: round(conservativeRent),
    comfortableRent: round(comfortableRent),
    stretchRent: round(stretchRent),
    debtAdjustedMax: round(debtAdjustedMax),
    incomeNeededForRecommended: round(incomeNeededForRecommended),
    rentToIncomePct: grossMonthly > 0 ? Math.round((recommendedRent / grossMonthly) * 100) : 0,
    affordabilityByIncome,
  };
}
