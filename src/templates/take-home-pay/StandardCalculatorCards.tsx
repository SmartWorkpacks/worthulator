"use client";

/**
 * ─── StandardCalculatorCards ─────────────────────────────────────────────────
 * TakeHomePayTemplate — Input card building blocks
 *
 * Export list:
 *   CalcCard         – Base card wrapper (all input cards share this shell)
 *   BinaryToggleCard – Two-way toggle (e.g. US / UK country selector)
 *   SliderInputCard  – Numeric input with large drag slider + quick-pick chips
 *   QuickChips       – Row of preset value buttons (used inside SliderInputCard)
 *   SelectCard       – Label + <select> dropdown card
 *   RangeSliderCard  – Gradient fill range input card (e.g. state tax rate)
 *
 * These are the atomic building blocks.  Compose them inside your main
 * calculator component's left-column (the sticky input panel).
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * USAGE EXAMPLE
 * ─────────────────────────────────────────────────────────────────────────────
 *   <div className="flex flex-col gap-6 lg:sticky lg:top-6 lg:self-start">
 *
 *     <BinaryToggleCard
 *       label="Country"
 *       options={[{ value: "US", label: "United States" }, { value: "UK", label: "United Kingdom" }]}
 *       value={country}
 *       onChange={setCountry}
 *     />
 *
 *     <SliderInputCard
 *       id="salary"
 *       label="Annual gross salary"
 *       hint="Before tax & deductions"
 *       symbol="$"
 *       value={salary}
 *       inputValue={salaryInput}
 *       min={0}
 *       max={500000}
 *       step={1000}
 *       marks={["$0","$100k","$200k","$300k","$400k","$500k"]}
 *       onChange={(v) => { setSalary(v); setSalaryInput(String(v)); }}
 *       onInputChange={(raw) => { setSalaryInput(raw); const v = Number(raw); if (!isNaN(v)) setSalary(v); }}
 *       onInputBlur={() => setSalaryInput(String(salary))}
 *     >
 *       <QuickChips
 *         symbol="$"
 *         values={[30000, 50000, 75000, 100000, 150000]}
 *         active={salary}
 *         onSelect={(v) => { setSalary(v); setSalaryInput(String(v)); }}
 *       />
 *     </SliderInputCard>
 *
 *     <SelectCard
 *       id="filing-status"
 *       label="Filing Status"
 *       hint="Affects your federal tax bracket"
 *       value={filingStatus}
 *       onChange={setFilingStatus}
 *       options={[
 *         { value: "single",  label: "Single" },
 *         { value: "married", label: "Married (filing jointly)" },
 *       ]}
 *     />
 *
 *   </div>
 */

import { type ReactNode } from "react";
import { Slider } from "@/components/ui/slider";

// ─── CalcCard ──────────────────────────────────────────────────────────────────

interface CalcCardProps {
  children: ReactNode;
  className?: string;
}

export function CalcCard({ children, className = "" }: CalcCardProps) {
  return (
    <div
      className={`rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${className}`}
    >
      {children}
    </div>
  );
}

// ─── BinaryToggleCard ──────────────────────────────────────────────────────────

interface BinaryToggleCardProps<T extends string> {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}

