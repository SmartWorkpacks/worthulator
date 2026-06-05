// ─── WorthCore Insight Engine — Tip Calculator Generator ──────────────────────
//
// PURPOSE:
//   Deterministic, visual insight rules for the "tip-calculator" calculator.
//   Surfaces per-person breakdown, annual tipping spend, round-up cost, and
//   a bracket comparison to help users calibrate their tipping habit.
//
// RULES:
//   ✅ Pure TypeScript — synchronous, deterministic, no side effects
//   ❌ Never import React · never call fetch()
//
// ─────────────────────────────────────────────────────────────────────────────

import { formatCurrency } from "@/lib/insights/benchmarks";
import type { Insight, InsightVisualization } from "@/lib/insights/types";

// ─── Input / Output types ─────────────────────────────────────────────────────

export interface TipInsightInputs {
  bill:             number;
  tipPct:           number;
  people:           number;
  diningFrequency:  number;
}

export interface TipInsightOutputs {
  tipAmount:       number;
  totalBill:       number;
  tipPerPerson:    number;
  totalPerPerson:  number;
  roundedTotal:    number;
  roundUpCost:     number;
  annualTipSpend:  number;
  annualDining:    number;
  tip15:           number;
  tip20:           number;
  tip25:           number;
}

// ─── Generator ────────────────────────────────────────────────────────────────

export function generateTipInsights(
  inputs: TipInsightInputs,
  outputs: TipInsightOutputs,
): Insight[] {
  if (outputs.totalBill <= 0) return [];

  const insights: Insight[] = [];

  // ── 1. Headline — benchmark-bar (tip vs food per person) ──────────────────
  const foodPerPerson = outputs.totalPerPerson - outputs.tipPerPerson;
  insights.push({
    id:       "tip.headline",
    severity: "neutral",
    category: "comparison",
    title:    `Each person pays ${formatCurrency(outputs.totalPerPerson)} — ${formatCurrency(outputs.tipPerPerson)} of that is the tip.`,
    body:     `On a ${formatCurrency(inputs.bill)} bill with a ${inputs.tipPct}% tip split ${inputs.people} ${inputs.people === 1 ? "way" : "ways"}: ${formatCurrency(foodPerPerson)} covers food and ${formatCurrency(outputs.tipPerPerson)} goes to your server.`,
    visualization: {
      type:           "benchmark-bar",
      userValue:      outputs.tipPerPerson,
      userLabel:      "Tip / person",
      benchmarkValue: foodPerPerson,
      benchmarkLabel: "Food / person",
      format:         "currency",
    } satisfies InsightVisualization,
  });

  // ── 2. Annual tipping spend — delta-card ──────────────────────────────────
  if (outputs.annualTipSpend > 0) {
    const annualFood = outputs.annualDining - outputs.annualTipSpend;
    insights.push({
      id:       "tip.annual-spend",
      severity: outputs.annualTipSpend >= 1000 ? "warning" : "neutral",
      category: "spending",
      title:    `You spend ${formatCurrency(outputs.annualTipSpend)}/year on tips alone.`,
      body:     `Dining out ${inputs.diningFrequency} times a month at an average of ${formatCurrency(inputs.bill)} with a ${inputs.tipPct}% tip adds up to ${formatCurrency(outputs.annualDining)}/year — ${formatCurrency(annualFood)} on food and ${formatCurrency(outputs.annualTipSpend)} in tips. That's ${formatCurrency(outputs.annualTipSpend / 12)}/month just in gratuity.`,
      visualization: {
        type:   "delta-card",
        before: { label: "Annual food",  value: formatCurrency(annualFood) },
        after:  { label: "Annual tips",  value: formatCurrency(outputs.annualTipSpend) },
        delta:  { label: "Total dining", value: formatCurrency(outputs.annualDining), positive: false },
      } satisfies InsightVisualization,
    });
  }

  // ── 3. Round-up cost (conditional) ────────────────────────────────────────
  if (outputs.roundUpCost > 0.01) {
    const annualRoundUp = outputs.roundUpCost * inputs.diningFrequency * 12;
    insights.push({
      id:       "tip.round-up",
      severity: "neutral",
      category: "spending",
      title:    `Rounding up to ${formatCurrency(outputs.roundedTotal)} adds ${formatCurrency(outputs.roundUpCost)} per person.`,
      body:     `The cash-friendly round-up to the nearest $5 adds ${formatCurrency(outputs.roundUpCost)} per person per meal. Over a year at your dining frequency, that's an extra ${formatCurrency(annualRoundUp)}/year — a small price for the convenience of not needing change.`,
      metric:   { label: "Annual round-up cost", value: formatCurrency(annualRoundUp) },
    });
  }

  // ── 4. Bracket comparison — benchmark-bar ─────────────────────────────────
  if (inputs.tipPct > 0 && inputs.tipPct !== 20) {
    const yourTip = outputs.tipAmount;
    const diff = yourTip - outputs.tip20;
    const direction = diff > 0 ? "more" : "less";
    insights.push({
      id:       "tip.bracket-compare",
      severity: "neutral",
      category: "comparison",
      title:    `At ${inputs.tipPct}%, your tip is ${formatCurrency(Math.abs(diff))} ${direction} than 20%.`,
      body:     `Tip brackets on a ${formatCurrency(inputs.bill)} bill: 15% = ${formatCurrency(outputs.tip15)}, 20% = ${formatCurrency(outputs.tip20)}, 25% = ${formatCurrency(outputs.tip25)}. You chose ${inputs.tipPct}% = ${formatCurrency(yourTip)}.`,
      visualization: {
        type:           "benchmark-bar",
        userValue:      yourTip,
        userLabel:      `Your tip (${inputs.tipPct}%)`,
        benchmarkValue: outputs.tip20,
        benchmarkLabel: "Standard (20%)",
        format:         "currency",
      } satisfies InsightVisualization,
    });
  }

  return insights;
}
