"use client";

import { useState, useRef, useEffect } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid,
} from "recharts";
import WorthulatorProgressLoader from "@/src/templates/shared/WorthulatorProgressLoader";
import WorthulatorResultReveal from "@/src/templates/shared/WorthulatorResultReveal";
import { useCountUp } from "@/src/templates/shared/useCountUp";
import {
  SliderInputCard,
  QuickChips,
  RangeSliderCard,
  SelectCard,
  HeroResultCard,
  BreakdownTable,
  WhatIfButtons,
  CalcDisclaimer,
} from "@/src/templates/take-home-pay";
import { calculateSalaryIncrease } from "@/lib/calculators/salaryIncreaseEngine";

function fmt(v: number) { return "$" + Math.round(Math.abs(v)).toLocaleString(); }

const CALC_STEPS = [
  "Reading your salary inputs…",
  "Calculating post-tax increase…",
  "Projecting lifetime earnings impact…",
  "Building your career earnings picture…",
];

export default function SalaryIncreaseCalculator() {
  const [salary,       setSalary]       = useState(60000);
  const [salaryInput,  setSalaryInput]  = useState("60000");
  const [raiseType,    setRaiseType]    = useState<"percentage" | "flat">("percentage");
  const [raiseValue,   setRaiseValue]   = useState(5);
  const [raiseInput,   setRaiseInput]   = useState("5");
  const [years,        setYears]        = useState(10);
  const [yearsInput,   setYearsInput]   = useState("10");
  const [taxPct,       setTaxPct]       = useState(22);
  const [inflationPct, setInflationPct] = useState(2.5);
  const [repeatRaise,  setRepeatRaise]  = useState(false);
  const [annualBonus,  setAnnualBonus]  = useState(0);
  const [bonusInput,   setBonusInput]   = useState("0");

  const [calculated,  setCalculated]  = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [calcStep,    setCalcStep]    = useState(0);
  const [calcProgress,setCalcProgress]= useState(0);
  const [flash,       setFlash]       = useState(false);
  const [showChange,  setShowChange]  = useState(false);
  const [changeAmount,setChangeAmount]= useState(0);
  const prevRef       = useRef(0);
  const changeFadeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const result = calculateSalaryIncrease({
    currentSalary: salary,
    raiseType,
    raiseValue,
    years,
    annualRaiseRepeat: repeatRaise,
    inflationRatePct: inflationPct,
    taxRatePct: taxPct,
    annualBonus,
  });

  const display = useCountUp(result.newSalary, calculated);

  useEffect(() => {
    if (!calculated) return;
    setFlash(true);
    const t = setTimeout(() => setFlash(false), 500);
    return () => clearTimeout(t);
  }, [result.newSalary, calculated]);

  useEffect(() => {
    if (!calculated) return;
    const prev = prevRef.current;
    const diff = result.raiseAmount - prev;
    if (prev !== 0 && diff !== 0) {
      setChangeAmount(diff);
      setShowChange(true);
      if (changeFadeRef.current) clearTimeout(changeFadeRef.current);
      changeFadeRef.current = setTimeout(() => setShowChange(false), 2200);
    }
    prevRef.current = result.raiseAmount;
  }, [result.raiseAmount, calculated]);

  function handleCalculate() {
    setCalculating(true);
    setCalcStep(0);
    setCalcProgress(0);
    const dur = 350;
    for (let i = 0; i < CALC_STEPS.length; i++) {
      setTimeout(() => { setCalcStep(i); setCalcProgress(Math.round(((i + 1) / CALC_STEPS.length) * 100)); }, i * dur);
    }
    setTimeout(() => { prevRef.current = 0; setCalculating(false); setCalculated(true); }, CALC_STEPS.length * dur);
  }

  const raisePct = salary > 0 ? Math.round((result.raiseAmount / salary) * 100) : 0;

  // Chart — downsample
  const series = result.salaryGrowthSeries;
  const step = Math.max(1, Math.floor(series.length / 20));
  const chartData = series.filter((_, i) => i % step === 0 || i === series.length - 1);

  return (
    <div className="grid gap-8 lg:grid-cols-[2fr_3fr] lg:gap-10">

      {/* ── INPUTS ── */}
      <div className="flex flex-col gap-6 lg:sticky lg:top-6 lg:self-start">

        <SliderInputCard
          id="salary" label="Current annual salary" hint="Your gross salary before tax"
          symbol="$" value={salary} inputValue={salaryInput}
          min={20000} max={500000} step={1000}
          marks={["$20k", "$130k", "$250k", "$375k", "$500k"]}
          onChange={(v) => { setSalary(v); setSalaryInput(String(v)); }}
          onInputChange={(r) => { setSalaryInput(r); const v = Math.max(20000, Math.min(500000, Number(r))); if (!isNaN(v)) setSalary(v); }}
          onInputBlur={() => setSalaryInput(String(salary))}
        >
          <QuickChips symbol="$" values={[40000, 60000, 80000, 100000, 150000]} active={salary}
            labels={["$40k", "$60k", "$80k", "$100k", "$150k"]}
            onSelect={(v) => { setSalary(v); setSalaryInput(String(v)); }} />
        </SliderInputCard>

        <SelectCard
          id="raiseType" label="Raise type" hint="How the raise is applied"
          value={raiseType}
          options={[
            { value: "percentage", label: "Percentage raise (e.g. 5%)" },
            { value: "flat",       label: "Flat amount raise (e.g. $5,000)" },
          ]}
          onChange={(v) => { setRaiseType(v as "percentage" | "flat"); setRaiseValue(raiseType === "percentage" ? 5 : 5000); setRaiseInput(raiseType === "percentage" ? "5" : "5000"); }}
        />

        {raiseType === "percentage" ? (
          <RangeSliderCard label="Raise percentage" hint="Typical ranges: 3–5% standard · 10–20% promotion"
            value={raiseValue} min={0.5} max={50} step={0.5} unit="%"
            minLabel="0.5%" maxLabel="50%"
            onChange={(v) => { setRaiseValue(v); setRaiseInput(String(v)); }}
          >
            <div className="mt-3 flex flex-wrap gap-1.5">
              {[3, 5, 8, 10, 15, 20].map((v) => (
                <button key={v} type="button" onClick={() => { setRaiseValue(v); setRaiseInput(String(v)); }}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold transition-all ${raiseValue === v ? "border-emerald-400 bg-emerald-50 text-emerald-700" : "border-gray-200 bg-gray-50 text-gray-500 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600"}`}>
                  {v}%
                </button>
              ))}
            </div>
          </RangeSliderCard>
        ) : (
          <SliderInputCard
            id="raiseFlat" label="Raise amount" hint="Flat dollar increase to annual salary"
            symbol="$" value={raiseValue} inputValue={raiseInput}
            min={500} max={100000} step={500}
            marks={["$500", "$25k", "$50k", "$75k", "$100k"]}
            onChange={(v) => { setRaiseValue(v); setRaiseInput(String(v)); }}
            onInputChange={(r) => { setRaiseInput(r); const v = Math.max(500, Math.min(100000, Number(r))); if (!isNaN(v)) setRaiseValue(v); }}
            onInputBlur={() => setRaiseInput(String(raiseValue))}
          >
            <QuickChips symbol="$" values={[2000, 5000, 10000, 20000, 30000]} active={raiseValue}
              labels={["$2k", "$5k", "$10k", "$20k", "$30k"]}
              onSelect={(v) => { setRaiseValue(v); setRaiseInput(String(v)); }} />
          </SliderInputCard>
        )}

        <SliderInputCard
          id="years" label="Projection years" hint="How far ahead to project earnings"
          value={years} inputValue={yearsInput}
          min={1} max={40} step={1}
          marks={["1yr", "10yr", "20yr", "30yr", "40yr"]}
          onChange={(v) => { setYears(v); setYearsInput(String(v)); }}
          onInputChange={(r) => { setYearsInput(r); const v = Math.max(1, Math.min(40, Number(r))); if (!isNaN(v)) setYears(v); }}
          onInputBlur={() => setYearsInput(String(years))}
        >
          <QuickChips values={[5, 10, 15, 20, 30]} active={years}
            labels={["5yr", "10yr", "15yr", "20yr", "30yr"]}
            onSelect={(v) => { setYears(v); setYearsInput(String(v)); }} />
        </SliderInputCard>

        <SliderInputCard
          id="bonus" label="Annual bonus" hint="Flat bonus on top of salary (optional)"
          symbol="$" value={annualBonus} inputValue={bonusInput}
          min={0} max={100000} step={500}
          marks={["$0", "$25k", "$50k", "$75k", "$100k"]}
          onChange={(v) => { setAnnualBonus(v); setBonusInput(String(v)); }}
          onInputChange={(r) => { setBonusInput(r); const v = Math.max(0, Math.min(100000, Number(r))); if (!isNaN(v)) setAnnualBonus(v); }}
          onInputBlur={() => setBonusInput(String(annualBonus))}
        >
          <QuickChips symbol="$" values={[0, 2000, 5000, 10000, 25000]} active={annualBonus}
            labels={["None", "$2k", "$5k", "$10k", "$25k"]}
            onSelect={(v) => { setAnnualBonus(v); setBonusInput(String(v)); }} />
        </SliderInputCard>

        <RangeSliderCard label="Marginal tax rate" hint="Applied to the incremental raise amount only"
          value={taxPct} min={0} max={50} step={1} unit="%" minLabel="0%" maxLabel="50%"
          onChange={setTaxPct} />

        <RangeSliderCard label="Inflation rate" hint="Reduces real purchasing power of the raise"
          value={inflationPct} min={0} max={8} step={0.1} unit="%" minLabel="0%" maxLabel="8%"
          onChange={setInflationPct} />

        {/* Repeat raise toggle */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-gray-700">Compound annual raises</p>
          <p className="mt-0.5 text-xs text-gray-400">Apply the same % raise every year to project career earnings growth</p>
          <div className="mt-3 flex gap-2">
            {[false, true].map((v) => (
              <button key={String(v)} type="button" onClick={() => setRepeatRaise(v)}
                className={`flex-1 rounded-xl border py-2 text-xs font-semibold transition-all ${repeatRaise === v ? "border-emerald-400 bg-emerald-50 text-emerald-700" : "border-gray-200 bg-gray-50 text-gray-500 hover:border-emerald-200"}`}>
                {v ? "Yes — compound each year" : "No — one-time raise"}
              </button>
            ))}
          </div>
        </div>

        {!calculated && (
          <button type="button" onClick={handleCalculate} disabled={calculating}
            className="w-full rounded-2xl bg-gray-950 py-4 text-sm font-bold text-white tracking-wide shadow-lg transition-all duration-200 hover:bg-gray-800 hover:shadow-xl active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed">
            {calculating ? "Calculating…" : "Calculate raise impact →"}
          </button>
        )}
      </div>

      {/* ── RESULTS ── */}
      <div className="flex flex-col gap-4">
        {calculating && (
          <WorthulatorProgressLoader steps={CALC_STEPS} step={calcStep} progress={calcProgress} subtitle="Calculating the long-term value of your raise" />
        )}
        {!calculating && !calculated && (
          <WorthulatorResultReveal message="Enter your salary and raise details, then hit Calculate" subMessage="Your lifetime earnings impact will appear here" />
        )}
        {!calculating && calculated && (
          <>
            <HeroResultCard
              label="New annual salary"
              formattedValue={fmt(display)}
              flash={flash}
              badge={`+${fmt(result.raiseAmount)} raise · ${raisePct}% increase`}
              changeAmount={changeAmount}
              showChange={showChange}
              formattedChange={`${changeAmount > 0 ? "+" : ""}${fmt(Math.abs(changeAmount))} raise change`}
              changePositive={changeAmount > 0}
              stackedSegments={[
                { pct: Math.round(((result.newSalary - result.raiseAmount) / result.newSalary) * 100), colorClass: "bg-gray-400" },
                { pct: Math.round((result.raiseAmount / result.newSalary) * 100), colorClass: "bg-emerald-400" },
              ]}
              stackedLegend={[
                { label: "Base salary",  colorClass: "bg-gray-400"    },
                { label: "Raise",        colorClass: "bg-emerald-400" },
              ]}
              insights={[
                `+${fmt(result.postTaxMonthly)}/month after ${taxPct}% marginal tax`,
                `+${fmt(result.lifetimeEarningsDiff)} lifetime earnings over ${years} years`,
              ]}
            />

            {/* Metric cards */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { label: "Monthly raise",   value: fmt(result.monthlyIncrease),       sub: "gross per month"      },
                { label: "After-tax raise",  value: fmt(result.postTaxRaiseEstimate),  sub: `after ${taxPct}% tax` },
                { label: "Real raise value", value: fmt(result.inflationAdjustedRaise),sub: "inflation-adjusted"   },
              ].map((c) => (
                <div key={c.label} className="rounded-2xl border border-white/6 bg-gray-900 p-3 sm:p-4 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">{c.label}</p>
                  <p className="mt-2 text-base sm:text-xl font-bold tracking-[-0.03em] text-emerald-400">{c.value}</p>
                  <p className="mt-0.5 text-xs font-medium text-gray-500">{c.sub}</p>
                </div>
              ))}
            </div>

            {/* Breakdown */}
            <BreakdownTable
              grossLabel="Current annual salary"
              formattedGross={fmt(salary)}
              netLabel="Lifetime earnings difference"
              netSubLabel={`Extra earned over ${years} years with raise`}
              formattedNet={fmt(result.lifetimeEarningsDiff)}
              rows={[
                { label: "Gross raise amount",       formattedValue: `+${fmt(result.raiseAmount)}`,        color: "emerald" },
                { label: "After-tax raise (annual)", formattedValue: `+${fmt(result.postTaxRaiseEstimate)}`,color: "blue"    },
                { label: "Inflation-adjusted raise", formattedValue: `+${fmt(result.inflationAdjustedRaise)}`, color: "gray" },
                ...(repeatRaise ? [{ label: `Projected salary in ${years}yr`, formattedValue: fmt(result.futureProjectedSalary), color: "emerald" as const }] : []),
              ]}
            />

            {/* Earnings growth chart */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Salary growth projection</p>
              <p className="mb-4 text-xs text-gray-400">
                {repeatRaise ? `Compounding ${raiseType === "percentage" ? raiseValue + "%" : fmt(raiseValue)} raise annually` : "One-time raise impact on cumulative earnings"}
              </p>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={chartData} margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradRaised" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#34d399" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradCurrent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#9ca3af" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#9ca3af" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#9ca3af" }} tickFormatter={(v) => `Y${v}`} />
                  <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} width={44} />
                  <Tooltip formatter={(v: unknown) => fmt(Number(v))} labelFormatter={(l) => `Year ${l}`} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
                  <Area type="monotone" dataKey="raised"  name="With raise"    stroke="#34d399" fill="url(#gradRaised)"  strokeWidth={2} />
                  <Area type="monotone" dataKey="current" name="Without raise"  stroke="#9ca3af" fill="url(#gradCurrent)" strokeWidth={1.5} />
                  <Area type="monotone" dataKey="real"    name="Real (inflation-adj)" stroke="#fbbf24" fill="none" strokeWidth={1.5} strokeDasharray="4 2" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Lifetime earnings comparison */}
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 mb-3">Lifetime earnings over {years} years</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Without raise</p>
                  <p className="text-xl font-bold tracking-tight text-gray-700">{fmt(result.cumulativeEarningsNow)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">With raise{repeatRaise ? " (compounding)" : ""}</p>
                  <p className="text-xl font-bold tracking-tight text-emerald-700">{fmt(result.cumulativeEarningsNew)}</p>
                </div>
              </div>
              <div className="mt-3 h-px bg-emerald-100" />
              <p className="mt-3 text-sm font-semibold text-emerald-800">
                You earn <span className="text-emerald-700">{fmt(result.lifetimeEarningsDiff)} more</span> over {years} years — from one negotiation.
              </p>
            </div>

            <WhatIfButtons
              title="What if your raise was different?"
              hint="Negotiating just 2–3% more compounds into dramatically more over a career."
              scenarios={[
                { label: "+2% raise",   sentiment: "pos", onClick: () => { if (raiseType === "percentage") { const v = Math.min(50, raiseValue + 2); setRaiseValue(v); setRaiseInput(String(v)); } } },
                { label: "-2% raise",   sentiment: "neg", onClick: () => { if (raiseType === "percentage") { const v = Math.max(0.5, raiseValue - 2); setRaiseValue(v); setRaiseInput(String(v)); } } },
                { label: "+5 years",    sentiment: "pos", onClick: () => { const v = Math.min(40, years + 5); setYears(v); setYearsInput(String(v)); } },
                { label: "Compound on", sentiment: "pos", onClick: () => setRepeatRaise(true) },
                { label: "Reset",       sentiment: "neutral", onClick: () => { setSalary(60000); setSalaryInput("60000"); setRaiseType("percentage"); setRaiseValue(5); setRaiseInput("5"); setYears(10); setYearsInput("10"); setTaxPct(22); setInflationPct(2.5); setRepeatRaise(false); setAnnualBonus(0); setBonusInput("0"); } },
              ]}
            />

            <CalcDisclaimer text="Salary projections are estimates based on your inputs. Tax figures apply the marginal rate only to the raise amount — actual tax varies by filing status, deductions, and jurisdiction. Inflation adjustments use a fixed rate. This tool is for illustrative purposes only and does not constitute financial, tax, or career advice." />
          </>
        )}
      </div>
    </div>
  );
}
