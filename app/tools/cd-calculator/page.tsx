import type { Metadata } from "next";
import CdCalculatorLoader from "./CdCalculatorLoader";
import { calculateCd } from "@/lib/calculators/cdEngine";
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
  title: "CD Calculator - Certificate of Deposit Maturity & Interest",
  description:
    "Calculate what a certificate of deposit (CD) is worth at maturity from its APY and term. See total interest earned, a month-by-month growth schedule, and an early-withdrawal penalty estimate.",
  keywords: [
    "cd calculator",
    "certificate of deposit calculator",
    "cd interest calculator",
    "cd maturity calculator",
    "cd rate calculator",
  ],
  alternates: { canonical: "https://worthulator.com/tools/cd-calculator" },
  robots: { index: true, follow: true },
};

// Live, date-stamped macro context (federal funds rate) — read at render.
// NOTE: this is the fed funds rate for context only; the CD APY is a user input.
const FED_FUNDS = fredBenchmarks.fedFundsRate;
const FED_AS_OF = fredBenchmarks.currentPeriodLabel;

// Deterministic worked examples computed at build from the engine.
const EX = calculateCd({ deposit: 10_000, apyPct: 4, termMonths: 12, penaltyMonths: 3 });
const EX_5Y = calculateCd({ deposit: 10_000, apyPct: 4, termMonths: 60, penaltyMonths: 6 });

const money = (n: number) => `$${Math.round(n).toLocaleString()}`;
const money2 = (n: number) => `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const FAQS = [
  {
    q: "How is a CD's value at maturity calculated?",
    a: `A CD's APY is its effective annual yield, so its value is deposit × (1 + APY) raised to the number of years. For example, ${money(10_000)} at 4.00% APY for 12 months matures at ${money(EX.maturityValue)} — ${money(EX.totalInterest)} in interest.`,
  },
  {
    q: "What is the difference between APY and interest rate on a CD?",
    a: `The interest rate is the base rate; APY (annual percentage yield) folds in how often that interest compounds, so APY is what you actually earn in a year. This calculator takes the advertised APY directly, which is how banks quote CDs. A ${EX.apyPct}% APY works out to about ${EX.monthlyRatePct}% per month.`,
  },
  {
    q: "How much will a 5-year CD earn?",
    a: `Longer terms compound for more years. ${money(10_000)} at 4.00% APY for 60 months matures at ${money(EX_5Y.maturityValue)} — ${money(EX_5Y.totalInterest)} of interest, versus ${money(EX.totalInterest)} over a single year.`,
  },
  {
    q: "What is an early-withdrawal penalty?",
    a: `If you take money out of a CD before it matures, the bank typically charges a penalty quoted as a number of months of interest. In the example, a 3-month penalty is about ${money2(EX.earlyWithdrawalPenalty)}. Exact penalties vary by bank and term — always check your CD's disclosure.`,
  },
  {
    q: "Are CD rates fixed or do they change?",
    a: `A CD's rate is locked for its term once you open it, which is why it is entered here as a fixed APY. New CD rates offered by banks move with the broader rate environment — for context, the federal funds rate is ${FED_FUNDS}% as of ${FED_AS_OF} (source: FRED). That fed funds figure is not a CD rate; it is background on where short-term rates sit.`,
  },
];

const STATS = [
  {
    stat: money(EX.maturityValue),
    color: "text-emerald-600",
    accent: "bg-emerald-500",
    label: `${money(10_000)} at 4.00% APY after a 12-month term`,
  },
  {
    stat: "Fixed APY",
    color: "text-blue-600",
    accent: "bg-blue-500",
    label: "A CD locks its rate for the full term once opened",
  },
  {
    stat: `${FED_FUNDS}% fed funds`,
    color: "text-amber-600",
    accent: "bg-amber-500",
    label: `Federal funds rate as of ${FED_AS_OF} (FRED) — rate-environment context, not a CD rate`,
  },
];

