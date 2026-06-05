"use client";

import CalculatorEngineLoader from "@/components/calculator-engine/CalculatorEngineLoader";
import LiveInsightBlock       from "@/components/worthcore/LiveInsightBlock";
import type { CalculatorValues, CalculatorOutputs } from "@/components/calculator-engine/types";

export default function LatteFactorWithInsights() {
  return (
    <CalculatorEngineLoader
      slug="latte-factor"
      afterResults={(outputs: CalculatorOutputs, values: CalculatorValues) => (
        <LiveInsightBlock
          slug="latte-factor"
          outputs={outputs}
          values={values}
        />
      )}
    />
  );
}
