import type { Metadata } from "next";
import NetWorthCalculatorLoader from "./NetWorthCalculatorLoader";
import SimpleCalculatorHero from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import StandardFAQSection from "@/src/templates/take-home-pay/StandardFAQSection";
import {
  StatChipsRow, ContentCardGrid, SEOTextBlock, InsightStrip, RelatedCalcCards,
} from "@/src/templates/take-home-pay/StandardSEOSection";

export const metadata: Metadata = {
  title: "Net Worth Calculator 2026 – Track Your Total Financial Picture",
  description:
    "Calculate your exact net worth across all assets and liabilities. See your milestone status, debt-to-asset ratio, years to $1M, and wealth projection chart.",
  keywords: ["net worth calculator", "how to calculate net worth", "total assets and liabilities", "wealth tracker", "net worth by age"],
  alternates: { canonical: "https://worthulator.com/tools/net-worth-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "What is net worth and how is it calculated?",
    a: "Net worth = Total assets − Total liabilities. Assets are everything you own (cash, investments, property, vehicles). Liabilities are everything you owe (mortgage, car loans, student loans, credit card debt). A positive net worth means your assets exceed your debts.",
  },
  {
    q: "What is a good net worth by age?",
    a: "A common benchmark is to have a net worth equal to your annual salary by age 30, 3× your salary by 40, 6× by 50, and 8× by 60. However, these are rough guides — location, career, and starting point all vary enormously. The most important metric is consistent growth from wherever you start.",
  },
  {
    q: "Should I include my home value in net worth?",
    a: "Yes and no. Including your primary home inflates your net worth but overstates your liquid wealth — you can't easily spend home equity without selling or refinancing. Many financial planners calculate both an 'including primary home' and 'excluding primary home' net worth. This calculator includes it, but you can set home value to $0 to see your investable net worth.",
  },
  {
    q: "How often should I calculate my net worth?",
    a: "Quarterly is a good cadence for most people. Checking too frequently leads to emotional decision-making based on short-term fluctuations. Annual tracking at minimum aligns well with tax season and major financial review periods.",
  },
  {
    q: "What is the debt-to-asset ratio?",
    a: "Your debt-to-asset ratio = Total liabilities / Total assets. A ratio below 50% means more than half of your assets are equity. Above 80% is considered high risk. Most mortgage lenders won't approve a DTI (debt-to-income) ratio above 43%. The lower the ratio, the stronger your financial position.",
  },
];

const STATS = [
  { stat: "$192k",  color: "text-blue-600",    accent: "bg-blue-500",    label: "Median US net worth (2023) — skewed heavily by the top 10%" },
  { stat: "$1M",    color: "text-emerald-600", accent: "bg-emerald-500", label: "The millionaire threshold — reachable for most with consistent investing over 20–30 years" },
  { stat: "Age 35", color: "text-amber-600",   accent: "bg-amber-500",   label: "When compounding begins to work meaningfully — the later you start, the more it costs" },
];

const CONTENT_CARDS = [
  {
    icon: "📊",
    title: "Net worth is the only financial score that matters",
    body: "Income is not wealth. Someone earning $300k with $400k in debt and no investments is in a worse position than someone earning $60k with $200k invested and zero debt. Net worth is the ultimate measure of financial progress.",
  },
  {
    icon: "🏠",
    title: "The home equity misconception",
    body: "Many Americans have most of their net worth tied up in their home — illiquid and highly leveraged. Investable net worth (excluding primary residence) is often the more useful figure for retirement planning. Track both.",
  },
  {
    icon: "📈",
    title: "The first $100k is the hardest",
    body: "Charlie Munger said it best: 'The first $100,000 is a bitch.' After that, compound growth starts doing meaningful heavy lifting. At 7% annual growth, $100k becomes $200k in 10 years without adding a cent. Reaching $100k is your most important financial milestone.",
  },
];

const RELATED_CALCS = [
  {
    title: "ROI Calculator",
    description: "Calculate real returns on investments after fees and inflation.",
    href: "/tools/roi-calculator",
    icon: "📈",
    accent: "bg-emerald-500/10",
  },
  {
    title: "Investment Calculator",
    description: "Project future portfolio value with regular contributions.",
    href: "/tools/investment-calculator",
    icon: "💼",
    accent: "bg-blue-500/10",
  },
  {
    title: "Debt Payoff Calculator",
    description: "Find your debt-free date using avalanche or snowball method.",
    href: "/tools/debt-payoff-calculator",
    icon: "🏔️",
    accent: "bg-red-500/10",
  },
  {
    title: "Retirement Calculator",
    description: "Project your portfolio for a financially secure retirement.",
    href: "/tools/retirement-calculator",
    icon: "🏖️",
    accent: "bg-amber-500/10",
  },
];

export default function NetWorthCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Net Worth Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description: "Calculate your net worth across all assets and liabilities, with wealth projection and milestone tracking.",
      url: "https://worthulator.com/tools/net-worth-calculator",
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
        eyebrowIcon="💰"
        eyebrowText="Wealth · Financial Snapshot"
        title="Net Worth Calculator"
        description="Add up everything you own and owe. See your real financial picture — including milestone status, debt ratio, and projected trajectory."
        chips={["Asset & liability breakdown", "Wealth milestone status", "Years-to-millionaire projection"]}
      >
        <NetWorthCalculatorLoader />
      </SimpleCalculatorHero>

      <InsightStrip
        text='Net worth is not how much you earn — it&apos;s how much you <span class="font-semibold text-gray-900">keep and grow</span>. Income is a tool. Net worth is the score.'
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="Why tracking net worth changes everything"
        subtitle="The number that actually measures financial progress."
        cards={CONTENT_CARDS}
      />

      <SEOTextBlock
        title="How the Net Worth Calculator Works"
        formula={`Net Worth = Total Assets − Total Liabilities

Total Assets = Cash + Investments + Real Estate + Vehicles + Other

Total Liabilities = Mortgage + Car Loans + Student Loans + Credit Cards + Other Debt

Debt-to-Asset Ratio = (Total Liabilities / Total Assets) × 100

Projected Net Worth (Year N) = Assets × (1 + growth%)^N − Liabilities × (0.95)^N`}
        steps={[
          { label: "Enter all your assets",      description: "Cash, investments, retirement accounts, property, vehicles." },
          { label: "Enter all your liabilities", description: "Mortgage, car loans, student loans, credit cards, other debt." },
          { label: "Set your age and growth rate",description: "Used to project your net worth trajectory over time." },
          { label: "Hit Calculate",              description: "See your net worth, milestone label, debt ratio, and projection chart." },
        ]}
        paragraphs={[
          "This calculator gives you a complete snapshot across all categories of assets and liabilities — not just a single number. The milestone labels put your net worth in context, and the projection chart shows where you're heading if you keep your current trajectory.",
          "The 'years to $1 million' figure is calculated by projecting asset growth at your chosen rate and debt amortisation at ~5% per year. It's a motivational target, not a guarantee — but it makes the abstract feel concrete.",
        ]}
      />

      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      <RelatedCalcCards
        title="Related Calculators"
        subtitle="Tools to build and protect your net worth."
        items={RELATED_CALCS}
      />
    </main>
  );
}
