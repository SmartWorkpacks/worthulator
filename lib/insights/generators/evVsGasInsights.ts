// ─── WorthCore Insight Engine — EV vs Gas Generator ──────────────────────────
//
// PURPOSE:
//   Deterministic, visual insight rules for the "ev-vs-gas" engine calculator.
//   Surfaces per-mile cost comparison, annual cost delta, a 10-year
//   inflation-adjusted savings projection, break-even framing, and honest
//   context when public charging or local prices erode the EV advantage.
//
// RULES:
//   ✅ Pure TypeScript — synchronous, deterministic, no side effects
//   ✅ Every constant is documented with a source comment (see calc module)
//   ✅ Live prices carry a provenance caption with their vintage
//   ❌ Never import React · never call fetch()
//
// ─────────────────────────────────────────────────────────────────────────────

import { formatCurrency, formatCurrencyPrecise } from "@/lib/insights/benchmarks";
import type { Insight, InsightVisualization } from "@/lib/insights/types";
import { EV_PRICE_PREMIUM, GAS_INFLATION } from "@/calculations/finance/evVsGas";
import { usStateFuelDataset } from "@/lib/datasets/usStateFuelPrices";

const LONG_BREAKEVEN_THRESHOLD = 12;

// ─── Input / Output types ─────────────────────────────────────────────────────

export interface EvVsGasInputs {
  state:             string;
  milesPerYear:      number;
  mpg:               number;
  kwhPer100mi:       number;
  publicChargingPct: number;
  /** Optional user-entered prices; when > 0 they override the live state values. */
  gasPriceOverride?:     number;
  electricRateOverride?: number;
}

export interface EvVsGasOutputs {
  annualSavings:    number;
  annualGasCost:    number;
  annualEvCost:     number;
  gasCostPerMile:   number;
  evCostPerMile:    number;
  effectiveKwhRate: number;
  gasPrice:         number;
  homeElectricRate: number;
  tenYearSavings?:           number;
  breakEvenYears?:           number;
  fuelInflationSavings10yr?: number;
  maintenanceSavings10yr?:   number;
  totalAdvantage10yr?:       number;
}

// ─── Generator ────────────────────────────────────────────────────────────────

