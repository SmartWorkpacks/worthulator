"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine,
} from "recharts";
import {
  calculateInflation,
  HISTORICAL_US_AVG_RATE,
  type InflationResult,
} from "@/lib/calculators/inflationEngine";

// ─── Constants ────────────────────────────────────────────────────────────────

const CURRENT_YEAR = new Date().getFullYear();

const CALC_STEPS = [
  "Reading your inputs…",
  "Calculating purchasing power…",
  "Building your timeline…",
  "Generating insights…",
];

// ─── Calculating Loader ────────────────────────────────────────────────────────

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
          <svg width="36" height="36" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="animate-pulse">
            <path d="M2 3L6 13L8 7L10 13L14 3" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <p className="relative text-lg font-bold text-center text-white mb-1">
        {CALC_STEPS[step] ?? "Calculating…"}
      </p>
      <p className="relative text-xs text-white/40 mb-8">Measuring your purchasing power</p>
      <div className="relative w-full max-w-xs">
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: progress + "%",
              background: "linear-gradient(90deg, #10b981, #2dd4bf)",
            }}
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number, decimals = 0): string {
  if (!isFinite(n)) return "—";
  return n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

function fmtPct(n: number, decimals = 1): string {
  if (!isFinite(n)) return "—";
  return `${n.toFixed(decimals)}%`;
}

function fmtYears(n: number): string {
  if (!isFinite(n) || n > 200) return "never";
  return `${n.toFixed(1)} yrs`;
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

const chartTooltipStyle = {
  borderRadius: "10px",
  border: "1px solid #e5e7eb",
  fontSize: "12px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
};

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  label, value, sub, highlight = false, warn = false,
}: {
  label: string; value: string; sub?: string;
  highlight?: boolean; warn?: boolean;
}) {
  return (
    <div className={`rounded-2xl border p-4 ${
      highlight ? "border-emerald-200 bg-emerald-50"
      : warn     ? "border-orange-200 bg-orange-50"
      : "border-gray-100 bg-gray-50"
    }`}>
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">{label}</p>
      <p className={`mt-1.5 text-xl font-bold tracking-tight ${
        highlight ? "text-emerald-700"
        : warn     ? "text-orange-700"
        : "text-gray-900"
      }`}>{value}</p>
      {sub && <p className="mt-0.5 text-xs text-gray-400">{sub}</p>}
    </div>
  );
}

// ─── Insight engine ────────────────────────────────────────────────────────────

interface Insight { type: "info" | "warn" | "tip"; text: string }

