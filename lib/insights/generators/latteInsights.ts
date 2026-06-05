// ─── WorthCore Insight Engine — Latte Factor Generator ────────────────────────
//
// PURPOSE:
//   Deterministic, visual insight rules for the "latte-factor" calculator.
//   Surfaces the opportunity cost, contributions-vs-growth split, growth curve,
//   half-habit saving, and price inflation impact.
//
// RULES:
//   ✅ Pure TypeScript — synchronous, deterministic, no side effects
//   ❌ Never import React · never call fetch()
//
// ─────────────────────────────────────────────────────────────────────────────

import { formatCurrency } from "@/lib/insights/benchmarks";
import type { Insight, InsightVisualization } from "@/lib/insights/types";
import { latteFactorAtYear } from "@/calculations/finance/latteFactor";

// ─── Input / Output types ─────────────────────────────────────────────────────

export interface LatteInputs {
  dailySpend:   number;
  daysPerWeek:  number;
  costGrowth:   number;
  annualReturn: number;
  years:        number;
}

export interface LatteOutputs {
  investedValue:    number;
  totalSpent:       number;
  compoundGrowth:   number;
  growthPct:        number;
  annualSpendNow:   number;
  annualSpendFinal: number;
  halfHabitInvested: number;
}

// ─── Generator ────────────────────────────────────────────────────────────────

export function generateLatteInsights(
  inputs: LatteInputs,
  outputs: LatteOutputs,
): Insight[] {
  if (outputs.investedValue <= 0) return [];

  const insights: Insight[] = [];
  const r = (Number(inputs.annualReturn) || 0) / 100;
  const g = (Number(inputs.costGrowth) || 0) / 100;

  // ── 1. Opportunity cost headline — benchmark-bar ──────────────────────────
  insights.push({
    id:       "latte.opportunity-cost",
    severity: "neutral",
    category: "opportunity-cost",
    title:    `$${inputs.dailySpend}/day invested at ${inputs.annualReturn}% grows to ${formatCurrency(outputs.investedValue)} in ${inputs.years} years.`,
    body:     `At ${inputs.daysPerWeek} days a week, you spend ${formatCurrency(outputs.annualSpendNow)} in year 1${g > 0 ? ` — rising to ${formatCurrency(outputs.annualSpendFinal)} by year ${inputs.years} with ${inputs.costGrowth}% annual inflation` : ""}. Over ${inputs.years} years that's ${formatCurrency(outputs.totalSpent)} total. Invested at ${inputs.annualReturn}%, the same money would grow to ${formatCurrency(outputs.investedValue)}.`,
    visualization: {
      type:           "benchmark-bar",
      userValue:      outputs.totalSpent,
      userLabel:      "Total spent",
      benchmarkValue: outputs.investedValue,
      benchmarkLabel: `Invested at ${inputs.annualReturn}%`,
      format:         "currency",
    } satisfies InsightVisualization,
  });

  // ── 2. Contributions vs compound growth — donut ───────────────────────────
  if (outputs.growthPct > 0) {
    const contribPct = 100 - outputs.growthPct;
    insights.push({
      id:       "latte.compound-power",
      severity: "neutral",
      category: "investment",
      title:    `${outputs.growthPct}% of the final value is compound growth — you only put in ${contribPct}%.`,
      body:     `You contribute ${formatCurrency(outputs.totalSpent)} over ${inputs.years} years. Compound interest adds ${formatCurrency(outputs.compoundGrowth)} on top — ${outputs.growthPct}% of the total. The longer the horizon, the higher that ratio gets.`,
      visualization: {
        type:    "donut",
        segments: [
          { label: "Your money",      value: contribPct,       color: "#3b82f6" },
          { label: "Compound growth", value: outputs.growthPct, color: "#10b981" },
        ],
        centerLabel: formatCurrency(outputs.investedValue),
        format:  "percent",
      } satisfies InsightVisualization,
    });
  }

  // ── 3. Growth curve — projection-line ─────────────────────────────────────
  if (inputs.years > 5) {
    const sampleYears = [1, 3, 5, 10, 15, 20, 25, 30, 35, 40]
      .filter((y) => y <= inputs.years);
    if (!sampleYears.includes(inputs.years)) sampleYears.push(inputs.years);
    sampleYears.sort((a, b) => a - b);

    const points = sampleYears.map((yr) => ({
      label: `Yr ${yr}`,
      value: latteFactorAtYear(outputs.annualSpendNow, yr, r, g),
    }));

    insights.push({
      id:       "latte.growth-curve",
      severity: "neutral",
      category: "projection",
      title:    `The growth accelerates — most of it happens in the later years.`,
      body:     `At year 10 the invested value is ${formatCurrency(latteFactorAtYear(outputs.annualSpendNow, Math.min(10, inputs.years), r, g))}. By year ${inputs.years} it's ${formatCurrency(outputs.investedValue)}. The jump from the halfway mark to the end is larger than everything before it combined — that's compound interest in action.`,
      visualization: {
        type:    "projection-line",
        points,
        format:  "currency",
        yLabel:  "Invested value",
        color:   "#10b981",
      } satisfies InsightVisualization,
    });
  }

  // ── 4. Half-habit saving — delta-card ─────────────────────────────────────
  if (outputs.halfHabitInvested > 0) {
    const halfSaving = outputs.halfHabitInvested;
    insights.push({
      id:       "latte.half-habit",
      severity: "positive",
      category: "savings",
      title:    `Cutting the habit in half and investing the rest grows to ${formatCurrency(halfSaving)}.`,
      body:     `You don't have to give it up entirely. Spending $${(inputs.dailySpend / 2).toFixed(2)}/day instead of $${inputs.dailySpend} and investing the difference would grow to ${formatCurrency(halfSaving)} over ${inputs.years} years — while still enjoying the habit half the time.`,
      visualization: {
        type:   "delta-card",
        before: { label: "Keep all of it",    value: formatCurrency(0) },
        after:  { label: "Invest half",       value: formatCurrency(halfSaving) },
        delta:  { label: "You build",         value: formatCurrency(halfSaving), positive: true },
      } satisfies InsightVisualization,
    });
  }

  // ── 5. Price inflation impact ─────────────────────────────────────────────
  if (g > 0 && inputs.years >= 5) {
    const inflationExtra = outputs.totalSpent - outputs.annualSpendNow * inputs.years;
    if (inflationExtra > 100) {
      insights.push({
        id:       "latte.price-inflation",
        severity: "warning",
        category: "spending",
        title:    `Price inflation adds ${formatCurrency(inflationExtra)} to your lifetime spend.`,
        body:     `At ${inputs.costGrowth}%/yr, your $${inputs.dailySpend}/day habit rises to $${(inputs.dailySpend * Math.pow(1 + g, inputs.years - 1)).toFixed(2)}/day by year ${inputs.years}. Without inflation you'd spend ${formatCurrency(outputs.annualSpendNow * inputs.years)} total. With it, ${formatCurrency(outputs.totalSpent)} — ${formatCurrency(inflationExtra)} more. The opportunity cost of those extra dollars is even larger.`,
        metric:   { label: "Inflation surcharge", value: formatCurrency(inflationExtra) },
      });
    }
  }

  return insights;
}
