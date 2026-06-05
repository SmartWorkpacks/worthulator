// ─── WorthCore Insight Engine — Alcohol Cost Generator ────────────────────────
//
// PURPOSE:
//   Deterministic, visual insight rules for the "alcohol-cost-calculator".
//   Surfaces annual spend vs BLS average, investment opportunity cost,
//   cut-drinking savings, and CDC heavy-drinking threshold.
//
// RULES:
//   ✅ Pure TypeScript — synchronous, deterministic, no side effects
//   ❌ Never import React · never call fetch()
//
// ─────────────────────────────────────────────────────────────────────────────

import { formatCurrency } from "@/lib/insights/benchmarks";
import { futureValueAnnuity } from "@/lib/insights/projections";
import type { Insight, InsightVisualization } from "@/lib/insights/types";

/** BLS average annual alcohol spend for US adults who drink (CES 2023) */
const BLS_AVG_ANNUAL_ALCOHOL = 570;

// ─── Input / Output types ─────────────────────────────────────────────────────

export interface AlcoholInsightInputs {
  drinksPerWeek:  number;
  costPerDrink:   number;
  reduceDrinksBy: number;
}

export interface AlcoholInsightOutputs {
  weeklySpend:       number;
  yearlyCost:        number;
  monthlyCost:       number;
  tenYearCost:       number;
  dailyCost:         number;
  investedValue10yr: number;
  investedValue20yr: number;
  cutYearlySaving:   number;
  cutInvested10yr:   number;
  reducedYearlyCost: number;
}

// ─── Generator ────────────────────────────────────────────────────────────────

export function generateAlcoholCostInsights(
  inputs: AlcoholInsightInputs,
  outputs: AlcoholInsightOutputs,
): Insight[] {
  if (inputs.drinksPerWeek <= 0) return [];

  const insights: Insight[] = [];
  const yearly = outputs.yearlyCost;
  const vsAvg  = yearly - BLS_AVG_ANNUAL_ALCOHOL;

  // ── 1. Annual spend vs BLS average — benchmark-bar ────────────────────────
  insights.push({
    id:       "alcohol.vs-average",
    severity: yearly > BLS_AVG_ANNUAL_ALCOHOL * 1.5 ? "warning" : "neutral",
    category: "comparison",
    title:    `${formatCurrency(yearly)}/year on alcohol — ${vsAvg > 0 ? formatCurrency(vsAvg) + " above" : formatCurrency(Math.abs(vsAvg)) + " below"} the US average.`,
    body:     `${inputs.drinksPerWeek} drinks a week at ${formatCurrency(inputs.costPerDrink)} each is ${formatCurrency(outputs.weeklySpend)}/week and ${formatCurrency(yearly)}/year. The BLS average for American adults who drink is ${formatCurrency(BLS_AVG_ANNUAL_ALCOHOL)}/year.`,
    visualization: {
      type:           "benchmark-bar",
      userValue:      yearly,
      userLabel:      "Your spend",
      benchmarkValue: BLS_AVG_ANNUAL_ALCOHOL,
      benchmarkLabel: "US avg (BLS)",
      format:         "currency",
    } satisfies InsightVisualization,
  });

  // ── 2. Investment opportunity cost — projection-line ──────────────────────
  insights.push({
    id:       "alcohol.decade",
    severity: "neutral",
    category: "projection",
    title:    `${formatCurrency(outputs.tenYearCost)} over 10 years — ${formatCurrency(outputs.investedValue10yr)} if invested.`,
    body:     `At this rate, the 10-year direct spend is ${formatCurrency(outputs.tenYearCost)}. Invested at 7% instead, ${formatCurrency(yearly)}/year grows to ${formatCurrency(outputs.investedValue10yr)} in 10 years and ${formatCurrency(outputs.investedValue20yr)} in 20.`,
    visualization: {
      type:   "projection-line",
      points: [1, 3, 5, 10, 15, 20].map((yr) => ({
        label: `Yr ${yr}`,
        value: Math.round(futureValueAnnuity(yearly, yr)),
      })),
      format: "currency",
      yLabel: "Invested value",
      color:  "#f59e0b",
    } satisfies InsightVisualization,
  });

  // ── 3. Cut-saving — delta-card (the clever insight) ───────────────────────
  if (outputs.cutYearlySaving > 0) {
    insights.push({
      id:       "alcohol.cut-saving",
      severity: "positive",
      category: "savings",
      title:    `Cut ${inputs.reduceDrinksBy} drinks/week to save ${formatCurrency(outputs.cutYearlySaving)}/year.`,
      body:     `Reducing from ${inputs.drinksPerWeek} to ${inputs.drinksPerWeek - inputs.reduceDrinksBy} drinks per week saves ${formatCurrency(outputs.cutYearlySaving)}/year. Invested at 7%, that's ${formatCurrency(outputs.cutInvested10yr)} over 10 years. Your annual alcohol spend drops from ${formatCurrency(yearly)} to ${formatCurrency(outputs.reducedYearlyCost)}.`,
      visualization: {
        type:   "delta-card",
        before: { label: "Current / yr",   value: formatCurrency(yearly) },
        after:  { label: "After cut / yr",  value: formatCurrency(outputs.reducedYearlyCost) },
        delta:  { label: "Saved / yr",      value: formatCurrency(outputs.cutYearlySaving), positive: true },
      } satisfies InsightVisualization,
    });
  }

  // ── 4. CDC heavy drinking threshold (conditional) ─────────────────────────
  if (inputs.drinksPerWeek >= 14) {
    insights.push({
      id:       "alcohol.cdc-heavy",
      severity: "warning",
      category: "comparison",
      title:    `${inputs.drinksPerWeek} drinks/week exceeds the CDC heavy drinking threshold.`,
      body:     `The CDC defines heavy drinking as more than 14 drinks per week for men and more than 7 for women. Beyond the financial cost, heavy drinking is associated with increased risk of liver disease, certain cancers, and cardiovascular conditions. The NIAAA helpline is 1-800-662-4357.`,
      metric:   { label: "Your drinks/week", value: `${inputs.drinksPerWeek}` },
    });
  }

  return insights;
}
