// ─── Side Hustle Income ───────────────────────────────────────────────────────
//
// Real take-home from a side gig after expenses and self-employment tax, plus
// the effective hourly rate and multi-year framing. Pure module — no datasets.
// Uses 4.33 weeks/month (52 ÷ 12) so monthly and annual figures reconcile.
// ─────────────────────────────────────────────────────────────────────────────

export interface SideHustleInputs {
  hoursPerWeek: number;
  rate: number;
  expensePct: number;
  taxRate: number;
}

export interface SideHustleResult {
  monthlyRevenue: number;
  netMonthly: number;
  yearlyNet: number;
  hourlyEffective: number;
  annualTaxPaid: number;
  fiveYearNet: number;
  [key: string]: number;
}

const WEEKS_PER_MONTH = 52 / 12; // 4.333…

export function calculateSideHustle(inputs: SideHustleInputs): SideHustleResult {
  const monthlyRevenue = inputs.hoursPerWeek * inputs.rate * WEEKS_PER_MONTH;
  const expenses = monthlyRevenue * (inputs.expensePct / 100);
  const monthlyTax = (monthlyRevenue - expenses) * (inputs.taxRate / 100);
  const net = monthlyRevenue - expenses - monthlyTax;
  const monthlyHours = inputs.hoursPerWeek * WEEKS_PER_MONTH;

  return {
    monthlyRevenue: Math.round(monthlyRevenue),
    netMonthly: Math.round(net),
    yearlyNet: Math.round(net * 12),
    hourlyEffective: monthlyHours > 0 ? Math.round((net / monthlyHours) * 100) / 100 : 0,
    annualTaxPaid: Math.round(monthlyTax * 12),
    fiveYearNet: Math.round(net * 12 * 5),
  };
}
