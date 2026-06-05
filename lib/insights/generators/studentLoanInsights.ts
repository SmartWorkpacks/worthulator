import type { Insight } from "../types";
import { formatCurrency } from "../benchmarks";

export interface StudentLoanInputs {
  loan: number;
  rate: number;
  term: number; // months
}

export interface StudentLoanOutputs {
  payment: number;
  totalPaid: number;
  interest: number;
  interestToLoanRatio?: number;
  totalCostMultiple?: number;
  dailyInterestCost?: number;
}

export function generateStudentLoanInsights(
  inputs: StudentLoanInputs,
  outputs: StudentLoanOutputs,
): Insight[] {
  const insights: Insight[] = [];
  const { loan, rate, term } = inputs;
  const {
    payment,
    interest,
    interestToLoanRatio = 0,
    totalCostMultiple = 1,
    dailyInterestCost = 0,
  } = outputs;

  const termYears = term / 12;

  // monthly-context — always fires
  insights.push({
    id: "student-loan.monthly-context",
    title: `$${payment.toFixed(0)}/month for ${termYears} years`,
    body: `Your monthly payment of $${payment.toFixed(0)} commits $${Math.round(payment * 12).toLocaleString()} per year of your income to loan repayment over the next ${termYears} years.`,
    severity: "neutral",
    category: "affordability-pressure",
  });

  // interest-heavy — paying 50%+ extra
  if (interestToLoanRatio > 0.5) {
    insights.push({
      id:       "student-loan.interest-heavy",
      title:    `You borrowed ${formatCurrency(loan)} and will pay back ${formatCurrency(Math.round(outputs.totalPaid))}`,
      body:     `Interest adds ${Math.round(interestToLoanRatio * 100)}% to the original loan — ${formatCurrency(Math.round(interest))} on top of the ${formatCurrency(loan)} you received. Every extra payment made early reduces the interest total dollar for dollar, because the interest is calculated on the remaining balance.`,
      severity: "warning",
      category: "hidden-cost",
      metric:   { label: "Total interest paid", value: formatCurrency(Math.round(interest)) },
      visualization: {
        type:   "delta-card",
        before: { label: "Amount borrowed",    value: formatCurrency(loan) },
        after:  { label: "Total repaid",        value: formatCurrency(Math.round(outputs.totalPaid)) },
        delta:  { label: "Interest cost",       value: formatCurrency(Math.round(interest)), positive: false },
      },
    });
  } else if (interestToLoanRatio > 0.2) {
    // moderate-interest
    insights.push({
      id: "student-loan.moderate-interest",
      title: `You'll pay ${Math.round(interestToLoanRatio * 100)}% in interest`,
      body: `Your total repayment is $${Math.round(interest).toLocaleString()} above what you borrowed. This is within the typical range, but every extra payment you make directly reduces this figure.`,
      severity: "neutral",
      category: "debt-burden",
    });
  }

  // high-total-multiple — total cost 30%+ above loan
  if (totalCostMultiple > 1.3) {
    insights.push({
      id: "student-loan.high-total-multiple",
      title: `Paying ${(totalCostMultiple).toFixed(2)}x your original loan`,
      body: `For every $1 you borrowed, you'll repay $${totalCostMultiple.toFixed(2)}. Refinancing to a lower rate could reduce this multiplier significantly.`,
      severity: totalCostMultiple > 1.6 ? "warning" : "neutral",
      category: "opportunity-cost",
    });
  }

  // refinance-opportunity — rate ≥ 6%
  if (rate >= 6) {
    insights.push({
      id: "student-loan.refinance-opportunity",
      title: "Refinancing could save thousands",
      body: `At ${rate}% interest, each 1% rate reduction saves roughly $${Math.round(loan * 0.01 * termYears / 2).toLocaleString()} over your loan term. Private refinancing may offer significantly lower rates depending on your credit score.`,
      severity: "neutral",
      category: "investment-opportunity",
    });
  }

  // short-term-benefit — term ≤ 60 months (5 years)
  if (term <= 60) {
    insights.push({
      id: "student-loan.short-term-benefit",
      title: "Shorter term = less total interest",
      body: `Choosing a ${termYears}-year repayment term keeps your interest costs lower than the standard 10-year plan — though the higher monthly payment requires budget discipline.`,
      severity: "positive",
      category: "benchmark-comparison",
    });
  }

  // daily-cost — framing
  insights.push({
    id: "student-loan.daily-cost",
    title: `Costs $${dailyInterestCost.toFixed(2)}/day in interest`,
    body: `This loan accrues $${dailyInterestCost.toFixed(2)} in interest every day it's outstanding. Extra payments made early eliminate this daily drain permanently.`,
    severity: "neutral",
    category: "hidden-cost",
  });

  return insights;
}
