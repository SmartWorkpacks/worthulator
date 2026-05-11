"use client";

import { SHOW_INCOME_CTA } from "@/src/lib/featureFlags";

import { useState, useEffect, useRef, Fragment } from "react";
import { Slider } from "@/components/ui/slider";

// ─── Calculating loader ───────────────────────────────────────────────────────
const CALC_STEPS = [
  "Reading your inputs…",
  "Applying tax brackets…",
  "Calculating deductions…",
  "Building your breakdown…",
];

function CalculatingLoader({ progress, step }: { progress: number; step: number }) {
  return (
    <div className="relative flex flex-col items-center justify-center py-20 px-6 bg-gray-950 rounded-2xl text-white overflow-hidden">
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 70%, #10b981 0%, transparent 65%)" }}
      />
      <div className="relative mb-7">
        <div
          className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-emerald-400 animate-spin"
          style={{ animationDuration: "0.85s" }}
        />
        <div className="w-20 h-20 rounded-full border-2 border-white/10 flex items-center justify-center bg-white/5">
          <svg width="36" height="36" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M2 3L6 13L8 7L10 13L14 3" stroke="#34d399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
      <p className="relative text-lg font-bold text-center text-white mb-1">{CALC_STEPS[step] ?? "Calculating…"}</p>
      <p className="relative text-xs text-white/40 mb-8">Estimating your take-home pay</p>
      <div className="relative w-full max-w-xs">
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: progress + "%", background: "linear-gradient(90deg, #10b981, #2dd4bf)" }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[10px] text-white/30">{Math.round(progress)}% complete</span>
          <span className="text-[10px] text-white/30">Step {step + 1} / {CALC_STEPS.length}</span>
        </div>
      </div>
      <div className="flex gap-2 mt-6">
        {CALC_STEPS.map((_, i) => (
          <div
            key={i}
            style={{
              height: 6,
              borderRadius: 3,
              width: i < step ? 20 : i === step ? 32 : 12,
              backgroundColor: i <= step ? "#34d399" : "rgba(255,255,255,0.15)",
              transition: "all 0.3s",
            }}
          />
        ))}
      </div>
    </div>
  );
}
import { formatCurrency, getLocale, setLocale } from "@/src/lib/locale";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import EarningsChart from "@/components/enhancements/charts/EarningsChart";
import InsightPanel from "@/components/enhancements/insights/InsightPanel";

import { useRouter, useParams } from "next/navigation";
import { stateTaxRates, stateNames, type StateCode } from "@/src/lib/stateTax";

// -- Calculation logic --------------------------------------------

type Breakdown = { label: string; value: number; color: "red" | "orange" | "gray" };

interface CalcResult {
  net: number;
  breakdowns: Breakdown[];
}

function calculateUS(salary: number, filingStatus: string, stateTaxRate: number): CalcResult {
  const brackets =
    filingStatus === "married"
      ? [
          { up: 23_200,   rate: 0.10 },
          { up: 94_300,   rate: 0.12 },
          { up: 201_050,  rate: 0.22 },
          { up: 383_900,  rate: 0.24 },
          { up: 487_450,  rate: 0.32 },
          { up: 731_200,  rate: 0.35 },
          { up: Infinity, rate: 0.37 },
        ]
      : [
          { up: 11_600,   rate: 0.10 },
          { up: 47_150,   rate: 0.12 },
          { up: 100_525,  rate: 0.22 },
          { up: 191_950,  rate: 0.24 },
          { up: 243_725,  rate: 0.32 },
          { up: 609_350,  rate: 0.35 },
          { up: Infinity, rate: 0.37 },
        ];

  let federal = 0;
  let prev = 0;
  for (const { up, rate } of brackets) {
    if (salary <= prev) break;
    federal += (Math.min(salary, up) - prev) * rate;
    prev = up;
  }

  const socialSecurity = Math.min(salary, 168_600) * 0.062;
  const medicare       = salary * 0.0145;
  const stateTax       = salary * (stateTaxRate / 100);
  const net            = Math.max(0, salary - federal - socialSecurity - medicare - stateTax);

  return {
    net,
    breakdowns: [
      { label: "Federal Income Tax",            value: federal,                    color: "red"    },
      { label: `State Tax (${stateTaxRate}%)`,  value: stateTax,                   color: "orange" },
      { label: "Social Security + Medicare",    value: socialSecurity + medicare,  color: "gray"   },
    ],
  };
}

