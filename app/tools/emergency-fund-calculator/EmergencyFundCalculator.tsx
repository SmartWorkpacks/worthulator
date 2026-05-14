"use client";

import { useState, useRef, useEffect } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine,
} from "recharts";
import WorthulatorProgressLoader from "@/src/templates/shared/WorthulatorProgressLoader";
import WorthulatorResultReveal from "@/src/templates/shared/WorthulatorResultReveal";
import { useCountUp } from "@/src/templates/shared/useCountUp";
import {
  SliderInputCard,
  QuickChips,
  HeroResultCard,
  BreakdownTable,
  WhatIfButtons,
  CalcDisclaimer,
} from "@/src/templates/take-home-pay";
import { calculateEmergencyFund, type MonthlyExpenses } from "@/lib/calculators/emergencyFundEngine";

function fmt(v: number) { return "$" + Math.round(Math.abs(v)).toLocaleString(); }

function makeMarks(max: number): string[] {
  return [0, 0.25, 0.5, 0.75, 1].map((f) => {
    const val = max * f;
    if (val === 0) return "$0";
    if (max >= 1000) return `$${(val / 1000).toFixed(val % 1000 === 0 ? 0 : 1)}k`;
    return `$${Math.round(val)}`;
  });
}

const CALC_STEPS = [
  "Adding up your monthly expenses…",
  "Calculating your target fund…",
  "Measuring your current coverage…",
  "Planning your path to fully funded…",
];

const TARGET_MONTHS_OPTIONS = [1, 3, 6, 9, 12];

