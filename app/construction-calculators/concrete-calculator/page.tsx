import type { Metadata } from "next";
import Link from "next/link";
import SimpleCalculatorShell from "@/components/calculators/SimpleCalculatorShell";
import ConcreteCalculatorLoader from "./ConcreteCalculatorLoader";
import RegionToggle from "@/components/RegionToggle";

export const metadata: Metadata = {
  title: "Concrete Volume Calculator – Work Out How Many Cubic Yards You Need Instantly",
  description:
    "Work out how much concrete you need in cubic yards. Enter length, width, and thickness and get instant results for volume and bag count.",
  keywords: [
    "concrete calculator",
    "cubic yards of concrete calculator",
    "concrete slab calculator",
    "how much concrete do I need",
    "concrete bag calculator",
    "cubic yard concrete",
    "how many bags of concrete",
    "concrete cost per cubic yard",
  ],
  alternates: {
    canonical: "https://worthulator.com/construction-calculators/concrete-calculator",
  },
  robots: { index: true, follow: true },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Concrete Calculator (US)",
    description:
      "Calculate how much concrete you need in cubic yards. Enter length, width, and thickness for slabs, driveways, or footings.",
    url: "https://worthulator.com/construction-calculators/concrete-calculator",
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I calculate cubic yards of concrete?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Multiply length (ft) × width (ft) × thickness (ft — divide inches by 12) to get cubic feet, then divide by 27 to get cubic yards. Add 10% for waste. For example: a 20 × 12 ft slab at 4 in = (20 × 12 × 0.333) ÷ 27 = 2.96 cubic yards.",
        },
      },
      {
        "@type": "Question",
        name: "How many 80 lb bags of concrete per cubic yard?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "About 60 bags. An 80 lb bag yields roughly 0.45 cubic feet, and a cubic yard is 27 cubic feet (27 ÷ 0.45 = 60). Always buy at least 10% extra — that's 66 bags per cubic yard.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between cubic feet and cubic yards?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "One cubic yard equals exactly 27 cubic feet (3 ft × 3 ft × 3 ft). Ready-mix suppliers quote in cubic yards. If your calculation gives cubic feet, divide by 27 before ordering.",
        },
      },
      {
        "@type": "Question",
        name: "How thick should a concrete slab be?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Residential driveways: 4 inches minimum, 6 inches for heavy vehicles. Patios and walkways: 3–4 inches. Garage floors: 4–6 inches. Footings vary by soil type and structural load.",
        },
      },
      {
        "@type": "Question",
        name: "What does a yard of concrete cost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ready-mix typically costs $120–200 per cubic yard plus a delivery charge of $100–200. Bagged concrete (80 lb at $5–8 each) works out to $300–480 per equivalent cubic yard — only cost-effective for small pours under 1 yard.",
        },
      },
      {
        "@type": "Question",
        name: "When should I order ready-mix instead of bags?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "At 1.5 cubic yards or more, ready-mix is usually cheaper and faster. Mixing 90 bags by hand takes hours and risks inconsistent strength. Ready-mix ensures a uniform pour.",
        },
      },
    ],
  },
];

const heroCard = (
  <div className="rounded-2xl border border-white/10 bg-slate-900 p-7 text-white shadow-2xl">
    <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
      Example — 12 × 10 ft driveway
    </p>
    <div className="mt-5 space-y-1">
      <p className="text-4xl font-bold tracking-tight">1.48</p>
      <p className="text-sm font-semibold text-white/50">cubic yards</p>
    </div>
    <div className="mt-6 space-y-2 border-t border-white/10 pt-5 text-sm">
      <div className="flex justify-between">
        <span className="text-white/50">Bags (exact)</span>
        <span className="font-semibold">89 × 80 lb</span>
      </div>
      <div className="flex justify-between">
        <span className="text-white/50">With 10% waste</span>
        <span className="font-semibold">98 bags</span>
      </div>
      <div className="flex justify-between">
        <span className="text-white/50">Thickness</span>
        <span className="font-semibold">4 in</span>
      </div>
    </div>
  </div>
);

