import type { Metadata } from "next";
import MortgagePayoffCalculatorLoader from "./MortgagePayoffCalculatorLoader";
import SimpleCalculatorHero from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import StandardFAQSection from "@/src/templates/take-home-pay/StandardFAQSection";
import {
  StatChipsRow, ContentCardGrid, SEOTextBlock, InsightStrip, RelatedCalcCards,
} from "@/src/templates/take-home-pay/StandardSEOSection";
import { calculateMortgagePayoff } from "@/lib/calculators/mortgagePayoffEngine";
import { fredBenchmarks } from "@/lib/datasets/finance/fredBenchmarks";

// ─── Live worked example (single source of truth — refreshes with FRED data) ──
const RATE = fredBenchmarks.mortgage30yr;
const AS_OF = fredBenchmarks.currentPeriodLabel;
const EX_BALANCE = 280_000;
// $280k balance, 25 yrs left, at the live rate, with $200/mo extra.
const EX = calculateMortgagePayoff({ currentBalance: EX_BALANCE, annualRatePct: RATE, remainingTermYears: 25, extraMonthly: 200 });
// Biweekly-only variant for the copy.
const EX_BW = calculateMortgagePayoff({ currentBalance: EX_BALANCE, annualRatePct: RATE, remainingTermYears: 25, biweekly: true });
const usd = (n: number) => `$${Math.round(n).toLocaleString()}`;
const yrMo = (m: number) => {
  const y = Math.floor(m / 12);
  const mo = m % 12;
  return y > 0 && mo > 0 ? `${y} yr ${mo} mo` : y > 0 ? `${y} yr` : `${mo} mo`;
};

export const metadata: Metadata = {
  title: "Mortgage Payoff Calculator 2026 – Pay Off Early & Save Interest",
  description:
    "See how much sooner you can pay off your mortgage and how much interest you'll save with extra monthly payments, a lump sum, or biweekly payments. Uses the live 30-year rate.",
  keywords: ["mortgage payoff calculator", "pay off mortgage early calculator", "extra mortgage payment calculator", "biweekly mortgage calculator", "mortgage early payoff"],
  alternates: { canonical: "https://worthulator.com/tools/mortgage-payoff-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "How much faster can I pay off my mortgage with extra payments?",
    a: `It depends on your balance, rate, and the extra amount. For example, on a ${usd(EX_BALANCE)} balance with 25 years left at ${RATE}%, adding ${usd(200)}/mo pays it off about ${yrMo(EX.monthsSaved)} sooner and saves roughly ${usd(EX.interestSaved)} in interest (${AS_OF}).`,
  },
  {
    q: "Do biweekly mortgage payments really work?",
    a: `Yes. Paying half your monthly amount every two weeks means 26 half-payments a year — equal to 13 monthly payments, or one extra payment annually. On the ${usd(EX_BALANCE)} example, biweekly payments alone shave about ${yrMo(EX_BW.monthsSaved)} off and save around ${usd(EX_BW.interestSaved)}, with no big change to your budget.`,
  },
  {
    q: "Is it better to pay extra monthly or make a lump-sum payment?",
    a: "Both help, in different ways. A lump sum cuts the balance immediately, removing all future interest on that amount. Regular extra monthly payments compound over time and build the habit. Combining them is most powerful — this calculator lets you model extra monthly, a lump sum, and biweekly together.",
  },
  {
    q: "Should I pay off my mortgage early or invest instead?",
    a: "It's part math, part peace of mind. If your expected after-tax investment return reliably beats your mortgage rate, investing may build more wealth; if not, guaranteed interest savings from early payoff win. Many people value the certainty and reduced risk of being mortgage-free — there's no single right answer.",
  },
  {
    q: "Are there downsides to paying off a mortgage early?",
    a: "A few. Check for prepayment penalties, make sure your servicer applies extra payments to principal (not just holds them), and don't drain your emergency fund or skip employer-matched retirement contributions to do it. Liquidity matters — money in the house is hard to access.",
  },
];

const STATS = [
  { stat: `${RATE}%`, color: "text-violet-600", accent: "bg-violet-500", label: `current US 30-year fixed mortgage average — Freddie Mac via FRED (${AS_OF})` },
  { stat: usd(EX.interestSaved), color: "text-blue-600", accent: "bg-blue-500", label: `interest saved adding ${usd(200)}/mo to a ${usd(EX_BALANCE)} balance, 25 yrs left, at ${RATE}% (${AS_OF})` },
  { stat: yrMo(EX.monthsSaved), color: "text-amber-600", accent: "bg-amber-500", label: `sooner you'd be mortgage-free in that same scenario` },
];

