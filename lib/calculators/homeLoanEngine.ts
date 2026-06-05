// ─── Home Loan Engine ─────────────────────────────────────────────────────────
//
// The "big picture" view of a home loan: monthly principal & interest, the TOTAL
// cost of the home over the life of the loan, and how your EQUITY builds year by
// year. Distinct from:
//   - amortization-calculator    (the month/year schedule)
//   - mortgage-payment-calculator (the monthly PITI snapshot)
//
// Equity here is modelled conservatively as ownership of the purchase price
// (price − remaining balance); it ignores home-price appreciation, which would
// only increase equity. Core P&I math reuses the shared amortization engine.
//
// Pure & synchronous. Guards zero/negative/NaN.

import { calculateAmortization } from "./amortizationEngine";

export interface HomeLoanInputs {
  homePrice: number;
  downPaymentPct: number;
  annualRatePct: number;
  termYears: number;
  extraMonthlyPayment?: number;
}

export interface HomeLoanResult {
  loanAmount: number;
  downPaymentAmount: number;
  monthlyPI: number;
  totalInterest: number;
  /** All P&I payments over the life of the loan */
  totalOfPayments: number;
  /** Total cash for the home via this loan = down payment + all payments = price + interest */
  totalCost: number;
  /** Total interest as a % of the home price */
  interestPctOfPrice: number;
  payoffMonths: number;
  interestSaved: number;
  monthsSaved: number;
  /** Year when owned equity first reaches 20% / 50% of the price (0 if from day one) */
  yearsTo20Equity: number;
  yearsTo50Equity: number;
  /** Equity (price − balance) by year, for a line chart */
  equityCurve: { x: number; y: number }[];
  /** Total-cost composition, for a breakdown bar chart */
  costBreakdown: { label: string; amount: number }[];
}

const round2 = (n: number) => Math.round(n * 100) / 100;

function yearToEquityTarget(
  equityByYear: { x: number; y: number }[],
  price: number,
  targetPct: number,
): number {
  const target = price * targetPct;
  for (const p of equityByYear) {
    if (p.y >= target - 0.01) return p.x;
  }
  return equityByYear.length ? equityByYear[equityByYear.length - 1].x : 0;
}

export function calculateHomeLoan(inputs: HomeLoanInputs): HomeLoanResult {
  const homePrice = Math.max(0, inputs.homePrice || 0);
  const downPaymentPct = Math.min(100, Math.max(0, inputs.downPaymentPct || 0));
  const annualRatePct = Math.max(0, inputs.annualRatePct || 0);
  const termYears = Math.max(0, inputs.termYears || 0);
  const extra = Math.max(0, inputs.extraMonthlyPayment || 0);

  const downPaymentAmount = homePrice * (downPaymentPct / 100);
  const loanAmount = Math.max(0, homePrice - downPaymentAmount);

  if (homePrice <= 0 || termYears <= 0) {
    return {
      loanAmount: 0, downPaymentAmount: round2(downPaymentAmount), monthlyPI: 0,
      totalInterest: 0, totalOfPayments: 0, totalCost: round2(downPaymentAmount),
      interestPctOfPrice: 0, payoffMonths: 0, interestSaved: 0, monthsSaved: 0,
      yearsTo20Equity: 0, yearsTo50Equity: 0,
      equityCurve: [{ x: 0, y: round2(downPaymentAmount) }],
      costBreakdown: [],
    };
  }

  const amort = calculateAmortization({ loanAmount, annualRatePct, termYears, extraMonthlyPayment: extra });
  const monthlyPI = amort.monthlyPayment;
  const totalInterest = amort.totalInterest;
  const totalOfPayments = amort.totalPaid; // principal + interest
  const totalCost = downPaymentAmount + totalOfPayments; // = price + interest

  // Equity = price − remaining balance (day-one equity is the down payment).
  const equityCurve = amort.balanceCurve.map((p) => ({ x: p.x, y: round2(homePrice - p.y) }));

  return {
    loanAmount: round2(loanAmount),
    downPaymentAmount: round2(downPaymentAmount),
    monthlyPI: round2(monthlyPI),
    totalInterest: round2(totalInterest),
    totalOfPayments: round2(totalOfPayments),
    totalCost: round2(totalCost),
    interestPctOfPrice: homePrice > 0 ? Math.round((totalInterest / homePrice) * 100) : 0,
    payoffMonths: amort.payoffMonths,
    interestSaved: amort.interestSaved,
    monthsSaved: amort.monthsSaved,
    yearsTo20Equity: yearToEquityTarget(equityCurve, homePrice, 0.2),
    yearsTo50Equity: yearToEquityTarget(equityCurve, homePrice, 0.5),
    equityCurve,
    costBreakdown: [
      { label: "Down payment", amount: round2(downPaymentAmount) },
      { label: "Financed principal", amount: round2(loanAmount) },
      { label: "Interest", amount: round2(totalInterest) },
    ].filter((b) => b.amount > 0),
  };
}
