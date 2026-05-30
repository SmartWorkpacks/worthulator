import type { Metadata } from "next";
import CalculatorEngineLoader from "@/components/calculator-engine/CalculatorEngineLoader";
import SimpleCalculatorHero from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import StandardFAQSection from "@/src/templates/take-home-pay/StandardFAQSection";
import {
  StatChipsRow, ContentCardGrid, SEOTextBlock, InsightStrip, RelatedCalcCards,
} from "@/src/templates/take-home-pay/StandardSEOSection";
import InsightsSection from "@/components/insights/InsightsSection";
import InsightTable from "@/components/insights/InsightTable";

export const metadata: Metadata = {
  title: "Savings Goal Calculator 2026 – How Much to Save Per Month",
  description:
    "Calculate the exact monthly savings contribution needed to reach any financial goal — down payment, emergency fund, holiday, or retirement milestone.",
  keywords: ["savings goal calculator", "how much to save per month", "monthly savings calculator", "savings target calculator", "how long to save"],
  alternates: { canonical: "https://worthulator.com/tools/savings-goal-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "How do I calculate how much I need to save each month?",
    a: "The formula is based on the Future Value of an annuity: Monthly Contribution = (Goal Amount − Current Savings × (1+r)^n) × r / ((1+r)^n − 1), where r is the monthly interest rate and n is the number of months. The calculator handles this automatically — just enter your goal, current savings, timeline, and expected return.",
  },
  {
    q: "What interest rate should I use?",
    a: "For a high-yield savings account (HYSA), use 4–5%. For a conservative investment portfolio (bonds/mixed), use 4–6%. For a broad stock market index fund over a long horizon (10+ years), the historical average is around 7–10%. Be conservative for short timelines — market returns are unpredictable in the short run.",
  },
  {
    q: "What is compound interest and why does it matter?",
    a: "Compound interest means you earn interest on your interest. Over time, this creates exponential growth rather than linear growth. The longer your timeline and the higher your return rate, the more compound interest reduces the monthly contribution needed to hit your goal.",
  },
  {
    q: "Should I use a savings account or invest for my goal?",
    a: "For goals under 3 years (down payment, holiday fund, emergency fund), keep the money in a high-yield savings account — it's liquid and protected from market volatility. For goals 5+ years away, a low-cost index fund may give better returns. For goals 3–5 years out, a conservative mixed portfolio or a CD ladder is a middle ground.",
  },
  {
    q: "What if I already have some savings?",
    a: "Enter your current savings in the 'Current savings' field. The calculator will account for the compound growth of your existing savings and reduce your required monthly contribution accordingly. More existing savings = smaller monthly deposit needed.",
  },
];

const STATS = [
  { stat: "20%",   color: "text-emerald-600", accent: "bg-emerald-500", label: "Recommended savings rate — the 50/30/20 rule allocates 20% of take-home pay to savings and debt payoff" },
  { stat: "$20K",  color: "text-blue-600",    accent: "bg-blue-500",    label: "Typical down payment on a $100K home at 20% — a common first major savings goal" },
  { stat: "3–6mo", color: "text-amber-600",   accent: "bg-amber-500",   label: "Recommended emergency fund before starting other savings goals" },
];

const CONTENT_CARDS = [
  {
    icon: "🎯",
    title: "Break any goal into a monthly number",
    body: "A $20,000 down payment sounds daunting. But at 4% in a high-yield savings account over 3 years, it's $515/month. Over 5 years, it drops to $294/month. Every financial goal becomes manageable once you translate it into a monthly contribution.",
  },
  {
    icon: "📈",
    title: "Your existing savings do the heavy lifting",
    body: "If you already have $5,000 saved toward a $20,000 goal, that $5,000 grows on its own at your return rate — reducing the monthly deposit you need to make. The further away your goal, the more your existing savings matter.",
  },
  {
    icon: "⏳",
    title: "Time is the most powerful variable",
    body: "Extending a 2-year savings plan to 5 years can cut the required monthly contribution by more than half. Starting a year earlier is almost always worth more than chasing a higher interest rate — because time affects both compounding and the number of contributions.",
  },
];

