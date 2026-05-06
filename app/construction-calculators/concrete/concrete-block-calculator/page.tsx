import type { Metadata } from "next";
import Link from "next/link";
import SimpleCalculatorShell from "@/components/calculators/SimpleCalculatorShell";
import ConcreteBlockCalculatorLoader from "./ConcreteBlockCalculatorLoader";

export const metadata: Metadata = {
  title: "Concrete Block Calculator – Work Out How Many Blocks You Need Instantly",
  description:
    "Work out how many concrete blocks you need for any wall. Enter length, height, and block size and get instant results for block count and material cost.",
  keywords: [
    "concrete block calculator",
    "how many concrete blocks do I need",
    "concrete block wall calculator",
    "blocks needed for wall",
    "concrete blocks per square foot",
    "cinder block calculator",
    "CMU block calculator",
  ],
  alternates: {
    canonical:
      "https://www.worthulator.com/construction-calculators/concrete/concrete-block-calculator",
  },
  robots: { index: true, follow: true },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Concrete Block Calculator",
    description:
      "Calculate how many 8×8×16 inch concrete blocks you need for any wall. Enter dimensions, select block size, and get block count plus material cost estimate.",
    url: "https://www.worthulator.com/construction-calculators/concrete/concrete-block-calculator",
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How many concrete blocks do I need per square foot?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A standard 8×8×16 inch concrete block has a face area of approximately 0.889 square feet. That means you need about 1.125 blocks per square foot of wall area, or roughly 113 blocks per 100 square feet before waste.",
        },
      },
      {
        "@type": "Question",
        name: "How do I calculate how many concrete blocks I need?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Multiply wall length (ft) by wall height (ft) to get the total wall area in square feet. Divide that by the block face area (0.889 sq ft for an 8×16 face) and round up. Add a 5–10% waste factor for cuts and breakage.",
        },
      },
      {
        "@type": "Question",
        name: "What is the standard concrete block size in the US?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The most common US block is the 8×8×16 inch CMU (concrete masonry unit). The actual dimensions are 7⅝ × 7⅝ × 15⅝ inches — the nominal size includes a 3/8-inch mortar joint. Other common sizes include 8×4×16 (half block) and 12×8×16.",
        },
      },
      {
        "@type": "Question",
        name: "How much do concrete blocks cost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Standard 8×8×16 inch CMU blocks typically cost $2–$4 each at building suppliers and big-box stores in 2025–2026. Specialty blocks (split face, lightweight) run $4–$8. Buying in full pallets usually cuts cost by 10–15%.",
        },
      },
      {
        "@type": "Question",
        name: "Why do I need a waste factor for block work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Block walls almost always require cuts around openings, at corners, and at the end of courses. Breakage during handling and transport adds more loss. A 5% waste allowance is typical for straightforward walls; use 10% for walls with multiple openings or complex layouts.",
        },
      },
      {
        "@type": "Question",
        name: "Should I subtract window and door openings?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes — for accuracy, calculate the area of each opening (width × height) and subtract it from the total wall area before calculating blocks. The calculator works on gross wall area, so deduct openings manually for large projects.",
        },
      },
    ],
  },
];

const heroCard = (
  <div className="rounded-2xl border border-white/10 bg-slate-900 p-7 text-white shadow-2xl">
    <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
      Example — 20 × 8 ft garage wall
    </p>
    <div className="mt-5 space-y-4">
      <div>
        <p className="text-4xl font-bold tracking-tight">180 blocks</p>
        <p className="text-sm font-semibold text-white/50">8″ × 8″ × 16″ CMU</p>
      </div>
      <div className="border-t border-white/10 pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-white/50">Wall area</span>
          <span className="font-semibold">160 sq ft</span>
        </div>
        <div className="mt-1 flex justify-between text-sm">
          <span className="text-white/50">+5% waste</span>
          <span className="font-semibold">189 → round to 189</span>
        </div>
        <div className="mt-1 flex justify-between text-sm">
          <span className="text-white/50">Est. cost</span>
          <span className="font-semibold text-emerald-400">~$540</span>
        </div>
      </div>
    </div>
  </div>
);

