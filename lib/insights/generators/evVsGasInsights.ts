// ─── WorthCore Insight Engine — EV vs Gas Generator ──────────────────────────
//
// PURPOSE:
//   Deterministic insight rules for the "ev-vs-gas" engine calculator.
//   Surfaces break-even framing, long-term savings, cost-per-mile comparison,
//   and honest caveats when the EV advantage is limited.
//
// CALCULATOR OUTPUT SCHEMA (from calculatorConfigs.ts "ev-vs-gas"):
//   inputs:  milesPerYear, mpg, gasPrice, kwhPer100mi, electricRate
//   outputs: annualSavings, annualGasCost, annualEvCost,
//            fiveYearSavings, tenYearSavings, breakEvenYears,
//            gasCostPerMile, evCostPerMile
//
// RULES:
//   ✅ Pure TypeScript — synchronous, deterministic, no side effects
//   ✅ $7,500 premium is a documented constant with source comment
//   ✅ All insight IDs are stable and unique: "ev.<rule-name>"
//   ❌ Never import React
//   ❌ Never call fetch() or async operations
//
// ─────────────────────────────────────────────────────────────────────────────

import { formatCurrency, formatCurrencyPrecise } from "@/lib/insights/benchmarks";
import type { Insight }                           from "@/lib/insights/types";

// ─── Rule thresholds (documented with sources) ───────────────────────────────

/**
 * Average EV purchase price premium over comparable gas vehicle, US market 2025.
 * Source: Cox Automotive / Kelley Blue Book median transaction price gap.
 * $50,000 EV median vs $42,500 gas median ≈ $7,500 premium.
 */
const EV_PRICE_PREMIUM = 7_500;

/** MPG > 35 → gas car is already fuel-efficient, EV advantage narrows. */
const EFFICIENT_GAS_CAR_MPG = 35;

/** Annual EV savings > $1,200 → meaningful savings framing fires. */
const MEANINGFUL_SAVINGS_THRESHOLD = 1_200;

/** Electricity rate > $0.20/kWh → high rate warning. US avg is $0.16/kWh. */
const HIGH_ELECTRICITY_RATE = 0.20;

/** Break-even > 12 years → payback period is long relative to vehicle life. */
const LONG_BREAKEVEN_THRESHOLD = 12;

// ─── Input / Output types ─────────────────────────────────────────────────────

export interface EvVsGasInputs {
  milesPerYear: number;
  mpg:          number;
  gasPrice:     number;
  kwhPer100mi:  number;
  electricRate: number;
}

export interface EvVsGasOutputs {
  annualSavings:   number;
  annualGasCost:   number;
  annualEvCost:    number;
  /** Phase 6C intelligence output — annual savings × 5 */
  fiveYearSavings?: number;
  /** Phase 6C intelligence output — annual savings × 10 */
  tenYearSavings?:  number;
  /** Phase 6C intelligence output — years to recoup EV_PRICE_PREMIUM */
  breakEvenYears?:  number;
  /** Phase 6C intelligence output — gas cost per mile driven */
  gasCostPerMile?:  number;
  /** Phase 6C intelligence output — EV cost per mile driven */
  evCostPerMile?:   number;
  /** Phase 7D — fuel inflation savings over 10 years at 4%/yr gas price rise */
  fuelInflationSavings10yr?: number;
  /** Phase 7D — EV maintenance savings over 10 years (~$800/yr vs ICE) */
  maintenanceSavings10yr?: number;
  /** Phase 7D — total 10-year EV advantage: inflation-adjusted fuel + maintenance */
  totalAdvantage10yr?: number;
}

// ─── Generator ────────────────────────────────────────────────────────────────

/**
 * Generate all applicable EV vs Gas insights.
 * Focuses on: break-even framing, long-term savings, cost-per-mile comparison,
 * and honest context when the EV advantage is limited.
 *
 * @param inputs   Calculator inputs  (milesPerYear, mpg, gasPrice, …)
 * @param outputs  Calculator outputs (including Phase 6C intelligence fields)
 */
