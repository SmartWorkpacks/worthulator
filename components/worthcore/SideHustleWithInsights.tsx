"use client";
import CalculatorEngineLoader from "@/components/calculator-engine/CalculatorEngineLoader";
import LiveInsightBlock from "@/components/worthcore/LiveInsightBlock";
import type { CalculatorValues, CalculatorOutputs } from "@/components/calculator-engine/types";

export default function SideHustleWithInsights() {
  return (
    <CalculatorEngineLoader
      slug="side-hustle-calculator"
      afterResults={(outputs: CalculatorOutputs, values: CalculatorValues) => (
        <LiveInsightBlock slug="side-hustle-calculator" outputs={outputs} values={values} />
      )}
    />
  );
}
