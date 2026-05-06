"use client";

import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { PieChart, Pie, Cell, Tooltip } from "recharts";

type Finish  = "broom" | "exposed" | "stamped";
type Reinf   = "none" | "mesh" | "rebar";
type Removal = "none" | "pavers" | "concrete";

const FINISH_OPTIONS: { value: Finish; label: string; addon: number; note: string }[] = [
  { value: "broom",    label: "Broom finish",      addon: 0,   note: "Standard" },
  { value: "exposed",  label: "Exposed aggregate", addon: 2.5, note: "+$2.50/sqft" },
  { value: "stamped",  label: "Stamped concrete",  addon: 12,  note: "+$12/sqft" },
];

const REINF_OPTIONS: { value: Reinf; label: string; addon: number; note: string }[] = [
  { value: "none",  label: "No reinforcement", addon: 0,    note: "Small patios" },
  { value: "mesh",  label: "Wire mesh",         addon: 0.25, note: "+$0.25/sqft" },
  { value: "rebar", label: "Rebar grid",        addon: 1.00, note: "+$1.00/sqft" },
];

const REMOVAL_OPTIONS: { value: Removal; label: string; cost: number; note: string }[] = [
  { value: "none",     label: "No removal",      cost: 0,   note: "New pour" },
  { value: "pavers",   label: "Remove pavers",   cost: 2.0, note: "~$2.00/sqft" },
  { value: "concrete", label: "Remove concrete", cost: 4.0, note: "~$4.00/sqft" },
];

