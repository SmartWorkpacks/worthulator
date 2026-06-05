"use client";

import CalculatorEngineLoader from "@/components/calculator-engine/CalculatorEngineLoader";
import LiveInsightBlock       from "@/components/worthcore/LiveInsightBlock";
import type { CalculatorValues, CalculatorOutputs } from "@/components/calculator-engine/types";

export default function FutureValueWithInsights() {
  return (
    <CalculatorEngineLoader
      slug="future-value"
      afterResults={(outputs: CalculatorOutputs, values: CalculatorValues) => (
        <LiveInsightBlock
          slug="future-value"
          outputs={outputs}
          values={values}
        />
      )}
    />
  );
}
