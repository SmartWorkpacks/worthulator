import type { Metadata } from "next";
import Link from "next/link";
import SimpleCalculatorHero from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import DentalImplantCalculator from "./DentalImplantCalculatorLoader";

export const metadata: Metadata = {
  title: "Dental Implant Cost Calculator – Work Out Your Implant Cost Instantly",
  description:
    "Work out how much dental implants will cost you. Enter your location and implant type and get instant estimates for single, full mouth, and All-on-4 implants.",
  keywords: [
    "dental implant cost calculator",
    "how much do dental implants cost",
    "single tooth implant cost",
    "full mouth dental implants cost",
    "all on 4 dental implants cost",
    "dental implant price 2026",
    "cost of dental implants uk",
    "dental implants us price",
  ],
  alternates: { canonical: "https://worthulator.com/tools/cost-calculators/health/dental-implant-cost-calculator" },
  robots: { index: true, follow: true },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Dental Implant Cost Calculator",
    description: "Estimate dental implant costs based on treatment type, quality, clinic, and location.",
    url: "https://worthulator.com/tools/cost-calculators/health/dental-implant-cost-calculator",
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How much does a single dental implant cost in 2026?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A single dental implant in the US typically costs $2,200–$5,000 including the crown. Costs vary based on the clinic, implant brand, whether a bone graft is required, and your location.",
        },
      },
      {
        "@type": "Question",
        name: "What is the cheapest way to get dental implants?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Budget clinics, dental schools, and dental tourism (Mexico, Eastern Europe, Thailand) can reduce costs by 40–75%. All-on-4 implants are also significantly cheaper than individual full-mouth implants.",
        },
      },
      {
        "@type": "Question",
        name: "How long do dental implants last?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "With proper care, dental implants can last 20–30 years or more. The titanium post is typically permanent — it's the crown that may need replacing after 10–15 years.",
        },
      },
      {
        "@type": "Question",
        name: "Does insurance cover dental implants?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most standard dental plans do not cover implants, treating them as cosmetic. Some premium plans cover a portion. NHS coverage in the UK is limited — most patients pay privately.",
        },
      },
    ],
  },
];

const heroCard = (
  <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-gray-950 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
    <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-emerald-500/15 blur-3xl" />
    <p className="relative text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
      Example · Single implant · Standard quality
    </p>
    <p className="relative mt-3 text-5xl font-bold tracking-[-0.04em] text-emerald-400 [text-shadow:0_0_20px_rgba(52,211,153,0.3)]">
      $3,200
    </p>
    <p className="relative mt-1 text-sm text-gray-500">typical cost (US, private clinic)</p>
    <div className="mt-4 grid grid-cols-3 gap-3 text-center">
      <div>
        <p className="text-lg font-bold text-emerald-400">$2,200</p>
        <p className="text-xs text-gray-500">minimum</p>
      </div>
      <div>
        <p className="text-lg font-bold text-white">$3,200</p>
        <p className="text-xs text-gray-500">typical</p>
      </div>
      <div>
        <p className="text-lg font-bold text-emerald-300">$5,000</p>
        <p className="text-xs text-gray-500">maximum</p>
      </div>
    </div>
  </div>
);

const STAT_CHIPS = [
  { stat: "$2,200–$5,000",  color: "text-emerald-600",    label: "typical single-tooth implant cost in the US" },
  { stat: "$15k–$40k",      color: "text-emerald-500",   label: "All-on-4 implants — a cheaper full-mouth alternative" },
  { stat: "20–30 years",    color: "text-emerald-700", label: "typical implant lifespan with proper care" },
];

const statChips = STAT_CHIPS.map((chip) => (
  <div key={chip.stat} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
    <p className={`text-2xl font-bold tracking-tight ${chip.color}`}>{chip.stat}</p>
    <p className="mt-1 text-xs leading-relaxed text-gray-500">{chip.label}</p>
  </div>
));

const FAQ_ITEMS = [
  {
    q: "How much does a full set of dental implants cost?",
    a: "A full mouth of individual implants (replacing all teeth) typically costs $20,000–$60,000+ in the US. All-on-4 implants, which use 4 posts per arch to support a full arch of teeth, cost $15,000–$40,000 and are far more cost-effective.",
  },
  {
    q: "What affects dental implant costs the most?",
    a: "The number of teeth, implant brand quality, whether bone grafting is required, and your location are the biggest cost drivers. Specialist clinics charge significantly more than general dental practices.",
  },
  {
    q: "Is it worth travelling abroad for dental implants?",
    a: "Dental tourism can reduce costs by 50–75%. Mexico, Poland, Romania, and Thailand are popular destinations. Factor in travel costs, accommodation, and the need for follow-up appointments. Ensure the clinic is internationally accredited.",
  },
  {
    q: "How long does the dental implant process take?",
    a: "From initial consultation to final crown fitting, the process typically takes 3–9 months. If bone grafting is required, add another 3–6 months for healing. Same-day implants (immediate loading) are possible in some cases.",
  },
];

