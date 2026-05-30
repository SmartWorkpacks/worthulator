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
  title: "Vaping Cost Calculator 2026 – What Does Vaping Really Cost?",
  description:
    "Calculate your annual and 5-year vaping cost, and what that money would be worth invested instead. See the true financial cost of vaping.",
  keywords: ["vaping cost calculator", "how much does vaping cost", "vaping money calculator", "e-cigarette cost calculator"],
  alternates: { canonical: "https://worthulator.com/tools/vaping-cost-calculator" },
};

const FAQS = [
  {
    q: "How much does vaping cost per year on average?",
    a: "The average vaper spends $1,000–$3,000 per year depending on the device type and frequency of use. Disposable vape users at the top end of the market can spend $5,000+ annually, while refillable pod systems can cost as little as $600–$800/year.",
  },
  {
    q: "Is vaping cheaper than smoking?",
    a: "Generally yes — a pack-a-day smoker in the US spends around $3,000–$7,000 per year. Most vapers spend less, but the cost is still significant, particularly for disposable vape users who go through multiple devices per week.",
  },
  {
    q: "What is included in the daily cost estimate?",
    a: "Include everything: pods, liquid, coils, disposables, and a prorated share of device purchase and replacement costs. If you buy a new device every 6 months for $40, that adds about $0.22/day to your daily cost.",
  },
  {
    q: "How is the invested value calculated?",
    a: "The calculator uses the future value of an annuity at 7% annual return over 5 years, assuming you invest your annual vaping cost at the start of each year. This represents the opportunity cost — what that money could have grown to.",
  },
  {
    q: "What if I want to quit vaping?",
    a: "Use the 5-year total as your motivation number. Beyond the financial cost, NHS and CDC resources offer free stop-smoking and stop-vaping programmes. Nicotine replacement therapy significantly improves cessation success rates.",
  },
];

const STATS = [
  { stat: "$1,800", color: "text-emerald-600", accent: "bg-emerald-500", label: "average annual vaping cost for a daily pod or disposable user" },
  { stat: "$9,000", color: "text-amber-600", accent: "bg-amber-500", label: "5-year vaping cost at $5/day — before factoring in investment opportunity cost" },
  { stat: "4.5M", color: "text-blue-600", accent: "bg-blue-500", label: "adults in the UK currently vape, with disposable vapes growing the fastest" },
];

const CONTENT_CARDS = [
  {
    icon: "💨",
    title: "The cost creep of disposables",
    body: "Single-use disposable vapes cost $10–$20 each and last 1–3 days. Users who go through 3–4 per week spend $1,500–$3,000 per year. Switching to a refillable system cuts costs by 60–70% while maintaining the same habit.",
  },
  {
    icon: "📈",
    title: "5 years of opportunity cost",
    body: "At $5/day, you spend $9,125 on vaping over 5 years. Invested at 7% annual return, that same money grows to over $10,600. The combined loss — spent money plus foregone growth — exceeds $10,000 over just 5 years.",
  },
  {
    icon: "💡",
    title: "Partial reduction adds up",
    body: "You do not have to quit entirely to save significant money. Cutting from $8/day to $4/day saves $1,460/year. Over 10 years, that reduction alone amounts to over $20,000 saved — or invested.",
  },
];

const RELATED_CALCS = [
  { title: "Quit Smoking Calculator", description: "See the true cost of smoking over time.", href: "/tools/quit-smoking-calculator", icon: "🚭", accent: "bg-red-500/10" },
  { title: "Alcohol Cost Calculator", description: "What drinking really costs annually.", href: "/tools/alcohol-cost-calculator", icon: "🍺", accent: "bg-amber-500/10" },
  { title: "Latte Factor Calculator", description: "Small daily habits and their long-term cost.", href: "/tools/latte-factor", icon: "☕", accent: "bg-yellow-500/10" },
  { title: "Compound Interest Calculator", description: "See what saved money grows to over time.", href: "/tools/compound-interest-calculator", icon: "📊", accent: "bg-emerald-500/10" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Vaping Cost Calculator",
      url: "https://worthulator.com/tools/vaping-cost-calculator",
      applicationCategory: "FinanceApplication",
      description: "Calculate the annual and 5-year cost of vaping, and what it would be worth if invested instead.",
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

export default function VapingCostCalculator() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SimpleCalculatorHero
        eyebrowIcon="💨"
        eyebrowText="Vaping Cost"
        title="What Does Your Vaping Habit Cost Over 5 Years?"
        description="Enter your daily vaping spend to see your annual cost, 5-year total, and what that money would grow to if invested at 7% instead."
        chips={["Annual cost", "5-year total", "Investment opportunity cost"]}
      >
        <CalculatorEngineLoader slug="vaping-cost-calculator" />
      </SimpleCalculatorHero>
      <InsightStrip text="A $5/day vaping habit costs $9,125 over 5 years — or $10,600+ if invested." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="The real cost of vaping" cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the Vaping Cost Calculator Works"
        paragraphs={[
          "Enter your average daily spend on vaping — including pods, liquid, disposables, and a share of device costs. The calculator multiplies by 365 for the annual figure and by 5 for the 5-year total.",
          "The invested value uses the future value of an annuity formula at 7% per year over 5 years — showing what your annual vaping budget would grow to in a broad market index fund.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
