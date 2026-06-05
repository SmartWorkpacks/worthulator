import type { Metadata } from "next";
import CommuteCostWithInsights from "@/components/worthcore/CommuteCostWithInsights";
import SimpleCalculatorHero from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import StandardFAQSection from "@/src/templates/take-home-pay/StandardFAQSection";
import {
  StatChipsRow,
  ContentCardGrid,
  SEOTextBlock,
  InsightStrip,
  RelatedCalcCards,
} from "@/src/templates/take-home-pay/StandardSEOSection";
import { calculateCommuteCost } from "@/calculations/work/commuteCost";
import { getUSStateFuelPrice, usStateFuelDataset } from "@/lib/datasets/usStateFuelPrices";

// ─── Live worked example (national-average commute — refreshes with the data) ─
const LIVE_GAS = getUSStateFuelPrice("National");
const AS_OF = usStateFuelDataset.currentPeriodLabel;
const usd = (n: number) => `$${Math.round(n).toLocaleString()}`;
const usd2 = (n: number) => `$${n.toFixed(2)}`;
const EX = calculateCommuteCost(
  { milesOneWay: 16, mpg: 28, officeDaysPerWeek: 5, weeksPerYear: 49 },
  { gasPrice: LIVE_GAS },
);

export const metadata: Metadata = {
  title: "Commute Cost Calculator 2026 – Annual Fuel Cost of Your Drive",
  description:
    "Calculate the true annual cost of your commute using your state's live gas price. Set your route and office schedule for fuel, wear & tear, and work-from-home savings.",
  keywords: ["commute cost calculator", "driving to work cost", "commute fuel cost", "how much does my commute cost", "annual commute cost"],
  alternates: { canonical: "https://worthulator.com/tools/commute-cost-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "How much does the average commute cost per year?",
    a: `The average US commuter drives about 16 miles each way — 32 miles round trip. At 28 MPG and the current ${usd2(LIVE_GAS)}/gallon national average (${AS_OF}), 5 days a week over 49 weeks (${EX.effectiveDaysPerYear} commute days) is roughly ${usd(EX.annualFuelCost)}/year in fuel. Add wear and tear at $0.10/mile (~${usd(EX.wearCostPerYear)}) and the true cost is closer to ${usd(EX.totalCostPerYear)} — before insurance, parking, or depreciation.`,
  },
  {
    q: "Does this calculator include wear and tear?",
    a: "Yes. Alongside the fuel cost, it shows a 'true annual cost' that adds wear and tear at $0.10/mile — the IRS/AAA estimate covering tires, oil, and brakes (it excludes insurance and depreciation). The IRS standard mileage rate (67 cents/mile in 2024) is the broader all-in figure if you want to include everything.",
  },
  {
    q: "How do I calculate my commute cost per day?",
    a: `Round-trip miles ÷ MPG × your gas price = daily fuel cost. For 32 miles round trip at 28 MPG and ${usd2(LIVE_GAS)}/gallon: 32 ÷ 28 × ${usd2(LIVE_GAS)} = ${usd2(EX.costPerDay)}/day. Over ${EX.effectiveDaysPerYear} commute days (5 days × 49 weeks) that's about ${usd(EX.annualFuelCost)}/year in fuel.`,
  },
  {
    q: "How much does a commute cost over 10 years?",
    a: `Quite a lot once gas inflation is included. The average 16-mile commute above runs about ${usd(EX.tenYearInflatedCost)} in fuel over a decade at ~3%/year gas inflation — not counting wear, parking, or the value of the time spent. A shorter drive or a higher-MPG car compounds in your favour the same way.`,
  },
  {
    q: "How does hybrid or remote work change the result?",
    a: "It's driven by office days per week × weeks per year. Dropping from 5 to 4 office days cuts a full-time commute's fuel cost by 20%; a 3-day hybrid week cuts it by 40%. Each office day you remove saves a whole year's worth of that day's fuel — and the calculator shows exactly how much.",
  },
];

const STATS = [
  { stat: "16 mi", color: "text-emerald-600", accent: "bg-emerald-500", label: "Average US one-way commute distance (Census ACS) — about 32 miles round trip" },
  { stat: "$0.10/mi", color: "text-blue-600", accent: "bg-blue-500",    label: "Wear & tear beyond fuel — tires, oil, and brakes (IRS/AAA estimate)" },
  { stat: "1 day", color: "text-amber-600",   accent: "bg-amber-500",   label: "Dropping one office day per week cuts a 5-day commute's fuel cost by 20%" },
];

const CONTENT_CARDS = [
  {
    icon: "📍",
    title: "Your state sets the price",
    body: "Gas isn't one national number. California regularly runs over $4.50/gallon while Gulf Coast and Mountain states sit far lower. This calculator pulls your state's live average, so an identical 30-mile commute can cost hundreds more or less depending on where you fill up.",
  },
  {
    icon: "🔧",
    title: "Wear & tear is the silent half",
    body: `Fuel gets the attention, but tires, oil, and brakes cost roughly $0.10/mile (the IRS/AAA estimate). On a 16-mile one-way commute (5 days a week) that's ~${usd(EX.wearCostPerYear)}/year on top of fuel — which is why we show fuel and true cost side by side.`,
  },
  {
    icon: "🏠",
    title: "The hybrid math is bigger than it looks",
    body: "Office days per week × weeks per year is your real commute count. A 3-day hybrid week over 49 weeks is 147 commute days, not 250 — and each office day you drop saves a full week's worth of that day's fuel every year.",
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
        description="Pick your state for a live gas price, then set your route and office schedule. See your annual fuel cost, the true cost with wear & tear, and what each work-from-home day saves."
        chips={["Live state gas prices", "Hybrid schedule aware", "Fuel + wear true cost"]}
      >
        <CommuteCostWithInsights />
      </SimpleCalculatorHero>
      <InsightStrip text='Your commute costs money and time — <span class="font-semibold text-gray-900">most people underestimate both by a factor of 2 or more.</span>' />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="The real cost of getting to work" subtitle="Fuel is only part of what your commute takes from you." cards={CONTENT_CARDS}
      />

      <SEOTextBlock
        title="How the Commute Cost Calculator Works"
        formula={`Commute Days/Yr = Office Days/Week × Weeks/Year
Cost Per Day    = (Miles One Way × 2 ÷ MPG) × State Gas Price
Annual Fuel     = Cost Per Day × Commute Days/Yr
Wear & Tear     = Annual Miles × $0.10/mile
True Annual     = Annual Fuel + Wear & Tear`}
        steps={[
          { label: "Pick your state", description: "Loads the live average gas price for your state, so the result reflects where you actually fill up." },
          { label: "Enter one-way miles", description: "Distance from home to office — the calculator doubles it for the round trip." },
          { label: "Enter your MPG", description: "Check your dashboard or the manufacturer's spec. City MPG runs 15–20% below the highway figure." },
          { label: "Set your office schedule", description: "Office days per week × weeks per year. A 3-day hybrid week over 49 weeks is 147 commute days, not 250." },
        ]}
        paragraphs={[
          "Fuel is only part of the picture. We also add wear and tear at the IRS/AAA estimate of $0.10/mile (tires, oil, brakes) to show your true annual cost — before insurance, parking, or depreciation.",
          "Because fuel uses your state's live gas price, two identical commutes can cost very different amounts: California gas runs far above Texas or the Gulf Coast. We also project the 10-year cost with ~3%/year gas inflation, so you can see how today's drive compounds.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />
      <RelatedCalcCards title="Related Calculators" subtitle="More tools for work and driving costs." items={RELATED_CALCS} />
    </main>
  );
}
