import type { Metadata } from "next";
import HouseAffordabilityCalculatorLoader from "./HouseAffordabilityCalculatorLoader";
import { calculateHouseAffordability } from "@/lib/calculators/houseAffordabilityEngine";
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
  title: "How Much House Can I Afford? Home Affordability Calculator",
  description:
    "Find your maximum home price from income, debts, and down payment using the 28/36 lender rule and today's mortgage rate. See the loan you qualify for, your monthly payment breakdown, and how rate changes shift your budget.",
  keywords: [
    "how much house can i afford",
    "home affordability calculator",
    "house i can afford calculator",
    "mortgage affordability calculator",
    "how much home can i afford",
  ],
  alternates: { canonical: "https://worthulator.com/tools/how-much-house-can-i-afford-calculator" },
  robots: { index: true, follow: true },
};

// Live, date-stamped 30-year fixed mortgage rate (Freddie Mac via FRED).
const RATE = fredBenchmarks.mortgage30yr;
const RATE_AS_OF = fredBenchmarks.currentPeriodLabel;
const RATE_UPDATED = fredBenchmarks.lastUpdated;

// Deterministic worked example computed at build from the engine, using the live rate.
const EX = calculateHouseAffordability({
  annualIncome: 90_000,
  monthlyDebts: 500,
  downPayment: 40_000,
  mortgageRatePct: RATE,
  termYears: 30,
  propertyTaxRatePct: 1.1,
  insuranceAnnual: 1_800,
  hoaMonthly: 0,
  frontDtiPct: 28,
  backDtiPct: 36,
});

// Same buyer, but 2 points cheaper on the rate — illustrates rate sensitivity with live data.
const EX_LOWER_RATE = calculateHouseAffordability({
  annualIncome: 90_000,
  monthlyDebts: 500,
  downPayment: 40_000,
  mortgageRatePct: Math.max(0, RATE - 2),
  termYears: 30,
  propertyTaxRatePct: 1.1,
  insuranceAnnual: 1_800,
  hoaMonthly: 0,
  frontDtiPct: 28,
  backDtiPct: 36,
});

const money = (n: number) => `$${Math.round(n).toLocaleString()}`;
const rateBuyingPowerGap = EX_LOWER_RATE.maxHomePrice - EX.maxHomePrice;

const FAQS = [
  {
    q: "How much house can I afford on my income?",
    a: `Lenders use the 28/36 rule: housing should stay under 28% of gross monthly income and total debt under 36%. On a ${money(90_000)} income with ${money(40_000)} down and a ${RATE}% rate, that supports a home up to about ${money(EX.maxHomePrice)} — a ${money(EX.loanAmount)} loan with a ${money(EX.monthlyPayment)} monthly payment.`,
  },
  {
    q: "What is the 28/36 rule?",
    a: `The front-end ratio caps housing costs at 28% of gross monthly income; the back-end ratio caps all debt payments (housing plus car, student, and card minimums) at 36%. Your budget is the lower of the two. In the example the ${EX.bindingConstraint === "front" ? "28% housing" : "36% total-debt"} ratio is the binding limit at ${money(EX.maxHousingBudget)} per month.`,
  },
  {
    q: "How does the mortgage rate change how much I can afford?",
    a: `Rate moves buying power a lot. At today's ${RATE}% rate the example buyer tops out near ${money(EX.maxHomePrice)}; at ${Math.max(0, RATE - 2)}% the same budget stretches to about ${money(EX_LOWER_RATE.maxHomePrice)} — roughly ${money(rateBuyingPowerGap)} more home for the same monthly payment.`,
  },
  {
    q: "Does my down payment change how much house I can afford?",
    a: "Yes. A larger down payment shrinks the loan you need for any given price, so the same monthly budget reaches a higher home price. It also reduces the loan-to-value ratio, which can help you avoid mortgage insurance.",
  },
  {
    q: "What costs are included in the monthly payment?",
    a: `This tool models a full PITI payment plus HOA: principal & interest on the loan, property tax (a share of home value), homeowner's insurance, and any HOA dues. In the example, principal & interest is ${money(EX.principalInterest)} of the ${money(EX.monthlyPayment)} total.`,
  },
];

const STATS = [
  {
    stat: money(EX.maxHomePrice),
    color: "text-blue-600",
    accent: "bg-blue-500",
    label: `Max home price on ${money(90_000)} income, ${money(40_000)} down, at ${RATE}%`,
  },
  {
    stat: "28 / 36",
    color: "text-emerald-600",
    accent: "bg-emerald-500",
    label: "The lender ratios that cap housing and total-debt payments",
  },
  {
    stat: `${RATE}% rate`,
    color: "text-amber-600",
    accent: "bg-amber-500",
    label: `30-yr fixed mortgage, Freddie Mac as of ${RATE_AS_OF} (FRED) — live default`,
  },
];

