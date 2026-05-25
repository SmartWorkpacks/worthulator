"use client";

// ─── Shared Calculator Core — CalculatorEngine ───────────────────────────────
//
// ORIGIN:  Extracted from Worthulator (components/calculator-engine/CalculatorEngine.tsx)
// CHANGES: Removed Worthulator-specific template imports (ProgressLoader,
//          ResultReveal, take-home-pay templates). Uses generic loading/reveal UI.
// USAGE:   Core calculator renderer — works with any CalculatorRegistry.
//
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from "react";
import { useCalculator } from "./useCalculator";
import OutputCard from "./OutputCard";
import type {
  CalculatorConfig,
  CalculatorRegistry,
  CalculatorValues,
  CalculatorOutputs,
  OutputConfig,
} from "./types";

export interface CalculatorEngineProps {
  /** Registry key matching an entry in your CALCULATOR_CONFIGS */
  slug: string;
  /** Registry passed in from the host project */
  registry: CalculatorRegistry;
  region?: "US" | "UK";
  /** Initial value overrides — e.g. from regional data */
  defaults?: Record<string, number>;
  /**
   * Rendered below results after first calculation.
   * Accepts static ReactNode or render prop (outputs, values) → ReactNode
   * for live-synced insights.
   */
  afterResults?:
    | React.ReactNode
    | ((outputs: CalculatorOutputs, values: CalculatorValues) => React.ReactNode);
}

// ─── Output formatter ─────────────────────────────────────────────────────────

function formatOutput(value: number, output: OutputConfig): string {
  if (!isFinite(value)) return "—";
  const sym = output.currencySymbol ?? "$";
  switch (output.format) {
    case "currency": return `${sym}${Math.round(value).toLocaleString()}`;
    case "integer":  return Math.ceil(value).toLocaleString();
    case "percent":  return `${value.toFixed(output.decimalPlaces ?? 1)}%`;
    default:         return value.toFixed(output.decimalPlaces ?? 2);
  }
}

// ─── Input renderer ───────────────────────────────────────────────────────────

function InputRow({
  input,
  value,
  onChange,
}: {
  input: import("./types").InputConfig;
  value: number | string;
  onChange: (v: number | string) => void;
}) {
  const numValue = Number(value);

  if (input.type === "dropdown" || input.type === "select") {
    return (
      <div>
        <label className="text-sm font-semibold text-gray-700">{input.label}</label>
        {input.hint && <p className="mt-0.5 text-xs text-gray-400">{input.hint}</p>}
        <select
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
          className="mt-2 w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 shadow-sm focus:outline-none"
        >
          {input.options?.map((opt) => (
            <option key={String(opt.value)} value={String(opt.value)}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-gray-700">{input.label}</label>
        <input
          type="number"
          value={numValue}
          min={input.min}
          max={input.max}
          step={input.step}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-24 rounded-lg border border-gray-200 px-2 py-1 text-right text-sm"
        />
      </div>
      {input.hint && <p className="mt-0.5 text-xs text-gray-400">{input.hint}</p>}
      <input
        type="range"
        min={input.min}
        max={input.maxFn ? input.maxFn({}) : input.max}
        step={input.step}
        value={numValue}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-blue-500"
      />
      {input.quickPicks && (
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {input.quickPicks.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => onChange(v)}
              className="rounded-full border border-gray-200 px-2.5 py-0.5 text-xs text-gray-500 hover:border-blue-400 hover:text-blue-600"
            >
              {v.toLocaleString()}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main engine ──────────────────────────────────────────────────────────────

function CalculatorEngineInner({
  config,
  afterResults,
  defaults,
}: {
  config: CalculatorConfig;
  afterResults?: CalculatorEngineProps["afterResults"];
  defaults?: Record<string, number>;
}) {
  const { values, setValue, outputs } = useCalculator(config, defaults);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [showResults, setShowResults]     = useState(false);
  const [isLoading, setIsLoading]         = useState(false);

  function handleCalculate() {
    setIsLoading(true);
    setHasCalculated(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowResults(true);
    }, 600);
  }

  const afterNode =
    showResults && afterResults
      ? typeof afterResults === "function"
        ? afterResults(outputs, values)
        : afterResults
      : null;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      {/* Inputs */}
      <div className="space-y-6">
        {config.inputs.map((input) => (
          <InputRow
            key={input.name}
            input={input}
            value={values[input.name]}
            onChange={(v) => setValue(input.name, v)}
          />
        ))}
      </div>

      {/* Calculate button */}
      <button
        onClick={handleCalculate}
        disabled={isLoading}
        className="mt-6 w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
      >
        {isLoading ? "Calculating..." : hasCalculated ? "Recalculate" : "Calculate"}
      </button>

      {/* Results */}
      {showResults && (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {config.outputs.map((output) => (
            <OutputCard
              key={output.key}
              output={output}
              value={outputs[output.key]}
              inputs={values}
              allOutputs={outputs}
            />
          ))}
        </div>
      )}

      {/* Insight string */}
      {showResults && config.insight && (
        <p className="mt-4 text-sm text-gray-500">{config.insight(outputs)}</p>
      )}

      {/* After results slot */}
      {afterNode && <div className="mt-6">{afterNode}</div>}
    </div>
  );
}

// ─── Public export ────────────────────────────────────────────────────────────

export default function CalculatorEngine({
  slug,
  registry,
  region,
  defaults,
  afterResults,
}: CalculatorEngineProps) {
  const config = registry[slug];
  if (!config) {
    return (
      <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
        Calculator not found: <code>{slug}</code>
      </div>
    );
  }
  return (
    <CalculatorEngineInner
      config={config}
      afterResults={afterResults}
      defaults={defaults}
    />
  );
}
