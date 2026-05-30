import type { Metadata } from "next";
import CalculatorEngineLoader from "@/components/calculator-engine/CalculatorEngineLoader";
import SimpleCalculatorHero from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import StandardFAQSection from "@/src/templates/take-home-pay/StandardFAQSection";
import {
  StatChipsRow, ContentCardGrid, SEOTextBlock, InsightStrip, RelatedCalcCards,
} from "@/src/templates/take-home-pay/StandardSEOSection";
import InsightsSection from "@/components/insights/InsightsSection";
import InsightTable from "@/components/insights/InsightTable";

export const metadata: Metadata = {
  title: "Car Loan Calculator 2026 – Monthly Payment & Total Interest",
  description:
    "Calculate your exact monthly car payment, total interest paid, and the true cost of any vehicle loan. Supports loan terms from 24 to 84 months.",
  keywords: ["car loan calculator", "auto loan calculator", "monthly car payment calculator", "car payment estimator", "auto loan payment"],
  alternates: { canonical: "https://worthulator.com/tools/car-loan-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "How is a car loan payment calculated?",
    a: "Monthly Payment = Loan Amount × [r × (1+r)^n] / [(1+r)^n − 1], where r is the monthly interest rate (APR ÷ 12) and n is the number of months. The loan amount is the vehicle price minus your down payment and any trade-in credit.",
  },
  {
    q: "Should I choose a 60-month or 72-month loan?",
    a: "A longer term lowers your monthly payment but significantly increases total interest paid. A 60-month vs 72-month loan on $25,000 at 7% APR: the 60-month costs $4,561 in interest; the 72-month costs $5,491 — $930 more for the same car. Choose the shortest term you can comfortably afford.",
  },
  {
    q: "What is a good APR for a car loan in 2026?",
    a: "For borrowers with excellent credit (750+), new car loan APRs in 2026 typically range from 5–7%. For good credit (700–749), expect 7–9%. For fair credit (650–699), 9–14%. Used car loans generally carry rates 1–3% higher than new car loans for the same credit profile.",
  },
  {
    q: "How does a trade-in affect my loan?",
    a: "Your trade-in value is applied directly to the purchase price, reducing the loan amount. A $5,000 trade-in on a $30,000 vehicle reduces your loan to $25,000 (minus down payment). This reduces both your monthly payment and total interest paid.",
  },
  {
    q: "How much car can I actually afford?",
    a: "A common rule of thumb: your total monthly car payment should not exceed 10–15% of your monthly take-home pay. A separate rule: the total cost of owning a car (payment + insurance + fuel + maintenance) should stay under 20% of take-home pay. Use the calculator to check if a vehicle fits within those guardrails.",
  },
];

const STATS = [
  { stat: "$735",   color: "text-red-600",    accent: "bg-red-500",    label: "Average monthly new car payment in the US — up significantly from pre-2020 levels" },
  { stat: "68 mo",  color: "text-amber-600",  accent: "bg-amber-500",  label: "Average loan term for new vehicles — the drift toward longer terms increases total interest paid" },
  { stat: "~7%",    color: "text-emerald-600",accent: "bg-emerald-500",label: "Approximate average APR for new car loans in 2026 for borrowers with good credit" },
];

const CONTENT_CARDS = [
  {
    icon: "📊",
    title: "Longer terms cost more — always",
    body: "Stretching a car loan from 48 to 72 months reduces your monthly payment but adds thousands in total interest. On a $28,000 loan at 7% APR, the difference between 48 and 72 months is over $1,500 in extra interest. Run the numbers before choosing convenience.",
  },
  {
    icon: "💰",
    title: "Down payment cuts both payment and interest",
    body: "A larger down payment reduces the principal — which reduces both the monthly payment and total interest over the life of the loan. It also improves your loan-to-value ratio, which can qualify you for a lower APR. Aim for at least 10–20% down on a new vehicle.",
  },
  {
    icon: "🔄",
    title: "Your trade-in is a silent down payment",
    body: "Many buyers focus on the new car's price and forget that their trade-in is effectively cash. A $6,000 trade-in reduces your loan principal by $6,000 — the equivalent of a $6,000 down payment. Negotiate the trade-in value and purchase price separately to maximise both.",
  },
];