export function BinaryToggleCard<T extends string>({
  label,
  options,
  value,
  onChange,
}: BinaryToggleCardProps<T>) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-6 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">{label}</p>
      </div>
      <div className={`grid grid-cols-${options.length}`}>
        {options.map((opt, i) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={[
              "py-3 text-sm font-semibold transition-colors duration-150",
              i < options.length - 1 ? "border-r border-gray-100" : "",
              value === opt.value
                ? "bg-emerald-500 text-white"
                : "bg-white text-gray-500 hover:bg-gray-50",
            ].join(" ")}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── SliderInputCard ───────────────────────────────────────────────────────────

interface SliderInputCardProps {
  id: string;
  label: string;
  hint?: string;
  symbol?: string;
  value: number;
  inputValue: string;
  min: number;
  max: number;
  step: number;
  /** Axis labels, e.g. ["$0","$100k","$200k","$300k","$400k","$500k"] */
  marks?: string[];
  onChange: (value: number) => void;
  onInputChange: (raw: string) => void;
  onInputBlur?: () => void;
  /** Optional content rendered below slider (e.g. QuickChips, percentile text) */
  children?: ReactNode;
}

export function SliderInputCard({
  id,
  label,
  hint,
  symbol,
  value,
  inputValue,
  min,
  max,
  step,
  marks,
  onChange,
  onInputChange,
  onInputBlur,
  children,
}: SliderInputCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <label htmlFor={id} className="block text-sm font-semibold text-gray-700">
            {label}
          </label>
          {hint && <p className="mt-0.5 text-xs text-gray-400">{hint}</p>}
        </div>
        {/* Editable number badge */}
        <div className="relative">
          {symbol && (
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm font-bold text-gray-400">
              {symbol}
            </span>
          )}
          <input
            id={id}
            type="number"
            min={min}
            max={max}
            step={step}
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            onBlur={onInputBlur}
            className={`w-32 rounded-xl border border-gray-200 bg-gray-50 py-2 pr-3 text-sm font-bold text-gray-900 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100 ${symbol ? "pl-7" : "pl-3"}`}
          />
        </div>
      </div>

      {/* Slider */}
      <div className="mt-5 **:[[role=slider]]:h-5 **:[[role=slider]]:w-5 **:[[role=slider]]:bg-emerald-500 **:[[role=slider]]:border-emerald-400 **:[[role=slider]]:shadow-md **:[[role=slider]]:transition-all **:[[role=slider]]:duration-150 **:[[role=slider]]:cursor-grab **:[[role=slider]]:hover:scale-[1.1] **:[[role=slider]]:active:scale-[1.15] **:[[role=slider]]:active:cursor-grabbing">
        <Slider
          min={min}
          max={max}
          step={step}
          value={[value]}
          onValueChange={([v]) => onChange(v)}
          className="h-3"
        />
        {marks && (
          <div className="mt-2 flex justify-between text-xs text-gray-400">
            {marks.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        )}
      </div>

      {children}
    </div>
  );
}

// ─── QuickChips ────────────────────────────────────────────────────────────────

interface QuickChipsProps {
  symbol?: string;
  values: number[];
  active: number;
  /** Override display label per value; falls back to `${symbol}${v/1000}k` */
  labels?: string[];
  onSelect: (v: number) => void;
}

export function QuickChips({ symbol = "", values, active, labels, onSelect }: QuickChipsProps) {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {values.map((v, i) => (
        <button
          key={v}
          type="button"
          onClick={() => onSelect(v)}
          className={`rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-150 active:scale-[0.96] ${
            active === v
              ? "border-emerald-400 bg-emerald-50 text-emerald-700"
              : "border-gray-200 bg-gray-50 text-gray-500 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600"
          }`}
        >
          {labels ? labels[i] : `${symbol}${(v / 1000).toFixed(0)}k`}
        </button>
      ))}
    </div>
  );
}

// ─── SelectCard ────────────────────────────────────────────────────────────────

interface SelectCardProps {
  id: string;
  label: string;
  hint?: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}

export function SelectCard({ id, label, hint, value, onChange, options }: SelectCardProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <label htmlFor={id} className="block text-sm font-semibold text-gray-700">
        {label}
      </label>
      {hint && <p className="mt-0.5 text-xs text-gray-400">{hint}</p>}
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-3 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-medium text-gray-900 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// ─── RangeSliderCard ───────────────────────────────────────────────────────────
// Gradient-fill native <input type="range"> with min/max labels.
// Used for continuous percentage inputs like state tax rate.

interface RangeSliderCardProps {
  label: string;
  hint?: string;
  value: number;
  min: number;
  max: number;
  step: number;
  /** Display label alongside current value, e.g. "%" */
  unit?: string;
  minLabel?: string;
  maxLabel?: string;
  /** Accent colour stop (defaults to emerald #10b981 → #34d399) */
  gradientStart?: string;
  gradientEnd?: string;
  onChange: (v: number) => void;
  /** Optional extra content (e.g. a dropdown that syncs with the slider) */
  children?: ReactNode;
}

export function RangeSliderCard({
  label,
  hint,
  value,
  min,
  max,
  step,
  unit = "%",
  minLabel,
  maxLabel,
  gradientStart = "#10b981",
  gradientEnd = "#34d399",
  onChange,
  children,
}: RangeSliderCardProps) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-700">{label}</p>
          {hint && <p className="mt-0.5 text-xs text-gray-400">{hint}</p>}
        </div>
        <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-xl font-bold tracking-tight text-gray-700">
          {value}{unit}
        </span>
      </div>

      {children && <div className="mt-4">{children}</div>}

      <div className="mt-4">
        <div className="relative h-3 rounded-full bg-gray-100">
          <div
            className="pointer-events-none absolute left-0 top-0 h-full rounded-full"
            style={{
              width: `${pct}%`,
              background: `linear-gradient(90deg, ${gradientStart}, ${gradientEnd})`,
            }}
          />
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          />
        </div>
        {(minLabel || maxLabel) && (
          <div className="mt-1.5 flex justify-between text-xs text-gray-400">
            <span>{minLabel ?? min}</span>
            <span>{maxLabel ?? max}</span>
          </div>
        )}
      </div>
    </div>
  );
}
