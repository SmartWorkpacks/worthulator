// ─── WorthCore Insight Engine — Grocery Unit Price Generator ──────────────────
//
// PURPOSE:
//   Deterministic, visual insight rules for the "grocery-unit-price" calculator.
//   Surfaces the unit-price winner, annual savings, and the impact of applying
//   unit-price discipline across multiple staples.
//
// RULES:
//   ✅ Pure TypeScript — synchronous, deterministic, no side effects
//   ❌ Never import React · never call fetch()
//
// ─────────────────────────────────────────────────────────────────────────────

import { formatCurrency, formatCurrencyPrecise } from "@/lib/insights/benchmarks";
import type { Insight, InsightVisualization } from "@/lib/insights/types";

// ─── Input / Output types ─────────────────────────────────────────────────────

export interface GroceryInputs {
  item1Price:       number;
  item1Size:        number;
  item2Price:       number;
  item2Size:        number;
  purchasesPerYear: number;
}

export interface GroceryOutputs {
  unitPriceA:      number;
  unitPriceB:      number;
  savingsPct:      number;
  savingsPerUnit:  number;
  winner:          number;
  annualSavings:   number;
  annualCostA:     number;
  annualCostB:     number;
  tenStapleSaving: number;
}

// ─── Generator ────────────────────────────────────────────────────────────────

export function generateGroceryUnitPriceInsights(
  inputs: GroceryInputs,
  outputs: GroceryOutputs,
): Insight[] {
  if (outputs.unitPriceA <= 0 && outputs.unitPriceB <= 0) return [];

  const insights: Insight[] = [];
  const winnerLabel = outputs.winner === 1 ? "Item A" : outputs.winner === 2 ? "Item B" : null;
  const loserLabel  = outputs.winner === 1 ? "Item B" : outputs.winner === 2 ? "Item A" : null;
  const cheaperPrice = Math.min(outputs.unitPriceA, outputs.unitPriceB);
  const dearerPrice  = Math.max(outputs.unitPriceA, outputs.unitPriceB);

  // ── 1. Winner — benchmark-bar ─────────────────────────────────────────────
  if (winnerLabel && outputs.savingsPct > 0) {
    insights.push({
      id:       "grocery.winner",
      severity: "positive",
      category: "comparison",
      title:    `${winnerLabel} is ${outputs.savingsPct.toFixed(1)}% cheaper per unit.`,
      body:     `${winnerLabel} costs $${cheaperPrice.toFixed(3)}/oz vs ${loserLabel} at $${dearerPrice.toFixed(3)}/oz — a difference of $${outputs.savingsPerUnit.toFixed(4)} on every ounce. Over ${inputs.purchasesPerYear} purchases a year, that adds up.`,
      visualization: {
        type:           "benchmark-bar",
        userValue:      cheaperPrice,
        userLabel:      `${winnerLabel} / oz`,
        benchmarkValue: dearerPrice,
        benchmarkLabel: `${loserLabel} / oz`,
        format:         "currency",
      } satisfies InsightVisualization,
    });
  } else if (!winnerLabel) {
    insights.push({
      id:       "grocery.tied",
      severity: "neutral",
      category: "comparison",
      title:    `Both items cost the same per unit — $${outputs.unitPriceA.toFixed(3)}/oz.`,
      body:     `Neither size is a better deal. Choose whichever is more convenient or practical — smaller sizes mean less waste for perishables.`,
      metric:   { label: "Unit price", value: `$${outputs.unitPriceA.toFixed(3)}/oz` },
    });
  }

  // ── 2. Annual impact — delta-card ─────────────────────────────────────────
  if (outputs.annualSavings > 0.50) {
    const cheaperAnnual = Math.min(outputs.annualCostA, outputs.annualCostB);
    const dearerAnnual  = Math.max(outputs.annualCostA, outputs.annualCostB);
    insights.push({
      id:       "grocery.annual-impact",
      severity: outputs.annualSavings >= 20 ? "positive" : "neutral",
      category: "savings",
      title:    `Always choosing ${winnerLabel} saves ${formatCurrency(outputs.annualSavings)}/year on this one product.`,
      body:     `Buying the more expensive option ${inputs.purchasesPerYear} times a year costs ${formatCurrency(dearerAnnual)}. The cheaper one costs ${formatCurrency(cheaperAnnual)} — saving ${formatCurrency(outputs.annualSavings)} annually. On a single item that may feel small, but across your whole grocery list it compounds fast.`,
      visualization: {
        type:   "delta-card",
        before: { label: `${loserLabel} annually`, value: formatCurrency(dearerAnnual) },
        after:  { label: `${winnerLabel} annually`, value: formatCurrency(cheaperAnnual) },
        delta:  { label: "Saved / yr",              value: formatCurrency(outputs.annualSavings), positive: true },
      } satisfies InsightVisualization,
    });
  }

  // ── 3. Bulk trap — when smaller item is cheaper (conditional) ──────────────
  if (outputs.winner === 1 && inputs.item1Size < inputs.item2Size) {
    insights.push({
      id:       "grocery.bulk-trap",
      severity: "warning",
      category: "spending",
      title:    `The smaller item is actually the better deal.`,
      body:     `The larger Item B costs $${dearerPrice.toFixed(3)}/oz — more per unit than the smaller Item A at $${cheaperPrice.toFixed(3)}/oz. Bigger isn't always cheaper. Retailers sometimes mark up bulk sizes knowing most shoppers assume larger = better value.`,
      metric:   { label: "Bulk premium", value: `+${outputs.savingsPct.toFixed(1)}%` },
    });
  }

  // ── 4. Ten-staple projection ──────────────────────────────────────────────
  if (outputs.annualSavings >= 5 && outputs.tenStapleSaving > 50) {
    insights.push({
      id:       "grocery.ten-staples",
      severity: "neutral",
      category: "projection",
      title:    `Apply this to 10 staples and you save ${formatCurrency(outputs.tenStapleSaving)}/year.`,
      body:     `If unit-price comparison saves ${formatCurrency(outputs.annualSavings)} on this product, the same discipline across 10 weekly staples (rice, oil, pasta, cereal, etc.) saves about ${formatCurrency(outputs.tenStapleSaving)}/year. Over a decade, that's ${formatCurrency(outputs.tenStapleSaving * 10)}.`,
      metric:   { label: "10-staple annual", value: formatCurrency(outputs.tenStapleSaving) },
    });
  }

  return insights;
}
