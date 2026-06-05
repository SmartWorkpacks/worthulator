import type { Metadata } from "next";
import RoadTripCostWithInsights from "@/components/worthcore/RoadTripCostWithInsights";
import SimpleCalculatorHero from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import StandardFAQSection from "@/src/templates/take-home-pay/StandardFAQSection";
import {
  StatChipsRow, ContentCardGrid, SEOTextBlock, InsightStrip, RelatedCalcCards,
} from "@/src/templates/take-home-pay/StandardSEOSection";
import { calculateRoadTripCost } from "@/calculations/travel/roadTripCost";
import { getUSStateFuelPrice, usStateFuelDataset } from "@/lib/datasets/usStateFuelPrices";

// ─── Live worked example (300-mi trip — refreshes with the gas dataset) ───────
const LIVE_GAS = getUSStateFuelPrice("National");
const AS_OF = usStateFuelDataset.currentPeriodLabel;
const usd = (n: number) => `$${Math.round(n).toLocaleString()}`;
const usd2 = (n: number) => `$${n.toFixed(2)}`;
const EX = calculateRoadTripCost(
  { distanceMiles: 300, mpg: 28, highwayPct: 85, tolls: 0, passengers: 1 },
  { gasPrice: LIVE_GAS },
);
const EX_PER_4 = Math.round((EX.totalTripCost / 4) * 100) / 100;

export const metadata: Metadata = {
  title: "Road Trip Cost Calculator 2026 – Live Gas Price Fuel Estimator",
  description:
    "Calculate real-world fuel cost for any road trip using your state's live gas price, highway/city MPG blend, tolls, and per-person split.",
  keywords: ["road trip cost calculator", "gas cost calculator", "fuel cost estimator", "road trip fuel calculator", "how much gas for road trip"],
  alternates: { canonical: "https://worthulator.com/tools/road-trip-cost" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "How do I calculate fuel cost for a road trip?",
    a: `Effective MPG = your EPA combined × a highway/city blend factor. Then: Gallons = Distance ÷ Effective MPG, and Fuel Cost = Gallons × Gas Price. For a 300-mile one-way trip at 28 MPG (85% highway → ${EX.effectiveMpg.toFixed(1)} effective MPG) and the current ${usd2(LIVE_GAS)}/gal US average (${AS_OF}): 600 ÷ ${EX.effectiveMpg.toFixed(1)} = ${EX.gallonsRoundTrip.toFixed(1)} gallons × ${usd2(LIVE_GAS)} = ${usd2(EX.roundTripFuelCost)} round trip.`,
  },
  {
    q: "Why does the calculator adjust my MPG for highway vs city?",
    a: "Your EPA combined rating is a lab blend — real highway driving runs ~10% better, city ~15% worse. A road trip at 85% highway pushes your effective MPG above the sticker number, meaning fewer gallons and lower cost. The slider lets you dial in the actual mix for your route.",
  },
  {
    q: "Does the calculator include tolls and overnight stops?",
    a: "Tolls are a direct input and get added to fuel for the total trip cost. For long hauls (over ~500 miles one-way), it also flags likely hotel nights so the true cost isn't understated — though lodging itself isn't added to the headline number.",
  },
  {
    q: "How much does carpooling really save?",
    a: `With 4 passengers, each person pays 25% of the total — a ${usd2(EX.totalTripCost)} solo trip becomes ${usd2(EX_PER_4)} per person. Carpooling is the single biggest lever for road trip costs because fuel consumption doesn't change with more passengers (weight impact is negligible for most cars).`,
  },
  {
    q: "When is driving cheaper than flying?",
    a: "At the average domestic round-trip airfare of ~$380/person (BTS), solo driving is cheaper for most trips under ~1,500 miles. With 3–4 passengers, driving wins on almost any distance — the per-person fuel cost drops so fast that even a cross-country drive can undercut flights. Factor in hotel nights for trips over 500 miles one-way.",
  },
];

const STATS = [
  { stat: `${EX.effectiveMpg.toFixed(1)} MPG`, color: "text-emerald-600", accent: "bg-emerald-500", label: "Effective MPG at 85% highway — 10% better than a 28 MPG EPA combined rating" },
  { stat: "÷ people", color: "text-blue-600",    accent: "bg-blue-500",    label: "Splitting fuel among passengers is the single biggest road trip cost lever" },
  { stat: "~$380",    color: "text-amber-600",   accent: "bg-amber-500",   label: "Average US domestic round-trip airfare (BTS) — the drive-vs-fly benchmark" },
];