export function generateEvVsGasInsights(
  inputs: EvVsGasInputs,
  outputs: EvVsGasOutputs,
): Insight[] {
  if (outputs.annualGasCost <= 0) return [];

  const insights: Insight[] = [];

  // Resolve intelligence fields with graceful fallback calculation
  const tenYearSavings = outputs.tenYearSavings
    ?? Math.round(outputs.annualSavings * 10);

  const breakEvenYears = outputs.breakEvenYears
    ?? (outputs.annualSavings > 0 ? Math.round((EV_PRICE_PREMIUM / outputs.annualSavings) * 10) / 10 : 99);

  const gasCostPerMile = outputs.gasCostPerMile
    ?? (inputs.mpg > 0 ? Math.round((inputs.gasPrice / inputs.mpg) * 1000) / 1000 : 0);

  const evCostPerMile = outputs.evCostPerMile
    ?? (inputs.milesPerYear > 0 ? Math.round((outputs.annualEvCost / inputs.milesPerYear) * 1000) / 1000 : 0);

  // ── Rule 1: Break-even framing ────────────────────────────────────────────
  if (outputs.annualSavings > 0 && breakEvenYears < LONG_BREAKEVEN_THRESHOLD) {
    insights.push({
      id:       "ev.breakeven",
      category: "investment",
      severity: "positive",
      title:    `EV pays for itself in ${breakEvenYears} years`,
      body:     `With ${formatCurrency(outputs.annualSavings)}/year in fuel savings, the typical ${formatCurrency(EV_PRICE_PREMIUM)} EV price premium is recouped in ${breakEvenYears} year${breakEvenYears === 1 ? "" : "s"} — after which you're ahead on every mile. This doesn't include tax credits, which can reduce break-even further.`,
      metric:   { label: "Break-even point", value: `${breakEvenYears} years` },
    });
  } else if (outputs.annualSavings > 0 && breakEvenYears >= LONG_BREAKEVEN_THRESHOLD) {
    insights.push({
      id:       "ev.long-breakeven",
      category: "neutral",
      severity: "neutral",
      title:    "Long break-even period",
      body:     `At ${formatCurrency(outputs.annualSavings)}/year in savings, recouping the ${formatCurrency(EV_PRICE_PREMIUM)} EV premium takes ${breakEvenYears} years. Federal tax credits ($3,750–$7,500 for qualifying EVs) can bring this down significantly — check current IRS eligibility for your purchase.`,
      metric:   { label: "Break-even (before credits)", value: `${breakEvenYears} years` },
    });
  }

  // ── Rule 2: 10-year savings perspective ───────────────────────────────────
  if (outputs.annualSavings > 0 && tenYearSavings > EV_PRICE_PREMIUM) {
    insights.push({
      id:       "ev.ten-year-savings",
      category: "projection",
      severity: "positive",
      title:    "Strong 10-year savings",
      body:     `Over 10 years your EV fuel savings total ${formatCurrency(tenYearSavings)} — exceeding the ${formatCurrency(EV_PRICE_PREMIUM)} price premium by ${formatCurrency(tenYearSavings - EV_PRICE_PREMIUM)}. Long-term ownership strongly favors the EV on fuel costs alone.`,
      metric:   { label: "10-year savings", value: formatCurrency(tenYearSavings) },
    });
  }

  // ── Rule 3: Meaningful annual savings ─────────────────────────────────────
  if (outputs.annualSavings >= MEANINGFUL_SAVINGS_THRESHOLD) {
    insights.push({
      id:       "ev.meaningful-savings",
      category: "savings",
      severity: "positive",
      title:    `Save ${formatCurrency(Math.round(outputs.annualSavings / 12))}/month on fuel`,
      body:     `Switching to an EV reduces your annual fuel bill from ${formatCurrency(outputs.annualGasCost)} to ${formatCurrency(outputs.annualEvCost)} — saving ${formatCurrency(outputs.annualSavings)}/year or ${formatCurrency(Math.round(outputs.annualSavings / 12))}/month. That's a real, recurring reduction in your monthly cost of living.`,
      metric:   { label: "Monthly savings", value: formatCurrency(Math.round(outputs.annualSavings / 12)) },
    });
  }

  // ── Rule 4: Cost per mile comparison ──────────────────────────────────────
  if (gasCostPerMile > 0 && evCostPerMile > 0) {
    const perMileSavings = Math.round((gasCostPerMile - evCostPerMile) * 1000) / 1000;
    if (perMileSavings > 0.01) {
      insights.push({
        id:       "ev.cost-per-mile",
        category: "comparison",
        severity: "neutral",
        title:    "Per-mile fuel cost comparison",
        body:     `Your gas car costs ${formatCurrencyPrecise(gasCostPerMile)}/mile in fuel; an EV costs ${formatCurrencyPrecise(evCostPerMile)}/mile at home charging rates. On ${Number(inputs.milesPerYear).toLocaleString()} miles per year, the EV saves ${(perMileSavings * 100).toFixed(1)}¢ per mile.`,
        metric:   { label: "Savings per mile", value: `${(perMileSavings * 100).toFixed(1)}¢` },
      });
    }
  }

  // ── Rule 5: Efficient gas car — honest framing ────────────────────────────
  if (inputs.mpg >= EFFICIENT_GAS_CAR_MPG && outputs.annualSavings < MEANINGFUL_SAVINGS_THRESHOLD) {
    insights.push({
      id:       "ev.efficient-gas-car",
      category: "neutral",
      severity: "neutral",
      title:    "Your gas car is already efficient",
      body:     `At ${inputs.mpg} MPG your gas vehicle is already in the top tier for fuel efficiency. The fuel cost gap vs an EV is smaller than average — your savings of ${formatCurrency(outputs.annualSavings)}/year are real but more modest. The EV case may rest more on long-term maintenance savings and environmental factors.`,
      metric:   { label: "Gas car MPG", value: `${inputs.mpg} MPG` },
    });
  }

  // ── Rule 6: High electricity rate ─────────────────────────────────────────
  if (inputs.electricRate >= HIGH_ELECTRICITY_RATE && outputs.annualSavings < MEANINGFUL_SAVINGS_THRESHOLD / 2) {
    insights.push({
      id:       "ev.high-electricity-rate",
      category: "warning",
      severity: "neutral",
      title:    "High electricity rate narrows EV advantage",
      body:     `At ${formatCurrencyPrecise(inputs.electricRate)}/kWh your electricity cost is above the US average of $0.16/kWh. This reduces the EV fuel savings significantly. Consider whether you can charge at lower off-peak rates, or use workplace or public charging at lower tariffs to improve your EV economics.`,
      metric:   { label: "Your electricity rate", value: formatCurrencyPrecise(inputs.electricRate) },
    });
  }

  // ── Rule 7: Fuel inflation protection ────────────────────────────────────
  const fuelInflationSavings10yr = outputs.fuelInflationSavings10yr
    ?? Math.round((() => { let s = 0; for (let i = 0; i < 10; i++) { s += Math.max(0, outputs.annualGasCost * Math.pow(1.04, i) - outputs.annualEvCost); } return s; })());
  if (outputs.annualSavings > 0 && fuelInflationSavings10yr > outputs.annualSavings * 10) {
    insights.push({
      id:       "ev.fuel-inflation-protection",
      category: "projection",
      severity: "positive",
      title:    `If fuel rises 4%/yr, your 10-year savings grow to ${formatCurrency(fuelInflationSavings10yr)}`,
      body:     `Gas prices have averaged ~4% annual inflation historically. With that trajectory, your fuel savings over 10 years balloon to ${formatCurrency(fuelInflationSavings10yr)} — ${formatCurrency(fuelInflationSavings10yr - outputs.annualSavings * 10)} more than the flat estimate. An EV is an inflation hedge on fuel.`,
      metric:   { label: "Inflation-adjusted 10-yr savings", value: formatCurrency(fuelInflationSavings10yr) },
    });
  }

  // ── Rule 8: Total 10-year advantage (fuel + maintenance) ──────────────────
  const totalAdvantage10yr = outputs.totalAdvantage10yr
    ?? fuelInflationSavings10yr + 8000;
  if (totalAdvantage10yr > 10000) {
    insights.push({
      id:       "ev.total-advantage",
      category: "projection",
      severity: "positive",
      title:    `Total 10-year advantage: ${formatCurrency(totalAdvantage10yr)}`,
      body:     `Including fuel inflation savings (${formatCurrency(fuelInflationSavings10yr)}) and ~$8,000 in avoided maintenance — EVs average $800/yr less in repairs vs gas cars — your total 10-year financial advantage reaches ${formatCurrency(totalAdvantage10yr)}.`,
      metric:   { label: "10-yr fuel + maintenance edge", value: formatCurrency(totalAdvantage10yr) },
    });
  }

  return insights;
}
