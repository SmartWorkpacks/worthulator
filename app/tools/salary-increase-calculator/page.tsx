import type { Metadata } from "next";
import SalaryIncreaseCalculatorLoader from "./SalaryIncreaseCalculatorLoader";
import SimpleCalculatorHero from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import StandardFAQSection from "@/src/templates/take-home-pay/StandardFAQSection";
import {
  StatChipsRow, ContentCardGrid, SEOTextBlock, InsightStrip, RelatedCalcCards,
} from "@/src/templates/take-home-pay/StandardSEOSection";
import { getCpiInflationYoY, fredBenchmarks } from "@/lib/datasets/finance/fredBenchmarks";

// ── Live-data (Step 5c): worked examples derive from the live US CPI rate so
// the inflation copy auto-refreshes when FRED data updates ───────────────────
const CPI = getCpiInflationYoY();
const AS_OF = fredBenchmarks.currentPeriodLabel;
// Real value of a 5% nominal raise at the current inflation rate.
const REAL_ON_5 = Math.round(((1.05 / (1 + CPI / 100)) - 1) * 1000) / 10;

export const metadata: Metadata = {
  title: "Salary Increase Calculator 2026 – Calculate the Real Value of Your Raise",
  description:
    "See exactly how much your raise is worth after tax and inflation. Calculate monthly take-home increase, lifetime earnings impact, and what compounding raises do to your career total.",
  keywords: ["salary increase calculator", "raise calculator", "pay raise calculator", "salary negotiation calculator", "lifetime earnings calculator"],
  alternates: { canonical: "https://worthulator.com/tools/salary-increase-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "How much of my raise will I actually take home?",
    a: "Your take-home raise depends on your marginal tax rate — the rate applied to the top slice of your income. If you're in a 22% tax bracket, a $5,000 raise results in approximately $3,900 extra per year, or about $325/month. This calculator shows exactly that figure.",
  },
  {
    q: "What is the real value of a raise after inflation?",
    a: `If you get a ${CPI}% raise but inflation is ${CPI}%, your purchasing power hasn't increased at all — you're on a treadmill. With US inflation running at ${CPI}% (CPI-U, ${AS_OF}), a 5% raise works out to roughly a ${REAL_ON_5}% real raise in terms of what you can actually buy. This calculator defaults to the live inflation rate and shows the inflation-adjusted raise so you know the true value.`,
  },
  {
    q: "Why do small raises have a massive lifetime earnings impact?",
    a: "Because of compounding. Future raises are calculated on top of your current salary. A $5,000 raise today, compounded at 3% per year for 30 years, adds nearly $240,000 to your lifetime earnings. Every negotiation you avoid is compounded money left on the table.",
  },
  {
    q: "How often should I negotiate a salary increase?",
    a: "Most experts recommend reviewing salary at least annually, and negotiating every 1–2 years or with each role change. Studies show workers who negotiate earn significantly more over their careers than those who never ask. The first raise is the most important — every future one is built on top of it.",
  },
  {
    q: "Is a flat raise or a percentage raise better?",
    a: "It depends on your salary level. For lower salaries, a flat raise (e.g. $5,000) can represent a larger percentage. For higher salaries, a percentage raise scales better since it compounds proportionally with your base. Use the toggle in this calculator to compare both scenarios.",
  },
];

const STATS = [
  { stat: "49%",   color: "text-emerald-600", accent: "bg-emerald-500", label: "Workers who negotiate salary earn more over their career — yet most people never ask" },
  { stat: "$1M+",  color: "text-blue-600",    accent: "bg-blue-500",    label: "Difference in lifetime earnings between those who negotiate and those who don't, over a 40-year career" },
  { stat: "2.2%",  color: "text-amber-600",   accent: "bg-amber-500",   label: "Average wage growth in real terms after inflation — why negotiating above inflation matters" },
];

