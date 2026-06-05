// ─── WorthCore Insight Engine — Water Bill Generator ──────────────────────────
//
// PURPOSE:
//   State-aware visual insights for the water-bill-calculator. Surfaces annual
//   cost vs national benchmark, outdoor use share, conservation and leak-fix
//   opportunities, and 10-year inflation projection.
//
// RULES:
//   ✅ Pure TypeScript — synchronous, deterministic, no side effects
//   ✅ Live water rate carries provenance caption with vintage
//   ❌ Never import React · never call fetch()
//
// ─────────────────────────────────────────────────────────────────────────────

import { formatCurrency } from "@/lib/insights/benchmarks";
import type { Insight, InsightVisualization } from "@/lib/insights/types";
import { WATER_INFLATION } from "@/calculations/home/waterBill";
import { usStateWaterRatesDataset } from "@/lib/datasets/regional/usStateWaterRates";

export interface WaterBillInsightInputs {
  state:           string;
  householdSize:   number;
  usageLevel:      string;
  outdoorWatering: string;
  billingType:     string;
  /** Optional user-entered $/1,000 gal; when > 0 it overrides the live state rate. */
  rateOverride?:   number;
}

export interface WaterBillInsightOutputs {
  annualWaterCost:   number;
  monthlyCost:       number;
  dailyCost:         number;
  gallonsPerDay:     number;
  annualGallons:     number;
  effectiveRate:     number;
  costPerPerson:     number;
  lowUsageSaving:    number;
  leakFixSaving:     number;
  nationalRefAnnual: number;
  vsNationalPct:     number;
  tenYearCost:       number;
  inflatedCost10yr:  number;
  indoorGallonsPct:  number;
  combinedRate:      number;
}

