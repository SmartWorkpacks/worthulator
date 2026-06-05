"use client";

import CalculatorEngineLoader from "@/components/calculator-engine/CalculatorEngineLoader";
import LiveInsightBlock       from "@/components/worthcore/LiveInsightBlock";
import type { CalculatorValues, CalculatorOutputs } from "@/components/calculator-engine/types";

export default function TipCalcWithInsights() {
  return (
    <CalculatorEngineLoader
      slug="tip-calculator"
      afterResults={(outputs: CalculatorOutputs, values: CalculatorValues) => (
        <LiveInsightBlock
          slug="tip-calculator"
          outputs={outputs}
          values={values}
        />
      )}
    />
  );
}