const CONTENT_CARDS = [
  {
    icon: "🔒",
    title: "A CD trades access for a fixed rate",
    body: "You agree to leave the money untouched for the term, and in return the rate is locked in. That certainty is the appeal — and the early-withdrawal penalty is the cost of breaking the deal.",
  },
  {
    icon: "📈",
    title: "APY already includes compounding",
    body: "Because a CD is quoted in APY, you do not need to guess the compounding frequency — the advertised yield is what the deposit earns per year. Longer terms simply compound that yield over more years.",
  },
  {
    icon: "⚠️",
    title: "Know the early-withdrawal penalty",
    body: "Most CDs charge a set number of months of interest if you cash out early. On shorter CDs this penalty can wipe out most of your earnings, so match the term to when you will actually need the cash.",
  },
];

const RELATED_CALCS = [
  {
    title: "Interest Calculator",
    description: "Model simple or compound interest with contributions.",
    href: "/tools/interest-calculator",
    icon: "📈",
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
    description: "Grow a flexible savings balance over time.",
    href: "/tools/savings-account-calculator",
    icon: "💰",
    accent: "bg-amber-500/10",
  },
  {
    title: "Dividend Calculator",
    description: "Estimate income from dividend-paying investments.",
    href: "/tools/dividend-calculator",
    icon: "💵",
    accent: "bg-violet-500/10",
  },
];

export default function CdCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "CD Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description:
        "Calculate the maturity value and interest of a certificate of deposit from its APY and term, with an early-withdrawal penalty estimate.",
      url: "https://worthulator.com/tools/cd-calculator",
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
        eyebrowText="Finance · Savings & CDs"
        title="CD Calculator"
        description="See what a certificate of deposit is worth at maturity from its APY and term — total interest, a month-by-month growth curve, and an estimate of the early-withdrawal penalty."
        chips={["Maturity value", "Interest earned", "Early-withdrawal penalty"]}
      >
        <CdCalculatorLoader />
      </SimpleCalculatorHero>

      <InsightStrip
        text={`${money(10_000)} in a 12-month CD at 4.00% APY matures at <span class="font-semibold text-gray-900">${money(EX.maturityValue)}</span> (${money(EX.totalInterest)} interest). For context, the federal funds rate is ${FED_FUNDS}% as of ${FED_AS_OF}.`}
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="What to know before locking in a CD"
        subtitle="A fixed rate, compounding built into the APY, and a penalty for early access."
        cards={CONTENT_CARDS}
      />

      <SEOTextBlock
        title="How the CD Calculator Works"
        formula={`years          = term (months) ÷ 12
maturityValue  = deposit × (1 + APY)^years
totalInterest  = maturityValue − deposit
monthlyRate    = (1 + APY)^(1 ÷ 12) − 1

Early-withdrawal penalty (estimate):
penalty ≈ deposit × monthlyRate × penalty months`}
        steps={[
          { label: "Enter your deposit", description: "The amount you will lock into the CD." },
          { label: "Enter the advertised APY", description: "Banks quote CDs in APY, which already accounts for compounding." },
          { label: "Set the term", description: "How many months the CD is held before it matures." },
          { label: "Set the penalty", description: "Most CDs charge a number of months of interest for early withdrawal." },
          { label: "Review maturity and penalty", description: "See the final value, interest earned, and what breaking it early would cost." },
        ]}
        paragraphs={[
          "The CD APY here is a value you enter, so the tool works for any bank's offer. Early-withdrawal penalties are an estimate based on the common months-of-interest rule and vary by institution — always confirm with the CD's disclosure.",
          `New CD rates move with the broader rate environment. For background, the federal funds rate is ${FED_FUNDS}% as of ${FED_AS_OF} (source: St. Louis Fed, FRED). This is rate-environment context only; your CD's APY is locked for its term once opened.`,
        ]}
      />

      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      <RelatedCalcCards
        title="Related Calculators"
        subtitle="Pair this with adjacent savings and yield tools."
        items={RELATED_CALCS}
      />
    </main>
  );
}
