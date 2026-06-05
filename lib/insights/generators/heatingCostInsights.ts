// ─── WorthCore Insight Engine — Home Heating Cost Generator ───────────────────
//
// PURPOSE:
//   State-aware, visual insights for the "heating-cost" calculator. Surfaces
//   the annual cost in context, cross-fuel comparison, insulation upgrade
//   opportunity, 10-year projection, and high-rate-state context.
//
// RULES:
//   ✅ Pure TypeScript — synchronous, deterministic, no side effects
//   ✅ Live gas and electricity rates carry provenance captions
//   ❌ Never import React · never call fetch()
//
// ─────────────────────────────────────────────────────────────────────────────

import { formatCurrency, formatCurrencyPrecise } from "@/lib/insights/benchmarks";
import type { Insight, InsightVisualization }     from "@/lib/insights/types";
import { ENERGY_INFLATION }                        from "@/calculations/energy/heatingCost";
import { usStateNaturalGasDataset }                from "@/lib/datasets/regional/usStateNaturalGasPrices";
import { usStateElectricityDataset }               from "@/lib/datasets/regional/usStateElectricityPrices";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface HeatingCostInsightInputs {
  state:       string;
  heatingDays: number;
  homeSqFt:    number;
  heatSource:  string;
  insulation:  string;
  /** Optional user-entered price for the selected fuel; > 0 overrides live. */
  fuelPriceOverride?: number;
}

export interface HeatingCostInsightOutputs {
  annualHeatingCost:      number;
  monthlyCost:            number;
  costPerHeatingDay:      number;
  annualKBtu:             number;
  annualGasCost:          number;
  annualElecCost:         number;
  annualPropaneCost:      number;
  thermsEquivalent:       number;
  insulationUpgradeSaving: number;
  tenYearCost:            number;
  inflatedCost10yr:       number;
  gasPrice:               number;
  electricRate:           number;
}

// ─── Generator ────────────────────────────────────────────────────────────────

