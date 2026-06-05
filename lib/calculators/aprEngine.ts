// ─── APR (Annual Percentage Rate) Engine ──────────────────────────────────────
//
// APR is the *true* cost of borrowing: it folds upfront fees and points into an
// effective annual rate, which is why it's the figure US lenders must disclose
// (Truth in Lending Act). It's almost always higher than the note (interest) rate.
//
// Method:
//   1. The monthly payment is computed on the full loan at the note rate.
//   2. But you only RECEIVE (loan − fees) in hand.
//   3. APR is the rate that makes those payments amortize the NET amount received.
//      Solve via bisection (payment is strictly increasing in the rate).
//
// Reuses amortizationEngine for the level payment. Pure & synchronous; guards NaN.

import { calculateAmortization } from "./amortizationEngine";

export interface AprInputs {
  loanAmount: number;
  noteRatePct: number;       // the stated interest rate
  fees: number;              // origination, points, closing costs paid upfront
  termYears: number;
}

export interface AprResult {
  aprPct: number;
  noteRatePct: number;
  /** APR minus note rate — the cost of the fees expressed as rate (pts) */
  aprPremiumPct: number;
  monthlyPayment: number;    // based on the full loan at the note rate
  netReceived: number;       // loan − fees
  totalPayments: number;     // monthlyPayment × n
  totalInterest: number;     // totalPayments − loanAmount
  totalCost: number;         // totalInterest + fees
  /** APR across a range of fee amounts, for a line chart */
  aprByFees: { x: number; y: number }[];
  /** Interest vs fees, for a breakdown bar */
  breakdown: { label: string; amount: number }[];
}

const round = (n: number) => Math.round(n);
const round3 = (n: number) => Math.round(n * 1000) / 1000;

function paymentAtRate(P: number, r: number, n: number): number {
  if (r <= 0) return P / n;
  return (P * r) / (1 - Math.pow(1 + r, -n));
}

/** Solve the monthly rate that amortizes `principal` given a fixed `payment`. */
function solveMonthlyRate(principal: number, payment: number, n: number): number {
  if (principal <= 0 || payment <= 0 || n <= 0) return 0;
  if (payment <= principal / n) return 0;
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (paymentAtRate(principal, mid, n) > payment) hi = mid;
    else lo = mid;
    if (hi - lo < 1e-12) break;
  }
  return (lo + hi) / 2;
}

function aprFor(loanAmount: number, noteRatePct: number, fees: number, n: number): number {
  const payment = calculateAmortization({
    loanAmount,
    annualRatePct: noteRatePct,
    termYears: n / 12,
  }).monthlyPayment;
  const netReceived = Math.max(0, loanAmount - fees);
  if (netReceived <= 0) return noteRatePct;
  return solveMonthlyRate(netReceived, payment, n) * 12 * 100;
}

export function calculateApr(inputs: AprInputs): AprResult {
  const loanAmount = Math.max(0, inputs.loanAmount || 0);
  const noteRatePct = Math.max(0, inputs.noteRatePct || 0);
  const fees = Math.max(0, inputs.fees || 0);
  const termYears = Math.max(1, inputs.termYears || 1);
  const n = Math.round(termYears * 12);

  const amort = calculateAmortization({ loanAmount, annualRatePct: noteRatePct, termYears });
  const monthlyPayment = amort.monthlyPayment;
  const totalPayments = monthlyPayment * n;
  const totalInterest = Math.max(0, totalPayments - loanAmount);

  const aprPct = round3(aprFor(loanAmount, noteRatePct, fees, n));

  const maxFee = Math.max(fees * 2, loanAmount * 0.06, 1);
  const aprByFees: { x: number; y: number }[] = [];
  for (let i = 0; i <= 5; i++) {
    const f = (maxFee / 5) * i;
    aprByFees.push({ x: round(f), y: round3(aprFor(loanAmount, noteRatePct, f, n)) });
  }

  return {
    aprPct,
    noteRatePct: round3(noteRatePct),
    aprPremiumPct: round3(aprPct - noteRatePct),
    monthlyPayment: round(monthlyPayment),
    netReceived: round(Math.max(0, loanAmount - fees)),
    totalPayments: round(totalPayments),
    totalInterest: round(totalInterest),
    totalCost: round(totalInterest + fees),
    aprByFees,
    breakdown: [
      { label: "Interest", amount: round(totalInterest) },
      { label: "Upfront fees", amount: round(fees) },
    ],
  };
}
