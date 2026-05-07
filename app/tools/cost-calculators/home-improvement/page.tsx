import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Home Improvement Cost Calculators 2026 | Worthulator",
  description:
    "Accurate home improvement cost calculators for roofing, concrete, and renovation projects. Get real 2026 estimates based on size, materials, and location.",
  alternates: {
    canonical: "https://worthulator.com/tools/cost-calculators/home-improvement",
  },
  robots: { index: true, follow: true },
};

const TOOLS = [
  {
    name: "Roof Replacement Cost Calculator",
    href: "/tools/cost-calculators/home-improvement/roof-replacement-cost",
    description: "Estimate full roof replacement cost by size, material, condition, and location. Covers asphalt, metal, tile, and flat roofs.",
    stat: "$5,000–$15,000",
    statLabel: "typical US roof replacement",
    emoji: "🏠",
  },
  {
    name: "Concrete Slab Cost Calculator",
    href: "/construction-calculators/concrete/concrete-slab-calculator",
    description: "Calculate concrete slab costs for driveways, patios, garage floors, and foundations — in $ per sq ft.",
    stat: "$4–$15",
    statLabel: "per sq ft installed",
    emoji: "🧱",
  },
  {
    name: "Concrete Slab Cost Calculator UK",
    href: "/tools/cost-calculators/home-improvement/concrete-slab-calculator-uk",
    description: "UK concrete slab cost estimates in £/m² with 2026 UK labour rates. Covers patios, driveways, and foundations.",
    stat: "£60–£120",
    statLabel: "per m² installed",
    emoji: "🇬🇧",
  },
];

export default function HomeImprovementPage() {
  return (
    <main className="min-h-screen bg-white">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="bg-gray-950 px-5 py-16 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-400">
            Cost Calculators · Home Improvement
          </p>
          <h1 className="mt-4 text-[clamp(2rem,5vw,3.5rem)] font-bold leading-tight tracking-tight text-white">
            Home Improvement Cost Calculators
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-gray-400">
            Get accurate cost estimates for roofing, concrete, and renovation projects — updated
            with real 2026 contractor prices.
          </p>
        </div>
      </section>

      {/* ── Tools grid ───────────────────────────────────────────── */}
      <section className="px-5 py-16 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-orange-200 hover:shadow-md"
              >
                <span className="text-3xl">{tool.emoji}</span>
                <p className="mt-4 text-base font-bold text-gray-900 group-hover:text-orange-600">
                  {tool.name}
                </p>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-500">
                  {tool.description}
                </p>
                <div className="mt-4 border-t border-gray-100 pt-4">
                  <p className="text-xl font-bold text-orange-500">{tool.stat}</p>
                  <p className="text-xs text-gray-400">{tool.statLabel}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why use a cost calculator ─────────────────────────────── */}
      <section className="bg-gray-50 px-5 py-12 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-xl font-bold text-gray-900">Why use a cost calculator?</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {[
              { icon: "📋", title: "Budget accurately", desc: "Avoid surprises by knowing the realistic cost range before getting quotes." },
              { icon: "🤝", title: "Negotiate better", desc: "Know what fair market rates look like so you can spot overpriced quotes." },
              { icon: "📅", title: "Plan your timeline", desc: "Understand which projects to prioritise based on cost vs impact." },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-gray-200 bg-white p-5">
                <span className="text-2xl">{item.icon}</span>
                <p className="mt-3 text-sm font-bold text-gray-900">{item.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-gray-500">
            View all calculators:{" "}
            <Link href="/tools/cost-calculators" className="font-semibold text-orange-600 underline underline-offset-2">
              Cost Calculators hub
            </Link>
            {" · "}
            <Link href="/tools" className="font-semibold text-orange-600 underline underline-offset-2">
              All Tools
            </Link>
          </p>
        </div>
      </section>

    </main>
  );
}
