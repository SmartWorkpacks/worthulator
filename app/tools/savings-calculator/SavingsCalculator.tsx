"use client";

import { useState, useRef, useEffect } from "react";
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
  DonutChartArea,
  CalcDisclaimer,
} from "@/src/templates/take-home-pay";
import {
  calculateSavings,
  balanceAtYear,
  type CompoundFrequency,
} from "@/lib/calculators/savingsCalculatorEngine";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(v: number): string {
  return "$" + Math.round(v).toLocaleString();
}

const CALC_STEPS = [
  "Reading your savings inputs…",
  "Applying compound interest…",
  "Projecting growth milestones…",
  "Building your savings breakdown…",
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function SavingsCalculator() {
  const [initial,      setInitial]      = useState(5000);
  const [initialInput, setInitialInput] = useState("5000");
  const [monthly,      setMonthly]      = useState(300);
  const [monthlyInput, setMonthlyInput] = useState("300");
  const [rate,         setRate]         = useState(4.5);
  const [years,        setYears]        = useState(10);
  const [yearsInput,   setYearsInput]   = useState("10");
  const [frequency,    setFrequency]    = useState<CompoundFrequency>("monthly");

  const [calculated,   setCalculated]   = useState(false);
  const [calculating,  setCalculating]  = useState(false);
  const [calcStep,     setCalcStep]     = useState(0);
  const [calcProgress, setCalcProgress] = useState(0);

  const [flash,        setFlash]        = useState(false);
  const [showChange,   setShowChange]   = useState(false);
  const [changeAmount, setChangeAmount] = useState(0);
  const prevRef       = useRef(0);
  const changeFadeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const result = calculateSavings({
    initialBalance: initial,
    monthlyContribution: monthly,
    annualRate: rate,
    years,
    compoundFrequency: frequency,
  });

  const { finalBalance, totalContributions, totalInterest, totalDeposited, growthMultiplier } = result;
  const display = useCountUp(finalBalance, calculated);

  // Flash on value change
  useEffect(() => {
    if (!calculated) return;
    setFlash(true);
    const t = setTimeout(() => setFlash(false), 500);
    return () => clearTimeout(t);
  }, [finalBalance, calculated]);

  // Delta badge
  useEffect(() => {
    if (!calculated) return;
    const prev = prevRef.current;
    const diff = finalBalance - prev;
    if (prev !== 0 && diff !== 0) {
      setChangeAmount(diff);
      setShowChange(true);
      if (changeFadeRef.current) clearTimeout(changeFadeRef.current);
      changeFadeRef.current = setTimeout(() => setShowChange(false), 2200);
    }
    prevRef.current = finalBalance;
  }, [finalBalance, calculated]);

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
      prevRef.current = 0;
      setCalculating(false);
      setCalculated(true);
    }, CALC_STEPS.length * stepDuration);
  }

  // Stacked bar: interest / contributions / initial
  const pctInterest = finalBalance > 0 ? Math.round((totalInterest / finalBalance) * 100) : 0;
  const pctContrib  = finalBalance > 0 ? Math.round((totalContributions / finalBalance) * 100) : 0;
  const pctInitial  = finalBalance > 0 ? 100 - pctInterest - pctContrib : 0;

  const donutData = [
    { name: "Interest earned",    value: totalInterest,       fill: "#34d399" },
    { name: "Contributions",      value: totalContributions,  fill: "#60a5fa" },
    { name: "Initial balance",    value: initial,             fill: "#d1d5db" },
  ];

  const y1 = Math.max(1, Math.round(years / 3));
  const y2 = Math.max(y1 + 1, Math.round((years * 2) / 3));

  const baseInput = { initialBalance: initial, monthlyContribution: monthly, annualRate: rate, years, compoundFrequency: frequency };

  return (
    <div className="grid gap-8 lg:grid-cols-[2fr_3fr] lg:gap-10">

      {/* ── INPUTS ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-6 lg:sticky lg:top-6 lg:self-start">

        <SliderInputCard
          id="initial"
          label="Starting balance"
          hint="Amount you already have saved"
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
            values={[0, 1000, 5000, 10000, 25000]}
            active={initial}
            labels={["$0", "$1k", "$5k", "$10k", "$25k"]}
            onSelect={(v) => { setInitial(v); setInitialInput(String(v)); }}
          />
        </SliderInputCard>

        <SliderInputCard
          id="monthly"
          label="Monthly contribution"
          hint="How much you add each month"
          symbol="$"
          value={monthly}
          inputValue={monthlyInput}
          min={0}
          max={3000}
          step={50}
          marks={["$0", "$750", "$1.5k", "$2.25k", "$3k"]}
          onChange={(v) => { setMonthly(v); setMonthlyInput(String(v)); }}
          onInputChange={(raw) => { setMonthlyInput(raw); const v = Math.max(0, Math.min(3000, Number(raw))); if (!isNaN(v)) setMonthly(v); }}
          onInputBlur={() => setMonthlyInput(String(monthly))}
        >
          <QuickChips
            symbol="$"
            values={[50, 100, 200, 300, 500]}
            active={monthly}
            labels={["$50", "$100", "$200", "$300", "$500"]}
            onSelect={(v) => { setMonthly(v); setMonthlyInput(String(v)); }}
          />
        </SliderInputCard>

        <RangeSliderCard
          label="Annual interest rate"
          hint="High-yield savings accounts: 4–5% · Traditional savings: 0.5–2%"
          value={rate}
          min={0.1}
          max={10}
          step={0.1}
          unit="%"
          minLabel="0.1% (standard)"
          maxLabel="10% (high yield)"
          onChange={setRate}
        />

        <SliderInputCard
          id="years"
          label="Savings duration"
          hint="How many years to save"
          value={years}
          inputValue={yearsInput}
          min={1}
          max={40}
          step={1}
          marks={["1yr", "10yr", "20yr", "30yr", "40yr"]}
          onChange={(v) => { setYears(v); setYearsInput(String(v)); }}
          onInputChange={(raw) => { setYearsInput(raw); const v = Math.max(1, Math.min(40, Number(raw))); if (!isNaN(v)) setYears(v); }}
          onInputBlur={() => setYearsInput(String(years))}
        >
          <QuickChips
            values={[1, 3, 5, 10, 20]}
            active={years}
            labels={["1yr", "3yr", "5yr", "10yr", "20yr"]}
            onSelect={(v) => { setYears(v); setYearsInput(String(v)); }}
          />
        </SliderInputCard>

        <SelectCard
          id="frequency"
          label="Compound frequency"
          hint="How often interest is applied"
          value={frequency}
          options={[
            { value: "monthly",      label: "Monthly (most common)" },
            { value: "quarterly",    label: "Quarterly" },
            { value: "semi-annual",  label: "Semi-annual" },
            { value: "annual",       label: "Annual" },
          ]}
          onChange={(v) => setFrequency(v as CompoundFrequency)}
        />

        {!calculated && (
          <button
            type="button"
            onClick={handleCalculate}
            disabled={calculating}
            className="w-full rounded-2xl bg-gray-950 py-4 text-sm font-bold text-white tracking-wide shadow-lg transition-all duration-200 hover:bg-gray-800 hover:shadow-xl active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {calculating ? "Calculating…" : "Calculate savings →"}
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
            subtitle="Projecting your savings growth"
          />
        )}

        {!calculating && !calculated && (
          <WorthulatorResultReveal
            message="Enter your numbers and hit Calculate"
            subMessage="Your savings projection will appear here"
          />
        )}

        {!calculating && calculated && (
          <>
            <HeroResultCard
              label="Projected savings balance"
              formattedValue={fmt(display)}
              flash={flash}
              badge={`${rate}% APY · ${years} ${years === 1 ? "year" : "years"} · ${frequency} compounding`}
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
              insights={[`Your money grows ${growthMultiplier}× your total deposited`]}
            />

            {/* Milestones */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { label: `${y1} yr`,    value: balanceAtYear(baseInput, y1) },
                { label: `${y2} yr`,    value: balanceAtYear(baseInput, y2) },
                { label: `${years} yr`, value: finalBalance },
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

            <BreakdownTable
              grossLabel="Total deposited"
              formattedGross={fmt(totalDeposited)}
              netLabel="Final savings balance"
              netSubLabel="What your savings grows to"
              formattedNet={fmt(finalBalance)}
              rows={[
                { label: "Initial balance",     formattedValue: fmt(initial),           color: "gray"    },
                { label: "Monthly contributions",formattedValue: fmt(totalContributions),color: "blue"    },
                { label: "Interest earned",      formattedValue: `+${fmt(totalInterest)}`,color: "emerald" },
              ]}
            />

            <DonutChartArea
              title="Where your savings come from"
              data={donutData}
              centerLabel={`${pctInterest}%`}
              centerSub="interest"
              tooltipFormatter={(v) => fmt(v)}
            />

            <WhatIfButtons
              title="What if you adjusted your plan?"
              hint="Small habit changes compound significantly over time."
              scenarios={[
                { label: "+$50/mo",    sentiment: "pos",     onClick: () => { const v = Math.min(3000, monthly + 50); setMonthly(v); setMonthlyInput(String(v)); } },
                { label: "+1% rate",   sentiment: "pos",     onClick: () => setRate((r) => Math.min(10, parseFloat((r + 1).toFixed(1)))) },
                { label: "+3 years",   sentiment: "pos",     onClick: () => { const v = Math.min(40, years + 3); setYears(v); setYearsInput(String(v)); } },
                { label: "-$50/mo",    sentiment: "neg",     onClick: () => { const v = Math.max(0, monthly - 50); setMonthly(v); setMonthlyInput(String(v)); } },
                { label: "Reset",      sentiment: "neutral", onClick: () => { setInitial(5000); setInitialInput("5000"); setMonthly(300); setMonthlyInput("300"); setRate(4.5); setYears(10); setYearsInput("10"); setFrequency("monthly"); } },
              ]}
            />

            <CalcDisclaimer text="Results are projections based on a fixed annual interest rate and selected compound frequency. They do not account for inflation, taxes on interest, changes in contribution amounts, or variable interest rates. Real savings account rates fluctuate and are not guaranteed. This tool is for illustrative purposes only and should not be relied upon as financial or tax advice." />
          </>
        )}
      </div>
    </div>
  );
}
