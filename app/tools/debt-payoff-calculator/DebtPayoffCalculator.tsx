"use client";

import { useState, useRef, useEffect } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import WorthulatorProgressLoader from "@/src/templates/shared/WorthulatorProgressLoader";
import WorthulatorResultReveal from "@/src/templates/shared/WorthulatorResultReveal";
import {
  SliderInputCard,
  QuickChips,
  SelectCard,
  HeroResultCard,
  BreakdownTable,
  WhatIfButtons,
  CalcDisclaimer,
} from "@/src/templates/take-home-pay";
import { calculateDebtPayoff, type DebtEntry } from "@/lib/calculators/debtPayoffEngine";

function fmt(v: number) { return "$" + Math.round(Math.abs(v)).toLocaleString(); }

const STRATEGIES = [
  { value: "avalanche", label: "Avalanche — highest interest first (saves most money)" },
  { value: "snowball",  label: "Snowball — smallest balance first (fastest wins)"      },
  { value: "minimum",  label: "Minimum payments only"                                  },
];

const CALC_STEPS = [
  "Loading your debt details…",
  "Simulating payoff strategy…",
  "Comparing to minimum payments…",
  "Calculating interest saved…",
];

const DEFAULT_DEBTS: DebtEntry[] = [
  { id: "1", name: "Credit card", balance: 5000,  interestRate: 19.99, minimumPayment: 100 },
  { id: "2", name: "Car loan",    balance: 12000, interestRate: 6.5,   minimumPayment: 220 },
];

let nextId = 3;

