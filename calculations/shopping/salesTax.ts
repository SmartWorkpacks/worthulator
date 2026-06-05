// ─── Sales Tax Calculator — Pure Calculation Module ──────────────────────────
//
// Injected data: state combined sales tax rate (Tax Foundation via dataset).
// Result assignable to CalculatorOutputs (index signature present).
//
// ─────────────────────────────────────────────────────────────────────────────

import type { StateSalesTaxData } from "@/lib/datasets/tax/salesTaxRates";

/** Tax Foundation 2026 national average combined (state + local) rate. */
export const NATIONAL_AVG_RATE = 7.12;

/** S&P 500 long-run nominal average return (Damodaran/NYU, 1928–2024). */
const MARKET_RETURN = 0.07;

export interface SalesTaxInputs {
  price: number;
  monthlySpend: number;
  state: string;
}

export interface SalesTaxData {
  combinedRate: number;
  stateRate: number;
  groceryExempt: boolean;
  neighbors: string[];
  neighborRates: number[];
  localNote: string;
}

export interface SalesTaxResult {
  taxAmount: number;
  totalPrice: number;
  resolvedRate: number;
  monthlyTaxBurden: number;
  annualTaxBurden: number;
  annualIfInvested10yr: number;
  neighborAvgRate: number;
  vsNeighborsDelta: number;
  grocerySaving: number;
  effectiveOnGroceries: number;
  dailyTaxBurden: number;
  [key: string]: number;
}

/**
 * Estimate annual grocery spend for a household.
 * USDA moderate-cost plan: ~$5,500/person/year for a 2.53-person household.
 * Source: USDA CNPP Cost of Food Reports 2024.
 */
const AVG_ANNUAL_GROCERY = 7_500;

export function calculateSalesTax(
  inputs: SalesTaxInputs,
  data: SalesTaxData,
): SalesTaxResult {
  const { price, monthlySpend } = inputs;
  const rate = data.combinedRate;

  const taxAmount = Math.round(price * (rate / 100) * 100) / 100;
  const totalPrice = Math.round((price + taxAmount) * 100) / 100;

  const monthlyTaxBurden = Math.round(monthlySpend * (rate / 100) * 100) / 100;
  const annualTaxBurden = Math.round(monthlyTaxBurden * 12 * 100) / 100;
  const dailyTaxBurden = Math.round((annualTaxBurden / 365) * 100) / 100;

  // FV of annualTaxBurden invested at 7% for 10 years
  const r = MARKET_RETURN;
  const annualIfInvested10yr =
    annualTaxBurden > 0
      ? Math.round(annualTaxBurden * ((Math.pow(1 + r, 10) - 1) / r))
      : 0;

  // Neighbor comparison
  const neighborAvgRate =
    data.neighborRates.length > 0
      ? Math.round(
          (data.neighborRates.reduce((s, v) => s + v, 0) /
            data.neighborRates.length) *
            100,
        ) / 100
      : NATIONAL_AVG_RATE;
  const vsNeighborsDelta = Math.round((rate - neighborAvgRate) * 100) / 100;

  // Grocery exemption saving: if exempt, the household saves tax on groceries
  const grocerySaving = data.groceryExempt
    ? Math.round(AVG_ANNUAL_GROCERY * (rate / 100))
    : 0;
  const effectiveOnGroceries = data.groceryExempt ? 0 : rate;

  return {
    taxAmount,
    totalPrice,
    resolvedRate: rate,
    monthlyTaxBurden,
    annualTaxBurden,
    annualIfInvested10yr,
    neighborAvgRate,
    vsNeighborsDelta,
    grocerySaving,
    effectiveOnGroceries,
    dailyTaxBurden,
  };
}
