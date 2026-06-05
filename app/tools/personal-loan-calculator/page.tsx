import type { Metadata } from "next";
import PersonalLoanCalculatorLoader from "./PersonalLoanCalculatorLoader";
import { calculatePersonalLoan } from "@/lib/calculators/personalLoanEngine";
import { fredBenchmarks } from "@/lib/datasets/finance/fredBenchmarks";
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
  title: "Personal Loan Calculator - Monthly Payment, Interest & True APR",
  description:
    "Estimate your personal loan's monthly payment, total interest, and true APR including the origination fee. Uses today's average bank rate and shows a full amortization schedule.",
  keywords: [
    "personal loan calculator",
    "loan payment calculator",
    "personal loan interest calculator",
    "loan apr calculator",
    "personal loan monthly payment",
  ],
  alternates: { canonical: "https://worthulator.com/tools/personal-loan-calculator" },
  robots: { index: true, follow: true },
};

// Live, date-stamped 24-month commercial-bank personal-loan APR (FRED).
const APR = fredBenchmarks.personalLoan24moAPR;
const APR_AS_OF = fredBenchmarks.currentPeriodLabel;
const APR_UPDATED = fredBenchmarks.lastUpdated;

// Deterministic worked examples computed at build from the engine, using the live rate.
const EX = calculatePersonalLoan({ loanAmount: 15_000, aprPct: APR, termMonths: 36, originationFeePct: 0 });
const EX_FEE = calculatePersonalLoan({ loanAmount: 15_000, aprPct: APR, termMonths: 36, originationFeePct: 5 });
const EX_LONG = calculatePersonalLoan({ loanAmount: 15_000, aprPct: APR, termMonths: 60, originationFeePct: 0 });

const money = (n: number) => `$${Math.round(n).toLocaleString()}`;

const FAQS = [
  {
    q: "How is a personal loan's monthly payment calculated?",
    a: `A personal loan is amortized: each fixed payment covers the month's interest plus some principal until the balance reaches zero. At today's ${APR}% average rate, a ${money(15_000)} loan over 36 months is about ${money(EX.monthlyPayment)} per month, with ${money(EX.totalInterest)} of total interest.`,
  },
  {
    q: "What is an origination fee and how does it affect the cost?",
    a: `An origination fee is charged up front and usually deducted from the money you receive, but you still repay the full loan amount. A 5% fee on ${money(15_000)} is ${money(EX_FEE.originationFee)}, so you receive ${money(EX_FEE.netDisbursed)} — which raises the true cost from ${APR}% to about ${EX_FEE.effectiveAprPct}% APR.`,
  },
  {
    q: "What's the difference between interest rate and APR?",
    a: "The interest rate prices the loan balance; the APR also folds in fees like origination, so it reflects the real annual cost of borrowing. When there's no fee, the two are the same. This tool shows both so you can compare offers on a like-for-like basis.",
  },
  {
    q: "Does a longer term make a personal loan cheaper?",
    a: `A longer term lowers the monthly payment but increases total interest. The same ${money(15_000)} loan at ${APR}% costs ${money(EX.monthlyPayment)}/mo over 36 months (${money(EX.totalInterest)} interest) versus ${money(EX_LONG.monthlyPayment)}/mo over 60 months (${money(EX_LONG.totalInterest)} interest) — a lower payment but ${money(EX_LONG.totalInterest - EX.totalInterest)} more interest.`,
  },
  {
    q: "What rate will I actually get on a personal loan?",
    a: `Your rate depends on credit score, income, and the lender. The calculator opens at the commercial-bank average of ${APR}% (FRED, ${APR_AS_OF}) so you start from a real benchmark, but strong credit can beat it and thin credit may pay more. Always quote your own offer.`,
  },
];

const STATS = [
  {
    stat: money(EX.monthlyPayment),
    color: "text-blue-600",
    accent: "bg-blue-500",
    label: `Monthly payment on ${money(15_000)} over 36 months at ${APR}%`,
  },
  {
    stat: money(EX.totalInterest),
    color: "text-rose-600",
    accent: "bg-rose-500",
    label: "Total interest paid over the life of that loan",
  },
  {
    stat: `${APR}% APR`,
    color: "text-amber-600",
    accent: "bg-amber-500",
    label: `24-mo personal-loan average, commercial banks, FRED as of ${APR_AS_OF} — live default`,
  },
];

