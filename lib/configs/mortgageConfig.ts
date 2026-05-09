// ─── Mortgage Calculator Config ────────────────────────────────────────────

export interface MortgageConfig {
  defaultRates: {
    thirtyYear: number;   // %
    fifteenYear: number;  // %
    tenYear: number;      // %
    sevenYearArm: number; // %
    fiveYearArm: number;  // %
  };
  /**
   * Rough median home-price multiplier by metro tier.
   * Used only for affordability context copy — not applied to user inputs.
   */
  locationMultipliers: {
    low: number;   // rural / low-cost
    avg: number;   // national median
    high: number;  // top-10 metro
  };
  pmi: {
    /** PMI is required when LTV > this threshold */
    ltvThreshold: number;       // e.g. 0.80  (80%)
    /** Typical annual PMI rate as % of loan balance */
    annualRateLow: number;      // 0.5%
    annualRateHigh: number;     // 1.5%
    annualRateDefault: number;  // 0.85%
  };
  /**
   * Default property-tax rate by area (annual % of home value).
   * US national average is ~1.1%.
   */
  propertyTax: {
    low: number;    // 0.5% – low-tax states (HI, AL, SC…)
    avg: number;    // 1.1% – national average
    high: number;   // 2.2% – high-tax states (NJ, IL…)
    default: number;
  };
  /**
   * Default annual homeowner's insurance as % of home value.
   */
  insurance: {
    low: number;     // 0.25%
    avg: number;     // 0.5%
    high: number;    // 1.0%
    default: number; // 0.5%
  };
  /**
   * DTI (debt-to-income) affordability thresholds used by most lenders.
   */
  dti: {
    /** Max front-end DTI (housing costs / gross income) */
    frontEndMax: number;  // 28%
    /** Max back-end DTI (all debt / gross income) */
    backEndMax: number;   // 43%
    /** Back-end threshold for conforming / qualified mortgages */
    qualifiedMax: number; // 36%
  };
  /**
   * Rough credit-score loan eligibility tiers.
   * Used to show eligibility message, not to alter the rate calculation.
   */
  creditTiers: {
    label: string;
    min: number;
    max: number;
    eligible: boolean;
    note: string;
  }[];
  loanTerms: { label: string; years: number }[];
  closingCostPct: number; // ~3% of purchase price
}

export const mortgageConfig: MortgageConfig = {
  defaultRates: {
    thirtyYear: 6.99,
    fifteenYear: 6.39,
    tenYear: 6.19,
    sevenYearArm: 6.59,
    fiveYearArm: 6.29,
  },

  locationMultipliers: {
    low: 0.6,
    avg: 1.0,
    high: 1.8,
  },

  pmi: {
    ltvThreshold: 0.8,
    annualRateLow: 0.5,
    annualRateHigh: 1.5,
    annualRateDefault: 0.85,
  },

  propertyTax: {
    low: 0.5,
    avg: 1.1,
    high: 2.2,
    default: 1.1,
  },

  insurance: {
    low: 0.25,
    avg: 0.5,
    high: 1.0,
    default: 0.5,
  },

  dti: {
    frontEndMax: 28,
    backEndMax: 43,
    qualifiedMax: 36,
  },

  creditTiers: [
    { label: "Exceptional", min: 800, max: 850, eligible: true,  note: "Qualifies for best available rates." },
    { label: "Very Good",   min: 740, max: 799, eligible: true,  note: "Qualifies for competitive rates." },
    { label: "Good",        min: 670, max: 739, eligible: true,  note: "Qualifies for standard conforming rates." },
    { label: "Fair",        min: 580, max: 669, eligible: true,  note: "May qualify via FHA (3.5% down) with higher rates." },
    { label: "Poor",        min: 300, max: 579, eligible: false, note: "Most lenders require a score of 580+ (FHA) or 620+ (conventional)." },
  ],

  loanTerms: [
    { label: "30-year fixed", years: 30 },
    { label: "15-year fixed", years: 15 },
    { label: "10-year fixed", years: 10 },
  ],

  closingCostPct: 3,
};

// ─── Pure calculation helpers (no React / hooks dependency) ─────────────────

