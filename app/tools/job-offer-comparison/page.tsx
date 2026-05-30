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
  title: "Job Offer Comparison Calculator 2026 – Compare Two Job Offers Side by Side",
  description:
    "Compare two job offers on total effective compensation — salary, commute costs, and benefits value. See which offer actually puts more money in your pocket.",
  keywords: ["job offer comparison calculator", "compare job offers", "total compensation calculator", "job offer evaluator"],
  alternates: { canonical: "https://worthulator.com/tools/job-offer-comparison" },
};

const FAQS = [
  {
    q: "How do I compare two job offers fairly?",
    a:
      "Look beyond base salary. Calculate the true effective compensation by adding benefits value (health insurance, 401k match, equity, PTO), then subtracting real costs like commute expenses and any out-of-pocket benefit costs. A lower-salary remote job can easily beat a higher-salary in-office role.",
  },
  {
    q: "How do I value health insurance and benefits?",
    a:
      "Estimate the annual cost of replacing each benefit on the open market. Family health insurance costs ~$6,000–$10,000/year if you paid for it yourself. A 4% 401k match on a $80K salary = $3,200/year. Unlimited PTO policies are harder to value — compare realistically.",
  },
  {
    q: "What commute costs should I include?",
    a:
      "Annual commute costs include: gas or public transit fares, parking, vehicle wear (~$0.10/mile for maintenance/depreciation beyond gas). A 30-mile round trip × 250 work days × $0.20/mile = $1,500/year just in vehicle costs, before parking.",
  },
  {
    q: "Should I factor in career growth potential?",
    a:
      "This calculator focuses on immediate financial comparison. Career growth, company culture, work-life balance, and learning opportunities are equally important but harder to quantify. Use this tool for the financial picture, then weigh intangibles separately.",
  },
  {
    q: "What if one job has equity or stock options?",
    a:
      "Include expected equity value in the benefits field — but be conservative. For startups, assume 0 unless you have strong conviction about an exit. For public company RSUs, use the current stock price × annual vesting schedule as the annual value.",
  },
];

const STATS = [
  { stat: "~$3K", color: "text-amber-600", accent: "bg-amber-500", label: "average annual commute cost for US workers" },
  { stat: "$6K–10K", color: "text-blue-600", accent: "bg-blue-500", label: "value of employer health insurance coverage" },
  { stat: "4.6%", color: "text-emerald-600", accent: "bg-emerald-500", label: "average US employer 401k match as a percentage of salary" },
];

const CONTENT_CARDS = [
  {
    icon: "🏡",
    title: "The remote work bonus",
    body: "A fully remote job eliminates commute costs, often reduces wardrobe costs, and may allow you to live in a lower cost-of-living area. When comparing a remote vs in-office role, add $2,000–$5,000 in implicit annual value to the remote offer.",
  },
  {
    icon: "💎",
    title: "Benefits are part of your compensation",
    body: "A job with slightly lower salary but excellent health benefits, generous 401k match, and strong PTO can easily be worth $10,000–$20,000 more per year than a high-salary job with bare-bones benefits.",
  },
  {
    icon: "📊",
    title: "Tax bracket effects on salary differences",
    body: "A $10,000 salary increase in the 22% federal bracket nets you only ~$7,800 after federal tax (more if your state also taxes income). Sometimes the after-tax difference between two offers is smaller than it first appears.",
  },
];

const RELATED_CALCS = [
  { title: "True Hourly Wage Calculator", description: "Find your real effective hourly rate.", href: "/tools/true-hourly-wage", icon: "⏱️", accent: "bg-emerald-500/10" },
  { title: "Hourly to Salary Calculator", description: "Convert hourly to annual salary.", href: "/tools/hourly-to-salary-calculator", icon: "💼", accent: "bg-blue-500/10" },
  { title: "Freelance Rate Calculator", description: "Set a freelance rate that competes with employment.", href: "/tools/freelance-rate-calculator", icon: "📋", accent: "bg-amber-500/10" },
  { title: "Overtime Pay Calculator", description: "See what overtime earnings look like.", href: "/tools/overtime-pay-calculator", icon: "⏰", accent: "bg-purple-500/10" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Job Offer Comparison Calculator",
      url: "https://worthulator.com/tools/job-offer-comparison",
      applicationCategory: "FinanceApplication",
      description: "Compare two job offers by total effective compensation including salary, benefits, and commute.",
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

export default function JobOfferComparison() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SimpleCalculatorHero
        eyebrowIcon="⚖️"
        eyebrowText="Job Offer Comparison"
        title="Which Job Offer Is Actually Worth More?"
        description="Go beyond base salary. Compare two job offers on total effective compensation — including benefits value, commute costs, and real take-home."
        chips={["Salary + benefits", "Commute costs deducted", "True gap shown"]}
      >
        <CalculatorEngineLoader slug="job-offer-comparison" />
      </SimpleCalculatorHero>
      <InsightStrip text="A job with lower salary but no commute and better benefits often wins on total compensation." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="Beyond base salary: total compensation"  cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the Job Offer Comparison Works"
        paragraphs={[
          "Effective compensation for each job = annual salary + estimated benefits value − annual commute cost. The calculator then shows you both figures side-by-side and the dollar difference between them.",
          "This is a pre-tax comparison. For an after-tax comparison, apply your marginal tax rate to the salary portion. Benefits like health insurance and 401k matches are typically not taxed as income, which makes them even more valuable than the raw numbers suggest.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
