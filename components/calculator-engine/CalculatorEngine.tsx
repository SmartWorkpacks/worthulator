"use client";

import React, { useState, useEffect, useRef } from "react";
import { CALCULATOR_CONFIGS } from "./calculatorConfigs";
import { useCalculator } from "./useCalculator";
import type { CalculatorConfig, OutputConfig, CalculatorValues, CalculatorOutputs } from "./types";
import {
  SliderInputCard,
  QuickChips,
  HeroResultCard,
  FrequencyCards,
  CalcDisclaimer,
} from "@/src/templates/take-home-pay";
import WorthulatorProgressLoader from "@/src/templates/shared/WorthulatorProgressLoader";
import WorthulatorResultReveal from "@/src/templates/shared/WorthulatorResultReveal";
import { useCountUp } from "@/src/templates/shared/useCountUp";

export interface CalculatorEngineProps {
  /** Config registry key — e.g. "future-value", "car-loan-calculator" */
  slug: string;
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

// â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function formatOutput(value: number, output: OutputConfig): string {
  if (!isFinite(value)) return "â€”";
  const sym = output.currencySymbol ?? "$";
  switch (output.format) {
    case "currency":
      return `${sym}${Math.round(value).toLocaleString()}`;
    case "integer":
      return Math.ceil(value).toLocaleString();
    case "percent":
      return `${value.toFixed(output.decimalPlaces ?? 1)}%`;
    case "decimal":
    default:
      return value.toFixed(output.decimalPlaces ?? 2) + (output.unit ? ` ${output.unit}` : "");
  }
}

/** Returns "$" or "Â£" if the unit is a currency symbol, else undefined. */
function currencySymbol(unit?: string): string | undefined {
  if (unit === "$" || unit === "Â£") return unit;
  return undefined;
}

/** Warm, generic calc step labels — work for any calculator. */
const CALC_STEPS = [
  "Reading your inputs…",
  "Crunching the numbers…",
  "Building your breakdown…",
  "Done — here are your results",
];

