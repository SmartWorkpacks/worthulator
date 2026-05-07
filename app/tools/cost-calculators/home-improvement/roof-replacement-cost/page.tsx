import type { Metadata } from "next";
import Link from "next/link";
import RoofReplacementCalculator from "./RoofReplacementCalculator";

export const metadata: Metadata = {
  title: "Roof Replacement Cost Calculator – Work Out Your New Roof Cost Instantly",
  description:
    "Work out how much your roof replacement will cost. Enter your roof size and material and get instant estimates for asphalt, metal, tile, and flat roofs.",
  keywords: [
    "roof replacement cost",
    "cost of roof replacement",
    "roof replacement calculator",
    "how much does a new roof cost",
    "roof cost estimator",
    "asphalt roof replacement cost",
    "metal roof cost",
    "tile roof cost 2026",
  ],
  alternates: {
    canonical:
      "https://worthulator.com/tools/cost-calculators/home-improvement/roof-replacement-cost",
  },
  robots: { index: true, follow: true },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Roof Replacement Cost Calculator",
    description:
      "Estimate your roof replacement cost based on size, material, condition, and location.",
    url: "https://worthulator.com/tools/cost-calculators/home-improvement/roof-replacement-cost",
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How much does roof replacement cost in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Roof replacement costs in 2026 typically range from $5,000 to $30,000+ depending on roof size, material, complexity, and location. The average homeowner spends between $8,000 and $16,000 for a standard asphalt shingle replacement.",
        },
      },
      {
        "@type": "Question",
        name: "What is the cheapest roofing material?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Asphalt shingles are the most affordable roofing material, typically costing $4–$7 per square foot installed. They have a lifespan of 20–30 years.",
        },
      },
      {
        "@type": "Question",
        name: "Should I repair or replace my roof?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "If your roof is under 15 years old and has isolated damage, repair is usually the right choice. If it is over 20 years old, has widespread damage, or you are experiencing leaks in multiple areas, replacement is typically more cost-effective long-term.",
        },
      },
      {
        "@type": "Question",
        name: "How long does a roof replacement take?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most residential roof replacements take 1–3 days. Larger or more complex roofs with high pitch or multiple features can take up to a week.",
        },
      },
    ],
  },
];

// ── stat chips ────────────────────────────────────────────────────────────────

const STAT_CHIPS = [
  { stat: "$8,000–$16,000", color: "text-emerald-600", label: "average cost for a standard asphalt shingle roof replacement" },
  { stat: "20–30 yrs",      color: "text-blue-500",    label: "typical lifespan of asphalt shingles — the most popular choice" },
  { stat: "1–3 days",       color: "text-orange-500",  label: "typical time to complete a residential roof replacement" },
];

