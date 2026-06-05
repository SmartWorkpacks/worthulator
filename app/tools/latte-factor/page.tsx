import type { Metadata } from "next";
import LatteFactorWithInsights from "@/components/worthcore/LatteFactorWithInsights";
import SimpleCalculatorHero from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import StandardFAQSection from "@/src/templates/take-home-pay/StandardFAQSection";
import {
  StatChipsRow, ContentCardGrid, SEOTextBlock, InsightStrip, RelatedCalcCards,
} from "@/src/templates/take-home-pay/StandardSEOSection";

export const metadata: Metadata = {
  title: "Latte Factor Calculator 2026 – What Your Daily Habit Is Really Worth",
  description:
    "See what your daily coffee or snack habit would grow to if invested — with real-world frequency and price inflation. Enter your daily spend, days per week, and investment horizon.",
  keywords: ["latte factor calculator", "daily habit investment calculator", "coffee vs investing", "small spending calculator", "opportunity cost calculator"],
  alternates: { canonical: "https://worthulator.com/tools/latte-factor" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "What is the latte factor?",
    a: "The latte factor is a personal finance concept popularized by David Bach. It refers to small, recurring daily expenses — a $6 coffee, a $4 snack, a $3 energy drink — that add up over time. The insight is that redirecting those dollars into investments builds serious wealth through compound interest, even though the daily amount feels trivial.",
  },
  {
    q: "How much does a $6/day weekday coffee habit cost over 30 years?",
    a: "At $6/day, 5 days a week, you spend $1,560 in year 1. With coffee prices rising ~3%/yr, by year 30 it's $3,676/yr. Total spent: ~$74,218. If that same money were invested at 7%/yr instead, it would grow to ~$202,215 — meaning you'd forgo ~$127,997 in compound gains.",
  },
  {
    q: "Why does this calculator include price inflation?",
    a: "Because coffee and food prices go up. The BLS coffee CPI has averaged ~3%/yr over the past decade. A $6 latte today will be ~$8 in 10 years and ~$14 in 30 years. Ignoring this understates both the total spent and the opportunity cost. The growing-annuity formula handles it precisely.",
  },
  {
    q: "Why does days per week matter?",
    a: "Most people buy coffee on workdays (5/week), not 7. Assuming 7 overstates the habit by ~40%. At $6/day: 5 days is $1,560/yr, 7 days is $2,184/yr. That difference compounds over decades — the 7-day assumption would overstate the 30-year invested value by tens of thousands of dollars.",
  },
  {
    q: "Do I have to give up the habit entirely?",
    a: "No — the calculator also shows what happens if you cut the habit in half and invest the rest. At $6/day, investing just $3/day (keeping the other $3 for coffee) grows to ~$101,107 over 30 years at 7%. You keep the habit, you still build wealth.",
  },
];

const STATS = [
  { stat: "$202K",  color: "text-emerald-600", accent: "bg-emerald-500", label: "30-year invested value of a $6/day weekday habit at 7% return with 3%/yr price growth" },
  { stat: "63%",    color: "text-blue-600",    accent: "bg-blue-500",    label: "Of that $202K, 63% is compound growth — you only contributed $74K in cash" },
  { stat: "5 vs 7", color: "text-amber-600",   accent: "bg-amber-500",   label: "Days per week matters — 5 days is ~29% less than 7, compounding over decades" },
];

const CONTENT_CARDS = [
  {
    icon: "📈",
    title: "Compound interest does most of the work",
    body: "At default settings, you contribute ~$74K over 30 years. Compound interest adds ~$128K on top — 63% of the final value. The longer the horizon, the more extreme this ratio becomes. Time is the multiplier.",
  },
  {
    icon: "🔢",
    title: "Frequency is the hidden variable",
    body: "Most latte factor calculators assume 365 days/year. In reality, most coffee purchases happen on workdays. The days-per-week slider lets you model your actual habit — and it makes a 29% difference between 5 and 7 days.",
  },
  {
    icon: "💡",
    title: "Half the habit, half the regret",
    body: "You don't have to go cold turkey. Cutting the habit in half and investing the rest still builds ~$101K over 30 years. The calculator shows this 'invest half' scenario so you can see the middle ground between keeping everything and cutting everything.",
  },
];

