"use client";

import CalculatorEngine from "@/components/calculator-engine/CalculatorEngine";
import LiveInsightBlock from "@/components/worthcore/LiveInsightBlock";

export function WfhSavingsWithInsights() {
  return (
    <CalculatorEngine
      slug="wfh-savings-calculator"
      afterResults={(outputs, values) => (
        <LiveInsightBlock slug="wfh-savings-calculator" outputs={outputs} values={values} />
      )}
    />
  );
}
