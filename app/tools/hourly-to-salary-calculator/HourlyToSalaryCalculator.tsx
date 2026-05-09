"use client";

import { SHOW_INCOME_CTA } from "@/src/lib/featureFlags";

import { useState, useEffect, useRef } from "react";
import { Slider } from "@/components/ui/slider";
import { formatCurrency, getLocale, type Locale } from "@/src/lib/locale";
import DataBreakdown from "@/components/enhancements/insights/DataBreakdown";
import DarkResultCard from "@/components/ui/DarkResultCard";
import EarningsChart from "@/components/enhancements/charts/EarningsChartLight";
import InsightPanel from "@/components/enhancements/insights/InsightPanel";
import ComparisonChart from "@/components/enhancements/charts/ComparisonChartLight";

// -- Component ----------------------------------------------------

export default function HourlyToSalaryCalculator() {
  const [hourlyRate,     setHourlyRate]     = useState<number>(25);
  const [hourlyInput,    setHourlyInput]    = useState<string>("25");
  const [hoursPerWeek,   setHoursPerWeek]   = useState<number>(40);
  const [hoursInput,     setHoursInput]     = useState<string>("40");
  const [weeksPerYear,   setWeeksPerYear]   = useState<number>(52);
  const [weeksInput,     setWeeksInput]     = useState<string>("52");
  const [flash,          setFlash]          = useState<boolean>(false);
  const [displayAnnual,  setDisplayAnnual]  = useState<number>(0);
  const [changeAmount,   setChangeAmount]   = useState<number>(0);
  const [showChange,     setShowChange]     = useState<boolean>(false);
  const animRef                             = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevAnnualRef                       = useRef<number>(0);
  const changeFadeRef                       = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [locale, setLocaleState]            = useState<Locale>("US");

  const annual  = hourlyRate * hoursPerWeek * weeksPerYear;
  const monthly = annual / 12;
  const weekly  = annual / 52;
  const daily   = hourlyRate * (hoursPerWeek / 5);

  useEffect(() => {
    setFlash(true);
    const t = setTimeout(() => setFlash(false), 450);
    return () => clearTimeout(t);
  }, [hourlyRate, hoursPerWeek, weeksPerYear]);

  // Change indicator
  useEffect(() => {
    const prev = prevAnnualRef.current;
    const diff = annual - prev;
    if (prev !== 0 && diff !== 0) {
      setChangeAmount(diff);
      setShowChange(true);
      if (changeFadeRef.current) clearTimeout(changeFadeRef.current);
      changeFadeRef.current = setTimeout(() => setShowChange(false), 1800);
    }
    prevAnnualRef.current = annual;
  }, [annual]);

  // Animated count-up (easeOutBack)
  useEffect(() => {
    if (animRef.current) clearTimeout(animRef.current);
    const target   = annual;
    const startVal = displayAnnual;
    const diff     = target - startVal;
    if (diff === 0) return;
    const steps = 24;
    const c1 = 0.4;
    const c3 = c1 + 1;
    const easeOutBack = (t: number) => 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    let step = 0;
    const tick = () => {
      step++;
      const progress = step / steps;
      const ease = easeOutBack(progress);
      setDisplayAnnual(Math.round(startVal + diff * ease));
      if (step < steps) animRef.current = setTimeout(tick, 12);
      else setDisplayAnnual(target);
    };
    animRef.current = setTimeout(tick, 12);
    return () => { if (animRef.current) clearTimeout(animRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [annual]);

  useEffect(() => {
    setLocaleState(getLocale());
    const handler = () => setLocaleState(getLocale());
    window.addEventListener("worthulator:locale", handler);
    return () => window.removeEventListener("worthulator:locale", handler);
  }, []);

  const quickRates = [15, 20, 25, 35, 50, 75, 100];
  const sym = locale === "US" ? "$" : "£";

  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const projMonthly = (hourlyRate * 1.1) * hoursPerWeek * weeksPerYear / 12;
  const cumulativeChart = MONTHS.map((label, i) => ({
    label,
    value: Math.round(monthly * (i + 1)),
    projected: Math.round(projMonthly * (i + 1)),
  }));

  return (
    <div className="grid gap-8 lg:grid-cols-[2fr_3fr] lg:gap-10">

      {/* INPUTS */}
      <div className="flex flex-col gap-6 lg:sticky lg:top-6 lg:self-start">

        {/* Hourly Rate — mega slider */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <label htmlFor="hourly-rate" className="block text-sm font-semibold text-gray-700">
                Hourly rate
              </label>
              <p className="mt-0.5 text-xs text-gray-400">Your gross pay per hour</p>
            </div>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm font-bold text-gray-400">
                {sym}
              </span>
              <input
                id="hourly-rate"
                type="number"
                min={0}
                max={500}
                step={1}
                value={hourlyInput}
                onChange={(e) => {
                  setHourlyInput(e.target.value);
                  const v = Math.max(0, Math.min(500, Number(e.target.value)));
                  if (!isNaN(v)) setHourlyRate(v);
                }}
                onBlur={() => setHourlyInput(String(hourlyRate))}
                className="w-28 rounded-xl border border-gray-200 bg-gray-50 py-2 pl-7 pr-3 text-sm font-bold text-gray-900 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>

          <div className="mt-5 **:[[role=slider]]:h-5 **:[[role=slider]]:w-5 **:[[role=slider]]:bg-emerald-500 **:[[role=slider]]:border-emerald-400 **:[[role=slider]]:shadow-md **:[[role=slider]]:transition-all **:[[role=slider]]:duration-150 **:[[role=slider]]:cursor-grab **:[[role=slider]]:hover:scale-[1.1] **:[[role=slider]]:active:scale-[1.15] **:[[role=slider]]:active:cursor-grabbing">
            <Slider
              min={0}
              max={200}
              step={1}
              value={[hourlyRate]}
              onValueChange={([v]) => { setHourlyRate(v); setHourlyInput(String(v)); }}
              className="h-3"
            />
            <div className="mt-2 flex justify-between text-xs text-gray-400">
              <span>{sym}0</span>
              <span>{sym}50</span>
              <span>{sym}100</span>
              <span>{sym}150</span>
              <span>{sym}200</span>
            </div>
          </div>

          {/* Quick-pick chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            {quickRates.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => { setHourlyRate(v); setHourlyInput(String(v)); }}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-150 active:scale-[0.96] ${
                  hourlyRate === v
                    ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                    : "border-gray-200 bg-gray-50 text-gray-500 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600"
                }`}
              >
                {sym}{v}/hr
              </button>
            ))}
          </div>
        </div>

        {/* Hours per week */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <label htmlFor="hours-per-week" className="block text-sm font-semibold text-gray-700">
                Hours per week
              </label>
              <p className="mt-0.5 text-xs text-gray-400">Standard full-time is 40</p>
            </div>
            <input
              id="hours-per-week"
              type="number"
              min={1}
              max={80}
              step={1}
              value={hoursInput}
              onChange={(e) => {
                setHoursInput(e.target.value);
                const v = Math.max(1, Math.min(80, Number(e.target.value)));
                if (!isNaN(v)) setHoursPerWeek(v);
              }}
              onBlur={() => setHoursInput(String(hoursPerWeek))}
              className="w-20 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-center text-sm font-bold text-gray-900 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </div>
          <div className="mt-4 **:[[role=slider]]:h-4 **:[[role=slider]]:w-4 **:[[role=slider]]:bg-emerald-500 **:[[role=slider]]:border-emerald-400 **:[[role=slider]]:shadow-md **:[[role=slider]]:transition-all **:[[role=slider]]:duration-150 **:[[role=slider]]:cursor-grab **:[[role=slider]]:active:cursor-grabbing">
            <Slider
              min={1}
              max={80}
              step={1}
              value={[hoursPerWeek]}
              onValueChange={([v]) => { setHoursPerWeek(v); setHoursInput(String(v)); }}
            />
            <div className="mt-1.5 flex justify-between text-xs text-gray-400">
              <span>1 hr</span>
              <span>40 hrs</span>
              <span>80 hrs</span>
            </div>
          </div>
        </div>

        {/* Weeks per year */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <label htmlFor="weeks-per-year" className="block text-sm font-semibold text-gray-700">
                Weeks per year
              </label>
              <p className="mt-0.5 text-xs text-gray-400">Reduce for vacation or unpaid time</p>
            </div>
            <input
              id="weeks-per-year"
              type="number"
              min={1}
              max={52}
              step={1}
              value={weeksInput}
              onChange={(e) => {
                setWeeksInput(e.target.value);
                const v = Math.max(1, Math.min(52, Number(e.target.value)));
                if (!isNaN(v)) setWeeksPerYear(v);
              }}
              onBlur={() => setWeeksInput(String(weeksPerYear))}
              className="w-20 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-center text-sm font-bold text-gray-900 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </div>
          <div className="mt-4 **:[[role=slider]]:h-4 **:[[role=slider]]:w-4 **:[[role=slider]]:bg-emerald-500 **:[[role=slider]]:border-emerald-400 **:[[role=slider]]:shadow-md **:[[role=slider]]:transition-all **:[[role=slider]]:duration-150 **:[[role=slider]]:cursor-grab **:[[role=slider]]:active:cursor-grabbing">
            <Slider
              min={1}
              max={52}
              step={1}
              value={[weeksPerYear]}
              onValueChange={([v]) => { setWeeksPerYear(v); setWeeksInput(String(v)); }}
            />
            <div className="mt-1.5 flex justify-between text-xs text-gray-400">
              <span>1 wk</span>
              <span>26 wks</span>
              <span>52 wks</span>
            </div>
          </div>
        </div>

      </div>

      {/* OUTPUTS */}
      <div className="flex flex-col gap-6">

        {/* Hero result */}
        <DarkResultCard
          label="Annual Salary"
          value={formatCurrency(displayAnnual, locale)}
          sub="gross · before tax"
          flash={flash}
        >
          {/* Change delta indicator */}
          <div className={`h-6 overflow-hidden transition-all duration-700 ${showChange ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"}`}>
            {changeAmount !== 0 && (
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${changeAmount > 0 ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"}`}>
                {changeAmount > 0 ? "+" : ""}{formatCurrency(Math.abs(changeAmount), locale)}{" / yr"}
              </span>
            )}
          </div>
          {/* Insight text */}
          {hourlyRate > 0 && (
            <p className="text-sm font-medium text-emerald-400">
              At <span className="font-bold text-emerald-300">{sym}{hourlyRate}/hour</span>, you earn approximately{" "}
              <span className="font-bold text-emerald-300">{formatCurrency(annual, locale)}</span> per year.
            </p>
          )}
        </DarkResultCard>

        {/* Annual / Monthly / Weekly / Daily cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-white/6 bg-gray-900 p-4 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Annual Salary</p>
            <p className="mt-2 text-xl font-bold tracking-[-0.03em] text-emerald-400">{formatCurrency(annual, locale)}</p>
            <p className="mt-0.5 text-xs font-medium text-gray-500">per year</p>
          </div>
          <div className="rounded-2xl border border-white/6 bg-gray-900 p-4 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Monthly Income</p>
            <p className="mt-2 text-xl font-bold tracking-[-0.03em] text-emerald-400">{formatCurrency(monthly, locale)}</p>
            <p className="mt-0.5 text-xs font-medium text-gray-500">per month</p>
          </div>
          <div className="rounded-2xl border border-white/6 bg-gray-900 p-4 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Weekly Income</p>
            <p className="mt-2 text-xl font-bold tracking-[-0.03em] text-emerald-400">{formatCurrency(weekly, locale)}</p>
            <p className="mt-0.5 text-xs font-medium text-gray-500">per week</p>
          </div>
          <div className="rounded-2xl border border-white/6 bg-gray-900 p-4 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Daily Income</p>
            <p className="mt-2 text-xl font-bold tracking-[-0.03em] text-emerald-400">{formatCurrency(daily, locale)}</p>
            <p className="mt-0.5 text-xs font-medium text-gray-500">per day</p>
          </div>
        </div>

        {/* Full breakdown */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl">
          <p className="mb-5 text-sm font-semibold text-gray-700">Full breakdown</p>
          <dl className="space-y-0">
            <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3.5">
              <dt className="flex items-center gap-2.5 text-sm text-gray-600">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-gray-300" />
                Hourly Rate
              </dt>
              <dd className="text-sm font-semibold text-gray-900">{sym}{hourlyRate.toFixed(2)} / hr</dd>
            </div>
            <div className="px-5 py-1 text-xs text-gray-300 select-none">&#215;</div>
            <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3.5">
              <dt className="flex items-center gap-2.5 text-sm text-gray-600">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-gray-300" />
                Hours per week
              </dt>
              <dd className="text-sm font-semibold text-gray-900">{hoursPerWeek} hrs</dd>
            </div>
            <div className="px-5 py-1 text-xs text-gray-300 select-none">&#215;</div>
            <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3.5">
              <dt className="flex items-center gap-2.5 text-sm text-gray-600">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-gray-300" />
                Weeks per year
              </dt>
              <dd className="text-sm font-semibold text-gray-900">{weeksPerYear} wks</dd>
            </div>
            <div className="px-5 py-1 text-xs text-gray-300 select-none">&#8595;</div>
            <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5">
              <dt className="flex flex-col gap-0.5">
                <span className="flex items-center gap-2.5 text-sm font-bold tracking-tight text-gray-950">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-400" />
                  Annual Salary
                </span>
                <span className="ml-5 text-xs text-gray-400">Gross, before tax</span>
              </dt>
              <dd className="text-xl font-bold tracking-tight text-emerald-600">{formatCurrency(annual, locale)}</dd>
            </div>
          </dl>
        </div>

        {/* What if */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl">
          <p className="text-sm font-semibold text-gray-700">What if your rate changed?</p>
          <p className="mt-1 text-xs leading-5 text-gray-400">
            Small hourly changes compound into large annual differences. Try a scenario below.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              { label: `+${sym}5/hr`,        s: "pos", apply: () => { const v = Math.min(500, hourlyRate + 5);     setHourlyRate(v); setHourlyInput(String(v)); } },
              { label: `+${sym}10/hr`,       s: "pos", apply: () => { const v = Math.min(500, hourlyRate + 10);    setHourlyRate(v); setHourlyInput(String(v)); } },
              { label: "+10% raise",    s: "pos", apply: () => { const v = Math.min(500, Math.round(hourlyRate * 1.1)); setHourlyRate(v); setHourlyInput(String(v)); } },
              { label: `-${sym}5/hr`,        s: "neg", apply: () => { const v = Math.max(0, hourlyRate - 5);       setHourlyRate(v); setHourlyInput(String(v)); } },
              { label: "Reset default", s: "neu", apply: () => { setHourlyRate(25); setHourlyInput("25"); setHoursPerWeek(40); setHoursInput("40"); setWeeksPerYear(52); setWeeksInput("52"); } },
            ].map((scenario) => (
              <button
                key={scenario.label}
                onClick={scenario.apply}
                className={`rounded-xl border px-4 py-3 text-sm font-semibold transition-all duration-150 active:scale-[0.97] hover:-translate-y-px hover:scale-[1.02] ${
                  scenario.s === "pos"
                    ? "border-gray-200 bg-gray-50 text-gray-700 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                    : scenario.s === "neg"
                    ? "border-gray-200 bg-gray-50 text-gray-700 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                    : "border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300 hover:bg-gray-100 hover:text-gray-700"
                }`}
              >
                {scenario.label}
              </button>
            ))}
          </div>

          {/* Live preview */}
          <DarkResultCard
            label="Live estimate"
            value={formatCurrency(annual, locale)}
            valueSuffix="/ year"
            sub={`${formatCurrency(monthly, locale)} / mo · ${formatCurrency(weekly, locale)} / wk`}
            flash={flash}
            compact
            className="mt-5"
          />
        </div>

        {/* Income CTA */}
        {SHOW_INCOME_CTA && (
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-sm">
          <p className="text-sm leading-6 text-gray-500">
            Know your rate —{" "}
            <span className="font-semibold text-gray-800">now see what you actually take home after tax.</span>
          </p>
          <div className="flex flex-col items-end gap-2">
            <span className="shrink-0 cursor-default rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white opacity-90 pointer-events-none">
              See after-tax income
            </span>
            <p className="text-xs text-gray-400">Coming soon — tax-aware view is being built.</p>
          </div>
        </div>
        )}

        {/* Trust note */}
        <div className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4">
          <p className="text-xs font-medium text-gray-500">
            Gross salary estimate only. Does not include tax, benefits, or deductions. Use our{" "}
            <a href="/tools/take-home-pay-calculator" className="font-semibold text-gray-700 underline underline-offset-2 hover:text-emerald-700">
              Take Home Pay Calculator
            </a>{" "}
            to see your after-tax income.
          </p>
        </div>

        {/* ── ENHANCEMENT: EARNINGS ANALYSIS ───────────────────────── */}
        {hourlyRate > 0 && (
          <div className="space-y-5 border-t border-gray-100 pt-5">

            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Earnings Analysis
            </p>

            {/* Income breakdown table */}
            <DataBreakdown
              title="Income breakdown"
              currency
              rows={[
                { label: "Hourly",   value: hourlyRate,  sub: `${hoursPerWeek} hrs/wk` },
                { label: "Daily",    value: Math.round(daily),    sub: `${(hoursPerWeek / 5).toFixed(1)} hrs/day` },
                { label: "Weekly",   value: Math.round(weekly) },
                { label: "Monthly",  value: Math.round(monthly) },
                { label: "Annual",   value: annual, highlight: true, sub: "gross · before tax" },
              ]}
            />

            {/* Cumulative earnings chart — desktop only */}
            <div className="hidden sm:block">
              <EarningsChart
                title="Cumulative earnings this year (current vs +10% raise)"
                data={cumulativeChart}
                valueLabel="Current rate"
                projectedLabel="+10% raise"
                height={220}
              />
            </div>

            {/* Insight panel */}
            <InsightPanel
              data={{ hourlyRate, grossAnnual: annual }}
              showRecommendations={false}
              title="Rate insights"
            />

            {/* What-if scenario chart — desktop only */}
            <div className="hidden sm:block">
              <p className="mb-3 text-sm font-semibold text-gray-700">What if your rate changed?</p>
              <ComparisonChart
                title="Annual salary at different hourly rates"
                data={[
                  { label: `${sym}${hourlyRate}/hr (current)`,  annual },
                  { label: `${sym}${hourlyRate + 5}/hr`,         annual: (hourlyRate + 5)  * hoursPerWeek * weeksPerYear },
                  { label: `${sym}${hourlyRate + 10}/hr`,        annual: (hourlyRate + 10) * hoursPerWeek * weeksPerYear },
                  { label: "+10% raise",                         annual: Math.round(hourlyRate * 1.1) * hoursPerWeek * weeksPerYear },
                ]}
                series={[{ key: "annual", name: "Annual salary", color: "#10b981" }]}
                height={220}
              />
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
