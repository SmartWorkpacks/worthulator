"use client";

// ─── Shared Calculator Core — OutputCard ─────────────────────────────────────
//
// ORIGIN:  Extracted from Worthulator (components/calculator-engine/OutputCard.tsx)
// USAGE:   Renders a single calculator output value. Generic — no site content.
// THEME:   Replace `primaryColor` / `secondaryColor` tokens for your brand.
//
// ─────────────────────────────────────────────────────────────────────────────

import type { OutputConfig, CalculatorValues, CalculatorOutputs } from "./types";

interface OutputCardProps {
  output:     OutputConfig;
  value:      number | undefined;
  inputs:     CalculatorValues;
  allOutputs: CalculatorOutputs;
}

function formatValue(value: number, output: OutputConfig): string {
  if (!isFinite(value)) return "—";
  const symbol = output.currencySymbol ?? "$";
  switch (output.format) {
    case "currency":
      if (output.decimalPlaces != null) {
        return `${symbol}${value.toLocaleString("en-US", {
          minimumFractionDigits: output.decimalPlaces,
          maximumFractionDigits: output.decimalPlaces,
        })}`;
      }
      return `${symbol}${Math.round(value).toLocaleString()}`;
    case "integer":  return Math.ceil(value).toLocaleString();
    case "percent":  return `${value.toFixed(output.decimalPlaces ?? 1)}%`;
    case "decimal":
    default: {
      const places = output.decimalPlaces ?? 2;
      return value.toFixed(places) + (output.unit ? ` ${output.unit}` : "");
    }
  }
}

export default function OutputCard({ output, value, inputs, allOutputs }: OutputCardProps) {
  const safe      = value ?? 0;
  const formatted = formatValue(safe, output);
  const sublabel  = output.sublabel?.(inputs, allOutputs);

  // ── Primary highlight card ─────────────────────────────────────────────────
  // Swap Tailwind classes below to match your brand color scheme
  if (output.highlight) {
    return (
      <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-blue-500">
          {output.label}
        </p>
        <p className="mt-2 text-4xl font-bold tracking-tight text-blue-700">
          {formatted}
          {output.unit && (
            <span className="ml-1.5 text-lg font-normal text-blue-400">
              {output.unit}
            </span>
          )}
        </p>
        {sublabel && <p className="mt-1 text-xs text-blue-600/70">{sublabel}</p>}
      </div>
    );
  }

  // ── Secondary result card ──────────────────────────────────────────────────
  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
        {output.label}
      </p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900">
        {formatted}
        {output.unit && (
          <span className="ml-1.5 text-lg font-normal text-gray-400">
            {output.unit}
          </span>
        )}
      </p>
      {sublabel && <p className="mt-1 text-xs text-gray-400">{sublabel}</p>}
    </div>
  );
}
