// ─── WorthCore Insight Engine — Appliance Energy Cost Generator ──────────────
//
// PURPOSE:
//   Deterministic, visual insight rules for the "appliance-energy-cost" engine
//   calculator. Surfaces the annual running cost, this device's share of a
//   whole-home power bill (live, state-aware), the saving from an efficient
//   replacement, and a 10-year inflation-adjusted projection.
//
// RULES:
//   ✅ Pure TypeScript — synchronous, deterministic, no side effects
//   ✅ Live electricity rate carries a provenance caption with its vintage
//   ❌ Never import React · never call fetch()
//
// ─────────────────────────────────────────────────────────────────────────────

import { formatCurrency } from "@/lib/insights/benchmarks";
import type { Insight, InsightVisualization } from "@/lib/insights/types";
import {
  AVG_HOME_KWH_PER_YEAR,
  ELECTRICITY_INFLATION,
} from "@/calculations/energy/applianceCost";
import { usStateElectricityDataset } from "@/lib/datasets/regional/usStateElectricityPrices";

// ─── Input / Output types ─────────────────────────────────────────────────────

export interface ApplianceEnergyInputs {
  state:       string;
  watts:       number;
  hoursPerDay: number;
  daysPerWeek: number;
  quantity:    number;
  /** Optional user-entered $/kWh; when > 0 it overrides the live state rate. */
  electricRateOverride?: number;
}

export interface ApplianceEnergyOutputs {
  dailyCost:         number;
  weeklyCost:        number;
  monthlyCost:       number;
  annualCost:        number;
  kWhPerYear:        number;
  tenYearCost:       number;
  inflatedCost10yr:  number;
  asPercentHomeBill: number;
  efficientSavings:  number;
  electricRate:      number;
}

// ─── Generator ────────────────────────────────────────────────────────────────

