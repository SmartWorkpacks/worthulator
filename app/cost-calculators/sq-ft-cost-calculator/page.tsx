import type { Metadata } from "next";
import Link from "next/link";
import { sqftConfigs, sqftSlugs } from "@/lib/calculators/sqftConfigs";
import SqFtCalculator from "@/components/calculators/SqFtCalculator";

export const metadata: Metadata = {
  title: "Cost Per Square Foot Calculator – Estimate Any Home Improvement Project",
  description:
    "Free cost per square foot calculators for roofing, flooring, painting, concrete, tiling, drywall, and carpet. Get instant estimates for any home improvement project.",
  alternates: {
    canonical: "https://www.worthulator.com/cost-calculators/sq-ft-cost-calculator",
  },
  robots: { index: true, follow: true },
};

const DEFAULT_SLUG = sqftSlugs[0];
const defaultConfig = sqftConfigs[DEFAULT_SLUG];

export default function SqFtHubPage() {
  return (
    <main className="bg-white text-gray-900">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-gray-100 bg-white px-5 py-14 sm:px-8 sm:py-20 lg:px-16">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-50/80 blur-[80px]" />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-400">
            Cost Estimators &middot; All Categories
          </p>
          <h1 className="mt-4 text-[clamp(2rem,5vw,3.25rem)] font-bold leading-[1.05] tracking-[-0.03em] text-gray-950">
            Cost Per Sq Ft Calculator
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-gray-500">
            Instant cost estimates per square foot for any home improvement project.
            Select your project type from the dropdown below or browse all calculators
            in the grid.
          </p>
        </div>
      </section>

      {/* ── CALCULATOR ───────────────────────────────────────────────── */}
      <section className="bg-white px-5 py-12 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-2xl">
          <SqFtCalculator config={defaultConfig} currentSlug={DEFAULT_SLUG} />
          <p className="mt-3 text-xs leading-5 text-gray-400">
            Estimates are based on national averages and are for planning purposes only.
            Actual costs vary by location, contractor, and material choice.
          </p>
        </div>
      </section>

      {/* ── ALL CALCULATORS GRID ─────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-12 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-xl font-bold tracking-tight text-gray-900">
            All Cost Per Sq Ft Calculators
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Each calculator is pre-loaded with national average rates for that project
            type. Select one to see the dedicated page with in-depth guidance.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {sqftSlugs.map((slug) => {
              const c = sqftConfigs[slug];
              return (
                <Link
                  key={slug}
                  href={`/cost-calculators/${slug}`}
                  className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                    {c.category}
                  </p>
                  <p className="mt-1.5 text-sm font-bold text-gray-900">{c.title}</p>
                  <p className="mt-1.5 flex-1 text-xs leading-relaxed text-gray-500">
                    {c.introText}
                  </p>
                  <span className="mt-3 text-xs font-semibold text-emerald-700">
                    ${c.defaultCostLow}–${c.defaultCostHigh}/{c.unitLabel} &rarr; Calculate
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
