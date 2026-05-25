import { useState, useMemo } from "react";
import type { CalculatorConfig, CalculatorValues, CalculatorOutputs } from "./types";

// ─── Shared Calculator Core — useCalculator Hook ─────────────────────────────
//
// ORIGIN:  Extracted from Worthulator (components/calculator-engine/useCalculator.ts)
// USAGE:   Core reactive state hook for any config-driven calculator.
// RULES:   No site-specific deps. Pure React hook. Drop-in portable.
//
// ─────────────────────────────────────────────────────────────────────────────

interface UseCalculatorReturn {
  values:   CalculatorValues;
  setValue: (name: string, value: number | string) => void;
  outputs:  CalculatorOutputs;
}

/**
 * Manages input state and runs the calculator's pure `calculate` function
 * reactively on every input change.
 *
 * @param config    - A stable module-level CalculatorConfig reference
 * @param overrides - Optional initial value overrides (e.g. from regional data)
 */
export function useCalculator(
  config:    CalculatorConfig,
  overrides?: Record<string, number>,
): UseCalculatorReturn {
  const [values, setValues] = useState<CalculatorValues>(() =>
    Object.fromEntries(config.inputs.map((i) => [i.name, overrides?.[i.name] ?? i.default]))
  );

  function setValue(name: string, value: number | string) {
    setValues((prev) => ({ ...prev, [name]: value }));
  }

  const outputs = useMemo<CalculatorOutputs>(() => {
    try {
      return config.calculate(values);
    } catch {
      return {};
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  return { values, setValue, outputs };
}
