// ─── WorthCore Insight Engine — Flooring Cost Generator ───────────────────────
//
// PURPOSE:
//   Deterministic, visual insight rules for "flooring-cost-calculator". Splits
//   the project into material vs labor (donut), benchmarks the installed $/ft²,
//   surfaces the DIY labor saving, and reminds about the waste allowance.
//
// RULES:
//   ✅ Pure TypeScript — synchronous, deterministic, no side effects
//   ❌ Never import React · never call fetch()
//
// ─────────────────────────────────────────────────────────────────────────────

import { formatCurrency } from "@/lib/insights/benchmarks";
import type { Insight, InsightVisualization } from "@/lib/insights/types";

export interface FlooringInsightInputs {
  roomLength:      number;
  roomWidth:       number;
  materialPerSqFt: number;
  laborPerSqFt:    number;
  wastePct:        number;
}

export interface FlooringInsightOutputs {
  area:                 number;
  areaWithWaste:        number;
  materialCost:         number;
  laborCost:            number;
  totalCost:            number;
  costPerSqFtInstalled: number;
  laborShare:           number;
}

export function generateFlooringInsights(
  inputs: FlooringInsightInputs,
  outputs: FlooringInsightOutputs,
): Insight[] {
  const { wastePct, laborPerSqFt } = inputs;
  const { area, materialCost, laborCost, totalCost, costPerSqFtInstalled, laborShare } = outputs;

  if (totalCost <= 0 || area <= 0) return [];

  const insights: Insight[] = [];

  // ── 1. Headline — material vs labor split (donut) ─────────────────────────
  const segments = [
    { label: "Material", value: materialCost, color: "#10b981" },
    ...(laborCost > 0 ? [{ label: "Labor", value: laborCost, color: "#3b82f6" }] : []),
  ];
  insights.push({
    id:       "flooring.headline",
    severity: "neutral",
    category: "spending",
    title:    `${formatCurrency(totalCost)} for ${area} ft²`,
    body:     laborCost > 0
      ? `Material is ${formatCurrency(materialCost)} (with your ${wastePct}% waste allowance) and labor is ${formatCurrency(laborCost)} — labor is ${Math.round(laborShare)}% of the project. That's ${formatCurrency(costPerSqFtInstalled)}/ft² installed.`
      : `At ${formatCurrency(materialCost)} of material (incl. ${wastePct}% waste) with no labor, this DIY job runs ${formatCurrency(costPerSqFtInstalled)}/ft².`,
    visualization: {
      type:        "donut",
      segments,
      centerLabel: formatCurrency(totalCost),
      format:      "currency",
    } satisfies InsightVisualization,
    priority: 90,
  });

  // ── 2. Installed $/ft² benchmark vs LVP value band ────────────────────────
  insights.push({
    id:       "flooring.benchmark",
    severity: "neutral",
    category: "comparison",
    title:    `${formatCurrency(costPerSqFtInstalled)}/ft² installed`,
    body:     `Luxury vinyl plank — the current value leader — runs about $3–8/ft² installed. Engineered hardwood is roughly $8–15, solid hardwood $12–25. Your ${formatCurrency(costPerSqFtInstalled)}/ft² ${costPerSqFtInstalled <= 8 ? "sits in the value range" : costPerSqFtInstalled <= 15 ? "is mid-range" : "is premium territory"}.`,
    visualization: {
      type:           "benchmark-bar",
      userValue:      costPerSqFtInstalled,
      userLabel:      "Your $/ft²",
      benchmarkValue: 8,
      benchmarkLabel: "LVP value ceiling ($8/ft²)",
      format:         "currency",
    } satisfies InsightVisualization,
    priority: 70,
  });

  // ── 3. DIY saving ─────────────────────────────────────────────────────────
  if (laborCost > 0) {
    insights.push({
      id:       "flooring.diy",
      severity: "positive",
      category: "savings",
      title:    `DIY would save ${formatCurrency(laborCost)} in labor`,
      body:     `Click-lock LVP and laminate are genuinely DIY-friendly — no glue or nails. Doing it yourself removes the ${formatCurrency(laborCost)} labor line (${formatCurrency(laborPerSqFt)}/ft²), though tile and hardwood are far harder and usually worth a pro.`,
      metric:   { label: "Potential DIY saving", value: formatCurrency(laborCost) },
      priority: 50,
    });
  }

  // ── 4. Waste / hidden-cost reminder ───────────────────────────────────────
  insights.push({
    id:       "flooring.hidden-costs",
    severity: "warning",
    category: "warning",
    title:    `Budget for the costs this estimate doesn't include`,
    body:     `This covers material (with ${wastePct}% waste) and labor only. Subfloor leveling, moisture barriers, old-floor removal, transitions, and trim can add $1–3/ft² — get a quote that itemizes exactly what "supply and install" includes.`,
    metric:   { label: "Area incl. waste", value: `${Math.round(outputs.areaWithWaste)} ft²` },
    priority: 30,
  });

  return insights.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
}
