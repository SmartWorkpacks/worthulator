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
  title: "Appliance Energy Cost Calculator 2026 – How Much Does It Cost to Run?",
  description:
    "Calculate the daily, monthly, and annual electricity cost of any appliance. Enter wattage, hours per day, and your electricity rate to see running costs.",
  keywords: ["appliance energy cost calculator", "electricity cost calculator", "how much does it cost to run", "kWh cost calculator"],
  alternates: { canonical: "https://worthulator.com/tools/appliance-energy-cost" },
};

const FAQS = [
  {
    q: "How do I calculate the cost to run an appliance?",
    a:
      "Energy cost = (watts ÷ 1000) × hours used × electricity rate in $/kWh. For example, a 200W TV running 8 hours/day at $0.15/kWh costs: (200 ÷ 1000) × 8 × 0.15 = $0.24/day, or about $7.20/month.",
  },
  {
    q: "What is the average US electricity rate?",
    a:
      "As of 2025, the US average is approximately $0.15–$0.17/kWh, but rates vary significantly by state. Hawaii averages ~$0.40/kWh. Louisiana averages ~$0.10/kWh. Check your electricity bill for your exact rate — it's usually listed as $/kWh or cents per kWh.",
  },
  {
    q: "How do I find my appliance's wattage?",
    a:
      "Check the label on the back or bottom of the appliance, the product manual, or the manufacturer's website. If the label shows amps (A) instead of watts: watts = volts × amps. Most US appliances run at 120V, so a 10A device = 1,200W.",
  },
  {
    q: "Which home appliances use the most electricity?",
    a:
      "The biggest electricity consumers are typically: electric water heaters (4,000–5,500W), central AC/heat pump (3,000–5,000W), electric dryer (5,000–6,000W), electric oven (2,000–5,000W), and refrigerators (100–800W, running 24/7). Phantom loads from standby electronics add up too.",
  },
  {
    q: "How can I reduce my electricity bill?",
    a:
      "Replace old appliances with ENERGY STAR models, switch to LED lighting, install a smart thermostat, run dishwashers and washing machines during off-peak hours, unplug devices not in use, and add attic insulation. These steps can cut home energy use 20–30%.",
  },
];

const STATS = [
  { stat: "$0.15", color: "text-emerald-600", accent: "bg-emerald-500", label: "average US electricity rate per kilowatt-hour" },
  { stat: "10,500", color: "text-blue-600", accent: "bg-blue-500", label: "kWh average US home electricity consumption per year" },
  { stat: "~$26", color: "text-amber-600", accent: "bg-amber-500", label: "annual cost to run a single 60W light bulb 8 hours per day" },
];

const CONTENT_CARDS = [
  {
    icon: "👻",
    title: "Phantom loads add up",
    body: "Devices in standby mode — TVs, gaming consoles, phone chargers, microwaves with clocks — collectively account for 5–10% of home electricity use. A cable box uses ~17W 24/7 = ~$22/year doing nothing. Unplug or use smart power strips.",
  },
  {
    icon: "♻️",
    title: "Old appliances cost more than you think",
    body: "A 20-year-old refrigerator might use 800W compared to a modern ENERGY STAR model at 100–150W. That difference costs about $88/year at $0.15/kWh. A new fridge often pays for itself in 5–7 years through energy savings alone.",
  },
  {
    icon: "❄️",
    title: "AC and heating dominate bills",
    body: "Heating and cooling typically account for 40–50% of a home's electricity bill. A central AC running 8 hours/day at 3,500W costs about $126/month at $0.15/kWh. A smart thermostat can cut this 10–15% with minimal effort.",
  },
];

const RELATED_CALCS = [
  { title: "Solar ROI Calculator", description: "When do solar panels pay for themselves?", href: "/tools/solar-roi", icon: "☀️", accent: "bg-emerald-500/10" },
  { title: "Latte Factor Calculator", description: "See how small daily costs compound.", href: "/tools/latte-factor", icon: "☕", accent: "bg-blue-500/10" },
  { title: "Drip Savings Calculator", description: "Track savings from cutting expenses.", href: "/tools/drip-calculator", icon: "💧", accent: "bg-amber-500/10" },
  { title: "Passive Income Calculator", description: "Put your savings to work.", href: "/tools/passive-income-calculator", icon: "💰", accent: "bg-purple-500/10" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Appliance Energy Cost Calculator",
      url: "https://worthulator.com/tools/appliance-energy-cost",
      applicationCategory: "UtilityApplication",
      description: "Calculate daily, monthly, and annual electricity cost for any appliance.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function ApplianceEnergyCost() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SimpleCalculatorHero
        eyebrowIcon="🔌"
        eyebrowText="Appliance Energy Cost"
        title="How Much Does It Cost to Run This Appliance?"
        description="Enter wattage, hours per day, and your electricity rate. Instantly see daily, monthly, and annual running costs for any device."
        chips={["Watts to cost", "Daily / monthly / annual", "Any electricity rate"]}
      >
        <CalculatorEngineLoader slug="appliance-energy-cost" />
      </SimpleCalculatorHero>
      <InsightStrip text="The average US home spends ~$1,500/year on electricity — most of it heating, cooling, and appliances you barely notice." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="Where your electricity bill actually goes"  cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the Appliance Energy Cost Calculator Works"
        paragraphs={[
          "Daily cost = (watts ÷ 1,000) × hours per day × electricity rate. Monthly cost = daily cost × 30. Annual cost = daily cost × 365.",
          "This calculator gives you a simple estimate based on average daily usage. Actual cost varies if usage fluctuates seasonally or the appliance cycles on and off (like a refrigerator). For accurate totals, use a plug-in energy monitor like the Kill-A-Watt meter.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
