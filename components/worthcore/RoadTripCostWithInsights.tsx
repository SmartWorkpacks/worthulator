"use client";

import CalculatorEngineLoader from "@/components/calculator-engine/CalculatorEngineLoader";
import LiveInsightBlock       from "@/components/worthcore/LiveInsightBlock";
import type { CalculatorValues, CalculatorOutputs } from "@/components/calculator-engine/types";

export default function RoadTripCostWithInsights() {
  return (
    <CalculatorEngineLoader
      slug="road-trip-cost"
      afterResults={(outputs: CalculatorOutputs, values: CalculatorValues) => (
        <LiveInsightBlock
          slug="road-trip-cost"
          outputs={outputs}
          values={values}
        />
      )}
    />
  );
}
