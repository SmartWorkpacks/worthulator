import type { Metadata } from "next";
import CarPaymentCalculatorLoader from "./CarPaymentCalculatorLoader";
import { calculateCarPayment } from "@/lib/calculators/carPaymentEngine";
import { fredBenchmarks, getAutoLoanUsedAPR } from "@/lib/datasets/finance/fredBenchmarks";
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
  title: "Car Payment Calculator - Monthly Auto Loan Payment & Interest",
  description:
    "Calculate your monthly car payment from the vehicle price, down payment, trade-in, sales tax, and today's auto-loan APR. See the amount financed, total interest, an amortization schedule, and the all-in cost.",
  keywords: [
    "car payment calculator",
    "car loan payment calculator",
    "car calculator",
    "auto loan calculator",
    "monthly car payment calculator",
    "vehicle payment calculator",
  ],
  alternates: { canonical: "https://worthulator.com/tools/car-payment-calculator" },
  robots: { index: true, follow: true },
};

// Live, date-stamped auto-loan APRs (FRED commercial-bank 48-mo new car loan + used premium).
const NEW_APR = fredBenchmarks.autoLoanNew48moAPR;
const USED_APR = getAutoLoanUsedAPR();
const RATE_AS_OF = fredBenchmarks.currentPeriodLabel;
const RATE_UPDATED = fredBenchmarks.lastUpdated;

// Deterministic worked example computed at build from the engine, using the live new-car APR.
const EX = calculateCarPayment({
  vehiclePrice: 35_000,
  downPayment: 5_000,
  tradeInValue: 0,
  salesTaxPct: 7,
  aprPct: NEW_APR,
  termMonths: 60,
});

// Same car on a longer term — illustrates the lower-payment / more-interest trade-off.
const EX_72 = calculateCarPayment({
  vehiclePrice: 35_000,
  downPayment: 5_000,
  tradeInValue: 0,
  salesTaxPct: 7,
  aprPct: NEW_APR,
  termMonths: 72,
});

const money = (n: number) => `$${Math.round(n).toLocaleString()}`;

const FAQS = [
  {
    q: "How is a monthly car payment calculated?",
    a: `The amount financed is the price plus sales tax, minus your down payment and trade-in. That balance is amortized over the loan term at the APR. For example, ${money(35_000)} with ${money(5_000)} down at ${NEW_APR}% over 60 months finances ${money(EX.amountFinanced)} for about ${money(EX.monthlyPayment)} per month.`,
  },
  {
    q: "What APR should I use for a car loan?",
    a: `Your actual rate depends on credit, lender, and term. As a starting point this tool uses the current commercial-bank average: ${NEW_APR}% for new cars and ${USED_APR}% for used (source: FRED, ${RATE_AS_OF}). Used-car rates run higher, which is why the calculator bumps the default when you pick "used."`,
  },
  {
    q: "Does a longer loan term lower my payment?",
    a: `Yes, but it costs more overall. Stretching the example from 60 to 72 months drops the payment from ${money(EX.monthlyPayment)} to ${money(EX_72.monthlyPayment)}, but total interest rises from ${money(EX.totalInterest)} to ${money(EX_72.totalInterest)}.`,
  },
  {
    q: "How does a trade-in affect my car payment?",
    a: "A trade-in works like extra cash down: it reduces the amount you finance, and in most states it also lowers the taxable price, so you pay less sales tax. Both effects shrink your monthly payment.",
  },
  {
    q: "Is sales tax included in the car payment?",
    a: `This calculator rolls sales tax into the amount financed, which is how most auto loans work. In the example, ${money(EX.salesTax)} of tax is added before the down payment and trade-in are applied. Sales tax rates vary by state and locality, so adjust the rate to match yours.`,
  },
];

const STATS = [
  {
    stat: money(EX.monthlyPayment),
    color: "text-blue-600",
    accent: "bg-blue-500",
    label: `${money(35_000)} car, ${money(5_000)} down, ${NEW_APR}% APR, 60 months`,
  },
  {
    stat: money(EX.totalInterest),
    color: "text-rose-600",
    accent: "bg-rose-500",
    label: "Total interest paid over the life of that loan",
  },
  {
    stat: `${NEW_APR}% / ${USED_APR}%`,
    color: "text-amber-600",
    accent: "bg-amber-500",
    label: `Live new / used auto-loan APR (FRED, as of ${RATE_AS_OF})`,
  },
];

