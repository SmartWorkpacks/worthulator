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
  title: "Latte Factor Calculator 2026 – See What Your Daily Habit Is Worth",
  description:
    "Find out what your daily coffee or snack habit would grow to if invested instead. Enter your daily spend, return rate, and time horizon to see the real cost.",
  keywords: ["latte factor calculator", "daily habit investment calculator", "coffee vs investing", "small spending calculator"],
  alternates: { canonical: "https://worthulator.com/tools/latte-factor" },
};

const FAQS = [
  {
    q: "What is the latte factor?",
    a:
      "The latte factor is a personal finance concept popularized by David Bach. It refers to small, recurring daily expenses — like a $6 coffee — that add up over time. The idea is that redirecting those dollars into investments can build significant wealth through compound interest.",
  },
  {
    q: "How much does a daily $6 coffee cost over 30 years?",
    a:
      "A $6/day habit ($2,190/year) invested at 7% annual return grows to over $220,000 in 30 years. You'd spend only $65,700 in total — meaning you'd earn over $155,000 in compound gains.",
  },
  {
    q: "What return rate should I use?",
    a:
      "The S&P 500 has historically returned ~10% nominal or ~7% inflation-adjusted per year. Using 7% is a conservative and widely accepted assumption for long-term projections.",
  },
  {
    q: "Is this about giving up coffee, or investing more?",
    a:
      "It's not necessarily about giving up anything — it's about awareness. You might choose to keep buying coffee and cut a different expense instead. The goal is to make intentional choices about where your money goes.",
  },
  {
    q: "Does this work for other daily habits?",
    a:
      "Yes — use it for any regular daily or weekly expense: subscription services, cigarettes, energy drinks, takeout lunches, or any recurring habit. The math is the same regardless of what you're spending on.",
  },
];

const STATS = [
  { stat: "$38K", color: "text-emerald-600", accent: "bg-emerald-500", label: "30-year opportunity cost of a $5/day habit invested at 7% annual return" },
  { stat: "$5/day", color: "text-amber-600", accent: "bg-amber-500", label: "the classic latte factor — small daily habits compound dramatically over time" },
  { stat: "10 yrs", color: "text-blue-600", accent: "bg-blue-500", label: "for a single daily habit to cost $18,000+ in lost investment growth" },
];

const CONTENT_CARDS = [
  {
    icon: "☕",
    title: "Small amounts, big results",
    body: "The power of compound interest means that even $3–$5/day invested consistently can grow into tens of thousands of dollars over decades. Time is more important than the amount.",
  },
  {
    icon: "📊",
    title: "The real cost of convenience",
    body: "A $6 latte isn't just $6 — it's also the foregone investment return on that money over your remaining working years. The older you start investing, the higher the opportunity cost.",
  },
  {
    icon: "💡",
    title: "What to do with the savings",
    body: "Consider automating the equivalent amount into an index fund, Roth IRA, or 401(k) each month. Even $100–$200/month invested from your 20s can result in a meaningful retirement nest egg.",
  },
];

const RELATED_CALCS = [
  { title: "Drip Savings Calculator", description: "Track compounding savings from cutting subscriptions.", href: "/tools/drip-calculator", icon: "💧", accent: "bg-blue-500/10" },
  { title: "Compound Interest Calculator", description: "See how any investment grows over time.", href: "/tools/compound-interest-calculator", icon: "📈", accent: "bg-emerald-500/10" },
  { title: "Passive Income Calculator", description: "Plan a portfolio that generates monthly income.", href: "/tools/passive-income-calculator", icon: "💰", accent: "bg-amber-500/10" },
  { title: "Net Worth Calculator", description: "Track your total financial picture.", href: "/tools/net-worth-calculator", icon: "📊", accent: "bg-purple-500/10" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Latte Factor Calculator",
      url: "https://worthulator.com/tools/latte-factor",
      applicationCategory: "FinanceApplication",
      description: "Calculate what your daily spending habit would grow to if invested instead.",
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

export default function LatteFactor() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SimpleCalculatorHero
        eyebrowIcon="☕"
        eyebrowText="Latte Factor"
        title="What Is Your Daily Habit Really Costing You?"
        description="See how much your daily coffee, snack, or subscription would grow if invested instead — with compound interest working in your favour."
        chips={["Daily spend → invested", "30-year projection", "Compound gain shown"]}
      >
        <CalculatorEngineLoader slug="latte-factor" />
      </SimpleCalculatorHero>
      <InsightStrip text="Small daily habits have an outsized long-term cost — or opportunity." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="The real cost of small habits"  cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the Latte Factor Calculator Works"
        paragraphs={[
          "Enter your daily spend amount, expected annual investment return, and number of years. The calculator shows you the future value of investing that money instead, your total actual spending over the period, and the compound growth you would have earned.",
          "The calculation uses the future value of an annuity formula: FV = PMT × ((1 + r)^n − 1) / r, where PMT is annual spending, r is annual return, and n is years.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
