import type { Metadata } from "next";
import TimeToRetirementWithInsights from "@/components/worthcore/TimeToRetirementWithInsights";
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
  title: "Time to Retirement Calculator 2026 – FIRE Number & Years to Financial Independence",
  description:
    "Calculate your FIRE retirement number using the 4% rule and how many years until your savings can sustain your lifestyle. Enter expenses, savings, and return rate.",
  keywords: ["time to retirement calculator", "FIRE calculator", "financial independence calculator", "how long to retire calculator", "retirement savings calculator"],
  alternates: { canonical: "https://worthulator.com/tools/time-to-retirement-calculator" },
};

const FAQS = [
  {
    q: "What is the 4% rule for retirement?",
    a: "The 4% rule (Trinity Study, 1998) states that a retiree can withdraw 4% of their portfolio per year and have a very high probability (95%+) of not running out of money over a 30-year retirement, assuming a diversified stock/bond portfolio. This means your retirement target = annual expenses × 25. Spend $40,000/year → need $1,000,000. Spend $60,000/year → need $1,500,000. The rule was based on historical US market data; debate continues about whether 3.5% is more appropriate for longer retirements.",
  },
  {
    q: "What is FIRE and how does this calculator support it?",
    a: "FIRE stands for Financial Independence, Retire Early. The movement focuses on aggressive saving (40–70%+ of income) and frugal living to reach financial independence decades ahead of traditional retirement age. This calculator uses the core FIRE math: determine your 'FI number' (expenses × 25) and model how long your current savings rate takes to reach it at an assumed market return rate.",
  },
  {
    q: "What is a realistic annual investment return to use?",
    a: "Common assumptions: 7% = US stock market long-run real return (inflation-adjusted); 10% = nominal US market return; 5–6% = conservative assumption for a balanced portfolio; 4% = very conservative for bond-heavy portfolios. Most FIRE calculators use 7% as a real return baseline. This calculator lets you adjust the return to model different scenarios.",
  },
  {
    q: "How do I reduce my years to retirement?",
    a: "Two levers: increase your savings rate or reduce your target expenses. Reducing annual expenses by $5,000 saves $125,000 from your FI number AND frees up more money to invest annually — a double benefit. Increasing income and saving the difference is the other major lever. The savings rate is the most powerful variable in the FIRE equation: going from a 20% to a 50% savings rate roughly halves the time to financial independence.",
  },
  {
    q: "What happens after I hit my FIRE number?",
    a: "Reaching your FI number means your investment portfolio can theoretically sustain your expenses indefinitely (at the 4% withdrawal rate). Most FIRE adherents aim for 'lean FIRE' (minimal expenses) or 'fat FIRE' (comfortable spending). 'Coast FIRE' is a milestone where you stop contributing and let existing savings compound to a future FI number. 'Barista FIRE' involves part-time work for social connection and health insurance while investments grow.",
  },
];

const STATS = [
  { stat: "25×", color: "text-emerald-600", accent: "bg-emerald-500", label: "your annual expenses is the FIRE number — the portfolio needed to retire on the 4% rule" },
  { stat: "15 yr", color: "text-blue-600", accent: "bg-blue-500", label: "typical FIRE timeline for someone saving 50%+ of income starting in their 30s" },
  { stat: "4%", color: "text-amber-600", accent: "bg-amber-500", label: "safe withdrawal rate — the annual % you can take from your portfolio indefinitely" },
];

const CONTENT_CARDS = [
  {
    icon: "🎯",
    title: "Your FIRE number is just expenses × 25",
    body: "The simplicity of the 4% rule is what made it powerful. Annual expenses × 25 = your target portfolio. The math works because a 4% annual withdrawal from a 7%-returning portfolio leaves 3% to offset inflation and portfolio growth. Keeping expenses low has a compounding double benefit: smaller FIRE number AND more money available to invest each year.",
  },
  {
    icon: "📈",
    title: "Savings rate is the key variable",
    body: "Traditional retirement advice (save 10–15% of income) leads to retiring at 60–65. Saving 25% gets you there in 32 years. Saving 50% in 17 years. Saving 75% in under 10 years. The relationship is highly non-linear: small increases in savings rate early in your career have outsized effects on retirement age. Starting a few years earlier matters far more than investment returns.",
  },
  {
    icon: "🛡️",
    title: "Build flexibility into your plan",
    body: "Most FIRE practitioners build a buffer: targeting 3.5% withdrawal rate (FI number = expenses × 28.5), having part-time or side income to supplement in early retirement years, and keeping 1–3 years of expenses in cash/bonds to avoid selling stocks in a downturn. The 4% rule works — but building in margin of safety improves resilience against sequence-of-returns risk.",
  },
];

const RELATED_CALCS = [
  { title: "FIRE Calculator", description: "Full FIRE projection with savings rate.", href: "/tools/fire-calculator", icon: "🔥", accent: "bg-emerald-500/10" },
  { title: "Coast FIRE Calculator", description: "When can you stop contributing?", href: "/tools/coast-fire-calculator", icon: "🏄", accent: "bg-blue-500/10" },
  { title: "Compound Interest Calculator", description: "Model portfolio growth over time.", href: "/tools/compound-interest-calculator", icon: "📈", accent: "bg-amber-500/10" },
  { title: "Emergency Fund Calculator", description: "How much cash reserve do you need?", href: "/tools/emergency-fund-calculator", icon: "🛡️", accent: "bg-purple-500/10" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Time to Retirement Calculator",
      url: "https://worthulator.com/tools/time-to-retirement-calculator",
      applicationCategory: "FinanceApplication",
      description: "Calculate your FIRE number and how many years until your savings reach financial independence.",
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

export default function TimeToRetirementCalculator() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SimpleCalculatorHero
        eyebrowIcon="🏖️"
        eyebrowText="Time to Retirement Calculator"
        title="How Many Years Until You Can Retire?"
        description="Enter your monthly expenses, savings, monthly savings, and expected return rate to calculate your FIRE number and exactly how many years until you can retire."
        chips={["FIRE number calculated", "Years to retire shown", "4% rule based"]}
      >
        <TimeToRetirementWithInsights />
      </SimpleCalculatorHero>
      <InsightStrip text="Your retirement target = <span class='font-semibold text-gray-900'>annual expenses × 25</span> — that's the portfolio that can sustain you indefinitely on the 4% rule." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="The math behind financial independence" cards={CONTENT_CARDS} />

      <SEOTextBlock
        title="How the Time to Retirement Calculator Works"
        formula="FIRE Number = Monthly Expenses × 12 × 25\nMonthly Return = Annual Return ÷ 12\nBalance grows month by month until ≥ FIRE Number"
        paragraphs={[
          "The calculator uses the 4% safe withdrawal rate to derive your retirement target (expenses × 25). It then simulates monthly compounding: each month your existing savings grow by the monthly return rate, and your monthly contribution is added.",
          "The loop continues until the projected balance reaches your FIRE number. The result is the number of years and months from today until financial independence at your current savings rate and assumed return.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
