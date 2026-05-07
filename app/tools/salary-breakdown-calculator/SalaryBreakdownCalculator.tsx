"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Slider } from "@/components/ui/slider";
import {
  calculateUKSalary,
  calculateUSSalary,
} from "@/calculations/finance/salaryBreakdown";
import { UK_SALARY_PICKS, US_SALARY_PICKS } from "@/data/finance/salaryBreakdown";
import {
  CURRENT_YEAR,
  SUPPORTED_YEARS,
  type SupportedYear,
} from "@/data/tax";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

// ─── Helpers ──────────────────────────────────────────────────────────────────

type Region = "UK" | "US";

function fmt(value: number, symbol: string): string {
  if (!isFinite(value) || value < 0) return `${symbol}0`;
  return `${symbol}${Math.round(value).toLocaleString()}`;
}

function pctStr(value: number): string {
  return `${value.toFixed(1)}%`;
}

// ─── Breakdown row ────────────────────────────────────────────────────────────

function BreakdownRow({
  label,
  value,
  sub,
  currency,
  variant = "default",
}: {
  label: string;
  value: number;
  sub?: string;
  currency: string;
  variant?: "default" | "deduction" | "total-deduction" | "net";
}) {
  const labelClass =
    variant === "total-deduction"
      ? "text-sm font-semibold text-red-600"
      : variant === "net"
        ? "text-sm font-bold text-emerald-700"
        : "text-sm font-semibold text-gray-600";

  const valueClass =
    variant === "total-deduction"
      ? "text-base font-bold tabular-nums text-red-600"
      : variant === "net"
        ? "text-lg font-bold tabular-nums text-emerald-700"
        : "text-base font-bold tabular-nums text-gray-800";

  const prefix = variant === "total-deduction" ? "−" : "";

  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className={labelClass}>{label}</p>
        {sub && <p className="mt-0.5 text-xs text-gray-400">{sub}</p>}
      </div>
      <p className={valueClass}>
        {prefix}
        {fmt(value, currency)}
      </p>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function SalaryBreakdownCalculator({
  defaultRegion = "UK",
}: {
  defaultRegion?: Region;
}) {
  const router = useRouter();
  const [region, setRegion] = useState<Region>(defaultRegion);
  const [salaryRaw, setSalaryRaw] = useState<string>("35000");
  const [salary, setSalary] = useState<number>(35000);
  const [pensionPct, setPensionPct] = useState<number>(0);
  const [filingStatus, setFilingStatus] = useState<"single" | "married">(
    "single",
  );
  const [year, setYear] = useState<SupportedYear>(CURRENT_YEAR);

  // ── Digital screen state ─────────────────────────────────────────────────
  const [flash, setFlash] = useState(false);
  const [displayNet, setDisplayNet] = useState(0);
  const [changeAmount, setChangeAmount] = useState(0);
  const [showChange, setShowChange] = useState(false);
  const animRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevNetRef = useRef<number>(0);
  const changeFadeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currency = region === "UK" ? "£" : "$";

  const result = useMemo(
    () =>
      region === "UK"
        ? calculateUKSalary(salary, pensionPct, year)
        : calculateUSSalary(salary, filingStatus, pensionPct, year),
    [region, salary, pensionPct, filingStatus, year],
  );

  const netMonthly = result.netMonthly;

  // ── Flash on change ──────────────────────────────────────────────────────
  useEffect(() => {
    setFlash(true);
    const t = setTimeout(() => setFlash(false), 450);
    return () => clearTimeout(t);
  }, [netMonthly]);

  // ── Delta pill ───────────────────────────────────────────────────────────
  useEffect(() => {
    const prev = prevNetRef.current;
    const diff = netMonthly - prev;
    if (prev !== 0 && diff !== 0) {
      setChangeAmount(diff);
      setShowChange(true);
      if (changeFadeRef.current) clearTimeout(changeFadeRef.current);
      changeFadeRef.current = setTimeout(() => setShowChange(false), 1800);
    }
    prevNetRef.current = netMonthly;
  }, [netMonthly]);

  // ── Count-up animation ───────────────────────────────────────────────────
  useEffect(() => {
    if (animRef.current) clearTimeout(animRef.current);
    const target = netMonthly;
    const startVal = displayNet;
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
      setDisplayNet(Math.round(startVal + diff * easeOutBack(progress)));
      if (step < steps) {
        animRef.current = setTimeout(tick, 12);
      } else {
        setDisplayNet(target);
      }
    };
    animRef.current = setTimeout(tick, 12);
    return () => {
      if (animRef.current) clearTimeout(animRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [netMonthly]);

  const salaryPicks = region === "UK" ? UK_SALARY_PICKS : US_SALARY_PICKS;

  const chartData = useMemo(() => {
    const segments = [
      { name: "Net Pay", value: result.netAnnual, color: "#10b981" },
      {
        name: region === "UK" ? "Income Tax" : "Federal Tax",
        value: result.incomeTax,
        color: "#f43f5e",
      },
      {
        name: region === "UK" ? "Nat. Insurance" : "FICA",
        value: result.socialLevy,
        color: "#f59e0b",
      },
    ];
    if (result.pensionDeduction > 0) {
      segments.push({
        name: region === "UK" ? "Pension" : "401(k)",
        value: result.pensionDeduction,
        color: "#3b82f6",
      });
    }
    return segments.filter((s) => s.value > 0);
  }, [result, region]);

  const isHighSalary =
    salary >= (region === "UK" ? 50_000 : 80_000) && salary > 0;
  const isTaperZone = region === "UK" && salary >= 100_000 && salary <= 125_140;

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="grid gap-8 lg:grid-cols-[2fr_3fr] lg:gap-10">

      {/* ── LEFT: INPUTS ────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-5">

        {/* Region toggle */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="grid grid-cols-2">
            {(["UK", "US"] as Region[]).map((r, i) => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  if (r !== region) {
                    router.push(
                      r === "UK"
                        ? "/tools/salary-breakdown-calculator-uk"
                        : "/tools/salary-breakdown-calculator",
                    );
                  }
                }}
                className={`py-3.5 text-sm font-semibold transition-colors duration-150 ${
                  i === 0 ? "border-r border-gray-100" : ""
                } ${
                  region === r
                    ? "bg-emerald-500 text-white"
                    : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
              >
                {r === "UK" ? "🇬🇧 United Kingdom" : "🇺🇸 United States"}
              </button>
            ))}
          </div>
        </div>

        {/* Tax year picker */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
            Tax Year
          </p>
          <div className="flex gap-2">
            {SUPPORTED_YEARS.map((y) => {
              const label =
                region === "UK"
                  ? `${y}/${String(y + 1).slice(-2)}`
                  : String(y);
              return (
                <button
                  key={y}
                  type="button"
                  onClick={() => setYear(y)}
                  className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-all ${
                    year === y
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-gray-200 text-gray-500 hover:border-emerald-200 hover:text-emerald-600"
                  }`}
                >
                  {label}
                  {y === CURRENT_YEAR && (
                    <span className="ml-1.5 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600">
                      current
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Salary input */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <label className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
            Annual Salary
          </label>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xl font-bold text-gray-400">{currency}</span>
            <input
              type="number"
              value={salaryRaw}
              min={0}
              max={1_000_000}
              step={1000}
              onChange={(e) => {
                setSalaryRaw(e.target.value);
                const n = Number(e.target.value);
                if (!isNaN(n) && n >= 0) setSalary(n);
              }}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-2xl font-bold text-gray-800 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
            <span className="shrink-0 text-sm text-gray-400">/yr</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {salaryPicks.map((pick) => (
              <button
                key={pick}
                type="button"
                onClick={() => {
                  setSalary(pick);
                  setSalaryRaw(String(pick));
                }}
                className={`rounded-md px-2 py-0.5 text-xs font-semibold transition-colors ${
                  salary === pick
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-gray-100 text-gray-500 hover:bg-emerald-50 hover:text-emerald-600"
                }`}
              >
                {currency}{pick.toLocaleString()}
              </button>
            ))}
          </div>
        </div>

        {/* US filing status */}
        {region === "US" && (
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
              Filing Status
            </p>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  ["single", "Single"],
                  ["married", "Married (jointly)"],
                ] as const
              ).map(([val, label]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setFilingStatus(val)}
                  className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all ${
                    filingStatus === val
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-gray-200 text-gray-500 hover:border-emerald-200 hover:text-emerald-600"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Pension / 401(k) */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
              {region === "UK" ? "Pension Contribution" : "401(k) Contribution"}
            </p>
            <span className="text-sm font-bold text-gray-700">
              {pensionPct}%
            </span>
          </div>
          <div className="mt-3">
            <Slider
              value={[pensionPct]}
              min={0}
              max={25}
              step={0.5}
              onValueChange={([v]) => setPensionPct(v)}
              className="w-full"
            />
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {[0, 3, 5, 8, 10].map((pick) => (
              <button
                key={pick}
                type="button"
                onClick={() => setPensionPct(pick)}
                className={`rounded-md px-2 py-0.5 text-xs font-semibold transition-colors ${
                  pensionPct === pick
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-gray-100 text-gray-500 hover:bg-emerald-50 hover:text-emerald-600"
                }`}
              >
                {pick}%
              </button>
            ))}
          </div>
          {pensionPct > 0 && (
            <p className="mt-2 text-xs text-gray-400">
              {fmt(result.pensionDeduction, currency)}/yr deducted before income
              tax — reduces your taxable income
            </p>
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
            Monthly take-home pay
          </p>

          <p
            className={`relative mt-3 text-[clamp(3rem,8vw,5rem)] font-bold leading-none tracking-[-0.04em] transition-all duration-500 ${
              flash
                ? "text-emerald-300 [text-shadow:0_0_40px_rgba(52,211,153,0.6)]"
                : "text-emerald-400 [text-shadow:0_0_20px_rgba(52,211,153,0.28)]"
            }`}
          >
            {currency}
            {displayNet.toLocaleString()}
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

          <div className="relative mt-5 grid grid-cols-3 gap-3 border-t border-white/8 pt-5">
            <div>
              <p className="text-xs text-gray-500">Annual net</p>
              <p className="mt-0.5 text-base font-bold text-white">
                {fmt(result.netAnnual, currency)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Weekly net</p>
              <p className="mt-0.5 text-base font-bold text-white">
                {fmt(result.netWeekly, currency)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Effective rate</p>
              <p className="mt-0.5 text-base font-bold text-white">
                {pctStr(result.effectiveTaxRate)}
              </p>
            </div>
          </div>
        </div>

        {/* Full breakdown table */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
            Full Breakdown
          </p>

          <div className="divide-y divide-gray-100">
            <BreakdownRow
              label="Gross Salary"
              value={result.grossSalary}
              currency={currency}
            />

            {result.pensionDeduction > 0 && (
              <BreakdownRow
                label={region === "UK" ? "Pension Contribution" : "401(k) Contribution"}
                value={result.pensionDeduction}
                sub={`${pensionPct}% of gross — reduces taxable income`}
                currency={currency}
                variant="deduction"
              />
            )}

            <BreakdownRow
              label="Income Tax"
              sub={
                region === "UK"
                  ? "PAYE — 20% / 40% / 45% progressive bands"
                  : "Federal — 10%–37% progressive brackets"
              }
              value={result.incomeTax}
              currency={currency}
            />

            <BreakdownRow
              label={region === "UK" ? "National Insurance" : "FICA"}
              sub={
                region === "UK"
                  ? "8% up to £50,270 · 2% above"
                  : "Social Security 6.2% + Medicare 1.45%"
              }
              value={result.socialLevy}
              currency={currency}
            />

            <BreakdownRow
              label="Total Deductions"
              value={result.totalDeductions}
              currency={currency}
              variant="total-deduction"
            />

            <BreakdownRow
              label="Net Annual Pay"
              value={result.netAnnual}
              currency={currency}
              variant="net"
            />

            <div className="grid grid-cols-2 gap-3 py-3">
              <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3">
                <p className="text-xs font-semibold text-emerald-600">
                  Monthly take-home
                </p>
                <p className="mt-1 text-xl font-bold tabular-nums text-emerald-700">
                  {fmt(result.netMonthly, currency)}
                </p>
              </div>
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                <p className="text-xs font-semibold text-gray-500">
                  Weekly take-home
                </p>
                <p className="mt-1 text-xl font-bold tabular-nums text-gray-700">
                  {fmt(result.netWeekly, currency)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Donut chart */}
        {salary > 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
              Pay Breakdown
            </p>
            <div className="flex items-center gap-5">
              <div className="h-36 w-36 shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius="58%"
                      outerRadius="80%"
                      dataKey="value"
                      strokeWidth={0}
                      paddingAngle={2}
                    >
                      {chartData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [
                        `${currency}${Math.round(value).toLocaleString()}`,
                        "",
                      ]}
                      contentStyle={{ fontSize: "12px", borderRadius: "8px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-1 flex-col gap-2.5">
                {chartData.map((entry) => (
                  <div key={entry.name} className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-xs text-gray-500">
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: entry.color }}
                      />
                      {entry.name}
                    </span>
                    <span className="text-xs font-semibold text-gray-700">
                      {currency}{Math.round(entry.value).toLocaleString()}
                    </span>
                  </div>
                ))}
                <div className="mt-1 border-t border-gray-100 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">% kept</span>
                    <span className="text-xs font-bold text-emerald-600">
                      {result.grossSalary > 0
                        ? ((result.netAnnual / result.grossSalary) * 100).toFixed(1)
                        : "0"}% take-home
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Insight strip */}
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
          <p className="text-sm leading-relaxed text-emerald-800">
            On a <strong>{fmt(salary, currency)}</strong> salary, you take home
            approximately{" "}
            <strong>{fmt(result.netMonthly, currency)} per month</strong> after{" "}
            {region === "UK"
              ? "income tax and National Insurance"
              : "federal tax and FICA"}
            .
            {result.pensionDeduction > 0 && (
              <>
                {" "}
                Your {region === "UK" ? "pension" : "401(k)"} contribution of{" "}
                <strong>{fmt(result.pensionDeduction, currency)}/yr</strong>{" "}
                reduces your taxable income.
              </>
            )}
          </p>
        </div>

        {/* Higher salary insight */}
        {isHighSalary && (
          <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-amber-700">
              {isTaperZone ? "Personal Allowance Trap" : "Higher-Rate Tax Insight"}
            </p>
            <p className="text-sm leading-relaxed text-amber-800">
              {isTaperZone
                ? `Between £100,000 and £125,140 your personal allowance tapers to zero, creating an effective 60% marginal rate on that band. Increasing pension contributions to bring income below £100,000 can significantly reduce this.`
                : region === "UK"
                  ? `Income above £50,270 is taxed at 40%. Increasing pension contributions reduces the amount taxed at the higher rate — every £1 into your pension saves 40p in tax.`
                  : `You are in the ${salary >= 191_950 ? "24–32%" : "22–24%"} federal bracket. 401(k) contributions (up to $23,000/yr) reduce taxable income dollar-for-dollar.`}
            </p>
          </div>
        )}

        <p className="text-xs leading-relaxed text-gray-400">
          This is an estimate and does not account for all tax rules or personal
          circumstances. Figures use 2024/25 rates. Verify with a qualified tax
          adviser before making financial decisions.
        </p>
      </div>
    </div>
  );
}
