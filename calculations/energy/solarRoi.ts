// ─── Solar Panel ROI ──────────────────────────────────────────────────────────
//
// Payback period and 25-year lifetime savings for a residential solar system.
// Year-1 savings = monthly bill × 12 × offset; subsequent years grow with utility
// rate inflation. Payback uses the (flat) year-1 monthly saving as a conservative
// estimate. Pure module — no datasets.
// ─────────────────────────────────────────────────────────────────────────────

export interface SolarRoiInputs {
  systemCost: number;
  monthlyBill: number;
  solarOffset: number;
  utilityInflation: number;
}

export interface SolarRoiResult {
  paybackMonths: number;
  year1Savings: number;
  savings25yr: number;
  paybackYears: number;
  roiMultiple: number;
  [key: string]: number;
}

const PANEL_LIFETIME_YEARS = 25;

export function calculateSolarRoi(inputs: SolarRoiInputs): SolarRoiResult {
  const cost = inputs.systemCost;
  const bill = inputs.monthlyBill;
  const off = inputs.solarOffset / 100;
  const inf = inputs.utilityInflation / 100;

  const y1 = bill * 12 * off;
  let t25 = 0;
  let annual = y1;
  for (let y = 0; y < PANEL_LIFETIME_YEARS; y++) {
    t25 += annual;
    annual *= 1 + inf;
  }

  const paybackMonths = y1 > 0 ? Math.round(cost / (y1 / 12)) : 0;

  return {
    paybackMonths,
    year1Savings: Math.round(y1),
    savings25yr: Math.round(t25),
    paybackYears: paybackMonths > 0 ? Math.round((paybackMonths / 12) * 10) / 10 : 0,
    roiMultiple: cost > 0 ? Math.round((t25 / cost) * 100) / 100 : 0,
  };
}