// â”€â”€ Inner engine â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function CalculatorEngineInner({
  config,
  region,
  defaults,
  afterResults,
}: {
  config: CalculatorConfig;
  region: "US" | "UK";
  defaults?: Record<string, number>;
  afterResults?: CalculatorEngineProps["afterResults"];
}) {
  const { values, setValue, outputs } = useCalculator(config, defaults);

  // Per-calculator loader copy, falling back to the warm generic sequence.
  const calcSteps = config.calcSteps ?? CALC_STEPS;

  // Per-input raw text string (drives the number input box in SliderInputCard)
  const [rawValues, setRawValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(config.inputs.map((i) => [i.name, String(defaults?.[i.name] ?? i.default)]))
  );

  const [calculated,   setCalculated]   = useState(false);
  // Start in the loader so the result/insights auto-reveal on mount (hybrid:
  // one fun reveal, then live updates as inputs change — no empty gap, and the
  // default-state visuals are present for crawlers/first-time visitors).
  const [calculating,  setCalculating]  = useState(true);
  const [calcStep,     setCalcStep]     = useState(0);
  const [calcProgress, setCalcProgress] = useState(0);
  const [flash,        setFlash]        = useState(false);
  const [showChange,   setShowChange]   = useState(false);
  const [changeAmount, setChangeAmount] = useState(0);
  const prevPrimaryRef  = useRef(0);
  const changeFadeRef   = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Identify the primary (highlighted) output â€” fall back to first
  const primaryOutput = config.outputs.find((o) => o.highlight) ?? config.outputs[0];
  const primaryValue  = outputs[primaryOutput.key] ?? 0;

  // Secondary outputs (everything except primary)
  const secondaryOutputs = config.outputs.filter((o) => o.key !== primaryOutput.key);

  // Count-up animation on the hero number
  const display = useCountUp(primaryValue, calculated);

  // Flash on change (only after first calculate)
  useEffect(() => {
    if (!calculated) return;
    setFlash(true);
    const t = setTimeout(() => setFlash(false), 500);
    return () => clearTimeout(t);
  }, [primaryValue, calculated]);

  // Delta badge
  useEffect(() => {
    if (!calculated) return;
    const prev = prevPrimaryRef.current;
    const diff = primaryValue - prev;
    if (prev !== 0 && diff !== 0) {
      setChangeAmount(diff);
      setShowChange(true);
      if (changeFadeRef.current) clearTimeout(changeFadeRef.current);
      changeFadeRef.current = setTimeout(() => setShowChange(false), 2200);
    }
    prevPrimaryRef.current = primaryValue;
  }, [primaryValue, calculated]);

  // Auto-reveal once on mount: play the staged loader, then settle into live mode.
  useEffect(() => {
    handleCalculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleCalculate() {
    setCalculating(true);
    setCalcStep(0);
    setCalcProgress(0);
    const stepDuration = 350;
    for (let i = 0; i < calcSteps.length; i++) {
      setTimeout(() => {
        setCalcStep(i);
        setCalcProgress(Math.round(((i + 1) / calcSteps.length) * 100));
      }, i * stepDuration);
    }
    setTimeout(() => {
      prevPrimaryRef.current = 0; // ensures delta shows on first calculate
      setCalculating(false);
      setCalculated(true);
    }, calcSteps.length * stepDuration);
  }

  function handleInputChange(name: string, numVal: number, rawStr: string) {
    setValue(name, numVal);
    setRawValues((prev) => ({ ...prev, [name]: rawStr }));
  }

  const insightText = config.insight?.(values, outputs);
  const primarySubLabel = primaryOutput.sublabel?.(values, outputs);
  const formattedPrimary = formatOutput(display, primaryOutput);

  // FrequencyCards data
  const freqCards = secondaryOutputs.map((o) => ({
    label:          o.label,
    formattedValue: formatOutput(outputs[o.key] ?? 0, o),
    sub:            o.sublabel?.(values, outputs) ?? "",
  }));

  return (
    <div className="grid gap-8 lg:grid-cols-[2fr_3fr] lg:gap-10">

      {/* â”€â”€ INPUTS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="flex flex-col gap-6 lg:sticky lg:top-20 lg:self-start">

        {config.inputs.map((input) => {
          const sym  = currencySymbol(input.unit);
          const numV = Number(values[input.name]);

          // â”€â”€ Select (button group card) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
          // -- Dropdown (native <select> for long option lists) ---------------------
          if (input.type === "dropdown") {
            return (
              <div
                key={input.name}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-lg"
              >
                <p className="text-sm font-semibold text-gray-700">{input.label}</p>
                {input.hint && (
                  <p className="mt-0.5 text-xs text-gray-400">{input.hint}</p>
                )}
                <select
                  value={String(values[input.name] ?? input.default ?? "")}
                  onChange={(e) => setValue(input.name, e.target.value)}
                  className="mt-3 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
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

          // -- Multiselect (toggle-button group, stores comma-separated values) -----
          if (input.type === "multiselect") {
            const selected = String(values[input.name] ?? input.default ?? "").split(",").filter(Boolean);
            return (
              <div
                key={input.name}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-lg"
              >
                <p className="text-sm font-semibold text-gray-700">{input.label}</p>
                {input.hint && (
                  <p className="mt-0.5 text-xs text-gray-400">{input.hint}</p>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  {input.options?.map((opt) => {
                    const isOn = selected.includes(String(opt.value));
                    return (
                      <button
                        key={String(opt.value)}
                        type="button"
                        onClick={() => {
                          const next = isOn
                            ? selected.filter((v) => v !== String(opt.value))
                            : [...selected, String(opt.value)];
                          setValue(input.name, (next.length > 0 ? next : [String(opt.value)]).join(","));
                        }}
                        className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all duration-150 active:scale-[0.97] ${
                          isOn
                            ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                            : "border-gray-200 bg-gray-50 text-gray-500 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600"
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          }
          if (input.type === "select") {
            return (
              <div
                key={input.name}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-lg"
              >
                <p className="text-sm font-semibold text-gray-700">{input.label}</p>
                {input.hint && (
                  <p className="mt-0.5 text-xs text-gray-400">{input.hint}</p>
                )}
                <div
                  className="mt-3 grid grid-cols-2 gap-2"
                >
                  {input.options?.map((opt) => (
                    <button
                      key={String(opt.value)}
                      type="button"
                      onClick={() => setValue(input.name, opt.value)}
                      className={`min-h-11 rounded-xl border py-2.5 text-sm font-semibold transition-all duration-150 active:scale-[0.97] ${
                        String(values[input.name]) === String(opt.value)
                          ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                          : "border-gray-200 bg-gray-50 text-gray-500 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            );
          }

          // â”€â”€ Slider â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
          const dynamicMax = input.maxFn ? input.maxFn(values) : (input.max ?? 100);
          const clampedVal = Math.min(numV, dynamicMax);
          return (
            <SliderInputCard
              key={input.name}
              id={input.name}
              label={sym ? input.label : `${input.label}${input.unit ? ` (${input.unit})` : ""}`}
              hint={input.hint}
              symbol={sym}
              value={clampedVal}
              inputValue={rawValues[input.name] ?? String(clampedVal)}
              min={input.min ?? 0}
              max={dynamicMax}
              step={input.step ?? 1}
              onChange={(v) => handleInputChange(input.name, v, String(v))}
              onInputChange={(raw) => {
                setRawValues((prev) => ({ ...prev, [input.name]: raw }));
                const n = parseFloat(raw);
                const lo = input.min ?? 0;
                const hi = dynamicMax;
                if (!isNaN(n) && n >= lo && n <= hi) setValue(input.name, n);
              }}
              onInputBlur={() =>
                setRawValues((prev) => ({ ...prev, [input.name]: String(clampedVal) }))
              }
            >
              {input.quickPicks && input.quickPicks.length > 0 && (
                <QuickChips
                  symbol={sym ?? ""}
                  values={input.quickPicks}
                  active={numV}
                  onSelect={(v) => handleInputChange(input.name, v, String(v))}
                />
              )}
            </SliderInputCard>
          );
        })}

        {/* Calculate button â€” only shown before first calculate */}
        {!calculated && !calculating && (
          <button
            type="button"
            onClick={handleCalculate}
            className="w-full rounded-2xl bg-gray-950 py-4 text-sm font-bold text-white tracking-wide shadow-lg transition-all duration-200 hover:bg-gray-800 hover:shadow-xl active:scale-[0.98]"
          >
            {`Calculate ${config.label} →`}
          </button>
        )}
      </div>

      {/* â”€â”€ RESULTS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="flex flex-col gap-4">

        {calculating && (
          <WorthulatorProgressLoader
            steps={calcSteps}
            step={calcStep}
            progress={calcProgress}
            subtitle={`Calculating your ${config.label.toLowerCase()}`}
          />
        )}

        {!calculating && !calculated && (
          <WorthulatorResultReveal
            message={`Enter your numbers and hit Calculate`}
            subMessage={`Your ${config.label.toLowerCase()} results will appear here`}
          />
        )}

        {!calculating && calculated && (
          <>
            <HeroResultCard
              label={primaryOutput.label}
              formattedValue={formattedPrimary}
              flash={flash}
              badge={insightText ?? undefined}
              changeAmount={changeAmount}
              showChange={showChange}
              formattedChange={`${changeAmount > 0 ? "+" : ""}${formatOutput(Math.abs(changeAmount), primaryOutput)}`}
              changePositive={changeAmount > 0}
              insights={primarySubLabel ? [primarySubLabel] : undefined}
            />

            {freqCards.length > 0 && (
              <FrequencyCards cards={freqCards} />
            )}

            <CalcDisclaimer />
            {afterResults != null && (
              <>
                {typeof afterResults === "function"
                  ? afterResults(outputs, values)
                  : afterResults}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// â”€â”€ Public export â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function CalculatorEngine({ slug, region = "US", defaults, afterResults }: CalculatorEngineProps) {
  const key    = region === "UK" ? `${slug}-uk` : slug;
  const config = CALCULATOR_CONFIGS[key] ?? CALCULATOR_CONFIGS[slug];

  if (!config) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-sm text-red-700">
        No calculator config found for <code className="font-mono">{key}</code>.
        Add it to <code className="font-mono">calculatorConfigs.ts</code>.
      </div>
    );
  }

  return <CalculatorEngineInner config={config} region={region} defaults={defaults} afterResults={afterResults} />;
}