export function generateWaterBillInsights(
  inputs:  WaterBillInsightInputs,
  outputs: WaterBillInsightOutputs,
): Insight[] {
  if (outputs.annualWaterCost <= 0) return [];

  const insights: Insight[] = [];
  const customRate = (inputs.rateOverride ?? 0) > 0;
  const stateLabel = inputs.state && inputs.state !== "National" ? inputs.state : "the US average";
  const rateLabel = customRate ? "your" : `${stateLabel}'s`;
  const people     = Number(inputs.householdSize) || 0;

  const liveCaption = customRate
    ? {
        text: `Your water + sewer $${outputs.effectiveRate.toFixed(2)}/1,000 gal`,
        asOf: usStateWaterRatesDataset.currentPeriodLabel,
        live: false,
      }
    : {
        text: `${stateLabel} water + sewer $${outputs.effectiveRate.toFixed(2)}/1,000 gal`,
        asOf: usStateWaterRatesDataset.currentPeriodLabel,
        live: true,
      };

  // ── 1. Annual cost — benchmark-bar vs national reference ───────────────────
  const aboveNational = outputs.vsNationalPct > 10;
  insights.push({
    id:       "water.annual-cost",
    severity: aboveNational ? "warning" : "neutral",
    category: "spending",
    title:    `Your household water bill is about ${formatCurrency(outputs.annualWaterCost)}/year.`,
    body:     `At ${rateLabel} rate of $${outputs.effectiveRate.toFixed(2)} per 1,000 gallons, ${people} ${people === 1 ? "person" : "people"} using ~${outputs.gallonsPerDay.toLocaleString()} gallons/day works out to ${formatCurrency(outputs.monthlyCost)}/month — ${formatCurrency(outputs.costPerPerson)} per person.`,
    metric:   { label: "Per year", value: formatCurrency(outputs.annualWaterCost) },
    visualization: {
      type:           "benchmark-bar",
      userValue:      Math.round(outputs.annualWaterCost),
      userLabel:      "Your bill",
      benchmarkValue: Math.round(outputs.nationalRefAnnual),
      benchmarkLabel: "National avg",
      format:         "currency",
      caption:        liveCaption,
    } satisfies InsightVisualization,
  });

  // ── 2. Outdoor vs indoor share — donut (when outdoor watering active) ───────
  if (inputs.outdoorWatering !== "none" && outputs.indoorGallonsPct < 99) {
    const outdoorPct = Math.round(100 - outputs.indoorGallonsPct);
    const indoorGal  = Math.round(outputs.annualGallons * (outputs.indoorGallonsPct / 100));
    const outdoorGal = outputs.annualGallons - indoorGal;
    insights.push({
      id:       "water.usage-share",
      severity: outdoorPct >= 25 ? "warning" : "neutral",
      category: "spending",
      title:    `Outdoor watering accounts for ~${outdoorPct}% of your water use.`,
      body:     `Lawn and garden irrigation is the fastest way a water bill spikes in dry climates. Of your ~${outputs.annualGallons.toLocaleString()} gallons/year, roughly ${outdoorGal.toLocaleString()} gallons (${outdoorPct}%) goes to outdoor use — often more controllable than indoor fixtures.`,
      visualization: {
        type:        "donut",
        segments: [
          { label: "Indoor",  value: indoorGal,  color: "#3b82f6" },
          { label: "Outdoor", value: outdoorGal, color: "#f59e0b" },
        ],
        centerLabel: `${outdoorPct}% outdoor`,
        format:      "number",
      } satisfies InsightVisualization,
    });
  }

  // ── 3. Conservation opportunity — delta-card ───────────────────────────────
  if (outputs.lowUsageSaving >= 30 && inputs.usageLevel !== "low") {
    const lowAnnual = Math.round((outputs.annualWaterCost - outputs.lowUsageSaving) * 100) / 100;
    insights.push({
      id:       "water.conservation",
      severity: "positive",
      category: "investment-opportunity",
      title:    `Cutting to low indoor use saves ~${formatCurrency(outputs.lowUsageSaving)}/year.`,
      body:     `Shorter showers, full dishwasher loads, and WaterSense fixtures can drop per-person use ~25% below the EPA average. That takes your bill from ${formatCurrency(outputs.annualWaterCost)} to about ${formatCurrency(lowAnnual)} — with no sacrifice in hygiene or cleanliness.`,
      visualization: {
        type:   "delta-card",
        before: { label: "Current / yr",  value: formatCurrency(outputs.annualWaterCost) },
        after:  { label: "Low use / yr",  value: formatCurrency(lowAnnual) },
        delta:  { label: "Saved / yr", value: formatCurrency(outputs.lowUsageSaving), positive: true },
      } satisfies InsightVisualization,
    });
  }

  // ── 4. Leak fix opportunity — delta-card ───────────────────────────────────
  if (outputs.leakFixSaving >= 20) {
    const afterLeak = Math.round((outputs.annualWaterCost - outputs.leakFixSaving) * 100) / 100;
    insights.push({
      id:       "water.leak-opportunity",
      severity: "positive",
      category: "hidden-cost",
      title:    `Fixing household leaks could save ~${formatCurrency(outputs.leakFixSaving)}/year.`,
      body:     `EPA WaterSense: the average home with a leak wastes ~10,000 gallons/year — often a running toilet or dripping faucet. That's roughly ${formatCurrency(outputs.leakFixSaving)} on your bill. A $15 flapper repair frequently pays for itself in weeks.`,
      visualization: {
        type:   "delta-card",
        before: { label: "With leak waste", value: formatCurrency(outputs.annualWaterCost) },
        after:  { label: "Leaks fixed",     value: formatCurrency(afterLeak) },
        delta:  { label: "Saved / yr", value: formatCurrency(outputs.leakFixSaving), positive: true },
      } satisfies InsightVisualization,
    });
  }

  // ── 5. 10-year projection — projection-line (live) ─────────────────────────
  {
    const sampleYears = [1, 2, 3, 5, 7, 10];
    let cumulative = 0;
    const cumByYear: number[] = [];
    for (let y = 1; y <= 10; y++) {
      cumulative += outputs.annualWaterCost * Math.pow(1 + WATER_INFLATION, y - 1);
      cumByYear[y] = cumulative;
    }
    const points = sampleYears.map((y) => ({ label: `Yr ${y}`, value: Math.round(cumByYear[y]) }));
    const inflationExtra = Math.round(outputs.inflatedCost10yr - outputs.tenYearCost);

    insights.push({
      id:       "water.ten-year-projection",
      severity: outputs.inflatedCost10yr > 8000 ? "warning" : "neutral",
      category: "projection",
      title:    `Over 10 years you'll pay about ${formatCurrency(outputs.inflatedCost10yr)} for water.`,
      body:     `At today's rate the flat 10-year cost is ${formatCurrency(outputs.tenYearCost)}. AWWA data shows water/sewer rates rising ~${Math.round(WATER_INFLATION * 100)}%/yr — pushing the inflation-adjusted total to ${formatCurrency(outputs.inflatedCost10yr)}, about ${formatCurrency(inflationExtra)} more. Conservation measures lock in today's lower usage against future rate hikes.`,
      visualization: {
        type:    "projection-line",
        points,
        format:  "currency",
        yLabel:  "Cumulative cost",
        color:   "#3b82f6",
        caption: liveCaption,
      } satisfies InsightVisualization,
    });
  }

  // ── 6. High-rate state context (skip when a custom rate is entered) ───────
  if (!customRate && outputs.combinedRate > usStateWaterRatesDataset.national * 1.25 && inputs.state !== "National") {
    insights.push({
      id:       "water.high-rate-state",
      severity: "neutral",
      category: "comparison",
      title:    `${inputs.state} water rates run well above the US average.`,
      body:     `At $${outputs.combinedRate.toFixed(2)}/1,000 gal, ${inputs.state} is roughly ${Math.round((outputs.combinedRate / usStateWaterRatesDataset.national - 1) * 100)}% above the national average of $${usStateWaterRatesDataset.national.toFixed(2)}/1,000 gal. Every gallon you conserve saves proportionally more here than in lower-rate states.`,
      metric:   { label: `${inputs.state} rate`, value: `$${outputs.combinedRate.toFixed(2)}/1k gal` },
    });
  }

  return insights;
}