export function generateApplianceEnergyInsights(
  inputs: ApplianceEnergyInputs,
  outputs: ApplianceEnergyOutputs,
): Insight[] {
  if (outputs.annualCost <= 0) return [];

  const insights: Insight[] = [];
  const customRate = (inputs.electricRateOverride ?? 0) > 0;
  const stateLabel = inputs.state && inputs.state !== "National" ? inputs.state : "the US average";
  const rateLabel = customRate ? "your rate" : `${stateLabel}'s rate`;
  const unitPrefix = inputs.quantity > 1 ? `${inputs.quantity}× ` : "";

  const liveCaption = customRate
    ? {
        text: `Your rate $${outputs.electricRate.toFixed(3)}/kWh`,
        asOf: usStateElectricityDataset.currentPeriodLabel,
        live: false,
      }
    : {
        text: `${stateLabel} residential power $${outputs.electricRate.toFixed(3)}/kWh`,
        asOf: usStateElectricityDataset.currentPeriodLabel,
        live: true,
      };

  // ── 1. Annual cost headline ───────────────────────────────────────────────
  insights.push({
    id:       "appliance.annual-cost",
    severity: outputs.annualCost > 400 ? "warning" : outputs.annualCost > 120 ? "neutral" : "positive",
    category: "spending",
    title:    `This device costs ${formatCurrency(outputs.annualCost)} a year to run.`,
    body:     `At ${rateLabel} of $${outputs.electricRate.toFixed(3)}/kWh, ${unitPrefix}a ${inputs.watts}W device running ${inputs.hoursPerDay}h/day, ${inputs.daysPerWeek} day${inputs.daysPerWeek === 1 ? "" : "s"} a week draws ${outputs.kWhPerYear.toLocaleString()} kWh/yr — about ${formatCurrency(outputs.monthlyCost)} a month, or ${formatCurrency(outputs.dailyCost)} on a day you use it.`,
    metric:   { label: "Per year", value: formatCurrency(outputs.annualCost) },
  });

  // ── 2. Share of a whole-home power bill — donut (live) ────────────────────
  const avgHomeAnnual = AVG_HOME_KWH_PER_YEAR * outputs.electricRate;
  if (outputs.asPercentHomeBill >= 1 && avgHomeAnnual > outputs.annualCost) {
    insights.push({
      id:       "appliance.bill-share",
      severity: outputs.asPercentHomeBill >= 20 ? "warning" : "neutral",
      category: "benchmark-comparison",
      title:    `That's about ${outputs.asPercentHomeBill}% of a typical home's power bill.`,
      body:     `An average US home uses ~${AVG_HOME_KWH_PER_YEAR.toLocaleString()} kWh a year (${formatCurrency(avgHomeAnnual)} at ${stateLabel}'s rate). This one device accounts for roughly ${outputs.asPercentHomeBill}% of that${outputs.asPercentHomeBill >= 20 ? " — a genuine heavy hitter worth optimising." : "."}`,
      visualization: {
        type:        "donut",
        segments: [
          { label: "This device",  value: Math.round(outputs.annualCost),                 color: "#10b981" },
          { label: "Rest of home", value: Math.round(avgHomeAnnual - outputs.annualCost), color: "#e5e7eb" },
        ],
        centerLabel: `${outputs.asPercentHomeBill}%`,
        format:      "currency",
        caption:     liveCaption,
      } satisfies InsightVisualization,
    });
  }

  // ── 3. Efficient replacement — delta-card ─────────────────────────────────
  if (outputs.efficientSavings >= 15) {
    const efficientAnnual = Math.round((outputs.annualCost - outputs.efficientSavings) * 100) / 100;
    insights.push({
      id:       "appliance.efficient-swap",
      severity: "positive",
      category: "investment-opportunity",
      title:    `An efficient model would save about ${formatCurrency(outputs.efficientSavings)} a year.`,
      body:     `ENERGY STAR-class appliances typically use 20–30% less electricity. Swapping to a ~27%-more-efficient version would cut this device's bill from ${formatCurrency(outputs.annualCost)} to about ${formatCurrency(efficientAnnual)} a year — ${formatCurrency(outputs.efficientSavings * 10)} over a decade, which often covers the upgrade on high-draw devices.`,
      visualization: {
        type:   "delta-card",
        before: { label: "This model / yr", value: formatCurrency(outputs.annualCost) },
        after:  { label: "Efficient / yr",  value: formatCurrency(efficientAnnual) },
        delta:  { label: "Saved / yr", value: formatCurrency(outputs.efficientSavings), positive: true },
      } satisfies InsightVisualization,
    });
  }

  // ── 4. 10-year inflation-adjusted projection — projection-line (live) ─────
  {
    const sampleYears = [1, 2, 3, 5, 7, 10];
    let cumulative = 0;
    const cumByYear: number[] = [];
    for (let y = 1; y <= 10; y++) {
      cumulative += outputs.annualCost * Math.pow(1 + ELECTRICITY_INFLATION, y - 1);
      cumByYear[y] = cumulative;
    }
    const points = sampleYears.map((y) => ({ label: `Yr ${y}`, value: Math.round(cumByYear[y]) }));
    const inflationExtra = Math.round(outputs.inflatedCost10yr - outputs.tenYearCost);

    insights.push({
      id:       "appliance.ten-year-projection",
      severity: outputs.inflatedCost10yr > 2000 ? "warning" : "neutral",
      category: "projection",
      title:    `Over 10 years this runs to about ${formatCurrency(outputs.inflatedCost10yr)}.`,
      body:     `At today's rate the flat 10-year cost is ${formatCurrency(outputs.tenYearCost)}. Factoring in ~${Math.round(ELECTRICITY_INFLATION * 100)}%/yr electricity inflation — the long-run US average — it climbs to ${formatCurrency(outputs.inflatedCost10yr)}, about ${formatCurrency(inflationExtra)} more. Efficiency upgrades lock in today's lower draw against future rate rises.`,
      visualization: {
        type:    "projection-line",
        points,
        format:  "currency",
        yLabel:  "Cumulative cost",
        color:   "#f59e0b",
        caption: { text: `${customRate ? "Your rate" : `${stateLabel} rate`} · assumes ${Math.round(ELECTRICITY_INFLATION * 100)}%/yr inflation`, asOf: usStateElectricityDataset.currentPeriodLabel, live: !customRate },
      } satisfies InsightVisualization,
    });
  }

  // ── 5. Always-on / idle realism ───────────────────────────────────────────
  if (inputs.hoursPerDay >= 20 && inputs.daysPerWeek >= 7) {
    const at18 = Math.round((outputs.annualCost * (18 / inputs.hoursPerDay)) * 100) / 100;
    const idleSaving = Math.round((outputs.annualCost - at18) * 100) / 100;
    insights.push({
      id:       "appliance.always-on",
      severity: "neutral",
      category: "hidden-cost",
      title:    `Running nearly 24/7 — idle hours are quietly billed.`,
      body:     `At ${inputs.hoursPerDay}h/day this device barely switches off. Trimming to 18h/day with a smart plug or scheduler would save about ${formatCurrency(idleSaving)} a year — the kind of standby load that inflates a bill without anyone noticing.`,
      metric:   { label: "Idle saving", value: `${formatCurrency(idleSaving)}/yr` },
    });
  }

  // ── 6. Expensive-state context (skip when a custom rate is entered) ───────
  if (!customRate && outputs.electricRate > usStateElectricityDataset.national * 1.25 && inputs.state !== "National") {
    insights.push({
      id:       "appliance.high-rate-state",
      severity: "neutral",
      category: "comparison",
      title:    `${inputs.state} power runs well above the US average.`,
      body:     `At $${outputs.electricRate.toFixed(3)}/kWh, ${inputs.state} sits roughly ${Math.round((outputs.electricRate / usStateElectricityDataset.national - 1) * 100)}% above the national average of $${usStateElectricityDataset.national.toFixed(3)}/kWh. Every watt costs proportionally more here, so efficiency and off-peak use pay back faster than they would elsewhere.`,
      metric:   { label: `${inputs.state} rate`, value: `$${outputs.electricRate.toFixed(3)}/kWh` },
    });
  }

  return insights;
}
