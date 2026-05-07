import type { Metadata } from "next";
import Link from "next/link";
import SimpleCalculatorShell from "@/components/calculators/SimpleCalculatorShell";
import ConcreteBagCalculatorLoader from "./ConcreteBagCalculatorLoader";

export const metadata: Metadata = {
  title: "Concrete Bag Calculator – Work Out How Many Bags You Need Instantly",
  description:
    "Find out how many concrete bags you need for any slab or footing. Enter your measurements and get instant results for 40 lb, 60 lb, and 80 lb bags.",
  keywords: [
    "concrete bag calculator",
    "how many bags of concrete do I need",
    "80 lb bag concrete calculator",
    "bags of concrete per cubic yard",
    "concrete slab bag calculator",
    "concrete bag estimator",
  ],
  alternates: {
    canonical:
      "https://worthulator.com/construction-calculators/concrete/concrete-bag-calculator",
  },
  robots: { index: true, follow: true },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Concrete Bag Calculator (US)",
    description:
      "Calculate how many 40, 60, or 80 lb bags of concrete you need for any rectangular slab, driveway, or footing in cubic yards.",
    url: "https://worthulator.com/construction-calculators/concrete/concrete-bag-calculator",
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How many 80 lb bags of concrete do I need per cubic yard?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "An 80 lb bag covers approximately 0.022 cubic yards, so you need about 45–46 bags per yard of plain volume. With a 5% waste buffer that becomes 48 bags.",
        },
      },
      {
        "@type": "Question",
        name: "How do I convert inches to feet for the thickness?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Divide the inch value by 12. A 4-inch slab is 4 ÷ 12 = 0.333 feet. A 6-inch slab is 0.5 feet. The calculator does this conversion automatically — just enter the thickness in inches.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between 40 lb, 60 lb, and 80 lb bags?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Only the amount of mix in each bag. A 40 lb bag yields about 0.011 cu yd, a 60 lb bag 0.017 cu yd, and an 80 lb bag 0.022 cu yd. Heavier bags cost less per yard but are harder to handle over long jobs.",
        },
      },
      {
        "@type": "Question",
        name: "Why add a waste factor if I'm using exact measurements?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Even with perfect measurements, some concrete is always lost — it sticks to mixer blades, fills small voids in the sub-base, and spills during placing. A 5% buffer is minimal insurance against running short.",
        },
      },
      {
        "@type": "Question",
        name: "When should I use bags instead of ordering ready-mix?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Bags make sense for pours under 1.5–2 cubic yards, for jobs where access is tight, or where you want to work in stages. Above that threshold, a ready-mix truck is usually cheaper and faster.",
        },
      },
      {
        "@type": "Question",
        name: "How much do 80 lb bags of concrete cost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Typically $6–9 per 80 lb bag at big-box stores in 2025–2026, which works out to roughly $275–410 per equivalent cubic yard. Ready-mix at $120–200/cu yd is more economical for pours over 1.5 yards.",
        },
      },
    ],
  },
];

const heroCard = (
  <div className="rounded-2xl border border-white/10 bg-slate-900 p-7 text-white shadow-2xl">
    <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
      Example — 10 × 10 ft slab, 4 in
    </p>
    <div className="mt-5 space-y-1">
      <p className="text-4xl font-bold tracking-tight">1.23</p>
      <p className="text-sm font-semibold text-white/50">cubic yards</p>
    </div>
    <div className="mt-6 space-y-2 border-t border-white/10 pt-5 text-sm">
      <div className="flex justify-between">
        <span className="text-white/50">80 lb bags (exact)</span>
        <span className="font-semibold">57 bags</span>
      </div>
      <div className="flex justify-between">
        <span className="text-white/50">+5% waste</span>
        <span className="font-semibold">60 bags</span>
      </div>
      <div className="flex justify-between">
        <span className="text-white/50">Est. cost</span>
        <span className="font-semibold">~$185</span>
      </div>
    </div>
  </div>
);

