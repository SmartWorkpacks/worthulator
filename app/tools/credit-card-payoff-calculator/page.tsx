import type { Metadata } from "next";
import { calculateCreditCardPayoff } from "@/calculations/finance/creditCardPayoff";
import EngineWithInsights from "@/components/worthcore/EngineWithInsights";
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
  title: "Credit Card Payoff Calculator 2026 – How Long to Pay Off Your Debt?",
  description:
    "See exactly how many months it takes to pay off your credit card balance, how much interest you'll pay, and the total cost of your debt.",
  keywords: ["credit card payoff calculator", "how long to pay off credit card", "credit card debt calculator", "credit card interest calculator"],
  alternates: { canonical: "https://worthulator.com/tools/credit-card-payoff-calculator" },
};

// ── Step 5c: worked examples derived from the live calculation module ────────
// A $5,000 balance at 22% APR — the figures used throughout the static copy
// below are computed here so they always match the calculator's own logic.
const usd = (n: number) => "$" + Math.round(n).toLocaleString();
const EX_MIN = calculateCreditCardPayoff({ balance: 5000, apr: 22, payment: 100 });
const EX_150 = calculateCreditCardPayoff({ balance: 5000, apr: 22, payment: 150 });
const EX_250 = calculateCreditCardPayoff({ balance: 5000, apr: 22, payment: 250 });
const EX_300 = calculateCreditCardPayoff({ balance: 5000, apr: 22, payment: 300 });
const EX_EXTRA_SAVING = EX_150.interest - EX_250.interest;

const FAQS = [
  {
    q: "How is the payoff timeline calculated?",
    a: "Each month, the calculator applies your APR (divided by 12) to the remaining balance to calculate that month's interest. It then subtracts your fixed monthly payment. This repeats until the balance reaches zero, counting the total months and accumulated interest.",
  },
  {
    q: "What is a good monthly payment to make?",
    a: `Always pay more than the minimum. On a $5,000 balance at 22% APR, paying only $100/month takes ${EX_MIN.payoffYears} years and ${usd(EX_MIN.interest)} in interest to clear. Paying $300/month clears it in ${EX_300.months} months and costs just ${usd(EX_300.interest)} in interest.`,
  },
  {
    q: "What is the difference between APR and interest rate?",
    a: "APR (Annual Percentage Rate) includes interest plus fees. For credit cards, the APR and interest rate are often the same, but balance transfer and promotional cards may have different rates for different transaction types.",
  },
  {
    q: "Should I use the avalanche or snowball method?",
    a: "The avalanche method (pay highest APR first) minimises total interest paid. The snowball method (pay smallest balance first) provides psychological wins. Mathematically, avalanche saves more money — but snowball has higher completion rates for people who struggle with motivation.",
  },
  {
    q: "Is it better to pay off credit cards or invest?",
    a: "If your credit card APR is 20%+, paying it off is equivalent to earning a guaranteed 20% return — which no investment reliably delivers. Always pay off high-interest debt before investing, except for any employer match on a 401(k).",
  },
];

const STATS = [
  { stat: "$6,501", color: "text-red-600", accent: "bg-red-500", label: "average credit card debt per US household carrying a balance in 2024" },
  { stat: "22%", color: "text-amber-600", accent: "bg-amber-500", label: "average credit card APR in the US — a record high as of 2024" },
  { stat: `${EX_MIN.payoffYears} yrs`, color: "text-blue-600", accent: "bg-blue-500", label: "how long it takes to pay off $5,000 at 22% APR paying only $100/month" },
];

const CONTENT_CARDS = [
  {
    icon: "💳",
    title: "Minimum payments are a trap",
    body: `Credit card minimum payments are designed to keep you in debt for as long as possible. A $5,000 balance at 22% APR paying only $100/month takes ${EX_MIN.payoffYears} years to clear and costs ${usd(EX_MIN.interest)} in interest — more than the original balance.`,
  },
  {
    icon: "📉",
    title: "Extra payments have outsized impact",
    body: `Increasing your monthly payment from $150 to $250 on a $5,000 balance at 22% cuts your payoff time from ${EX_150.payoffYears} years to ${EX_250.payoffYears} years and saves ${usd(EX_EXTRA_SAVING)} in interest. Small increases compound dramatically.`,
  },
  {
    icon: "🔀",
    title: "Balance transfers can accelerate payoff",
    body: "A 0% APR balance transfer card can halt interest charges for 12–21 months. Every payment goes directly to principal. Even with a 3–5% transfer fee, it is usually significantly cheaper than staying at 20%+ APR.",
  },
];

const RELATED_CALCS = [
  { title: "Debt Payoff Calculator", description: "Snowball or avalanche — plan your full debt payoff.", href: "/tools/debt-payoff-calculator", icon: "🏔️", accent: "bg-red-500/10" },
  { title: "Loan Calculator", description: "Calculate any loan payment and total interest.", href: "/tools/loan-calculator", icon: "🏦", accent: "bg-blue-500/10" },
  { title: "Emergency Fund Calculator", description: "Build a buffer to stop going back into debt.", href: "/tools/emergency-fund-calculator", icon: "🛡️", accent: "bg-emerald-500/10" },
  { title: "Net Worth Calculator", description: "Track your total assets vs liabilities.", href: "/tools/net-worth-calculator", icon: "📊", accent: "bg-amber-500/10" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Credit Card Payoff Calculator",
      url: "https://worthulator.com/tools/credit-card-payoff-calculator",
      applicationCategory: "FinanceApplication",
      description: "Calculate how long it takes to pay off a credit card balance and the total interest paid.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function CreditCardPayoffCalculator() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SimpleCalculatorHero
        eyebrowIcon="💳"
        eyebrowText="Credit Card Payoff"
        title="How Long Until Your Credit Card Is Paid Off?"
        description="Enter your balance, APR, and monthly payment to see exactly how many months it takes to clear your debt and the total interest you will pay."
        chips={["Months to payoff", "Total interest", "Total cost"]}
      >
        <EngineWithInsights slug="credit-card-payoff-calculator" />
      </SimpleCalculatorHero>
      <InsightStrip text="Paying just $100 more per month can cut your payoff time by years." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="Get out of credit card debt faster" cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the Credit Card Payoff Calculator Works"
        paragraphs={[
          "Enter your current balance, annual APR, and the fixed monthly payment you will make. The calculator applies monthly interest (APR ÷ 12) to the remaining balance each month, subtracts your payment, and repeats until the balance reaches zero — counting months and total interest.",
          "Try increasing the payment slider to see how dramatically extra payments reduce both the payoff period and total interest. Even small increases have a significant impact when compounded over years.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