function buildInsights(
  result: InflationResult,
  startYear: number,
  endYear: number,
  inflationRate: number,
  amount: number,
): Insight[] {
  const insights: Insight[] = [];
  const { purchasingPowerPct, yearsToDouble, equivalentNeeded, realValue, annualImpact } = result;

  if (purchasingPowerPct < 30) {
    insights.push({
      type: "warn",
      text: `More than 70% of your purchasing power has been eroded. In real terms, your ${fmt(amount)} is worth less than a third of what it was in ${startYear}.`,
    });
  } else if (purchasingPowerPct < 55) {
    insights.push({
      type: "warn",
      text: `Over half your purchasing power has been lost. What ${fmt(amount)} could buy in ${startYear} now requires ${fmt(equivalentNeeded)} to match.`,
    });
  } else if (purchasingPowerPct < 80) {
    insights.push({
      type: "info",
      text: `About a fifth of your purchasing power has been eroded. This is consistent with moderate inflation over ${result.yearsSpanned} years.`,
    });
  }

  if (isFinite(yearsToDouble)) {
    insights.push({
      type: "info",
      text: `At ${fmtPct(inflationRate)} inflation, prices double every ${yearsToDouble.toFixed(1)} years. That means your purchasing power halves on the same timeline.`,
    });
  }

  if (annualImpact > 0) {
    insights.push({
      type: "tip",
      text: `Inflation is silently costing you an average of ${fmt(annualImpact, 0)} per year in purchasing power on this amount. In an investment returning 7% annually, real returns are only ~${(7 - inflationRate).toFixed(1)}% after inflation.`,
    });
  }

  if (endYear > CURRENT_YEAR) {
    const yearsAhead = endYear - CURRENT_YEAR;
    insights.push({
      type: "tip",
      text: `Looking ${yearsAhead} years ahead: to maintain today's purchasing power, a ${fmt(amount)} retirement pot would need to grow to ${fmt(equivalentNeeded)} just to keep up with ${fmtPct(inflationRate)} inflation.`,
    });
  }

  return insights.slice(0, 4);
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function InflationCalculator() {
  // ── Inputs ────────────────────────────────────────────────────────────────
  const [amountInput,     setAmountInput]     = useState("10000");
  const [startYearInput,  setStartYearInput]  = useState("2000");
  const [endYearInput,    setEndYearInput]    = useState(CURRENT_YEAR.toString());
  const [useHistorical,   setUseHistorical]   = useState(true);
  const [customRateInput, setCustomRateInput] = useState("3.2");
  const [monthlyInput,    setMonthlyInput]    = useState("0");
  const [showAdvanced,    setShowAdvanced]    = useState(false);

  // ── Calc + loader state ───────────────────────────────────────────────────
  const [calculated,   setCalculated]   = useState(false);
  const [calculating,  setCalculating]  = useState(false);
  const [calcStep,     setCalcStep]     = useState(0);
  const [calcProgress, setCalcProgress] = useState(0);

  // ── Animated display state ────────────────────────────────────────────────
  const [displayValue,  setDisplayValue]  = useState(0);
  const [flash,         setFlash]         = useState(false);
  const [showChange,    setShowChange]    = useState(false);
  const [changeAmount,  setChangeAmount]  = useState(0);

  const animRef       = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevCalcRef   = useRef(false);
  const prevValRef    = useRef(0);
  const changeFadeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Derived values ────────────────────────────────────────────────────────
  const amount       = Math.max(0, parseFloat(amountInput)     || 0);
  const startYear    = clamp(parseInt(startYearInput) || 2000, 1900, CURRENT_YEAR + 50);
  const endYear      = clamp(parseInt(endYearInput)   || CURRENT_YEAR, startYear + 1, 2100);
  const inflationRate = useHistorical
    ? HISTORICAL_US_AVG_RATE
    : clamp(parseFloat(customRateInput) || 3.2, 0, 25);
  const monthlyContrib = Math.max(0, parseFloat(monthlyInput) || 0);

  const result = useMemo(
    () => calculateInflation({ amount, startYear, endYear, inflationRate, monthlyContribution: monthlyContrib }),
    [amount, startYear, endYear, inflationRate, monthlyContrib],
  );

  const insights = useMemo(
    () => buildInsights(result, startYear, endYear, inflationRate, amount),
    [result, startYear, endYear, inflationRate, amount],
  );

  const displayPct = amount > 0 ? (displayValue / amount) * 100 : 0;

  // ── Colour scale ──────────────────────────────────────────────────────────
  const powerColor = displayPct >= 70
    ? "text-emerald-400"
    : displayPct >= 45
    ? "text-amber-400"
    : "text-red-400";

  const powerGlow = displayPct >= 70
    ? "text-emerald-300 [text-shadow:0_0_40px_rgba(52,211,153,0.55)]"
    : displayPct >= 45
    ? "text-amber-300 [text-shadow:0_0_40px_rgba(251,191,36,0.5)]"
    : "text-red-300 [text-shadow:0_0_40px_rgba(248,113,113,0.5)]";

  // ── Flash effect ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!calculated) return;
    setFlash(true);
    const t = setTimeout(() => setFlash(false), 450);
    return () => clearTimeout(t);
  }, [result.realValue, calculated]);

  // ── Delta pill ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!calculated) return;
    const prev = prevValRef.current;
    const diff = result.realValue - prev;
    if (prev !== 0 && Math.abs(diff) > 0.5) {
      setChangeAmount(diff);
      setShowChange(true);
      if (changeFadeRef.current) clearTimeout(changeFadeRef.current);
      changeFadeRef.current = setTimeout(() => setShowChange(false), 1800);
    }
    prevValRef.current = result.realValue;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result.realValue]);

  // ── Count-up after changes ────────────────────────────────────────────────
  useEffect(() => {
    if (!calculated || !prevCalcRef.current) return;
    if (animRef.current) clearTimeout(animRef.current);
    const target = result.realValue;
    const start  = displayValue;
    const diff   = target - start;
    if (Math.abs(diff) < 0.5) return;
    const steps = 20;
    let step = 0;
    const tick = () => {
      step++;
      const ease = 1 - Math.pow(1 - step / steps, 3);
      setDisplayValue(start + diff * ease);
      if (step < steps) animRef.current = setTimeout(tick, 12);
      else setDisplayValue(target);
    };
    animRef.current = setTimeout(tick, 12);
    return () => { if (animRef.current) clearTimeout(animRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result.realValue, calculated]);

  // ── First reveal count-up ─────────────────────────────────────────────────
  useEffect(() => {
    if (!calculated || prevCalcRef.current) return;
    prevCalcRef.current = true;
    const target = result.realValue;
    const start  = target * 0.3;
    const diff   = target - start;
    const steps  = 32;
    const c1 = 0.4;
    const c3 = c1 + 1;
    const easeOutBack = (t: number) => 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    let step = 0;
    const tick = () => {
      step++;
      const e = easeOutBack(step / steps);
      setDisplayValue(start + diff * e);
      if (step < steps) animRef.current = setTimeout(tick, 14);
      else setDisplayValue(target);
    };
    animRef.current = setTimeout(tick, 14);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calculated]);

  // ── Trigger calculate ─────────────────────────────────────────────────────
  function handleCalculate() {
    setCalculating(true);
    setCalcStep(0);
    setCalcProgress(0);
    const steps = CALC_STEPS.length;
    for (let i = 0; i < steps; i++) {
      setTimeout(() => {
        setCalcStep(i);
        setCalcProgress(Math.round(((i + 1) / steps) * 100));
      }, i * 350);
    }
    setTimeout(() => {
      setCalculating(false);
      setCalculated(true);
    }, steps * 350);
  }

  const yearLabel = endYear <= CURRENT_YEAR ? "today" : `in ${endYear}`;
  const futureMode = endYear > CURRENT_YEAR;

  // ── Pie data for power bar ─────────────────────────────────────────────────
  const barRemaining = Math.max(0, Math.min(100, displayPct));
  const barLost      = Math.max(0, 100 - barRemaining);

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="grid gap-8 lg:grid-cols-[2fr_3fr] lg:gap-10">

      {/* ── LEFT: INPUTS ───────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-5 lg:sticky lg:top-6 lg:self-start">

        {/* Amount */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Starting Amount</p>
          <div className="relative flex items-center">
            <span className="pointer-events-none absolute left-3 text-sm font-bold text-gray-400 select-none">$</span>
            <input
              type="number"
              min={0}
              step={100}
              value={amountInput}
              onChange={(e) => setAmountInput(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-7 pr-3 text-sm font-semibold text-gray-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              placeholder="10000"
            />
          </div>
          {/* Quick amount chips */}
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {["1,000", "5,000", "10,000", "50,000", "100,000"].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setAmountInput(v.replace(",", ""))}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition-all ${
                  amountInput === v.replace(",", "")
                    ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                    : "border-gray-200 bg-white text-gray-500 hover:border-emerald-200 hover:text-emerald-600"
                }`}
              >
                ${v}
              </button>
            ))}
          </div>
        </div>

        {/* Year range */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Time Range</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">From year</label>
              <input
                type="number"
                min={1900}
                max={CURRENT_YEAR + 50}
                value={startYearInput}
                onChange={(e) => setStartYearInput(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm font-semibold text-gray-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">To year</label>
              <input
                type="number"
                min={1901}
                max={2100}
                value={endYearInput}
                onChange={(e) => setEndYearInput(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm font-semibold text-gray-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>
          {/* Year presets */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: "2000 → Now",  s: 2000, e: CURRENT_YEAR },
              { label: "1990 → Now",  s: 1990, e: CURRENT_YEAR },
              { label: "2010 → Now",  s: 2010, e: CURRENT_YEAR },
              { label: "Next 20 yrs", s: CURRENT_YEAR, e: CURRENT_YEAR + 20 },
            ].map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => { setStartYearInput(p.s.toString()); setEndYearInput(p.e.toString()); }}
                className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-500 transition-all hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Inflation rate */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Inflation Rate</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Historical US (3.2%)", val: true },
              { label: "Custom Rate",          val: false },
            ].map((opt) => (
              <button
                key={String(opt.val)}
                type="button"
                onClick={() => setUseHistorical(opt.val)}
                className={`rounded-xl border py-2.5 px-3 text-xs font-semibold transition-colors text-center ${
                  useHistorical === opt.val
                    ? "border-emerald-400 bg-emerald-500 text-white"
                    : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {!useHistorical && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-gray-600">Annual rate</label>
                <span className="text-sm font-bold text-emerald-600">{customRateInput}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={20}
                step={0.1}
                value={customRateInput}
                onChange={(e) => setCustomRateInput(e.target.value)}
                className="w-full accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>0% (deflation)</span>
                <span>10%</span>
                <span>20% (hyperinflation)</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {[
                  { label: "Fed target 2%", v: "2" },
                  { label: "US avg 3.2%",   v: "3.2" },
                  { label: "High 5%",       v: "5" },
                  { label: "Euro avg 2.5%", v: "2.5" },
                ].map((p) => (
                  <button
                    key={p.v}
                    type="button"
                    onClick={() => setCustomRateInput(p.v)}
                    className={`rounded-full border px-3 py-1 text-xs font-semibold transition-all ${
                      customRateInput === p.v
                        ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                        : "border-gray-200 bg-white text-gray-500 hover:border-emerald-200"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="rounded-xl bg-gray-50 px-4 py-3">
            <p className="text-xs font-semibold text-gray-500">
              Using <span className="text-gray-900">{fmtPct(inflationRate)}</span> annual rate
              over <span className="text-gray-900">{endYear - startYear} years</span>
            </p>
          </div>
        </div>

        {/* Advanced toggle */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex w-full items-center justify-between px-5 py-4 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <span>Monthly savings contribution</span>
            <span className={`text-xs font-bold transition-transform duration-200 ${showAdvanced ? "rotate-180" : ""}`}>▼</span>
          </button>
          {showAdvanced && (
            <div className="px-5 pb-5 space-y-3 border-t border-gray-100">
              <p className="text-xs text-gray-400 pt-3 leading-5">
                See how much purchasing power your monthly savings accumulate — and what they erode to.
              </p>
              <div className="relative flex items-center">
                <span className="pointer-events-none absolute left-3 text-sm font-bold text-gray-400 select-none">$</span>
                <input
                  type="number"
                  min={0}
                  step={10}
                  value={monthlyInput}
                  onChange={(e) => setMonthlyInput(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-7 pr-3 text-sm font-semibold text-gray-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  placeholder="500"
                />
                <span className="absolute right-3 text-xs text-gray-400 pointer-events-none">/mo</span>
              </div>
            </div>
          )}
        </div>

        {!calculated && (
          <button
            type="button"
            onClick={handleCalculate}
            disabled={calculating || !amount || startYear >= endYear}
            className="w-full rounded-2xl bg-gray-950 py-4 text-sm font-bold text-white tracking-wide shadow-lg transition-all duration-200 hover:bg-gray-800 hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {calculating ? "Calculating…" : "Calculate purchasing power →"}
          </button>
        )}
      </div>

      {/* ── RIGHT: OUTPUTS ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4">

        {calculating && <CalculatingLoader progress={calcProgress} step={calcStep} />}

        {!calculated && !calculating && (
          <div className="relative flex flex-col items-center justify-center py-24 px-6 rounded-2xl overflow-hidden bg-gray-950 text-center shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
            <div
              className="pointer-events-none absolute inset-0 opacity-20"
              style={{ background: "radial-gradient(ellipse at 50% 80%, #10b981 0%, transparent 55%)" }}
            />
            <div className="relative w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
              <svg width="28" height="28" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 3L6 13L8 7L10 13L14 3" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="relative text-sm font-semibold text-white/70">Enter an amount and year range, then hit Calculate</p>
            <p className="relative mt-1 text-xs text-white/30">Your full purchasing power analysis will appear here</p>
          </div>
        )}

        <AnimatePresence>
          {!calculating && calculated && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex flex-col gap-4"
            >

              {/* Hero result card */}
              <div className={`relative overflow-hidden rounded-2xl border bg-gray-950 p-6 sm:p-8 transition-all duration-500 ${
                flash
                  ? "border-emerald-500/20 shadow-[0_24px_100px_rgba(0,0,0,0.55),0_0_40px_rgba(52,211,153,0.12)]"
                  : "border-white/8 shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
              }`}>
                <div className={`pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full blur-3xl transition-all duration-500 ${
                  flash ? "bg-emerald-500/25 scale-110" : "bg-emerald-500/15 scale-100"
                }`} />
                <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-emerald-900/35 blur-3xl" />

                <p className="relative text-xs font-semibold uppercase tracking-[0.28em] text-gray-400">
                  Purchasing Power Remaining
                </p>

                <p className={`relative mt-3 text-[clamp(3.5rem,8vw,5.5rem)] font-bold leading-none tracking-[-0.04em] transition-all duration-500 ${
                  flash ? powerGlow : powerColor
                }`}>
                  {fmt(displayValue, 0)}
                </p>

                {/* Delta pill */}
                <div className={`relative mt-1 h-6 overflow-hidden transition-all duration-700 ${showChange ? "opacity-100" : "opacity-0"}`}>
                  {changeAmount !== 0 && (
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      changeAmount > 0 ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"
                    }`}>
                      {changeAmount > 0 ? "▲" : "▼"} {fmt(Math.abs(changeAmount), 0)}
                    </span>
                  )}
                </div>

                <p className="relative mt-2 text-sm text-gray-400">
                  {futureMode
                    ? `what ${fmt(amount)} today would be worth in ${endYear}`
                    : `of your ${fmt(amount)} from ${startYear} in today's money`}
                </p>

                {/* Power bar */}
                <div className="relative mt-5">
                  <div className="flex h-3 w-full overflow-hidden rounded-full bg-white/8">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${barRemaining}%`,
                        background: displayPct >= 70
                          ? "linear-gradient(90deg, #34d399, #22d3ee)"
                          : displayPct >= 45
                          ? "linear-gradient(90deg, #fbbf24, #f59e0b)"
                          : "linear-gradient(90deg, #f97316, #ef4444)",
                      }}
                    />
                    <div className="h-full flex-1 bg-white/5" />
                  </div>
                  <div className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1 text-xs text-gray-400">
                    <span className="flex items-center gap-1.5">
                      <span className={`h-2 w-2 rounded-full ${displayPct >= 70 ? "bg-emerald-400" : displayPct >= 45 ? "bg-amber-400" : "bg-red-400"}`} />
                      Remaining ({fmtPct(barRemaining, 0)})
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-gray-600" />
                      Lost ({fmtPct(barLost, 0)})
                    </span>
                  </div>
                </div>

                {/* Sub stats row */}
                <div className="relative mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/8 pt-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">To match original</p>
                    <p className="mt-0.5 text-sm font-bold text-white">{fmt(result.equivalentNeeded)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Power lost</p>
                    <p className="mt-0.5 text-sm font-bold text-red-400">{fmt(result.purchasingPowerLoss)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Total inflation</p>
                    <p className="mt-0.5 text-sm font-bold text-white">{fmtPct(result.totalInflationPct, 0)}</p>
                  </div>
                </div>
              </div>

              {/* Stat grid */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <StatCard
                  label="Real Value"
                  value={fmt(result.realValue)}
                  sub="in start-year dollars"
                  highlight
                />
                <StatCard
                  label="Power Lost"
                  value={fmt(result.purchasingPowerLoss)}
                  sub="eroded"
                  warn
                />
                <StatCard
                  label="Equivalent Today"
                  value={fmt(result.equivalentNeeded)}
                  sub="needed to match"
                />
                <StatCard
                  label="Total Inflation"
                  value={fmtPct(result.totalInflationPct, 0)}
                  sub={`over ${result.yearsSpanned} years`}
                />
                <StatCard
                  label="Power Halves Every"
                  value={fmtYears(result.yearsToHalvePower)}
                  sub={`at ${fmtPct(inflationRate)} inflation`}
                />
                <StatCard
                  label="Avg Annual Loss"
                  value={fmt(result.annualImpact, 0)}
                  sub="per year"
                />
              </div>

              {/* Monthly contributions (if entered) */}
              {monthlyContrib > 0 && (
                <div className="rounded-2xl border border-purple-100 bg-purple-50 p-5">
                  <p className="text-sm font-bold text-purple-900">With ${monthlyContrib}/month contributions</p>
                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    <div>
                      <p className="text-xs font-semibold text-purple-500">Total contributed</p>
                      <p className="mt-0.5 text-lg font-bold text-purple-900">{fmt(result.totalContributed)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-purple-500">Total nominal</p>
                      <p className="mt-0.5 text-lg font-bold text-purple-900">{fmt(result.totalNominal)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-purple-500">Real purchasing power</p>
                      <p className="mt-0.5 text-lg font-bold text-purple-900">{fmt(result.totalRealWithContributions)}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Purchasing power decay chart */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                  Purchasing power over time
                </p>
                <p className="mb-5 text-xs text-gray-400">
                  Real value of {fmt(amount)} as inflation erodes it from {startYear} to {endYear}
                </p>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={result.yearlyData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                    <defs>
                      <linearGradient id="pwrGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#22d3ee" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis
                      dataKey="year"
                      tick={{ fontSize: 10, fill: "#9ca3af" }}
                      tickCount={6}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      tick={{ fontSize: 10, fill: "#9ca3af" }}
                      tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                      width={40}
                    />
                    <Tooltip
                      formatter={(v, name) => [fmt(Number(v), 0), name === "real" ? "Real value" : "Nominal"]}
                      labelFormatter={(v) => `Year ${v}`}
                      contentStyle={chartTooltipStyle}
                    />
                    <ReferenceLine
                      x={endYear <= CURRENT_YEAR ? CURRENT_YEAR : endYear}
                      stroke="#22d3ee"
                      strokeDasharray="4 2"
                      strokeWidth={1.5}
                    />
                    <Area
                      type="monotone"
                      dataKey="nominal"
                      stroke="#e5e7eb"
                      strokeWidth={1.5}
                      fill="transparent"
                      dot={false}
                      strokeDasharray="4 2"
                      name="Nominal"
                    />
                    <Area
                      type="monotone"
                      dataKey="real"
                      stroke="#22d3ee"
                      strokeWidth={2}
                      fill="url(#pwrGrad)"
                      dot={false}
                      name="Real value"
                    />
                  </AreaChart>
                </ResponsiveContainer>
                <p className="mt-2 text-[10px] text-gray-400">
                  Dashed line = nominal amount. Solid cyan = real purchasing power.
                </p>
              </div>

              {/* Scenario comparison */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                  Inflation rate comparison
                </p>
                <p className="mb-5 text-xs text-gray-400">
                  Remaining purchasing power of {fmt(amount)} over {result.yearsSpanned} years at different inflation rates
                </p>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart
                    data={result.scenarios}
                    layout="vertical"
                    margin={{ top: 0, right: 32, bottom: 0, left: 88 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 10, fill: "#9ca3af" }}
                      tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                      domain={[0, amount]}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fontSize: 10, fill: "#4b5563" }}
                      width={85}
                    />
                    <Tooltip
                      formatter={(v) => [fmt(Number(v)), "Remaining"]}
                      contentStyle={chartTooltipStyle}
                    />
                    <Bar dataKey="realValue" radius={[0, 4, 4, 0]}>
                      {result.scenarios.map((s) => (
                        <Cell key={s.name} fill={s.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Real world comparisons */}
              {result.realWorldComparisons.length > 0 && (
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                    Real world price changes
                  </p>
                  <p className="mb-5 text-xs text-gray-400">
                    Historical US prices from {startYear} to {endYear} — what things actually cost
                  </p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {result.realWorldComparisons.map((comp) => (
                      <div
                        key={comp.item.name}
                        className="rounded-xl border border-gray-100 bg-gray-50 p-4"
                      >
                        <span className="text-2xl">{comp.item.emoji}</span>
                        <p className="mt-2 text-xs font-bold text-gray-800">{comp.item.name}</p>
                        <p className="text-[10px] text-gray-400">{comp.item.unit}</p>
                        <div className="mt-3 flex items-end justify-between">
                          <div>
                            <p className="text-[10px] font-semibold text-gray-400">{startYear}</p>
                            <p className="text-sm font-bold text-gray-700">
                              {comp.priceAtStart < 10
                                ? `$${comp.priceAtStart.toFixed(2)}`
                                : fmt(comp.priceAtStart, 0)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-[10px] font-semibold text-gray-400">{endYear}</p>
                            <p className="text-sm font-bold text-gray-700">
                              {comp.priceAtEnd < 10
                                ? `$${comp.priceAtEnd.toFixed(2)}`
                                : fmt(comp.priceAtEnd, 0)}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2">
                          <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-700">
                            +{comp.changePct.toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-[10px] text-gray-400">
                    Prices estimated from historical averages. Actual prices may vary by location.
                  </p>
                </div>
              )}

              {/* Planning scenarios */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                  Planning implications
                </p>
                <p className="mb-5 text-xs text-gray-400">
                  What {fmtPct(inflationRate)} inflation means for key financial scenarios
                </p>
                <div className="space-y-3">
                  {[
                    {
                      icon: "🏦",
                      title: "Retirement savings",
                      body: `A $500,000 retirement pot needs to grow to ${fmt(500000 * Math.pow(1 + inflationRate / 100, result.yearsSpanned))} over ${result.yearsSpanned} years just to maintain today's purchasing power.`,
                    },
                    {
                      icon: "💼",
                      title: "Salary erosion",
                      body: `A $75,000 salary in ${startYear} requires ${fmt(75000 * Math.pow(1 + inflationRate / 100, result.yearsSpanned))} in ${endYear} to maintain the same standard of living.`,
                    },
                    {
                      icon: "📈",
                      title: "Investment hurdle",
                      body: `At ${fmtPct(inflationRate)} inflation, an investment must return more than ${fmtPct(inflationRate)} annually just to break even in real terms. The S&P 500 averages ~10% nominal — only ~${(10 - inflationRate).toFixed(1)}% real.`,
                    },
                    {
                      icon: "🏠",
                      title: "Housing affordability",
                      body: `Average rent growing at ~5.8%/yr doubles roughly every ${yearsToDoubleAtRate(5.8).toFixed(0)} years — significantly faster than general inflation or wage growth for most workers.`,
                    },
                  ].map((card, i) => (
                    <motion.div
                      key={card.title}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06, duration: 0.3 }}
                      className="flex gap-4 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3.5"
                    >
                      <span className="text-xl shrink-0 mt-0.5">{card.icon}</span>
                      <div>
                        <p className="text-xs font-bold text-gray-800">{card.title}</p>
                        <p className="mt-0.5 text-xs leading-5 text-gray-500">{card.body}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Dynamic insights */}
              {insights.length > 0 && (
                <div className="space-y-2">
                  {insights.map((insight, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07, duration: 0.3 }}
                      className={`rounded-xl p-4 text-sm leading-relaxed ${
                        insight.type === "warn"
                          ? "border border-amber-200 bg-amber-50 text-amber-800"
                          : insight.type === "tip"
                          ? "border border-blue-100 bg-blue-50 text-blue-800"
                          : "border border-emerald-100 bg-emerald-50 text-emerald-800"
                      }`}
                    >
                      {insight.text}
                    </motion.div>
                  ))}
                </div>
              )}

              {/* CTA */}
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5">
                <p className="text-sm font-bold text-emerald-900">Want to beat inflation?</p>
                <p className="mt-1 text-xs text-emerald-700 leading-relaxed">
                  See how compound interest and passive income can outpace inflation and grow your real wealth over time.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a
                    href="/tools/compound-interest-calculator"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-emerald-700 transition-colors"
                  >
                    Compound Interest Calculator →
                  </a>
                  <a
                    href="/tools/passive-income-calculator"
                    className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 transition-colors"
                  >
                    Passive Income Calculator
                  </a>
                </div>
              </div>

              <p className="text-xs leading-relaxed text-gray-400">
                Purchasing power calculations use compound inflation. Real-world price comparisons use historical US averages and are estimates only. Not financial advice.
              </p>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Re-export helper for use in planning cards
function yearsToDoubleAtRate(rate: number): number {
  return rate > 0 ? Math.log(2) / Math.log(1 + rate / 100) : Infinity;
}
