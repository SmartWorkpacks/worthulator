// ─── Annuity Payout Engine ────────────────────────────────────────────────────
//
// For an immediate fixed annuity (period-certain): you hand over a lump sum
// (premium), it earns a fixed rate, and it pays you a level income for a set
// number of years. The payout math is the mirror image of a loan payment —
// the insurer "amortizes" your principal back to you plus interest.
//
//   Payment = P · r / (1 − (1 + r)^−n)        (r = monthly rate, n = months)
//   When r = 0: Payment = P / n
//
// Reuses amortizationEngine for the level-payment formula.
//
// Pure & synchronous. Guards zero/negative/NaN.

import { calculateAmortization } from "./amortizationEngine";

export interface AnnuityInputs {
  /** Lump sum / premium paid into the annuity */
  principal: number;
  /** Annual interest/crediting rate, in percent */
  annualRatePct: number;
  /** Number of years the annuity pays out (period certain) */
  payoutYears: number;
}

export interface AnnuityResult {
  monthlyPayout: number;
  annualPayout: number;
  totalPayout: number;        // sum of all payments over the payout period
  interestEarned: number;     // totalPayout − principal
  /** Total payout as a multiple of the premium (e.g. 1.4×) */
  payoutMultiple: number;
  /** Monthly payout at different payout lengths, for a line chart */
  payoutByTerm: { x: number; y: number }[];
  /** Principal returned vs interest earned, for a breakdown bar */
  breakdown: { label: string; amount: number }[];
}

const round = (n: number) => Math.round(n);
const round2 = (n: number) => Math.round(n * 100) / 100;

const TERM_OPTIONS = [5, 10, 15, 20, 25, 30];

export function calculateAnnuity(inputs: AnnuityInputs): AnnuityResult {
  const principal = Math.max(0, inputs.principal || 0);
  const annualRatePct = Math.max(0, inputs.annualRatePct || 0);
  const payoutYears = Math.max(1, Math.round(inputs.payoutYears || 1));

  const amort = calculateAmortization({
    loanAmount: principal,
    annualRatePct,
    termYears: payoutYears,
  });

  const monthlyPayout = amort.monthlyPayment;
  const totalPayout = monthlyPayout * payoutYears * 12;
  const interestEarned = totalPayout - principal;

  const payoutByTerm = TERM_OPTIONS.map((t) => ({
    x: t,
    y: round(
      calculateAmortization({ loanAmount: principal, annualRatePct, termYears: t }).monthlyPayment,
    ),
  }));

  return {
    monthlyPayout: round(monthlyPayout),
    annualPayout: round(monthlyPayout * 12),
    totalPayout: round(totalPayout),
    interestEarned: round(interestEarned),
    payoutMultiple: principal > 0 ? round2(totalPayout / principal) : 0,
    payoutByTerm,
    breakdown: [
      { label: "Your premium", amount: round(principal) },
      { label: "Interest earned", amount: round(Math.max(0, interestEarned)) },
    ],
  };
}
