import type { Metadata } from "next";
import InterestRateCalculatorLoader from "./InterestRateCalculatorLoader";
import SimpleCalculatorHero from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import StandardFAQSection from "@/src/templates/take-home-pay/StandardFAQSection";
import {
  StatChipsRow, ContentCardGrid, SEOTextBlock, InsightStrip, RelatedCalcCards,
} from "@/src/templates/take-home-pay/StandardSEOSection";
import { calculateInterestRate } from "@/lib/calculators/interestRateEngine";

// ─── Worked example (single source of truth) ─────────────────────────────────
// $25k loan, $500/mo, 5 years → solve for the rate.
const EX = calculateInterestRate({ loanAmount: 25_000, monthlyPayment: 500, termYears: 5 });
const usd = (n: number) => `$${Math.round(n).toLocaleString()}`;

export const metadata: Metadata = {
  title: "Interest Rate Calculator – Find the Rate From Your Payment",
  description:
    "Solve for the interest rate on any loan. Enter the loan amount, monthly payment, and term, and we'll calculate the APR hidden in those numbers — plus total interest paid.",
  keywords: ["interest rate calculator", "find interest rate from payment", "calculate interest rate on loan", "implied apr calculator", "reverse loan calculator", "what interest rate am i paying"],
  alternates: { canonical: "https://worthulator.com/tools/interest-rate-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "How do you calculate the interest rate from a monthly payment?",
    a: `There's no simple formula to isolate the rate, so this calculator solves it numerically: it searches for the rate that makes the standard payment equation match your payment. For example, a ${usd(25_000)} loan paid at ${usd(500)}/mo over 5 years implies an APR of about ${EX.annualRatePct}%.`,
  },
  {
    q: "Why would I need to find the interest rate?",
    a: "Sometimes a lender or dealer quotes only a 'low monthly payment' without clearly stating the rate. Reverse-solving for the APR reveals what you're actually paying, so you can compare offers fairly and spot an expensive loan dressed up as an affordable one.",
  },
  {
    q: "What does 'payment too low' mean?",
    a: `If the monthly payment is smaller than the loan divided by the number of months, it can never repay the loan — even at 0% interest. For a ${usd(25_000)} loan over 5 years (60 months), you'd need at least ${usd(25_000 / 60)}/mo just to cover principal. Below that, the balance would grow forever.`,
  },
  {
    q: "Is this the same as APR?",
    a: "It's the nominal annual rate (monthly rate × 12) implied by a simple fixed-rate, fully-amortizing loan. A lender's official APR may differ slightly because it can fold in fees, points, and specific compounding rules required by disclosure laws.",
  },
  {
    q: "Does a lower monthly payment mean a lower interest rate?",
    a: "Not necessarily — it depends on the term. Stretching the same loan over more years lowers the payment but usually raises total interest. For a fixed loan amount and term, though, a higher payment does imply a higher rate, which is what the chart on this page illustrates.",
  },
];

const STATS = [
  { stat: `${EX.annualRatePct}%`, color: "text-violet-600", accent: "bg-violet-500", label: `APR implied by a ${usd(25_000)} loan at ${usd(500)}/mo over 5 years` },
  { stat: usd(EX.totalInterest), color: "text-blue-600", accent: "bg-blue-500", label: `total interest paid over the life of that loan` },
  { stat: `${EX.interestPctOfPrincipal}%`, color: "text-amber-600", accent: "bg-amber-500", label: `interest as a share of the amount borrowed` },
];

const CONTENT_CARDS = [
  {
    icon: "🔍",
    title: "Reverse-engineer the rate",
    body: `Lenders quote payments; this tool reveals the rate behind them. Enter the loan, the monthly payment, and the term, and we solve for the APR — ${EX.annualRatePct}% in the example — so you know exactly what a deal costs.`,
  },
  {
    icon: "🧮",
    title: "Solved, not estimated",
    body: "Because the rate can't be isolated algebraically, the calculator uses a numerical search (bisection) on the payment equation. It converges on the precise rate that reproduces your payment to the cent.",
  },
  {
    icon: "🚩",
    title: "Spot a bad deal",
    body: "A tempting low payment can hide a high rate or a punishingly long term. Seeing the implied APR and the total interest side by side helps you compare offers on equal footing.",
  },
];

