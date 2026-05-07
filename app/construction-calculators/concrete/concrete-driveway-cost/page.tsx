import type { Metadata } from "next";
import Link from "next/link";
import SimpleCalculatorShell from "@/components/calculators/SimpleCalculatorShell";
import ConcreteDrivewayCostLoader from "./ConcreteDrivewayCostLoader";

export const metadata: Metadata = {
  title: "Concrete Driveway Cost Calculator – Work Out Your Total Price Instantly",
  description:
    "Work out the full cost of a concrete driveway in seconds. Enter your dimensions, finish type, and reinforcement to get an installed cost estimate including materials, labour, and demolition.",
  keywords: [
    "concrete driveway cost",
    "how much does a concrete driveway cost",
    "concrete driveway cost calculator",
    "concrete driveway cost per square foot",
    "cost to pour concrete driveway",
    "concrete driveway price 2026",
    "replace concrete driveway cost",
    "stamped concrete driveway cost",
  ],
  alternates: {
    canonical: "https://worthulator.com/construction-calculators/concrete/concrete-driveway-cost",
  },
  robots: { index: true, follow: true },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Concrete Driveway Cost Calculator",
    description:
      "Estimate the full installed cost of a concrete driveway — materials, labour, finish, reinforcement, and demolition.",
    url: "https://worthulator.com/construction-calculators/concrete/concrete-driveway-cost",
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How much does a concrete driveway cost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A concrete driveway costs $4–$10 per square foot installed for a standard broom finish, or $3,000–$7,500 for a typical two-car driveway (400 sqft). Stamped concrete adds $8–$15 per sqft. Replacing an existing asphalt or concrete driveway adds $2–$4 per sqft in demolition costs.",
        },
      },
      {
        "@type": "Question",
        name: "How long does a concrete driveway last?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A properly installed concrete driveway lasts 30–50 years with basic maintenance — sealing every 3–5 years and filling cracks promptly. Asphalt driveways last 15–20 years by comparison.",
        },
      },
      {
        "@type": "Question",
        name: "How thick should a concrete driveway be?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Standard residential driveways should be at least 4 inches thick. For heavier vehicles — RVs, trucks, or trailers — 6 inches is recommended. Thicker slabs use more concrete but significantly extend driveway life.",
        },
      },
      {
        "@type": "Question",
        name: "Is concrete more expensive than asphalt for a driveway?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, concrete costs more upfront — roughly $4–$10 per sqft vs $3–$6 for asphalt. However, concrete lasts 30–50 years vs 15–20 for asphalt, and requires less maintenance. Over a 30-year period, concrete is often cheaper overall.",
        },
      },
      {
        "@type": "Question",
        name: "How much does it cost to remove an old concrete driveway?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Removing an old concrete driveway typically costs $2–$6 per square foot, or $1,000–$3,500 for an average driveway. Asphalt removal is slightly cheaper at $1–$3 per sqft. The demolition cost is separate from the new pour.",
        },
      },
      {
        "@type": "Question",
        name: "Does a concrete driveway add value to my home?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes — a new concrete driveway typically adds 5–10% of its installation cost to home resale value, and improves curb appeal. Stamped or decorative concrete can have a higher perceived value to buyers.",
        },
      },
    ],
  },
];

const heroCard = (
  <div className="rounded-2xl border border-gray-700 bg-gray-800/60 p-6">
    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
      Example — 20 &times; 20 ft double driveway at 4 in
    </p>
    <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
      <div>
        <p className="text-2xl font-bold text-white">400</p>
        <p className="mt-0.5 text-xs text-gray-400">sq ft</p>
      </div>
      <div>
        <p className="text-2xl font-bold text-white">4.94</p>
        <p className="mt-0.5 text-xs text-gray-400">cubic yards</p>
      </div>
      <div>
        <p className="text-2xl font-bold text-white">$6.50</p>
        <p className="mt-0.5 text-xs text-gray-400">per sq ft</p>
      </div>
      <div>
        <p className="text-2xl font-bold text-emerald-400">$2,600</p>
        <p className="mt-0.5 text-xs text-gray-400">est. total</p>
      </div>
    </div>
  </div>
);

