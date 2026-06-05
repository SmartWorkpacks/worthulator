import type { Metadata } from "next";
import AnnuityCalculatorLoader from "./AnnuityCalculatorLoader";
import SimpleCalculatorHero from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import StandardFAQSection from "@/src/templates/take-home-pay/StandardFAQSection";
import {
  StatChipsRow, ContentCardGrid, SEOTextBlock, InsightStrip, RelatedCalcCards,
} from "@/src/templates/take-home-pay/StandardSEOSection";
import { calculateAnnuity } from "@/lib/calculators/annuityEngine";

// ─── Worked example (single source of truth) ─────────────────────────────────
// $500k premium at 5% paying out over 20 years.
const EX = calculateAnnuity({ principal: 500_000, annualRatePct: 5, payoutYears: 20 });
const usd = (n: number) => `$${Math.round(n).toLocaleString()}`;

export const metadata: Metadata = {
  title: "Annuity Calculator – Monthly Payout & Total Income",
  description:
    "Calculate the guaranteed monthly income from a fixed annuity. Enter your premium, crediting rate, and payout period to see your monthly payout, total income, and interest earned.",
  keywords: ["annuity calculator", "annuity payout calculator", "fixed annuity calculator", "annuity income calculator", "immediate annuity calculator", "how much does an annuity pay"],
  alternates: { canonical: "https://worthulator.com/tools/annuity-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "How much does an annuity pay per month?",
    a: `It depends on the premium, the crediting rate, and the payout length. A ${usd(500_000)} premium at 5% paid over 20 years works out to about ${usd(EX.monthlyPayout)}/mo (${usd(EX.annualPayout)}/yr) in this fixed period-certain example — totaling ${usd(EX.totalPayout)}, or ${EX.payoutMultiple}× the premium.`,
  },
  {
    q: "How is an annuity payout calculated?",
    a: "A fixed period-certain annuity is calculated the same way as a loan payment: Payment = P · r / (1 − (1 + r)^−n), where P is your premium, r is the monthly rate, and n is the number of payments. The insurer effectively returns your principal plus interest in equal installments.",
  },
  {
    q: "What's the difference between period-certain and lifetime annuities?",
    a: "A period-certain annuity pays for a fixed number of years (what this calculator models). A lifetime annuity pays as long as you live, with the payment based on your age and life expectancy — it can pay more or less in total depending on how long you live. Many annuities blend the two (e.g. 'life with 10 years certain').",
  },
  {
    q: "Are annuity payouts guaranteed?",
    a: "Fixed annuity payouts are contractually guaranteed by the issuing insurance company, so the insurer's financial strength matters. Variable and indexed annuities tie payouts to market performance and are not fixed. Always check the product type and the insurer's ratings.",
  },
  {
    q: "What fees and downsides should I watch for?",
    a: "Annuities can carry surrender charges (penalties for early withdrawal), administrative and rider fees, and reduced liquidity — your money is locked up. They also may not keep pace with inflation unless you buy a cost-of-living rider. This calculator shows gross payouts before fees and taxes.",
  },
];

const STATS = [
  { stat: usd(EX.monthlyPayout), color: "text-violet-600", accent: "bg-violet-500", label: `monthly income from a ${usd(500_000)} premium at 5% over 20 years` },
  { stat: `${EX.payoutMultiple}×`, color: "text-blue-600", accent: "bg-blue-500", label: `total payout as a multiple of the premium you put in` },
  { stat: usd(EX.interestEarned), color: "text-amber-600", accent: "bg-amber-500", label: `interest earned on top of your premium over the payout period` },
];

