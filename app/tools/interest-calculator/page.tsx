import type { Metadata } from "next";
import InterestCalculatorLoader from "./InterestCalculatorLoader";
import { calculateInterest } from "@/lib/calculators/interestEngine";
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
  title: "Interest Calculator - Simple & Compound Interest with Contributions",
  description:
    "Calculate simple or compound interest on any balance. Add monthly contributions, choose your compounding frequency, and see the final balance, total interest, and growth year by year.",
  keywords: [
    "interest calculator",
    "compound interest calculator",
    "simple interest calculator",
    "savings interest calculator",
    "investment growth calculator",
  ],
  alternates: { canonical: "https://worthulator.com/tools/interest-calculator" },
  robots: { index: true, follow: true },
};

// Deterministic worked examples computed at build from the engine.
const EX = calculateInterest({
  mode: "compound",
  principal: 10_000,
  annualRatePct: 5,
  years: 10,
  compounding: "monthly",
  monthlyContribution: 0,
});
const EX_PMT = calculateInterest({
  mode: "compound",
  principal: 10_000,
  annualRatePct: 5,
  years: 10,
  compounding: "monthly",
  monthlyContribution: 200,
});
const EX_SIMPLE = calculateInterest({
  mode: "simple",
  principal: 10_000,
  annualRatePct: 5,
  years: 10,
  compounding: "monthly",
  monthlyContribution: 0,
});

const money = (n: number) => `$${Math.round(n).toLocaleString()}`;

const FAQS = [
  {
    q: "What is the difference between simple and compound interest?",
    a: `Simple interest is paid only on your original deposits. Compound interest is paid on your balance, including interest already earned, so it grows faster. On ${money(10_000)} at 5% for 10 years, simple interest yields ${money(EX_SIMPLE.finalBalance)} but monthly compounding yields ${money(EX.finalBalance)} — a difference of ${money(EX.finalBalance - EX_SIMPLE.finalBalance)}.`,
  },
  {
    q: "How does compounding frequency affect my return?",
    a: `More frequent compounding means interest is added to your balance sooner, so it earns interest faster. A 5% nominal rate compounded monthly produces an effective annual yield (APY) of ${EX.effectiveAnnualRatePct}% — slightly above the headline rate.`,
  },
  {
    q: "How much do monthly contributions add?",
    a: `Adding ${money(200)} a month to the ${money(10_000)} starting balance (5%, 10 years, monthly compounding) grows it to ${money(EX_PMT.finalBalance)} versus ${money(EX.finalBalance)} with no contributions — and lifts total interest to ${money(EX_PMT.totalInterest)}.`,
  },
  {
    q: "What is APY and how is it different from the interest rate?",
    a: `APY (annual percentage yield) is the real yearly return once compounding is included. The nominal rate is the headline figure before compounding. For 5% compounded monthly, the APY is ${EX.effectiveAnnualRatePct}%. Simple interest has no compounding, so its APY equals the nominal rate.`,
  },
  {
    q: "Is the interest rate a live market rate?",
    a: `No — you enter the rate yourself, so the calculator works for any savings account, CD, bond, or investment assumption. It is a planning tool; actual returns depend on your specific product and may vary.`,
  },
];

const STATS = [
  {
    stat: money(EX.finalBalance),
    color: "text-emerald-600",
    accent: "bg-emerald-500",
    label: `${money(10_000)} at 5% compounded monthly for 10 years`,
  },
  {
    stat: `${EX.effectiveAnnualRatePct}% APY`,
    color: "text-blue-600",
    accent: "bg-blue-500",
    label: "Effective annual yield of a 5% nominal rate compounded monthly",
  },
  {
    stat: money(EX.totalInterest),
    color: "text-amber-600",
    accent: "bg-amber-500",
    label: "Interest earned in that example — pure growth on top of deposits",
  },
];

