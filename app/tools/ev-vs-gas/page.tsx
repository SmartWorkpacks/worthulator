import type { Metadata } from "next";
import EvVsGasWithInsights from "@/components/worthcore/EvVsGasWithInsights";
import SimpleCalculatorHero from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import StandardFAQSection from "@/src/templates/take-home-pay/StandardFAQSection";
import {
  StatChipsRow,
  ContentCardGrid,
  SEOTextBlock,
  InsightStrip,
  RelatedCalcCards,
} from "@/src/templates/take-home-pay/StandardSEOSection";
import { calculateEvVsGas } from "@/calculations/finance/evVsGas";
import { getUSStateFuelPrice, usStateFuelDataset } from "@/lib/datasets/usStateFuelPrices";
import { getUSStateElectricityPrice } from "@/lib/datasets/regional/usStateElectricityPrices";

// ─── Live worked example (single source of truth — refreshes with the data) ───
// Default inputs match the calculator config. Computed at render from the live
// fuel + electricity datasets so every number below moves with the weekly data.
const EX_INPUTS = { milesPerYear: 12000, mpg: 28, kwhPer100mi: 30, publicChargingPct: 10 };
const LIVE_GAS = getUSStateFuelPrice("National");
const LIVE_KWH = getUSStateElectricityPrice("National");
const EX = calculateEvVsGas(EX_INPUTS, { gasPrice: LIVE_GAS, homeElectricRate: LIVE_KWH });
const AS_OF = usStateFuelDataset.currentPeriodLabel;
const usd = (n: number) => `$${Math.round(n).toLocaleString()}`;
const perMileRatio = EX.evCostPerMile > 0 ? (EX.gasCostPerMile / EX.evCostPerMile).toFixed(1) : "3";

export const metadata: Metadata = {
  title: "EV vs Gas Cost Calculator 2026 – Annual Fuel Savings Comparison",
  description:
    "Compare the annual fuel cost of an electric vehicle vs a gas car using live state gas and electricity prices. See exactly how much an EV saves per year for your mileage and MPG.",
  keywords: ["EV vs gas calculator", "electric car cost calculator", "EV savings calculator", "fuel cost comparison"],
  alternates: { canonical: "https://worthulator.com/tools/ev-vs-gas" },
};

const FAQS = [
  {
    q: "How much cheaper is it to drive an EV?",
    a:
      `For the average US driver doing 12,000 miles/year, an EV saves about ${usd(EX.annualSavings)} per year in fuel versus a 28 MPG gas car — based on the current US-average gas price of $${LIVE_GAS.toFixed(2)}/gal and home electricity at $${LIVE_KWH.toFixed(2)}/kWh (${AS_OF}). Your exact figure depends on local prices and how much you drive.`,
  },
  {
    q: "Why do EV savings vary so much by state?",
    a:
      "Two live numbers drive the gap: residential electricity (from about $0.10/kWh in Washington and Idaho to over $0.40/kWh in Hawaii) and the local gas price. Cheap-power states see dramatic EV savings; in expensive-power states with an efficient gas car, the gap narrows or can even reverse. Some utilities also offer off-peak EV rates that widen the savings further.",
  },
  {
    q: "Does this include EV charging infrastructure costs?",
    a:
      "No — this calculator focuses on per-mile fuel costs only. It doesn't include home charger installation (~$500–$1,500) or the cost premium of purchasing an EV over a comparable gas vehicle. The public-charging slider does, however, fold the higher cost of DC fast charging into your blended rate.",
  },
  {
    q: "Which EVs are most efficient?",
    a:
      "The most efficient EVs use around 24–28 kWh per 100 miles (Tesla Model 3, Chevy Bolt, Hyundai Ioniq 6). Larger SUVs and trucks typically use 30–40+ kWh/100mi. Check the EPA's fueleconomy.gov for specific vehicle ratings.",
  },
  {
    q: "Is EV charging cheaper than gas at home vs public stations?",
    a:
      "Home charging is almost always cheaper than public DC fast charging (DCFC), which can cost $0.30–$0.50/kWh or more — sometimes rivaling gas costs. The big savings come from overnight home charging at standard utility rates.",
  },
];

