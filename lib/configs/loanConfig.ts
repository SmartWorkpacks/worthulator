// ─── Loan Calculator Config ──────────────────────────────────────────────────

export type LoanMode = "standard" | "car" | "personal" | "student";

export interface LoanModeConfig {
  label: string;
  icon: string;
  defaults: {
    amount: number;
    annualRatePct: number;
    termMonths: number;
  };
  rateHint: string;
  amountLabel: string;
  amountStep: number;
}

export const loanModes: Record<LoanMode, LoanModeConfig> = {
  standard: {
    label: "Standard Loan",
    icon: "💳",
    defaults: { amount: 15000, annualRatePct: 8.5, termMonths: 60 },
    rateHint: "Typical personal loan rates: 6–36%",
    amountLabel: "Loan amount",
    amountStep: 500,
  },
  car: {
    label: "Car Loan",
    icon: "🚗",
    defaults: { amount: 35000, annualRatePct: 6.89, termMonths: 60 },
    rateHint: "National avg new car rate: ~6.9% (2025)",
    amountLabel: "Vehicle price",
    amountStep: 1000,
  },
  personal: {
    label: "Personal Loan",
    icon: "👤",
    defaults: { amount: 10000, annualRatePct: 11.5, termMonths: 36 },
    rateHint: "Average personal loan rate: 11–12%",
    amountLabel: "Loan amount",
    amountStep: 500,
  },
  student: {
    label: "Student Loan",
    icon: "🎓",
    defaults: { amount: 27000, annualRatePct: 6.53, termMonths: 120 },
    rateHint: "Federal undergrad rate 2025: 6.53%",
    amountLabel: "Total loan balance",
    amountStep: 1000,
  },
};

export const termPresets: Record<LoanMode, number[]> = {
  standard: [24, 36, 48, 60, 84],
  car:      [24, 36, 48, 60, 72, 84],
  personal: [12, 24, 36, 48, 60],
  student:  [120, 240], // 10yr standard / 25yr extended
};

export type StudentLoanType = "subsidized" | "unsubsidized";
export type StudentRepaymentPlan = "standard" | "extended";

// ─── Calculation types ────────────────────────────────────────────────────────

export interface LoanResult {
  monthlyPayment: number;
  totalRepayment: number;
  totalInterest: number;
  /** Effective loan principal after fees / down payments etc. */
  effectivePrincipal: number;
  /** APR including fees as a percentage */
  effectiveAprPct: number;
}

export interface CarLoanInputs {
  vehiclePrice: number;
  downPayment: number;
  tradeInValue: number;
  salesTaxPct: number;
  fees: number;
}

export interface PersonalLoanInputs {
  originationFeePct: number;
  additionalFees: number;
}

export interface StudentLoanInputs {
  gracePeriodMonths: number;
  loanType: StudentLoanType;
  repaymentPlan: StudentRepaymentPlan;
}

// ─── Pure calculation functions ───────────────────────────────────────────────

/**
 * Standard amortisation formula.
 * Returns monthly payment for a fixed-rate loan.
 * Returns 0 if rate is 0 (divide-free path).
 */