const RELATED_CALCS = [
  { title: "Drip Savings Calculator",     description: "Track compounding savings from cutting subscriptions.",   href: "/tools/drip-calculator",              icon: "💧", accent: "bg-blue-500/10" },
  { title: "Future Value Calculator",     description: "See how any lump sum or regular investment grows.",       href: "/tools/future-value",                 icon: "📈", accent: "bg-emerald-500/10" },
  { title: "Subscription Auditor",        description: "Audit all your monthly subscriptions and find savings.", href: "/tools/subscription-auditor",          icon: "💸", accent: "bg-amber-500/10" },
  { title: "Quit Smoking Calculator",     description: "See the financial and health cost of smoking over time.", href: "/tools/quit-smoking",                 icon: "🚭", accent: "bg-violet-500/10" },
];

export default function LatteFactorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Latte Factor Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description: "Calculate what your daily spending habit would grow to if invested instead, with real-world frequency and price inflation.",
      url: "https://worthulator.com/tools/latte-factor",
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
        eyebrowIcon="☕"
        eyebrowText="Finance · Opportunity Cost"
        title="Latte Factor Calculator"
        description="Set your daily spend, how many days a week you buy it, and the annual price increase — then see what investing that money at compound interest would build over time."
        chips={["Days-per-week aware", "Price inflation modeled", "Invest-half scenario"]}
      >
        <LatteFactorWithInsights />
      </SimpleCalculatorHero>

      <InsightStrip
        text='63% of the 30-year value is compound growth — <span class="font-semibold text-gray-900">you only contribute 37% in cash. Time does the heavy lifting.</span>'
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="Why small habits have outsized cost"
        subtitle="Frequency, price inflation, and compound interest make $6/day worth six figures."
        cards={CONTENT_CARDS}
      />

      <SEOTextBlock
        title="How the Latte Factor Calculator Works"
        formula={`Annual Spend (Year 1) = Daily Spend × Days/Week × 52
Annual Spend (Year y) = Year 1 Spend × (1 + Price Growth)^y

Total Spent = Σ Annual Spend for each year

Invested Value (growing annuity FV):
  = Year 1 Spend × [((1 + Return)^Years − (1 + Growth)^Years) / (Return − Growth)]

Compound Gain = Invested Value − Total Spent`}
        steps={[
          { label: "Set your daily spend", description: "The price of one occurrence — a $6 coffee, a $4 snack, a $3 energy drink." },
          { label: "Set days per week", description: "How often you actually do it. Workdays only (5) vs every day (7) is a 29% difference." },
          { label: "Set annual price increase", description: "Coffee CPI averages ~3%/yr. This inflates your spend each year, making the true lifetime cost higher." },
          { label: "Set investment return", description: "The S&P 500 has returned ~7%/yr after inflation over the long run. Adjust up or down based on your risk tolerance." },
          { label: "See the opportunity cost", description: "The gap between total spent and invested value is pure compound growth — money you'd earn just by redirecting the habit." },
        ]}
        paragraphs={[
          "This calculator uses the growing-annuity future value formula, not a flat annuity. That means each year's contribution grows by the price inflation rate — reflecting the fact that your $6 coffee today will cost $6.18 next year and $14+ in 30 years. Both the total spent and the opportunity cost are higher than a naive flat calculation.",
          "The key insight is the growth ratio. At default settings (7% return, 30 years), 63% of the final value is compound growth — you only put in 37% as cash. Over 40 years that ratio shifts even further. This is why starting early matters far more than the daily amount.",
        ]}
      />

      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      <RelatedCalcCards
        title="Related Calculators"
        subtitle="More tools for understanding what your money could be doing."
        items={RELATED_CALCS}
      />
    </main>
  );
}
