"use client";
import CalculatorEngineLoader from "@/components/calculator-engine/CalculatorEngineLoader";
import LiveInsightBlock from "@/components/worthcore/LiveInsightBlock";
import type { CalculatorValues, CalculatorOutputs } from "@/components/calculator-engine/types";
export default function MeetingCostWithInsights() {
  return (
    <CalculatorEngineLoader
      slug="meeting-cost"
      afterResults={(outputs: CalculatorOutputs, values: CalculatorValues) => (
        <LiveInsightBlock slug="meeting-cost" outputs={outputs} values={values} />
      )}
    />
  );
}