export function calcMonthlyPayment(
  principal: number,
  annualRatePct: number,
  termMonths: number,
): number {
  if (principal <= 0 || termMonths <= 0) return 0;
  if (annualRatePct === 0) return principal / termMonths;
  const r = annualRatePct / 100 / 12;
  const n = termMonths;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

/**
 * Standard loan result — no mode-specific adjustments.
 */
export function calcStandardLoan(
  principal: number,
  annualRatePct: number,
  termMonths: number,
): LoanResult {
  const monthlyPayment = calcMonthlyPayment(principal, annualRatePct, termMonths);
  const totalRepayment = monthlyPayment * termMonths;
  return {
    monthlyPayment,
    totalRepayment,
    totalInterest: totalRepayment - principal,
    effectivePrincipal: principal,
    effectiveAprPct: annualRatePct,
  };
}

/**
 * Car loan — computes net amount financed after down payment, trade-in, tax & fees.
 */
export function calcCarLoan(
  vehiclePrice: number,
  annualRatePct: number,
  termMonths: number,
  inputs: CarLoanInputs,
): LoanResult {
  const { downPayment, tradeInValue, salesTaxPct, fees } = inputs;
  const taxAmount = (vehiclePrice - tradeInValue) * (salesTaxPct / 100);
  const amountFinanced = vehiclePrice - downPayment - tradeInValue + taxAmount + fees;
  const principal = Math.max(0, amountFinanced);
  return calcStandardLoan(principal, annualRatePct, termMonths);
}

/**
 * Personal loan — origination fee is typically deducted from disbursement
 * but borrower still repays the full principal.
 */
export function calcPersonalLoan(
  loanAmount: number,
  annualRatePct: number,
  termMonths: number,
  inputs: PersonalLoanInputs,
): LoanResult {
  const { originationFeePct, additionalFees } = inputs;
  const originationFee = loanAmount * (originationFeePct / 100);
  const totalFees = originationFee + additionalFees;
  // Borrower repays full loan amount; fees are upfront cost
  const base = calcStandardLoan(loanAmount, annualRatePct, termMonths);
  // Effective APR includes fees amortised over term
  const effectiveTotalCost = base.totalRepayment + totalFees;
  const effectiveAprPct = totalFees > 0
    ? approximateApr(loanAmount, base.monthlyPayment, termMonths, totalFees)
    : annualRatePct;
  return {
    ...base,
    totalRepayment: base.totalRepayment + totalFees,
    totalInterest: base.totalInterest + totalFees,
    effectiveAprPct,
    effectivePrincipal: loanAmount,
  };
}

/**
 * Student loan — unsubsidized loans accrue interest during grace period.
 * Extended repayment plan doubles the term (max 300 months).
 */
export function calcStudentLoan(
  loanBalance: number,
  annualRatePct: number,
  termMonths: number,
  inputs: StudentLoanInputs,
): LoanResult & { capitalizedInterest: number } {
  const { gracePeriodMonths, loanType, repaymentPlan } = inputs;
  const effectiveTerm = repaymentPlan === "extended"
    ? Math.min(termMonths * 2, 300)
    : termMonths;

  let principal = loanBalance;
  let capitalizedInterest = 0;

  if (loanType === "unsubsidized" && gracePeriodMonths > 0) {
    const monthlyRate = annualRatePct / 100 / 12;
    capitalizedInterest = loanBalance * monthlyRate * gracePeriodMonths;
    principal = loanBalance + capitalizedInterest;
  }

  const base = calcStandardLoan(principal, annualRatePct, effectiveTerm);
  return { ...base, capitalizedInterest };
}

// ─── Amortization schedule ───────────────────────────────────────────────────

export interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
  cumulativeInterest: number;
  cumulativePrincipal: number;
}

export interface YearlySummary {
  year: number;
  totalPayment: number;
  totalPrincipal: number;
  totalInterest: number;
  endBalance: number;
}

/**
 * Full month-by-month amortization schedule.
 * Supports an optional constant extra monthly payment.
 */