const CONTENT_CARDS = [
  {
    icon: "🏦",
    title: "A lump sum becomes income",
    body: `An annuity turns savings into a predictable paycheck. Hand over a premium, and the insurer pays you a level amount on a schedule — ${usd(EX.monthlyPayout)}/mo in the example — while crediting interest on the unpaid balance.`,
  },
  {
    icon: "⚖️",
    title: "Length is the key trade-off",
    body: "A shorter payout period means larger monthly checks but for fewer years; a longer period spreads smaller payments across more time. The payout-by-length chart makes the trade-off concrete so you can match it to your needs.",
  },
  {
    icon: "🛡️",
    title: "Certainty has a cost",
    body: "The appeal of a fixed annuity is a guaranteed payment you can't outlive (for lifetime versions). The trade-offs are limited liquidity, possible surrender charges, and fees — so weigh it against keeping the money invested yourself.",
  },
];

const RELATED_CALCS = [
  { title: "Retirement Calculator", description: "Will your savings last through retirement?", href: "/tools/retirement-calculator", icon: "🏖️", accent: "bg-emerald-500/10" },
  { title: "Social Security Calculator", description: "Estimate your guaranteed government income.", href: "/tools/social-security-calculator", icon: "🏛️", accent: "bg-blue-500/10" },
  { title: "Future Value Calculator", description: "What a lump sum grows to over time.", href: "/tools/future-value-calculator", icon: "🔮", accent: "bg-violet-500/10" },
  { title: "FIRE Calculator", description: "How much do you need to retire?", href: "/tools/fire-calculator", icon: "🔥", accent: "bg-amber-500/10" },
];

export default function AnnuityCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Annuity Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description: "Calculate the monthly payout, total income, and interest earned from a fixed period-certain annuity.",
      url: "https://worthulator.com/tools/annuity-calculator",
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
        eyebrowIcon="💸"
        eyebrowText="Retirement · Annuities · Guaranteed Income"
        title="Annuity Calculator"
        description="Turn a lump sum into a guaranteed paycheck. See the monthly income a fixed annuity pays, your total payout, and how much of it is interest."
        chips={["Monthly payout", "Total income", "Payout-by-length chart"]}
      >
        <AnnuityCalculatorLoader />
      </SimpleCalculatorHero>

      <InsightStrip
        text={`A ${usd(500_000)} premium at 5% pays about <span class="font-semibold text-gray-900">${usd(EX.monthlyPayout)}/mo</span> for 20 years — ${usd(EX.totalPayout)} in total, ${EX.payoutMultiple}× what you put in.`}
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="How an annuity turns savings into income"
        subtitle="A fixed annuity trades a lump sum for a stream of guaranteed payments."
        cards={CONTENT_CARDS}
      />

      <SEOTextBlock
        title="How the Annuity Calculator Works"
        formula={`Monthly payout = P · r / (1 − (1 + r)^−n)
  P = premium, r = rate ÷ 12, n = payout years × 12
  (When r = 0: payout = P ÷ n)

Total payout = monthly payout × n
Interest earned = total payout − premium`}
        steps={[
          { label: "Enter your premium", description: "The lump sum you'd pay into the annuity." },
          { label: "Enter the crediting rate", description: "The annual rate the annuity earns." },
          { label: "Choose a payout length", description: "How many years it should pay you." },
          { label: "See your income", description: "Monthly and annual payout, plus the total." },
          { label: "Compare payout lengths", description: "The chart shows how the term changes the check." },
        ]}
        paragraphs={[
          `A fixed period-certain annuity converts a lump sum into a guaranteed income stream. The math mirrors a loan: the insurer "amortizes" your premium back to you with interest. In the example, ${usd(500_000)} at 5% over 20 years pays ${usd(EX.monthlyPayout)}/mo and returns ${usd(EX.totalPayout)} in total — ${EX.payoutMultiple}× the premium, with ${usd(EX.interestEarned)} of that being interest.`,
          "Annuities are a tool for turning savings into predictable income, especially in retirement. The main trade-offs are liquidity (your money is locked up), fees and surrender charges, and inflation risk on fixed payments. This calculator models a simple fixed annuity for illustration — compare real quotes and product types before committing, and consider speaking with a fee-only advisor.",
        ]}
      />

      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      <RelatedCalcCards
        title="Related Calculators"
        subtitle="More tools for retirement income planning."
        items={RELATED_CALCS}
      />
    </main>
  );
}
