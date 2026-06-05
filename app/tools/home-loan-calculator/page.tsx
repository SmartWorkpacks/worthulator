import type { Metadata } from "next";
import HomeLoanCalculatorLoader from "./HomeLoanCalculatorLoader";
import SimpleCalculatorHero from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import StandardFAQSection from "@/src/templates/take-home-pay/StandardFAQSection";
import {
  StatChipsRow, ContentCardGrid, SEOTextBlock, InsightStrip, RelatedCalcCards,
} from "@/src/templates/take-home-pay/StandardSEOSection";
import { calculateHomeLoan } from "@/lib/calculators/homeLoanEngine";
import { fredBenchmarks } from "@/lib/datasets/finance/fredBenchmarks";

// ─── Live worked example (single source of truth — refreshes with FRED data) ──
const RATE = fredBenchmarks.mortgage30yr;
const AS_OF = fredBenchmarks.currentPeriodLabel;
const EX_PRICE = 400_000;
const EX = calculateHomeLoan({ homePrice: EX_PRICE, downPaymentPct: 20, annualRatePct: RATE, termYears: 30 });
const usd = (n: number) => `$${Math.round(n).toLocaleString()}`;

export const metadata: Metadata = {
  title: "Home Loan Calculator 2026 – Payment, True Cost & Equity Build-Up",
  description:
    "See your monthly home-loan payment, the true total cost of the home over the loan, and how your equity builds year by year. Uses the live US 30-year mortgage rate.",
  keywords: ["home loan calculator", "house loan calculator", "home loan payment", "home loan interest calculator", "home loan equity calculator"],
  alternates: { canonical: "https://worthulator.com/tools/home-loan-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "What does a home loan actually cost over its full term?",
    a: `Far more than the price tag. A ${usd(EX_PRICE)} home with 20% down at ${RATE}% over 30 years costs about ${usd(EX.totalCost)} in total — the ${usd(EX_PRICE)} price plus roughly ${usd(EX.totalInterest)} of interest (${AS_OF}). That interest is about ${EX.interestPctOfPrice}% of the home's price.`,
  },
  {
    q: "What is home equity and how does it build?",
    a: `Equity is the share of the home you actually own — its value minus your remaining loan balance. You start with your down payment as equity, then build more with every payment. It grows slowly at first because early payments are mostly interest: on the ${usd(EX_PRICE)} example it takes about ${EX.yearsTo50Equity} years to reach 50% equity from a 20% down payment.`,
  },
  {
    q: "How much is the monthly payment?",
    a: `On that ${usd(EX_PRICE)} example (${usd(EX.loanAmount)} financed after 20% down) at ${RATE}%, principal and interest is about ${usd(EX.monthlyPI)}/mo. Property tax, insurance, and PMI are extra — use the Mortgage Payment Calculator for your full monthly cost.`,
  },
  {
    q: "Does a bigger down payment or extra payments help?",
    a: "Both build equity faster and cut total interest. A larger down payment means a smaller loan and less interest overall (and avoids PMI at 20%). Extra monthly payments go straight to principal, removing future interest and bringing your payoff — and full ownership — years closer.",
  },
  {
    q: "Is this the same as a mortgage calculator?",
    a: "It's a focused view of one. This tool emphasises the loan's lifetime cost and your equity build-up over time. For the full monthly payment with taxes, insurance and PMI, use the Mortgage Payment Calculator; for the month-by-month split, use the Amortization Calculator.",
  },
];

const STATS = [
  { stat: `${RATE}%`, color: "text-violet-600", accent: "bg-violet-500", label: `current US 30-year fixed mortgage average — Freddie Mac via FRED (${AS_OF})` },
  { stat: usd(EX.totalCost), color: "text-blue-600", accent: "bg-blue-500", label: `true total cost of a ${usd(EX_PRICE)} home, 20% down, at ${RATE}% over 30 years (${AS_OF})` },
  { stat: `${EX.interestPctOfPrice}%`, color: "text-amber-600", accent: "bg-amber-500", label: `of the home's price is paid again in interest over a 30-year loan at today's rate` },
];

