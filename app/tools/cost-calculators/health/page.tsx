import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Health & Dental Cost Calculators 2026 | Worthulator",
  description:
    "Free health and dental cost calculators. Estimate dental implant, Invisalign, and veneer costs — updated with real 2026 prices.",
  alternates: {
    canonical: "https://worthulator.com/tools/cost-calculators/health",
  },
  robots: { index: true, follow: true },
};

const TOOLS = [
  {
    name: "Dental Implant Cost Calculator",
    href: "/tools/cost-calculators/health/dental-implant-cost-calculator",
    description: "Estimate dental implant costs for single tooth, full mouth, and All-on-4 — adjusted for quality, clinic, and country.",
    stat: "$2,200–$5,000",
    statLabel: "typical single-tooth implant cost (US)",
    emoji: "🦷",
    live: true,
  },
  {
    name: "Invisalign Cost Calculator",
    href: null,
    description: "Estimate Invisalign treatment costs by case complexity. Coming soon.",
    stat: "$3,000–$8,000",
    statLabel: "typical US Invisalign cost",
    emoji: "😁",
    live: false,
  },
  {
    name: "Veneers Cost Calculator",
    href: null,
    description: "Estimate porcelain or composite veneer costs per tooth. Coming soon.",
    stat: "$900–$2,500",
    statLabel: "per tooth (porcelain)",
    emoji: "✨",
    live: false,
  },
];

export default function HealthCostCalculatorsPage() {
  return (
    <main className="min-h-screen bg-white">

      <section className="bg-gray-950 px-5 py-16 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-400">
            Cost Calculators · Health &amp; Dental
          </p>
          <h1 className="mt-4 text-[clamp(2rem,5vw,3.5rem)] font-bold leading-tight tracking-tight text-white">
            Health &amp; Dental Cost Calculators
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-gray-400">
            Find out what dental and health procedures really cost — with 2026 price estimates
            for the US and UK.
          </p>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((tool) =>
              tool.live && tool.href ? (
                <Link
                  key={tool.name}
                  href={tool.href}
                  className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-emerald-200 hover:shadow-md"
                >
                  <span className="text-3xl">{tool.emoji}</span>
                  <p className="mt-4 text-base font-bold text-gray-900 group-hover:text-emerald-600">{tool.name}</p>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-500">{tool.description}</p>
                  <div className="mt-4 border-t border-gray-100 pt-4">
                    <p className="text-xl font-bold text-emerald-500">{tool.stat}</p>
                    <p className="text-xs text-gray-400">{tool.statLabel}</p>
                  </div>
                </Link>
              ) : (
                <div key={tool.name} className="flex flex-col rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-6 opacity-60">
                  <span className="text-3xl">{tool.emoji}</span>
                  <p className="mt-4 text-base font-bold text-gray-500">{tool.name}</p>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-400">{tool.description}</p>
                  <div className="mt-4 border-t border-gray-100 pt-4">
                    <p className="text-xl font-bold text-gray-400">{tool.stat}</p>
                    <p className="text-xs text-gray-400">{tool.statLabel}</p>
                  </div>
                </div>
              )
            )}
          </div>
          <p className="mt-8 text-sm text-gray-500">
            <Link href="/tools/cost-calculators" className="font-semibold text-emerald-600 underline underline-offset-2">
              ← All cost calculators
            </Link>
          </p>
        </div>
      </section>

    </main>
  );
}
