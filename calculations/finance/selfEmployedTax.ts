// ─── Self-Employed Tax ────────────────────────────────────────────────────────
//
// Quarterly / monthly tax reserve for 1099 workers. Applies the 15.3% SE tax on
// 92.35% of net earnings, then federal income tax on net minus half the SE tax
// (the deductible employer-equivalent portion). Pure module. Reports the reserve
// cadence plus effective rate and take-home figures.
// ─────────────────────────────────────────────────────────────────────────────

export interface SelfEmployedTaxInputs {
  grossIncome: number;
  businessExpenses: number;
  federalRate: number;
}

export interface SelfEmployedTaxResult {
  annualTaxEstimate: number;
  quarterlyPayment: number;
  monthlyReserve: number;
  seTaxAmount: number;
  effectiveTaxRate: number;
  netAfterTax: number;
  netMonthly: number;
  [key: string]: number;
}

const SE_TAXABLE_PORTION = 0.9235;
const SE_TAX_RATE = 0.153;

export function calculateSelfEmployedTax(
  inputs: SelfEmployedTaxInputs,
): SelfEmployedTaxResult {
  const net = Math.max(0, inputs.grossIncome - inputs.businessExpenses);
  const seTax = net * SE_TAXABLE_PORTION * SE_TAX_RATE;
  const fed = (net - seTax / 2) * inputs.federalRate / 100;
  const total = Math.round(seTax + fed);
  const gross = inputs.grossIncome;
  const afterTax = net - total;

  return {
    annualTaxEstimate: total,
    quarterlyPayment: Math.round(total / 4),
    monthlyReserve: Math.round(total / 12),
    seTaxAmount: Math.round(seTax),
    effectiveTaxRate: gross > 0 ? Math.round((total / gross) * 1000) / 10 : 0,
    netAfterTax: Math.round(afterTax),
    netMonthly: Math.round(afterTax / 12),
  };
}