const CONTENT_CARDS = [
  {
    icon: "🏷️",
    title: "The price is not the cost",
    body: `A ${usd(EX_PRICE)} home financed at ${RATE}% over 30 years really costs about ${usd(EX.totalCost)} once interest is included — roughly ${usd(EX.totalInterest)} extra. Knowing the lifetime cost reframes the trade-offs between price, rate, term, and down payment.`,
  },
  {
    icon: "📈",
    title: "Equity builds slowly, then fast",
    body: `Because early payments are mostly interest, ownership grows slowly at the start — it takes around ${EX.yearsTo50Equity} years to own half this home from a 20% down payment. The equity curve makes that S-shape visible and shows why early extra payments are so powerful.`,
  },
  {
    icon: "⚡",
    title: "Down payment and extra payments compound",
    body: "More money down shrinks the loan and the interest on it; extra monthly payments cancel future interest and accelerate equity. Together they can turn a 30-year loan into full ownership years sooner — without changing your rate.",
  },
];

const RELATED_CALCS = [
  { title: "Mortgage Payment Calculator", description: "Full monthly PITI with tax, insurance & PMI.", href: "/tools/mortgage-payment-calculator", icon: "🏠", accent: "bg-emerald-500/10" },
  { title: "Amortization Calculator", description: "The month-by-month principal/interest schedule.", href: "/tools/amortization-calculator", icon: "📉", accent: "bg-blue-500/10" },
  { title: "House Affordability Calculator", description: "How much home your income can support.", href: "/tools/house-affordability-calculator", icon: "💰", accent: "bg-violet-500/10" },
  { title: "Home Equity Calculator", description: "How much equity you can tap today.", href: "/tools/home-equity-calculator", icon: "🔑", accent: "bg-amber-500/10" },
];

export default function HomeLoanCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Home Loan Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description: "Calculate your home-loan monthly payment, the true total cost over the loan, and your equity build-up over time, using the live 30-year mortgage rate.",
      url: "https://worthulator.com/tools/home-loan-calculator",
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
        eyebrowIcon="🏡"
        eyebrowText="Home Loans · True Cost · Equity"
        title="Home Loan Calculator"
        description="See the real cost of your home loan — the monthly payment, the total you'll pay over the life of the loan, and how your equity grows year by year. Defaults to the live 30-year rate."
        chips={["Monthly payment", "True lifetime cost", "Equity build-up"]}
      >
        <HomeLoanCalculatorLoader />
      </SimpleCalculatorHero>

      <InsightStrip
        text={`At ${RATE}% (${AS_OF}), a <span class="font-semibold text-gray-900">${usd(EX_PRICE)} home really costs about ${usd(EX.totalCost)}</span> over a 30-year loan — roughly ${usd(EX.totalInterest)} of it pure interest.`}
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="What your home loan really costs — and what you really own"
        subtitle="Look past the monthly payment to the lifetime cost and the equity you build."
        cards={CONTENT_CARDS}
      />

      <SEOTextBlock
        title="How the Home Loan Calculator Works"
        formula={`Loan Amount = Home Price − Down Payment
Monthly P&I = L × r ÷ (1 − (1 + r)^−n)   (r = rate/12, n = years × 12)

Total of Payments = Monthly P&I × n
True Total Cost   = Down Payment + Total of Payments  (= Price + Interest)
Equity (year)     = Home Price − Remaining Balance`}
        steps={[
          { label: "Enter the home price", description: "The purchase price you're financing." },
          { label: "Set your down payment", description: "Day-one equity — and a smaller down payment means more interest." },
          { label: "Set rate and term", description: `Rate defaults to the live 30-year average (${RATE}%, ${AS_OF}); use your quote.` },
          { label: "Add optional extra payments", description: "Straight to principal — builds equity and cuts interest fast." },
          { label: "See cost and equity", description: "Monthly payment, true lifetime cost, and your equity curve over the years." },
        ]}
        paragraphs={[
          "Buyers naturally focus on price and monthly payment, but the number that matters most over decades is the true total cost — price plus all the interest. At today's rates, interest can rival a large fraction of the home's price, which is why rate and term decisions are worth thousands.",
          "Equity tells the other half of the story. Because amortization front-loads interest, ownership grows slowly at first and accelerates later. Seeing the equity curve — and how a bigger down payment or extra payments steepen it — makes the long-term payoff of those choices concrete.",
        ]}
      />

      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      <RelatedCalcCards
        title="Related Calculators"
        subtitle="More tools for buying and owning a home."
        items={RELATED_CALCS}
      />
    </main>
  );
}
