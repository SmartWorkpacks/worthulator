import type { Metadata } from "next";
import CalculatorEngineLoader from "@/components/calculator-engine/CalculatorEngineLoader";
import SimpleCalculatorHero from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import StandardFAQSection from "@/src/templates/take-home-pay/StandardFAQSection";
import {
  StatChipsRow, ContentCardGrid, SEOTextBlock, InsightStrip, RelatedCalcCards,
} from "@/src/templates/take-home-pay/StandardSEOSection";

export const metadata: Metadata = {
  title: "Road Trip Cost Calculator 2026 – Gas Cost Estimator",
  description:
    "Calculate total fuel cost for any road trip based on distance, your car's MPG, and local gas prices. Includes per-person split for group trips.",
  keywords: ["road trip cost calculator", "gas cost calculator", "fuel cost estimator", "road trip fuel calculator", "how much gas for road trip"],
  alternates: { canonical: "https://worthulator.com/tools/road-trip-cost" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "How do I calculate fuel cost for a road trip?",
    a: "Fuel Cost = (Distance / MPG) × Gas Price Per Gallon. For a 300-mile trip at 30 MPG with gas at $3.50/gal: 300 / 30 = 10 gallons × $3.50 = $35 one way, $70 round trip. This calculator does the math instantly for any combination of values.",
  },
  {
    q: "What is a realistic MPG for road trips?",
    a: "Highway driving is more efficient than city driving — most cars get 10–20% better MPG on the highway than their combined EPA rating. Check your car's specific EPA highway rating at fueleconomy.gov. For a rough estimate, use your combined rating; for a more accurate result, use your highway MPG.",
  },
  {
    q: "How do I find the current gas price in my area?",
    a: "GasBuddy.com and the GasBuddy app show current prices by zip code and gas station. The AAA national average is updated daily and is a good proxy if you're estimating for a multi-state trip. You can also check Google Maps — it shows gas prices at stations along your route.",
  },
  {
    q: "Why is the calculator round-trip by default?",
    a: "Most road trips are return journeys. The calculator shows one-way fuel cost separately so you can plan for trips where you won't be driving back (e.g. moving, one-way flights). The per-person cost is based on the round-trip total, divided evenly.",
  },
  {
    q: "What other costs should I budget for a road trip?",
    a: "Fuel is typically 30–40% of road trip costs. Other major expenses: accommodation ($80–$200/night), food ($30–$60/person/day), tolls, and parking. Electric vehicle drivers should budget for charging stops and time, which varies significantly by route and charging infrastructure.",
  },
];

const STATS = [
  { stat: "$3.50",    color: "text-amber-600",   accent: "bg-amber-500",   label: "Approximate average US regular gas price in 2026 — check local prices before a long trip" },
  { stat: "28 MPG",   color: "text-emerald-600", accent: "bg-emerald-500", label: "Approximate average fuel economy of new US passenger vehicles — highway driving is typically better" },
  { stat: "÷ people", color: "text-blue-600",    accent: "bg-blue-500",    label: "Split the total cost evenly among all passengers — carpooling dramatically cuts per-person fuel cost" },
];

const CONTENT_CARDS = [
  {
    icon: "⛽",
    title: "Highway MPG is higher than city MPG",
    body: "Long highway drives are more fuel-efficient than city driving. If your car's combined EPA rating is 30 MPG, your highway MPG is likely 32–36 MPG. Use the highway figure for an accurate road trip estimate — otherwise you'll overestimate your fuel spend.",
  },
  {
    icon: "👥",
    title: "Carpooling is a massive cost multiplier",
    body: "Driving solo costs $70 in fuel for a 300-mile round trip at 30 MPG and $3.50/gal. With 4 people, each person pays $17.50. The per-person cost drops almost four-fold for the same trip. This is why carpooling is one of the most impactful transport cost savings available.",
  },
  {
    icon: "🗺️",
    title: "Fuel is only 30–40% of road trip costs",
    body: "Gas is often the most visible road trip cost but rarely the biggest. Accommodation, food, and tolls usually exceed fuel costs on multi-day trips. Use this calculator for fuel, then add $100–$150/person/day for a full trip budget estimate.",
  },
];

