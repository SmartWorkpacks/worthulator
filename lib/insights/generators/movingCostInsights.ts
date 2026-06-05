// ─── WorthCore Insight Engine — Moving Cost Generator ─────────────────────────
//
// PURPOSE:
//   Deterministic, visual insight rules for "moving-cost-calculator". Breaks the
//   move into a donut of line items, calls out the contingency buffer, flags the
//   dominant cost, and benchmarks against typical local/interstate move prices.
//
// RULES:
//   ✅ Pure TypeScript — synchronous, deterministic, no side effects
//   ❌ Never import React · never call fetch()
//
// ─────────────────────────────────────────────────────────────────────────────

import { formatCurrency } from "@/lib/insights/benchmarks";
import type { Insight, InsightVisualization } from "@/lib/insights/types";

export interface MovingInsightInputs {
  moversCost:  number;
  fuelCost:    number;
  packingCost: number;
  storageCost: number;
  miscCost:    number;
  bufferPct:   number;
  miles:       number;
}

export interface MovingInsightOutputs {
  subtotal:         number;
  buffer:           number;
  total:            number;
  costPerMile:      number;
  topLineItem:      number;
  topLineItemShare: number;
}

const LOCAL_MOVE = 1200;       // typical pro local move
const INTERSTATE_MOVE = 4890;  // typical 2BR interstate move

export function generateMovingInsights(
  inputs: MovingInsightInputs,
  outputs: MovingInsightOutputs,
): Insight[] {
  const { moversCost, fuelCost, packingCost, storageCost, miscCost, bufferPct, miles } = inputs;
  const { subtotal, buffer, total, costPerMile, topLineItemShare } = outputs;

  if (total <= 0) return [];

  const insights: Insight[] = [];

  // ── 1. Headline — line-item breakdown (donut) ─────────────────────────────
  const segments = [
    { label: "Movers / truck", value: moversCost,  color: "#3b82f6" },
    { label: "Fuel",           value: fuelCost,     color: "#f59e0b" },
    { label: "Packing",        value: packingCost,  color: "#10b981" },
    { label: "Storage",        value: storageCost,  color: "#8b5cf6" },
    { label: "Tips & misc",    value: miscCost,     color: "#ef4444" },
  ].filter((s) => s.value > 0);

  insights.push({
    id:       "moving.headline",
    severity: "neutral",
    category: "spending",
    title:    `${formatCurrency(total)} all-in to move`,
    body:     `Your line items add up to ${formatCurrency(subtotal)}, plus a ${bufferPct}% buffer of ${formatCurrency(buffer)} for the surprises.`,
    visualization: {
      type:        "donut",
      segments,
      centerLabel: formatCurrency(total),
      format:      "currency",
    } satisfies InsightVisualization,
    priority: 90,
  });

  // ── 2. Buffer reminder ────────────────────────────────────────────────────
  insights.push({
    id:       bufferPct > 0 ? "moving.buffer" : "moving.no-buffer",
    severity: bufferPct >= 10 ? "positive" : "warning",
    category: bufferPct >= 10 ? "savings" : "warning",
    title:    bufferPct >= 10
      ? `${formatCurrency(buffer)} buffer keeps surprises covered`
      : `Your buffer is thin at ${bufferPct}%`,
    body:     bufferPct >= 10
      ? `Real move costs typically land 15–30% over the first quote — parking permits, extra boxes, broken items, takeout in the chaos. A ${bufferPct}% cushion is a smart hedge.`
      : `Moves routinely run 15–30% over the initial estimate. Consider bumping the buffer to at least 15% so a single surprise doesn't blow the budget.`,
    metric:   { label: "Contingency buffer", value: formatCurrency(buffer) },
    priority: 70,
  });

  // ── 3. Dominant line item ─────────────────────────────────────────────────
  if (topLineItemShare >= 50 && subtotal > 0) {
    insights.push({
      id:       "moving.dominant",
      severity: "neutral",
      category: "comparison",
      title:    `One line is ${Math.round(topLineItemShare)}% of your move`,
      body:     `A single category dominates the budget. That's where to focus quotes and negotiation — shaving even 10% off your biggest line item moves the total more than trimming everything else.`,
      metric:   { label: "Largest line item", value: formatCurrency(outputs.topLineItem) },
      priority: 50,
    });
  }

  // ── 4. Cost per mile or move-size benchmark ───────────────────────────────
  if (miles > 0 && costPerMile > 0) {
    insights.push({
      id:       "moving.per-mile",
      severity: "neutral",
      category: "comparison",
      title:    `${formatCurrency(costPerMile)} per mile`,
      body:     `Over ${miles.toLocaleString()} miles, your move works out to ${formatCurrency(costPerMile)}/mile all-in. Long-distance pricing is driven by weight and distance, so decluttering before you weigh in pays off twice.`,
      visualization: {
        type:           "benchmark-bar",
        userValue:      total,
        userLabel:      "Your move",
        benchmarkValue: INTERSTATE_MOVE,
        benchmarkLabel: "Typical 2BR interstate",
        format:         "currency",
      } satisfies InsightVisualization,
      priority: 40,
    });
  } else {
    insights.push({
      id:       "moving.benchmark",
      severity: "neutral",
      category: "comparison",
      title:    `How your ${formatCurrency(total)} compares`,
      body:     `A typical professional local move runs around ${formatCurrency(LOCAL_MOVE)}; a 2-bedroom interstate move averages ${formatCurrency(INTERSTATE_MOVE)}. Where you land depends on volume, distance, and how much you DIY.`,
      visualization: {
        type:           "benchmark-bar",
        userValue:      total,
        userLabel:      "Your move",
        benchmarkValue: LOCAL_MOVE,
        benchmarkLabel: "Typical local move",
        format:         "currency",
      } satisfies InsightVisualization,
      priority: 40,
    });
  }

  return insights.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
}
