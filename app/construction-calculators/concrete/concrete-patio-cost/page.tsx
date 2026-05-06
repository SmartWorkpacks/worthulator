import type { Metadata } from "next";
import Link from "next/link";
import SimpleCalculatorShell from "@/components/calculators/SimpleCalculatorShell";
import ConcretePatioCostLoader from "./ConcretePatioCostLoader";

export const metadata: Metadata = {
  title: "Concrete Patio Cost Calculator – Work Out Your Total Price Instantly",
  description:
    "Estimate the full cost of a concrete patio in seconds. Enter your dimensions, finish type, and reinforcement to get an installed cost estimate including materials, labour, and optional surface removal.",
  keywords: [
    "concrete patio cost",
    "how much does a concrete patio cost",
    "concrete patio cost calculator",
    "concrete patio cost per square foot",
    "stamped concrete patio cost",
    "cost to pour concrete patio",
    "concrete patio price 2026",
    "concrete vs paver patio cost",
  ],
  alternates: {
    canonical: "https://www.worthulator.com/construction-calculators/concrete/concrete-patio-cost",
  },
  robots: { index: true, follow: true },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Concrete Patio Cost Calculator",
    description:
      "Estimate the full installed cost of a concrete patio — materials, labour, finish type, reinforcement, and optional demolition.",
    url: "https://www.worthulator.com/construction-calculators/concrete/concrete-patio-cost",
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How much does a concrete patio cost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A concrete patio costs $4–$9 per square foot installed for a standard broom finish, or $576–$1,296 for a typical 12×12 ft patio. Stamped concrete adds $8–$15 per sqft. National average installed cost is around $6–$8/sqft for a plain finish.",
        },
      },
      {
        "@type": "Question",
        name: "How thick should a concrete patio be?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most residential patios are poured at 3.5–4 inches thick. Four inches is the standard recommendation. If you plan to park a vehicle or have poor soil drainage, go to 6 inches. Thicker slabs use significantly more concrete but last longer.",
        },
      },
      {
        "@type": "Question",
        name: "Is a concrete patio cheaper than pavers?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes — poured concrete is typically cheaper than pavers upfront. Concrete runs $4–$9/sqft installed, while pavers average $10–$20/sqft installed. However, pavers are easier to repair individually if cracked or settled.",
        },
      },
      {
        "@type": "Question",
        name: "How long does a concrete patio last?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A properly installed and sealed concrete patio lasts 25–50 years. Sealing every 3–5 years prevents staining and slows surface degradation. In freeze-thaw climates, use air-entrained concrete to resist cracking.",
        },
      },
      {
        "@type": "Question",
        name: "How much does a stamped concrete patio cost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Stamped concrete patios cost $12–$20 per square foot installed — significantly more than plain broom finish ($4–$9/sqft). A 12×12 ft stamped patio costs roughly $1,700–$2,900. The decorative look adds value and curb appeal but needs resealing every 2–3 years.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need a permit for a concrete patio?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most jurisdictions do not require a permit for a basic concrete patio at ground level. However, some areas require permits for patios above a certain size or attached to the home. Always check with your local building department before starting work.",
        },
      },
    ],
  },
];

const heroCard = (
  <div className="rounded-2xl border border-gray-700 bg-gray-800/60 p-6">
    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
      Example &mdash; 12 &times; 12 ft patio at 4 in, broom finish
    </p>
    <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
      <div>
        <p className="text-2xl font-bold text-white">144</p>
        <p className="mt-0.5 text-xs text-gray-400">sq ft</p>
      </div>
      <div>
        <p className="text-2xl font-bold text-white">1.78</p>
        <p className="mt-0.5 text-xs text-gray-400">cubic yards</p>
      </div>
      <div>
        <p className="text-2xl font-bold text-white">$5.50</p>
        <p className="mt-0.5 text-xs text-gray-400">per sq ft</p>
      </div>
      <div>
        <p className="text-2xl font-bold text-emerald-400">$792</p>
        <p className="mt-0.5 text-xs text-gray-400">est. total</p>
      </div>
    </div>
  </div>
);