const CONTENT_CARDS = [
  {
    icon: "⏱️",
    title: "Small extra payments, big time savings",
    body: `Because interest compounds on the balance, every extra dollar of principal cancels years of future interest. On a ${usd(EX_BALANCE)} balance, just ${usd(200)}/mo extra cuts about ${yrMo(EX.monthsSaved)} and ${usd(EX.interestSaved)} of interest — without refinancing.`,
  },
  {
    icon: "🗓️",
    title: "Biweekly = one free extra payment",
    body: `Switching to biweekly payments sneaks in a 13th monthly payment each year. On the example it saves about ${usd(EX_BW.interestSaved)} and ${yrMo(EX_BW.monthsSaved)} — a near-painless way to accelerate payoff if your servicer applies it to principal.`,
  },
  {
    icon: "💵",
    title: "Lump sums hit hardest early",
    body: "A one-time payment against principal removes all the future interest that balance would have generated — and the earlier in the loan you do it, the more you save. Windfalls, bonuses, and tax refunds are prime candidates.",
  },
];

const RELATED_CALCS = [
  { title: "Amortization Calculator", description: "The full principal-vs-interest schedule.", href: "/tools/amortization-calculator", icon: "📉", accent: "bg-emerald-500/10" },
  { title: "Mortgage Payment Calculator", description: "Full monthly PITI for a home loan.", href: "/tools/mortgage-payment-calculator", icon: "🏠", accent: "bg-blue-500/10" },
  { title: "Mortgage Refinance Calculator", description: "Could a lower rate beat paying extra?", href: "/tools/mortgage-refinance-calculator", icon: "🔄", accent: "bg-violet-500/10" },
  { title: "Home Loan Calculator", description: "True lifetime cost and equity build-up.", href: "/tools/home-loan-calculator", icon: "🏡", accent: "bg-amber-500/10" },
];

export default function MortgagePayoffCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Mortgage Payoff Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description: "See how much sooner you can pay off your mortgage and how much interest you'll save with extra payments, a lump sum, or biweekly payments.",
      url: "https://worthulator.com/tools/mortgage-payoff-calculator",
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
        eyebrowIcon="🏁"
        eyebrowText="Mortgage · Early Payoff · Interest Saved"
        title="Mortgage Payoff Calculator"
        description="See how much sooner you'll be mortgage-free — and how much interest you'll save — with extra monthly payments, a lump sum, or biweekly payments. Defaults to the live 30-year rate."
        chips={["Payoff date", "Interest saved", "Biweekly & lump sum"]}
      >
        <MortgagePayoffCalculatorLoader />
      </SimpleCalculatorHero>

      <InsightStrip
        text={`On a <span class="font-semibold text-gray-900">${usd(EX_BALANCE)} balance at ${RATE}% (${AS_OF})</span>, just ${usd(200)}/mo extra is mortgage-free ${yrMo(EX.monthsSaved)} sooner and saves about ${usd(EX.interestSaved)} in interest.`}
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="Three ways to beat your mortgage"
        subtitle="Extra monthly, biweekly, or a lump sum — each removes future interest, and they stack."
        cards={CONTENT_CARDS}
      />

      <SEOTextBlock
        title="How the Mortgage Payoff Calculator Works"
        formula={`Monthly Payment = derived from balance, rate & years remaining

Each month (at your FIXED payment + extras):
  Interest  = Balance × (APR ÷ 12)
  Principal = Payment + Extra − Interest
  Balance   = Balance − Principal

Lump sum  → reduces the starting balance (payment stays the same)
Biweekly  → adds ≈ one extra monthly payment per year
Interest Saved = Baseline Interest − New Interest`}
        steps={[
          { label: "Enter your current balance", description: "What you still owe today, not the original loan amount." },
          { label: "Set rate and years remaining", description: `Rate defaults to the live 30-year average (${RATE}%, ${AS_OF}); use your actual rate.` },
          { label: "Add extra monthly payments", description: "Any amount above your normal payment goes to principal." },
          { label: "Add a lump sum or biweekly", description: "A one-time payment now and/or biweekly payments — combine freely." },
          { label: "See your new payoff", description: "How much sooner you finish and the total interest you save." },
        ]}
        paragraphs={[
          "Paying off a mortgage early works because mortgage interest is charged on the outstanding balance every month. Any payment beyond the scheduled amount goes straight to principal, shrinking that balance and erasing all the future interest it would have accrued — so modest extra payments can save years and tens of thousands of dollars.",
          "The biggest lever is consistency and timing: extra payments early in the loan (when the balance is largest) save the most, and biweekly payments add a painless 13th payment each year. Always confirm there's no prepayment penalty and that your servicer applies extra funds to principal.",
        ]}
      />

      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      <RelatedCalcCards
        title="Related Calculators"
        subtitle="More tools for mortgages and payoff."
        items={RELATED_CALCS}
      />
    </main>
  );
}
