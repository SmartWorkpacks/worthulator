"use client";
import CalculatorEngineLoader from "@/components/calculator-engine/CalculatorEngineLoader";
import LiveInsightBlock from "@/components/worthcore/LiveInsightBlock";
import type { CalculatorValues, CalculatorOutputs } from "@/components/calculator-engine/types";
export default function StreamingTimeWithInsights() {
  return (
    <CalculatorEngineLoader
      slug="streaming-time-calculator"
      afterResults={(outputs: CalculatorOutputs, values: CalculatorValues) => (
        <LiveInsightBlock slug="streaming-time-calculator" outputs={outputs} values={values} />
      )}
    />
  );
}