export default function DebtPayoffCalculator() {
  const [debts,      setDebts]      = useState<DebtEntry[]>(DEFAULT_DEBTS);
  const [extra,      setExtra]      = useState(200);
  const [extraInput, setExtraInput] = useState("200");
  const [lump,       setLump]       = useState(0);
  const [lumpInput,  setLumpInput]  = useState("0");
  const [strategy,   setStrategy]   = useState<"avalanche" | "snowball" | "minimum">("avalanche");

  const [calculated,   setCalculated]   = useState(false);
  const [calculating,  setCalculating]  = useState(false);
  const [calcStep,     setCalcStep]     = useState(0);
  const [calcProgress, setCalcProgress] = useState(0);
  const [flash,        setFlash]        = useState(false);
  const prevMonthsRef  = useRef(0);

  const result = calculateDebtPayoff({
    debts,
    extraMonthlyPayment: extra,
    lumpSumPayment: lump,
    strategy,
  });

  useEffect(() => {
    if (!calculated) return;
    setFlash(true);
    const t = setTimeout(() => setFlash(false), 500);
    return () => clearTimeout(t);
  }, [result.debtFreeMonths, calculated]);

  function handleCalculate() {
    setCalculating(true);
    setCalcStep(0);
    setCalcProgress(0);
    const dur = 380;
    for (let i = 0; i < CALC_STEPS.length; i++) {
      setTimeout(() => { setCalcStep(i); setCalcProgress(Math.round(((i + 1) / CALC_STEPS.length) * 100)); }, i * dur);
    }
    setTimeout(() => { prevMonthsRef.current = 0; setCalculating(false); setCalculated(true); }, CALC_STEPS.length * dur);
  }

  // Debt editor helpers
  function updateDebt(id: string, field: keyof DebtEntry, value: string | number) {
    setDebts((prev) => prev.map((d) => d.id === id ? { ...d, [field]: value } : d));
  }
  function addDebt() {
    if (debts.length >= 6) return;
    setDebts((prev) => [...prev, { id: String(nextId++), name: `Debt ${prev.length + 1}`, balance: 2000, interestRate: 10, minimumPayment: 50 }]);
  }
  function removeDebt(id: string) {
    if (debts.length <= 1) return;
    setDebts((prev) => prev.filter((d) => d.id !== id));
  }

  // Chart downsample
  const snapshots = result.monthlySnapshots;
  const step = Math.max(1, Math.floor(snapshots.length / 24));
  const chartData = snapshots
    .filter((_, i) => i % step === 0 || i === snapshots.length - 1)
    .map((s) => ({ month: s.month, balance: Math.round(s.totalBalance), interest: Math.round(s.totalInterestPaid) }));

  const savedPct = result.minimumOnlyInterest > 0
    ? Math.round((result.interestSaved / result.minimumOnlyInterest) * 100)
    : 0;

  return (
    <div className="grid gap-8 lg:grid-cols-[2fr_3fr] lg:gap-10">

      {/* ── INPUTS ── */}
      <div className="flex flex-col gap-6 lg:sticky lg:top-6 lg:self-start max-h-[90vh] overflow-y-auto pr-1">

        {/* Debt entries */}
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-gray-700">Your debts</p>
              <p className="text-xs text-gray-400 mt-0.5">Add up to 6 debts</p>
            </div>
            <button type="button" onClick={addDebt} disabled={debts.length >= 6}
              className="rounded-xl bg-gray-950 px-3 py-1.5 text-xs font-bold text-white transition-all hover:bg-gray-800 disabled:opacity-40">
              + Add debt
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {debts.map((debt, idx) => (
              <div key={debt.id} className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                <div className="flex items-center justify-between mb-2">
                  <input
                    type="text" value={debt.name}
                    onChange={(e) => updateDebt(debt.id, "name", e.target.value)}
                    className="text-xs font-semibold text-gray-700 bg-transparent border-b border-dashed border-gray-300 focus:outline-none w-28"
                    placeholder="Debt name"
                  />
                  {debts.length > 1 && (
                    <button type="button" onClick={() => removeDebt(debt.id)}
                      className="text-xs text-red-400 hover:text-red-600 font-semibold transition-colors">
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: "Balance ($)", field: "balance" as keyof DebtEntry, step: 100, min: 100 },
                    { label: "Rate (%)",   field: "interestRate" as keyof DebtEntry, step: 0.1, min: 0 },
                    { label: "Min ($)",   field: "minimumPayment" as keyof DebtEntry, step: 10, min: 10 },
                  ].map(({ label, field, step: s, min }) => (
                    <div key={field}>
                      <label className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 mb-1">{label}</label>
                      <input
                        type="number" min={min} step={s}
                        value={String(debt[field])}
                        onChange={(e) => { const v = parseFloat(e.target.value); if (!isNaN(v) && v >= min) updateDebt(debt.id, field, v); }}
                        className="w-full rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs font-semibold text-gray-700 focus:border-emerald-400 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-2 flex items-center gap-1 text-[10px] text-gray-400">
                  <span className="font-semibold text-orange-500">{idx + 1}</span>
                  <span>{debt.name} · {debt.interestRate}% APR · ${debt.balance.toLocaleString()} balance</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <SelectCard
          id="strategy" label="Payoff strategy" hint="How to prioritise which debt to attack first"
          value={strategy}
          options={STRATEGIES}
          onChange={(v) => setStrategy(v as "avalanche" | "snowball" | "minimum")}
        />

        <SliderInputCard
          id="extra" label="Extra monthly payment" hint="On top of all minimum payments combined"
          symbol="$" value={extra} inputValue={extraInput}
          min={0} max={2000} step={25}
          marks={["$0", "$500", "$1k", "$1.5k", "$2k"]}
          onChange={(v) => { setExtra(v); setExtraInput(String(v)); }}
          onInputChange={(r) => { setExtraInput(r); const v = Math.max(0, Math.min(2000, Number(r))); if (!isNaN(v)) setExtra(v); }}
          onInputBlur={() => setExtraInput(String(extra))}
        >
          <QuickChips symbol="$" values={[0, 50, 100, 200, 500]} active={extra}
            labels={["$0", "$50", "$100", "$200", "$500"]}
            onSelect={(v) => { setExtra(v); setExtraInput(String(v)); }} />
        </SliderInputCard>

        <SliderInputCard
          id="lump" label="One-time lump sum" hint="Applied immediately to first priority debt"
          symbol="$" value={lump} inputValue={lumpInput}
          min={0} max={50000} step={250}
          marks={["$0", "$12.5k", "$25k", "$37.5k", "$50k"]}
          onChange={(v) => { setLump(v); setLumpInput(String(v)); }}
          onInputChange={(r) => { setLumpInput(r); const v = Math.max(0, Math.min(50000, Number(r))); if (!isNaN(v)) setLump(v); }}
          onInputBlur={() => setLumpInput(String(lump))}
        >
          <QuickChips symbol="$" values={[0, 500, 1000, 5000, 10000]} active={lump}
            labels={["None", "$500", "$1k", "$5k", "$10k"]}
            onSelect={(v) => { setLump(v); setLumpInput(String(v)); }} />
        </SliderInputCard>

        {!calculated && (
          <button type="button" onClick={handleCalculate} disabled={calculating}
            className="w-full rounded-2xl bg-gray-950 py-4 text-sm font-bold text-white tracking-wide shadow-lg transition-all duration-200 hover:bg-gray-800 hover:shadow-xl active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed">
            {calculating ? "Calculating…" : "Calculate payoff date →"}
          </button>
        )}
      </div>

      {/* ── RESULTS ── */}
      <div className="flex flex-col gap-4">
        {calculating && (
          <WorthulatorProgressLoader steps={CALC_STEPS} step={calcStep} progress={calcProgress} subtitle="Simulating your debt freedom timeline" />
        )}
        {!calculating && !calculated && (
          <WorthulatorResultReveal message="Enter your debts and click Calculate" subMessage="Your debt-free date and interest saved will appear here" />
        )}
        {!calculating && calculated && (
          <>
            {/* Debt-free date — hero result */}
            <div className={`rounded-2xl border border-white/6 bg-gray-900 p-6 sm:p-8 shadow-xl transition-all duration-300 ${flash ? "ring-2 ring-emerald-400" : ""}`}>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500 mb-2">Debt-free date</p>
              <p className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-white leading-none">
                {result.debtFreeDate}
              </p>
              <p className="mt-2 text-sm text-gray-400">
                {result.debtFreeMonths} months · {Math.round(result.debtFreeMonths / 12 * 10) / 10} years
                {strategy !== "minimum" && result.monthsSaved > 0 && (
                  <span className="ml-2 text-emerald-400 font-semibold">{result.monthsSaved} months faster than minimum-only</span>
                )}
              </p>

              {/* Debt stack viz */}
              <div className="mt-5 grid grid-cols-3 gap-2">
                {[
                  { label: "Total interest",    value: fmt(result.totalInterestPaid), color: "text-red-400"     },
                  { label: "Interest saved",     value: fmt(result.interestSaved),     color: "text-emerald-400" },
                  { label: "Months saved",       value: String(result.monthsSaved),    color: "text-blue-400"    },
                ].map((c) => (
                  <div key={c.label} className="rounded-xl bg-white/5 p-3">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">{c.label}</p>
                    <p className={`mt-1.5 text-base sm:text-lg font-bold tracking-tight ${c.color}`}>{c.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Interest saved vs minimum */}
            {strategy !== "minimum" && result.interestSaved > 0 && (
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 mb-1">You save {savedPct}% on interest</p>
                <p className="text-sm text-emerald-800">
                  The <strong>{strategy}</strong> strategy saves you{" "}
                  <span className="font-bold text-emerald-700">{fmt(result.interestSaved)}</span> in interest
                  and gets you debt-free <span className="font-bold">{result.monthsSaved} months sooner</span> than making minimum payments only.
                </p>
                <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-gray-500">Min only: {result.minimumOnlyMonths} months</p>
                    <p className="font-semibold text-red-600">{fmt(result.minimumOnlyInterest)} interest</p>
                  </div>
                  <div>
                    <p className="text-gray-500">{strategy}: {result.debtFreeMonths} months</p>
                    <p className="font-semibold text-emerald-600">{fmt(result.totalInterestPaid)} interest</p>
                  </div>
                </div>
              </div>
            )}

            {/* Breakdown */}
            <BreakdownTable
              grossLabel="Total debt"
              formattedGross={fmt(result.totalDebt)}
              netLabel="Total you will pay"
              netSubLabel="Principal + all interest"
              formattedNet={fmt(result.totalPaid)}
              rows={[
                { label: "Principal",             formattedValue: fmt(result.totalDebt),        color: "gray"    },
                { label: "Total interest",        formattedValue: `+${fmt(result.totalInterestPaid)}`, color: "blue" },
                ...(extra > 0 ? [{ label: "Extra monthly payment", formattedValue: `${fmt(extra)}/mo`, color: "emerald" as const }] : []),
                ...(lump  > 0 ? [{ label: "Lump-sum applied",       formattedValue: fmt(lump),             color: "emerald" as const }] : []),
              ]}
            />

            {/* Payoff order */}
            {result.payoffOrder.length > 0 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-3">
                  {strategy === "avalanche" ? "Avalanche" : strategy === "snowball" ? "Snowball" : "Minimum"} payoff order
                </p>
                <div className="flex flex-col gap-2">
                  {result.payoffOrder.map((name, i) => (
                    <div key={name} className="flex items-center gap-2">
                      <span className="shrink-0 w-5 h-5 rounded-full bg-gray-950 text-white text-[10px] font-bold flex items-center justify-center">{i + 1}</span>
                      <span className="text-sm font-medium text-gray-700">{name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Burn-down chart */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Debt burn-down</p>
              <p className="mb-4 text-xs text-gray-400">Total outstanding balance over time</p>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={chartData} margin={{ top: 0, right: 8, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradBalance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#34d399" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#34d399" stopOpacity={0}   />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#9ca3af" }} tickFormatter={(v) => `M${v}`} />
                  <YAxis tick={{ fontSize: 10, fill: "#9ca3af" }} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} width={44} />
                  <Tooltip
                    formatter={(v: unknown, name: string | number | undefined) => [fmt(Number(v)), name === "balance" ? "Remaining balance" : "Cumulative interest"]}
                    labelFormatter={(l) => `Month ${l}`}
                  />
                  <Area type="monotone" dataKey="balance" name="Remaining balance" stroke="#34d399" fill="url(#gradBalance)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <WhatIfButtons
              title="What if you paid more or switched strategy?"
              hint="An extra $100/month can save thousands in interest and shave years off your payoff."
              scenarios={[
                { label: "+$100/mo extra",    sentiment: "pos",     onClick: () => { const v = Math.min(2000, extra + 100); setExtra(v); setExtraInput(String(v)); } },
                { label: "+$500/mo extra",    sentiment: "pos",     onClick: () => { const v = Math.min(2000, extra + 500); setExtra(v); setExtraInput(String(v)); } },
                { label: "Avalanche",         sentiment: "pos",     onClick: () => setStrategy("avalanche") },
                { label: "Snowball",          sentiment: "neutral", onClick: () => setStrategy("snowball")  },
                { label: "Reset",             sentiment: "neutral", onClick: () => { setDebts(DEFAULT_DEBTS); setExtra(200); setExtraInput("200"); setLump(0); setLumpInput("0"); setStrategy("avalanche"); } },
              ]}
            />

            <CalcDisclaimer text="Debt payoff projections are estimates based on your inputs and assume fixed interest rates and consistent payments. Actual payoff times may vary due to variable rates, missed payments, or other factors. This tool is for illustrative purposes only and does not constitute financial or debt advice." />
          </>
        )}
      </div>
    </div>
  );
}
