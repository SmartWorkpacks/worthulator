// ─── Loan Payment Engine ──────────────────────────────────────────────────────
//
// Monthly payment, total cost, and interest for any fixed-rate installment loan
// (personal, auto, student, mortgage). The core principal+interest math reuses
// the shared amortization engine; this engine adds the "payment vs term length"
// comparison that's the heart of a loan-payment decision (shorter term = higher
// payment but far less total interest).
//
// Pure & synchronous. Guards zero/negative/NaN.

import { calculateAmortization } from "./amortizationEngine";

export interface LoanPaymentInputs {
  loanAmount: number;
  annualRatePct: number;
  termYears: number;
  extraMonthlyPayment?: number;
}

export interface LoanPaymentResult {
  monthlyPayment: number;
  totalPaid: number;
  totalInterest: number;
  interestPctOfPrincipal: number;
  // With optional extra payment:
  payoffMonths: number;
  interestSaved: number;
  monthsSaved: number;
  // Visuals:
  principalVsInterest: { label: string; amount: number }[];
  /** Monthly payment + total interest at a range of term lengths (decision view) */
  paymentByTerm: { termYears: number; monthlyPayment: number; totalInterest: number }[];
}

const round2 = (n: number) => Math.round(n * 100) / 100;

// Common installment-loan term lengths (years) to compare against.
const COMPARE_TERMS = [2, 3, 4, 5, 6, 7];

export function calculateLoanPayment(inputs: LoanPaymentInputs): LoanPaymentResult {
  const loanAmount = Math.max(0, inputs.loanAmount || 0);
  const annualRatePct = Math.max(0, inputs.annualRatePct || 0);
  const termYears = Math.max(0, inputs.termYears || 0);
  const extra = Math.max(0, inputs.extraMonthlyPayment || 0);

  const core = calculateAmortization({ loanAmount, annualRatePct, termYears, extraMonthlyPayment: extra });

  // Compare the chosen term against common alternatives (plus the chosen one).
  const termSet = Array.from(new Set([...COMPARE_TERMS, Math.round(termYears)]))
    .filter((t) => t > 0)
    .sort((a, b) => a - b);
  const paymentByTerm = termSet.map((t) => {
    const a = calculateAmortization({ loanAmount, annualRatePct, termYears: t });
    return { termYears: t, monthlyPayment: a.monthlyPayment, totalInterest: a.totalInterest };
  });

  return {
    monthlyPayment: core.monthlyPayment,
    totalPaid: core.totalPaid,
    totalInterest: core.totalInterest,
    interestPctOfPrincipal: core.interestPctOfPrincipal,
    payoffMonths: core.payoffMonths,
    interestSaved: core.interestSaved,
    monthsSaved: core.monthsSaved,
    principalVsInterest: [
      { label: "Principal", amount: round2(loanAmount) },
      { label: "Interest", amount: round2(core.totalInterest) },
    ],
    paymentByTerm,
  };
}
