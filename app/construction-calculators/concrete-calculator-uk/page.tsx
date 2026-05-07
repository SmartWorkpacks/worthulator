import type { Metadata } from "next";
import Link from "next/link";
import SimpleCalculatorShell from "@/components/calculators/SimpleCalculatorShell";
import ConcreteCalculatorLoader from "../concrete-calculator/ConcreteCalculatorLoader";
import RegionToggle from "@/components/RegionToggle";

export const metadata: Metadata = {
  title: "Concrete Volume Calculator UK – Work Out How Many Cubic Metres You Need Instantly",
  description:
    "Work out how much concrete you need in cubic metres. Enter length, width, and depth and get instant results for volume and bag count. UK calculator.",
  keywords: [
    "concrete calculator UK",
    "cubic metres concrete calculator",
    "concrete slab calculator UK",
    "how much concrete do I need UK",
    "concrete bag calculator UK",
    "ready mix concrete calculator",
    "concrete cost per m3 UK",
    "ballast concrete calculator",
  ],
  alternates: {
    canonical: "https://worthulator.com/construction-calculators/concrete-calculator-uk",
  },
  robots: { index: true, follow: true },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Concrete Calculator (UK)",
    description:
      "Calculate how much concrete you need in cubic metres. Enter length, width, and depth for slabs, driveways, or footings.",
    url: "https://worthulator.com/construction-calculators/concrete-calculator-uk",
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I work out cubic metres of concrete?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Multiply length (m) × width (m) × depth (m). If your depth is in millimetres, divide by 1,000 first. A 4 m × 2 m slab at 100 mm depth = 4 × 2 × 0.10 = 0.8 m³.",
        },
      },
      {
        "@type": "Question",
        name: "How much concrete do I need for a shed base?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A typical 2.4 × 3.6 m shed base at 100 mm depth needs 0.86 m³ — around 72 bags of 25 kg mix. Add 10% waste, so order 80 bags or 0.95 m³ of ready-mix.",
        },
      },
      {
        "@type": "Question",
        name: "What is ballast concrete and when should I use it?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ballast is a blend of coarse aggregate and sharp sand. Mix it with cement at 6 parts ballast to 1 part cement by weight for a C20-equivalent concrete. It's cost-effective for site-mixed jobs of 0.5–2 m³.",
        },
      },
      {
        "@type": "Question",
        name: "How many 25 kg bags per cubic metre?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Approximately 83–84 bags, as each 25 kg bag covers around 0.012 m³. With 10% waste, budget for 92 bags per m³. For volumes over 0.5 m³, ready-mix or ballast is more economical.",
        },
      },
      {
        "@type": "Question",
        name: "What does ready-mix concrete cost in the UK?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ready-mix C20/C25 concrete costs approximately £90–140 per m³ plus a delivery charge of £50–150. Most suppliers have a minimum order of 1–3 m³.",
        },
      },
      {
        "@type": "Question",
        name: "What concrete mix should I use for a driveway in the UK?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "C25 is the standard recommendation for domestic driveways. C20 is acceptable for light use, but C25 handles freeze-thaw cycles better — important in most parts of the UK.",
        },
      },
    ],
  },
];

const heroCard = (
  <div className="rounded-2xl border border-white/10 bg-slate-900 p-7 text-white shadow-2xl">
    <p className="text-xs font-semibold uppercase tracking-widest text-white/40">
      Example — 4 × 3 m driveway
    </p>
    <div className="mt-5 space-y-1">
      <p className="text-4xl font-bold tracking-tight">1.200</p>
      <p className="text-sm font-semibold text-white/50">cubic metres</p>
    </div>
    <div className="mt-6 space-y-2 border-t border-white/10 pt-5 text-sm">
      <div className="flex justify-between">
        <span className="text-white/50">Bags (exact)</span>
        <span className="font-semibold">100 × 25 kg</span>
      </div>
      <div className="flex justify-between">
        <span className="text-white/50">With 10% waste</span>
        <span className="font-semibold">110 bags</span>
      </div>
      <div className="flex justify-between">
        <span className="text-white/50">Depth</span>
        <span className="font-semibold">0.10 m (100 mm)</span>
      </div>
    </div>
  </div>
);

