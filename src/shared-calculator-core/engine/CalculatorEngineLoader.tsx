"use client";

// ─── Shared Calculator Core — CalculatorEngineLoader ─────────────────────────
//
// ORIGIN:  Extracted from Worthulator (components/calculator-engine/CalculatorEngineLoader.tsx)
// USAGE:   Lazy client-only wrapper. Pass your own registry + slug.
//          ssr: false is REQUIRED — calculator engines use useState.
//
// USAGE EXAMPLE:
//   import CalculatorEngineLoader from "@/shared-calculator-core/engine/CalculatorEngineLoader";
//   import { VPP_CALCULATOR_CONFIGS } from "@/lib/vppCalculatorConfigs";
//
//   <CalculatorEngineLoader
//     slug="vpp-roi-calculator"
//     registry={VPP_CALCULATOR_CONFIGS}
//     defaults={{ utilityRate: 0.15 }}
//   />
//
// ─────────────────────────────────────────────────────────────────────────────

import dynamic from "next/dynamic";
import type { CalculatorEngineProps } from "./CalculatorEngine";
import type { CalculatorRegistry } from "./types";

const CalculatorEngine = dynamic(
  () => import("./CalculatorEngine"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-48 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </div>
    ),
  },
);

export default function CalculatorEngineLoader(
  props: CalculatorEngineProps & { registry: CalculatorRegistry },
) {
  return <CalculatorEngine {...props} />;
}
