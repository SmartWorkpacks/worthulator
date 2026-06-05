export interface PersonalLoanInputs {
  loanAmount: number; // principal borrowed (repaid in full)
  aprPct: number; // annual percentage rate on the loan (live default, editable)
  termMonths: number; // loan term
  originationFeePct: number; // up-front fee deducted from the disbursed amount
}

export interface PersonalLoanSchedulePoint {
  month: number;
  balance: number;
  interestPaid: number; // cumulative interest to this month
}

export interface PersonalLoanResult {
  loanAmount: number;
  aprPct: number;
  termMonths: number;
  originationFeePct: number;
  originationFee: number;
  netDisbursed: number; // cash you actually receive
  monthlyPayment: number;
  totalRepaid: number; // monthlyPayment × term
  totalInterest: number;
  totalCost: number; // interest + origination fee
  effectiveAprPct: number; // true APR once the fee is included
  schedule: PersonalLoanSchedulePoint[];
  breakdown: { label: string; amount: number; colorClass: string }[];
}

function safeNum(n: number, fallback = 0) {
  return Number.isFinite(n) ? n : fallback;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function round2(n: number) {
  return Math.round(n * 100) / 100;
}

// Monthly payment per the standard amortization formula.
function amortizedPayment(principal: number, monthlyRate: number, months: number): number {
  if (months <= 0) return 0;
  if (monthlyRate <= 0) return principal / months;
  const pow = Math.pow(1 + monthlyRate, -months);
  return (principal * monthlyRate) / (1 - pow);
}

// Present value of a level payment stream at a given monthly rate.
function presentValue(payment: number, monthlyRate: number, months: number): number {
  if (months <= 0) return 0;
  if (monthlyRate <= 0) return payment * months;
  return payment * ((1 - Math.pow(1 + monthlyRate, -months)) / monthlyRate);
}

// Effective APR: the rate at which the payment stream's present value equals the
// net cash disbursed (principal minus the up-front fee). Solved by bisection.
function solveEffectiveApr(payment: number, netDisbursed: number, months: number): number {
  if (payment <= 0 || netDisbursed <= 0 || months <= 0) return 0;
  // If PV at 0% already <= net disbursed, there is no positive rate (no real cost).
  if (payment * months <= netDisbursed) return 0;
  let lo = 0;
  let hi = 1; // 100% monthly rate is a generous upper bound
  for (let i = 0; i < 100; i++) {
    const mid = (lo + hi) / 2;
    const pv = presentValue(payment, mid, months);
    if (pv > netDisbursed) {
      lo = mid;
    } else {
      hi = mid;
    }
  }
  const monthlyRate = (lo + hi) / 2;
  return monthlyRate * 12 * 100;
}

export function calculatePersonalLoan(input: PersonalLoanInputs): PersonalLoanResult {
  const loanAmount = Math.max(0, safeNum(input.loanAmount));
  const aprPct = clamp(safeNum(input.aprPct), 0, 60);
  const termMonths = clamp(Math.round(safeNum(input.termMonths)), 1, 120);
  const originationFeePct = clamp(safeNum(input.originationFeePct), 0, 15);

  const monthlyRate = aprPct / 100 / 12;
  const monthlyPayment = amortizedPayment(loanAmount, monthlyRate, termMonths);
  const totalRepaid = monthlyPayment * termMonths;
  const totalInterest = Math.max(0, totalRepaid - loanAmount);

  const originationFee = loanAmount * (originationFeePct / 100);
  const netDisbursed = Math.max(0, loanAmount - originationFee);
  const totalCost = totalInterest + originationFee;
  const effectiveAprPct = solveEffectiveApr(monthlyPayment, netDisbursed, termMonths);

  // Amortization schedule (loan balance declining to ~0).
  const schedule: PersonalLoanSchedulePoint[] = [{ month: 0, balance: round2(loanAmount), interestPaid: 0 }];
  let balance = loanAmount;
  let cumulativeInterest = 0;
  for (let m = 1; m <= termMonths; m++) {
    const interest = balance * monthlyRate;
    const principalPaid = Math.min(balance, monthlyPayment - interest);
    cumulativeInterest += interest;
    balance = Math.max(0, balance - principalPaid);
    schedule.push({ month: m, balance: round2(balance), interestPaid: round2(cumulativeInterest) });
  }

  return {
    loanAmount: round2(loanAmount),
    aprPct: round2(aprPct),
    termMonths,
    originationFeePct: round2(originationFeePct),
    originationFee: round2(originationFee),
    netDisbursed: round2(netDisbursed),
    monthlyPayment: round2(monthlyPayment),
    totalRepaid: round2(totalRepaid),
    totalInterest: round2(totalInterest),
    totalCost: round2(totalCost),
    effectiveAprPct: round2(effectiveAprPct),
    schedule,
    breakdown: [
      { label: "Principal", amount: round2(loanAmount), colorClass: "bg-blue-400" },
      { label: "Interest", amount: round2(totalInterest), colorClass: "bg-rose-400" },
      { label: "Origination fee", amount: round2(originationFee), colorClass: "bg-amber-400" },
    ],
  };
}
