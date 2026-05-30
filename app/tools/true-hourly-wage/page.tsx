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
  title: "True Hourly Wage Calculator 2026 – Your Real Pay After Commute & Prep Time",
  description:
    "Calculate your actual hourly wage accounting for commute time, work prep, and decompression. Most salaried workers earn far less per hour than their contract suggests.",
  keywords: ["true hourly wage calculator", "real hourly rate", "effective hourly wage", "commute cost calculator"],
  alternates: { canonical: "https://worthulator.com/tools/true-hourly-wage" },
};

const FAQS = [
  {
    q: "What is the true hourly wage?",
    a:
      "Your true hourly wage is your salary divided by all the hours your job actually requires — including your commute, getting ready for work, and time spent decompressing from work stress. It's almost always lower than your official rate.",
  },
  {
    q: "Why does commute time matter for hourly rate?",
    a:
      "Commute time is unpaid but it's directly caused by your job. A one-hour daily round trip adds ~250 hours per year to your job-related time. For a $60,000 salary worker, that alone can reduce the effective rate by $5–$8/hr.",
  },
  {
    q: "What counts as decompression time?",
    a:
      "Decompression time is the period after work where you're too mentally drained to do anything productive — scrolling your phone, zoning out, or just recovering. Many people spend 30–90 minutes per day in this state due to work stress.",
  },
  {
    q: "How does this affect job decisions?",
    a:
      "A remote job paying $75,000 can easily beat a $90,000 office job once you account for zero commute costs and time savings. This calculator helps you make apples-to-apples comparisons between job offers.",
  },
  {
    q: "Should I include getting ready for work?",
    a:
      "Yes, if you dress or prepare differently for work than you would otherwise, that time is job-related. People in professional settings often spend 20–40 minutes daily on work-specific preparation.",
  },
];

const STATS = [
  { stat: "~25%", color: "text-amber-600", accent: "bg-amber-500", label: "of \"work time\" is often unpaid — commute, prep, and decompression" },
  { stat: "30–40%", color: "text-emerald-600", accent: "bg-emerald-500", label: "typical tax burden on earned income including payroll taxes" },
  { stat: "$0", color: "text-blue-600", accent: "bg-blue-500", label: "value of free time — but knowing your true rate helps decide when to outsource" },
];

const CONTENT_CARDS = [
  {
    icon: "⏱️",
    title: "The hidden cost of going to the office",
    body: "The average American spends over 200 hours per year commuting — that's more than 5 full work weeks. None of it is compensated. For many workers, this represents a 10-15% reduction in effective hourly pay.",
  },
  {
    icon: "💸",
    title: "Remote work's true financial value",
    body: "A $10,000 salary difference between a remote and in-office job often reverses when you add commute costs, wardrobe, lunches, and time. Many remote workers effectively earn more despite lower nominal pay.",
  },
  {
    icon: "🧮",
    title: "Using your true wage to make decisions",
    body: "When evaluating any purchase, try thinking in terms of your true hourly wage: 'how many real hours of my life is this costing?' A $200 purchase at a $12/hr true wage costs 16.7 hours of your actual life.",
  },
];

const RELATED_CALCS = [
  { title: "Hourly to Salary Calculator", description: "Convert hourly pay to annual salary.", href: "/tools/hourly-to-salary-calculator", icon: "💼", accent: "bg-emerald-500/10" },
  { title: "Freelance Rate Calculator", description: "Find the right rate for your freelance work.", href: "/tools/freelance-rate-calculator", icon: "📋", accent: "bg-blue-500/10" },
  { title: "Overtime Pay Calculator", description: "Calculate overtime earnings.", href: "/tools/overtime-pay-calculator", icon: "⏰", accent: "bg-amber-500/10" },
  { title: "Self-Employed Tax Calculator", description: "Estimate your 1099 tax liability.", href: "/tools/self-employed-tax", icon: "🧾", accent: "bg-purple-500/10" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "True Hourly Wage Calculator",
      url: "https://worthulator.com/tools/true-hourly-wage",
      applicationCategory: "FinanceApplication",
      description: "Calculate your real hourly rate after commute, prep, and decompression time.",
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

export default function TrueHourlyWage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SimpleCalculatorHero
        eyebrowIcon="⏱️"
        eyebrowText="True Hourly Wage"
        title="What Are You Actually Earning Per Hour?"
        description="Factor in your commute, work prep, and decompression time to find your real hourly rate — not just your salary divided by 40 hours."
        chips={["Commute included", "Decompression time", "True vs advertised rate"]}
      >
        <CalculatorEngineLoader slug="true-hourly-wage" />
      </SimpleCalculatorHero>
      <InsightStrip text="Your contract says 40 hours. Your job demands more. Here's what you're really earning." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="Why your true hourly rate matters"  cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How Your True Hourly Wage Is Calculated"
        paragraphs={[
          "This calculator adds commute time (both directions × 5 days × 52 weeks) and daily decompression time (× 5 days × 52 weeks) to your contracted work hours. Your salary is then divided by this total to give your true effective hourly rate.",
          "For example: $65,000/year with a 30-min each-way commute and 30-min decompression adds 260 unpaid hours/year, reducing your effective rate from $31.25/hr to approximately $26/hr.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
