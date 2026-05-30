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
  title: "Solar Panel ROI Calculator 2026 – When Will Solar Pay for Itself?",
  description:
    "Calculate your solar panel payback period, first-year savings, and 25-year total savings. Enter system cost, monthly bill, solar offset %, and utility inflation rate.",
  keywords: ["solar panel roi calculator", "solar payback period calculator", "when do solar panels pay for themselves", "solar savings calculator"],
  alternates: { canonical: "https://worthulator.com/tools/solar-roi" },
};

const FAQS = [
  {
    q: "How long does it take for solar panels to pay for themselves?",
    a:
      "The average US solar payback period is 6–12 years. With a $20,000 system, $150/month electricity bill, 85% solar offset, and 3% annual utility inflation, you typically break even in around 8–10 years. After that, electricity savings are essentially free profit.",
  },
  {
    q: "What is solar offset percentage?",
    a:
      "Solar offset is the percentage of your electricity use covered by your solar panels. A 100% offset means your panels generate as much electricity as you consume on an annual basis. Most residential systems aim for 80–100% offset, but actual production varies by season.",
  },
  {
    q: "Does the federal solar tax credit apply?",
    a:
      "Yes — the federal Investment Tax Credit (ITC) currently offers a 30% credit on the total cost of a solar installation. A $20,000 system qualifies for a $6,000 credit, reducing your net cost to $14,000. This dramatically shortens the payback period. Check IRS Form 5695.",
  },
  {
    q: "How does utility rate inflation affect solar ROI?",
    a:
      "Historically, US electricity rates have risen about 2–4% per year. As your utility rate rises, the value of the electricity your panels generate increases each year. A 3% annual increase on $150/month means you'd be paying ~$202/month in 10 years without solar — making your panels increasingly valuable over time.",
  },
  {
    q: "What is the lifespan of solar panels?",
    a:
      "Most solar panels are warrantied for 25–30 years and typically degrade about 0.5% per year in efficiency. After 25 years, a panel might produce about 87% of its original output. This calculator uses a 25-year window for long-term savings projections.",
  },
];

const STATS = [
  { stat: "6–12 yrs", color: "text-emerald-600", accent: "bg-emerald-500", label: "average US solar panel payback period" },
  { stat: "30%", color: "text-blue-600", accent: "bg-blue-500", label: "federal Investment Tax Credit (ITC) on solar installations" },
  { stat: "2–4%/yr", color: "text-amber-600", accent: "bg-amber-500", label: "historical annual utility electricity rate increase" },
];

const CONTENT_CARDS = [
  {
    icon: "💰",
    title: "The 30% federal tax credit changes everything",
    body: "The Inflation Reduction Act extended and expanded the solar ITC at 30% through at least 2032. On a $20,000 system, that's $6,000 off your taxes — not a deduction, but a direct credit. This single factor cuts payback time by 2–3 years for most homeowners.",
  },
  {
    icon: "🔋",
    title: "Net metering and battery storage",
    body: "Net metering allows you to sell excess power back to the grid, further improving ROI. Battery storage (like Tesla Powerwall) adds resilience and can maximise self-consumption, but adds $8,000–$12,000 to system cost. Calculate your ROI with and without storage.",
  },
  {
    icon: "📍",
    title: "Location and roof factors matter",
    body: "Solar panels in Phoenix produce ~50% more electricity per year than the same system in Seattle. Roof angle, shading, and orientation affect production. Get a solar proposal from a local installer to see production estimates specific to your address.",
  },
];

const RELATED_CALCS = [
  { title: "Appliance Energy Cost Calculator", description: "See what any device costs to run.", href: "/tools/appliance-energy-cost", icon: "🔌", accent: "bg-emerald-500/10" },
  { title: "Passive Income Calculator", description: "Model income from investments.", href: "/tools/passive-income-calculator", icon: "💰", accent: "bg-blue-500/10" },
  { title: "Investment Calculator", description: "Compare solar ROI to market returns.", href: "/tools/investment-calculator", icon: "📈", accent: "bg-amber-500/10" },
  { title: "Mortgage Calculator", description: "Finance solar with a home equity loan.", href: "/tools/mortgage-calculator", icon: "🏦", accent: "bg-purple-500/10" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Solar Panel ROI Calculator",
      url: "https://worthulator.com/tools/solar-roi",
      applicationCategory: "FinanceApplication",
      description: "Calculate solar payback period, year-one savings, and 25-year total savings.",
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

export default function SolarRoi() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SimpleCalculatorHero
        eyebrowIcon="☀️"
        eyebrowText="Solar ROI"
        title="When Will Your Solar Panels Pay for Themselves?"
        description="Calculate your solar payback period, first-year savings, and 25-year total savings. Factors in utility inflation for an accurate long-term picture."
        chips={["Payback period", "Year 1 savings", "25-year total"]}
      >
        <CalculatorEngineLoader slug="solar-roi" />
      </SimpleCalculatorHero>
      <InsightStrip text="With the 30% federal tax credit, a typical solar system pays itself back in 6–9 years — then saves money for 15+ more." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="Understanding solar ROI"  cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the Solar ROI Calculator Works"
        paragraphs={[
          "Annual savings in year 1 = monthly bill × solar offset % × 12. Each subsequent year, savings grow by the utility inflation rate (compounding). Payback period = the year when cumulative savings first exceed system cost. 25-year savings = sum of all annual savings over 25 years.",
          "This calculator does not include the 30% federal ITC automatically — subtract 30% from your system cost before entering it if you want to include the tax credit. It also does not account for panel degradation (~0.5%/year) or state/local incentives.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
