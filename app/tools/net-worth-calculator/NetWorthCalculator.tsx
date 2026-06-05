"use client";

import { useState, useRef, useEffect } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import WorthulatorProgressLoader from "@/src/templates/shared/WorthulatorProgressLoader";
import WorthulatorResultReveal from "@/src/templates/shared/WorthulatorResultReveal";
import { useCountUp } from "@/src/templates/shared/useCountUp";
import {
  SliderInputCard,
  QuickChips,
  RangeSliderCard,
  HeroResultCard,
  BreakdownTable,
  WhatIfButtons,
  CalcDisclaimer,
} from "@/src/templates/take-home-pay";
import { calculateNetWorth } from "@/lib/calculators/netWorthEngine";

function fmt(v: number) {
  const abs = Math.abs(Math.round(v));
  const str = abs >= 1000000
    ? `$${(abs / 1000000).toFixed(2)}M`
    : abs >= 1000
    ? `$${(abs / 1000).toFixed(0)}k`
    : `$${abs.toLocaleString()}`;
  return v < 0 ? `-${str}` : str;
}
function fmtFull(v: number) {
  return (v < 0 ? "-$" : "$") + Math.abs(Math.round(v)).toLocaleString();
}

const CALC_STEPS = [
  "Adding up your assets…",
  "Totalling your liabilities…",
  "Calculating net worth…",
  "Projecting your wealth trajectory…",
];