function calculateUK(salary: number): CalcResult {
  let personalAllowance = 12_570;
  if (salary > 125_140)      personalAllowance = 0;
  else if (salary > 100_000) personalAllowance = Math.max(0, 12_570 - (salary - 100_000) / 2);

  const taxable = Math.max(0, salary - personalAllowance);

  let incomeTax = 0;
  if (taxable <= 37_700) {
    incomeTax = taxable * 0.20;
  } else if (taxable <= 125_140) {
    incomeTax = 37_700 * 0.20 + (taxable - 37_700) * 0.40;
  } else {
    incomeTax = 37_700 * 0.20 + (125_140 - 37_700) * 0.40 + (taxable - 125_140) * 0.45;
  }

  const niPrimary = 12_570;
  const niUpper   = 50_270;
  let ni = 0;
  if (salary > niPrimary) {
    ni += (Math.min(salary, niUpper) - niPrimary) > 0
      ? (Math.min(salary, niUpper) - niPrimary) * 0.08
      : 0;
    if (salary > niUpper) ni += (salary - niUpper) * 0.02;
  }

  const net = Math.max(0, salary - incomeTax - ni);

  return {
    net,
    breakdowns: [
      { label: "Income Tax",          value: incomeTax, color: "red"    },
      { label: "National Insurance",  value: ni,        color: "orange" },
    ],
  };
}

// -- Salary percentile helper (approximate median data) ----------

function getSalaryPercentile(salary: number, country: string): number {
  const bands: [number, number][] = country === "US"
    ? [[0,0],[20000,8],[30000,22],[40000,36],[50000,50],[65000,64],[80000,76],[100000,86],[125000,92],[150000,96],[500000,99]]
    : [[0,0],[15000,8],[20000,18],[25000,32],[30000,45],[38000,58],[50000,74],[60000,82],[75000,90],[100000,97],[200000,99]];
  for (let i = 1; i < bands.length; i++) {
    if (salary <= bands[i][0]) {
      const t = (salary - bands[i - 1][0]) / (bands[i][0] - bands[i - 1][0]);
      return Math.round(bands[i - 1][1] + t * (bands[i][1] - bands[i - 1][1]));
    }
  }
  return 99;
}

// -- Component ----------------------------------------------------

type Country = "US" | "UK";

interface TakeHomePayCalculatorProps {
  initialState?: StateCode;
  initialCountry?: Country;
}