export function generateAmortizationSchedule(
  principal: number,
  annualRatePct: number,
  termMonths: number,
  extraMonthly = 0,
): AmortizationRow[] {
  if (principal <= 0 || termMonths <= 0) return [];
  const monthlyRate = annualRatePct / 100 / 12;
  const basePayment = calcMonthlyPayment(principal, annualRatePct, termMonths);
  const rows: AmortizationRow[] = [];
  let balance = principal;
  let cumulativeInterest = 0;
  let cumulativePrincipal = 0;

  for (let m = 1; m <= termMonths && balance > 0; m++) {
    const interestCharge = monthlyRate > 0 ? balance * monthlyRate : 0;
    const scheduledPrincipal = Math.min(balance, basePayment - interestCharge);
    const extraApplied = Math.min(balance - scheduledPrincipal, extraMonthly);
    const totalPrincipal = scheduledPrincipal + extraApplied;
    const totalPayment = interestCharge + totalPrincipal;

    balance = Math.max(0, balance - totalPrincipal);
    cumulativeInterest += interestCharge;
    cumulativePrincipal += totalPrincipal;

    rows.push({
      month: m,
      payment: totalPayment,
      principal: totalPrincipal,
      interest: interestCharge,
      balance,
      cumulativeInterest,
      cumulativePrincipal,
    });

    if (balance === 0) break;
  }

  return rows;
}

/**
 * Collapse monthly rows into yearly summary buckets.
 */
export function generateYearlySummary(rows: AmortizationRow[]): YearlySummary[] {
  const years: YearlySummary[] = [];
  let i = 0;
  while (i < rows.length) {
    const year = Math.floor(rows[i].month / 12) + (rows[i].month % 12 === 0 ? 0 : 1);
    const chunk = rows.filter((r) => {
      const y = Math.floor((r.month - 1) / 12) + 1;
      return y === year;
    });
    years.push({
      year,
      totalPayment: chunk.reduce((s, r) => s + r.payment, 0),
      totalPrincipal: chunk.reduce((s, r) => s + r.principal, 0),
      totalInterest: chunk.reduce((s, r) => s + r.interest, 0),
      endBalance: chunk[chunk.length - 1].balance,
    });
    i += chunk.length;
  }
  return years;
}

// ─── Extra payment engine ────────────────────────────────────────────────────

export interface ExtraPaymentResult {
  newTermMonths: number;
  monthsSaved: number;
  interestSaved: number;
  newTotalInterest: number;
  newMonthlyPayment: number;
  /** For one-time extra: reduces balance, recalculates remainder */
  scenario: "extra-monthly" | "one-time";
}

/**
 * Calculate the impact of extra monthly payments.
 * Returns new payoff term, months saved, and interest saved.
 */
export function calcExtraMonthly(
  principal: number,
  annualRatePct: number,
  termMonths: number,
  extraMonthly: number,
): ExtraPaymentResult {
  const baseSchedule = generateAmortizationSchedule(principal, annualRatePct, termMonths, 0);
  const extraSchedule = generateAmortizationSchedule(principal, annualRatePct, termMonths, extraMonthly);

  const baseTotalInterest = baseSchedule.reduce((s, r) => s + r.interest, 0);
  const extraTotalInterest = extraSchedule.reduce((s, r) => s + r.interest, 0);

  return {
    newTermMonths: extraSchedule.length,
    monthsSaved: baseSchedule.length - extraSchedule.length,
    interestSaved: baseTotalInterest - extraTotalInterest,
    newTotalInterest: extraTotalInterest,
    newMonthlyPayment: calcMonthlyPayment(principal, annualRatePct, termMonths) + extraMonthly,
    scenario: "extra-monthly",
  };
}

/**
 * Calculate impact of a single one-time lump-sum extra payment (applied month 1).
 */
export function calcOneTimeExtra(
  principal: number,
  annualRatePct: number,
  termMonths: number,
  oneTimePayment: number,
): ExtraPaymentResult {
  const reducedPrincipal = Math.max(0, principal - oneTimePayment);
  const baseSchedule = generateAmortizationSchedule(principal, annualRatePct, termMonths, 0);
  const newSchedule = generateAmortizationSchedule(reducedPrincipal, annualRatePct, termMonths, 0);

  const baseTotalInterest = baseSchedule.reduce((s, r) => s + r.interest, 0);
  const newTotalInterest = newSchedule.reduce((s, r) => s + r.interest, 0);

  return {
    newTermMonths: newSchedule.length,
    monthsSaved: baseSchedule.length - newSchedule.length,
    interestSaved: baseTotalInterest - newTotalInterest,
    newTotalInterest,
    newMonthlyPayment: calcMonthlyPayment(reducedPrincipal, annualRatePct, termMonths),
    scenario: "one-time",
  };
}

