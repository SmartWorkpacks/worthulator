import type { Metadata } from "next";
import LaundryCostWithInsights from "@/components/worthcore/LaundryCostWithInsights";
import SimpleCalculatorHero from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import StandardFAQSection from "@/src/templates/take-home-pay/StandardFAQSection";
import {
  StatChipsRow, ContentCardGrid, SEOTextBlock, InsightStrip, RelatedCalcCards,
} from "@/src/templates/take-home-pay/StandardSEOSection";
import { calculateLaundryCost, LAUNDROMAT_COST_PER_LOAD } from "@/calculations/home/laundryCost";
import { getUSStateElectricityPrice, usStateElectricityDataset } from "@/lib/datasets/regional/usStateElectricityPrices";

// ─── Live worked examples (refresh with the electricity dataset) ──────────────
const LIVE_KWH = getUSStateElectricityPrice("National");
const CA_RATE = getUSStateElectricityPrice("California");
const LA_RATE = getUSStateElectricityPrice("Louisiana");
const AS_OF = usStateElectricityDataset.currentPeriodLabel;
const usd2 = (n: number) => `$${n.toFixed(2)}`;
const usd = (n: number) => `$${Math.round(n).toLocaleString()}`;
const laundry = (rate: number, waterTemp: "cold" | "warm" | "hot") =>
  calculateLaundryCost(
    { loadsPerWeek: 5, machineType: "standard", waterTemp, detergentCost: 0.25 },
    { electricRate: rate },
  );
const EX = laundry(LIVE_KWH, "warm");
const EX_COLD = laundry(LIVE_KWH, "cold");
const EX_CA = laundry(CA_RATE, "warm");
const EX_LA = laundry(LA_RATE, "warm");
const COLD_SAVING_YR = EX.annualCost - EX_COLD.annualCost;
const LAUNDROMAT_SAVING_YR = EX.laundromatAnnual - EX.annualCost;

export const metadata: Metadata = {
  title: "Laundry Cost Calculator 2026 – True Cost Per Load",
  description:
    "Calculate your real cost per laundry load using your state's live electricity rate, machine type, water temperature, and detergent — plus annual spend and savings levers.",
  keywords: ["laundry cost calculator", "cost per laundry load", "how much does laundry cost", "washing machine cost per load", "laundry expense calculator"],
  alternates: { canonical: "https://worthulator.com/tools/laundry-cost-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "How much does one load of laundry cost at home?",
    a: `It depends heavily on your electricity rate and machine. With a standard washer/dryer combo on warm water at the national average ${usd2(LIVE_KWH)}/kWh (${AS_OF}): electricity is ~${usd2(EX.electricityCostPerLoad)} (${EX.totalKwhPerLoad.toFixed(1)} kWh × ${usd2(LIVE_KWH)}), water ~${usd2(EX.waterCostPerLoad)}, detergent ~$0.25 — about ${usd2(EX.costPerLoad)}/load. In California at ~${usd2(CA_RATE)}/kWh, electricity alone jumps to ${usd2(EX_CA.electricityCostPerLoad)}, pushing the load to about ${usd2(EX_CA.costPerLoad)}. This calculator uses your state's live rate for an accurate figure.`,
  },
  {
    q: "Does washing in cold water really save money?",
    a: `Yes — ~90% of the washer's energy goes to heating water (DOE). Cold water cuts the washer's kWh by about 80%. On a standard machine at ${usd2(LIVE_KWH)}/kWh, that's roughly ${usd2(EX.costPerLoad - EX_COLD.costPerLoad)}/load saved — about ${usd(COLD_SAVING_YR)}/year at 5 loads/week. At higher electricity rates or more loads, the saving scales proportionally. Modern detergents are formulated for cold water.`,
  },
  {
    q: "How much electricity does a washer and dryer use per load?",
    a: "It varies by machine: an HE front-loader combo uses ~2.65 kWh/load, a standard combo ~3.80 kWh, and an older non-Energy-Star combo ~5.30 kWh. The dryer is the expensive half — a standard electric dryer uses ~3.3 kWh vs ~0.50 kWh for the washer (warm water). Cleaning the lint trap and using sensor-dry helps.",
  },
  {
    q: "Is it cheaper to do laundry at home or at a laundromat?",
    a: `Almost always cheaper at home. The average laundromat charges ~${usd2(LAUNDROMAT_COST_PER_LOAD)}/load (wash + dry). At home with a standard machine, you pay ~${usd2(EX.costPerLoad)}/load — saving about ${usd2(LAUNDROMAT_COST_PER_LOAD - EX.costPerLoad)}/load. At 5 loads/week that's ${usd(LAUNDROMAT_SAVING_YR)}/year in savings, which offsets a washer/dryer purchase in 1–2 years.`,
  },
  {
    q: "How can I reduce my laundry costs the most?",
    a: "Three levers in order of impact: (1) Switch to cold water — cuts washer energy ~80% with zero quality sacrifice. (2) Run only full loads — a half-load uses the same electricity and water. (3) Upgrade to an HE front-loader when your machine is due — it uses about half the kWh of an older machine. Combined, these can cut your annual laundry bill by 30–50%.",
  },
];

