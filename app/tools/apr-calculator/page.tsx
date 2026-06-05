import type { Metadata } from "next";
import AprCalculatorLoader from "./AprCalculatorLoader";
import SimpleCalculatorHero from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import StandardFAQSection from "@/src/templates/take-home-pay/StandardFAQSection";
import {
  StatChipsRow, ContentCardGrid, SEOTextBlock, InsightStrip, RelatedCalcCards,
} from "@/src/templates/take-home-pay/StandardSEOSection";
import { calculateApr } from "@/lib/calculators/aprEngine";
import { fredBenchmarks } from "@/lib/datasets/finance/fredBenchmarks";

// ─── Live worked example (single source of truth — refreshes with FRED data) ──
const RATE = fredBenchmarks.mortgage30yr;
const AS_OF = fredBenchmarks.currentPeriodLabel;
// $300k mortgage at the live rate, 30 yrs, with $6k in fees/points.
const EX = calculateApr({ loanAmount: 300_000, noteRatePct: RATE, fees: 6_000, termYears: 30 });
const usd = (n: number) => `$${Math.round(n).toLocaleString()}`;

export const metadata: Metadata = {
  title: "APR Calculator – True Cost of a Loan Including Fees",
  description:
    "Calculate the real APR on a loan once origination fees and points are included. See how much higher your true annual rate is than the headline note rate, and the total cost.",
  keywords: ["apr calculator", "annual percentage rate calculator", "apr vs interest rate", "true cost of loan calculator", "mortgage apr calculator", "loan apr with fees"],
  alternates: { canonical: "https://worthulator.com/tools/apr-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "What is APR and how is it different from the interest rate?",
    a: `The interest (note) rate is the cost of borrowing the principal. APR (annual percentage rate) is broader — it folds in upfront fees and points, so it reflects the true yearly cost. In the example, a ${RATE}% note rate with ${usd(6_000)} in fees becomes a ${EX.aprPct}% APR (${AS_OF}).`,
  },
  {
    q: "How is APR calculated?",
    a: "Your monthly payment is calculated on the full loan at the note rate. But you only receive the loan minus fees. APR is the rate that would amortize that smaller net amount to the same monthly payment — solved numerically. Spreading the fees over the loan term raises the effective rate.",
  },
  {
    q: "Why does APR matter when comparing loans?",
    a: "Because a low advertised rate can hide high fees. Under the Truth in Lending Act, US lenders must disclose APR precisely so borrowers can compare offers on equal footing. A loan with a slightly higher rate but no fees can easily beat a 'low rate, high fee' loan.",
  },
  {
    q: "Does a shorter loan term change the APR?",
    a: "Yes — for the same fees, a shorter term spreads those costs over fewer payments, so the APR premium over the note rate is larger. Fees hurt more on short loans and matter less the longer you hold the loan.",
  },
  {
    q: "Is this the exact APR my lender will quote?",
    a: "It's a close estimate. Lenders follow specific federal rules about which fees count toward APR (some third-party costs are excluded), so the official number on your Loan Estimate may differ slightly. Use this to compare and sanity-check, then confirm with the disclosure.",
  },
];

const STATS = [
  { stat: `${EX.aprPct}%`, color: "text-violet-600", accent: "bg-violet-500", label: `true APR on a ${usd(300_000)} loan at ${RATE}% with ${usd(6_000)} fees (${AS_OF})` },
  { stat: `+${EX.aprPremiumPct.toFixed(2)} pts`, color: "text-blue-600", accent: "bg-blue-500", label: `how much the fees raise your rate above the ${RATE}% note rate (${AS_OF})` },
  { stat: usd(EX.totalCost), color: "text-amber-600", accent: "bg-amber-500", label: `total cost over 30 years — interest plus upfront fees (${AS_OF})` },
];

