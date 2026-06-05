"use client";
import CalculatorEngineLoader from "@/components/calculator-engine/CalculatorEngineLoader";
import LiveInsightBlock from "@/components/worthcore/LiveInsightBlock";
import type { CalculatorValues, CalculatorOutputs } from "@/components/calculator-engine/types";

export default function JobOfferComparisonWithInsights() {
  return (
    <CalculatorEngineLoader
      slug="job-offer-comparison"
      afterResults={(outputs: CalculatorOutputs, values: CalculatorValues) => (
        <LiveInsightBlock slug="job-offer-comparison" outputs={outputs} values={values} />
      )}
    />
  );
}
