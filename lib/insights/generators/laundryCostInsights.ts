// ─── WorthCore Insight Engine — Laundry Cost Generator ────────────────────────
//
// PURPOSE:
//   Deterministic, visual insight rules for the "laundry-cost-calculator".
//   Surfaces the annual cost, per-load cost breakdown (donut), cold-water
//   saving, machine upgrade saving, and a home-vs-laundromat comparison.
//
// RULES:
//   ✅ Pure TypeScript — synchronous, deterministic, no side effects
//   ✅ Live electricity rate carries a provenance caption
//   ❌ Never import React · never call fetch()
//
// ─────────────────────────────────────────────────────────────────────────────

import { formatCurrency, formatCurrencyPrecise } from "@/lib/insights/benchmarks";
import type { Insight, InsightVisualization } from "@/lib/insights/types";
import {
  WATER_COST_PER_LOAD,
  LAUNDROMAT_COST_PER_LOAD,
} from "@/calculations/home/laundryCost";
import { usStateElectricityDataset } from "@/lib/datasets/regional/usStateElectricityPrices";

// ── Thresholds ────────────────────────────────────────────────────────────────
const HIGH_RATE_THRESHOLD = 0.20;

// ─── Input / Output types ─────────────────────────────────────────────────────

export interface LaundryInputs {
  state:         string;
  loadsPerWeek:  number;
  machineType:   string;
  waterTemp:     string;
  detergentCost: number;
  /** Optional user-entered $/kWh; when > 0 it overrides the live state rate. */
  electricRateOverride?: number;
}

export interface LaundryOutputs {
  costPerLoad:            number;
  weeklyCost:             number;
  annualCost:             number;
  electricityCostPerLoad: number;
  electricityPct:         number;
  waterCostPerLoad:       number;
  detergentCostPerLoad:   number;
  annualKwh:              number;
  totalKwhPerLoad:        number;
  washerKwhAdj:           number;
  dryerKwh:               number;
  electricRate:           number;
  heFrontColdAnnual:      number;
  laundromatAnnual:       number;
}

// ─── Generator ────────────────────────────────────────────────────────────────

