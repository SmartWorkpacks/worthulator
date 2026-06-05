"use client";
import CalculatorEngineLoader from "@/components/calculator-engine/CalculatorEngineLoader";
import LiveInsightBlock from "@/components/worthcore/LiveInsightBlock";
import type { CalculatorValues, CalculatorOutputs } from "@/components/calculator-engine/types";

export default function TrueHourlyWageWithInsights() {
  return (
    <CalculatorEngineLoader
      slug="true-hourly-wage"
      afterResults={(outputs: CalculatorOutputs, values: CalculatorValues) => (
        <LiveInsightBlock slug="true-hourly-wage" outputs={outputs} values={values} />
      )}
    />
  );
}
