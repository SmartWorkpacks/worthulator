"use client";

import {
  useState, useMemo, useId, lazy, Suspense,
  useEffect, useRef, useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AreaChart, Area, BarChart, Bar, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import {
  rentVsBuyConfig,
  calcRentVsBuy,
  generateKeyFindings,
  type RentVsBuyInputs,
  type RentVsBuySummary,
  type RentVsBuyYearRow,
} from "@/lib/configs/rentVsBuyConfig";

const RentVsBuyChartsPanel = lazy(() => import("./RentVsBuyCharts"));

// â”€â”€â”€ Types & constants â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
type RevealState = "idle" | "analyzing" | "revealed";

const ANALYSIS_STEPS = [
  { label: "Calculating your mortgage trajectory...",   emoji: "\u{1F3E0}" },
  { label: "Projecting 30 years of equity growth...",   emoji: "\u{1F4C8}" },
  { label: "Modelling investment compounding...",       emoji: "\u{1F4B9}" },
  { label: "Comparing long-term wealth outcomes...",    emoji: "\u2696\uFE0F" },
  { label: "Crafting your personalised insights...",    emoji: "\u{1F4A1}" },
];

const MILESTONE_YEARS: number[] = [1, 3, 5, 10, 15, 20, 30];

// â”€â”€â”€ Framer Motion variants â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.13, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
  exit: { opacity: 0, y: -12, transition: { duration: 0.25 } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

// â”€â”€â”€ Formatting helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const safeFmt = (n: number | undefined | null) =>
  (n ?? 0).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const safeK = (n: number | undefined | null) => {
  const v = n ?? 0;
  const abs = Math.abs(v);
  if (abs >= 1_000_000) return "$" + (v / 1_000_000).toFixed(1) + "M";
  if (abs >= 1_000) return "$" + Math.round(v / 1_000) + "k";
  return safeFmt(v);
};

// â”€â”€â”€ Count-up animation hook â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function useCountUp(target: number, active: boolean, duration = 1200) {
  const [val, setVal] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) { setVal(target); return; }
    startRef.current = null;
    setVal(0);
    const abs = Math.abs(target);
    const sign = target < 0 ? -1 : 1;
    const tick = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const p = Math.min((ts - startRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setVal(Math.round(eased * abs) * sign);
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, active, duration]);

  return val;
}

// â”€â”€â”€ Shared UI atoms â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
          (prefix ? "pl-7 " : "pl-4 ") +
          (suffix ? "pr-16" : "pr-4")
        }
      />
      {suffix && (
        <span className="pointer-events-none absolute right-3 text-sm text-gray-400 select-none whitespace-nowrap">
          {suffix}
        </span>
      )}
    </div>
  );
}