export default function ConcreteCalculatorUKPage() {
  return (
    <SimpleCalculatorShell
      jsonLd={jsonLd}
      category="United Kingdom · Construction"
      title="Concrete Calculator"
      subtitle="Calculate cubic metres for slabs, driveways, footings, and pours."
      description={
        <>
          Enter your slab dimensions and get the concrete volume in cubic metres plus
          the number of 25 kg bags you need — instantly.{" "}
          <span className="mt-2 block text-sm text-gray-400">
            For educational purposes only. Always verify with your supplier before ordering.
          </span>
          <RegionToggle
            current="uk"
            usPath="/construction-calculators/concrete-calculator"
            ukPath="/construction-calculators/concrete-calculator-uk"
            theme="light"
          />
        </>
      }
      heroCard={heroCard}
      calculator={<ConcreteCalculatorLoader region="UK" />}
      insightText={
        <>
          A standard 100 mm driveway at{" "}
          <strong>4 × 3 m needs 1.2 m³ of concrete</strong> — roughly 100 bags.
          Always order 10% extra to allow for spillage and waste.
        </>
      }
    >
      {/* -- HOW TO CALCULATE IN CUBIC METRES ------------------------------ */}
      <section className="border-t border-gray-100 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">
            How to calculate concrete in cubic metres
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">
            Working in metric makes concrete calculations straightforward. If your
            length, width, and depth are all in metres, the volume in cubic metres
            (m³) is simply length × width × depth — no conversion factor needed.
          </p>
          <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Formula</p>
            <p className="mt-3 font-mono text-sm text-gray-700">
              Volume (m³) = Length (m) × Width (m) × Depth (m)
            </p>
          </div>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-gray-500">
            The one thing that trips people up is that UK building drawings typically
            show slab depth in millimetres rather than metres. A depth of 100 mm is
            0.10 m, 150 mm is 0.15 m, and so on. Always divide your millimetre depth
            by 1,000 before plugging it into the calculation. A slab that is 4 m × 3 m
            at 100 mm deep requires 4 × 3 × 0.10 = 1.2 m³.
          </p>
        </div>
      </section>

      {/* -- WORKED EXAMPLE ------------------------------------------------ */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">
            Worked example: 5 × 3 m garage base
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">
            A typical single-garage base in the UK might measure 5 m × 3 m with a
            150 mm slab — the depth recommended where vehicles will be driven onto it.
            Here&apos;s how the calculation works:
          </p>
          <div className="mt-6 space-y-3">
            {[
              { step: "1", label: "Convert depth to metres",    value: "150 mm ÷ 1000 = 0.15 m" },
              { step: "2", label: "Calculate volume",           value: "5 × 3 × 0.15 = 2.25 m³" },
              { step: "3", label: "Add 10% for waste",          value: "2.25 × 1.10 = 2.48 m³ to order" },
              { step: "4", label: "Bags if not using ready-mix", value: "2.48 ÷ 0.012 ˜ 207 bags (25 kg)" },
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
            At 207 bags, this pour is firmly in ready-mix territory. Mixing that by hand
            would take the best part of two days and risk cold joints in the slab. A
            half-load of ready-mix (typically 3–4 m³ minimum from most UK suppliers)
            would cover this comfortably.
          </p>
        </div>
      </section>

      {/* -- READY-MIX VS DIY MIX ------------------------------------------ */}
      <section className="border-t border-gray-100 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">
            Ready-mix concrete vs mixing your own
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">
            In the UK there are three practical options for sourcing concrete, each
            suited to different project sizes:
          </p>
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-bold text-gray-700">Ready-mix (volumetric or drum mixer truck)</p>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                Delivered pre-mixed and poured directly from the truck. Suppliers specify
                strength by BS designation — C20 for domestic slabs and patios, C25 for
                driveways and garage floors, C30 for structural foundations. Most suppliers
                have a minimum order of 1–3 m³. Best for any pour over 1 m³ where
                consistency and speed matter.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-bold text-gray-700">Ballast and cement (site mix)</p>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                Ballast is a blend of coarse aggregate and sharp sand, sold in bulk bags
                (usually 850 kg or one tonne). You combine it with cement on-site,
                typically at 6 parts ballast to 1 part cement by weight for a general-purpose
                concrete equivalent to C20. This approach is cost-effective for 0.5–2 m³
                and lets you work at your own pace, but it requires a mixer and more labour.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-bold text-gray-700">Bagged all-in-one mix (25 kg bags)</p>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">
                Pre-blended bags such as general-purpose concrete mix or rapid-setting
                products like Postcrete are best for small jobs — fence posts, gate pillars,
                steps, or repairs under 0.3 m³. A single 25 kg bag covers approximately
                0.012 m³. Convenient, but the most expensive way to buy concrete per m³.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* -- COST PER M³ --------------------------------------------------- */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">
            How much does concrete cost per m³ in the UK?
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">
            UK concrete prices vary by region, mix specification, and whether you use
            ready-mix or self-mix. Approximate figures for 2025–2026:
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-bold text-gray-700">Ready-mix (C20/C25)</p>
              <p className="mt-2 text-2xl font-bold text-emerald-600">£90–140/m³</p>
              <p className="mt-1 text-xs text-gray-400">Plus delivery, typically £50–150</p>
              <p className="mt-3 text-sm text-gray-500">
                Most cost-effective for jobs over 1 m³. Quality is consistent and controlled.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-bold text-gray-700">Ballast + cement</p>
              <p className="mt-2 text-2xl font-bold text-emerald-600">£60–90/m³</p>
              <p className="mt-1 text-xs text-gray-400">Materials only, excludes labour and mixer hire</p>
              <p className="mt-3 text-sm text-gray-500">
                Cheapest material option. Practical for 0.5–2 m³ with a rented mixer.
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-sm font-bold text-gray-700">Bagged mix (25 kg)</p>
              <p className="mt-2 text-2xl font-bold text-emerald-600">£420–560/m³</p>
              <p className="mt-1 text-xs text-gray-400">Based on 83 bags × £5–7 per bag</p>
              <p className="mt-3 text-sm text-gray-500">
                Only practical for very small jobs. Expensive at scale.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* -- COMMON MISTAKES ----------------------------------------------- */}
      <section className="border-t border-gray-100 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">
            Common mistakes when ordering concrete in the UK
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "Confusing millimetres and metres",
                body: "Drawings show depth as 100 mm or 150 mm, but the formula needs metres. Entering 100 instead of 0.10 gives a result 1,000 times too large — an easy mistake to make and easy to miss.",
              },
              {
                title: "Skimping on depth for a driveway",
                body: "100 mm is the minimum for a domestic driveway. If you regularly park a van or 4×4, 125–150 mm is more appropriate. Under-specified slabs crack under load and are expensive to re-pour.",
              },
              {
                title: "Forgetting the sub-base",
                body: "UK driveways typically sit on a 100–150 mm compacted hardcore sub-base. This isn't part of your concrete volume, but it affects total excavation depth. Skipping it leads to movement and cracking.",
              },
              {
                title: "Not checking ready-mix minimums",
                body: "Many UK ready-mix suppliers have a minimum order of 1–3 m³. If your job needs 0.8 m³, you may be charged for the minimum anyway — worth knowing before deciding between bags and a truck.",
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
            Common uses in the UK
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: "Driveways",       note: "100–150 mm slab on 100 mm hardcore. A standard single driveway is typically 2–4 m³." },
              { name: "Shed bases",      note: "75–100 mm is usually sufficient. A 2.4 × 3.6 m base at 100 mm = 0.86 m³." },
              { name: "Extension bases", note: "Strip or raft foundations vary — always check with an engineer or building control." },
              { name: "Garden walls",    note: "Strip footings typically 300 mm deep × 450 mm wide. Calculate per linear metre." },
              { name: "Fence posts",     note: "Each post uses a small volume. Bagged Postcrete is practical for 1–10 posts." },
              { name: "Kerbs & edgings", note: "Haunching behind kerb stones. Small volumes but easy to miscalculate — use the calculator." },
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
                q: "How do I work out cubic metres of concrete?",
                a: "Multiply length (m) × width (m) × depth (m). If your depth is in millimetres, divide by 1,000 first. A 4 m × 2 m slab at 100 mm deep = 4 × 2 × 0.10 = 0.8 m³.",
              },
              {
                q: "How much concrete do I need for a shed base?",
                a: "A typical 2.4 × 3.6 m shed base at 100 mm depth needs 0.86 m³ — around 72 bags of 25 kg mix. Add 10% waste, so order 80 bags or 0.95 m³ of ready-mix.",
              },
              {
                q: "What is ballast and when should I use it?",
                a: "Ballast is a blend of coarse aggregate and sharp sand. Mix it with cement at 6 parts ballast to 1 part cement by weight for a C20-equivalent concrete. It's cost-effective for site-mixed jobs of 0.5–2 m³.",
              },
              {
                q: "How many 25 kg bags per cubic metre?",
                a: "Approximately 83–84 bags, as each 25 kg bag covers around 0.012 m³. With 10% waste, budget for 92 bags per m³. For volumes over 0.5 m³, ready-mix or ballast will be cheaper.",
              },
              {
                q: "What does ready-mix concrete cost in the UK?",
                a: "Expect to pay £90–140 per m³ for C20/C25 ready-mix, plus a delivery charge of £50–150 depending on your location and supplier. Most suppliers have a minimum order — often 1 m³, sometimes 3 m³.",
              },
              {
                q: "What concrete mix should I use for a driveway in the UK?",
                a: "C25 is the standard recommendation for domestic driveways. C20 is acceptable for light use, but C25 handles freeze-thaw cycles better — important in most parts of the UK. For commercial use or HGV access, have an engineer specify the mix.",
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
            purposes. Concrete quantities in practice depend on ground conditions,
            sub-base specification, form accuracy, and material yield — all of which
            vary between sites and suppliers.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-gray-400">
            Cost figures are indicative only and based on approximate UK market rates.
            Prices vary by region, mix specification, and supplier. Always obtain
            written quotes before placing orders. Worthulator accepts no liability for
            over- or under-ordering based on these estimates.
          </p>
        </div>
      </section>

      {/* -- RELATED TOOLS ------------------------------------------------- */}
      <section className="border-t border-gray-100 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-xl font-bold text-gray-800">Related calculators</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "Concrete Slab Calculator (UK)",   href: "/tools/cost-calculators/home-improvement/concrete-slab-calculator-uk", note: "Slab volume and cost in m³" },
              { label: "Concrete Bag Calculator (UK)",    href: "/construction-calculators/concrete/concrete-bag-calculator-uk",  note: "25 kg bag count for any pour" },
              { label: "Concrete Calculator (US)",        href: "/construction-calculators/concrete-calculator",         note: "Switch to imperial / cubic yards" },
              { label: "All Construction Calculators",    href: "/construction-calculators",                             note: "Browse the full set" },
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
