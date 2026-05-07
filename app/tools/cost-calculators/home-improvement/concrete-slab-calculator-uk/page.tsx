import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Concrete Slab Calculator UK – Work Out How Much Your Slab Will Cost Instantly",
  description:
    "Work out how much a concrete slab will cost in the UK. Enter your dimensions and get instant estimates for driveways, patios, and foundations.",
  keywords: [
    "concrete slab cost calculator uk",
    "how much does a concrete slab cost uk",
    "concrete slab calculator uk",
    "cost of concrete slab per m2 uk",
    "concrete driveway cost uk",
    "concrete patio cost uk 2026",
  ],
  alternates: {
    canonical:
      "https://worthulator.com/tools/cost-calculators/home-improvement/concrete-slab-calculator-uk",
  },
  robots: { index: true, follow: true },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Concrete Slab Cost Calculator UK",
    description: "Estimate the cost of a concrete slab in the UK in £/m².",
    url: "https://worthulator.com/tools/cost-calculators/home-improvement/concrete-slab-calculator-uk",
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How much does a concrete slab cost per m² in the UK?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A basic concrete slab in the UK typically costs £60–£120 per m² installed. With reinforcement, formwork, and a smooth finish, costs can reach £120–£180+ per m².",
        },
      },
      {
        "@type": "Question",
        name: "How thick should a concrete slab be in the UK?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A standard residential slab in the UK is 100mm (4 inches) thick. Driveways typically need 100–150mm, while commercial or heavy-load applications may require 150–200mm.",
        },
      },
    ],
  },
];

export default function ConcreteSlabCalculatorUKPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-white">

        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section className="bg-gray-950 px-5 py-16 sm:px-8 lg:px-16">
          <div className="mx-auto max-w-5xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-400">
              Cost Calculators · Home Improvement · UK
            </p>
            <h1 className="mt-4 text-[clamp(2rem,5vw,3.5rem)] font-bold leading-tight tracking-tight text-white">
              Concrete Slab Cost Calculator
              <span className="mt-1 block font-semibold text-gray-400">2026 UK Estimates</span>
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-gray-400">
              Estimate the cost of a concrete slab in the UK — for driveways, patios, garage floors,
              and foundations. Prices in £/m² with 2026 UK labour rates.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <div className="rounded-xl border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm text-gray-300">
                <span className="font-bold text-orange-400">£60–£120</span>
                <span className="ml-1.5">per m² installed</span>
              </div>
              <div className="rounded-xl border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm text-gray-300">
                <span className="font-bold text-orange-400">100–150mm</span>
                <span className="ml-1.5">typical thickness</span>
              </div>
              <div className="rounded-xl border border-gray-700 bg-gray-900 px-4 py-2.5 text-sm text-gray-300">
                <span className="font-bold text-orange-400">1–2 days</span>
                <span className="ml-1.5">typical project time</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Calculator placeholder ────────────────────────────────── */}
        <section className="bg-gray-50 px-5 py-12 sm:px-8 lg:px-16">
          <div className="mx-auto max-w-5xl">
            <div className="rounded-2xl border border-orange-100 bg-white p-8 text-center shadow-sm">
              <p className="text-2xl font-bold text-gray-900">Calculator Coming Soon</p>
              <p className="mx-auto mt-3 max-w-lg text-base text-gray-500">
                Our interactive UK concrete slab cost calculator is being built. Use the cost
                guide below to estimate your project.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {[
                  { size: "10m²",  cost: "£600–£1,200",  note: "small patio" },
                  { size: "20m²",  cost: "£1,200–£2,400", note: "standard patio" },
                  { size: "50m²",  cost: "£3,000–£6,000", note: "large driveway" },
                ].map((item) => (
                  <div key={item.size} className="rounded-xl border border-gray-200 p-4">
                    <p className="text-sm font-semibold text-gray-500">{item.size}</p>
                    <p className="mt-1 text-xl font-bold text-orange-500">{item.cost}</p>
                    <p className="text-xs text-gray-400">{item.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Cost guide ───────────────────────────────────────────── */}
        <section className="bg-white px-5 py-16 sm:px-8 lg:px-16">
          <div className="mx-auto max-w-5xl space-y-14">

            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-950">
                Average Concrete Slab Costs in the UK (2026)
              </h2>
              <p className="mt-3 text-base leading-relaxed text-gray-500">
                UK concrete slab costs depend on size, thickness, type of finish, and local
                labour rates. The table below shows typical fully installed prices.
              </p>
              <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Slab area</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">100mm thick</th>
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">150mm thick</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {[
                      { size: "10 m²",  hun: "£600–£1,200",   one: "£900–£1,800" },
                      { size: "20 m²",  hun: "£1,200–£2,400", one: "£1,800–£3,600" },
                      { size: "30 m²",  hun: "£1,800–£3,600", one: "£2,700–£5,400" },
                      { size: "50 m²",  hun: "£3,000–£6,000", one: "£4,500–£9,000" },
                      { size: "100 m²", hun: "£6,000–£12,000",one: "£9,000–£18,000" },
                    ].map((row) => (
                      <tr key={row.size} className="bg-white">
                        <td className="px-5 py-3 font-medium text-gray-800">{row.size}</td>
                        <td className="px-5 py-3 text-gray-600">{row.hun}</td>
                        <td className="px-5 py-3 text-gray-600">{row.one}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* FAQ */}
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-950">
                Frequently Asked Questions
              </h2>
              <div className="mt-6 space-y-4">
                {[
                  {
                    q: "How much does a concrete slab cost per m² in the UK?",
                    a: "A basic concrete slab in the UK costs £60–£120 per m² installed. Premium finishes such as exposed aggregate or coloured concrete can add £30–£60/m² on top.",
                  },
                  {
                    q: "Do I need planning permission for a concrete slab in the UK?",
                    a: "For most garden patios and paths, planning permission is not required. However, impermeable driveways over 5m² at the front of a property may require permeable paving or drainage — check with your local authority.",
                  },
                  {
                    q: "How long does a concrete slab last in the UK?",
                    a: "A well-laid concrete slab can last 30–50 years with minimal maintenance. The UK's freeze-thaw cycle can cause surface cracking over time — using air-entrained concrete and proper drainage significantly extends its lifespan.",
                  },
                ].map((faq, i) => (
                  <div key={i} className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                    <p className="text-sm font-bold text-gray-900">{faq.q}</p>
                    <p className="mt-2 text-sm leading-relaxed text-gray-500">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ── Related tools ─────────────────────────────────────────── */}
        <section className="bg-gray-50 px-5 py-12 sm:px-8 lg:px-16">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-lg font-bold text-gray-900">Related Calculators</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {[
                { label: "Concrete Slab Calculator (US)", href: "/tools/cost-calculators/home-improvement/concrete-slab-calculator", note: "US prices in $ and sq ft" },
                { label: "Roof Replacement Cost", href: "/tools/cost-calculators/home-improvement/roof-replacement-cost", note: "Estimate full roof replacement cost" },
                { label: "Home Improvement Calculators", href: "/tools/cost-calculators/home-improvement", note: "All home improvement cost tools" },
              ].map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-orange-200 hover:shadow-md"
                >
                  <p className="text-sm font-bold text-gray-900">{tool.label}</p>
                  <p className="mt-1 text-xs text-gray-500">{tool.note}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
