import type { Metadata } from "next";
import Link from "next/link";
import SimpleCalculatorShell from "@/components/calculators/SimpleCalculatorShell";
import ConcreteBagCalculatorUKLoader from "./ConcreteBagCalculatorUKLoader";

export const metadata: Metadata = {
  title: "Concrete Bag Calculator UK – Work Out How Many Bags You Need Instantly",
  description:
    "Find out how many 25 kg concrete bags you need for any slab or shed base. Enter your measurements and get instant results in cubic metres. UK calculator.",
  keywords: [
    "concrete bag calculator UK",
    "how many bags of concrete do I need UK",
    "25kg bag concrete calculator",
    "bags of concrete per cubic metre",
    "concrete slab bag calculator UK",
    "concrete bag estimator UK",
  ],
  alternates: {
    canonical:
      "https://worthulator.com/construction-calculators/concrete/concrete-bag-calculator-uk",
  },
  robots: { index: true, follow: true },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Concrete Bag Calculator (UK)",
    description:
      "Calculate how many 20 kg or 25 kg bags of concrete you need for any rectangular slab, driveway, or shed base in cubic metres.",
    url: "https://worthulator.com/construction-calculators/concrete/concrete-bag-calculator-uk",
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How many 25 kg bags per cubic metre?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A 25 kg bag covers approximately 0.012 m³, so you need about 83–84 bags per m³ at exact volume. With a 5% waste allowance, budget for 88 bags per m³.",
        },
      },
      {
        "@type": "Question",
        name: "How do I work out cubic metres from millimetres?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Divide each millimetre measurement by 1,000 to get metres, then multiply length × width × depth. For example: 4 m × 3 m × 100 mm becomes 4 × 3 × 0.10 = 1.2 m³.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between 20 kg and 25 kg bags?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Both contain the same general-purpose mix. A 20 kg bag yields about 0.0095 m³ and a 25 kg bag around 0.012 m³. The 25 kg bag gives better value per m³ but is heavier to lift.",
        },
      },
      {
        "@type": "Question",
        name: "Can I use bagged concrete for a driveway in the UK?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Technically yes for very small driveways, but at 83+ bags per m³ a typical single driveway (2–3 m³) would require 250–300 bags. Ready-mix is far more practical and cost-effective at that scale.",
        },
      },
      {
        "@type": "Question",
        name: "How deep should a shed base be in the UK?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "100 mm (0.10 m) on a 75–100 mm compacted hardcore sub-base is standard for a domestic shed base. For larger outbuildings or on soft ground, 150 mm is more appropriate.",
        },
      },
      {
        "@type": "Question",
        name: "When should I use ready-mix instead of bags in the UK?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Once your pour reaches 0.5–1 m³ or more, ready-mix is usually cheaper per m³ and far quicker to pour. Most UK volumetric suppliers will deliver from 0.5 m³ with no minimum-order penalty.",
        },
      },
    ],
  },
];

const heroCard = (
  <div className="rounded-2xl border border-white/10 bg-slate-900 p-7 text-white shadow-2xl">
    <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
      Example — 3 × 2 m shed base, 100 mm
    </p>
    <div className="mt-5 space-y-1">
      <p className="text-4xl font-bold tracking-tight">0.600</p>
      <p className="text-sm font-semibold text-white/50">cubic metres</p>
    </div>
    <div className="mt-6 space-y-2 border-t border-white/10 pt-5 text-sm">
      <div className="flex justify-between">
        <span className="text-white/50">25 kg bags (exact)</span>
        <span className="font-semibold">50 bags</span>
      </div>
      <div className="flex justify-between">
        <span className="text-white/50">+5% waste</span>
        <span className="font-semibold">53 bags</span>
      </div>
      <div className="flex justify-between">
        <span className="text-white/50">Est. cost</span>
        <span className="font-semibold">~£66</span>
      </div>
    </div>
  </div>
);

