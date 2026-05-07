import type { Metadata } from "next";
import Link from "next/link";
import SimpleCalculatorShell from "@/components/calculators/SimpleCalculatorShell";
import ConcreteSlabCalculatorUKLoader from "./ConcreteSlabCalculatorUKLoader";
import RegionToggle from "@/components/RegionToggle";

export const metadata: Metadata = {
  title: "Concrete Slab Calculator UK – Work Out Volume, Bags & Cost in £ Instantly",
  description:
    "Work out exactly how much concrete you need for any slab in the UK. Enter dimensions in metres and millimetres to get instant m³ volume, 25 kg bag count, and installed cost in £.",
  keywords: [
    "concrete slab calculator uk",
    "how much concrete do i need uk",
    "concrete calculator uk m3",
    "how many bags of concrete uk",
    "concrete slab cost per m2 uk",
    "concrete driveway calculator uk",
    "concrete patio calculator uk 2026",
    "concrete slab thickness guide uk",
  ],
  alternates: {
    canonical:
      "https://worthulator.com/construction-calculators/concrete/concrete-slab-calculator-uk",
  },
  robots: { index: true, follow: true },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Concrete Slab Calculator UK – Volume, Bags & Cost",
    description:
      "Calculate cubic metres, 25 kg bag count, and installed cost in £ for concrete slabs – driveways, patios, and foundations.",
    url: "https://worthulator.com/construction-calculators/concrete/concrete-slab-calculator-uk",
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How much concrete do I need for a slab in the UK?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Multiply length (m) × width (m) × thickness (mm ÷ 1000) to get cubic metres. A 6×6 m slab at 100 mm thick needs 3.6 m³. Always add 10% for waste before ordering.",
        },
      },
      {
        "@type": "Question",
        name: "How many 25 kg bags of concrete do I need for a slab?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "One 25 kg bag yields approximately 0.012 m³ of mixed concrete, so you need around 83 bags per m³. A 6×6 m slab at 100 mm thick (3.6 m³) needs about 299 bags — or 329 bags including 10% waste.",
        },
      },
      {
        "@type": "Question",
        name: "What thickness should a concrete slab be in the UK?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Patios and footpaths: 75–100 mm. Residential driveways: 100–150 mm. Garage floors: 100–150 mm with A142 mesh. Commercial or heavy-vehicle areas: 150–200 mm minimum.",
        },
      },
      {
        "@type": "Question",
        name: "How do you calculate cubic metres of concrete?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Formula: Length (m) × Width (m) × (Thickness mm ÷ 1000). For example, a 6×6 m slab at 100 mm thick = 6 × 6 × 0.1 = 3.6 m³. Add 10% for waste: order 3.96 m³.",
        },
      },
      {
        "@type": "Question",
        name: "How much does a concrete slab cost per m² in the UK?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A basic brushed concrete slab in the UK costs £60–£100 per m² installed. Exposed aggregate adds £15–£25/m²; pattern-imprinted concrete adds £50–£80/m² on top of the base rate.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need planning permission for a concrete slab in the UK?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most garden patios and rear slabs do not require planning permission. However, a front driveway over 5 m² of impermeable concrete does — unless adequate drainage is provided. Always check with your local planning authority.",
        },
      },
    ],
  },
];

const heroCard = (
  <div className="rounded-2xl border border-gray-700 bg-gray-800/60 p-6">
    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
      Example — 6 × 6 m garage floor at 100 mm
    </p>
    <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
      <div>
        <p className="text-2xl font-bold text-white">3.60</p>
        <p className="mt-0.5 text-xs text-gray-400">cubic metres</p>
      </div>
      <div>
        <p className="text-2xl font-bold text-white">299</p>
        <p className="mt-0.5 text-xs text-gray-400">bags (25 kg)</p>
      </div>
      <div>
        <p className="text-2xl font-bold text-white">100 mm</p>
        <p className="mt-0.5 text-xs text-gray-400">thickness</p>
      </div>
      <div>
        <p className="text-2xl font-bold text-emerald-400">£2,100–£3,240</p>
        <p className="mt-0.5 text-xs text-gray-400">est. installed</p>
      </div>
    </div>
  </div>
);