export default function TakeHomePayCalculator({ initialState, initialCountry }: TakeHomePayCalculatorProps = {}) {
  const [country,       setCountry]       = useState<Country>(initialCountry ?? "US");
  const [salary,        setSalary]        = useState<number>(50000);
  const [salaryInput,   setSalaryInput]   = useState<string>("50000");
  const [filingStatus,  setFilingStatus]  = useState<string>("single");
  const [stateTaxRate,  setStateTaxRate]  = useState<number[]>(initialState ? [stateTaxRates[initialState]] : [5]);
  const [selectedState, setSelectedState] = useState<StateCode | "">(initialState ?? "");
  const [flash,         setFlash]         = useState<boolean>(false);
  const [displayNet,    setDisplayNet]    = useState<number>(0);
  const [changeAmount,  setChangeAmount]  = useState<number>(0);
  const [showChange,    setShowChange]    = useState<boolean>(false);
  // Calculate button state — results only reveal after first click
  const [calculated,    setCalculated]    = useState<boolean>(false);
  const [calculating,   setCalculating]   = useState<boolean>(false);
  const [calcStep,      setCalcStep]      = useState<number>(0);
  const [calcProgress,  setCalcProgress]  = useState<number>(0);
  const animRef                           = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevNetRef                        = useRef<number>(0);
  const changeFadeRef                     = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender                     = useRef<boolean>(true);
  const prevCalculatedRef                 = useRef<boolean>(false);
  const router = useRouter();
  const params = useParams();

  // Sync country from header locale toggle
  useEffect(() => {
    const handler = () => setCountry(getLocale() as Country);
    window.addEventListener("worthulator:locale", handler);
    return () => window.removeEventListener("worthulator:locale", handler);
  }, []);

  // Load persisted inputs on first mount (salary and filing status only — country is set by the page URL)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("thpc_inputs");
      if (saved) {
        const data = JSON.parse(saved);
        if (data.salary != null) { setSalary(data.salary); setSalaryInput(String(data.salary)); }
        if (data.filingStatus)   setFilingStatus(data.filingStatus);
      }
    } catch { /* ignore corrupt storage */ }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist inputs on every change — but skip the first render so we never
  // overwrite saved data with the component's hardcoded defaults.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    try {
      localStorage.setItem("thpc_inputs", JSON.stringify({ salary, filingStatus }));
    } catch { /* ignore */ }
  }, [salary, filingStatus]);

  // Sync URL state param → calculator state (handles direct visits and refreshes)
  useEffect(() => {
    const slug = params.state as string | undefined;
    if (!slug) {
      setSelectedState("");
      setStateTaxRate([5]);
      return;
    }
    const code = slug.toUpperCase() as StateCode;
    if (stateTaxRates[code] !== undefined) {
      setSelectedState(code);
      setStateTaxRate([stateTaxRates[code]]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.state]);

  // Derive net early so hooks can reference it
  const result: CalcResult =
    country === "US"
      ? calculateUS(salary, filingStatus, stateTaxRate[0])
      : calculateUK(salary);

  const { net, breakdowns } = result;
  const monthly      = net / 12;
  const weekly       = net / 52;
  const pctNet           = salary > 0 ? Math.round((net / salary) * 100) : 0;
  const sym              = country === "US" ? "$" : "£";
  const totalDeducted    = salary - net;
  const hourly           = net / 52 / 40;
  const effectiveTaxRate = salary > 0 ? ((salary - net) / salary * 100).toFixed(1) : "0.0";
  const salaryPercentile = getSalaryPercentile(salary, country);

  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const cumulativeEarnings = MONTHS.map((label, i) => ({
    label,
    value: Math.round((net / 12) * (i + 1)),
    projected: Math.round((salary / 12) * (i + 1)),
  }));

  useEffect(() => {
    setFlash(true);
    const t = setTimeout(() => setFlash(false), 450);
    return () => clearTimeout(t);
  }, [salary, stateTaxRate, country, filingStatus]);

  // Change indicator — show +/- delta when net changes
  useEffect(() => {
    const prev = prevNetRef.current;
    const diff = net - prev;
    if (prev !== 0 && diff !== 0) {
      setChangeAmount(diff);
      setShowChange(true);
      if (changeFadeRef.current) clearTimeout(changeFadeRef.current);
      changeFadeRef.current = setTimeout(() => setShowChange(false), 1800);
    }
    prevNetRef.current = net;
  }, [net]);

  // Animated count-up/down toward target net (easeOutBack — subtle overshoot then snap)
  useEffect(() => {
    if (animRef.current) clearTimeout(animRef.current);
    const target = net;
    const startVal = displayNet;
    const diff = target - startVal;
    if (diff === 0) return;
    const steps = 24;
    const c1 = 0.4; // overshoot intensity — keep subtle
    const c3 = c1 + 1;
    const easeOutBack = (t: number) => 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    let step = 0;
    const tick = () => {
      step++;
      const progress = step / steps;
      const ease = easeOutBack(progress);
      setDisplayNet(Math.round(startVal + diff * ease));
      if (step < steps) animRef.current = setTimeout(tick, 12);
      else setDisplayNet(target);
    };
    animRef.current = setTimeout(tick, 12);
    return () => { if (animRef.current) clearTimeout(animRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [net]);

  // Count-up animation on first reveal after Calculate
  useEffect(() => {
    if (!calculated || prevCalculatedRef.current) return;
    prevCalculatedRef.current = true;
    const target = net;
    const startVal = Math.round(target * 0.72);
    const diff = target - startVal;
    if (diff === 0) return;
    const steps = 30;
    const c1 = 0.4; const c3 = c1 + 1;
    const easeOutBack = (t: number) => 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    let step = 0;
    const tick = () => {
      step++;
      setDisplayNet(Math.round(startVal + diff * easeOutBack(step / steps)));
      if (step < steps) animRef.current = setTimeout(tick, 14);
      else setDisplayNet(target);
    };
    animRef.current = setTimeout(tick, 14);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calculated]);

  const chartData = [
    { name: "Take-home", value: net > 0 ? net : 0, fill: "#34d399" },
    ...breakdowns
      .filter((b) => b.value > 0)
      .map((b) => ({
        name:  b.label,
        value: b.value,
        fill:  b.color === "red" ? "#fca5a5" : b.color === "orange" ? "#fdba74" : "#d1d5db",
      })),
  ];

  // Stagger chart 200ms behind the number animation for intentional layering
  const [displayChartData, setDisplayChartData] = useState(chartData);
  useEffect(() => {
    const snapshot = chartData;
    const t = setTimeout(() => setDisplayChartData(snapshot), 200);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [net]);

  // Count-up animation on first reveal after Calculate
  useEffect(() => {
    if (!calculated || prevCalculatedRef.current) return;
    prevCalculatedRef.current = true;
    const target = net;
    const startVal = Math.round(target * 0.72);
    const diff = target - startVal;
    if (diff === 0) return;
    const steps = 30;
    const c1 = 0.4; const c3 = c1 + 1;
    const easeOutBack = (t: number) => 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    let step = 0;
    const tick = () => {
      step++;
      setDisplayNet(Math.round(startVal + diff * easeOutBack(step / steps)));
      if (step < steps) animRef.current = setTimeout(tick, 14);
      else setDisplayNet(target);
    };
    animRef.current = setTimeout(tick, 14);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calculated]);

  function handleCalculate() {
    setCalculating(true);
    setCalcStep(0);
    setCalcProgress(0);
    // Step through 4 stages over ~1.4s then reveal results
    const stepDuration = 350;
    const steps = CALC_STEPS.length;
    for (let i = 0; i < steps; i++) {
      setTimeout(() => {
        setCalcStep(i);
        setCalcProgress(Math.round(((i + 1) / steps) * 100));
      }, i * stepDuration);
    }
    setTimeout(() => {
      setCalculating(false);
      setCalculated(true);
    }, steps * stepDuration);
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[2fr_3fr] lg:gap-10">

      {/* INPUTS */}
      <div className="flex flex-col gap-6 lg:sticky lg:top-6 lg:self-start">

        {/* Country selector */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Country</p>
          </div>
          <div className="grid grid-cols-2">
            {(["US", "UK"] as Country[]).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => { setCountry(c); setLocale(c); window.dispatchEvent(new Event("worthulator:locale")); }}
                className={`py-3 text-sm font-semibold transition-colors duration-150 first:border-r first:border-gray-100 ${
                  country === c
                    ? "bg-emerald-500 text-white"
                    : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
              >
                {c === "US" ? "United States" : "United Kingdom"}
              </button>
            ))}
          </div>
        </div>

        {/* Annual Salary — mega slider */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-lg">
          <div className="flex items-start justify-between">
            <div>
              <label htmlFor="salary" className="block text-sm font-semibold text-gray-700">
                Annual gross salary
              </label>
              <p className="mt-0.5 text-xs text-gray-400">Before tax &amp; deductions</p>
            </div>
            {/* Editable number badge */}
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm font-bold text-gray-400">
                {sym}
              </span>
              <input
                id="salary"
                type="number"
                min={0}
                max={500000}
                step={1000}
                value={salaryInput}
                onChange={(e) => {
                  setSalaryInput(e.target.value);
                  const v = Math.max(0, Math.min(500000, Number(e.target.value)));
                  if (!isNaN(v)) setSalary(v);
                }}
                onBlur={() => setSalaryInput(String(salary))}
                className="w-32 rounded-xl border border-gray-200 bg-gray-50 py-2 pl-7 pr-3 text-sm font-bold text-gray-900 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>

          {/* Big drag slider */}
          <div className="mt-5 **:[[role=slider]]:h-5 **:[[role=slider]]:w-5 **:[[role=slider]]:bg-emerald-500 **:[[role=slider]]:border-emerald-400 **:[[role=slider]]:shadow-md **:[[role=slider]]:transition-all **:[[role=slider]]:duration-150 **:[[role=slider]]:cursor-grab **:[[role=slider]]:hover:scale-[1.1] **:[[role=slider]]:active:scale-[1.15] **:[[role=slider]]:active:cursor-grabbing">
            <Slider
              min={0}
              max={500000}
              step={1000}
              value={[salary]}
              onValueChange={([v]) => { setSalary(v); setSalaryInput(String(v)); }}
              className="h-3"
            />
            <div className="mt-2 flex justify-between text-xs text-gray-400">
              <span>{sym}0</span>
              <span>{sym}100k</span>
              <span>{sym}200k</span>
              <span>{sym}300k</span>
              <span>{sym}400k</span>
              <span>{sym}500k</span>
            </div>
            <p className="mt-2 text-xs text-gray-400">
              National median: <span className="font-semibold text-gray-600">{country === "US" ? "$59k" : "\u00a334k"}</span>
              {salary > 0 && (
                <span className={`ml-2 font-semibold ${salaryPercentile >= 50 ? "text-emerald-600" : "text-gray-500"}`}>
                  &middot; top {100 - salaryPercentile}% of earners
                </span>
              )}
            </p>
          </div>

          {/* Quick-pick salary chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            {(country === "US"
              ? [30000, 50000, 75000, 100000, 150000]
              : [25000, 35000, 50000, 75000, 100000]
            ).map((v) => (
              <button
                key={v}
                onClick={() => { setSalary(v); setSalaryInput(String(v)); }}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-150 active:scale-[0.96] ${
                  salary === v
                    ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                    : "border-gray-200 bg-gray-50 text-gray-500 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600"
                }`}
              >
                {sym}{(v / 1000).toFixed(0)}k
              </button>
            ))}
          </div>
        </div>

        {/* Filing Status — US only */}
        {country === "US" && (
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
            <label htmlFor="filing-status" className="block text-sm font-semibold text-gray-700">
              Filing Status
            </label>
            <p className="mt-0.5 text-xs text-gray-400">Affects your federal tax bracket</p>
            <select
              id="filing-status"
              value={filingStatus}
              onChange={(e) => setFilingStatus(e.target.value)}
              className="mt-3 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-medium text-gray-900 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
              <option value="single">Single</option>
              <option value="married">Married (filing jointly)</option>
            </select>
          </div>
        )}

        {/* State Tax - US only */}
        {country === "US" && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-700">State Income Tax</p>
                <p className="mt-0.5 text-xs text-gray-400">Varies by state -- 0% (TX/FL) to 13% (CA)</p>
              </div>
              <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-xl font-bold tracking-tight text-gray-700">
                {stateTaxRate[0]}%
              </span>
            </div>
            {/* State dropdown */}
            <select
              id="state-selector"
              value={selectedState}
              onChange={(e) => {
                const code = e.target.value as StateCode | "";
                setSelectedState(code);
                if (code !== "") {
                  setStateTaxRate([stateTaxRates[code]]);
                  router.push(`/tools/take-home-pay-calculator/${code.toLowerCase()}`);
                } else {
                  router.push("/tools/take-home-pay-calculator");
                }
              }}
              className="mt-4 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-medium text-gray-900 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            >
              <option value="">Select your state (or use slider)</option>
              {(Object.keys(stateTaxRates) as StateCode[]).map((code) => (
                <option key={code} value={code}>
                  {stateNames[code]} — {stateTaxRates[code]}%
                </option>
              ))}
            </select>
            <div className="mt-4">
              {/* Gradient-fill range slider */}
              <div className="relative h-3 rounded-full bg-gray-100">
                <div
                  className="pointer-events-none absolute left-0 top-0 h-full rounded-full"
                  style={{ width: ((stateTaxRate[0] / 13) * 100) + "%", background: "linear-gradient(90deg, #10b981, #34d399)" }}
                />
                <input
                  type="range"
                  min={0}
                  max={13}
                  step={0.5}
                  value={stateTaxRate[0]}
                  onChange={(e) => { setStateTaxRate([Number(e.target.value)]); setSelectedState(""); router.push("/tools/take-home-pay-calculator"); }}
                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />
              </div>
              <div className="mt-1.5 flex justify-between text-xs text-gray-400">
                <span>0% (no state tax)</span>
                <span>13% (CA)</span>
              </div>
            </div>
          </div>
        )}

        {/* UK info card */}
        {country === "UK" && (
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">UK Tax Rates 2024/25</p>
            <ul className="mt-3 space-y-1.5 text-xs text-gray-500">
              <li className="flex justify-between"><span>Personal Allowance</span><span className="font-semibold text-gray-700">12,570</span></li>
              <li className="flex justify-between"><span>Basic rate (up to 50,270)</span><span className="font-semibold text-gray-700">20%</span></li>
              <li className="flex justify-between"><span>Higher rate (up to 125k)</span><span className="font-semibold text-gray-700">40%</span></li>
              <li className="flex justify-between"><span>Additional rate</span><span className="font-semibold text-gray-700">45%</span></li>
              <li className="flex justify-between"><span>NI (employee, primary)</span><span className="font-semibold text-gray-700">8%</span></li>
            </ul>
          </div>
        )}

        {/* Calculate button — only shown before first calculation */}
        {!calculated && <button
          type="button"
          onClick={handleCalculate}
          disabled={calculating}
          className="w-full rounded-2xl bg-gray-950 py-4 text-sm font-bold text-white tracking-wide shadow-lg transition-all duration-200 hover:bg-gray-800 hover:shadow-xl active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {calculating ? "Calculating…" : "Calculate my take-home pay →"}
        </button>}

      </div>

      {/* RESULTS */}
      <div className="flex flex-col gap-4">

        {/* Loader */}
        {calculating && (
          <CalculatingLoader progress={calcProgress} step={calcStep} />
        )}

        {/* Results — only show after first calculation */}
        {!calculating && !calculated && (
          <div className="relative flex flex-col items-center justify-center py-24 px-6 rounded-2xl overflow-hidden bg-gray-950 text-center shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
            <div className="pointer-events-none absolute inset-0 opacity-20" style={{ background: "radial-gradient(ellipse at 50% 80%, #10b981 0%, transparent 60%)" }} />
            <div className="relative w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
              <svg width="24" height="24" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 3L6 13L8 7L10 13L14 3" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="relative text-sm font-semibold text-white/70">Enter your salary and hit Calculate</p>
            <p className="relative mt-1 text-xs text-white/30">Your full breakdown will appear here</p>
          </div>
        )}

        {/* Hero result */}
        {!calculating && calculated && <div className={`relative overflow-hidden rounded-2xl border bg-gray-950 p-8 transition-all duration-500 ${flash ? "border-emerald-500/20 shadow-[0_24px_100px_rgba(0,0,0,0.55),0_0_40px_rgba(52,211,153,0.1)]" : "border-white/8 shadow-[0_24px_80px_rgba(0,0,0,0.45)]"}`}>
          <div className={`pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full blur-3xl transition-all duration-500 ${flash ? "bg-emerald-500/25 scale-110" : "bg-emerald-500/15 scale-100"}`} />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-emerald-900/40 blur-3xl" />

          <p className="relative text-xs font-semibold uppercase tracking-[0.28em] text-gray-400">
            Your estimated take-home pay
          </p>
          <p className={`relative mt-3 text-[clamp(3.5rem,8vw,5.5rem)] font-bold leading-none tracking-[-0.04em] transition-all duration-500 ${flash ? "text-emerald-300 [text-shadow:0_0_40px_rgba(52,211,153,0.6)]" : "text-emerald-400 [text-shadow:0_0_20px_rgba(52,211,153,0.28)]"}`}>
            {formatCurrency(displayNet, country)}
          </p>
          {/* Change delta indicator */}
          <div className={`relative mt-1 h-6 overflow-hidden transition-all duration-700 ${showChange ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"}`}>
            {changeAmount !== 0 && (
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${changeAmount > 0 ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"}`}>
                {changeAmount > 0 ? "+" : ""}{formatCurrency(Math.abs(changeAmount), country)}{" / yr"}
              </span>
            )}
          </div>
          <div className="relative mt-2 flex flex-wrap items-center gap-2.5">
            <p className="text-sm font-medium text-gray-400">per year &nbsp;&middot;&nbsp; <span className="font-bold text-white">{pctNet}%</span> of gross</p>
            {salary > 0 && (
              <span className="rounded-full border border-amber-500/25 bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-300">
                {effectiveTaxRate}% effective tax rate
              </span>
            )}
          </div>
          {salary > 0 && (
            <p className="relative mt-2 text-sm font-medium text-emerald-400">
              You earn more than approximately <span className="font-bold text-emerald-300">{salaryPercentile}%</span> of {country === "US" ? "US" : "UK"} workers.
            </p>
          )}
          <p className="relative mt-1 text-xs text-gray-500">
            Most people take home between <span className="font-semibold text-gray-300">60-70%</span> of their salary.
          </p>

          {/* Stacked colour bar */}
          <div className="mt-6 flex h-3 w-full overflow-hidden rounded-full bg-white/8">
            <div className="h-full bg-emerald-400 transition-all duration-700" style={{ width: `${pctNet}%` }} />
            {breakdowns.map((b) => (
              <div
                key={b.label}
                className={`h-full transition-all duration-700 ${b.color === "red" ? "bg-red-400" : b.color === "orange" ? "bg-orange-300" : "bg-gray-300"}`}
                style={{ width: `${salary > 0 ? Math.round((b.value / salary) * 100) : 0}%` }}
              />
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-400" />Take-home</span>
            {breakdowns.map((b) => (
              <span key={b.label} className="flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${b.color === "red" ? "bg-red-400" : b.color === "orange" ? "bg-orange-300" : "bg-gray-300"}`} />
                {b.label}
              </span>
            ))}
          </div>
        </div>}

        {/* Income CTA */}
        {!calculating && calculated && SHOW_INCOME_CTA && (
        <div className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-sm">
          <p className="text-sm leading-6 text-gray-500">
            You can&apos;t change tax rates —{" "}
            <span className="font-semibold text-gray-800">but you can increase what you earn.</span>
          </p>
          <div className="flex flex-col items-end gap-2">
            <span
              className="shrink-0 cursor-default rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white opacity-90 pointer-events-none"
            >
              See ways to earn more
            </span>
            <p className="text-xs text-gray-400">Coming soon — we&apos;re building tools to help you increase your income.</p>
          </div>
        </div>
        )}

        {/* Donut Chart */}
        {!calculating && calculated && salary > 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Salary breakdown</p>
            <div className="flex items-center gap-8">
              <div className="relative shrink-0">
                <PieChart width={140} height={140}>
                  <Pie
                    data={displayChartData}
                    cx={70}
                    cy={70}
                    innerRadius={42}
                    outerRadius={64}
                    paddingAngle={2}
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={600}
                    strokeWidth={0}
                  >
                    {displayChartData.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [formatCurrency(Number(value), country), ""]}
                    contentStyle={{ borderRadius: "10px", border: "1px solid #e5e7eb", fontSize: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
                  />
                </PieChart>
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-[15px] font-bold leading-none text-gray-900">{pctNet}%</p>
                    <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-wider text-gray-400">yours</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                {chartData.map((entry) => (
                  <div key={entry.name} className="flex items-start gap-2.5">
                    <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: entry.fill }} />
                    <div>
                      <p className="text-xs font-semibold text-gray-700">{entry.name}</p>
                      <p className="text-xs text-gray-400">{formatCurrency(entry.value, country)} &middot; {Math.round((entry.value / salary) * 100)}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Breakdown */}
        {!calculating && calculated && <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl">
          <p className="mb-5 text-sm font-semibold text-gray-700">Full breakdown</p>
          <dl className="space-y-0">

            {/* Gross */}
            <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3.5">
              <dt className="flex items-center gap-2.5 text-sm text-gray-600">
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-gray-300" />
                Gross Income
              </dt>
              <dd className="text-sm font-semibold text-gray-900">{formatCurrency(salary, country)}</dd>
            </div>

            <div className="px-5 py-1 text-xs text-gray-300 select-none">&#8595;</div>

            {/* Dynamic deduction rows */}
            {breakdowns.map((b, i) => (
              <Fragment key={b.label}>
                <div className={`flex items-center justify-between rounded-xl border px-4 py-3.5 ${b.color === "red" ? "border-red-100 bg-red-50" : b.color === "orange" ? "border-orange-100 bg-orange-50" : "border-gray-200 bg-gray-50"}`}>
                  <dt className="flex items-center gap-2.5 text-sm font-medium text-gray-700">
                    <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${b.color === "red" ? "bg-red-400" : b.color === "orange" ? "bg-orange-400" : "bg-gray-400"}`} />
                    {b.label}
                  </dt>
                  <dd className={`text-sm font-semibold ${b.color === "red" ? "text-red-500" : b.color === "orange" ? "text-orange-500" : "text-gray-500"}`}>
                    -{formatCurrency(b.value, country)}
                  </dd>
                </div>
                {i < breakdowns.length - 1 && (
                  <div className="px-5 py-1 text-xs text-gray-300 select-none">&#8595;</div>
                )}
              </Fragment>
            ))}

            <div className="px-5 py-1 text-xs text-gray-300 select-none">&#8595;</div>

            {/* Net */}
            <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5">
              <dt className="flex flex-col gap-0.5">
                <span className="flex items-center gap-2.5 text-sm font-bold tracking-tight text-gray-950">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-400" />
                  Net Income
                </span>
                <span className="ml-5 text-xs text-gray-400">What you actually take home</span>
              </dt>
              <dd className="text-xl font-bold tracking-tight text-emerald-600">{formatCurrency(net, country)}</dd>
            </div>

          </dl>
        </div>}

        {/* Monthly / Weekly / Hourly */}
        {!calculating && calculated && <div className="grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-white/6 bg-gray-900 p-4 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Monthly</p>
            <p className="mt-2 text-2xl font-bold tracking-[-0.03em] text-emerald-400">{formatCurrency(monthly, country)}</p>
            <p className="mt-0.5 text-xs font-medium text-gray-500">per month</p>
          </div>
          <div className="rounded-2xl border border-white/6 bg-gray-900 p-4 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Weekly</p>
            <p className="mt-2 text-2xl font-bold tracking-[-0.03em] text-emerald-400">{formatCurrency(weekly, country)}</p>
            <p className="mt-0.5 text-xs font-medium text-gray-500">per week</p>
          </div>
          <div className="rounded-2xl border border-white/6 bg-gray-900 p-4 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Hourly</p>
            <p className="mt-2 text-2xl font-bold tracking-[-0.03em] text-emerald-400">{formatCurrency(hourly, country)}</p>
            <p className="mt-0.5 text-xs font-medium text-gray-500">est. per hour</p>
          </div>
        </div>}

        {/* Trust note */}
        {!calculating && calculated && <div className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4">
          <p className="text-xs font-medium text-gray-500">
            {country === "US"
              ? "Estimate only. Does not account for deductions, credits, AMT, or state-specific rules. Not tax advice."
              : "Estimate only. Based on 2024/25 rates. Does not account for pension, student loans, or personal circumstances. Not tax advice."}
          </p>
        </div>}

        {/* ── ENHANCEMENT: INSIGHTS ──────────────────────────────────── */}
        {!calculating && calculated && salary > 0 && (
          <>
            {/* Insight panel */}
            <InsightPanel
              data={{ grossAnnual: salary, netAnnual: net, hourlyRate: hourly }}
              showRecommendations={false}
              title="Pay insights"
            />

            {/* Cumulative gross vs net chart — desktop only */}
            <div className="hidden sm:block">
              <EarningsChart
                title="Cumulative take-home vs gross this year"
                data={cumulativeEarnings}
                valueLabel="Take-home"
                projectedLabel="Gross"
                height={220}
              />
            </div>
          </>
        )}

        {/* WHAT IF */}
        {!calculating && calculated && <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl">
          <p className="text-sm font-semibold text-gray-700">What if your salary changed?</p>
          <p className="mt-1 text-xs leading-5 text-gray-400">
            Try changing your salary -- small changes add up quickly. Hit a scenario below to see the impact instantly.
          </p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              { label: "+10% raise",        s: "pos", apply: () => { const v = Math.min(500000, Math.round(salary * 1.1));    setSalary(v); setSalaryInput(String(v)); } },
              { label: `+${sym}5,000`,      s: "pos", apply: () => { const v = Math.min(500000, salary + 5000);              setSalary(v); setSalaryInput(String(v)); } },
              { label: `+${sym}10,000`,     s: "pos", apply: () => { const v = Math.min(500000, salary + 10000);             setSalary(v); setSalaryInput(String(v)); } },
              { label: `-${sym}5,000`,      s: "neg", apply: () => { const v = Math.max(0, salary - 5000);                  setSalary(v); setSalaryInput(String(v)); } },
              { label: "Reset to default",  s: "neu", apply: () => { setSalary(50000); setSalaryInput("50000"); }            },
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
          <div className="mt-5 rounded-xl border border-white/7 bg-gray-950 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Live estimate</p>
            <p className={`mt-1 text-3xl font-bold tracking-[-0.03em] transition-all duration-500 ${flash ? "text-emerald-300 [text-shadow:0_0_20px_rgba(52,211,153,0.5)]" : "text-emerald-400"}`}>
              {formatCurrency(net, country)}<span className="ml-2 text-sm font-normal text-gray-500">/ year</span>
            </p>
            <p className="mt-0.5 text-sm text-gray-400">{formatCurrency(monthly, country)} / mo &nbsp;&middot;&nbsp; {formatCurrency(weekly, country)} / wk</p>
            {salary > 0 && (
              <p className="mt-2 text-xs text-gray-500">
                About <span className="font-semibold text-gray-300">{Math.round((totalDeducted / salary) * 100)}%</span> is taken out -- {formatCurrency(totalDeducted, country)} per year.
              </p>
            )}
          </div>
        </div>}

        {/* ── SOFT CTA ──────────────────────────────────────────────────── */}
        {!calculating && calculated && salary > 0 && (
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-6 py-5">
            <p className="text-sm font-semibold text-emerald-900">Want to improve your take-home pay?</p>
            <p className="mt-1 text-xs leading-5 text-emerald-700">
              Tax rates are fixed — but your income isn&apos;t. A higher salary or better rate negotiation can make a bigger difference than any deduction.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href="/tools/hourly-to-salary-calculator"
                className="rounded-xl border border-emerald-200 bg-white px-4 py-2 text-xs font-semibold text-emerald-700 transition-all hover:-translate-y-px hover:shadow-sm"
              >
                Hourly → Salary calculator
              </a>
              <a
                href="/tools/overtime-pay-calculator"
                className="rounded-xl border border-emerald-200 bg-white px-4 py-2 text-xs font-semibold text-emerald-700 transition-all hover:-translate-y-px hover:shadow-sm"
              >
                Overtime pay calculator
              </a>
              <a
                href="/tools/passive-income-calculator"
                className="rounded-xl border border-emerald-200 bg-white px-4 py-2 text-xs font-semibold text-emerald-700 transition-all hover:-translate-y-px hover:shadow-sm"
              >
                Passive income calculator
              </a>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}