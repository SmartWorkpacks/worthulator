import type { Metadata } from "next";
import ApyCalculatorLoader from "./ApyCalculatorLoader";
import SimpleCalculatorHero from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import StandardFAQSection from "@/src/templates/take-home-pay/StandardFAQSection";
import {
  StatChipsRow, ContentCardGrid, SEOTextBlock, InsightStrip, RelatedCalcCards,
} from "@/src/templates/take-home-pay/StandardSEOSection";
import { calculateApy } from "@/lib/calculators/apyEngine";
import { fredBenchmarks } from "@/lib/datasets/finance/fredBenchmarks";

// ─── Live worked example (single source of truth — refreshes with FRED data) ──
const RATE = fredBenchmarks.fedFundsRate;
const AS_OF = fredBenchmarks.currentPeriodLabel;
// $10k at the live rate, compounded daily, over 5 years.
const EX = calculateApy({ principal: 10_000, nominalRatePct: RATE, compounding: "daily", termYears: 5 });
const usd = (n: number) => `$${Math.round(n).toLocaleString()}`;

export const metadata: Metadata = {
  title: "APY Calculator – Convert Interest Rate to Annual Percentage Yield",
  description:
    "Calculate the APY (annual percentage yield) from any stated interest rate and compounding frequency. See your true effective yield and how your savings grow over time.",
  keywords: ["apy calculator", "annual percentage yield calculator", "apr to apy calculator", "effective yield calculator", "compound interest yield calculator", "savings apy calculator"],
  alternates: { canonical: "https://worthulator.com/tools/apy-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "What is APY and how is it different from the interest rate?",
    a: `APY (annual percentage yield) is the real, effective return you earn in a year once compounding is included. The stated (nominal) rate ignores compounding. For example, a ${RATE}% rate compounded daily gives an APY of about ${EX.apyPct}% — slightly higher, because you earn interest on your interest (${AS_OF}).`,
  },
  {
    q: "How is APY calculated?",
    a: "APY = (1 + r/n)^n − 1, where r is the nominal annual rate as a decimal and n is the number of compounding periods per year. Daily compounding uses n = 365, monthly uses 12, quarterly uses 4, and annually uses 1.",
  },
  {
    q: "Why do banks advertise APY instead of the interest rate?",
    a: "Under the US Truth in Savings Act, banks must disclose APY so consumers can compare savings accounts and CDs on equal footing — regardless of how often each one compounds. Always compare accounts by APY, never by the stated rate alone.",
  },
  {
    q: "What's the difference between APY and APR?",
    a: "APY describes what you EARN on savings (includes compounding); APR describes what you PAY on a loan (and typically excludes compounding, though it can include fees). Same math family, opposite sides of your balance sheet.",
  },
  {
    q: "Does compounding frequency really matter?",
    a: `A little, especially at higher rates. At ${RATE}%, daily versus annual compounding changes the APY by only a fraction of a percentage point. The deposit amount, the rate itself, and time in the account matter far more than how often it compounds.`,
  },
];

const STATS = [
  { stat: `${EX.apyPct}%`, color: "text-violet-600", accent: "bg-violet-500", label: `APY from a ${RATE}% rate compounded daily — fed funds via FRED (${AS_OF})` },
  { stat: `+${EX.compoundingBonusPct.toFixed(3)} pts`, color: "text-blue-600", accent: "bg-blue-500", label: `extra yield from daily compounding vs the stated rate (${AS_OF})` },
  { stat: usd(EX.interestEarned), color: "text-amber-600", accent: "bg-amber-500", label: `interest earned on ${usd(10_000)} over 5 years at ${EX.apyPct}% APY (${AS_OF})` },
];