function ResultRow({ label, value, highlight = false, sub }: {
  label: string; value: string; highlight?: boolean; sub?: string;
}) {
  return (
    <div className={"flex items-start justify-between py-2.5" + (highlight ? " font-semibold" : "")}>
      <span className={"text-sm " + (highlight ? "text-gray-800" : "text-gray-500")}>{label}</span>
      <div className="text-right ml-3">
        <span className={"text-sm tabular-nums " + (highlight ? "text-emerald-700" : "text-gray-700")}>
          {value}
        </span>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// â”€â”€â”€ Analysis phase â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function AnalysisPhase({ step, progress, yearsToStay }: { step: number; progress: number; yearsToStay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.03, transition: { duration: 0.3 } }}
      className="relative flex flex-col items-center justify-center py-20 px-6 bg-linear-to-br from-gray-950 via-gray-900 to-gray-950 rounded-2xl text-white overflow-hidden"
    >
      {/* Green glow */}
      <div
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 70%, #10b981 0%, transparent 65%)" }}
      />

      <div className="relative mb-7 z-10">
        {/* Spinning ring */}
        <div
          className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-emerald-400 animate-spin"
          style={{ animationDuration: "0.85s" }}
        />
        {/* W logo — flashing pulse */}
        <motion.div
          className="w-24 h-24 rounded-full border-2 border-white/10 flex items-center justify-center bg-white/5"
          animate={{ opacity: [1, 0.35, 1] }}
          transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="44" height="44" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M2 3L6 13L8 7L10 13L14 3"
              stroke="#34d399"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </div>

      <motion.p
        key={"label" + step}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 text-xl font-bold text-center text-white mb-2"
      >
        {ANALYSIS_STEPS[step]?.label ?? "Analysing..."}
      </motion.p>

      <p className="relative z-10 text-sm text-white/40 mb-10 text-center">
        Building your personalised {yearsToStay}-year financial model
      </p>

      <div className="relative z-10 w-full max-w-xs">
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, #10b981, #2dd4bf)" }}
            animate={{ width: progress + "%" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[10px] text-white/30">{Math.round(progress)}% complete</span>
          <span className="text-[10px] text-white/30">Step {step + 1} / {ANALYSIS_STEPS.length}</span>
        </div>
      </div>

      <div className="relative z-10 flex gap-2 mt-8">
        {ANALYSIS_STEPS.map((_, i) => (
          <motion.div
            key={i}
            animate={{
              width: i < step ? 20 : i === step ? 32 : 12,
              backgroundColor: i <= step ? "#34d399" : "rgba(255,255,255,0.15)",
            }}
            transition={{ duration: 0.3 }}
            style={{ height: 6, borderRadius: 3 }}
          />
        ))}
      </div>
    </motion.div>
  );
}

// â”€â”€â”€ Idle teaser â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function IdleTeaser() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative p-10 flex flex-col items-center justify-center gap-6 bg-linear-to-br from-gray-950 to-gray-900 rounded-2xl text-center overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 30%, #10b981 0%, transparent 60%)" }}
      />

      <div className="relative z-10">
        <p className="text-xl font-bold text-white">Your results will appear here</p>
        <p className="text-sm text-white/50 mt-2 max-w-sm leading-relaxed">
          Fill in your numbers and hit Calculate to see a full 30-year comparison.
        </p>
      </div>

      <div className="relative z-10 flex flex-wrap justify-center gap-2">
        {["Net worth projection", "Break-even year", "Insights"].map((t) => (
          <span
            key={t}
            className="flex items-center gap-1.5 bg-white/5 border border-white/10 text-white/60 rounded-full px-3 py-1.5 text-xs font-medium"
          >
            {t}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

// â”€â”€â”€ Insight card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function InsightCard({
  type, text, index = 0,
}: {
  type: "positive" | "warning" | "neutral"; text: string; index?: number;
}) {
  // Extract a leading dollar/number stat if present (e.g. "$45k", "3 years")
  const statMatch = text.match(/^([^—–.]+?[\$\d][\w,%.k]+)/);
  const stat = statMatch ? statMatch[1].trim() : null;
  const body = stat ? text.slice(stat.length).replace(/^[\s—–,]+/, "") : text;

  const s = {
    positive: { wrap: "border-emerald-100 bg-white", bar: "bg-emerald-500", stat: "text-emerald-700", body: "text-gray-600" },
    warning:  { wrap: "border-red-100 bg-red-50",   bar: "bg-red-500",    stat: "text-red-700",   body: "text-red-700" },
    neutral:  { wrap: "border-blue-100   bg-white", bar: "bg-blue-400",    stat: "text-blue-700",   body: "text-gray-600" },
  }[type];

  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      className={"flex items-stretch gap-0 rounded-xl border overflow-hidden " + s.wrap}
    >
      <div className={"w-1 shrink-0 " + s.bar} />
      <div className="flex-1 px-4 py-3.5">
        {stat && (
          <p className={"text-base font-black tabular-nums mb-0.5 " + s.stat}>{stat}</p>
        )}
        <p className={"text-sm leading-relaxed " + s.body}>{body}</p>
      </div>
    </motion.div>
  );
}

// â”€â”€â”€ Continuation hook â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function ContinuationHook({
  question, cta, onClick,
}: {
  question: string; cta: string; onClick?: () => void;
}) {
  return (
    <motion.div variants={fadeUp} className="flex flex-col items-center gap-3 py-4 text-center">
      <p className="text-sm text-gray-400 max-w-xs leading-relaxed">{question}</p>
      {onClick && (
        <button
          onClick={onClick}
          className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-5 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300 transition-all group"
        >
          <span>{cta}</span>
          <svg className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" viewBox="0 0 14 14" fill="none">
            <path d="M3 7h8M8 3.5L11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      )}
    </motion.div>
  );
}

// â”€â”€â”€ Hero result card â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// ─── Scenario flip explorer ─────────────────────────────────────────────────
function ScenarioFlips({ inputs, summary }: { inputs: RentVsBuyInputs; summary: RentVsBuySummary }) {
  const [active, setActive] = useState<number | null>(null);

  const scenarios = useMemo(() => [
    {
      icon: "📉",
      label: "Rate drops 1%",
      desc: `Mortgage rate ${inputs.mortgageRate}% → ${(inputs.mortgageRate - 1).toFixed(1)}%`,
      mod: { mortgageRate: Math.max(0.1, inputs.mortgageRate - 1) },
    },
    {
      icon: "🐂📈",
      label: "Bull market",
      desc: (() => {
        const base = inputs.investmentReturnPct > 0 ? inputs.investmentReturnPct : 7;
        const bull = Math.min(base + 3, 13);
        return `Returns run hot at ${bull}%/yr — S&P bull cycle avg. How much does this shift the renter's wealth?`;
      })(),
      mod: { investmentReturnPct: Math.min((inputs.investmentReturnPct > 0 ? inputs.investmentReturnPct : 7) + 3, 13) },
    },
    {
      icon: "💰",
      label: "5% more down",
      desc: `Down payment ${inputs.downPaymentPct}% → ${Math.min(95, inputs.downPaymentPct + 5)}%`,
      mod: { downPaymentPct: Math.min(95, inputs.downPaymentPct + 5) },
    },
  ], [inputs]);

  const altSummaries = useMemo(
    () => scenarios.map(s => calcRentVsBuy({ ...inputs, ...s.mod })),
    [scenarios, inputs],
  );

  const activeSummary = active !== null ? altSummaries[active] : null;

  return (
    <motion.div variants={fadeUp} custom={1} className="rounded-xl border border-gray-100 bg-white overflow-hidden">
      <div className="px-4 pt-4 pb-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">
          Explore &quot;what if?&quot; scenarios
        </p>
        <div className="flex gap-2">
          {scenarios.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(active === i ? null : i)}
              className={
                "flex-1 rounded-xl border py-2.5 px-2 text-center transition-all " +
                (active === i
                  ? "border-emerald-400 bg-emerald-50"
                  : "border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100")
              }
            >
              <span className="block text-xl mb-1">{s.icon}</span>
              <span className={"block text-[11px] font-bold leading-tight " + (active === i ? "text-emerald-800" : "text-gray-700")}>
                {s.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeSummary && active !== null && (
          <motion.div
            key={active}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-gray-100">
              <p className="text-[10px] text-gray-400 mt-3 mb-3">{scenarios[active].desc}</p>
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-lg bg-gray-50 p-3 text-center">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">Buying</p>
                  <p className="text-sm font-black text-gray-900">{safeK(activeSummary.buyNetWorth)}</p>
                  <p className={"text-[9px] font-semibold mt-0.5 " + (activeSummary.buyNetWorth >= summary.buyNetWorth ? "text-emerald-600" : "text-red-500")}>
                    {activeSummary.buyNetWorth >= summary.buyNetWorth ? "+" : ""}
                    {safeK(activeSummary.buyNetWorth - summary.buyNetWorth)}
                  </p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3 text-center">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-1">Renting</p>
                  <p className="text-sm font-black text-gray-900">{safeK(activeSummary.rentNetWorth)}</p>
                  <p className={"text-[9px] font-semibold mt-0.5 " + (activeSummary.rentNetWorth >= summary.rentNetWorth ? "text-emerald-600" : "text-red-500")}>
                    {activeSummary.rentNetWorth >= summary.rentNetWorth ? "+" : ""}
                    {safeK(activeSummary.rentNetWorth - summary.rentNetWorth)}
                  </p>
                </div>
                <div className={"rounded-lg border p-3 text-center flex flex-col justify-center " +
                  (activeSummary.winner !== summary.winner ? "bg-amber-50 border-amber-200" : "bg-emerald-50 border-emerald-100")}>
                  <p className={"text-[9px] font-bold uppercase tracking-widest mb-1 " +
                    (activeSummary.winner !== summary.winner ? "text-amber-600" : "text-emerald-600")}>
                    {activeSummary.winner !== summary.winner ? "Flips!" : "Impact"}
                  </p>
                  <p className={"text-[10px] font-bold leading-tight " +
                    (activeSummary.winner !== summary.winner ? "text-amber-800" : "text-gray-700")}>
                    {activeSummary.winner !== summary.winner
                      ? `${activeSummary.winner === "buy" ? "Buying" : "Renting"} now wins`
                      : (() => {
                          // d = change in (buyNetWorth − rentNetWorth)
                          // d > 0 → buying improved relative to renting → benefits buyer
                          // d < 0 → renting improved relative to buying → benefits renter
                          const d = (activeSummary.netWorthDelta ?? 0) - (summary.netWorthDelta ?? 0);
                          const beneficiary = d >= 0 ? "buyer" : "renter";
                          return "+" + safeK(Math.abs(d)) + " to " + beneficiary;
                        })()
                    }
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Local estimate CTA (progressive lead capture) ────────────────────────
// ─── Premium personalised insights lead capture ───────────────────────────────
// idle → form → sending → done
// Single comprehensive form: phone in primary tier, optional qualification fields
// "More detail = more personalised insights" collaboration psychology
// GDPR/CCPA: unticked consent checkbox, explicit partner disclosure, privacy link
function LocalEstimateCTA({ summary, inputs }: { summary: RentVsBuySummary; inputs: RentVsBuyInputs }) {
  type Stage = "idle" | "form" | "sending" | "done";
  const [stage, setStage] = useState<Stage>("idle");

  // Primary fields
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [zip,     setZip]     = useState("");
  const [phone,   setPhone]   = useState("");
  const [consent, setConsent] = useState(false);

  // Optional qualification fields
  const [timeline,       setTimeline]       = useState("");
  const [firstTimeBuyer, setFirstTimeBuyer] = useState<"yes" | "no" | null>(null);
  const [budget,         setBudget]         = useState("");

  const winner = summary.winner;
  const delta  = safeK(Math.abs(summary.netWorthDelta ?? 0));

  const contextLine =
    winner === "buy"
      ? `Your numbers point to buying winning by ~${delta} — local rates and costs in your area could shift that significantly.`
      : winner === "rent"
      ? `Your numbers favour renting by ~${delta} — though local market conditions may tell a different story.`
      : `This is genuinely close. Local pricing, taxes, and market trends could tip it either way.`;

  // Live personalisation level — gives users clear feedback that more = better
  // 0 = Standard, 1 = Personalised (phone filled), 2 = Advanced (any optional qualifier filled)
  const insightLevel =
    (timeline || firstTimeBuyer || budget) ? 2 :
    phone.trim()                           ? 1 : 0;

  const insightLevelLabels = ["Standard insights", "Personalised insights", "Advanced insights"] as const;
  const insightLevelColors = ["text-gray-400", "text-amber-500", "text-emerald-600"] as const;

  // Capture any UTM params present in the URL
  function getUtms(): Record<string, string> {
    if (typeof window === "undefined") return {};
    const p = new URLSearchParams(window.location.search);
    const out: Record<string, string> = {};
    for (const k of ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"]) {
      const v = p.get(k);
      if (v) out[k] = v;
    }
    return out;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !zip || !consent) return;
    const consentTs = new Date().toISOString();
    setStage("sending");
    await Promise.all([
      fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calculator_type:   "rent-vs-buy",
          name:              name  || undefined,
          email,
          phone:             phone || undefined,
          location:          { postcode: zip },
          estimated_cost:    Math.abs(summary.netWorthDelta ?? 0),
          inputs: {
            homePrice:      inputs.homePrice,
            mortgageRate:   inputs.mortgageRate,
            yearsToStay:    inputs.yearsToStay,
            monthlyRent:    inputs.monthlyRent,
            timeline:       timeline       || undefined,
            firstTimeBuyer: firstTimeBuyer ?? undefined,
            budgetRange:    budget         || undefined,
          },
          results: {
            winner,
            netWorthDelta: summary.netWorthDelta,
            breakEvenYear: summary.breakEvenYear,
          },
          metadata: {
            source:            "mortgage-insights",
            insight_level:     insightLevelLabels[insightLevel],
            consent_timestamp: consentTs,
            consent_text:      "I agree to the Privacy Policy and Terms and consent to being contacted by Worthulator and selected mortgage or housing partners regarding relevant products and services.",
            page:              typeof window !== "undefined" ? window.location.pathname : undefined,
            referrer:          typeof document !== "undefined" ? (document.referrer || undefined) : undefined,
            ...getUtms(),
          },
          marketing_consent: true,
        }),
      }).catch(() => {}),
      new Promise<void>(r => setTimeout(r, 1600)),
    ]);
    setStage("done");
  }

  // ── Idle ──────────────────────────────────────────────────────────────────
  if (stage === "idle") {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
        <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-1.5">
              Personalised mortgage insights
            </p>
            <p className="text-sm font-semibold text-gray-900 leading-snug">
              Want more personalised mortgage insights?
            </p>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              {contextLine}
            </p>
          </div>
          <button
            onClick={() => setStage("form")}
            className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-gray-950 hover:bg-gray-800 active:scale-95 px-5 py-2.5 text-sm font-bold text-white transition-all group"
          >
            Get personalised insights
            <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" viewBox="0 0 14 14" fill="none">
              <path d="M3 7h8M8 3.5L11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  // ── Form ──────────────────────────────────────────────────────────────────
  if (stage === "form") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-2xl border border-gray-200 bg-white overflow-hidden"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100">
          <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-1">
            Personalised mortgage insights
          </p>
          <p className="text-sm font-semibold text-gray-900">
            Want more personalised mortgage insights?
          </p>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            See local rates, affordability trends, and financing options tailored to your scenario.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">

          {/* Primary fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                First name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Alex"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-400/15 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-400/15 transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                ZIP / postcode
              </label>
              <input
                type="text"
                required
                value={zip}
                onChange={e => setZip(e.target.value)}
                placeholder="e.g. 90210"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-400/15 transition"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                Phone number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+1 555 000 0000"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-400/15 transition"
              />
            </div>
          </div>

          {/* Optional qualifier section — "more = better" framing */}
          <div className="rounded-xl border border-gray-100 bg-gray-50/60 px-4 py-4 space-y-3.5">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Optional — the more you share, the more tailored your insights
              </p>
              {/* Live personalisation level indicator */}
              <div className="flex items-center gap-1.5 shrink-0 ml-3">
                {[0, 1, 2].map(lvl => (
                  <motion.span
                    key={lvl}
                    className={
                      "block w-2 h-2 rounded-full transition-colors duration-300 " +
                      (insightLevel >= lvl ? "bg-emerald-500" : "bg-gray-200")
                    }
                    animate={{ scale: insightLevel === lvl ? [1, 1.25, 1] : 1 }}
                    transition={{ duration: 0.35 }}
                  />
                ))}
                <span className={
                  "text-[10px] font-semibold ml-1 transition-colors duration-300 " +
                  insightLevelColors[insightLevel]
                }>
                  {insightLevelLabels[insightLevel]}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                  When are you planning to move?
                </label>
                <div className="relative">
                  <select
                    value={timeline}
                    onChange={e => setTimeline(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/15 transition appearance-none pr-8"
                  >
                    <option value="">Select timeline…</option>
                    <option value="ready-now">Ready to buy now</option>
                    <option value="3-6-months">Within 3–6 months</option>
                    <option value="6-12-months">6–12 months</option>
                    <option value="1-2-years">1–2 years</option>
                    <option value="researching">Just researching</option>
                  </select>
                  <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" viewBox="0 0 14 14" fill="none">
                    <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                  Estimated budget range
                </label>
                <div className="relative">
                  <select
                    value={budget}
                    onChange={e => setBudget(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/15 transition appearance-none pr-8"
                  >
                    <option value="">Select range…</option>
                    <option value="under-300k">Under $300k</option>
                    <option value="300k-500k">$300k – $500k</option>
                    <option value="500k-750k">$500k – $750k</option>
                    <option value="750k-1m">$750k – $1M</option>
                    <option value="over-1m">Over $1M</option>
                  </select>
                  <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" viewBox="0 0 14 14" fill="none">
                    <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 mb-1.5">First-time buyer?</p>
              <div className="flex gap-2">
                {(["yes", "no"] as const).map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setFirstTimeBuyer(val === firstTimeBuyer ? null : val)}
                    className={
                      "flex-1 sm:flex-none rounded-xl border px-5 py-2 text-sm font-semibold transition-all " +
                      (firstTimeBuyer === val
                        ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                        : "border-gray-200 bg-white text-gray-600 hover:border-gray-300")
                    }
                  >
                    {val === "yes" ? "Yes" : "No"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Consent — unticked by default, explicit partner disclosure (GDPR/CCPA) */}
          <label className="flex items-start gap-3 cursor-pointer group pt-1">
            <div className="mt-0.5 shrink-0">
              <input
                type="checkbox"
                checked={consent}
                onChange={e => setConsent(e.target.checked)}
                className="w-4 h-4 rounded border border-gray-300 accent-emerald-600 cursor-pointer"
              />
            </div>
            <span className="text-[11px] text-gray-500 leading-relaxed group-hover:text-gray-700 transition select-none">
              I agree to the{" "}
              <a href="/privacy" className="underline hover:text-emerald-600 transition" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
              {" "}and{" "}
              <a href="/terms" className="underline hover:text-emerald-600 transition" target="_blank" rel="noopener noreferrer">Terms</a>
              {" "}and consent to being contacted by Worthulator and selected mortgage or housing partners regarding relevant products and services.
            </span>
          </label>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={!consent || !email || !zip}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 px-6 py-2.5 text-sm font-bold text-white transition-all"
            >
              Get my insights
              <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M8 3.5L11.5 7 8 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => setStage("idle")}
              className="text-xs text-gray-400 hover:text-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    );
  }

  // ── Sending — premium preparing state ─────────────────────────────────────
  if (stage === "sending") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="rounded-2xl border border-gray-200 bg-white overflow-hidden"
      >
        <div className="px-6 py-10 flex flex-col items-center gap-5 text-center">
          <div className="relative flex items-center justify-center w-14 h-14">
            <span className="absolute inset-0 rounded-full bg-emerald-100 animate-ping opacity-50" />
            <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500">
              <svg className="w-5 h-5 text-white" viewBox="0 0 20 20" fill="none">
                <path d="M3.5 10.5l4.5 4.5 8.5-9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Preparing your personalised insights…</p>
            <p className="text-xs text-gray-400 mt-1">Pulling local rate data, area trends, and your scenario details</p>
          </div>
          <div className="flex gap-1.5">
            {[0, 1, 2].map(i => (
              <motion.span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-emerald-400"
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.22, ease: "easeInOut" }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    );
  }

  // ── Done ──────────────────────────────────────────────────────────────────
  const localInsights = [
    {
      icon: "📍",
      label: "Local market context",
      text: `We're pulling property trends for ZIP ${zip}. Expect regional appreciation rates and local cost-of-living adjustments in your summary.`,
    },
    {
      icon: "📉",
      label: "Current rate environment",
      text: `30-year fixed rates are at ${inputs.mortgageRate}%. Historically, anything above 6.5% meaningfully extends your break-even timeline.`,
    },
    {
      icon: "🏠",
      label: "Your scenario",
      text: winner === "buy"
        ? `At ${inputs.yearsToStay} years, buying appears stronger by ~${delta}. Local appreciation variance of ±1% could shift this by $20–40k.`
        : winner === "rent"
        ? `Renting leads by ~${delta} at ${inputs.yearsToStay} years in this model. In high-appreciation markets, that gap narrows significantly.`
        : `Your scenario is a genuine toss-up. Local market dynamics — which vary widely by ZIP — are the deciding factor here.`,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-emerald-100 bg-white overflow-hidden"
    >
      <div className="px-6 py-5 bg-emerald-50 border-b border-emerald-100 flex items-center gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white text-sm">✓</span>
        <div>
          <p className="text-sm font-bold text-emerald-900">
            {name ? `Thanks, ${name.split(" ")[0]}` : "You're all set"} — your {insightLevelLabels[insightLevel].toLowerCase()} are on their way
          </p>
          <p className="text-xs text-emerald-700/70 mt-0.5">
            Sent to {email} · Handled per our{" "}
            <a href="/privacy" className="underline opacity-70 hover:opacity-100 transition" target="_blank" rel="noopener noreferrer">privacy policy</a>.
          </p>
        </div>
      </div>
      <div className="divide-y divide-gray-100">
        {localInsights.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.12, duration: 0.4, ease: "easeOut" }}
            className="flex items-start gap-3 px-6 py-4"
          >
            <span className="text-xl shrink-0 mt-0.5">{item.icon}</span>
            <div>
              <p className="text-xs font-bold text-gray-700 mb-0.5">{item.label}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{item.text}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function HeroResultCard({
  summary, inputs, countUpActive,
}: {
  summary: RentVsBuySummary;
  inputs: RentVsBuyInputs;
  countUpActive: boolean;
}) {
  const delta  = useCountUp(Math.abs(summary.netWorthDelta ?? 0), countUpActive, 1400);
  const buyNW  = useCountUp(summary.buyNetWorth  ?? 0, countUpActive, 1200);
  const rentNW = useCountUp(summary.rentNetWorth ?? 0, countUpActive, 1200);

  const isBuy  = summary.winner === "buy";
  const isRent = summary.winner === "rent";
  const yrs    = inputs.yearsToStay;

  const gradFrom    = "#0d1117";
  const gradTo      = "#161b22";
  const accentColor = isBuy ? "#34d399" : isRent ? "#34d399" : "#9ca3af";

  const headline = isBuy
    ? "Buying could leave you " + safeK(delta) + " wealthier"
    : isRent
    ? "Renting could leave you " + safeK(delta) + " ahead"
    : "Both paths end up roughly equal";

  return (
    <motion.div
      variants={fadeUp}
      custom={0}
      className="relative rounded-2xl overflow-hidden text-white shadow-2xl"
      style={{ background: "linear-gradient(135deg, " + gradFrom + " 0%, " + gradTo + " 100%)" }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 30% 50%, " + accentColor + " 0%, transparent 60%)" }}
      />

      {/* Live pulse */}
      <div className="absolute top-5 right-5 flex items-center gap-2 z-10">
        <span className="relative flex h-2.5 w-2.5">
          <span
            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
            style={{ backgroundColor: accentColor }}
          />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5" style={{ backgroundColor: accentColor }} />
        </span>
        <span
          className="text-[10px] font-bold uppercase tracking-widest"
          style={{ color: accentColor }}
        >
          Live
        </span>
      </div>

      <div className="relative z-10 p-6 sm:p-8">
        {/* Headline */}
        <div className="mb-6 sm:mb-8">
          <p
            className="text-xs font-bold uppercase tracking-[0.2em] mb-3"
            style={{ color: accentColor + "bb" }}
          >
            {yrs}-year analysis complete
          </p>
          <h2 className="text-3xl sm:text-5xl font-black leading-tight text-white max-w-lg">
            {headline}
          </h2>
          <p className="text-base sm:text-lg font-semibold mt-2" style={{ color: accentColor + "99" }}>
            after {yrs} year{yrs !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Net worth cards */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-5">
            <p
              className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest mb-2"
              style={{ color: accentColor + "80" }}
            >
              Buying
            </p>
            <p className="text-xl sm:text-3xl font-black tabular-nums leading-none">{safeK(buyNW)}</p>
            <p className="text-[9px] sm:text-[10px] mt-1.5" style={{ color: accentColor + "60" }}>net worth</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-5">
            <p
              className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest mb-2"
              style={{ color: accentColor + "80" }}
            >
              Renting
            </p>
            <p className="text-xl sm:text-3xl font-black tabular-nums leading-none">{safeK(rentNW)}</p>
            <p className="text-[9px] sm:text-[10px] mt-1.5" style={{ color: accentColor + "60" }}>net worth</p>
          </div>

          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 sm:p-5 flex flex-col justify-center">
            <p
              className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest mb-2"
              style={{ color: accentColor + "80" }}
            >
              {summary.winner === "tie" ? "Result" : "Advantage"}
            </p>
            <p
              className="text-2xl sm:text-4xl font-black tabular-nums leading-none"
              style={{ color: accentColor }}
            >
              {summary.winner === "tie" ? "~" : safeK(delta)}
            </p>
            <p className="text-[10px] sm:text-xs font-bold mt-1.5" style={{ color: accentColor }}>
              {isBuy ? "\u2191 Buying wins" : isRent ? "\u2191 Renting wins" : "~ Tied"}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// â”€â”€â”€ Wealth race chart â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function WealthRaceChart({
  schedule, yearsToStay,
}: {
  schedule: RentVsBuyYearRow[];
  yearsToStay: number;
  winner: "buy" | "rent" | "tie";
}) {
  const data = schedule.filter((r) => r.year <= Math.max(yearsToStay, 10));
  if (data.length < 2) return null;

  const chartData = data.map((d) => ({
    year:  d.year,
    buy:   Math.round(d.buyNetWorth ?? 0),
    rent:  Math.round(d.rentNetWorth ?? 0),
    delta: Math.round(d.netWorthDelta ?? 0),
  }));

  let crossoverYear: number | null = null;
  for (let i = 1; i < chartData.length; i++) {
    if ((chartData[i - 1].buy >= chartData[i - 1].rent) !== (chartData[i].buy >= chartData[i].rent)) {
      crossoverYear = chartData[i].year;
      break;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const AreaTooltipContent = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    const buy   = payload.find((p: { dataKey: string }) => p.dataKey === "buy")?.value  ?? 0;
    const rent  = payload.find((p: { dataKey: string }) => p.dataKey === "rent")?.value ?? 0;
    const delta = buy - rent;
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-xl px-3 py-2.5 text-xs min-w-32 pointer-events-none">
        <p className="font-bold text-gray-700 mb-1.5 text-[11px]">Year {label}</p>
        <div className="flex items-center gap-2 mb-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
          <span className="text-gray-400">Buy</span>
          <span className="font-bold text-emerald-700 ml-auto tabular-nums">{safeK(buy)}</span>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shrink-0" />
          <span className="text-gray-400">Rent</span>
          <span className="font-bold text-blue-600 ml-auto tabular-nums">{safeK(rent)}</span>
        </div>
        <div className={`flex items-center gap-1.5 pt-1.5 border-t border-gray-100 text-[11px] font-bold ${delta >= 0 ? "text-emerald-700" : "text-blue-600"}`}>
          <span>{delta >= 0 ? "\u25B2" : "\u25BC"}</span>
          <span>{delta >= 0 ? "Buy" : "Rent"} +{safeK(Math.abs(delta))}</span>
        </div>
      </div>
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const BarTooltipContent = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    const delta = payload[0]?.value ?? 0;
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-xl px-3 py-2 text-xs pointer-events-none">
        <p className="font-bold text-gray-600 text-[11px] mb-0.5">Year {label}</p>
        <p className={`font-black text-sm ${delta >= 0 ? "text-emerald-600" : "text-blue-600"}`}>
          {delta >= 0 ? "Buy" : "Rent"} +{safeK(Math.abs(delta))}
        </p>
      </div>
    );
  };

  const tickFmt = (v: number) => safeK(v);
  const TT_STYLE = { backgroundColor: "transparent", border: "none", boxShadow: "none", padding: 0 };

  return (
    <motion.div variants={fadeUp} custom={1} className="space-y-3">
      <div className="flex items-center gap-3">
        <p className="text-sm font-semibold text-gray-800">Wealth comparison</p>
        <div className="flex gap-3 text-xs font-medium ml-auto">
          <span className="flex items-center gap-1.5 text-emerald-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" /> Buy
          </span>
          <span className="flex items-center gap-1.5 text-blue-500">
            <span className="h-2 w-2 rounded-full bg-blue-400 shrink-0" /> Rent
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[3fr_2fr] gap-3">
        {/* Net worth trajectory */}
        <div className="rounded-xl border border-gray-100 bg-white p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Net worth trajectory</p>
          <ResponsiveContainer width="100%" height={188}>
            <AreaChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: 4 }}>
              <defs>
                <linearGradient id="rcBuy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10b981" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="rcRent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#60a5fa" stopOpacity={0.20} />
                  <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis
                dataKey="year"
                tickFormatter={(v: number) => `yr${v}`}
                tick={{ fontSize: 9, fill: "#9ca3af" }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tickFormatter={tickFmt}
                tick={{ fontSize: 9, fill: "#d1d5db" }}
                tickLine={false}
                axisLine={false}
                width={38}
              />
              <Tooltip
                content={<AreaTooltipContent />}
                contentStyle={TT_STYLE}
                cursor={{ stroke: "#e2e8f0", strokeWidth: 1.5 }}
              />
              <ReferenceLine
                x={yearsToStay}
                stroke="#6366f1"
                strokeDasharray="4 3"
                strokeWidth={1.5}
                label={{ value: "EXIT", position: "insideTopLeft", fontSize: 8, fill: "#6366f1", fontWeight: 700 }}
              />
              {crossoverYear !== null && (
                <ReferenceLine x={crossoverYear} stroke="#f59e0b" strokeDasharray="2 2" strokeWidth={1} />
              )}
              <Area type="monotone" dataKey="rent" stroke="#60a5fa" strokeWidth={2} fill="url(#rcRent)"
                dot={false} activeDot={{ r: 4, fill: "#60a5fa", stroke: "white", strokeWidth: 2 }}
                isAnimationActive animationDuration={1400} animationEasing="ease-in-out" />
              <Area type="monotone" dataKey="buy" stroke="#10b981" strokeWidth={2.5} fill="url(#rcBuy)"
                dot={false} activeDot={{ r: 4.5, fill: "#10b981", stroke: "white", strokeWidth: 2 }}
                isAnimationActive animationDuration={1400} animationEasing="ease-in-out" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Who's ahead bar chart */}
        <div className="rounded-xl border border-gray-100 bg-white p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Who&apos;s ahead, year by year</p>
          <ResponsiveContainer width="100%" height={168}>
            <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
              <XAxis
                dataKey="year"
                tickFormatter={(v: number) => `yr${v}`}
                tick={{ fontSize: 9, fill: "#9ca3af" }}
                tickLine={false}
                axisLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tickFormatter={tickFmt}
                tick={{ fontSize: 9, fill: "#d1d5db" }}
                tickLine={false}
                axisLine={false}
                width={38}
              />
              <Tooltip
                content={<BarTooltipContent />}
                contentStyle={TT_STYLE}
                cursor={{ fill: "rgba(148,163,184,0.08)" }}
              />
              <ReferenceLine y={0} stroke="#e5e7eb" strokeWidth={1.5} />
              <Bar dataKey="delta" radius={[2, 2, 0, 0]} isAnimationActive animationDuration={800} animationEasing="ease-out" maxBarSize={28}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={entry.delta >= 0 ? "#34d399" : "#93c5fd"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-2 justify-center text-[10px] font-semibold">
            <span className="flex items-center gap-1.5 text-emerald-700">
              <span className="h-2.5 w-2.5 rounded-sm bg-emerald-400 shrink-0" /> Buying ahead
            </span>
            <span className="flex items-center gap-1.5 text-blue-600">
              <span className="h-2.5 w-2.5 rounded-sm bg-blue-300 shrink-0" /> Renting ahead
            </span>
          </div>
        </div>
      </div>

      {crossoverYear !== null && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5 }}
          className="flex items-center gap-2.5 text-xs text-amber-800 bg-amber-50 border border-amber-100 rounded-xl px-3.5 py-2.5"
        >
          <span className="shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-amber-200 text-amber-700 text-[10px] font-bold">~</span>
          Crossover at year {crossoverYear} &mdash; that&apos;s when buying overtakes renting in net worth
        </motion.div>
      )}
    </motion.div>
  );
}


// â”€â”€â”€ Wealth race chart â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€



// â”€â”€â”€ What-if slider â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function WhatIfSlider({
  label, value, onChange, min, max, step, suffix, baseValue,
}: {
  label: string; value: number; onChange: (v: number) => void;
  min: number; max: number; step: number; suffix: string; baseValue?: number;
}) {
  const pct  = ((value - min) / (max - min)) * 100;
  const diff = baseValue !== undefined ? value - baseValue : null;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">{label}</span>
        <div className="flex items-center gap-2">
          {diff !== null && Math.abs(diff) > 0.01 && (
            <span
              className={
                "text-[10px] font-semibold px-1.5 py-0.5 rounded " +
                (diff > 0 ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700")
              }
            >
              {diff > 0 ? "+" : ""}{diff.toFixed(step < 1 ? 2 : 1)}{suffix}
            </span>
          )}
          <span className="text-sm font-black text-gray-800 tabular-nums bg-gray-100 rounded-lg px-2 py-0.5 min-w-12 text-right">
            {value.toFixed(step < 1 ? 2 : 1)}{suffix}
          </span>
        </div>
      </div>

      <div className="relative h-3 rounded-full bg-gray-100">
        <div
          className="absolute left-0 top-0 h-full rounded-full pointer-events-none"
          style={{ width: pct + "%", background: "linear-gradient(90deg, #10b981, #34d399)" }}
        />
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
      </div>

      <div className="flex justify-between mt-1">
        <span className="text-[9px] text-gray-400">{min}{suffix}</span>
        <span className="text-[9px] text-gray-400">{max}{suffix}</span>
      </div>
    </div>
  );
}

// â”€â”€â”€ Monthly cost bar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function MonthlyCostBar({ rentAmount, buyAmount }: { rentAmount: number; buyAmount: number }) {
  const maxVal = Math.max(rentAmount, buyAmount, 1);
  return (
    <div className="space-y-3">
      {[
        { label: "Renting",         amount: rentAmount, pct: (rentAmount / maxVal) * 100, color: "#60a5fa" },
        { label: "Buying (all-in)", amount: buyAmount,  pct: (buyAmount  / maxVal) * 100, color: "#10b981" },
      ].map(({ label, amount, pct, color }) => (
        <div key={label}>
          <div className="flex justify-between mb-1.5">
            <span className="text-xs font-semibold text-gray-500">{label}</span>
            <span className="text-xs font-black tabular-nums text-gray-800">{safeFmt(amount)}/mo</span>
          </div>
          <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: color }}
              initial={{ width: 0 }}
              animate={{ width: pct + "%" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// â”€â”€â”€ Timeline explorer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
// ─── Year narrative helper ──────────────────────────────────────────────────
function getYearNarrative(
  year: number,
  row: RentVsBuyYearRow,
  inputs: RentVsBuyInputs,
  summary: RentVsBuySummary,
): string {
  const isBuyAhead = (row.netWorthDelta ?? 0) > 0;
  const advantage = safeK(Math.abs(row.netWorthDelta ?? 0));
  const be = summary.breakEvenYear;

  if (year === 1) {
    const cc = Math.round((inputs.closingCostPct / 100) * inputs.homePrice);
    return `Closing costs of ${safeK(cc)} hit the buyer hard upfront. Most year-one mortgage payments go to interest, not equity. The renter stays liquid.`;
  }
  if (be !== null && year === be) {
    return `Crossover point: buying's accumulated equity and appreciation overtakes the renter's investment portfolio here for the first time.`;
  }
  if (year <= 3) {
    const annualAppreciation = Math.round(inputs.homeAppreciationPct / 100 * inputs.homePrice);
    return `Early years: most of the mortgage is still interest. But the home quietly appreciates ~${safeK(annualAppreciation)}/yr — silent equity the renter doesn't capture.`;
  }
  if (year === 5) {
    return isBuyAhead
      ? `Year 5 milestone: equity is accelerating and appreciation has compounded. Buying holds a ${advantage} net worth advantage.`
      : `Year 5: the renter's invested deposit still leads by ${advantage}. The buyer's equity needs more time to overcome upfront costs.`;
  }
  if (year === 10) {
    return isBuyAhead
      ? `A decade of equity, appreciation, and paid-down principal leaves the buyer ${advantage} ahead. Ownership's compounding effect is building.`
      : `At 10 years, the renter's portfolio stays ${advantage} ahead. Strong investment returns or high ownership costs keep renting competitive.`;
  }
  if (year >= 20) {
    return isBuyAhead
      ? `Long-run ownership advantage is clear: appreciation, principal paydown, and equity have compounded substantially.`
      : `Two decades of investing instead of owning. The renter holds a ${advantage} lead — though appreciation has been a powerful force for the buyer too.`;
  }
  if (year === inputs.yearsToStay) {
    return isBuyAhead
      ? `Your planned exit. After ${year} years, buying leaves you ${advantage} wealthier at sale — equity, appreciation, and principal all counted.`
      : `Your planned exit. After ${year} years, renting and investing keeps you ${advantage} ahead — flexibility and compounding returns were the edge.`;
  }
  return isBuyAhead
    ? `Buyer holds a ${advantage} net worth lead at year ${year} — equity and appreciation are compounding in their favour.`
    : `Renter holds a ${advantage} net worth lead at year ${year} — invested portfolio and lower costs are keeping them ahead.`;
}

// ─── Share button ─────────────────────────────────────────────────────────────
function ShareButton({ summary, inputs }: { summary: RentVsBuySummary; inputs: RentVsBuyInputs }) {
  const [copied, setCopied] = useState(false);

  function handleShare() {
    const winner = summary.winner;
    const delta = safeK(Math.abs(summary.netWorthDelta ?? 0));
    const text = [
      winner === "buy"
        ? `Rent vs Buy: Buying wins by ${delta} over ${inputs.yearsToStay} years`
        : winner === "rent"
        ? `Rent vs Buy: Renting wins by ${delta} over ${inputs.yearsToStay} years`
        : `Rent vs Buy: Too close to call over ${inputs.yearsToStay} years`,
      `Home: ${safeK(inputs.homePrice)} | Rate: ${inputs.mortgageRate}% | Rent: ${safeFmt(inputs.monthlyRent)}/mo`,
      summary.breakEvenYear
        ? `Break-even: year ${summary.breakEvenYear}`
        : "Buying never overtakes renting within 30 years",
      `\nworthulator.com/tools/rent-vs-buy-calculator`,
    ].join("\n");

    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title: "My Rent vs Buy Analysis", text }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(text).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2200);
      });
    }
  }

  return (
    <div className="flex justify-end">
      <button
        onClick={handleShare}
        className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm px-3.5 py-1.5 text-xs font-semibold text-white/70 hover:bg-white/20 hover:text-white transition-all active:scale-95"
      >
        <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none" aria-hidden>
          <circle cx="11" cy="2.5" r="1.5" stroke="currentColor" strokeWidth="1.3" />
          <circle cx="11" cy="11.5" r="1.5" stroke="currentColor" strokeWidth="1.3" />
          <circle cx="3" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.3" />
          <path d="M9.6 3.3L4.3 6.1M9.6 10.7L4.3 7.9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
        {copied ? "Copied!" : "Share result"}
      </button>
    </div>
  );
}

function TimelineExplorer({
  schedule, yearsToStay, inputs, summary,
}: {
  schedule: RentVsBuyYearRow[];
  yearsToStay: number;
  inputs: RentVsBuyInputs;
  summary: RentVsBuySummary;
}) {
  const displayYears = Array.from(
    new Set([...MILESTONE_YEARS, yearsToStay])
  ).filter((y) => y <= 30 && schedule.some((r) => r.year <= y)).sort((a, b) => a - b);

  const closest = displayYears.reduce((prev, cur) =>
    Math.abs(cur - yearsToStay) < Math.abs(prev - yearsToStay) ? cur : prev
  );
  const [activeYear, setActiveYear] = useState(closest);

  const getRow = (year: number): RentVsBuyYearRow | undefined =>
    schedule.find((r) => r.year === year) ??
    schedule[Math.min(year - 1, schedule.length - 1)];

  const activeRow = getRow(activeYear);
  if (!activeRow) return null;

  const isBuyAhead = (activeRow.netWorthDelta ?? 0) > 0;

  return (
    <motion.div
      variants={fadeUp}
      custom={3}
      className="rounded-xl border border-gray-200 bg-white overflow-hidden"
    >
      <div className="px-4 pt-4 pb-3 border-b border-gray-100">
        <p className="text-sm font-semibold text-gray-800">Your wealth, year by year</p>
        <p className="text-xs text-gray-400 mt-0.5">Tap any year to explore how the numbers evolve</p>
      </div>

      <div className="flex gap-2 p-4 pb-3 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {displayYears.map((year) => {
          const row    = getRow(year);
          const ahead  = (row?.netWorthDelta ?? 0) > 0;
          const isUser = year === yearsToStay && !MILESTONE_YEARS.includes(year);
          const isActive = year === activeYear;
          return (
            <motion.button
              key={year}
              onClick={() => setActiveYear(year)}
              whileTap={{ scale: 0.94 }}
              className={
                "relative shrink-0 flex flex-col items-center w-15 py-2.5 rounded-xl border-2 transition-all duration-200 " +
                (isActive
                  ? ahead
                    ? "border-emerald-400 bg-emerald-50 shadow-sm scale-105"
                    : "border-blue-400 bg-blue-50 shadow-sm scale-105"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50")
              }
            >
              {isUser && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-indigo-500 text-white text-[8px] font-bold rounded-full px-1.5 leading-4 whitespace-nowrap">
                  you
                </span>
              )}
              <span className="text-[9px] font-bold uppercase text-gray-400 tracking-wider">yr</span>
              <span
                className={
                  "text-xl font-black mt-0.5 " +
                  (isActive ? (ahead ? "text-emerald-700" : "text-blue-700") : "text-gray-700")
                }
              >
                {year}
              </span>
              <span className={"text-[9px] font-bold mt-0.5 " + (ahead ? "text-emerald-500" : "text-blue-500")}>
                {ahead ? "Buy→" : "Rent→"}
              </span>
            </motion.button>
          );
        })}
      </div>

      <motion.div
        key={activeYear}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className={
          "mx-4 mb-4 rounded-xl p-4 " +
          (isBuyAhead ? "bg-emerald-50 border border-emerald-200" : "bg-blue-50 border border-blue-200")
        }
      >
        <p
          className={
            "text-[10px] font-bold uppercase tracking-widest mb-3 " +
            (isBuyAhead ? "text-emerald-700" : "text-blue-700")
          }
        >
          Year {activeYear} snapshot —{" "}
          {isBuyAhead
            ? "Buying ahead by " + safeK(activeRow.netWorthDelta)
            : "Renting ahead by " + safeK(Math.abs(activeRow.netWorthDelta ?? 0))}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { label: "Home equity",    value: safeK(activeRow.equity),                    color: "emerald" },
            { label: "Loan balance",   value: safeK(activeRow.loanBalance),               color: "red"     },
            { label: "Rent portfolio", value: safeK(activeRow.rentInvestmentPortfolio),   color: "blue"    },
            { label: "Cumul. rent",    value: safeK(activeRow.cumulativeRentPaid),        color: "amber"   },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-lg px-3 py-2.5 shadow-sm">
              <p className="text-[9px] text-gray-400 font-medium uppercase tracking-wider mb-1">{label}</p>
              <p
                className={
                  "text-sm font-bold tabular-nums " +
                  (color === "emerald" ? "text-emerald-700" :
                   color === "blue"    ? "text-blue-700"    :
                   color === "red"     ? "text-red-600"     : "text-amber-700")
                }
              >
                {value}
              </p>
            </div>
          ))}
        </div>
        <p className={"mt-3 text-xs leading-relaxed italic " + (isBuyAhead ? "text-emerald-700/70" : "text-blue-700/70")}>
          {getYearNarrative(activeYear, activeRow, inputs, summary)}
        </p>
      </motion.div>
    </motion.div>
  );
}