export function generateEvVsGasInsights(
  inputs: EvVsGasInputs,
  outputs: EvVsGasOutputs,
): Insight[] {
  if (outputs.annualGasCost <= 0) return [];

  const insights: Insight[] = [];
  const stateLabel = inputs.state && inputs.state !== "National" ? inputs.state : "US average";

  const breakEvenYears = outputs.breakEvenYears
    ?? (outputs.annualSavings > 0 ? Math.round((EV_PRICE_PREMIUM / outputs.annualSavings) * 10) / 10 : 99);
  const fuelInflation10 = outputs.fuelInflationSavings10yr ?? Math.round(outputs.annualSavings * 10);
  const totalAdvantage10 = outputs.totalAdvantage10yr ?? (fuelInflation10 + 8000);

  // Provenance caption shared by the live-priced visuals. If the user entered
  // their own gas/electricity price, drop the live stamp — it's no longer
  // dataset-sourced.
  const customPrice =
    (inputs.gasPriceOverride ?? 0) > 0 || (inputs.electricRateOverride ?? 0) > 0;
  const liveCaption = customPrice
    ? {
        text: `Your prices: gas $${outputs.gasPrice.toFixed(2)}/gal · home power $${outputs.homeElectricRate.toFixed(2)}/kWh`,
        asOf: usStateFuelDataset.currentPeriodLabel,
        live: false,
      }
    : {
        text: `${stateLabel} gas $${outputs.gasPrice.toFixed(2)}/gal · home power $${outputs.homeElectricRate.toFixed(2)}/kWh`,
        asOf: usStateFuelDataset.currentPeriodLabel,
        live: true,
      };

  // ── 1. Per-mile cost — benchmark-bar (live) ───────────────────────────────
  if (outputs.evCostPerMile > 0 && outputs.gasCostPerMile > 0) {
    const perMileSavingsCents = Math.round((outputs.gasCostPerMile - outputs.evCostPerMile) * 1000) / 10;
    insights.push({
      id:       "ev.cost-per-mile",
      severity: perMileSavingsCents > 0 ? "positive" : "neutral",
      category: "comparison",
      title:
        perMileSavingsCents > 0
          ? `Every mile costs ${perMileSavingsCents.toFixed(1)}¢ less in an EV.`
          : `In ${stateLabel}, the per-mile costs are close.`,
      body:
        `At ${stateLabel} prices, fueling the gas car costs ${formatCurrencyPrecise(outputs.gasCostPerMile)} per mile; charging the EV costs ${formatCurrencyPrecise(outputs.evCostPerMile)} per mile. Across ${Number(inputs.milesPerYear).toLocaleString()} miles a year that gap is worth ${formatCurrency(outputs.annualSavings)}.`,
      visualization: {
        type:           "benchmark-bar",
        userValue:      outputs.evCostPerMile,
        userLabel:      "EV / mile",
        benchmarkValue: outputs.gasCostPerMile,
        benchmarkLabel: "Gas / mile",
        format:         "currency",
        caption:        liveCaption,
      } satisfies InsightVisualization,
    });
  }

  // ── 2. Annual fuel bill — delta-card ──────────────────────────────────────
  insights.push({
    id:       "ev.annual-bill",
    severity: outputs.annualSavings >= 0 ? "positive" : "warning",
    category: outputs.annualSavings >= 0 ? "savings" : "spending",
    title:
      outputs.annualSavings >= 0
        ? `Your fuel bill drops to ${formatCurrency(outputs.annualEvCost)} a year.`
        : `Here the EV costs ${formatCurrency(Math.abs(outputs.annualSavings))} more a year to fuel.`,
    body:
      outputs.annualSavings >= 0
        ? `Switching from the gas car to an EV takes your annual fuel cost from ${formatCurrency(outputs.annualGasCost)} down to ${formatCurrency(outputs.annualEvCost)} — ${formatCurrency(outputs.annualSavings)} back in your pocket every year, or about ${formatCurrency(Math.round(outputs.annualSavings / 12))} a month.`
        : `With ${stateLabel} electricity prices${inputs.publicChargingPct >= 25 ? ` and ${inputs.publicChargingPct}% public fast charging` : ""}, the EV's annual fuel cost of ${formatCurrency(outputs.annualEvCost)} runs above the gas car's ${formatCurrency(outputs.annualGasCost)}. Charging more at home would close the gap.`,
    visualization: {
      type:   "delta-card",
      before: { label: "Gas car / yr", value: formatCurrency(outputs.annualGasCost) },
      after:  { label: "EV / yr",      value: formatCurrency(outputs.annualEvCost) },
      delta:  {
        label:    outputs.annualSavings >= 0 ? "Saved / yr" : "Extra / yr",
        value:    `${outputs.annualSavings >= 0 ? "" : "−"}${formatCurrency(Math.abs(outputs.annualSavings))}`,
        positive: outputs.annualSavings >= 0,
      },
    } satisfies InsightVisualization,
  });

  // ── 3. 10-year inflation-adjusted projection — projection-line ────────────
  if (outputs.annualSavings > 0) {
    const sampleYears = [1, 2, 3, 5, 7, 10];
    let cumulative = 0;
    const cumByYear: number[] = [];
    for (let y = 1; y <= 10; y++) {
      cumulative += Math.max(0, outputs.annualGasCost * Math.pow(1 + GAS_INFLATION, y - 1) - outputs.annualEvCost);
      cumByYear[y] = cumulative;
    }
    const points = sampleYears.map((y) => ({ label: `Yr ${y}`, value: Math.round(cumByYear[y]) }));

    insights.push({
      id:       "ev.ten-year-projection",
      severity: "positive",
      category: "projection",
      title:    `Over 10 years you keep about ${formatCurrency(fuelInflation10)}.`,
      body:     `Gas prices have risen roughly ${Math.round(GAS_INFLATION * 100)}% a year historically. As they climb, your fixed home-charging cost makes the gap widen — the savings curve bends upward rather than running flat.`,
      visualization: {
        type:   "projection-line",
        points,
        format: "currency",
        yLabel: "Cumulative savings",
        color:  "#10b981",
        caption: { text: `Assumes ${Math.round(GAS_INFLATION * 100)}%/yr gas inflation, flat electricity` },
      } satisfies InsightVisualization,
    });
  }

  // ── 4. Break-even on the EV price premium — metric framing ────────────────
  if (outputs.annualSavings > 0 && breakEvenYears < LONG_BREAKEVEN_THRESHOLD) {
    insights.push({
      id:       "ev.breakeven",
      severity: "positive",
      category: "investment",
      title:    `Fuel savings repay the EV price premium in ${breakEvenYears} years.`,
      body:     `EVs still sell for about ${formatCurrency(EV_PRICE_PREMIUM)} more than a comparable gas car. At ${formatCurrency(outputs.annualSavings)}/year in fuel savings that premium is recovered in ${breakEvenYears} year${breakEvenYears === 1 ? "" : "s"} — before any federal tax credit, which can shorten it further.`,
      metric:   { label: "Break-even", value: `${breakEvenYears} yrs` },
    });
  } else if (outputs.annualSavings > 0) {
    insights.push({
      id:       "ev.long-breakeven",
      severity: "neutral",
      category: "neutral",
      title:    `The ${formatCurrency(EV_PRICE_PREMIUM)} price premium takes ${breakEvenYears} years to recover on fuel alone.`,
      body:     `At ${formatCurrency(outputs.annualSavings)}/year, fuel savings recover the EV premium slowly here. Federal tax credits of up to ${formatCurrency(7500)} for qualifying EVs can change this materially — check current IRS eligibility.`,
      metric:   { label: "Break-even", value: `${breakEvenYears} yrs` },
    });
  }

  // ── 5. Public-charging realism ────────────────────────────────────────────
  if (inputs.publicChargingPct >= 50 && outputs.annualSavings > 0) {
    insights.push({
      id:       "ev.public-charging",
      severity: "neutral",
      category: "hidden-cost",
      title:    `${inputs.publicChargingPct}% public charging is quietly costing you.`,
      body:     `Public DC fast charging runs about 3x the price of home charging, which is why your blended rate sits at ${formatCurrencyPrecise(outputs.effectiveKwhRate)}/kWh. Shifting more sessions to overnight home charging is the single biggest lever on your EV running cost.`,
      metric:   { label: "Blended rate", value: `${formatCurrencyPrecise(outputs.effectiveKwhRate)}/kWh` },
    });
  }

  // ── 6. Total 10-year advantage (fuel + maintenance) ───────────────────────
  if (outputs.annualSavings > 0 && totalAdvantage10 > 10_000) {
    insights.push({
      id:       "ev.total-advantage",
      severity: "positive",
      category: "projection",
      title:    `Total 10-year advantage: about ${formatCurrency(totalAdvantage10)}.`,
      body:     `Adding inflation-adjusted fuel savings (${formatCurrency(fuelInflation10)}) to roughly ${formatCurrency(outputs.maintenanceSavings10yr ?? 8000)} in avoided maintenance — EVs skip oil changes, transmission service, and most brake jobs — the EV's total financial edge over 10 years reaches about ${formatCurrency(totalAdvantage10)}.`,
      metric:   { label: "10-yr edge", value: formatCurrency(totalAdvantage10) },
    });
  }

  return insights;
}