export default function ConcreteBagCalculatorPage() {
  return (
    <SimpleCalculatorShell
      jsonLd={jsonLd}
      category="Construction · Materials"
      title="Concrete Bag Calculator"
      subtitle="How many bags do you need? Choose your bag size, enter your dimensions, get your count."
      description={
        <>
          Enter your slab length, width, and thickness in feet and inches. Pick your
          preferred bag size — 40 lb, 60 lb, or 80 lb — and get an instant bag count
          with an optional waste buffer.{" "}
          <span className="mt-2 block text-sm text-gray-400">
            For planning purposes only. Verify quantities with your supplier before
            ordering.
          </span>
        </>
      }
      heroCard={heroCard}
      calculator={<ConcreteBagCalculatorLoader />}
      insightText={
        <>
          A standard 10 × 10 ft slab at 4 inches needs{" "}
          <strong>about 57 × 80 lb bags</strong>. Add a 5% waste buffer and you
          should buy 60 — roughly 3 pallets.
        </>
      }
    >

      {/* -- HOW TO CALCULATE CONCRETE BAGS -------------------------------- */}
      <section className="border-t border-gray-100 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">
            How to calculate how many bags of concrete you need
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">
            The calculation has two stages. First you work out the volume of your
            pour in cubic yards. Then you divide that volume by the yield of one bag
            to get your bag count.
          </p>
          <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Step 1 — volume
            </p>
            <p className="mt-2 font-mono text-sm text-gray-700">
              Cubic yards = (Length ft × Width ft × Thickness in ÷ 12) ÷ 27
            </p>
            <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-gray-400">
              Step 2 — bag count
            </p>
            <p className="mt-2 font-mono text-sm text-gray-700">
              Bags = (Volume × waste factor) ÷ bag yield (cu&nbsp;yd)
            </p>
          </div>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-gray-500">
            The waste factor accounts for spillage, slightly uneven ground, and the
            concrete that gets left in the mixer or on tools. The default is 5% —
            enough for a well-prepared job. Increase it to 10% if the sub-base is
            rough or you&apos;re working alone.
          </p>
        </div>
      </section>

      {/* -- SLAB EXAMPLE -------------------------------------------------- */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">
            Worked example: 12 × 10 ft driveway apron at 4 inches
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">
            A driveway apron or garage approach is one of the most common small
            concrete jobs homeowners tackle with bags. Here&apos;s how to work
            through the numbers for a 12 ft × 10 ft area at the standard 4-inch
            residential thickness:
          </p>
          <div className="mt-6 space-y-3">
            {[
              { step: "1", label: "Convert thickness to feet",    value: "4 in ÷ 12 = 0.333 ft" },
              { step: "2", label: "Calculate cubic feet",         value: "12 × 10 × 0.333 = 40 cu ft" },
              { step: "3", label: "Convert to cubic yards",       value: "40 ÷ 27 = 1.48 cu yd" },
              { step: "4", label: "Add 5% waste",                 value: "1.48 × 1.05 = 1.55 cu yd" },
              { step: "5", label: "80 lb bag count",              value: "1.55 ÷ 0.022 = 71 bags" },
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
            So you need 71 × 80 lb bags for this job — roughly 1.5–2 pallets
            depending on the store. That&apos;s a manageable hand-mix, though at
            this size a rented electric mixer saves significant time and produces a
            more consistent result.
          </p>
        </div>
      </section>

      {/* -- BAG SIZE EXPLANATION ------------------------------------------ */}
      <section className="border-t border-gray-100 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">
            40 lb vs 60 lb vs 80 lb bags — which should you use?
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">
            All three bag sizes contain the same mix — the difference is just how much
            is in each bag. Heavier bags mean fewer trips and less tearing open
            packaging, but they&apos;re harder to lift, especially after a few hours
            on site. Here&apos;s how the yields compare:
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              {
                size: "40 lb",
                yield: "˜ 0.011 cu yd",
                note: "Best for confined spaces or when working alone. Easier to handle — you&apos;ll need roughly twice as many as 80 lb bags.",
              },
              {
                size: "60 lb",
                yield: "˜ 0.017 cu yd",
                note: "A good middle ground. Manageable to lift and reduces the number of bags by about 25% compared to 40 lb.",
              },
              {
                size: "80 lb",
                yield: "˜ 0.022 cu yd",
                note: "The most common choice for driveways and slabs. Lowest cost per yard, fewest bags to buy — but weigh around 36 kg each.",
              },
            ].map(({ size, yield: y, note }) => (
              <div key={size} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-xl font-bold text-emerald-600">{size}</p>
                <p className="mt-1 text-sm font-semibold text-gray-700">{y}</p>
                <p className="mt-3 text-xs leading-relaxed text-gray-400">{note}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-gray-500">
            Bag yields above are standard manufacturer averages (Quikrete, Sakrete).
            Always check the label of the specific product you buy — some specialty
            mixes like fast-setting or crack-resistant concrete have slightly different
            yields.
          </p>
        </div>
      </section>

      {/* -- COST EXPLANATION ---------------------------------------------- */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">
            How much do bags of concrete cost?
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">
            Retail prices vary by brand, store, and region, but these are typical
            2025–2026 ranges at big-box home improvement stores:
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { size: "40 lb", price: "$4–6", perYd: "~$365–545/cu yd" },
              { size: "60 lb", price: "$5–7", perYd: "~$295–410/cu yd" },
              { size: "80 lb", price: "$6–9", perYd: "~$275–410/cu yd" },
            ].map(({ size, price, perYd }) => (
              <div key={size} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-bold text-gray-700">{size} bag</p>
                <p className="mt-1 text-xl font-bold text-emerald-600">{price}</p>
                <p className="mt-1 text-xs text-gray-400">{perYd}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-gray-500">
            At roughly $275–545 per equivalent cubic yard, bagged concrete is
            significantly more expensive than ready-mix ($120–200/cu yd delivered).
            For anything over 1.5–2 cubic yards, getting a truck is almost always
            cheaper — even after the delivery fee. The calculator&apos;s cost
            estimate uses a $150/cu yd default; adjust it in the &quot;Adjust waste
            &amp; price&quot; panel if your local rate is different.
          </p>
        </div>
      </section>

      {/* -- COMMON MISTAKES ----------------------------------------------- */}
      <section className="border-t border-gray-100 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">
            Common mistakes when buying concrete bags
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "Forgetting to convert inches to feet",
                body: "The formula needs all dimensions in the same unit. A 4-inch slab is 0.333 feet — not 4 feet. Entering the thickness in inches without dividing by 12 gives a result 3× too high.",
              },
              {
                title: "Skipping the waste buffer",
                body: "Buying exactly what the formula says almost always leaves you short. Concrete is lost during mixing, sticks to tools, and fills gaps in the sub-base. A 5–10% buffer costs little but avoids a costly second trip.",
              },
              {
                title: "Buying the wrong bag size",
                body: "80 lb bags yield the best value per yard, but if you&apos;re mixing by hand for hours the physical toll adds up. 60 lb bags are a practical compromise for solo jobs over 1 cubic yard.",
              },
              {
                title: "Not checking bag yield on the label",
                body: "Specialty mixes — rapid-setting, fiber-reinforced, high-strength — often yield slightly less per bag than standard mix. Always confirm the yield printed on the bag before calculating.",
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

      {/* -- WHEN TO USE THIS ---------------------------------------------- */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">
            When to use this calculator
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">
            This tool is best suited for rectangular pours where you plan to use
            bagged concrete. Common uses:
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Driveway aprons",  note: "Small approach slabs. Typically 4–6 in thick. 1–3 cu yd range is ideal for bags." },
              { name: "Patio sections",   note: "Broken into smaller pours you can mix over a weekend. 3–4 in standard." },
              { name: "Fence posts",      note: "Each post uses a fraction of a bag. Use the calculator per post for a precise bag count." },
              { name: "Shed slabs",       note: "A 10 × 12 ft shed base at 4 in needs about 1.8 cu yd — roughly 82 × 80 lb bags." },
              { name: "Steps & landings", note: "Irregular shapes may need a structural engineer, but rectangular steps fit this calc well." },
              { name: "Small footings",   note: "Poured footings for decks, pergolas, or garden walls are ideal bag jobs." },
            ].map(({ name, note }) => (
              <div key={name} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-bold text-gray-700">{name}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-gray-400">{note}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-gray-500">
            For pours above 2 cubic yards, the effort and cost of mixing bags makes
            ready-mix worth considering. At that point, the{" "}
            <Link href="/construction-calculators/concrete-calculator" className="font-medium text-emerald-600 hover:text-emerald-700">
              concrete calculator
            </Link>{" "}
            gives you the volume to quote with a supplier.
          </p>
        </div>
      </section>

      {/* -- FAQ ----------------------------------------------------------- */}
      <section className="border-t border-gray-100 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">Frequently asked questions</h2>
          <div className="mt-6 space-y-4">
            {[
              {
                q: "How many 80 lb bags of concrete do I need per cubic yard?",
                a: "An 80 lb bag covers approximately 0.022 cubic yards, so you need about 45–46 bags per yard of plain volume. With a 5% waste buffer that becomes 48 bags.",
              },
              {
                q: "How do I convert inches to feet for the thickness?",
                a: "Divide the inch value by 12. A 4-inch slab is 4 ÷ 12 = 0.333 feet. A 6-inch slab is 0.5 feet. The calculator does this conversion automatically — just enter the thickness in inches.",
              },
              {
                q: "What is the difference between 40 lb, 60 lb, and 80 lb bags?",
                a: "Only the amount of mix in each bag. A 40 lb bag yields about 0.011 cu yd, a 60 lb bag 0.017 cu yd, and an 80 lb bag 0.022 cu yd. Heavier bags cost less per yard but are harder to handle over long jobs.",
              },
              {
                q: "Why does this calculator use a different yield than another tool I found?",
                a: "Bag yields vary slightly by manufacturer and mix type. This calculator uses standard Quikrete/Sakrete averages. If your specific product has a different yield, use the volume output and divide manually.",
              },
              {
                q: "When should I use bags instead of ordering ready-mix?",
                a: "Bags make sense for pours under 1.5–2 cubic yards, for jobs where access is tight, or where you want to work in stages. Above that threshold, a ready-mix truck is usually cheaper and faster.",
              },
              {
                q: "Why add a waste factor if I&apos;m using exact measurements?",
                a: "Even with perfect measurements, some concrete is always lost — it sticks to mixer blades, fills small voids in the sub-base, and spills during placing. A 5% buffer is minimal insurance against running short.",
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
            purposes. Actual quantities and costs may vary based on ground conditions,
            form accuracy, material yield, and local pricing. Always verify your
            order with the supplier before purchasing.
          </p>
        </div>
      </section>

      {/* -- RELATED ------------------------------------------------------- */}
      <section className="border-t border-gray-100 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-xl font-bold text-gray-800">Related calculators</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                label: "Concrete Calculator (US)",
                href: "/construction-calculators/concrete-calculator",
                note: "Volume in cubic yards — ready-mix quantities",
              },
              {
                label: "Concrete Bag Calculator (UK)",
                href: "/construction-calculators/concrete/concrete-bag-calculator-uk",
                note: "25 kg bags · cubic metres",
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
