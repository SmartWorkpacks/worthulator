"use client";

import CalculatorEngine from "@/components/calculator-engine/CalculatorEngine";
import LiveInsightBlock from "@/components/worthcore/LiveInsightBlock";

export function BudgetWithInsights() {
  return (
    <CalculatorEngine
      slug="budget-calculator"
      afterResults={(outputs, values) => (
        <LiveInsightBlock slug="budget-calculator" outputs={outputs} values={values} />
      )}
    />
  );
}
