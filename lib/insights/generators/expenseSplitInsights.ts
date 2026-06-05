// ─── WorthCore Insight Engine — Expense Split Generator ───────────────────────
//
// PURPOSE:
//   Deterministic, visual insight rules for "expense-split-calculator". Shows the
//   per-person total, the food/tip/tax composition as a donut, the collection
//   buffer from whole-dollar rounding, and the tip portion of each share.
//
// RULES:
//   ✅ Pure TypeScript — synchronous, deterministic, no side effects
//   ❌ Never import React · never call fetch()
//
// ─────────────────────────────────────────────────────────────────────────────

import { formatCurrency } from "@/lib/insights/benchmarks";
import type { Insight, InsightVisualization } from "@/lib/insights/types";

export interface ExpenseSplitInsightInputs {
  amount: number;
  people: number;
  tipPct: number;
  taxPct: number;
}

export interface ExpenseSplitInsightOutputs {
  tip:              number;
  tax:              number;
  grandTotal:       number;
  perPersonBase:    number;
  perPersonTotal:   number;
  tipPerPerson:     number;
  taxPerPerson:     number;
  roundedPerPerson: number;
  collectionBuffer: number;
}

export function generateExpenseSplitInsights(
  inputs: ExpenseSplitInsightInputs,
  outputs: ExpenseSplitInsightOutputs,
): Insight[] {
  const { amount, people, tipPct } = inputs;
  const { tip, tax, grandTotal, perPersonBase, perPersonTotal, tipPerPerson, roundedPerPerson, collectionBuffer } = outputs;

  if (grandTotal <= 0 || people <= 0) return [];

  const insights: Insight[] = [];

  // ── 1. Headline — per-person total (delta-card base → with tip) ───────────
  insights.push({
    id:       "expensesplit.headline",
    severity: "neutral",
    category: "comparison",
    title:    `Each of ${people} pays ${formatCurrency(perPersonTotal)}`,
    body:     `A ${formatCurrency(amount)} bill split ${people} ways is ${formatCurrency(perPersonBase)} each before extras. With ${tipPct}% tip${tax > 0 ? " and tax" : ""}, the grand total is ${formatCurrency(grandTotal)} — ${formatCurrency(perPersonTotal)} per person.`,
    visualization: {
      type:   "delta-card",
      before: { label: "Per person (bill)", value: formatCurrency(perPersonBase) },
      after:  { label: "Per person (all-in)", value: formatCurrency(perPersonTotal) },
      delta:  { label: "Tip + tax each", value: formatCurrency(perPersonTotal - perPersonBase), positive: false },
    } satisfies InsightVisualization,
    priority: 90,
  });

  // ── 2. Composition donut (food / tip / tax) ───────────────────────────────
  const segments = [
    { label: "Bill", value: amount, color: "#10b981" },
    ...(tip > 0 ? [{ label: "Tip", value: tip, color: "#3b82f6" }] : []),
    ...(tax > 0 ? [{ label: "Tax", value: tax, color: "#f59e0b" }] : []),
  ];
  if (segments.length >= 2) {
    insights.push({
      id:       "expensesplit.composition",
      severity: "neutral",
      category: "spending",
      title:    `Tip and tax add ${formatCurrency(grandTotal - amount)} to the bill`,
      body:     `Of the ${formatCurrency(grandTotal)} total, ${formatCurrency(amount)} is the bill itself${tip > 0 ? `, ${formatCurrency(tip)} is the ${tipPct}% tip` : ""}${tax > 0 ? `, and ${formatCurrency(tax)} is tax` : ""}. That's ${formatCurrency(tipPerPerson)} of tip on each person's share.`,
      visualization: {
        type:        "donut",
        segments,
        centerLabel: formatCurrency(grandTotal),
        format:      "currency",
      } satisfies InsightVisualization,
      priority: 70,
    });
  }

  // ── 3. Whole-dollar collection rounding ───────────────────────────────────
  if (collectionBuffer > 0.01) {
    insights.push({
      id:       "expensesplit.rounding",
      severity: "positive",
      category: "savings",
      title:    `Round to ${formatCurrency(roundedPerPerson)} each for easy collection`,
      body:     `Collecting ${formatCurrency(roundedPerPerson)} from everyone instead of an awkward ${formatCurrency(perPersonTotal)} is far simpler — and leaves a ${formatCurrency(collectionBuffer)} buffer that can boost the tip or cover the rounding. No coins, no IOUs.`,
      metric:   { label: "Collection buffer", value: formatCurrency(collectionBuffer) },
      priority: 50,
    });
  }

  // ── 4. Large-group framing ────────────────────────────────────────────────
  if (people >= 8) {
    insights.push({
      id:       "expensesplit.large-group",
      severity: "neutral",
      category: "comparison",
      title:    `For ${people} people, collect before — not after`,
      body:     `With a group this size, chasing ${formatCurrency(perPersonTotal)} from ${people} people after the fact is the hard part. Send a payment link for the per-person amount in advance and the awkward reconciliation disappears.`,
      metric:   { label: "Total to collect", value: formatCurrency(grandTotal) },
      priority: 30,
    });
  }

  return insights.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
}
