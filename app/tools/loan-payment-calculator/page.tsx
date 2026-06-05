import type { Metadata } from "next";
import LoanPaymentCalculatorLoader from "./LoanPaymentCalculatorLoader";
import SimpleCalculatorHero from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import StandardFAQSection from "@/src/templates/take-home-pay/StandardFAQSection";
import {
  StatChipsRow, ContentCardGrid, SEOTextBlock, InsightStrip, RelatedCalcCards,
} from "@/src/templates/take-home-pay/StandardSEOSection";
import { calculateLoanPayment } from "@/lib/calculators/loanPaymentEngine";
import {
  fredBenchmarks,
  getAutoLoanNewAPR,
} from "@/lib/datasets/finance/fredBenchmarks";

// ─── Live worked examples (single source of truth — refresh with FRED data) ───
const AS_OF = fredBenchmarks.currentPeriodLabel;
const PERSONAL_RATE = fredBenchmarks.personalLoan24moAPR;
const AUTO_RATE = getAutoLoanNewAPR();
// $25k personal loan, 5-yr, at the live personal-loan average.
const EX = calculateLoanPayment({ loanAmount: 25_000, annualRatePct: PERSONAL_RATE, termYears: 5 });
// Same loan over 3 years, to quantify the term trade-off in copy.
const EX_3Y = calculateLoanPayment({ loanAmount: 25_000, annualRatePct: PERSONAL_RATE, termYears: 3 });
const usd = (n: number) => `$${Math.round(n).toLocaleString()}`;

export const metadata: Metadata = {
  title: "Loan Payment Calculator 2026 – Monthly Payment & Total Interest",
  description:
    "Calculate the monthly payment, total interest, and payoff for any loan — personal, auto, or mortgage. Uses live US average rates by loan type and compares term lengths side by side.",
  keywords: ["loan payment calculator", "monthly loan payment", "personal loan calculator", "auto loan payment", "loan interest calculator"],
  alternates: { canonical: "https://worthulator.com/tools/loan-payment-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "How is a loan payment calculated?",
    a: `A fixed loan uses the level-payment formula: M = P × r ÷ (1 − (1 + r)^−n), where P is the amount borrowed, r is the monthly rate (APR ÷ 12), and n is the number of months. For example, a ${usd(25_000)} personal loan at ${PERSONAL_RATE}% over 5 years is about ${usd(EX.monthlyPayment)}/mo (${AS_OF}).`,
  },
  {
    q: "How much total interest will I pay?",
    a: `It depends on the rate and term. On that ${usd(25_000)} loan at ${PERSONAL_RATE}% over 5 years you'd pay about ${usd(EX.totalInterest)} in interest — roughly ${EX.interestPctOfPrincipal}% on top of what you borrowed, for a total of ${usd(EX.totalPaid)}.`,
  },
  {
    q: "Should I choose a shorter or longer loan term?",
    a: `A longer term lowers the monthly payment but costs far more in interest. The same ${usd(25_000)} loan over 3 years instead of 5 is about ${usd(EX_3Y.monthlyPayment)}/mo (higher) but only ${usd(EX_3Y.totalInterest)} in interest — saving roughly ${usd(EX.totalInterest - EX_3Y.totalInterest)} versus the 5-year term. The payment-by-term chart shows the full trade-off.`,
  },
  {
    q: "What APR should I use?",
    a: `Use the rate you've actually been quoted. As a starting point, this calculator loads current US averages by loan type — about ${PERSONAL_RATE}% for personal loans and ${AUTO_RATE}% for new auto loans (${AS_OF}, FRED). Your real rate depends on credit score, term, and lender.`,
  },
  {
    q: "Does paying extra each month help?",
    a: "Yes. Extra payments go straight to principal, which removes the future interest that balance would have generated — so you pay less overall and clear the loan sooner. Check the APR isn't variable and that there's no prepayment penalty first.",
  },
];

const STATS = [
  { stat: `${PERSONAL_RATE}%`, color: "text-violet-600", accent: "bg-violet-500", label: `current US personal-loan average APR — FRED commercial-bank data (${AS_OF})` },
  { stat: usd(EX.monthlyPayment), color: "text-blue-600", accent: "bg-blue-500", label: `monthly payment on a ${usd(25_000)} personal loan at ${PERSONAL_RATE}% over 5 years (${AS_OF})` },
  { stat: `${EX.interestPctOfPrincipal}%`, color: "text-amber-600", accent: "bg-amber-500", label: `of the amount borrowed is paid again in interest on that 5-year loan` },
];

