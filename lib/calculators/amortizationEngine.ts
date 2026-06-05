// ─── Amortization Engine ──────────────────────────────────────────────────────
//
// Pure loan-amortization math for any fixed-rate, fully-amortizing loan
// (mortgage, auto, personal, student). Computes the level monthly payment, the
// full principal/interest split, a year-by-year schedule, and the effect of an
// optional extra monthly payment.
//
// Standard amortization formula (level payment):
//   M = P · r / (1 − (1 + r)^−n)
//   where r = monthly rate (APR/12), n = number of monthly payments, P = principal.
//   When r = 0, M = P / n.
//
// Pure & synchronous. Guards zero/negative/NaN — never returns NaN/Infinity.

export interface AmortizationInputs {
  /** Loan principal (borrowed amount) */
  loanAmount: number;
  /** Annual interest rate / APR, in percent (e.g. 6.7) */
  annualRatePct: number;
  /** Loan term in years */
  termYears: number;
  /** Optional extra payment applied to principal each month (default 0) */
  extraMonthlyPayment?: number;
}

export interface AmortizationYear {
  year: number;
  principalPaid: number;
  interestPaid: number;
  /** Remaining balance at end of the year */
  endingBalance: number;
}

export interface AmortizationResult {
  /** Level monthly payment (principal + interest), excluding any extra */
  monthlyPayment: number;
  /** Scheduled number of monthly payments (termYears × 12) */
  scheduledPayments: number;
  /** Total of all payments over the life of the loan (no extra) */
  totalPaid: number;
  /** Total interest paid over the life of the loan (no extra) */
  totalInterest: number;
  /** Total interest as a percentage of the principal */
  interestPctOfPrincipal: number;
  // With the optional extra payment applied:
  payoffMonths: number;
  totalInterestWithExtra: number;
  interestSaved: number;
  monthsSaved: number;
  // Visual series (no-extra schedule):
  schedule: AmortizationYear[];
  /** Remaining balance by year, for a line chart */
  balanceCurve: { x: number; y: number }[];
  /** Principal vs interest split, for a breakdown bar chart */
  principalVsInterest: { label: string; amount: number }[];
}

const round2 = (n: number) => Math.round(n * 100) / 100;

/** Level monthly payment for principal P, monthly rate r, n payments. */
function levelPayment(P: number, r: number, n: number): number {
  if (n <= 0 || P <= 0) return 0;
  if (r === 0) return P / n;
  return (P * r) / (1 - Math.pow(1 + r, -n));
}

/**
 * Simulate the loan month by month, returning total interest, payoff month,
 * and an optional year-by-year schedule.
 */
function simulate(
  P: number,
  r: number,
  payment: number,
  maxMonths: number,
  withSchedule: boolean,
): { totalInterest: number; payoffMonths: number; schedule: AmortizationYear[] } {
  let balance = P;
  let totalInterest = 0;
  let months = 0;
  const schedule: AmortizationYear[] = [];
  let yearInterest = 0;
  let yearPrincipal = 0;

  // Cap iterations so a too-small payment can't loop forever.
  const hardCap = Math.max(maxMonths, Math.ceil(maxMonths * 1.5)) + 12;

  while (balance > 0.005 && months < hardCap) {
    const interest = balance * r;
    let principalPortion = payment - interest;
    // Payment doesn't even cover interest → loan never amortizes; bail out.
    if (principalPortion <= 0) {
      return { totalInterest: Infinity, payoffMonths: Infinity, schedule };
    }
    if (principalPortion > balance) principalPortion = balance;
    balance -= principalPortion;
    totalInterest += interest;
    months += 1;
    yearInterest += interest;
    yearPrincipal += principalPortion;

    if (withSchedule && (months % 12 === 0 || balance <= 0.005)) {
      schedule.push({
        year: Math.ceil(months / 12),
        principalPaid: round2(yearPrincipal),
        interestPaid: round2(yearInterest),
        endingBalance: round2(Math.max(0, balance)),
      });
      yearInterest = 0;
      yearPrincipal = 0;
    }
  }

  return { totalInterest, payoffMonths: months, schedule };
}

export function calculateAmortization(inputs: AmortizationInputs): AmortizationResult {
  const loanAmount = Math.max(0, inputs.loanAmount || 0);
  const annualRatePct = Math.max(0, inputs.annualRatePct || 0);
  const termYears = Math.max(0, inputs.termYears || 0);
  const extra = Math.max(0, inputs.extraMonthlyPayment || 0);

  const r = annualRatePct / 100 / 12;
  const n = Math.round(termYears * 12);

  const empty: AmortizationResult = {
    monthlyPayment: 0,
    scheduledPayments: n,
    totalPaid: 0,
    totalInterest: 0,
    interestPctOfPrincipal: 0,
    payoffMonths: 0,
    totalInterestWithExtra: 0,
    interestSaved: 0,
    monthsSaved: 0,
    schedule: [],
    balanceCurve: [{ x: 0, y: 0 }],
    principalVsInterest: [],
  };

  if (loanAmount <= 0 || n <= 0) return empty;

  const monthlyPayment = levelPayment(loanAmount, r, n);

  // Baseline (no extra) — also yields the schedule.
  const base = simulate(loanAmount, r, monthlyPayment, n, true);
  const totalInterest = Number.isFinite(base.totalInterest) ? base.totalInterest : 0;
  const totalPaid = loanAmount + totalInterest;

  // With extra payment.
  const withExtra =
    extra > 0 ? simulate(loanAmount, r, monthlyPayment + extra, n, false) : base;
  const totalInterestWithExtra = Number.isFinite(withExtra.totalInterest)
    ? withExtra.totalInterest
    : totalInterest;
  const payoffMonths = Number.isFinite(withExtra.payoffMonths) ? withExtra.payoffMonths : n;

  const balanceCurve = [{ x: 0, y: loanAmount }].concat(
    base.schedule.map((y) => ({ x: y.year, y: y.endingBalance })),
  );

  return {
    monthlyPayment: round2(monthlyPayment),
    scheduledPayments: n,
    totalPaid: round2(totalPaid),
    totalInterest: round2(totalInterest),
    interestPctOfPrincipal: loanAmount > 0 ? Math.round((totalInterest / loanAmount) * 100) : 0,
    payoffMonths,
    totalInterestWithExtra: round2(totalInterestWithExtra),
    interestSaved: round2(Math.max(0, totalInterest - totalInterestWithExtra)),
    monthsSaved: Math.max(0, n - payoffMonths),
    schedule: base.schedule,
    balanceCurve,
    principalVsInterest: [
      { label: "Principal", amount: round2(loanAmount) },
      { label: "Interest", amount: round2(totalInterest) },
    ],
  };
}