export default function EmergencyFundCalculator() {
  const [expenses, setExpenses] = useState<MonthlyExpenses>({
    rent: 1500, food: 400, utilities: 150, transport: 300,
    insurance: 200, subscriptions: 50, other: 200,
  });
  const [targetMonths,    setTargetMonths]    = useState(6);
  const [currentSavings,  setCurrentSavings]  = useState(2000);
  const [savingsInput,    setSavingsInput]     = useState("2000");
  const [monthlySavings,  setMonthlySavings]   = useState(300);
  const [monthlyInput,    setMonthlyInput]     = useState("300");

  const [calculated,   setCalculated]   = useState(false);
  const [calculating,  setCalculating]  = useState(false);
  const [calcStep,     setCalcStep]     = useState(0);
  const [calcProgress, setCalcProgress] = useState(0);
  const [flash,        setFlash]        = useState(false);
  const prevRef = useRef(0);

  const result = calculateEmergencyFund({ expenses, targetMonths, currentSavings, monthlySavingsRate: monthlySavings });

  const display = useCountUp(result.targetAmount, calculated);

  useEffect(() => {
    if (!calculated) return;
    setFlash(true);
    const t = setTimeout(() => setFlash(false), 500);
    return () => clearTimeout(t);
  }, [result.targetAmount, calculated]);

  function handleCalculate() {
    setCalculating(true); setCalcStep(0); setCalcProgress(0);
    const dur = 350;
    for (let i = 0; i < CALC_STEPS.length; i++) {
      setTimeout(() => { setCalcStep(i); setCalcProgress(Math.round(((i + 1) / CALC_STEPS.length) * 100)); }, i * dur);
    }
    setTimeout(() => { prevRef.current = 0; setCalculating(false); setCalculated(true); }, CALC_STEPS.length * dur);
  }

  function setExpense(key: keyof MonthlyExpenses, value: number) {
    setExpenses((prev) => ({ ...prev, [key]: value }));
  }

  const expenseFields: { key: keyof MonthlyExpenses; label: string; hint: string; max: number; chips: number[]; chipLabels: string[] }[] = [
    { key: "rent",          label: "Rent / mortgage",   hint: "Monthly housing cost",         max: 5000,  chips: [800,1200,1500,2000,3000],  chipLabels: ["$800","$1.2k","$1.5k","$2k","$3k"] },
    { key: "food",          label: "Food & groceries",  hint: "All food and dining",          max: 2000,  chips: [200,300,400,600,800],      chipLabels: ["$200","$300","$400","$600","$800"] },
    { key: "utilities",     label: "Utilities",         hint: "Electric, gas, water, internet",max: 800,  chips: [50,100,150,200,300],       chipLabels: ["$50","$100","$150","$200","$300"] },
    { key: "transport",     label: "Transport",         hint: "Car payment, fuel, transit",   max: 1500,  chips: [100,200,300,500,800],      chipLabels: ["$100","$200","$300","$500","$800"] },
    { key: "insurance",     label: "Insurance",         hint: "Health, car, renters, life",   max: 1000,  chips: [50,100,150,250,400],       chipLabels: ["$50","$100","$150","$250","$400"] },
    { key: "subscriptions", label: "Subscriptions",     hint: "Streaming, gym, software, etc",max: 500,   chips: [20,50,100,150,200],        chipLabels: ["$20","$50","$100","$150","$200"] },
    { key: "other",         label: "Other expenses",    hint: "Anything not listed above",    max: 2000,  chips: [0,100,200,400,600],        chipLabels: ["$0","$100","$200","$400","$600"] },
  ];

  const chartData = result.savingsProgress;

  return (
    <div className="grid gap-8 lg:grid-cols-[2fr_3fr] lg:gap-10">

      {/* ── INPUTS ── */}
      <div className="flex flex-col gap-4 lg:sticky lg:top-6 lg:self-start max-h-[90vh] overflow-y-auto pr-1">

        {/* Monthly expenses */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden shrink-0">
          <div className="bg-gray-50 px-5 py-3 border-b border-gray-100">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gray-600">Monthly essential expenses</p>
            <p className="text-xs text-gray-400 mt-0.5">Include everything you must pay every month to survive</p>
          </div>
          <div className="flex flex-col divide-y divide-gray-100 p-4 gap-4">
            {expenseFields.map(({ key, label, hint, max, chips, chipLabels }) => (
              <SliderInputCard
                key={key}
                id={key} label={label} hint={hint}
                symbol="$" value={expenses[key]} inputValue={String(expenses[key])}
                min={0} max={max} step={10}
                marks={makeMarks(max)}
                onChange={(v) => setExpense(key, v)}
                onInputChange={(r) => { const v = Math.max(0, Math.min(max, Number(r))); if (!isNaN(v)) setExpense(key, v); }}
                onInputBlur={() => {}}
              >
                <QuickChips symbol="$" values={chips} active={expenses[key]} labels={chipLabels}
                  onSelect={(v) => setExpense(key, v)} />
              </SliderInputCard>
            ))}
          </div>
        </div>

        {/* Target months */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-gray-700">Target coverage</p>
          <p className="text-xs text-gray-400 mt-0.5">3 months = minimum · 6 months = recommended · 12 months = maximum security</p>
          <div className="mt-3 flex gap-2">
            {TARGET_MONTHS_OPTIONS.map((m) => (
              <button key={m} type="button" onClick={() => setTargetMonths(m)}
                className={`flex-1 rounded-xl border py-2 text-xs font-bold transition-all ${targetMonths === m ? "border-emerald-400 bg-emerald-50 text-emerald-700" : "border-gray-200 bg-gray-50 text-gray-500 hover:border-emerald-200 hover:text-emerald-600"}`}>
                {m}mo
              </button>
            ))}
          </div>
        </div>

        {/* Current savings + monthly contribution */}
        <SliderInputCard
          id="current" label="Current emergency savings" hint="How much you already have set aside"
          symbol="$" value={currentSavings} inputValue={savingsInput}
          min={0} max={100000} step={100}
          marks={["$0", "$25k", "$50k", "$75k", "$100k"]}
          onChange={(v) => { setCurrentSavings(v); setSavingsInput(String(v)); }}
          onInputChange={(r) => { setSavingsInput(r); const v = Math.max(0, Math.min(100000, Number(r))); if (!isNaN(v)) setCurrentSavings(v); }}
          onInputBlur={() => setSavingsInput(String(currentSavings))}
        >
          <QuickChips symbol="$" values={[0, 500, 1000, 5000, 10000]} active={currentSavings}
            labels={["$0", "$500", "$1k", "$5k", "$10k"]}
            onSelect={(v) => { setCurrentSavings(v); setSavingsInput(String(v)); }} />
        </SliderInputCard>

        <SliderInputCard
          id="monthly" label="Monthly savings toward goal" hint="How much you can put aside each month"
          symbol="$" value={monthlySavings} inputValue={monthlyInput}
          min={0} max={5000} step={50}
          marks={["$0", "$1.25k", "$2.5k", "$3.75k", "$5k"]}
          onChange={(v) => { setMonthlySavings(v); setMonthlyInput(String(v)); }}
          onInputChange={(r) => { setMonthlyInput(r); const v = Math.max(0, Math.min(5000, Number(r))); if (!isNaN(v)) setMonthlySavings(v); }}
          onInputBlur={() => setMonthlyInput(String(monthlySavings))}
        >
          <QuickChips symbol="$" values={[100, 200, 300, 500, 1000]} active={monthlySavings}
            labels={["$100", "$200", "$300", "$500", "$1k"]}
            onSelect={(v) => { setMonthlySavings(v); setMonthlyInput(String(v)); }} />
        </SliderInputCard>

        {!calculated && (
          <button type="button" onClick={handleCalculate} disabled={calculating}
            className="w-full rounded-2xl bg-gray-950 py-4 text-sm font-bold text-white tracking-wide shadow-lg transition-all duration-200 hover:bg-gray-800 hover:shadow-xl active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed">
            {calculating ? "Calculating…" : "Calculate emergency fund →"}
          </button>
        )}
      </div>

      {/* ── RESULTS ── */}
      <div className="flex flex-col gap-4">
        {calculating && (
          <WorthulatorProgressLoader steps={CALC_STEPS} step={calcStep} progress={calcProgress} subtitle="Calculating your financial safety net" />
        )}
        {!calculating && !calculated && (
          <WorthulatorResultReveal message="Enter your monthly expenses and savings target, then hit Calculate" subMessage="Your emergency fund goal, current coverage, and timeline will appear here" />
        )}
        {!calculating && calculated && (
          <>
            <HeroResultCard
              label={result.isFullyFunded ? "Emergency fund target (fully funded!)" : "Emergency fund target"}
              formattedValue={fmt(display)}
              flash={flash}
              badge={result.isFullyFunded
                ? `✓ ${result.currentCoverageMonths} months covered — you're fully funded`
                : `${result.currentCoverageMonths} of ${targetMonths} months covered · ${result.fundingPct}% funded`}
              changeAmount={0}
              showChange={false}
              formattedChange=""
              changePositive={true}
              stackedSegments={[
                { pct: result.fundingPct,       colorClass: result.isFullyFunded ? "bg-emerald-400" : "bg-blue-400" },
                { pct: 100 - result.fundingPct, colorClass: "bg-gray-200" },
              ]}
              stackedLegend={[
                { label: "Funded",   colorClass: result.isFullyFunded ? "bg-emerald-400" : "bg-blue-400" },
                { label: "Remaining",colorClass: "bg-gray-200" },
              ]}
              insights={[
                `${fmt(result.totalMonthlyExpenses)}/month in essential expenses`,
                result.isFullyFunded
                  ? "No further saving needed for this target"
                  : result.monthsToGoal
                  ? `Fully funded by ${result.completionDate} (${result.monthsToGoal} months)`
                  : result.completionDate,
              ]}
            />

            {/* Coverage & progress */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { label: "Current coverage",   value: `${result.currentCoverageMonths} mo`,     sub: "months covered now",   color: "text-blue-400"    },
                { label: "Amount still needed", value: fmt(result.amountNeeded),                 sub: "to reach goal",        color: "text-orange-400"  },
                { label: "Funded",             value: `${result.fundingPct}%`,                   sub: "of target",            color: "text-emerald-400" },
              ].map((c) => (
                <div key={c.label} className="rounded-2xl border border-white/6 bg-gray-900 p-3 sm:p-4 shadow-lg">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">{c.label}</p>
                  <p className={`mt-2 text-base sm:text-xl font-bold tracking-[-0.03em] ${c.color}`}>{c.value}</p>
                  <p className="mt-0.5 text-xs font-medium text-gray-500">{c.sub}</p>
                </div>
              ))}
            </div>

            {/* Breakdown */}
            <BreakdownTable
              grossLabel={`${targetMonths}-month expense target`}
              formattedGross={fmt(result.targetAmount)}
              netLabel="Amount still needed"
              netSubLabel="Target minus current savings"
              formattedNet={fmt(result.amountNeeded)}
              rows={result.expenseBreakdown.map((e) => ({
                label: e.category,
                formattedValue: fmt(e.amount) + "/mo",
                color: "gray" as const,
              }))}
            />

            {/* Progress-to-goal area chart */}
            {!result.isFullyFunded && chartData.length > 1 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Savings progress timeline</p>
                <p className="mb-4 text-xs text-gray-400">
                  {fmt(monthlySavings)}/month → fully funded by {result.completionDate}
                </p>
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={chartData} margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gradEF" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#60a5fa" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}   />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9ca3af" }} tickFormatter={(v) => `M${v}`} />
                    <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} width={44} />
                    <Tooltip formatter={(v: unknown, name: string | undefined) => [fmt(Number(v)), name === "balance" ? "Savings" : "Target"]} labelFormatter={(l) => `Month ${l}`} />
                    <ReferenceLine y={result.targetAmount} stroke="#34d399" strokeDasharray="4 2" label={{ value: "Goal", position: "right", fontSize: 10, fill: "#34d399" }} />
                    <Area type="monotone" dataKey="balance" name="balance" stroke="#60a5fa" fill="url(#gradEF)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Expense breakdown */}
            {result.expenseBreakdown.length > 0 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-3">Expense breakdown</p>
                <div className="flex flex-col gap-2">
                  {result.expenseBreakdown.map((e) => (
                    <div key={e.category}>
                      <div className="flex items-center justify-between mb-1 text-xs">
                        <span className="text-gray-600 font-medium">{e.category}</span>
                        <span className="font-semibold text-gray-700">{fmt(e.amount)}/mo · {e.pct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                        <div className={`h-full rounded-full ${e.colorClass}`} style={{ width: `${e.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <WhatIfButtons
              title="What if you could save more each month?"
              hint="Increasing your monthly savings rate by even $100 can cut months off your timeline."
              scenarios={[
                { label: "+$100/mo savings",  sentiment: "pos",     onClick: () => { const v = Math.min(5000, monthlySavings + 100); setMonthlySavings(v); setMonthlyInput(String(v)); } },
                { label: "+$500/mo savings",  sentiment: "pos",     onClick: () => { const v = Math.min(5000, monthlySavings + 500); setMonthlySavings(v); setMonthlyInput(String(v)); } },
                { label: "3-month target",    sentiment: "neutral", onClick: () => setTargetMonths(3)  },
                { label: "6-month target",    sentiment: "neutral", onClick: () => setTargetMonths(6)  },
                { label: "12-month target",   sentiment: "neutral", onClick: () => setTargetMonths(12) },
              ]}
            />

            <CalcDisclaimer text="Emergency fund calculations are estimates based on your inputs. Actual expenses may vary. This tool is for planning purposes only and does not constitute financial advice. Consider a dedicated high-yield savings account for your emergency fund." />
          </>
        )}
      </div>
    </div>
  );
}
