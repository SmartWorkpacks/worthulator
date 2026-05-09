"use client";

import { useState, useMemo, useId, lazy, Suspense } from "react";
import {
  compoundInterestConfig,
  buildCompoundSchedule,
  buildCompoundScheduleAdvanced,
  adjustForInflation,
  calcAfterTax,
} from "@/lib/configs/compoundInterestConfig";

const CompoundInterestChartsPanel = lazy(() => import("./CompoundInterestCharts"));

// ─── Formatting helpers ──────────────────────────────────────────────────────

const fmt = (n: number, decimals = 0) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: decimals,
  });

// ─── Shared primitives ───────────────────────────────────────────────────────

function Label({
  htmlFor,
  children,
}: {
  htmlFor?: string;
  children: React.ReactNode;
}) {
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
}: {
  label: string;
  value: string;
  highlight?: boolean;
  sub?: string;
}) {
  return (
    <div className={`flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0 ${highlight ? "font-semibold" : ""}`}>
      <div>
        <span className={`text-sm ${highlight ? "text-gray-800" : "text-gray-500"}`}>{label}</span>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
      <span className={`text-sm tabular-nums ${highlight ? "text-emerald-700 text-base" : "text-gray-700"}`}>
        {value}
      </span>
    </div>
  );
}

// ─── Growth schedule table ───────────────────────────────────────────────────

