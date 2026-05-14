"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { CalcDisclaimer } from "@/src/templates/take-home-pay";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine, Cell,
} from "recharts";
import { Slider } from "@/components/ui/slider";
import {
  calculateInvestment,
  fmtCurrency,
  fmtPct,
  WHAT_IF_SCENARIOS,
  type InvestmentInputs,
  type InvestmentResult,
  type CompoundFrequency,
} from "@/lib/calculators/investmentEngine";

// ─── Shared chart style ───────────────────────────────────────────────────────

const TICK = { fill: "#9ca3af", fontSize: 11 };
const TT_STYLE = {
  backgroundColor: "#111827",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 10,
  fontSize: 12,
  color: "#f9fafb",
};

function cptFmtY(v: number) {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}k`;
  return `$${v}`;
}

// ─── Loader ───────────────────────────────────────────────────────────────────

const CALC_STEPS = [
  "Reading your inputs…",
  "Projecting compound growth…",
  "Adjusting for inflation…",
  "Building your wealth dashboard…",
];

function CalculatingLoader({ progress, step }: { progress: number; step: number }) {
  return (
    <div className="relative flex flex-col items-center justify-center py-20 px-6 bg-gray-950 rounded-2xl text-white overflow-hidden">
      <div className="absolute inset-0 opacity-25 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 80%, #10b981 0%, transparent 60%)" }} />
      <div className="relative mb-7">
        <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-emerald-400 animate-spin"
          style={{ animationDuration: "0.85s" }} />
        <div className="w-20 h-20 rounded-full border-2 border-white/10 flex items-center justify-center bg-white/5">
          <svg width="36" height="36" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2 3L6 13L8 7L10 13L14 3" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <p className="relative text-lg font-bold text-center text-white mb-1">{CALC_STEPS[step] ?? "Calculating…"}</p>
      <p className="relative text-xs text-white/40 mb-8">Projecting your future wealth</p>
      <div className="relative w-full max-w-xs">
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: progress + "%", background: "linear-gradient(90deg, #10b981, #2dd4bf)" }} />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[10px] text-white/30">{Math.round(progress)}% complete</span>
          <span className="text-[10px] text-white/30">Step {step + 1} / {CALC_STEPS.length}</span>
        </div>
      </div>
      <div className="flex gap-2 mt-6">
        {CALC_STEPS.map((_, i) => (
          <div key={i} style={{
            height: 6, borderRadius: 3,
            width: i < step ? 20 : i === step ? 32 : 12,
            backgroundColor: i <= step ? "#34d399" : "rgba(255,255,255,0.15)",
            transition: "all 0.3s",
          }} />
        ))}
      </div>
    </div>
  );
}

// ─── Animated number hook ─────────────────────────────────────────────────────

function useCountUp(target: number, active: boolean, duration = 900): number {
  const [display, setDisplay] = useState(target * 0.72);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const startValRef = useRef(target * 0.72);
  const liveRef = useRef(target * 0.72);

  useEffect(() => {
    if (!active) { setDisplay(0); liveRef.current = 0; return; }
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    startValRef.current = liveRef.current;
    startRef.current = null;

    const c1 = 0.4; const c3 = c1 + 1;
    const ease = (t: number) => 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);

    const tick = (now: number) => {
      if (!startRef.current) startRef.current = now;
      const elapsed = now - startRef.current;
      const t = Math.min(elapsed / duration, 1);
      liveRef.current = startValRef.current + (target - startValRef.current) * ease(t);
      setDisplay(liveRef.current);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else { liveRef.current = target; setDisplay(target); }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, active]);

  return display;
}

// ─── Result card ──────────────────────────────────────────────────────────────

interface ResultCardProps {
  label: string;
  value: string;
  sub?: string;
  accent?: "emerald" | "cyan" | "amber" | "rose" | "violet";
  large?: boolean;
}

function ResultCard({ label, value, sub, accent = "emerald", large = false }: ResultCardProps) {
  const accents: Record<string, string> = {
    emerald: "text-emerald-400",
    cyan:    "text-cyan-400",
    amber:   "text-amber-400",
    rose:    "text-rose-400",
    violet:  "text-violet-400",
  };
  return (
    <div className={`rounded-2xl border border-white/6 bg-gray-900 p-5 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl ${large ? "col-span-2 sm:col-span-1" : ""}`}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-500">{label}</p>
      <p className={`mt-2 font-bold tabular-nums tracking-tight ${large ? "text-3xl" : "text-xl"} ${accents[accent]}`}>{value}</p>
      {sub && <p className="mt-1 text-[11px] text-gray-500">{sub}</p>}
    </div>
  );
}

// ─── Slider row ───────────────────────────────────────────────────────────────

function SliderRow({
  label, value, min, max, step, onChange, format, id,
}: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; format: (v: number) => string; id: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">{label}</label>
        <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-800">{format(value)}</span>
      </div>
      <Slider
        id={id}
        min={min} max={max} step={step}
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        className="[&>span:first-child]:bg-gray-200 [&>span:first-child>span]:bg-emerald-500 [&>span:last-child]:border-emerald-500 [&>span:last-child]:bg-white"
      />
      <div className="flex justify-between text-[10px] text-gray-400">
        <span>{format(min)}</span><span>{format(max)}</span>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const DEFAULT_INPUTS: InvestmentInputs = {
  initialAmount: 5000,
  monthlyContribution: 200,
  annualContribution: 0,
  annualReturnRate: 7,
  years: 20,
  inflationRate: 2.5,
  compoundFrequency: "monthly",
};

export default function InvestmentCalculator() {
  const [inputs, setInputs] = useState<InvestmentInputs>(DEFAULT_INPUTS);
  const [calculating, setCalculating]   = useState(false);
  const [calculated,  setCalculated]    = useState(false);
  const [calcStep,    setCalcStep]       = useState(0);
  const [calcProgress,setCalcProgress]  = useState(0);
  const [result, setResult]             = useState<InvestmentResult | null>(null);
  const [activeWhatIf, setActiveWhatIf] = useState<number | null>(null);
  const prevCalcRef = useRef(false);

  const set = useCallback(<K extends keyof InvestmentInputs>(key: K, val: InvestmentInputs[K]) => {
    setInputs((prev) => ({ ...prev, [key]: val }));
  }, []);

  // Live update after first calc
  useEffect(() => {
    if (!calculated) return;
    setResult(calculateInvestment(inputs));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs, calculated]);

  function handleCalculate(override?: InvestmentInputs) {
    const inp = override ?? inputs;
    setCalculating(true);
    setCalcStep(0);
    setCalcProgress(0);
    const stepDuration = 350;
    const steps = CALC_STEPS.length;
    for (let i = 0; i < steps; i++) {
      setTimeout(() => {
        setCalcStep(i);
        setCalcProgress(Math.round(((i + 1) / steps) * 100));
      }, i * stepDuration);
    }
    setTimeout(() => {
      setResult(calculateInvestment(inp));
      setCalculating(false);
      setCalculated(true);
      prevCalcRef.current = true;
    }, steps * stepDuration);
  }

  function applyWhatIf(idx: number) {
    const scenario = WHAT_IF_SCENARIOS[idx];
    const newInputs = scenario.mutate(inputs);
    setActiveWhatIf(idx);
    if (calculated) {
      setResult(calculateInvestment(newInputs));
    } else {
      handleCalculate(newInputs);
    }
  }

  function resetWhatIf() {
    setActiveWhatIf(null);
    if (calculated) setResult(calculateInvestment(inputs));
  }

  // Animated final value
  const animFuture = useCountUp(result?.futureValue ?? 0, calculated && !calculating);

  const snap = result?.yearlySnapshots ?? [];
  const chartData = snap.map((s) => ({
    year:          `Yr ${s.year}`,
    portfolio:     s.portfolioValue,
    contributions: s.totalContributions,
    interest:      s.totalInterest,
    inflation:     s.inflationAdjustedValue,
  }));

  // Contribution vs growth pie-style bar for current year
  const contrib = result?.totalContributions ?? 0;
  const interest = result?.totalInterest ?? 0;
  const total = contrib + interest;
  const contribPct = total > 0 ? (contrib / total) * 100 : 50;
  const interestPct = 100 - contribPct;

  return (
    <div className="grid gap-8 lg:grid-cols-[2fr_3fr] lg:gap-10">

      {/* ── INPUTS ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-5 lg:sticky lg:top-6 lg:self-start">

        {/* Main inputs card */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.22em] text-gray-400">Your investment</p>

          <div className="flex flex-col gap-6">
            <SliderRow
              id="initial" label="Starting amount"
              value={inputs.initialAmount} min={0} max={100000} step={500}
              onChange={(v) => set("initialAmount", v)}
              format={(v) => fmtCurrency(v)}
            />
            <SliderRow
              id="monthly" label="Monthly contribution"
              value={inputs.monthlyContribution} min={0} max={5000} step={50}
              onChange={(v) => set("monthlyContribution", v)}
              format={(v) => fmtCurrency(v)}
            />
            <SliderRow
              id="return" label="Annual return rate"
              value={inputs.annualReturnRate} min={1} max={20} step={0.5}
              onChange={(v) => set("annualReturnRate", v)}
              format={(v) => `${v}%`}
            />
            <SliderRow
              id="years" label="Investment period"
              value={inputs.years} min={1} max={50} step={1}
              onChange={(v) => set("years", v)}
              format={(v) => `${v} yr${v !== 1 ? "s" : ""}`}
            />
          </div>
        </div>

        {/* Advanced options */}
        <details className="group rounded-2xl border border-gray-200 bg-white shadow-sm">
          <summary className="flex cursor-pointer items-center justify-between px-6 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-gray-400 select-none">
            Advanced options
            <span className="text-gray-300 transition-transform group-open:rotate-180">▾</span>
          </summary>
          <div className="flex flex-col gap-5 px-6 pb-6">
            <SliderRow
              id="inflation" label="Inflation rate"
              value={inputs.inflationRate} min={0} max={10} step={0.1}
              onChange={(v) => set("inflationRate", v)}
              format={(v) => `${v}%`}
            />
            <SliderRow
              id="annual-contrib" label="Annual bonus contribution"
              value={inputs.annualContribution} min={0} max={50000} step={500}
              onChange={(v) => set("annualContribution", v)}
              format={(v) => fmtCurrency(v)}
            />
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">Compound frequency</p>
              <div className="grid grid-cols-3 gap-2">
                {(["monthly", "quarterly", "annually"] as CompoundFrequency[]).map((f) => (
                  <button key={f} type="button"
                    onClick={() => set("compoundFrequency", f)}
                    className={`rounded-xl py-2 text-xs font-semibold capitalize transition-colors ${inputs.compoundFrequency === f ? "bg-gray-950 text-white" : "border border-gray-200 bg-white text-gray-500 hover:bg-gray-50"}`}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </details>

        {/* Calculate button */}
        {!calculated && (
          <button type="button" onClick={() => handleCalculate()}
            disabled={calculating}
            className="w-full rounded-2xl bg-gray-950 py-4 text-sm font-bold text-white tracking-wide shadow-lg transition-all duration-200 hover:bg-gray-800 hover:shadow-xl active:scale-[0.98] disabled:opacity-50">
            {calculating ? "Calculating…" : "Project My Wealth →"}
          </button>
        )}

        {/* What-if scenarios (visible after calc) */}
        {calculated && (
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-400">What if…</p>
              {activeWhatIf !== null && (
                <button onClick={resetWhatIf} className="text-[11px] text-emerald-600 hover:text-emerald-700 font-medium">Reset</button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {WHAT_IF_SCENARIOS.map((s, i) => (
                <button key={i} type="button" onClick={() => applyWhatIf(i)}
                  title={s.description}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-150 hover:shadow-sm active:scale-[0.97] ${
                    activeWhatIf === i
                      ? "border-emerald-300 bg-emerald-50 text-emerald-700 shadow-sm"
                      : "border-gray-200 bg-white text-gray-600 hover:border-emerald-200 hover:text-emerald-700"
                  }`}>
                  <span>{s.emoji}</span>{s.label}
                </button>
              ))}
            </div>
            {activeWhatIf !== null && (
              <p className="mt-3 text-[11px] text-gray-400 italic">{WHAT_IF_SCENARIOS[activeWhatIf].description}</p>
            )}
          </div>
        )}
      </div>

      {/* ── RESULTS ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-5">

        {/* Loader */}
        {calculating && <CalculatingLoader progress={calcProgress} step={calcStep} />}

        {/* Placeholder */}
        {!calculating && !calculated && (
          <div className="relative flex flex-col items-center justify-center py-24 px-6 rounded-2xl overflow-hidden bg-gray-950 text-center shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
            <div className="pointer-events-none absolute inset-0 opacity-20"
              style={{ background: "radial-gradient(ellipse at 50% 80%, #10b981 0%, transparent 60%)" }} />
            <div className="relative w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 3L6 13L8 7L10 13L14 3" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="relative text-sm font-semibold text-white/70">Set your numbers and project your future wealth</p>
            <p className="relative mt-1 text-xs text-white/30">Your wealth dashboard will appear here</p>
          </div>
        )}

        {/* Results dashboard */}
        {!calculating && calculated && result && (
          <>
            {/* ── HERO CARD ──────────────────────────────────────────────── */}
            <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gray-950 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
              <div className="pointer-events-none absolute -right-16 -top-16 h-80 w-80 rounded-full blur-3xl opacity-25"
                style={{ background: "radial-gradient(ellipse, #10b981, transparent 70%)" }} />
              <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-cyan-900/20 blur-3xl" />

              <p className="relative text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">
                Future portfolio value · {inputs.years} years
              </p>
              <p className="relative mt-3 text-[clamp(3rem,8vw,5rem)] font-bold leading-none tracking-[-0.04em] text-emerald-400">
                {fmtCurrency(Math.round(animFuture))}
              </p>
              <p className="relative mt-3 text-sm text-gray-400">
                Starting from <span className="font-semibold text-gray-200">{fmtCurrency(inputs.initialAmount)}</span> at{" "}
                <span className="font-semibold text-emerald-400">{inputs.annualReturnRate}%</span> annual return
              </p>

              {/* Contribution vs interest bar */}
              <div className="relative mt-5">
                <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-white/5">
                  <div className="h-full bg-blue-500/70 transition-all duration-700" style={{ width: `${contribPct}%` }} />
                  <div className="h-full bg-emerald-400 transition-all duration-700" style={{ width: `${interestPct}%` }} />
                </div>
                <div className="mt-2 flex items-center gap-4 text-[11px]">
                  <span className="flex items-center gap-1.5 text-gray-400">
                    <span className="h-2 w-2 rounded-full bg-blue-500/70" />
                    Contributions {contribPct.toFixed(0)}%
                  </span>
                  <span className="flex items-center gap-1.5 text-gray-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Growth {interestPct.toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>

            {/* ── 6-UP METRIC CARDS ──────────────────────────────────────── */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <ResultCard label="Total Contributions" value={fmtCurrency(result.totalContributions, true)} accent="cyan" />
              <ResultCard label="Investment Growth"   value={fmtCurrency(result.totalInterest, true)}       accent="emerald" />
              <ResultCard label="Inflation-Adjusted"  value={fmtCurrency(result.inflationAdjustedValue, true)} accent="amber" sub={`at ${inputs.inflationRate}% inflation`} />
              <ResultCard label="Wealth Multiplier"   value={`×${result.wealthMultiplier}`}                 accent="violet" sub="vs total invested" />
              <ResultCard label="Effective CAGR"      value={fmtPct(result.effectiveAnnualReturn)}          accent="cyan"   sub="compound annual growth" />
              <ResultCard label="Monthly contrib."    value={fmtCurrency(inputs.monthlyContribution)}       accent="emerald" sub={`over ${inputs.years} years`} />
            </div>

            {/* ── GROWTH CHART ────────────────────────────────────────────── */}
            <div className="hidden sm:block rounded-2xl border border-white/6 bg-gray-900 p-5 shadow-lg">
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.22em] text-gray-400">Portfolio growth over time</p>
              <p className="mb-5 text-[11px] text-gray-500">Contributions (blue) vs interest earned (emerald)</p>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="gContrib" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="gInterest" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="year" tick={TICK} axisLine={false} tickLine={false}
                    interval={Math.max(0, Math.floor(chartData.length / 8) - 1)} />
                  <YAxis tickFormatter={cptFmtY} tick={TICK} axisLine={false} tickLine={false} width={48} />
                  <Tooltip contentStyle={TT_STYLE}
                    formatter={(v: unknown, name: unknown) => [fmtCurrency(Number(v)), String(name) === "contributions" ? "Contributions" : "Interest earned"]} />
                  <Area type="monotone" dataKey="contributions" stroke="#3b82f6" strokeWidth={1.5} fill="url(#gContrib)" dot={false} />
                  <Area type="monotone" dataKey="interest"      stroke="#10b981" strokeWidth={2}   fill="url(#gInterest)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* ── TOTAL PORTFOLIO LINE ─────────────────────────────────────── */}
            <div className="hidden sm:block rounded-2xl border border-white/6 bg-gray-900 p-5 shadow-lg">
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.22em] text-gray-400">Compound growth curve</p>
              <p className="mb-5 text-[11px] text-gray-500">Total portfolio value vs inflation-adjusted value</p>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={chartData}>
                  <defs>
                    <linearGradient id="lineGlow" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%"   stopColor="#10b981" />
                      <stop offset="100%" stopColor="#2dd4bf" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="year" tick={TICK} axisLine={false} tickLine={false}
                    interval={Math.max(0, Math.floor(chartData.length / 8) - 1)} />
                  <YAxis tickFormatter={cptFmtY} tick={TICK} axisLine={false} tickLine={false} width={48} />
                  <Tooltip contentStyle={TT_STYLE}
                    formatter={(v: unknown, name: unknown) => [fmtCurrency(Number(v)), String(name) === "portfolio" ? "Portfolio" : "Inflation adjusted"]} />
                  <Line type="monotone" dataKey="portfolio"  stroke="#10b981" strokeWidth={2.5} dot={false} activeDot={{ r: 4, strokeWidth: 0, fill: "#10b981" }} />
                  <Line type="monotone" dataKey="inflation"  stroke="#f59e0b" strokeWidth={1.5} dot={false} strokeDasharray="5 3" activeDot={{ r: 3, strokeWidth: 0, fill: "#f59e0b" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* ── YEARLY GROWTH BAR ────────────────────────────────────────── */}
            <div className="hidden sm:block rounded-2xl border border-white/6 bg-gray-900 p-5 shadow-lg">
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.22em] text-gray-400">Annual growth by year</p>
              <p className="mb-5 text-[11px] text-gray-500">How much your portfolio grew each year</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chartData.map((d, i) => ({ ...d, growth: snap[i]?.annualGrowth ?? 0 }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="year" tick={TICK} axisLine={false} tickLine={false}
                    interval={Math.max(0, Math.floor(chartData.length / 8) - 1)} />
                  <YAxis tickFormatter={cptFmtY} tick={TICK} axisLine={false} tickLine={false} width={48} />
                  <Tooltip contentStyle={TT_STYLE} formatter={(v: unknown) => [fmtCurrency(Number(v)), "Annual growth"]} />
                  <Bar dataKey="growth" name="Annual growth" radius={[3, 3, 0, 0]}>
                    {chartData.map((_, i) => (
                      <Cell key={i}
                        fill={`hsl(152, 60%, ${30 + (i / chartData.length) * 20}%)`}
                        opacity={0.8 + (i / chartData.length) * 0.2}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* ── MILESTONES ───────────────────────────────────────────────── */}
            <div className="rounded-2xl border border-white/6 bg-gray-900 p-6 shadow-lg">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-gray-400">Wealth milestones</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {result.milestones.filter((m) => m.amount <= result.futureValue * 1.1).map((m) => {
                  const reached = m.yearsToReach !== null;
                  return (
                    <div key={m.amount}
                      className={`rounded-xl border p-3 text-center transition-all duration-200 ${
                        reached
                          ? "border-emerald-500/25 bg-emerald-900/10"
                          : "border-white/5 bg-white/3 opacity-40"
                      }`}>
                      <p className={`text-sm font-bold ${reached ? "text-emerald-400" : "text-gray-500"}`}>
                        {m.label === "Millionaire" ? "🏆" : "✦"} {m.label === "Millionaire" ? "Millionaire!" : fmtCurrency(m.amount, true)}
                      </p>
                      <p className={`mt-1 text-[11px] ${reached ? "text-gray-300" : "text-gray-600"}`}>
                        {reached ? `Year ${m.yearsToReach}` : "Not reached"}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── INSIGHTS ─────────────────────────────────────────────────── */}
            <div className="rounded-2xl border border-white/6 bg-gray-900 p-6 shadow-lg">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-gray-400">Key insights</p>
              <div className="flex flex-col gap-3">
                {[
                  interestPct > 50
                    ? { icon: "💡", text: `${interestPct.toFixed(0)}% of your final portfolio is pure compound growth — not money you put in. Time and returns are doing the heavy lifting.` }
                    : { icon: "📈", text: `You're in the accumulation phase — ${contribPct.toFixed(0)}% of your portfolio is contributions. Keep investing consistently and compound interest will overtake over time.` },
                  inputs.monthlyContribution > 0
                    ? { icon: "🔄", text: `Your ${fmtCurrency(inputs.monthlyContribution)}/month contribution adds up to ${fmtCurrency(inputs.monthlyContribution * 12 * inputs.years)} invested over ${inputs.years} years — and earns on itself throughout.` }
                    : { icon: "💵", text: `Adding even a small monthly contribution would dramatically increase your final value. Try the slider above to see the effect.` },
                  { icon: "🛡️", text: `Inflation at ${inputs.inflationRate}% reduces your ${fmtCurrency(result.futureValue, true)} to ${fmtCurrency(result.inflationAdjustedValue, true)} in today's money — still ${result.wealthMultiplier}× your investment.` },
                  { icon: "⏳", text: `Compound interest rewards patience exponentially. The last ${Math.ceil(inputs.years / 3)} years of this projection generate more growth than the first ${inputs.years - Math.ceil(inputs.years / 3)} combined.` },
                ].map((insight, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-xl bg-white/3 px-4 py-3">
                    <span className="mt-0.5 text-lg">{insight.icon}</span>
                    <p className="text-xs leading-5 text-gray-300">{insight.text}</p>
                  </div>
                ))}
              </div>
            </div>

          </>
        )}

        {/* Disclaimer */}
        <CalcDisclaimer text="Results are projections based on a constant annual return compounded at your chosen frequency. They do not account for inflation (unless toggled), taxes, fund fees, or market volatility. Past performance does not guarantee future results. This tool is for illustrative purposes only and should not be relied upon as financial, investment, or tax advice. Consult a qualified financial adviser before making investment decisions." />

      </div>
    </div>
  );
}
