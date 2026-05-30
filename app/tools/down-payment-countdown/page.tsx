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
  title: "Down Payment Calculator 2026 – Monthly Savings to Buy a Home",
  description:
    "Find out exactly how much you need to save each month to reach your home down payment goal. Enter the home price, target %, current savings, and timeline.",
  keywords: ["down payment calculator", "home down payment savings", "how much to save for house", "house deposit calculator"],
  alternates: { canonical: "https://worthulator.com/tools/down-payment-countdown" },
};

const FAQS = [
  {
    q: "How much down payment do I need to buy a house?",
    a:
      "It depends on the loan type. Conventional loans typically require 5–20% down. Putting 20% down avoids Private Mortgage Insurance (PMI), which adds ~0.5–1.5%/year to your mortgage. FHA loans allow as little as 3.5% down with a credit score of 580+.",
  },
  {
    q: "Is a 20% down payment always best?",
    a:
      "Not necessarily. A 20% down payment eliminates PMI and gives you a lower monthly payment, but tying up a large sum in a house means you're not investing it elsewhere. With today's high home prices, many buyers opt for 5–10% down and accept PMI.",
  },
  {
    q: "How long does it take to save for a down payment?",
    a:
      "For a median-priced US home (~$400,000) with a 10% down payment, you'd need $40,000. Saving $1,000/month gets you there in ~40 months. Saving $1,500/month gets you there in ~27 months — plus any existing savings help.",
  },
  {
    q: "Should I save in a HYSA for my down payment?",
    a:
      "Yes — a High-Yield Savings Account (HYSA) or money market account is ideal for down payment savings. It keeps your funds liquid, FDIC-insured, and earning 4–5% APY (as of 2025) while you save. Avoid the stock market for money you'll need in under 5 years.",
  },
  {
    q: "What other costs should I budget for beyond the down payment?",
    a:
      "Budget for closing costs (2–5% of loan amount), home inspection ($300–$500), appraisal ($400–$600), moving costs, and an emergency fund for immediate home repairs. Many buyers underestimate how much cash they need beyond just the down payment.",
  },
];

const STATS = [
  { stat: "20%", color: "text-emerald-600", accent: "bg-emerald-500", label: "down payment avoids PMI — saving $100–$200/month on your mortgage" },
  { stat: "3–5%", color: "text-blue-600", accent: "bg-blue-500", label: "minimum down payment required by many conventional loans" },
  { stat: "$25K", color: "text-amber-600", accent: "bg-amber-500", label: "median down payment on US home purchases in 2024" },
];

const CONTENT_CARDS = [
  {
    icon: "🏠",
    title: "Understanding PMI",
    body: "Private Mortgage Insurance is required on most conventional loans with less than 20% down. It typically costs 0.5–1.5% of the loan per year — about $100–$300/month on a $300K loan. Once you hit 20% equity, you can request PMI removal.",
  },
  {
    icon: "💰",
    title: "The right savings vehicle",
    body: "For a down payment 2–5+ years away, a High-Yield Savings Account earning 4–5% APY is usually the right choice. For 5+ years out, some buyers use conservative bond funds. Never put short-term down payment savings in stocks.",
  },
  {
    icon: "📅",
    title: "First-time buyer programs",
    body: "Many states offer down payment assistance programs, grants, or forgivable loans for first-time buyers. The FHA, USDA, and VA loan programs offer low or zero down payment options for qualifying buyers. Research your state's HFA.",
  },
];

const RELATED_CALCS = [
  { title: "Mortgage Calculator", description: "See your monthly payment and total interest.", href: "/tools/mortgage-calculator", icon: "🏦", accent: "bg-emerald-500/10" },
  { title: "Compound Interest Calculator", description: "Grow your down payment savings faster.", href: "/tools/compound-interest-calculator", icon: "📈", accent: "bg-blue-500/10" },
  { title: "Emergency Fund Calculator", description: "Build your financial safety net first.", href: "/tools/emergency-fund-calculator", icon: "🛡️", accent: "bg-amber-500/10" },
  { title: "Net Worth Calculator", description: "Track your full financial picture.", href: "/tools/net-worth-calculator", icon: "📊", accent: "bg-purple-500/10" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Down Payment Countdown Calculator",
      url: "https://worthulator.com/tools/down-payment-countdown",
      applicationCategory: "FinanceApplication",
      description: "Calculate monthly savings needed to hit your home down payment goal.",
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

export default function DownPaymentCountdown() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SimpleCalculatorHero
        eyebrowIcon="🏠"
        eyebrowText="Down Payment Countdown"
        title="How Much Do You Need to Save Each Month for Your Home?"
        description="Enter your target home price, down payment percentage, current savings, and timeline. Get your exact monthly savings target."
        chips={["Any down payment %", "Subtract current savings", "Monthly goal shown"]}
      >
        <CalculatorEngineLoader slug="down-payment-countdown" />
      </SimpleCalculatorHero>
      <InsightStrip text="The typical US first-time buyer takes ~7 years to save their down payment. Here's how to speed that up." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="How to save a down payment faster"  cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the Down Payment Calculator Works"
        paragraphs={[
          "The calculator finds your target down payment (home price × down payment %) then subtracts your current savings to get the remaining gap. That gap is divided by your target number of months to give your required monthly savings amount.",
          "Note: this assumes you're saving in a standard account without investment returns on the savings. If you're earning interest in a HYSA, your real monthly requirement will be slightly lower.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
