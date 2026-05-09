"use client";

import { useState, useMemo, useId, lazy, Suspense } from "react";
import {
  loanModes,
  termPresets,
  calcStandardLoan,
  calcCarLoan,
  calcPersonalLoan,
  calcStudentLoan,
  generateAmortizationSchedule,
  generateYearlySummary,
  calcExtraMonthly,
  calcOneTimeExtra,
  buildScenarioComparison,
  buildDepreciationSchedule,
  type LoanMode,
  type CarLoanInputs,
  type PersonalLoanInputs,
  type StudentLoanInputs,
  type StudentLoanType,
  type StudentRepaymentPlan,
  type AmortizationRow,
  type YearlySummary,
  type ScenarioResult,
  type DepreciationRow,
} from "@/lib/configs/loanConfig";

const LoanChartsPanel = lazy(() => import("./LoanCharts"));
const LoanExtraPaymentsChart = lazy(() => import("./LoanExtraPaymentsChart"));
const LoanScenariosChart = lazy(() => import("./LoanScenariosChart"));

// ─── Formatters ───────────────────────────────────────────────────────────────

const fmt = (n: number, decimals = 0) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: decimals,
  });

const fmtPct = (n: number) =>
  `${Math.round(n * 100) / 100}%`;

// ─── Primitive UI components ─────────────────────────────────────────────────

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
  id,
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  prefix,
  suffix,
}: {
  id?: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <div className="relative flex items-center">
      {prefix && (
        <span className="pointer-events-none absolute left-3 text-sm text-gray-400 select-none">
          {prefix}
        </span>
      )}
      <input
        id={id}
        type="number"
        min={min}
        max={max}
        step={step}
        value={value || ""}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-medium text-gray-800 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 ${prefix ? "pl-7" : "pl-4"} ${suffix ? "pr-10" : "pr-4"}`}
      />
      {suffix && (
        <span className="pointer-events-none absolute right-3 text-sm text-gray-400 select-none">
          {suffix}
        </span>
      )}
    </div>
  );
}

function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { label: string; value: T }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex rounded-xl border border-gray-200 bg-gray-50 p-1 gap-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
            value === opt.value
              ? "bg-white text-emerald-700 shadow-sm border border-gray-200"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function ResultRow({
  label,
  value,
  highlight = false,
  sub,
  dimmed = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  sub?: string;
  dimmed?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0 ${highlight ? "font-semibold" : ""}`}>
      <div>
        <span className={`text-sm ${highlight ? "text-gray-800" : dimmed ? "text-gray-400" : "text-gray-500"}`}>
          {label}
        </span>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
      <span className={`text-sm tabular-nums ${highlight ? "text-emerald-700 text-base" : dimmed ? "text-gray-400" : "text-gray-700"}`}>
        {value}
      </span>
    </div>
  );
}

// ─── Hero payment display ─────────────────────────────────────────────────────

