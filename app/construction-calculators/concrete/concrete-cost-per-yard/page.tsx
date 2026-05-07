import type { Metadata } from "next";
import Link from "next/link";
import SimpleCalculatorShell from "@/components/calculators/SimpleCalculatorShell";
import ConcreteCostPerYardLoader from "./ConcreteCostPerYardLoader";

export const metadata: Metadata = {
  title: "Concrete Cost Per Yard Calculator – Work Out Ready-Mix Price Instantly",
  description:
    "Work out exactly what ready-mix concrete will cost per cubic yard, including delivery and waste. Enter your quantity and local price to get a full material cost estimate.",
  keywords: [
    "concrete cost per yard",
    "how much does a yard of concrete cost",
    "ready mix concrete price per yard",
    "concrete price per cubic yard",
    "cost of concrete per yard 2026",
    "concrete delivery cost",
    "cubic yard of concrete cost",
    "how much is a yard of concrete",
  ],
  alternates: {
    canonical: "https://worthulator.com/construction-calculators/concrete/concrete-cost-per-yard",
  },
  robots: { index: true, follow: true },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Concrete Cost Per Yard Calculator",
    description:
      "Calculate the total cost of ready-mix concrete by the cubic yard, including delivery charge and waste factor.",
    url: "https://worthulator.com/construction-calculators/concrete/concrete-cost-per-yard",
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How much does a yard of concrete cost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ready-mix concrete typically costs $120–$200 per cubic yard in the US, depending on location and mix specification. Add a delivery charge of $100–$200 per truck. Small loads under 1 yard may carry a short-load surcharge.",
        },
      },
      {
        "@type": "Question",
        name: "How much concrete is in a yard?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "One cubic yard equals 27 cubic feet — a cube roughly 3 ft × 3 ft × 3 ft. It weighs around 4,000 lb (2 tons) and covers a 10×10 ft slab at 3 inches thick.",
        },
      },
      {
        "@type": "Question",
        name: "What is a short load charge for concrete?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A short-load charge applies when you order less than the truck's minimum — usually 5–7 cubic yards. The surcharge is typically $15–$25 per yard under the minimum, or a flat fee of $50–$150.",
        },
      },
      {
        "@type": "Question",
        name: "Is bagged concrete cheaper than ready-mix?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Not for most projects. An 80 lb bag costs $5–$8 and yields 0.45 cubic feet, working out to $300–$480 per cubic yard — far more than ready-mix. Bagged concrete is only cost-effective for pours under 0.5 cubic yards.",
        },
      },
      {
        "@type": "Question",
        name: "How do I calculate how much concrete I need?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Multiply length (ft) × width (ft) × thickness (in ÷ 12) to get cubic feet, then divide by 27 for cubic yards. Always add 10% for waste. Use the concrete volume calculator to get your exact quantity first.",
        },
      },
    ],
  },
];

const heroCard = (
  <div className="rounded-2xl border border-gray-700 bg-gray-800/60 p-6">
    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
      Example — 3 yd³ at $150/yd³
    </p>
    <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
      <div>
        <p className="text-2xl font-bold text-white">3.30</p>
        <p className="mt-0.5 text-xs text-gray-400">yd³ ordered</p>
      </div>
      <div>
        <p className="text-2xl font-bold text-white">$495</p>
        <p className="mt-0.5 text-xs text-gray-400">concrete cost</p>
      </div>
      <div>
        <p className="text-2xl font-bold text-white">$150</p>
        <p className="mt-0.5 text-xs text-gray-400">delivery</p>
      </div>
      <div>
        <p className="text-2xl font-bold text-emerald-400">$645</p>
        <p className="mt-0.5 text-xs text-gray-400">total material</p>
      </div>
    </div>
  </div>
);

