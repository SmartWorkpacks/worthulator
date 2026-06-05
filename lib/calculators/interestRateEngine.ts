// ─── Interest Rate Solver Engine ──────────────────────────────────────────────
//
// The INVERSE of an amortization calculation: given the loan amount, the monthly
// payment, and the term, solve for the interest rate (APR). There's no closed-form
// solution, so we bisect on the monthly rate — the payment is strictly increasing
// in the rate, which makes bisection reliable.
//
//   Payment(r) = P · r / (1 − (1 + r)^−n)
//   Find r such that Payment(r) = the given monthly payment.
//
// Pure & synchronous. Guards zero/negative/NaN and the "payment too low" case.

export interface InterestRateInputs {
  loanAmount: number;
  monthlyPayment: number;
  termYears: number;
}

export interface InterestRateResult {
  annualRatePct: number;       // nominal APR (monthly rate × 12)
  monthlyRatePct: number;
  totalPaid: number;           // monthlyPayment × months
  totalInterest: number;       // totalPaid − loanAmount
  interestPctOfPrincipal: number;
  /** True when the payment is too small to ever amortize the loan */
  paymentTooLow: boolean;
  /** Implied APR across a range of monthly payments, for a line chart */
  rateByPayment: { x: number; y: number }[];
  /** Principal vs interest split, for a breakdown bar */
  breakdown: { label: string; amount: number }[];
}

const round = (n: number) => Math.round(n);
const round2 = (n: number) => Math.round(n * 100) / 100;
const round3 = (n: number) => Math.round(n * 1000) / 1000;

function paymentAtRate(P: number, r: number, n: number): number {
  if (r <= 0) return P / n;
  return (P * r) / (1 - Math.pow(1 + r, -n));
}

/** Solve for the monthly rate via bisection. Returns 0 if not solvable. */
function solveMonthlyRate(P: number, M: number, n: number): number {
  if (P <= 0 || M <= 0 || n <= 0) return 0;
  // Payment must exceed P/n (the 0% payment) to imply a positive rate.
  if (M <= P / n) return 0;
  // Payment can't exceed the principal itself per month in any sane loan; cap hi.
  let lo = 0;
  let hi = 1; // 100% per month — far above any real loan
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    const pay = paymentAtRate(P, mid, n);
    if (pay > M) hi = mid;
    else lo = mid;
    if (hi - lo < 1e-12) break;
  }
  return (lo + hi) / 2;
}

export function calculateInterestRate(inputs: InterestRateInputs): InterestRateResult {
  const P = Math.max(0, inputs.loanAmount || 0);
  const M = Math.max(0, inputs.monthlyPayment || 0);
  const termYears = Math.max(0, inputs.termYears || 0);
  const n = Math.round(termYears * 12);

  const zeroResult = (paymentTooLow: boolean): InterestRateResult => ({
    annualRatePct: 0,
    monthlyRatePct: 0,
    totalPaid: round(M * n),
    totalInterest: round(Math.max(0, M * n - P)),
    interestPctOfPrincipal: 0,
    paymentTooLow,
    rateByPayment: [],
    breakdown: [
      { label: "Principal", amount: round(P) },
      { label: "Interest", amount: round(Math.max(0, M * n - P)) },
    ],
  });

  if (P <= 0 || M <= 0 || n <= 0) return zeroResult(false);
  if (M <= P / n) return zeroResult(M < P / n);

  const r = solveMonthlyRate(P, M, n);
  const annualRatePct = round3(r * 12 * 100);
  const totalPaid = M * n;
  const totalInterest = totalPaid - P;

  // Implied APR for a band of monthly payments around the entered one.
  const base = P / n; // 0% payment floor
  const rateByPayment: { x: number; y: number }[] = [];
  for (let f = 0.7; f <= 1.45; f += 0.15) {
    const pay = Math.max(base + 1, M * f);
    rateByPayment.push({
      x: round(pay),
      y: round3(solveMonthlyRate(P, pay, n) * 12 * 100),
    });
  }

  return {
    annualRatePct,
    monthlyRatePct: round3(r * 100),
    totalPaid: round(totalPaid),
    totalInterest: round(totalInterest),
    interestPctOfPrincipal: P > 0 ? round2((totalInterest / P) * 100) : 0,
    paymentTooLow: false,
    rateByPayment,
    breakdown: [
      { label: "Principal", amount: round(P) },
      { label: "Interest", amount: round(Math.max(0, totalInterest)) },
    ],
  };
}
