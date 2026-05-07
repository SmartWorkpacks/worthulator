/**
 * SimpleCalculatorTemplate
 *
 * COPY THIS FILE to start a new simple (single-screen) calculator.
 * Steps:
 *   1. Rename the file and the component export
 *   2. Replace placeholder state/logic with your calculation
 *   3. Fill in the page.tsx with your metadata + JSON-LD
 *
 * Shell used: SimpleCalculatorShell
 * Calculator type: "simple"
 */

"use client";

import { useState } from "react";
import SimpleCalculatorShell from "@/components/calculators/SimpleCalculatorShell";
import RelatedTools from "@/components/RelatedTools";

// --- Replace with your real JSON-LD (move to page.tsx in production) ---------

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "My Calculator",
  url: "https://worthulator.com/tools/my-calculator",
};

// --- Hero preview card (dark, right column, desktop only) --------------------

const HERO_CARD = (
  <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-gray-950 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
    <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-emerald-500/15 blur-3xl" />
    <p className="relative text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
      Example · replace with real preview
    </p>
    <p className="relative mt-3 text-5xl font-bold tracking-[-0.04em] text-emerald-400 [text-shadow:0_0_20px_rgba(52,211,153,0.28)]">
      $0
    </p>
    <p className="relative mt-1 text-sm text-gray-500">result label here</p>
  </div>
);

// --- Stat chips (3-column row above the calculator) --------------------------

const STAT_CHIPS = (
  <>
    {[
      { stat: "stat 1", color: "text-emerald-600", label: "description of stat 1" },
      { stat: "stat 2", color: "text-blue-500",    label: "description of stat 2" },
      { stat: "stat 3", color: "text-orange-500",  label: "description of stat 3" },
    ].map((item) => (
      <div
        key={item.stat}
        className="group rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-gray-300 hover:shadow-xl"
      >
        <p className={`text-3xl font-bold tracking-tight transition-transform duration-200 group-hover:scale-105 ${item.color}`}>
          {item.stat}
        </p>
        <p className="mt-1.5 text-xs leading-5 text-gray-500">{item.label}</p>
      </div>
    ))}
  </>
);

// --- Calculator component -----------------------------------------------------

function MyCalculatorInputs() {
  // Replace with your real state
  const [value, setValue] = useState<number>(0);
  const result = value * 2; // Replace with real formula

  return (
    <div className="grid gap-8 lg:grid-cols-[2fr_3fr] lg:gap-10">

      {/* INPUTS */}
      <div className="flex flex-col gap-6 lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-lg">
          <label htmlFor="my-input" className="block text-sm font-semibold text-gray-700">
            Input label
          </label>
          <p className="mt-0.5 text-xs text-gray-400">Helper text for this input</p>
          <input
            id="my-input"
            type="number"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            className="mt-4 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-bold text-gray-900 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          />
        </div>
      </div>

      {/* RESULT */}
      <div className="flex flex-col gap-6">
        <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-gray-950 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
          <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl" />
          <p className="relative text-xs font-semibold uppercase tracking-[0.28em] text-gray-400">
            Result label
          </p>
          <p className="relative mt-3 text-[clamp(3.5rem,8vw,5.5rem)] font-bold leading-none tracking-[-0.04em] text-emerald-400 [text-shadow:0_0_20px_rgba(52,211,153,0.28)]">
            {result.toLocaleString()}
          </p>
        </div>
      </div>

    </div>
  );
}

// --- Page component (or inline in page.tsx) -----------------------------------

export default function MyCalculatorPage() {
  return (
    <SimpleCalculatorShell
      jsonLd={JSON_LD}
      title="My Calculator"
      subtitle="a short tagline here."
      description="One or two sentences explaining what this calculator does and why someone would use it."
      heroCard={HERO_CARD}
      statChips={STAT_CHIPS}
      calculator={<MyCalculatorInputs />}
      insightText={
        <>
          A short insight sentence with a{" "}
          <span className="font-semibold text-gray-800">highlighted figure</span>{" "}
          to reinforce the result.
        </>
      }
    >

      {/* EXPLAINER -- replace with real content */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold tracking-tight text-gray-950">How it works</h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-gray-500">
            Explain the formula or methodology here.
          </p>
        </div>
      </section>

      {/* DISCLAIMER */}
      <section className="border-t border-gray-100 bg-white px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Important</p>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Results are estimates only. Not financial advice.
            </p>
          </div>
        </div>
      </section>

      {/* RELATED TOOLS */}
      <RelatedTools currentTool="my-calculator" />

    </SimpleCalculatorShell>
  );
}
