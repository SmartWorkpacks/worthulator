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
  title: "EV vs Gas Cost Calculator 2026 – Annual Fuel Savings Comparison",
  description:
    "Compare the annual fuel cost of an electric vehicle vs a gas car. Enter your mileage, MPG, gas price, and electricity rate to see exactly how much an EV saves.",
  keywords: ["EV vs gas calculator", "electric car cost calculator", "EV savings calculator", "fuel cost comparison"],
  alternates: { canonical: "https://worthulator.com/tools/ev-vs-gas" },
};

const FAQS = [
  {
    q: "How much cheaper is it to drive an EV?",
    a:
      "For the average US driver doing 12,000 miles/year, driving an EV saves approximately $800–$1,500 per year in fuel compared to a 28 MPG gas car — depending on your electricity rate and local gas prices.",
  },
  {
    q: "What electricity rate should I use?",
    a:
      "The US average is roughly $0.13–0.16 per kWh, but rates vary significantly by state. Check your monthly electricity bill for your local rate. Some utilities offer off-peak EV charging rates as low as $0.06/kWh.",
  },
  {
    q: "Does this include EV charging infrastructure costs?",
    a:
      "No — this calculator focuses on per-mile fuel costs only. It doesn't include home charger installation (~$500–$1,500), public fast-charging costs, or the cost premium of purchasing an EV over a comparable gas vehicle.",
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
  { stat: "~$700", color: "text-emerald-600", accent: "bg-emerald-500", label: "average annual fuel savings by switching from gas to electric" },
  { stat: "$7,500", color: "text-blue-600", accent: "bg-blue-500", label: "maximum federal EV tax credit under the Inflation Reduction Act" },
  { stat: "3–7 yrs", color: "text-amber-600", accent: "bg-amber-500", label: "typical payback period for the EV price premium over equivalent gas car" },
];

const CONTENT_CARDS = [
  {
    icon: "⚡",
    title: "The per-mile math",
    body: "At $0.15/kWh, a 30 kWh/100mi EV costs $0.045/mile to fuel. A 28 MPG gas car at $3.50/gal costs $0.125/mile — nearly 3x more per mile. Over 12,000 miles that's ~$960 in savings annually.",
  },
  {
    icon: "⛽",
    title: "Electricity rates change the equation",
    body: "In states with cheap electricity (Washington, Idaho — ~$0.10/kWh), EVs are dramatically cheaper. In Hawaii ($0.38/kWh), the gap shrinks considerably. Always use your actual local rate.",
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
        description="Compare annual fuel costs between your current gas car and an EV. Enter your miles driven, MPG, gas price, and local electricity rate."
        chips={["Miles-based calculation", "Real electricity rate", "Annual savings"]}
      >
        <CalculatorEngineLoader slug="ev-vs-gas" />
      </SimpleCalculatorHero>
      <InsightStrip text="The average EV driver saves $900–$1,500 per year in fuel vs a comparable gas car." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="EV vs gas: the real numbers"  cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the EV vs Gas Comparison Works"
        paragraphs={[
          "Annual gas cost = (miles ÷ MPG) × gas price per gallon. Annual EV cost = (miles ÷ 100) × kWh per 100 miles × electricity rate. The difference is your annual fuel savings.",
          "This calculator uses home-charging rates. If you frequently use public DC fast chargers, your actual EV costs will be higher. For the most accurate result, use your real local electricity rate from your utility bill.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
