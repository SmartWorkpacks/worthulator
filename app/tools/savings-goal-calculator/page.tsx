import type { Metadata } from "next";
import SavingsGoalWithInsights from "@/components/worthcore/SavingsGoalWithInsights";
import SimpleCalculatorHero from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import StandardFAQSection from "@/src/templates/take-home-pay/StandardFAQSection";
import {
  StatChipsRow, ContentCardGrid, SEOTextBlock, InsightStrip, RelatedCalcCards,
} from "@/src/templates/take-home-pay/StandardSEOSection";

export const metadata: Metadata = {
  title: "Savings Goal Calculator 2026 – Monthly Deposit + Inflation-Adjusted Target",
  description:
    "Calculate the exact monthly deposit needed to reach any financial goal — and see what that goal really costs in future dollars, using the live FRED CPI inflation rate.",
  keywords: ["savings goal calculator", "how much to save per month", "monthly savings calculator", "savings target calculator", "inflation adjusted savings goal"],
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
    a: "Enter your current savings in the 'Current savings' field. The calculator will account for the compound growth of your existing savings and reduce your required monthly contribution accordingly. More existing savings = smaller monthly deposit needed. With $2,000 already saved toward a $20,000 goal in 3 years at 4%, you need $465/month instead of $524.",
  },
  {
    q: "Does the goal need to grow with inflation?",
    a: "Often, yes — if your goal is to buy something (a house, a car, a trip), its price rises with inflation. The calculator restates your goal in future dollars using the live FRED CPI rate: a $20,000 goal in 3 years at 3.2% inflation really needs to be about $21,982 to buy the same thing, which means saving about $517/month to truly keep pace.",
  },
];

const STATS = [
  { stat: "$465/mo", color: "text-emerald-600", accent: "bg-emerald-500", label: "To save a $20,000 goal in 3 years at 4% return, with $2,000 already saved" },
  { stat: "6.3%",    color: "text-blue-600",    accent: "bg-blue-500",    label: "of that $20,000 goal is funded by investment growth ($1,268), not your deposits" },
  { stat: "$21,982", color: "text-amber-600",   accent: "bg-amber-500",   label: "what the $20,000 goal really costs in 3 years at the live 3.2% CPI inflation rate" },
];

const CONTENT_CARDS = [
  {
    icon: "🎯",
    title: "Break any goal into a monthly number",
    body: "A $20,000 down payment sounds daunting. But at 4% in a high-yield savings account over 3 years — with $2,000 already saved — it's about $465/month. Stretch the timeline to 5 years and it drops to roughly $265/month. Every goal becomes manageable once it's a monthly number.",
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
        chips={["Monthly contribution needed", "Inflation-adjusted goal (live CPI)", "Deposits vs growth split"]}
      >
        <SavingsGoalWithInsights />
      </SimpleCalculatorHero>

      <InsightStrip
        text='Any financial goal becomes achievable once you know the monthly number — and we also show <span class="font-semibold text-gray-900">what the goal really costs after inflation.</span>'
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="How to make any savings goal feel achievable"
        subtitle="Break it down. Pick a timeline. Hit the monthly number consistently."
        cards={CONTENT_CARDS}
      />

      <SEOTextBlock
        title="How the Savings Goal Calculator Works"
        formula={`r = Annual Return Rate / 100 / 12   (monthly rate)
n = Years × 12                       (total months)

PV Grown = Current Savings × (1 + r)^n
Monthly Contribution = (Goal − PV Grown) × r / ((1 + r)^n − 1)

Interest Earned        = Goal − Current Savings − (Monthly × n)
Inflation-Adjusted Goal = Goal × (1 + i)^years      i = live FRED CPI`}
        steps={[
          { label: "Enter your savings goal", description: "The target amount — down payment, emergency fund, lump sum, or any goal." },
          { label: "Add your current savings", description: "Money already set aside. This reduces your required monthly contribution." },
          { label: "Set your timeline", description: "Years until you need the money. Longer timelines = lower monthly contributions." },
          { label: "Choose an annual return", description: "HYSA: ~4–5% · Conservative portfolio: ~5–6% · Stock market (long-term): ~7–10%." },
          { label: "Read your numbers", description: "The monthly deposit, growth vs deposits split, and the inflation-adjusted goal with the deposit needed to keep pace." },
        ]}
        paragraphs={[
          "This calculator uses the standard future-value-of-an-annuity formula, which accounts for compound interest on both your existing savings and each monthly contribution as it is made. It's the same calculation used in financial planning software, just made accessible without a spreadsheet.",
          "A key insight: your existing savings reduce the required monthly contribution more than you might expect. In the default scenario — a $20,000 goal in 3 years at 4% with $2,000 already saved — you need $465/month, and growth supplies $1,268 (6.3%) of the goal so you only deposit $16,732 of it yourself.",
          "It also corrects for inflation. If your goal is to buy something, its price rises too — so we restate the target in future dollars using the live FRED CPI rate. At 3.2% inflation a $20,000 goal becomes about $21,982 in 3 years, and keeping pace takes roughly $517/month rather than $465.",
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
