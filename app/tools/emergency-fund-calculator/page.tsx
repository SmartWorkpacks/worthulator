import type { Metadata } from "next";
import EmergencyFundCalculatorLoader from "./EmergencyFundCalculatorLoader";
import SimpleCalculatorHero from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import StandardFAQSection from "@/src/templates/take-home-pay/StandardFAQSection";
import {
  StatChipsRow, ContentCardGrid, SEOTextBlock, InsightStrip, RelatedCalcCards,
} from "@/src/templates/take-home-pay/StandardSEOSection";
import { HYSA_APY } from "@/lib/calculators/emergencyFundEngine";

export const metadata: Metadata = {
  title: "Emergency Fund Calculator 2026 – How Much Do You Need?",
  description:
    "Calculate your exact emergency fund target based on your real monthly expenses. See how many months you're covered, how much you still need, and when you'll be fully funded.",
  keywords: ["emergency fund calculator", "how much emergency fund", "emergency savings calculator", "3 month emergency fund", "6 month emergency fund"],
  alternates: { canonical: "https://worthulator.com/tools/emergency-fund-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "How much should I have in my emergency fund?",
    a: "The standard recommendation is 3–6 months of essential living expenses. If you have dependants, variable income (freelance/self-employed), or work in a volatile industry, 6–12 months is safer. If you have very stable employment and no dependants, 3 months may suffice.",
  },
  {
    q: "What expenses should I include?",
    a: "Include only essential, non-negotiable expenses: housing, utilities, food, transport, insurance, and minimum debt payments. Do not include discretionary spending like dining out, entertainment, or holidays — those would be cut first in a real emergency.",
  },
  {
    q: "Where should I keep my emergency fund?",
    a: "A high-yield savings account (HYSA) is the gold standard: FDIC insured, liquid (accessible within 1–2 business days), and earning meaningful interest. Avoid keeping it in a standard checking account (too tempting to spend) or invested in stocks (too volatile and illiquid).",
  },
  {
    q: "Should I build an emergency fund or pay off debt first?",
    a: "Most financial planners recommend a 'starter' emergency fund of $1,000 first, then aggressively paying off high-interest debt (credit cards), then building to a full 3–6 month fund. Having some emergency savings prevents you from going back into debt when unexpected expenses hit.",
  },
  {
    q: "Can I use a credit card as an emergency fund?",
    a: "No. Credit cards are not an emergency fund — they're debt. Using a card in an emergency means paying 20%+ APR on top of the original emergency cost. A real emergency fund is liquid cash that costs you nothing to use and earns interest while you wait.",
  },
];

const STATS = [
  { stat: "57%",    color: "text-red-600",     accent: "bg-red-500",     label: "Americans who can't cover a $1,000 emergency without going into debt" },
  { stat: "3–6mo",  color: "text-emerald-600", accent: "bg-emerald-500", label: "Recommended emergency fund coverage — enough to handle job loss, medical emergency, or major repair" },
  { stat: "$1,000", color: "text-amber-600",   accent: "bg-amber-500",   label: "Starter emergency fund target — the first milestone that protects you from small emergencies becoming big ones" },
];

const CONTENT_CARDS = [
  {
    icon: "🛡️",
    title: "Your emergency fund is financial insurance",
    body: "Without an emergency fund, one car repair, medical bill, or job loss turns into credit card debt at 20%+ APR. With one, the same event is an inconvenience. The emergency fund is the single highest-return 'investment' most people can make.",
  },
  {
    icon: "🏦",
    title: "Keep it in a high-yield savings account",
    body: "The average big bank savings account pays 0.01% APY. High-yield savings accounts (online banks like Marcus, Ally, or SoFi) currently pay 4–5% APY. On a $10,000 emergency fund, that's $400–$500/year for doing nothing differently.",
  },
  {
    icon: "📊",
    title: "Self-employed? You need more",
    body: "If your income is irregular — freelancer, contractor, business owner — 6–12 months is the minimum. Income gaps are common, and a single dry month with no emergency cushion can cascade into missed payments, credit damage, and high-interest borrowing.",
  },
];