export default function ConcretePatioCostPage() {
  return (
    <SimpleCalculatorShell
      jsonLd={jsonLd}
      category="Construction · Concrete"
      title="Concrete Patio Cost Calculator"
      subtitle="Work Out Your Total Price Instantly"
      description={
        <>
          Enter your patio dimensions, finish type, and reinforcement to get a full
          installed cost estimate &mdash; concrete, labour, and optional surface removal all included.
          <span className="mt-2 block text-sm text-gray-400">
            For planning purposes only. Always get at least two contractor quotes before committing.
          </span>
        </>
      }
      heroCard={heroCard}
      calculator={<ConcretePatioCostLoader />}
      insightText={
        <>
          A standard <strong>12 &times; 12 ft patio at 4 inches</strong> costs roughly{" "}
          <strong>$700&ndash;$1,300</strong> installed with a plain broom finish.
          Stamped concrete can push a similarly sized patio to{" "}
          <strong>$1,700&ndash;$3,000</strong>.
        </>
      }
    >

      {/* ── COST BY SIZE ─────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-12 md:py-16 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">How much does a concrete patio cost?</h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">
            A poured concrete patio costs <strong>$4–$9 per square foot installed</strong> for a standard
            broom finish, depending on thickness, reinforcement, and local labour rates.
            Stamped or decorative finishes are the biggest cost variable &mdash; adding
            $8–$15 per sqft on top of the base rate.
          </p>

          <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Patio size</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Broom finish</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Stamped concrete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { size: "10×10 ft (100 sqft) — small",    broom: "$400–$900",    stamp: "$2,000–$2,500" },
                  { size: "12×12 ft (144 sqft) — standard", broom: "$576–$1,300",  stamp: "$2,900–$3,600" },
                  { size: "16×16 ft (256 sqft) — medium",   broom: "$1,024–$2,300", stamp: "$5,100–$6,400" },
                  { size: "20×20 ft (400 sqft) — large",    broom: "$1,600–$3,600", stamp: "$8,000–$10,000" },
                  { size: "12×20 ft (240 sqft) — rectangle", broom: "$960–$2,160", stamp: "$4,800–$6,000" },
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
            Approximate 2026 US national averages at 4 inches thick with wire mesh reinforcement. Excludes surface removal.
          </p>
        </div>
      </section>

      {/* ── WHAT AFFECTS COST? ───────────────────────────────── */}
      <section className="border-t border-gray-100 px-5 py-12 md:py-16 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">What affects concrete patio cost?</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              { icon: "📐", title: "Size",             desc: "The biggest cost driver. A 12×12 ft patio uses roughly 1.8 yd³ of concrete at 4 inches. Going up to 20×20 ft more than quadruples the material and labour." },
              { icon: "🎨", title: "Finish type",      desc: "Broom finish is cheapest at $4–$9/sqft installed. Exposed aggregate adds $2–$4/sqft. Stamped and coloured concrete adds $8–$15/sqft — the most popular upgrade for patios." },
              { icon: "📏", title: "Thickness",        desc: "Most patios are 3.5–4 inches thick. Four inches is recommended for durability. Stepping down to 3.5 in reduces concrete by ~12% but may shorten lifespan in colder climates." },
              { icon: "🔩", title: "Reinforcement",    desc: "Wire mesh adds roughly $0.25/sqft and is standard. Rebar adds $1/sqft and is recommended for large patios or expansive clay soils. Small or decorative patios may omit reinforcement." },
              { icon: "📍", title: "Location",         desc: "Labour costs vary significantly. Northeast and West Coast markets run 20–40% above national averages. Concrete delivery surcharges also apply in rural areas." },
              { icon: "🌱", title: "Site prep",        desc: "Rocky ground, poor drainage, or sloped terrain requires extra grading and sub-base work — adding $1–$3/sqft before any concrete is poured." },
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

      {/* ── CONCRETE VS PAVERS ───────────────────────────────── */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-12 md:py-16 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">Concrete patio vs pavers: which is cheaper?</h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">
            Poured concrete is almost always cheaper upfront. Pavers cost more to install
            but individual units can be replaced if damaged. Concrete is more monolithic
            and can crack, but lasts 25–50 years with proper sealing.
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {[
              { label: "Poured concrete",    price: "$4–$9/sqft",   life: "25–50 yrs", pros: ["Cheapest option", "Seamless look", "Stamped option"], cons: ["Can crack", "Hard to repair"] },
              { label: "Concrete pavers",    price: "$10–$20/sqft", life: "25–50 yrs", pros: ["Easy individual repair", "Many styles"], cons: ["Higher upfront cost", "Weeds between joints"] },
              { label: "Natural stone",      price: "$15–$35/sqft", life: "50+ yrs",   pros: ["Premium look", "Very durable"], cons: ["Highest cost", "Uneven surfaces"] },
            ].map((opt) => (
              <div key={opt.label} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-bold text-gray-900">{opt.label}</p>
                <p className="mt-1 text-xl font-bold text-emerald-600">{opt.price}</p>
                <p className="mt-0.5 text-xs text-gray-400">Lifespan: {opt.life}</p>
                <ul className="mt-3 space-y-1 text-sm text-gray-500">
                  {opt.pros.map((p) => <li key={p}>+ {p}</li>)}
                  {opt.cons.map((c) => <li key={c}>&ndash; {c}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 px-5 py-12 md:py-16 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">Frequently asked questions</h2>
          <div className="mt-6 space-y-4">
            {[
              { q: "How much does a concrete patio cost?", a: "A standard broom-finish concrete patio costs $4–$9 per square foot installed, or $576–$1,300 for a typical 12×12 ft patio. Stamped concrete adds $8–$15/sqft, bringing a 12×12 ft patio to $1,700–$3,000." },
              { q: "How thick should a concrete patio be?", a: "Most residential patios are poured at 3.5–4 inches thick. Four inches is the standard recommendation for durability. In freeze-thaw climates or on poor soil, 4 inches with wire mesh is the minimum." },
              { q: "Is a concrete patio cheaper than pavers?", a: "Yes — poured concrete is typically $4–$9/sqft installed, while pavers average $10–$20/sqft. Concrete is cheaper upfront but can crack; pavers are easier to repair individually but cost more." },
              { q: "How long does a concrete patio last?", a: "A properly installed and sealed concrete patio lasts 25–50 years. Seal it every 3–5 years to prevent staining and slow surface erosion. In cold climates, use air-entrained concrete to resist freeze-thaw cracking." },
              { q: "How much does a stamped concrete patio cost?", a: "Stamped concrete patios cost $12–$20 per square foot installed. A 12×12 ft stamped patio runs $1,700–$2,900 — roughly 2–3 times the cost of a plain broom finish. Stamped concrete requires resealing every 2–3 years to maintain colour." },
              { q: "Do I need a permit for a concrete patio?", a: "Most jurisdictions don't require a permit for a ground-level concrete patio. However, large patios or those attached to the home structure may require one. Always check with your local building department first." },
            ].map((faq, i) => (
              <div key={i} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold text-gray-800">{faq.q}</p>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DISCLAIMER ───────────────────────────────────────── */}
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

      {/* ── RELATED TOOLS ────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-12 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-lg font-bold text-gray-900">Related Concrete Calculators</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Concrete Driveway Cost",     href: "/construction-calculators/concrete/concrete-driveway-cost",  note: "Estimate your driveway project" },
              { label: "Concrete Slab Cost",         href: "/construction-calculators/concrete/concrete-slab-calculator", note: "Full slab cost with finish options" },
              { label: "Concrete Cost Per Yard",     href: "/construction-calculators/concrete/concrete-cost-per-yard",   note: "Ready-mix price breakdown" },
              { label: "Concrete Volume Calculator", href: "/construction-calculators/concrete-calculator",               note: "Get cubic yards for any pour" },
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