export default function ConcreteCalculatorPage() {
  return (
    <SimpleCalculatorShell
      jsonLd={jsonLd}
      category="Construction · Materials"
      title="Concrete Calculator"
      subtitle="Calculate cubic yards for slabs, driveways, footings, and pours."
      description={
        <>
          Enter your slab dimensions and get the concrete volume in cubic yards plus
          the number of 80 lb bags you need — instantly.{" "}
          <span className="mt-2 block text-sm text-gray-400">
            For educational purposes only. Always verify with your supplier before ordering.
          </span>
          <RegionToggle
            current="us"
            usPath="/construction-calculators/concrete-calculator"
            ukPath="/construction-calculators/concrete-calculator-uk"
            theme="light"
          />
        </>
      }
      heroCard={heroCard}
      calculator={<ConcreteCalculatorLoader region="US" />}
      insightText={
        <>
          A standard 4-inch driveway at{" "}
          <strong>12 × 10 ft needs about 1.5 cubic yards</strong> — roughly 90 bags.
          Always order 10% extra to allow for spillage and waste.
        </>
      }
    >
      {/* ------------------------------------------------------------------
          POSITIONING LINE + KEYWORD INTRO
      ------------------------------------------------------------------ */}
      <section className="border-t border-gray-100 px-5 py-10 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-orange-500">
            Concrete Calculator &amp; Tools Hub
          </p>
          <p className="mt-1.5 text-sm text-gray-400">
            Calculate concrete volume, estimate materials, and plan costs — all in one place.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-600">
            Use this concrete calculator to estimate how many cubic yards of concrete
            you need for slabs, driveways, patios, and footings. Enter your dimensions
            to quickly calculate volume, number of bags, and rough cost.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          HOW MUCH CONCRETE DO I NEED?
      ------------------------------------------------------------------ */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-12 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">How much concrete do I need?</h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">
            Concrete is measured and sold in <strong>cubic yards</strong> in the US.
            One cubic yard equals 27 cubic feet — roughly a 3 ft × 3 ft × 3 ft cube.
            To find your number, you multiply the length, width, and thickness of your
            pour, then divide by 27.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">
            <strong>Thickness has a big impact.</strong> A standard 4-inch slab and a
            6-inch slab of the same footprint require 50% more concrete. Always confirm
            your thickness requirement before calculating — driveways typically need
            4–6 inches, patios 3–4 inches, and footings vary by structural load.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">
            For small pours under 1 cubic yard, <strong>bagged concrete</strong> (Quikrete,
            Sakrete) is the practical choice. For anything larger — driveways, garage
            floors, foundations — ordering <strong>ready-mix by the yard</strong> is
            faster, more consistent, and usually cheaper per cubic yard.
          </p>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          SECTION 1 — CONCRETE VOLUME CALCULATORS
      ------------------------------------------------------------------ */}
      <section className="border-t border-gray-100 px-5 py-12 md:py-16 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">Concrete Volume Calculators</h2>
          <p className="mt-2 text-sm text-gray-500">
            Work out how much concrete you need — in cubic yards, cubic feet, or bags.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Concrete Slab Calculator",
                desc: "Calculate volume for slabs, driveways, patios, and garage floors.",
                cta: "Calculate volume",
                href: "/construction-calculators/concrete/concrete-slab-calculator",
              },
              {
                title: "Concrete Bag Calculator",
                desc: "Find out exactly how many 40, 60, or 80 lb bags you need.",
                cta: "Calculate bags",
                href: "/construction-calculators/concrete/concrete-bag-calculator",
              },
              {
                title: "Concrete Block Calculator",
                desc: "Count how many CMU blocks you need for any wall.",
                cta: "Calculate blocks",
                href: "/construction-calculators/concrete/concrete-block-calculator",
              },
            ].map((tool) => (
              <div key={tool.title} className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                <h3 className="text-sm font-bold text-gray-900">{tool.title}</h3>
                <p className="mt-1.5 flex-1 text-xs leading-relaxed text-gray-500">{tool.desc}</p>
                <Link
                  href={tool.href}
                  className="mt-4 inline-flex items-center justify-center rounded-xl bg-gray-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-gray-700"
                >
                  {tool.cta} ?
                </Link>
              </div>
            ))}
          </div>

          {/* Extra links under volume section */}
          <div className="mt-6 flex flex-wrap gap-3">
            {[
              { label: "Concrete Driveway Cost", href: "/construction-calculators/concrete/concrete-driveway-cost" },
              { label: "Concrete Patio Cost",    href: "/construction-calculators/concrete/concrete-patio-cost" },
              { label: "Concrete Cost Per Yard", href: "/construction-calculators/concrete/concrete-cost-per-yard" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-semibold text-gray-600 shadow-sm transition hover:border-emerald-200 hover:text-emerald-700"
              >
                {l.label} ?
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          SECTION 2 — CONCRETE COST CALCULATORS
      ------------------------------------------------------------------ */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-12 md:py-16 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">Concrete Cost Calculators</h2>
          <p className="mt-2 text-sm text-gray-500">
            Find out what concrete will cost — by yard, square foot, or project type.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Concrete Slab Cost Calculator",
                desc: "Full installed cost estimate — volume, bags, labour, finish, and reinforcement.",
                href: "/construction-calculators/concrete/concrete-slab-calculator",
              },
              {
                title: "Concrete Cost Per Yard",
                desc: "See what ready-mix costs per cubic yard in your area, with delivery and waste.",
                href: "/construction-calculators/concrete/concrete-cost-per-yard",
              },
              {
                title: "Concrete Driveway Cost",
                desc: "Estimate the total cost of a concrete driveway — from pour to finished surface.",
                href: "/construction-calculators/concrete/concrete-driveway-cost",
              },
              {
                title: "Concrete Patio Cost",
                desc: "Work out what a concrete patio will cost — size, thickness, and finish options.",
                href: "/construction-calculators/concrete/concrete-patio-cost",
              },
            ].map((tool) => (
              <div key={tool.title} className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md">
                <h3 className="text-sm font-bold text-gray-900">{tool.title}</h3>
                <p className="mt-1.5 flex-1 text-xs leading-relaxed text-gray-500">{tool.desc}</p>
                <Link
                  href={tool.href}
                  className="mt-4 inline-flex items-center justify-center rounded-xl bg-orange-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-orange-600"
                >
                  Estimate cost ?
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          CONCRETE CALCULATORS EXPLAINED
      ------------------------------------------------------------------ */}
      <section className="border-t border-gray-100 px-5 py-12 md:py-16 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">Concrete Calculators Explained</h2>
          <p className="mt-2 text-sm text-gray-500">
            Quick guide to each calculator — what it does and when to use it.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-bold text-gray-900">Concrete Slab Calculator</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                Estimates the volume of concrete needed for flat, rectangular pours —
                driveways, patios, garage floors, and walkways. Enter length, width, and
                thickness to get your result in cubic yards. This is the most common
                starting point for any concrete project. Use it before calling a supplier
                to know exactly how much to order.
              </p>
              <Link href="/construction-calculators/concrete-calculator" className="mt-4 inline-block text-xs font-semibold text-emerald-700 hover:underline">
                Calculate concrete volume ?
              </Link>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-bold text-gray-900">Concrete Bag Calculator</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                Tells you how many 40, 60, or 80 lb bags of premix you need for your
                project. An 80 lb bag covers roughly 0.45 cubic feet — useful for small
                pours, repairs, and fence post holes. For anything over 1–2 cubic yards,
                ready-mix is usually cheaper and faster. Use the bag calculator for
                precise counts before your next hardware store run.
              </p>
              <Link href="/construction-calculators/concrete/concrete-bag-calculator" className="mt-4 inline-block text-xs font-semibold text-emerald-700 hover:underline">
                Calculate bags ?
              </Link>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-bold text-gray-900">Concrete Block Calculator</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                Counts how many CMU (concrete masonry unit) blocks you need to build a
                wall to a given height and length. Standard US blocks measure 8×8×16
                inches. Enter your wall dimensions and the calculator handles the count,
                including a standard 10% waste buffer. Ideal for retaining walls,
                foundations, and block fencing.
              </p>
              <Link href="/construction-calculators/concrete/concrete-block-calculator" className="mt-4 inline-block text-xs font-semibold text-emerald-700 hover:underline">
                Calculate blocks ?
              </Link>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-bold text-gray-900">Concrete Cost Per Yard</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                Ready-mix concrete in the US typically runs $120–200 per cubic yard,
                plus a delivery fee of $100–200. Bagged concrete works out to $300–480
                per yard equivalent — cost-effective only for small pours under one yard.
                Your final project cost also depends on labor, forming, and finishing.
                Use a cost calculator to build a complete estimate.
              </p>
              <Link href="/construction-calculators/concrete/concrete-slab-calculator" className="mt-4 inline-block text-xs font-semibold text-emerald-700 hover:underline">
                Estimate concrete cost ?
              </Link>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-bold text-gray-900">Concrete Cost Per Square Foot</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                Installed concrete costs $4–12 per square foot for most residential
                projects. Thickness matters — a 6-inch slab costs roughly 33% more than
                a 4-inch slab of the same footprint. Decorative finishes, colored
                concrete, and stamped patterns add significantly to this figure. Use a
                concrete slab cost calculator with your square footage and thickness for
                a reliable estimate.
              </p>
              <Link href="/construction-calculators/concrete/concrete-slab-calculator" className="mt-4 inline-block text-xs font-semibold text-emerald-700 hover:underline">
                Calculate slab cost ?
              </Link>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-bold text-gray-900">Concrete Driveway Cost</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                A concrete driveway typically costs $4–10 per square foot installed, or
                $3,000–7,500 for a standard two-car driveway. Cost depends on slab
                thickness, local labor rates, removal of existing material, and finish
                type. Stamped and colored concrete add $3–12 per square foot. Always
                get at least two quotes from local contractors before committing.
              </p>
              <Link href="/construction-calculators/concrete/concrete-driveway-cost" className="mt-4 inline-block text-xs font-semibold text-emerald-700 hover:underline">
                Estimate driveway cost ?
              </Link>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-bold text-gray-900">Concrete Patio Cost</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                A concrete patio costs $3,000–5,500 on average for a 300 sq ft slab, or
                roughly $6–12 per square foot installed. Stamped and decorative concrete
                can push that to $15–25 per square foot. A basic broom-finish patio is
                the most affordable option. Use a concrete slab cost calculator to
                estimate your patio before budgeting for the full project.
              </p>
              <Link href="/construction-calculators/concrete/concrete-patio-cost" className="mt-4 inline-block text-xs font-semibold text-emerald-700 hover:underline">
                Estimate patio cost ?
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------
          SECTION 3 — EDUCATIONAL CONTENT
      ------------------------------------------------------------------ */}

      {/* -- HOW TO CALCULATE IN CUBIC YARDS ------------------------------- */}
      <section className="border-t border-gray-100 px-5 py-12 md:py-16 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">
            How to calculate concrete in cubic yards
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">
            All concrete in the US is ordered and priced by the cubic yard. To find the
            volume you need, multiply the length and width of your slab (both in feet)
            by the thickness. Because thickness is usually given in inches, divide it
            by 12 first to convert to feet. That gives you cubic feet.
          </p>
          <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Formula</p>
            <p className="mt-3 font-mono text-sm text-gray-700">
              Cubic yards = (Length ft × Width ft × Thickness in ÷ 12) ÷ 27
            </p>
          </div>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-gray-500">
            It helps to think of it in two steps: first get cubic feet, then convert.
            A slab that is 10 ft × 10 ft × 4 inches thick contains 33.3 cubic feet.
            Divide by 27 and you get 1.23 cubic yards. That&apos;s a manageable amount
            to mix by hand — use the{" "}
            <Link href="/construction-calculators/concrete/concrete-bag-calculator" className="font-semibold text-emerald-700 underline underline-offset-2 hover:text-emerald-900">
              concrete bag calculator
            </Link>{" "}
            to get the exact bag count for your project.
          </p>
        </div>
      </section>

      {/* -- WORKED EXAMPLE ------------------------------------------------ */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">
            Worked example: 20 × 12 ft driveway slab
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">
            Say you&apos;re pouring a driveway that is 20 feet long, 12 feet wide, and
            4 inches thick — a common residential size. Here&apos;s the step-by-step:
          </p>
          <div className="mt-6 space-y-3">
            {[
              { step: "1", label: "Convert thickness to feet",   value: "4 in ÷ 12 = 0.333 ft" },
              { step: "2", label: "Calculate cubic feet",        value: "20 × 12 × 0.333 = 80 cu ft" },
              { step: "3", label: "Convert to cubic yards",      value: "80 ÷ 27 = 2.96 cu yd" },
              { step: "4", label: "Add 10% waste",               value: "2.96 × 1.10 = 3.26 cu yd to order" },
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
            At 4 inches thick, this driveway needs just under 3 cubic yards. Bump it
            to 6 inches — the thickness recommended if you park trucks or an RV —
            and the same footprint jumps to 4.44 cubic yards. Getting the thickness
            right before ordering is the single most important step.
          </p>
        </div>
      </section>

      {/* -- BAG CALCULATIONS ---------------------------------------------- */}
      <section className="border-t border-gray-100 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">
            How many 80 lb bags of concrete do you need?
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">
            An 80 lb bag of premix concrete (such as Quikrete or Sakrete) covers
            approximately 0.45 cubic feet when mixed. Since there are 27 cubic feet
            in a cubic yard, you need about 60 bags per cubic yard. Here&apos;s a
            quick reference for common project sizes:
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { vol: "0.5 cu yd", bags: "30 bags",  waste: "33 bags" },
              { vol: "1 cu yd",   bags: "60 bags",  waste: "66 bags" },
              { vol: "2 cu yd",   bags: "120 bags", waste: "132 bags" },
              { vol: "3 cu yd",   bags: "180 bags", waste: "198 bags" },
            ].map((row) => (
              <div key={row.vol} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-base font-bold text-emerald-600">{row.vol}</p>
                <p className="mt-2 text-sm font-semibold text-gray-700">{row.bags}</p>
                <p className="mt-0.5 text-xs text-gray-400">+10% waste: {row.waste}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-gray-500">
            Mixing 60 bags by hand is a full day&apos;s work for one person. At around
            2 cubic yards and above, most contractors switch to ready-mix, which arrives
            pre-blended and pours quickly. Bags are best for small pours, repairs, or
            projects where you need to work in stages. Need a precise bag count?{" "}
            <Link href="/construction-calculators/concrete/concrete-bag-calculator" className="font-semibold text-emerald-700 underline underline-offset-2 hover:text-emerald-900">
              Use the bag calculator ?
            </Link>
          </p>
        </div>
      </section>

      {/* -- CONCRETE COST PER CUBIC YARD ---------------------------------- */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">
            What does concrete cost per cubic yard?
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">
            Concrete pricing varies by region, season, and supply method. These are
            rough national averages for 2025–2026:
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-bold text-gray-700">Bagged concrete (80 lb)</p>
              <p className="mt-2 text-2xl font-bold text-emerald-600">$5–8 per bag</p>
              <p className="mt-1 text-xs text-gray-400">˜ $300–480 per cubic yard equivalent</p>
              <p className="mt-3 text-sm text-gray-500">
                Best for small pours under 1 yard. Convenient but expensive at scale.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-bold text-gray-700">Ready-mix (truck delivery)</p>
              <p className="mt-2 text-2xl font-bold text-emerald-600">$120–200 per yard</p>
              <p className="mt-1 text-xs text-gray-400">Plus delivery fee, typically $100–200</p>
              <p className="mt-3 text-sm text-gray-500">
                Most cost-effective for anything over 1–2 yards. Consistent quality, faster pour.
              </p>
            </div>
          </div>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-gray-500">
            For a 3-yard driveway using ready-mix, expect to pay $360–600 for the concrete
            alone, plus delivery and any finishing or labor costs. Always get at least two
            quotes from local suppliers — regional prices can differ by 30% or more. For a
            full project estimate, use the{" "}
            <Link href="/construction-calculators/concrete/concrete-slab-calculator" className="font-semibold text-emerald-700 underline underline-offset-2 hover:text-emerald-900">
              concrete slab cost calculator
            </Link>.
          </p>
        </div>
      </section>

      {/* -- COMMON MISTAKES ----------------------------------------------- */}
      <section className="border-t border-gray-100 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">
            Common mistakes when estimating concrete
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "Skipping the waste buffer",
                body: "Ordering exactly what the formula says almost always leaves you short. Ground isn't perfectly level, forms shift, and mixing absorbs extra. Always add at least 10%.",
              },
              {
                title: "Mixing up cubic feet and cubic yards",
                body: "Many people calculate in cubic feet and forget to divide by 27. One cubic yard is 27 cubic feet — a mistake here means ordering 27× too much or too little.",
              },
              {
                title: "Underestimating slab thickness",
                body: "A 4-inch slab and a 6-inch slab of the same footprint require 50% more concrete. Confirm thickness requirements before calculating, especially under driveways.",
              },
              {
                title: "Forgetting the sub-base",
                body: "Concrete poured directly onto soft soil can crack and sink. A 4–6 inch compacted gravel base is standard. This doesn't change your concrete volume but affects overall excavation depth.",
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

      {/* -- WHERE IS THIS USED --------------------------------------------- */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">
            Where this calculator is used
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">
            This tool works for any rectangular concrete pour. Common uses include:
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Driveways",     note: "Typically 4–6 in thick. Single-car: ~2–3 cu yd. Double: 4–6 cu yd." },
              { name: "Patios",        note: "Usually 3–4 in. A 16 × 20 ft patio at 4 in = ~4 cu yd." },
              { name: "Garage floors", note: "Minimum 4 in — 6 in if supporting vehicles. 20 × 20 ft = ~5 cu yd." },
              { name: "Footings",      note: "Depth varies by frost line and load. Poured separately from the slab." },
              { name: "Fence posts",   note: "Small individual pours. Use the calculator per post for bag counts." },
              { name: "Shed slabs",    note: "3–4 in is typical. A 12 × 16 ft shed base needs roughly 1.8 cu yd." },
            ].map(({ name, note }) => (
              <div key={name} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-bold text-gray-700">{name}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-gray-400">{note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -- FAQ ----------------------------------------------------------- */}
      <section className="border-t border-gray-100 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">Frequently asked questions</h2>
          <div className="mt-6 space-y-4">
            {[
              {
                q: "How do I calculate cubic yards of concrete?",
                a: "Multiply length (ft) × width (ft) × thickness (ft — convert inches by dividing by 12). That gives cubic feet. Divide by 27 to get cubic yards. Then add 10% for waste.",
              },
              {
                q: "How many 80 lb bags of concrete per cubic yard?",
                a: "Approximately 60 bags. An 80 lb bag yields about 0.45 cubic feet. Since a cubic yard equals 27 cubic feet: 27 ÷ 0.45 = 60 bags. Buy 66 if adding 10% waste.",
              },
              {
                q: "What is the difference between cubic feet and cubic yards?",
                a: "One cubic yard equals exactly 27 cubic feet (3 ft × 3 ft × 3 ft). Ready-mix suppliers always quote in cubic yards. If your calculator gives cubic feet, divide by 27 before ordering.",
              },
              {
                q: "How thick should a concrete slab be?",
                a: "Residential driveways: 4 inches minimum, 6 inches if you park heavy vehicles. Patios and walkways: 3–4 inches. Garage floors: 4–6 inches. Footings vary by soil and load.",
              },
              {
                q: "What does a yard of concrete cost?",
                a: "Ready-mix typically runs $120–200 per cubic yard plus a delivery charge of $100–200. Bagged concrete (80 lb bags at $5–8 each) works out to $300–480 per equivalent cubic yard — cost-effective only for small jobs.",
              },
              {
                q: "When should I use ready-mix instead of bags?",
                a: "Once you're at 1.5 cubic yards or more, ready-mix is usually cheaper and far faster. Mixing 90 bags by hand takes several hours and risks an uneven mix. Ready-mix ensures consistent strength throughout the pour.",
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

      {/* -- DISCLAIMER ---------------------------------------------------- */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-xl font-bold text-gray-800">Disclaimer</h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-400">
            This calculator provides estimates only and should be used for planning
            purposes. Actual concrete quantities depend on ground conditions, form
            accuracy, pour technique, and material yield — all of which vary in
            practice. Always confirm quantities with your supplier before ordering.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-gray-400">
            Cost figures are approximate national averages and may not reflect your
            local market. Bag yields are based on manufacturer averages — check the
            label for the specific product you buy.
          </p>
        </div>
      </section>

      {/* -- RELATED TOOLS ------------------------------------------------- */}
      <section className="border-t border-gray-100 px-5 py-10 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl flex flex-wrap gap-4 text-sm">
          <Link href="/construction-calculators/concrete-calculator-uk" className="font-semibold text-emerald-700 underline underline-offset-2 hover:text-emerald-900">
            Concrete Calculator (UK) ?
          </Link>
          <Link href="/construction-calculators" className="font-semibold text-emerald-700 underline underline-offset-2 hover:text-emerald-900">
            All Construction Calculators ?
          </Link>
          <Link href="/tools/cost-calculators/home-improvement" className="font-semibold text-emerald-700 underline underline-offset-2 hover:text-emerald-900">
            Home Improvement Cost Calculators ?
          </Link>
        </div>
      </section>
    </SimpleCalculatorShell>
  );
}
