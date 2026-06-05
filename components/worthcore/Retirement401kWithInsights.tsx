"use client";

import CalculatorEngineLoader from "@/components/calculator-engine/CalculatorEngineLoader";
import LiveInsightBlock       from "@/components/worthcore/LiveInsightBlock";
import type { CalculatorValues, CalculatorOutputs } from "@/components/calculator-engine/types";

export default function Retirement401kWithInsights() {
  return (
    <CalculatorEngineLoader
      slug="401k-calculator"
      afterResults={(outputs: CalculatorOutputs, values: CalculatorValues) => (
        <LiveInsightBlock
          slug="401k-calculator"
          outputs={outputs}
          values={values}
        />
      )}
    />
  );
}
