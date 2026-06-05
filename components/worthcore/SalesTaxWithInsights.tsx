"use client";
import CalculatorEngineLoader from "@/components/calculator-engine/CalculatorEngineLoader";
import LiveInsightBlock from "@/components/worthcore/LiveInsightBlock";
import type { CalculatorValues, CalculatorOutputs } from "@/components/calculator-engine/types";
export default function SalesTaxWithInsights() {
  return (
    <CalculatorEngineLoader
      slug="sales-tax"
      afterResults={(outputs: CalculatorOutputs, values: CalculatorValues) => (
        <LiveInsightBlock slug="sales-tax" outputs={outputs} values={values} />
      )}
    />
  );
}
