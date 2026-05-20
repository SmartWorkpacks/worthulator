"use client";

import CalculatorEngine from "@/components/calculator-engine/CalculatorEngine";
import LiveInsightBlock from "@/components/worthcore/LiveInsightBlock";

export function WeddingCostWithInsights() {
  return (
    <CalculatorEngine
      slug="wedding-cost-calculator"
      afterResults={(outputs, values) => (
        <LiveInsightBlock slug="wedding-cost-calculator" outputs={outputs} values={values} />
      )}
    />
  );
}
