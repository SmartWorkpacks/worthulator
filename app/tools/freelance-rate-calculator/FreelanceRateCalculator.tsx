"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  LineChart, Line, ReferenceLine,
} from "recharts";
import { RangeSliderCard, CalcDisclaimer } from "@/src/templates/take-home-pay";
import WorthulatorProgressLoader from "@/src/templates/shared/WorthulatorProgressLoader";
import WorthulatorResultReveal from "@/src/templates/shared/WorthulatorResultReveal";
import { calculateFreelanceRate, type FreelanceMode } from "@/lib/calculators/freelanceRateEngine";

/* --- helpers --------------------------------------------------------------- */

function fmt(v: number) {
  const a = Math.abs(Math.round(v));
  if (a >= 1_000_000) return `$${(a / 1_000_000).toFixed(1)}M`;
  if (a >= 1_000)     return `$${(a / 1_000).toFixed(0)}k`;
  return `$${a}`;
}
function fmtFull(v: number) {
  return (v < 0 ? "-$" : "$") + Math.abs(Math.round(v)).toLocaleString();
}

/* --- count-up hook --------------------------------------------------------- */

function useCountUp(target: number, active: boolean, duration = 1200): number {
  const [val, setVal] = useState(0);
  const frame = useRef<number | null>(null);
  const start = useRef<number | null>(null);
  const from  = useRef(0);

  useEffect(() => {
    if (!active) { setVal(0); return; }
    from.current = val;
    start.current = null;
    const tick = (ts: number) => {
      if (!start.current) start.current = ts;
      const p = Math.min((ts - start.current) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(from.current + (target - from.current) * ease));
      if (p < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => { if (frame.current) cancelAnimationFrame(frame.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, active, duration]);

  return val;
}

/* --- framer motion variants ----------------------------------------------- */

const fadeUp = {
  hidden:  { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const staggerContainer = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08 } },
};

/* --- analysis steps ------------------------------------------------------- */

const CALC_STEPS = [
  "Calculating billable hours...",
  "Factoring in tax and platform fees...",
  "Modelling survival vs premium gap...",
  "Generating rate insights...",
];

/* --- section divider ------------------------------------------------------ */

function SectionLabel({ text, sub }: { text: string; sub?: string }) {
  return (
    <div className="pt-1 pb-0.5 border-b border-gray-100">
      <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400">{text}</p>
      {sub && <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

/* --- numeric stepper input ------------------------------------------------ */

function NumInput({
  label, hint, prefix = "", suffix = "", value, onChange,
  step = 1, min = 0, max = Infinity, wide = false,
}: {
  label: string; hint?: string; prefix?: string; suffix?: string;
  value: number; onChange: (v: number) => void;
  step?: number; min?: number; max?: number; wide?: boolean;
}) {
  const [raw, setRaw] = useState(String(value));
  useEffect(() => { setRaw(String(value)); }, [value]);

  function commit(s: string) {
    const n = Number(s.replace(/,/g, ""));
    const clamped = Math.max(min, Math.min(max, isNaN(n) ? value : n));
    onChange(clamped);
    setRaw(String(clamped));
  }

  return (
    <div className={`flex flex-col gap-1 ${wide ? "col-span-2" : ""}`}>
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-400 mb-0.5">{label}</p>
      {hint && <p className="text-[11px] text-gray-400 -mt-0.5 mb-1 leading-snug">{hint}</p>}
      <div className="flex items-stretch rounded-xl border border-gray-200 bg-white overflow-hidden focus-within:border-gray-400 transition-colors">
        {prefix && (
          <span className="px-3 text-sm font-semibold text-gray-400 border-r border-gray-100 bg-gray-50 flex items-center">{prefix}</span>
        )}
        <input
          type="number" inputMode="numeric"
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          onBlur={(e) => commit(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") commit(raw); }}
          className="flex-1 px-3 py-2.5 text-sm font-bold text-gray-900 bg-white focus:outline-none min-w-0"
          min={min} max={max} step={step}
        />
        {suffix && (
          <span className="px-3 text-sm font-semibold text-gray-400 border-l border-gray-100 bg-gray-50 flex items-center">{suffix}</span>
        )}
        <div className="flex flex-col border-l border-gray-100 shrink-0">
          <button type="button" onClick={() => onChange(Math.min(max, value + step))}
            className="px-2.5 py-1 text-[10px] text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors leading-none border-b border-gray-100 font-bold">+</button>
          <button type="button" onClick={() => onChange(Math.max(min, value - step))}
            className="px-2.5 py-1 text-[10px] text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-colors leading-none font-bold">-</button>
        </div>
      </div>
    </div>
  );
}

/* --- insight card ---------------------------------------------------------- */

function InsightCard({
  type, text, index = 0,
}: {
  type: "positive" | "warning" | "neutral"; text: string; index?: number;
}) {
  const statMatch = text.match(/^([^]+?[\$\d][\w,%.k/hr]+)/);
  const stat = statMatch ? statMatch[1].trim() : null;
  const body = stat ? text.slice(stat.length).replace(/^[\s-,]+/, "") : text;

  const s = {
    positive: { wrap: "border-emerald-100 bg-white",   bar: "bg-emerald-500", stat: "text-emerald-700", body: "text-gray-600" },
    warning:  { wrap: "border-red-100    bg-red-50",   bar: "bg-red-500",     stat: "text-red-700",     body: "text-red-700"  },
    neutral:  { wrap: "border-blue-100   bg-white",    bar: "bg-blue-400",    stat: "text-blue-700",    body: "text-gray-600" },
  }[type];

  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      className={"flex items-stretch rounded-xl border overflow-hidden " + s.wrap}
    >
      <div className={"w-1 shrink-0 " + s.bar} />
      <div className="flex-1 px-4 py-3.5">
        {stat && <p className={"text-base font-black tabular-nums mb-0.5 " + s.stat}>{stat}</p>}
        <p className={"text-sm leading-relaxed " + s.body}>{body}</p>
      </div>
    </motion.div>
  );
}



/* --- dark hero card ------------------------------------------------------- */

function HeroRateCard({
  result, mode, countUpActive,
}: {
  result: ReturnType<typeof calculateFreelanceRate>;
  mode: FreelanceMode;
  countUpActive: boolean;
}) {
  const rate    = useCountUp(Math.round(result.minimumHourlyRate), countUpActive, 1200);
  const monthly = useCountUp(Math.round(result.minimumMonthlyRate), countUpActive, 1100);
  const annual  = useCountUp(Math.round(result.requiredRevenueWithFees), countUpActive, 1000);

  const modeLabel = mode === "premium" ? "Premium" : mode === "comfortable" ? "Comfortable" : "Survival";
  const accentColor = mode === "premium" ? "#a78bfa" : mode === "comfortable" ? "#34d399" : "#f59e0b";

  return (
    <motion.div
      variants={fadeUp}
      custom={0}
      className="relative rounded-2xl overflow-hidden text-white shadow-2xl"
      style={{ background: "linear-gradient(135deg, #0d1117 0%, #161b22 100%)" }}
    >
      <div className="absolute inset-0 opacity-25 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 30% 50%, ${accentColor} 0%, transparent 60%)` }} />

      <div className="absolute top-5 right-5 flex items-center gap-2 z-10">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: accentColor }} />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ backgroundColor: accentColor }} />
        </span>
        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: accentColor }}>Live</span>
      </div>

      <div className="relative z-10 p-6 sm:p-8">
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-2" style={{ color: accentColor + "bb" }}>
            {modeLabel} mode
          </p>
          <div className="flex items-end gap-3">
            <span className="text-5xl sm:text-6xl font-black tabular-nums leading-none">${rate}</span>
            <span className="text-lg font-bold pb-1.5" style={{ color: accentColor + "99" }}>/hr</span>
          </div>
          {result.isUndercharging && (
            <p className="mt-2 text-xs font-semibold text-red-400">
              You are undercharging by ${Math.abs(Math.round(result.rateGap))}/hr
            </p>
          )}
          {!result.isUndercharging && (
            <p className="mt-2 text-xs font-semibold text-emerald-400/80">
              Your current rate covers this scenario
            </p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4">
            <p className="text-[9px] font-bold uppercase tracking-widest mb-1.5" style={{ color: accentColor + "80" }}>Monthly</p>
            <p className="text-lg sm:text-2xl font-black tabular-nums leading-none">{fmt(monthly)}</p>
            <p className="text-[9px] mt-1" style={{ color: accentColor + "60" }}>revenue target</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4">
            <p className="text-[9px] font-bold uppercase tracking-widest mb-1.5" style={{ color: accentColor + "80" }}>Annual</p>
            <p className="text-lg sm:text-2xl font-black tabular-nums leading-none">{fmt(annual)}</p>
            <p className="text-[9px] mt-1" style={{ color: accentColor + "60" }}>total needed</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4">
            <p className="text-[9px] font-bold uppercase tracking-widest mb-1.5" style={{ color: accentColor + "80" }}>Billed hrs</p>
            <p className="text-lg sm:text-2xl font-black tabular-nums leading-none">{result.billableHoursPerYear}</p>
            <p className="text-[9px] mt-1" style={{ color: accentColor + "60" }}>per year</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* --- mode comparison table ------------------------------------------------ */

function ScenarioTable({
  result, mode, onModeChange,
}: {
  result: ReturnType<typeof calculateFreelanceRate>;
  mode: FreelanceMode;
  onModeChange: (m: FreelanceMode) => void;
}) {
  const rows: { key: FreelanceMode; label: string; desc: string; color: string }[] = [
    { key: "survival",    label: "Survival",    desc: "Bare minimum - covers your costs", color: "text-amber-600"  },
    { key: "comfortable", label: "Comfortable", desc: "+20% buffer for savings and growth", color: "text-emerald-700" },
    { key: "premium",     label: "Premium",     desc: "+50% for exceptional positioning",  color: "text-violet-700" },
  ];

  return (
    <motion.div variants={fadeUp} custom={2} className="rounded-xl border border-gray-100 bg-white overflow-hidden">
      <div className="px-4 pt-4 pb-2 border-b border-gray-50">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Survival to Premium range</p>
        <p className="text-xs text-gray-400 mt-0.5">Tap a mode to update your rate above</p>
      </div>
      <div className="divide-y divide-gray-50">
        {rows.map((r) => {
          const isActive = mode === r.key;
          const scenarioRate = result.rateByMode[r.key];
          const scenarioIncome = result.scenarios.find((s) => s.label === r.label)?.annualIncome ?? 0;
          return (
            <button
              key={r.key}
              type="button"
              onClick={() => onModeChange(r.key)}
              className={"w-full flex items-center gap-4 px-4 py-3.5 text-left transition-all " +
                (isActive ? "bg-gray-950 text-white" : "bg-white hover:bg-gray-50")}
            >
              <div className="flex-1 min-w-0">
                <p className={"text-sm font-bold " + (isActive ? "text-white" : r.color)}>{r.label}</p>
                <p className={"text-xs mt-0.5 " + (isActive ? "text-white/50" : "text-gray-400")}>{r.desc}</p>
              </div>
              <div className="text-right shrink-0">
                <p className={"text-base font-black tabular-nums " + (isActive ? "text-emerald-400" : "text-gray-900")}>
                  ${scenarioRate}/hr
                </p>
                <p className={"text-[10px] mt-0.5 " + (isActive ? "text-white/40" : "text-gray-400")}>
                  {fmtFull(scenarioIncome)}/yr take-home
                </p>
              </div>
              {isActive && <div className="shrink-0 w-1.5 h-8 rounded-full bg-emerald-500" />}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

/* --- utilization chart ---------------------------------------------------- */

function UtilizationChart({ data, currentRate }: {
  data: { utilizationPct: number; hourlyRate: number }[];
  currentRate: number;
}) {
  const TT = { backgroundColor: "transparent", border: "none", boxShadow: "none", padding: 0 };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const TC = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-xl px-3 py-2 text-xs pointer-events-none">
        <p className="font-bold text-gray-600 mb-1">{label}% utilization</p>
        <p className="font-black text-emerald-700">${payload[0]?.value}/hr needed</p>
      </div>
    );
  };
  return (
    <motion.div variants={fadeUp} custom={3} className="rounded-xl border border-gray-100 bg-white p-4">
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Rate vs utilization</p>
      <p className="text-xs text-gray-400 mb-3">How your required rate rises as billable % falls</p>
      <ResponsiveContainer width="100%" height={160}>
        <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
          <XAxis dataKey="utilizationPct" tickFormatter={(v: number) => `${v}%`}
            tick={{ fontSize: 9, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
          <YAxis tickFormatter={(v: number) => `$${v}`}
            tick={{ fontSize: 9, fill: "#d1d5db" }} tickLine={false} axisLine={false} width={42} />
          <Tooltip content={<TC />} contentStyle={TT} cursor={{ stroke: "#e2e8f0", strokeWidth: 1.5 }} />
          {currentRate > 0 && (
            <ReferenceLine y={currentRate} stroke="#6366f1" strokeDasharray="4 3" strokeWidth={1.5}
              label={{ value: "Your rate", position: "insideTopLeft", fontSize: 8, fill: "#6366f1", fontWeight: 700 }} />
          )}
          <Line type="monotone" dataKey="hourlyRate" stroke="#10b981" strokeWidth={2.5}
            dot={{ r: 3, fill: "#10b981", stroke: "white", strokeWidth: 2 }}
            activeDot={{ r: 5, fill: "#10b981", stroke: "white", strokeWidth: 2 }}
            isAnimationActive animationDuration={900} />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

/* --- cost breakdown chart ------------------------------------------------- */

function CostBreakdownChart({ data }: { data: { label: string; amount: number; pct: number; colorClass: string }[] }) {
  const TT = { backgroundColor: "transparent", border: "none", boxShadow: "none", padding: 0 };
  const COLORS: Record<string, string> = {
    "bg-emerald-400": "#34d399",
    "bg-red-400":     "#f87171",
    "bg-blue-400":    "#60a5fa",
    "bg-violet-400":  "#a78bfa",
    "bg-amber-400":   "#fbbf24",
    "bg-orange-400":  "#fb923c",
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const TC = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0]?.payload;
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-xl px-3 py-2 text-xs pointer-events-none">
        <p className="font-bold text-gray-700 mb-0.5">{d?.label}</p>
        <p className="font-black text-gray-900">${Math.round(d?.amount ?? 0)}/hr - {d?.pct}%</p>
      </div>
    );
  };
  const chartData = data.map((d) => ({ ...d, fill: COLORS[d.colorClass] ?? "#9ca3af" }));

  return (
    <motion.div variants={fadeUp} custom={4} className="rounded-xl border border-gray-100 bg-white p-4">
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">What each billed dollar covers</p>
      <ResponsiveContainer width="100%" height={Math.max(100, data.length * 28)}>
        <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 8, bottom: 0, left: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
          <XAxis type="number" tickFormatter={(v: number) => `$${v}`}
            tick={{ fontSize: 9, fill: "#9ca3af" }} tickLine={false} axisLine={false} />
          <YAxis type="category" dataKey="label"
            tick={{ fontSize: 9, fill: "#6b7280" }} tickLine={false} axisLine={false} width={88} />
          <Tooltip content={<TC />} contentStyle={TT} cursor={{ fill: "rgba(148,163,184,0.08)" }} />
          <Bar dataKey="amount" radius={[0, 4, 4, 0]} isAnimationActive animationDuration={700} maxBarSize={16}>
            {chartData.map((entry, i) => (
              <rect key={i} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
        {chartData.map((d) => (
          <span key={d.label} className="flex items-center gap-1 text-[10px] text-gray-500">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.fill }} />
            {d.label}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

/* ========================================================================== */

type RevealState = "idle" | "analyzing" | "revealed";

export default function FreelanceRateCalculator() {
  const [desiredIncome, setDesiredIncome] = useState(80000);
  const [expenses,      setExpenses]      = useState(12000);
  const [taxRate,       setTaxRate]       = useState(28);
  const [marginRate,    setMarginRate]    = useState(15);
  const [hoursPerWeek,  setHoursPerWeek]  = useState(40);
  const [weeksWorked,   setWeeksWorked]   = useState(48);
  const [utilization,   setUtilization]   = useState(70);
  const [platformFee,   setPlatformFee]   = useState(0);
  const [scopeCreep,    setScopeCreep]    = useState(20);
  const [currentRate,   setCurrentRate]   = useState(75);
  const [mode,          setMode]          = useState<FreelanceMode>("comfortable");

  const [revealState,   setRevealState]   = useState<RevealState>("idle");
  const [calcStep,      setCalcStep]      = useState(0);
  const [calcProgress,  setCalcProgress]  = useState(0);
  const [countUpActive, setCountUpActive] = useState(false);

  const result = calculateFreelanceRate({
    desiredAnnualIncome: desiredIncome,
    hoursPerWeek,
    weeksWorked,
    utilizationPct: utilization,
    annualBusinessExpenses: expenses,
    taxRatePct: taxRate,
    profitMarginPct: marginRate,
    currentHourlyRate: currentRate,
    platformFeePct: platformFee,
    scopeCreepBufferPct: scopeCreep,
    mode,
  });

  const handleCalculate = useCallback(() => {
    setRevealState("analyzing");
    setCalcStep(0);
    setCalcProgress(0);
    setCountUpActive(false);
    const dur = 380;
    CALC_STEPS.forEach((_, i) => {
      setTimeout(() => {
        setCalcStep(i);
        setCalcProgress(Math.round(((i + 1) / CALC_STEPS.length) * 100));
      }, i * dur);
    });
    setTimeout(() => {
      setRevealState("revealed");
      setCountUpActive(true);
    }, CALC_STEPS.length * dur + 100);
  }, []);

  const handleModeChange = (m: FreelanceMode) => {
    setMode(m);
    if (revealState === "revealed") {
      setCountUpActive(false);
      setTimeout(() => setCountUpActive(true), 50);
    }
  };

  const insights: { type: "positive" | "warning" | "neutral"; text: string }[] = [];

  if (result.isUndercharging) {
    const gap = Math.abs(Math.round(result.rateGap));
    insights.push({
      type: "warning",
      text: `$${gap}/hr undercharging gap - at $${Math.round(currentRate)}/hr you are missing ${fmtFull(result.annualIncomeGap)} annually.`,
    });
  } else {
    insights.push({
      type: "positive",
      text: `$${Math.round(result.rateGap)}/hr above minimum - your rate covers all costs with surplus in ${mode} mode.`,
    });
  }

  const nonBillableHrs = Math.round(result.totalHoursWorked - result.billableHoursPerYear);
  insights.push({
    type: "neutral",
    text: `${result.billableHoursPerYear} truly billable hours/yr - ${nonBillableHrs} hrs lost to admin, sales, and non-billable work at ${utilization}% utilization.`,
  });

  if (platformFee > 0) {
    insights.push({
      type: "neutral",
      text: `$${Math.round(result.platformFeePerHour)}/hr in platform fees - the ${platformFee}% cut means you need to gross ${fmt(result.requiredRevenueWithFees)} to net your target.`,
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[5fr_7fr] lg:gap-10">

      {/* INPUTS */}
      <div className="flex flex-col gap-5 lg:sticky lg:top-6 lg:self-start max-h-[90vh] overflow-y-auto pr-1">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5">

            <SectionLabel text="Income goal" sub="Your target take-home after all taxes" />
            <NumInput label="Desired annual income" prefix="$"
              hint="Personal take-home, not revenue"
              value={desiredIncome} onChange={setDesiredIncome} step={1000} min={10000} max={2000000} wide />

            <SectionLabel text="Business costs" sub="Annual overhead to earn back" />
            <NumInput label="Annual expenses" prefix="$"
              hint="Software, insurance, equipment, accountant"
              value={expenses} onChange={setExpenses} step={500} min={0} max={500000} wide />

            <SectionLabel text="Tax and profit buffer" />
            <RangeSliderCard
              label="Effective tax rate"
              hint="Self-employment approx 15.3% + income tax. Most freelancers: 25-35%"
              value={taxRate} min={0} max={55} step={1} unit="%" onChange={setTaxRate} />
            <RangeSliderCard
              label="Profit buffer"
              hint="Margin on top of costs for reinvestment and slow months"
              value={marginRate} min={0} max={50} step={1} unit="%" onChange={setMarginRate} />

            <SectionLabel text="Working time" sub="How much time you actually have to bill" />
            <div className="grid grid-cols-2 gap-3">
              <NumInput label="Hours / week" value={hoursPerWeek} onChange={setHoursPerWeek} step={1} min={1} max={80} />
              <NumInput label="Weeks worked" value={weeksWorked} onChange={setWeeksWorked} step={1} min={1} max={52} />
            </div>
            <RangeSliderCard
              label="Utilization rate"
              hint="% of working time you can actually bill. 50-70% is realistic; 100% is a myth"
              value={utilization} min={10} max={100} step={5} unit="%" onChange={setUtilization} />

            <SectionLabel text="Platform and scope" sub="Real-world deductions most freelancers ignore" />
            <RangeSliderCard
              label="Platform fee"
              hint="Upwork = 10-20%, Fiverr = 20%, direct = 0%"
              value={platformFee} min={0} max={30} step={1} unit="%" onChange={setPlatformFee} />
            <RangeSliderCard
              label="Scope creep buffer"
              hint="Add this % to cover unpaid revisions and scope changes"
              value={scopeCreep} min={0} max={50} step={5} unit="%" onChange={setScopeCreep} />

            <SectionLabel text="Comparison" />
            <NumInput label="Current hourly rate" prefix="$" suffix="/hr"
              hint="What you charge today"
              value={currentRate} onChange={setCurrentRate} step={5} min={0} max={5000} wide />

          </div>
        </div>

        <button
          type="button"
          onClick={handleCalculate}
          disabled={revealState === "analyzing"}
          className="w-full rounded-2xl bg-gray-950 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 text-base transition-all active:scale-[0.98] shadow-lg"
        >
          {revealState === "analyzing" ? "Calculating..." : revealState === "revealed" ? "Recalculate" : "Calculate my rate"}
        </button>

      </div>

      {/* RESULTS */}
      <div className="flex flex-col gap-5 min-h-100">
        <AnimatePresence mode="wait">
          {revealState === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorResultReveal
                message="Enter your details and click Calculate"
                subMessage="Your minimum viable rate, insights, and mode scenarios will appear here"
              />
            </motion.div>
          )}

          {revealState === "analyzing" && (
            <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorProgressLoader
                steps={CALC_STEPS}
                step={calcStep}
                progress={calcProgress}
                subtitle="Calculating your freelance rate"
              />
            </motion.div>
          )}

          {revealState === "revealed" && (
            <motion.div
              key="revealed"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-5"
            >
              {/* Mode selector */}
              <motion.div variants={fadeUp} custom={-1} className="flex gap-2">
                {(["survival", "comfortable", "premium"] as FreelanceMode[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => handleModeChange(m)}
                    className={"flex-1 rounded-xl border py-2.5 text-sm font-bold capitalize transition-all " +
                      (mode === m
                        ? "border-gray-900 bg-gray-950 text-white shadow-md"
                        : "border-gray-200 bg-white text-gray-500 hover:border-gray-300")}
                  >
                    {m}
                  </button>
                ))}
              </motion.div>

              <HeroRateCard result={result} mode={mode} countUpActive={countUpActive} />

              {insights.map((ins, i) => (
                <InsightCard key={i} type={ins.type} text={ins.text} index={i + 1} />
              ))}

              <ScenarioTable result={result} mode={mode} onModeChange={handleModeChange} />

              <UtilizationChart data={result.utilizationImpact} currentRate={currentRate} />
              <CostBreakdownChart data={result.costBreakdown} />

              <motion.div variants={fadeUp} custom={5}>
                <CalcDisclaimer />
              </motion.div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
