import type { Insight } from "../types";
import { formatCurrency } from "../benchmarks";

export interface MortgageRefinanceInputs {
  oldPayment: number;
  newPayment: number;
  closingCosts: number;
  years: number;
}

export interface MortgageRefinanceOutputs {
  savingsPerMonth: number;
  breakEvenMonths: number;
  totalSavings: number;
  breakEvenYears?: number;
  savingsRatio?: number;
  annualSavings?: number;
}

export function generateMortgageRefinanceInsights(
  inputs: MortgageRefinanceInputs,
  outputs: MortgageRefinanceOutputs,
): Insight[] {
  const insights: Insight[] = [];
  const { closingCosts, years } = inputs;
  const {
    savingsPerMonth,
    breakEvenMonths,
    totalSavings,
    breakEvenYears = breakEvenMonths / 12,
    savingsRatio = 0,
    annualSavings = savingsPerMonth * 12,
  } = outputs;

  // no-savings guard — newPayment >= oldPayment
  if (savingsPerMonth <= 0) {
    insights.push({
      id: "mortgage-refinance.no-benefit",
      title: "New payment is higher — no monthly savings",
      body: `Your new payment exceeds your current one. Refinancing would only make sense here if you're shortening your loan term or accessing equity — not reducing monthly costs.`,
      severity: "warning",
      category: "affordability-pressure",
    });
    return insights;
  }

  // fast-break-even — ≤ 24 months
  if (breakEvenMonths <= 24) {
    insights.push({
      id: "mortgage-refinance.fast-break-even",
      title: `Break-even in ${breakEvenMonths} months — strong case`,
      body: `You recover your $${closingCosts.toLocaleString()} closing costs in just ${breakEvenMonths} months. If you plan to stay longer than ${Math.ceil(breakEvenMonths / 12)} years, this refinance is likely worth it.`,
      severity: "positive",
      category: "investment-opportunity",
    });
  } else if (breakEvenMonths <= 48) {
    // moderate-break-even
    insights.push({
      id: "mortgage-refinance.moderate-break-even",
      title: `Break-even at ${Math.round(breakEvenYears * 10) / 10} years`,
      body: `It takes ${breakEvenMonths} months to recoup closing costs. If you plan to stay in the home beyond that, refinancing is a net positive. If not, you may come out behind.`,
      severity: "neutral",
      category: "affordability-pressure",
    });
  } else if (breakEvenMonths < 9999) {
    // slow-break-even
    insights.push({
      id: "mortgage-refinance.slow-break-even",
      title: `Long break-even: ${Math.round(breakEvenYears * 10) / 10} years`,
      body: `At ${breakEvenMonths} months to recoup closing costs, this refinance only makes financial sense if you're certain you'll stay in the home for at least ${Math.ceil(breakEvenYears + 1)} more years.`,
      severity: "warning",
      category: "debt-burden",
    });
  }

  // high-roi — getting back 3x or more on closing costs
  if (savingsRatio > 3) {
    insights.push({
      id: "mortgage-refinance.high-roi",
      title: `${savingsRatio.toFixed(1)}x return on closing costs`,
      body: `Your $${closingCosts.toLocaleString()} in closing costs generates $${Math.round(totalSavings).toLocaleString()} in net savings over ${years} years — a ${savingsRatio.toFixed(1)}x return. This is an exceptionally strong case for refinancing.`,
      severity: "positive",
      category: "investment-opportunity",
    });
  }

  // annual-savings — always fires
  insights.push({
    id: "mortgage-refinance.annual-savings",
    title: `Frees up $${annualSavings.toLocaleString()}/year`,
    body: `Saving $${savingsPerMonth.toLocaleString()}/month frees up $${annualSavings.toLocaleString()} per year — money that could go toward investments, debt payoff, or building an emergency fund.`,
    severity: "neutral",
    category: "opportunity-cost",
  });

  // lifetime-savings — always fires if positive
  if (totalSavings > 0) {
    insights.push({
      id:       "mortgage-refinance.lifetime-savings",
      title:    `${formatCurrency(Math.round(totalSavings))} net savings over ${years} years`,
      body:     `After paying ${formatCurrency(closingCosts)} in closing costs, you net ${formatCurrency(Math.round(totalSavings))} in total savings over your ${years}-year planning horizon.`,
      severity: "positive",
      category: "benchmark-comparison",
      metric:   { label: "Net savings over period", value: formatCurrency(Math.round(totalSavings)) },
      visualization: {
        type:   "delta-card",
        before: { label: "Closing costs paid",  value: formatCurrency(closingCosts) },
        after:  { label: `Savings over ${years}yr`, value: formatCurrency(Math.round(savingsPerMonth * 12 * years)) },
        delta:  { label: "Net gain",              value: formatCurrency(Math.round(totalSavings)), positive: true },
      },
    });
  } else {
    insights.push({
      id: "mortgage-refinance.net-negative",
      title: "Not enough time to break even",
      body: `Over ${years} years, you won't recoup the $${closingCosts.toLocaleString()} in closing costs. Consider whether you'll stay in the home longer before committing.`,
      severity: "warning",
      category: "affordability-pressure",
    });
  }

  return insights;
}
