"use client";

import { useState } from "react";

/**
 * ─── Input primitives ─────────────────────────────────────────────────────────
 *
 * Shared inputs for the custom-loader calculator pattern.
 *
 *   SectionLabel — small uppercase divider with optional sub-label.
 *   NumInput     — number field with prefix/suffix, +/- steppers, clamping,
 *                  and commit-on-blur/Enter (used alongside RangeSliderCard).
 *
 * For sliders, reuse `RangeSliderCard` from "@/src/templates/take-home-pay".
 */

export function SectionLabel({ text, sub }: { text: string; sub?: string }) {
  return (
    <div className="border-b border-gray-100 pb-0.5 pt-1">
      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400">{text}</p>
      {sub && <p className="mt-0.5 text-[11px] text-gray-400">{sub}</p>}
    </div>
  );
}

interface NumInputProps {
  label: string;
  hint?: string;
  prefix?: string;
  suffix?: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  max?: number;
  wide?: boolean;
}

export function NumInput({
  label,
  hint,
  prefix = "",
  suffix = "",
  value,
  onChange,
  step = 1,
  min = 0,
  max = Infinity,
  wide = false,
}: NumInputProps) {
  const [raw, setRaw] = useState(String(value));
  // Sync the editable buffer when the value prop changes (e.g. steppers, parent
  // reset) using React's render-time adjustment pattern — no effect required.
  const [lastValue, setLastValue] = useState(value);
  if (value !== lastValue) {
    setLastValue(value);
    setRaw(String(value));
  }

  function commit(s: string) {
    const n = Number(s.replace(/,/g, ""));
    const clamped = Math.max(min, Math.min(max, isNaN(n) ? value : n));
    onChange(clamped);
    setRaw(String(clamped));
  }

  return (
    <div className={`flex flex-col gap-1 ${wide ? "col-span-2" : ""}`}>
      <p className="mb-0.5 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400">{label}</p>
      {hint && <p className="-mt-0.5 mb-1 text-[11px] leading-snug text-gray-400">{hint}</p>}
      <div className="flex items-stretch overflow-hidden rounded-xl border border-gray-200 bg-white transition-colors focus-within:border-gray-400">
        {prefix && (
          <span className="flex items-center border-r border-gray-100 bg-gray-50 px-3 text-sm font-semibold text-gray-400">{prefix}</span>
        )}
        <input
          type="number"
          inputMode="numeric"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          onBlur={(e) => commit(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") commit(raw); }}
          className="min-w-0 flex-1 bg-white px-3 py-2.5 text-sm font-bold text-gray-900 focus:outline-none"
          min={min}
          max={max === Infinity ? undefined : max}
          step={step}
        />
        {suffix && (
          <span className="flex items-center border-l border-gray-100 bg-gray-50 px-3 text-sm font-semibold text-gray-400">{suffix}</span>
        )}
        <div className="flex shrink-0 flex-col border-l border-gray-100">
          <button
            type="button"
            onClick={() => onChange(Math.min(max, value + step))}
            className="border-b border-gray-100 px-2.5 py-1 text-[10px] font-bold leading-none text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-700"
            aria-label={`Increase ${label}`}
          >+</button>
          <button
            type="button"
            onClick={() => onChange(Math.max(min, value - step))}
            className="px-2.5 py-1 text-[10px] font-bold leading-none text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-700"
            aria-label={`Decrease ${label}`}
          >-</button>
        </div>
      </div>
    </div>
  );
}
