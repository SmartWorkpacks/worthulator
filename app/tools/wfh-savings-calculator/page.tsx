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
  title: "WFH Savings Calculator 2026 – How Much Does Working From Home Save?",
  description:
    "Calculate your annual savings from working from home — commute costs, food, and hours reclaimed. See the real financial value of remote work.",
  keywords: ["work from home savings calculator", "wfh savings calculator", "remote work savings", "how much does wfh save"],
  alternates: { canonical: "https://worthulator.com/tools/wfh-savings-calculator" },
};

const FAQS = [
  {
    q: "How much does the average person save working from home?",
    a: "Studies estimate remote workers save $600–$6,000 per year depending on their commute length, location, and spending habits. The biggest savings come from commuting costs, bought lunches, and work clothing.",
  },
  {
    q: "What costs are included in this calculation?",
    a: "This calculator covers daily commute costs (fuel, public transport, parking) and daily food and coffee costs at or near the office. It does not include clothing savings, gym memberships, or home office setup costs.",
  },
  {
    q: "Does the calculator account for higher home utility bills?",
    a: "Not in this version. Remote workers typically see higher electricity and heating bills, which can offset some savings — usually $200–$500/year depending on the home. Subtract this from your result for a more precise figure.",
  },
  {
    q: "How is time saved calculated?",
    a: "The calculator doubles your one-way commute time (round trip) and multiplies by office days per week and 52 weeks per year. This is the raw time you reclaim — not accounting for how you choose to use it.",
  },
  {
    q: "Can I use this to justify a pay cut for a remote role?",
    a: "Yes — remote roles sometimes offer lower base salaries. Use this calculator to see how much your take-home lifestyle improves even with a modest pay reduction, once commuting, food, and clothing costs are removed.",
  },
];

const STATS = [
  { stat: "$4,000", color: "text-emerald-600", accent: "bg-emerald-500", label: "average annual savings for a full-time remote worker vs office commuter" },
  { stat: "11 days", color: "text-amber-600", accent: "bg-amber-500", label: "of commuting time reclaimed per year by the average US worker going fully remote" },
  { stat: "3 days/wk", color: "text-blue-600", accent: "bg-blue-500", label: "the most common hybrid arrangement — still saves $2,000+ per year" },
];

const CONTENT_CARDS = [
  {
    icon: "🚗",
    title: "Commuting is expensive",
    body: "Fuel, parking, tolls, and train passes add up fast. A 45-minute each-way commute in a petrol car costs the average driver $3,000–$5,000 per year before considering depreciation and maintenance.",
  },
  {
    icon: "🥗",
    title: "Office food adds up",
    body: "Grabbing a coffee, a bought lunch, and a mid-afternoon snack near the office can cost $15–$30 per day. At 3 office days/week, that is $2,340–$4,680 per year on food you would not buy at home.",
  },
  {
    icon: "⏰",
    title: "Time is the hidden saving",
    body: "Reclaiming commute hours is not just a lifestyle benefit — it has real economic value. An extra hour per day working from home is worth your hourly rate, or can be invested in a side hustle, education, or wellbeing.",
  },
];

const RELATED_CALCS = [
  { title: "Commute Cost Calculator", description: "Full breakdown of annual commuting costs.", href: "/tools/commute-cost-calculator", icon: "🚗", accent: "bg-red-500/10" },
  { title: "True Hourly Wage Calculator", description: "Factor commute time into your real hourly rate.", href: "/tools/true-hourly-wage", icon: "⏱️", accent: "bg-blue-500/10" },
  { title: "Latte Factor Calculator", description: "See the cost of daily workplace habits.", href: "/tools/latte-factor", icon: "☕", accent: "bg-amber-500/10" },
  { title: "Side Hustle Calculator", description: "Earn more with your reclaimed commute time.", href: "/tools/side-hustle-calculator", icon: "💼", accent: "bg-emerald-500/10" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "WFH Savings Calculator",
      url: "https://worthulator.com/tools/wfh-savings-calculator",
      applicationCategory: "FinanceApplication",
      description: "Calculate how much working from home saves you in commuting, food, and time each year.",
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

export default function WfhSavingsCalculator() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SimpleCalculatorHero
        eyebrowIcon="🏠"
        eyebrowText="WFH Savings"
        title="How Much Does Working From Home Save You?"
        description="Enter your commute cost, food spend, and office days to see your annual savings in money and the hours you reclaim by working remotely."
        chips={["Annual savings", "Monthly savings", "Hours reclaimed"]}
      >
        <CalculatorEngineLoader slug="wfh-savings-calculator" />
      </SimpleCalculatorHero>
      <InsightStrip text="Remote workers save an average of $4,000/year in commuting and food costs alone." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="The real value of working from home" cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the WFH Savings Calculator Works"
        paragraphs={[
          "Enter your daily commute cost (fuel, parking, or transit), the number of days you would commute to the office, your daily food spend (coffee, lunch, snacks), and your one-way commute time. The calculator multiplies daily savings by office days and 52 weeks to give an annual figure.",
          "Time saved is calculated as a two-way commute (doubled one-way time) across all office days per year — showing the total hours you reclaim by working from home.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
