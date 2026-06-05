"use client";

import CalculatorEngineLoader from "@/components/calculator-engine/CalculatorEngineLoader";
import LiveInsightBlock       from "@/components/worthcore/LiveInsightBlock";
import type { CalculatorValues, CalculatorOutputs } from "@/components/calculator-engine/types";

export default function SubscriptionAuditorWithInsights() {
  return (
    <CalculatorEngineLoader
      slug="subscription-auditor"
      afterResults={(outputs: CalculatorOutputs, values: CalculatorValues) => (
        <LiveInsightBlock
          slug="subscription-auditor"
          outputs={outputs}
          values={values}
        />
      )}
    />
  );
}
