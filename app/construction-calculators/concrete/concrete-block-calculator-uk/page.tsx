import type { Metadata } from "next";
import Link from "next/link";
import SimpleCalculatorShell from "@/components/calculators/SimpleCalculatorShell";
import ConcreteBlockCalculatorLoader from "../concrete-block-calculator/ConcreteBlockCalculatorLoader";

export const metadata: Metadata = {
  title: "Concrete Block Calculator UK – Work Out How Many Blocks You Need Instantly",
  description:
    "Work out how many concrete blocks you need for any UK wall. Enter length and height in metres and get instant results for block count and wall area.",
  keywords: [
    "concrete block calculator UK",
    "concrete blocks per m2",
    "how many blocks per m2",
    "block calculator wall UK",
    "blocks needed per square metre",
    "440mm block calculator",
    "breeze block calculator UK",
  ],
  alternates: {
    canonical:
      "https://worthulator.com/construction-calculators/concrete/concrete-block-calculator-uk",
  },
  robots: { index: true, follow: true },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Concrete Block Calculator UK",
    description:
      "Calculate how many 440 × 215 mm concrete blocks you need for any UK wall. Enter dimensions in metres to get block count and material cost estimate.",
    url: "https://worthulator.com/construction-calculators/concrete/concrete-block-calculator-uk",
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How many concrete blocks per m²?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A standard 440 × 215 mm block has a face area of 0.0946 m², so you need approximately 10.6 blocks per m² of wall face at exact volume. With a 5% waste factor, budget for 11 blocks per m².",
        },
      },
      {
        "@type": "Question",
        name: "How do I calculate how many blocks I need for a wall in the UK?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Multiply wall length (m) by wall height (m) to get wall area in m². Divide by 0.0946 (face area of a 440 × 215 mm block) and round up. Add a 5–10% waste factor for cuts, breakage, and corners.",
        },
      },
      {
        "@type": "Question",
        name: "What is the standard UK concrete block size?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The standard UK block is 440 × 215 mm face size (width × height), with a depth of 100, 140, or 215 mm depending on application. The 440 × 215 mm face dimension includes a 10 mm mortar joint, so the actual block is 430 × 205 mm.",
        },
      },
      {
        "@type": "Question",
        name: "How much do concrete blocks cost in the UK?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Standard 440 × 215 × 100 mm dense concrete blocks typically cost £1.50–£3 each at builders' merchants in 2025–2026. Lightweight aircrete blocks (Thermalite, Celcon) run £2–£4.50. Buying in full packs usually saves 10–15%.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between a dense block and a lightweight block?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Dense aggregate blocks are the strongest and most widely used for load-bearing inner and outer leaves. Lightweight aircrete blocks (such as Thermalite) offer better thermal performance and are easier to cut, but are less strong — typically used for inner leaf and partition walls.",
        },
      },
      {
        "@type": "Question",
        name: "Should I subtract openings when calculating blocks?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Calculate gross wall area, then subtract the area of each window and door opening (width × height in metres). Divide the net area by 0.0946 and apply the waste factor. This is especially important in UK housing where walls often have multiple windows.",
        },
      },
    ],
  },
];

const heroCard = (
  <div className="rounded-2xl border border-white/10 bg-slate-900 p-7 text-white shadow-2xl">
    <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
      Example — 6 × 2.4 m garden wall
    </p>
    <div className="mt-5 space-y-4">
      <div>
        <p className="text-4xl font-bold tracking-tight">153 blocks</p>
        <p className="text-sm font-semibold text-white/50">440 × 215 mm</p>
      </div>
      <div className="border-t border-white/10 pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-white/50">Wall area</span>
          <span className="font-semibold">14.4 m²</span>
        </div>
        <div className="mt-1 flex justify-between text-sm">
          <span className="text-white/50">+5% waste</span>
          <span className="font-semibold">160 ? round to 160</span>
        </div>
        <div className="mt-1 flex justify-between text-sm">
          <span className="text-white/50">Est. cost</span>
          <span className="font-semibold text-emerald-400">~£320</span>
        </div>
      </div>
    </div>
  </div>
);