const STATS = [
  { stat: usd(EX.annualSavings), color: "text-emerald-600", accent: "bg-emerald-500", label: `annual fuel savings switching from a 28 MPG gas car to an EV at US-average prices (${AS_OF})` },
  { stat: "$7,500", color: "text-blue-600", accent: "bg-blue-500", label: "maximum federal EV tax credit under the Inflation Reduction Act" },
  { stat: "3–7 yrs", color: "text-amber-600", accent: "bg-amber-500", label: "typical payback period for the EV price premium over equivalent gas car" },
];

const CONTENT_CARDS = [
  {
    icon: "⚡",
    title: "The per-mile math",
    body: `At $${LIVE_KWH.toFixed(2)}/kWh, a 30 kWh/100mi EV costs about $${EX.evCostPerMile.toFixed(3)}/mile to fuel. A 28 MPG gas car at $${LIVE_GAS.toFixed(2)}/gal costs about $${EX.gasCostPerMile.toFixed(3)}/mile — roughly ${perMileRatio}x more per mile. Over 12,000 miles that's ~${usd(EX.annualSavings)} in savings annually.`,
  },
  {
    icon: "⛽",
    title: "Electricity rates change the equation",
    body: "In states with cheap electricity (Washington, Idaho — ~$0.10/kWh), EVs are dramatically cheaper. In Hawaii (~$0.40/kWh), the gap shrinks considerably. Picking your state loads the live local rate so the comparison reflects where you actually charge.",
  },
  {
    icon: "🔧",
    title: "Beyond fuel: total cost of ownership",
    body: "EVs also have lower maintenance costs — no oil changes, fewer brake jobs (regenerative braking), no transmission service. Some studies estimate $1,000–$2,000 less in annual maintenance vs a comparable ICE vehicle.",
  },
];

const RELATED_CALCS = [
  { title: "Appliance Energy Cost Calculator", description: "See what any device costs to run.", href: "/tools/appliance-energy-cost", icon: "🔌", accent: "bg-emerald-500/10" },
  { title: "Loan Calculator", description: "Model monthly payments on any loan.", href: "/tools/loan-calculator", icon: "🏦", accent: "bg-blue-500/10" },
  { title: "Solar ROI Calculator", description: "When do solar panels pay for themselves?", href: "/tools/solar-roi", icon: "☀️", accent: "bg-amber-500/10" },
  { title: "True Hourly Wage Calculator", description: "See your real take-home hourly rate.", href: "/tools/true-hourly-wage", icon: "⏱️", accent: "bg-purple-500/10" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "EV vs Gas Cost Calculator",
      url: "https://worthulator.com/tools/ev-vs-gas",
      applicationCategory: "FinanceApplication",
      description: "Compare annual fuel costs between an electric vehicle and a gas car.",
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

export default function EvVsGas() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SimpleCalculatorHero
        eyebrowIcon="⚡"
        eyebrowText="EV vs Gas"
        title="How Much Would You Save Driving an Electric Car?"
        description="Compare annual fuel costs between your current gas car and an EV. Pick your state for live gas and electricity prices, then set your mileage, MPG, EV efficiency, and how much you charge in public."
        chips={["Live state prices", "Home + public charging", "Annual savings"]}
      >
        <EvVsGasWithInsights />
      </SimpleCalculatorHero>
      <InsightStrip text={`At today's US-average prices ($${LIVE_GAS.toFixed(2)}/gal, $${LIVE_KWH.toFixed(2)}/kWh), the average EV driver saves about <span class="font-semibold text-gray-900">${usd(EX.annualSavings)} per year</span> in fuel vs a comparable gas car.`} />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="EV vs gas: the real numbers"  cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the EV vs Gas Comparison Works"
        paragraphs={[
          "Annual gas cost = (miles ÷ MPG) × your state's gas price. Annual EV cost = (miles ÷ 100) × kWh per 100 miles × your blended electricity rate. The difference is your annual fuel savings.",
          "Picking your state loads live average gasoline and residential electricity prices, so the comparison reflects where you actually drive. The public-charging slider blends your cheap home rate with public DC fast charging — which costs roughly three times more — so road-trippers see a realistic number, not a best case.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
