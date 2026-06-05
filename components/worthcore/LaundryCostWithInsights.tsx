"use client";

import CalculatorEngineLoader from "@/components/calculator-engine/CalculatorEngineLoader";
import LiveInsightBlock       from "@/components/worthcore/LiveInsightBlock";
import type { CalculatorValues, CalculatorOutputs } from "@/components/calculator-engine/types";

export default function LaundryCostWithInsights() {
  return (
    <CalculatorEngineLoader
      slug="laundry-cost-calculator"
      afterResults={(outputs: CalculatorOutputs, values: CalculatorValues) => (
        <LiveInsightBlock
          slug="laundry-cost-calculator"
          outputs={outputs}
          values={values}
        />
      )}
    />
  );
}
