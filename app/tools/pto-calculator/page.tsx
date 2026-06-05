import type { Metadata } from "next";
import { calculatePto } from "@/calculations/work/pto";
import EngineWithInsights from "@/components/worthcore/EngineWithInsights";
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
  title: "PTO Calculator 2026 – Cash Value of Unused Vacation Days",
  description:
    "Calculate the dollar value of your unused PTO or vacation days. Enter your hourly rate and remaining PTO hours for an instant cash equivalent.",
  keywords: ["PTO calculator", "unused vacation payout calculator", "PTO cash value", "how much is my PTO worth", "vacation days calculator"],
  alternates: { canonical: "https://worthulator.com/tools/pto-calculator" },
  robots: { index: true, follow: true },
};

// ── Step 5c: worked example derived from the live calculation module ─────────
const usd = (n: number) => "$" + Math.round(n).toLocaleString();
const EX = calculatePto({ hourlyRate: 35, ptoHoursRemaining: 80, hoursPerDay: 8 });

const FAQS = [
  {
    q: "Do employers have to pay out unused PTO?",
    a: "It depends on the state. California, Colorado, Montana, and Nebraska require PTO payout on termination. Most other states allow employers to set their own policy. Check your employee handbook — many companies pay out accrued PTO regardless of legal requirement.",
  },
  {
    q: "How do you calculate the cash value of PTO?",
    a: `Multiply your hourly rate by the number of PTO hours remaining. If you earn $35/hour and have 80 hours of PTO, it's worth ${usd(EX.cashValue)} (${EX.daysRemaining} days). If you're salaried, divide your annual salary by 2,080 to get your hourly rate.`,
  },
  {
    q: "What is the difference between PTO and vacation days?",
    a: "PTO (Paid Time Off) is a combined bank of hours used for any purpose — vacation, sick days, personal days. Traditional vacation is specifically for leisure travel. Most modern employers now offer PTO instead of separate vacation and sick leave.",
  },
  {
    q: "Should I use my PTO before leaving a job?",
    a: "If your state doesn't require payout, yes — take it before you leave. Even if payout is required, using the time is usually better because you get the benefit of the rest plus the pay. Give proper notice but use any remaining PTO during your notice period where possible.",
  },
  {
    q: "What happens to unused PTO at the end of the year?",
    a: "'Use it or lose it' policies are common in states that allow them. California prohibits use-it-or-lose-it for vacation. If your employer has rollover limits, track your balance carefully — unused PTO past the cap often vanishes on January 1.",
  },
];

const STATS = [
  { stat: "55%",   color: "text-emerald-600", accent: "bg-emerald-500", label: "Of US workers don't use all their PTO each year — leaving paid time on the table" },
  { stat: "$571",  color: "text-blue-600",    accent: "bg-blue-500",    label: "Average per-employee PTO balance left unused at the end of the year" },
  { stat: "4",     color: "text-amber-600",   accent: "bg-amber-500",   label: "US states that legally require employers to pay out all accrued PTO on separation" },
];

const CONTENT_CARDS = [
  {
    icon: "🏖️",
    title: "PTO is part of your compensation",
    body: "Unused PTO is money you've already earned. If you don't use it and your employer doesn't pay it out, you worked for less than your agreed compensation. Tracking your PTO balance like a bank account changes how most people think about using it.",
  },
  {
    icon: "📋",
    title: "Know your company's policy",
    body: "Before counting on a payout, read your employment contract. Many companies have 'use it or lose it' policies, payout caps, or time limits on accumulated balances. Some will pay out at separation but not voluntarily.",
  },
  {
    icon: "📈",
    title: "Use PTO strategically",
    body: "Taking regular time off is consistently linked to higher productivity, lower burnout risk, and better long-term performance. Workers who use their PTO consistently outperform those who don't over multi-year periods — you're not buying performance by skipping vacation.",
  },
];

const RELATED_CALCS = [
  { title: "Salary to Hourly Calculator",  description: "Find your hourly rate from your annual salary.",      href: "/tools/salary-to-hourly-calculator",  icon: "🕐", accent: "bg-emerald-500/10" },
  { title: "Meeting Cost Calculator",      description: "See the dollar cost of time in meetings.",             href: "/tools/meeting-cost-calculator",      icon: "📅", accent: "bg-blue-500/10" },
  { title: "Commute Cost Calculator",      description: "Calculate your annual fuel cost to drive to work.",    href: "/tools/commute-cost-calculator",      icon: "🚗", accent: "bg-amber-500/10" },
  { title: "Pay Raise Calculator",         description: "Calculate your new salary after a raise.",             href: "/tools/pay-raise-calculator",         icon: "💰", accent: "bg-purple-500/10" },
];

export default function PtoCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "PTO Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description: "Calculate the dollar cash value of unused PTO or vacation days.",
      url: "https://worthulator.com/tools/pto-calculator",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQS.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })),
    },
  ];

  return (
    <main className="bg-white text-gray-900">
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <SimpleCalculatorHero
        eyebrowIcon="🏖️"
        eyebrowText="Work · Productivity"
        title="PTO Calculator"
        description="Calculate the cash value of your unused PTO or vacation days — enter your hourly rate and remaining hours for an instant result."
        chips={["Cash value of PTO", "Days remaining", "Weekly earning rate"]}
      >
        <EngineWithInsights slug="pto-calculator" />
      </SimpleCalculatorHero>
      <InsightStrip text='Unused PTO is compensation you already earned — <span class="font-semibold text-gray-900">if you don&apos;t use it and it isn&apos;t paid out, you worked for less than agreed.</span>' />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="PTO — the paid benefit most people undervalue" subtitle="What your time off is actually worth." cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the PTO Calculator Works"
        formula={`Cash Value       = Hourly Rate × PTO Hours Remaining
Days Remaining   = PTO Hours ÷ Hours Per Day
Weekly Rate      = Hourly Rate × Hours Per Day × 5`}
        steps={[
          { label: "Enter your hourly rate", description: "Find this on your pay stub, or divide your annual salary by 2,080." },
          { label: "Enter PTO hours remaining", description: "Check your HR system or pay stub for your current balance." },
          { label: "Set hours per workday", description: "Standard is 8 hours. Adjust if your workday is longer or shorter." },
          { label: "Read the result", description: "Cash value of your remaining PTO, days left, and your weekly PTO earning rate." },
        ]}
        paragraphs={[
          "To find your hourly rate from an annual salary: divide by 2,080 (40 hours × 52 weeks). For example, $72,800 ÷ 2,080 = $35.00/hour.",
          "This calculator shows gross value before taxes. If your employer pays out PTO, it's taxed as regular income at your normal rate.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />
      <RelatedCalcCards title="Related Calculators" subtitle="More tools for understanding your work compensation." items={RELATED_CALCS} />
    </main>
  );
}
