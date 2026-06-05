"use client";

// ─── HeatingCostWithInsights ───────────────────────────────────────────────────
//
//   Home Heating Cost calculator + live WorthCore insights.
//   Wired via the engine's afterResults render-prop (same pattern as
//   ApplianceEnergyWithInsights / EvChargingWithInsights).
//
// ─────────────────────────────────────────────────────────────────────────────

import CalculatorEngineLoader from "@/components/calculator-engine/CalculatorEngineLoader";
import LiveInsightBlock       from "@/components/worthcore/LiveInsightBlock";
import type { CalculatorValues, CalculatorOutputs } from "@/components/calculator-engine/types";

export default function HeatingCostWithInsights() {
  return (
    <CalculatorEngineLoader
      slug="heating-cost"
      afterResults={(outputs: CalculatorOutputs, values: CalculatorValues) => (
        <LiveInsightBlock
          slug="heating-cost"
          outputs={outputs}
          values={values}
        />
      )}
    />
  );
}
