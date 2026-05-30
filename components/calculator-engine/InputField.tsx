"use client";

import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import type { InputConfig } from "./types";

interface InputFieldProps {
  input: InputConfig;
  value: number | string;
  onChange: (value: number | string) => void;
}

/**
 * Renders a single input based on its config type:
 *  - "slider"  → range slider + number text box + optional quick-pick chips
 *  - "select"  → button group
 *  - "number"  → plain number text box only
 */
export default function InputField({ input, value, onChange }: InputFieldProps) {
  const numValue = Number(value);

  // ── Select (button group) ─────────────────────────────────────────────────
  if (input.type === "select") {
    return (
      <div>
        <label className="text-sm font-semibold text-gray-700">{input.label}</label>
        <div
          className="mt-2 grid grid-cols-2 gap-2"
        >
          {input.options?.map((opt) => (
            <button
              key={String(opt.value)}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`min-h-11 rounded-xl border py-2 text-sm font-semibold transition-colors ${
                String(value) === String(opt.value)
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                  : "border-gray-200 text-gray-500 hover:border-emerald-300 hover:text-emerald-600"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── Slider + text input (default) ─────────────────────────────────────────
  return (
    <SliderField input={input} value={numValue} onChange={onChange} />
  );
}

// ── SliderField — isolated to avoid re-rendering siblings ────────────────────
function SliderField({
  input,
  value,
  onChange,
}: {
  input: InputConfig;
  value: number;
  onChange: (v: number) => void;
}) {
  const [raw, setRaw] = useState(String(value));

  // Keep the text box in sync when the slider moves
  useEffect(() => {
    setRaw(String(value));
  }, [value]);

  function handleText(text: string) {
    setRaw(text);
    const n = parseFloat(text);
    const min = input.min ?? 0;
    const max = input.max ?? Infinity;
    if (!isNaN(n) && n >= min && n <= max) {
      onChange(n);
    }
  }

  function handleSlider(v: number) {
    onChange(v);
    setRaw(String(v));
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-gray-700">
          {input.label}
          {input.unit && (
            <span className="ml-1 font-normal text-gray-400">({input.unit})</span>
          )}
        </label>
        <input
          type="number"
          min={input.min}
          max={input.max}
          step={input.step}
          value={raw}
          onChange={(e) => handleText(e.target.value)}
          className="w-20 rounded-lg border border-gray-200 px-2 py-1 text-right text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400"
        />
      </div>

      <Slider
        min={input.min ?? 0}
        max={input.max ?? 100}
        step={input.step ?? 1}
        value={[value]}
        onValueChange={([v]) => handleSlider(v)}
        className="mt-3"
      />

      {/* Quick-pick chips */}
      {input.quickPicks && input.quickPicks.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {input.quickPicks.map((pick) => (
            <button
              key={pick}
              type="button"
              onClick={() => handleSlider(pick)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
                value === pick
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                  : "border-gray-200 text-gray-500 hover:border-emerald-300 hover:text-emerald-600"
              }`}
            >
              {pick}
              {input.unit === "in" ? "\u2033" : input.unit ? ` ${input.unit}` : ""}
            </button>
          ))}
        </div>
      )}

      {input.hint && (
        <p className="mt-2 text-xs text-gray-400">{input.hint}</p>
      )}
    </div>
  );
}
