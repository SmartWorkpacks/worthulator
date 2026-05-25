"use client";

// ─── Shared Calculator Core — LiveInsightBlock ───────────────────────────────
//
// ORIGIN:  Extracted from Worthulator (components/worthcore/LiveInsightBlock.tsx)
// CHANGES: Removed all Worthulator-specific generator imports. Uses a generic
//          GENERATOR_REGISTRY pattern — host project registers its own generators.
// USAGE:
//   1. Create your insight generators in lib/insights/generators/
//   2. Register them below in GENERATOR_REGISTRY
//   3. Use as render prop inside CalculatorEngineLoader:
//
//      <CalculatorEngineLoader
//        slug="vpp-roi-calculator"
//        registry={VPP_CONFIGS}
//        afterResults={(outputs, values) => (
//          <LiveInsightBlock slug="vpp-roi-calculator" outputs={outputs} values={values} />
//        )}
//      />
//
// SAFETY:
//   ✅ Synchronous — generators are pure functions
//   ✅ No render loops — no setState
//   ✅ Live-synced — re-runs on every input change via render prop
//
// ─────────────────────────────────────────────────────────────────────────────

import InsightCard from "./InsightCard";
import type { Insight, InsightContext } from "./types";
import type { CalculatorValues, CalculatorOutputs } from "../engine/types";

// ─── Generator registry ───────────────────────────────────────────────────────
//
// Key   = calculator slug (must match CalculatorEngineLoader `slug` prop)
// Value = function(outputs, values, context?) → Insight[]
//
// ADD YOUR GENERATORS HERE. Example:
//
//   import { generateVppRoiInsights } from "@/lib/insights/generators/vppRoiInsights";
//
//   const GENERATOR_REGISTRY: Record<
//     string,
//     (outputs: CalculatorOutputs, values: CalculatorValues, context?: InsightContext) => Insight[]
//   > = {
//     "vpp-roi-calculator":     generateVppRoiInsights,
//     "battery-roi-calculator": generateBatteryRoiInsights,
//     "solar-roi-calculator":   generateSolarRoiInsights,
//   };

const GENERATOR_REGISTRY: Record<
  string,
  (outputs: CalculatorOutputs, values: CalculatorValues, context?: InsightContext) => Insight[]
> = {
  // Register your generators here
};

// ─── Component ────────────────────────────────────────────────────────────────

interface LiveInsightBlockProps {
  slug:     string;
  outputs:  CalculatorOutputs;
  values:   CalculatorValues;
  context?: InsightContext;
  /** Override accent stripe class for InsightCard (optional) */
  accentClass?: string;
}

export default function LiveInsightBlock({
  slug,
  outputs,
  values,
  context,
  accentClass,
}: LiveInsightBlockProps) {
  const generator = GENERATOR_REGISTRY[slug];
  if (!generator) return null;

  const insights = generator(outputs, values, context);
  if (!insights.length) return null;

  return (
    <div className="space-y-3">
      {insights.map((insight) => (
        <InsightCard key={insight.id} insight={insight} accentClass={accentClass} />
      ))}
    </div>
  );
}
