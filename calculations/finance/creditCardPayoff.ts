// ─── Credit Card Payoff ───────────────────────────────────────────────────────
//
// Fixed-payment payoff schedule: months to clear, total interest, and the
// hidden daily / first-month interest drain. Pure module — no datasets.
// Loop caps at 600 months (50 yr) as a safety bound.
// ─────────────────────────────────────────────────────────────────────────────

export interface CreditCardPayoffInputs {
  balance: number;
  apr: number;
  payment: number;
}

export interface CreditCardPayoffResult {
  months: number;
  interest: number;
  totalPaid: number;
  dailyInterestCost: number;
  monthlyInterestFirst: number;
  interestToBalanceRatio: number;
  payoffYears: number;
  [key: string]: number;
}

const MAX_MONTHS = 600;

export function calculateCreditCardPayoff(
  inputs: CreditCardPayoffInputs,
): CreditCardPayoffResult {
  const principal = inputs.balance;
  const monthlyRate = inputs.apr / 100 / 12;
  const pmt = inputs.payment;

  let balance = principal;
  let months = 0;
  let interest = 0;
  while (balance > 0 && months < MAX_MONTHS) {
    const interestMonth = balance * monthlyRate;
    interest += interestMonth;
    balance = balance + interestMonth - pmt;
    months++;
  }

  return {
    months,
    interest: Math.round(interest),
    totalPaid: Math.round(interest + principal),
    dailyInterestCost: Math.round((principal * inputs.apr / 100 / 365) * 100) / 100,
    monthlyInterestFirst: Math.round(principal * monthlyRate),
    interestToBalanceRatio: principal > 0 ? Math.round((interest / principal) * 100) / 100 : 0,
    payoffYears: Math.round((months / 12) * 10) / 10,
  };
}
