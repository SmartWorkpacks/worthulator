// ─── Mortgage Payoff Engine ───────────────────────────────────────────────────
//
// For an EXISTING mortgage: how much sooner can you pay it off, and how much
// interest do you save, by adding extra monthly payments, a one-time lump sum,
// and/or switching to biweekly payments?
//
// Key modelling note: unlike a new-purchase calculator, the borrower keeps paying
// the SAME scheduled monthly payment. A lump sum reduces the starting balance but
// does NOT lower the payment — that's what accelerates payoff. We therefore
// simulate at a FIXED payment rather than recomputing a smaller one.
//
// Biweekly: paying half the monthly amount every two weeks = 26 half-payments =
// 13 monthly payments per year ≈ one extra monthly payment, modelled here as an
// added monthlyPayment ÷ 12 each month.
//
// The baseline monthly payment is derived from the amortization engine. Pure &
// synchronous. Guards zero/negative/NaN and non-amortizing payments.

import { calculateAmortization } from "./amortizationEngine";

export interface MortgagePayoffInputs {
  currentBalance: number;
  annualRatePct: number;
  remainingTermYears: number;
  extraMonthly?: number;
  lumpSum?: number;
  biweekly?: boolean;
}

export interface MortgagePayoffResult {
  monthlyPayment: number;
  baselinePayoffMonths: number;
  baselineTotalInterest: number;
  newPayoffMonths: number;
  newTotalInterest: number;
  monthsSaved: number;
  interestSaved: number;
  interestSavedPct: number;
  /** Months shaved off by various extra-monthly amounts (sensitivity) */
  savingsByExtra: { x: number; y: number }[];
  /** Interest comparison for a bar chart */
  interestComparison: { label: string; amount: number }[];
}

const round2 = (n: number) => Math.round(n * 100) / 100;

/** Simulate paying down `balance` at a FIXED monthly `payment`. */
function simulatePayoff(balance: number, monthlyRate: number, payment: number): { months: number; totalInterest: number } {
  if (balance <= 0) return { months: 0, totalInterest: 0 };
  if (payment <= balance * monthlyRate + 1e-9) {
    // Payment doesn't cover interest → never pays off.
    return { months: Infinity, totalInterest: Infinity };
  }
  let bal = balance;
  let totalInterest = 0;
  let months = 0;
  const hardCap = 1200; // 100 years
  while (bal > 0.005 && months < hardCap) {
    const interest = bal * monthlyRate;
    let principal = payment - interest;
    if (principal > bal) principal = bal;
    bal -= principal;
    totalInterest += interest;
    months += 1;
  }
  return { months, totalInterest };
}

export function calculateMortgagePayoff(inputs: MortgagePayoffInputs): MortgagePayoffResult {
  const currentBalance = Math.max(0, inputs.currentBalance || 0);
  const annualRatePct = Math.max(0, inputs.annualRatePct || 0);
  const remainingTermYears = Math.max(0, inputs.remainingTermYears || 0);
  const extraMonthly = Math.max(0, inputs.extraMonthly || 0);
  const lumpSum = Math.max(0, inputs.lumpSum || 0);
  const biweekly = !!inputs.biweekly;

  const r = annualRatePct / 100 / 12;
  const monthlyPayment = calculateAmortization({
    loanAmount: currentBalance,
    annualRatePct,
    termYears: remainingTermYears,
  }).monthlyPayment;

  const empty: MortgagePayoffResult = {
    monthlyPayment: 0,
    baselinePayoffMonths: 0, baselineTotalInterest: 0,
    newPayoffMonths: 0, newTotalInterest: 0,
    monthsSaved: 0, interestSaved: 0, interestSavedPct: 0,
    savingsByExtra: [{ x: 0, y: 0 }],
    interestComparison: [],
  };
  if (currentBalance <= 0 || remainingTermYears <= 0 || monthlyPayment <= 0) return empty;

  const baseline = simulatePayoff(currentBalance, r, monthlyPayment);
  const biweeklyExtra = biweekly ? monthlyPayment / 12 : 0;
  const totalExtra = extraMonthly + biweeklyExtra;

  const accel = simulatePayoff(Math.max(0, currentBalance - lumpSum), r, monthlyPayment + totalExtra);

  const baselineMonths = Number.isFinite(baseline.months) ? baseline.months : Math.round(remainingTermYears * 12);
  const baselineInterest = Number.isFinite(baseline.totalInterest) ? baseline.totalInterest : 0;
  const newMonths = Number.isFinite(accel.months) ? accel.months : baselineMonths;
  const newInterest = Number.isFinite(accel.totalInterest) ? accel.totalInterest : baselineInterest;

  const savingsByExtra = [0, 50, 100, 200, 300, 500].map((x) => {
    const sim = simulatePayoff(Math.max(0, currentBalance - lumpSum), r, monthlyPayment + x + biweeklyExtra);
    const m = Number.isFinite(sim.months) ? sim.months : baselineMonths;
    return { x, y: Math.max(0, baselineMonths - m) };
  });

  return {
    monthlyPayment: round2(monthlyPayment),
    baselinePayoffMonths: baselineMonths,
    baselineTotalInterest: round2(baselineInterest),
    newPayoffMonths: newMonths,
    newTotalInterest: round2(newInterest),
    monthsSaved: Math.max(0, baselineMonths - newMonths),
    interestSaved: round2(Math.max(0, baselineInterest - newInterest)),
    interestSavedPct: baselineInterest > 0 ? Math.round(((baselineInterest - newInterest) / baselineInterest) * 100) : 0,
    savingsByExtra,
    interestComparison: [
      { label: "Current plan", amount: round2(baselineInterest) },
      { label: "With payoff plan", amount: round2(newInterest) },
    ],
  };
}
