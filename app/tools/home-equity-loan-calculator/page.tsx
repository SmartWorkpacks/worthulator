import type { Metadata } from "next";
import HomeEquityLoanCalculatorLoader from "./HomeEquityLoanCalculatorLoader";
import SimpleCalculatorHero from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import StandardFAQSection from "@/src/templates/take-home-pay/StandardFAQSection";
import {
  StatChipsRow, ContentCardGrid, SEOTextBlock, InsightStrip, RelatedCalcCards,
} from "@/src/templates/take-home-pay/StandardSEOSection";
import { calculateHomeEquityLoan, HE_LOAN_SPREAD_OVER_MORTGAGE } from "@/lib/calculators/homeEquityLoanEngine";
import { fredBenchmarks } from "@/lib/datasets/finance/fredBenchmarks";

// ─── Live worked example (single source of truth — refreshes with FRED data) ──
const AS_OF = fredBenchmarks.currentPeriodLabel;
const APR = Math.round((fredBenchmarks.mortgage30yr + HE_LOAN_SPREAD_OVER_MORTGAGE) * 10) / 10;
// $500k home, $250k mortgage, borrow $100k over 15 yrs at the live fixed rate.
const EX = calculateHomeEquityLoan({
  homeValue: 500_000,
  mortgageBalance: 250_000,
  loanAmount: 100_000,
  annualRatePct: APR,
  termYears: 15,
});
const usd = (n: number) => `$${Math.round(n).toLocaleString()}`;

export const metadata: Metadata = {
  title: "Home Equity Loan Calculator 2026 – Fixed Payment & Borrowing Limit",
  description:
    "Calculate your home equity loan: how much you can borrow at an 85% combined loan-to-value cap, your fixed monthly payment, and total interest. Uses the live mortgage rate.",
  keywords: ["home equity loan calculator", "home equity loan payment calculator", "how much can i borrow home equity", "second mortgage calculator", "home equity loan rates"],
  alternates: { canonical: "https://worthulator.com/tools/home-equity-loan-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "How much can I borrow with a home equity loan?",
    a: `Most lenders cap your combined loan-to-value (CLTV) at about 85%. That's 85% of your home's value minus your existing mortgage balance. For example, on a ${usd(500_000)} home with a ${usd(250_000)} mortgage, you could borrow up to about ${usd(EX.maxLoan)} (${AS_OF}).`,
  },
  {
    q: "What's the difference between a home equity loan and a HELOC?",
    a: "A home equity loan is a fixed-rate lump sum you repay in equal monthly payments over a set term — predictable, with no payment shock. A HELOC is a revolving line of credit, usually with a variable rate and an interest-only draw period followed by a larger repayment payment. Choose a home equity loan when you need a known amount up front and want payment certainty.",
  },
  {
    q: "What would the monthly payment be?",
    a: `It depends on the amount, rate, and term. Borrowing ${usd(100_000)} at ${APR}% fixed over 15 years works out to about ${usd(EX.monthlyPayment)}/mo, with roughly ${usd(EX.totalInterest)} in total interest (${AS_OF}). A shorter term raises the payment but cuts the interest sharply.`,
  },
  {
    q: "What can I use a home equity loan for?",
    a: "Common uses are home improvements (interest may be tax-deductible when used to buy, build, or substantially improve the home — check with a tax pro), debt consolidation, or large one-time expenses. Because the loan is secured by your home, rates are usually lower than personal loans or credit cards.",
  },
  {
    q: "What are the risks?",
    a: "Your home is the collateral, so falling behind on payments can lead to foreclosure. You'll also pay closing costs, and borrowing reduces the equity cushion that protects you if home values fall. Borrow only what you can comfortably repay alongside your first mortgage.",
  },
];

const STATS = [
  { stat: `${APR}%`, color: "text-violet-600", accent: "bg-violet-500", label: `est. fixed home equity loan APR — 30-yr mortgage rate + ${HE_LOAN_SPREAD_OVER_MORTGAGE} pts via FRED (${AS_OF})` },
  { stat: usd(EX.maxLoan), color: "text-blue-600", accent: "bg-blue-500", label: `most you could borrow on a ${usd(500_000)} home with a ${usd(250_000)} mortgage at 85% CLTV (${AS_OF})` },
  { stat: usd(EX.monthlyPayment), color: "text-amber-600", accent: "bg-amber-500", label: `fixed payment to borrow ${usd(100_000)} over 15 years at ${APR}% (${AS_OF})` },
];