function GrowthTable({
  rows,
}: {
  rows: import("@/lib/configs/compoundInterestConfig").GrowthRow[];
}) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? rows : rows.slice(0, 11); // year 0–10

  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full min-w-130 text-xs">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-left">
              {["Year", "Yearly Contribution", "Yearly Interest", "Total Contributed", "Balance"].map((h) => (
                <th key={h} className="px-4 py-2.5 font-semibold text-gray-500">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {visible.map((row) => (
              <tr key={row.year} className="hover:bg-gray-50/60">
                <td className="px-4 py-2 tabular-nums text-gray-500">
                  {row.year === 0 ? "Start" : `Year ${row.year}`}
                </td>
                <td className="px-4 py-2 tabular-nums text-gray-700">
                  {row.year === 0 ? "—" : fmt(row.yearlyContribution)}
                </td>
                <td className="px-4 py-2 tabular-nums text-emerald-700">
                  {row.year === 0 ? "—" : fmt(row.yearlyInterest)}
                </td>
                <td className="px-4 py-2 tabular-nums text-gray-700">
                  {fmt(row.totalContributions)}
                </td>
                <td className="px-4 py-2 tabular-nums font-medium text-gray-800">
                  {fmt(row.balance)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length > 11 && (
        <button
          type="button"
          onClick={() => setExpanded((p) => !p)}
          className="mt-2 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
        >
          {expanded ? "Show less" : `Show all ${rows.length - 1} years`}
        </button>
      )}
    </div>
  );
}

// ─── Stat card ───────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  accent = false,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div className={`rounded-2xl border p-4 ${accent ? "border-emerald-200 bg-emerald-50" : "border-gray-100 bg-gray-50"}`}>
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">{label}</p>
      <p className={`text-2xl font-bold tabular-nums ${accent ? "text-emerald-700" : "text-gray-800"}`}>
        {value}
      </p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
    </div>
  );
}

// ─── Compounding bar (visual insight) ────────────────────────────────────────

function CompoundingInsight({
  contributions,
  interest,
}: {
  contributions: number;
  interest: number;
}) {
  const total = contributions + interest;
  const interestPct = total > 0 ? (interest / total) * 100 : 0;
  const contribPct = 100 - interestPct;

  return (
    <div className="rounded-2xl border border-emerald-100 bg-linear-to-br from-emerald-50 to-white p-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-3">
        The Power of Compounding
      </p>
      <div className="flex rounded-full overflow-hidden h-4 mb-3">
        <div
          className="bg-gray-300 transition-all duration-500"
          style={{ width: `${contribPct}%` }}
          title={`Contributions: ${Math.round(contribPct)}%`}
        />
        <div
          className="bg-emerald-500 transition-all duration-500"
          style={{ width: `${interestPct}%` }}
          title={`Interest: ${Math.round(interestPct)}%`}
        />
      </div>
      <div className="flex gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full bg-gray-300" />
          Money you invested ({Math.round(contribPct)}%)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full bg-emerald-500" />
          Interest earned ({Math.round(interestPct)}%)
        </span>
      </div>
      {interestPct > 0 && (
        <p className="mt-3 text-sm text-emerald-700 font-medium">
          Interest makes up {Math.round(interestPct)}% of your final balance — that&apos;s compounding at work.
        </p>
      )}
    </div>
  );
}

// ─── Insight item ────────────────────────────────────────────────────────────

function InsightItem({
  icon,
  text,
  sub,
  accent = false,
}: {
  icon: string;
  text: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div className={`flex gap-3 rounded-xl p-3.5 ${accent ? "border border-emerald-200 bg-emerald-50" : "bg-gray-50"}`}>
      <span className="text-xl leading-none mt-0.5 select-none">{icon}</span>
      <div>
        <p className={`text-sm font-medium ${accent ? "text-emerald-800" : "text-gray-700"}`}>{text}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

type TabId = "schedule";
type CompoundingKey = "Monthly" | "Quarterly" | "Annually";

export default function CompoundInterestCalculator() {
  const uid = useId();
  const { defaults } = compoundInterestConfig;

  // ── Core inputs ─────────────────────────────────────────────────────────
  const [principal, setPrincipal] = useState(defaults.principal);
  const [monthlyContrib, setMonthlyContrib] = useState(defaults.monthlyContribution);
  const [annualRate, setAnnualRate] = useState(defaults.annualRatePct);
  const [years, setYears] = useState(defaults.years);
  const [compounding, setCompounding] = useState<CompoundingKey>("Monthly");
  const [showSchedule, setShowSchedule] = useState(false);

  // ── Advanced inputs ──────────────────────────────────────────────────────
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [inflationRate, setInflationRate] = useState(2.5);
  const [contribGrowthPct, setContribGrowthPct] = useState(0);
  const [taxEnabled, setTaxEnabled] = useState(false);
  const [taxRate, setTaxRate] = useState(22);

  // ── Derived ─────────────────────────────────────────────────────────────
  const periodsPerYear = useMemo(() => {
    const opt = compoundInterestConfig.compoundingOptions.find((o) => o.label === compounding);
    return opt?.periodsPerYear ?? 12;
  }, [compounding]);

  const result = useMemo(
    () => buildCompoundScheduleAdvanced(
      principal, monthlyContrib, annualRate, Math.max(1, years), periodsPerYear, contribGrowthPct,
    ),
    [principal, monthlyContrib, annualRate, years, periodsPerYear, contribGrowthPct],
  );

  const multiplier = result.totalContributions > 0
    ? result.finalBalance / result.totalContributions
    : 1;

  // ── Advanced derived ─────────────────────────────────────────────────────
  const inflation = useMemo(
    () => adjustForInflation(result.finalBalance, inflationRate, years),
    [result.finalBalance, inflationRate, years],
  );

  const tax = useMemo(
    () => calcAfterTax(result.finalBalance, result.totalContributions, taxRate),
    [result.finalBalance, result.totalContributions, taxRate],
  );

  const lumpSumResult = useMemo(
    () => buildCompoundSchedule(principal, 0, annualRate, Math.max(1, years), periodsPerYear),
    [principal, annualRate, years, periodsPerYear],
  );

  const doubleYear = useMemo(
    () => result.schedule.find((r) => r.year > 0 && r.balance >= principal * 2)?.year,
    [result.schedule, principal],
  );

  const TABS: { id: TabId; label: string }[] = [
    { id: "schedule", label: "Year-by-Year" },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">

      {/* ── Inputs ────────────────────────────────────────────────────────── */}
      <div className="p-6 border-b border-gray-100">
        <div className="grid gap-5 sm:grid-cols-2">

          {/* Initial Investment */}
          <div>
            <Label htmlFor={`${uid}-principal`}>Initial investment</Label>
            <NumberInput
              id={`${uid}-principal`}
              value={principal}
              onChange={setPrincipal}
              min={0}
              step={1000}
              prefix="$"
            />
          </div>

          {/* Monthly Contribution */}
          <div>
            <Label htmlFor={`${uid}-contrib`}>Monthly contribution</Label>
            <NumberInput
              id={`${uid}-contrib`}
              value={monthlyContrib}
              onChange={setMonthlyContrib}
              min={0}
              step={50}
              prefix="$"
            />
          </div>

          {/* Annual Rate */}
          <div>
            <Label htmlFor={`${uid}-rate`}>Annual interest rate</Label>
            <NumberInput
              id={`${uid}-rate`}
              value={annualRate}
              onChange={setAnnualRate}
              min={0.1}
              max={50}
              step={0.1}
              suffix="%"
            />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {compoundInterestConfig.ratePresets.map((p) => (
                <button
                  key={p.rate}
                  type="button"
                  onClick={() => setAnnualRate(p.rate)}
                  title={p.description}
                  className={`rounded-lg border px-2.5 py-1 text-xs font-semibold transition ${
                    annualRate === p.rate
                      ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                      : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                  }`}
                >
                  {p.label} ({p.rate}%)
                </button>
              ))}
            </div>
          </div>

          {/* Time Period */}
          <div>
            <Label htmlFor={`${uid}-years`}>Time period</Label>
            <NumberInput
              id={`${uid}-years`}
              value={years}
              onChange={(v) => setYears(Math.max(1, Math.min(50, Math.round(v))))}
              min={1}
              max={50}
              step={1}
              suffix="yrs"
            />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {[5, 10, 20, 30].map((y) => (
                <button
                  key={y}
                  type="button"
                  onClick={() => setYears(y)}
                  className={`rounded-lg border px-2.5 py-1 text-xs font-semibold transition ${
                    years === y
                      ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                      : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                  }`}
                >
                  {y}yr
                </button>
              ))}
            </div>
          </div>

          {/* Compounding Frequency */}
          <div className="sm:col-span-2">
            <Label>Compounding frequency</Label>
            <SegmentedControl
              options={compoundInterestConfig.compoundingOptions.map((o) => ({
                label: o.label,
                value: o.label as CompoundingKey,
              }))}
              value={compounding}
              onChange={setCompounding}
            />
          </div>
        </div>

        {/* Advanced toggle */}
        <button
          type="button"
          onClick={() => setShowAdvanced((p) => !p)}
          className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
        >
          <span>{showAdvanced ? "▲" : "▼"}</span>
          {showAdvanced ? "Hide" : "Show"} inflation, tax &amp; contribution growth
        </button>

        {/* Advanced inputs */}
        {showAdvanced && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 rounded-xl border border-gray-100 bg-gray-50/60 p-4">
            {/* Inflation Rate */}
            <div>
              <Label htmlFor={`${uid}-inflation`}>Inflation rate</Label>
              <NumberInput
                id={`${uid}-inflation`}
                value={inflationRate}
                onChange={setInflationRate}
                min={0}
                max={20}
                step={0.1}
                suffix="%"
              />
              <p className="mt-1 text-xs text-gray-400">US historical avg ~2.5%</p>
            </div>

            {/* Contribution Growth */}
            <div>
              <Label htmlFor={`${uid}-contribgrowth`}>Annual contribution increase</Label>
              <NumberInput
                id={`${uid}-contribgrowth`}
                value={contribGrowthPct}
                onChange={setContribGrowthPct}
                min={0}
                max={20}
                step={0.5}
                suffix="%"
              />
              <p className="mt-1 text-xs text-gray-400">Simulates salary-linked increases</p>
            </div>

            {/* Tax Toggle + Rate */}
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-2">
                <Label>Tax on investment gains</Label>
                <button
                  type="button"
                  role="switch"
                  aria-checked={taxEnabled}
                  onClick={() => setTaxEnabled((p) => !p)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    taxEnabled ? "bg-emerald-500" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition ${
                      taxEnabled ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
              {taxEnabled && (
                <NumberInput
                  id={`${uid}-taxrate`}
                  value={taxRate}
                  onChange={setTaxRate}
                  min={0}
                  max={60}
                  step={1}
                  suffix="%"
                />
              )}
              <p className="mt-1 text-xs text-gray-400">
                {taxEnabled
                  ? "Applied to interest/gains only — not your contributions"
                  : "Enable to see after-tax projection"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Stat cards ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3 p-6 pb-2">
        <StatCard
          label={taxEnabled ? "After-tax balance" : "Final balance"}
          value={fmt(taxEnabled ? tax.afterTaxBalance : result.finalBalance)}
          sub={taxEnabled ? `Tax paid: ${fmt(tax.taxPaid)}` : `${multiplier.toFixed(1)}× your money`}
          accent
        />
        <StatCard
          label="Total invested"
          value={fmt(result.totalContributions)}
          sub={contribGrowthPct > 0 ? `+${contribGrowthPct}%/yr growth` : undefined}
        />
        <StatCard
          label="Interest earned"
          value={fmt(result.totalInterest)}
          sub={
            showAdvanced && inflationRate > 0
              ? `Real value: ${fmt(inflation.realValue)}`
              : `${result.finalBalance > 0 ? Math.round((result.totalInterest / result.finalBalance) * 100) : 0}% of total`
          }
        />
      </div>

      {/* ── Tab content ───────────────────────────────────────────────────── */}
      <div className="p-6 space-y-8">

        {/* Summary */}
        <div className="space-y-4">
            {/* Result breakdown */}
            <div className="rounded-xl border border-gray-100 bg-gray-50/60 px-4 py-2 divide-y divide-gray-100">
              <ResultRow label="Initial investment" value={fmt(principal)} />
              <ResultRow
                label={
                  contribGrowthPct > 0
                    ? `Monthly contributions (growing ${contribGrowthPct}%/yr)`
                    : `Monthly contributions × ${years * 12} months`
                }
                value={fmt(result.totalContributions - principal)}
              />
              <ResultRow label="Total invested" value={fmt(result.totalContributions)} />
              <ResultRow
                label="Interest earned"
                value={fmt(result.totalInterest)}
                sub={`At ${annualRate}% p.a., compounded ${compounding.toLowerCase()}`}
              />
              <ResultRow
                label="Final balance"
                value={fmt(result.finalBalance)}
                highlight={!taxEnabled}
              />
              {taxEnabled && (
                <>
                  <ResultRow label={`Tax on gains (${taxRate}%)`} value={`-${fmt(tax.taxPaid)}`} />
                  <ResultRow label="After-tax balance" value={fmt(tax.afterTaxBalance)} highlight />
                </>
              )}
              {showAdvanced && inflationRate > 0 && (
                <ResultRow
                  label={`Real value (${inflationRate}% inflation)`}
                  value={fmt(inflation.realValue)}
                  sub={`Inflation erodes ${fmt(inflation.inflationDrag)} of purchasing power`}
                />
              )}
            </div>

            {/* Compounding insight */}
            <CompoundingInsight
              contributions={result.totalContributions}
              interest={result.totalInterest}
            />

            {/* Scenario comparison */}
            <div className="rounded-xl border border-gray-100 overflow-hidden">
              <div className="bg-gray-50 px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-gray-400">
                Scenario Comparison
              </div>
              <div className="divide-y divide-gray-50">
                <div className="grid grid-cols-3 gap-4 px-4 py-2 text-xs text-gray-400 font-semibold">
                  <span>Scenario</span>
                  <span className="text-right">Final Balance</span>
                  <span className="text-right">Interest Earned</span>
                </div>
                <div className="grid grid-cols-3 gap-4 px-4 py-3 text-sm">
                  <span className="text-gray-700 font-medium">With contributions</span>
                  <span className="text-right font-semibold text-emerald-700 tabular-nums">{fmt(result.finalBalance)}</span>
                  <span className="text-right text-emerald-600 tabular-nums">{fmt(result.totalInterest)}</span>
                </div>
                <div className="grid grid-cols-3 gap-4 px-4 py-3 text-sm">
                  <span className="text-gray-600">Lump sum only</span>
                  <span className="text-right text-gray-700 tabular-nums">{fmt(lumpSumResult.finalBalance)}</span>
                  <span className="text-right text-gray-500 tabular-nums">{fmt(lumpSumResult.totalInterest)}</span>
                </div>
                {showAdvanced && inflationRate > 0 && (
                  <div className="grid grid-cols-3 gap-4 px-4 py-3 text-sm">
                    <span className="text-gray-600">Inflation-adjusted</span>
                    <span className="text-right text-gray-700 tabular-nums">{fmt(inflation.realValue)}</span>
                    <span className="text-right text-gray-400 tabular-nums">-{fmt(inflation.inflationDrag)} drag</span>
                  </div>
                )}
              </div>
            </div>

            {/* Mid-point callout */}
            {years >= 10 && (() => {
              const midRow = result.schedule.find((r) => r.year === Math.floor(years / 2));
              return midRow ? (
                <div className="rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-700">
                  <span className="font-semibold">Halfway point:</span> At year {midRow.year}, your balance will be{" "}
                  <span className="font-bold">{fmt(midRow.balance)}</span> — then compounding accelerates significantly.
                </div>
              ) : null;
            })()}
        </div>

        {/* Insights */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
            Your Investment Insights
          </p>
            <InsightItem
              icon="💰"
              text={`You will invest a total of ${fmt(result.totalContributions)} over ${years} years.`}
              sub={monthlyContrib > 0 ? `${fmt(principal)} upfront + ${fmt(monthlyContrib)}/month` : undefined}
            />
            <InsightItem
              icon="📈"
              text={`You will earn ${fmt(result.totalInterest)} in interest — ${result.totalContributions > 0 ? Math.round((result.totalInterest / result.totalContributions) * 100) : 0}% on top of your contributions.`}
            />
            <InsightItem
              icon="🔢"
              text={`Every $1 you invest grows to $${multiplier.toFixed(2)} — a ${multiplier.toFixed(1)}× return.`}
            />
            {doubleYear !== undefined && (
              <InsightItem
                icon="✅"
                text={`Your initial ${fmt(principal)} doubles by year ${doubleYear}.`}
                accent
              />
            )}
            {monthlyContrib > 0 && (
              <InsightItem
                icon="🔄"
                text={`Monthly contributions add ${fmt(result.finalBalance - lumpSumResult.finalBalance)} extra to your final balance vs a one-time lump sum.`}
              />
            )}
            {contribGrowthPct > 0 && (
              <InsightItem
                icon="📊"
                text={`With ${contribGrowthPct}%/yr increases, your monthly contribution grows from ${fmt(monthlyContrib)}/mo to ${fmt(result.finalMonthlyContribution)}/mo by year ${years}.`}
              />
            )}
            {showAdvanced && taxEnabled && (
              <InsightItem
                icon="🧾"
                text={`Tax at ${taxRate}% reduces your balance by ${fmt(tax.taxPaid)}, leaving ${fmt(tax.afterTaxBalance)} after tax.`}
              />
            )}
            {showAdvanced && inflationRate > 0 && (
              <InsightItem
                icon="📉"
                text={`At ${inflationRate}% inflation, your ${fmt(result.finalBalance)} in the future is worth ${fmt(inflation.realValue)} in today's money.`}
                sub={`Inflation erodes ${fmt(inflation.inflationDrag)} of purchasing power over ${years} years`}
              />
            )}
        </div>

        {/* Charts */}
        <Suspense fallback={<p className="py-8 text-center text-sm text-gray-400">Loading charts…</p>}>
          <CompoundInterestChartsPanel
            schedule={result.schedule}
            lumpSumSchedule={lumpSumResult.schedule}
          />
        </Suspense>

        {/* Year-by-Year — toggle */}
        <div>
          <button
            type="button"
            onClick={() => setShowSchedule((p) => !p)}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
          >
            {showSchedule ? "Hide year-by-year breakdown" : "Show year-by-year breakdown"}
          </button>
          {showSchedule && <div className="mt-4"><GrowthTable rows={result.schedule} /></div>}
        </div>

      </div>
    </div>
  );
}
