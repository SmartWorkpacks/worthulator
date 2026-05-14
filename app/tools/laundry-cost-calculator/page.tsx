import type { Metadata } from "next";
import CalculatorEngineLoader from "@/components/calculator-engine/CalculatorEngineLoader";
import SimpleCalculatorHero from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import StandardFAQSection from "@/src/templates/take-home-pay/StandardFAQSection";
import {
  StatChipsRow, ContentCardGrid, SEOTextBlock, InsightStrip, RelatedCalcCards,
} from "@/src/templates/take-home-pay/StandardSEOSection";

export const metadata: Metadata = {
  title: "Laundry Cost Calculator 2026 – Cost Per Load",
  description:
    "Calculate the true cost of each laundry load including electricity, water, and detergent — plus your weekly and annual laundry bill.",
  keywords: ["laundry cost calculator", "cost per laundry load", "how much does laundry cost", "washing machine cost per load", "laundry expense calculator"],
  alternates: { canonical: "https://worthulator.com/tools/laundry-cost-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "How much does one load of laundry cost?",
    a: "The typical cost in the US is $0.80–$1.50 per load at home, depending on your electricity rate, whether you use a gas or electric dryer, water costs, and detergent. At-home laundry is significantly cheaper than a laundromat ($3–$5 per load). This calculator shows your personal cost based on your actual inputs.",
  },
  {
    q: "How much electricity does a washer and dryer use?",
    a: "A standard top-loading washer uses approximately 0.3–0.5 kWh per cycle. An electric dryer uses 3.0–4.0 kWh per cycle. Combined, expect about 3.5–4.5 kWh per complete laundry load. This calculator uses 3.8 kWh as the combined default, which is a good average for standard US appliances.",
  },
  {
    q: "Does washing in cold water save money?",
    a: "Yes, significantly. About 90% of the energy used by a washing machine goes toward heating water. Cold-water cycles use approximately 0.1–0.3 kWh instead of 0.3–0.5 kWh — a reduction of 40–60% for the wash cycle. Modern detergents are formulated to work in cold water. The dryer remains the dominant energy cost regardless.",
  },
  {
    q: "How much water does a washing machine use per load?",
    a: "A modern Energy Star-certified front-loader uses 15–20 gallons per load. Older top-loaders use 25–40 gallons. At the US average water rate of about $0.004–$0.006 per gallon, water costs are typically $0.06–$0.20 per load — significant, but less than electricity and detergent.",
  },
  {
    q: "How can I reduce my laundry costs?",
    a: "The biggest savings: (1) Run only full loads — half-loads use similar electricity and water. (2) Switch to cold water washing. (3) Clean the dryer lint trap before every load for better airflow. (4) Use the sensor dry setting instead of a timer. (5) Buy larger detergent bottles — the cost per load drops dramatically with size.",
  },
];

const STATS = [
  { stat: "3.8 kWh",  color: "text-amber-600",   accent: "bg-amber-500",   label: "Average electricity per load — washer (~0.5 kWh) plus electric dryer (~3.3 kWh) combined" },
  { stat: "~$1.10",   color: "text-emerald-600", accent: "bg-emerald-500", label: "Typical at-home cost per load (electricity + water + detergent) at US average rates in 2026" },
  { stat: "8 loads",  color: "text-blue-600",    accent: "bg-blue-500",    label: "Average weekly loads for a US family of 4 — adding up to $400–$500/year in laundry costs" },
];

const CONTENT_CARDS = [
  {
    icon: "⚡",
    title: "The dryer is the expensive half",
    body: "The washing machine uses roughly 0.5 kWh per load. The electric dryer uses 3.0–4.0 kWh — six to eight times more. If you want to meaningfully reduce your electricity bill, focus on the dryer: clean the lint trap, use sensor-dry, air-dry when possible, or switch to a heat-pump dryer.",
  },
  {
    icon: "🧴",
    title: "Detergent cost varies wildly by brand and size",
    body: "Store-brand detergent can cost as little as $0.08 per load. Premium pods can cost $0.50–$0.75 per load. The difference over 400 loads per year is $168–$268. Buying larger formats almost always lowers the cost per load — check the unit price, not the shelf price.",
  },
  {
    icon: "💧",
    title: "Full loads are the easiest optimization",
    body: "Running a half-load uses roughly the same electricity and water as a full load. Consolidating 8 half-loads into 4 full loads effectively halves your laundry costs with zero sacrifice in cleanliness. Most Energy Star washers have a load-sensing feature — use it.",
  },
];

