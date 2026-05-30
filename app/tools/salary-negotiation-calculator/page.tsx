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
  title: "Salary Negotiation Calculator 2026 – Find Your Perfect Ask",
  description:
    "Enter your current offer, market range, and experience to get a data-driven recommended salary ask. Know your number before you walk into the room.",
  keywords: ["salary negotiation calculator", "how much to ask for salary", "salary counter offer calculator", "negotiate salary"],
  alternates: { canonical: "https://worthulator.com/tools/salary-negotiation-calculator" },
};

const FAQS = [
  {
    q: "How do I know what salary to ask for?",
    a: "Research the market range for your role using sources like Glassdoor, LinkedIn Salary, and the Bureau of Labor Statistics. Your ask should sit at or above the midpoint if your experience and skills justify it.",
  },
  {
    q: "Is it always worth negotiating a salary?",
    a: "Yes. Studies show that fewer than half of candidates negotiate their first offer, yet those who do earn $5,000–$10,000 more on average. Over a 20-year career, a single negotiation can compound into hundreds of thousands of dollars.",
  },
  {
    q: "What does the leverage score mean?",
    a: "The leverage score is a composite of your years of experience, how well your skills match the role, and how urgently the company needs to fill the position. A higher score means you have more negotiating power.",
  },
  {
    q: "Should I name a number first?",
    a: "Ideally, you want the employer to anchor first. If pressed, give a range where the bottom of your range is your desired number, so the employer focuses on the lower figure while you still have room to manoeuvre.",
  },
  {
    q: "What if they say the offer is non-negotiable?",
    a: "Everything is negotiable. If base salary is fixed, negotiate signing bonuses, extra PTO, remote-work flexibility, or an earlier performance review date. These have real monetary value.",
  },
];

const STATS = [
  { stat: "85%", color: "text-emerald-600", accent: "bg-emerald-500", label: "of employers have room to negotiate — most candidates never ask" },
  { stat: "$7,400", color: "text-amber-600", accent: "bg-amber-500", label: "average salary increase for candidates who negotiate their first offer" },
  { stat: "$1M+", color: "text-blue-600", accent: "bg-blue-500", label: "lifetime earnings difference between negotiating and not, compounded over a career" },
];

const CONTENT_CARDS = [
  {
    icon: "📊",
    title: "Know your market value",
    body: "Salary negotiation starts with data. Pull salary ranges from at least three sources for your specific role, location, and industry level. The calculator uses the midpoint of your range as a baseline.",
  },
  {
    icon: "💪",
    title: "Leverage is everything",
    body: "Your leverage score rises with experience, skill match, and the employer's urgency to hire. The higher your score, the more you can push above the market midpoint without risking the offer.",
  },
  {
    icon: "🎯",
    title: "Ask higher than you'll accept",
    body: "Employers expect to negotiate down. Open with 10–15% above your true target. This gives you room to concede while still landing where you want. Never accept on the spot — take 24 hours.",
  },
];

const RELATED_CALCS = [
  { title: "True Hourly Wage Calculator", description: "Find what you actually earn after commute and work costs.", href: "/tools/true-hourly-wage", icon: "⏱️", accent: "bg-emerald-500/10" },
  { title: "Job Offer Comparison", description: "Compare two job offers side by side.", href: "/tools/job-offer-comparison", icon: "⚖️", accent: "bg-blue-500/10" },
  { title: "Pay Raise Calculator", description: "See what a pay rise is worth after tax.", href: "/tools/pay-raise-calculator", icon: "📈", accent: "bg-amber-500/10" },
  { title: "Side Hustle Calculator", description: "Find your real earnings from a side gig.", href: "/tools/side-hustle-calculator", icon: "💼", accent: "bg-purple-500/10" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Salary Negotiation Calculator",
      url: "https://worthulator.com/tools/salary-negotiation-calculator",
      applicationCategory: "FinanceApplication",
      description: "Find your ideal salary ask based on market data, experience, and negotiation leverage.",
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

export default function SalaryNegotiationCalculator() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SimpleCalculatorHero
        eyebrowIcon="💰"
        eyebrowText="Salary Negotiation"
        title="What Should You Ask For?"
        description="Enter your current offer, market range, years of experience, and skill match to get a data-driven recommended salary ask — before you walk into the room."
        chips={["Market-based", "Leverage score", "Recommended ask"]}
      >
        <CalculatorEngineLoader slug="salary-negotiation-calculator" />
      </SimpleCalculatorHero>
      <InsightStrip text="Negotiating your salary once can add $500,000+ to lifetime earnings." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="How to negotiate your salary" cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the Salary Negotiation Calculator Works"
        paragraphs={[
          "Enter your current offer, the market low and high for your role, your years of experience, how well your skills match the job, and whether the employer has urgent hiring needs. The calculator combines these into a leverage score and recommends a specific salary ask.",
          "The recommended ask is calculated as the higher of the market midpoint and your current offer multiplied by a leverage multiplier. The higher your leverage score, the more your ask sits above the baseline.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
