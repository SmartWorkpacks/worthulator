"use client";

import { useState, useMemo, useId, lazy, Suspense } from "react";
import {
  mortgageConfig,
  calcMonthlyPI,
  calcMonthlyTax,
  calcMonthlyInsurance,
  calcMonthlyPMI,
  calcAffordability,
  buildAmortizationScheduleEx,
  buildYearlySummary,
} from "@/lib/configs/mortgageConfig";

const MortgageChartsPanel = lazy(() => import("./MortgageCharts"));

// ─── Small shared primitives ────────────────────────────────────────────────

const fmt = (n: number, decimals = 0) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: decimals,
  });

const pct = (n: number) => `${Math.round(n * 10) / 10}%`;

function Label({ htmlFor, children }: { htmlFor?: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1.5">
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

// ─── Result card ────────────────────────────────────────────────────────────

function ResultRow({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`flex items-center justify-between py-2 ${highlight ? "font-semibold" : ""}`}>
      <span className={`text-sm ${highlight ? "text-gray-800" : "text-gray-500"}`}>{label}</span>
      <span className={`text-sm tabular-nums ${highlight ? "text-emerald-700 text-base" : "text-gray-700"}`}>
        {value}
      </span>
    </div>
  );
}

// ─── Amortisation table ─────────────────────────────────────────────────────

function AmortTable({ rows }: { rows: import("@/lib/configs/mortgageConfig").AmortizationRow[] }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? rows : rows.slice(0, 24);
  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full min-w-130 text-xs">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-left">
              {["Month", "Payment", "Principal", "Interest", "Balance"].map((h) => (
                <th key={h} className="px-4 py-2.5 font-semibold text-gray-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {visible.map((row) => (
              <tr key={row.month} className="hover:bg-gray-50/60">
                <td className="px-4 py-2 tabular-nums text-gray-500">{row.month}</td>
                <td className="px-4 py-2 tabular-nums text-gray-700">{fmt(row.payment + row.extraPayment)}</td>
                <td className="px-4 py-2 tabular-nums text-emerald-700">{fmt(row.principal + row.extraPayment)}</td>
                <td className="px-4 py-2 tabular-nums text-amber-600">{fmt(row.interest)}</td>
                <td className="px-4 py-2 tabular-nums text-gray-700">{fmt(row.balance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length > 24 && (
        <button
          type="button"
          onClick={() => setExpanded((p) => !p)}
          className="mt-2 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
        >
          {expanded ? "Show less" : `Show all ${rows.length} months`}
        </button>
      )}
    </div>
  );
}

// ─── Main component ─────────────────────────────────────────────────────────

type DownPaymentMode = "percent" | "amount";
type TabId = "schedule";

export default function MortgageCalculator() {
  const uid = useId();
  const [showSchedule, setShowSchedule] = useState(false);

  // ── Core inputs ──────────────────────────────────────────────────────────
  const [homePrice, setHomePrice] = useState(400000);
  const [downMode, setDownMode] = useState<DownPaymentMode>("percent");
  const [downPct, setDownPct] = useState(20);
  const [downAmt, setDownAmt] = useState(80000);
  const [termYears, setTermYears] = useState(30);
  const [interestRate, setInterestRate] = useState(mortgageConfig.defaultRates.thirtyYear);

  // ── Advanced inputs ──────────────────────────────────────────────────────
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [propertyTaxPct, setPropertyTaxPct] = useState(mortgageConfig.propertyTax.default);
  const [insurancePct, setInsurancePct] = useState(mortgageConfig.insurance.default);
  const [hoaMonthly, setHoaMonthly] = useState(0);

  // ── Extra payments ───────────────────────────────────────────────────────
  const [extraMonthly, setExtraMonthly] = useState(0);
  const [extraYearly, setExtraYearly] = useState(0);
  const [extraOneTime, setExtraOneTime] = useState(0);
  const [extraOneTimeMonth, setExtraOneTimeMonth] = useState(12);

  // ── Affordability inputs ─────────────────────────────────────────────────
  const [showAffordability, setShowAffordability] = useState(false);
  const [annualIncome, setAnnualIncome] = useState(0);
  const [monthlyDebt, setMonthlyDebt] = useState(0);

  // ── Derived ──────────────────────────────────────────────────────────────
  const downPayment = useMemo(() => {
    if (downMode === "percent") return (homePrice * downPct) / 100;
    return downAmt;
  }, [downMode, homePrice, downPct, downAmt]);

  const loanAmount = Math.max(0, homePrice - downPayment);
  const ltv = homePrice > 0 ? loanAmount / homePrice : 0;

  const monthlyPI = useMemo(
    () => calcMonthlyPI(loanAmount, interestRate, termYears),
    [loanAmount, interestRate, termYears],
  );
  const monthlyTax = useMemo(
    () => calcMonthlyTax(homePrice, propertyTaxPct),
    [homePrice, propertyTaxPct],
  );
  const monthlyIns = useMemo(
    () => calcMonthlyInsurance(homePrice, insurancePct),
    [homePrice, insurancePct],
  );
  const monthlyPMI = useMemo(
    () => calcMonthlyPMI(loanAmount, homePrice, mortgageConfig.pmi.annualRateDefault),
    [loanAmount, homePrice],
  );
  const totalMonthly = monthlyPI + monthlyTax + monthlyIns + monthlyPMI + hoaMonthly;

  const hasExtras = extraMonthly > 0 || extraYearly > 0 || extraOneTime > 0;

  // Base schedule (no extras) for comparison
  const baseSchedule = useMemo(
    () => buildAmortizationScheduleEx(loanAmount, interestRate, termYears),
    [loanAmount, interestRate, termYears],
  );

  // Enhanced schedule (with extras)
  const schedule = useMemo(
    () =>
      buildAmortizationScheduleEx(loanAmount, interestRate, termYears, {
        monthly: extraMonthly,
        yearly: extraYearly,
        oneTimeAmt: extraOneTime,
        oneTimeMonth: extraOneTimeMonth,
      }),
    [loanAmount, interestRate, termYears, extraMonthly, extraYearly, extraOneTime, extraOneTimeMonth],
  );

  const baseYearly = useMemo(() => buildYearlySummary(baseSchedule), [baseSchedule]);
  const enhancedYearly = useMemo(() => buildYearlySummary(schedule), [schedule]);

  const totalInterest = useMemo(
    () => schedule.reduce((sum, r) => sum + r.interest, 0),
    [schedule],
  );
  const baseInterest = useMemo(
    () => baseSchedule.reduce((sum, r) => sum + r.interest, 0),
    [baseSchedule],
  );
  const interestSaved = Math.max(0, baseInterest - totalInterest);
  const totalCost = loanAmount + totalInterest;
  const payoffMonths = schedule.length;
  const monthsSaved = termYears * 12 - payoffMonths;

  const payoffDate = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + payoffMonths);
    return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  }, [payoffMonths]);

  const affordability = useMemo(() => {
    if (!showAffordability || annualIncome <= 0) return null;
    return calcAffordability(
      annualIncome, monthlyDebt, interestRate, termYears,
      downPayment, propertyTaxPct, insurancePct, mortgageConfig,
    );
  }, [showAffordability, annualIncome, monthlyDebt, interestRate, termYears, downPayment, propertyTaxPct, insurancePct]);

  const handleTermChange = (years: number) => {
    setTermYears(years);
    if (years === 30) setInterestRate(mortgageConfig.defaultRates.thirtyYear);
    else if (years === 15) setInterestRate(mortgageConfig.defaultRates.fifteenYear);
    else if (years === 10) setInterestRate(mortgageConfig.defaultRates.tenYear);
  };

  const segments = [
    { label: "Principal & Interest", value: monthlyPI, color: "bg-emerald-500" },
    { label: "Property Tax",         value: monthlyTax, color: "bg-blue-400" },
    { label: "Insurance",            value: monthlyIns, color: "bg-amber-400" },
    ...(monthlyPMI > 0 ? [{ label: "PMI",  value: monthlyPMI,  color: "bg-rose-400" }] : []),
    ...(hoaMonthly > 0 ? [{ label: "HOA",  value: hoaMonthly,  color: "bg-purple-400" }] : []),
  ];

  const breakdownItems = [
    { label: "Principal & Interest", value: monthlyPI,  color: "#10b981" },
    { label: "Property Tax",         value: monthlyTax, color: "#60a5fa" },
    { label: "Insurance",            value: monthlyIns, color: "#fbbf24" },
    ...(monthlyPMI > 0 ? [{ label: "PMI", value: monthlyPMI, color: "#f87171" }] : []),
    ...(hoaMonthly > 0 ? [{ label: "HOA", value: hoaMonthly, color: "#a78bfa" }] : []),
  ];

  const TABS: { id: TabId; label: string }[] = [
    { id: "schedule", label: "Schedule" },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">

      {/* ── Input section ────────────────────────────────────────────────── */}
      <div className="p-6 border-b border-gray-100">
        <div className="grid gap-5 sm:grid-cols-2">

          {/* Home Price */}
          <div>
            <Label htmlFor={`${uid}-price`}>Home price</Label>
            <NumberInput
              id={`${uid}-price`}
              value={homePrice}
              onChange={setHomePrice}
              min={10000}
              step={5000}
              prefix="$"
            />
          </div>

          {/* Down Payment */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <Label>Down payment</Label>
              <SegmentedControl
                options={[{ label: "%", value: "percent" }, { label: "$", value: "amount" }]}
                value={downMode}
                onChange={setDownMode}
              />
            </div>
            {downMode === "percent" ? (
              <NumberInput
                value={downPct}
                onChange={(v) => { setDownPct(v); setDownAmt(Math.round((homePrice * v) / 100)); }}
                min={0} max={100} step={0.5} suffix="%"
              />
            ) : (
              <NumberInput
                value={downAmt}
                onChange={(v) => { setDownAmt(v); setDownPct(homePrice > 0 ? Math.round((v / homePrice) * 1000) / 10 : 0); }}
                min={0} step={1000} prefix="$"
              />
            )}
            <p className="mt-1 text-xs text-gray-400">
              {downMode === "percent"
                ? `= ${fmt(downPayment)} · LTV ${pct(ltv * 100)}`
                : `= ${pct((downPayment / homePrice) * 100)} · LTV ${pct(ltv * 100)}`}
              {ltv > mortgageConfig.pmi.ltvThreshold && (
                <span className="ml-1 text-amber-500">· PMI applies</span>
              )}
            </p>
          </div>

          {/* Loan Term */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <Label>Loan term</Label>
              <span className="text-xs text-gray-400">or enter custom</span>
            </div>
            <div className="flex gap-2">
              {mortgageConfig.loanTerms.map((t) => (
                <button
                  key={t.years} type="button"
                  onClick={() => handleTermChange(t.years)}
                  className={`flex-1 rounded-xl border px-3 py-2.5 text-xs font-semibold transition ${
                    termYears === t.years
                      ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {t.label}
                </button>
              ))}
              <NumberInput
                value={termYears}
                onChange={(v) => setTermYears(Math.max(1, Math.min(50, Math.round(v))))}
                min={1}
                max={50}
                step={1}
                suffix="yr"
              />
            </div>
          </div>

          {/* Interest Rate */}
          <div>
            <Label htmlFor={`${uid}-rate`}>Interest rate</Label>
            <NumberInput
              id={`${uid}-rate`}
              value={interestRate}
              onChange={setInterestRate}
              min={0.1} max={20} step={0.05} suffix="%"
            />
            <p className="mt-1 text-xs text-gray-400">
              30yr avg {mortgageConfig.defaultRates.thirtyYear}% · 15yr avg {mortgageConfig.defaultRates.fifteenYear}%
            </p>
          </div>
        </div>

        {/* Advanced toggle */}
        <button
          type="button"
          onClick={() => setShowAdvanced((p) => !p)}
          className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
        >
          <span>{showAdvanced ? "▲" : "▼"}</span>
          {showAdvanced ? "Hide" : "Show"} taxes, insurance &amp; extra payments
        </button>

        {showAdvanced && (
          <div className="mt-4 border-t border-gray-100 pt-4 space-y-4">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor={`${uid}-tax`}>Property tax rate</Label>
                <NumberInput id={`${uid}-tax`} value={propertyTaxPct} onChange={setPropertyTaxPct} min={0} max={5} step={0.05} suffix="%/yr" />
                <p className="mt-1 text-xs text-gray-400">US avg ~1.1% · High-tax states ~2.2%</p>
              </div>
              <div>
                <Label htmlFor={`${uid}-ins`}>Homeowner&apos;s insurance</Label>
                <NumberInput id={`${uid}-ins`} value={insurancePct} onChange={setInsurancePct} min={0} max={3} step={0.05} suffix="%/yr" />
                <p className="mt-1 text-xs text-gray-400">Typical 0.25–1% of home value</p>
              </div>
              <div>
                <Label htmlFor={`${uid}-hoa`}>HOA fee</Label>
                <NumberInput id={`${uid}-hoa`} value={hoaMonthly} onChange={setHoaMonthly} min={0} step={25} prefix="$" suffix="/mo" />
              </div>
            </div>

            {/* Extra payments */}
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">Extra payments</p>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <Label htmlFor={`${uid}-xm`}>Extra monthly</Label>
                  <NumberInput id={`${uid}-xm`} value={extraMonthly} onChange={setExtraMonthly} min={0} step={50} prefix="$" suffix="/mo" />
                </div>
                <div>
                  <Label htmlFor={`${uid}-xy`}>Extra yearly</Label>
                  <NumberInput id={`${uid}-xy`} value={extraYearly} onChange={setExtraYearly} min={0} step={100} prefix="$" suffix="/yr" />
                </div>
                <div>
                  <Label htmlFor={`${uid}-xo`}>One-time payment</Label>
                  <NumberInput id={`${uid}-xo`} value={extraOneTime} onChange={setExtraOneTime} min={0} step={500} prefix="$" />
                  {extraOneTime > 0 && (
                    <div className="mt-1.5">
                      <Label htmlFor={`${uid}-xom`}>At month #</Label>
                      <NumberInput id={`${uid}-xom`} value={extraOneTimeMonth} onChange={setExtraOneTimeMonth} min={1} max={termYears * 12} step={1} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Affordability toggle */}
        <button
          type="button"
          onClick={() => setShowAffordability((p) => !p)}
          className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700"
        >
          <span>{showAffordability ? "▲" : "▼"}</span>
          {showAffordability ? "Hide" : "Check"} affordability
        </button>

        {showAffordability && (
          <div className="mt-4 grid gap-5 sm:grid-cols-2 border-t border-gray-100 pt-4">
            <div>
              <Label htmlFor={`${uid}-income`}>Gross annual income</Label>
              <NumberInput id={`${uid}-income`} value={annualIncome} onChange={setAnnualIncome} min={0} step={5000} prefix="$" />
            </div>
            <div>
              <Label htmlFor={`${uid}-debt`}>Monthly debt payments</Label>
              <NumberInput id={`${uid}-debt`} value={monthlyDebt} onChange={setMonthlyDebt} min={0} step={50} prefix="$" suffix="/mo" />
              <p className="mt-1 text-xs text-gray-400">Car loans, student loans, credit cards</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Results hero ──────────────────────────────────────────────────── */}
      <div className="px-6 pt-6 bg-gray-50">
        <div className="mb-5 rounded-xl bg-emerald-600 px-5 py-4 text-white shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-widest text-emerald-100 mb-1">
            Estimated monthly payment
          </p>
          <p className="text-4xl font-bold tabular-nums">{fmt(totalMonthly)}</p>
          <p className="mt-1 text-sm text-emerald-100">
            P&amp;I {fmt(monthlyPI)} · Tax {fmt(monthlyTax)} · Ins {fmt(monthlyIns)}
            {monthlyPMI > 0 && ` · PMI ${fmt(monthlyPMI)}`}
            {hoaMonthly > 0 && ` · HOA ${fmt(hoaMonthly)}`}
          </p>
        </div>

        {/* Breakdown bar */}
        <div className="mb-5">
          <div className="flex h-3 w-full overflow-hidden rounded-full gap-0.5">
            {segments.map((seg) => (
              <div
                key={seg.label}
                className={`${seg.color} transition-all`}
                style={{ width: `${totalMonthly > 0 ? (seg.value / totalMonthly) * 100 : 0}%` }}
                title={`${seg.label}: ${fmt(seg.value)}`}
              />
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
            {segments.map((seg) => (
              <span key={seg.label} className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className={`inline-block h-2 w-2 rounded-full ${seg.color}`} />
                {seg.label} <span className="text-gray-700 font-medium">{fmt(seg.value)}</span>
              </span>
            ))}
          </div>
        </div>

        {/* Extra payment impact callout */}
        {hasExtras && interestSaved > 0 && (
          <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
            <p className="text-sm font-semibold text-emerald-800">Extra payment impact</p>
            <div className="mt-1.5 flex flex-wrap gap-x-6 gap-y-1 text-sm text-emerald-700">
              <span>Save <strong>{fmt(interestSaved)}</strong> in interest</span>
              <span>Pay off <strong>{monthsSaved >= 12 ? `${Math.floor(monthsSaved / 12)} yr${Math.floor(monthsSaved / 12) !== 1 ? "s" : ""} ${monthsSaved % 12} mo` : `${monthsSaved} mo`}</strong> earlier</span>
            </div>
          </div>
        )}

        {/* Amortization schedule toggle */}
        <div className="flex gap-1 border-b border-gray-200 mb-0">
          <button
            type="button"
            onClick={() => setShowSchedule((p) => !p)}
            className="px-4 py-2.5 text-xs font-semibold text-gray-500 hover:text-gray-700 border-b-2 border-transparent -mb-px"
          >
            {showSchedule ? "Hide Schedule" : "Show Amortization Schedule"}
          </button>
        </div>
      </div>

      {/* ── Tab panels ────────────────────────────────────────────────────── */}
      <div className="p-6 bg-gray-50 space-y-6">

        {/* Summary */}
        <div className="space-y-4">
            <div className="rounded-xl border border-gray-200 bg-white divide-y divide-gray-100 overflow-hidden">
              <ResultRow label="Loan amount"      value={fmt(loanAmount)} />
              <ResultRow label="Down payment"     value={`${fmt(downPayment)} (${pct((downPayment / homePrice) * 100)})`} />
              <ResultRow label="Interest rate"    value={`${interestRate}%`} />
              <ResultRow label="Total interest"   value={fmt(totalInterest)} />
              <ResultRow label="Total cost"       value={fmt(totalCost)} />
              <ResultRow label="Payoff date"      value={payoffDate} />
              {hasExtras && monthsSaved > 0 && (
                <ResultRow label="Months saved"   value={`${monthsSaved} months`} />
              )}
              {hasExtras && interestSaved > 0 && (
                <ResultRow label="Interest saved" value={fmt(interestSaved)} />
              )}
              {ltv > mortgageConfig.pmi.ltvThreshold && (
                <ResultRow label="PMI (until 80% LTV)" value={`${fmt(monthlyPMI)}/mo`} />
              )}
            </div>

            {affordability && (
              <div className={`rounded-xl border px-4 py-3 text-sm ${
                affordability.eligible
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-rose-200 bg-rose-50 text-rose-800"
              }`}>
                <p className="font-semibold mb-1">Affordability estimate</p>
                <p>{affordability.message}</p>
                <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs opacity-80">
                  <span>Front-end DTI: {pct(affordability.frontEndRatio)} (max {mortgageConfig.dti.frontEndMax}%)</span>
                  <span>Back-end DTI: {pct(affordability.backEndRatio)} (max {mortgageConfig.dti.backEndMax}%)</span>
                </div>
              </div>
            )}
          </div>

        {/* Charts — always visible */}
        <Suspense fallback={
            <div className="flex items-center justify-center py-16 text-sm text-gray-400">Loading charts…</div>
          }>
            <MortgageChartsPanel
              baseYearly={baseYearly}
              enhancedYearly={enhancedYearly}
              hasExtraPayments={hasExtras}
              breakdownItems={breakdownItems}
            />
          </Suspense>

        {/* Schedule — collapsible */}
        {showSchedule && (
          <AmortTable rows={schedule} />
        )}
      </div>
    </div>
  );
}