const CONTENT_CARDS = [
  {
    icon: "🚗",
    title: "Payment is driven by four numbers",
    body: "The price, your down payment and trade-in, the APR, and the term together set the payment. Cash up front and a shorter term lower it; a higher rate or longer term raise the total you pay.",
  },
  {
    icon: "🏷️",
    title: "New and used carry different rates",
    body: `Used-car loans price higher than new. The calculator opens with the live ${NEW_APR}% new-car rate and switches to ${USED_APR}% when you choose "used" (FRED, ${RATE_AS_OF}) — both fully editable to match your offer.`,
  },
  {
    icon: "🧾",
    title: "Don't forget tax and interest",
    body: "Sales tax is usually financed alongside the car, and interest is the real cost of spreading payments out. Together they push the all-in cost well above the sticker price.",
  },
];

const RELATED_CALCS = [
  {
    title: "Car Loan Payment Calculator",
    description: "Focus on the loan side of an auto purchase.",
    href: "/tools/car-loan-payment-calculator",
    icon: "🚙",
    accent: "bg-blue-500/10",
  },
  {
    title: "Lease Calculator",
    description: "Compare leasing against financing a vehicle.",
    href: "/tools/lease-calculator",
    icon: "📋",
    accent: "bg-emerald-500/10",
  },
  {
    title: "Car Refinance Calculator",
    description: "See if a lower rate could cut your payment.",
    href: "/tools/car-refinance-calculator",
    icon: "🔁",
    accent: "bg-amber-500/10",
  },
  {
    title: "Monthly Payment Calculator",
    description: "Generic monthly payment for any installment loan.",
    href: "/tools/monthly-payment-calculator",
    icon: "💳",
    accent: "bg-violet-500/10",
  },
];

export default function CarPaymentPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Car Payment Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description:
        "Calculate a monthly car payment from vehicle price, down payment, trade-in, sales tax, and the current auto-loan APR, with total interest and amortization.",
      url: "https://worthulator.com/tools/car-payment-calculator",
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
        eyebrowIcon="🚗"
        eyebrowText="Finance · Auto Loans"
        title="Car Payment Calculator"
        description="Turn a vehicle price, down payment, trade-in, sales tax, and today's auto-loan APR into a real monthly payment — with total interest, an amortization curve, and the full cost of the car."
        chips={["Monthly payment", "Total interest", "Cost breakdown"]}
      >
        <CarPaymentCalculatorLoader newApr={NEW_APR} usedApr={USED_APR} rateAsOf={RATE_AS_OF} />
      </SimpleCalculatorHero>

      <InsightStrip
        text={`A ${money(35_000)} car with ${money(5_000)} down at the current ${NEW_APR}% new-car APR (FRED, ${RATE_AS_OF}) runs about <span class="font-semibold text-gray-900">${money(EX.monthlyPayment)}/mo</span> over 60 months — ${money(EX.totalInterest)} in interest.`}
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="What sets your car payment"
        subtitle="Price, cash up front, today's rate, and the cost of tax and interest."
        cards={CONTENT_CARDS}
      />

      <SEOTextBlock
        title="How the Car Payment Calculator Works"
        formula={`salesTax       = max(0, price − tradeIn) × taxRate
amountFinanced = max(0, price + salesTax − downPayment − tradeIn)
r              = APR ÷ 12
monthlyPayment = financed × r ÷ (1 − (1+r)^−n)     (n = term in months)
totalInterest  = monthlyPayment × n − financed
totalCost      = price + salesTax + totalInterest`}
        steps={[
          { label: "Pick new or used", description: `Sets the live default APR (new ${NEW_APR}%, used ${USED_APR}%).` },
          { label: "Enter the price and cash", description: "Vehicle price, down payment, and any trade-in value." },
          { label: "Set the rate and term", description: "Adjust the APR to your offer and choose the loan length." },
          { label: "Match your sales tax", description: "Tax rates vary by state and locality." },
          { label: "Review the payment", description: "See the monthly figure, total interest, and the all-in cost." },
        ]}
        paragraphs={[
          "Sales tax is financed with the car and the trade-in reduces both the taxable price and the amount financed, mirroring how most dealerships structure a deal. The result is an estimate — your lender's exact terms, fees, and any rate add-ons will refine it.",
          `The APR defaults are the current commercial-bank averages from FRED: ${NEW_APR}% new and ${USED_APR}% used, as of ${RATE_AS_OF} (last refreshed ${RATE_UPDATED}). They are editable so you can plug in a pre-approval or dealer quote.`,
        ]}
      />

      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      <RelatedCalcCards
        title="Related Calculators"
        subtitle="Compare loans, leasing, and refinancing your vehicle."
        items={RELATED_CALCS}
      />
    </main>
  );
}