const RELATED_CALCS = [
  {
    title: "Emergency Fund Calculator",
    description: "Calculate your ideal emergency fund before tackling other goals.",
    href: "/tools/emergency-fund-calculator",
    icon: "🛡️",
    accent: "bg-emerald-500/10",
  },
  {
    title: "Compound Interest Calculator",
    description: "See how a lump sum grows over time with compound interest.",
    href: "/tools/compound-interest-calculator",
    icon: "📈",
    accent: "bg-blue-500/10",
  },
  {
    title: "Subscription Auditor",
    description: "Find monthly savings by auditing your subscriptions.",
    href: "/tools/subscription-auditor",
    icon: "💸",
    accent: "bg-amber-500/10",
  },
  {
    title: "Retirement Calculator",
    description: "Project your retirement nest egg and monthly income.",
    href: "/tools/retirement-calculator",
    icon: "🏖️",
    accent: "bg-violet-500/10",
  },
];

export default function SavingsGoalCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Savings Goal Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description: "Calculate the monthly contribution needed to reach any savings goal based on timeline, current savings, and return rate.",
      url: "https://worthulator.com/tools/savings-goal-calculator",
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
        eyebrowIcon="🎯"
        eyebrowText="Personal Finance · Savings"
        title="Savings Goal Calculator"
        description="Enter your goal, timeline, and current savings to see exactly how much you need to put away each month — with compound interest factored in."
        chips={["Monthly contribution needed", "Interest earned vs deposited", "Compound interest model"]}
      >
        <CalculatorEngineLoader slug="savings-goal-calculator" afterResults={<InsightsSection slug="savings-goal-calculator" />} />
      </SimpleCalculatorHero>

      <InsightStrip
        text='Any financial goal — down payment, emergency fund, holiday — <span class="font-semibold text-gray-900">becomes achievable once you know the monthly number.</span>'
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="How to make any savings goal feel achievable"
        subtitle="Break it down. Pick a timeline. Hit the monthly number consistently."
        cards={CONTENT_CARDS}
      />
      <InsightTable slug="savings-goal-calculator" />

      <SEOTextBlock
        title="How the Savings Goal Calculator Works"
        formula={`r = Annual Return Rate / 100 / 12   (monthly rate)
n = Years × 12                       (total months)

PV Grown = Current Savings × (1 + r)^n

Monthly Contribution = (Goal − PV Grown) × r / ((1 + r)^n − 1)

Total Contributed = Monthly Contribution × n
Interest Earned   = Goal − Current Savings − Total Contributed`}
        steps={[
          { label: "Enter your savings goal", description: "The target amount — down payment, emergency fund, lump sum, or any goal." },
          { label: "Add your current savings", description: "Money already set aside. This reduces your required monthly contribution." },
          { label: "Set your timeline", description: "Years until you need the money. Longer timelines = lower monthly contributions." },
          { label: "Choose an annual return", description: "HYSA: ~4–5% · Conservative portfolio: ~5–6% · Stock market (long-term): ~7–10%." },
          { label: "See your monthly number", description: "The exact monthly deposit to hit your goal, plus total contributed and interest earned." },
        ]}
        paragraphs={[
          "This calculator uses the standard future-value-of-an-annuity formula, which accounts for compound interest on both your existing savings and each monthly contribution as it is made. It's the same calculation used in financial planning software, just made accessible without a spreadsheet.",
          "A key insight: your existing savings reduce the required monthly contribution more than you might expect, especially with a longer timeline. $5,000 already saved toward a 5-year goal at 5% return is worth $6,381 by the end — that's $1,381 in compound growth that reduces what you need to deposit monthly.",
        ]}
      />

      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      <RelatedCalcCards
        title="Related Calculators"
        subtitle="Build your complete savings and investment plan."
        items={RELATED_CALCS}
      />
    </main>
  );
}