export default function ConcreteBagCalculatorUKPage() {
  return (
    <SimpleCalculatorShell
      jsonLd={jsonLd}
      category="United Kingdom · Construction"
      title="Concrete Bag Calculator"
      subtitle="How many 25 kg bags do you need? Enter your dimensions in metres and get your count instantly."
      description={
        <>
          Enter your slab length, width, and depth in metres — or use the quick depth
          chips for common UK thicknesses. Choose 20 kg or 25 kg bags and get an instant
          bag count with an optional waste buffer.{" "}
          <span className="mt-2 block text-sm text-gray-400">
            For planning purposes only. Verify quantities with your supplier before
            ordering.
          </span>
        </>
      }
      heroCard={heroCard}
      calculator={<ConcreteBagCalculatorUKLoader />}
      insightText={
        <>
          A 3 × 2 m shed base at 100 mm deep needs{" "}
          <strong>about 50 × 25 kg bags</strong>. Add 5% waste and buy 53 —
          a manageable half-day job with a hired mixer.
        </>
      }
    >

      {/* -- HOW TO CALCULATE ---------------------------------------------- */}
      <section className="border-t border-gray-100 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">
            How to calculate how many bags of concrete you need
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">
            Working in metric keeps the maths simple. Because all dimensions are in
            metres, multiplying them together gives you cubic metres directly — no
            conversion factor required. The only thing to watch is that UK building
            drawings almost always show slab depth in millimetres, not metres. Divide
            by 1,000 before you start.
          </p>
          <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Step 1 — volume
            </p>
            <p className="mt-2 font-mono text-sm text-gray-700">
              Volume (m³) = Length (m) × Width (m) × Depth (m)
            </p>
            <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-gray-400">
              Step 2 — bag count
            </p>
            <p className="mt-2 font-mono text-sm text-gray-700">
              Bags = (Volume × waste factor) ÷ bag yield (m³)
            </p>
          </div>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-gray-500">
            A standard 25 kg bag of ready-mix concrete covers around 0.012 m³. One
            cubic metre therefore needs roughly 83–84 bags at exact volume. The
            calculator adds a waste factor on top — the default is 5%, which accounts
            for spillage and the small amount of mix left on tools and in the drum.
            Increase it to 10% if the ground is uneven or you&apos;re mixing in cold
            weather, where concrete can stiffen faster than expected.
          </p>
        </div>
      </section>

      {/* -- WORKED EXAMPLE ------------------------------------------------ */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">
            Worked example: 4 × 3 m patio slab at 100 mm
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">
            A 4 × 3 m patio is one of the most common weekend concrete projects in
            the UK. At a standard 100 mm depth on a prepared hardcore base, here&apos;s
            how to work through the numbers:
          </p>
          <div className="mt-6 space-y-3">
            {[
              { step: "1", label: "Convert depth to metres",  value: "100 mm ÷ 1,000 = 0.10 m" },
              { step: "2", label: "Calculate volume",          value: "4 × 3 × 0.10 = 1.2 m³" },
              { step: "3", label: "Add 5% waste",              value: "1.2 × 1.05 = 1.26 m³" },
              { step: "4", label: "25 kg bag count",           value: "1.26 ÷ 0.012 = 105 bags" },
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
            105 bags is a significant hand-mix job — at least a full day with a
            hired electric mixer. At this volume, it&apos;s worth getting one or two
            ready-mix quotes. Many UK suppliers will deliver from 1 m³, and the cost
            per m³ is considerably lower than bagged concrete at this scale.
          </p>
        </div>
      </section>

      {/* -- UK BAG SIZES -------------------------------------------------- */}
      <section className="border-t border-gray-100 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">
            UK concrete bag sizes explained
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">
            UK builders&apos; merchants and DIY sheds stock bagged concrete mix in two
            main sizes. Both contain the same type of mix — the difference is purely
            the amount per bag:
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              {
                size: "20 kg",
                yield: "˜ 0.0095 m³",
                bags: "~105 bags per m³",
                note: "Easier to lift and carry, particularly useful on confined sites or for solo workers. Slightly more expensive per m³ than 25 kg bags due to packaging.",
              },
              {
                size: "25 kg",
                yield: "˜ 0.012 m³",
                bags: "~83–84 bags per m³",
                note: "The most common size in the UK. Better value per m³ and fewer bags to buy. Weighs around the limit for safe solo lifting — a sack truck helps on bigger jobs.",
              },
            ].map(({ size, yield: y, bags, note }) => (
              <div key={size} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-xl font-bold text-emerald-600">{size}</p>
                <p className="mt-1 text-sm font-semibold text-gray-700">{y}</p>
                <p className="mt-0.5 text-xs text-gray-400">{bags}</p>
                <p className="mt-3 text-xs leading-relaxed text-gray-400">{note}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-gray-500">
            General-purpose bagged concrete mix is suitable for most domestic jobs —
            shed bases, paths, and fence posts. For structural or exposed applications
            where a specific strength class is required (C20, C25, C30), you&apos;ll
            typically need to order ready-mix with the correct BS designation rather
            than relying on bagged general-purpose mix.
          </p>
        </div>
      </section>

      {/* -- READY-MIX VS DIY MIX ------------------------------------------ */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">
            Ready-mix vs bagged concrete — which is right for your job?
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-bold text-gray-700">Use bags when…</p>
              <ul className="mt-3 space-y-2 text-sm text-gray-500">
                <li>• Your pour is under 0.5–1 m³</li>
                <li>• A mixer lorry can&apos;t access the site</li>
                <li>• You want to work across several sessions</li>
                <li>• You&apos;re doing fence posts, repairs, or small footings</li>
                <li>• The job is straightforward and non-structural</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-bold text-gray-700">Use ready-mix when…</p>
              <ul className="mt-3 space-y-2 text-sm text-gray-500">
                <li>• Your pour is 1 m³ or more</li>
                <li>• You need a specified BS mix class (C20, C25, C30)</li>
                <li>• Consistent strength throughout is critical</li>
                <li>• You&apos;re under time pressure on a full pour</li>
                <li>• Cost per m³ matters — bags are 3–5× more expensive</li>
              </ul>
            </div>
          </div>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-gray-500">
            A useful rule of thumb: if you need more than two bulk bags of ballast,
            get a ready-mix quote. Most UK volumetric suppliers deliver from 0.5 m³
            and can mix to the exact specification you need on arrival.
          </p>
        </div>
      </section>

      {/* -- COST PER M³ --------------------------------------------------- */}
      <section className="border-t border-gray-100 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">
            How much do bags of concrete cost in the UK?
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">
            Prices vary by retailer and region, but these are approximate 2025–2026
            figures at UK builders&apos; merchants and DIY sheds:
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { size: "20 kg bag",     price: "£3–5",    perM3: "~£315–525/m³" },
              { size: "25 kg bag",     price: "£4–6",    perM3: "~£335–500/m³" },
              { size: "Ready-mix C25", price: "£90–140", perM3: "per m³ + delivery" },
            ].map(({ size, price, perM3 }) => (
              <div key={size} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-bold text-gray-700">{size}</p>
                <p className="mt-1 text-xl font-bold text-emerald-600">{price}</p>
                <p className="mt-1 text-xs text-gray-400">{perM3}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-gray-500">
            Bagged concrete works out at roughly £335–525 per equivalent m³ — three
            to five times the cost of ready-mix. For a 1.2 m³ patio pour, that
            difference could be £250–400. The calculator defaults to £110/m³ as a
            mid-range estimate; update this in the &quot;Adjust waste &amp; price&quot;
            panel to match your local supplier&apos;s rate.
          </p>
        </div>
      </section>

      {/* -- COMMON MISTAKES ----------------------------------------------- */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">
            Common mistakes on UK concrete bag jobs
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "Entering depth in millimetres instead of metres",
                body: "The most frequent input error. Entering 100 instead of 0.10 gives a result 1,000 times too large. UK drawings show depth in mm — always divide by 1,000 before calculating.",
              },
              {
                title: "Underestimating the bag count for a large pour",
                body: "83 bags per m³ sounds manageable until you price it up and carry them. For anything over 0.5 m³, get a ready-mix quote first — the cost difference is often larger than expected.",
              },
              {
                title: "Mixing in cold or frosty conditions",
                body: "Concrete needs temperatures above 5°C to cure properly. Pouring in late autumn or winter without frost protection measures can lead to a weak, crumbly slab that needs to be broken out.",
              },
              {
                title: "Skipping the sub-base",
                body: "A concrete slab poured directly onto soft or uneven soil will crack as the ground moves. A 75–100 mm compacted hardcore layer is standard under any domestic slab in the UK.",
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

      {/* -- FAQ ----------------------------------------------------------- */}
      <section className="border-t border-gray-100 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">Frequently asked questions</h2>
          <div className="mt-6 space-y-4">
            {[
              {
                q: "How many 25 kg bags per cubic metre?",
                a: "A 25 kg bag covers approximately 0.012 m³, so you need about 83–84 bags per m³ at exact volume. With a 5% waste allowance, budget for 88 bags per m³.",
              },
              {
                q: "How do I work out cubic metres from millimetres?",
                a: "Divide each millimetre measurement by 1,000 to get metres, then multiply length × width × depth. For example: 4 m × 3 m × 100 mm becomes 4 × 3 × 0.10 = 1.2 m³.",
              },
              {
                q: "What is the difference between 20 kg and 25 kg bags?",
                a: "Both contain the same general-purpose mix. A 20 kg bag yields about 0.0095 m³ and a 25 kg bag around 0.012 m³. The 25 kg bag gives better value per m³ but is heavier to lift.",
              },
              {
                q: "Can I use bagged concrete for a driveway in the UK?",
                a: "Technically yes for very small driveways, but at 83+ bags per m³ a typical single driveway (2–3 m³) would require 250–300 bags. Ready-mix is far more practical and cost-effective at that scale.",
              },
              {
                q: "How deep should a shed base be in the UK?",
                a: "100 mm (0.10 m) on a 75–100 mm compacted hardcore sub-base is standard for a domestic shed base. For larger outbuildings or on soft ground, 150 mm is more appropriate.",
              },
              {
                q: "When should I use ready-mix instead of bags in the UK?",
                a: "Once your pour reaches 0.5–1 m³ or more, ready-mix is usually cheaper per m³ and far quicker to pour. Most UK volumetric suppliers will deliver from 0.5 m³ with no minimum-order penalty.",
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
            sub-base preparation, material yield, and local pricing. Always verify
            your order with the supplier before purchasing.
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
                label: "Concrete Calculator (UK)",
                href: "/construction-calculators/concrete-calculator-uk",
                note: "Full slab volume in m³ — ready-mix quantities",
              },
              {
                label: "Concrete Bag Calculator (US)",
                href: "/construction-calculators/concrete/concrete-bag-calculator",
                note: "40/60/80 lb bags · cubic yards",
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
