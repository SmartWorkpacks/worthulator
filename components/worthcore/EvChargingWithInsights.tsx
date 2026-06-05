"use client";

// ─── EvChargingWithInsights ────────────────────────────────────────────────────
//
//   EV Charging Cost calculator + live WorthCore insights, wired via the
//   engine's afterResults render-prop (same pattern as ApplianceEnergyWithInsights).
//
//   ✅ No engine modification — insights via render-prop extension only
//   ✅ Synchronous, pure insight generation from live (outputs, values)
//   ✅ No hydration risk — engine is ssr:false
//
// ─────────────────────────────────────────────────────────────────────────────

import CalculatorEngineLoader from "@/components/calculator-engine/CalculatorEngineLoader";
import LiveInsightBlock       from "@/components/worthcore/LiveInsightBlock";
import type { CalculatorValues, CalculatorOutputs } from "@/components/calculator-engine/types";

export default function EvChargingWithInsights() {
  return (
    <CalculatorEngineLoader
      slug="ev-charging-cost"
      afterResults={(outputs: CalculatorOutputs, values: CalculatorValues) => (
        <LiveInsightBlock
          slug="ev-charging-cost"
          outputs={outputs}
          values={values}
        />
      )}
    />
  );
}
