import type { Metadata } from "next";
import CalculatorEngineLoader from "@/components/calculator-engine/CalculatorEngineLoader";
import SimpleCalculatorHero from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import StandardFAQSection from "@/src/templates/take-home-pay/StandardFAQSection";
import {
  StatChipsRow,
  ContentCardGrid,
  SEOTextBlock,
  InsightStrip,
  RelatedCalcCards,
} from "@/src/templates/take-home-pay/StandardSEOSection";

export const metadata: Metadata = {
  title: "Commute Cost Calculator 2026 – Annual Fuel Cost of Your Drive",
  description:
    "Calculate the true annual fuel cost of your daily commute. Enter your one-way miles, MPG, gas price, and work days for an instant breakdown.",
  keywords: ["commute cost calculator", "driving to work cost", "commute fuel cost", "how much does my commute cost", "annual commute cost"],
  alternates: { canonical: "https://worthulator.com/tools/commute-cost-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "How much does the average commute cost per year?",
    a: "The average US commuter drives about 30 miles round trip per day. At 28 MPG and $3.50/gallon, that's about $1,340/year in fuel alone. Add wear and tear ($0.08–0.12/mile), insurance, and parking, and total commute costs often exceed $3,000–5,000/year.",
  },
  {
    q: "Does this calculator include wear and tear?",
    a: "No — this calculator covers fuel costs only. The IRS standard mileage rate (67 cents/mile in 2024) is a comprehensive estimate that includes fuel, oil, tires, maintenance, insurance, and depreciation. Multiply your annual miles by ~$0.10–0.12 for wear and tear alone.",
  },
  {
    q: "How do I calculate my commute cost per day?",
    a: "Round trip miles ÷ MPG × gas price = daily fuel cost. For 30 miles round trip at 28 MPG and $3.50/gallon: 30 ÷ 28 × $3.50 = $3.75/day. Over 250 work days, that's $937.50/year in fuel.",
  },
  {
    q: "Is it cheaper to take public transit?",
    a: "In most US cities, yes. A monthly transit pass ($50–150) is almost always cheaper than driving. But factor in time — public transit often takes 1.5–2× longer each way. Assign a dollar value to your time and include it in the comparison.",
  },
  {
    q: "How does remote work affect commute cost?",
    a: "Dramatically. One remote day per week saves 20% of annual commute costs. Two days saves 40%. Many workers who switched to hybrid work during 2020–2023 saved $1,500–3,000/year in commuting costs alone — not counting wear on the car or reclaimed time.",
  },
];

const STATS = [
  { stat: "27min", color: "text-emerald-600", accent: "bg-emerald-500", label: "Average US one-way commute time in 2026 — 54 minutes per day, 225 hours per year" },
  { stat: "$3k+",  color: "text-blue-600",    accent: "bg-blue-500",    label: "Average total annual commute cost including fuel, wear, and parking" },
  { stat: "1 day", color: "text-amber-600",   accent: "bg-amber-500",   label: "One remote day per week cuts commute costs by 20% instantly" },
];

const CONTENT_CARDS = [
  {
    icon: "⏱️",
    title: "Time is the hidden cost",
    body: "A 30-minute one-way commute costs 250 hours per year — over 10 full 24-hour days. At $35/hour, that's $8,750 in time value annually. Most people never count this, but it's often larger than the fuel cost.",
  },
  {
    icon: "🔋",
    title: "Electric vehicles change the math",
    body: "An EV costs about $0.03–0.05/mile to charge vs $0.10–0.15/mile in gas. On a 30-mile daily round trip, EVs save $400–800/year in fuel alone. Over 5 years, that offsets much of the premium purchase price.",
  },
  {
    icon: "🏠",
    title: "Commute vs higher rent",
    body: "Living closer to work costs more in rent — but a 30-minute shorter commute saves 125 hours/year. Only you can decide what your time is worth, but for many workers an extra $200–300/month in rent to halve their commute is easily worth it.",
  },
];

const RELATED_CALCS = [
  { title: "Road Trip Cost Calculator",     description: "Estimate fuel cost for any road trip.",               href: "/tools/road-trip-cost",              icon: "🛣️", accent: "bg-emerald-500/10" },
  { title: "Car Affordability Calculator",  description: "Find the max car price for your income.",             href: "/tools/car-affordability-calculator", icon: "🚗", accent: "bg-blue-500/10" },
  { title: "Meeting Cost Calculator",       description: "See the dollar cost of time in meetings.",             href: "/tools/meeting-cost-calculator",     icon: "📅", accent: "bg-amber-500/10" },
  { title: "PTO Calculator",                description: "Calculate the cash value of your unused vacation.",    href: "/tools/pto-calculator",              icon: "🏖️", accent: "bg-purple-500/10" },
];

export default function CommuteCostCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Commute Cost Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description: "Calculate the annual fuel cost of your daily commute to work.",
      url: "https://worthulator.com/tools/commute-cost-calculator",
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
        eyebrowIcon="🚗"
        eyebrowText="Work · Productivity"
        title="Commute Cost Calculator"
        description="Enter your one-way miles, MPG, gas price, and work days to see your annual fuel cost — and what working from home one day saves."
        chips={["Annual fuel cost", "Monthly & daily breakdown", "Gas price impact"]}
      >
        <CalculatorEngineLoader slug="commute-cost" />
      </SimpleCalculatorHero>
      <InsightStrip text='Your commute costs money and time — <span class="font-semibold text-gray-900">most people underestimate both by a factor of 2 or more.</span>' />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="The real cost of getting to work" subtitle="Fuel is only part of what your commute takes from you." cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the Commute Cost Calculator Works"
        formula={`Daily Miles    = Miles One Way × 2
Cost Per Day   = (Daily Miles ÷ MPG) × Gas Price
Annual Cost    = Cost Per Day × Work Days Per Year
Monthly Cost   = Annual Cost ÷ 12`}
        steps={[
          { label: "Enter one-way miles", description: "Distance from home to office — the calculator doubles it for round trip." },
          { label: "Enter your MPG", description: "Check your car's dashboard or the manufacturer's spec. City MPG is typically 15–20% lower than highway." },
          { label: "Enter current gas price", description: "Use your local price per gallon — it varies significantly by region." },
          { label: "Set work days per year", description: "250 is typical (5 days × 50 weeks). Adjust for hybrid schedules." },
        ]}
        paragraphs={[
          "This calculator covers fuel costs only. For total commute cost, add wear and tear (roughly $0.10/mile), parking fees, and the value of your time.",
          "To estimate your hybrid savings: reduce work days by the number of remote days. If you work 3 days in office, use 150 work days instead of 250 — saving 40% of your annual commute cost.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />
      <RelatedCalcCards title="Related Calculators" subtitle="More tools for work and driving costs." items={RELATED_CALCS} />
    </main>
  );
}