const RELATED_CALCS = [
  { title: "Loan Payment Calculator", description: "Go the other way — rate to payment.", href: "/tools/loan-payment-calculator", icon: "💵", accent: "bg-emerald-500/10" },
  { title: "Amortization Calculator", description: "See the full principal/interest schedule.", href: "/tools/amortization-calculator", icon: "📋", accent: "bg-blue-500/10" },
  { title: "APR Calculator", description: "Include fees for the true cost of borrowing.", href: "/tools/apr-calculator", icon: "🏷️", accent: "bg-violet-500/10" },
  { title: "Car Loan Calculator", description: "Check the rate on an auto loan offer.", href: "/tools/car-loan-calculator", icon: "🚗", accent: "bg-amber-500/10" },
];

export default function InterestRateCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Interest Rate Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description: "Solve for the interest rate (APR) on a loan from the loan amount, monthly payment, and term.",
      url: "https://worthulator.com/tools/interest-rate-calculator",
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
        eyebrowIcon="🔍"
        eyebrowText="Loans · Reverse Solver · Implied APR"
        title="Interest Rate Calculator"
        description="Know the payment but not the rate? Enter your loan amount, monthly payment, and term, and we'll solve for the interest rate hidden inside."
        chips={["Implied APR", "Total interest", "Rate-by-payment chart"]}
      >
        <InterestRateCalculatorLoader />
      </SimpleCalculatorHero>

      <InsightStrip
        text={`A ${usd(25_000)} loan at ${usd(500)}/mo for 5 years isn't free money — it works out to about <span class="font-semibold text-gray-900">${EX.annualRatePct}% APR</span> and ${usd(EX.totalInterest)} in interest.`}
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="The rate hiding in your payment"
        subtitle="Lenders advertise payments; this tool exposes the interest rate behind them."
        cards={CONTENT_CARDS}
      />

      <SEOTextBlock
        title="How the Interest Rate Calculator Works"
        formula={`Payment(r) = P · r / (1 − (1 + r)^−n)

Solve for r (the monthly rate) so Payment(r) = your payment,
then APR = r × 12.
  P = loan amount, n = term in months

Solved numerically by bisection — no closed-form solution exists.`}
        steps={[
          { label: "Enter the loan amount", description: "The principal you borrowed." },
          { label: "Enter the monthly payment", description: "What you pay (principal + interest)." },
          { label: "Enter the term", description: "How many years the loan runs." },
          { label: "Solve for the rate", description: "We search for the APR that fits your payment." },
          { label: "Review the cost", description: "Implied APR, total interest, and a rate-by-payment chart." },
        ]}
        paragraphs={[
          `Most loan calculators start with a rate and give you a payment. This one runs in reverse: you already know the payment, and you want the rate. Because the interest rate can't be isolated with algebra, the calculator searches for it numerically — converging on the exact APR that reproduces your payment. A ${usd(25_000)} loan at ${usd(500)}/mo over 5 years, for instance, implies about ${EX.annualRatePct}% APR and ${usd(EX.totalInterest)} of interest.`,
          "This is especially handy when a dealer or lender pushes a monthly payment without clearly disclosing the rate, or when you want to sanity-check an offer. Pair it with the loan payment and APR calculators to see the full picture — payment, rate, and the all-in cost of borrowing including fees.",
        ]}
      />

      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      <RelatedCalcCards
        title="Related Calculators"
        subtitle="More tools for understanding loans."
        items={RELATED_CALCS}
      />
    </main>
  );
}
