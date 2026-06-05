import type { Insight } from "../types";
import { formatCurrency } from "../benchmarks";
import { futureValueAnnuity } from "../projections";

export interface CarAffordabilityInsightInputs {
  monthlyIncome:  number;
  loanTermMonths: number;
  annualRate:     number;
}

export interface CarAffordabilityInsightOutputs {
  maxMonthlyPayment?:   number;
  maxLoanAmount?:       number;
  recommendedCarPrice?: number;
}

// Typical non-loan ownership costs (insurance + fuel + maintenance), per month.
const OWNERSHIP_COSTS_MONTHLY = 375;
// The 20/4/10 rule caps financing at 48 months.
const RULE_TERM_MONTHS = 48;

export function carAffordabilityInsights(
  inputs:  CarAffordabilityInsightInputs,
  outputs: CarAffordabilityInsightOutputs,
): Insight[] {
  const income   = Number(inputs.monthlyIncome);
  const term     = Number(inputs.loanTermMonths);
  const rate     = Number(inputs.annualRate);
  const payment  = outputs.maxMonthlyPayment   ?? income * 0.15;
  const loan     = outputs.maxLoanAmount       ?? 0;
  const carPrice = outputs.recommendedCarPrice ?? (loan > 0 ? loan / 0.8 : 0);

  const totalPaid     = payment * term;
  const totalInterest = Math.max(0, totalPaid - loan);
  const trueMonthly   = payment + OWNERSHIP_COSTS_MONTHLY;

  const results: Insight[] = [];

  // 1. Headline — affordability summary
  results.push({
    id:       "car-affordability.headline",
    severity: "positive",
    category: "affordability",
    title:    `You can target a ${formatCurrency(carPrice)} car on ${formatCurrency(income)}/mo income`,
    body:     `The 15% rule caps your car payment at ${formatCurrency(payment)}/month, which finances ${formatCurrency(loan)} over ${term} months. With a 20% down payment, that points to roughly a ${formatCurrency(carPrice)} vehicle.`,
    metric:   { label: "Target car price", value: formatCurrency(carPrice) },
    priority: 100,
    visualization: {
      type:           "benchmark-bar",
      userValue:      payment,
      userLabel:      "Max payment",
      benchmarkValue: income,
      benchmarkLabel: "Monthly income",
      format:         "currency",
      caption:        { text: "Payment held to 15% of income" },
    },
  });

  // 2. True cost of ownership — the loan payment is only part of it
  results.push({
    id:       "car-affordability.true-cost",
    severity: "warning",
    category: "hidden-cost",
    title:    `Real monthly cost is closer to ${formatCurrency(trueMonthly)}`,
    body:     `Insurance, fuel, and maintenance add roughly ${formatCurrency(OWNERSHIP_COSTS_MONTHLY)}/month on top of the ${formatCurrency(payment)} loan payment. Budget for ${formatCurrency(trueMonthly)} all-in so the car does not quietly crowd out the rest of your finances.`,
    metric:   { label: "All-in monthly", value: formatCurrency(trueMonthly) },
    priority: 80,
    visualization: {
      type:   "delta-card",
      before: { label: "Loan payment", value: formatCurrency(payment) },
      after:  { label: "All-in monthly", value: formatCurrency(trueMonthly) },
      delta:  { label: "Ownership costs", value: `+${formatCurrency(OWNERSHIP_COSTS_MONTHLY)}`, positive: false },
    },
  });

  // 3. Interest paid over the term
  if (totalInterest > 0) {
    results.push({
      id:       "car-affordability.interest",
      severity: "neutral",
      category: "debt-burden",
      title:    `${formatCurrency(totalInterest)} of interest over ${term} months at ${rate.toFixed(1)}%`,
      body:     `Across the full term you would repay ${formatCurrency(totalPaid)} on a ${formatCurrency(loan)} loan — ${formatCurrency(totalInterest)} of it pure interest. A larger down payment or a shorter term cuts this directly.`,
      metric:   { label: "Total interest", value: formatCurrency(totalInterest) },
      priority: 60,
    });
  }

  // 4. 20/4/10 rule — term length warning
  if (term > RULE_TERM_MONTHS) {
    results.push({
      id:       "car-affordability.term-rule",
      severity: "warning",
      category: "warning",
      title:    `${term}-month term breaks the 20/4/10 rule`,
      body:     `The 20/4/10 guideline says finance for no more than 48 months. Stretching to ${term} months lowers the monthly payment but raises total interest and keeps you in negative equity longer — owing more than the car is worth.`,
      metric:   { label: "Term", value: `${term} mo` },
      priority: 50,
    });
  }

  // 5. Opportunity cost — investing the payment instead
  if (payment > 0) {
    const invested10yr = futureValueAnnuity(payment * 12, 10);
    results.push({
      id:       "car-affordability.opportunity-cost",
      severity: "neutral",
      category: "investment-opportunity",
      title:    `That payment invested for 10 years would be ${formatCurrency(invested10yr)}`,
      body:     `If the ${formatCurrency(payment)}/month went into an index fund at 7% instead, it would grow to about ${formatCurrency(invested10yr)} in a decade. A car is a depreciating asset — buying less car than the max frees real money to invest.`,
      metric:   { label: "10-year invested", value: formatCurrency(invested10yr) },
      priority: 40,
      visualization: {
        type:    "projection-line",
        format:  "currency",
        yLabel:  "Invested payment",
        points:  [
          { label: "Now", value: 0 },
          { label: "3yr", value: futureValueAnnuity(payment * 12, 3) },
          { label: "5yr", value: futureValueAnnuity(payment * 12, 5) },
          { label: "10yr", value: invested10yr },
        ],
        caption: { text: "Monthly payment invested at 7% instead of financed" },
      },
    });
  }

  return results.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
}