// â”€â”€â”€ Break-even bar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function BreakEvenBar({
  breakEvenYear, yearsToStay, winner,
}: {
  breakEvenYear: number | null;
  yearsToStay: number;
  winner: "buy" | "rent" | "tie";
}) {
  const maxYears = 30;

  if (winner === "rent" && breakEvenYear === null) {
    return (
      <motion.div
        variants={fadeUp}
        custom={2}
        className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4"
      >
        <div className="flex items-start gap-3">
          <span className="text-xl mt-0.5">⚠️</span>
          <div>
            <p className="text-sm font-semibold text-amber-800">
              Buying doesn&apos;t outperform renting within 30 years
            </p>
            <p className="mt-1 text-xs text-amber-700">
              With these assumptions, renting and investing the difference comes out ahead.
              Try increasing appreciation or years to stay.
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  if (breakEvenYear === null) return null;

  const pct     = Math.min(100, (breakEvenYear / maxYears) * 100);
  const stayPct = Math.min(100, (yearsToStay   / maxYears) * 100);
  const early   = breakEvenYear <= yearsToStay;

  return (
    <motion.div variants={fadeUp} custom={2} className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <p className="text-sm font-semibold text-gray-800">Break-even timeline</p>
        <span
          className={
            "rounded-full px-3 py-0.5 text-xs font-bold " +
            (early ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700")
          }
        >
          {early
            ? "✓ Break-even by year " + yearsToStay
            : "Need " + (breakEvenYear - yearsToStay) + " more yr" + (breakEvenYear - yearsToStay === 1 ? "" : "s")}
        </span>
      </div>

      <div className="relative h-3 w-full rounded-full bg-gray-100 overflow-hidden">
        <motion.div
          className="absolute left-0 top-0 h-full bg-emerald-100 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: pct + "%" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
        <div className="absolute top-0 h-full w-0.5 bg-emerald-500" style={{ left: pct + "%" }} />
        <div className="absolute top-0 h-full w-0.5 bg-indigo-400" style={{ left: stayPct + "%" }} />
      </div>

      <div className="relative mt-2 h-5">
        <span
          className="absolute text-xs font-semibold text-emerald-600 -translate-x-1/2"
          style={{ left: Math.min(pct, 88) + "%" }}
        >
          Yr {breakEvenYear}
        </span>
        {Math.abs(pct - stayPct) > 8 && (
          <span
            className="absolute text-xs font-semibold text-indigo-500 -translate-x-1/2"
            style={{ left: Math.min(stayPct, 88) + "%" }}
          >
            Yr {yearsToStay}
          </span>
        )}
      </div>

      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
        <span className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" /> Break-even: yr {breakEvenYear}
        </span>
        <span className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="h-2 w-2 rounded-full bg-indigo-400 inline-block" /> Your stay: yr {yearsToStay}
        </span>
        <span className="text-xs text-gray-500">
          {early
            ? (yearsToStay - breakEvenYear) + " yr" + (yearsToStay - breakEvenYear === 1 ? "" : "s") + " of buying advantage"
            : "Need to stay " + (breakEvenYear - yearsToStay) + " yr" + (breakEvenYear - yearsToStay === 1 ? "" : "s") + " longer"}
        </span>
      </div>
    </motion.div>
  );
}

// â”€â”€â”€ Main component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function RentVsBuyCalculator() {
  const uid = useId();
  const { defaults, ranges } = rentVsBuyConfig;

  // â”€â”€ Core inputs â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const [homePrice,           setHomePrice]           = useState(defaults.homePrice);
  const [monthlyRent,         setMonthlyRent]         = useState(defaults.monthlyRent);
  const [downPaymentPct,      setDownPaymentPct]      = useState(defaults.downPaymentPct);
  const [mortgageRate,        setMortgageRate]        = useState(defaults.mortgageRate);
  const [loanTermYears,       setLoanTermYears]       = useState(defaults.loanTermYears);
  const [yearsToStay,         setYearsToStay]         = useState(defaults.yearsToStay);

  // â”€â”€ Advanced inputs â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const [propertyTaxPct,      setPropertyTaxPct]      = useState(defaults.propertyTaxPct);
  const [homeInsurancePct,    setHomeInsurancePct]    = useState(defaults.homeInsurancePct);
  const [hoaMonthly,          setHoaMonthly]          = useState(defaults.hoaMonthly);
  const [maintenancePct,      setMaintenancePct]      = useState(defaults.maintenancePct);
  const [homeAppreciationPct, setHomeAppreciationPct] = useState(defaults.homeAppreciationPct);
  const [rentIncreasePct,     setRentIncreasePct]     = useState(defaults.rentIncreasePct);
  const [investmentReturnPct, setInvestmentReturnPct] = useState(defaults.investmentReturnPct);
  const [closingCostPct,      setClosingCostPct]      = useState(defaults.closingCostPct);
  const [sellingCostPct,      setSellingCostPct]      = useState(defaults.sellingCostPct);
  // null = auto-follow deposit; number = user override
  const [rentCapitalOverride, setRentCapitalOverride] = useState<number | null>(null);
  const [reinvestSavings,     setReinvestSavings]     = useState(false);
  const [reinvestPct,         setReinvestPct]         = useState(100);
  const [showAdvanced,        setShowAdvanced]        = useState(false);

  const deposit = homePrice * downPaymentPct / 100;
  const rentStartingCapital = rentCapitalOverride ?? deposit;

  // â”€â”€ Reveal state machine â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const [revealState,     setRevealState]     = useState<RevealState>("idle");
  const [analysisStep,    setAnalysisStep]    = useState(0);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [countUpActive,   setCountUpActive]   = useState(false);
  const [analysisYears,   setAnalysisYears]   = useState(10); // locked at calculate-time
  const [committedYears,  setCommittedYears]  = useState(defaults.yearsToStay); // drives results

  // â”€â”€ Progressive section unlock â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const [showWhatIf,  setShowWhatIf]  = useState(false);
  const [showCharts,  setShowCharts]  = useState(false);
  const [showInvestedScenario, setShowInvestedScenario] = useState(false);

  // â”€â”€ What-if state â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const [whatIfMode,     setWhatIfMode]     = useState(false);
  const [wfRate,         setWfRate]         = useState(defaults.mortgageRate);
  const [wfAppreciation, setWfAppreciation] = useState(defaults.homeAppreciationPct);
  const [wfInvestReturn, setWfInvestReturn] = useState(defaults.investmentReturnPct);
  const [wfRentIncrease, setWfRentIncrease] = useState(defaults.rentIncreasePct);
  const [activeScenario,  setActiveScenario]  = useState<number | null>(null);

  const resetWhatIf = useCallback(() => {
    setWfRate(mortgageRate);
    setWfAppreciation(homeAppreciationPct);
    setWfInvestReturn(investmentReturnPct);
    setWfRentIncrease(rentIncreasePct);
  }, [mortgageRate, homeAppreciationPct, investmentReturnPct, rentIncreasePct]);

  // â”€â”€ Analysis animation effect â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    if (revealState !== "analyzing") return;
    setAnalysisStep(0);
    setAnalysisProgress(0);
    setCountUpActive(false);

    const totalMs    = 2800;
    const stepMs     = totalMs / ANALYSIS_STEPS.length;
    let currentStep  = 0;

    const interval = setInterval(() => {
      currentStep++;
      if (currentStep >= ANALYSIS_STEPS.length) {
        clearInterval(interval);
        setAnalysisStep(ANALYSIS_STEPS.length - 1);
        setAnalysisProgress(100);
        setTimeout(() => {
          setRevealState("revealed");
          setCountUpActive(true);
        }, 450);
      } else {
        setAnalysisStep(currentStep);
        setAnalysisProgress((currentStep / ANALYSIS_STEPS.length) * 100);
      }
    }, stepMs);

    return () => clearInterval(interval);
  }, [revealState]);



  // â”€â”€ Derived â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const inputs: RentVsBuyInputs = useMemo(() => ({
    homePrice,
    monthlyRent,
    downPaymentPct,
    mortgageRate,
    loanTermYears,
    propertyTaxPct,
    homeInsurancePct,
    hoaMonthly,
    maintenancePct,
    homeAppreciationPct,
    rentIncreasePct,
    investmentReturnPct,
    yearsToStay: committedYears,
    closingCostPct,
    sellingCostPct,
    rentStartingCapital,
    reinvestSavingsPct: reinvestSavings ? reinvestPct : 0,
  }), [
    homePrice, monthlyRent, downPaymentPct, mortgageRate, loanTermYears,
    propertyTaxPct, homeInsurancePct, hoaMonthly, maintenancePct,
    homeAppreciationPct, rentIncreasePct, investmentReturnPct, committedYears,
    closingCostPct, sellingCostPct, rentStartingCapital, reinvestSavings, reinvestPct,
  ]);

  const summary  = useMemo(() => calcRentVsBuy(inputs), [inputs]);
  const keyFindings = useMemo(() => generateKeyFindings(inputs, summary), [inputs, summary]);



  const fmt  = safeFmt;
  const fmtK = safeK;

  // â”€â”€ When inputs change while revealed, keep live (no re-analyze) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // (summary re-computes automatically via useMemo)

  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">

      {/* â”€â”€ Input section â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="p-6 border-b border-gray-100">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          <div>
            <Label htmlFor={uid + "-price"}>Home price</Label>
            <NumberInput
              id={uid + "-price"} value={homePrice} onChange={setHomePrice}
              min={ranges.homePrice.min} max={ranges.homePrice.max} step={ranges.homePrice.step} prefix="$"
            />
          </div>

          <div>
            <Label htmlFor={uid + "-rent"}>Monthly rent</Label>
            <NumberInput
              id={uid + "-rent"} value={monthlyRent} onChange={setMonthlyRent}
              min={ranges.monthlyRent.min} max={ranges.monthlyRent.max} step={ranges.monthlyRent.step}
              prefix="$" suffix="/mo"
            />
          </div>

          <div>
            <Label htmlFor={uid + "-dp"}>Down payment</Label>
            <NumberInput
              id={uid + "-dp"} value={downPaymentPct} onChange={setDownPaymentPct}
              min={ranges.downPaymentPct.min} max={ranges.downPaymentPct.max} step={ranges.downPaymentPct.step}
              suffix="%"
            />
            <p className="mt-1 text-xs text-gray-400">{fmt((homePrice * downPaymentPct) / 100)} upfront</p>
          </div>

          <div>
            <Label htmlFor={uid + "-rate"}>Mortgage rate</Label>
            <NumberInput
              id={uid + "-rate"} value={mortgageRate} onChange={setMortgageRate}
              min={ranges.mortgageRate.min} max={ranges.mortgageRate.max} step={ranges.mortgageRate.step}
              suffix="%/yr"
            />
          </div>

          <div>
            <Label>Loan term</Label>
            <div className="flex gap-2">
              {ranges.loanTermYears.options.map((opt) => (
                <button
                  key={opt} type="button" onClick={() => setLoanTermYears(opt)}
                  className={
                    "flex-1 rounded-xl border py-2.5 text-sm font-semibold transition " +
                    (loanTermYears === opt
                      ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300")
                  }
                >
                  {opt}yr
                </button>
              ))}
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setShowAdvanced((p) => !p)}
              className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition"
            >
              <span>{showAdvanced ? "▲" : "▼"}</span>
              {showAdvanced ? "Hide" : "Show"} advanced assumptions
            </button>
          </div>

        </div>

        {showAdvanced && (
          <div className="mt-4 border-t border-gray-100 pt-4 space-y-5">
            {/* Buying */}
            <div>
              <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-emerald-600">Buying</p>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <Label htmlFor={uid + "-ptax"}>Property tax rate</Label>
                  <NumberInput id={uid + "-ptax"} value={propertyTaxPct} onChange={setPropertyTaxPct}
                    min={ranges.propertyTaxPct.min} max={ranges.propertyTaxPct.max} step={ranges.propertyTaxPct.step} suffix="%/yr" />
                  <p className="mt-1 text-xs text-gray-400">US avg ~1.1% · NJ/IL up to 2.4%</p>
                </div>
                <div>
                  <Label htmlFor={uid + "-ins"}>Home insurance</Label>
                  <NumberInput id={uid + "-ins"} value={homeInsurancePct} onChange={setHomeInsurancePct}
                    min={ranges.homeInsurancePct.min} max={ranges.homeInsurancePct.max} step={ranges.homeInsurancePct.step} suffix="%/yr" />
                  <p className="mt-1 text-xs text-gray-400">Typical 0.25–0.75% of home value</p>
                </div>
                <div>
                  <Label htmlFor={uid + "-hoa"}>HOA fees</Label>
                  <NumberInput id={uid + "-hoa"} value={hoaMonthly} onChange={setHoaMonthly}
                    min={ranges.hoaMonthly.min} max={ranges.hoaMonthly.max} step={ranges.hoaMonthly.step} prefix="$" suffix="/mo" />
                </div>
                <div>
                  <Label htmlFor={uid + "-maint"}>Maintenance &amp; repairs</Label>
                  <NumberInput id={uid + "-maint"} value={maintenancePct} onChange={setMaintenancePct}
                    min={ranges.maintenancePct.min} max={ranges.maintenancePct.max} step={ranges.maintenancePct.step} suffix="%/yr" />
                  <p className="mt-1 text-xs text-gray-400">Rule of thumb: 1–2% of home value/yr</p>
                </div>
                <div>
                  <Label htmlFor={uid + "-appr"}>Home appreciation</Label>
                  <NumberInput id={uid + "-appr"} value={homeAppreciationPct} onChange={setHomeAppreciationPct}
                    min={ranges.homeAppreciationPct.min} max={ranges.homeAppreciationPct.max} step={ranges.homeAppreciationPct.step} suffix="%/yr" />
                  <p className="mt-1 text-xs text-gray-400">US historical avg ~3.5–4% nominal</p>
                </div>
                <div>
                  <Label htmlFor={uid + "-cc"}>Closing costs</Label>
                  <NumberInput id={uid + "-cc"} value={closingCostPct} onChange={setClosingCostPct}
                    min={ranges.closingCostPct.min} max={ranges.closingCostPct.max} step={ranges.closingCostPct.step} suffix="% of price" />
                  <p className="mt-1 text-xs text-gray-400">Typically 2–5% of purchase price</p>
                </div>
                <div>
                  <Label htmlFor={uid + "-sc"}>Selling costs</Label>
                  <NumberInput id={uid + "-sc"} value={sellingCostPct} onChange={setSellingCostPct}
                    min={ranges.sellingCostPct.min} max={ranges.sellingCostPct.max} step={ranges.sellingCostPct.step} suffix="% of price" />
                  <p className="mt-1 text-xs text-gray-400">Agent commissions + transfer taxes ~5–7%</p>
                </div>
              </div>
            </div>

            {/* Renting */}
            <div className="border-t border-gray-100 pt-5">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-blue-500">Renting</p>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor={uid + "-rinc"}>Annual rent increase</Label>
                  <NumberInput id={uid + "-rinc"} value={rentIncreasePct} onChange={setRentIncreasePct}
                    min={ranges.rentIncreasePct.min} max={ranges.rentIncreasePct.max} step={ranges.rentIncreasePct.step} suffix="%/yr" />
                  <p className="mt-1 text-xs text-gray-400">US avg rent inflation ~3–4%/yr</p>
                </div>
                <div className="sm:col-span-1">
                  <Label htmlFor={uid + "-rcap"}>Investment capital</Label>
                  <NumberInput id={uid + "-rcap"} value={rentStartingCapital} onChange={(v) => setRentCapitalOverride(v)}
                    min={0} max={2000000} step={1000} prefix="$" />
                  {rentCapitalOverride === null || rentCapitalOverride === deposit ? (
                    <p className="mt-1 text-xs text-gray-400">Defaulting to your deposit ({safeK(deposit)})</p>
                  ) : (
                    <button type="button" onClick={() => setRentCapitalOverride(null)}
                      className="mt-1 text-xs text-blue-500 hover:underline">
                      Reset to deposit ({safeK(deposit)})
                    </button>
                  )}
                </div>
                <div>
                  <Label htmlFor={uid + "-inv"}>Expected annual return from investments</Label>
                  <NumberInput id={uid + "-inv"} value={investmentReturnPct} onChange={setInvestmentReturnPct}
                    min={ranges.investmentReturnPct.min} max={ranges.investmentReturnPct.max} step={ranges.investmentReturnPct.step} suffix="%/yr" />
                  <p className="mt-1 text-xs text-gray-400">S&amp;P 500 long-run avg ~7–10%</p>
                </div>
                {/* Re-invest savings field */}
                <div className="sm:col-span-2">
                  <Label>Would you re-invest any monthly savings over buying?</Label>
                  <div className="flex items-center gap-3 mt-1.5">
                    <button type="button"
                      onClick={() => setReinvestSavings(false)}
                      className={"px-4 py-2 rounded-lg text-xs font-semibold border transition " + (!reinvestSavings ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300")}>
                      No
                    </button>
                    <button type="button"
                      onClick={() => setReinvestSavings(true)}
                      className={"px-4 py-2 rounded-lg text-xs font-semibold border transition " + (reinvestSavings ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300")}>
                      Yes
                    </button>
                    {reinvestSavings && (
                      <div className="flex items-center gap-2 ml-2">
                        <span className="text-xs text-gray-500">Re-invest</span>
                        <NumberInput id={uid + "-reinvpct"} value={reinvestPct} onChange={(v) => setReinvestPct(Math.min(100, Math.max(1, v)))}
                          min={1} max={100} step={5} suffix="%" />
                        <span className="text-xs text-gray-500">of savings</span>
                      </div>
                    )}
                  </div>
                  {reinvestSavings && (
                    <p className="mt-1.5 text-xs text-gray-400">
                      Using {investmentReturnPct > 0 ? `your ${investmentReturnPct}% investment return` : "a 7% default rate"} to compound monthly savings.
                      This is factored directly into the renter’s net worth.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Years-to-analyse field */}
        <div className="mt-6">
          <label htmlFor={uid + "-yrs"} className="block text-sm font-semibold text-gray-700 mb-2">
            How many years do you want to analyse?
          </label>
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <input
                id={uid + "-yrs"} type="number"
                min={ranges.yearsToStay.min} max={ranges.yearsToStay.max} step={ranges.yearsToStay.step}
                value={yearsToStay || ""}
                onChange={(e) => setYearsToStay(Number(e.target.value))}
                className="w-full rounded-xl border border-gray-200 bg-white py-3 pr-16 text-center text-2xl font-black text-gray-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 transition-colors"
              />
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">years</span>
            </div>
            <div className="flex gap-1.5">
              {[5, 10, 15, 20, 30].map((y) => (
                <button key={y} type="button" onClick={() => setYearsToStay(y)}
                  className={
                    "px-3 py-3 rounded-lg text-xs font-semibold border transition " +
                    (yearsToStay === y
                      ? "border-emerald-500 bg-emerald-600 text-white"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300")
                  }>
                  {y}yr
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Calculate button */}
        <div className="mt-6">
          <motion.button
            type="button"
            onClick={() => {
              setAnalysisYears(yearsToStay);
              setCommittedYears(yearsToStay);
              setRevealState("analyzing");
              setShowCharts(false);
              setShowInvestedScenario(false);
            }}
            whileHover={{ scale: 1.015 }}
            whileTap={{ scale: 0.98 }}
            className="w-full rounded-xl py-3.5 text-sm font-bold text-white shadow-lg transition-all"
            style={{ background: "linear-gradient(135deg, #059669 0%, #0d9488 100%)" }}
          >
            {revealState === "idle" ? "Calculate" : "Recalculate"}
          </motion.button>
        </div>
      </div>

      {/* â”€â”€ Results section â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="bg-gray-50">
        <AnimatePresence mode="wait">

          {/* Idle */}
          {revealState === "idle" && (
            <div key="idle" className="p-6">
              <IdleTeaser />
            </div>
          )}

          {/* Analyzing */}
          {revealState === "analyzing" && (
            <div key="analyzing" className="p-6">
              <AnalysisPhase step={analysisStep} progress={analysisProgress} yearsToStay={analysisYears} />
            </div>
          )}

          {/* Revealed */}
          {revealState === "revealed" && (
            <motion.div
              key="revealed"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="p-6 space-y-4"
            >
              {/* 1. Massive hero result */}
              <HeroResultCard summary={summary} inputs={inputs} countUpActive={countUpActive} />

              {/* 1a. Share result */}
              <ShareButton summary={summary} inputs={inputs} />

              {/* 1b. What if? scenario explorer */}
              <ScenarioFlips inputs={inputs} summary={summary} />

              {/* 2. Wealth race chart */}
              {summary.schedule && (
                <WealthRaceChart
                  schedule={summary.schedule}
                  yearsToStay={inputs.yearsToStay}
                  winner={summary.winner}
                />
              )}

              {/* 2b. Detailed charts — revealed inline under the chart */}
              {!showCharts && (
                <ContinuationHook
                  question="Want the full breakdown — equity curve, cash flows, and portfolio growth?"
                  cta="Show detailed charts"
                  onClick={() => setShowCharts(true)}
                />
              )}
              {showCharts && (
                <motion.div variants={fadeUp} initial="hidden" animate="visible">
                  <Suspense fallback={
                    <div className="flex items-center justify-center rounded-xl border border-gray-200 bg-white py-16 text-sm text-gray-400">
                      Loading charts...
                    </div>
                  }>
                    <RentVsBuyChartsPanel summary={summary} inputs={inputs} />
                  </Suspense>
                </motion.div>
              )}

              {/* 3. Monthly cost comparison */}
              <motion.div variants={fadeUp} custom={2} className="rounded-xl border border-gray-200 bg-white p-4">
                <p className="text-sm font-semibold text-gray-800 mb-3">Monthly cost comparison</p>
                <MonthlyCostBar rentAmount={monthlyRent} buyAmount={summary.totalMonthlyBuying} />
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className={"text-xs " + (summary.monthlySavingsVsRent > 0 && !summary.willReinvest ? "text-red-600 font-medium" : "text-gray-500")}>
                    {summary.monthlySavingsVsRent > 0
                      ? summary.willReinvest
                        ? `Buying costs ${fmt(summary.monthlySavingsVsRent)}/mo more — ${reinvestPct < 100 ? `${reinvestPct}% of` : "these"} savings are being re-invested at ${investmentReturnPct > 0 ? `${investmentReturnPct}%` : "7%"}/yr and factored into renter's net worth.`
                        : `⚠ Buying costs ${fmt(summary.monthlySavingsVsRent)}/mo more than renting — if you did decide to re-invest these savings, renting could be the better option financially.`
                      : summary.monthlySavingsVsRent < 0
                      ? `Buying is ${fmt(Math.abs(summary.monthlySavingsVsRent))}/mo cheaper than renting here — the buyer has the monthly surplus advantage.`
                      : "Monthly costs are equal between both paths."}
                  </p>
                </div>
              </motion.div>

              {/* 5. Break-even timeline */}
              <BreakEvenBar
                breakEvenYear={summary.breakEvenYear}
                yearsToStay={inputs.yearsToStay}
                winner={summary.winner}
              />

              {/* 6. Timeline explorer */}
              {summary.schedule && (
                <TimelineExplorer schedule={summary.schedule} yearsToStay={inputs.yearsToStay} inputs={inputs} summary={summary} />
              )}

              {/* 7. Insights — staggered reveal */}
              {keyFindings.length > 0 && (
                <motion.div
                  initial="hidden"
                  animate={countUpActive ? "visible" : "hidden"}
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.13, delayChildren: 0.55 } },
                  }}
                  className="space-y-2"
                >
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 pb-1">
                    Key findings
                  </p>
                  {keyFindings.map((finding, i) => (
                    <motion.div
                      key={i}
                      variants={{
                        hidden: { opacity: 0, y: 14, scale: 0.97 },
                        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
                      }}
                    >
                      <InsightCard type={finding.type} text={finding.text} index={0} />
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* 8. Local estimate CTA */}
              <LocalEstimateCTA summary={summary} inputs={inputs} />

              {/* 9. Cost breakdown tables */}
              <motion.div variants={fadeUp} custom={5}>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-gray-200 bg-white divide-y divide-gray-100 overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50">
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
                        Buying — {inputs.yearsToStay}yr total costs
                      </p>
                    </div>
                    <ResultRow label="Down payment"         value={fmt(summary.downPayment)} />
                    <ResultRow label="Closing costs"        value={fmt(summary.closingCostUpfront)} />
                    <ResultRow label="Mortgage payments"    value={fmt(summary.totalMortgagePayments)} />
                    <ResultRow label="Interest paid"        value={fmt(summary.totalInterestPaid)} />
                    {summary.totalInterestPaid > 0 && (
                      <div className="px-4 py-2 bg-red-50 flex items-start gap-2">
                        <span className="shrink-0 text-red-400 text-[11px] mt-px">⚠</span>
                        <p className="text-[11px] text-red-600 leading-snug">
                          That&apos;s {Math.round((summary.totalInterestPaid / inputs.homePrice) * 100)}% of the home price paid in interest alone over {inputs.yearsToStay} years.
                        </p>
                      </div>
                    )}
                    <ResultRow label="Property tax"         value={fmt(summary.totalPropertyTax)} />
                    <ResultRow label="Insurance + HOA"      value={fmt(summary.totalInsuranceAndHoa)} />
                    <ResultRow label="Maintenance"          value={fmt(summary.totalMaintenance)} />
                    <ResultRow label="Selling costs"        value={fmt(summary.sellingCostAtExit)} />
                    <ResultRow label="Home value at exit"   value={"+" + fmtK(summary.finalHomeValue)} />
                    <ResultRow label="Net worth (buying)"   value={fmtK(summary.buyNetWorth)} highlight />
                  </div>

                  <div className="rounded-xl border border-gray-200 bg-white divide-y divide-gray-100 overflow-hidden">
                    <div className="px-4 py-3 bg-gray-50">
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
                        Renting — {inputs.yearsToStay}yr total costs
                      </p>
                    </div>
                    <ResultRow label="Total rent paid"              value={fmt(summary.totalRentPaid)} />
                    <ResultRow label="Starting capital (deposit)"   value={fmt(summary.downPayment)} />
                    <ResultRow label="Investment portfolio at exit" value={"+" + fmtK(summary.finalInvestmentPortfolio)} highlight />
                    <ResultRow label="Net worth (renting)"          value={fmtK(summary.rentNetWorth)} highlight />
                    <div className="px-4 py-2.5 bg-blue-50 flex items-start gap-2 text-[11px] text-blue-700">
                      <span className="shrink-0 mt-0.5">ℹ</span>
                      <span>
                        Renter invests {safeK(rentStartingCapital)} (deposit) at {inputs.investmentReturnPct > 0 ? `${inputs.investmentReturnPct}%/yr` : "0% — set a return rate in advanced options"}.
                        Monthly cost differences are shown separately above.
                        {rentCapitalOverride !== null ? " (custom starting capital)" : ""}
                      </span>
                    </div>
                    {/* What if invested? button — only show when NOT already reinvesting */}
                    {summary.renterMonthlySurplus > 0 && !showInvestedScenario && !summary.willReinvest && (
                      <button type="button" onClick={() => setShowInvestedScenario(true)}
                        className="w-full px-4 py-3 text-left text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 transition flex items-center justify-between border-t border-blue-100">
                        <span>What if the renter invested the deposit + {safeK(summary.renterMonthlySurplus)}/mo savings?</span>
                        <span className="text-blue-400">›</span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* 9b. Invested scenario — only when NOT already reinvesting via advanced settings */}
              {showInvestedScenario && !summary.willReinvest && summary.renterMonthlySurplus > 0 && (() => {
                const buyNW  = summary.buyNetWorth;
                const baseNW = summary.rentNetWorth;
                const discNW = summary.renterDisciplinedNetWorth;
                const aggrNW = summary.renterAggressiveNetWorth;
                const maxNW  = Math.max(buyNW, aggrNW, 1);
                const rows = [
                  { label: "Typical renter",      sub: "Deposit in savings account, keeps monthly surplus as cash", nw: baseNW, color: "bg-gray-400" },
                  { label: "Disciplined investor", sub: "Invests deposit + monthly surplus at 7%/yr",              nw: discNW, color: "bg-blue-500" },
                  { label: "Aggressive investor",  sub: "Invests deposit + monthly surplus at 10%/yr",             nw: aggrNW, color: "bg-violet-500" },
                ];
                return (
                  <motion.div variants={fadeUp} initial="hidden" animate="visible"
                    className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                      <div>
                        <p className="text-sm font-bold text-gray-900">If the renter invested deposit + monthly savings</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {safeK(summary.renterMonthlySurplus)}/mo surplus · {inputs.yearsToStay} year{inputs.yearsToStay !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <button type="button" onClick={() => setShowInvestedScenario(false)}
                        className="text-xs font-semibold text-gray-400 hover:text-gray-600 transition">Close</button>
                    </div>
                    <div className="px-5 py-3 border-b border-dashed border-gray-200 flex items-center justify-between bg-emerald-50">
                      <span className="text-xs font-semibold text-emerald-800">Buyer net worth (reference)</span>
                      <span className="text-sm font-black text-emerald-700">{safeK(buyNW)}</span>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {rows.map((r, i) => {
                        const pct = Math.min(100, Math.round((r.nw / maxNW) * 100));
                        const gap = buyNW - r.nw;
                        const buyWins = gap > 0;
                        return (
                          <div key={i} className="px-5 py-4">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <p className="text-xs font-bold text-gray-800">{r.label}</p>
                                <p className="text-[10px] text-gray-400">{r.sub}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-black text-gray-900">{safeK(r.nw)}</p>
                                <p className={"text-[10px] font-semibold " + (buyWins ? "text-emerald-600" : "text-blue-600")}>
                                  {buyWins ? `Buying wins by ${safeK(gap)}` : `Renting wins by ${safeK(Math.abs(gap))}`}
                                </p>
                              </div>
                            </div>
                            <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                              <motion.div className={"h-full rounded-full " + r.color}
                                initial={{ width: 0 }} animate={{ width: pct + "%" }}
                                transition={{ duration: 0.6, delay: i * 0.12, ease: "easeOut" }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
                      <p className="text-[10px] text-gray-400">
                        Disciplined and Aggressive rows compound both the saved deposit and the monthly surplus. Typical renter keeps the deposit in savings and the monthly surplus as cash.
                      </p>
                    </div>
                  </motion.div>
                );
              })()}

            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
