// ─── Credit Card Interest ─────────────────────────────────────────────────────
//
// Fixed monthly payment vs. a revolving balance: how many months to clear, the
// total interest, and the share of every payment lost to interest. Pure module.
// If the payment can't cover the first month's interest, payoff is impossible —
// represented as months = 600 (the safety cap) with zeroed totals.
// ─────────────────────────────────────────────────────────────────────────────

export interface CreditCardInterestInputs {
  balance: number;
  apr: number;
  monthlyPayment: number;
}

export interface CreditCardInterestResult {
  monthsToPayoff: number;
  totalInterest: number;
  totalPaid: number;
  interestOfTotal: number;
  interestToBalanceRatio: number;
  yearsToPayoff: number;
  dailyInterestCost: number;
  [key: string]: number;
}

const MAX_MONTHS = 600;

export function calculateCreditCardInterest(
  inputs: CreditCardInterestInputs,
): CreditCardInterestResult {
  const balance = inputs.balance;
  const monthlyRate = inputs.apr / 100 / 12;
  const payment = inputs.monthlyPayment;

  let remaining = balance;
  let months = 0;
  while (remaining > 0 && months < MAX_MONTHS) {
    const interest = remaining * monthlyRate;
    if (payment <= interest) {
      months = MAX_MONTHS;
      break;
    }
    remaining = remaining + interest - payment;
    months++;
  }

  const cleared = months < MAX_MONTHS;
  const totalPaid = cleared ? months * payment : 0;
  const totalInterest = cleared ? totalPaid - balance : 0;
  const interestOfTotal = totalPaid > 0 ? (totalInterest / totalPaid) * 100 : 0;

  return {
    monthsToPayoff: months,
    totalInterest,
    totalPaid,
    interestOfTotal,
    interestToBalanceRatio: balance > 0 ? Math.round((totalInterest / balance) * 100) / 100 : 0,
    yearsToPayoff: cleared ? Math.round((months / 12) * 10) / 10 : 0,
    dailyInterestCost: Math.round((balance * inputs.apr / 100 / 365) * 100) / 100,
  };
}
