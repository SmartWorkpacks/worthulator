"use client";

import CalculatorEngineLoader from "@/components/calculator-engine/CalculatorEngineLoader";
import LiveInsightBlock       from "@/components/worthcore/LiveInsightBlock";
import type { CalculatorValues, CalculatorOutputs } from "@/components/calculator-engine/types";

export default function QuitSmokingWithInsights() {
  return (
    <CalculatorEngineLoader
      slug="quit-smoking"
      afterResults={(outputs: CalculatorOutputs, values: CalculatorValues) => (
        <LiveInsightBlock
          slug="quit-smoking"
          outputs={outputs}
          values={values}
        />
      )}
    />
  );
}
