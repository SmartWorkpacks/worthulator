// ─── WorthCore Insight Engine — Savings Goal Generator ───────────────────────
//
// PURPOSE:
//   Visual, live-captioned insights for the savings-goal calculator. Shows how
//   growth lowers the required monthly deposit, the deposits-vs-growth split,
//   the live inflation-adjusted goal, and the path to the target over time.
//
// RULES:
//   ✅ Pure TypeScript — synchronous, deterministic
//   ✅ Live CPI carries a provenance caption
//   ❌ Never import React · never call fetch()
//
// ─────────────────────────────────────────────────────────────────────────────

import type { Insight, InsightVisualization } from "@/lib/insights/types";
import { formatCurrency } from "@/lib/insights/benchmarks";
import { fredBenchmarks } from "@/lib/datasets/finance/fredBenchmarks";

export interface SavingsGoalInsightInputs {
  goalAmount: number;
  currentSavings: number;
  years: number;
  annualReturn: number;
}

export interface SavingsGoalInsightOutputs {
  monthlyContribution: number;
  totalContributed: number;
  interestEarned: number;
  interestSharePct: number;
  monthlyNoGrowth: number;
  monthlySavedByGrowth: number;
  inflationAdjustedGoal: number;
  monthlyForRealGoal: number;
}

const CPI_CAPTION = {
  text: `US CPI ${fredBenchmarks.cpiInflationYoY}% YoY (FRED ${fredBenchmarks.currentPeriodLabel})`,
  asOf: fredBenchmarks.currentPeriodLabel,
  live: true,
};

export function generateSavingsGoalInsights(
  inputs: SavingsGoalInsightInputs,
  outputs: SavingsGoalInsightOutputs,
): Insight[] {
  const insights: Insight[] = [];
  const { goalAmount, currentSavings, years, annualReturn } = inputs;
  const {
    monthlyContribution, totalContributed, interestEarned, interestSharePct,
    monthlyNoGrowth, monthlySavedByGrowth, inflationAdjustedGoal, monthlyForRealGoal,
  } = outputs;

  if (goalAmount <= 0 || years <= 0) return [];

  // ── 1. Growth lowers the monthly — benchmark-bar ───────────────────────────
  if (monthlySavedByGrowth > 0) {
    insights.push({
      id: "savings-goal.growth-discount",
      title: `Earning ${annualReturn}% cuts your deposit to ${formatCurrency(monthlyContribution)}/mo`,
      body: `Without any return you'd need ${formatCurrency(monthlyNoGrowth)}/month. Letting the balance earn ${annualReturn}% does ${formatCurrency(monthlySavedByGrowth)}/month of the work for you — ${formatCurrency(monthlySavedByGrowth * years * 12)} less out of pocket over ${years} years.`,
      severity: "positive",
      category: "savings",
      metric: { label: "Monthly deposit", value: formatCurrency(monthlyContribution) },
      visualization: {
        type: "benchmark-bar",
        userValue: Math.round(monthlyContribution),
        userLabel: `At ${annualReturn}%`,
        benchmarkValue: Math.round(monthlyNoGrowth),
        benchmarkLabel: "At 0%",
        format: "currency",
      } satisfies InsightVisualization,
    });
  }

  // ── 2. Deposits vs growth — donut ──────────────────────────────────────────
  insights.push({
    id: "savings-goal.split",
    title: `Returns fund ${interestSharePct.toFixed(1)}% of your ${formatCurrency(goalAmount)} goal`,
    body: `Of the ${formatCurrency(goalAmount)} target, you deposit ${formatCurrency(totalContributed)} and growth supplies ${formatCurrency(interestEarned)} (plus your ${formatCurrency(currentSavings)} starting balance does its own compounding). The longer the timeline, the bigger that growth slice.`,
    severity: "neutral",
    category: "investment",
    visualization: {
      type: "donut",
      segments: [
        { label: "Your deposits", value: Math.round(totalContributed), color: "#64748b" },
        { label: "Growth", value: Math.round(interestEarned), color: "#10b981" },
        { label: "Starting balance", value: Math.round(currentSavings), color: "#3b82f6" },
      ],
      centerLabel: formatCurrency(goalAmount),
      format: "currency",
    } satisfies InsightVisualization,
  });

  // ── 3. Inflation-adjusted goal — delta-card (live CPI) ─────────────────────
  insights.push({
    id: "savings-goal.real-goal",
    title: `${formatCurrency(goalAmount)} today = ${formatCurrency(inflationAdjustedGoal)} in ${years} years`,
    body: `Goals quietly inflate too. To buy in ${years} years what ${formatCurrency(goalAmount)} buys today, you'll actually need ${formatCurrency(inflationAdjustedGoal)} at the current ${fredBenchmarks.cpiInflationYoY}% CPI — which means saving ${formatCurrency(monthlyForRealGoal)}/month to truly keep pace.`,
    severity: "neutral",
    category: "projection",
    visualization: {
      type: "delta-card",
      before: { label: "Goal today", value: formatCurrency(goalAmount) },
      after: { label: `In ${years} yr`, value: formatCurrency(inflationAdjustedGoal) },
      delta: { label: "Inflation gap", value: formatCurrency(inflationAdjustedGoal - goalAmount), positive: false },
      caption: CPI_CAPTION,
    } satisfies InsightVisualization,
  });

  // ── 4. Path to goal — projection-line ──────────────────────────────────────
  const r = annualReturn / 100 / 12;
  const milestones = [0, Math.round(years * 0.25), Math.round(years * 0.5), Math.round(years * 0.75), years]
    .filter((v, i, a) => a.indexOf(v) === i);
  const points = milestones.map((yr) => {
    const m = Math.round(yr * 12);
    const bal = r === 0
      ? currentSavings + monthlyContribution * m
      : currentSavings * Math.pow(1 + r, m) + monthlyContribution * ((Math.pow(1 + r, m) - 1) / r);
    return { label: yr === 0 ? "Now" : `Yr ${yr}`, value: Math.round(bal) };
  });
  insights.push({
    id: "savings-goal.path",
    title: `On track to ${formatCurrency(goalAmount)} by year ${years}`,
    body: `Saving ${formatCurrency(monthlyContribution)}/month grows your ${formatCurrency(currentSavings)} starting balance to the goal on this curve. Front-loading deposits — or nudging the return up — pulls the finish line closer.`,
    severity: "neutral",
    category: "projection",
    visualization: {
      type: "projection-line",
      points,
      format: "currency",
      yLabel: "Balance",
      color: "#10b981",
      caption: { text: `${formatCurrency(monthlyContribution)}/mo at ${annualReturn}%` },
    } satisfies InsightVisualization,
  });

  // ── 5. Out-of-pocket reality ───────────────────────────────────────────────
  insights.push({
    id: "savings-goal.out-of-pocket",
    title: `You'll personally save ${formatCurrency(totalContributed)}`,
    body: `Across ${years} years that's ${formatCurrency(monthlyContribution)} a month of real deposits. Automating the transfer the day you're paid is the single highest-impact move — it removes the monthly decision and makes the goal nearly automatic.`,
    severity: "neutral",
    category: "savings",
    metric: { label: "Total deposits", value: formatCurrency(totalContributed) },
  });

  return insights;
}