export default function ConcreteBlockCalculatorPage() {
  return (
    <SimpleCalculatorShell
      jsonLd={jsonLd}
      category="Construction · Concrete Tools"
      title="Concrete Block Calculator"
      subtitle="Work out how many concrete blocks you need instantly for walls, footings, and builds."
      description={
        <>
          Enter your wall length, height, and block size to instantly calculate how
          many concrete blocks you need — with a waste allowance and material cost
          estimate included.
        </>
      }
      heroCard={heroCard}
      calculator={<ConcreteBlockCalculatorLoader region="US" />}
      insightText={
        <>
          A 20 × 8 ft garage wall needs around{" "}
          <strong>180 × 8″ CMU blocks</strong> including 5% waste — roughly $540
          in materials at $3 per block.
        </>
      }
    >

      {/* ── HOW TO CALCULATE ─────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">
            How to calculate how many concrete blocks you need
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">
            The calculation is straightforward: work out the wall face area, divide
            by the face area of one block, and round up. The only number that trips
            people up is the block face area — remember that the nominal 8 × 16 inch
            dimension already includes a ⅜-inch mortar joint on each side, so the
            actual coverage is very close to the nominal figure.
          </p>
          <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Step 1 — wall area
            </p>
            <p className="mt-2 font-mono text-sm text-gray-700">
              Wall area (sq ft) = Length (ft) × Height (ft)
            </p>
            <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-gray-400">
              Step 2 — blocks needed
            </p>
            <p className="mt-2 font-mono text-sm text-gray-700">
              Blocks = Wall area ÷ Block face area (0.889 sq ft for 8×16)
            </p>
            <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-gray-400">
              Step 3 — apply waste factor
            </p>
            <p className="mt-2 font-mono text-sm text-gray-700">
              Final count = Blocks × (1 + waste%) — always round up
            </p>
          </div>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-gray-500">
            For a clean wall with no openings this gives an accurate result. For walls
            with windows or doors, calculate the gross wall area first, then subtract
            each opening area before dividing by the block face area.
          </p>
        </div>
      </section>

      {/* ── WORKED EXAMPLE ───────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">
            Worked example: 24 × 6 ft retaining wall
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">
            A 24-foot retaining wall at 6 feet high is a typical residential project —
            a garden terrace or low retaining structure. Here is how to work through
            the block count step by step using standard 8 × 8 × 16 inch CMU blocks:
          </p>
          <div className="mt-6 space-y-3">
            {[
              { step: "1", label: "Calculate wall area",      value: "24 ft × 6 ft = 144 sq ft" },
              { step: "2", label: "Divide by block face area", value: "144 ÷ 0.889 = 161.9 → 162 blocks" },
              { step: "3", label: "Add 5% waste",             value: "162 × 1.05 = 170.1 → 171 blocks" },
              { step: "4", label: "Estimate material cost",   value: "171 × $3 = $513" },
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
            That&apos;s a manageable block order. Note that this figure is for blocks
            only — a retaining wall also needs rebar, grout fill, footing concrete,
            and drainage material. Use our{" "}
            <Link
              href="/construction-calculators/concrete-calculator"
              className="font-semibold text-emerald-600 hover:text-emerald-700"
            >
              concrete calculator
            </Link>{" "}
            to size the footing pour separately.
          </p>
        </div>
      </section>

      {/* ── US BLOCK SIZES ───────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">
            Standard US concrete block sizes
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">
            Concrete masonry units (CMUs) in the US are specified by nominal
            dimensions that include the mortar joint. The actual block is ⅜ inch
            smaller on each face. The most common sizes you&apos;ll find at any
            masonry supplier:
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              {
                name: "8 × 8 × 16 in",
                coverage: "≈ 0.889 sq ft / block",
                note: "The standard block. Used for foundations, basements, retaining walls, and load-bearing walls. Most widely available and cheapest per block.",
              },
              {
                name: "8 × 4 × 16 in",
                coverage: "≈ 0.444 sq ft / block",
                note: "Half block (course closer). Used at corners and as course starters. Same 16-inch face length, half the height — maintains running bond at transitions.",
              },
              {
                name: "12 × 8 × 16 in",
                coverage: "≈ 0.889 sq ft / block",
                note: "Heavy-duty block for thicker walls and load-bearing applications. Same face area as 8×8×16 but 12-inch width — used where higher compressive strength or extra wall thickness is specified.",
              },
            ].map(({ name, coverage, note }) => (
              <div key={name} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-base font-bold text-emerald-600">{name}</p>
                <p className="mt-1 text-sm font-semibold text-gray-700">{coverage}</p>
                <p className="mt-3 text-xs leading-relaxed text-gray-400">{note}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-gray-500">
            If your project uses a non-standard block size, measure the actual block
            face (height × length in inches), convert to square feet by dividing by
            144, and enter the cost-per-block manually in the calculator&apos;s
            advanced panel.
          </p>
        </div>
      </section>

      {/* ── COST ─────────────────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">
            How much do concrete blocks cost in the US?
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">
            Prices vary by region and supplier but these are typical 2025–2026 ranges
            at masonry yards and big-box stores:
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { type: "Standard 8×8×16 CMU", price: "$2–$4 / block",    note: "Most widely available. Pallet discounts common at 100+ units." },
              { type: "Split-face or decorative", price: "$4–$8 / block", note: "Textured finish for exposed walls. Higher labour cost too." },
              { type: "Installed cost (labour + materials)", price: "$10–$20 / sq ft", note: "Masonry contractor rates for block wall construction, full install." },
            ].map(({ type, price, note }) => (
              <div key={type} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-bold text-gray-700">{type}</p>
                <p className="mt-1 text-xl font-bold text-emerald-600">{price}</p>
                <p className="mt-2 text-xs leading-relaxed text-gray-400">{note}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-gray-500">
            The calculator defaults to $3 per block — a reasonable mid-range for
            standard CMU. Update this in the &quot;Adjust waste &amp; price&quot;
            panel to match your supplier&apos;s quote. Always get at least two quotes
            and ask about pallet pricing if you&apos;re buying 200 blocks or more.
          </p>
        </div>
      </section>

      {/* ── COMMON MISTAKES ──────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">
            Common mistakes when calculating concrete blocks
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "Not accounting for openings",
                body: "Door and window openings reduce the block count significantly. A single 36-inch door opening in an 8-foot wall removes about 24 square feet — nearly 27 blocks. Always subtract openings from gross wall area.",
              },
              {
                title: "Forgetting the waste factor",
                body: "Block walls always have cut blocks at corners, around openings, and at course ends. Without a waste factor you will almost certainly run short. 5% is a minimum; use 10% for complex walls with multiple openings.",
              },
              {
                title: "Confusing nominal and actual dimensions",
                body: "Nominal 8×16 blocks are actually 7⅝ × 15⅝ inches. The nominal size is used for calculator purposes because it already includes the mortar joint. Don't mix nominal and actual measurements in the same calculation.",
              },
              {
                title: "Buying for one wall and forgetting others",
                body: "Run the calculator separately for each wall of a structure and add the totals. Garage walls, basement walls, and interior partitions all have different dimensions and opening layouts.",
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

      {/* ── WHERE IT'S USED ──────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">
            Where this calculator is used
          </h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { label: "Garage foundations",       note: "CMU perimeter walls on poured footings" },
              { label: "Basement walls",           note: "Below-grade block construction" },
              { label: "Retaining walls",          note: "Garden terracing and slope stabilisation" },
              { label: "Privacy walls & fences",   note: "Boundary and screen walls" },
              { label: "Outbuilding bases",        note: "Workshops, sheds, storage structures" },
              { label: "Commercial structures",    note: "Tilt-up and load-bearing CMU buildings" },
            ].map(({ label, note }) => (
              <div key={label} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-gray-700">{label}</p>
                <p className="mt-0.5 text-xs text-gray-400">{note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">
            Frequently asked questions
          </h2>
          <div className="mt-6 space-y-4">
            {[
              {
                q: "How many concrete blocks per square foot?",
                a: "A standard 8×8×16 CMU covers 0.889 square feet of wall face, meaning you need about 1.125 blocks per square foot, or 113 blocks per 100 square feet before any waste allowance.",
              },
              {
                q: "How do I calculate blocks needed for a wall?",
                a: "Multiply wall length by height (in feet) to get square footage. Divide by 0.889 for 8×16 blocks and round up. Add 5–10% for waste. The calculator above does this automatically.",
              },
              {
                q: "What size are standard US concrete blocks?",
                a: "The standard CMU is nominally 8×8×16 inches, with actual dimensions of 7⅝×7⅝×15⅝ inches. The nominal size includes a 3/8-inch mortar joint on three faces.",
              },
              {
                q: "Do I need to subtract doors and windows?",
                a: "Yes. Calculate gross wall area first, subtract the area of all openings, then divide the net area by the block face area. The calculator works on the area you enter — deduct openings manually.",
              },
              {
                q: "Is a cinder block the same as a concrete block?",
                a: "Technically no — original cinder blocks used coal ash aggregate while concrete blocks (CMUs) use stone or sand aggregate. In everyday US usage the terms are interchangeable; virtually all modern 'cinder blocks' sold today are concrete masonry units.",
              },
              {
                q: "How many blocks do I need for a 100 square foot wall?",
                a: "Using 8×8×16 blocks: 100 ÷ 0.889 = 112.5, round up to 113 blocks at exact volume. With a 5% waste factor: 119 blocks. With 10% waste: 125 blocks.",
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

      {/* ── DISCLAIMER ───────────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-xl font-bold text-gray-800">Disclaimer</h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-400">
            This calculator provides estimates only and should be used for planning
            purposes. Actual quantities and costs may vary based on block size
            tolerances, mortar joint thickness, site conditions, and local pricing.
            Always verify your order with your supplier before purchasing.
          </p>
        </div>
      </section>

      {/* ── RELATED ──────────────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-xl font-bold text-gray-800">Related calculators</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "Concrete Calculator",
                href: "/construction-calculators/concrete-calculator",
                note: "Volume in cubic yards for slabs & footings",
              },
              {
                label: "Concrete Bag Calculator",
                href: "/construction-calculators/concrete/concrete-bag-calculator",
                note: "40/60/80 lb bags needed for any pour",
              },
              {
                label: "Concrete Block Calculator UK",
                href: "/construction-calculators/concrete/concrete-block-calculator-uk",
                note: "440 × 215 mm blocks · metric dimensions",
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