const CONTENT_CARDS = [
  {
    icon: "📅",
    title: "Term length is the biggest lever",
    body: `Stretching a loan lowers the monthly payment but quietly inflates the total cost. On a ${usd(25_000)} loan, moving from 3 to 5 years drops the payment but adds about ${usd(EX.totalInterest - EX_3Y.totalInterest)} in interest. Pick the shortest term you can comfortably afford.`,
  },
  {
    icon: "🏦",
    title: "Rates vary a lot by loan type",
    body: `Lenders price risk differently: personal loans average around ${PERSONAL_RATE}% while secured new-auto loans are nearer ${AUTO_RATE}% (${AS_OF}). The loan-type presets load the current average so you start from a realistic number, then you set your actual quote.`,
  },
  {
    icon: "⚡",
    title: "Extra payments beat the schedule",
    body: "Every dollar above the scheduled payment reduces principal and cancels all the future interest on it. Consistent extra payments can shave months off the term — just confirm your loan has no prepayment penalty and isn't a variable-rate product.",
  },
];

const RELATED_CALCS = [
  { title: "Amortization Calculator", description: "See the full principal-vs-interest schedule.", href: "/tools/amortization-calculator", icon: "📉", accent: "bg-emerald-500/10" },
  { title: "Car Loan Calculator", description: "Auto payments with live APR and sales tax.", href: "/tools/car-loan-calculator", icon: "🚗", accent: "bg-blue-500/10" },
  { title: "Mortgage Payment Calculator", description: "Full PITI payment for a home loan.", href: "/tools/mortgage-payment-calculator", icon: "🏠", accent: "bg-violet-500/10" },
  { title: "Credit Card Payoff Calculator", description: "How fast can you clear a card balance?", href: "/tools/credit-card-payoff-calculator", icon: "💳", accent: "bg-amber-500/10" },
];

export default function LoanPaymentCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Loan Payment Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description: "Calculate the monthly payment, total interest, and payoff for any fixed-rate loan, with live average rates by loan type and a term-length comparison.",
      url: "https://worthulator.com/tools/loan-payment-calculator",
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
        eyebrowText="Loans · Payments · Interest"
        title="Loan Payment Calculator"
        description="Find the monthly payment and true total cost of any loan — personal, auto, or mortgage. Starts from the current average rate for your loan type and compares term lengths side by side."
        chips={["Monthly payment", "Total interest", "Term comparison"]}
      >
        <LoanPaymentCalculatorLoader />
      </SimpleCalculatorHero>

      <InsightStrip
        text={`A <span class="font-semibold text-gray-900">${usd(25_000)} personal loan at ${PERSONAL_RATE}% (${AS_OF})</span> over 5 years runs about ${usd(EX.monthlyPayment)}/mo — and ${usd(EX.totalInterest)} of it is pure interest.`}
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="Know the real cost before you sign"
        subtitle="The monthly payment is only half the story — term length and rate decide what the loan actually costs."
        cards={CONTENT_CARDS}
      />

      <SEOTextBlock
        title="How the Loan Payment Calculator Works"
        formula={`Monthly Rate (r) = APR ÷ 12
Number of Payments (n) = Term in Years × 12

Monthly Payment (M) = P × r ÷ (1 − (1 + r)^−n)
  (when r = 0, M = P ÷ n)

Total Paid     = M × n
Total Interest = Total Paid − Principal`}
        steps={[
          { label: "Pick a loan type", description: `Presets load the current US average APR (e.g. ${PERSONAL_RATE}% personal, ${AUTO_RATE}% new auto, ${AS_OF}).` },
          { label: "Enter the amount", description: "How much you're borrowing." },
          { label: "Set rate and term", description: "Use your quoted APR; the term is the biggest cost lever." },
          { label: "Add an optional extra payment", description: "Anything above the scheduled payment cuts principal directly." },
          { label: "Compare and decide", description: "See the payment, total interest, and how it changes across term lengths." },
        ]}
        paragraphs={[
          "The single most important decision in a loan is the term. A longer term feels cheaper because the monthly payment is lower, but you pay interest for more months on a larger average balance — so the lifetime cost climbs sharply. The payment-by-term view makes that trade-off explicit.",
          "Because rates vary widely by loan type and credit, the calculator seeds a realistic current average for the type you pick, then lets you replace it with your actual quote for an exact payment and total cost of credit.",
        ]}
      />

      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      <RelatedCalcCards
        title="Related Calculators"
        subtitle="More tools for borrowing and payoff."
        items={RELATED_CALCS}
      />
    </main>
  );
}
