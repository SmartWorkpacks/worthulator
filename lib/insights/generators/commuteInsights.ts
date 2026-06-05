// ─── WorthCore Insight Engine — Commute Cost Generator ───────────────────────
//
// PURPOSE:
//   Deterministic, visual insight rules for the "commute-cost" engine calculator.
//   Surfaces the annual fuel cost, per-mile cost vs the national average (live),
//   the WFH/hybrid saving vs full-time in-office, a 10-year inflation-adjusted
//   projection, and the true cost once wear & tear is included.
//
// RULES:
//   ✅ Pure TypeScript — synchronous, deterministic, no side effects
//   ✅ Live gas price carries a provenance caption with its vintage
//   ❌ Never import React · never call fetch()
//
// ─────────────────────────────────────────────────────────────────────────────

import { formatCurrency, formatCurrencyPrecise } from "@/lib/insights/benchmarks";
import type { Insight, InsightVisualization } from "@/lib/insights/types";
import {
  GAS_INFLATION,
  WEAR_COST_PER_MILE,
  NATIONAL_AVG_MPG,
} from "@/calculations/work/commuteCost";
import { usStateFuelDataset } from "@/lib/datasets/usStateFuelPrices";

// ── Rule thresholds (documented) ──────────────────────────────────────────────
/** Above $1,800/yr fuel → heavy commuter. */
const ANNUAL_COST_HEAVY = 1_800;
/** Below $600/yr fuel → light/efficient commute. */
const ANNUAL_COST_LIGHT = 600;
/** Below 22 MPG → fuel-economy upgrade insight fires. */
const LOW_MPG_THRESHOLD = 22;
/** Benchmark MPG a low-MPG driver might upgrade to. */
const UPGRADE_MPG = 32;

// ─── Input / Output types ─────────────────────────────────────────────────────

export interface CommuteInputs {
  state:             string;
  milesOneWay:       number;
  mpg:               number;
  officeDaysPerWeek: number;
  weeksPerYear:      number;
  /** Optional user-entered $/gal; when > 0 it overrides the live state price. */
  gasPriceOverride?: number;
}

export interface CommuteOutputs {
  annualFuelCost:          number;
  monthlyCost:             number;
  costPerDay:              number;
  annualMiles:             number;
  fuelCostPerMile:         number;
  wearCostPerYear:         number;
  totalCostPerYear:        number;
  effectiveDaysPerYear:    number;
  fiveDay52AnnualFuelCost: number;
  wfhSavingVs5Days:        number;
  tenYearInflatedCost:     number;
  gasPrice:                number;
}

// ─── Generator ────────────────────────────────────────────────────────────────