const CONTENT_CARDS = [
  {
    icon: "🏠",
    title: "Your equity sets the ceiling",
    body: `Lenders typically let your first mortgage plus the home equity loan reach 85% of your home's value. On a ${usd(500_000)} home with ${usd(250_000)} owed, that's about ${usd(EX.maxLoan)} of borrowing room — your ${usd(EX.availableEquity)} of equity, minus the cushion lenders keep.`,
  },
  {
    icon: "🔒",
    title: "Fixed rate, fixed payment",
    body: "A home equity loan locks your rate for the whole term. Your monthly payment never changes, so it's easy to budget and immune to rate hikes — the key advantage over a variable-rate HELOC.",
  },
  {
    icon: "⏱️",
    title: "The term is a big lever",
    body: "A longer term lowers the monthly payment but piles on interest; a shorter term costs more each month but far less overall. The payment-by-term chart shows the trade-off so you can pick a comfortable middle ground.",
  },
];

const RELATED_CALCS = [
  { title: "HELOC Calculator", description: "Compare a revolving line of credit instead.", href: "/tools/heloc-calculator", icon: "🔄", accent: "bg-blue-500/10" },
  { title: "Home Equity Calculator", description: "How much equity do you have right now?", href: "/tools/home-equity-calculator", icon: "🏡", accent: "bg-emerald-500/10" },
  { title: "Mortgage Payoff Calculator", description: "Build equity faster by paying down your mortgage.", href: "/tools/mortgage-payoff-calculator", icon: "✅", accent: "bg-violet-500/10" },
  { title: "Loan Payment Calculator", description: "Compare with an unsecured personal loan.", href: "/tools/loan-payment-calculator", icon: "💵", accent: "bg-amber-500/10" },
];

export default function HomeEquityLoanCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Home Equity Loan Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description: "Calculate how much you can borrow with a home equity loan, your fixed monthly payment, and total interest.",
      url: "https://worthulator.com/tools/home-equity-loan-calculator",
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
        eyebrowText="Home Equity · Fixed-Rate Second Mortgage"
        title="Home Equity Loan Calculator"
        description="See how much you can borrow against your home equity, your fixed monthly payment, and the total interest — a lump sum with a rate that never changes."
        chips={["Borrowing limit (85% CLTV)", "Fixed monthly payment", "Total interest"]}
      >
        <HomeEquityLoanCalculatorLoader />
      </SimpleCalculatorHero>

      <InsightStrip
        text={`A home equity loan is a <span class="font-semibold text-gray-900">fixed-rate lump sum</span> — borrow ${usd(100_000)} at ${APR}% over 15 years and your payment stays ${usd(EX.monthlyPayment)}/mo for the whole term.`}
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="How a home equity loan works"
        subtitle="A second mortgage that turns part of your equity into cash, repaid at a fixed rate."
        cards={CONTENT_CARDS}
      />

      <SEOTextBlock
        title="How the Home Equity Loan Calculator Works"
        formula={`Available equity = Home value − Mortgage balance
Max loan = (Home value × 85%) − Mortgage balance
Combined LTV = (Mortgage balance + Loan) ÷ Home value

Monthly payment (fixed):
M = P · r / (1 − (1 + r)^−n)
  P = loan amount, r = APR ÷ 12, n = term in months`}
        steps={[
          { label: "Enter your home value", description: "Use a recent estimate or appraisal." },
          { label: "Enter your mortgage balance", description: "What you still owe on the first mortgage." },
          { label: "Choose a loan amount", description: "We flag it if it exceeds the 85% CLTV limit." },
          { label: "Set rate and term", description: `Defaults to the live mortgage rate + ${HE_LOAN_SPREAD_OVER_MORTGAGE} pts.` },
          { label: "Review the fixed payment", description: "Plus total interest and a term comparison." },
        ]}
        paragraphs={[
          `A home equity loan converts part of your built-up equity into a one-time lump sum, secured by your house as a second mortgage. Because it's collateralized, rates are typically well below credit cards or personal loans — in this example about ${APR}% (the live 30-year mortgage rate plus a ${HE_LOAN_SPREAD_OVER_MORTGAGE}-point spread, ${AS_OF}).`,
          "The defining feature is certainty: a fixed rate and a fixed payment for the entire term. If you want predictable budgeting and a known borrowing amount, a home equity loan usually beats a variable-rate HELOC. If you'd rather draw funds as needed over time, compare with the HELOC calculator instead.",
        ]}
      />

      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      <RelatedCalcCards
        title="Related Calculators"
        subtitle="More ways to tap and track your home equity."
        items={RELATED_CALCS}
      />
    </main>
  );
}
