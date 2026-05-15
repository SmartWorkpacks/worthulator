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
  title: "Closing Cost Calculator 2026 – Estimate What You'll Pay at Closing",
  description:
    "Estimate your home closing costs instantly. Enter the purchase price and choose a percentage to see your estimated closing costs and a low-to-high range.",
  keywords: ["closing cost calculator", "how much are closing costs", "home closing costs estimator", "closing costs percentage", "what are typical closing costs"],
  alternates: { canonical: "https://worthulator.com/tools/closing-cost-calculator" },
};

const FAQS = [
  {
    q: "What are typical closing costs when buying a home?",
    a: "Closing costs typically range from 2% to 5% of the home purchase price. On a $350,000 home that is $7,000–$17,500. The exact amount depends on your location, loan type, lender fees, and whether you negotiate seller concessions. Some costs are fixed fees while others scale with the loan amount.",
  },
  {
    q: "What is included in closing costs?",
    a: "Closing costs cover: lender origination fees (0.5–1%), appraisal ($300–$700), title search and insurance ($500–$2,000), attorney fees (in some states), prepaid interest, property tax escrow, homeowners insurance prepayment, recording fees, and transfer taxes. The exact list varies by state and lender.",
  },
  {
    q: "Can closing costs be rolled into the mortgage?",
    a: "In some cases yes — this is called a 'no-closing-cost mortgage' where the lender covers upfront costs in exchange for a slightly higher interest rate. You can also ask for seller concessions (the seller pays your closing costs) up to IRS limits. Rolling costs into the loan increases your balance and long-term interest paid.",
  },
  {
    q: "Who pays closing costs — buyer or seller?",
    a: "Buyers typically pay 2–5% in closing costs. Sellers typically pay 6–10% of the sale price (including real estate agent commissions of 5–6%). In a buyer's market, sellers sometimes offer to cover part of the buyer's closing costs as an incentive. This is negotiated in the purchase contract.",
  },
  {
    q: "How far in advance should I save for closing costs?",
    a: "Lenders require closing funds to be 'seasoned' — typically sitting in your account for at least 60 days before closing. Budget your closing costs savings separately from your down payment. On a $350,000 home with a 20% down payment, you may need $70,000 for the down payment plus $7,000–$17,500 in closing costs.",
  },
];

const STATS = [
  { stat: "2–5%",   color: "text-emerald-600", accent: "bg-emerald-500", label: "typical buyer closing cost range as a percentage of purchase price" },
  { stat: "$7,800", color: "text-amber-600",   accent: "bg-amber-500",   label: "average closing costs paid by buyers in the US on a median-priced home" },
  { stat: "60+",    color: "text-blue-600",    accent: "bg-blue-500",    label: "days funds should be seasoned in your account before closing" },
];

const CONTENT_CARDS = [
  {
    icon: "📋",
    title: "Budget for closing costs separately",
    body: "Many first-time buyers focus all their savings on the down payment and forget about closing costs — then scramble at the last minute. Closing costs are separate from your down payment and must be paid in cash (or financed into the loan). Budget for both from the start of your home-buying savings plan.",
  },
  {
    icon: "🗺️",
    title: "Closing costs vary significantly by state",
    body: "States like New York and New Jersey have transfer taxes that can add 1–2% alone. Texas and Florida buyers pay less in transfer taxes. Attorney requirements vary too — some states require a real estate attorney at closing, adding $500–$1,500. Research your specific state's costs before settling on a budget.",
  },
  {
    icon: "🤝",
    title: "Negotiate your closing costs",
    body: "Closing costs are not fixed. You can shop around for title insurance (rates vary by company), negotiate lender origination fees, ask the seller for concessions, and compare loan estimates from multiple lenders. Getting three competing loan estimates can save $1,000–$3,000 in fees on a typical purchase.",
  },
];

const RELATED_CALCS = [
  { title: "House Affordability Calculator",   description: "Find the maximum home price you can afford.",    href: "/tools/house-affordability-calculator", icon: "🏠", accent: "bg-emerald-500/10" },
  { title: "Mortgage Calculator",              description: "Calculate your monthly mortgage payment.",       href: "/tools/mortgage-calculator",            icon: "🏦", accent: "bg-blue-500/10"    },
  { title: "Down Payment Calculator",          description: "Plan how long to save your down payment.",      href: "/tools/down-payment-countdown",         icon: "🎯", accent: "bg-amber-500/10"   },
  { title: "Rent vs Buy Calculator",           description: "Is buying actually cheaper than renting?",      href: "/tools/rent-vs-buy-calculator",         icon: "⚖️", accent: "bg-pink-500/10"    },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Closing Cost Calculator",
      url: "https://worthulator.com/tools/closing-cost-calculator",
      applicationCategory: "FinanceApplication",
      description: "Estimate home closing costs as a percentage of purchase price, with a low-to-high range to plan your budget.",
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

export default function ClosingCostCalculator() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SimpleCalculatorHero
        eyebrowIcon="📋"
        eyebrowText="Home Buying · Closing"
        title="Estimate Your Home Closing Costs"
        description="Enter the home purchase price and a closing cost percentage to instantly see your estimated closing costs and a realistic low-to-high range."
        chips={["Estimated closing costs", "Low estimate", "High estimate"]}
      >
        <CalculatorEngineLoader slug="closing-cost-calculator" />
      </SimpleCalculatorHero>
      <InsightStrip text="Closing costs catch many first-time buyers off guard — budget 2–5% of the purchase price on top of your down payment." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="What to know before closing day" cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the Closing Cost Calculator Works"
        paragraphs={[
          "Enter the home purchase price and your expected closing cost percentage (typically 2–5%). The calculator multiplies these to give you a central estimate. It then shows a low estimate at −20% of that figure and a high estimate at +20%, giving you a realistic planning range to account for variation in state taxes, lender fees, and negotiated concessions.",
          "Use 2–3% for a conservative estimate if you are in a low-tax state with a straightforward conventional loan. Use 4–5% if you are in a higher-tax state, using an FHA or VA loan, or if you have not yet compared lender fees. Your lender is required to provide a Loan Estimate within 3 business days of your application, which will give you the most accurate figure.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
