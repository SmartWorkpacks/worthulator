"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  BarChart, Bar, AreaChart, Area, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell,
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────

type Mode = "increase" | "decrease" | "difference" | "reverse";

interface Result {
  primary: number;
  secondary?: number;
  tertiary?: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function round(n: number, dp = 4): number {
  return Math.round(n * 10 ** dp) / 10 ** dp;
}

function fmt(n: number, dp = 2): string {
  if (!isFinite(n)) return "—";
  return n.toLocaleString("en-US", {
    minimumFractionDigits: dp,
    maximumFractionDigits: dp,
  });
}

function fmtPct(n: number): string {
  if (!isFinite(n)) return "—";
  const abs = Math.abs(n);
  const sign = n < 0 ? "−" : n > 0 ? "+" : "";
  return `${sign}${abs.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
}

// ─── Calculating loader ───────────────────────────────────────────────────────

const CALC_STEPS = [
  "Reading your inputs…",
  "Applying the formula…",
  "Computing the result…",
  "Building your breakdown…",
];

function CalculatingLoader({ progress, step }: { progress: number; step: number }) {
  return (
    <div className="relative flex flex-col items-center justify-center py-20 px-6 bg-gray-950 rounded-2xl text-white overflow-hidden">
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 70%, #10b981 0%, transparent 65%)" }}
      />
      <div className="relative mb-7">
        <div
          className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-emerald-400 animate-spin"
          style={{ animationDuration: "0.85s" }}
        />
        <div className="w-20 h-20 rounded-full border-2 border-white/10 flex items-center justify-center bg-white/5">
          <svg width="36" height="36" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2 3L6 13L8 7L10 13L14 3" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <p className="relative text-lg font-bold text-center text-white mb-1">{CALC_STEPS[step] ?? "Calculating…"}</p>
      <p className="relative text-xs text-white/40 mb-8">Working out your percentage</p>
      <div className="relative w-full max-w-xs">
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: progress + "%", background: "linear-gradient(90deg, #10b981, #2dd4bf)" }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[10px] text-white/30">{Math.round(progress)}% complete</span>
          <span className="text-[10px] text-white/30">Step {step + 1} / {CALC_STEPS.length}</span>
        </div>
      </div>
      <div className="flex gap-2 mt-6">
        {CALC_STEPS.map((_, i) => (
          <div
            key={i}
            style={{
              height: 6,
              borderRadius: 3,
              width: i < step ? 20 : i === step ? 32 : 12,
              backgroundColor: i <= step ? "#34d399" : "rgba(255,255,255,0.15)",
              transition: "all 0.3s",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Bar visual ──────────────────────────────────────────────────────────────

function ChangeBar({ pct }: { pct: number }) {
  if (!isFinite(pct)) return null;
  const clamped = Math.min(Math.abs(pct), 200);
  const width = (clamped / 200) * 100;
  const isPos = pct >= 0;
  return (
    <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/8">
      <div
        className={`h-full rounded-full transition-all duration-700 ${isPos ? "bg-emerald-400" : "bg-rose-400"}`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

// ─── Number input ─────────────────────────────────────────────────────────────

function NumInput({
  label,
  value,
  onChange,
  prefix,
  suffix,
  placeholder,
  id,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  prefix?: string;
  suffix?: string;
  placeholder?: string;
  id: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
        {label}
      </label>
      <div className="relative flex items-center">
        {prefix && (
          <span className="pointer-events-none absolute left-3.5 text-sm font-medium text-gray-400 select-none z-10">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? "0"}
          className={`w-full rounded-xl border border-gray-200 bg-gray-50 py-3 text-sm font-bold text-gray-900 shadow-sm transition-all duration-150 focus:border-emerald-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400/20 hover:border-gray-300 ${prefix ? "pl-8" : "pl-4"} ${suffix ? "pr-10" : "pr-4"}`}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3.5 text-sm font-medium text-gray-400 select-none">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Scenarios ────────────────────────────────────────────────────────────────

interface Scenario {
  label: string;
  emoji: string;
  mode: Mode;
  a: string;
  b: string;
  description: string;
}

const SCENARIOS: Scenario[] = [
  { label: "Pay rise 5%",    emoji: "💼", mode: "increase",   a: "50000", b: "5",   description: "£50,000 salary +5%" },
  { label: "Price cut 20%",  emoji: "🏷️", mode: "decrease",   a: "299",   b: "20",  description: "$299 item −20% off" },
  { label: "Stock up 43%",   emoji: "📈", mode: "increase",   a: "1500",  b: "43",  description: "$1,500 stock +43%" },
  { label: "Inflation 3.5%", emoji: "📊", mode: "increase",   a: "100",   b: "3.5", description: "$100 basket +3.5% CPI" },
  { label: "Sales drop 12%", emoji: "📉", mode: "decrease",   a: "84000", b: "12",  description: "$84k revenue −12%" },
  { label: "Rent increase",  emoji: "🏠", mode: "increase",   a: "1800",  b: "8",   description: "$1,800 rent +8%" },
];

// ─── Mode accent colours ──────────────────────────────────────────────────────

const MODE_GLOW: Record<Mode, string> = {
  increase:   "radial-gradient(ellipse at 50% 70%, #10b981 0%, transparent 65%)",
  decrease:   "radial-gradient(ellipse at 50% 70%, #f43f5e 0%, transparent 65%)",
  difference: "radial-gradient(ellipse at 50% 70%, #3b82f6 0%, transparent 65%)",
  reverse:    "radial-gradient(ellipse at 50% 70%, #8b5cf6 0%, transparent 65%)",
};

const MODE_ORB: Record<Mode, string> = {
  increase:   "bg-emerald-500/15",
  decrease:   "bg-rose-500/10",
  difference: "bg-blue-500/10",
  reverse:    "bg-violet-500/10",
};
const MODE_ORB_FLASH: Record<Mode, string> = {
  increase:   "bg-emerald-500/25",
  decrease:   "bg-rose-500/20",
  difference: "bg-blue-500/20",
  reverse:    "bg-violet-500/20",
};

const MODE_TEXT: Record<Mode, string> = {
  increase:   "text-emerald-400",
  decrease:   "text-rose-400",
  difference: "text-blue-400",
  reverse:    "text-violet-400",
};
const MODE_TEXT_FLASH: Record<Mode, string> = {
  increase:   "text-emerald-300",
  decrease:   "text-rose-300",
  difference: "text-blue-300",
  reverse:    "text-violet-300",
};

const MODE_BORDER: Record<Mode, string> = {
  increase:   "border-emerald-500/20",
  decrease:   "border-rose-500/20",
  difference: "border-blue-500/20",
  reverse:    "border-violet-500/20",
};

// ─── Main component ───────────────────────────────────────────────────────────

export default function PercentageIncreaseCalculator() {
  const [mode, setMode]   = useState<Mode>("increase");
  const [aVal, setAVal]   = useState("100");
  const [bVal, setBVal]   = useState("15");

  const [calculated,     setCalculated]     = useState(false);
  const [calculating,    setCalculating]    = useState(false);
  const [calcStep,       setCalcStep]       = useState(0);
  const [calcProgress,   setCalcProgress]   = useState(0);
  const [flash,          setFlash]          = useState(false);
  const [displayPrimary, setDisplayPrimary] = useState(0);
  const [changeAmount,   setChangeAmount]   = useState(0);
  const [showChange,     setShowChange]     = useState(false);

  const animRef        = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevPrimaryRef = useRef(0);
  const prevCalcRef    = useRef(false);
  const changeFadeRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Config per mode ────────────────────────────────────────────────────────
  const configs: Record<Mode, { aLabel: string; bLabel: string; aPrefix?: string; bSuffix?: string; aPlaceholder?: string; bPlaceholder?: string }> = {
    increase:   { aLabel: "Original value",  bLabel: "% increase",  bSuffix: "%", aPlaceholder: "100", bPlaceholder: "15"  },
    decrease:   { aLabel: "Original value",  bLabel: "% decrease",  bSuffix: "%", aPlaceholder: "100", bPlaceholder: "15"  },
    difference: { aLabel: "Value A",         bLabel: "Value B",                   aPlaceholder: "80",  bPlaceholder: "100" },
    reverse:    { aLabel: "Final value",     bLabel: "% change",    bSuffix: "%", aPlaceholder: "115", bPlaceholder: "15"  },
  };
  const cfg = configs[mode];

  // ── Calculate ──────────────────────────────────────────────────────────────
  const a = parseFloat(aVal);
  const b = parseFloat(bVal);

  const result: Result = (() => {
    if (!isFinite(a) || !isFinite(b)) return { primary: NaN };
    switch (mode) {
      case "increase":
        return { primary: a * (1 + b / 100), secondary: a * (b / 100), tertiary: b };
      case "decrease":
        return { primary: a * (1 - b / 100), secondary: a * (b / 100), tertiary: -b };
      case "difference": {
        const diff = b - a;
        const pct  = a !== 0 ? round((diff / a) * 100) : NaN;
        return { primary: diff, secondary: pct, tertiary: Math.abs(diff) };
      }
      case "reverse": {
        const original = a / (1 + b / 100);
        return { primary: original, secondary: a - original, tertiary: b };
      }
    }
  })();

  const isValid = isFinite(result.primary);

  // ── Flash on input/mode change after first calc ───────────────────────────
  useEffect(() => {
    if (!calculated) return;
    setFlash(true);
    const t = setTimeout(() => setFlash(false), 450);
    return () => clearTimeout(t);
  }, [aVal, bVal, mode]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Change delta indicator ────────────────────────────────────────────────
  useEffect(() => {
    if (!calculated) return;
    const prev = prevPrimaryRef.current;
    const cur  = isFinite(result.primary) ? result.primary : 0;
    const diff = cur - prev;
    if (prev !== 0 && diff !== 0) {
      setChangeAmount(diff);
      setShowChange(true);
      if (changeFadeRef.current) clearTimeout(changeFadeRef.current);
      changeFadeRef.current = setTimeout(() => setShowChange(false), 1800);
    }
    prevPrimaryRef.current = cur;
  }, [result.primary]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Animated count toward target ──────────────────────────────────────────
  useEffect(() => {
    if (!calculated || !isValid) return;
    if (animRef.current) clearTimeout(animRef.current);
    const target   = result.primary;
    const startVal = displayPrimary;
    const diff     = target - startVal;
    if (diff === 0) return;
    const steps = 24;
    const c1    = 0.4; const c3 = c1 + 1;
    const ease  = (t: number) => 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    let step = 0;
    const tick = () => {
      step++;
      setDisplayPrimary(startVal + diff * ease(step / steps));
      if (step < steps) animRef.current = setTimeout(tick, 12);
      else setDisplayPrimary(target);
    };
    animRef.current = setTimeout(tick, 12);
    return () => { if (animRef.current) clearTimeout(animRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result.primary, calculated]);

  // ── First-reveal count-up from 72% ───────────────────────────────────────
  useEffect(() => {
    if (!calculated || prevCalcRef.current || !isValid) return;
    prevCalcRef.current = true;
    const target   = result.primary;
    const startVal = target * 0.72;
    const diff     = target - startVal;
    if (diff === 0) return;
    const steps = 30;
    const c1    = 0.4; const c3 = c1 + 1;
    const ease  = (t: number) => 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    let step = 0;
    const tick = () => {
      step++;
      setDisplayPrimary(startVal + diff * ease(step / steps));
      if (step < steps) animRef.current = setTimeout(tick, 14);
      else setDisplayPrimary(target);
    };
    animRef.current = setTimeout(tick, 14);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calculated]);

  // ── Calculate handler ─────────────────────────────────────────────────────
  function handleCalculate() {
    setCalculating(true);
    setCalcStep(0);
    setCalcProgress(0);
    const stepDuration = 300;
    const steps = CALC_STEPS.length;
    for (let i = 0; i < steps; i++) {
      setTimeout(() => {
        setCalcStep(i);
        setCalcProgress(Math.round(((i + 1) / steps) * 100));
      }, i * stepDuration);
    }
    setTimeout(() => {
      setCalculating(false);
      setCalculated(true);
    }, steps * stepDuration);
  }

  // ── Load scenario ─────────────────────────────────────────────────────────
  const loadScenario = useCallback((s: Scenario) => {
    setMode(s.mode);
    setAVal(s.a);
    setBVal(s.b);
    if (calculated) {
      setCalculated(false);
      prevCalcRef.current = false;
      setTimeout(handleCalculate, 80);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calculated]);

  const displayStr = isValid
    ? displayPrimary.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : "—";

  // ── Chart data ─────────────────────────────────────────────────────────────
  const TICK_STYLE = { fill: "#9ca3af", fontSize: 11 };
  const TOOLTIP_STYLE = {
    backgroundColor: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    fontSize: 12,
    color: "#111827",
  };

  // Chart 1: sweep of % values — Original vs New (increase/decrease)
  const PCT_RANGE_BASE = [5, 10, 15, 20, 25, 30, 40, 50];
  const bRounded = Math.round(b * 10) / 10;
  const PCT_RANGE = Array.from(new Set([...PCT_RANGE_BASE, bRounded])).sort((x, y) => x - y);
  const sweepData = isValid && (mode === "increase" || mode === "decrease")
    ? PCT_RANGE.map((pct) => {
        const newVal = mode === "increase" ? a * (1 + pct / 100) : a * (1 - pct / 100);
        return { label: `${pct}%`, original: Math.round(a), newVal: Math.round(newVal), isActive: pct === bRounded };
      })
    : [];

  // Chart 2: compound growth curve — how the value grows if the % were applied repeatedly (increase/decrease)
  const compoundData = isValid && (mode === "increase" || mode === "decrease")
    ? Array.from({ length: 11 }, (_, i) => {
        const val = mode === "increase"
          ? a * Math.pow(1 + b / 100, i)
          : a * Math.pow(1 - b / 100, i);
        return { label: `${i}×`, value: Math.round(val) };
      })
    : [];

  // Chart 3 (difference mode): side-by-side A vs B
  const diffBarData = isValid && mode === "difference"
    ? [
        { label: "Value A", value: Math.round(a) },
        { label: "Value B", value: Math.round(b) },
      ]
    : [];

  // Chart 4 (reverse mode): breakdown of original / change / final
  const reverseBarData = isValid && mode === "reverse"
    ? [
        { label: "Original", value: Math.round(result.primary) },
        { label: "Change", value: Math.abs(Math.round(a - result.primary)) },
        { label: "Final", value: Math.round(a) },
      ]
    : [];

  const fmtY = (v: number) =>
    Math.abs(v) >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v);

  return (
    <div className="grid gap-8 lg:grid-cols-[2fr_3fr] lg:gap-10">

      {/* ── INPUTS (sticky) ──────────────────────────────────────────────── */}
      <div className="flex flex-col gap-6 lg:sticky lg:top-6 lg:self-start">

        {/* Mode selector */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Calculation mode</p>
          </div>
          <div className="grid grid-cols-2">
            {([
              { value: "increase",   label: "% Increase",  emoji: "↑" },
              { value: "decrease",   label: "% Decrease",  emoji: "↓" },
              { value: "difference", label: "Difference",  emoji: "↔" },
              { value: "reverse",    label: "Reverse",     emoji: "⟲" },
            ] as { value: Mode; label: string; emoji: string }[]).map((m, i) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setMode(m.value)}
                className={`py-3 text-sm font-semibold transition-colors duration-150 ${i % 2 === 1 ? "border-l border-gray-100" : ""} ${i >= 2 ? "border-t border-gray-100" : ""} ${
                  mode === m.value ? "bg-gray-950 text-white" : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
              >
                <span className="mr-1.5 opacity-70">{m.emoji}</span>
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Inputs */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-lg">
          <p className="mb-1 text-sm font-semibold text-gray-700">
            {mode === "increase"   && "Calculate the new value after adding a percentage"}
            {mode === "decrease"   && "Calculate the new value after removing a percentage"}
            {mode === "difference" && "Find the percentage change from A to B"}
            {mode === "reverse"    && "Find the original value before a percentage was applied"}
          </p>
          <p className="mb-5 mt-1 rounded-lg bg-gray-50 border border-gray-100 px-3 py-2 text-xs font-mono text-gray-400">
            {mode === "increase"   && `New value = ${aVal || "A"} × (1 + ${bVal || "B"} ÷ 100)`}
            {mode === "decrease"   && `New value = ${aVal || "A"} × (1 − ${bVal || "B"} ÷ 100)`}
            {mode === "difference" && `% change = (B − A) ÷ A × 100`}
            {mode === "reverse"    && `Original = ${aVal || "Final"} ÷ (1 + ${bVal || "B"} ÷ 100)`}
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <NumInput id="val-a" label={cfg.aLabel} value={aVal} onChange={setAVal} prefix={cfg.aPrefix} placeholder={cfg.aPlaceholder} />
            <NumInput id="val-b" label={cfg.bLabel} value={bVal} onChange={setBVal} suffix={cfg.bSuffix} placeholder={cfg.bPlaceholder} />
          </div>
        </div>

        {/* Quick examples */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Quick examples</p>
          <div className="flex flex-wrap gap-2">
            {SCENARIOS.map((s) => (
              <button
                key={s.label}
                type="button"
                onClick={() => loadScenario(s)}
                title={s.description}
                className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-medium text-gray-600 shadow-sm transition-all duration-150 hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 hover:shadow active:scale-[0.97]"
              >
                <span>{s.emoji}</span>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Calculate button */}
        {!calculated && (
          <button
            type="button"
            onClick={handleCalculate}
            disabled={calculating || !isFinite(a) || !isFinite(b)}
            className="w-full rounded-2xl bg-gray-950 py-4 text-sm font-bold text-white tracking-wide shadow-lg transition-all duration-200 hover:bg-gray-800 hover:shadow-xl active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {calculating ? "Calculating…" : "Calculate →"}
          </button>
        )}
      </div>

      {/* ── RESULTS ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4">

        {/* Loader */}
        {calculating && <CalculatingLoader progress={calcProgress} step={calcStep} />}

        {/* Placeholder */}
        {!calculating && !calculated && (
          <div className="relative flex flex-col items-center justify-center py-24 px-6 rounded-2xl overflow-hidden bg-gray-950 text-center shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
            <div className="pointer-events-none absolute inset-0 opacity-20" style={{ background: "radial-gradient(ellipse at 50% 80%, #10b981 0%, transparent 60%)" }} />
            <div className="relative w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 3L6 13L8 7L10 13L14 3" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="relative text-sm font-semibold text-white/70">Choose a mode, enter your values and hit Calculate</p>
            <p className="relative mt-1 text-xs text-white/30">Your full breakdown will appear here</p>
          </div>
        )}

        {/* Results revealed */}
        {!calculating && calculated && (
          <>

            {/* Hero result */}
            <div
              className={`relative overflow-hidden rounded-2xl border bg-gray-950 p-8 transition-all duration-500 ${
                flash
                  ? `${MODE_BORDER[mode]} shadow-[0_24px_100px_rgba(0,0,0,0.55),0_0_40px_rgba(52,211,153,0.1)]`
                  : "border-white/8 shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
              }`}
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full blur-3xl transition-all duration-500"
                style={{ background: MODE_GLOW[mode], opacity: flash ? 0.3 : 0.2 }} />
              <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-gray-900/60 blur-3xl" />

              <p className="relative text-xs font-semibold uppercase tracking-[0.28em] text-gray-400">
                {mode === "increase"   ? "New value after increase" :
                 mode === "decrease"   ? "New value after decrease" :
                 mode === "difference" ? "Percentage difference"    :
                                        "Original value before change"}
              </p>

              <p className={`relative mt-3 text-[clamp(3.5rem,8vw,5.5rem)] font-bold leading-none tracking-[-0.04em] transition-all duration-500 ${flash ? MODE_TEXT_FLASH[mode] : MODE_TEXT[mode]}`}>
                {isValid ? displayStr : "—"}
              </p>

              {/* Change delta */}
              <div className={`relative mt-1 h-6 overflow-hidden transition-all duration-700 ${showChange ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"}`}>
                {changeAmount !== 0 && (
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${changeAmount > 0 ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"}`}>
                    {changeAmount > 0 ? "+" : ""}{changeAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                )}
              </div>

              {/* Sub-line */}
              <p className="relative mt-2 text-sm font-medium text-gray-400">
                {mode === "increase" && isValid && (
                  <>{fmt(a)} <span className="text-gray-600">+</span> <span className={MODE_TEXT[mode]}>{fmt(b)}%</span> <span className="text-gray-600">=</span> <span className={`font-bold ${MODE_TEXT_FLASH[mode]}`}>{fmt(result.primary)}</span></>
                )}
                {mode === "decrease" && isValid && (
                  <>{fmt(a)} <span className="text-gray-600">−</span> <span className={MODE_TEXT[mode]}>{fmt(b)}%</span> <span className="text-gray-600">=</span> <span className={`font-bold ${MODE_TEXT_FLASH[mode]}`}>{fmt(result.primary)}</span></>
                )}
                {mode === "difference" && isValid && (
                  <>{fmt(a)} <span className="text-gray-600">→</span> {fmt(b)} <span className="text-gray-600">=</span> <span className={`font-bold ${(result.secondary ?? 0) >= 0 ? "text-emerald-300" : "text-rose-300"}`}>{isFinite(result.secondary ?? NaN) ? fmtPct(result.secondary ?? 0) : "—"}</span></>
                )}
                {mode === "reverse" && isValid && (
                  <>Final {fmt(a)} after <span className={MODE_TEXT[mode]}>{fmt(b)}%</span> <span className="text-gray-600">→</span> original <span className={`font-bold ${MODE_TEXT_FLASH[mode]}`}>{fmt(result.primary)}</span></>
                )}
              </p>

              {/* Colour bar */}
              {isValid && mode !== "difference" && (
                <ChangeBar pct={mode === "increase" ? (result.tertiary ?? 0) : mode === "decrease" ? -(result.tertiary ?? 0) : (result.tertiary ?? 0)} />
              )}
              {isValid && mode === "difference" && isFinite(result.secondary ?? NaN) && (
                <ChangeBar pct={result.secondary ?? 0} />
              )}
            </div>

            {/* 3-up metric cards */}
            {isValid && (
              <div className="grid grid-cols-3 gap-3">
                {mode === "increase" && (
                  <>
                    <ResultCard label="Original"     value={fmt(a)} />
                    <ResultCard label="Amount added"  value={`+${fmt(a * b / 100)}`} accent="emerald" />
                    <ResultCard label="Multiplier"    value={`×${fmt(1 + b / 100, 4)}`} />
                  </>
                )}
                {mode === "decrease" && (
                  <>
                    <ResultCard label="Original"      value={fmt(a)} />
                    <ResultCard label="Amount removed" value={`−${fmt(a * b / 100)}`} accent="rose" />
                    <ResultCard label="Multiplier"     value={`×${fmt(1 - b / 100, 4)}`} />
                  </>
                )}
                {mode === "difference" && (
                  <>
                    <ResultCard label="Value A"    value={fmt(a)} />
                    <ResultCard label="Value B"    value={fmt(b)} />
                    <ResultCard label="Absolute Δ" value={fmt(Math.abs(result.primary))} />
                  </>
                )}
                {mode === "reverse" && (
                  <>
                    <ResultCard label="Final value"    value={fmt(a)} />
                    <ResultCard label="% applied"      value={`${b >= 0 ? "+" : ""}${fmt(b)}%`} />
                    <ResultCard label="Change applied" value={fmt(a - result.primary)} accent={a - result.primary >= 0 ? "emerald" : "rose"} />
                  </>
                )}
              </div>
            )}

            {/* Full breakdown */}
            {isValid && (
              <div className="rounded-2xl border border-white/6 bg-gray-900 p-6 shadow-lg">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Full breakdown</p>
                <div className="flex flex-col gap-3">
                  {mode === "increase" && (<>
                    <ResultRow label="Original value" value={fmt(a)} />
                    <ResultRow label="Amount added"   value={`+${fmt(a * b / 100)}`}    accent="emerald" />
                    <ResultRow label="New value"       value={fmt(result.primary)}        highlight />
                    <ResultRow label="% increase"      value={`${fmt(b)}%`} />
                    <ResultRow label="Multiplier"      value={`×${fmt(1 + b / 100, 4)}`} />
                  </>)}
                  {mode === "decrease" && (<>
                    <ResultRow label="Original value"  value={fmt(a)} />
                    <ResultRow label="Amount removed"  value={`−${fmt(a * b / 100)}`}    accent="rose" />
                    <ResultRow label="New value"        value={fmt(result.primary)}        highlight />
                    <ResultRow label="% decrease"       value={`${fmt(b)}%`} />
                    <ResultRow label="Multiplier"       value={`×${fmt(1 - b / 100, 4)}`} />
                  </>)}
                  {mode === "difference" && (<>
                    <ResultRow label="Value A"           value={fmt(a)} />
                    <ResultRow label="Value B"           value={fmt(b)} />
                    <ResultRow label="Difference (B−A)"  value={fmt(result.primary)} highlight />
                    <ResultRow label="% change"          value={isFinite(result.secondary ?? NaN) ? fmtPct(result.secondary ?? 0) : "—"} accent={isFinite(result.secondary ?? NaN) && (result.secondary ?? 0) >= 0 ? "emerald" : "rose"} />
                    <ResultRow label="Absolute change"   value={fmt(Math.abs(result.primary))} />
                  </>)}
                  {mode === "reverse" && (<>
                    <ResultRow label="Final value"    value={fmt(a)} />
                    <ResultRow label="% applied"      value={`${b >= 0 ? "+" : ""}${fmt(b)}%`} />
                    <ResultRow label="Original value" value={fmt(result.primary)} highlight />
                    <ResultRow label="Change applied" value={fmt(a - result.primary)} accent={a - result.primary >= 0 ? "emerald" : "rose"} />
                  </>)}
                </div>
              </div>
            )}

            {/* Comparison strip */}
            {isValid && (mode === "increase" || mode === "decrease") && (
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
                  What {mode === "increase" ? "adding" : "removing"} other percentages looks like
                </p>
                <div className="flex flex-wrap gap-2">
                  {[5, 10, 15, 20, 25, 30, 50].map((pct) => {
                    const val = mode === "increase" ? a * (1 + pct / 100) : a * (1 - pct / 100);
                    const isActive = pct === b;
                    return (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setBVal(String(pct))}
                        className={`flex flex-col items-center rounded-xl border px-3 py-2 text-center text-xs transition-all duration-150 active:scale-[0.97] hover:-translate-y-px ${
                          isActive
                            ? "border-emerald-300 bg-emerald-50 text-emerald-700 shadow-sm"
                            : "border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300 hover:text-gray-700"
                        }`}
                      >
                        <span className="font-bold">{mode === "decrease" ? "−" : "+"}{pct}%</span>
                        <span className="mt-0.5 tabular-nums text-[10px] opacity-80">
                          {isFinite(val) ? val.toLocaleString("en-US", { maximumFractionDigits: 0 }) : "—"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── CHARTS ──────────────────────────────────────────────── */}
            {!calculating && calculated && isValid && (
              <div className="hidden sm:flex flex-col gap-4">

                {/* Increase / Decrease — Original vs New at different % values */}
                {(mode === "increase" || mode === "decrease") && (
                  <>
                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                        Original vs New — across common percentages
                      </p>
                      <p className="mb-4 text-[11px] text-gray-400">Active percentage <strong className="text-gray-600">{fmt(b)}%</strong> is highlighted — applied to {fmt(a)}</p>
                      <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={sweepData} barCategoryGap="28%" barGap={3}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                          <XAxis dataKey="label" tick={(props) => {
                            const entry = sweepData.find((d) => d.label === props.payload.value);
                            return (
                              <text x={Number(props.x)} y={Number(props.y) + 10} textAnchor="middle" fontSize={11}
                                fontWeight={entry?.isActive ? 700 : 400}
                                fill={entry?.isActive ? (mode === "increase" ? "#10b981" : "#f43f5e") : "#9ca3af"}>
                                {props.payload.value}
                              </text>
                            );
                          }} axisLine={false} tickLine={false} />
                          <YAxis tickFormatter={fmtY} tick={TICK_STYLE} axisLine={false} tickLine={false} width={40} />
                          <Tooltip
                            contentStyle={TOOLTIP_STYLE}
                            formatter={(v: number) => [v.toLocaleString(), ""]}
                          />
                          <ReferenceLine
                            x={`${bRounded}%`}
                            stroke={mode === "increase" ? "#10b981" : "#f43f5e"}
                            strokeDasharray="4 3"
                            strokeWidth={1.5}
                          />
                          <Bar dataKey="original" name="Original" fill="#e5e7eb" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="newVal" name="New value" radius={[4, 4, 0, 0]}>
                            {sweepData.map((entry, i) => (
                              <Cell
                                key={i}
                                fill={entry.isActive
                                  ? (mode === "increase" ? "#10b981" : "#f43f5e")
                                  : "#d1d5db"}
                                opacity={entry.isActive ? 1 : 0.55}
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                        Compound effect — applying {fmt(b)}% repeatedly
                      </p>
                      <p className="mb-4 text-[11px] text-gray-400">Value after 0–10 applications of {fmt(b)}%</p>
                      <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={compoundData}>
                          <defs>
                            <linearGradient id="compoundGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={mode === "increase" ? "#10b981" : "#f43f5e"} stopOpacity={0.25} />
                              <stop offset="95%" stopColor={mode === "increase" ? "#10b981" : "#f43f5e"} stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                          <XAxis dataKey="label" tick={TICK_STYLE} axisLine={false} tickLine={false} />
                          <YAxis tickFormatter={fmtY} tick={TICK_STYLE} axisLine={false} tickLine={false} width={40} />
                          <Tooltip
                            contentStyle={TOOLTIP_STYLE}
                            formatter={(v: number) => [v.toLocaleString(), "Value"]}
                          />
                          <ReferenceLine x="0×" stroke="#d1d5db" strokeDasharray="4 3" label={{ value: "Start", fill: "#9ca3af", fontSize: 10, position: "insideTopLeft" }} />
                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke={mode === "increase" ? "#10b981" : "#f43f5e"}
                            strokeWidth={2}
                            fill="url(#compoundGrad)"
                            dot={false}
                            activeDot={{ r: 4, strokeWidth: 0 }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </>
                )}

                {/* Difference mode — Value A vs B */}
                {mode === "difference" && (
                  <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                      Value A vs Value B
                    </p>
                    <p className="mb-4 text-[11px] text-gray-400">
                      {isFinite(result.secondary ?? NaN)
                        ? `${(result.secondary ?? 0) >= 0 ? "B is" : "B is"} ${Math.abs(result.secondary ?? 0).toFixed(2)}% ${(result.secondary ?? 0) >= 0 ? "higher" : "lower"} than A`
                        : "Comparing values"}
                    </p>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={diffBarData} barCategoryGap="50%">
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                        <XAxis dataKey="label" tick={TICK_STYLE} axisLine={false} tickLine={false} />
                        <YAxis tickFormatter={fmtY} tick={TICK_STYLE} axisLine={false} tickLine={false} width={40} />
                        <Tooltip
                          contentStyle={TOOLTIP_STYLE}
                          formatter={(v: number) => [v.toLocaleString(), "Value"]}
                        />
                        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                          <Cell fill="#3b82f6" />
                          <Cell fill={(result.secondary ?? 0) >= 0 ? "#10b981" : "#f43f5e"} />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Reverse mode — Original / Change / Final */}
                {mode === "reverse" && (
                  <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                      Original · Change · Final
                    </p>
                    <p className="mb-4 text-[11px] text-gray-400">Breakdown of where the final value came from</p>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={reverseBarData} barCategoryGap="40%">
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                        <XAxis dataKey="label" tick={TICK_STYLE} axisLine={false} tickLine={false} />
                        <YAxis tickFormatter={fmtY} tick={TICK_STYLE} axisLine={false} tickLine={false} width={40} />
                        <Tooltip
                          contentStyle={TOOLTIP_STYLE}
                          formatter={(v: number) => [v.toLocaleString(), ""]}
                        />
                        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                          <Cell fill="#8b5cf6" />
                          <Cell fill={b >= 0 ? "#10b981" : "#f43f5e"} />
                          <Cell fill="#a78bfa" />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

              </div>
            )}

            {/* Microcopy */}
            <div className="rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4">
              <p className="text-xs leading-5 text-gray-500">
                Results update live as you change inputs. Switch mode at any time — your values are preserved.
              </p>
            </div>

          </>
        )}
      </div>
    </div>
  );
}

// ─── Result card ──────────────────────────────────────────────────────────────

function ResultCard({ label, value, accent }: { label: string; value: string; accent?: "emerald" | "rose" }) {
  const valColor = accent === "emerald" ? "text-emerald-400" : accent === "rose" ? "text-rose-400" : "text-emerald-400";
  return (
    <div className="rounded-2xl border border-white/6 bg-gray-900 p-4 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">{label}</p>
      <p className={`mt-2 text-base font-bold tracking-[-0.02em] tabular-nums ${valColor}`}>{value}</p>
    </div>
  );
}

// ─── Dark result row ──────────────────────────────────────────────────────────

function ResultRow({ label, value, highlight = false, accent }: {
  label: string;
  value: string;
  highlight?: boolean;
  accent?: "emerald" | "rose" | "violet";
}) {
  const accentColor = accent === "emerald" ? "text-emerald-400" : accent === "rose" ? "text-rose-400" : "text-violet-400";
  return (
    <div className={`flex items-center justify-between ${highlight ? "rounded-xl bg-white/5 px-3 py-2" : ""}`}>
      <span className={`text-xs ${highlight ? "font-semibold text-gray-300" : "text-gray-500"}`}>{label}</span>
      <span className={`tabular-nums text-sm ${highlight ? "font-bold text-white" : accent ? accentColor : "text-gray-300"}`}>
        {value}
      </span>
    </div>
  );
}
