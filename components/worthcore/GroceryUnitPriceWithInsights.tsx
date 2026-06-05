"use client";

import CalculatorEngineLoader from "@/components/calculator-engine/CalculatorEngineLoader";
import LiveInsightBlock       from "@/components/worthcore/LiveInsightBlock";
import type { CalculatorValues, CalculatorOutputs } from "@/components/calculator-engine/types";

export default function GroceryUnitPriceWithInsights() {
  return (
    <CalculatorEngineLoader
      slug="grocery-unit-price"
      afterResults={(outputs: CalculatorOutputs, values: CalculatorValues) => (
        <LiveInsightBlock
          slug="grocery-unit-price"
          outputs={outputs}
          values={values}
        />
      )}
    />
  );
}
