"use client";
import CalculatorEngineLoader from "@/components/calculator-engine/CalculatorEngineLoader";
import LiveInsightBlock from "@/components/worthcore/LiveInsightBlock";
import type { CalculatorValues, CalculatorOutputs } from "@/components/calculator-engine/types";

// Generic engine + live-insight wrapper. Renders the shared calculator engine
// and routes its live outputs/values to the slug's WorthCore insight generator
// (registered in LiveInsightBlock). Use this for any engine-config calculator
// that has a registered generator — no per-calc wrapper file needed.
export default function EngineWithInsights({ slug }: { slug: string }) {
  return (
    <CalculatorEngineLoader
      slug={slug}
      afterResults={(outputs: CalculatorOutputs, values: CalculatorValues) => (
        <LiveInsightBlock slug={slug} outputs={outputs} values={values} />
      )}
    />
  );
}
