// ─── Mortgage Payment Engine (PITI) ───────────────────────────────────────────
//
// Full monthly housing payment = Principal + Interest + Taxes + Insurance,
// plus PMI (when down payment < 20%) and optional HOA dues. The principal &
// interest portion reuses the shared amortization engine so the math stays in
// one place.
//
// DEFAULT CONSTANTS (all user-overridable; sourced typical US figures):
//   propertyTaxRatePct 1.1  — US median effective property tax ≈ 0.9–1.1% of
//                             home value/yr (Tax Foundation, 2024). National avg.
//   homeInsuranceAnnual 1800 — US average homeowners premium ≈ $1,700–2,000/yr
//                             (NAIC / industry surveys, 2024–25).
//   pmiRatePct 0.5         — Private mortgage insurance typically 0.3–1.5% of the
//                             loan per year; ~0.5% is a common mid-point. Applies
//                             only while LTV > 80% (down payment < 20%).
//
// Pure & synchronous. Guards zero/negative/NaN.

import { calculateAmortization } from "./amortizationEngine";

export interface MortgagePaymentInputs {
  homePrice: number;
  /** Down payment as a percent of home price (0–100) */
  downPaymentPct: number;
  /** Annual interest rate / APR in percent */
  annualRatePct: number;
  termYears: number;
  /** Annual property tax as a percent of home value */
  propertyTaxRatePct?: number;
  /** Annual homeowners insurance premium ($) */
  homeInsuranceAnnual?: number;
  /** Annual PMI as a percent of the loan (applies only when down < 20%) */
  pmiRatePct?: number;
  /** Monthly HOA dues ($) */
  hoaMonthly?: number;
}

export interface MortgagePaymentResult {
  loanAmount: number;
  downPaymentAmount: number;
  ltvPct: number;
  pmiActive: boolean;
  // Monthly components
  monthlyPI: number;
  monthlyTax: number;
  monthlyInsurance: number;
  monthlyPMI: number;
  monthlyHOA: number;
  totalMonthly: number;
  /** Total interest over the life of the loan */
  totalInterest: number;
  /** PI as a share of the full PITI payment (%) */
  piShareOfTotalPct: number;
  /** Breakdown for a chart: each monthly component */
  monthlyBreakdown: { label: string; amount: number }[];
  /** Total monthly payment at different down-payment percentages (PMI cliff) */
  paymentByDownPayment: { x: number; y: number }[];
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export const MORTGAGE_DEFAULTS = {
  propertyTaxRatePct: 1.1,
  homeInsuranceAnnual: 1800,
  pmiRatePct: 0.5,
} as const;

/** Monthly payment components for a given home price + down-payment percent. */
function computeMonthly(
  homePrice: number,
  downPct: number,
  annualRatePct: number,
  termYears: number,
  taxRatePct: number,
  insuranceAnnual: number,
  pmiRatePct: number,
  hoaMonthly: number,
) {
  const downAmount = homePrice * (downPct / 100);
  const loanAmount = Math.max(0, homePrice - downAmount);
  const amort = calculateAmortization({ loanAmount, annualRatePct, termYears });
  const monthlyPI = amort.monthlyPayment;
  const monthlyTax = (homePrice * (taxRatePct / 100)) / 12;
  const monthlyInsurance = insuranceAnnual / 12;
  const pmiActive = downPct < 20 && loanAmount > 0;
  const monthlyPMI = pmiActive ? (loanAmount * (pmiRatePct / 100)) / 12 : 0;
  const totalMonthly = monthlyPI + monthlyTax + monthlyInsurance + monthlyPMI + hoaMonthly;
  return { downAmount, loanAmount, amort, monthlyPI, monthlyTax, monthlyInsurance, monthlyPMI, pmiActive, totalMonthly };
}

export function calculateMortgagePayment(inputs: MortgagePaymentInputs): MortgagePaymentResult {
  const homePrice = Math.max(0, inputs.homePrice || 0);
  const downPaymentPct = Math.min(100, Math.max(0, inputs.downPaymentPct || 0));
  const annualRatePct = Math.max(0, inputs.annualRatePct || 0);
  const termYears = Math.max(0, inputs.termYears || 0);
  const taxRatePct = Math.max(0, inputs.propertyTaxRatePct ?? MORTGAGE_DEFAULTS.propertyTaxRatePct);
  const insuranceAnnual = Math.max(0, inputs.homeInsuranceAnnual ?? MORTGAGE_DEFAULTS.homeInsuranceAnnual);
  const pmiRatePct = Math.max(0, inputs.pmiRatePct ?? MORTGAGE_DEFAULTS.pmiRatePct);
  const hoaMonthly = Math.max(0, inputs.hoaMonthly ?? 0);

  if (homePrice <= 0 || termYears <= 0) {
    return {
      loanAmount: 0, downPaymentAmount: 0, ltvPct: 0, pmiActive: false,
      monthlyPI: 0, monthlyTax: 0, monthlyInsurance: 0, monthlyPMI: 0, monthlyHOA: 0,
      totalMonthly: 0, totalInterest: 0, piShareOfTotalPct: 0,
      monthlyBreakdown: [], paymentByDownPayment: [{ x: 20, y: 0 }],
    };
  }

  const m = computeMonthly(
    homePrice, downPaymentPct, annualRatePct, termYears,
    taxRatePct, insuranceAnnual, pmiRatePct, hoaMonthly,
  );

  const totalMonthly = m.totalMonthly;
  const monthlyBreakdown = [
    { label: "Principal & interest", amount: round2(m.monthlyPI) },
    { label: "Property tax", amount: round2(m.monthlyTax) },
    { label: "Home insurance", amount: round2(m.monthlyInsurance) },
    { label: "PMI", amount: round2(m.monthlyPMI) },
    { label: "HOA", amount: round2(hoaMonthly) },
  ].filter((b) => b.amount > 0);

  const paymentByDownPayment = [3, 5, 10, 15, 20, 25, 30].map((d) => ({
    x: d,
    y: round2(
      computeMonthly(
        homePrice, d, annualRatePct, termYears,
        taxRatePct, insuranceAnnual, pmiRatePct, hoaMonthly,
      ).totalMonthly,
    ),
  }));

  return {
    loanAmount: round2(m.loanAmount),
    downPaymentAmount: round2(m.downAmount),
    ltvPct: homePrice > 0 ? Math.round((m.loanAmount / homePrice) * 100) : 0,
    pmiActive: m.pmiActive,
    monthlyPI: round2(m.monthlyPI),
    monthlyTax: round2(m.monthlyTax),
    monthlyInsurance: round2(m.monthlyInsurance),
    monthlyPMI: round2(m.monthlyPMI),
    monthlyHOA: round2(hoaMonthly),
    totalMonthly: round2(totalMonthly),
    totalInterest: m.amort.totalInterest,
    piShareOfTotalPct: totalMonthly > 0 ? Math.round((m.monthlyPI / totalMonthly) * 100) : 0,
    monthlyBreakdown,
    paymentByDownPayment,
  };
}