const STATS = [
  { stat: `${EX.totalKwhPerLoad.toFixed(1)} kWh`, color: "text-amber-600", accent: "bg-amber-500", label: "Combined electricity per load (standard washer 0.5 kWh + dryer 3.3 kWh on warm water)" },
  { stat: usd2(EX.waterCostPerLoad), color: "text-blue-600", accent: "bg-blue-500", label: "Water cost per load — ~30 gallons × $0.004/gal (EPA/AWWA 2024)" },
  { stat: "80%",      color: "text-emerald-600", accent: "bg-emerald-500", label: "Washer energy reduction when switching from warm to cold water (DOE)" },
];

const CONTENT_CARDS = [
  {
    icon: "⚡",
    title: "The dryer is the expensive half",
    body: "A standard electric dryer uses ~3.3 kWh per load — six times more than the washer. Cleaning the lint trap, using sensor-dry, or air-drying when possible are the highest-leverage habits for cutting your electricity bill.",
  },
  {
    icon: "🌡️",
    title: "Cold water is a free upgrade",
    body: "~90% of the washer's energy heats water. Cold water cuts that by ~80%, saving $15–50/year depending on your rate and loads — with no sacrifice in cleanliness. Modern detergents are formulated for cold cycles.",
  },
  {
    icon: "📍",
    title: "Your state rate is the multiplier",
    body: `The same ${EX.totalKwhPerLoad.toFixed(1)} kWh load costs about ${usd2(EX_LA.electricityCostPerLoad)} in electricity in Louisiana (~${usd2(LA_RATE)}/kWh) but ${usd2(EX_CA.electricityCostPerLoad)} in California (~${usd2(CA_RATE)}/kWh). This calculator loads your state's live rate so you see your real number, not a generic average.`,
  },
];

const RELATED_CALCS = [
  { title: "Appliance Energy Cost",     description: "See the annual electricity cost of any appliance.", href: "/tools/appliance-energy-cost",     icon: "🔌", accent: "bg-amber-500/10" },
  { title: "Grocery Unit Price",        description: "Compare items by price per ounce to find the best deal.", href: "/tools/grocery-unit-price", icon: "🛒", accent: "bg-emerald-500/10" },
  { title: "Subscription Auditor",      description: "Audit all your monthly subscriptions and find savings.", href: "/tools/subscription-auditor", icon: "💸", accent: "bg-blue-500/10" },
  { title: "Water Intake Calculator",   description: "See how much water you should drink daily.", href: "/tools/water-intake",                     icon: "💧", accent: "bg-violet-500/10" },
];

export default function LaundryCostCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Laundry Cost Calculator",
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Web",
      description: "Calculate the true cost per laundry load using your state's live electricity rate, machine type, water temperature, and detergent.",
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
        description="Pick your state for a live electricity rate, choose your machine and water temperature, then see the true cost per load — and how cold water and efficient machines can cut your annual bill."
        chips={["Live state electricity", "Machine + water temp aware", "Home vs laundromat"]}
      >
        <LaundryCostWithInsights />
      </SimpleCalculatorHero>

      <InsightStrip
        text='The dryer uses 6–8× more electricity than the washer. <span class="font-semibold text-gray-900">Cold water cuts the washer&apos;s energy by 80% — it&apos;s the single easiest savings lever.</span>'
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="What really drives your laundry cost"
        subtitle="Electricity rate, machine efficiency, and water temperature matter more than detergent."
        cards={CONTENT_CARDS}
      />

      <SEOTextBlock
        title="How the Laundry Cost Calculator Works"
        formula={`Washer kWh (adj) = Machine Washer kWh × Water Temp Multiplier
Total kWh/Load   = Washer kWh (adj) + Dryer kWh
Electricity/Load = Total kWh × State Electricity Rate
Cost Per Load    = Electricity + Water ($0.12) + Detergent
Weekly Cost      = Cost Per Load × Loads/Week
Annual Cost      = Weekly Cost × 52`}
        steps={[
          { label: "Pick your state", description: "Loads your state's live residential electricity rate, so the per-load cost reflects where you actually live." },
          { label: "Set loads per week", description: "Average US household: 5–8 loads/week (AHAM). Count all types — colors, whites, delicates, bedding." },
          { label: "Choose machine type", description: "HE front-loader (2.65 kWh), modern top-loader (3.3 kWh), standard (3.8 kWh), or older (5.3 kWh)." },
          { label: "Set water temperature", description: "Cold cuts washer energy ~80%. Hot uses ~80% more than warm. The dryer isn't affected." },
          { label: "Set detergent cost", description: "Divide your bottle price by the load count on the label. Budget: $0.10, premium pods: $0.50–0.75." },
        ]}
        paragraphs={[
          `The key insight is that electricity rate × machine kWh drives most of the cost. Water (${usd2(EX.waterCostPerLoad)}/load) and detergent ($0.10–0.75) are relatively fixed — but electricity swings from about ${usd2(EX_LA.electricityCostPerLoad)}/load in Louisiana to ${usd2(EX_CA.electricityCostPerLoad)} in California for the same standard machine. That's why we load your state's live rate.`,
          `The calculator also compares your current setup against the best case (HE front-loader on cold water) and a laundromat (${usd2(LAUNDROMAT_COST_PER_LOAD)}/load average). At-home laundry almost always wins — even an older machine at a high electricity rate costs far less than ${usd2(LAUNDROMAT_COST_PER_LOAD)}/load — but knowing the exact gap helps you decide when to upgrade.`,
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