const RELATED_CALCS = [
  {
    title: "Loan Calculator",
    description: "Calculate payments and interest for any type of loan.",
    href: "/tools/loan-calculator",
    icon: "🏦",
    accent: "bg-blue-500/10",
  },
  {
    title: "Road Trip Cost Calculator",
    description: "Estimate fuel cost for any drive based on distance and MPG.",
    href: "/tools/road-trip-cost",
    icon: "⛽",
    accent: "bg-amber-500/10",
  },
  {
    title: "Savings Goal Calculator",
    description: "Calculate how much to save monthly to hit any financial target.",
    href: "/tools/savings-goal-calculator",
    icon: "🎯",
    accent: "bg-emerald-500/10",
  },
  {
    title: "Mortgage Calculator",
    description: "Calculate your monthly mortgage payment and amortisation.",
    href: "/tools/mortgage-calculator",
    icon: "🏠",
    accent: "bg-violet-500/10",
  },
];

export default function CarLoanCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Car Loan Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description: "Calculate monthly car loan payment, total interest paid, and true vehicle cost for any loan term and APR.",
      url: "https://worthulator.com/tools/car-loan-calculator",
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
        eyebrowText="Auto Finance · Loans"
        title="Car Loan Calculator"
        description="Enter the vehicle price, down payment, trade-in, interest rate, and loan term to see your exact monthly payment and total interest."
        chips={["Monthly payment", "Total interest paid", "True cost of vehicle"]}
      >
        <CalculatorEngineLoader slug="car-loan-calculator" afterResults={<InsightsSection slug="car-loan-calculator" />} />
      </SimpleCalculatorHero>

      <InsightStrip
        text='The sticker price is just the beginning. <span class="font-semibold text-gray-900">Interest on a typical 60-month car loan adds $3,000–$6,000 to the real cost.</span> Know the number before you sign.'
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="What dealers don't volunteer about your car loan"
        subtitle="Monthly payment is only one number. Here are the three that actually matter."
        cards={CONTENT_CARDS}
      />
      <InsightTable slug="car-loan-calculator" />

      <SEOTextBlock
        title="How the Car Loan Calculator Works"
        formula={`Loan Amount = Vehicle Price − Down Payment − Trade-In

r = Annual Interest Rate / 100 / 12   (monthly rate)
n = Loan Term (months)

Monthly Payment = Loan × [r × (1+r)^n] / [(1+r)^n − 1]

Total Interest = (Monthly Payment × n) − Loan Amount
Total Cost     = (Monthly Payment × n) + Down Payment + Trade-In`}
        steps={[
          { label: "Enter the vehicle price", description: "The agreed purchase price, not MSRP. Negotiate the price first, then discuss financing." },
          { label: "Add down payment and trade-in", description: "Both reduce the loan principal. The trade-in value shows as a separate line on the deal sheet." },
          { label: "Set the APR and term", description: "Get a pre-approval from a bank or credit union before visiting the dealer — it gives you a rate benchmark." },
          { label: "Read the three outputs", description: "Monthly payment, total interest paid, and the true total cost of the vehicle over the life of the loan." },
        ]}
        paragraphs={[
          "Car dealers are highly skilled at focusing your attention on the monthly payment while obscuring the total cost. A dealer who stretches your loan from 60 to 72 months drops your monthly payment by ~$80 — but adds over $1,000 in total interest and keeps you underwater on the loan longer.",
          "The best position to negotiate from: get pre-approved at your bank or a credit union before you go to the dealer. Walk in with a rate in hand. The dealer can then try to beat it — or you use your pre-approval. This separates the purchase price negotiation from the financing negotiation.",
        ]}
      />

      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      <RelatedCalcCards
        title="Related Calculators"
        subtitle="More tools for smart financial decisions."
        items={RELATED_CALCS}
      />
    </main>
  );
}
