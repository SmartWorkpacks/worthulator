import type { Metadata } from "next";
import ApplianceEnergyWithInsights from "@/components/worthcore/ApplianceEnergyWithInsights";
import SimpleCalculatorHero from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import StandardFAQSection from "@/src/templates/take-home-pay/StandardFAQSection";
import {
  StatChipsRow,
  ContentCardGrid,
  SEOTextBlock,
  InsightStrip,
  RelatedCalcCards,
} from "@/src/templates/take-home-pay/StandardSEOSection";
import {
  calculateApplianceCost,
  AVG_HOME_KWH_PER_YEAR,
} from "@/calculations/energy/applianceCost";
import {
  getUSStateElectricityPrice,
  usStateElectricityDataset,
} from "@/lib/datasets/regional/usStateElectricityPrices";

// ─── Live worked examples (single source of truth — refresh with the data) ────
const LIVE_KWH = getUSStateElectricityPrice("National");
const AS_OF = usStateElectricityDataset.currentPeriodLabel;
const usd = (n: number) => `$${Math.round(n).toLocaleString()}`;
const usd2 = (n: number) => `$${n.toFixed(2)}`;
/** Annual running cost helper at the live US-average rate. */
const annualCost = (watts: number, hoursPerDay: number, daysPerWeek = 7, qty = 1) =>
  calculateApplianceCost({ watts, hoursPerDay, daysPerWeek, quantity: qty }, { electricRate: LIVE_KWH }).annualCost;

const EX_TV = calculateApplianceCost({ watts: 200, hoursPerDay: 8, daysPerWeek: 7, quantity: 1 }, { electricRate: LIVE_KWH });
const BULB_60 = annualCost(60, 8);
const CABLE_BOX = annualCost(17, 24);
const FRIDGE_DIFF = annualCost(650, 24); // 800W old vs ~150W efficient, running 24/7
const AC_MONTHLY = calculateApplianceCost({ watts: 3500, hoursPerDay: 8, daysPerWeek: 7, quantity: 1 }, { electricRate: LIVE_KWH }).monthlyCost;
const AVG_HOME_ANNUAL = AVG_HOME_KWH_PER_YEAR * LIVE_KWH;

export const metadata: Metadata = {
  title: "Appliance Energy Cost Calculator 2026 – How Much Does It Cost to Run?",
  description:
    "Calculate the daily, monthly, and annual electricity cost of any appliance using your state's live residential electricity rate. Enter wattage and usage to see running costs.",
  keywords: ["appliance energy cost calculator", "electricity cost calculator", "how much does it cost to run", "kWh cost calculator"],
  alternates: { canonical: "https://worthulator.com/tools/appliance-energy-cost" },
};

const FAQS = [
  {
    q: "How do I calculate the cost to run an appliance?",
    a:
      `Energy cost = (watts ÷ 1000) × hours used × electricity rate in $/kWh. For example, a 200W TV running 8 hours/day at the current US-average rate of ${usd2(LIVE_KWH)}/kWh costs about ${usd2(EX_TV.dailyCost)}/day, or roughly ${usd2(EX_TV.monthlyCost)}/month.`,
  },
  {
    q: "What is the average US electricity rate?",
    a:
      `The current US average is about ${usd2(LIVE_KWH)}/kWh (${AS_OF}), but rates vary significantly by state — Hawaii averages over $0.40/kWh while Louisiana and Idaho sit near $0.10–$0.12/kWh. Picking your state in the calculator loads its live residential rate automatically.`,
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
  { stat: usd2(LIVE_KWH), color: "text-emerald-600", accent: "bg-emerald-500", label: `average US electricity rate per kilowatt-hour (${AS_OF})` },
  { stat: "10,500", color: "text-blue-600", accent: "bg-blue-500", label: "kWh average US home electricity consumption per year" },
  { stat: `~${usd(BULB_60)}`, color: "text-amber-600", accent: "bg-amber-500", label: "annual cost to run a single 60W light bulb 8 hours per day" },
];

const CONTENT_CARDS = [
  {
    icon: "👻",
    title: "Phantom loads add up",
    body: `Devices in standby mode — TVs, gaming consoles, phone chargers, microwaves with clocks — collectively account for 5–10% of home electricity use. A cable box drawing ~17W 24/7 costs about ${usd(CABLE_BOX)}/year doing nothing. Unplug or use smart power strips.`,
  },
  {
    icon: "♻️",
    title: "Old appliances cost more than you think",
    body: `A 20-year-old refrigerator might use 800W compared to a modern ENERGY STAR model at 100–150W. At today's rate that difference costs about ${usd(FRIDGE_DIFF)}/year. A new fridge often pays for itself in 5–7 years through energy savings alone.`,
  },
  {
    icon: "❄️",
    title: "AC and heating dominate bills",
    body: `Heating and cooling typically account for 40–50% of a home's electricity bill. A central AC running 8 hours/day at 3,500W costs about ${usd(AC_MONTHLY)}/month at today's rate. A smart thermostat can cut this 10–15% with minimal effort.`,
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
        description="Pick your state for a live electricity rate, then enter wattage and how often you use it. Instantly see daily, monthly, and annual running costs — plus how much it adds to your power bill."
        chips={["Live state rates", "Daily / monthly / annual", "Share of your bill"]}
      >
        <ApplianceEnergyWithInsights />
      </SimpleCalculatorHero>
      <InsightStrip text={`The average US home spends about <span class="font-semibold text-gray-900">${usd(AVG_HOME_ANNUAL)}/year</span> on electricity at today's ${usd2(LIVE_KWH)}/kWh — most of it heating, cooling, and appliances you barely notice.`} />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="Where your electricity bill actually goes"  cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the Appliance Energy Cost Calculator Works"
        paragraphs={[
          "Daily cost = (watts ÷ 1,000) × hours used × quantity × your electricity rate. Annual cost = daily cost × days per week × 52, and monthly cost is that annual figure ÷ 12. Picking your state loads its live average residential rate ($/kWh), so the numbers reflect where you actually live.",
          "We also show what this one device adds to a typical home's power bill (~10,500 kWh/year) and project the 10-year cost with electricity inflation. Actual cost varies if usage fluctuates seasonally or the appliance cycles on and off (like a refrigerator) — for exact totals, use a plug-in energy monitor like a Kill-A-Watt meter.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
