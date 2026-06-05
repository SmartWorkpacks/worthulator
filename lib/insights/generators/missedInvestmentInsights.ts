import type { Insight } from "../types";
import { futureValueAnnuity } from "../projections";
import { formatCurrency } from "../benchmarks";

interface MissedInvestmentInputs {
  amount:       number;
  yearsAgo:     number;
  annualReturn: number;
}

interface MissedInvestmentOutputs {
  currentValue?:      number;
  totalGain?:         number;
  multiplier?:        number;
  growthLostPct?:     number;
  monthlyEquivalent?: number;
  futureProjection?:  number;
  weeklyLoss?:        number;
}

export function missedInvestmentInsights(
  inputs: MissedInvestmentInputs,
  outputs: MissedInvestmentOutputs,
): Insight[] {
  const results: Insight[] = [];

  const amount     = Number(inputs.amount);
  const years      = Number(inputs.yearsAgo);
  const rate       = Number(inputs.annualReturn);
  const current    = outputs.currentValue      ?? Math.round(amount * Math.pow(1 + rate / 100, years));
  const gain       = outputs.totalGain         ?? Math.max(0, current - amount);
  const multiplier = outputs.multiplier        ?? Math.round((current / amount) * 100) / 100;
  const future     = outputs.futureProjection  ?? Math.round(current * Math.pow(1 + rate / 100, 20));

  if (amount <= 0) return results;

  const pctGain = amount > 0 ? Math.round((gain / amount) * 100) : 0;

  // 1. What it would be worth today — the core fact
  results.push({
    id:       "missed.opportunity-cost",
    severity: "neutral",
    category: "opportunity-cost",
    title:    `${formatCurrency(amount)} invested ${years} years ago at ${rate}% would be ${formatCurrency(current)} today`,
    body:     `${formatCurrency(amount)} compounded at ${rate}% annually for ${years} years becomes ${formatCurrency(current)} — a ${pctGain}% return of ${formatCurrency(gain)} in growth. The original ${formatCurrency(amount)} is still there; the ${formatCurrency(gain)} is the cost of not investing.`,
    metric:   { label: "What it would be worth now", value: formatCurrency(current) },
    visualization: {
      type:   "delta-card",
      before: { label: "Original amount",       value: formatCurrency(amount) },
      after:  { label: "Value today if invested", value: formatCurrency(current) },
      delta:  { label: "Opportunity cost",       value: formatCurrency(gain), positive: false },
    },
  });

  // 2. Multiplier — the 2× threshold
  if (multiplier >= 2) {
    results.push({
      id:       "missed.multiplier",
      severity: "neutral",
      category: "comparison",
      title:    `${multiplier.toFixed(2)}× — every $1 not invested became $${multiplier.toFixed(2)}`,
      body:     `At ${rate}% for ${years} years, $1 grows to $${multiplier.toFixed(2)}. The ${formatCurrency(amount)} became ${formatCurrency(current)} — not because of high risk or timing luck, but because of time and a consistent market return.`,
      metric:   { label: "Return multiple", value: `${multiplier.toFixed(2)}×` },
    });
  }

  // 3. Forward projection — investing current value now
  if (future > current * 1.5) {
    results.push({
      id:       "missed.future-projection",
      severity: "positive",
      category: "investment",
      title:    `${formatCurrency(current)} invested now grows to ${formatCurrency(future)} in 20 more years`,
      body:     `If you invest ${formatCurrency(current)} today and hold for 20 years at ${rate}%, it compounds to ${formatCurrency(future)}. Compound interest does not care about the past — the same math applies from today forward.`,
      metric:   { label: "20-year forward value", value: formatCurrency(future) },
      visualization: {
        type:   "projection-line",
        points: [1, 5, 10, 15, 20].map((yr) => ({
          label: `Yr ${yr}`,
          value: Math.round(current * Math.pow(1 + rate / 100, yr)),
        })),
        format: "currency",
        yLabel: "Invested value",
        color:  "#10b981",
      },
    });
  }

  return results;
}
