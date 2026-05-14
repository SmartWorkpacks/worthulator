"use client";

import { useState, useRef, useEffect } from "react";
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
  DonutChartArea,
  CalcDisclaimer,
} from "@/src/templates/take-home-pay";

// ─── Calculation ──────────────────────────────────────────────────────────────

interface FVResult {
  futureValue: number;
  totalContributions: number;
  totalInterest: number;
  initialValue: number;
}

function calculateFV(initial: number, monthly: number, annualRate: number, years: number): FVResult {
  const r = annualRate / 100 / 12;
  const n = years * 12;
  const fv =
    r === 0
      ? initial + monthly * n
      : initial * Math.pow(1 + r, n) + monthly * ((Math.pow(1 + r, n) - 1) / r);
  const totalContributions = monthly * n;
  const totalInterest = fv - initial - totalContributions;
  return {
    futureValue:        Math.round(fv),
    totalContributions: Math.round(totalContributions),
    totalInterest:      Math.round(totalInterest),
    initialValue:       initial,
  };
}

function fmt(v: number): string {
  return "$" + Math.round(v).toLocaleString();
}

// ─── Loader steps ─────────────────────────────────────────────────────────────

const CALC_STEPS = [
  "Reading your inputs…",
  "Applying compound interest…",
  "Projecting growth…",
  "Building your breakdown…",
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function FutureValueCalculator() {
  const [initial,      setInitial]      = useState(10000);
  const [initialInput, setInitialInput] = useState("10000");
  const [monthly,      setMonthly]      = useState(500);
  const [monthlyInput, setMonthlyInput] = useState("500");
  const [rate,         setRate]         = useState(7);
  const [years,        setYears]        = useState(20);
  const [yearsInput,   setYearsInput]   = useState("20");

  const [calculated,   setCalculated]   = useState(false);
  const [calculating,  setCalculating]  = useState(false);
  const [calcStep,     setCalcStep]     = useState(0);
  const [calcProgress, setCalcProgress] = useState(0);

  const [flash,        setFlash]        = useState(false);
  const [showChange,   setShowChange]   = useState(false);
  const [changeAmount, setChangeAmount] = useState(0);
  const prevFVRef    = useRef(0);
  const changeFadeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const result = calculateFV(initial, monthly, rate, years);
  const { futureValue, totalContributions, totalInterest, initialValue } = result;
  const totalInvested = initialValue + totalContributions;
  const multiplier    = totalInvested > 0 ? (futureValue / totalInvested).toFixed(1) : "—";

  const display = useCountUp(futureValue, calculated);

  // Flash on value change (only after first calculation)
  useEffect(() => {
    if (!calculated) return;
    setFlash(true);
    const t = setTimeout(() => setFlash(false), 500);
    return () => clearTimeout(t);
  }, [futureValue, calculated]);

  // Delta badge
  useEffect(() => {
    if (!calculated) return;
    const prev = prevFVRef.current;
    const diff = futureValue - prev;
    if (prev !== 0 && diff !== 0) {
      setChangeAmount(diff);
      setShowChange(true);
      if (changeFadeRef.current) clearTimeout(changeFadeRef.current);
      changeFadeRef.current = setTimeout(() => setShowChange(false), 2200);
    }
    prevFVRef.current = futureValue;
  }, [futureValue, calculated]);

  function handleCalculate() {
    setCalculating(true);
    setCalcStep(0);
    setCalcProgress(0);
    const stepDuration = 350;
    for (let i = 0; i < CALC_STEPS.length; i++) {
      setTimeout(() => {
        setCalcStep(i);
        setCalcProgress(Math.round(((i + 1) / CALC_STEPS.length) * 100));
      }, i * stepDuration);
    }
    setTimeout(() => {
      prevFVRef.current = 0; // ensures delta shows on first calculate
      setCalculating(false);
      setCalculated(true);
    }, CALC_STEPS.length * stepDuration);
  }

  // Stacked bar: interest / contributions / initial
  const pctInterest = futureValue > 0 ? Math.round((Math.max(0, totalInterest) / futureValue) * 100) : 0;
  const pctContrib  = futureValue > 0 ? Math.round((totalContributions / futureValue) * 100)       : 0;
  const pctInitial  = futureValue > 0 ? 100 - pctInterest - pctContrib                             : 0;

  const donutData = [
    { name: "Interest earned",  value: Math.max(0, totalInterest), fill: "#34d399" },
    { name: "Contributions",    value: totalContributions,          fill: "#60a5fa" },
    { name: "Initial deposit",  value: initialValue,                fill: "#d1d5db" },
  ];

  // Milestones at 1/3 and 2/3 of horizon, plus full
  const y1 = Math.max(1, Math.round(years / 3));
  const y2 = Math.max(y1 + 1, Math.round((years * 2) / 3));

  return (
    <div className="grid gap-8 lg:grid-cols-[2fr_3fr] lg:gap-10">

      {/* ── INPUTS ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-6 lg:sticky lg:top-6 lg:self-start">

        <SliderInputCard
          id="initial"
          label="Initial investment"
          hint="Starting amount"
          symbol="$"
          value={initial}
          inputValue={initialInput}
          min={0}
          max={100000}
          step={500}
          marks={["$0", "$25k", "$50k", "$75k", "$100k"]}
          onChange={(v) => { setInitial(v); setInitialInput(String(v)); }}
          onInputChange={(raw) => { setInitialInput(raw); const v = Math.max(0, Math.min(100000, Number(raw))); if (!isNaN(v)) setInitial(v); }}
          onInputBlur={() => setInitialInput(String(initial))}
        >
          <QuickChips
            symbol="$"
            values={[1000, 5000, 10000, 25000, 50000]}
            active={initial}
            labels={["$1k", "$5k", "$10k", "$25k", "$50k"]}
            onSelect={(v) => { setInitial(v); setInitialInput(String(v)); }}
          />
        </SliderInputCard>

        <SliderInputCard
          id="monthly"
          label="Monthly contribution"
          hint="Amount added each month"
          symbol="$"
          value={monthly}
          inputValue={monthlyInput}
          min={0}
          max={5000}
          step={50}
          marks={["$0", "$1k", "$2k", "$3k", "$4k", "$5k"]}
          onChange={(v) => { setMonthly(v); setMonthlyInput(String(v)); }}
          onInputChange={(raw) => { setMonthlyInput(raw); const v = Math.max(0, Math.min(5000, Number(raw))); if (!isNaN(v)) setMonthly(v); }}
          onInputBlur={() => setMonthlyInput(String(monthly))}
        >
          <QuickChips
            symbol="$"
            values={[100, 250, 500, 1000, 2000]}
            active={monthly}
            labels={["$100", "$250", "$500", "$1k", "$2k"]}
            onSelect={(v) => { setMonthly(v); setMonthlyInput(String(v)); }}
          />
        </SliderInputCard>

        <RangeSliderCard
          label="Annual return rate"
          hint="Historical S&P 500 avg ≈ 7–10% inflation-adjusted"
          value={rate}
          min={1}
          max={15}
          step={0.5}
          unit="%"
          minLabel="1% (conservative)"
          maxLabel="15% (aggressive)"
          onChange={setRate}
        />

        <SliderInputCard
          id="years"
          label="Investment horizon"
          hint="How many years to grow"
          value={years}
          inputValue={yearsInput}
          min={1}
          max={50}
          step={1}
          marks={["1yr", "10yr", "20yr", "30yr", "40yr", "50yr"]}
          onChange={(v) => { setYears(v); setYearsInput(String(v)); }}
          onInputChange={(raw) => { setYearsInput(raw); const v = Math.max(1, Math.min(50, Number(raw))); if (!isNaN(v)) setYears(v); }}
          onInputBlur={() => setYearsInput(String(years))}
        >
          <QuickChips
            values={[5, 10, 20, 30, 40]}
            active={years}
            labels={["5yr", "10yr", "20yr", "30yr", "40yr"]}
            onSelect={(v) => { setYears(v); setYearsInput(String(v)); }}
          />
        </SliderInputCard>

        {!calculated && (
          <button
            type="button"
            onClick={handleCalculate}
            disabled={calculating}
            className="w-full rounded-2xl bg-gray-950 py-4 text-sm font-bold text-white tracking-wide shadow-lg transition-all duration-200 hover:bg-gray-800 hover:shadow-xl active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {calculating ? "Calculating…" : "Calculate future value →"}
          </button>
        )}
      </div>

      {/* ── RESULTS ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4">

        {calculating && (
          <WorthulatorProgressLoader
            steps={CALC_STEPS}
            step={calcStep}
            progress={calcProgress}
            subtitle="Projecting your investment growth"
          />
        )}

        {!calculating && !calculated && (
          <WorthulatorResultReveal
            message="Enter your numbers and hit Calculate"
            subMessage="Your future value projection will appear here"
          />
        )}

        {!calculating && calculated && (
          <>
            {/* Hero result card */}
            <HeroResultCard
              label="Projected future value"
              formattedValue={fmt(display)}
              flash={flash}
              badge={`${rate}% annual return · ${years} years`}
              changeAmount={changeAmount}
              showChange={showChange}
              formattedChange={`${changeAmount > 0 ? "+" : ""}${fmt(Math.abs(changeAmount))}`}
              changePositive={changeAmount > 0}
              stackedSegments={[
                { pct: pctInterest, colorClass: "bg-emerald-400" },
                { pct: pctContrib,  colorClass: "bg-blue-400"    },
                { pct: Math.max(0, pctInitial), colorClass: "bg-gray-300" },
              ]}
              stackedLegend={[
                { label: "Interest",      colorClass: "bg-emerald-400" },
                { label: "Contributions", colorClass: "bg-blue-400"    },
                { label: "Initial",       colorClass: "bg-gray-300"    },
              ]}
              insights={[`Your money grows ${multiplier}× your total invested`]}
            />

            {/* Growth milestones */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { label: `${y1} yr`,   value: calculateFV(initial, monthly, rate, y1).futureValue   },
                { label: `${y2} yr`,   value: calculateFV(initial, monthly, rate, y2).futureValue   },
                { label: `${years} yr`, value: futureValue },
              ].map((card) => (
                <div
                  key={card.label}
                  className="rounded-2xl border border-white/6 bg-gray-900 p-3 sm:p-4 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">{card.label}</p>
                  <p className="mt-2 text-base sm:text-xl font-bold tracking-[-0.03em] text-emerald-400">{fmt(card.value)}</p>
                  <p className="mt-0.5 text-xs font-medium text-gray-500">projected</p>
                </div>
              ))}
            </div>

            {/* Breakdown table */}
            <BreakdownTable
              grossLabel="Total invested"
              formattedGross={fmt(totalInvested)}
              netLabel="Future value"
              netSubLabel="What your investment grows to"
              formattedNet={fmt(futureValue)}
              rows={[
                { label: "Initial deposit",       formattedValue: fmt(initialValue),          color: "gray"    },
                { label: "Monthly contributions", formattedValue: fmt(totalContributions),    color: "blue"    },
                { label: "Interest earned",       formattedValue: `+${fmt(totalInterest)}`,   color: "emerald" },
              ]}
            />

            {/* Donut chart */}
            <DonutChartArea
              title="Where your money comes from"
              data={donutData}
              centerLabel={`${pctInterest}%`}
              centerSub="interest"
              tooltipFormatter={(v) => fmt(v)}
            />

            {/* What-if scenarios */}
            <WhatIfButtons
              title="What if you changed your inputs?"
              hint="Small changes compound dramatically over time."
              scenarios={[
                { label: "+1% return",  sentiment: "pos",     onClick: () => setRate((r) => Math.min(15, parseFloat((r + 1).toFixed(1)))) },
                { label: "+$100/mo",    sentiment: "pos",     onClick: () => { const v = Math.min(5000, monthly + 100); setMonthly(v); setMonthlyInput(String(v)); } },
                { label: "+5 years",    sentiment: "pos",     onClick: () => { const v = Math.min(50, years + 5); setYears(v); setYearsInput(String(v)); } },
                { label: "-1% return",  sentiment: "neg",     onClick: () => setRate((r) => Math.max(1, parseFloat((r - 1).toFixed(1)))) },
                { label: "Reset",       sentiment: "neutral", onClick: () => { setInitial(10000); setInitialInput("10000"); setMonthly(500); setMonthlyInput("500"); setRate(7); setYears(20); setYearsInput("20"); } },
              ]}
            />

            {/* Disclaimer */}
            <CalcDisclaimer text="Results are projections based on a fixed annual return compounded monthly. They do not account for inflation, taxes on gains, management fees, contribution timing, or market volatility. Past market performance does not guarantee future results. This tool is for illustrative purposes only and should not be relied upon as financial, investment, or tax advice. Consult a qualified financial adviser before making investment decisions." />
          </>
        )}
      </div>
    </div>
  );
}
