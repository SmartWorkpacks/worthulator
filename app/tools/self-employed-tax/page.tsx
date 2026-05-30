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
  title: "Self-Employed Tax Calculator 2026 – 1099 Quarterly Tax Estimator",
  description:
    "Calculate your self-employment tax, quarterly estimated payments, and monthly reserve. Essential tool for freelancers, contractors, and 1099 workers.",
  keywords: ["self employed tax calculator", "1099 tax calculator", "quarterly estimated tax", "freelancer tax calculator", "SE tax"],
  alternates: { canonical: "https://worthulator.com/tools/self-employed-tax" },
};

const FAQS = [
  {
    q: "How is self-employment tax calculated?",
    a:
      "Self-employment (SE) tax is 15.3% on 92.35% of your net self-employment income (net income × 0.9235 × 0.153). This covers the Social Security and Medicare taxes that employees and employers split. You can deduct half of SE tax from your federal taxable income.",
  },
  {
    q: "How much should I set aside for taxes as a freelancer?",
    a:
      "A commonly cited rule is 25–30% of gross income. However, the exact amount depends on your income level, deductions, and state taxes. This calculator gives you a more precise federal estimate. Add your state income tax rate on top.",
  },
  {
    q: "When are quarterly estimated taxes due?",
    a:
      "2026 due dates: April 15 (Q1), June 15 (Q2), September 15 (Q3), and January 15, 2027 (Q4). Missing a quarterly payment can result in an underpayment penalty even if you pay the full amount at tax time.",
  },
  {
    q: "What business expenses can I deduct?",
    a:
      "Common deductions include: home office (direct method or simplified $5/sq ft up to 300 sq ft), business portion of phone/internet, software subscriptions, professional development, equipment, business travel, health insurance premiums, and retirement contributions.",
  },
  {
    q: "Do I still pay FICA taxes when self-employed?",
    a:
      "Yes — as a self-employed person, you pay both the employee and employer share of Social Security (12.4%) and Medicare (2.9%) taxes. This is the self-employment tax. The cap for Social Security applies: in 2026, it applies to the first ~$176,100 of net earnings.",
  },
];

const STATS = [
  { stat: "15.3%", color: "text-amber-600", accent: "bg-amber-500", label: "self-employment tax rate — both employee and employer halves of FICA" },
  { stat: "92.35%", color: "text-blue-600", accent: "bg-blue-500", label: "of net income that self-employment tax applies to" },
  { stat: "25–30%", color: "text-emerald-600", accent: "bg-emerald-500", label: "recommended tax reserve as a percentage of gross freelance income" },
];

const CONTENT_CARDS = [
  {
    icon: "😱",
    title: "The SE tax surprise",
    body: "Many new freelancers are shocked by self-employment tax. As an employee, your employer pays half (7.65%). As self-employed, you pay both halves (15.3%) on the first ~$176K of net earnings. Budget for this from day one.",
  },
  {
    icon: "✂️",
    title: "Lower your bill with deductions",
    body: "Business deductions directly reduce your net income, which reduces both federal income tax and SE tax. A $5,000 deduction at a 22% bracket + 15.3% SE tax saves you roughly $1,865 in total taxes.",
  },
  {
    icon: "🏦",
    title: "Self-employed retirement accounts",
    body: "A SEP-IRA lets you contribute up to 25% of net earnings (max ~$70,000/year in 2026). Solo 401(k) allows even more. These contributions are fully tax-deductible, dramatically reducing your tax bill while building wealth.",
  },
];

const RELATED_CALCS = [
  { title: "Freelance Rate Calculator", description: "Set a rate that covers taxes and costs.", href: "/tools/freelance-rate-calculator", icon: "📋", accent: "bg-emerald-500/10" },
  { title: "Hourly to Salary Calculator", description: "Compare freelance vs full-time income.", href: "/tools/hourly-to-salary-calculator", icon: "💼", accent: "bg-blue-500/10" },
  { title: "True Hourly Wage Calculator", description: "Find your real effective hourly rate.", href: "/tools/true-hourly-wage", icon: "⏱️", accent: "bg-amber-500/10" },
  { title: "Net Worth Calculator", description: "Track your total financial picture.", href: "/tools/net-worth-calculator", icon: "📊", accent: "bg-purple-500/10" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Self-Employed Tax Calculator",
      url: "https://worthulator.com/tools/self-employed-tax",
      applicationCategory: "FinanceApplication",
      description: "Calculate quarterly estimated tax payments and monthly reserve for 1099 workers.",
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

export default function SelfEmployedTax() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SimpleCalculatorHero
        eyebrowIcon="🧾"
        eyebrowText="Self-Employed Tax"
        title="How Much Tax Do You Owe as a Freelancer or 1099 Worker?"
        description="Estimate your self-employment tax, federal income tax, quarterly payment amount, and exactly how much to set aside each month."
        chips={["SE tax formula", "Quarterly payments", "Monthly reserve"]}
      >
        <CalculatorEngineLoader slug="self-employed-tax" />
      </SimpleCalculatorHero>
      <InsightStrip text="Self-employed workers pay 15.3% SE tax on top of income tax — most first-year freelancers underestimate this." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="Taxes as a freelancer: what to know"  cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How Self-Employment Tax Is Calculated"
        paragraphs={[
          "Net income = gross income − business expenses. SE tax = net income × 0.9235 × 0.153. Federal income tax = (net income − SE tax ÷ 2) × federal rate. Total tax = SE tax + federal income tax.",
          "This calculator provides a federal estimate only. Add your state income tax rate on top for total tax liability. Consult a CPA or tax professional for advice specific to your situation — especially if you have complex deductions or multiple income streams.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
