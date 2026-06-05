"use client";
import CalculatorEngineLoader from "@/components/calculator-engine/CalculatorEngineLoader";
import LiveInsightBlock from "@/components/worthcore/LiveInsightBlock";
import type { CalculatorValues, CalculatorOutputs } from "@/components/calculator-engine/types";

export default function WfhSavingsWithInsights() {
  return (
    <CalculatorEngineLoader
      slug="wfh-savings-calculator"
      afterResults={(outputs: CalculatorOutputs, values: CalculatorValues) => (
        <LiveInsightBlock slug="wfh-savings-calculator" outputs={outputs} values={values} />
      )}
    />
  );
}
