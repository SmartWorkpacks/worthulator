import type { Metadata } from "next";
import MortgagePaymentCalculatorLoader from "./MortgagePaymentCalculatorLoader";
import SimpleCalculatorHero from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import StandardFAQSection from "@/src/templates/take-home-pay/StandardFAQSection";
import {
  StatChipsRow, ContentCardGrid, SEOTextBlock, InsightStrip, RelatedCalcCards,
} from "@/src/templates/take-home-pay/StandardSEOSection";
import { calculateMortgagePayment, MORTGAGE_DEFAULTS } from "@/lib/calculators/mortgagePaymentEngine";
import { fredBenchmarks } from "@/lib/datasets/finance/fredBenchmarks";

// ─── Live worked example (single source of truth — refreshes with FRED data) ──
// $400k home, 20% down, 30-yr, at the current 30-yr fixed average. Every number
// in the copy below derives from this so it moves with the weekly rate refresh.
const RATE = fredBenchmarks.mortgage30yr;
const AS_OF = fredBenchmarks.currentPeriodLabel;
const EX_PRICE = 400_000;
const EX = calculateMortgagePayment({ homePrice: EX_PRICE, downPaymentPct: 20, annualRatePct: RATE, termYears: 30 });
// Low-down-payment variant to quantify PMI in the copy.
const EX_PMI = calculateMortgagePayment({ homePrice: EX_PRICE, downPaymentPct: 10, annualRatePct: RATE, termYears: 30 });
const usd = (n: number) => `$${Math.round(n).toLocaleString()}`;

export const metadata: Metadata = {
  title: "Mortgage Payment Calculator 2026 – Full Monthly PITI Breakdown",
  description:
    "Calculate your true monthly mortgage payment — principal, interest, property tax, insurance, PMI, and HOA. Uses the live US 30-year rate and shows how your payment changes with the down payment.",
  keywords: ["mortgage payment calculator", "monthly mortgage payment", "PITI calculator", "mortgage calculator with PMI", "mortgage payment with taxes and insurance"],
  alternates: { canonical: "https://worthulator.com/tools/mortgage-payment-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "What is included in a monthly mortgage payment?",
    a: `A full mortgage payment is "PITI": Principal, Interest, Taxes, and Insurance — plus PMI if your down payment is under 20%, and HOA dues if applicable. For example, a ${usd(EX_PRICE)} home with 20% down at ${RATE}% over 30 years runs about ${usd(EX.totalMonthly)}/mo, of which only ${usd(EX.monthlyPI)} is principal and interest (${AS_OF}).`,
  },
  {
    q: "How much is the principal and interest portion?",
    a: `On that ${usd(EX_PRICE)} example (${usd(EX.loanAmount)} loan after 20% down) at ${RATE}%, principal and interest is about ${usd(EX.monthlyPI)}/mo — roughly ${EX.piShareOfTotalPct}% of the total payment. The rest is property tax, homeowners insurance, and any PMI or HOA.`,
  },
  {
    q: "When do I have to pay PMI, and how much is it?",
    a: `Private mortgage insurance applies when you put down less than 20% (loan-to-value above 80%). It typically costs 0.3–1.5% of the loan per year. On the example with just 10% down, PMI adds about ${usd(EX_PMI.monthlyPMI)}/mo — and it disappears once you reach 20% equity, which is why a bigger down payment can pay off twice.`,
  },
  {
    q: "How much are property taxes and insurance?",
    a: `They vary by location and home, but US averages are roughly 1.1% of home value per year in property tax and about $1,800/yr for homeowners insurance. On the ${usd(EX_PRICE)} example that's about ${usd(EX.monthlyTax)}/mo in tax and ${usd(EX.monthlyInsurance)}/mo in insurance — usually collected together with your payment in an escrow account.`,
  },
  {
    q: "Why is my real payment higher than a basic mortgage calculator shows?",
    a: "Most quick calculators show only principal and interest. Your real monthly cost adds property tax, homeowners insurance, PMI (if under 20% down), and HOA dues. Those escrow items can add hundreds of dollars a month — this calculator includes all of them so the number you see is the number you'll actually pay.",
  },
];

const STATS = [
  { stat: `${RATE}%`, color: "text-violet-600", accent: "bg-violet-500", label: `current US 30-year fixed mortgage average — Freddie Mac via FRED (${AS_OF})` },
  { stat: usd(EX.totalMonthly), color: "text-blue-600", accent: "bg-blue-500", label: `true monthly payment on a ${usd(EX_PRICE)} home, 20% down, at ${RATE}% over 30 years (${AS_OF})` },
  { stat: `${EX.piShareOfTotalPct}%`, color: "text-amber-600", accent: "bg-amber-500", label: `of that payment is principal & interest — the rest is tax, insurance${EX.pmiActive ? ", PMI" : ""} and dues` },
];

