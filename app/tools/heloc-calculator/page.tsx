import type { Metadata } from "next";
import HelocCalculatorLoader from "./HelocCalculatorLoader";
import SimpleCalculatorHero from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import StandardFAQSection from "@/src/templates/take-home-pay/StandardFAQSection";
import {
  StatChipsRow, ContentCardGrid, SEOTextBlock, InsightStrip, RelatedCalcCards,
} from "@/src/templates/take-home-pay/StandardSEOSection";
import { calculateHeloc, PRIME_OVER_FED_FUNDS } from "@/lib/calculators/helocEngine";
import { fredBenchmarks } from "@/lib/datasets/finance/fredBenchmarks";

// ─── Live worked example (single source of truth — refreshes with FRED data) ──
// HELOCs price near Prime; Prime ≈ effective Fed Funds + 3.0 (live via FRED).
const PRIME = Math.round((fredBenchmarks.fedFundsRate + PRIME_OVER_FED_FUNDS) * 10) / 10;
const AS_OF = fredBenchmarks.currentPeriodLabel;
const EX = calculateHeloc({
  homeValue: 500_000,
  mortgageBalance: 300_000,
  maxCltvPct: 85,
  drawAmount: 100_000,
  annualRatePct: PRIME,
  drawYears: 10,
  repayYears: 20,
});
const usd = (n: number) => `$${Math.round(n).toLocaleString()}`;

export const metadata: Metadata = {
  title: "HELOC Calculator 2026 – Home Equity Line of Credit Payments",
  description:
    "Calculate your HELOC: how big a line you qualify for from your home equity, the interest-only draw payment, and the payment shock when repayment begins. Uses the live Prime Rate.",
  keywords: ["heloc calculator", "home equity line of credit calculator", "heloc payment calculator", "heloc draw period", "how much heloc can i get"],
  alternates: { canonical: "https://worthulator.com/tools/heloc-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "How much can I borrow with a HELOC?",
    a: `Most lenders cap your combined loan-to-value (CLTV) — existing mortgage plus the HELOC — at around 80–85% of your home's value. Your line is that cap minus your mortgage balance. For example, a $500,000 home with a $300,000 mortgage at an 85% CLTV cap supports a line up to about ${usd(EX.maxLine)}.`,
  },
  {
    q: "What is the HELOC draw period and repayment period?",
    a: `A HELOC has two phases. During the draw period (often 10 years) you can borrow and typically pay interest only. When it ends, the repayment period (often 20 years) begins and the balance fully amortizes — principal plus interest. That transition is where payments jump.`,
  },
  {
    q: "What is HELOC payment shock?",
    a: `It's the sharp rise in payment when the interest-only draw period ends and repayment begins. On a ${usd(EX.borrowed)} balance at ${PRIME}%, the interest-only payment is about ${usd(EX.interestOnlyPayment)}/mo, but the amortizing payment jumps to roughly ${usd(EX.repaymentPayment)}/mo — about ${EX.paymentShockMultiple}× higher (${AS_OF}). Planning for this is essential.`,
  },
  {
    q: "What interest rate do HELOCs charge?",
    a: `HELOCs are usually variable-rate, tied to the Prime Rate (Prime ≈ effective Fed Funds rate + ${PRIME_OVER_FED_FUNDS} points). Prime is about ${PRIME}% right now (${AS_OF}), and lenders often add a margin on top based on your credit and CLTV. Because the rate is variable, your payment can change over time.`,
  },
  {
    q: "HELOC vs home equity loan — what's the difference?",
    a: "A HELOC is a revolving line you draw from as needed at a variable rate, with an interest-only draw period. A home equity loan is a lump sum at a fixed rate that amortizes from day one. HELOCs offer flexibility; home equity loans offer payment certainty.",
  },
];

const STATS = [
  { stat: `${PRIME}%`, color: "text-violet-600", accent: "bg-violet-500", label: `current US Prime Rate (Fed Funds + ${PRIME_OVER_FED_FUNDS}) — HELOCs price near this — FRED (${AS_OF})` },
  { stat: usd(EX.maxLine), color: "text-blue-600", accent: "bg-blue-500", label: `example line on a $500k home with a $300k mortgage at an 85% CLTV cap` },
  { stat: `${EX.paymentShockMultiple}×`, color: "text-amber-600", accent: "bg-amber-500", label: `payment jump from interest-only draw to full repayment on a ${usd(EX.borrowed)} balance (${AS_OF})` },
];