export default function ConcreteDrivewayCostPage() {
  return (
    <SimpleCalculatorShell
      jsonLd={jsonLd}
      category="Construction · Concrete"
      title="Concrete Driveway Cost Calculator"
      subtitle="Work Out Your Total Price Instantly"
      description={
        <>
          Enter your driveway dimensions, finish type, and reinforcement to get a full
          installed cost estimate — concrete, labour, and optional demolition all included.
          <span className="mt-2 block text-sm text-gray-400">
            For planning purposes only. Always get at least two contractor quotes before committing.
          </span>
        </>
      }
      heroCard={heroCard}
      calculator={<ConcreteDrivewayCostLoader />}
      insightText={
        <>
          A standard <strong>20 &times; 20 ft two-car driveway at 4 inches</strong> costs roughly{" "}
          <strong>$2,400&ndash;$4,000</strong> installed with a broom finish and wire mesh.
          Stamped concrete or replacing an existing driveway can push that to $6,000&ndash;$12,000.
        </>
      }
    >

      {/* ── HOW MUCH DOES A CONCRETE DRIVEWAY COST? ───────────── */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-12 md:py-16 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">How much does a concrete driveway cost?</h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">
            A concrete driveway costs <strong>$4–$10 per square foot installed</strong> for
            a standard broom finish, depending on thickness, reinforcement, and local labour
            rates. A typical two-car driveway (400 sqft) runs{" "}
            <strong>$1,600–$4,000</strong>. Decorative finishes like stamped concrete add
            significantly to that figure.
          </p>

          <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Driveway size</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Broom finish</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Stamped concrete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { size: "10×20 ft (200 sqft) — single",   broom: "$800–$2,000",    stamp: "$3,400–$5,000" },
                  { size: "12×24 ft (288 sqft) — single",   broom: "$1,150–$2,880",  stamp: "$4,900–$7,200" },
                  { size: "20×20 ft (400 sqft) — double",   broom: "$1,600–$4,000",  stamp: "$6,800–$10,000" },
                  { size: "24×24 ft (576 sqft) — double",   broom: "$2,300–$5,760",  stamp: "$9,800–$14,400" },
                  { size: "20×40 ft (800 sqft) — large",    broom: "$3,200–$8,000",  stamp: "$13,600–$20,000" },
                ].map((row) => (
                  <tr key={row.size} className="bg-white">
                    <td className="px-5 py-3 font-medium text-gray-800">{row.size}</td>
                    <td className="px-5 py-3 text-gray-600">{row.broom}</td>
                    <td className="px-5 py-3 text-gray-600">{row.stamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-gray-400">
            Approximate 2026 US national averages at 4 inches thick. Excludes demolition of existing surface.
          </p>
        </div>
      </section>

      {/* ── WHAT AFFECTS COST? ────────────────────────────────── */}
      <section className="border-t border-gray-100 px-5 py-12 md:py-16 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">What affects concrete driveway cost?</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              { icon: "📐", title: "Size and thickness",  desc: "The two biggest cost drivers. Going from 4 to 6 inches thick adds 50% more concrete. A larger driveway lowers the per-sqft labour rate but raises the total." },
              { icon: "🎨", title: "Finish type",         desc: "Broom finish is cheapest at $4–$8/sqft installed. Exposed aggregate adds $2–$4/sqft. Stamped and coloured concrete adds $8–$15/sqft on top of the base rate." },
              { icon: "🔩", title: "Reinforcement",       desc: "Wire mesh is standard for most driveways, adding roughly $0.25/sqft. Rebar is required for heavy vehicles or poor soil conditions — adds around $1/sqft." },
              { icon: "🚜", title: "Demolition",          desc: "Removing an old asphalt driveway costs $1–$3/sqft. Old concrete costs $3–$6/sqft to break out and haul. Always factor this in when replacing an existing drive." },
              { icon: "📍", title: "Location",            desc: "Labour varies widely. Northeast and West Coast markets run 20–40% above national averages. Rural areas may pay more for concrete delivery." },
              { icon: "🌱", title: "Sub-base & grading",  desc: "Poor soil, uneven ground, or clay soils may need extra grading and a compacted gravel sub-base — adding $1–$3/sqft before the concrete is even poured." },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-5">
                <span className="mt-0.5 text-xl">{item.icon}</span>
                <div>
                  <p className="text-sm font-bold text-gray-900">{item.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONCRETE VS ASPHALT ───────────────────────────────── */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-12 md:py-16 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">Concrete vs asphalt driveway: which is cheaper?</h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">
            Asphalt is cheaper upfront but requires resealing every 3–5 years and
            replacement after 15–20 years. Concrete costs more initially but lasts
            30–50 years with minimal maintenance. Over a 30-year period, concrete
            is often the more economical choice.
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-bold text-gray-900">Asphalt driveway</p>
              <p className="mt-1 text-2xl font-bold text-orange-500">$3–$6 per sqft</p>
              <p className="mt-1 text-xs text-gray-400">Lifespan: 15–20 years</p>
              <ul className="mt-3 space-y-1 text-sm text-gray-500">
                <li>+ Lower upfront cost</li>
                <li>+ Easier to repair</li>
                <li>+ Flexible in freeze-thaw climates</li>
                <li>&ndash; Needs resealing every 3–5 years</li>
                <li>&ndash; Softer in extreme heat</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-bold text-gray-900">Concrete driveway</p>
              <p className="mt-1 text-2xl font-bold text-emerald-600">$4–$10 per sqft</p>
              <p className="mt-1 text-xs text-gray-400">Lifespan: 30–50 years</p>
              <ul className="mt-3 space-y-1 text-sm text-gray-500">
                <li>+ 30–50 year lifespan</li>
                <li>+ Minimal maintenance</li>
                <li>+ Decorative finish options</li>
                <li>&ndash; Higher upfront cost</li>
                <li>&ndash; Cracks in extreme freeze-thaw</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 px-5 py-12 md:py-16 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">Frequently asked questions</h2>
          <div className="mt-6 space-y-4">
            {[
              { q: "How much does a concrete driveway cost?", a: "A standard broom-finish concrete driveway costs $4–$10 per square foot installed, or $1,600–$4,000 for a typical 400 sqft two-car driveway. Stamped concrete adds $8–$15/sqft. Replacing an existing surface adds $2–$6/sqft in demolition costs." },
              { q: "How thick should a concrete driveway be?", a: "Standard residential driveways should be at least 4 inches thick. For heavier vehicles — pickup trucks, SUVs, or RVs — 6 inches is recommended. Thicker slabs use 50% more concrete but significantly extend driveway life." },
              { q: "How long does a concrete driveway last?", a: "A well-installed concrete driveway lasts 30–50 years. Seal it every 3–5 years and fill cracks promptly to maximise lifespan. Asphalt driveways last 15–20 years by comparison." },
              { q: "Is concrete more expensive than asphalt?", a: "Concrete costs more upfront ($4–$10/sqft vs $3–$6/sqft for asphalt) but lasts twice as long and requires less maintenance. Over 30 years, concrete is often the better value." },
              { q: "How much does it cost to remove a concrete driveway?", a: "Removing an old concrete driveway typically costs $2–$6 per square foot, or $800–$3,500 for an average driveway. Asphalt removal is cheaper at $1–$3/sqft. Use the demolition option in the calculator above to include this in your total estimate." },
              { q: "Does a concrete driveway add home value?", a: "Yes — a new concrete driveway typically recovers 50–70% of its cost in home resale value and significantly improves curb appeal. Decorative or stamped concrete can have a higher perceived value." },
            ].map((faq, i) => (
              <div key={i} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold text-gray-800">{faq.q}</p>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DISCLAIMER ────────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-white px-5 py-10 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm leading-relaxed text-gray-400">
            This calculator provides estimates for planning purposes only. Actual costs
            depend on local labour rates, site conditions, concrete mix, and contractor
            pricing. Always get at least two written quotes from licensed contractors
            before proceeding. Prices reflect approximate 2026 US national averages.
          </p>
        </div>
      </section>

      {/* ── RELATED TOOLS ─────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-12 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-lg font-bold text-gray-900">Related Concrete Calculators</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Concrete Slab Cost",         href: "/construction-calculators/concrete/concrete-slab-calculator",     note: "Full slab cost with finish options" },
              { label: "Concrete Patio Cost",         href: "/construction-calculators/concrete/concrete-patio-cost",          note: "Estimate your patio project" },
              { label: "Concrete Cost Per Yard",      href: "/construction-calculators/concrete/concrete-cost-per-yard",       note: "Ready-mix price breakdown" },
              { label: "Concrete Volume Calculator",  href: "/construction-calculators/concrete-calculator",                   note: "Get cubic yards for any pour" },
            ].map((tool) => (
              <Link key={tool.href} href={tool.href}
                className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-emerald-200 hover:shadow-md">
                <p className="text-sm font-bold text-gray-900">{tool.label}</p>
                <p className="mt-1 text-xs text-gray-500">{tool.note}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </SimpleCalculatorShell>
  );
}