export default function ConcreteSlabCalculatorUKPage() {
  return (
    <SimpleCalculatorShell
      jsonLd={jsonLd}
      category="Construction · Concrete"
      title="Concrete Slab Calculator"
      subtitle="Volume, Bags & Installed Cost (UK)"
      description={
        <>
          Enter your slab dimensions in metres and millimetres to get m³ volume,
          25 kg bag count, and a full installed cost estimate in £ – including
          finish type and reinforcement.{" "}
          <span className="mt-2 block text-sm text-gray-400">
            For planning purposes only. Verify quantities with your supplier before ordering.
          </span>
          <RegionToggle
            current="uk"
            usPath="/construction-calculators/concrete/concrete-slab-calculator"
            ukPath="/construction-calculators/concrete/concrete-slab-calculator-uk"
            theme="light"
          />
        </>
      }
      heroCard={heroCard}
      calculator={<ConcreteSlabCalculatorUKLoader />}
      insightText={
        <>
          A standard <strong>6 × 6 m garage floor at 100 mm</strong> needs 3.6 m³ of
          concrete – around £2,100–£3,240 installed with a brushed finish and A142
          mesh. Adding pattern-imprinted concrete and a deeper pour can push that to
          £6,000+.
        </>
      }
    >

      {/* ------------------------------------------------------------------
          KEYWORD INTRO
      ------------------------------------------------------------------ */}
      <section className="border-t border-gray-100 px-5 py-10 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <p className="max-w-3xl text-base leading-relaxed text-gray-600">
            Use this UK concrete slab calculator to work out how much concrete you need
            for any slab project. Enter your length, width, and thickness in metric units
            to get instant results for m³ volume, 25 kg bag count, and an installed
            cost estimate in £.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          HOW TO CALCULATE CONCRETE IN THE UK
      ------------------------------------------------------------------ */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-12 md:py-16 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">How to calculate concrete for a slab in the UK</h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">
            In the UK, concrete volume is measured in <strong>cubic metres (m³)</strong>.
            To work out how much you need, multiply the length, width, and thickness of
            your slab. Thickness is typically given in millimetres, so divide by 1,000
            to convert to metres before multiplying.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">
            Thickness is the most commonly underestimated variable. A 150 mm slab uses
            50% more concrete than a 100 mm slab of the same footprint – always confirm
            your structural requirements before calculating.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">
            For volume-only estimates without cost,{" "}
            <Link
              href="/construction-calculators/concrete-calculator"
              className="font-semibold text-emerald-700 underline underline-offset-2 hover:text-emerald-900"
            >
              use the concrete volume calculator
            </Link>{" "}
            to get m³ before moving on to pricing.
          </p>

          {/* Formula block */}
          <div className="mt-8">
            <h3 className="text-lg font-bold text-gray-900">UK concrete slab calculation formula</h3>
            <div className="mt-3 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Formula</p>
              <p className="mt-3 font-mono text-sm text-gray-700">
                Volume (m³) = Length (m) × Width (m) × (Thickness (mm) ÷ 1,000)
              </p>
            </div>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-gray-500">
              Dividing the thickness in millimetres by 1,000 converts it to metres.
              Multiply all three dimensions to get cubic metres. Always add{" "}
              <strong>10% for waste</strong> before placing your order.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {[
                { label: "3×3 m, 100 mm thick",  value: "0.90 m³",  bags: "˜75 bags" },
                { label: "6×6 m, 100 mm thick",  value: "3.60 m³",  bags: "˜299 bags" },
                { label: "6×6 m, 150 mm thick",  value: "5.40 m³",  bags: "ready-mix" },
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

      {/* ------------------------------------------------------------------
          BAGGED vs READY-MIX
      ------------------------------------------------------------------ */}
      <section className="border-t border-gray-100 px-5 py-12 md:py-16 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">Bagged concrete vs ready-mix in the UK</h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">
            For small garden slabs under 1 m³, bagged concrete from a builders&rsquo;
            merchant is practical. For anything larger, ready-mix delivered by truck is
            faster, cheaper per m³, and produces a more consistent mix.
          </p>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
              <p className="text-sm font-bold text-gray-900">Bagged concrete (DIY)</p>
              <p className="mt-1 text-2xl font-bold text-emerald-600">83 bags per m³</p>
              <p className="mt-1 text-xs text-gray-400">25 kg bags — ˜0.012 m³ each</p>
              <p className="mt-3 text-sm leading-relaxed text-gray-500">
                Ideal for slabs under 1 m³ – fence posts, steps, and small pads.
                25 kg bags cost £4–£7 each at builders&rsquo; merchants, working out to
                around £330–£580 per m³. For larger pours, hand-mixing is impractical
                and uneconomical.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
              <p className="text-sm font-bold text-gray-900">Ready-mix (truck delivery)</p>
              <p className="mt-1 text-2xl font-bold text-emerald-600">£80–£110 per m³</p>
              <p className="mt-1 text-xs text-gray-400">Plus delivery charge, typically £100–£200</p>
              <p className="mt-3 text-sm leading-relaxed text-gray-500">
                The right choice for anything over 1–2 m³. Consistent mix to spec
                (C20, C25, C30 or fibre-reinforced), faster pour, and lower cost at scale.
                A 6×6 m garage floor at 100 mm (˜3.6 m³) is a typical minimum
                ready-mix order.
              </p>
            </div>
          </div>
          <p className="mt-5 text-sm text-gray-500">
            Need an exact bag count?{" "}
            <Link
              href="/construction-calculators/concrete/concrete-bag-calculator"
              className="font-semibold text-emerald-700 underline underline-offset-2 hover:text-emerald-900"
            >
              Use the concrete bag calculator \u2192
            </Link>
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          THICKNESS GUIDE
      ------------------------------------------------------------------ */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-12 md:py-16 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">Concrete slab thickness guide (UK)</h2>
          <p className="mt-3 text-sm text-gray-500">
            Getting thickness wrong is the costliest concrete mistake. Use this as your
            quick reference before entering dimensions above.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { thick: "75–100 mm",  use: "Patios & footpaths",    note: "Light foot traffic only" },
              { thick: "100–150 mm", use: "Residential driveways", note: "Standard cars and vans" },
              { thick: "100–150 mm", use: "Garage floors",         note: "Add A142 mesh for vehicles" },
              { thick: "150–200 mm", use: "Heavy loads",           note: "HGVs, commercial, plant" },
            ].map((row) => (
              <div key={row.use} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-lg font-bold text-emerald-600">{row.thick}</p>
                <p className="mt-1 text-sm font-semibold text-gray-800">{row.use}</p>
                <p className="mt-1 text-xs text-gray-400">{row.note}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-gray-500">
            A 150 mm slab uses 50% more concrete than a 100 mm slab of the same area.
            For structural slabs and ground-bearing floors, always get your thickness
            specification from a structural engineer or follow Building Regulations
            Approved Document A.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          COST SECTION
      ------------------------------------------------------------------ */}
      <section className="border-t border-gray-100 px-5 py-12 md:py-16 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl space-y-14">

          <div>
            <h2 className="text-2xl font-bold text-gray-900">How much does a concrete slab cost in the UK?</h2>
            <p className="mt-3 max-w-3xl text-base leading-relaxed text-gray-500">
              Installed concrete slab costs in the UK run{" "}
              <strong>£60–£120 per m²</strong> for a standard brushed finish,
              depending on thickness, reinforcement, and local labour rates. Use the
              table below as a quick reference, then use the calculator above for a
              tailored estimate.
            </p>
            <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Slab area</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">100 mm thick</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">150 mm thick</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {[
                    { size: "9 m² (3×3 m)",   hun: "£540–£1,080",    six: "£810–£1,620" },
                    { size: "20 m² (4×5 m)",  hun: "£1,200–£2,400",  six: "£1,800–£3,600" },
                    { size: "36 m² (6×6 m)",  hun: "£2,160–£4,320",  six: "£3,240–£6,480" },
                    { size: "50 m² (5×10 m)", hun: "£3,000–£6,000",  six: "£4,500–£9,000" },
                    { size: "100 m²",              hun: "£6,000–£12,000", six: "£9,000–£18,000" },
                  ].map((row) => (
                    <tr key={row.size} className="bg-white">
                      <td className="px-5 py-3 font-medium text-gray-800">{row.size}</td>
                      <td className="px-5 py-3 text-gray-600">{row.hun}</td>
                      <td className="px-5 py-3 text-gray-600">{row.six}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900">What affects concrete slab cost in the UK?</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                { icon: "??", title: "Size and thickness",     desc: "The primary cost driver. A 100 mm slab uses 0.1 m³ per m². Moving to 150 mm adds 50% more material for the same footprint." },
                { icon: "??", title: "Reinforcement",          desc: "A142 steel mesh is standard for driveways and garage floors, adding roughly £3–£8/m². T10 rebar is required for structural ground-bearing slabs." },
                { icon: "??", title: "Finish type",            desc: "Brushed is cheapest. Exposed aggregate adds £15–£25/m². Pattern-imprinted (block-paving effect) adds £50–£80/m²." },
                { icon: "??", title: "Ground preparation",     desc: "Breaking out existing hardstanding, excavation, and laying a compacted MOT Type 1 sub-base can add £10–£30/m² depending on depth and access." },
                { icon: "??", title: "Location",               desc: "Labour costs vary significantly. London and the South East typically run 20–40% higher than the Midlands or the North." },
                { icon: "???", title: "Access & drainage",     desc: "Restricted access for a ready-mix truck can add £300–£1,000. Front driveways over 5 m² may require permeable edging or a drainage gulley under permitted development rules." },
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

      {/* ------------------------------------------------------------------
          FAQ
      ------------------------------------------------------------------ */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-12 md:py-16 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">Frequently asked questions</h2>
          <div className="mt-6 space-y-4">
            {[
              {
                q: "How much concrete do I need for a slab in the UK?",
                a: "Multiply length (m) × width (m) × (thickness in mm ÷ 1,000) to get cubic metres. A 6×6 m slab at 100 mm thick needs 3.6 m³. Always add 10% for waste before ordering.",
              },
              {
                q: "How many 25 kg bags of concrete do I need for a slab?",
                a: "One 25 kg bag yields roughly 0.012 m³, so you need around 83 bags per m³. A 6×6 m slab at 100 mm thick (3.6 m³) needs about 299 bags — 329 bags including 10% waste. For slabs over 1–2 m³, ready-mix is more practical.",
              },
              {
                q: "What thickness should a concrete slab be in the UK?",
                a: "Patios and footpaths: 75–100 mm. Residential driveways: 100–150 mm. Garage floors: 100–150 mm with A142 mesh. Heavy commercial or agricultural use: 150–200 mm minimum. Always confirm with a structural engineer for load-bearing applications.",
              },
              {
                q: "How do you calculate cubic metres of concrete?",
                a: "Formula: Length (m) × Width (m) × (Thickness mm ÷ 1,000). For example, a 6×6 m slab at 100 mm = 6 × 6 × 0.1 = 3.6 m³. Add 10% for waste: order 3.96 m³.",
              },
              {
                q: "How much does a concrete slab cost per m² in the UK?",
                a: "A standard brushed concrete slab costs £60–£100 per m² installed in 2026. Exposed aggregate adds roughly £15–£25/m²; pattern-imprinted concrete adds £50–£80/m². London and the South East typically cost 20–40% more.",
              },
              {
                q: "Do I need planning permission for a concrete slab in the UK?",
                a: "Most rear garden patios do not require planning permission. A front driveway over 5 m² of impermeable concrete does, unless you install adequate drainage or use a permeable surface. Always check with your local planning authority before starting.",
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

      {/* ------------------------------------------------------------------
          DISCLAIMER
      ------------------------------------------------------------------ */}
      <section className="border-t border-gray-100 bg-white px-5 py-10 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <p className="text-sm leading-relaxed text-gray-400">
            This calculator provides estimates for planning purposes only. Actual concrete
            quantities depend on ground conditions, form accuracy, pour technique, and
            material yield. Cost figures are approximate UK national averages for 2026 and
            may not reflect local pricing, VAT, or skip hire. Always confirm quantities
            and costs with your supplier and contractor before ordering.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          RELATED TOOLS
      ------------------------------------------------------------------ */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-12 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-lg font-bold text-gray-900">Related Concrete Calculators</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Concrete Volume Calculator",      href: "/construction-calculators/concrete-calculator",                          note: "Get m³ for any slab" },
              { label: "Concrete Bag Calculator",         href: "/construction-calculators/concrete/concrete-bag-calculator",             note: "Exact bag count for your pour" },
              { label: "Concrete Slab Calculator (US)",   href: "/construction-calculators/concrete/concrete-slab-calculator",            note: "US prices in $ and sq ft" },
              { label: "All Construction Calculators",    href: "/construction-calculators",                                              note: "Browse all construction tools" },
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
