import type { Metadata } from "next";
import AmortizationCalculatorLoader from "./AmortizationCalculatorLoader";
import SimpleCalculatorHero from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import StandardFAQSection from "@/src/templates/take-home-pay/StandardFAQSection";
import {
  StatChipsRow, ContentCardGrid, SEOTextBlock, InsightStrip, RelatedCalcCards,
} from "@/src/templates/take-home-pay/StandardSEOSection";
import { calculateAmortization } from "@/lib/calculators/amortizationEngine";
import { fredBenchmarks } from "@/lib/datasets/finance/fredBenchmarks";

// ─── Live worked example (single source of truth — refreshes with FRED data) ──
// $300k, 30-yr, at the current 30-yr fixed average. Every number in the copy
// below is computed from this so it moves with the weekly rate refresh.
const RATE = fredBenchmarks.mortgage30yr;
const AS_OF = fredBenchmarks.currentPeriodLabel;
const EX_PRINCIPAL = 300_000;
const EX = calculateAmortization({ loanAmount: EX_PRINCIPAL, annualRatePct: RATE, termYears: 30 });
const usd = (n: number) => `$${Math.round(n).toLocaleString()}`;

export const metadata: Metadata = {
  title: "Amortization Calculator 2026 – Monthly Payment & Full Schedule",
  description:
    "See your exact monthly loan payment, total interest, and a year-by-year amortization schedule. Defaults to the live US 30-year mortgage rate; add extra payments to see interest and time saved.",
  keywords: ["amortization calculator", "loan amortization calculator", "mortgage amortization schedule", "monthly payment calculator", "loan payoff calculator"],
  alternates: { canonical: "https://worthulator.com/tools/amortization-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "What is loan amortization?",
    a: "Amortization is how a fixed-rate loan is paid off in equal monthly payments. Each payment is split between interest (charged on the remaining balance) and principal (which reduces the balance). Early on, most of the payment is interest; as the balance falls, more goes to principal. The payment amount stays the same throughout the term.",
  },
  {
    q: "How is my monthly payment calculated?",
    a: `The level payment is M = P × r ÷ (1 − (1 + r)^−n), where P is the loan amount, r is the monthly rate (annual rate ÷ 12), and n is the number of months. For example, a ${usd(EX_PRINCIPAL)} loan at ${RATE}% over 30 years works out to about ${usd(EX.monthlyPayment)} a month in principal and interest (${AS_OF}).`,
  },
  {
    q: "Why do I pay so much interest over the life of the loan?",
    a: `Because interest is charged every month on the balance you still owe, and a 30-year balance is large for a long time. On that ${usd(EX_PRINCIPAL)} loan at ${RATE}%, you'd pay about ${usd(EX.totalInterest)} in interest — roughly ${EX.interestPctOfPrincipal}% of the amount borrowed — for a total of about ${usd(EX.totalPaid)}.`,
  },
  {
    q: "Does paying extra each month really help?",
    a: "Yes — significantly. Any amount above your scheduled payment goes straight to principal, which shrinks the balance faster and removes all the future interest that balance would have generated. Even a small extra amount each month can cut years off the loan and save tens of thousands in interest. Use the extra-payment field to see your exact savings.",
  },
  {
    q: "Does this include taxes, insurance, and PMI?",
    a: "No. This calculator shows principal and interest only — the core amortized payment. For a mortgage, your full monthly cost also includes property tax, homeowners insurance, possibly PMI, and any HOA dues, which are not part of amortization. Add those separately to estimate your true monthly housing cost.",
  },
];

const STATS = [
  { stat: `${RATE}%`, color: "text-violet-600", accent: "bg-violet-500", label: `current US 30-year fixed mortgage average — Freddie Mac via FRED (${AS_OF})` },
  { stat: usd(EX.monthlyPayment), color: "text-blue-600", accent: "bg-blue-500", label: `monthly principal + interest on a ${usd(EX_PRINCIPAL)} loan at ${RATE}% over 30 years (${AS_OF})` },
  { stat: `${EX.interestPctOfPrincipal}%`, color: "text-amber-600", accent: "bg-amber-500", label: `of the amount borrowed is paid again in interest over a 30-year term at today's rate` },
];

