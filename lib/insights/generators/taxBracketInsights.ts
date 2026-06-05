// ─── WorthCore Insight Engine — Tax Bracket Generator ─────────────────────────
//
// PURPOSE:
//   Deterministic, visual insight rules for "tax-bracket-calculator". The whole
//   point is to bust the marginal-vs-effective myth: a delta card shows the gap,
//   a donut splits take-home vs federal tax, and a pre-tax nudge quantifies the
//   marginal-rate saving on the next contribution.
//
// RULES:
//   ✅ Pure TypeScript — synchronous, deterministic, no side effects
//   ❌ Never import React · never call fetch()
//
// ─────────────────────────────────────────────────────────────────────────────

import { formatCurrency } from "@/lib/insights/benchmarks";
import type { Insight, InsightVisualization } from "@/lib/insights/types";

export interface TaxBracketInsightInputs {
  grossIncome:         number;
  filingStatus:        string;
  pretaxContributions: number;
}

export interface TaxBracketInsightOutputs {
  taxableIncome:      number;
  federalTax:         number;
  effectiveRate:      number;
  marginalRate:       number;
  afterTaxIncome:     number;
  standardDeduction:  number;
  effectiveOnTaxable: number;
}

const AVG_EFFECTIVE = 13.3; // approx US average federal effective rate

export function generateTaxBracketInsights(
  inputs: TaxBracketInsightInputs,
  outputs: TaxBracketInsightOutputs,
): Insight[] {
  const { grossIncome, pretaxContributions } = inputs;
  const { federalTax, effectiveRate, marginalRate, afterTaxIncome, standardDeduction } = outputs;

  if (grossIncome <= 0) return [];

  const insights: Insight[] = [];
  const gap = Math.round((marginalRate - effectiveRate) * 10) / 10;

  // ── 1. Headline — marginal vs effective (delta card) ──────────────────────
  insights.push({
    id:       "tax.myth",
    severity: "positive",
    category: "comparison",
    title:    `You don't pay ${marginalRate}% — your real rate is ${effectiveRate}%`,
    body:     `Your top bracket (marginal rate) is ${marginalRate}%, but that only hits the last slice of income. Across everything you earn, your effective federal rate is ${effectiveRate}% — ${gap} points lower. A raise never "bumps you into a worse bracket."`,
    visualization: {
      type:   "delta-card",
      before: { label: "Marginal bracket", value: `${marginalRate}%` },
      after:  { label: "Effective rate",   value: `${effectiveRate}%` },
      delta:  { label: "You overpay by", value: `${gap} pts less`, positive: true },
    } satisfies InsightVisualization,
    priority: 90,
  });

  // ── 2. Take-home vs tax (donut) ───────────────────────────────────────────
  insights.push({
    id:       "tax.split",
    severity: "neutral",
    category: "spending",
    title:    `${formatCurrency(federalTax)} federal tax on ${formatCurrency(grossIncome)}`,
    body:     `After federal income tax you keep ${formatCurrency(afterTaxIncome)}. This is federal ordinary income tax only — FICA (7.65%), state tax, and credits are separate.`,
    visualization: {
      type:        "donut",
      segments: [
        { label: "Take-home (pre-FICA/state)", value: afterTaxIncome, color: "#10b981" },
        { label: "Federal tax",                value: federalTax,     color: "#ef4444" },
      ],
      centerLabel: `${effectiveRate}%`,
      format:      "currency",
    } satisfies InsightVisualization,
    priority: 70,
  });

  // ── 3. Effective rate vs national average ─────────────────────────────────
  insights.push({
    id:       "tax.benchmark",
    severity: "neutral",
    category: "comparison",
    title:    `${effectiveRate}% vs the ${AVG_EFFECTIVE}% US average`,
    body:     effectiveRate <= AVG_EFFECTIVE
      ? `Your effective rate is at or below the typical US federal effective rate of about ${AVG_EFFECTIVE}%.`
      : `Your effective rate is above the typical US federal effective rate of about ${AVG_EFFECTIVE}% — higher earners pull the average up.`,
    visualization: {
      type:           "benchmark-bar",
      userValue:      effectiveRate,
      userLabel:      "Your effective rate",
      benchmarkValue: AVG_EFFECTIVE,
      benchmarkLabel: `US average (${AVG_EFFECTIVE}%)`,
      format:         "percent",
    } satisfies InsightVisualization,
    priority: 55,
  });

  // ── 4. Pre-tax contribution lever ─────────────────────────────────────────
  if (marginalRate > 0) {
    const sample = 1000;
    const saving = Math.round(sample * (marginalRate / 100));
    insights.push({
      id:       "tax.pretax",
      severity: "positive",
      category: "savings",
      title:    `Every $1,000 pre-tax saves you ${formatCurrency(saving)}`,
      body:     pretaxContributions > 0
        ? `Your ${formatCurrency(pretaxContributions)} of 401(k)/HSA contributions already comes off the top at your ${marginalRate}% marginal rate. Each additional $1,000 saves another ${formatCurrency(saving)} in federal tax.`
        : `401(k), HSA, and traditional IRA contributions come off your taxable income at your top marginal rate. At ${marginalRate}%, the first $1,000 you shelter saves ${formatCurrency(saving)} in federal tax.`,
      metric:   { label: "Tax saved per $1k sheltered", value: formatCurrency(saving) },
      priority: 40,
    });
  }

  // ── 5. Standard deduction context ─────────────────────────────────────────
  insights.push({
    id:       "tax.deduction",
    severity: "neutral",
    category: "comparison",
    title:    `${formatCurrency(standardDeduction)} comes off before any bracket applies`,
    body:     `Your standard deduction is ${formatCurrency(standardDeduction)} — income below that is taxed at 0%. Only itemize if your deductible expenses (mortgage interest, SALT, charity) exceed it.`,
    priority: 25,
  });

  return insights.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
}