const RELATED_CALCS = [
  {
    title: "Savings Calculator",
    description: "Project how your savings grow over time with compound interest.",
    href: "/tools/savings-calculator",
    icon: "💰",
    accent: "bg-emerald-500/10",
  },
  {
    title: "Debt Payoff Calculator",
    description: "Build your emergency fund first, then tackle debt with the avalanche or snowball method.",
    href: "/tools/debt-payoff-calculator",
    icon: "🏔️",
    accent: "bg-red-500/10",
  },
  {
    title: "Net Worth Calculator",
    description: "See your full financial picture — assets, liabilities, and net worth.",
    href: "/tools/net-worth-calculator",
    icon: "📊",
    accent: "bg-blue-500/10",
  },
  {
    title: "Budget Calculator",
    description: "Allocate your income across spending, saving, and investing.",
    href: "/tools/budget-calculator",
    icon: "📋",
    accent: "bg-violet-500/10",
  },
];

export default function EmergencyFundCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Emergency Fund Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description: "Calculate your emergency fund target based on real monthly expenses, with coverage tracking and funding timeline.",
      url: "https://worthulator.com/tools/emergency-fund-calculator",
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
        eyebrowIcon="🛡️"
        eyebrowText="Savings · Financial Safety Net"
        title="Emergency Fund Calculator"
        description="Find out exactly how much you need in your emergency fund — based on your actual monthly expenses. See your current coverage and when you'll be fully funded."
        chips={["Expense-by-expense breakdown", "Months of coverage", "Funding timeline"]}
      >
        <EmergencyFundCalculatorLoader />
      </SimpleCalculatorHero>

      <InsightStrip
        text='57% of Americans can&apos;t cover a $1,000 emergency without debt. <span class="font-semibold text-gray-900">Your emergency fund is not optional</span> — it&apos;s the foundation everything else is built on.'
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="Why your emergency fund is your most important financial asset"
        subtitle="It's not an investment — it's insurance. And it's non-negotiable."
        cards={CONTENT_CARDS}
      />

      <SEOTextBlock
        title="How the Emergency Fund Calculator Works"
        formula={`Total Monthly Expenses = Rent + Food + Utilities + Transport + Insurance + Subscriptions + Other

Target Amount = Total Monthly Expenses × Target Months

Current Coverage = Current Savings / Total Monthly Expenses

Amount Still Needed = Target Amount − Current Savings (min 0)

Months to Goal = Amount Still Needed / Monthly Savings Rate`}
        steps={[
          { label: "Enter your essential expenses", description: "Only non-negotiable monthly costs — housing, food, utilities, transport, insurance." },
          { label: "Choose your target coverage",   description: "3 months minimum · 6 months recommended · 12 months for maximum security." },
          { label: "Enter current savings",         description: "How much you already have set aside in an accessible account." },
          { label: "Set your monthly savings rate", description: "How much you can put toward the emergency fund each month." },
          { label: "See your timeline",             description: "Your target amount, current coverage, and the exact month you'll be fully funded." },
        ]}
        paragraphs={[
          "The key insight of this calculator is that your emergency fund target is personal — it's based on YOUR expenses, not a generic national average. A person with $800/month in expenses needs a very different fund than someone paying $3,000/month in rent alone.",
          "The progress chart shows exactly when you'll hit your goal at your current savings rate. Use the What-If buttons to see how increasing your monthly contribution by $100 or $200 cuts months off your timeline.",
          `Because an emergency fund sits in cash, inflation matters too. The calculator pulls the live CPI inflation rate and compares the yearly interest your target would earn in a ~${HYSA_APY}% high-yield savings account against the inflation drift on that target — so you can see whether your safety net is holding its real value or quietly shrinking.`,
        ]}
      />

      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      <RelatedCalcCards
        title="Related Calculators"
        subtitle="Build your complete financial foundation."
        items={RELATED_CALCS}
      />
    </main>
  );
}