const CONTENT_CARDS = [
  {
    icon: "📊",
    title: "APY is the honest number",
    body: `Two accounts can quote the same interest rate yet pay different amounts if one compounds more often. APY rolls compounding into a single figure — so a ${RATE}% rate compounded daily becomes a ${EX.apyPct}% APY you can compare directly.`,
  },
  {
    icon: "🔁",
    title: "Compounding stacks interest on interest",
    body: "Each compounding period adds interest to your balance, and the next period earns interest on that larger balance. More frequent compounding means a slightly higher effective yield — daily edges out monthly, which edges out quarterly.",
  },
  {
    icon: "⏳",
    title: "Time does the heavy lifting",
    body: `Compounding frequency is a small lever; time is a huge one. ${usd(10_000)} at ${EX.apyPct}% APY grows to ${usd(EX.balanceAfterTerm)} in 5 years — and keeps accelerating the longer you leave it.`,
  },
];

const RELATED_CALCS = [
  { title: "Compound Interest Calculator", description: "Project growth with regular contributions.", href: "/tools/compound-interest-calculator", icon: "📈", accent: "bg-emerald-500/10" },
  { title: "Savings Calculator", description: "Plan deposits toward a savings target.", href: "/tools/savings-calculator", icon: "🏦", accent: "bg-blue-500/10" },
  { title: "Savings Goal Calculator", description: "Work backward from a goal amount.", href: "/tools/savings-goal-calculator", icon: "🎯", accent: "bg-violet-500/10" },
  { title: "Future Value Calculator", description: "What a lump sum becomes over time.", href: "/tools/future-value-calculator", icon: "🔮", accent: "bg-amber-500/10" },
];

export default function ApyCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "APY Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description: "Convert a stated interest rate and compounding frequency into the annual percentage yield (APY) and project savings growth.",
      url: "https://worthulator.com/tools/apy-calculator",
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
        eyebrowIcon="📈"
        eyebrowText="Savings · Effective Yield · Compounding"
        title="APY Calculator"
        description="Turn any stated interest rate and compounding frequency into the APY — the true effective yield — and watch how your savings grow."
        chips={["Effective yield (APY)", "Compounding comparison", "Balance projection"]}
      >
        <ApyCalculatorLoader />
      </SimpleCalculatorHero>

      <InsightStrip
        text={`A <span class="font-semibold text-gray-900">${RATE}% rate isn't really ${RATE}%</span> — compounded daily it yields ${EX.apyPct}% APY. Always compare accounts by APY, not the headline rate.`}
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="Why APY beats the headline rate"
        subtitle="The stated rate is marketing; APY is what actually lands in your account."
        cards={CONTENT_CARDS}
      />

      <SEOTextBlock
        title="How the APY Calculator Works"
        formula={`APY = (1 + r / n)^n − 1
  r = stated annual rate (as a decimal)
  n = compounding periods per year (daily 365, monthly 12, quarterly 4, annually 1)

Balance(t) = P · (1 + r / n)^(n · t)
  P = deposit, t = years`}
        steps={[
          { label: "Enter your deposit", description: "The amount you're putting into the account." },
          { label: "Enter the stated rate", description: `Defaults to the live federal funds rate (${AS_OF}).` },
          { label: "Pick a compounding frequency", description: "Daily, monthly, quarterly, or annually." },
          { label: "Set your time horizon", description: "How long the money stays invested." },
          { label: "See your APY and growth", description: "Effective yield, interest earned, and the balance curve." },
        ]}
        paragraphs={[
          `APY answers a simple question: after a year of compounding, what did I actually earn? Because interest earns interest, the effective yield is always at least as high as the stated rate. In this example, a ${RATE}% nominal rate compounded daily produces an APY of ${EX.apyPct}% — a small but real boost of +${EX.compoundingBonusPct.toFixed(3)} percentage points (${AS_OF}).`,
          "Use APY whenever you shop for high-yield savings accounts, money market accounts, or CDs. It's the standardized figure US banks must publish, so it lets you compare offers fairly. Just remember that real-world rates can change, and interest is generally taxable — this tool models a fixed rate with no withdrawals.",
        ]}
      />

      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      <RelatedCalcCards
        title="Related Calculators"
        subtitle="More tools for growing your savings."
        items={RELATED_CALCS}
      />
    </main>
  );
}
