"use client";
import CalculatorEngineLoader from "@/components/calculator-engine/CalculatorEngineLoader";
import LiveInsightBlock from "@/components/worthcore/LiveInsightBlock";
import type { CalculatorValues, CalculatorOutputs } from "@/components/calculator-engine/types";
export default function PhoneAddictionWithInsights() {
  return (
    <CalculatorEngineLoader
      slug="phone-addiction-calculator"
      afterResults={(outputs: CalculatorOutputs, values: CalculatorValues) => (
        <LiveInsightBlock slug="phone-addiction-calculator" outputs={outputs} values={values} />
      )}
    />
  );
}