export default function ConcretePatioCostCalculator() {
  const [length, setLength] = useState(12);
  const [lenI,   setLenI]   = useState("12");
  const [width,  setWidth]  = useState(12);
  const [widI,   setWidI]   = useState("12");
  const [finish, setFinish] = useState<Finish>("broom");
  const [reinf,  setReinf]  = useState<Reinf>("mesh");
  const [removal, setRemoval] = useState<Removal>("none");

  const [showAdv,  setShowAdv]  = useState(false);
  const [laborI,   setLaborI]   = useState("5");
  const [laborVal, setLaborVal] = useState(5);
  const [priceI,   setPriceI]   = useState("150");
  const [priceVal, setPriceVal] = useState(150);
  const [thickI,   setThickI]   = useState("4");
  const [thickVal, setThickVal] = useState(4);
  const [wasteI,   setWasteI]   = useState("10");
  const [wastePct, setWastePct] = useState(10);

  const [flash, setFlash] = useState(false);
  useEffect(() => {
    setFlash(true);
    const t = setTimeout(() => setFlash(false), 400);
    return () => clearTimeout(t);
  }, [length, width, finish, reinf, removal, laborVal, priceVal, thickVal, wastePct]);

  // Calculations
  const sqft      = length * width;
  const cubicFt   = sqft * (thickVal / 12);
  const cubicYds  = cubicFt / 27;
  const cubicYdsW = cubicYds * (1 + wastePct / 100);

  const finishAddon = FINISH_OPTIONS.find((f) => f.value === finish)!.addon;
  const reinfAddon  = REINF_OPTIONS.find((r) => r.value === reinf)!.addon;
  const removalCost = REMOVAL_OPTIONS.find((r) => r.value === removal)!.cost;

  const materialCost = Math.round(cubicYdsW * priceVal);
  const laborRate    = laborVal + finishAddon + reinfAddon;
  const laborCost    = Math.round(sqft * laborRate);
  const demolCost    = Math.round(sqft * removalCost);
  const totalCost    = materialCost + laborCost + demolCost;
  const perSqft      = sqft > 0 ? totalCost / sqft : 0;

  const chartData = [
    { name: "Materials", value: materialCost, fill: "#10b981" },
    { name: "Labour",    value: laborCost,    fill: "#3b82f6" },
    ...(demolCost > 0 ? [{ name: "Removal", value: demolCost, fill: "#f59e0b" }] : []),
  ];
  const pctMaterial = totalCost > 0 ? Math.round((materialCost / totalCost) * 100) : 0;

  const fmt = (n: number) => "$" + n.toLocaleString("en-US");

  const cardCls =
    "rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-lg";
  const inputCls =
    "w-28 rounded-xl border border-gray-200 bg-gray-50 py-2 pl-3 pr-10 text-right text-sm font-bold text-gray-900 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100";
  const sliderWrapCls =
    "mt-5 **:[[role=slider]]:h-5 **:[[role=slider]]:w-5 **:[[role=slider]]:bg-emerald-500 **:[[role=slider]]:border-emerald-400 **:[[role=slider]]:shadow-md **:[[role=slider]]:transition-all **:[[role=slider]]:duration-150 **:[[role=slider]]:cursor-grab **:[[role=slider]]:hover:scale-[1.1] **:[[role=slider]]:active:scale-[1.15] **:[[role=slider]]:active:cursor-grabbing";

  return (
    <div className="grid gap-8 lg:grid-cols-[3fr_2fr] lg:gap-10">

      {/* ── INPUTS ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-5">

        {/* Length */}
        <div className={cardCls}>
          <div className="flex items-start justify-between">
            <div>
              <label htmlFor="cpc-length" className="block text-sm font-semibold text-gray-700">Length</label>
              <p className="mt-0.5 text-xs text-gray-400">Patio length in feet</p>
            </div>
            <div className="relative">
              <input
                id="cpc-length" type="number" min={4} max={200} step={1}
                value={lenI}
                onChange={(e) => { setLenI(e.target.value); const v = Math.max(1, Math.min(200, Number(e.target.value))); if (!isNaN(v)) setLength(v); }}
                onBlur={() => setLenI(String(length))}
                className={inputCls}
              />
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs font-semibold text-gray-400">ft</span>
            </div>
          </div>
          <div className={sliderWrapCls}>
            <Slider min={4} max={60} step={1} value={[Math.min(length, 60)]}
              onValueChange={([v]) => { setLength(v); setLenI(String(v)); }} className="h-3" />
            <div className="mt-2 flex justify-between text-xs text-gray-400">
              <span>4 ft</span><span>32 ft</span><span>60 ft</span>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {[10, 12, 16, 20, 24].map((v) => (
              <button key={v} type="button"
                onClick={() => { setLength(v); setLenI(String(v)); }}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-150 active:scale-[0.96] ${length === v ? "border-emerald-400 bg-emerald-50 text-emerald-700" : "border-gray-200 bg-gray-50 text-gray-500 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600"}`}>
                {v} ft
              </button>
            ))}
          </div>
        </div>

        {/* Width */}
        <div className={cardCls}>
          <div className="flex items-start justify-between">
            <div>
              <label htmlFor="cpc-width" className="block text-sm font-semibold text-gray-700">Width</label>
              <p className="mt-0.5 text-xs text-gray-400">Small patio ≈ 10–12 ft, large ≈ 16–20 ft</p>
            </div>
            <div className="relative">
              <input
                id="cpc-width" type="number" min={4} max={100} step={1}
                value={widI}
                onChange={(e) => { setWidI(e.target.value); const v = Math.max(1, Math.min(100, Number(e.target.value))); if (!isNaN(v)) setWidth(v); }}
                onBlur={() => setWidI(String(width))}
                className={inputCls}
              />
              <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs font-semibold text-gray-400">ft</span>
            </div>
          </div>
          <div className={sliderWrapCls}>
            <Slider min={4} max={40} step={1} value={[Math.min(width, 40)]}
              onValueChange={([v]) => { setWidth(v); setWidI(String(v)); }} className="h-3" />
            <div className="mt-2 flex justify-between text-xs text-gray-400">
              <span>4 ft</span><span>22 ft</span><span>40 ft</span>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {[10, 12, 16, 20, 24].map((v) => (
              <button key={v} type="button"
                onClick={() => { setWidth(v); setWidI(String(v)); }}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-150 active:scale-[0.96] ${width === v ? "border-emerald-400 bg-emerald-50 text-emerald-700" : "border-gray-200 bg-gray-50 text-gray-500 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600"}`}>
                {v} ft
              </button>
            ))}
          </div>
        </div>

        {/* Finish */}
        <div className={cardCls}>
          <p className="text-sm font-semibold text-gray-700">Finish type</p>
          <p className="mt-0.5 text-xs text-gray-400">Stamped concrete is popular for patios</p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {FINISH_OPTIONS.map((opt) => (
              <button key={opt.value} type="button" onClick={() => setFinish(opt.value)}
                className={`flex flex-col items-center rounded-xl border px-2 py-3 text-center transition-all duration-150 active:scale-[0.97] ${finish === opt.value ? "border-emerald-400 bg-emerald-50" : "border-gray-200 bg-gray-50 hover:border-emerald-200 hover:bg-emerald-50"}`}>
                <span className={`text-xs font-bold leading-snug ${finish === opt.value ? "text-emerald-800" : "text-gray-700"}`}>{opt.label}</span>
                <span className={`mt-0.5 text-[10px] ${finish === opt.value ? "text-emerald-600" : "text-gray-400"}`}>{opt.note}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Reinforcement */}
        <div className={cardCls}>
          <p className="text-sm font-semibold text-gray-700">Reinforcement</p>
          <p className="mt-0.5 text-xs text-gray-400">Wire mesh is standard for most patios</p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {REINF_OPTIONS.map((opt) => (
              <button key={opt.value} type="button" onClick={() => setReinf(opt.value)}
                className={`flex flex-col items-center rounded-xl border px-2 py-3 text-center transition-all duration-150 active:scale-[0.97] ${reinf === opt.value ? "border-emerald-400 bg-emerald-50" : "border-gray-200 bg-gray-50 hover:border-emerald-200 hover:bg-emerald-50"}`}>
                <span className={`text-xs font-bold leading-snug ${reinf === opt.value ? "text-emerald-800" : "text-gray-700"}`}>{opt.label}</span>
                <span className={`mt-0.5 text-[10px] ${reinf === opt.value ? "text-emerald-600" : "text-gray-400"}`}>{opt.note}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Old surface removal */}
        <div className={cardCls}>
          <p className="text-sm font-semibold text-gray-700">Existing surface removal</p>
          <p className="mt-0.5 text-xs text-gray-400">Include demolition cost if replacing an old patio</p>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {REMOVAL_OPTIONS.map((opt) => (
              <button key={opt.value} type="button" onClick={() => setRemoval(opt.value)}
                className={`flex flex-col items-center rounded-xl border px-2 py-3 text-center transition-all duration-150 active:scale-[0.97] ${removal === opt.value ? "border-orange-300 bg-orange-50" : "border-gray-200 bg-gray-50 hover:border-orange-200 hover:bg-orange-50"}`}>
                <span className={`text-xs font-bold leading-snug ${removal === opt.value ? "text-orange-800" : "text-gray-700"}`}>{opt.label}</span>
                <span className={`mt-0.5 text-[10px] ${removal === opt.value ? "text-orange-600" : "text-gray-400"}`}>{opt.note}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Advanced */}
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <button type="button" onClick={() => setShowAdv((v) => !v)}
            className="flex w-full items-center justify-between px-5 py-4 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            <span>Adjust thickness, labour &amp; concrete price</span>
            <svg className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${showAdv ? "rotate-180" : ""}`}
              viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {showAdv && (
            <div className="border-t border-gray-100 px-5 py-5 space-y-5">
              {[
                { id: "cpc-thick", label: "Slab thickness", sub: "Default: 4 in — 3.5 in is common for light patios", val: thickI, unit: "in",
                  setter: (s: string) => { setThickI(s); const v = Math.max(2, Math.min(12, Number(s))); if (!isNaN(v)) setThickVal(v); },
                  blur: () => { const v = Math.max(2, Math.min(12, Number(thickI))); if (isNaN(v) || thickI === "") { setThickVal(4); setThickI("4"); } else setThickI(String(v)); },
                  prefix: false },
                { id: "cpc-labor", label: "Base labour (per sqft)", sub: "Default: $5/sqft — finish type adds on top", val: laborI, unit: "",
                  setter: (s: string) => { setLaborI(s); const v = Math.max(0, Number(s)); if (!isNaN(v)) setLaborVal(v); },
                  blur: () => { const v = Math.max(0, Number(laborI)); if (isNaN(v) || laborI === "") { setLaborVal(5); setLaborI("5"); } else setLaborI(String(v)); },
                  prefix: true },
                { id: "cpc-price", label: "Concrete price (per yd³)", sub: "Default: $150/yd³", val: priceI, unit: "",
                  setter: (s: string) => { setPriceI(s); const v = Math.max(0, Number(s)); if (!isNaN(v)) setPriceVal(v); },
                  blur: () => { const v = Math.max(0, Number(priceI)); if (isNaN(v) || priceI === "") { setPriceVal(150); setPriceI("150"); } else setPriceI(String(v)); },
                  prefix: true },
              ].map((f) => (
                <div key={f.id} className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-700">{f.label}</p>
                    <p className="mt-0.5 text-xs text-gray-400">{f.sub}</p>
                  </div>
                  <div className="relative shrink-0">
                    {f.prefix && <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm font-bold text-gray-400">$</span>}
                    <input type="number" id={f.id} value={f.val}
                      onChange={(e) => f.setter(e.target.value)}
                      onBlur={f.blur}
                      className={`w-28 rounded-xl border border-gray-200 bg-gray-50 py-2 text-sm font-bold text-gray-900 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100 ${f.prefix ? "pl-7 pr-3" : "pl-3 pr-8 text-right"}`}
                    />
                    {!f.prefix && f.unit && <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs font-semibold text-gray-400">{f.unit}</span>}
                  </div>
                </div>
              ))}
              {/* Waste */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-gray-700">Waste factor</p>
                  <p className="mt-0.5 text-xs text-gray-400">Default: 10%</p>
                </div>
                <div className="relative shrink-0">
                  <input type="number" min={0} max={50} step={1} value={wasteI}
                    onChange={(e) => { setWasteI(e.target.value); const v = Math.max(0, Math.min(50, Number(e.target.value))); if (!isNaN(v)) setWastePct(v); }}
                    onBlur={() => { const v = Math.max(0, Math.min(50, Number(wasteI))); if (isNaN(v) || wasteI === "") { setWastePct(10); setWasteI("10"); } else setWasteI(String(v)); }}
                    className="w-28 rounded-xl border border-gray-200 bg-gray-50 py-2 pl-3 pr-8 text-right text-sm font-bold text-gray-900 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs font-semibold text-gray-400">%</span>
                </div>
              </div>
              {/* Reset */}
              <button type="button"
                onClick={() => { setThickVal(4); setThickI("4"); setLaborVal(5); setLaborI("5"); setPriceVal(150); setPriceI("150"); setWastePct(10); setWasteI("10"); }}
                className="text-xs font-semibold text-gray-400 underline underline-offset-2 hover:text-emerald-600 transition-colors">
                Reset to defaults
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── RESULTS ────────────────────────────────────────────── */}
      <div className="flex flex-col gap-5">
        {/* Total */}
        <div className={`${cardCls} ${flash ? "ring-2 ring-emerald-200" : "ring-2 ring-transparent"}`}>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Estimated total cost</p>
          <p className="mt-2 text-4xl font-extrabold text-gray-900">{fmt(totalCost)}</p>
          <p className="mt-1 text-sm text-gray-400">{fmt(Math.round(perSqft * 100) / 100)} per sqft installed</p>

          {/* Donut chart */}
          <div className="mt-5 flex justify-center">
            <div className="relative">
              <PieChart width={180} height={180}>
                <Pie data={chartData} cx={85} cy={85} innerRadius={55} outerRadius={80}
                  dataKey="value" strokeWidth={0} paddingAngle={2}>
                  {chartData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <Tooltip formatter={(v: number) => fmt(v)} />
              </PieChart>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-extrabold text-gray-900">{pctMaterial}%</span>
                <span className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">materials</span>
              </div>
            </div>
          </div>

          {/* Cost rows */}
          <div className="mt-4 space-y-2">
            {[
              { label: "Concrete materials", value: fmt(materialCost), dot: "bg-emerald-500" },
              { label: "Labour & finishing",  value: fmt(laborCost),   dot: "bg-blue-500" },
              ...(demolCost > 0 ? [{ label: "Surface removal", value: fmt(demolCost), dot: "bg-amber-500" }] : []),
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-gray-500">
                  <span className={`h-2.5 w-2.5 rounded-full ${row.dot}`} />
                  {row.label}
                </span>
                <span className="font-bold text-gray-900">{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats grid */}
        <div className={cardCls}>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Measurements</p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            {[
              { label: "Patio area",      value: sqft.toLocaleString("en-US"),                unit: "sq ft" },
              { label: "Concrete needed", value: cubicYdsW.toFixed(2),                         unit: "yd³ (with waste)" },
              { label: "Slab thickness",  value: thickVal.toString(),                           unit: "inches" },
              { label: "Per sq ft",       value: "$" + (Math.round(perSqft * 100) / 100).toFixed(2), unit: "installed" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-gray-50 px-4 py-3">
                <p className="text-xs text-gray-400">{s.label}</p>
                <p className="mt-0.5 text-lg font-extrabold text-gray-900">{s.value}</p>
                <p className="text-[10px] text-gray-400">{s.unit}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Formula card */}
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">How this is calculated</p>
          <ul className="mt-3 space-y-2 text-xs text-gray-500">
            <li><span className="font-semibold text-gray-700">Area:</span> {length} &times; {width} = {sqft} sqft</li>
            <li><span className="font-semibold text-gray-700">Concrete:</span> {sqft} &times; ({thickVal}/12) &divide; 27 = {cubicYds.toFixed(2)} yd³</li>
            <li><span className="font-semibold text-gray-700">With {wastePct}% waste:</span> {cubicYdsW.toFixed(2)} yd³ &times; {fmt(priceVal)}/yd³ = {fmt(materialCost)}</li>
            <li><span className="font-semibold text-gray-700">Labour:</span> {sqft} sqft &times; ${laborRate.toFixed(2)}/sqft = {fmt(laborCost)}</li>
            {demolCost > 0 && <li><span className="font-semibold text-gray-700">Removal:</span> {sqft} sqft &times; ${removalCost}/sqft = {fmt(demolCost)}</li>}
            <li className="border-t border-gray-200 pt-2 font-semibold text-gray-700">Total: {fmt(totalCost)}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