const RELATED_CALCS = [
  {
    title: "Paint Coverage Calculator",
    description: "Calculate how many gallons of paint you need for any room.",
    href: "/tools/paint-coverage-calculator",
    icon: "🎨",
    accent: "bg-blue-500/10",
  },
  {
    title: "Grocery Unit Price Calculator",
    description: "Find the best-value size or brand by price per ounce.",
    href: "/tools/grocery-unit-price",
    icon: "🛒",
    accent: "bg-emerald-500/10",
  },
  {
    title: "Subscription Auditor",
    description: "Audit all your monthly subscriptions and find savings.",
    href: "/tools/subscription-auditor",
    icon: "💸",
    accent: "bg-amber-500/10",
  },
  {
    title: "Tip Calculator",
    description: "Calculate the right tip and split any bill fairly.",
    href: "/tools/tip-calculator",
    icon: "🧾",
    accent: "bg-violet-500/10",
  },
];

export default function LaundryCostCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Laundry Cost Calculator",
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Web",
      description: "Calculate the true cost per laundry load including electricity, water, and detergent — and your weekly and annual laundry bill.",
      url: "https://worthulator.com/tools/laundry-cost-calculator",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQS.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })),
    },
  ];

  return (
    <main className="bg-white text-gray-900">
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      <SimpleCalculatorHero
        eyebrowIcon="🧺"
        eyebrowText="Home · Everyday Costs"
        title="Laundry Cost Calculator"
        description="Enter your electricity rate, weekly loads, and detergent cost to see the real price per load — and your annual laundry bill."
        chips={["Cost per load", "Weekly and annual totals", "Electricity cost breakdown"]}
      >
        <CalculatorEngineLoader slug="laundry-cost-calculator" />
      </SimpleCalculatorHero>

      <InsightStrip
        text='The dryer uses 6–8× more electricity than the washer. <span class="font-semibold text-gray-900">That&apos;s where most of your laundry bill actually comes from.</span>'
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="The hidden cost of doing laundry"
        subtitle="Electricity, water, and detergent — here's what each actually costs."
        cards={CONTENT_CARDS}
      />

      <SEOTextBlock
        title="How the Laundry Cost Calculator Works"
        formula={`Electricity per Load = (Washer kWh + Dryer kWh) × Rate
  = (0.5 + 3.3) × Rate = 3.8 × Rate

Water per Load = 20 gallons × $0.004/gal = $0.08 (approx)

Cost per Load = Electricity + Water + Detergent Cost

Weekly Cost = Cost per Load × Loads per Week
Annual Cost = Weekly Cost × 52`}
        steps={[
          { label: "Set your electricity rate", description: "Check your most recent utility bill for kWh rate. US average is ~$0.16/kWh but varies significantly by state." },
          { label: "Enter weekly loads", description: "Count actual loads including colours, whites, delicates, and bedding. Most households run 4–10 loads per week." },
          { label: "Set detergent cost per load", description: "Divide your detergent bottle price by the number of loads on the label. Premium pods: $0.40–0.75. Budget liquid: $0.08–0.20." },
          { label: "See your annual laundry spend", description: "Weekly cost × 52 — the number most people have never calculated but find surprisingly large." },
        ]}
        paragraphs={[
          "Most people think of laundry as a fixed, invisible cost. This calculator makes it concrete: at $1.10/load and 6 loads/week, you're spending $343/year. At $1.50/load and 8 loads/week (a family of four), it's over $600/year. That's before adding laundromat visits, dry cleaning, or hand-washing specialized items.",
          "The biggest lever is the electricity rate — if you're in a high-rate state like California or Hawaii ($0.25–0.35/kWh), your cost per load can reach $1.50–$1.80 in electricity alone. In a low-rate state like Louisiana ($0.10/kWh), it's under $0.50. Cold-water washing is the single most impactful change most households can make.",
        ]}
      />

      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      <RelatedCalcCards
        title="Related Calculators"
        subtitle="More tools for everyday household costs."
        items={RELATED_CALCS}
      />
    </main>
  );
}
