"use client";

import CalculatorEngine from "@/components/calculator-engine/CalculatorEngine";
import LiveInsightBlock from "@/components/worthcore/LiveInsightBlock";

export function SubscriptionAuditorWithInsights() {
  return (
    <CalculatorEngine
      slug="subscription-auditor"
      afterResults={(outputs, values) => (
        <LiveInsightBlock slug="subscription-auditor" outputs={outputs} values={values} />
      )}
    />
  );
}
