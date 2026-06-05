"use client";
import CalculatorEngineLoader from "@/components/calculator-engine/CalculatorEngineLoader";
import LiveInsightBlock from "@/components/worthcore/LiveInsightBlock";
import type { CalculatorValues, CalculatorOutputs } from "@/components/calculator-engine/types";
export default function ScreenTimeWithInsights() {
  return (
    <CalculatorEngineLoader
      slug="screen-time-impact"
      afterResults={(outputs: CalculatorOutputs, values: CalculatorValues) => (
        <LiveInsightBlock slug="screen-time-impact" outputs={outputs} values={values} />
      )}
    />
  );
}
