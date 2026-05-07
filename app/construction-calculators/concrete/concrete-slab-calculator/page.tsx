import type { Metadata } from "next";
import Link from "next/link";
import SimpleCalculatorShell from "@/components/calculators/SimpleCalculatorShell";
import ConcreteSlabCalculatorLoader from "./ConcreteSlabCalculatorLoader";
import RegionToggle from "@/components/RegionToggle";

export const metadata: Metadata = {
  title: "Concrete Slab Calculator – Work Out How Much Concrete You Need Instantly",
  description:
    "Work out exactly how much concrete you need for any slab. Enter your dimensions and get instant results for volume, bags, and installed cost.",
  keywords: [
    "concrete slab calculator",
    "calculate concrete for a slab",
    "concrete calculator for slab",
    "concrete slab cost calculator",
    "how much concrete do I need for a slab",
    "concrete slab cubic yards",
    "how many bags for a concrete slab",
    "concrete slab thickness guide",
  ],
  alternates: {
    canonical:
      "https://worthulator.com/construction-calculators/concrete/concrete-slab-calculator",
  },
  robots: { index: true, follow: true },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Concrete Slab Calculator – Volume, Bags & Cost",
    description:
      "Calculate cubic yards, bag count, and installed cost for concrete slabs — driveways, patios, and foundations.",
    url: "https://worthulator.com/construction-calculators/concrete/concrete-slab-calculator",
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How much concrete do I need for a slab?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Multiply length (ft) × width (ft) × thickness (in ÷ 12), then divide by 27 to get cubic yards. A 10×10 ft slab at 4 inches thick needs 1.23 cubic yards. Always add 10% for waste.",
        },
      },
      {
        "@type": "Question",
        name: "How many bags of concrete do I need for a slab?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "An 80 lb bag covers about 0.45 cubic feet. You need roughly 60 bags per cubic yard. A 10×10 ft slab at 4 inches thick (1.23 cu yd) needs about 74 bags including 10% waste.",
        },
      },
      {
        "@type": "Question",
        name: "What thickness should a concrete slab be?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Patios and walkways: 3–4 inches. Residential driveways: 4–6 inches. Garage floors: 4–6 inches. Heavy loads, commercial, or vehicle traffic: 6–8 inches minimum.",
        },
      },
      {
        "@type": "Question",
        name: "How do you calculate cubic yards of concrete?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Formula: (Length ft × Width ft × Thickness in ÷ 12) ÷ 27. Convert thickness from inches to feet first by dividing by 12, then multiply all three dimensions and divide by 27.",
        },
      },
      {
        "@type": "Question",
        name: "How much does a concrete slab cost per square foot?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A standard concrete slab costs $4–$8 per square foot installed. With premium finishes, reinforcement, and site prep, costs reach $12–$20+ per square foot.",
        },
      },
      {
        "@type": "Question",
        name: "How much concrete do I need for a 10x10 slab?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A 10×10 ft slab at 4 inches thick requires approximately 1.23 cubic yards of concrete, or about 74 bags of 80 lb premix (with 10% waste). At $125–$150 per cubic yard for ready-mix, that's roughly $150–$185 in material costs.",
        },
      },
    ],
  },
];

const heroCard = (
  <div className="rounded-2xl border border-gray-700 bg-gray-800/60 p-6">
    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Example — 20 × 20 ft driveway slab</p>
    <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
      <div>
        <p className="text-2xl font-bold text-white">4.94</p>
        <p className="mt-0.5 text-xs text-gray-400">cubic yards</p>
      </div>
      <div>
        <p className="text-2xl font-bold text-white">297</p>
        <p className="mt-0.5 text-xs text-gray-400">bags (80 lb)</p>
      </div>
      <div>
        <p className="text-2xl font-bold text-white">4 in</p>
        <p className="mt-0.5 text-xs text-gray-400">thickness</p>
      </div>
      <div>
        <p className="text-2xl font-bold text-emerald-400">$2,750–$4,200</p>
        <p className="mt-0.5 text-xs text-gray-400">est. installed</p>
      </div>
    </div>
  </div>
);

