import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Concrete Calculators – Volume, Bags, Blocks & Cost | Worthulator",
  description:
    "Free concrete calculators for every project. Calculate cubic yards, bag count, block quantities, and installed slab cost — for US projects.",
  alternates: {
    canonical: "https://worthulator.com/construction-calculators/concrete",
  },
  robots: { index: true, follow: true },
};

const tools = [
  {
    name: "Concrete Calculator",
    href: "/construction-calculators/concrete-calculator",
    description: "Calculate cubic yards for slabs, driveways, footings, and columns.",
    badge: "Hub",
  },
  {
    name: "Concrete Slab Calculator",
    href: "/construction-calculators/concrete/concrete-slab-calculator",
    description: "Volume, bag count, and full installed cost estimate for any slab.",
    badge: "Popular",
  },
  {
    name: "Concrete Bag Calculator",
    href: "/construction-calculators/concrete/concrete-bag-calculator",
    description: "Exact 40/60/80 lb bag count for your pour, with waste factor.",
    badge: null,
  },
  {
    name: "Concrete Block Calculator",
    href: "/construction-calculators/concrete/concrete-block-calculator",
    description: "How many 8×8×16 CMU blocks you need for any wall, with mortar.",
    badge: null,
  },
];

const ukTools = [
  {
    name: "Concrete Calculator (UK)",
    href: "/construction-calculators/concrete-calculator-uk",
    description: "Cubic metres for slabs, drives, and footings — UK measurements.",
  },
  {
    name: "Concrete Bag Calculator (UK)",
    href: "/construction-calculators/concrete/concrete-bag-calculator-uk",
    description: "25 kg bag count for any pour, UK units.",
  },
  {
    name: "Concrete Block Calculator (UK)",
    href: "/construction-calculators/concrete/concrete-block-calculator-uk",
    description: "440×215×100 mm block count for walls.",
  },
];

export default function ConcreteCalculatorsPage() {
  return (
    <main className="min-h-screen bg-white">
      <section className="border-b border-gray-100 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-400">
            Construction Calculators · Concrete
          </p>
          <h1 className="mt-4 text-[clamp(2rem,5vw,3rem)] font-bold leading-tight tracking-tight text-gray-950">
            Concrete Calculators
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-gray-500">
            Every concrete calculation you need — volume, bags, blocks, and installed cost
            — for slabs, driveways, patios, and foundations.
          </p>
        </div>
      </section>

      <section className="px-5 py-12 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-gray-400">US Calculators</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {tools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="text-base font-bold text-gray-900 group-hover:text-emerald-700">
                    {tool.name}
                  </p>
                  {tool.badge && (
                    <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                      {tool.badge}
                    </span>
                  )}
                </div>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-500">
                  {tool.description}
                </p>
                <span className="mt-4 text-xs font-semibold text-emerald-700">
                  Open calculator →
                </span>
              </Link>
            ))}
          </div>

          <h2 className="mt-12 text-sm font-semibold uppercase tracking-widest text-gray-400">UK Calculators</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            {ukTools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
              >
                <p className="text-sm font-bold text-gray-900 group-hover:text-emerald-700">
                  {tool.name}
                </p>
                <p className="mt-1.5 flex-1 text-xs leading-relaxed text-gray-500">
                  {tool.description}
                </p>
                <span className="mt-4 text-xs font-semibold text-emerald-700">Open →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