const RELATED_CALCS = [
  {
    title: "Car Loan Calculator",
    description: "Calculate your monthly payment and total interest on any vehicle loan.",
    href: "/tools/car-loan-calculator",
    icon: "🚗",
    accent: "bg-blue-500/10",
  },
  {
    title: "Commute Time Value Calculator",
    description: "See the real cost of your daily commute in money and time.",
    href: "/tools/commute-time-value",
    icon: "🏙️",
    accent: "bg-emerald-500/10",
  },
  {
    title: "Laundry Cost Calculator",
    description: "Calculate the true cost per load of laundry.",
    href: "/tools/laundry-cost-calculator",
    icon: "🧺",
    accent: "bg-amber-500/10",
  },
  {
    title: "Tip Calculator",
    description: "Calculate the right tip and split a bill among your group.",
    href: "/tools/tip-calculator",
    icon: "🧾",
    accent: "bg-violet-500/10",
  },
];

export default function RoadTripCostPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Road Trip Cost Calculator",
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Web",
      description: "Calculate total road trip fuel cost based on distance, MPG, and gas price — with per-person split for group travel.",
      url: "https://worthulator.com/tools/road-trip-cost",
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
        eyebrowText="Travel · Transport"
        title="Road Trip Cost Calculator"
        description="Enter your trip distance, car's fuel efficiency, and local gas price to instantly calculate one-way and round-trip fuel cost — split by passenger."
        chips={["One-way and round-trip cost", "Per-person split", "Total gallons used"]}
      >
        <CalculatorEngineLoader slug="road-trip-cost" />
      </SimpleCalculatorHero>

      <InsightStrip
        text='With 4 passengers, your per-person road trip fuel cost drops to a quarter of driving solo. <span class="font-semibold text-gray-900">Carpooling is one of the biggest easy wins in personal transport costs.</span>'
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="Get your road trip fuel budget right"
        subtitle="Three things that affect your real-world fuel cost."
        cards={CONTENT_CARDS}
      />

      <SEOTextBlock
        title="How the Road Trip Cost Calculator Works"
        formula={`Gallons (one way) = Distance (miles) / MPG
Gallons (round trip) = Gallons (one way) × 2

One-Way Cost  = Gallons (one way) × Gas Price
Round-Trip Cost = Gallons (round trip) × Gas Price

Cost Per Person = Round-Trip Cost / Passengers`}
        steps={[
          { label: "Enter one-way distance", description: "Miles from your starting point to destination. Check Google Maps or your navigation app for an accurate figure." },
          { label: "Set your fuel efficiency", description: "Use your car's EPA highway rating for a road trip — this is typically 10–20% better than the combined rating." },
          { label: "Enter current gas price", description: "Check GasBuddy, AAA, or Google Maps for local prices. National averages are a reliable fallback." },
          { label: "Add passengers for split", description: "Set to 1 for solo travel. For group trips, the per-person cost updates automatically." },
        ]}
        paragraphs={[
          "The formula is simple — distance divided by MPG gives gallons, multiplied by price gives cost. The power is in running it for different scenarios quickly: comparing routes, evaluating whether driving vs flying makes sense, or budgeting for a long trip with multiple legs.",
          "For EV drivers: this calculator assumes a combustion engine. Electric vehicle range and charging costs vary by model and route. A rough EV equivalent: use kWh/100 miles from your vehicle spec, multiply by route miles, then multiply by your electricity rate (or average charging rate on the route).",
        ]}
      />

      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      <RelatedCalcCards
        title="Related Calculators"
        subtitle="More tools for travel and everyday costs."
        items={RELATED_CALCS}
      />
    </main>
  );
}