export default function ConcreteBlockCalculatorUKPage() {
  return (
    <SimpleCalculatorShell
      jsonLd={jsonLd}
      category="United Kingdom · Construction"
      title="Concrete Block Calculator"
      subtitle="Calculate how many concrete blocks you need for any wall or footing, measured in metres."
      description={
        <>
          Enter your wall length and height in metres to calculate how many
          440 × 215 mm concrete blocks you need — including a waste allowance
          and estimated material cost in pounds.
        </>
      }
      heroCard={heroCard}
      calculator={<ConcreteBlockCalculatorLoader region="UK" />}
      insightText={
        <>
          A 6 × 2.4 m garden wall needs around{" "}
          <strong>160 × 440 mm blocks</strong> with 5% waste — roughly
          £320 in materials at £2 per block.
        </>
      }
    >

      {/* -- HOW TO CALCULATE ----------------------------------------------- */}
      <section className="border-t border-gray-100 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">
            How to calculate concrete blocks per m²
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">
            Working in metric makes the process clean. The face area of a standard
            440 × 215 mm block is just under 0.095 m², giving roughly 10–11 blocks
            per square metre of wall. Because UK drawings usually show wall heights
            as a number of courses or in millimetres, convert to metres before
            you start.
          </p>
          <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Step 1 — wall area
            </p>
            <p className="mt-2 font-mono text-sm text-gray-700">
              Wall area (m²) = Length (m) × Height (m)
            </p>
            <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-gray-400">
              Step 2 — blocks per m²
            </p>
            <p className="mt-2 font-mono text-sm text-gray-700">
              Blocks = Wall area ÷ Block face area (0.0946 m² for 440 × 215 mm)
            </p>
            <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-gray-400">
              Step 3 — apply waste factor
            </p>
            <p className="mt-2 font-mono text-sm text-gray-700">
              Final count = Blocks × (1 + waste%) — always round up
            </p>
          </div>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-gray-500">
            The 10 mm mortar joint is already built into the 440 × 215 mm nominal
            dimensions, so no separate adjustment is needed. For walls with openings,
            calculate gross area first, subtract each opening (width × height in
            metres), then divide the net area by 0.0946.
          </p>
        </div>
      </section>

      {/* -- WORKED EXAMPLE ------------------------------------------------- */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">
            Worked example: 8 × 2.5 m boundary wall
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">
            A full-height 8-metre boundary wall at 2.5 m is a common garden project
            in the UK. Here is how to work through the block count for standard
            440 × 215 mm dense aggregate blocks:
          </p>
          <div className="mt-6 space-y-3">
            {[
              { step: "1", label: "Calculate wall area",       value: "8 m × 2.5 m = 20 m²" },
              { step: "2", label: "Divide by face area",       value: "20 ÷ 0.0946 = 211.4 ? 212 blocks" },
              { step: "3", label: "Add 5% waste",              value: "212 × 1.05 = 222.6 ? 223 blocks" },
              { step: "4", label: "Estimate material cost",    value: "223 × £2 = £446" },
            ].map(({ step, label, value }) => (
              <div key={step} className="flex items-start gap-4 rounded-xl border border-gray-200 bg-white p-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                  {step}
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-700">{label}</p>
                  <p className="mt-0.5 font-mono text-sm text-gray-500">{value}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-gray-500">
            223 blocks is a reasonable half-day delivery from most UK builders&apos;
            merchants. If the wall also needs a concrete footing, use our{" "}
            <Link
              href="/construction-calculators/concrete-calculator-uk"
              className="font-semibold text-emerald-600 hover:text-emerald-700"
            >
              UK concrete calculator
            </Link>{" "}
            to calculate the footing volume in cubic metres.
          </p>
        </div>
      </section>

      {/* -- UK BLOCK SIZES ------------------------------------------------- */}
      <section className="border-t border-gray-100 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">
            UK concrete block sizes explained
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">
            UK blocks are specified by face dimensions (length × height) and depth.
            All common face sizes use the same 440 × 215 mm nominal dimension —
            the depth varies depending on structural requirements:
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              {
                size: "440 × 215 × 100 mm",
                coverage: "˜ 10.6 blocks / m²",
                note: "Standard depth for inner leaf of cavity walls and partition walls. The most commonly stocked block at UK merchants.",
              },
              {
                size: "440 × 215 × 140 mm",
                coverage: "˜ 10.6 blocks / m²",
                note: "Medium-duty block for outer leaf of cavity walls and below-DPC work. Same face area, more mass and compressive strength.",
              },
              {
                size: "440 × 215 × 215 mm",
                coverage: "˜ 10.6 blocks / m²",
                note: "Solid dense block used for single-skin retaining walls, free-standing boundary walls, and structural piers.",
              },
            ].map(({ size, coverage, note }) => (
              <div key={size} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-base font-bold text-emerald-600">{size}</p>
                <p className="mt-1 text-sm font-semibold text-gray-700">{coverage}</p>
                <p className="mt-3 text-xs leading-relaxed text-gray-400">{note}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-gray-500">
            Lightweight aircrete blocks (branded as Thermalite or Celcon) share the
            same 440 × 215 mm face but are significantly lighter and offer better
            thermal performance. They are used almost exclusively for inner leaf and
            partition work in UK housing.
          </p>
        </div>
      </section>

      {/* -- COST ----------------------------------------------------------- */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">
            How much do concrete blocks cost in the UK?
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">
            UK block prices vary by region, depth, and block type. These are
            approximate 2025–2026 figures at builders&apos; merchants:
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { type: "Dense aggregate (100 mm)", price: "£1.50–£3 / block",  note: "Most affordable. Standard choice for inner leaf, partitions, and boundary walls." },
              { type: "Dense aggregate (140/215 mm)", price: "£2.50–£5 / block", note: "Heavier-duty below-DPC and outer leaf blocks." },
              { type: "Lightweight aircrete", price: "£2–£4.50 / block",     note: "Thermalite or Celcon. Better thermal performance but lower compressive strength." },
            ].map(({ type, price, note }) => (
              <div key={type} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-bold text-gray-700">{type}</p>
                <p className="mt-1 text-xl font-bold text-emerald-600">{price}</p>
                <p className="mt-2 text-xs leading-relaxed text-gray-400">{note}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-gray-500">
            The calculator defaults to £2 per block — a reasonable mid-range for
            standard 100 mm dense blocks. Adjust in the &quot;Adjust waste &amp; price&quot;
            panel to match your merchant&apos;s quote. Full-pallet orders (typically
            72 or 108 blocks) almost always attract a per-block discount.
          </p>
        </div>
      </section>

      {/* -- DENSE VS LIGHTWEIGHT ------------------------------------------- */}
      <section className="border-t border-gray-100 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">
            Dense aggregate vs lightweight aircrete — which should you use?
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-bold text-gray-700">Dense aggregate blocks</p>
              <ul className="mt-3 space-y-2 text-sm text-gray-500">
                <li>• Higher compressive strength (typically 7–10 N/mm²)</li>
                <li>• Required below DPC and for free-standing walls</li>
                <li>• Heavier — allows hand-laying but harder on backs over large jobs</li>
                <li>• Lower thermal resistance</li>
                <li>• Cheaper per block in most cases</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-bold text-gray-700">Lightweight aircrete blocks</p>
              <ul className="mt-3 space-y-2 text-sm text-gray-500">
                <li>• Better thermal performance (meets Part L more easily)</li>
                <li>• Lighter — less fatigue on large housing projects</li>
                <li>• Easy to cut with a hand saw</li>
                <li>• Not suitable below DPC or in wet/exposed conditions</li>
                <li>• Slightly more expensive per block</li>
              </ul>
            </div>
          </div>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-gray-500">
            For domestic new-build inner leaves, lightweight aircrete is now the
            standard choice in the UK. For garden walls, retaining walls, and anything
            below ground, use dense aggregate. When in doubt, check the
            manufacturer&apos;s technical data sheet for the required compressive
            strength class.
          </p>
        </div>
      </section>

      {/* -- COMMON MISTAKES ------------------------------------------------ */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">
            Common mistakes on UK block wall projects
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "Entering height in mm instead of metres",
                body: "A 2,400 mm wall entered as 2400 m gives a nonsensical result. UK drawings commonly show heights in mm — divide by 1,000 before entering. 2,400 mm = 2.4 m.",
              },
              {
                title: "Not accounting for window and door openings",
                body: "A single 900 mm × 2,100 mm door opening is nearly 1.9 m² — about 20 blocks. Subtract all openings from the gross wall area before calculating, especially on house extension or garage projects.",
              },
              {
                title: "Ordering the wrong block depth",
                body: "Dense 100 mm blocks are stocked everywhere, but below-DPC work, outer leaves, and retaining walls typically require 140 mm or 215 mm blocks. Confirm the specification before ordering.",
              },
              {
                title: "Skipping the mortar and DPC costs",
                body: "Blocks are only part of the material cost. A full wall also needs mortar mix, DPC membrane, wall ties (for cavity walls), and often a concrete footing. Budget for all materials, not just the blocks.",
              },
            ].map(({ title, body }) => (
              <div key={title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-bold text-gray-700">{title}</p>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -- FAQ ------------------------------------------------------------ */}
      <section className="border-t border-gray-100 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">
            Frequently asked questions
          </h2>
          <div className="mt-6 space-y-4">
            {[
              {
                q: "How many concrete blocks per m²?",
                a: "A standard 440 × 215 mm block has a face area of 0.0946 m², giving approximately 10.6 blocks per m². With a 5% waste allowance, order 11 blocks per m² as a minimum.",
              },
              {
                q: "How many courses of blocks is 2.4 m?",
                a: "Each course of 215 mm nominal height blocks (including 10 mm mortar) is 225 mm. 2,400 mm ÷ 225 mm = 10.67, so 11 courses reaches 2.475 m. For an exact 2.4 m, 10 courses plus adjustment at the top is typically used.",
              },
              {
                q: "What is a breeze block in the UK?",
                a: "Breeze block is the colloquial UK term for any concrete masonry unit (CMU). Historically it referred to blocks made with coal ash (breeze), but modern UK 'breeze blocks' are dense aggregate or lightweight aircrete concrete blocks.",
              },
              {
                q: "Do I need planning permission for a block wall?",
                a: "In England and Wales, free-standing walls up to 1 m high adjacent to a highway or 2 m elsewhere generally don't need planning permission under permitted development. Always check with your local planning authority for boundary walls or anything structural.",
              },
              {
                q: "How many blocks are on a pallet in the UK?",
                a: "A standard pallet of 440 × 215 × 100 mm dense blocks typically contains 72 or 108 blocks depending on the supplier. Ordering full pallets is almost always cheaper per block than ordering loose.",
              },
              {
                q: "Can I use this calculator for an extension wall?",
                a: "Yes — calculate each wall of the extension separately. For a cavity wall, run the calculator twice: once for the outer leaf and once for the inner leaf, using the appropriate block type for each. Subtract window and door openings from each leaf independently.",
              },
            ].map(({ q, a }) => (
              <div key={q} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-sm font-semibold text-gray-800">{q}</p>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -- DISCLAIMER ----------------------------------------------------- */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-xl font-bold text-gray-800">Disclaimer</h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-400">
            This calculator provides estimates only and should be used for planning
            purposes. Actual quantities and costs may vary based on block tolerances,
            mortar joint thickness, site conditions, and local pricing. Always verify
            your order with your supplier before purchasing.
          </p>
        </div>
      </section>

      {/* -- RELATED -------------------------------------------------------- */}
      <section className="border-t border-gray-100 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-xl font-bold text-gray-800">Related calculators</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "Concrete Calculator (UK)",
                href: "/construction-calculators/concrete-calculator-uk",
                note: "Volume in m³ for slabs, footings & bases",
              },
              {
                label: "Concrete Bag Calculator (UK)",
                href: "/construction-calculators/concrete/concrete-bag-calculator-uk",
                note: "25 kg bags needed for any pour",
              },
              {
                label: "Concrete Block Calculator (US)",
                href: "/construction-calculators/concrete/concrete-block-calculator",
                note: "8×8×16 in CMU blocks · imperial dimensions",
              },
              {
                label: "All Construction Calculators",
                href: "/construction-calculators",
                note: "Browse the full set",
              },
            ].map(({ label, href, note }) => (
              <Link
                key={href}
                href={href}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <p className="text-sm font-semibold text-emerald-700">{label}</p>
                <p className="mt-1 text-xs text-gray-400">{note}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </SimpleCalculatorShell>
  );
}