const CONTENT_CARDS = [
  {
    icon: "📊",
    title: "Lenders cap two ratios",
    body: "Your housing payment is limited to about 28% of gross income, and all your debt payments together to about 36%. Whichever ratio you hit first sets your ceiling — high existing debt pulls the limit down.",
  },
  {
    icon: "🏷️",
    title: "Today's rate sets your reach",
    body: `The mortgage rate decides how much loan a given payment buys. The calculator opens with the live ${RATE}% 30-year fixed rate (Freddie Mac, ${RATE_AS_OF}) and you can dial it up or down to see the effect on your max price.`,
  },
  {
    icon: "🧾",
    title: "Payments are more than principal",
    body: "Property tax, homeowner's insurance, and any HOA dues share your monthly budget with principal and interest. Folding them in gives a price you can actually carry, not just qualify for.",
  },
];

const RELATED_CALCS = [
  {
    title: "Mortgage Calculator",
    description: "Estimate the monthly payment for a specific home price.",
    href: "/tools/mortgage-calculator",
    icon: "🏠",
    accent: "bg-blue-500/10",
  },
  {
    title: "Home Affordability Calculator",
    description: "Another view of the price your income supports.",
    href: "/tools/home-affordability-calculator",
    icon: "🔑",
    accent: "bg-emerald-500/10",
  },
  {
    title: "Down Payment Calculator",
    description: "See how much cash you need up front.",
    href: "/tools/down-payment-calculator",
    icon: "💰",
    accent: "bg-amber-500/10",
  },
  {
    title: "Debt-to-Income Calculator",
    description: "Check the DTI ratio lenders use to qualify you.",
    href: "/tools/debt-to-income-calculator",
    icon: "⚖️",
    accent: "bg-violet-500/10",
  },
];

export default function HouseAffordabilityPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "How Much House Can I Afford Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description:
        "Estimate the maximum home price you can afford from income, debts, and down payment using the 28/36 lender rule and the current mortgage rate.",
      url: "https://worthulator.com/tools/how-much-house-can-i-afford-calculator",
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
        eyebrowText="Finance · Home Buying"
        title="How Much House Can I Afford?"
        description="Turn your income, debts, and down payment into a realistic maximum home price using the 28/36 lender rule and today's mortgage rate — with a full monthly-payment breakdown."
        chips={["Max home price", "Loan you qualify for", "Payment breakdown"]}
      >
        <HouseAffordabilityCalculatorLoader defaultRatePct={RATE} rateAsOf={RATE_AS_OF} />
      </SimpleCalculatorHero>

      <InsightStrip
        text={`A ${money(90_000)} income with ${money(40_000)} down supports roughly <span class="font-semibold text-gray-900">${money(EX.maxHomePrice)}</span> of home at the current ${RATE}% 30-year rate (Freddie Mac, as of ${RATE_AS_OF}).`}
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="What decides how much house you can afford"
        subtitle="Two lender ratios, today's mortgage rate, and the full cost of ownership."
        cards={CONTENT_CARDS}
      />

      <SEOTextBlock
        title="How the Affordability Calculator Works"
        formula={`monthlyIncome = annualIncome ÷ 12
frontCap      = monthlyIncome × 28%
backCap       = monthlyIncome × 36% − monthlyDebts
housingBudget = max(0, min(frontCap, backCap))

available     = housingBudget − insurance/12 − HOA
P&I factor    = r ÷ (1 − (1+r)^−n)        (r = monthly rate, n = months)
maxHomePrice  = (available + downPayment × factor) ÷ (factor + taxRate/12)
loanAmount    = maxHomePrice − downPayment`}
        steps={[
          { label: "Enter income and debts", description: "Gross annual income and your existing monthly debt payments." },
          { label: "Add your down payment", description: "Cash you will put toward the purchase." },
          { label: "Set the mortgage rate", description: `Opens at the live ${RATE}% 30-year fixed rate — adjust to compare.` },
          { label: "Include ownership costs", description: "Property tax rate, insurance, and any HOA dues." },
          { label: "Review your max price", description: "See the home price, loan, and monthly payment the ratios allow." },
        ]}
        paragraphs={[
          "The maximum home price is solved directly: your housing budget is the lower of the two lender ratios, and the price follows once property tax is treated as a share of value. The result is the most home your income and rate support — lenders may approve less based on credit, reserves, and other factors.",
          `The mortgage rate default is the Freddie Mac 30-year fixed average, ${RATE}% as of ${RATE_AS_OF} (source: FRED, last refreshed ${RATE_UPDATED}). It is editable, so you can model a rate lock or a what-if scenario.`,
        ]}
      />

      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      <RelatedCalcCards
        title="Related Calculators"
        subtitle="Go deeper on the mortgage, down payment, and the ratios behind approval."
        items={RELATED_CALCS}
      />
    </main>
  );
}
