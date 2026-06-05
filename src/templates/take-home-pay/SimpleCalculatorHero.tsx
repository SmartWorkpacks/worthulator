/**
 * ─── SimpleCalculatorHero ────────────────────────────────────────────────────
 * Shared hero section for all simple Worthulator calculators.
 *
 * Renders the gradient+grid background wrapper, eyebrow badge, H1, description,
 * and feature chips. The calculator itself is passed as `children` so the
 * shared grid background runs continuously behind both hero and calculator.
 *
 * Usage (in page.tsx):
 *   import SimpleCalculatorHero from "@/src/templates/take-home-pay/SimpleCalculatorHero";
 *   import YourCalculatorLoader from "./YourCalculatorLoader";
 *
 *   <SimpleCalculatorHero
 *     eyebrowIcon="$"
 *     eyebrowText="Investing · Compound Growth"
 *     title="Future Value Calculator"
 *     description="See exactly what your money grows to — enter your deposit, monthly contributions, and expected return rate."
 *     chips={["Monthly compounding", "Interest vs contributions split", "What-if scenarios"]}
 *   >
 *     <YourCalculatorLoader />
 *   </SimpleCalculatorHero>
 */

import type { ReactNode } from "react";

interface SimpleCalculatorHeroProps {
  /** Small icon character in the eyebrow badge — e.g. "$", "%", "↑" */
  eyebrowIcon: string;
  /** Category label — e.g. "Investing · Compound Growth" */
  eyebrowText: string;
  /** Page H1 — tool name only */
  title: string;
  /** One-sentence subtitle describing the outcome */
  description: string;
  /** 2–3 feature/benefit chips */
  chips: string[];
  /** The calculator loader component */
  children?: ReactNode;
}

export default function SimpleCalculatorHero({
  eyebrowIcon,
  eyebrowText,
  title,
  description,
  chips,
  children,
}: SimpleCalculatorHeroProps) {
  // overflow-clip (not overflow-hidden) clips the ambient glow/grid without
  // creating a scroll container, so the calculator's sticky input column still
  // pins on scroll.
  return (
    <div className="relative overflow-clip bg-linear-to-b from-[#f7faf8] to-white">
      {/* Ambient radial glow */}
      <div className="pointer-events-none absolute -top-10 left-1/4 h-64 w-64 rounded-full bg-emerald-200/25 blur-[72px]" />
      <div className="pointer-events-none absolute top-0 right-1/4 h-48 w-48 rounded-full bg-cyan-100/20 blur-[56px]" />
      {/* Subtle grid — runs through hero and calculator */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.028]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* HERO */}
      <section className="relative px-5 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl pt-7 pb-6 sm:pt-9 sm:pb-7">
          {/* Eyebrow */}
          <div className="mb-2.5 flex items-center gap-2">
            <span className="inline-flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded bg-emerald-500/10 text-[9px] font-bold text-emerald-600">
              {eyebrowIcon}
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-400">
              {eyebrowText}
            </span>
          </div>

          {/* H1 */}
          <h1 className="text-[2.25rem] font-bold leading-[1.1] tracking-[-0.03em] text-gray-950 sm:text-[3rem]">
            {title}
          </h1>

          {/* Description */}
          <p className="mt-3 max-w-2xl text-[15px] leading-[1.7] text-gray-500 sm:text-base">
            {description}
          </p>

          {/* Feature chips */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {chips.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700"
              >
                <svg className="h-2.5 w-2.5 shrink-0 text-emerald-500" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5.5L4 7.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CALCULATOR */}
      <section className="relative px-5 pt-5 pb-12 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          {children}
        </div>
      </section>
    </div>
  );
}
