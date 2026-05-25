// ─── Shared Calculator Core — Root barrel ─────────────────────────────────────
//
// Import from here in your host project:
//   import { useCalculator, CalculatorEngineLoader } from "@/shared-calculator-core";
//   import { calcSolarRoi, VED } from "@/shared-calculator-core/energy";
//
// ─────────────────────────────────────────────────────────────────────────────

// Engine
export * from "./engine/types";
export { useCalculator                   } from "./engine/useCalculator";
export { default as OutputCard           } from "./engine/OutputCard";
export { default as CalculatorEngine     } from "./engine/CalculatorEngine";
export { default as CalculatorEngineLoader } from "./engine/CalculatorEngineLoader";

// Insights
export * from "./insights/index";

// Charts (client components — use dynamic import or CalculatorEngineLoader)
export { default as RechartsLineChart   } from "./charts/RechartsLineChart";
export { default as RechartsBarChart    } from "./charts/RechartsBarChart";
export { default as RechartsDonutChart  } from "./charts/RechartsDonutChart";

// Data + utils
export * from "./data/defaults";
export * from "./utils/formatters";
