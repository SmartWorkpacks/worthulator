import type { Metadata } from "next";
import CalculatorEngineLoader from "@/components/calculator-engine/CalculatorEngineLoader";
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
  title: "Credit Card Interest Calculator 2026 – See What Your Balance Really Costs",
  description:
    "Find out exactly how long it takes to pay off your credit card and how much interest you'll pay. Enter your balance, APR, and monthly payment for an instant breakdown.",
  keywords: [
    "credit card interest calculator",
    "credit card payoff calculator",
    "how long to pay off credit card",
    "credit card debt calculator",
    "minimum payment calculator",
    "APR calculator",
  ],
  alternates: { canonical: "https://worthulator.com/tools/credit-card-interest" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "How is credit card interest calculated?",
    a: "Credit card interest is calculated daily. Your APR is divided by 365 to get a daily rate, which is applied to your outstanding balance each day. At the end of the billing cycle, these daily charges are summed. This is why carrying a balance — even a few days after the due date — can be expensive at typical APRs of 20–29%.",
  },
  {
    q: "What happens if I only make minimum payments?",
    a: "Minimum payments are typically 1–3% of your balance. At a 22% APR, a $3,000 balance with $60 minimum payments takes over 8 years to clear and costs more than $2,500 in interest alone — nearly doubling the original debt. This calculator shows exactly how much time and money different payment amounts save.",
  },
  {
    q: "What is a good monthly payment to make?",
    a: "A good rule of thumb is to pay at least 3× the minimum payment, or set a target payoff date and work backwards. Doubling your minimum payment can cut repayment time by 50–70% and save thousands in interest. Use the calculator above to find the payment that makes sense for your budget.",
  },
  {
    q: "What does APR mean on a credit card?",
    a: "APR stands for Annual Percentage Rate — the yearly interest rate charged on any unpaid balance. Most credit cards charge 19–29% APR in 2026. You pay no interest if you pay your full statement balance each month before the due date. Interest only applies when you carry a balance.",
  },
  {
    q: "Does the payment cover the interest warning mean?",
    a: "If your monthly payment is less than the monthly interest charge (APR ÷ 12 × balance), your balance will actually grow every month even though you're making payments. At 22% APR on a $3,000 balance, the minimum interest charge is $55/month — any payment below that means the debt grows indefinitely.",
  },
];

const STATS = [
  { stat: "22%",   color: "text-red-600",    accent: "bg-red-500",    label: "Average credit card APR in the US in 2026 — among the highest consumer borrowing rates" },
  { stat: "8 yrs", color: "text-amber-600",  accent: "bg-amber-500",  label: "How long a $3,000 balance takes to clear on minimum payments at 22% APR" },
  { stat: "2×",    color: "text-emerald-600", accent: "bg-emerald-500", label: "Typical total amount paid vs original balance when only making minimum payments" },
];

const CONTENT_CARDS = [
  {
    icon: "📈",
    title: "Daily compounding makes APR brutal",
    body: "At 22% APR, you're paying 0.060% per day on your balance. That sounds tiny — but on a $5,000 balance it's $3/day, $90/month, $1,100/year in pure interest before you've paid down a single dollar of the original debt. The only way to stop it is to pay faster than interest accrues.",
  },
  {
    icon: "💡",
    title: "Doubling your payment has a massive effect",
    body: "If you're paying $100/month on a $3,000 balance at 22% APR, increasing to $200/month cuts the repayment time from 46 months to 18 months — saving 28 months and over $900 in interest. Small payment increases have a disproportionately large impact because of how compound interest works in reverse.",
  },
  {
    icon: "🎯",
    title: "Target a payoff date, not a payment amount",
    body: "Instead of asking 'what can I afford?', ask 'when do I want this gone?' If you want your $4,000 balance cleared in 12 months at 22% APR, you need to pay around $375/month. Working backwards from a goal is more motivating — and this calculator makes it easy to find that number.",
  },
];

const RELATED_CALCS = [
  { title: "Debt Payoff Calculator",       description: "Tackle multiple debts with avalanche or snowball.",  href: "/tools/debt-payoff-calculator",       icon: "❄️", accent: "bg-blue-500/10" },
  { title: "Loan Calculator",              description: "Monthly payments and amortization for any loan.",     href: "/tools/loan-calculator",              icon: "🏦", accent: "bg-emerald-500/10" },
  { title: "Take Home Pay Calculator",     description: "See your net income to budget repayments from.",      href: "/tools/take-home-pay-calculator",     icon: "💰", accent: "bg-amber-500/10" },
  { title: "Emergency Fund Calculator",    description: "Build a buffer so you never need to carry a balance.", href: "/tools/emergency-fund-calculator",   icon: "🛡️", accent: "bg-purple-500/10" },
];

export default function CreditCardInterestPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Credit Card Interest Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description:
        "See how long it takes to pay off your credit card and how much interest you'll pay with fixed monthly payments.",
      url: "https://worthulator.com/tools/credit-card-interest",
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
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <SimpleCalculatorHero
        eyebrowIcon="💳"
        eyebrowText="Finance · Debt"
        title="Credit Card Interest Calculator"
        description="Enter your balance, APR, and monthly payment to see exactly how long payoff takes and how much interest you'll pay in total."
        chips={["Months to pay off", "Total interest cost", "Warning if payment is too low"]}
      >
        <CalculatorEngineLoader slug="credit-card-interest" />
      </SimpleCalculatorHero>
      <InsightStrip text='At 22% APR, a $3,000 balance on minimum payments costs over <span class="font-semibold text-gray-900">$2,500 in interest</span> and takes 8 years to clear.' />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid
        title="Why credit card debt is so expensive"
        subtitle="What high APRs and minimum payments actually mean for your money."
        cards={CONTENT_CARDS}
      />
      <SEOTextBlock
        title="How the Credit Card Interest Calculator Works"
        formula={`Monthly Interest  = Balance × (APR ÷ 12 ÷ 100)
Remaining Balance = Balance + Monthly Interest − Payment
Repeat until Balance ≤ 0 → count the months`}
        steps={[
          { label: "Enter your current balance", description: "The total amount owed on the card right now." },
          { label: "Enter your APR", description: "Find this on your card statement or online account. Typical range: 19–29% in 2026." },
          { label: "Set your monthly payment", description: "Try different amounts to see the impact. The calculator warns you if the payment doesn't cover interest." },
          { label: "Read your payoff date and total cost", description: "See months to clear the debt, total interest paid, and what percentage of every payment is pure interest." },
        ]}
        paragraphs={[
          "This calculator simulates month-by-month repayment using simple amortisation logic. Each month, interest is calculated on the remaining balance and subtracted from your payment. The remainder reduces principal.",
          "It does not account for new purchases, cash advances, balance transfers, or promotional rates. For a true payoff date, stop using the card and make fixed payments only.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />
      <RelatedCalcCards
        title="Related Calculators"
        subtitle="More tools for managing and eliminating debt."
        items={RELATED_CALCS}
      />
    </main>
  );
}
