"use client";

import CalculatorEngineLoader from "@/components/calculator-engine/CalculatorEngineLoader";
import LiveInsightBlock       from "@/components/worthcore/LiveInsightBlock";
import type { CalculatorValues, CalculatorOutputs } from "@/components/calculator-engine/types";

export default function WaterBillWithInsights() {
  return (
    <CalculatorEngineLoader
      slug="water-bill-calculator"
      afterResults={(outputs: CalculatorOutputs, values: CalculatorValues) => (
        <LiveInsightBlock
          slug="water-bill-calculator"
          outputs={outputs}
          values={values}
        />
      )}
    />
  );
}
