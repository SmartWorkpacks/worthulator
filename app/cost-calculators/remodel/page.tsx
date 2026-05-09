import type { Metadata } from "next";
import Link from "next/link";
import { remodelConfigs, remodelConfigMap } from "@/lib/calculators/remodelConfigs";
import RemodelCalculator from "@/components/calculators/RemodelCalculator";

export const metadata: Metadata = {
  title: "Remodel Cost Calculator – Estimate Any Home Renovation Cost Instantly",
  description:
    "Free remodel cost calculators for bathrooms, kitchens, basements, and more. Select size, quality, and location to get a realistic cost estimate for your renovation project.",
  alternates: {
    canonical: "https://worthulator.com/cost-calculators/remodel",
  },
  robots: { index: true, follow: true },
};

const DEFAULT = remodelConfigs[0];

export default function RemodelHubPage() {
  return (
    <main className="bg-white text-gray-900">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-gray-100 bg-white px-5 py-14 sm:px-8 sm:py-20 lg:px-16">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-50/80 blur-[80px]" />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-400">
            Cost Estimators &middot; Remodel
          </p>
          <h1 className="mt-4 text-[clamp(2rem,5vw,3.25rem)] font-bold leading-[1.05] tracking-[-0.03em] text-gray-950">
            Remodel Cost Calculator
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-gray-500">
            Instant cost estimates for any home renovation project. Select project type,
            size, finish quality, and location to get a realistic low-to-high range.
          </p>
        </div>
      </section>

      {/* ── DEFAULT CALCULATOR ───────────────────────────────────────── */}
      <section className="bg-white px-5 py-12 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-2xl">
          <RemodelCalculator config={DEFAULT} currentSlug={DEFAULT.slug} />
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
            All Remodel Cost Calculators
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Each calculator uses size, quality, and location multipliers to give you a
            realistic cost range for your specific project.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {remodelConfigs.map((c) => (
              <Link
                key={c.slug}
                href={`/cost-calculators/remodel/${c.slug}`}
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
                  From {c.baseCostLow.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })} &rarr; Estimate now
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── RELATED ──────────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 px-5 py-10 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Related Tools
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/cost-calculators/sq-ft-cost-calculator"
              className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-semibold text-gray-600 shadow-sm transition hover:border-emerald-200 hover:text-emerald-700"
            >
              Cost Per Sq Ft Calculators &rarr;
            </Link>
            <Link
              href="/construction-calculators"
              className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-semibold text-gray-600 shadow-sm transition hover:border-emerald-200 hover:text-emerald-700"
            >
              Construction Calculators &rarr;
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