function HeroPayment({
  monthlyPayment,
  totalInterest,
  totalRepayment,
  interestRatio,
}: {
  monthlyPayment: number;
  totalInterest: number;
  totalRepayment: number;
  interestRatio: number;
}) {
  return (
    <div className="rounded-2xl border border-emerald-100 bg-linear-to-br from-emerald-50 to-white p-6">
      {/* Hero number */}
      <div className="text-center mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 mb-1">
          Monthly Payment
        </p>
        <p className="text-5xl font-bold tabular-nums text-emerald-700 tracking-tight">
          {fmt(monthlyPayment, 2)}
        </p>
      </div>

      {/* Sub stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-emerald-100 bg-white px-4 py-3 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-0.5">
            Total Interest
          </p>
          <p className="text-xl font-bold tabular-nums text-amber-600">{fmt(totalInterest)}</p>
        </div>
        <div className="rounded-xl border border-emerald-100 bg-white px-4 py-3 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-0.5">
            Total Cost
          </p>
          <p className="text-xl font-bold tabular-nums text-gray-800">{fmt(totalRepayment)}</p>
        </div>
      </div>

      {/* Interest ratio bar */}
      <div className="mt-4">
        <div className="flex rounded-full overflow-hidden h-2.5">
          <div
            className="bg-emerald-400 transition-all duration-500"
            style={{ width: `${100 - interestRatio}%` }}
            title="Principal"
          />
          <div
            className="bg-amber-400 transition-all duration-500"
            style={{ width: `${interestRatio}%` }}
            title="Interest"
          />
        </div>
        <div className="flex justify-between mt-1.5 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400" />
            Principal ({Math.round(100 - interestRatio)}%)
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-400" />
            Interest ({Math.round(interestRatio)}%)
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Mode tab bar ─────────────────────────────────────────────────────────────

const MODE_ORDER: LoanMode[] = ["standard", "car", "personal", "student"];

function ModeTabBar({
  mode,
  onChange,
}: {
  mode: LoanMode;
  onChange: (m: LoanMode) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {MODE_ORDER.map((m) => {
        const cfg = loanModes[m];
        const active = mode === m;
        return (
          <button
            key={m}
            type="button"
            onClick={() => onChange(m)}
            className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
              active
                ? "border-emerald-400 bg-emerald-50 text-emerald-700 shadow-sm"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            <span className="text-base leading-none select-none">{cfg.icon}</span>
            {cfg.label}
          </button>
        );
      })}
    </div>
  );
}

// ─── Term picker ──────────────────────────────────────────────────────────────

function TermPicker({
  mode,
  termMonths,
  onChange,
  uid,
}: {
  mode: LoanMode;
  termMonths: number;
  onChange: (v: number) => void;
  uid: string;
}) {
  const presets = termPresets[mode];
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <Label>Loan term</Label>
        <span className="text-xs text-gray-400">or enter custom</span>
      </div>
      <div className="flex flex-wrap gap-2 mb-2">
        {presets.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
              termMonths === p
                ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
            }`}
          >
            {p >= 12 && p % 12 === 0 ? `${p / 12}yr` : `${p}mo`}
          </button>
        ))}
      </div>
      <NumberInput
        id={`${uid}-term`}
        value={termMonths}
        onChange={(v) => onChange(Math.max(1, Math.min(600, Math.round(v))))}
        min={1}
        max={600}
        step={1}
        suffix="mo"
      />
    </div>
  );
}

// ─── Bottom tab bar ───────────────────────────────────────────────────────────

type BottomTab = "summary" | "amortization";

const BOTTOM_TABS: { id: BottomTab; label: string }[] = [
  { id: "summary",      label: "Summary" },
  { id: "amortization", label: "Amortization" },
];

function BottomTabBar({
  active,
  onChange,
}: {
  active: BottomTab;
  onChange: (t: BottomTab) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1 border-b border-gray-100 bg-gray-50/60 px-5 py-2">
      {BOTTOM_TABS.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          className={`relative rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
            active === t.id
              ? "bg-white text-emerald-700 shadow-sm border border-gray-200"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function LoanCalculator() {
  const uid = useId();

  // ── Mode ─────────────────────────────────────────────────────────────────
  const [mode, setMode] = useState<LoanMode>("standard");

  // ── Core state (syncs with mode defaults on mode change) ─────────────────
  const [amount, setAmount] = useState(loanModes.standard.defaults.amount);
  const [rate, setRate] = useState(loanModes.standard.defaults.annualRatePct);
  const [termMonths, setTermMonths] = useState(loanModes.standard.defaults.termMonths);

  // ── Car loan ─────────────────────────────────────────────────────────────
  const [downPayment, setDownPayment] = useState(5000);
  const [tradeIn, setTradeIn] = useState(0);
  const [salesTax, setSalesTax] = useState(6);
  const [carFees, setCarFees] = useState(500);

  // ── Personal loan ────────────────────────────────────────────────────────
  const [originationFee, setOriginationFee] = useState(1);
  const [additionalFees, setAdditionalFees] = useState(0);

  // ── Student loan ─────────────────────────────────────────────────────────
  const [gracePeriod, setGracePeriod] = useState(6);
  const [studentLoanType, setStudentLoanType] = useState<StudentLoanType>("unsubsidized");
  const [repaymentPlan, setRepaymentPlan] = useState<StudentRepaymentPlan>("standard");

  // ── Extra payments ───────────────────────────────────────────────────────
  const [extraMonthly, setExtraMonthly] = useState(0);
  const [extraOneTime, setExtraOneTime] = useState(0);
  const [showExtraPayments, setShowExtraPayments] = useState(false);

  // ── Active bottom tab ────────────────────────────────────────────────────
  type BottomTab = "summary" | "amortization";
  const [activeTab, setActiveTab] = useState<BottomTab>("summary");
  const [amortView, setAmortView] = useState<"yearly" | "monthly">("yearly");

  // ── Mode switch — reset core inputs to mode defaults ─────────────────────
  function switchMode(m: LoanMode) {
    setMode(m);
    const d = loanModes[m].defaults;
    setAmount(d.amount);
    setRate(d.annualRatePct);
    setTermMonths(d.termMonths);
  }

  // ── Calculations ─────────────────────────────────────────────────────────
  const result = useMemo(() => {
    const safeAmount = Math.max(0, amount);
    const safeRate = Math.max(0, rate);
    const safeTerm = Math.max(1, termMonths);

    switch (mode) {
      case "car": {
        const inputs: CarLoanInputs = {
          vehiclePrice: safeAmount,
          downPayment: Math.max(0, downPayment),
          tradeInValue: Math.max(0, tradeIn),
          salesTaxPct: Math.max(0, salesTax),
          fees: Math.max(0, carFees),
        };
        return calcCarLoan(safeAmount, safeRate, safeTerm, inputs);
      }
      case "personal": {
        const inputs: PersonalLoanInputs = {
          originationFeePct: Math.max(0, originationFee),
          additionalFees: Math.max(0, additionalFees),
        };
        return calcPersonalLoan(safeAmount, safeRate, safeTerm, inputs);
      }
      case "student": {
        const inputs: StudentLoanInputs = {
          gracePeriodMonths: Math.max(0, gracePeriod),
          loanType: studentLoanType,
          repaymentPlan,
        };
        return calcStudentLoan(safeAmount, safeRate, safeTerm, inputs);
      }
      default:
        return calcStandardLoan(safeAmount, safeRate, safeTerm);
    }
  }, [mode, amount, rate, termMonths, downPayment, tradeIn, salesTax, carFees, originationFee, additionalFees, gracePeriod, studentLoanType, repaymentPlan]);

  const interestRatio = result.totalRepayment > 0
    ? (result.totalInterest / result.totalRepayment) * 100
    : 0;

  // ── Derived principal for amortization (after mode adjustments) ──────────
  const effectivePrincipal = result.effectivePrincipal;
  const effectiveTerm = useMemo(() => {
    if (mode === "student" && repaymentPlan === "extended") return Math.min(termMonths * 2, 300);
    return termMonths;
  }, [mode, termMonths, repaymentPlan]);

  // ── Amortization schedule (base + with extra monthly) ────────────────────
  const amortizationBase = useMemo(
    () => generateAmortizationSchedule(effectivePrincipal, rate, effectiveTerm, 0),
    [effectivePrincipal, rate, effectiveTerm],
  );

  const amortizationWithExtra = useMemo(
    () =>
      extraMonthly > 0
        ? generateAmortizationSchedule(effectivePrincipal, rate, effectiveTerm, extraMonthly)
        : amortizationBase,
    [effectivePrincipal, rate, effectiveTerm, extraMonthly, amortizationBase],
  );

  const yearlySummary: YearlySummary[] = useMemo(
    () => generateYearlySummary(amortizationWithExtra),
    [amortizationWithExtra],
  );

  const yearlySummaryBase: YearlySummary[] = useMemo(
    () => generateYearlySummary(amortizationBase),
    [amortizationBase],
  );

  // ── Extra payment impact ─────────────────────────────────────────────────
  const extraMonthlyResult = useMemo(
    () =>
      extraMonthly > 0
        ? calcExtraMonthly(effectivePrincipal, rate, effectiveTerm, extraMonthly)
        : null,
    [effectivePrincipal, rate, effectiveTerm, extraMonthly],
  );

  const extraOneTimeResult = useMemo(
    () =>
      extraOneTime > 0
        ? calcOneTimeExtra(effectivePrincipal, rate, effectiveTerm, extraOneTime)
        : null,
    [effectivePrincipal, rate, effectiveTerm, extraOneTime],
  );

  // ── Scenario comparison ───────────────────────────────────────────────────
  const scenarios = useMemo(
    () => buildScenarioComparison(effectivePrincipal, rate, effectiveTerm),
    [effectivePrincipal, rate, effectiveTerm],
  );

  // ── Car depreciation ─────────────────────────────────────────────────────
  const depreciationSchedule = useMemo(
    () =>
      mode === "car"
        ? buildDepreciationSchedule(amount, effectivePrincipal, rate, effectiveTerm)
        : [],
    [mode, amount, effectivePrincipal, rate, effectiveTerm],
  );

  const cfg = loanModes[mode];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">

      {/* ── Mode selector ─────────────────────────────────────────────────── */}
      <div className="border-b border-gray-100 bg-gray-50/60 p-5">
        <ModeTabBar mode={mode} onChange={switchMode} />
      </div>

      {/* ── Inputs + Results layout ───────────────────────────────────────── */}
      <div className="grid gap-0 lg:grid-cols-2">

        {/* Left: inputs */}
        <div className="p-6 border-b lg:border-b-0 lg:border-r border-gray-100">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">

            {/* Amount */}
            <div className={mode === "car" ? "sm:col-span-2 xl:col-span-2" : ""}>
              <Label htmlFor={`${uid}-amount`}>{cfg.amountLabel}</Label>
              <NumberInput
                id={`${uid}-amount`}
                value={amount}
                onChange={setAmount}
                min={0}
                step={cfg.amountStep}
                prefix="$"
              />
            </div>

            {/* Car-specific inputs */}
            {mode === "car" && (
              <>
                <div>
                  <Label htmlFor={`${uid}-down`}>Down payment</Label>
                  <NumberInput id={`${uid}-down`} value={downPayment} onChange={setDownPayment} min={0} step={500} prefix="$" />
                </div>
                <div>
                  <Label htmlFor={`${uid}-tradein`}>Trade-in value</Label>
                  <NumberInput id={`${uid}-tradein`} value={tradeIn} onChange={setTradeIn} min={0} step={500} prefix="$" />
                </div>
                <div>
                  <Label htmlFor={`${uid}-tax`}>Sales tax</Label>
                  <NumberInput id={`${uid}-tax`} value={salesTax} onChange={setSalesTax} min={0} max={20} step={0.1} suffix="%" />
                </div>
                <div>
                  <Label htmlFor={`${uid}-carfees`}>Dealer / title fees</Label>
                  <NumberInput id={`${uid}-carfees`} value={carFees} onChange={setCarFees} min={0} step={100} prefix="$" />
                </div>
              </>
            )}

            {/* Personal loan extra inputs */}
            {mode === "personal" && (
              <>
                <div>
                  <Label htmlFor={`${uid}-origination`}>Origination fee</Label>
                  <NumberInput id={`${uid}-origination`} value={originationFee} onChange={setOriginationFee} min={0} max={10} step={0.1} suffix="%" />
                </div>
                <div>
                  <Label htmlFor={`${uid}-addlfees`}>Additional fees</Label>
                  <NumberInput id={`${uid}-addlfees`} value={additionalFees} onChange={setAdditionalFees} min={0} step={25} prefix="$" />
                </div>
              </>
            )}

            {/* Student loan extra inputs */}
            {mode === "student" && (
              <>
                <div>
                  <Label>Loan type</Label>
                  <SegmentedControl<StudentLoanType>
                    options={[
                      { label: "Subsidized", value: "subsidized" },
                      { label: "Unsubsidized", value: "unsubsidized" },
                    ]}
                    value={studentLoanType}
                    onChange={setStudentLoanType}
                  />
                </div>
                <div>
                  <Label>Repayment plan</Label>
                  <SegmentedControl<StudentRepaymentPlan>
                    options={[
                      { label: "Standard (10yr)", value: "standard" },
                      { label: "Extended (20yr)", value: "extended" },
                    ]}
                    value={repaymentPlan}
                    onChange={setRepaymentPlan}
                  />
                </div>
                <div>
                  <Label htmlFor={`${uid}-grace`}>Grace period</Label>
                  <NumberInput id={`${uid}-grace`} value={gracePeriod} onChange={setGracePeriod} min={0} max={12} step={1} suffix="mo" />
                  <p className="mt-1 text-xs text-gray-400">Federal loans: typically 6 months</p>
                </div>
              </>
            )}

            {/* Interest rate */}
            <div>
              <Label htmlFor={`${uid}-rate`}>Annual interest rate</Label>
              <NumberInput
                id={`${uid}-rate`}
                value={rate}
                onChange={setRate}
                min={0}
                max={50}
                step={0.05}
                suffix="%"
              />
              <p className="mt-1 text-xs text-gray-400">{cfg.rateHint}</p>
            </div>

            {/* Term */}
            <div className={mode === "student" ? "" : ""}>
              <TermPicker mode={mode} termMonths={termMonths} onChange={setTermMonths} uid={uid} />
            </div>

          </div>
        </div>

        {/* Right: results */}
        <div className="p-6 flex flex-col gap-5">

          {/* Hero payment */}
          <HeroPayment
            monthlyPayment={result.monthlyPayment}
            totalInterest={result.totalInterest}
            totalRepayment={result.totalRepayment}
            interestRatio={interestRatio}
          />

          {/* Loan summary */}
          <div className="rounded-xl border border-gray-100 bg-gray-50/60 px-4 py-2 divide-y divide-gray-100">
            {mode === "car" && (
              <>
                <ResultRow label="Vehicle price" value={fmt(amount)} />
                <ResultRow label="Down payment" value={`-${fmt(downPayment)}`} />
                {tradeIn > 0 && <ResultRow label="Trade-in value" value={`-${fmt(tradeIn)}`} />}
                {salesTax > 0 && <ResultRow label={`Sales tax (${salesTax}%)`} value={fmt((amount - tradeIn) * salesTax / 100)} />}
                {carFees > 0 && <ResultRow label="Fees" value={fmt(carFees)} />}
                <ResultRow label="Amount financed" value={fmt(result.effectivePrincipal)} highlight />
              </>
            )}
            {mode === "personal" && (
              <>
                <ResultRow label="Loan amount" value={fmt(amount)} />
                {originationFee > 0 && (
                  <ResultRow
                    label={`Origination fee (${originationFee}%)`}
                    value={fmt(amount * originationFee / 100)}
                  />
                )}
                {additionalFees > 0 && <ResultRow label="Additional fees" value={fmt(additionalFees)} />}
              </>
            )}
            {mode === "student" && (
              <>
                <ResultRow label="Loan balance" value={fmt(amount)} />
                {studentLoanType === "unsubsidized" && gracePeriod > 0 && (
                  <ResultRow
                    label={`Capitalized interest (${gracePeriod}-mo grace)`}
                    value={fmt((result as ReturnType<typeof calcStudentLoan>).capitalizedInterest ?? 0)}
                    sub="Accrues during grace period"
                  />
                )}
                <ResultRow label="Effective principal" value={fmt(result.effectivePrincipal)} />
                <ResultRow label={`Repayment term`} value={`${termMonths} months`} />
              </>
            )}
            {mode === "standard" && (
              <ResultRow label="Loan amount" value={fmt(amount)} />
            )}
            <ResultRow
              label={`Interest rate`}
              value={fmtPct(rate)}
              sub={result.effectiveAprPct !== rate ? `Effective APR: ${fmtPct(result.effectiveAprPct)}` : undefined}
            />
            <ResultRow label="Monthly payment" value={fmt(result.monthlyPayment, 2)} />
            <ResultRow label="Total interest" value={fmt(result.totalInterest)} />
            <ResultRow label="Total repayment" value={fmt(result.totalRepayment)} highlight />
          </div>

        </div>
      </div>

      {/* ── Bottom tab bar ──────────────────────────────────────────────────── */}
      <BottomTabBar
        active={activeTab}
        onChange={setActiveTab}
      />

      {/* ── Tab panels ──────────────────────────────────────────────────────── */}

      {/* SUMMARY */}
      {activeTab === "summary" && (
        <div className="p-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-100 bg-gray-50 px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Cost Multiple</p>
              <p className="text-2xl font-bold text-gray-800 tabular-nums">
                {result.effectivePrincipal > 0
                  ? `${(result.totalRepayment / result.effectivePrincipal).toFixed(2)}×`
                  : "—"}
              </p>
              <p className="mt-1 text-xs text-gray-400">You repay this multiple of what you borrowed</p>
            </div>
            <div className="rounded-xl border border-amber-100 bg-amber-50 px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-amber-500 mb-1">Interest Share</p>
              <p className="text-2xl font-bold text-amber-700 tabular-nums">
                {result.totalRepayment > 0
                  ? `${Math.round((result.totalInterest / result.totalRepayment) * 100)}%`
                  : "—"}
              </p>
              <p className="mt-1 text-xs text-gray-400">of your total repayment goes to interest</p>
            </div>
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-1">Daily Cost</p>
              <p className="text-2xl font-bold text-emerald-700 tabular-nums">
                {fmt(result.monthlyPayment / 30, 2)}
              </p>
              <p className="mt-1 text-xs text-gray-400">equivalent daily loan cost</p>
            </div>
          </div>
        </div>
      )}

      {/* AMORTIZATION */}
      {activeTab === "amortization" && (
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700">Amortization Schedule</h3>
            <SegmentedControl<"yearly" | "monthly">
              options={[
                { label: "Yearly", value: "yearly" },
                { label: "Monthly", value: "monthly" },
              ]}
              value={amortView}
              onChange={setAmortView}
            />
          </div>
          {amortizationWithExtra.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Enter a valid loan amount to see the schedule.</p>
          ) : amortView === "yearly" ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["Year", "Annual Payment", "Principal", "Interest", "Year-End Balance"].map((h) => (
                      <th key={h} className="pb-2 text-left font-semibold uppercase tracking-wider text-gray-400 pr-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {yearlySummary.map((row) => (
                    <tr key={row.year} className="border-b border-gray-50 hover:bg-gray-50/60">
                      <td className="py-2 pr-4 font-semibold text-gray-700">Yr {row.year}</td>
                      <td className="py-2 pr-4 tabular-nums text-gray-700">{fmt(row.totalPayment)}</td>
                      <td className="py-2 pr-4 tabular-nums text-emerald-700">{fmt(row.totalPrincipal)}</td>
                      <td className="py-2 pr-4 tabular-nums text-amber-600">{fmt(row.totalInterest)}</td>
                      <td className="py-2 pr-4 tabular-nums text-gray-700">{fmt(row.endBalance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-y-auto max-h-96">
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-white z-10">
                  <tr className="border-b border-gray-100">
                    {["Mo", "Payment", "Principal", "Interest", "Balance", "Cumulative Interest"].map((h) => (
                      <th key={h} className="pb-2 text-left font-semibold uppercase tracking-wider text-gray-400 pr-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {amortizationWithExtra.map((row) => (
                    <tr key={row.month} className="border-b border-gray-50 hover:bg-gray-50/60">
                      <td className="py-1.5 pr-3 font-medium text-gray-500">{row.month}</td>
                      <td className="py-1.5 pr-3 tabular-nums text-gray-700">{fmt(row.payment, 2)}</td>
                      <td className="py-1.5 pr-3 tabular-nums text-emerald-700">{fmt(row.principal, 2)}</td>
                      <td className="py-1.5 pr-3 tabular-nums text-amber-600">{fmt(row.interest, 2)}</td>
                      <td className="py-1.5 pr-3 tabular-nums text-gray-700">{fmt(row.balance)}</td>
                      <td className="py-1.5 pr-3 tabular-nums text-gray-400">{fmt(row.cumulativeInterest)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* EXTRA PAYMENTS */}
      <div className="border-t border-gray-100 p-6">
        <p className="mb-5 text-sm font-semibold text-gray-700">Extra Payments</p>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor={`${uid}-extra-monthly`}>Extra monthly payment</Label>
              <NumberInput
                id={`${uid}-extra-monthly`}
                value={extraMonthly}
                onChange={setExtraMonthly}
                min={0}
                step={50}
                prefix="$"
              />
              <p className="mt-1 text-xs text-gray-400">Added on top of your regular payment each month</p>
            </div>
            <div>
              <Label htmlFor={`${uid}-extra-once`}>One-time lump sum</Label>
              <NumberInput
                id={`${uid}-extra-once`}
                value={extraOneTime}
                onChange={setExtraOneTime}
                min={0}
                step={500}
                prefix="$"
              />
              <p className="mt-1 text-xs text-gray-400">Applied immediately to reduce the principal</p>
            </div>
          </div>

          {!extraMonthlyResult && !extraOneTimeResult ? (
            <div className="mt-5 rounded-xl border border-dashed border-gray-200 bg-gray-50 px-6 py-10 text-center">
              <p className="text-sm font-medium text-gray-500">Enter an extra payment above to see your savings</p>
              <p className="mt-1 text-xs text-gray-400">Even $50/month extra can save thousands in interest</p>
            </div>
          ) : (
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {extraMonthlyResult && (
                <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-3">Extra Monthly Impact</p>
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Pay off</span>
                      <span className="text-sm font-bold text-emerald-700">
                        {extraMonthlyResult.monthsSaved > 0 ? `${extraMonthlyResult.monthsSaved} months earlier` : "No change"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Interest saved</span>
                      <span className="text-sm font-bold text-emerald-700">{fmt(extraMonthlyResult.interestSaved)}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-emerald-100 pt-2">
                      <span className="text-sm text-gray-600">New term</span>
                      <span className="text-sm font-semibold text-gray-700">
                        {extraMonthlyResult.newTermMonths} mo
                        {extraMonthlyResult.newTermMonths >= 12 && ` (${(extraMonthlyResult.newTermMonths / 12).toFixed(1)} yrs)`}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">New total interest</span>
                      <span className="text-sm font-semibold text-gray-700">{fmt(extraMonthlyResult.newTotalInterest)}</span>
                    </div>
                  </div>
                </div>
              )}
              {extraOneTimeResult && (
                <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-3">Lump Sum Impact</p>
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Pay off</span>
                      <span className="text-sm font-bold text-blue-700">
                        {extraOneTimeResult.monthsSaved > 0 ? `${extraOneTimeResult.monthsSaved} months earlier` : "No change"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Interest saved</span>
                      <span className="text-sm font-bold text-blue-700">{fmt(extraOneTimeResult.interestSaved)}</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-blue-100 pt-2">
                      <span className="text-sm text-gray-600">New monthly payment</span>
                      <span className="text-sm font-semibold text-gray-700">{fmt(extraOneTimeResult.newMonthlyPayment, 2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">New total interest</span>
                      <span className="text-sm font-semibold text-gray-700">{fmt(extraOneTimeResult.newTotalInterest)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          {/* Extra payments chart */}
          {extraMonthlyResult && (
            <Suspense fallback={<p className="py-4 text-center text-sm text-gray-400">Loading chart…</p>}>
              <LoanExtraPaymentsChart baseYearly={yearlySummaryBase} extraYearly={yearlySummary} />
            </Suspense>
          )}
      </div>

      {/* SCENARIOS */}
      <div className="border-t border-gray-100 p-6">
        <p className="mb-1 text-sm font-semibold text-gray-700">Scenarios</p>
          <p className="text-xs text-gray-400 mb-4">Comparing your loan against two common alternative scenarios.</p>
          <div className="grid gap-4 sm:grid-cols-3">
            {([scenarios.base, scenarios.higherRate, scenarios.shorterTerm] as ScenarioResult[]).map((s, i) => {
              const isBase = i === 0;
              const diff = isBase ? null : s.totalCost - scenarios.base.totalCost;
              return (
                <div
                  key={s.label}
                  className={`rounded-xl border p-5 ${isBase ? "border-emerald-200 bg-emerald-50" : "border-gray-200 bg-white"}`}
                >
                  <p className={`text-xs font-semibold uppercase tracking-widest mb-3 ${isBase ? "text-emerald-600" : "text-gray-400"}`}>
                    {s.label}
                  </p>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-400">Monthly payment</p>
                      <p className={`text-xl font-bold tabular-nums ${isBase ? "text-emerald-700" : "text-gray-800"}`}>
                        {fmt(s.monthlyPayment, 2)}
                      </p>
                      {!isBase && (
                        <p className="text-xs tabular-nums text-red-500">
                          +{fmt(s.monthlyPayment - scenarios.base.monthlyPayment, 2)}/mo
                        </p>
                      )}
                    </div>
                    <div className="flex justify-between pt-1 border-t border-gray-100">
                      <span className="text-xs text-gray-500">Total interest</span>
                      <span className="text-xs font-semibold tabular-nums text-amber-600">{fmt(s.totalInterest)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">Total cost</span>
                      <span className="text-xs font-semibold tabular-nums text-gray-700">{fmt(s.totalCost)}</span>
                    </div>
                    {diff !== null && (
                      <div className="flex justify-between pt-1 border-t border-gray-100">
                        <span className="text-xs text-gray-500">vs. your loan</span>
                        <span className={`text-xs font-bold tabular-nums ${diff > 0 ? "text-red-500" : "text-emerald-600"}`}>
                          {diff > 0 ? "+" : ""}{fmt(diff)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500">Term</span>
                      <span className="text-xs font-semibold text-gray-700">{s.termMonths} mo</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Scenarios chart */}
          <Suspense fallback={<p className="py-4 text-center text-sm text-gray-400">Loading charts…</p>}>
            <LoanScenariosChart scenarios={[scenarios.base, scenarios.higherRate, scenarios.shorterTerm]} />
          </Suspense>

          {extraMonthlyResult && (
            <div className="mt-6">
              <p className="text-xs font-semibold text-gray-500 mb-3">With vs. Without Extra Payments</p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-gray-200 bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Standard</p>
                  <p className="text-xl font-bold text-gray-800 tabular-nums">
                    {fmt(result.monthlyPayment, 2)}<span className="text-sm font-normal text-gray-400">/mo</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Total interest: {fmt(result.totalInterest)}</p>
                  <p className="text-xs text-gray-500">Term: {effectiveTerm} months</p>
                </div>
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-2">
                    With Extra {fmt(extraMonthly)}/mo
                  </p>
                  <p className="text-xl font-bold text-emerald-700 tabular-nums">
                    {fmt(extraMonthlyResult.newMonthlyPayment, 2)}<span className="text-sm font-normal text-emerald-500">/mo</span>
                  </p>
                  <p className="text-xs text-emerald-700 mt-1 font-semibold">
                    Interest saved: {fmt(extraMonthlyResult.interestSaved)}
                  </p>
                  <p className="text-xs text-emerald-700">
                    Pay off {extraMonthlyResult.monthsSaved} months earlier
                  </p>
                </div>
              </div>
            </div>
          )}

          {mode === "car" && depreciationSchedule.length > 0 && (
            <div className="mt-6">
              <p className="text-xs font-semibold text-gray-500 mb-3">Car Value vs. Loan Balance</p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {["Year", "Car Value", "Loan Balance", "Equity"].map((h) => (
                        <th key={h} className="pb-2 text-left font-semibold uppercase tracking-wider text-gray-400 pr-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {depreciationSchedule.map((row) => (
                      <tr key={row.year} className="border-b border-gray-50 hover:bg-gray-50/60">
                        <td className="py-2 pr-4 font-semibold text-gray-700">Yr {row.year}</td>
                        <td className="py-2 pr-4 tabular-nums text-gray-700">{fmt(row.carValue)}</td>
                        <td className="py-2 pr-4 tabular-nums text-amber-600">{fmt(row.loanBalance)}</td>
                        <td className={`py-2 pr-4 tabular-nums font-semibold ${row.equity > 0 ? "text-emerald-700" : "text-red-500"}`}>
                          {row.equity > 0 ? fmt(row.equity) : `-${fmt(row.loanBalance - row.carValue)}`}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
      </div>

      {/* CHARTS */}
      <div className="border-t border-gray-100 p-6">
        <p className="mb-5 text-sm font-semibold text-gray-700">Charts</p>
          <Suspense fallback={<p className="py-8 text-center text-sm text-gray-400">Loading charts…</p>}>
            <LoanChartsPanel
              baseYearly={yearlySummaryBase}
              extraYearly={yearlySummary}
              hasExtraPayments={extraMonthly > 0}
            />
          </Suspense>
      </div>

      {/* INSIGHTS */}
      <div className="border-t border-gray-100 p-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Your Loan Insights</p>
          <div className="space-y-3">
            {[
              {
                icon: "💰",
                text: `You will pay ${fmt(result.totalInterest)} in interest — that's ${result.effectivePrincipal > 0 ? Math.round((result.totalInterest / result.effectivePrincipal) * 100) : 0}% of your original loan amount.`,
                color: "border-amber-100 bg-amber-50",
              },
              {
                icon: "📊",
                text: `Your loan will cost ${result.effectivePrincipal > 0 ? ((result.totalRepayment / result.effectivePrincipal) * 100).toFixed(0) : 0}% of what you borrowed in total — you repay ${fmt(result.totalRepayment)} on a ${fmt(result.effectivePrincipal)} loan.`,
                color: "border-gray-100 bg-gray-50",
              },
              extraMonthly > 0 && extraMonthlyResult
                ? {
                    icon: "🚀",
                    text: `By paying an extra ${fmt(extraMonthly)}/month, you pay off ${extraMonthlyResult.monthsSaved} months earlier and save ${fmt(extraMonthlyResult.interestSaved)} in interest.`,
                    color: "border-emerald-100 bg-emerald-50",
                  }
                : {
                    icon: "💡",
                    text: `Adding just ${fmt(Math.round(result.monthlyPayment * 0.1))}/month extra (10% more) could save you thousands. Try the Extra Payments tab.`,
                    color: "border-emerald-100 bg-emerald-50",
                  },
              {
                icon: "📅",
                text: `Your loan term is ${effectiveTerm} months (${(effectiveTerm / 12).toFixed(1)} years). ${effectiveTerm > 60 ? "Longer terms lower monthly payments but cost significantly more in interest." : "Shorter terms keep total interest costs down."}`,
                color: "border-blue-100 bg-blue-50",
              },
              ...(result.effectiveAprPct !== rate
                ? [
                    {
                      icon: "⚠️",
                      text: `Your stated rate is ${fmtPct(rate)}, but including fees your effective APR is ${fmtPct(result.effectiveAprPct)}. Always compare loans by APR.`,
                      color: "border-orange-100 bg-orange-50",
                    },
                  ]
                : []),
              ...(mode === "car" && depreciationSchedule.length > 0
                ? [
                    {
                      icon: "🚗",
                      text: `Cars typically lose ~20% in year one and ~15%/year after. ${depreciationSchedule[0] ? `Your vehicle may be worth ~${fmt(depreciationSchedule[0].carValue)} after year 1, while your loan balance will be ~${fmt(depreciationSchedule[0].loanBalance)}.` : ""}`,
                      color: "border-gray-100 bg-gray-50",
                    },
                  ]
                : []),
              ...(mode === "student" && studentLoanType === "unsubsidized" && gracePeriod > 0
                ? [
                    {
                      icon: "🎓",
                      text: `Unsubsidized loans accrue interest during your ${gracePeriod}-month grace period. This capitalizes into your principal — you'll pay interest on that interest for the life of the loan.`,
                      color: "border-purple-100 bg-purple-50",
                    },
                  ]
                : []),
            ].map((ins, i) => (
              <div key={i} className={`flex gap-3 rounded-xl border px-4 py-4 ${ins.color}`}>
                <span className="text-lg leading-none mt-0.5 select-none">{ins.icon}</span>
                <p className="text-sm leading-relaxed text-gray-700">{ins.text}</p>
              </div>
            ))}
          </div>
      </div>

    </div>
  );
}