export function generateLaundryCostInsights(
  inputs: LaundryInputs,
  outputs: LaundryOutputs,
): Insight[] {
  if (outputs.costPerLoad <= 0) return [];

  const insights: Insight[] = [];
  const customRate = (inputs.electricRateOverride ?? 0) > 0;
  const stateLabel =
    inputs.state && inputs.state !== "National" ? inputs.state : "the US average";

  const liveCaption = customRate
    ? {
        text: `Your electricity $${outputs.electricRate.toFixed(3)}/kWh`,
        asOf: usStateElectricityDataset.currentPeriodLabel,
        live: false,
      }
    : {
        text: `${stateLabel} electricity $${outputs.electricRate.toFixed(3)}/kWh`,
        asOf: usStateElectricityDataset.currentPeriodLabel,
        live: true,
      };

  // ── 1. Annual cost headline ───────────────────────────────────────────────
  insights.push({
    id:       "laundry.annual-cost",
    severity: outputs.annualCost >= 500 ? "warning" : "neutral",
    category: "spending",
    title:    `Your laundry costs ${formatCurrency(outputs.annualCost)} a year.`,
    body:     `At ${formatCurrencyPrecise(outputs.costPerLoad)}/load and ${inputs.loadsPerWeek} loads a week ${customRate ? `at your rate` : `in ${stateLabel}`} ($${outputs.electricRate.toFixed(3)}/kWh), that's ${formatCurrency(outputs.weeklyCost)} a week and ${formatCurrency(outputs.annualCost)} over 52 weeks — using about ${outputs.annualKwh.toLocaleString()} kWh of electricity.`,
    metric:   { label: "Annual laundry", value: formatCurrency(outputs.annualCost) },
  });

  // ── 2. Per-load cost breakdown — donut (live) ─────────────────────────────
  {
    const elecShare  = Math.round(outputs.electricityPct);
    const waterShare = outputs.costPerLoad > 0
      ? Math.round((WATER_COST_PER_LOAD / outputs.costPerLoad) * 100)
      : 0;
    const detShare = Math.max(0, 100 - elecShare - waterShare);
    insights.push({
      id:       "laundry.cost-breakdown",
      severity: "neutral",
      category: "spending",
      title:    `Electricity is ${elecShare}% of each load's cost.`,
      body:     `Of your ${formatCurrencyPrecise(outputs.costPerLoad)}/load: electricity is ${formatCurrencyPrecise(outputs.electricityCostPerLoad)} (${outputs.totalKwhPerLoad.toFixed(1)} kWh), water is ${formatCurrencyPrecise(WATER_COST_PER_LOAD)}, and detergent is ${formatCurrencyPrecise(outputs.detergentCostPerLoad)}. The dryer alone accounts for ${outputs.dryerKwh.toFixed(1)} of the ${outputs.totalKwhPerLoad.toFixed(1)} kWh — it's the expensive half.`,
      visualization: {
        type:    "donut",
        segments: [
          { label: "Electricity", value: elecShare,  color: "#f59e0b" },
          { label: "Water",       value: waterShare,  color: "#3b82f6" },
          { label: "Detergent",   value: detShare,    color: "#10b981" },
        ],
        centerLabel: `${formatCurrencyPrecise(outputs.costPerLoad)}/load`,
        format:  "percent",
        caption: liveCaption,
      } satisfies InsightVisualization,
    });
  }

  // ── 3. Cold-water saving — delta-card ─────────────────────────────────────
  if (inputs.waterTemp !== "cold") {
    const coldWasherKwh = outputs.dryerKwh === 0 ? 0 : (outputs.totalKwhPerLoad - outputs.dryerKwh);
    const coldAdjKwh    = Math.round(coldWasherKwh * 0.20 * 100) / 100;
    const coldTotalKwh  = Math.round((coldAdjKwh + outputs.dryerKwh) * 100) / 100;
    const coldElecCost  = Math.round(coldTotalKwh * outputs.electricRate * 100) / 100;
    const coldCostPerLoad = Math.round((coldElecCost + WATER_COST_PER_LOAD + outputs.detergentCostPerLoad) * 100) / 100;
    const coldAnnual    = Math.round(coldCostPerLoad * inputs.loadsPerWeek * 52 * 100) / 100;
    const saving        = Math.round((outputs.annualCost - coldAnnual) * 100) / 100;
    if (saving > 5) {
      insights.push({
        id:       "laundry.cold-water",
        severity: "positive",
        category: "savings",
        title:    `Switching to cold water saves ${formatCurrency(saving)}/year.`,
        body:     `Cold water cuts the washer's energy use by ~80% (the dryer stays the same). That drops your per-load cost to ${formatCurrencyPrecise(coldCostPerLoad)} and your annual spend to ${formatCurrency(coldAnnual)} — saving ${formatCurrency(saving)} with no detergent change needed (modern formulas work fine in cold).`,
        visualization: {
          type:   "delta-card",
          before: { label: `${inputs.waterTemp} water`, value: formatCurrency(outputs.annualCost) },
          after:  { label: "Cold water",                value: formatCurrency(coldAnnual) },
          delta:  { label: "Saved / yr",                value: formatCurrency(saving), positive: true },
        } satisfies InsightVisualization,
      });
    }
  }

  // ── 4. Machine upgrade — delta-card ───────────────────────────────────────
  if (inputs.machineType !== "he_front" && outputs.heFrontColdAnnual < outputs.annualCost) {
    const saving = Math.round((outputs.annualCost - outputs.heFrontColdAnnual) * 100) / 100;
    if (saving > 20) {
      insights.push({
        id:       "laundry.machine-upgrade",
        severity: "positive",
        category: "savings",
        title:    `An HE front-loader + cold water would save ${formatCurrency(saving)}/year.`,
        body:     `The best-case scenario: an Energy Star HE front-loader (2.65 kWh/load) on cold water costs about ${formatCurrency(outputs.heFrontColdAnnual)}/year at your rate — vs ${formatCurrency(outputs.annualCost)} now. The ${formatCurrency(saving)}/year saving helps offset the appliance cost over time.`,
        visualization: {
          type:   "delta-card",
          before: { label: "Current setup", value: formatCurrency(outputs.annualCost) },
          after:  { label: "HE + cold",     value: formatCurrency(outputs.heFrontColdAnnual) },
          delta:  { label: "Saved / yr",    value: formatCurrency(saving), positive: true },
        } satisfies InsightVisualization,
      });
    }
  }

  // ── 5. Home vs laundromat — benchmark-bar ─────────────────────────────────
  {
    const homeSaving = Math.round((outputs.laundromatAnnual - outputs.annualCost) * 100) / 100;
    if (homeSaving > 0) {
      insights.push({
        id:       "laundry.vs-laundromat",
        severity: "positive",
        category: "comparison",
        title:    `Doing laundry at home saves ${formatCurrency(homeSaving)}/year vs a laundromat.`,
        body:     `At ${formatCurrencyPrecise(LAUNDROMAT_COST_PER_LOAD)}/load (average laundromat wash + dry), ${inputs.loadsPerWeek} loads/week would cost ${formatCurrency(outputs.laundromatAnnual)}/year. At home you pay ${formatCurrency(outputs.annualCost)} — a ${formatCurrency(homeSaving)} annual saving that compounds into serious money over the life of your machine.`,
        visualization: {
          type:           "benchmark-bar",
          userValue:      outputs.annualCost,
          userLabel:      "At home",
          benchmarkValue: outputs.laundromatAnnual,
          benchmarkLabel: "Laundromat",
          format:         "currency",
        } satisfies InsightVisualization,
      });
    }
  }

  // ── 6. High electricity rate warning (conditional) ────────────────────────
  if (outputs.electricRate >= HIGH_RATE_THRESHOLD) {
    insights.push({
      id:       "laundry.high-rate",
      severity: "warning",
      category: "spending",
      title:    `Your electricity rate ($${outputs.electricRate.toFixed(3)}/kWh) is above the national average.`,
      body:     `At $${outputs.electricRate.toFixed(3)}/kWh, electricity alone costs ${formatCurrencyPrecise(outputs.electricityCostPerLoad)} per load — nearly double what someone at the national average ($0.16/kWh) pays. Cold water and an efficient machine are especially valuable at your rate.`,
      metric:   { label: "Your rate", value: `$${outputs.electricRate.toFixed(3)}/kWh` },
    });
  }

  return insights;
}