export function generateHeatingCostInsights(
  inputs:  HeatingCostInsightInputs,
  outputs: HeatingCostInsightOutputs,
): Insight[] {
  if (outputs.annualHeatingCost <= 0) return [];

  const insights: Insight[] = [];
  const stateLabel  = inputs.state && inputs.state !== "National" ? inputs.state : "the US average";
  const heatSource  = inputs.heatSource ?? "gas";
  const customFuelPrice = (inputs.fuelPriceOverride ?? 0) > 0;
  const customGas = customFuelPrice && heatSource === "gas";

  const gasCaption = customGas
    ? {
        text: `Your natural gas $${outputs.gasPrice.toFixed(2)}/therm`,
        asOf: usStateNaturalGasDataset.currentPeriodLabel,
        live: false,
      }
    : {
        text: `${stateLabel} natural gas $${outputs.gasPrice.toFixed(2)}/therm`,
        asOf: usStateNaturalGasDataset.currentPeriodLabel,
        live: true,
      };

  // ── 1. Annual cost headline — benchmark-bar (vs national avg for same home) ─
  // National avg gas cost for same inputs at the national avg gas price
  const nationalGasAvg = usStateNaturalGasDataset.national;
  const nationalRef    = Math.round(
    outputs.annualKBtu / 100 / 0.80 * nationalGasAvg,
  );
  const aboveNational  = outputs.annualHeatingCost > nationalRef * 1.1;

  insights.push({
    id:       "heating.annual-cost",
    severity: aboveNational ? "warning" : "neutral",
    category: "spending",
    title:    `Your home costs ${formatCurrency(outputs.annualHeatingCost)}/year to heat.`,
    body:     `At ${customGas ? "your" : `${stateLabel}'s`} rate of $${outputs.gasPrice.toFixed(2)}/therm, a ${Number(inputs.homeSqFt).toLocaleString()} sq ft home with ${inputs.insulation} insulation over ${inputs.heatingDays} heating days works out to ${formatCurrency(outputs.monthlyCost)}/month — about ${formatCurrency(outputs.costPerHeatingDay)} per heating day.`,
    metric:   { label: "Per year", value: formatCurrency(outputs.annualHeatingCost) },
    visualization: {
      type:           "benchmark-bar",
      userValue:      Math.round(outputs.annualHeatingCost),
      userLabel:      `Your cost (${heatSource})`,
      benchmarkValue: nationalRef,
      benchmarkLabel: "National avg (gas)",
      format:         "currency",
      caption:        gasCaption,
    } satisfies InsightVisualization,
  });

  // ── 2. Cross-fuel comparison — delta-card ─────────────────────────────────
  // Find the cheapest of the three fuels and show the saving vs. current
  const fuelCosts: Record<string, number> = {
    gas:      outputs.annualGasCost,
    electric: outputs.annualElecCost,
    propane:  outputs.annualPropaneCost,
  };
  const fuelLabels: Record<string, string> = {
    gas:      "Natural gas",
    electric: "Electric",
    propane:  "Propane",
  };

  const otherFuels = Object.entries(fuelCosts).filter(([key]) => key !== heatSource);
  const [cheapestFuel, cheapestCost] = otherFuels.reduce(
    (best, curr) => curr[1] < best[1] ? curr : best,
    otherFuels[0],
  );
  const saving = round2(outputs.annualHeatingCost - cheapestCost);

  if (Math.abs(saving) >= 50) {
    const customElec = customFuelPrice && heatSource === "electric";
    const elecCaption = heatSource === "electric" || cheapestFuel === "electric"
      ? customElec
        ? { text: `Your electricity $${outputs.electricRate.toFixed(3)}/kWh`, asOf: usStateElectricityDataset.currentPeriodLabel, live: false }
        : { text: `${stateLabel} electricity $${outputs.electricRate.toFixed(3)}/kWh`, asOf: usStateElectricityDataset.currentPeriodLabel, live: true }
      : undefined;

    insights.push({
      id:       "heating.fuel-comparison",
      severity: saving > 200 ? "positive" : "neutral",
      category: "comparison",
      title:    saving > 0
        ? `Switching to ${fuelLabels[cheapestFuel]} could save ${formatCurrency(saving)}/year.`
        : `${fuelLabels[cheapestFuel]} would cost ${formatCurrency(Math.abs(saving))} more per year.`,
      body:     `At current rates, ${fuelLabels[heatSource]} (${formatCurrency(outputs.annualHeatingCost)}/yr) vs. ${fuelLabels[cheapestFuel]} (${formatCurrency(cheapestCost)}/yr) for the same home and usage pattern. ${
        saving > 0
          ? `That's ${formatCurrency(saving * 10)} over 10 years — worth modelling a heat pump or fuel conversion if your system is due for replacement.`
          : `${fuelLabels[heatSource]} remains the cheaper option here.`
      }`,
      visualization: {
        type:   "delta-card",
        before: { label: `${fuelLabels[heatSource]} / yr`,  value: formatCurrencyPrecise(outputs.annualHeatingCost) },
        after:  { label: `${fuelLabels[cheapestFuel]} / yr`, value: formatCurrencyPrecise(cheapestCost) },
        delta:  { label: saving > 0 ? "Potential saving" : "Extra cost", value: formatCurrencyPrecise(Math.abs(saving)), positive: saving > 0 },
        ...(elecCaption ? { caption: elecCaption } : {}),
      } satisfies InsightVisualization,
    });
  }

  // ── 3. Insulation upgrade opportunity — delta-card ────────────────────────
  if (outputs.insulationUpgradeSaving >= 50 && inputs.insulation !== "excellent") {
    const improvedCost = round2(outputs.annualHeatingCost - outputs.insulationUpgradeSaving);
    const insulLabel   = inputs.insulation === "poor"
      ? "Upgrading from poor to excellent insulation"
      : inputs.insulation === "average"
        ? "Upgrading to excellent insulation (R-30+, air-sealed)"
        : "Reaching passive-house-class insulation";
    insights.push({
      id:       "heating.insulation-opportunity",
      severity: "positive",
      category: "investment-opportunity",
      title:    `${insulLabel} would save ${formatCurrency(outputs.insulationUpgradeSaving)}/year.`,
      body:     `Excellent insulation (R-30+ walls, triple-pane, air-sealed) uses ~35% less energy than a code-minimum home and ~54% less than poor insulation. On your current system that's ${formatCurrency(outputs.insulationUpgradeSaving)}/yr — ${formatCurrency(outputs.insulationUpgradeSaving * 10)} over 10 years. Typical whole-home insulation upgrades run $5,000–$15,000, often with utility rebates.`,
      visualization: {
        type:   "delta-card",
        before: { label: `${inputs.insulation === "poor" ? "Poor" : inputs.insulation === "average" ? "Average" : "Good"} insulation / yr`, value: formatCurrencyPrecise(outputs.annualHeatingCost) },
        after:  { label: "Excellent insulation / yr",  value: formatCurrencyPrecise(improvedCost) },
        delta:  { label: "Saved / yr", value: formatCurrencyPrecise(outputs.insulationUpgradeSaving), positive: true },
      } satisfies InsightVisualization,
    });
  }

  // ── 4. 10-year inflation-adjusted projection — projection-line ─────────────
  {
    const sampleYears = [1, 2, 3, 5, 7, 10];
    let cumulative = 0;
    const cumByYear: number[] = [];
    for (let y = 1; y <= 10; y++) {
      cumulative += outputs.annualHeatingCost * Math.pow(1 + ENERGY_INFLATION, y - 1);
      cumByYear[y] = cumulative;
    }
    const points        = sampleYears.map((y) => ({ label: `Yr ${y}`, value: Math.round(cumByYear[y]) }));
    const inflationExtra = Math.round(outputs.inflatedCost10yr - outputs.tenYearCost);

    insights.push({
      id:       "heating.ten-year-projection",
      severity: outputs.inflatedCost10yr > 15000 ? "warning" : "neutral",
      category: "projection",
      title:    `Over 10 years this heating bill runs to ${formatCurrency(outputs.inflatedCost10yr)}.`,
      body:     `Flat over 10 years: ${formatCurrency(outputs.tenYearCost)}. With ~${Math.round(ENERGY_INFLATION * 100)}%/yr energy price inflation the total rises to ${formatCurrency(outputs.inflatedCost10yr)} — ${formatCurrency(inflationExtra)} more. Efficiency upgrades (insulation, high-AFUE furnace, or heat pump) lock in today's lower consumption against future rate increases.`,
      visualization: {
        type:    "projection-line",
        points,
        format:  "currency",
        yLabel:  "Cumulative heating cost",
        color:   "#ef4444",
        caption: {
          text: `${customFuelPrice ? "Your rate" : stateLabel} · ~${Math.round(ENERGY_INFLATION * 100)}%/yr energy inflation`,
          asOf: usStateNaturalGasDataset.currentPeriodLabel,
          live: !customFuelPrice,
        },
      } satisfies InsightVisualization,
    });
  }

  // ── 5. High-cost-state context (skip when a custom gas price is entered) ──
  if (
    !customGas &&
    outputs.gasPrice > usStateNaturalGasDataset.national * 1.30 &&
    inputs.state !== "National" &&
    heatSource === "gas"
  ) {
    const abovePct = Math.round((outputs.gasPrice / usStateNaturalGasDataset.national - 1) * 100);
    insights.push({
      id:       "heating.high-gas-state",
      severity: "neutral",
      category: "comparison",
      title:    `${inputs.state} gas rates run ${abovePct}% above the US average.`,
      body:     `At ${formatCurrencyPrecise(outputs.gasPrice)}/therm, ${inputs.state} sits ${abovePct}% above the national average of ${formatCurrencyPrecise(usStateNaturalGasDataset.national)}/therm. Efficiency upgrades and insulation pay back faster here — as does investigating whether a heat pump (which uses electricity rather than gas) makes economic sense given local rates.`,
      metric:   { label: `${inputs.state} gas rate`, value: `$${outputs.gasPrice.toFixed(2)}/therm` },
    });
  }

  return insights;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const round2 = (n: number) => Math.round(n * 100) / 100;
