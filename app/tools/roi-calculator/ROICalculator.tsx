"use client";

import { useState, useRef, useEffect } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid,
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
import { calculateROI } from "@/lib/calculators/roiCalculatorEngine";
import { getCpiInflationYoY } from "@/lib/datasets/finance/fredBenchmarks";

const LIVE_INFLATION = getCpiInflationYoY();

function fmt(v: number) { return "$" + Math.round(Math.abs(v)).toLocaleString(); }
function fmtPct(v: number) { return v.toFixed(1) + "%"; }

const CALC_STEPS = [
  "Reading your investment inputs…",
  "Calculating gross ROI…",
  "Applying fees and inflation…",
  "Comparing against benchmark…",
];

export default function ROICalculator() {
  const [initial,      setInitial]      = useState(10000);
  const [initialInput, setInitialInput] = useState("10000");
  const [finalValue,   setFinalValue]   = useState(20000);
  const [finalInput,   setFinalInput]   = useState("20000");
  const [years,        setYears]        = useState(10);
  const [yearsInput,   setYearsInput]   = useState("10");
  const [contribution, setContribution] = useState(0);
  const [contribInput, setContribInput] = useState("0");
  const [feePct,       setFeePct]       = useState(1);
  const [taxPct,       setTaxPct]       = useState(15);
  const [inflationPct, setInflationPct] = useState(LIVE_INFLATION);
  const [benchmarkPct, setBenchmarkPct] = useState(7);

  const [calculated,   setCalculated]   = useState(false);
  const [calculating,  setCalculating]  = useState(true);
  const [calcStep,     setCalcStep]     = useState(0);
  const [calcProgress, setCalcProgress] = useState(0);
  const [flash,        setFlash]        = useState(false);
  const [showChange,   setShowChange]   = useState(false);
  const [changeAmount, setChangeAmount] = useState(0);
  const prevRef       = useRef(0);
  const changeFadeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const result = calculateROI({
    initialInvestment: initial,
    finalValue,
    years,
    annualContribution: contribution,
    annualFeePct: feePct,
    taxRatePct: taxPct,
    inflationRatePct: inflationPct,
    benchmarkReturnPct: benchmarkPct,
  });

  const display = useCountUp(Math.round(result.grossROIPct * 10), calculated);
  const displayPct = display / 10;

  useEffect(() => {
    if (!calculated) return;
    setFlash(true);
    const t = setTimeout(() => setFlash(false), 500);
    return () => clearTimeout(t);
  }, [result.grossROIPct, calculated]);

  useEffect(() => {
    if (!calculated) return;
    const prev = prevRef.current;
    const diff = result.grossROIPct - prev;
    if (prev !== 0 && diff !== 0) {
      setChangeAmount(diff);
      setShowChange(true);
      if (changeFadeRef.current) clearTimeout(changeFadeRef.current);
      changeFadeRef.current = setTimeout(() => setShowChange(false), 2200);
    }
    prevRef.current = result.grossROIPct;
  }, [result.grossROIPct, calculated]);

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

  // Hybrid auto-reveal: play the loader once on mount, then reveal results.
  // Subsequent input changes update live (no click needed).
  useEffect(() => {
    handleCalculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const outperforms = result.benchmarkOutperformance >= 0;

  // Chart data — downsample to max 20 points for readability
  const series = result.growthSeries;
  const step = Math.max(1, Math.floor(series.length / 20));
  const chartData = series.filter((_, i) => i % step === 0 || i === series.length - 1);

  return (
    <div className="grid gap-8 lg:grid-cols-[2fr_3fr] lg:gap-10">

      {/* ── INPUTS ── */}
      <div className="flex flex-col gap-6 lg:sticky lg:top-6 lg:self-start">

        <SliderInputCard
          id="initial" label="Initial investment" hint="Starting capital"
          symbol="$" value={initial} inputValue={initialInput}
          min={100} max={500000} step={500}
          marks={["$100", "$125k", "$250k", "$375k", "$500k"]}
          onChange={(v) => { setInitial(v); setInitialInput(String(v)); }}
          onInputChange={(r) => { setInitialInput(r); const v = Math.max(100, Math.min(500000, Number(r))); if (!isNaN(v)) setInitial(v); }}
          onInputBlur={() => setInitialInput(String(initial))}
        >
          <QuickChips symbol="$" values={[1000, 5000, 10000, 50000, 100000]} active={initial}
            labels={["$1k", "$5k", "$10k", "$50k", "$100k"]}
            onSelect={(v) => { setInitial(v); setInitialInput(String(v)); }} />
        </SliderInputCard>

        <SliderInputCard
          id="final" label="Final value" hint="What the investment is worth now / at exit"
          symbol="$" value={finalValue} inputValue={finalInput}
          min={100} max={1000000} step={500}
          marks={["$100", "$250k", "$500k", "$750k", "$1M"]}
          onChange={(v) => { setFinalValue(v); setFinalInput(String(v)); }}
          onInputChange={(r) => { setFinalInput(r); const v = Math.max(100, Math.min(1000000, Number(r))); if (!isNaN(v)) setFinalValue(v); }}
          onInputBlur={() => setFinalInput(String(finalValue))}
        >
          <QuickChips symbol="$" values={[5000, 15000, 25000, 50000, 100000]} active={finalValue}
            labels={["$5k", "$15k", "$25k", "$50k", "$100k"]}
            onSelect={(v) => { setFinalValue(v); setFinalInput(String(v)); }} />
        </SliderInputCard>

        <SliderInputCard
          id="years" label="Holding period" hint="Years you held the investment"
          value={years} inputValue={yearsInput}
          min={1} max={40} step={1}
          marks={["1yr", "10yr", "20yr", "30yr", "40yr"]}
          onChange={(v) => { setYears(v); setYearsInput(String(v)); }}
          onInputChange={(r) => { setYearsInput(r); const v = Math.max(1, Math.min(40, Number(r))); if (!isNaN(v)) setYears(v); }}
          onInputBlur={() => setYearsInput(String(years))}
        >
          <QuickChips values={[1, 3, 5, 10, 20]} active={years}
            labels={["1yr", "3yr", "5yr", "10yr", "20yr"]}
            onSelect={(v) => { setYears(v); setYearsInput(String(v)); }} />
        </SliderInputCard>

        <SliderInputCard
          id="contrib" label="Annual contribution" hint="Recurring yearly top-up (0 if none)"
          symbol="$" value={contribution} inputValue={contribInput}
          min={0} max={50000} step={500}
          marks={["$0", "$12.5k", "$25k", "$37.5k", "$50k"]}
          onChange={(v) => { setContribution(v); setContribInput(String(v)); }}
          onInputChange={(r) => { setContribInput(r); const v = Math.max(0, Math.min(50000, Number(r))); if (!isNaN(v)) setContribution(v); }}
          onInputBlur={() => setContribInput(String(contribution))}
        >
          <QuickChips symbol="$" values={[0, 1000, 3000, 6000, 12000]} active={contribution}
            labels={["None", "$1k", "$3k", "$6k", "$12k"]}
            onSelect={(v) => { setContribution(v); setContribInput(String(v)); }} />
        </SliderInputCard>

        <RangeSliderCard label="Annual fees / expenses" hint="Total expense ratio, adviser fee, etc."
          value={feePct} min={0} max={3} step={0.1} unit="%" minLabel="0% (index fund)" maxLabel="3% (active)"
          onChange={setFeePct} />

        <RangeSliderCard label="Capital gains tax rate" hint="Tax on profits at exit"
          value={taxPct} min={0} max={40} step={1} unit="%" minLabel="0%" maxLabel="40%"
          onChange={setTaxPct} />

        <RangeSliderCard label="Inflation rate" hint="Reduces real purchasing power"
          value={inflationPct} min={0} max={10} step={0.1} unit="%" minLabel="0%" maxLabel="10%"
          onChange={setInflationPct} />

        <RangeSliderCard label="Benchmark return" hint="S&P 500 avg ≈ 7% inflation-adjusted"
          value={benchmarkPct} min={1} max={15} step={0.5} unit="%" minLabel="1%" maxLabel="15%"
          onChange={setBenchmarkPct} />

        {!calculated && !calculating && (
          <button type="button" onClick={handleCalculate}
            className="w-full rounded-2xl bg-gray-950 py-4 text-sm font-bold text-white tracking-wide shadow-lg transition-all duration-200 hover:bg-gray-800 hover:shadow-xl active:scale-[0.98]">
            Calculate ROI →
          </button>
        )}
      </div>

      {/* ── RESULTS ── */}
      <div className="flex flex-col gap-4">
        {calculating && (
          <WorthulatorProgressLoader steps={CALC_STEPS} step={calcStep} progress={calcProgress} subtitle="Analysing your investment returns" />
        )}
        {!calculating && !calculated && (
          <WorthulatorResultReveal message="Enter your investment details and hit Calculate" subMessage="Gross ROI, real returns, and benchmark comparison will appear here" />
        )}
        {!calculating && calculated && (
          <>
            <HeroResultCard
              label="Gross ROI"
              formattedValue={`${displayPct.toFixed(1)}%`}
              flash={flash}
              badge={`${result.annualisedReturn.toFixed(1)}% annualised (CAGR) · ${years} years`}
              changeAmount={changeAmount}
              showChange={showChange}
              formattedChange={`${changeAmount > 0 ? "+" : ""}${changeAmount.toFixed(1)}%`}
              changePositive={changeAmount > 0}
              stackedSegments={[
                { pct: Math.min(100, Math.round((result.realPurchasingPower / finalValue) * 100)), colorClass: "bg-emerald-400" },
                { pct: Math.round((result.inflationErosion / finalValue) * 100), colorClass: "bg-amber-400" },
                { pct: Math.round((result.feeDragTotal / finalValue) * 100), colorClass: "bg-red-400" },
              ]}
              stackedLegend={[
                { label: "Real return",       colorClass: "bg-emerald-400" },
                { label: "Inflation erosion", colorClass: "bg-amber-400"  },
                { label: "Fee drag",          colorClass: "bg-red-400"    },
              ]}
              insights={[
                `${result.investmentMultiple}× investment multiple`,
                outperforms
                  ? `+${fmt(result.benchmarkOutperformance)} vs ${benchmarkPct}% benchmark`
                  : `${fmt(result.benchmarkOutperformance)} vs ${benchmarkPct}% benchmark (underperformed)`,
              ]}
            />

            {/* ROI metric cards */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { label: "Net ROI",    value: fmtPct(result.netROIPct),  sub: "after fees + tax"    },
                { label: "Real ROI",   value: fmtPct(result.realROIPct), sub: "inflation-adjusted"  },
                { label: "CAGR",       value: fmtPct(result.annualisedReturn), sub: "annualised return" },
              ].map((c) => (
                <div key={c.label} className="rounded-2xl border border-white/6 bg-gray-900 p-3 sm:p-4 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">{c.label}</p>
                  <p className="mt-2 text-base sm:text-xl font-bold tracking-[-0.03em] text-emerald-400">{c.value}</p>
                  <p className="mt-0.5 text-xs font-medium text-gray-500">{c.sub}</p>
                </div>
              ))}
            </div>

            {/* Breakdown table */}
            <BreakdownTable
              grossLabel="Final value"
              formattedGross={fmt(finalValue)}
              netLabel="Real purchasing power"
              netSubLabel="After fees, tax & inflation"
              formattedNet={fmt(result.realPurchasingPower)}
              rows={[
                { label: "Initial investment",   formattedValue: fmt(initial),                    color: "gray"    },
                { label: result.totalProfit >= 0 ? "Gross profit" : "Gross loss",
                  formattedValue: `${result.totalProfit >= 0 ? "+" : "−"}${fmt(result.totalProfit)}`,
                  color: result.totalProfit >= 0 ? "emerald" : "red" },
                { label: "Fee drag",             formattedValue: `−${fmt(result.feeDragTotal)}`,  color: "blue"    },
                { label: "Tax on gains",         formattedValue: `−${fmt(result.taxDragTotal)}`,  color: "blue"    },
                { label: "Inflation erosion",    formattedValue: `−${fmt(result.inflationErosion)}`, color: "gray" },
              ]}
            />

            {/* Growth vs benchmark line chart */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                Growth vs benchmark
              </p>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData} margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="year" tick={{ fontSize: 10, fill: "#9ca3af" }} tickFormatter={(v) => `Y${v}`} />
                  <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} width={44} />
                  <Tooltip formatter={(v: unknown) => fmt(Number(v))} labelFormatter={(l) => `Year ${l}`} />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
                  <Line type="monotone" dataKey="gross"     name="Gross"     stroke="#34d399" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="net"       name="Net (fees+tax)" stroke="#60a5fa" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="real"      name="Real (inflation)" stroke="#fbbf24" strokeWidth={2} dot={false} strokeDasharray="4 2" />
                  <Line type="monotone" dataKey="benchmark" name={`${benchmarkPct}% benchmark`} stroke="#9ca3af" strokeWidth={1.5} dot={false} strokeDasharray="3 3" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* What-if */}
            <WhatIfButtons
              title="What if your fees or returns changed?"
              hint="Fee drag and inflation quietly destroy returns over time."
              scenarios={[
                { label: "-0.5% fees",    sentiment: "pos", onClick: () => setFeePct((f) => Math.max(0, parseFloat((f - 0.5).toFixed(1)))) },
                { label: "+1% return",    sentiment: "pos", onClick: () => setFinalValue((v) => Math.round(v * 1.1)) },
                { label: "+5 years",      sentiment: "pos", onClick: () => { const v = Math.min(40, years + 5); setYears(v); setYearsInput(String(v)); } },
                { label: "+0.5% fees",    sentiment: "neg", onClick: () => setFeePct((f) => Math.min(3, parseFloat((f + 0.5).toFixed(1)))) },
                { label: "Reset",         sentiment: "neutral", onClick: () => { setInitial(10000); setInitialInput("10000"); setFinalValue(20000); setFinalInput("20000"); setYears(10); setYearsInput("10"); setContribution(0); setContribInput("0"); setFeePct(1); setTaxPct(15); setInflationPct(LIVE_INFLATION); setBenchmarkPct(7); } },
              ]}
            />

            <CalcDisclaimer text="ROI calculations use inputs provided and assume a linear growth model for projection. Real investment returns are variable and not guaranteed. Inflation, fee drag, and tax figures are estimates. This tool is for illustrative purposes only and does not constitute financial or investment advice." />
          </>
        )}
      </div>
    </div>
  );
}
