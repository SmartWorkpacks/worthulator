// ─── Home Equity Loan Engine ──────────────────────────────────────────────────
//
// A home equity loan is a fixed-rate, lump-sum SECOND mortgage: you borrow a set
// amount against your equity and repay it in equal monthly payments over a fixed
// term. (Contrast with a HELOC, which is a revolving, usually variable-rate line.)
//
// This engine computes:
//   • Available equity and the maximum loan allowed by a combined-LTV (CLTV) cap
//   • The fixed monthly payment, total interest, and total cost
//   • Combined loan-to-value after borrowing
//   • A payment-by-term comparison (shorter term = higher payment, less interest)
//
// Reuses amortizationEngine for the level-payment math.
//
// Pure & synchronous. Guards zero/negative/NaN.

import { calculateAmortization } from "./amortizationEngine";

export interface HomeEquityLoanInputs {
  homeValue: number;
  mortgageBalance: number;
  /** Requested loan amount (lump sum) */
  loanAmount: number;
  annualRatePct: number;
  termYears: number;
  /** Max combined loan-to-value lenders allow (default 85%) */
  maxCltvPct?: number;
}

export interface HomeEquityLoanResult {
  availableEquity: number;       // homeValue − mortgageBalance
  maxLoan: number;               // most you can borrow under the CLTV cap
  loanAmount: number;            // the (validated, non-negative) requested amount
  exceedsMax: boolean;           // requested > maxLoan
  monthlyPayment: number;        // fixed P&I payment
  totalInterest: number;
  totalCost: number;             // principal + interest
  combinedLtvPct: number;        // (mortgageBalance + loanAmount) / homeValue
  /** Monthly payment at each term option, for a comparison chart */
  paymentByTerm: { x: number; y: number }[];
}

/** Default fixed APR spread of a home equity loan over the 30-yr mortgage rate. */
export const HE_LOAN_SPREAD_OVER_MORTGAGE = 2.0;

const round = (n: number) => Math.round(n);

const TERM_OPTIONS = [5, 10, 15, 20, 30];

export function calculateHomeEquityLoan(inputs: HomeEquityLoanInputs): HomeEquityLoanResult {
  const homeValue = Math.max(0, inputs.homeValue || 0);
  const mortgageBalance = Math.max(0, inputs.mortgageBalance || 0);
  const annualRatePct = Math.max(0, inputs.annualRatePct || 0);
  const termYears = Math.max(1, inputs.termYears || 1);
  const maxCltvPct = Math.min(100, Math.max(0, inputs.maxCltvPct ?? 85));

  const availableEquity = Math.max(0, homeValue - mortgageBalance);
  const maxLoan = Math.max(0, homeValue * (maxCltvPct / 100) - mortgageBalance);
  const requested = Math.max(0, inputs.loanAmount || 0);
  const exceedsMax = requested > maxLoan + 0.5;

  const amort = calculateAmortization({
    loanAmount: requested,
    annualRatePct,
    termYears,
  });

  const combinedLtvPct =
    homeValue > 0 ? ((mortgageBalance + requested) / homeValue) * 100 : 0;

  const paymentByTerm = TERM_OPTIONS.map((t) => ({
    x: t,
    y: round(
      calculateAmortization({ loanAmount: requested, annualRatePct, termYears: t }).monthlyPayment,
    ),
  }));

  return {
    availableEquity: round(availableEquity),
    maxLoan: round(maxLoan),
    loanAmount: round(requested),
    exceedsMax,
    monthlyPayment: round(amort.monthlyPayment),
    totalInterest: round(amort.totalInterest),
    totalCost: round(requested + amort.totalInterest),
    combinedLtvPct: Math.round(combinedLtvPct * 10) / 10,
    paymentByTerm,
  };
}