const CONTENT_CARDS = [
  {
    icon: "🏦",
    title: "Start from a real benchmark rate",
    body: `The calculator opens with the live ${APR}% commercial-bank personal-loan average (FRED, ${APR_AS_OF}), so your estimate begins from current market reality instead of a guess. Adjust it to match any quote you've received.`,
  },
  {
    icon: "🧾",
    title: "Watch the origination fee",
    body: "Many lenders deduct a 1–8% fee from the amount you receive while you still repay the full loan. That gap is why the true APR can sit noticeably above the headline rate — the calculator solves for it.",
  },
  {
    icon: "⏳",
    title: "The term is a trade-off",
    body: "Stretching the loan lowers each payment but adds interest over time. Use the amortization curve to see how fast the balance falls and pick a term that balances affordability against total cost.",
  },
];

const RELATED_CALCS = [
  {
    title: "Loan Payoff Calculator",
    description: "See how extra payments shorten a loan.",
    href: "/tools/loan-payoff-calculator",
    icon: "🎯",
    accent: "bg-emerald-500/10",
  },
  {
    title: "Car Payment Calculator",
    description: "Price an auto loan with tax and trade-in.",
    href: "/tools/car-payment-calculator",
    icon: "🚗",
    accent: "bg-blue-500/10",
  },
  {
    title: "Interest Calculator",
    description: "Model simple or compound interest growth.",
    href: "/tools/interest-calculator",
    icon: "📈",
    accent: "bg-violet-500/10",
  },
  {
    title: "Debt-to-Income Calculator",
    description: "Check the DTI ratio lenders use to approve you.",
    href: "/tools/debt-to-income-calculator",
    icon: "⚖️",
    accent: "bg-amber-500/10",
  },
];

export default function PersonalLoanPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Personal Loan Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description:
        "Estimate the monthly payment, total interest, and true APR (including origination fee) of a personal loan using the current average bank rate.",
      url: "https://worthulator.com/tools/personal-loan-calculator",
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
        eyebrowIcon="💵"
        eyebrowText="Finance · Loans"
        title="Personal Loan Calculator"
        description="Estimate your personal loan's monthly payment, total interest, and true APR including any origination fee — starting from today's average bank rate."
        chips={["Monthly payment", "Total interest", "True APR with fees"]}
      >
        <PersonalLoanCalculatorLoader defaultAprPct={APR} rateAsOf={APR_AS_OF} />
      </SimpleCalculatorHero>

      <InsightStrip
        text={`A ${money(15_000)} personal loan over 36 months at the current ${APR}% average rate costs about <span class="font-semibold text-gray-900">${money(EX.monthlyPayment)}/mo</span> (${money(EX.totalInterest)} interest). Source: FRED, as of ${APR_AS_OF}.`}
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="What drives your personal-loan cost"
        subtitle="The rate, the origination fee, and the term you choose."
        cards={CONTENT_CARDS}
      />

      <SEOTextBlock
        title="How the Personal Loan Calculator Works"
        formula={`r              = APR ÷ 12
monthlyPayment = principal × r ÷ (1 − (1+r)^−n)     (n = term in months)
totalRepaid    = monthlyPayment × n
totalInterest  = totalRepaid − principal
originationFee = principal × feeRate
netDisbursed   = principal − originationFee
trueAPR        = rate that equates the payments to the net cash received`}
        steps={[
          { label: "Enter the loan amount", description: "The principal you want to borrow." },
          { label: "Set the APR", description: `Opens at the live ${APR}% average — replace it with your own quote.` },
          { label: "Choose the term", description: "How many months you'll take to repay." },
          { label: "Add any origination fee", description: "Deducted up front; lifts the true cost of borrowing." },
          { label: "Review payment and true APR", description: "See the monthly payment, total interest, and fee-adjusted APR." },
        ]}
        paragraphs={[
          "Personal loans are fixed-rate and fully amortizing, so the payment is constant and the balance falls a little faster each month as less of it goes to interest. The true APR is solved numerically: it's the rate that makes the payment stream worth exactly the cash you actually receive after the fee.",
          `The default APR is the Federal Reserve's commercial-bank 24-month personal-loan average, ${APR}% as of ${APR_AS_OF} (source: FRED, last refreshed ${APR_UPDATED}). It's a starting benchmark — your offer depends on credit, income, and lender.`,
        ]}
      />

      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      <RelatedCalcCards
        title="Related Calculators"
        subtitle="Compare loans, plan payoff, and check the ratios lenders use."
        items={RELATED_CALCS}
      />
    </main>
  );
}
