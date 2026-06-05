import type { Insight } from "@/lib/insights/types";
import { formatCurrency } from "@/lib/insights/benchmarks";

export interface CreditCardPayoffInputs {
  balance: number;
  apr:     number;
  payment: number;
}

export interface CreditCardPayoffOutputs {
  months:                  number;
  interest:                number;
  totalPaid:               number;
  dailyInterestCost?:      number;
  monthlyInterestFirst?:   number;
  interestToBalanceRatio?: number;
  payoffYears?:            number;
}

// Federal Reserve 2024: average credit card APR 21.76%.
// CFPB 2024: Americans paid $130 billion in credit card interest/fees.
// Minimum payment trap: on $5,000 at 20% APR, minimum payments take 17+ years.

export function generateCreditCardPayoffInsights(
  inputs:  CreditCardPayoffInputs,
  outputs: CreditCardPayoffOutputs,
): Insight[] {
  const insights: Insight[] = [];

  const { balance, apr, payment } = inputs;
  const {
    months,
    interest,
    dailyInterestCost     = 0,
    monthlyInterestFirst  = 0,
    interestToBalanceRatio = 0,
    payoffYears           = 0,
  } = outputs;

  // 1. Daily interest drain — always shown
  if (dailyInterestCost > 0) {
    insights.push({
      id:       "cc.daily-drain",
      severity: "neutral",
      category: "hidden-cost",
      title:    `${formatCurrency(+dailyInterestCost.toFixed(2))} accrues in interest every single day`,
      body:     `At ${apr}% APR on a ${formatCurrency(balance)} balance, the first month's interest charge is ${formatCurrency(monthlyInterestFirst)} — ${formatCurrency(+dailyInterestCost.toFixed(2))}/day. The Federal Reserve reports the average credit card APR in 2024 is 21.76%. Americans paid $130 billion in credit card interest and fees that year (CFPB).`,
      metric:   { label: "Daily interest cost", value: `${formatCurrency(+dailyInterestCost.toFixed(2))}/day` },
    });
  }

  // 2. Predatory APR
  if (apr >= 25) {
    insights.push({
      id:       "cc.predatory-apr",
      severity: "warning",
      category: "debt-burden",
      title:    `${apr}% APR — above the 25% threshold regulators consider predatory`,
      body:     `Rates above 25% are among the highest legal credit card rates in the US. A balance transfer to a 0% introductory APR card — typically 12–21 months — stops all interest on the transferred balance. Even with a 3–5% transfer fee, the savings on ${formatCurrency(balance)} at ${apr}% are substantial.`,
      metric:   { label: "APR", value: `${apr}%` },
      visualization: {
        type:           "benchmark-bar",
        userValue:      apr,
        userLabel:      "Your APR",
        benchmarkValue: 21.76,
        benchmarkLabel: "Federal Reserve avg (2024)",
        format:         "number",
      },
    });
  } else if (apr >= 20) {
    insights.push({
      id:       "cc.high-apr",
      severity: "neutral",
      category: "debt-burden",
      title:    `${apr}% APR — above the 21.76% national average`,
      body:     `At ${apr}%, your rate is above the Federal Reserve 2024 average of 21.76%. In the first month alone, ${formatCurrency(monthlyInterestFirst)} of your ${formatCurrency(payment)} payment covers only interest — ${formatCurrency(Math.max(0, payment - monthlyInterestFirst))} goes toward principal.`,
      metric:   { label: "First month interest", value: formatCurrency(monthlyInterestFirst) },
    });
  }

  // 3. Interest exceeds balance
  if (interest > balance) {
    insights.push({
      id:       "cc.interest-exceeds-balance",
      severity: "warning",
      category: "debt-burden",
      title:    `Total interest ${formatCurrency(interest)} exceeds the original ${formatCurrency(balance)} balance`,
      body:     `You will pay ${formatCurrency(interest)} in interest on a ${formatCurrency(balance)} balance — the lender earns more from you than the amount you originally borrowed. Increasing the monthly payment by even ${formatCurrency(100)} meaningfully reduces both total interest and payoff time.`,
      metric:   { label: "Interest-to-balance ratio", value: `${Math.round(interestToBalanceRatio * 100)}%` },
      visualization: {
        type:   "delta-card",
        before: { label: "Original balance",                  value: formatCurrency(balance) },
        after:  { label: "Total paid (principal + interest)", value: formatCurrency(balance + interest) },
        delta:  { label: "Interest charged",                  value: formatCurrency(interest), positive: false },
      },
    });
  }

  // 4. Long payoff window
  if (months > 36) {
    insights.push({
      id:       "cc.long-haul",
      severity: "neutral",
      category: "debt-burden",
      title:    `${payoffYears} years to pay off at ${formatCurrency(payment)}/month`,
      body:     `At ${formatCurrency(payment)}/month, the payoff horizon is ${months} months (${payoffYears} years). A 0% APR balance transfer card pauses all interest for the introductory period — typically 12–21 months — letting every dollar reduce principal instead.`,
      metric:   { label: "Payoff timeline", value: `${payoffYears}yr` },
    });
  }

  // 5. Quick payoff — positive
  if (months <= 18 && months > 0) {
    insights.push({
      id:       "cc.quick-payoff",
      severity: "positive",
      category: "savings",
      title:    `Debt-free in ${months} months at ${formatCurrency(payment)}/month`,
      body:     `${months} months is ${payoffYears <= 1 ? "under a year" : `${payoffYears} years`}. Every additional dollar above ${formatCurrency(payment)}/month compresses the payoff date further — an extra ${formatCurrency(50)}/month on a ${months}-month payoff reduces the timeline by approximately ${Math.round(50 / (balance / months))} months.`,
      metric:   { label: "Payoff in", value: `${months} months` },
    });
  }

  return insights;
}
