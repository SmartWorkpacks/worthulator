import type { Metadata } from "next";
import NetWorthCalculatorLoader from "./NetWorthCalculatorLoader";
import SimpleCalculatorHero from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import StandardFAQSection from "@/src/templates/take-home-pay/StandardFAQSection";
import {
  StatChipsRow, ContentCardGrid, SEOTextBlock, InsightStrip, RelatedCalcCards,
} from "@/src/templates/take-home-pay/StandardSEOSection";

export const metadata: Metadata = {
  title: "Net Worth Calculator 2026 – See Your Percentile By Age",
  description:
    "Calculate your net worth across all assets and liabilities, then see exactly where you rank for your age using Federal Reserve (SCF 2022) data — plus milestone status, debt ratio, and a wealth projection.",
  keywords: ["net worth calculator", "net worth by age", "net worth percentile", "how do I compare net worth", "average net worth by age", "wealth tracker"],
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
    a: "The Federal Reserve's Survey of Consumer Finances (2022) gives median net worth by age: about $39,000 under 35, $135,600 for 35–44, $247,200 for 45–54, $364,500 for 55–64, and $409,900 for 65–74. This calculator places your number on that distribution and estimates your percentile for your age bracket, so 'good' is measured against real peers rather than a generic rule of thumb.",
  },
  {
    q: "How is my net worth percentile calculated?",
    a: "We take your age bracket's net-worth distribution from the Federal Reserve SCF (2022) and interpolate where your figure falls between the published percentile anchors. The result is an approximate ranking — e.g. the default example (~$42,000 at age 30) lands around the 51st percentile for under-35 households, just above that bracket's $39,000 median.",
  },
  {
    q: "Should I include my home value in net worth?",
    a: "Yes and no. Including your primary home inflates your net worth but overstates your liquid wealth — you can't easily spend home equity without selling or refinancing. Many financial planners track both an 'including primary home' and an 'excluding primary home' net worth, since home equity isn't easily spendable without selling or refinancing.",
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
  { stat: "$192.7k", color: "text-blue-600",    accent: "bg-blue-500",    label: "Median US household net worth (Federal Reserve SCF 2022) — skewed heavily by the top 10%" },
  { stat: "$39k",    color: "text-amber-600",   accent: "bg-amber-500",   label: "Median net worth for households under 35 — the bracket benchmark this tool ranks you against" },
  { stat: "$1M",     color: "text-emerald-600", accent: "bg-emerald-500", label: "The millionaire threshold — reachable for most with consistent investing over 20–30 years" },
];

const CONTENT_CARDS = [
  {
    icon: "📊",
    title: "See where you actually rank",
    body: "A net worth number means little without context. This calculator places yours on the Federal Reserve's SCF (2022) distribution for your age bracket and estimates your percentile — so you know whether you're ahead of, at, or behind your real peers, not a generic rule of thumb.",
  },
  {
    icon: "🏠",
    title: "The home equity misconception",
    body: "Many Americans have most of their net worth tied up in their home — illiquid and highly leveraged. Investable net worth (excluding primary residence) is often the more useful figure for retirement planning. Set home value to $0 to see it.",
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
        description="Add up everything you own and owe, then see exactly where you rank for your age using Federal Reserve data — plus milestone status, debt ratio, and your projected trajectory."
        chips={["Percentile rank by age", "Asset & liability breakdown", "Years-to-millionaire projection"]}
      >
        <NetWorthCalculatorLoader />
      </SimpleCalculatorHero>

      <InsightStrip
        text='Net worth is not how much you earn — it&apos;s how much you <span class="font-semibold text-gray-900">keep and grow</span>. This tool shows where yours ranks against real households your age.'
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
Projected Net Worth (Year N) = Assets × (1 + growth%)^N − Liabilities × (0.95)^N

Percentile = interpolated rank of your net worth within your
             age bracket's Federal Reserve SCF (2022) distribution`}
        steps={[
          { label: "Enter all your assets",      description: "Cash, investments, retirement accounts, property, vehicles." },
          { label: "Enter all your liabilities", description: "Mortgage, car loans, student loans, credit cards, other debt." },
          { label: "Set your age and growth rate",description: "Age picks your SCF comparison bracket; growth rate drives the projection." },
          { label: "Read your rank",             description: "Your net worth, percentile for your age, milestone label, debt ratio, and projection chart." },
        ]}
        paragraphs={[
          "This calculator gives you a complete snapshot across all categories of assets and liabilities — not just a single number. It then ranks you against your peers: using the Federal Reserve's Survey of Consumer Finances (2022), it estimates your percentile within your age bracket. The default example — roughly $42,000 in net worth at age 30 — lands around the 51st percentile for under-35 households, just above that group's $39,000 median.",
          "The 'years to $1 million' figure projects asset growth at your chosen rate and debt amortisation at ~5% per year. It's a motivational target, not a guarantee — but combined with your percentile rank, it turns an abstract number into a clear sense of where you stand and where you're heading.",
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
