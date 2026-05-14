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
  title: "Savings Calculator 2026 – Project Your Savings Growth",
  description:
    "Calculate how much your savings will grow over time. Enter your starting balance, monthly contributions, interest rate, and time horizon for an instant projection.",
  keywords: ["savings calculator", "savings growth calculator", "compound savings calculator", "how much will my savings grow", "monthly savings calculator"],
  alternates: { canonical: "https://worthulator.com/tools/savings-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "How does a savings account grow?",
    a: "Savings accounts grow through interest — the bank pays you a percentage of your balance periodically. With compound interest, that interest is added to your balance and then earns interest itself, accelerating growth over time.",
  },
  {
    q: "What is a good interest rate for a savings account?",
    a: "Traditional savings accounts often pay 0.5–1%. High-yield savings accounts (HYSAs) — typically offered by online banks — often pay 4–5% or more. Even a small rate difference compounds into thousands of dollars over a decade.",
  },
  {
    q: "How much should I save each month?",
    a: "A common benchmark is the 50/30/20 rule — save 20% of your take-home pay. But any consistent amount helps. Even $50/month at 4.5% interest grows to over $7,500 in 10 years — all from habit, not a windfall.",
  },
  {
    q: "How much should I have in an emergency fund?",
    a: "Most financial experts recommend 3–6 months of living expenses. If your monthly expenses are $3,000, aim for $9,000–$18,000 in an accessible, liquid savings account before allocating money to longer-term investments.",
  },
  {
    q: "Does compound frequency matter?",
    a: "Yes, but the difference is smaller than most people expect. Monthly compounding vs. annual compounding on the same rate makes a meaningful difference only over very long periods. The rate itself and your contribution consistency matter far more.",
  },
];

const STATS = [
  { stat: "4–5%",   color: "text-emerald-600", accent: "bg-emerald-500", label: "Annual yield on high-yield savings accounts in 2026 — 10× higher than traditional banks" },
  { stat: "$7,500", color: "text-blue-600",    accent: "bg-blue-500",    label: "$50/month for 10 years at 4.5% — proof that small habits build real money" },
  { stat: "3–6mo",  color: "text-amber-600",   accent: "bg-amber-500",   label: "Emergency fund target that financial experts recommend before investing" },
];

const CONTENT_CARDS = [
  {
    icon: "🏦",
    title: "The high-yield savings advantage",
    body: "Traditional bank savings accounts pay 0.01–0.5%. High-yield savings accounts at online banks often pay 10–20× more. Moving $10,000 from 0.5% to 4.5% earns an extra $400/year — just from switching accounts.",
  },
  {
    icon: "📅",
    title: "Monthly contributions beat lump sums",
    body: "Most people don't have a lump sum to deposit. The good news: consistent monthly contributions are actually more powerful than you think. $200/month for 10 years at 4.5% grows to over $30,000 — from a habit, not a windfall.",
  },
  {
    icon: "🛡️",
    title: "Emergency fund first, then invest",
    body: "Before chasing higher investment returns, build a 3–6 month emergency fund in a liquid savings account. It removes the risk of liquidating investments at a loss when life happens. Financial resilience before financial growth.",
  },
];

const RELATED_CALCS = [
  {
    title: "Future Value Calculator",
    description: "Project what a lump sum or investment grows to over time.",
    href: "/tools/future-value-calculator",
    icon: "📈",
    accent: "bg-emerald-500/10",
  },
  {
    title: "Compound Interest Calculator",
    description: "See how interest compounds on a lump sum.",
    href: "/tools/compound-interest-calculator",
    icon: "📊",
    accent: "bg-blue-500/10",
  },
  {
    title: "Investment Calculator",
    description: "Model portfolio growth with regular contributions.",
    href: "/tools/investment-calculator",
    icon: "💼",
    accent: "bg-amber-500/10",
  },
  {
    title: "Retirement Calculator",
    description: "Project savings, income, and retirement readiness.",
    href: "/tools/retirement-calculator",
    icon: "🏡",
    accent: "bg-purple-500/10",
  },
];

export default function SavingsCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Savings Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description: "Calculate how much your savings will grow with compound interest over time.",
      url: "https://worthulator.com/tools/savings-calculator",
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
        eyebrowIcon="🏦"
        eyebrowText="Savings · Compound Growth"
        title="Savings Calculator"
        description="See how your savings grow over time — enter your balance, monthly contributions, and interest rate for an instant projection."
        chips={["Compound interest", "Monthly contribution impact", "High-yield vs standard rates"]}
      >
        <CalculatorEngineLoader slug="savings-calculator" />
      </SimpleCalculatorHero>

      <InsightStrip
        text='Saving consistently — even small amounts — is how most wealth is built. <span class="font-semibold text-gray-900">Compound interest rewards patience above everything else.</span>'
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="What this means for your savings"
        subtitle="Small, consistent habits outperform one-time windfalls over time."
        cards={CONTENT_CARDS}
      />

      <SEOTextBlock
        title="How the Savings Calculator Works"
        formula={`FV = P × (1 + r/n)^(nt) + PMT × (((1 + r/n)^(nt) − 1) / (r/n))

Where:
  P   = Initial balance (starting savings)
  PMT = Monthly contribution (adjusted for compound period)
  r   = Annual interest rate (as a decimal)
  n   = Compounds per year (12 for monthly)
  t   = Years`}
        steps={[
          { label: "Enter your starting balance", description: "The amount you already have saved — can be $0 if you're starting fresh." },
          { label: "Set your monthly contribution", description: "How much you'll add each month. Even $50 makes a significant difference over a decade." },
          { label: "Enter your interest rate", description: "Check your account's APY. High-yield savings accounts typically offer 4–5% in 2026." },
          { label: "Choose your time horizon", description: "How many years you'll save for. The longer, the more powerful the compounding." },
          { label: "Select compound frequency", description: "Most savings accounts compound monthly. Annual compounding gives slightly lower results." },
        ]}
        paragraphs={[
          "This calculator uses the standard compound interest formula. Monthly contributions are converted to match your chosen compound frequency for accurate results.",
          "High-yield savings accounts (HYSAs) from online banks typically pay 4–5% APY — dramatically more than traditional savings accounts. The rate difference alone can mean tens of thousands of dollars over 10–20 years.",
        ]}
      />

      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      <RelatedCalcCards
        title="Related Calculators"
        subtitle="Tools that work well alongside your savings plan."
        items={RELATED_CALCS}
      />
    </main>
  );
}