const CONTENT_CARDS = [
  {
    icon: "📍",
    title: "Your state sets the price",
    body: "Gas isn't one national number. California regularly runs over $4.50/gallon while Gulf Coast and Mountain states sit far lower. This calculator pulls your state's live average so the same 300-mile trip shows very different costs depending on where you start.",
  },
  {
    icon: "⛽",
    title: "Highway MPG is higher than you think",
    body: `Road trips are mostly highway miles. At 85% highway, a 28 MPG car runs at ~${EX.effectiveMpg.toFixed(1)} effective MPG — using fewer gallons than the sticker implies. The highway/city slider lets you see exactly how much your route profile matters.`,
  },
  {
    icon: "👥",
    title: "Carpooling is the biggest lever",
    body: `Adding passengers doesn't meaningfully increase fuel consumption — but it divides the cost. With 4 people a ${usd2(EX.totalTripCost)} round trip becomes ${usd2(EX_PER_4)} each. For group trips, driving almost always beats flying on a per-person basis.`,
  },
];

const RELATED_CALCS = [
  { title: "Commute Cost Calculator",     description: "See the annual cost of your daily commute.",                href: "/tools/commute-cost-calculator",     icon: "🏙️", accent: "bg-emerald-500/10" },
  { title: "EV vs Gas Calculator",        description: "Compare annual driving costs for EV vs gas.",              href: "/tools/ev-vs-gas",                   icon: "⚡", accent: "bg-blue-500/10" },
  { title: "Car Loan Calculator",         description: "Calculate monthly payment and total interest on a car loan.", href: "/tools/car-loan-calculator",       icon: "🚗", accent: "bg-amber-500/10" },
  { title: "Tip Calculator",              description: "Calculate the right tip and split a bill among your group.", href: "/tools/tip-calculator",             icon: "🧾", accent: "bg-violet-500/10" },
];

export default function RoadTripCostPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Road Trip Cost Calculator",
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Web",
      description: "Calculate real-world fuel cost for any road trip using your state's live gas price, highway/city MPG blend, tolls, and per-person split.",
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
        description="Pick your state for a live gas price, set your route distance and highway mix, then see one-way and round-trip fuel cost — with per-person split and a drive-vs-fly comparison."
        chips={["Live state gas prices", "Highway/city MPG blend", "Drive vs fly comparison"]}
      >
        <RoadTripCostWithInsights />
      </SimpleCalculatorHero>

      <InsightStrip
        text='With 4 passengers, your per-person road trip fuel cost drops to a quarter of driving solo — <span class="font-semibold text-gray-900">carpooling is one of the biggest easy wins in personal transport costs.</span>'
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="What really drives your road trip cost"
        subtitle="State gas prices, driving profile, and passenger count matter more than distance alone."
        cards={CONTENT_CARDS}
      />

      <SEOTextBlock
        title="How the Road Trip Cost Calculator Works"
        formula={`Effective MPG    = EPA Combined × (Hwy% × 1.10 + City% × 0.85)
Gallons One Way  = Distance ÷ Effective MPG
Gallons Round Trip = Gallons One Way × 2
Fuel Cost (RT)   = Gallons Round Trip × State Gas Price
Total Trip Cost  = Fuel Cost + Tolls
Cost Per Person  = Total Trip Cost ÷ Passengers`}
        steps={[
          { label: "Pick your state", description: "Loads the live average gas price for your state, so the estimate reflects where you actually fill up." },
          { label: "Enter one-way distance", description: "Miles from start to destination. The calculator doubles it for the round trip." },
          { label: "Set your fuel economy", description: "Your EPA combined MPG — the calculator blends it with your highway/city mix for a real-world figure." },
          { label: "Adjust highway %", description: "Road trips are ~85% highway. More highway means better effective MPG and lower cost." },
          { label: "Add tolls and passengers", description: "Tolls are added to fuel cost. Passengers split the total evenly — 4 people means 75% off per person." },
        ]}
        paragraphs={[
          "The key innovation is the highway/city blend. Your EPA combined rating averages city and highway driving 55/45 — but a real road trip is 80–95% highway. We adjust your MPG accordingly: highway runs ~10% above the combined sticker, city ~15% below. This means the calculator estimates fewer gallons than a naive distance ÷ MPG, which is more accurate for actual trips.",
          "Because fuel uses your state's live gas price, the same 300-mile trip costs very different amounts starting in California vs Texas. We also compare driving against the average domestic round-trip airfare (~$380/person, BTS), so you can see at what passenger count driving becomes cheaper than flying.",
        ]}
      />

      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      <RelatedCalcCards
        title="Related Calculators"
        subtitle="More tools for travel and driving costs."
        items={RELATED_CALCS}
      />
    </main>
  );
}