export default function ConcreteCostPerYardPage() {
  return (
    <SimpleCalculatorShell
      jsonLd={jsonLd}
      category="Construction · Concrete"
      title="Concrete Cost Per Yard"
      subtitle="Work Out Ready-Mix Price Instantly"
      description={
        <>
          Enter how many cubic yards you need and your local ready-mix price to get a
          full material cost estimate — including delivery and waste allowance.
          <span className="mt-2 block text-sm text-gray-400">
            For planning purposes only. Confirm pricing with your local supplier.
          </span>
        </>
      }
      heroCard={heroCard}
      calculator={<ConcreteCostPerYardLoader />}
      insightText={
        <>
          Ready-mix runs <strong>$120–$200 per cubic yard</strong> across most of the US,
          plus a $100–$200 delivery fee. Always add 10% waste — ordering short means a
          second delivery charge on top.
        </>
      }
    >

      {/* ── HOW MUCH DOES CONCRETE COST PER YARD? ─────────────── */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-12 md:py-16 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">How much does a yard of concrete cost?</h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">
            In the US, ready-mix concrete is sold by the cubic yard. Prices typically
            range from <strong>$120 to $200 per cubic yard</strong>, depending on your
            location, the concrete mix specification (standard, fibre-reinforced, high-PSI),
            and the supplier. Urban areas and markets with high fuel costs tend to sit
            at the top of that range.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">
            On top of the per-yard price, most suppliers charge a <strong>flat delivery
            fee of $100–$200</strong> per truck. If your order falls below the supplier's
            minimum — usually 5–7 cubic yards — you'll also pay a short-load surcharge
            of $15–$25 per yard under that minimum.
          </p>

          <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Region</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Price per yd³</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Typical delivery</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  { region: "Midwest",       price: "$120–$145", delivery: "$100–$150" },
                  { region: "Southeast",     price: "$125–$155", delivery: "$100–$175" },
                  { region: "Southwest",     price: "$130–$165", delivery: "$125–$175" },
                  { region: "Northeast",     price: "$145–$185", delivery: "$150–$200" },
                  { region: "West Coast",    price: "$155–$200", delivery: "$150–$200" },
                  { region: "Rural areas",   price: "$130–$170", delivery: "$150–$250+" },
                ].map((row) => (
                  <tr key={row.region} className="bg-white">
                    <td className="px-5 py-3 font-medium text-gray-800">{row.region}</td>
                    <td className="px-5 py-3 text-gray-600">{row.price}</td>
                    <td className="px-5 py-3 text-gray-600">{row.delivery}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-gray-400">
            Approximate 2026 averages. Always get quotes from at least two local suppliers before ordering.
          </p>
        </div>
      </section>

      {/* ── WHAT AFFECTS COST PER YARD? ───────────────────────── */}
      <section className="border-t border-gray-100 px-5 py-12 md:py-16 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">What affects the cost of concrete per yard?</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              { icon: "📍", title: "Location",          desc: "Labour markets, fuel, and local demand all shift the base price. West Coast and Northeast prices are typically 20–30% above the national average." },
              { icon: "🧪", title: "Mix specification", desc: "Standard 3,000 PSI costs less than high-strength 4,000–5,000 PSI mixes. Fibre-reinforced or air-entrained concrete adds $5–$15 per yard." },
              { icon: "🚛", title: "Order size",        desc: "Small orders under 5–7 yards incur a short-load surcharge. Larger pours spread the delivery cost over more yards, lowering the effective price per yard." },
              { icon: "📅", title: "Season & demand",   desc: "Spring and summer are peak season. Prices can rise 5–10% during high demand. Ordering in late autumn or winter may get you a better rate." },
              { icon: "🏗️", title: "Additives",        desc: "Accelerators (cold weather), retarders (hot weather), water reducers, and colour pigments each add to the mix price — typically $3–$20 per yard." },
              { icon: "📏", title: "Delivery distance", desc: "Suppliers charge extra for long hauls — concrete must be placed within 90 minutes of batching. Remote sites often pay $20–$50 extra per yard." },
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

      {/* ── BAGGED VS READY-MIX ───────────────────────────────── */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-12 md:py-16 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">Bagged concrete vs ready-mix: cost comparison</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-bold text-gray-900">Bagged premix (80 lb bags)</p>
              <p className="mt-1 text-2xl font-bold text-orange-500">$300–$480 per yd³</p>
              <p className="mt-1 text-xs text-gray-400">~60 bags at $5–$8 each</p>
              <p className="mt-3 text-sm leading-relaxed text-gray-500">
                Practical only for pours under 0.5 yards — fence posts, small repairs,
                and steps. No delivery cost, but labour-intensive and inconsistent for
                large pours.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-bold text-gray-900">Ready-mix (truck delivery)</p>
              <p className="mt-1 text-2xl font-bold text-emerald-600">$120–$200 per yd³</p>
              <p className="mt-1 text-xs text-gray-400">Plus $100–$200 delivery charge</p>
              <p className="mt-3 text-sm leading-relaxed text-gray-500">
                The right choice for anything over 1 yard. Consistent mix, faster pour,
                and lower cost at volume. For a 3 yd³ slab, ready-mix typically saves
                $300–$600 over bagged concrete.
              </p>
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
              {
                q: "How much does a yard of concrete cost?",
                a: "Ready-mix concrete costs $120–$200 per cubic yard in the US, plus a delivery fee of $100–$200 per truck. Prices vary by region, mix spec, and order size. Urban markets and the West Coast tend to be at the higher end.",
              },
              {
                q: "How much concrete is in a yard?",
                a: "One cubic yard equals 27 cubic feet — a 3 ft × 3 ft × 3 ft cube. It weighs around 4,000 lb and covers a 10×10 ft area at 3 inches thick, or a 10×10 ft area at 4 inches thick using 1.23 yards.",
              },
              {
                q: "What is a short load charge?",
                a: "If you order less than the supplier's minimum — usually 5–7 cubic yards — they charge a short-load fee of $15–$25 per yard under that minimum, or a flat fee of $50–$150. Always ask your supplier about their minimum order.",
              },
              {
                q: "Is it cheaper to mix your own concrete?",
                a: "For small pours under 0.5 yards, mixing bagged concrete is cost-effective. For anything larger, ready-mix is significantly cheaper per yard and produces a more consistent result.",
              },
              {
                q: "How do I calculate how much concrete I need?",
                a: "Multiply length (ft) × width (ft) × (thickness in ÷ 12) to get cubic feet, then divide by 27 for cubic yards. Add 10% for waste. Use the concrete volume calculator above or the slab calculator for a complete estimate.",
              },
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
            This calculator provides material cost estimates for planning purposes only.
            Ready-mix prices vary by region, supplier, and market conditions. Delivery
            charges, short-load fees, and mix surcharges are not included in all
            estimates. Always confirm pricing with your local ready-mix supplier before
            ordering.
          </p>
        </div>
      </section>

      {/* ── RELATED TOOLS ─────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-12 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-lg font-bold text-gray-900">Related Concrete Calculators</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Concrete Volume Calculator",   href: "/construction-calculators/concrete-calculator",                    note: "Get cubic yards for any slab" },
              { label: "Concrete Slab Cost",           href: "/construction-calculators/concrete/concrete-slab-calculator",      note: "Full installed cost estimate" },
              { label: "Concrete Driveway Cost",       href: "/construction-calculators/concrete/concrete-driveway-cost",        note: "Total driveway cost estimate" },
              { label: "Concrete Bag Calculator",      href: "/construction-calculators/concrete/concrete-bag-calculator",       note: "Exact bag count for small pours" },
            ].map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-emerald-200 hover:shadow-md"
              >
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
