import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Construction Calculators | Worthulator",
  description:
    "Free construction calculators for concrete, materials, project costing and more. Estimate quantities, costs, and planning figures instantly.",
  alternates: { canonical: "https://worthulator.com/construction-calculators" },
  robots: { index: true, follow: true },
};

const liveTools = [
  {
    name: "Concrete Calculator",
    href: "/construction-calculators/concrete-calculator",
    description: "Estimate how much concrete you need for slabs, footings, and pours.",
    live: true,
  },
  {
    name: "Concrete Slab Calculator",
    href: "/construction-calculators/concrete/concrete-slab-calculator",
    description: "Calculate the volume, bag count, and installed cost of concrete for any slab project.",
    live: true,
  },
];

const upcomingTools = [
  {
    name: "Brick Calculator",
    href: "/construction-calculators/brick-calculator",
    description: "Work out how many bricks you need for a wall or building project.",
  },
  {
    name: "Roofing Cost Calculator",
    href: "/construction-calculators/roofing-cost-calculator",
    description: "Estimate roofing material quantities and project costs.",
  },
  {
    name: "Flooring Calculator",
    href: "/construction-calculators/flooring-calculator",
    description: "Calculate how much flooring material you need for any room.",
  },
  {
    name: "Paint Coverage Calculator",
    href: "/construction-calculators/paint-calculator",
    description: "Find out how much paint you need to cover walls and ceilings.",
  },
];

export default function ConstructionCalculatorsPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-950">Construction Calculators</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-500">
          Free calculators for builders, tradespeople, and DIY enthusiasts. Estimate
          concrete volumes, material quantities, project costs, and more — without
          the guesswork.
        </p>
      </div>

      {liveTools.length > 0 && (
        <div className="mb-10">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-400">
            Available now
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {liveTools.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="rounded-2xl border border-slate-200 bg-white p-5 text-sm shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <p className="font-semibold text-slate-700">{tool.name}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                  {tool.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-slate-400">
          Coming soon
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {upcomingTools.map((tool) => (
            <div
              key={tool.href}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="text-sm font-semibold text-slate-700">{tool.name}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-slate-400">
                {tool.description}
              </p>
              <span className="mt-3 inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                Coming soon
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12">
        <Link
          href="/tools"
          className="text-sm text-slate-400 transition-colors hover:text-slate-700"
        >
          ? Browse all calculators
        </Link>
      </div>
    </div>
  );
}