/** Monthly P&I payment using standard annuity formula */
export function calcMonthlyPI(principal: number, annualRatePct: number, termYears: number): number {
  if (principal <= 0 || termYears <= 0) return 0;
  if (annualRatePct === 0) return principal / (termYears * 12);
  const r = annualRatePct / 100 / 12;
  const n = termYears * 12;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

/** Monthly property tax */
export function calcMonthlyTax(homePrice: number, annualRatePct: number): number {
  return (homePrice * annualRatePct) / 100 / 12;
}

/** Monthly insurance */
export function calcMonthlyInsurance(homePrice: number, annualRatePct: number): number {
  return (homePrice * annualRatePct) / 100 / 12;
}

/** Monthly PMI — returns 0 if LTV ≤ 80% */
export function calcMonthlyPMI(
  loanAmount: number,
  homePrice: number,
  annualPmiRatePct: number,
): number {
  const ltv = loanAmount / homePrice;
  if (ltv <= mortgageConfig.pmi.ltvThreshold) return 0;
  return (loanAmount * annualPmiRatePct) / 100 / 12;
}

export interface AmortizationRow {
  month: number;
  year: number;
  payment: number;
  principal: number;
  interest: number;
  extraPayment: number;
  balance: number;
}

/** Full amortisation schedule with optional extra monthly payment */
export function buildAmortizationSchedule(
  principal: number,
  annualRatePct: number,
  termYears: number,
  extraMonthlyPayment = 0,
): AmortizationRow[] {
  if (principal <= 0 || termYears <= 0) return [];
  const r = annualRatePct > 0 ? annualRatePct / 100 / 12 : 0;
  const basePayment = calcMonthlyPI(principal, annualRatePct, termYears);
  const rows: AmortizationRow[] = [];
  let balance = principal;
  let month = 1;

  while (balance > 0.01 && month <= termYears * 12) {
    const interestCharge = balance * r;
    const principalCharge = Math.min(basePayment - interestCharge, balance);
    const extra = Math.min(extraMonthlyPayment, balance - principalCharge);
    balance = balance - principalCharge - extra;

    rows.push({
      month,
      year: Math.ceil(month / 12),
      payment: basePayment,
      principal: principalCharge,
      interest: interestCharge,
      extraPayment: extra,
      balance: Math.max(balance, 0),
    });

    if (balance <= 0.01) break;
    month++;
  }

  return rows;
}

export interface AffordabilityResult {
  maxAffordableHome: number;
  maxLoanFrontEnd: number;
  maxLoanBackEnd: number;
  limitingFactor: "front-end" | "back-end";
  frontEndRatio: number;
  backEndRatio: number;
  eligible: boolean;
  message: string;
}

/**
 * Estimate how much home a buyer can afford using front-end and back-end DTI.
 * annualIncome and monthlyDebt are in dollars.
 */
export function calcAffordability(
  grossAnnualIncome: number,
  monthlyDebt: number,
  annualRatePct: number,
  termYears: number,
  downPaymentAmt: number,
  propertyTaxPct: number,
  insurancePct: number,
  config: MortgageConfig,
): AffordabilityResult {
  const monthlyIncome = grossAnnualIncome / 12;

  // Max monthly housing payment via front-end DTI
  const maxFrontEndPayment = monthlyIncome * (config.dti.frontEndMax / 100);
  // Max housing payment via back-end DTI (deduct existing debt)
  const maxBackEndPayment = monthlyIncome * (config.dti.backEndMax / 100) - monthlyDebt;
  const maxMonthlyHousing = Math.max(0, Math.min(maxFrontEndPayment, maxBackEndPayment));

  const limitingFactor: "front-end" | "back-end" =
    maxFrontEndPayment <= maxBackEndPayment ? "front-end" : "back-end";

  // Iteratively solve for home price where PI + tax + insurance = maxMonthlyHousing
  // PI = maxMonthlyHousing - tax - insurance, but tax/insurance are % of home price
  // Substitute and solve:
  // PI = maxMonthly - homePrice*(taxPct+insPct)/100/12
  // PI / [r(1+r)^n / ((1+r)^n-1)] = loan
  // loan = homePrice - downPayment
  // Rearranging:
  const r = annualRatePct > 0 ? annualRatePct / 100 / 12 : 0;
  const n = termYears * 12;
  const piFactor = r > 0 ? (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : 1 / n;
  const monthlyEscrowPctPerDollar = (propertyTaxPct + insurancePct) / 100 / 12;

  // maxMonthly = piFactor * (homePrice - downPayment) + homePrice * monthlyEscrowPctPerDollar
  // maxMonthly = homePrice * (piFactor + monthlyEscrowPctPerDollar) - downPayment * piFactor
  const maxHome =
    (maxMonthlyHousing + downPaymentAmt * piFactor) /
    (piFactor + monthlyEscrowPctPerDollar);

  const maxLoan = Math.max(0, maxHome - downPaymentAmt);

  const actualHousingPayment =
    calcMonthlyPI(maxLoan, annualRatePct, termYears) +
    calcMonthlyTax(maxHome, propertyTaxPct) +
    calcMonthlyInsurance(maxHome, insurancePct);

  const frontEndRatio = monthlyIncome > 0 ? (actualHousingPayment / monthlyIncome) * 100 : 0;
  const backEndRatio =
    monthlyIncome > 0 ? ((actualHousingPayment + monthlyDebt) / monthlyIncome) * 100 : 0;

  const eligible = maxHome > 0 && maxLoan > 0;

  return {
    maxAffordableHome: Math.max(0, Math.round(maxHome / 1000) * 1000),
    maxLoanFrontEnd: Math.max(0, Math.round((monthlyIncome * (config.dti.frontEndMax / 100) / piFactor) / 1000) * 1000),
    maxLoanBackEnd: Math.max(0, Math.round((maxBackEndPayment / piFactor) / 1000) * 1000),
    limitingFactor,
    frontEndRatio: Math.round(frontEndRatio * 10) / 10,
    backEndRatio: Math.round(backEndRatio * 10) / 10,
    eligible,
    message: eligible
      ? `Based on your income and debt, you may qualify for up to ${new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(maxHome)}.`
      : "Your current income-to-debt ratio is above typical lender limits. Reducing monthly debt or increasing income improves eligibility.",
  };
}

// ─── Phase 2: extended extra-payments & yearly summary ──────────────────────

export interface ExtraPayments {
  monthly: number;
  yearly: number;
  oneTimeAmt: number;
  /** 1-indexed month number within the loan (e.g. 12 = end of year 1) */
  oneTimeMonth: number;
}

/**
 * Amortisation schedule supporting monthly, yearly, and one-time extra payments.
 * Drop-in replacement for buildAmortizationSchedule with richer extra-payment support.
 */
export function buildAmortizationScheduleEx(
  principal: number,
  annualRatePct: number,
  termYears: number,
  extras: Partial<ExtraPayments> = {},
): AmortizationRow[] {
  if (principal <= 0 || termYears <= 0) return [];
  const r = annualRatePct > 0 ? annualRatePct / 100 / 12 : 0;
  const basePayment = calcMonthlyPI(principal, annualRatePct, termYears);
  const rows: AmortizationRow[] = [];
  let balance = principal;

  for (let month = 1; month <= termYears * 12 && balance > 0.01; month++) {
    const interestCharge = balance * r;
    const principalCharge = Math.min(basePayment - interestCharge, balance);

    let extraThisMonth = extras.monthly ?? 0;
    if ((extras.yearly ?? 0) > 0 && month % 12 === 0) extraThisMonth += extras.yearly!;
    if ((extras.oneTimeAmt ?? 0) > 0 && month === (extras.oneTimeMonth ?? 0)) {
      extraThisMonth += extras.oneTimeAmt!;
    }

    const remainingAfterBase = balance - principalCharge;
    const extra = Math.max(0, Math.min(extraThisMonth, remainingAfterBase));
    balance = remainingAfterBase - extra;

    rows.push({
      month,
      year: Math.ceil(month / 12),
      payment: basePayment,
      principal: principalCharge,
      interest: interestCharge,
      extraPayment: extra,
      balance: Math.max(balance, 0),
    });

    if (balance <= 0.01) break;
  }

  return rows;
}

export interface YearlySummary {
  year: number;
  totalPayment: number;
  totalPrincipal: number;
  totalInterest: number;
  totalExtra: number;
  endBalance: number;
}

/** Collapse a monthly amortisation schedule into per-year summary rows. */
export function buildYearlySummary(rows: AmortizationRow[]): YearlySummary[] {
  const yearMap = new Map<number, YearlySummary>();
  for (const row of rows) {
    const prev = yearMap.get(row.year) ?? {
      year: row.year,
      totalPayment: 0,
      totalPrincipal: 0,
      totalInterest: 0,
      totalExtra: 0,
      endBalance: 0,
    };
    yearMap.set(row.year, {
      year: row.year,
      totalPayment: prev.totalPayment + row.payment + row.extraPayment,
      totalPrincipal: prev.totalPrincipal + row.principal,
      totalInterest: prev.totalInterest + row.interest,
      totalExtra: prev.totalExtra + row.extraPayment,
      endBalance: row.balance,
    });
  }
  return Array.from(yearMap.values());
}
