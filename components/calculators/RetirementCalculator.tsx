"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, ComposedChart,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine, Cell,
} from "recharts";

import {
  calculateRetirement,
  fmtRetCurrency,
  fmtRetPct,
  RETIREMENT_SCENARIOS,
  type RetirementInputs,
  type RetirementResult,
} from "@/lib/calculators/retirementEngine";

// ─── Shared chart style ───────────────────────────────────────────────────────

const TICK = { fill: "#6b7280", fontSize: 11 };
const TT_STYLE = {
  backgroundColor: "#111827",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 10,
  fontSize: 12,
  color: "#f9fafb",
};

function fmtY(v: number) {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}k`;
  return `$${v}`;
}

// ─── Calculating loader ───────────────────────────────────────────────────────

const CALC_STEPS = [
  "Analysing your savings timeline…",
  "Projecting compound growth to retirement…",
  "Modelling retirement income & drawdown…",
  "Building your retirement dashboard…",
];

function CalculatingLoader({ progress, step }: { progress: number; step: number }) {
  return (
    <div className="relative flex flex-col items-center justify-center py-20 px-6 bg-gray-950 rounded-2xl text-white overflow-hidden">
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 85%, #10b981 0%, transparent 60%)" }}
      />
      <div className="relative mb-7">
        <div
          className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-emerald-400 animate-spin"
          style={{ animationDuration: "0.85s" }}
        />
        <div className="w-20 h-20 rounded-full border-2 border-white/10 flex items-center justify-center bg-white/5">
          <svg width="36" height="36" viewBox="0 0 16 16" fill="none" aria-hidden="true"
            className="animate-pulse" style={{ filter: "drop-shadow(0 0 8px #34d399)" }}>
            <path d="M2 3L6 13L8 7L10 13L14 3" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <p className="relative text-lg font-bold text-center text-white mb-1">{CALC_STEPS[step] ?? "Calculating…"}</p>
      <p className="relative text-xs text-white/40 mb-8">Projecting your retirement future</p>
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

// ─── Animated number hook ─────────────────────────────────────────────────────

function useCountUp(target: number, active: boolean, duration = 1000): number {
  const [display, setDisplay] = useState(target * 0.72);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const startValRef = useRef(target * 0.72);

  useEffect(() => {
    if (!active) { setDisplay(0); return; }
    startValRef.current = display;
    startRef.current = null;

    const c1 = 0.4; const c3 = c1 + 1;
    const ease = (t: number) => 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);

    const tick = (now: number) => {
      if (!startRef.current) startRef.current = now;
      const elapsed = now - startRef.current;
      const t = Math.min(elapsed / duration, 1);
      setDisplay(startValRef.current + (target - startValRef.current) * ease(t));
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else setDisplay(target);
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
  accent?: "emerald" | "cyan" | "amber" | "rose" | "violet" | "orange";
  large?: boolean;
}

function ResultCard({ label, value, sub, accent = "emerald", large = false }: ResultCardProps) {
  const accents: Record<string, string> = {
    emerald: "text-emerald-600",
    cyan:    "text-cyan-600",
    amber:   "text-amber-600",
    rose:    "text-rose-600",
    violet:  "text-violet-600",
    orange:  "text-orange-600",
  };
  return (
    <div className={`rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${large ? "col-span-2 sm:col-span-1" : ""}`}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-400">{label}</p>
      <p className={`mt-2 font-bold tabular-nums tracking-tight ${large ? "text-3xl" : "text-xl"} ${accents[accent]}`}>{value}</p>
      {sub && <p className="mt-1 text-[11px] text-gray-500">{sub}</p>}
    </div>
  );
}

// ─── Input UI atoms (matching Rent vs Buy style) ─────────────────────────────

function Label({ htmlFor, children }: { htmlFor?: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1.5"
    >
      {children}
    </label>
  );
}

function NumberInput({
  id, value, onChange, min = 0, max, step = 1, prefix, suffix,
}: {
  id?: string; value: number; onChange: (v: number) => void;
  min?: number; max?: number; step?: number; prefix?: string; suffix?: string;
}) {
  return (
    <div className="relative flex items-center">
      {prefix && (
        <span className="pointer-events-none absolute left-3 text-sm text-gray-400 select-none">
          {prefix}
        </span>
      )}
      <input
        id={id} type="number" min={min} max={max} step={step} value={value || ""}
        onChange={(e) => onChange(Number(e.target.value))}
        className={
          "w-full rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-medium text-gray-800 shadow-sm " +
          "focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 transition-colors " +
          (prefix ? "pl-7 " : "pl-3.5 ") +
          (suffix ? "pr-14" : "pr-3.5")
        }
      />
      {suffix && (
        <span className="pointer-events-none absolute right-3 text-sm text-gray-400 select-none">
          {suffix}
        </span>
      )}
    </div>
  );
}

// ─── Readiness gauge (SVG half-circle) ───────────────────────────────────────

function ReadinessGauge({ score, label, color }: { score: number; label: string; color: string }) {
  const colorHex: Record<string, string> = {
    emerald: "#10b981",
    amber:   "#f59e0b",
    orange:  "#f97316",
    rose:    "#f43f5e",
  };
  const textColor: Record<string, string> = {
    emerald: "text-emerald-400",
    amber:   "text-amber-400",
    orange:  "text-orange-400",
    rose:    "text-rose-400",
  };
  const stroke = colorHex[color] ?? "#10b981";

  return (
    <div className="flex flex-col items-center">
      <p className="text-center text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-500 mb-1">
        Readiness Score
      </p>
      <svg viewBox="0 0 200 115" className="w-44">
        {/* Track */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="14"
          strokeLinecap="round"
        />
        {/* Fill */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke={stroke}
          strokeWidth="14"
          strokeLinecap="round"
          pathLength="100"
          strokeDasharray={`${score} 100`}
          style={{ transition: "stroke-dasharray 1.4s cubic-bezier(0.34,1.56,0.64,1), stroke 0.5s" }}
        />
        {/* Score number */}
        <text x="100" y="90" textAnchor="middle" fill={stroke} fontSize="34" fontWeight="800" fontFamily="ui-sans-serif,system-ui">
          {score}
        </text>
        <text x="100" y="108" textAnchor="middle" fill="rgb(107,114,128)" fontSize="10" fontFamily="ui-sans-serif,system-ui">
          / 100
        </text>
      </svg>
      <p className={`-mt-1 text-sm font-bold ${textColor[color] ?? "text-emerald-400"}`}>{label}</p>
    </div>
  );
}

// ─── Default inputs ───────────────────────────────────────────────────────────

const DEFAULT_INPUTS: RetirementInputs = {
  currentAge: 30,
  retirementAge: 67,
  lifeExpectancy: 90,
  currentSavings: 25000,
  monthlyContribution: 600,
  annualReturnRate: 7,
  retirementReturnRate: 5,
  inflationRate: 2.5,
  monthlyRetirementGoal: 4000,
  annualBonus: 0,
  socialSecurityMonthly: 0,
};

// ─── Main component ───────────────────────────────────────────────────────────

export default function RetirementCalculator() {
  const [inputs, setInputs] = useState<RetirementInputs>(DEFAULT_INPUTS);
  const [calculating, setCalculating]     = useState(false);
  const [calculated,  setCalculated]      = useState(false);
  const [calcStep,    setCalcStep]         = useState(0);
  const [calcProgress,setCalcProgress]    = useState(0);
  const [result, setResult]               = useState<RetirementResult | null>(null);
  const [activeScenario, setActiveScenario] = useState<number | null>(null);
  const [gaugeScore, setGaugeScore]       = useState(0);
  const [showAdvanced, setShowAdvanced]   = useState(false);
  const [flash,        setFlash]          = useState(false);
  const [showChange,   setShowChange]     = useState(false);
  const [changeAmount, setChangeAmount]   = useState(0);
  const prevBalanceRef                    = useRef(0);

  const set = useCallback(<K extends keyof RetirementInputs>(key: K, val: RetirementInputs[K]) => {
    setInputs((prev) => ({ ...prev, [key]: val }));
  }, []);

  // Live update after first calc
  useEffect(() => {
    if (!calculated) return;
    const r = calculateRetirement(inputs);
    setResult(r);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs, calculated]);

  // Animate gauge on result change
  useEffect(() => {
    if (!result) { setGaugeScore(0); return; }
    const id = setTimeout(() => setGaugeScore(result.readinessScore), 120);
    return () => clearTimeout(id);
  }, [result?.readinessScore]);

  function handleCalculate(override?: RetirementInputs) {
    const inp = override ?? inputs;
    setCalculating(true);
    setCalcStep(0);
    setCalcProgress(0);
    const stepDuration = 380;
    const steps = CALC_STEPS.length;
    for (let i = 0; i < steps; i++) {
      setTimeout(() => {
        setCalcStep(i);
        setCalcProgress(Math.round(((i + 1) / steps) * 100));
      }, i * stepDuration);
    }
    setTimeout(() => {
      const r = calculateRetirement(inp);
      const delta = r.projectedBalance - prevBalanceRef.current;
      prevBalanceRef.current = r.projectedBalance;
      setResult(r);
      setCalculating(false);
      setCalculated(true);
      setFlash(true);
      if (delta !== 0) { setChangeAmount(delta); setShowChange(true); }
      setTimeout(() => setFlash(false), 500);
      setTimeout(() => setShowChange(false), 2200);
    }, steps * stepDuration);
  }

  function applyScenario(idx: number) {
    const scenario = RETIREMENT_SCENARIOS[idx];
    const newInputs = scenario.mutate(inputs);
    setActiveScenario(idx);
    if (calculated) {
      setResult(calculateRetirement(newInputs));
    } else {
      handleCalculate(newInputs);
    }
  }

  function resetScenario() {
    setActiveScenario(null);
    if (calculated) setResult(calculateRetirement(inputs));
  }

  // Animated hero value
  const animBalance = useCountUp(result?.projectedBalance ?? 0, calculated && !calculating, 1200);

  // ── Chart data ────────────────────────────────────────────────────────────
  const snaps = result?.yearlySnapshots ?? [];
  const accSnaps = snaps.filter(s => s.phase === "accumulation");
  const retSnaps = snaps.filter(s => s.phase === "retirement");

  const timelineData = snaps.map(s => ({
    age: s.age,
    label: `${s.age}`,
    portfolio:    s.portfolioValue,
    inflAdj:      s.inflationAdjustedValue,
    contributions: s.phase === "accumulation" ? s.totalContributions : undefined,
    phase:        s.phase,
  }));

  const accumData = accSnaps.map(s => ({
    label:         `${s.age}`,
    contributions: s.totalContributions,
    growth:        Math.max(0, s.totalGrowth),
  }));

  const drawdownData = retSnaps.map(s => ({
    label:     `Age ${s.age}`,
    portfolio: s.portfolioValue,
    inflAdj:   s.inflationAdjustedValue,
  }));

  // ── Derived display values ─────────────────────────────────────────────────
  const coveragePct = result
    ? Math.min(100, (result.portfolioMonthlyIncome / Math.max(1, result.monthlyRetirementNeed)) * 100)
    : 0;
  const ssCoveragePct = result
    ? Math.min(100 - coveragePct, (result.socialSecurityAdjusted / Math.max(1, result.monthlyRetirementNeed)) * 100)
    : 0;
  const totalLifespan = inputs.lifeExpectancy - inputs.currentAge;
  const accumPct = totalLifespan > 0 && result ? (result.accumulationYears / totalLifespan) * 100 : 0;
  const drawPct  = totalLifespan > 0 && result ? (result.drawdownYears / totalLifespan) * 100 : 0;
  const retirementAgeRefLine = inputs.retirementAge;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">

      {/* ── Input section ──────────────────────────────────────────────────── */}
      <div className="p-6 border-b border-gray-100">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          <div>
            <Label htmlFor="currentAge">Current age</Label>
            <NumberInput
              id="currentAge" value={inputs.currentAge} onChange={(v) => { set("currentAge", v); if (v >= inputs.retirementAge) set("retirementAge", v + 1); }}
              min={18} max={65} step={1} suffix=" yrs"
            />
          </div>

          <div>
            <Label htmlFor="retirementAge">Retirement age</Label>
            <NumberInput
              id="retirementAge" value={inputs.retirementAge} onChange={(v) => set("retirementAge", v)}
              min={inputs.currentAge + 1} max={80} step={1} suffix=" yrs"
            />
            <p className="mt-1 text-xs text-gray-400">{inputs.retirementAge - inputs.currentAge} years to retire</p>
          </div>

          <div>
            <Label htmlFor="currentSavings">Current savings</Label>
            <NumberInput
              id="currentSavings" value={inputs.currentSavings} onChange={(v) => set("currentSavings", v)}
              min={0} max={500000} step={1000} prefix="$"
            />
          </div>

          <div>
            <Label htmlFor="monthlyContribution">Monthly contribution</Label>
            <NumberInput
              id="monthlyContribution" value={inputs.monthlyContribution} onChange={(v) => set("monthlyContribution", v)}
              min={0} max={5000} step={50} prefix="$" suffix="/mo"
            />
          </div>

          <div>
            <Label htmlFor="annualReturnRate">Annual return rate</Label>
            <NumberInput
              id="annualReturnRate" value={inputs.annualReturnRate} onChange={(v) => set("annualReturnRate", v)}
              min={1} max={15} step={0.5} suffix="%/yr"
            />
            <p className="mt-1 text-xs text-gray-400">S&amp;P 500 avg ~7% real return</p>
          </div>

          <div>
            <Label htmlFor="monthlyRetirementGoal">Monthly income goal</Label>
            <NumberInput
              id="monthlyRetirementGoal" value={inputs.monthlyRetirementGoal} onChange={(v) => set("monthlyRetirementGoal", v)}
              min={500} max={20000} step={100} prefix="$" suffix="/mo"
            />
          </div>

        </div>

        {/* Advanced toggle */}
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setShowAdvanced((p) => !p)}
            className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition"
          >
            <span>{showAdvanced ? "▲" : "▼"}</span>
            {showAdvanced ? "Hide" : "Show"} advanced options
          </button>
        </div>

        {showAdvanced && (
          <div className="mt-4 border-t border-gray-100 pt-4">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <Label htmlFor="inflationRate">Inflation rate</Label>
                <NumberInput
                  id="inflationRate" value={inputs.inflationRate} onChange={(v) => set("inflationRate", v)}
                  min={1} max={6} step={0.25} suffix="%/yr"
                />
                <p className="mt-1 text-xs text-gray-400">US avg ~2.5–3%/yr long-term</p>
              </div>
              <div>
                <Label htmlFor="lifeExpectancy">Life expectancy</Label>
                <NumberInput
                  id="lifeExpectancy" value={inputs.lifeExpectancy} onChange={(v) => set("lifeExpectancy", v)}
                  min={inputs.retirementAge + 1} max={100} step={1} suffix=" yrs"
                />
              </div>
              <div>
                <Label htmlFor="retirementReturnRate">Post-retirement return</Label>
                <NumberInput
                  id="retirementReturnRate" value={inputs.retirementReturnRate} onChange={(v) => set("retirementReturnRate", v)}
                  min={0} max={10} step={0.5} suffix="%/yr"
                />
                <p className="mt-1 text-xs text-gray-400">Lower rate for conservative portfolio</p>
              </div>
              <div>
                <Label htmlFor="annualBonus">Annual bonus / windfall</Label>
                <NumberInput
                  id="annualBonus" value={inputs.annualBonus} onChange={(v) => set("annualBonus", v)}
                  min={0} max={50000} step={500} prefix="$"
                />
              </div>
              <div>
                <Label htmlFor="socialSecurityMonthly">Social Security / pension</Label>
                <NumberInput
                  id="socialSecurityMonthly" value={inputs.socialSecurityMonthly} onChange={(v) => set("socialSecurityMonthly", v)}
                  min={0} max={3000} step={100} prefix="$" suffix="/mo"
                />
                <p className="mt-1 text-xs text-gray-400">US average SS benefit ~$1,700/mo</p>
              </div>
            </div>
          </div>
        )}

        {/* Calculate button */}
        <div className="mt-6">
          <button
            type="button"
            onClick={() => handleCalculate()}
            disabled={calculating}
            className="w-full rounded-xl py-3.5 text-sm font-bold text-white shadow-lg transition-all disabled:opacity-60 active:scale-[0.98]"
            style={{ background: "linear-gradient(135deg, #059669 0%, #0d9488 100%)" }}
          >
            {calculating ? "Calculating…" : calculated ? "↻ Recalculate" : "Calculate"}
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════════
          CALCULATING LOADER
      ═══════════════════════════════════════════════════════════════════ */}
      {calculating && <CalculatingLoader progress={calcProgress} step={calcStep} />}

      {/* ═══════════════════════════════════════════════════════════════════
          RESULTS
      ═══════════════════════════════════════════════════════════════════ */}
      {calculated && !calculating && result && (
        <div className="p-4 sm:p-6 space-y-4 bg-gray-50/70 border-t border-gray-100">
          {/* ── HERO CARD ──────────────────────────────────────────────────── */}
          <div className={`relative overflow-hidden rounded-2xl border bg-gray-950 p-6 sm:p-8 transition-all duration-500 ${
            flash
              ? "border-emerald-500/20 shadow-[0_24px_100px_rgba(0,0,0,0.55),0_0_40px_rgba(52,211,153,0.1)]"
              : "border-white/8 shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
          }`}>
            <div className={`pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full blur-3xl transition-all duration-500 ${
              flash ? "bg-emerald-500/25 scale-110" : "bg-emerald-500/15 scale-100"
            }`} />
            <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-violet-900/30 blur-3xl" />

            <div className="relative flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
              {/* Gauge */}
              <div className="shrink-0">
                <ReadinessGauge score={gaugeScore} label={result.readinessLabel} color={result.readinessColor} />
              </div>

              <div className="hidden sm:block h-24 w-px bg-white/10" />

              {/* Balance + timeline */}
              <div className="flex-1 text-center sm:text-left">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">
                  Projected Retirement Balance
                </p>
                <p className={`mt-2 text-[clamp(2.5rem,7vw,4rem)] font-bold leading-none tracking-[-0.04em] transition-all duration-500 ${
                  flash
                    ? "text-emerald-300 [text-shadow:0_0_40px_rgba(52,211,153,0.65)]"
                    : "text-emerald-400 [text-shadow:0_0_20px_rgba(52,211,153,0.3)]"
                }`}>
                  {fmtRetCurrency(Math.round(animBalance))}
                </p>
                <div className={`mt-1 h-6 overflow-hidden transition-all duration-700 ${
                  showChange ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
                }`}>
                  {changeAmount !== 0 && (
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      changeAmount > 0 ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"
                    }`}>
                      {changeAmount > 0 ? "+" : ""}{fmtRetCurrency(Math.abs(changeAmount), true)}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-gray-400">
                  At age <span className="font-semibold text-gray-200">{inputs.retirementAge}</span> ·{" "}
                  <span className="font-semibold text-emerald-400">{inputs.annualReturnRate}%</span> annual return ·{" "}
                  <span className="font-semibold text-gray-300">{result.accumulationYears} years saving</span>
                </p>

                {/* Lifetime timeline bar */}
                <div className="mt-5">
                  <div className="flex justify-between text-[11px] text-gray-500 mb-1.5">
                    <span>Age {inputs.currentAge}</span>
                    <span className="text-emerald-400">Retire {inputs.retirementAge}</span>
                    <span>Age {inputs.lifeExpectancy}</span>
                  </div>
                  <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-l-full bg-emerald-500 transition-all duration-700"
                      style={{ width: `${accumPct}%` }}
                    />
                    <div
                      className="h-full bg-violet-500/60 transition-all duration-700"
                      style={{ width: `${drawPct}%` }}
                    />
                  </div>
                  <div className="flex gap-4 mt-1.5 text-[10px]">
                    <span className="flex items-center gap-1.5 text-gray-500">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {result.accumulationYears} yrs saving
                    </span>
                    <span className="flex items-center gap-1.5 text-gray-500">
                      <span className="h-1.5 w-1.5 rounded-full bg-violet-500/80" />
                      {result.drawdownYears} yrs in retirement
                    </span>
                    {result.portfolioOutlivesExpectancy ? (
                      <span className="flex items-center gap-1.5 text-emerald-400">
                        ✓ Portfolio outlives expectations
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-rose-400">
                        ⚠ Portfolio depletes age {result.portfolioDepletesAtAge}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── INCOME COVERAGE VISUAL ────────────────────────────────────── */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">
              Monthly Retirement Income Coverage
            </p>
            <p className="mb-5 text-[11px] text-gray-500">
              How much of your {fmtRetCurrency(result.monthlyRetirementNeed)}/mo goal is covered (in retirement-day dollars)
            </p>

            <div className="relative h-9 w-full rounded-xl bg-gray-100 overflow-hidden">
              {/* Portfolio bar */}
              <div
                className="absolute top-0 left-0 h-full bg-emerald-500/80 transition-all duration-1000 flex items-center justify-end pr-2"
                style={{ width: `${Math.max(2, coveragePct)}%` }}
              >
                {coveragePct > 15 && (
                  <span className="text-[10px] font-bold text-white">Portfolio</span>
                )}
              </div>
              {/* SS bar */}
              {result.socialSecurityAdjusted > 0 && (
                <div
                  className="absolute top-0 h-full bg-cyan-500/70 transition-all duration-1000"
                  style={{
                    left:  `${Math.min(100, coveragePct)}%`,
                    width: `${Math.min(100 - coveragePct, ssCoveragePct)}%`,
                  }}
                />
              )}
              {/* Goal line */}
              <div className="absolute top-0 bottom-0 right-0 w-0.5 bg-amber-400/60" />
            </div>

            <div className="flex flex-wrap gap-4 mt-4">
              <span className="flex items-center gap-1.5 text-[11px] text-gray-600">
                <span className="h-2 w-3 rounded-sm bg-emerald-500" />
                Portfolio: <strong className="text-emerald-700">{fmtRetCurrency(result.portfolioMonthlyIncome)}/mo</strong>
              </span>
              {result.socialSecurityAdjusted > 0 && (
                <span className="flex items-center gap-1.5 text-[11px] text-gray-600">
                  <span className="h-2 w-3 rounded-sm bg-cyan-500" />
                  Social Security: <strong className="text-cyan-700">{fmtRetCurrency(result.socialSecurityAdjusted)}/mo</strong>
                </span>
              )}
              {result.monthlyIncomeGap > 0 ? (
                <span className="flex items-center gap-1.5 text-[11px] text-rose-600">
                  ⚠ Shortfall: <strong>{fmtRetCurrency(result.monthlyIncomeGap)}/mo</strong>
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-[11px] text-emerald-600">
                  ✓ Surplus: <strong>{fmtRetCurrency(Math.abs(result.monthlyIncomeGap))}/mo</strong>
                </span>
              )}
              <span className="ml-auto flex items-center gap-1.5 text-[11px] text-amber-600">
                Goal: <strong>{fmtRetCurrency(result.monthlyRetirementNeed)}/mo</strong>
              </span>
            </div>
          </div>

          {/* ── 6-UP METRIC CARDS ──────────────────────────────────────────── */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <ResultCard
              label="Portfolio at Retirement"
              value={fmtRetCurrency(result.projectedBalance, true)}
              accent="emerald"
              sub={`${result.accumulationYears} year growth`}
            />
            <ResultCard
              label="Inflation-Adjusted Value"
              value={fmtRetCurrency(result.inflationAdjustedBalance, true)}
              accent="amber"
              sub={`at ${inputs.inflationRate}% inflation`}
            />
            <ResultCard
              label="Total Contributions"
              value={fmtRetCurrency(result.totalContributions, true)}
              accent="cyan"
              sub={`${fmtRetCurrency(inputs.monthlyContribution)}/mo`}
            />
            <ResultCard
              label="Compound Growth"
              value={fmtRetCurrency(result.totalGrowth, true)}
              accent="emerald"
              sub="interest earned"
            />
            <ResultCard
              label="Income Replacement"
              value={`${fmtRetPct(result.incomeReplacementRate)}`}
              accent={result.incomeReplacementRate >= 100 ? "emerald" : result.incomeReplacementRate >= 70 ? "amber" : "rose"}
              sub="of monthly goal"
            />
            <ResultCard
              label="Portfolio Sustains"
              value={result.portfolioOutlivesExpectancy ? `${result.drawdownYears} yrs` : `${result.sustainabilityYears} yrs`}
              accent={result.portfolioOutlivesExpectancy ? "emerald" : result.sustainabilityYears > result.drawdownYears * 0.7 ? "amber" : "rose"}
              sub={result.portfolioOutlivesExpectancy ? "full life expectancy" : `depletes age ${result.portfolioDepletesAtAge}`}
            />
          </div>

          {/* ── CHART 1: FULL LIFETIME PORTFOLIO CURVE ─────────────────────── */}
          <div className="hidden sm:block rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.22em] text-gray-600">
              Full Lifetime Portfolio Curve
            </p>
            <p className="mb-5 text-[11px] text-gray-500">
              Portfolio value from age {inputs.currentAge} to {inputs.lifeExpectancy} — accumulation then retirement drawdown
            </p>
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={timelineData}>
                <defs>
                  <linearGradient id="gPortfolio" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.03} />
                  </linearGradient>
                  <linearGradient id="gInflAdj" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="label" tick={TICK} axisLine={false} tickLine={false}
                  interval={Math.max(0, Math.floor(timelineData.length / 8) - 1)} />
                <YAxis tickFormatter={fmtY} tick={TICK} axisLine={false} tickLine={false} width={52} />
                <Tooltip
                  contentStyle={TT_STYLE}
                  formatter={(v: unknown, name: string) => [
                    fmtRetCurrency(Number(v)),
                    name === "portfolio" ? "Portfolio Value" : name === "inflAdj" ? "Inflation-Adjusted" : name,
                  ]}
                  labelFormatter={(label) => `Age ${label}`}
                />
                <ReferenceLine
                  x={`${retirementAgeRefLine}`}
                  stroke="rgba(255,255,255,0.25)"
                  strokeDasharray="4 3"
                  label={{ value: `Retire`, fill: "#9ca3af", fontSize: 10, position: "insideTopRight" }}
                />
                <Area
                  type="monotone" dataKey="portfolio" stroke="#10b981"
                  strokeWidth={2.5} fill="url(#gPortfolio)" dot={false}
                  activeDot={{ r: 4, strokeWidth: 0, fill: "#10b981" }}
                />
                <Line
                  type="monotone" dataKey="inflAdj" stroke="#f59e0b"
                  strokeWidth={1.5} dot={false} strokeDasharray="5 3"
                  activeDot={{ r: 3, strokeWidth: 0, fill: "#f59e0b" }}
                />
                <Legend
                  iconType="line"
                  wrapperStyle={{ fontSize: 11, color: "#9ca3af", paddingTop: 12 }}
                  formatter={(v) => v === "portfolio" ? "Portfolio Value" : "Inflation-Adjusted"}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* ── CHART 2: CONTRIBUTIONS VS GROWTH ─────────────────────────── */}
          {accumData.length > 0 && (
          <div className="hidden sm:block rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.22em] text-gray-600">
                Contributions vs Compound Growth
              </p>
              <p className="mb-5 text-[11px] text-gray-500">
                How compound interest overtakes your contributions over time
              </p>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={accumData}>
                  <defs>
                    <linearGradient id="gContrib" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="gGrowth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#10b981" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="label" tick={TICK} axisLine={false} tickLine={false}
                    interval={Math.max(0, Math.floor(accumData.length / 8) - 1)} />
                  <YAxis tickFormatter={fmtY} tick={TICK} axisLine={false} tickLine={false} width={52} />
                  <Tooltip
                    contentStyle={TT_STYLE}
                    formatter={(v: unknown, name: string) => [
                      fmtRetCurrency(Number(v)),
                      name === "contributions" ? "Total Contributions" : "Compound Growth",
                    ]}
                    labelFormatter={(label) => `Age ${label}`}
                  />
                  <Area type="monotone" dataKey="contributions" stackId="1" stroke="#3b82f6" strokeWidth={1.5} fill="url(#gContrib)" dot={false} />
                  <Area type="monotone" dataKey="growth"        stackId="1" stroke="#10b981" strokeWidth={2}   fill="url(#gGrowth)" dot={false} />
                  <Legend
                    iconType="line"
                    wrapperStyle={{ fontSize: 11, color: "#9ca3af", paddingTop: 12 }}
                    formatter={(v) => v === "contributions" ? "Your Contributions" : "Compound Growth"}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* ── CHART 3: DRAWDOWN SUSTAINABILITY ─────────────────────────── */}
          {drawdownData.length > 0 && (
          <div className="hidden sm:block rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.22em] text-gray-600">
                Retirement Drawdown Projection
              </p>
              <p className="mb-5 text-[11px] text-gray-500">
                Portfolio balance during your {result.drawdownYears}-year retirement (age {inputs.retirementAge}–{inputs.lifeExpectancy})
              </p>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={drawdownData}>
                  <defs>
                    <linearGradient id="gDrawdown" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#818cf8" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#818cf8" stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="label" tick={TICK} axisLine={false} tickLine={false}
                    interval={Math.max(0, Math.floor(drawdownData.length / 6) - 1)} />
                  <YAxis tickFormatter={fmtY} tick={TICK} axisLine={false} tickLine={false} width={52} />
                  <Tooltip
                    contentStyle={TT_STYLE}
                    formatter={(v: unknown, name: string) => [
                      fmtRetCurrency(Number(v)),
                      name === "portfolio" ? "Portfolio Balance" : "Inflation-Adjusted",
                    ]}
                  />
                  {!result.portfolioOutlivesExpectancy && (
                    <ReferenceLine
                      y={0} stroke="#f43f5e" strokeDasharray="4 3"
                      label={{ value: "Depleted", fill: "#f43f5e", fontSize: 10, position: "insideTopLeft" }}
                    />
                  )}
                  <Area type="monotone" dataKey="portfolio" stroke="#818cf8" strokeWidth={2.5} fill="url(#gDrawdown)" dot={false}
                    activeDot={{ r: 4, strokeWidth: 0, fill: "#818cf8" }} />
                  <Line type="monotone" dataKey="inflAdj" stroke="#f59e0b" strokeWidth={1.5} dot={false} strokeDasharray="5 3"
                    activeDot={{ r: 3, strokeWidth: 0, fill: "#f59e0b" }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* ── CHART 4: ANNUAL GROWTH BARS ───────────────────────────────── */}
          {accumData.length > 0 && (
          <div className="hidden sm:block rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.22em] text-gray-600">
                Annual Portfolio Value During Saving Phase
              </p>
              <p className="mb-5 text-[11px] text-gray-500">
                Year-by-year portfolio value during your {result.accumulationYears}-year saving phase
              </p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={accumData.map(d => ({ ...d, total: d.contributions + d.growth }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="label" tick={TICK} axisLine={false} tickLine={false}
                    interval={Math.max(0, Math.floor(accumData.length / 8) - 1)} />
                  <YAxis tickFormatter={fmtY} tick={TICK} axisLine={false} tickLine={false} width={52} />
                  <Tooltip contentStyle={TT_STYLE}
                    formatter={(v: unknown) => [fmtRetCurrency(Number(v)), "Portfolio Value"]}
                    labelFormatter={(label) => `Age ${label}`}
                  />
                  <Bar dataKey="total" name="Portfolio Value" radius={[3, 3, 0, 0]}>
                    {accumData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={`hsl(152, 60%, ${28 + (i / accumData.length) * 22}%)`}
                        opacity={0.75 + (i / accumData.length) * 0.25}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* ── MILESTONES ───────────────────────────────────────────────────── */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.22em] text-gray-600">Wealth Milestones</p>
            <p className="mb-4 text-[11px] text-gray-500">Ages when your portfolio crosses key thresholds during the saving phase</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {result.milestones.map((m) => {
                const reached = m.ageToReach !== null;
                return (
                  <div
                    key={m.amount}
                    className={`rounded-xl border p-3.5 text-center transition-all duration-300 ${
                      reached
                        ? "border-emerald-200 bg-emerald-50"
                        : "border-gray-100 bg-gray-50 opacity-50"
                    }`}
                  >
                    <p className={`text-sm font-bold ${reached ? "text-emerald-700" : "text-gray-400"}`}>
                      {m.label === "Millionaire" ? "🏆" : m.label === "$2M" ? "💎" : "✦"}{" "}
                      {m.label === "Millionaire" ? "Millionaire!" : m.label}
                    </p>
                    <p className={`mt-0.5 text-[11px] ${reached ? "text-gray-600" : "text-gray-400"}`}>
                      {reached ? `Age ${m.ageToReach}` : "Not reached"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── WHAT-IF SCENARIOS ─────────────────────────────────────────── */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.22em] text-gray-600">What-if Scenarios</p>
            <p className="mb-4 text-[11px] text-gray-500">Instantly see how small changes dramatically affect your retirement</p>
            <div className="flex flex-wrap gap-2">
              {RETIREMENT_SCENARIOS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => activeScenario === i ? resetScenario() : applyScenario(i)}
                  className={`rounded-xl border px-3.5 py-2 text-xs font-semibold transition-all duration-200 ${
                    activeScenario === i
                      ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                      : "border-gray-200 bg-gray-50 text-gray-600 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                  }`}
                >
                  {s.emoji} {s.label}
                </button>
              ))}
              {activeScenario !== null && (
                <button
                  onClick={resetScenario}
                  className="rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2 text-xs font-semibold text-gray-500 transition-all hover:border-gray-300 hover:bg-gray-100"
                >
                  ↺ Reset
                </button>
              )}
            </div>
          </div>

          {/* ── INSIGHTS ─────────────────────────────────────────────────────── */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.22em] text-gray-600">Key Insights</p>
            <div className="flex flex-col gap-3">
              {[
                result.totalGrowth > result.totalContributions
                  ? {
                      icon: "💡",
                      text: `${Math.round((result.totalGrowth / result.projectedBalance) * 100)}% of your retirement portfolio comes from compound growth — not money you contributed. Time and returns are doing the heavy lifting.`,
                    }
                  : {
                      icon: "📈",
                      text: `You're in the early accumulation stage — contributions make up most of your current portfolio. Keep investing consistently and compound interest will overtake over time.`,
                    },
                result.incomeReplacementRate >= 100
                  ? {
                      icon: "✅",
                      text: `Your projected income covers ${fmtRetPct(result.incomeReplacementRate)} of your retirement goal. You're on track — consider whether you'd like to retire earlier or increase your target lifestyle.`,
                    }
                  : {
                      icon: "🎯",
                      text: `Your current plan covers ${fmtRetPct(result.incomeReplacementRate)} of your ${fmtRetCurrency(result.monthlyRetirementNeed)}/mo goal. Contributing ${fmtRetCurrency(inputs.monthlyContribution + 200)} instead of ${fmtRetCurrency(inputs.monthlyContribution)}/mo could meaningfully close this gap.`,
                    },
                {
                  icon: "🛡️",
                  text: `Inflation at ${inputs.inflationRate}% reduces your ${fmtRetCurrency(result.projectedBalance, true)} portfolio to ${fmtRetCurrency(result.inflationAdjustedBalance, true)} in today's purchasing power at retirement — still a powerful foundation.`,
                },
                result.portfolioOutlivesExpectancy
                  ? {
                      icon: "🏆",
                      text: `Your portfolio is projected to last your full life expectancy (${inputs.lifeExpectancy} years old). This reflects strong financial positioning. The later years of compound growth are particularly powerful.`,
                    }
                  : {
                      icon: "⚠️",
                      text: `Your portfolio may deplete around age ${result.portfolioDepletesAtAge}. Working ${Math.min(5, inputs.lifeExpectancy - inputs.retirementAge - result.sustainabilityYears)} more years or increasing contributions could extend sustainability significantly.`,
                    },
                {
                  icon: "⏳",
                  text: `The last ${Math.ceil(result.accumulationYears / 4)} years of your ${result.accumulationYears}-year saving phase generate more compound growth than the first ${result.accumulationYears - Math.ceil(result.accumulationYears / 4)} years combined. Starting early is the single most powerful retirement decision.`,
                },
              ].map((insight, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl bg-gray-50 border border-gray-100 px-4 py-3">
                  <span className="mt-0.5 text-lg">{insight.icon}</span>
                  <p className="text-xs leading-5 text-gray-700">{insight.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
