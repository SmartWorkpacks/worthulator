// ─── WorthCore Insight Engine — Global Wealth Percentile Generator ────────────
//
// PURPOSE:
//   Deterministic, visual insight rules for "global-wealth-percentile". Leads
//   with the headline rank (gauge-style benchmark bar), contrasts wealth vs
//   income percentiles (delta-card), translates the rank into a count of people,
//   and reframes daily income against the global poverty line.
//
// RULES:
//   ✅ Pure TypeScript — synchronous, deterministic, no side effects
//   ❌ Never import React · never call fetch()
//
// ─────────────────────────────────────────────────────────────────────────────

import { formatCurrency } from "@/lib/insights/benchmarks";
import type { Insight, InsightVisualization } from "@/lib/insights/types";

export interface WealthPercentileInsightInputs {
  netWorth:     number;
  annualIncome: number;
}

export interface WealthPercentileInsightOutputs {
  wealthPercentile: number;
  incomePercentile: number;
  wealthTopPct:     number;
  incomeTopPct:     number;
  dailyIncome:      number;
  adultsBelowWealth: number;
}

const POVERTY_DAY = 2.15; // World Bank extreme-poverty line

function topLabel(topPct: number): string {
  if (topPct <= 1) return "top 1%";
  if (topPct <= 5) return `top ${Math.ceil(topPct)}%`;
  if (topPct <= 10) return "top 10%";
  if (topPct <= 25) return "top 25%";
  if (topPct <= 50) return "top half";
  return "bottom half";
}

export function generateGlobalWealthPercentileInsights(
  inputs: WealthPercentileInsightInputs,
  outputs: WealthPercentileInsightOutputs,
): Insight[] {
  const { netWorth, annualIncome } = inputs;
  const { wealthPercentile, incomePercentile, wealthTopPct, incomeTopPct, dailyIncome, adultsBelowWealth } = outputs;

  if (netWorth <= 0 && annualIncome <= 0) return [];

  const insights: Insight[] = [];

  // ── 1. Headline — wealth rank ─────────────────────────────────────────────
  if (netWorth > 0) {
    insights.push({
      id:       "wealth.rank",
      severity: wealthTopPct <= 10 ? "positive" : "neutral",
      category: "comparison",
      title:    `You're in the global ${topLabel(wealthTopPct)} by wealth`,
      body:     `A net worth of ${formatCurrency(netWorth)} puts you above an estimated ${wealthPercentile}% of the world's adults — the ${topLabel(wealthTopPct)}. Most people in developed countries rank far higher than they feel.`,
      visualization: {
        type:           "benchmark-bar",
        userValue:      wealthPercentile,
        userLabel:      "Your wealth percentile",
        benchmarkValue: 90,
        benchmarkLabel: "Global top 10% line",
        format:         "percent",
      } satisfies InsightVisualization,
      priority: 90,
    });
  }

  // ── 2. Wealth vs income rank (delta-card) ─────────────────────────────────
  if (netWorth > 0 && annualIncome > 0) {
    insights.push({
      id:       "wealth.vs-income",
      severity: "neutral",
      category: "comparison",
      title:    `Wealth rank vs income rank`,
      body:     wealthPercentile >= incomePercentile
        ? `You rank higher by wealth than by income — a sign your assets have outpaced your earnings (the goal of long-term investing).`
        : `You rank higher by income than by wealth — typical for strong earners still building assets. Converting income into net worth is what moves the wealth rank.`,
      visualization: {
        type:   "delta-card",
        before: { label: "Income rank", value: `Top ${incomeTopPct}%` },
        after:  { label: "Wealth rank", value: `Top ${wealthTopPct}%` },
        delta:  { label: "Gap", value: `${Math.abs(Math.round(wealthPercentile - incomePercentile))} pts`, positive: wealthPercentile >= incomePercentile },
      } satisfies InsightVisualization,
      priority: 70,
    });
  }

  // ── 3. People-count reframe ───────────────────────────────────────────────
  if (netWorth > 0) {
    const billions = (adultsBelowWealth / 1_000_000_000).toFixed(1);
    insights.push({
      id:       "wealth.people",
      severity: "positive",
      category: "comparison",
      title:    `~${billions} billion adults have less than you`,
      body:     `Out of roughly 5.4 billion adults worldwide, an estimated ${adultsBelowWealth.toLocaleString()} hold less net worth than you. Global wealth is far more concentrated than within any single country.`,
      metric:   { label: "Adults below you", value: `${billions}B` },
      priority: 50,
    });
  }

  // ── 4. Daily income vs poverty line ───────────────────────────────────────
  if (annualIncome > 0) {
    const multiple = Math.round(dailyIncome / POVERTY_DAY);
    insights.push({
      id:       "wealth.daily",
      severity: "neutral",
      category: "comparison",
      title:    `${formatCurrency(dailyIncome)}/day — ${multiple}× the poverty line`,
      body:     `Your income works out to ${formatCurrency(dailyIncome)} per day. The World Bank's extreme-poverty line is $${POVERTY_DAY.toFixed(2)}/day, which about 700 million people live below. You earn roughly ${multiple}× that.`,
      metric:   { label: "Income percentile", value: `Top ${incomeTopPct}%` },
      priority: 30,
    });
  }

  return insights.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
}