const CONTENT_CARDS = [
  {
    icon: "🧾",
    title: "P&I is only part of the story",
    body: `The principal-and-interest figure most calculators stop at is just one slice. On a ${usd(EX_PRICE)} home with 20% down it's about ${usd(EX.monthlyPI)}/mo, but property tax and insurance push the real payment to roughly ${usd(EX.totalMonthly)}/mo. Budget for PITI, not just P&I.`,
  },
  {
    icon: "🛡️",
    title: "The 20% down PMI cliff",
    body: `Put down less than 20% and you pay PMI — on a 10%-down version of this loan that's about ${usd(EX_PMI.monthlyPMI)}/mo for insurance that protects the lender, not you. Cross 20% equity and it falls away. The payment-by-down-payment chart shows exactly where the cliff is.`,
  },
  {
    icon: "🏦",
    title: "Escrow: taxes and insurance",
    body: "Lenders usually collect property tax and homeowners insurance monthly and hold them in escrow, then pay your county and insurer for you. That's why your payment is higher than a raw loan calculation — and why a low rate alone doesn't tell you what a home really costs per month.",
  },
];

const RELATED_CALCS = [
  { title: "Amortization Calculator", description: "See the full principal-vs-interest schedule for any loan.", href: "/tools/amortization-calculator", icon: "📉", accent: "bg-emerald-500/10" },
  { title: "Mortgage Calculator", description: "Explore overall affordability and loan scenarios.", href: "/tools/mortgage-calculator", icon: "🏠", accent: "bg-blue-500/10" },
  { title: "House Affordability Calculator", description: "How much home can your income actually support?", href: "/tools/house-affordability-calculator", icon: "💰", accent: "bg-violet-500/10" },
  { title: "Closing Cost Calculator", description: "Estimate the upfront cash you'll need to close.", href: "/tools/closing-cost-calculator", icon: "📋", accent: "bg-amber-500/10" },
];

export default function MortgagePaymentCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Mortgage Payment Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description: "Calculate your full monthly mortgage payment — principal, interest, property tax, insurance, PMI, and HOA — using the live 30-year mortgage rate.",
      url: "https://worthulator.com/tools/mortgage-payment-calculator",
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
        eyebrowIcon="🏠"
        eyebrowText="Mortgages · PITI · Home Buying"
        title="Mortgage Payment Calculator"
        description="See your true monthly payment — principal, interest, property tax, insurance, and PMI — not just the part most calculators show. Defaults to the live 30-year mortgage rate."
        chips={["Full PITI breakdown", "PMI & escrow included", "Down-payment impact"]}
      >
        <MortgagePaymentCalculatorLoader />
      </SimpleCalculatorHero>

      <InsightStrip
        text={`At the current 30-year average of <span class="font-semibold text-gray-900">${RATE}% (${AS_OF})</span>, a ${usd(EX_PRICE)} home with 20% down costs about ${usd(EX.totalMonthly)}/mo all-in — only ${usd(EX.monthlyPI)} of that is principal and interest.`}
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="Your real monthly payment, not the sticker number"
        subtitle="Principal and interest is just the start — taxes, insurance, and PMI decide what you actually pay."
        cards={CONTENT_CARDS}
      />

      <SEOTextBlock
        title="How the Mortgage Payment Calculator Works"
        formula={`Loan Amount = Home Price − Down Payment
Monthly P&I = L × r ÷ (1 − (1 + r)^−n)   (r = rate/12, n = years × 12)

Monthly Tax       = Home Price × Tax Rate ÷ 12
Monthly Insurance = Annual Insurance ÷ 12
Monthly PMI       = Loan × PMI Rate ÷ 12   (only if down payment < 20%)

Total Payment (PITI) = P&I + Tax + Insurance + PMI + HOA`}
        steps={[
          { label: "Enter the home price", description: "The purchase price you're financing." },
          { label: "Set your down payment", description: "As a percent — under 20% triggers PMI; the chart shows the cliff." },
          { label: "Set the rate and term", description: `Rate defaults to the live 30-year fixed average (${RATE}%, ${AS_OF}); override with your quote.` },
          { label: "Adjust tax, insurance & HOA", description: `Defaults use US averages (≈${MORTGAGE_DEFAULTS.propertyTaxRatePct}% tax, $${MORTGAGE_DEFAULTS.homeInsuranceAnnual.toLocaleString()}/yr insurance).` },
          { label: "See your full PITI payment", description: "Total monthly cost, a component breakdown, and how it moves with your down payment." },
        ]}
        paragraphs={[
          "The most common mistake in home shopping is budgeting off the principal-and-interest figure alone. Property tax and insurance — collected through escrow — and PMI for low down payments can add hundreds of dollars a month, turning an affordable-looking P&I into a stretch.",
          "The payment-by-down-payment view makes the 20% threshold concrete: below it you pay PMI; at or above it you don't. Combined with the live rate, it shows the real trade-off between a larger down payment and a lower monthly cost.",
        ]}
      />

      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      <RelatedCalcCards
        title="Related Calculators"
        subtitle="More tools for buying and financing a home."
        items={RELATED_CALCS}
      />
    </main>
  );
}
