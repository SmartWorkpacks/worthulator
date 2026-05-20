"use client";

import CalculatorEngine from "@/components/calculator-engine/CalculatorEngine";
import LiveInsightBlock from "@/components/worthcore/LiveInsightBlock";

export function PetCostWithInsights() {
  return (
    <CalculatorEngine
      slug="pet-cost-calculator"
      afterResults={(outputs, values) => (
        <LiveInsightBlock slug="pet-cost-calculator" outputs={outputs} values={values} />
      )}
    />
  );
}