const CONTENT_CARDS = [
  {
    icon: "🏷️",
    title: "The rate isn't the whole story",
    body: `A headline rate ignores what you pay just to get the loan. Fold in ${usd(6_000)} of fees and that ${RATE}% note rate becomes a ${EX.aprPct}% APR — the number that reflects what borrowing really costs.`,
  },
  {
    icon: "💸",
    title: "You repay more than you receive",
    body: `Borrow ${usd(300_000)} with ${usd(6_000)} in fees and only ${usd(EX.netReceived)} actually reaches you — but your payments are based on the full ${usd(300_000)}. That gap is exactly what APR captures.`,
  },
  {
    icon: "⚖️",
    title: "Compare apples to apples",
    body: "Two loans, two rate quotes, different fees — APR is the single number that makes them comparable. It's why lenders are legally required to disclose it alongside the rate.",
  },
];

const RELATED_CALCS = [
  { title: "Interest Rate Calculator", description: "Solve for the rate from a payment.", href: "/tools/interest-rate-calculator", icon: "🔍", accent: "bg-emerald-500/10" },
  { title: "Loan Payment Calculator", description: "Monthly payment from rate and term.", href: "/tools/loan-payment-calculator", icon: "💵", accent: "bg-blue-500/10" },
  { title: "Mortgage Payment Calculator", description: "Full PITI housing payment.", href: "/tools/mortgage-payment-calculator", icon: "🏠", accent: "bg-violet-500/10" },
  { title: "Amortization Calculator", description: "See the full payoff schedule.", href: "/tools/amortization-calculator", icon: "📋", accent: "bg-amber-500/10" },
];

export default function AprCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "APR Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description: "Calculate the true APR of a loan including upfront fees and points, and compare it to the note rate.",
      url: "https://worthulator.com/tools/apr-calculator",
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
        eyebrowIcon="🏷️"
        eyebrowText="Loans · True Cost · Rate + Fees"
        title="APR Calculator"
        description="See the real annual cost of a loan once fees and points are baked in — the APR lenders must disclose, and the number you should actually compare."
        chips={["True APR", "APR vs note rate", "Total cost of borrowing"]}
      >
        <AprCalculatorLoader />
      </SimpleCalculatorHero>

      <InsightStrip
        text={`That ${RATE}% rate isn't the real cost: with ${usd(6_000)} in fees it's a <span class="font-semibold text-gray-900">${EX.aprPct}% APR</span> — ${EX.aprPremiumPct.toFixed(2)} points higher.`}
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="Why APR beats the headline rate"
        subtitle="Fees and points are part of the cost — APR is the only number that includes them."
        cards={CONTENT_CARDS}
      />

      <SEOTextBlock
        title="How the APR Calculator Works"
        formula={`Monthly payment = amortize(loan, note rate, term)
Net received    = loan − fees

APR = the rate that amortizes the NET received to that
      same monthly payment (solved by bisection), × 12.`}
        steps={[
          { label: "Enter the loan amount", description: "The full principal you're borrowing." },
          { label: "Enter the note rate", description: `Defaults to the live 30-yr mortgage rate (${AS_OF}).` },
          { label: "Enter the term", description: "How many years the loan runs." },
          { label: "Add upfront fees", description: "Origination, points, and closing costs." },
          { label: "See the true APR", description: "Plus the premium over the note rate and total cost." },
        ]}
        paragraphs={[
          `APR exists to answer one question: what does this loan really cost per year, fees and all? The monthly payment is set by the note rate on the full loan, but because fees come out of the proceeds, you receive less than you borrow. In the example, ${usd(300_000)} at ${RATE}% with ${usd(6_000)} of fees nets you ${usd(EX.netReceived)} yet repays on the full ${usd(300_000)} — an effective ${EX.aprPct}% APR (${AS_OF}).`,
          "The practical takeaway: compare loans by APR, not the advertised rate. A 'no fee' loan at a slightly higher rate can be cheaper than a low-rate loan loaded with points — especially on shorter terms, where fees are spread over fewer payments. Confirm the precise figure on each lender's Loan Estimate, which is governed by federal disclosure rules.",
        ]}
      />

      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      <RelatedCalcCards
        title="Related Calculators"
        subtitle="More tools for understanding borrowing costs."
        items={RELATED_CALCS}
      />
    </main>
  );
}
