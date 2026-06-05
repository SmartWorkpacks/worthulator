// ─── WorthCore Insight Engine — Vaping Cost Generator ─────────────────────────
//
// PURPOSE:
//   Deterministic, visual insight rules for the "vaping-cost-calculator".
//   Surfaces annual spend, investment cost, cut-saving, and vaping vs smoking.
//
// RULES:
//   ✅ Pure TypeScript — synchronous, deterministic, no side effects
//   ❌ Never import React · never call fetch()
//
// ─────────────────────────────────────────────────────────────────────────────

import { formatCurrency } from "@/lib/insights/benchmarks";
import { futureValueAnnuity } from "@/lib/insights/projections";
import type { Insight, InsightVisualization } from "@/lib/insights/types";

// ─── Input / Output types ─────────────────────────────────────────────────────

export interface VapingInsightInputs {
  dailyCost:  number;
  cutDailyBy: number;
}

export interface VapingInsightOutputs {
  yearlyCost:        number;
  monthlyCost:       number;
  tenYearCost:       number;
  investedValue10yr: number;
  investedValue20yr: number;
  cutYearlySaving:   number;
  cutInvested10yr:   number;
  reducedYearlyCost: number;
  smokingAnnual:     number;
  vsSmokingDiff:     number;
}

// ─── Generator ────────────────────────────────────────────────────────────────

export function generateVapingCostInsights(
  inputs: VapingInsightInputs,
  outputs: VapingInsightOutputs,
): Insight[] {
  if (inputs.dailyCost <= 0) return [];

  const insights: Insight[] = [];
  const yearly = outputs.yearlyCost;

  // ── 1. Vaping vs Smoking — benchmark-bar ──────────────────────────────────
  const cheaper = outputs.vsSmokingDiff >= 0 ? "vaping" : "smoking";
  insights.push({
    id:       "vaping.vs-smoking",
    severity: "neutral",
    category: "comparison",
    title:    outputs.vsSmokingDiff >= 0
      ? `Vaping saves ${formatCurrency(outputs.vsSmokingDiff)}/year vs smoking.`
      : `Vaping costs ${formatCurrency(Math.abs(outputs.vsSmokingDiff))}/year more than smoking.`,
    body:     `Your vaping costs ${formatCurrency(yearly)}/year. A 1 pack/day cigarette habit at the US average of $10/pack costs ${formatCurrency(outputs.smokingAnnual)}/year. ${cheaper === "vaping" ? `Vaping is ${formatCurrency(outputs.vsSmokingDiff)} cheaper` : `Vaping actually costs ${formatCurrency(Math.abs(outputs.vsSmokingDiff))} more`} — but neither is free.`,
    visualization: {
      type:           "benchmark-bar",
      userValue:      yearly,
      userLabel:      "Vaping / yr",
      benchmarkValue: outputs.smokingAnnual,
      benchmarkLabel: "Smoking / yr",
      format:         "currency",
    } satisfies InsightVisualization,
  });

  // ── 2. Investment opportunity cost — projection-line ──────────────────────
  insights.push({
    id:       "vaping.compound",
    severity: "neutral",
    category: "projection",
    title:    `${formatCurrency(yearly)}/year invested at 7% grows to ${formatCurrency(outputs.investedValue10yr)} in 10 years.`,
    body:     `Over 10 years you'd spend ${formatCurrency(outputs.tenYearCost)} on vaping. Invested instead, ${formatCurrency(yearly)}/year at 7% becomes ${formatCurrency(outputs.investedValue10yr)} in 10 years and ${formatCurrency(outputs.investedValue20yr)} in 20.`,
    visualization: {
      type:   "projection-line",
      points: [1, 3, 5, 10, 15, 20].map((yr) => ({
        label: `Yr ${yr}`,
        value: Math.round(futureValueAnnuity(yearly, yr)),
      })),
      format: "currency",
      yLabel: "Invested value",
      color:  "#8b5cf6",
    } satisfies InsightVisualization,
  });

  // ── 3. Cut-saving — delta-card ────────────────────────────────────────────
  if (outputs.cutYearlySaving > 0) {
    insights.push({
      id:       "vaping.cut-saving",
      severity: "positive",
      category: "savings",
      title:    `Cut $${inputs.cutDailyBy}/day to save ${formatCurrency(outputs.cutYearlySaving)}/year.`,
      body:     `Reducing your daily vaping spend from $${inputs.dailyCost} to $${inputs.dailyCost - inputs.cutDailyBy} saves ${formatCurrency(outputs.cutYearlySaving)}/year. Invested at 7%, that's ${formatCurrency(outputs.cutInvested10yr)} over 10 years. Switch from disposables to a refillable system to cut cost without cutting nicotine.`,
      visualization: {
        type:   "delta-card",
        before: { label: "Current / yr",   value: formatCurrency(yearly) },
        after:  { label: "After cut / yr",  value: formatCurrency(outputs.reducedYearlyCost) },
        delta:  { label: "Saved / yr",      value: formatCurrency(outputs.cutYearlySaving), positive: true },
      } satisfies InsightVisualization,
    });
  }

  return insights;
}