export default function ConcreteSlabCalculatorPage() {
  return (
    <SimpleCalculatorShell
      jsonLd={jsonLd}
      category="Construction · Concrete"
      title="Concrete Slab Calculator"
      subtitle="Volume, Bags & Installed Cost"
      description={
        <>
          Enter your slab dimensions to get cubic yards, bag count, and a full
          installed cost estimate — including finish type and reinforcement.{" "}
          <span className="mt-2 block text-sm text-gray-400">
            For planning purposes only. Verify quantities with your supplier before ordering.
          </span>
          <RegionToggle
            current="us"
            usPath="/construction-calculators/concrete/concrete-slab-calculator"
            ukPath="/construction-calculators/concrete/concrete-slab-calculator-uk"
            theme="light"
          />
        </>
      }
      heroCard={heroCard}
      calculator={<ConcreteSlabCalculatorLoader />}
      insightText={
        <>
          A standard <strong>20 × 20 ft garage floor at 4 inches</strong> needs just
          under 5 cubic yards — around $2,750–$4,200 installed with basic broom finish
          and no reinforcement. Adding rebar and a stamped finish can push that to $8,000+.
        </>
      }
    >

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          KEYWORD INTRO
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="border-t border-gray-100 px-5 py-10 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <p className="max-w-3xl text-base leading-relaxed text-gray-600">
            Use this concrete slab calculator to estimate how much concrete you need for
            slabs, driveways, patios, and floors. Enter length, width, and thickness to
            calculate cubic yards, bags of concrete, and installed cost estimates instantly.
          </p>
        </div>
      </section>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          HOW TO CALCULATE CONCRETE FOR A SLAB
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-12 md:py-16 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">How to calculate concrete for a slab</h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">
            All concrete in the US is sold by the <strong>cubic yard</strong>. To
            calculate how much you need, multiply the length, width, and thickness of
            your slab, then divide by 27 (the number of cubic feet in one cubic yard).
          </p>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">
            Thickness is the most overlooked variable. A slab poured at 6 inches instead
            of 4 inches uses <strong>50% more concrete</strong> for the same footprint —
            so always confirm your thickness requirement before calculating.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">
            For quick volume-only estimates,{" "}
            <Link
              href="/construction-calculators/concrete-calculator"
              className="font-semibold text-emerald-700 underline underline-offset-2 hover:text-emerald-900"
            >
              use the concrete volume calculator
            </Link>{" "}
            to get cubic yards before estimating cost.
          </p>

          {/* Formula block */}
          <div className="mt-8">
            <h3 className="text-lg font-bold text-gray-900">Concrete slab calculation formula</h3>
            <div className="mt-3 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Formula</p>
              <p className="mt-3 font-mono text-sm text-gray-700">
                Volume (cu yd) = Length (ft) × Width (ft) × (Thickness (in) ÷ 12) ÷ 27
              </p>
            </div>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-gray-500">
              Divide thickness in inches by 12 to convert to feet. Multiply all three
              dimensions to get cubic feet, then divide by 27 to get cubic yards. Always
              add <strong>10% for waste</strong> before ordering.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {[
                { label: "10×10 ft, 4 in thick", value: "1.23 cu yd",  bags: "≈ 74 bags" },
                { label: "20×20 ft, 4 in thick", value: "4.94 cu yd",  bags: "≈ 297 bags" },
                { label: "20×20 ft, 6 in thick", value: "7.41 cu yd",  bags: "ready-mix" },
              ].map((ex) => (
                <div key={ex.label} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                  <p className="text-xs text-gray-400">{ex.label}</p>
                  <p className="mt-1 text-lg font-bold text-emerald-600">{ex.value}</p>
                  <p className="text-xs text-gray-400">{ex.bags}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          MATERIAL CALCULATOR
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="border-t border-gray-100 px-5 py-12 md:py-16 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">Material calculator for concrete slabs</h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">
            Once you have your cubic yards, choose between <strong>bagged concrete</strong> and
            <strong> ready-mix delivery</strong>. The right choice depends on project size.
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
              <p className="text-sm font-bold text-gray-900">Bagged concrete (DIY)</p>
              <p className="mt-1 text-2xl font-bold text-emerald-600">60 bags per cu yd</p>
              <p className="mt-1 text-xs text-gray-400">80 lb bags — ≈ 0.45 cu ft each</p>
              <p className="mt-3 text-sm leading-relaxed text-gray-500">
                Best for small slabs under 1 cubic yard — fence posts, steps, and patches.
                Bags cost $5–$8 each, working out to $300–$480 per cubic yard. For larger
                slabs, mixing bags by hand is impractical.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
              <p className="text-sm font-bold text-gray-900">Ready-mix (truck delivery)</p>
              <p className="mt-1 text-2xl font-bold text-emerald-600">$120–$200 per cu yd</p>
              <p className="mt-1 text-xs text-gray-400">Plus delivery fee, typically $100–$200</p>
              <p className="mt-3 text-sm leading-relaxed text-gray-500">
                The right choice for anything over 1–2 cubic yards. Uniform mix, faster
                pour, lower cost at scale. For a standard 20×20 ft garage floor at 4 inches
                (≈5 cu yd), ready-mix saves significant time and money.
              </p>
            </div>
          </div>
          <p className="mt-5 text-sm text-gray-500">
            Need an exact bag count?{" "}
            <Link
              href="/construction-calculators/concrete/concrete-bag-calculator"
              className="font-semibold text-emerald-700 underline underline-offset-2 hover:text-emerald-900"
            >
              Use the concrete bag calculator →
            </Link>
          </p>
        </div>
      </section>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          THICKNESS GUIDE
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-12 md:py-16 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">Concrete slab thickness guide</h2>
          <p className="mt-3 text-sm text-gray-500">
            Getting thickness wrong is the most expensive concrete mistake. Use this as your
            quick reference before entering dimensions above.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { thick: "3–4 inches",  use: "Patios & walkways",     note: "Light foot traffic only" },
              { thick: "4–6 inches",  use: "Residential driveways", note: "Standard passenger vehicles" },
              { thick: "4–6 inches",  use: "Garage floors",         note: "Add rebar for vehicle weight" },
              { thick: "6–8+ inches", use: "Heavy loads",           note: "Trucks, RVs, commercial use" },
            ].map((row) => (
              <div key={row.use} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-lg font-bold text-emerald-600">{row.thick}</p>
                <p className="mt-1 text-sm font-semibold text-gray-800">{row.use}</p>
                <p className="mt-1 text-xs text-gray-400">{row.note}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-gray-500">
            A 6-inch slab uses 50% more concrete than a 4-inch slab of the same footprint.
            Always confirm thickness requirements with a contractor or structural engineer for
            load-bearing or structural applications.
          </p>
        </div>
      </section>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          COST SECTION
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="border-t border-gray-100 px-5 py-12 md:py-16 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl space-y-14">

          <div>
            <h2 className="text-2xl font-bold text-gray-900">How much does a concrete slab cost?</h2>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-gray-500">
              Installed concrete slab costs run <strong>$4–$15 per square foot</strong>,
              depending on thickness, finish, reinforcement, and local labour rates. Use
              the table below as a quick reference, then use the calculator above for a
              full project estimate.
            </p>
            <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Slab size</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">4&quot; thick</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">6&quot; thick</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    { size: "10×10 ft (100 sq ft)",  four: "$600–$1,500",    six: "$900–$2,000"    },
                    { size: "12×12 ft (144 sq ft)",  four: "$865–$2,160",    six: "$1,300–$2,880"  },
                    { size: "20×20 ft (400 sq ft)",  four: "$2,400–$6,000",  six: "$3,600–$8,000"  },
                    { size: "24×24 ft (576 sq ft)",  four: "$3,456–$8,640",  six: "$5,180–$11,520" },
                    { size: "30×30 ft (900 sq ft)",  four: "$5,400–$13,500", six: "$8,100–$18,000" },
                  ].map((row) => (
                    <tr key={row.size} className="bg-white">
                      <td className="px-5 py-3 font-medium text-gray-800">{row.size}</td>
                      <td className="px-5 py-3 text-gray-600">{row.four}</td>
                      <td className="px-5 py-3 text-gray-600">{row.six}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900">What affects concrete slab cost?</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                { icon: "📐", title: "Size and thickness",  desc: "The biggest cost driver. A 4-inch slab uses 1.23 cu yd per 100 sq ft. Doubling thickness nearly doubles material cost." },
                { icon: "🔩", title: "Reinforcement",       desc: "Wire mesh adds $0.15–$0.30/sq ft. Rebar adds $0.50–$1.50/sq ft but is required for driveways, foundations, and heavy loads." },
                { icon: "🎨", title: "Finish type",         desc: "Broom finish is cheapest. Exposed aggregate adds $2–$4/sq ft. Stamped or coloured concrete adds $8–$20+/sq ft." },
                { icon: "🚜", title: "Site preparation",    desc: "Excavation, gravel base, and formwork can add $1–$4/sq ft depending on access and soil conditions." },
                { icon: "📍", title: "Location",            desc: "Labour costs vary significantly. Urban areas and the Northeast/West Coast typically cost 20–40% more than rural Midwest." },
                { icon: "🏗️", title: "Accessibility",      desc: "Difficult access for concrete trucks or tight residential lots can add $500–$2,000 to the overall cost." },
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

        </div>
      </section>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          FAQ
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-12 md:py-16 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">Frequently asked questions</h2>
          <div className="mt-6 space-y-4">
            {[
              {
                q: "How much concrete do I need for a slab?",
                a: "Multiply length (ft) × width (ft) × thickness (in ÷ 12), then divide by 27 to get cubic yards. A 10×10 ft slab at 4 inches thick needs 1.23 cubic yards. Always add 10% for waste before ordering.",
              },
              {
                q: "How many bags of concrete do I need for a slab?",
                a: "An 80 lb bag covers about 0.45 cubic feet. You need roughly 60 bags per cubic yard. A 10×10 ft slab at 4 inches thick (1.23 cu yd) needs about 74 bags including 10% waste. For anything over 1–2 cubic yards, ready-mix is more practical.",
              },
              {
                q: "What thickness should a concrete slab be?",
                a: "Patios and walkways: 3–4 inches. Residential driveways: 4–6 inches. Garage floors: 4–6 inches. Heavy vehicles, commercial use, or high loads: 6–8 inches minimum. Always confirm with a contractor for structural applications.",
              },
              {
                q: "How do you calculate cubic yards of concrete?",
                a: "Formula: (Length ft × Width ft × Thickness in ÷ 12) ÷ 27. For example, a 20×20 ft slab at 4 inches thick = (20 × 20 × 0.333) ÷ 27 = 4.94 cubic yards. Add 10% for waste: 5.43 cubic yards to order.",
              },
              {
                q: "How much does a concrete slab cost per square foot?",
                a: "A basic concrete slab costs $4–$8 per square foot installed. With premium finishes, reinforcement, and site prep, costs can reach $12–$20+ per square foot.",
              },
              {
                q: "Can I pour a concrete slab myself?",
                a: "Small slabs under 50 sq ft are DIY-friendly with bagged concrete. Larger pours require a concrete truck, proper forming, and finishing skills. Mistakes in levelling or curing can cause cracking, so hiring a professional is usually worthwhile for driveways and foundations.",
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

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          DISCLAIMER
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="border-t border-gray-100 bg-white px-5 py-10 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm leading-relaxed text-gray-400">
            This calculator provides estimates for planning purposes only. Actual concrete
            quantities depend on ground conditions, form accuracy, pour technique, and
            material yield. Cost figures are approximate US national averages for 2026 and
            may not reflect local pricing. Always confirm quantities and costs with your
            supplier and contractor before ordering.
          </p>
        </div>
      </section>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          RELATED TOOLS
      â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-12 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-lg font-bold text-gray-900">Related Concrete Calculators</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Concrete Volume Calculator",    href: "/construction-calculators/concrete-calculator",                        note: "Get cubic yards for any slab" },
              { label: "Concrete Bag Calculator",       href: "/construction-calculators/concrete/concrete-bag-calculator",           note: "Exact bag count for your pour" },
              { label: "Concrete Slab Calculator (UK)", href: "/construction-calculators/concrete/concrete-slab-calculator-uk", note: "UK prices in \u00a3 and m\u00b2" },
              { label: "All Construction Calculators",  href: "/construction-calculators",                                    note: "Browse all construction tools" },
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
