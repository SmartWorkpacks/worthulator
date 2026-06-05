// ─── Airbnb Profit Estimator ──────────────────────────────────────────────────
//
// Monthly short-term-rental net income from nightly rate, occupancy, platform
// fee, and fixed monthly expenses. Pure module. Assumes a 30-day month for
// revenue. Also reports break-even occupancy, margin, 10-year profit, and the
// revenue-to-expense coverage ratio.
// ─────────────────────────────────────────────────────────────────────────────

export interface AirbnbProfitInputs {
  nightlyRate: number;
  occupancyPct: number;
  platformFeePct: number;
  monthlyExpenses: number;
}

export interface AirbnbProfitResult {
  monthlyRevenue: number;
  monthlyProfit: number;
  annualProfit: number;
  breakEvenOcc: number;
  profitMarginPct: number;
  tenYearProfit: number;
  revenueToExpenseRatio: number;
  [key: string]: number;
}

const DAYS_PER_MONTH = 30;

export function calculateAirbnbProfit(
  inputs: AirbnbProfitInputs,
): AirbnbProfitResult {
  const feeMult = 1 - inputs.platformFeePct / 100;
  const expenses = inputs.monthlyExpenses;
  const gross = inputs.nightlyRate * DAYS_PER_MONTH * (inputs.occupancyPct / 100);
  const net = gross * feeMult - expenses;
  const breakEvenDenom = inputs.nightlyRate * DAYS_PER_MONTH * feeMult;

  return {
    monthlyRevenue: Math.round(gross),
    monthlyProfit: Math.round(net),
    annualProfit: Math.round(net * 12),
    breakEvenOcc: breakEvenDenom > 0 ? Math.round((expenses / breakEvenDenom) * 1000) / 10 : 0,
    profitMarginPct: gross > 0 ? Math.round((net / gross) * 1000) / 10 : 0,
    tenYearProfit: Math.round(net * 12 * 10),
    revenueToExpenseRatio: expenses > 0 ? Math.round((gross / expenses) * 100) / 100 : 0,
  };
}