const CONTENT_CARDS = [
  {
    icon: "📉",
    title: "Early payments are almost all interest",
    body: "On a new loan, interest is charged on the full balance, so the first years' payments barely dent the principal. The balance curve starts shallow and steepens over time. This is why selling or refinancing early means you've built little equity — and why extra principal payments early have the biggest impact.",
  },
  {
    icon: "💸",
    title: "The true cost of borrowing",
    body: `Interest is the price of time. On a ${usd(EX_PRINCIPAL)} loan at ${RATE}% over 30 years you repay about ${usd(EX.totalPaid)} in total — roughly ${usd(EX.totalInterest)} of it pure interest. A shorter term has a higher monthly payment but dramatically less lifetime interest.`,
  },
  {
    icon: "⚡",
    title: "Extra payments beat the bank's math",
    body: "Every extra dollar of principal erases all the future interest that dollar would have accrued for the rest of the term. That's why even modest extra payments — applied consistently — can shave years off the loan and save a large share of total interest, without refinancing.",
  },
];

const RELATED_CALCS = [
  { title: "Mortgage Calculator", description: "Full monthly housing cost including taxes and insurance.", href: "/tools/mortgage-calculator", icon: "🏠", accent: "bg-emerald-500/10" },
  { title: "Loan Calculator", description: "Model payments on any personal or auto loan.", href: "/tools/loan-calculator", icon: "🏦", accent: "bg-blue-500/10" },
  { title: "Car Loan Calculator", description: "Auto payments with live APR and sales tax.", href: "/tools/car-loan-calculator", icon: "🚗", accent: "bg-violet-500/10" },
  { title: "Compound Interest Calculator", description: "See how savings grow the other direction.", href: "/tools/compound-interest-calculator", icon: "📈", accent: "bg-amber-500/10" },
];

export default function AmortizationCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Amortization Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description: "Calculate your monthly loan payment, total interest, and full amortization schedule, with optional extra payments.",
      url: "https://worthulator.com/tools/amortization-calculator",
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
        eyebrowIcon="🏦"
        eyebrowText="Loans · Mortgages · Payoff"
        title="Amortization Calculator"
        description="See your exact monthly payment, the total interest you'll pay, and a year-by-year breakdown. Defaults to the live 30-year mortgage rate — add extra payments to see how much you'd save."
        chips={["Monthly payment", "Full interest breakdown", "Extra-payment savings"]}
      >
        <AmortizationCalculatorLoader />
      </SimpleCalculatorHero>

      <InsightStrip
        text={`At the current 30-year average of <span class="font-semibold text-gray-900">${RATE}% (${AS_OF})</span>, a ${usd(EX_PRINCIPAL)} loan costs about ${usd(EX.monthlyPayment)}/mo — and roughly ${usd(EX.totalInterest)} in interest over 30 years.`}
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="What an amortization schedule really shows"
        subtitle="The same monthly payment hides a shifting split between interest and principal."
        cards={CONTENT_CARDS}
      />

      <SEOTextBlock
        title="How the Amortization Calculator Works"
        formula={`Monthly Rate (r) = Annual Rate ÷ 12
Number of Payments (n) = Term in Years × 12

Monthly Payment (M) = P × r ÷ (1 − (1 + r)^−n)
  (when r = 0, M = P ÷ n)

Each month:
  Interest  = Remaining Balance × r
  Principal = Payment − Interest
  Balance   = Balance − Principal

Total Interest = (Payment × n) − Principal`}
        steps={[
          { label: "Enter the loan amount", description: "The principal you're borrowing — price minus any down payment." },
          { label: "Set the interest rate", description: `Defaults to the live US 30-year fixed average (${RATE}%, ${AS_OF}); override with your actual APR.` },
          { label: "Choose the term", description: "How many years to repay — 15, 20, and 30 are most common." },
          { label: "Add an optional extra payment", description: "Any amount above the scheduled payment goes straight to principal." },
          { label: "See payment, interest, and schedule", description: "Your monthly payment, lifetime interest, balance curve, and payoff savings." },
        ]}
        paragraphs={[
          "The key insight of amortization is that a fixed payment hides a moving target: early payments are mostly interest, and only later do they shift toward principal. That's why building equity feels slow at first and why extra principal payments early in the loan are so powerful.",
          "Total interest depends heavily on the rate and term. Halving the term roughly raises the monthly payment but cuts lifetime interest dramatically — and any extra monthly payment erases the future interest on the principal it pays down.",
        ]}
      />

      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      <RelatedCalcCards
        title="Related Calculators"
        subtitle="More tools for loans, housing, and growth."
        items={RELATED_CALCS}
      />
    </main>
  );
}
