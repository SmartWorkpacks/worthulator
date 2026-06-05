import type { Metadata } from "next";
import SavingsCalcWithInsights from "@/components/worthcore/SavingsCalcWithInsights";
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
  title: "Savings Calculator 2026 – Will Your Savings Beat Inflation?",
  description:
    "Project your savings growth and see whether your interest rate actually beats inflation. Get your balance in today's dollars, real return, and how much a high-yield account adds — using live CPI data.",
  keywords: ["savings calculator", "savings growth calculator", "real return savings", "does my savings beat inflation", "high-yield savings calculator", "savings calculator inflation adjusted"],
  alternates: { canonical: "https://worthulator.com/tools/savings-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "Will my savings actually beat inflation?",
    a: "Only if your APY is higher than the inflation rate. At a 4.5% high-yield rate against ~3.2% inflation, you earn roughly a 1.3% real return — your money genuinely grows in buying power. At a typical 2% legacy bank rate, you'd be losing ground every year even though the balance rises on paper.",
  },
  {
    q: "What's the difference between my balance and 'today's dollars'?",
    a: "The headline balance is the nominal number you'll see in the account. 'Today's dollars' (the real value) adjusts that figure for inflation so it reflects what it can actually buy. In the default example, a $53,194 balance after 10 years is worth about $38,821 in today's purchasing power.",
  },
  {
    q: "What is a good interest rate for a savings account?",
    a: "Traditional savings accounts often pay 0.4–1%. High-yield savings accounts (HYSAs) from online banks typically pay 4–5%. The gap is huge over time: on $5,000 + $300/month for 10 years, a 4.5% account earns roughly $11,000 more interest than the ~0.45% national average.",
  },
  {
    q: "How much should I save each month?",
    a: "A common benchmark is the 50/30/20 rule — save 20% of your take-home pay. But any consistent amount compounds. $300/month plus a $5,000 start at 4.5% grows to about $53,000 in 10 years, of which roughly $12,000 is interest you never deposited.",
  },
  {
    q: "How much should I have in an emergency fund?",
    a: "Most experts recommend 3–6 months of living expenses in a liquid, high-yield savings account. If your monthly expenses are $3,000, aim for $9,000–$18,000 before moving money to longer-term, less-accessible investments.",
  },
];

const STATS = [
  { stat: "1.3%",     color: "text-emerald-600", accent: "bg-emerald-500", label: "Real return on a 4.5% account vs ~3.2% live inflation — the only growth that builds buying power" },
  { stat: "$11,149",  color: "text-blue-600",    accent: "bg-blue-500",    label: "Extra interest a 4.5% high-yield account earns vs a 0.45% legacy bank (default $5k + $300/mo, 10 yrs)" },
  { stat: "3–6mo",    color: "text-amber-600",   accent: "bg-amber-500",   label: "Emergency fund target experts recommend in liquid savings before investing" },
];

const CONTENT_CARDS = [
  {
    icon: "🛡️",
    title: "Beating inflation is the real goal",
    body: "A balance that grows on paper isn't the same as growing wealth. If your APY trails inflation, each year your savings buy less. The real return — your rate minus inflation — is the number that actually matters. At 4.5% against ~3.2% inflation, that's about +1.3% per year in true buying power.",
  },
  {
    icon: "🏦",
    title: "The high-yield savings advantage",
    body: "The FDIC national average savings rate is around 0.45%. High-yield accounts at online banks pay 4–5%. On a $5,000 start plus $300/month for 10 years, that gap is worth roughly $11,000 in extra interest — free money for simply moving accounts.",
  },
  {
    icon: "📅",
    title: "Consistency beats windfalls",
    body: "Most people don't have a lump sum — and they don't need one. Steady monthly deposits do the heavy lifting: $300/month plus a $5,000 start at 4.5% reaches about $53,000 in a decade, with roughly $12,000 of that coming from interest alone.",
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
      description: "Project savings growth, see your balance in today's dollars, and check whether your rate beats inflation using live CPI data.",
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
        eyebrowText="Savings · Real Growth"
        title="Savings Calculator"
        description="Project your savings growth and see whether your rate actually beats inflation — your balance, its value in today's dollars, and your real return, using live CPI data."
        chips={["Beats-inflation check", "Value in today's dollars", "High-yield vs legacy bank"]}
      >
        <SavingsCalcWithInsights />
      </SimpleCalculatorHero>

      <InsightStrip
        text='A rising balance isn&apos;t the same as growing wealth. <span class="font-semibold text-gray-900">Only the return above inflation actually builds buying power.</span>'
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="What this means for your savings"
        subtitle="Small, consistent habits outperform one-time windfalls over time."
        cards={CONTENT_CARDS}
      />

      <SEOTextBlock
        title="How the Savings Calculator Works"
        formula={`Balance = P × (1 + r/12)^(12t) + PMT × (((1 + r/12)^(12t) − 1) / (r/12))

Real return  = APY − inflation
Today's $    = Balance ÷ (1 + inflation)^t

Where:
  P   = Starting balance
  PMT = Monthly deposit
  r   = Annual APY (as a decimal)
  t   = Years
  inflation = live FRED CPI rate`}
        steps={[
          { label: "Enter your starting balance", description: "The amount you already have saved — can be $0 if you're starting fresh." },
          { label: "Set your monthly deposit", description: "How much you'll add each month. Even $300 reaches about $53,000 in 10 years at 4.5%." },
          { label: "Enter your APY", description: "Use your account's real rate. High-yield savings accounts typically pay 4–5%; legacy banks average ~0.45%." },
          { label: "Choose your time horizon", description: "How many years you'll save. The longer the horizon, the larger the compounding slice." },
          { label: "Read the real return", description: "The calculator subtracts live inflation so you can see whether your money is actually gaining buying power." },
        ]}
        paragraphs={[
          "Interest compounds monthly on your balance plus every deposit. With the default $5,000 start and $300/month at 4.5% APY, the balance reaches about $53,194 over 10 years — roughly $12,194 of that is interest you never deposited.",
          "But the nominal number hides inflation. Using the live FRED CPI rate (~3.2%), that $53,194 is worth about $38,821 in today's dollars, and your 4.5% rate clears inflation by roughly 1.3 points — a positive real return. A legacy 0.45% account would lose to inflation while earning roughly $11,000 less in interest over the same period.",
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
