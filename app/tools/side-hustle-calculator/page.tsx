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
  title: "Side Hustle Calculator 2026 – Find Your Real Take-Home Pay",
  description:
    "See your actual net monthly and yearly income from any side hustle after expenses and self-employment tax. Find your true hourly rate.",
  keywords: ["side hustle calculator", "side hustle income calculator", "self employment income calculator", "gig income after tax"],
  alternates: { canonical: "https://worthulator.com/tools/side-hustle-calculator" },
};

const FAQS = [
  {
    q: "Why is my effective hourly rate lower than what I charge?",
    a: "As a freelancer or gig worker, you pay both the employee and employer share of self-employment taxes (around 15.3% on net earnings), plus business expenses like software, equipment, and marketing. These reduce what you actually take home per hour worked.",
  },
  {
    q: "What expenses should I include?",
    a: "Common side hustle expenses include platform fees (Etsy, Fiverr, Upwork), software subscriptions, marketing costs, equipment depreciation, home office costs, and professional insurance. A good rule of thumb is 10–20% of revenue for digital services, higher for product businesses.",
  },
  {
    q: "How is 4.33 used in the calculation?",
    a: "4.33 is the average number of weeks in a month (52 weeks ÷ 12 months). Multiplying your weekly hours by 4.33 gives an accurate monthly estimate rather than using a fixed 4 weeks.",
  },
  {
    q: "Is a side hustle worth it at minimum wage?",
    a: "Not necessarily by income alone — but many side hustles provide skill development, portfolio work, or long-term business potential. Use the calculator to set a minimum rate you're willing to work below, and re-evaluate quarterly.",
  },
  {
    q: "How much should I set aside for taxes?",
    a: "As a self-employed person, set aside 25–30% of net earnings for taxes. This covers federal income tax and self-employment tax. Use quarterly estimated payments to avoid underpayment penalties.",
  },
];

const STATS = [
  { stat: "45%", color: "text-emerald-600", accent: "bg-emerald-500", label: "of Americans have a side hustle — earning an average of $1,122/month" },
  { stat: "15.3%", color: "text-amber-600", accent: "bg-amber-500", label: "self-employment tax rate that reduces gig income before income tax kicks in" },
  { stat: "$13,464", color: "text-blue-600", accent: "bg-blue-500", label: "average annual side hustle income in the US in 2024" },
];

const CONTENT_CARDS = [
  {
    icon: "💼",
    title: "Know your true hourly rate",
    body: "A $50/hour freelance rate sounds great — but after 20% expenses and 25% tax, your effective rate drops to around $30/hour. Factor in unpaid admin time and it can fall further. This calculator shows you the truth.",
  },
  {
    icon: "📉",
    title: "Expenses matter more than you think",
    body: "Every platform fee, software subscription, and piece of equipment reduces your effective earnings. Track your expenses monthly and review whether each tool is earning its keep.",
  },
  {
    icon: "📈",
    title: "Scale what works",
    body: "Once you know your true hourly rate, you can make better decisions: raise rates, cut low-value clients, or productise your service. Use the yearly net to set income goals and measure progress.",
  },
];

const RELATED_CALCS = [
  { title: "Self-Employed Tax Calculator", description: "Estimate your quarterly self-employment tax bill.", href: "/tools/self-employed-tax", icon: "🧾", accent: "bg-amber-500/10" },
  { title: "Freelance Rate Calculator", description: "Set your ideal hourly rate from scratch.", href: "/tools/freelance-rate-calculator", icon: "💡", accent: "bg-emerald-500/10" },
  { title: "Salary Negotiation Calculator", description: "Know your ask before any salary negotiation.", href: "/tools/salary-negotiation-calculator", icon: "💰", accent: "bg-blue-500/10" },
  { title: "True Hourly Wage Calculator", description: "What does your day job really pay per hour?", href: "/tools/true-hourly-wage", icon: "⏱️", accent: "bg-purple-500/10" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Side Hustle Calculator",
      url: "https://worthulator.com/tools/side-hustle-calculator",
      applicationCategory: "FinanceApplication",
      description: "Calculate your real net monthly and yearly income from a side hustle after expenses and self-employment tax.",
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

export default function SideHustleCalculator() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SimpleCalculatorHero
        eyebrowIcon="💼"
        eyebrowText="Side Hustle"
        title="What Does Your Side Hustle Actually Pay?"
        description="Enter your hours, rate, expenses, and tax rate to see your real net monthly income and true effective hourly rate — not just gross revenue."
        chips={["After tax", "After expenses", "True hourly rate"]}
      >
        <CalculatorEngineLoader slug="side-hustle-calculator" />
      </SimpleCalculatorHero>
      <InsightStrip text="Your gross rate and your effective rate can differ by 40% or more." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="Make your side hustle work harder" cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the Side Hustle Calculator Works"
        paragraphs={[
          "Enter your weekly hours, hourly rate, expense percentage, and estimated tax rate. The calculator multiplies weekly hours by 4.33 to get a monthly figure, deducts your expense ratio, then applies self-employment tax to give you a true net monthly income.",
          "Dividing net monthly income by total hours worked reveals your effective hourly rate — the number that actually reflects what you earn from the gig after all costs.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
