// ─── HELOC Engine ─────────────────────────────────────────────────────────────
//
// Home Equity Line of Credit. Two things matter to a borrower:
//   1. How big a line can I get? = (home value × max CLTV) − existing mortgage.
//   2. What's the "payment shock"? HELOCs are usually interest-only during the
//      DRAW period, then fully amortizing during the REPAYMENT period — so the
//      monthly payment can jump sharply when the draw period ends.
//
// CLTV = combined loan-to-value (existing mortgage + HELOC) ÷ home value.
// Lenders commonly cap CLTV around 80–85%.
//
// Repayment-period P&I reuses the shared amortization engine. HELOC rates are
// variable and typically priced near the Prime Rate (Prime ≈ Fed Funds + 3.0).
//
// Pure & synchronous. Guards zero/negative/NaN.

import { calculateAmortization } from "./amortizationEngine";

/** Documented spread of the US Prime Rate over the effective Fed Funds rate. */
export const PRIME_OVER_FED_FUNDS = 3.0;

export interface HelocInputs {
  homeValue: number;
  mortgageBalance: number;
  /** Max combined loan-to-value the lender allows (%), e.g. 85 */
  maxCltvPct: number;
  /** Amount the borrower wants to draw */
  drawAmount: number;
  /** Annual rate / APR (%) — variable; defaults near Prime */
  annualRatePct: number;
  /** Interest-only draw period (years) */
  drawYears: number;
  /** Amortizing repayment period (years) */
  repayYears: number;
}

export interface HelocResult {
  currentEquity: number;
  currentEquityPct: number;
  /** Largest line available given the CLTV cap and existing mortgage */
  maxLine: number;
  /** Draw clamped to the available line */
  borrowed: number;
  exceedsLimit: boolean;
  /** Interest-only monthly payment during the draw period */
  interestOnlyPayment: number;
  /** Fully-amortizing monthly payment during the repayment period */
  repaymentPayment: number;
  /** Multiple by which the payment jumps when the draw period ends */
  paymentShockMultiple: number;
  interestDuringDraw: number;
  interestDuringRepay: number;
  totalInterest: number;
  totalCost: number;
  /** Monthly payment by year across draw + repayment (shows the shock) */
  paymentTimeline: { x: number; y: number }[];
  /** Phase comparison for a bar chart */
  paymentByPhase: { label: string; amount: number }[];
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export function calculateHeloc(inputs: HelocInputs): HelocResult {
  const homeValue = Math.max(0, inputs.homeValue || 0);
  const mortgageBalance = Math.max(0, inputs.mortgageBalance || 0);
  const maxCltvPct = Math.min(100, Math.max(0, inputs.maxCltvPct || 0));
  const annualRatePct = Math.max(0, inputs.annualRatePct || 0);
  const drawYears = Math.max(0, Math.round(inputs.drawYears || 0));
  const repayYears = Math.max(0, Math.round(inputs.repayYears || 0));
  const wantDraw = Math.max(0, inputs.drawAmount || 0);

  const currentEquity = Math.max(0, homeValue - mortgageBalance);
  const maxLine = Math.max(0, homeValue * (maxCltvPct / 100) - mortgageBalance);
  const borrowed = Math.min(wantDraw, maxLine);
  const exceedsLimit = wantDraw > maxLine + 0.01;

  const monthlyRate = annualRatePct / 100 / 12;
  const interestOnlyPayment = borrowed * monthlyRate;

  const repayAmort = calculateAmortization({
    loanAmount: borrowed,
    annualRatePct,
    termYears: repayYears,
  });
  const repaymentPayment = repayAmort.monthlyPayment;

  const interestDuringDraw = interestOnlyPayment * drawYears * 12;
  const interestDuringRepay = repayAmort.totalInterest;
  const totalInterest = interestDuringDraw + interestDuringRepay;

  // Year-by-year payment: flat interest-only through the draw, then the higher
  // amortizing payment through repayment.
  const paymentTimeline: { x: number; y: number }[] = [];
  for (let y = 1; y <= drawYears; y++) paymentTimeline.push({ x: y, y: round2(interestOnlyPayment) });
  for (let y = 1; y <= repayYears; y++) paymentTimeline.push({ x: drawYears + y, y: round2(repaymentPayment) });
  if (paymentTimeline.length === 0) paymentTimeline.push({ x: 0, y: 0 });

  return {
    currentEquity: round2(currentEquity),
    currentEquityPct: homeValue > 0 ? Math.round((currentEquity / homeValue) * 100) : 0,
    maxLine: round2(maxLine),
    borrowed: round2(borrowed),
    exceedsLimit,
    interestOnlyPayment: round2(interestOnlyPayment),
    repaymentPayment: round2(repaymentPayment),
    paymentShockMultiple: interestOnlyPayment > 0 ? round2(repaymentPayment / interestOnlyPayment) : 0,
    interestDuringDraw: round2(interestDuringDraw),
    interestDuringRepay: round2(interestDuringRepay),
    totalInterest: round2(totalInterest),
    totalCost: round2(borrowed + totalInterest),
    paymentTimeline,
    paymentByPhase: [
      { label: "Draw (interest-only)", amount: round2(interestOnlyPayment) },
      { label: "Repayment (P&I)", amount: round2(repaymentPayment) },
    ].filter((p) => p.amount > 0),
  };
}
