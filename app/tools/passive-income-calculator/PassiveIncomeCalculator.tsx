"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Slider } from "@/components/ui/slider";
import {
  calculatePortfolio,
  type PassiveIncomeStream,
} from "@/calculations/finance/passiveIncome";
import {
  ASSET_TYPES,
  SCENARIOS,
  REGION_DEFAULTS,
  INCOME_MILESTONES,
  STREAM_COLORS,
  getIncomeMilestone,
  type StreamType,
  type Region,
  type IncomeModel,
} from "@/data/finance/defaults";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(value: number, symbol: string): string {
  if (!isFinite(value) || value < 0) return "—";
  return `${symbol}${Math.round(value).toLocaleString()}`;
}

function fmtYears(y: number): string {
  if (y === 0) return "—";
  if (y >= 999) return "40+ yrs";
  if (y < 0.1) return "Now";
  const yrs = Math.floor(y);
  const mos = Math.round((y - yrs) * 12);
  if (mos === 0) return `${yrs} yr${yrs !== 1 ? "s" : ""}`;
  return `${yrs}y ${mos}m`;
}

// ─── Slider field ─────────────────────────────────────────────────────────────

interface SliderInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  unitPosition?: "prefix" | "suffix";
  hint?: string;
  quickPicks?: number[];
  onChange: (v: number) => void;
}

function SliderInput({
  label,
  value,
  min,
  max,
  step,
  unit,
  unitPosition = "suffix",
  hint,
  quickPicks,
  onChange,
}: SliderInputProps) {
  const [raw, setRaw] = useState(String(value));

  // Sync when value changes from parent (e.g. scenario applied)
  useEffect(() => {
    setRaw(String(value));
  }, [value]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-gray-700">{label}</label>
        <div className="flex items-center gap-1">
          {unitPosition === "prefix" && (
            <span className="text-sm font-semibold text-gray-400">{unit}</span>
          )}
          <input
            type="number"
            value={raw}
            min={min}
            max={max}
            step={step}
            onChange={(e) => {
              setRaw(e.target.value);
              const n = parseFloat(e.target.value);
              if (!isNaN(n) && n >= min && n <= max) onChange(n);
            }}
            onBlur={() => setRaw(String(value))}
            className="w-24 rounded-lg border border-gray-200 bg-gray-50 px-2 py-1 text-right text-sm font-semibold text-gray-800 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          />
          {unitPosition === "suffix" && unit && (
            <span className="text-sm font-semibold text-gray-400">{unit}</span>
          )}
        </div>
      </div>
      <div className="mt-2">
        <Slider
          min={min}
          max={max}
          step={step}
          value={[value]}
          onValueChange={([v]) => {
            onChange(v);
            setRaw(String(v));
          }}
        />
      </div>
      {quickPicks && (
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {quickPicks.map((pick) => (
            <button
              key={pick}
              type="button"
              onClick={() => {
                onChange(pick);
                setRaw(String(pick));
              }}
              className={`rounded-md px-2 py-0.5 text-xs font-semibold transition-colors ${
                value === pick
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-gray-100 text-gray-500 hover:bg-emerald-50 hover:text-emerald-600"
              }`}
            >
              {unitPosition === "prefix" ? `${unit}${pick.toLocaleString()}` : `${pick}${unit ? unit : ""}`}
            </button>
          ))}
        </div>
      )}
      {hint && <p className="mt-1.5 text-xs leading-relaxed text-gray-400">{hint}</p>}
    </div>
  );
}

// ─── SmallOutputCard ──────────────────────────────────────────────────────────

function SmallOutputCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
        {label}
      </p>
      <p className="mt-1.5 text-xl font-bold tracking-tight text-gray-900">
        {value}
      </p>
      {sub && <p className="mt-0.5 text-xs text-gray-400">{sub}</p>}
    </div>
  );
}

// ─── StreamCard ───────────────────────────────────────────────────────────────