export default function RoofReplacementCostPage() {
  return (
    <main className="bg-white text-gray-900">
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* ── BREADCRUMB ─────────────────────────────────────────────── */}
      <nav
        aria-label="Breadcrumb"
        className="bg-gray-50 px-5 py-2.5 text-xs text-gray-400 sm:px-8 lg:px-16"
      >
        <ol className="mx-auto flex max-w-5xl flex-wrap items-center gap-1.5">
          <li><Link href="/" className="hover:text-gray-700">Home</Link></li>
          <li aria-hidden>/</li>
          <li><Link href="/tools" className="hover:text-gray-700">Tools</Link></li>
          <li aria-hidden>/</li>
          <li><Link href="/tools/cost-calculators" className="hover:text-gray-700">Cost Calculators</Link></li>
          <li aria-hidden>/</li>
          <li><Link href="/tools/cost-calculators/home-improvement" className="hover:text-gray-700">Home Improvement</Link></li>
          <li aria-hidden>/</li>
          <li className="font-medium text-gray-600">Roof Replacement Cost</li>
        </ol>
      </nav>

      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-gray-100 bg-white px-5 py-14 sm:px-8 sm:py-24 lg:px-16">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-125 w-125 -translate-x-1/2 rounded-full bg-emerald-50/80 blur-[80px]" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-gray-100/60 blur-3xl" />

        <div className="relative mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-2">
          {/* Left */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-400">
              Home Improvement · Cost Calculators
            </p>
            <h1 className="mt-4 text-[clamp(2.2rem,5vw,3.6rem)] font-bold leading-[1.05] tracking-[-0.04em] text-gray-950">
              Roof Replacement Cost
              <span className="mt-1.5 block font-semibold text-gray-400">
                2026 Calculator + Real Estimates
              </span>
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-gray-500">
              Estimate your roof replacement cost instantly and understand what
              you&apos;ll actually pay based on size, materials, and condition.
            </p>
            <p className="mt-3 text-xs text-gray-400">
              For planning purposes only. Estimates are based on general cost data and may not reflect your exact situation.
            </p>
            <a
              href="#calculator"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.98]"
            >
              Calculate my roof cost →
            </a>
          </div>

          {/* Right — preview card */}
          <div className="hidden lg:block">
            <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-gray-950 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
              <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-emerald-500/15 blur-3xl" />
              <p className="relative text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
                Example · 1,500 sq ft asphalt roof
              </p>
              <p className="relative mt-3 text-5xl font-bold tracking-[-0.04em] text-emerald-400 [text-shadow:0_0_20px_rgba(52,211,153,0.28)]">
                $8,250
              </p>
              <p className="relative mt-1 text-sm text-gray-500">estimated average cost</p>
              <div className="relative mt-5 grid grid-cols-3 gap-3 border-t border-white/10 pt-4">
                {[
                  { label: "Materials", pct: "40%", color: "text-emerald-400" },
                  { label: "Labour",    pct: "45%", color: "text-indigo-400"  },
                  { label: "Other",     pct: "15%", color: "text-amber-400"   },
                ].map((item) => (
                  <div key={item.label}>
                    <p className={`text-lg font-bold ${item.color}`}>{item.pct}</p>
                    <p className="text-[11px] text-gray-500">{item.label}</p>
                  </div>
                ))}
              </div>
              <div className="relative mt-3 flex h-2 w-full overflow-hidden rounded-full">
                <div className="h-full bg-emerald-400" style={{ width: "40%" }} />
                <div className="h-full bg-indigo-400" style={{ width: "45%" }} />
                <div className="h-full flex-1 bg-amber-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SEO INTRO ──────────────────────────────────────────────── */}
      <section className="border-b border-gray-100 bg-gray-50 px-5 py-8 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <p className="text-base leading-relaxed text-gray-600">
            Wondering about the{" "}
            <strong className="font-semibold text-gray-800">roof replacement cost</strong> for
            your home? The{" "}
            <strong className="font-semibold text-gray-800">cost of roof replacement</strong>{" "}
            can vary significantly depending on size, materials, and condition. Use our
            calculator below to get a realistic estimate based on your situation — and
            understand exactly what you&apos;re paying for before you call a contractor.
          </p>
        </div>
      </section>

      {/* ── STAT CHIPS ─────────────────────────────────────────────── */}
      <section className="bg-white px-5 pt-10 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-3 sm:grid-cols-3">
            {STAT_CHIPS.map((item) => (
              <div
                key={item.stat}
                className="group rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-gray-300 hover:shadow-xl"
              >
                <p className={`text-3xl font-bold tracking-tight transition-transform duration-200 group-hover:scale-105 ${item.color}`}>
                  {item.stat}
                </p>
                <p className="mt-1.5 text-xs leading-5 text-gray-500">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CALCULATOR ─────────────────────────────────────────────── */}
      <section className="bg-white px-5 py-10 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <RoofReplacementCalculator />
        </div>
      </section>

      {/* ── EDUCATIONAL CONTENT ────────────────────────────────────── */}
      <section className="bg-white px-5 py-16 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl space-y-16">

          {/* What affects cost */}
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-950">
              What Affects Roof Replacement Cost?
            </h2>
            <p className="mt-3 text-base leading-relaxed text-gray-500">
              No two roofs are the same. Here are the key cost drivers you need to
              understand before getting quotes.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                {
                  icon: "📐",
                  title: "Roof Size",
                  body: "The single biggest cost factor. Larger roofs require more materials and labour. Most contractors price by the 'square' (100 sq ft). A 2,000 sq ft roof = 20 squares.",
                },
                {
                  icon: "🏗️",
                  title: "Materials",
                  body: "Asphalt shingles are cheapest ($4–$7/sq ft). Metal ($8–$14), tile ($10–$20), and flat roofing ($5–$10) vary widely in cost and lifespan.",
                },
                {
                  icon: "👷",
                  title: "Labour",
                  body: "Labour typically accounts for 40–50% of total roof replacement cost. Steep, complex, or multi-story roofs cost more because they take longer and require more safety equipment.",
                },
                {
                  icon: "📍",
                  title: "Location",
                  body: "Contractor rates vary significantly by region. High-cost-of-living areas (New York, Los Angeles, San Francisco) often add 20–35% above the national average.",
                },
                {
                  icon: "🏚️",
                  title: "Condition",
                  body: "A roof in severe condition often requires structural repair before new materials can be installed. This can add $2,000–$8,000 to the total cost.",
                },
                {
                  icon: "⏱️",
                  title: "Urgency",
                  body: "Emergency or urgent roofing jobs attract a premium. If your roof is actively leaking, expect to pay 15–20% more than a planned replacement.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-5"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{item.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-gray-500">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Average costs 2026 */}
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-950">
              Average Roof Replacement Cost in 2026
            </h2>
            <p className="mt-3 text-base leading-relaxed text-gray-500">
              Based on national averages. Your actual cost will depend on the factors above.
            </p>
            <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-left">
                    <th className="px-5 py-3 font-semibold text-gray-700">Roof Type</th>
                    <th className="px-5 py-3 font-semibold text-gray-700">Low</th>
                    <th className="px-5 py-3 font-semibold text-gray-700">Average</th>
                    <th className="px-5 py-3 font-semibold text-gray-700">High</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    ["Asphalt Shingles", "$4,800",  "$9,500",  "$15,000"],
                    ["Metal Roofing",    "$10,000", "$18,000", "$35,000"],
                    ["Tile / Slate",     "$15,000", "$25,000", "$50,000+"],
                    ["Flat Roof",        "$4,000",  "$9,000",  "$20,000"],
                  ].map(([type, low, avg, high]) => (
                    <tr key={type} className="transition hover:bg-gray-50">
                      <td className="px-5 py-3.5 font-medium text-gray-900">{type}</td>
                      <td className="px-5 py-3.5 text-gray-500">{low}</td>
                      <td className="px-5 py-3.5 font-semibold text-emerald-600">{avg}</td>
                      <td className="px-5 py-3.5 text-gray-500">{high}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cost per sq ft */}
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-950">
              Roof Replacement Cost Per Square Foot
            </h2>
            <p className="mt-3 text-base leading-relaxed text-gray-500">
              Understanding cost per square foot helps you benchmark contractor quotes
              and identify when you&apos;re being overcharged.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { material: "Asphalt",  range: "$4–$7",   sub: "per sq ft installed", color: "text-emerald-600" },
                { material: "Metal",    range: "$8–$14",  sub: "per sq ft installed", color: "text-blue-600"    },
                { material: "Tile",     range: "$10–$20", sub: "per sq ft installed", color: "text-purple-600"  },
                { material: "Flat",     range: "$5–$10",  sub: "per sq ft installed", color: "text-orange-600"  },
              ].map((item) => (
                <div
                  key={item.material}
                  className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <p className="text-sm font-semibold text-gray-500">{item.material}</p>
                  <p className={`mt-1.5 text-3xl font-bold ${item.color}`}>{item.range}</p>
                  <p className="mt-0.5 text-xs text-gray-400">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Replace or wait */}
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-950">
              Should You Replace Your Roof Now or Wait?
            </h2>
            <p className="mt-3 text-base leading-relaxed text-gray-500">
              The decision depends on age, condition, and the cost of inaction. Here&apos;s a
              simple guide:
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <p className="text-sm font-bold text-emerald-800">Replace now if:</p>
                <ul className="mt-3 space-y-2 text-sm text-emerald-700">
                  {[
                    "Your roof is over 20 years old",
                    "You have visible sagging or structural damage",
                    "Multiple areas are leaking",
                    "Shingles are curling, cracking, or missing in patches",
                    "Your energy bills have risen (poor insulation)",
                  ].map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <span className="mt-0.5 shrink-0 font-bold text-emerald-500">✓</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <p className="text-sm font-bold text-amber-800">You can wait if:</p>
                <ul className="mt-3 space-y-2 text-sm text-amber-700">
                  {[
                    "Your roof is under 15 years old",
                    "Damage is isolated to a small area",
                    "A professional inspection confirms repair is viable",
                    "No active leaks or structural issues",
                    "Budget constraints make repair the better short-term choice",
                  ].map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <span className="mt-0.5 shrink-0 font-bold text-amber-500">→</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
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
                  q: "How much does it cost to replace a 1,500 sq ft roof?",
                  a: "A 1,500 sq ft asphalt shingle roof typically costs between $6,000 and $10,500. Metal roofing on the same footprint would cost $12,000–$21,000. Use the calculator above for a personalised estimate.",
                },
                {
                  q: "Does homeowners insurance cover roof replacement?",
                  a: "Insurance typically covers roof replacement caused by sudden events like storms, hail, or fire. Wear and tear, age-related deterioration, or maintenance neglect are usually excluded. Check your policy or speak with your insurer.",
                },
                {
                  q: "How do I get the best price on a new roof?",
                  a: "Get at least 3 quotes from licensed local contractors. Compare not just price but materials, warranty, and timeline. Scheduling in late winter or early spring often gets you a better rate. Avoid urgent or same-week jobs where possible.",
                },
                {
                  q: "How long does a roof replacement last?",
                  a: "Asphalt shingles: 20–30 years. Metal roofing: 40–70 years. Tile and slate: 50–100 years. Flat roofing: 10–20 years depending on the material (EPDM, TPO, felt).",
                },
              ].map((faq, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-gray-100 bg-gray-50 p-5"
                >
                  <p className="text-sm font-bold text-gray-900">{faq.q}</p>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── SECOND LEAD CTA ─────────────────────────────────────────── */}
      <section className="bg-gray-50 px-5 py-12 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
              Next Step
            </p>
            <h2 className="mt-3 text-2xl font-bold text-gray-950">
              Ready to get real quotes?
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-base leading-relaxed text-gray-500">
              Use our estimate as a benchmark, then get quotes from trusted local
              roofing contractors near you. No commitment required.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.98]"
            >
              Get free quotes from local roofers →
            </Link>
          </div>
        </div>
      </section>

      {/* ── INTERNAL LINKS ──────────────────────────────────────────── */}
      <section className="bg-white px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
            More Calculators
          </p>
          <h2 className="mt-3 text-xl font-bold tracking-tight text-gray-950">
            Related Cost Calculators
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                emoji: "🔨",
                title: "Bathroom Renovation Cost",
                desc:  "Estimate the full cost of a bathroom remodel — tiles, fittings, and labour.",
                href:  "/tools/cost-calculators/home-improvement",
              },
              {
                emoji: "🍳",
                title: "Kitchen Remodel Cost",
                desc:  "Get an accurate kitchen remodel estimate based on size and spec.",
                href:  "/tools/cost-calculators/home-improvement",
              },
              {
                emoji: "🏠",
                title: "House Extension Cost",
                desc:  "Plan your extension budget with our cost estimator.",
                href:  "/tools/cost-calculators/home-improvement",
              },
              {
                emoji: "🏗️",
                title: "All Cost Calculators",
                desc:  "Browse the full range of cost estimation tools.",
                href:  "/tools/cost-calculators",
              },
              {
                emoji: "🧱",
                title: "Concrete Calculator",
                desc:  "Calculate concrete volume and cost for any project.",
                href:  "/construction-calculators/concrete",
              },
              {
                emoji: "🛠️",
                title: "All Tools",
                desc:  "View all financial and cost calculators on Worthulator.",
                href:  "/tools",
              },
            ].map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="group flex gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg"
              >
                <span className="text-2xl">{card.emoji}</span>
                <div>
                  <p className="text-sm font-bold text-gray-900 group-hover:text-emerald-700">
                    {card.title}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-gray-500">{card.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