export default function DentalImplantCostPage() {
  return (
    <main className="bg-white text-gray-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <SimpleCalculatorHero
        eyebrowIcon="$"
        eyebrowText="Health · Cost Calculators"
        title="Dental Implant Cost Calculator"
        description="Get an accurate dental implant cost estimate based on treatment type, implant quality, clinic, and your country."
        chips={[
          "Single, multiple, full mouth, and All-on-4",
          "2026 US and UK price estimates",
          "Compare budget vs premium options",
        ]}
      >
        <DentalImplantCalculator />
      </SimpleCalculatorHero>

      <div className="bg-gray-50 px-5 py-5 sm:px-8 lg:px-16">
        <p className="mx-auto max-w-5xl text-sm font-medium text-gray-500">
          Estimates based on typical 2026 market prices. Individual clinic quotes may vary.{" "}
          <strong>Always get at least 3 quotes</strong> before committing to treatment.
        </p>
      </div>

      <section className="border-t border-gray-100 bg-white px-5 py-10 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl grid gap-3 sm:grid-cols-3">
          {statChips}
        </div>
      </section>

      {/* ── EDUCATIONAL CONTENT ──────────────────────────────────── */}
      <section className="bg-white px-5 py-16 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl space-y-16">

          {/* Average costs */}
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-950">
              Average Dental Implant Costs in 2026
            </h2>
            <p className="mt-3 text-base leading-relaxed text-gray-500">
              Dental implant costs vary widely depending on the treatment, country, and clinic. Here are typical ranges for the most common procedures.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { treatment: "Single Tooth",  range: "$2,200–$5,000", sub: "including crown",    color: "text-emerald-600"    },
                { treatment: "Multiple",      range: "$4,000–$20,000",sub: "2–6 teeth",          color: "text-emerald-500"   },
                { treatment: "Full Mouth",    range: "$20k–$60k",     sub: "14+ individual",     color: "text-emerald-600" },
                { treatment: "All-on-4",      range: "$15k–$40k",     sub: "per arch, 4 implants",color: "text-emerald-700" },
              ].map((item) => (
                <div key={item.treatment} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                  <p className="text-sm font-semibold text-gray-500">{item.treatment}</p>
                  <p className={`mt-1.5 text-2xl font-bold ${item.color}`}>{item.range}</p>
                  <p className="mt-0.5 text-xs text-gray-400">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* What drives cost */}
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-950">
              What Drives Dental Implant Costs?
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                { icon: "🦷", title: "Number of teeth", desc: "Each implant requires its own titanium post and crown. Full-mouth restorations multiply costs rapidly — All-on-4 addresses this with just 4 posts per arch." },
                { icon: "🏥", title: "Clinic type", desc: "Specialist implant clinics charge 20–35% more than general dental practices but offer advanced imaging, sedation, and complex case expertise." },
                { icon: "⭐", title: "Implant brand quality", desc: "Premium brands like Straumann and Nobel Biocare carry extensive warranties and clinical data. Budget brands reduce cost but may have shorter lifespans." },
                { icon: "🦴", title: "Bone grafting", desc: "Required when the jaw lacks sufficient bone density. Adds $800–$3,000+ per site and extends treatment by 3–6 months." },
                { icon: "📍", title: "Location", desc: "US and Australian clinics are among the most expensive globally. Eastern Europe, Mexico, and Southeast Asia can cost 60–75% less." },
                { icon: "💳", title: "Insurance & finance", desc: "Most insurance plans don't cover implants. Dental finance (0% for 12–24 months) is widely available and can make treatment accessible." },
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

          {/* FAQ */}
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-950">
              Frequently Asked Questions
            </h2>
            <div className="mt-6 space-y-4">
              {FAQ_ITEMS.map((faq, i) => (
                <div key={i} className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                  <p className="text-sm font-bold text-gray-900">{faq.q}</p>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── SECOND CTA ───────────────────────────────────────────── */}
      <section className="bg-gray-50 px-5 py-12 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">Next Step</p>
            <h2 className="mt-3 text-2xl font-bold text-gray-950">Ready to get real quotes?</h2>
            <p className="mx-auto mt-3 max-w-lg text-base leading-relaxed text-gray-500">
              Use this estimate as a benchmark, then get quotes from verified local dental clinics. No commitment required.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.98]"
            >
              Find local dental implant clinics →
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