const INCOME_MODELS: { key: IncomeModel; label: string; hint: string }[] = [
  {
    key: "compound",
    label: "Compound Growth",
    hint: "Safe withdrawal from a growing portfolio",
  },
  {
    key: "fixed_yield",
    label: "Fixed Yield",
    hint: "Direct yield — e.g. rental income, dividend payout",
  },
  {
    key: "hybrid",
    label: "Hybrid",
    hint: "Blend of capital growth and direct yield",
  },
];

interface StreamCardProps {
  stream: PassiveIncomeStream;
  index: number;
  currency: string;
  canRemove: boolean;
  onChange: (patch: Partial<PassiveIncomeStream>) => void;
  onRemove: () => void;
}

function StreamCard({
  stream,
  index,
  currency,
  canRemove,
  onChange,
  onRemove,
}: StreamCardProps) {
  const [expanded, setExpanded] = useState(true);
  const cfg = ASSET_TYPES[stream.type];
  const showYieldSlider =
    stream.incomeModel === "fixed_yield" || stream.incomeModel === "hybrid";

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div
        role="button"
        tabIndex={0}
        onClick={() => setExpanded((e) => !e)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setExpanded((v) => !v);
        }}
        className="flex cursor-pointer select-none items-center justify-between gap-3 px-5 py-4 hover:bg-gray-50"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
            {index + 1}
          </span>
          <div>
            <p className="text-sm font-bold text-gray-800">{stream.label}</p>
            <p className="text-xs text-gray-400">{cfg.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {canRemove && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="rounded-full p-1 text-gray-300 transition-colors hover:bg-red-50 hover:text-red-400"
              aria-label="Remove stream"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
          <svg
            className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

      {expanded && (
        <div className="space-y-5 border-t border-gray-100 px-5 pb-5 pt-4">
          {/* Stream type */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Stream Type
            </p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {(Object.keys(ASSET_TYPES) as StreamType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() =>
                    onChange({
                      type: t,
                      label: ASSET_TYPES[t].label,
                      annualReturn: ASSET_TYPES[t].defaultAnnualReturn,
                      yieldRate: ASSET_TYPES[t].defaultYieldRate,
                      incomeModel: ASSET_TYPES[t].defaultIncomeModel,
                      mode: ASSET_TYPES[t].defaultMode,
                    })
                  }
                  className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
                    stream.type === t
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-gray-200 text-gray-500 hover:border-emerald-200 hover:text-emerald-600"
                  }`}
                >
                  {ASSET_TYPES[t].label}
                </button>
              ))}
            </div>
          </div>

          {/* Mode toggle */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
              How you earn this income
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onChange({ mode: "direct" })}
                className={`flex flex-col items-start rounded-xl border px-3 py-2.5 text-left transition-all ${
                  stream.mode === "direct"
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-gray-200 hover:border-emerald-200"
                }`}
              >
                <span className={`text-xs font-bold ${
                  stream.mode === "direct" ? "text-emerald-700" : "text-gray-600"
                }`}>
                  Direct Income
                </span>
                <span className="mt-0.5 text-[11px] leading-tight text-gray-400">
                  I know my monthly amount
                </span>
              </button>
              <button
                type="button"
                onClick={() => onChange({ mode: "growth" })}
                className={`flex flex-col items-start rounded-xl border px-3 py-2.5 text-left transition-all ${
                  stream.mode === "growth"
                    ? "border-emerald-500 bg-emerald-50"
                    : "border-gray-200 hover:border-emerald-200"
                }`}
              >
                <span className={`text-xs font-bold ${
                  stream.mode === "growth" ? "text-emerald-700" : "text-gray-600"
                }`}>
                  Growth-Based
                </span>
                <span className="mt-0.5 text-[11px] leading-tight text-gray-400">
                  Calculate from portfolio
                </span>
              </button>
            </div>
          </div>

          {/* Direct income input */}
          {stream.mode === "direct" && (
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Monthly Income
              </label>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-2xl font-bold text-gray-400">{currency}</span>
                <input
                  type="number"
                  value={stream.monthlyIncome}
                  min={0}
                  max={100000}
                  step={100}
                  onChange={(e) =>
                    onChange({ monthlyIncome: Math.max(0, Number(e.target.value) || 0) })
                  }
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-2xl font-bold text-gray-800 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                />
                <span className="shrink-0 text-sm text-gray-400">/mo</span>
              </div>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {[500, 1000, 2000, 3000, 5000].map((pick) => (
                  <button
                    key={pick}
                    type="button"
                    onClick={() => onChange({ monthlyIncome: pick })}
                    className={`rounded-md px-2 py-0.5 text-xs font-semibold transition-colors ${
                      stream.monthlyIncome === pick
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-gray-100 text-gray-500 hover:bg-emerald-50 hover:text-emerald-600"
                    }`}
                  >
                    {currency}{pick.toLocaleString()}
                  </button>
                ))}
              </div>
              <p className="mt-1.5 text-xs text-gray-400">
                {cfg.examples}
              </p>
            </div>
          )}

          {/* Growth mode inputs */}
          {stream.mode === "growth" && (
            <>
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Income Model
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {INCOME_MODELS.map(({ key, label, hint }) => (
                    <button
                      key={key}
                      type="button"
                      title={hint}
                      onClick={() => onChange({ incomeModel: key })}
                      className={`rounded-xl border px-2 py-2 text-xs font-semibold leading-tight transition-all ${
                        stream.incomeModel === key
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                          : "border-gray-200 text-gray-500 hover:border-emerald-200 hover:text-emerald-600"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <p className="mt-1.5 text-xs text-gray-400">
                  {INCOME_MODELS.find((m) => m.key === stream.incomeModel)?.hint}
                </p>
              </div>

              <SliderInput
                label="Initial Investment"
                value={stream.initialInvestment}
                min={0}
                max={500000}
                step={1000}
                unit={currency}
                unitPosition="prefix"
                quickPicks={[5000, 10000, 25000, 50000, 100000]}
                onChange={(v) => onChange({ initialInvestment: v })}
              />

              <SliderInput
                label="Monthly Contribution"
                value={stream.monthlyContribution}
                min={0}
                max={10000}
                step={50}
                unit={currency}
                unitPosition="prefix"
                quickPicks={[100, 250, 500, 1000, 2000]}
                onChange={(v) => onChange({ monthlyContribution: v })}
              />

              <SliderInput
                label="Expected Annual Return"
                value={stream.annualReturn}
                min={0}
                max={25}
                step={0.5}
                unit="%"
                hint={cfg.examples}
                quickPicks={[5, 7, 10, 15]}
                onChange={(v) => onChange({ annualReturn: v })}
              />

              {showYieldSlider && (
                <SliderInput
                  label={
                    stream.incomeModel === "fixed_yield"
                      ? "Annual Yield Rate"
                      : "Yield Rate (for hybrid blend)"
                  }
                  value={stream.yieldRate}
                  min={0}
                  max={20}
                  step={0.5}
                  unit="%"
                  hint="The income the asset directly pays — rental yield, dividend yield, etc."
                  quickPicks={[3, 4, 5, 6, 8]}
                  onChange={(v) => onChange({ yieldRate: v })}
                />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Insight engine ───────────────────────────────────────────────────────────

interface Insight {
  type: "info" | "warn" | "tip";
  text: string;
}

function buildInsights(
  streams: PassiveIncomeStream[],
  result: { totalMonthlyIncome: number; totalPortfolioValue: number; inflationAdjustedValue: number; yearsToFreedom: number },
  years: number,
  targetMonthlyIncome: number,
  currency: string,
): Insight[] {
  const insights: Insight[] = [];
  const { totalMonthlyIncome, totalPortfolioValue, inflationAdjustedValue, yearsToFreedom } = result;

  for (const s of streams) {
    if (s.annualReturn > 15) {
      insights.push({
        type: "warn",
        text: `"${s.label}" is set to ${s.annualReturn}% annual return. Sustained returns above 15% are very difficult to achieve. A rate of 7–10% is more realistic for a diversified portfolio.`,
      });
      break;
    }
  }

  if (targetMonthlyIncome > 0) {
    if (yearsToFreedom < 999) {
      const withinHorizon = yearsToFreedom <= years;
      insights.push({
        type: "info",
        text: `At current settings, your portfolio will generate ${fmt(targetMonthlyIncome, currency)}/month in ${fmtYears(yearsToFreedom)}.${withinHorizon ? ` That falls within your ${years}-year horizon.` : ` That exceeds your ${years}-year horizon — consider extending it or increasing contributions.`}`,
      });
    } else {
      insights.push({
        type: "warn",
        text: `Your target of ${fmt(targetMonthlyIncome, currency)}/month is not reachable within 40 years at current settings. Increasing monthly contributions or adjusting the expected return will bring this target closer.`,
      });
    }
  }

  if (streams.length === 1) {
    insights.push({
      type: "tip",
      text: `You have one income stream. Adding a second stream — such as dividend income or rental property — reduces concentration risk and can improve overall passive income stability.`,
    });
  }

  const uniqueTypes = [...new Set(streams.map((s) => s.type))];
  if (uniqueTypes.length >= 2 && streams.length >= 2 && totalMonthlyIncome > 0) {
    const typeNames = uniqueTypes.map((t) => ASSET_TYPES[t].label).join(", ");
    insights.push({
      type: "info",
      text: `You have diversified passive income streams: ${typeNames}. Multiple income sources reduce dependence on any single asset class.`,
    });
  }

  const milestone = getIncomeMilestone(totalMonthlyIncome);
  if (milestone && totalMonthlyIncome > 0) {
    insights.push({
      type: "info",
      text: `${fmt(totalMonthlyIncome, currency)}/month: ${milestone.label}.`,
    });
  }

  if (totalPortfolioValue > 0) {
    const erosionPct =
      ((totalPortfolioValue - inflationAdjustedValue) / totalPortfolioValue) * 100;
    if (erosionPct > 25) {
      insights.push({
        type: "warn",
        text: `Inflation will erode ${erosionPct.toFixed(0)}% of your nominal portfolio over ${years} years. Your ${fmt(totalPortfolioValue, currency)} portfolio will be worth ${fmt(inflationAdjustedValue, currency)} in today's purchasing power.`,
      });
    }
  }

  return insights.slice(0, 4);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function genId(): string {
  return Math.random().toString(36).slice(2, 9);
}

function makeStream(
  type: StreamType,
  overrides: Partial<PassiveIncomeStream> = {},
): PassiveIncomeStream {
  const cfg = ASSET_TYPES[type];
  return {
    id: genId(),
    type,
    label: cfg.label,
    mode: cfg.defaultMode,
    monthlyIncome: 500,
    initialInvestment: 10000,
    monthlyContribution: 500,
    annualReturn: cfg.defaultAnnualReturn,
    yieldRate: cfg.defaultYieldRate,
    incomeModel: cfg.defaultIncomeModel,
    ...overrides,
  };
}

// ─── Main component ───────────────────────────────────────────────────────────

export interface PassiveIncomeCalculatorProps {
  currency?: string;
  region?: Region;
}

export default function PassiveIncomeCalculator({
  currency = "$",
  region = "US",
}: PassiveIncomeCalculatorProps) {
  const regionDefaults = REGION_DEFAULTS[region];

  const [streams, setStreams] = useState<PassiveIncomeStream[]>([
    makeStream("investment", {
      initialInvestment: 10000,
      monthlyContribution: 500,
      annualReturn: 7,
    }),
  ]);
  const [years, setYears] = useState(20);
  const [withdrawalRate, setWithdrawalRate] = useState(
    regionDefaults.defaultWithdrawalRate,
  );
  const [inflationRate, setInflationRate] = useState(
    regionDefaults.defaultInflation,
  );
  const [targetMonthlyIncome, setTargetMonthlyIncome] = useState(0);
  const [targetRaw, setTargetRaw] = useState("");
  const [activeScenario, setActiveScenario] = useState<string | null>("balanced");

  // ── Digital screen state ─────────────────────────────────────────────────
  const [flash, setFlash] = useState(false);
  const [displayIncome, setDisplayIncome] = useState(0);
  const [changeAmount, setChangeAmount] = useState(0);
  const [showChange, setShowChange] = useState(false);
  const animRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevIncomeRef = useRef<number>(0);
  const changeFadeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Stream management ────────────────────────────────────────────────────
  const addStream = useCallback(() => {
    const types: StreamType[] = [
      "investment", "rental", "dividend", "business", "custom",
    ];
    const usedTypes = streams.map((s) => s.type);
    const nextType = types.find((t) => !usedTypes.includes(t)) ?? "custom";
    const scenarioReturn =
      activeScenario !== null
        ? SCENARIOS.find((s) => s.key === activeScenario)?.annualReturn
        : undefined;
    setStreams((prev) => [
      ...prev,
      makeStream(nextType, scenarioReturn !== undefined ? { annualReturn: scenarioReturn } : {}),
    ]);
  }, [streams, activeScenario]);

  const removeStream = useCallback((id: string) => {
    setStreams((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const updateStream = useCallback(
    (id: string, patch: Partial<PassiveIncomeStream>) => {
      setStreams((prev) =>
        prev.map((s) => {
          if (s.id !== id) return s;
          if ("annualReturn" in patch) setActiveScenario(null);
          return { ...s, ...patch };
        }),
      );
    },
    [],
  );

  const applyScenario = useCallback((key: string) => {
    const scenario = SCENARIOS.find((s) => s.key === key);
    if (!scenario) return;
    setActiveScenario(key);
    setStreams((prev) =>
      prev.map((s) =>
        s.mode === "growth" ? { ...s, annualReturn: scenario.annualReturn } : s,
      ),
    );
  }, []);

  // ── Calculation ──────────────────────────────────────────────────────────
  const result = useMemo(
    () =>
      calculatePortfolio({
        streams,
        years,
        withdrawalRate,
        inflationRate,
        targetMonthlyIncome,
      }),
    [streams, years, withdrawalRate, inflationRate, targetMonthlyIncome],
  );

  // ── Flash animation ──────────────────────────────────────────────────────
  useEffect(() => {
    setFlash(true);
    const t = setTimeout(() => setFlash(false), 450);
    return () => clearTimeout(t);
  }, [result.totalMonthlyIncome]);

  // ── Delta pill ───────────────────────────────────────────────────────────
  useEffect(() => {
    const prev = prevIncomeRef.current;
    const diff = result.totalMonthlyIncome - prev;
    if (prev !== 0 && diff !== 0) {
      setChangeAmount(diff);
      setShowChange(true);
      if (changeFadeRef.current) clearTimeout(changeFadeRef.current);
      changeFadeRef.current = setTimeout(() => setShowChange(false), 1800);
    }
    prevIncomeRef.current = result.totalMonthlyIncome;
  }, [result.totalMonthlyIncome]);

  // ── Count-up animation ───────────────────────────────────────────────────
  useEffect(() => {
    if (animRef.current) clearTimeout(animRef.current);
    const target = result.totalMonthlyIncome;
    const startVal = displayIncome;
    const diff = target - startVal;
    if (diff === 0) return;
    const steps = 24;
    const c1 = 0.4;
    const c3 = c1 + 1;
    const easeOutBack = (t: number) =>
      1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    let step = 0;
    const tick = () => {
      step++;
      const progress = step / steps;
      const ease = easeOutBack(progress);
      setDisplayIncome(Math.round(startVal + diff * ease));
      if (step < steps) {
        animRef.current = setTimeout(tick, 12);
      } else {
        setDisplayIncome(target);
      }
    };
    animRef.current = setTimeout(tick, 12);
    return () => {
      if (animRef.current) clearTimeout(animRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result.totalMonthlyIncome]);

  // ── Derived values ────────────────────────────────────────────────────────
  const insights = useMemo(
    () => buildInsights(streams, result, years, targetMonthlyIncome, currency),
    [streams, result, years, targetMonthlyIncome, currency],
  );

  const growthMultiple =
    result.totalContributed > 0
      ? (result.totalPortfolioValue / result.totalContributed).toFixed(1)
      : "1.0";

  const milestone = getIncomeMilestone(result.totalMonthlyIncome);
  const multiStream = streams.length > 1;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="grid gap-8 lg:grid-cols-[2fr_3fr] lg:gap-10">

      {/* ── LEFT: INPUTS ────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-5">

        {/* Scenario presets — only relevant when at least one growth stream exists */}
        {result.hasGrowthStreams && <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
              Scenario
            </p>
          </div>
          <div className="grid grid-cols-3">
            {SCENARIOS.map((s, i) => (
              <button
                key={s.key}
                type="button"
                onClick={() => applyScenario(s.key)}
                className={`py-3 text-sm font-semibold transition-colors duration-150 ${i < 2 ? "border-r border-gray-100" : ""} ${
                  activeScenario === s.key
                    ? "bg-emerald-500 text-white"
                    : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
              >
                {s.label}
                <span
                  className={`ml-1 text-xs font-normal ${activeScenario === s.key ? "text-white/70" : "text-gray-400"}`}
                >
                  {s.annualReturn}%
                </span>
              </button>
            ))}
          </div>
        </div>}

        {/* Global settings — only relevant when at least one growth stream exists */}
        {result.hasGrowthStreams && <div className="space-y-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
            Global Settings
          </p>

          <SliderInput
            label="Investment Horizon"
            value={years}
            min={1}
            max={40}
            step={1}
            unit="yrs"
            quickPicks={[10, 15, 20, 30]}
            onChange={setYears}
          />

          <SliderInput
            label="Withdrawal Rate"
            value={withdrawalRate}
            min={1}
            max={10}
            step={0.5}
            unit="%"
            hint="4% is the widely-used safe withdrawal rate for a 30-year retirement."
            quickPicks={[3, 3.5, 4, 5]}
            onChange={setWithdrawalRate}
          />

          <SliderInput
            label="Inflation Rate"
            value={inflationRate}
            min={0}
            max={10}
            step={0.5}
            unit="%"
            hint="Historical average: 2–3%. Used to compute real portfolio value."
            onChange={setInflationRate}
          />

          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-700">
                Freedom Target{" "}
                <span className="font-normal text-gray-400">(optional)</span>
              </label>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-400">
                {currency}
              </span>
              <input
                type="number"
                min={0}
                max={100000}
                step={100}
                value={targetRaw}
                placeholder="e.g. 3000"
                onChange={(e) => {
                  setTargetRaw(e.target.value);
                  setTargetMonthlyIncome(Number(e.target.value) || 0);
                }}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-800 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
              <span className="shrink-0 text-sm text-gray-400">/mo</span>
            </div>
            <p className="mt-1.5 text-xs text-gray-400">
              Your target monthly passive income — we calculate when you reach it.
            </p>
          </div>
        </div>}

        {/* Income streams */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
            Income Streams ({streams.length})
          </p>

          {streams.map((stream, i) => (
            <StreamCard
              key={stream.id}
              stream={stream}
              index={i}
              currency={currency}
              canRemove={streams.length > 1}
              onChange={(patch) => updateStream(stream.id, patch)}
              onRemove={() => removeStream(stream.id)}
            />
          ))}

          {streams.length < 5 && (
            <button
              type="button"
              onClick={addStream}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 py-3.5 text-sm font-semibold text-gray-400 transition-all hover:border-emerald-300 hover:text-emerald-600"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add income stream
            </button>
          )}
        </div>
      </div>

      {/* ── RIGHT: OUTPUTS ──────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4">

        {/* Dark hero card */}
        <div
          className={`relative overflow-hidden rounded-2xl border p-7 transition-all duration-500 ${
            flash
              ? "border-emerald-500/20 shadow-[0_24px_100px_rgba(0,0,0,0.55),0_0_40px_rgba(52,211,153,0.1)]"
              : "border-white/8 shadow-[0_24px_80px_rgba(0,0,0,0.45)]"
          } bg-gray-950`}
        >
          <div
            className={`pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full blur-3xl transition-all duration-500 ${flash ? "scale-110 bg-emerald-500/25" : "scale-100 bg-emerald-500/15"}`}
          />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-emerald-900/40 blur-3xl" />

          <p className="relative text-xs font-semibold uppercase tracking-[0.28em] text-gray-400">
            Total monthly passive income
          </p>

          <p
            className={`relative mt-3 text-[clamp(3rem,8vw,5rem)] font-bold leading-none tracking-[-0.04em] transition-all duration-500 ${
              flash
                ? "text-emerald-300 [text-shadow:0_0_40px_rgba(52,211,153,0.6)]"
                : "text-emerald-400 [text-shadow:0_0_20px_rgba(52,211,153,0.28)]"
            }`}
          >
            {currency}
            {displayIncome.toLocaleString()}
            <span className="ml-2 text-lg font-normal text-emerald-500/60">
              /mo
            </span>
          </p>

          <div
            className={`relative mt-1 h-6 overflow-hidden transition-all duration-700 ${showChange ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"}`}
          >
            {changeAmount !== 0 && (
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  changeAmount > 0
                    ? "bg-emerald-500/20 text-emerald-300"
                    : "bg-red-500/20 text-red-300"
                }`}
              >
                {changeAmount > 0 ? "+" : ""}
                {currency}
                {Math.abs(Math.round(changeAmount)).toLocaleString()} / mo
              </span>
            )}
          </div>

          <p className="relative mt-2 text-sm font-medium text-gray-400">
            {streams.length} stream{streams.length !== 1 ? "s" : ""}
            {result.hasGrowthStreams && (
              <>
                &nbsp;&middot;&nbsp;
                <span className="font-bold text-white">{withdrawalRate}%</span>{" "}
                withdrawal &nbsp;&middot;&nbsp;
                <span className="font-bold text-white">{years} yr</span> horizon
              </>
            )}
          </p>

          {result.totalMonthlyIncome > 0 && multiStream && (
            <div className="relative mt-5">
              <div className="flex h-2.5 w-full overflow-hidden rounded-full">
                {result.streams.map((sr, i) => {
                  const pct =
                    (sr.monthlyIncome / result.totalMonthlyIncome) * 100;
                  return (
                    <div
                      key={sr.id}
                      className={`h-full transition-all duration-700 ${STREAM_COLORS[i % STREAM_COLORS.length]}`}
                      style={{ width: `${pct}%` }}
                    />
                  );
                })}
              </div>
              <div className="mt-2 flex flex-wrap gap-3">
                {result.streams.map((sr, i) => {
                  const stream = streams.find((s) => s.id === sr.id);
                  return (
                    <span
                      key={sr.id}
                      className="flex items-center gap-1.5 text-xs text-gray-400"
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${STREAM_COLORS[i % STREAM_COLORS.length]}`}
                      />
                      {stream?.label ?? "Stream"}:{" "}
                      {currency}
                      {Math.round(sr.monthlyIncome).toLocaleString()}/mo
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {targetMonthlyIncome > 0 && result.yearsToFreedom < 999 && (
            <div className="relative mt-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-semibold text-emerald-300">
                Financial freedom in {fmtYears(result.yearsToFreedom)}
              </span>
            </div>
          )}
        </div>

        {/* 2×2 output grid */}
        <div className="grid grid-cols-2 gap-3">
          <SmallOutputCard
            label={result.hasGrowthStreams ? "Growth Portfolio" : "Portfolio"}
            value={result.hasGrowthStreams ? fmt(result.totalPortfolioValue, currency) : "—"}
            sub={
              result.hasGrowthStreams
                ? `after ${years} yr${years !== 1 ? "s" : ""} · ${growthMultiple}× growth`
                : "Using direct income input"
            }
          />
          <SmallOutputCard
            label="Annual Income"
            value={fmt(result.totalAnnualIncome, currency)}
            sub="per year at current withdrawal rate"
          />
          <SmallOutputCard
            label="Inflation-Adjusted"
            value={result.hasGrowthStreams ? fmt(result.inflationAdjustedValue, currency) : "—"}
            sub={result.hasGrowthStreams ? "real value in today's money" : "Not applicable for direct income"}
          />
          {targetMonthlyIncome > 0 ? (
            <SmallOutputCard
              label="Freedom In"
              value={fmtYears(result.yearsToFreedom)}
              sub={
                result.yearsToFreedom >= 999
                  ? "increase contributions"
                  : `to reach ${currency}${targetMonthlyIncome.toLocaleString()}/mo`
              }
            />
          ) : (
            <SmallOutputCard
              label="Total Contributed"
              value={result.hasGrowthStreams ? fmt(result.totalContributed, currency) : "—"}
              sub={result.hasGrowthStreams
                ? `+${((result.totalGrowth / Math.max(1, result.totalContributed)) * 100).toFixed(0)}% investment growth`
                : "No portfolio contributions"
              }
            />
          )}
        </div>

        {/* Per-stream breakdown */}
        {multiStream && (
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
              Stream Breakdown
            </p>
            <div className="space-y-4">
              {result.streams.map((sr, i) => {
                const stream = streams.find((s) => s.id === sr.id);
                const pct =
                  result.totalMonthlyIncome > 0
                    ? (sr.monthlyIncome / result.totalMonthlyIncome) * 100
                    : 0;
                return (
                  <div key={sr.id}>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${STREAM_COLORS[i % STREAM_COLORS.length]}`}
                        />
                        <span className="font-semibold text-gray-700">
                          {stream?.label ?? "Stream"}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-gray-900">
                          {currency}
                          {Math.round(sr.monthlyIncome).toLocaleString()}/mo
                        </span>
                        <span className="ml-2 text-xs text-gray-400">
                          {pct.toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full rounded-full bg-gray-100">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${STREAM_COLORS[i % STREAM_COLORS.length]}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="mt-0.5 text-xs text-gray-400">
                      {stream?.mode === "direct"
                        ? `Direct income · ${ASSET_TYPES[stream.type].label}`
                        : `Portfolio: ${currency}${Math.round(sr.portfolioValue).toLocaleString()} · ${ASSET_TYPES[stream?.type ?? "investment"].label}`
                      }
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Insights */}
        {insights.length > 0 && (
          <div className="space-y-2">
            {insights.map((insight, i) => (
              <div
                key={i}
                className={`rounded-xl p-4 text-sm leading-relaxed ${
                  insight.type === "warn"
                    ? "border border-amber-200 bg-amber-50 text-amber-800"
                    : insight.type === "tip"
                      ? "border border-blue-100 bg-blue-50 text-blue-800"
                      : "border border-emerald-100 bg-emerald-50 text-emerald-800"
                }`}
              >
                {insight.text}
              </div>
            ))}
          </div>
        )}

        {/* Value interpretation */}
        {milestone && result.totalMonthlyIncome > 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
              What this means
            </p>
            <p className="mt-2 text-sm text-gray-500">
              {currency}
              {Math.round(result.totalMonthlyIncome).toLocaleString()}/month —{" "}
              <span className="font-semibold text-gray-800">
                {milestone.label}
              </span>
              .
            </p>
            <div className="mt-3 space-y-1.5">
              {INCOME_MILESTONES.filter(
                (m) =>
                  m.threshold <= Math.max(result.totalMonthlyIncome * 2, 7500),
              ).map((m) => (
                <div key={m.threshold} className="flex items-center gap-2.5">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${result.totalMonthlyIncome >= m.threshold ? "bg-emerald-400" : "bg-gray-200"}`}
                  />
                  <span
                    className={`text-xs ${result.totalMonthlyIncome >= m.threshold ? "font-medium text-gray-700" : "text-gray-400"}`}
                  >
                    {currency}
                    {m.threshold.toLocaleString()}/mo — {m.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs leading-relaxed text-gray-400">
          Estimates only. All figures are pre-tax. Results do not constitute
          financial advice. Actual returns vary and are not guaranteed.
        </p>
      </div>
    </div>
  );
}