// ─── Scenario comparison ─────────────────────────────────────────────────────

export interface ScenarioResult {
  label: string;
  monthlyPayment: number;
  totalInterest: number;
  totalCost: number;
  termMonths: number;
}

/**
 * Build 2 comparison scenarios against the base loan.
 * Scenario A: same term, +1% rate.
 * Scenario B: shorter term (-12 months), same rate.
 */
export function buildScenarioComparison(
  principal: number,
  annualRatePct: number,
  termMonths: number,
): { base: ScenarioResult; higherRate: ScenarioResult; shorterTerm: ScenarioResult } {
  const toScenario = (label: string, p: number, r: number, t: number): ScenarioResult => {
    const res = calcStandardLoan(p, r, t);
    return { label, monthlyPayment: res.monthlyPayment, totalInterest: res.totalInterest, totalCost: res.totalRepayment, termMonths: t };
  };

  return {
    base: toScenario("Your Loan", principal, annualRatePct, termMonths),
    higherRate: toScenario(`+1% Rate (${(annualRatePct + 1).toFixed(2)}%)`, principal, annualRatePct + 1, termMonths),
    shorterTerm: toScenario(
      `Shorter Term (${Math.max(6, termMonths - 12)}mo)`,
      principal,
      annualRatePct,
      Math.max(6, termMonths - 12),
    ),
  };
}

// ─── Car depreciation model ───────────────────────────────────────────────────

export interface DepreciationRow {
  year: number;
  carValue: number;
  loanBalance: number;
  equity: number;
}

/**
 * Simple straight-line + accelerated year-1 depreciation model.
 * Year 1: ~20% drop. Years 2–5: ~15%/yr. After that: ~10%/yr.
 */
export function buildDepreciationSchedule(
  vehiclePrice: number,
  loanPrincipal: number,
  annualRatePct: number,
  termMonths: number,
): DepreciationRow[] {
  const rows: DepreciationRow[] = [];
  const schedule = generateAmortizationSchedule(loanPrincipal, annualRatePct, termMonths, 0);
  const totalYears = Math.ceil(termMonths / 12);

  let carValue = vehiclePrice;
  for (let y = 1; y <= totalYears; y++) {
    const rate = y === 1 ? 0.20 : y <= 5 ? 0.15 : 0.10;
    carValue = carValue * (1 - rate);
    const yearEndRow = schedule[Math.min(y * 12 - 1, schedule.length - 1)];
    const loanBalance = yearEndRow?.balance ?? 0;
    rows.push({ year: y, carValue, loanBalance, equity: Math.max(0, carValue - loanBalance) });
  }
  return rows;
}

// ─── APR approximation (Newton's method) ─────────────────────────────────────

/**
 * Approximate effective APR when fees are included.
 * Uses Newton–Raphson on the NPV equation.
 */
function approximateApr(
  principal: number,
  monthlyPayment: number,
  termMonths: number,
  fees: number,
): number {
  const netProceeds = principal - fees;
  if (netProceeds <= 0) return 0;
  let r = 0.01; // initial guess ~12% APR
  for (let i = 0; i < 50; i++) {
    const factor = Math.pow(1 + r, termMonths);
    const pv = monthlyPayment * (factor - 1) / (r * factor);
    const pvDr =
      monthlyPayment *
      (termMonths * Math.pow(1 + r, termMonths - 1) * r * factor - (factor - 1) * (factor + r * termMonths)) /
      Math.pow(r * factor, 2);
    const diff = pv - netProceeds;
    if (Math.abs(diff) < 0.01) break;
    r -= diff / pvDr;
    r = Math.max(0.0001, r);
  }
  return r * 12 * 100;
}
