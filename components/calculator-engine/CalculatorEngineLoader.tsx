"use client";

import dynamic from "next/dynamic";
import type { CalculatorEngineProps } from "./CalculatorEngine";

/**
 * Lazy-loaded wrapper for CalculatorEngine.
 *
 * Usage in a page file:
 *
 *   import CalculatorEngineLoader from "@/components/calculator-engine/CalculatorEngineLoader";
 *
 *   <CalculatorEngineLoader slug="concrete-bag" />
 *   <CalculatorEngineLoader slug="concrete-bag" region="UK" />
 *
 * The engine loads client-side only (ssr: false), keeping the
 * surrounding page fully server-rendered for SEO.
 */
const CalculatorEngineDynamic = dynamic<CalculatorEngineProps>(
  () => import("./CalculatorEngine"),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-100" />
            ))}
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl bg-gray-100" />
            ))}
          </div>
        </div>
      </div>
    ),
  },
);

export default function CalculatorEngineLoader(props: CalculatorEngineProps) {
  return <CalculatorEngineDynamic {...props} />;
}