const CONTENT_CARDS = [
  {
    icon: "📈",
    title: "Compounding is interest on interest",
    body: "Each period, interest is added to your balance and the next period's interest is calculated on the larger total. Over years, this snowball is what separates compound from simple growth.",
  },
  {
    icon: "🔁",
    title: "Small contributions compound too",
    body: "Adding a fixed amount each month is one of the most reliable ways to grow a balance. Every deposit starts earning its own interest from the moment it lands.",
  },
  {
    icon: "⏳",
    title: "Time matters more than rate",
    body: "Because growth compounds, the number of years often moves the final balance more than a small change in rate. Starting earlier usually beats chasing a slightly higher return.",
  },
];

const RELATED_CALCS = [
  {
    title: "CD Calculator",
    description: "Project a certificate of deposit to maturity.",
    href: "/tools/cd-calculator",
    icon: "🏦",
    accent: "bg-blue-500/10",
  },
  {
    title: "APY Calculator",
    description: "Convert a nominal rate into effective annual yield.",
    href: "/tools/apy-calculator",
    icon: "📊",
    accent: "bg-emerald-500/10",
  },
  {
    title: "Savings Account Calculator",
    description: "Grow a savings balance with regular deposits.",
    href: "/tools/savings-account-calculator",
    icon: "💰",
    accent: "bg-amber-500/10",
  },
  {
    title: "Dividend Calculator",
    description: "Estimate income and growth from dividend stocks.",
    href: "/tools/dividend-calculator",
    icon: "💵",
    accent: "bg-violet-500/10",
  },
];

export default function InterestCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Interest Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description:
        "Calculate simple or compound interest with optional monthly contributions and any compounding frequency.",
      url: "https://worthulator.com/tools/interest-calculator",
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
        eyebrowIcon="📈"
        eyebrowText="Finance · Interest & Growth"
        title="Interest Calculator"
        description="See how a balance grows with simple or compound interest, any compounding frequency, and optional monthly contributions — with the final balance, total interest, and a year-by-year curve."
        chips={["Simple & compound", "Any compounding", "Monthly contributions"]}
      >
        <InterestCalculatorLoader />
      </SimpleCalculatorHero>

      <InsightStrip
        text={`${money(10_000)} at 5% compounded monthly for 10 years grows to <span class="font-semibold text-gray-900">${money(EX.finalBalance)}</span> — ${money(EX.totalInterest)} of it interest, an effective ${EX.effectiveAnnualRatePct}% APY.`}
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="Why compound interest builds wealth"
        subtitle="Three forces — compounding, contributions, and time — drive the final number."
        cards={CONTENT_CARDS}
      />

      <SEOTextBlock
        title="How the Interest Calculator Works"
        formula={`Compound:
  monthlyRate = (1 + rate ÷ n)^(n ÷ 12) − 1
  balance     = balance × (1 + monthlyRate) + contribution

Simple:
  interest   += deposits × (rate ÷ 12)   each month
  balance     = deposits + interest

final balance  = principal + contributions + interest
total interest = final balance − total deposited
APY            = (1 + monthlyRate)^12 − 1`}
        steps={[
          { label: "Choose simple or compound", description: "Compound pays interest on interest; simple pays only on deposits." },
          { label: "Enter your balance, rate, and term", description: "The rate is yours to set — use any savings, CD, or investment assumption." },
          { label: "Pick a compounding frequency", description: "Annually through daily; more frequent compounding raises the effective yield." },
          { label: "Add optional contributions", description: "A recurring monthly deposit compounds alongside the starting balance." },
          { label: "Review the growth curve", description: "See the final balance, total interest, APY, and a year-by-year schedule." },
        ]}
        paragraphs={[
          "This is a planning model that assumes a constant rate and end-of-month contributions. Real accounts can change rates, charge fees, or tax interest, all of which affect your actual return.",
          "Compound interest works for you when you are saving and against you when you are borrowing — the same math drives loan and credit-card balances, just in reverse.",
        ]}
      />

      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      <RelatedCalcCards
        title="Related Calculators"
        subtitle="Pair this with adjacent savings and growth tools."
        items={RELATED_CALCS}
      />
    </main>
  );
}