export function generateCommuteInsights(
  inputs: CommuteInputs,
  outputs: CommuteOutputs,
): Insight[] {
  if (outputs.annualFuelCost <= 0) return [];

  const insights: Insight[] = [];
  const customPrice = (inputs.gasPriceOverride ?? 0) > 0;
  const stateLabel = inputs.state && inputs.state !== "National" ? inputs.state : "the US average";
  const priceLabel = customPrice ? "your gas price" : `${stateLabel} prices`;

  const liveCaption = customPrice
    ? {
        text: `Your gas $${outputs.gasPrice.toFixed(2)}/gal`,
        asOf: usStateFuelDataset.currentPeriodLabel,
        live: false,
      }
    : {
        text: `${stateLabel} gas $${outputs.gasPrice.toFixed(2)}/gal`,
        asOf: usStateFuelDataset.currentPeriodLabel,
        live: true,
      };

  // ── 1. Annual fuel cost headline ──────────────────────────────────────────
  insights.push({
    id:       "commute.annual-cost",
    severity: outputs.annualFuelCost >= ANNUAL_COST_HEAVY ? "warning" : outputs.annualFuelCost <= ANNUAL_COST_LIGHT ? "positive" : "neutral",
    category: "spending",
    title:    `Your commute burns ${formatCurrency(outputs.annualFuelCost)} of fuel a year.`,
    body:     `Driving ${inputs.milesOneWay} miles each way at ${inputs.mpg} MPG and ${formatCurrencyPrecise(outputs.gasPrice)}/gal, ${outputs.effectiveDaysPerYear} commute days a year works out to ${formatCurrency(outputs.annualFuelCost)} in fuel — ${formatCurrency(outputs.monthlyCost)} a month, or ${formatCurrencyPrecise(outputs.costPerDay)} every day you drive in.`,
    metric:   { label: "Annual fuel", value: formatCurrency(outputs.annualFuelCost) },
  });

  // ── 2. Per-mile cost vs national average — benchmark-bar (live) ───────────
  const nationalPerMile = Math.round((usStateFuelDataset.national / NATIONAL_AVG_MPG) * 1000) / 1000;
  if (outputs.fuelCostPerMile > 0 && nationalPerMile > 0) {
    const cheaper = outputs.fuelCostPerMile < nationalPerMile;
    insights.push({
      id:       "commute.cost-per-mile",
      severity: cheaper ? "positive" : "neutral",
      category: "comparison",
      title:    cheaper
        ? `You drive cheaper than the average commuter, per mile.`
        : `Each mile you commute costs ${formatCurrencyPrecise(outputs.fuelCostPerMile)}.`,
      body:     `At ${priceLabel} and ${inputs.mpg} MPG, your fuel cost is ${formatCurrencyPrecise(outputs.fuelCostPerMile)}/mile versus a national-average driver at ${formatCurrencyPrecise(nationalPerMile)}/mile (${usStateFuelDataset.national.toFixed(2)}/gal ÷ ${NATIONAL_AVG_MPG} MPG). Across your ${outputs.annualMiles.toLocaleString()} commute miles a year, that difference is what moves the bill.`,
      visualization: {
        type:           "benchmark-bar",
        userValue:      outputs.fuelCostPerMile,
        userLabel:      "You / mile",
        benchmarkValue: nationalPerMile,
        benchmarkLabel: "US avg / mile",
        format:         "currency",
        caption:        liveCaption,
      } satisfies InsightVisualization,
    });
  }

  // ── 3. WFH / hybrid saving — delta-card ───────────────────────────────────
  if (outputs.wfhSavingVs5Days > 0) {
    const perOfficeDayPerYear = Math.round(outputs.costPerDay * inputs.weeksPerYear);
    insights.push({
      id:       "commute.wfh-saving",
      severity: "positive",
      category: "savings",
      title:    `Your schedule already saves ${formatCurrency(outputs.wfhSavingVs5Days)}/yr vs full-time in-office.`,
      body:     `Commuting 5 days a week, 52 weeks a year would cost ${formatCurrency(outputs.fiveDay52AnnualFuelCost)} in fuel. Your ${inputs.officeDaysPerWeek}-day, ${inputs.weeksPerYear}-week schedule comes in at ${formatCurrency(outputs.annualFuelCost)}. Each office day you drop saves about ${formatCurrency(perOfficeDayPerYear)} a year.`,
      visualization: {
        type:   "delta-card",
        before: { label: "5 days / wk", value: formatCurrency(outputs.fiveDay52AnnualFuelCost) },
        after:  { label: "Your schedule", value: formatCurrency(outputs.annualFuelCost) },
        delta:  { label: "Saved / yr", value: formatCurrency(outputs.wfhSavingVs5Days), positive: true },
      } satisfies InsightVisualization,
    });
  } else {
    // Full-time in-office: frame the upside of going hybrid instead.
    const oneDayWfhSaving = Math.round(outputs.costPerDay * inputs.weeksPerYear);
    insights.push({
      id:       "commute.wfh-upside",
      severity: "neutral",
      category: "opportunity-cost",
      title:    `One work-from-home day a week would save ${formatCurrency(oneDayWfhSaving)}/yr.`,
      body:     `You're commuting close to full-time. Dropping a single office day each week cuts roughly ${formatCurrency(oneDayWfhSaving)} of fuel a year; two days nearly doubles that — before counting wear, parking, and reclaimed time.`,
      metric:   { label: "Per WFH day/wk", value: `${formatCurrency(oneDayWfhSaving)}/yr` },
    });
  }

  // ── 4. 10-year inflation-adjusted projection — projection-line (live) ─────
  {
    const sampleYears = [1, 2, 3, 5, 7, 10];
    let cumulative = 0;
    const cumByYear: number[] = [];
    for (let y = 1; y <= 10; y++) {
      cumulative += outputs.annualFuelCost * Math.pow(1 + GAS_INFLATION, y - 1);
      cumByYear[y] = cumulative;
    }
    const points = sampleYears.map((y) => ({ label: `Yr ${y}`, value: Math.round(cumByYear[y]) }));
    const inflationExtra = Math.round(outputs.tenYearInflatedCost - outputs.annualFuelCost * 10);

    insights.push({
      id:       "commute.ten-year-projection",
      severity: outputs.tenYearInflatedCost > 15_000 ? "warning" : "neutral",
      category: "projection",
      title:    `Over 10 years this commute costs about ${formatCurrency(outputs.tenYearInflatedCost)} in fuel.`,
      body:     `At today's price the flat 10-year fuel cost is ${formatCurrency(Math.round(outputs.annualFuelCost * 10))}. Factoring in ~${Math.round(GAS_INFLATION * 100)}%/yr gas inflation — the long-run US average — it rises to ${formatCurrency(outputs.tenYearInflatedCost)}, about ${formatCurrency(inflationExtra)} more. A shorter commute or higher MPG compounds in your favour the same way.`,
      visualization: {
        type:    "projection-line",
        points,
        format:  "currency",
        yLabel:  "Cumulative fuel cost",
        color:   "#ef4444",
        caption: { text: `${customPrice ? "Your gas" : `${stateLabel} gas`} · assumes ${Math.round(GAS_INFLATION * 100)}%/yr inflation`, asOf: usStateFuelDataset.currentPeriodLabel, live: !customPrice },
      } satisfies InsightVisualization,
    });
  }

  // ── 5. True cost once wear & tear is added ────────────────────────────────
  if (outputs.wearCostPerYear >= 150) {
    insights.push({
      id:       "commute.true-cost",
      severity: "neutral",
      category: "hidden-cost",
      title:    `Add wear & tear and the real cost is ${formatCurrency(outputs.totalCostPerYear)}/yr.`,
      body:     `Fuel is only part of it. At the IRS/AAA estimate of ${formatCurrencyPrecise(WEAR_COST_PER_MILE)}/mile for tires, oil, and brakes, your ${outputs.annualMiles.toLocaleString()} commute miles add ${formatCurrency(outputs.wearCostPerYear)} a year — pushing the true cost to ${formatCurrency(outputs.totalCostPerYear)}, before insurance or depreciation.`,
      metric:   { label: "True annual cost", value: formatCurrency(outputs.totalCostPerYear) },
    });
  }

  // ── 6. Low-MPG upgrade opportunity ────────────────────────────────────────
  if (inputs.mpg < LOW_MPG_THRESHOLD) {
    const upgradeAnnual = Math.round((inputs.milesOneWay * 2 / UPGRADE_MPG) * outputs.gasPrice * outputs.effectiveDaysPerYear);
    const mpgSaving = Math.round(outputs.annualFuelCost - upgradeAnnual);
    if (mpgSaving > 100) {
      insights.push({
        id:       "commute.low-mpg",
        severity: "warning",
        category: "opportunity-cost",
        title:    `A ${UPGRADE_MPG} MPG car would cut fuel by ${formatCurrency(mpgSaving)}/yr.`,
        body:     `At ${inputs.mpg} MPG your vehicle is below the ~22 MPG efficiency line. Driving the same commute in a ${UPGRADE_MPG} MPG car would cost about ${formatCurrency(upgradeAnnual)} in fuel a year — saving ${formatCurrency(mpgSaving)} annually at ${customPrice ? "your" : `${stateLabel}'s`} ${formatCurrencyPrecise(outputs.gasPrice)}/gal.`,
        metric:   { label: "Current economy", value: `${inputs.mpg} MPG` },
      });
    }
  }

  return insights;
}