export default function NetWorthCalculator() {
  // Assets
  const [cash,        setCash]        = useState(5000);   const [cashI,   setCashI]   = useState("5000");
  const [checking,    setChecking]    = useState(3000);   const [checkI,  setCheckI]  = useState("3000");
  const [invest,      setInvest]      = useState(20000);  const [investI, setInvestI] = useState("20000");
  const [retire,      setRetire]      = useState(30000);  const [retireI, setRetireI] = useState("30000");
  const [homeVal,     setHomeVal]     = useState(0);      const [homeI,   setHomeI]   = useState("0");
  const [otherRE,     setOtherRE]     = useState(0);      const [otherREI,setOtherREI]= useState("0");
  const [vehicles,    setVehicles]    = useState(10000);  const [vehI,    setVehI]    = useState("10000");
  const [otherAsset,  setOtherAsset]  = useState(0);      const [otherAI, setOtherAI] = useState("0");
  // Liabilities
  const [mortgage,    setMortgage]    = useState(0);      const [mortI,   setMortI]   = useState("0");
  const [carLoan,     setCarLoan]     = useState(8000);   const [carI,    setCarI]    = useState("8000");
  const [student,     setStudent]     = useState(15000);  const [studI,   setStudI]   = useState("15000");
  const [ccDebt,      setCcDebt]      = useState(3000);   const [ccI,     setCcI]     = useState("3000");
  const [otherDebt,   setOtherDebt]   = useState(0);      const [otherDI, setOtherDI] = useState("0");
  // Projection
  const [age,         setAge]         = useState(30);
  const [growthPct,   setGrowthPct]   = useState(7);
  const [projYears,   setProjYears]   = useState(20);

  const [calculated,   setCalculated]   = useState(false);
  const [calculating,  setCalculating]  = useState(true);
  const [calcStep,     setCalcStep]     = useState(0);
  const [calcProgress, setCalcProgress] = useState(0);
  const [flash,        setFlash]        = useState(false);
  const prevRef = useRef(0);

  const result = calculateNetWorth({
    cashSavings: cash, checkingAccounts: checking, investments: invest,
    retirementAccounts: retire, homeValue: homeVal, otherRealEstate: otherRE,
    vehicles, otherAssets: otherAsset,
    mortgageBalance: mortgage, carLoans: carLoan, studentLoans: student,
    creditCardDebt: ccDebt, otherDebt,
    age, annualGrowthPct: growthPct, projectionYears: projYears,
  });

  const countTarget = Math.abs(result.netWorth);
  const display     = useCountUp(countTarget, calculated);
  const displayVal  = result.netWorth < 0 ? -display : display;

  useEffect(() => {
    if (!calculated) return;
    setFlash(true);
    const t = setTimeout(() => setFlash(false), 500);
    return () => clearTimeout(t);
  }, [result.netWorth, calculated]);

  function handleCalculate() {
    setCalculating(true); setCalcStep(0); setCalcProgress(0);
    const dur = 350;
    for (let i = 0; i < CALC_STEPS.length; i++) {
      setTimeout(() => { setCalcStep(i); setCalcProgress(Math.round(((i + 1) / CALC_STEPS.length) * 100)); }, i * dur);
    }
    setTimeout(() => { prevRef.current = 0; setCalculating(false); setCalculated(true); }, CALC_STEPS.length * dur);
  }

  // Hybrid auto-reveal: play the loader once on mount, then update live as inputs change.
  useEffect(() => {
    handleCalculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function mkSlider(
    id: string, label: string, hint: string,
    value: number, inputVal: string,
    max: number, step: number,
    setValue: (v: number) => void, setInput: (s: string) => void,
    chips?: number[], chipLabels?: string[],
  ) {
    const marks = [`$0`, `$${(max * 0.25 / 1000).toFixed(0)}k`, `$${(max * 0.5 / 1000).toFixed(0)}k`, `$${(max * 0.75 / 1000).toFixed(0)}k`, `$${(max / 1000).toFixed(0)}k`];
    return (
      <SliderInputCard
        id={id} label={label} hint={hint}
        symbol="$" value={value} inputValue={inputVal}
        min={0} max={max} step={step} marks={marks}
        onChange={(v) => { setValue(v); setInput(String(v)); }}
        onInputChange={(r) => { setInput(r); const v = Math.max(0, Math.min(max, Number(r))); if (!isNaN(v)) setValue(v); }}
        onInputBlur={() => setInput(String(value))}
      >
        {chips && chipLabels && (
          <QuickChips symbol="$" values={chips} active={value} labels={chipLabels}
            onSelect={(v) => { setValue(v); setInput(String(v)); }} />
        )}
      </SliderInputCard>
    );
  }

  // Chart downsample
  const series = result.growthSeries;
  const stepSize = Math.max(1, Math.floor(series.length / 20));
  const chartData = series.filter((_, i) => i % stepSize === 0 || i === series.length - 1);

  return (
    <div className="grid gap-8 lg:grid-cols-[2fr_3fr] lg:gap-10">

      {/* ── INPUTS ── */}
      <div className="flex flex-col gap-4 lg:sticky lg:top-6 lg:self-start max-h-[90vh] overflow-y-auto pr-1">

        {/* ── Assets ── */}
        <div className="flex items-center gap-2.5 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2.5">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-700">Assets — what you own</p>
        </div>
        {mkSlider("cash", "Cash savings",        "High-yield savings, money market",   cash,      cashI,   100000, 500,  setCash,      setCashI,   [1000,5000,10000,25000,50000],     ["$1k","$5k","$10k","$25k","$50k"])}
        {mkSlider("chk",  "Checking accounts",   "All checking accounts",              checking,  checkI,  50000,  500,  setChecking,  setCheckI,  [500,1000,2000,5000,10000],        ["$500","$1k","$2k","$5k","$10k"])}
        {mkSlider("inv",  "Investments",          "Stocks, ETFs, crypto, brokerage",   invest,    investI, 500000, 1000, setInvest,    setInvestI, [5000,10000,25000,50000,100000],   ["$5k","$10k","$25k","$50k","$100k"])}
        {mkSlider("ret",  "Retirement accounts",  "401k, IRA, pension",                retire,    retireI, 500000, 1000, setRetire,    setRetireI, [10000,25000,50000,100000,200000], ["$10k","$25k","$50k","$100k","$200k"])}
        {mkSlider("hom",  "Home value",           "Primary residence market value",    homeVal,   homeI,   2000000,5000, setHomeVal,   setHomeI,   [0,150000,300000,500000,750000],   ["None","$150k","$300k","$500k","$750k"])}
        {mkSlider("ore",  "Other real estate",    "Investment properties",             otherRE,   otherREI,1000000,5000, setOtherRE,   setOtherREI,[0,100000,250000,500000,750000],   ["None","$100k","$250k","$500k","$750k"])}
        {mkSlider("veh",  "Vehicles",             "Cars, motorcycles, boats",          vehicles,  vehI,    150000, 1000, setVehicles,  setVehI,    [0,5000,10000,20000,50000],        ["None","$5k","$10k","$20k","$50k"])}
        {mkSlider("oas",  "Other assets",         "Business equity, collectibles, etc",otherAsset,otherAI, 500000, 1000, setOtherAsset,setOtherAI, [0,5000,10000,25000,50000],        ["None","$5k","$10k","$25k","$50k"])}

        {/* ── Liabilities ── */}
        <div className="flex items-center gap-2.5 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5">
          <span className="inline-block h-2 w-2 rounded-full bg-red-500 shrink-0" />
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-700">Liabilities — what you owe</p>
        </div>
        {mkSlider("mort", "Mortgage balance",  "Remaining mortgage principal",          mortgage,  mortI,   1000000,5000, setMortgage,  setMortI,   [0,100000,200000,400000,600000],   ["None","$100k","$200k","$400k","$600k"])}
        {mkSlider("car",  "Car loans",         "Total car loan balances",               carLoan,   carI,    100000, 500,  setCarLoan,   setCarI,    [0,5000,10000,20000,40000],        ["None","$5k","$10k","$20k","$40k"])}
        {mkSlider("stu",  "Student loans",     "Federal + private student debt",        student,   studI,   200000, 500,  setStudent,   setStudI,   [0,10000,25000,50000,100000],      ["None","$10k","$25k","$50k","$100k"])}
        {mkSlider("ccd",  "Credit card debt",  "Total outstanding credit card balance", ccDebt,    ccI,     100000, 500,  setCcDebt,    setCcI,     [0,1000,3000,5000,10000],          ["None","$1k","$3k","$5k","$10k"])}
        {mkSlider("ode",  "Other debt",        "Personal loans, medical, BNPL, etc",    otherDebt, otherDI, 200000, 500,  setOtherDebt, setOtherDI, [0,1000,5000,10000,25000],         ["None","$1k","$5k","$10k","$25k"])}

        {/* ── Projection ── */}
        <div className="flex items-center gap-2.5 rounded-xl border border-blue-100 bg-blue-50 px-4 py-2.5">
          <span className="inline-block h-2 w-2 rounded-full bg-blue-500 shrink-0" />
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">Projection settings</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Your current age</label>
              <input type="number" min={16} max={80} value={age} onChange={(e) => setAge(Math.max(16, Math.min(80, Number(e.target.value))))}
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-semibold text-gray-700 focus:border-blue-400 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Projection (years)</label>
              <input type="number" min={1} max={50} value={projYears} onChange={(e) => setProjYears(Math.max(1, Math.min(50, Number(e.target.value))))}
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm font-semibold text-gray-700 focus:border-blue-400 focus:outline-none" />
            </div>
          </div>
        </div>
        <RangeSliderCard label="Annual portfolio growth rate" hint="Total return on assets (default 7% = S&P avg)"
          value={growthPct} min={0} max={15} step={0.5} unit="%" minLabel="0%" maxLabel="15%"
          onChange={setGrowthPct} />

        {!calculated && !calculating && (
          <button type="button" onClick={handleCalculate}
            className="w-full rounded-2xl bg-gray-950 py-4 text-sm font-bold text-white tracking-wide shadow-lg transition-all duration-200 hover:bg-gray-800 hover:shadow-xl active:scale-[0.98]">
            Calculate net worth →
          </button>
        )}
      </div>

      {/* ── RESULTS ── */}
      <div className="flex flex-col gap-4">
        {calculating && (
          <WorthulatorProgressLoader steps={CALC_STEPS} step={calcStep} progress={calcProgress} subtitle="Building your complete financial picture" />
        )}
        {!calculating && !calculated && (
          <WorthulatorResultReveal message="Enter your assets and liabilities, then hit Calculate" subMessage="Your net worth, milestone status, and wealth projection will appear here" />
        )}
        {!calculating && calculated && (
          <>
            <HeroResultCard
              label="Net worth"
              formattedValue={fmtFull(displayVal)}
              flash={flash}
              badge={result.milestoneLabel}
              changeAmount={0}
              showChange={false}
              formattedChange=""
              changePositive={true}
              stackedSegments={[
                { pct: result.totalAssets > 0 ? Math.min(100, Math.round((Math.max(0, result.netWorth) / result.totalAssets) * 100)) : 0, colorClass: "bg-emerald-400" },
                { pct: result.totalAssets > 0 ? Math.min(100, Math.round((result.totalLiabilities / result.totalAssets) * 100)) : 0,      colorClass: "bg-red-400"     },
              ]}
              stackedLegend={[
                { label: "Net worth",   colorClass: "bg-emerald-400" },
                { label: "Total debt",  colorClass: "bg-red-400"     },
              ]}
              insights={[
                `${result.debtToAssetRatio.toFixed(0)}% debt-to-asset ratio`,
                result.yearsToMillion === 0
                  ? "Already a millionaire 🎉"
                  : result.yearsToMillion !== null
                  ? `${result.yearsToMillion} years to $1M at ${growthPct}% growth`
                  : "Adjust growth rate to project $1M timeline",
              ]}
            />

            {/* Age-based percentile (SCF 2022 reference) */}
            <div className="rounded-2xl border border-blue-200 bg-blue-50/60 p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
                    Where you rank · ages {result.bracketLabel}
                  </p>
                  <p className="mt-1 text-sm text-gray-700 leading-relaxed">
                    Your net worth is higher than about{" "}
                    <span className="font-bold text-blue-700">{result.percentile}%</span> of US households your age, and{" "}
                    <span className="font-semibold">
                      {result.medianMultiple >= 1
                        ? `${result.medianMultiple.toFixed(2)}× the ${fmt(result.bracketMedian)} median`
                        : `${Math.round(result.medianMultiple * 100)}% of the ${fmt(result.bracketMedian)} median`}
                    </span>{" "}
                    for your bracket.
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-3xl font-bold tracking-tight text-blue-700">{result.percentile}<span className="text-base align-top">th</span></p>
                  <p className="text-[10px] font-medium uppercase tracking-wider text-blue-400">percentile</p>
                </div>
              </div>
              {/* percentile bar */}
              <div className="mt-3 h-2 rounded-full bg-blue-100 overflow-hidden">
                <div className="h-full rounded-full bg-blue-500" style={{ width: `${result.percentile}%` }} />
              </div>
              <p className="mt-2 text-[11px] text-gray-400">Federal Reserve Survey of Consumer Finances (2022) · approximate</p>
            </div>

            {/* Asset vs liability summary */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">Total assets</p>
                <p className="mt-2 text-2xl font-bold tracking-tight text-emerald-700">{fmtFull(result.totalAssets)}</p>
                <div className="mt-2 flex flex-col gap-1">
                  {result.assetBreakdown.map((b) => (
                    <div key={b.category} className="flex items-center justify-between text-xs">
                      <span className="text-gray-500 flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${b.colorClass}`} />
                        {b.category}
                      </span>
                      <span className="font-semibold text-gray-700">{b.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-red-100 bg-red-50/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-600">Total liabilities</p>
                <p className="mt-2 text-2xl font-bold tracking-tight text-red-700">{fmtFull(result.totalLiabilities)}</p>
                <div className="mt-2 flex flex-col gap-1">
                  {result.liabilityBreakdown.map((b) => (
                    <div key={b.category} className="flex items-center justify-between text-xs">
                      <span className="text-gray-500 flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${b.colorClass}`} />
                        {b.category}
                      </span>
                      <span className="font-semibold text-gray-700">{b.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Breakdown table */}
            <BreakdownTable
              grossLabel="Total assets"
              formattedGross={fmtFull(result.totalAssets)}
              netLabel="Net worth"
              netSubLabel="Assets minus all liabilities"
              formattedNet={fmtFull(result.netWorth)}
              rows={[
                { label: "Cash & savings",    formattedValue: fmtFull(cash + checking),          color: "emerald" },
                { label: "Investments",       formattedValue: fmtFull(invest + retire),           color: "emerald" },
                { label: "Real estate",       formattedValue: fmtFull(homeVal + otherRE),         color: "emerald" },
                { label: "Total debt",        formattedValue: `−${fmtFull(result.totalLiabilities)}`, color: "blue" },
                ...(result.yearsToMillion && result.yearsToMillion > 0 ? [{ label: `Projected at ${age + projYears}`, formattedValue: fmt(result.projectedNetWorth), color: "gray" as const }] : []),
              ]}
            />

            {/* Wealth projection chart */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Net worth projection</p>
              <p className="mb-4 text-xs text-gray-400">{growthPct}% annual growth over {projYears} years · age {age} → {age + projYears}</p>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={chartData} margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradNW" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#34d399" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#34d399" stopOpacity={0}   />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#9ca3af" }} tickFormatter={(v) => `Age ${v}`} />
                  <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} tickFormatter={(v) => fmt(v)} width={52} />
                  <Tooltip formatter={(v: unknown) => fmtFull(Number(v))} labelFormatter={(l) => `Age ${l}`} />
                  <Area type="monotone" dataKey="netWorth" name="Net worth" stroke="#34d399" fill="url(#gradNW)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <WhatIfButtons
              title="What if you paid down debt or invested more?"
              hint="Small shifts in debt repayment or investment contributions compound dramatically."
              scenarios={[
                { label: "Pay off CC debt",    sentiment: "pos",     onClick: () => { setCcDebt(0); setCcI("0"); } },
                { label: "+$10k investments",  sentiment: "pos",     onClick: () => { const v = invest + 10000; setInvest(v); setInvestI(String(v)); } },
                { label: "+5% growth rate",    sentiment: "pos",     onClick: () => setGrowthPct((g) => Math.min(15, parseFloat((g + 1).toFixed(1)))) },
                { label: "+5 years",           sentiment: "pos",     onClick: () => setProjYears((y) => Math.min(50, y + 5)) },
                { label: "Reset",              sentiment: "neutral", onClick: () => { setCash(5000); setCashI("5000"); setChecking(3000); setCheckI("3000"); setInvest(20000); setInvestI("20000"); setRetire(30000); setRetireI("30000"); setHomeVal(0); setHomeI("0"); setOtherRE(0); setOtherREI("0"); setVehicles(10000); setVehI("10000"); setOtherAsset(0); setOtherAI("0"); setMortgage(0); setMortI("0"); setCarLoan(8000); setCarI("8000"); setStudent(15000); setStudI("15000"); setCcDebt(3000); setCcI("3000"); setOtherDebt(0); setOtherDI("0"); } },
              ]}
            />

            <CalcDisclaimer text="Net worth figures are estimates based on your inputs. Asset values (particularly real estate) fluctuate and vehicle depreciation is not modelled. Projection assumes a fixed annual growth rate which real investments do not guarantee. This tool is for illustrative purposes only and does not constitute financial advice." />
          </>
        )}
      </div>
    </div>
  );
}