const CONTENT_CARDS = [
  {
    icon: "💰",
    title: "The compounding cost of not negotiating",
    body: "Failing to negotiate your first salary costs you far more than the immediate gap. All future raises, bonuses, and retirement contributions are calculated on top of your base. A $10,000 lower starting salary can mean $1 million less over a 40-year career.",
  },
  {
    icon: "📊",
    title: `Inflation makes a ${CPI}% raise feel like nothing`,
    body: `With US inflation at ${CPI}% (CPI-U, ${AS_OF}), a raise that only matches it leaves your purchasing power flat. You need a raise above inflation just to stay even. This calculator defaults to the live inflation rate and shows your real, inflation-adjusted raise — not just the nominal one.`,
  },
  {
    icon: "🎯",
    title: "How to negotiate using data",
    body: "Come to salary negotiations with market data (Glassdoor, LinkedIn Salary, Payscale), your contributions over the past year, and a specific number — not a range. Asking for a specific figure anchors the conversation and results in better outcomes on average.",
  },
];

const RELATED_CALCS = [
  {
    title: "Take-Home Pay Calculator",
    description: "See your exact net pay after all deductions.",
    href: "/tools/take-home-pay-calculator",
    icon: "💵",
    accent: "bg-emerald-500/10",
  },
  {
    title: "Hourly to Salary Calculator",
    description: "Convert between hourly rates and annual salary.",
    href: "/tools/hourly-to-salary-calculator",
    icon: "⏱️",
    accent: "bg-blue-500/10",
  },
  {
    title: "Salary Breakdown Calculator",
    description: "See monthly, weekly, and daily breakdown of your salary.",
    href: "/tools/salary-breakdown-calculator",
    icon: "📋",
    accent: "bg-purple-500/10",
  },
  {
    title: "Inflation Calculator",
    description: "See how inflation erodes purchasing power over time.",
    href: "/tools/inflation-calculator",
    icon: "📉",
    accent: "bg-amber-500/10",
  },
];

export default function SalaryIncreaseCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Salary Increase Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description: "Calculate the real value of your salary raise after tax and inflation, including lifetime earnings impact.",
      url: "https://worthulator.com/tools/salary-increase-calculator",
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
        eyebrowIcon="💰"
        eyebrowText="Career · Salary Negotiation"
        title="Salary Increase Calculator"
        description="Find out exactly what your raise is worth — after tax, after inflation, and over your entire career."
        chips={["After-tax monthly increase", "Inflation-adjusted real raise", "Lifetime earnings impact"]}
      >
        <SalaryIncreaseCalculatorLoader />
      </SimpleCalculatorHero>

      <InsightStrip
        text='The workers who negotiate consistently earn over <span class="font-semibold text-gray-900">$1 million more</span> over their careers. One conversation. Compounded for 40 years.'
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="Why your raise is worth more than you think"
        subtitle="Every dollar of raise compounds into much more over a career."
        cards={CONTENT_CARDS}
      />


      <SEOTextBlock
        title="How the Salary Increase Calculator Works"
        formula={`New Salary = Current Salary + Raise Amount

Monthly Increase = Raise Amount / 12

After-Tax Raise = Raise Amount × (1 − Marginal Tax Rate)

Real Raise = Raise Amount / (1 + Inflation Rate) − 1 (approx)

Lifetime Earnings Diff = Σ(Annual salary with raise − without raise) over N years`}
        steps={[
          { label: "Enter your current salary", description: "Your gross annual salary before tax." },
          { label: "Choose raise type", description: "Percentage raise (e.g. 5%) or flat amount (e.g. $5,000)." },
          { label: "Set projection years", description: "How many years to project your career earnings." },
          { label: "Enable compound raises", description: "If raises repeat annually, the lifetime impact multiplies dramatically." },
          { label: "Adjust tax and inflation", description: "Get the real, after-tax, inflation-adjusted value of your raise." },
        ]}
        paragraphs={[
          "Most salary increase calculators only show the immediate dollar amount. This calculator shows what matters: the real inflation-adjusted raise, the monthly take-home increase, and the total lifetime earnings difference.",
          "The compounding effect is the most important insight. Even a 1% higher annual raise, applied repeatedly over 20 years, generates tens of thousands in additional lifetime earnings. Use the 'Compound annual raises' toggle to see this effect clearly.",
        ]}
      />

      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      <RelatedCalcCards
        title="Related Calculators"
        subtitle="Tools to get the full picture of your compensation."
        items={RELATED_CALCS}
      />
    </main>
  );
}