const CONTENT_CARDS = [
  {
    icon: "🏠",
    title: "Your line comes from your equity",
    body: `Lenders lend against the equity you've built, capped by a combined loan-to-value limit (usually 80–85%). The bigger your equity and the smaller your mortgage, the larger the line. On a $500k home owing $300k at 85% CLTV, that's up to about ${usd(EX.maxLine)}.`,
  },
  {
    icon: "⚠️",
    title: "Mind the payment shock",
    body: `Interest-only payments during the draw feel affordable — about ${usd(EX.interestOnlyPayment)}/mo in this example — but when repayment starts the payment can jump to ${usd(EX.repaymentPayment)}/mo (${EX.paymentShockMultiple}×). The payment-over-time chart shows exactly when and how much.`,
  },
  {
    icon: "📊",
    title: "Variable rate, moving target",
    body: `HELOC rates follow Prime (about ${PRIME}% now, ${AS_OF}) plus a lender margin, so they rise and fall with Fed policy. A HELOC can be cheaper than other unsecured credit, but budget for rate increases — your payment is not fixed.`,
  },
];

const RELATED_CALCS = [
  { title: "Home Equity Calculator", description: "How much equity you've built and can tap.", href: "/tools/home-equity-calculator", icon: "🔑", accent: "bg-emerald-500/10" },
  { title: "Mortgage Payment Calculator", description: "Full monthly PITI for a home loan.", href: "/tools/mortgage-payment-calculator", icon: "🏠", accent: "bg-blue-500/10" },
  { title: "Home Loan Calculator", description: "True lifetime cost and equity build-up.", href: "/tools/home-loan-calculator", icon: "🏡", accent: "bg-violet-500/10" },
  { title: "Loan Payment Calculator", description: "Payments for any fixed-rate loan.", href: "/tools/loan-payment-calculator", icon: "🏦", accent: "bg-amber-500/10" },
];

export default function HelocCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "HELOC Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description: "Calculate your home equity line of credit — available line from CLTV, interest-only draw payment, and the payment shock when repayment begins, using the live Prime Rate.",
      url: "https://worthulator.com/tools/heloc-calculator",
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
        eyebrowIcon="🔑"
        eyebrowText="Home Equity · Line of Credit · Draw"
        title="HELOC Calculator"
        description="See how big a home equity line of credit you qualify for, your interest-only draw payment, and the payment shock when repayment begins. Defaults to the live Prime Rate."
        chips={["Available credit line", "Interest-only payment", "Payment-shock warning"]}
      >
        <HelocCalculatorLoader />
      </SimpleCalculatorHero>

      <InsightStrip
        text={`HELOCs feel cheap during the draw — about <span class="font-semibold text-gray-900">${usd(EX.interestOnlyPayment)}/mo interest-only</span> on a ${usd(EX.borrowed)} balance — then jump to ${usd(EX.repaymentPayment)}/mo (${EX.paymentShockMultiple}×) at repayment (${AS_OF}).`}
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="Borrow against your home — with eyes open"
        subtitle="A HELOC is flexible and often cheap, but the variable rate and payment shock catch many borrowers out."
        cards={CONTENT_CARDS}
      />

      <SEOTextBlock
        title="How the HELOC Calculator Works"
        formula={`Current Equity = Home Value − Mortgage Balance
Max Line = (Home Value × Max CLTV%) − Mortgage Balance

Draw period (interest-only):
  Monthly Payment = Balance × (APR ÷ 12)

Repayment period (amortizing):
  Monthly Payment = Balance × r ÷ (1 − (1 + r)^−n)   (r = APR/12, n = repay years × 12)

Default APR ≈ Prime = effective Fed Funds + ${PRIME_OVER_FED_FUNDS}`}
        steps={[
          { label: "Enter your home value", description: "An estimate of what your home is worth today." },
          { label: "Enter your mortgage balance", description: "What you still owe (0 if paid off)." },
          { label: "Set the CLTV cap", description: "The lender's combined loan-to-value limit — usually 80–85%." },
          { label: "Choose how much to draw", description: "The calculator clamps it to the line you qualify for." },
          { label: "Set rate and periods", description: `Rate defaults to Prime (${PRIME}%, ${AS_OF}); set draw and repayment lengths.` },
        ]}
        paragraphs={[
          "A HELOC turns home equity into a flexible, revolving credit line. The amount you can borrow is governed by the combined loan-to-value cap: the more equity you hold relative to your mortgage, the larger the line. Because it's secured by your home, the rate is usually lower than credit cards or personal loans.",
          "The catch is structure and rate. Interest-only payments during the draw period are low and can lull borrowers into over-borrowing; when repayment begins, the payment can more than double. And because the rate tracks Prime, it moves with Fed policy. Modelling the payment shock up front is the single most important step.",
        ]}
      />

      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      <RelatedCalcCards
        title="Related Calculators"
        subtitle="More tools for home equity and borrowing."
        items={RELATED_CALCS}
      />
    </main>
  );
}
