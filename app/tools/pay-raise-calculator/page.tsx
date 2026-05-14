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
  title: "Pay Raise Calculator 2026 – See Your New Salary Instantly",
  description:
    "Calculate your new salary, annual increase, and monthly boost after a pay raise. Enter your current salary and raise percentage for an instant breakdown.",
  keywords: ["pay raise calculator", "salary raise calculator", "how much is a 5% raise", "raise calculator", "new salary after raise"],
  alternates: { canonical: "https://worthulator.com/tools/pay-raise-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "What is a good pay raise percentage?",
    a: "In 2026, a cost-of-living raise typically runs 3–4%. A merit raise for solid performance is 5–7%. Exceptional performers or employees changing roles can negotiate 10–20%. Anything below inflation effectively means a pay cut in real terms.",
  },
  {
    q: "How do I calculate a pay raise?",
    a: "Multiply your current salary by (1 + raise% ÷ 100). A 5% raise on $65,000 = $65,000 × 1.05 = $68,250. Your increase is $3,250 per year, or about $271 per month.",
  },
  {
    q: "Should I negotiate my raise?",
    a: "Yes — always. Most managers expect negotiation. Research your market rate using Glassdoor, LinkedIn Salary, or Levels.fyi. Come with data, not just a request. The worst they can say is no.",
  },
  {
    q: "How does inflation affect my raise?",
    a: "A 3% raise during 4% inflation means your purchasing power actually decreased by 1%. To get a real raise, your percentage needs to exceed the current inflation rate. Use the inflation calculator to see the real value of your raise.",
  },
  {
    q: "What is the difference between a raise and a promotion?",
    a: "A raise increases your pay in your current role. A promotion changes your role and typically comes with a larger increase (10–25%) plus new responsibilities. Promotions are one of the fastest ways to accelerate salary growth.",
  },
];

const STATS = [
  { stat: "5%",    color: "text-emerald-600", accent: "bg-emerald-500", label: "Average merit raise in the US in 2026 for solid performers" },
  { stat: "$271",  color: "text-blue-600",    accent: "bg-blue-500",    label: "Monthly increase from a 5% raise on a $65,000 salary" },
  { stat: "3×",    color: "text-amber-600",   accent: "bg-amber-500",   label: "More likely to see a large raise if you switch jobs vs staying put" },
];

const CONTENT_CARDS = [
  {
    icon: "📈",
    title: "Raises compound over time",
    body: "A 5% raise sounds modest, but applied year after year it compounds. Someone earning $65k who gets 5% annually reaches $105k in 10 years — without changing jobs. Consistency beats chasing big one-time jumps.",
  },
  {
    icon: "🔄",
    title: "Job switching still pays more",
    body: "The average raise when switching jobs is 10–20%. If you've been in your role for 2+ years and are consistently performing well, a well-timed job change often outperforms years of annual raises.",
  },
  {
    icon: "💡",
    title: "Negotiate the base, not the bonus",
    body: "Always try to raise your base salary, not just bonuses or benefits. Base salary compounds — it affects your future raises, bonus calculations, 401k matching, and job offer comparisons for the rest of your career.",
  },
];

const RELATED_CALCS = [
  { title: "Salary to Hourly Calculator",       description: "Break your salary down to an hourly rate.",          href: "/tools/salary-to-hourly-calculator",    icon: "🕐", accent: "bg-emerald-500/10" },
  { title: "Hourly to Salary Calculator",        description: "Convert an hourly rate to annual salary.",           href: "/tools/hourly-to-salary-calculator",     icon: "💼", accent: "bg-blue-500/10" },
  { title: "Inflation Calculator",               description: "See the real value of your raise after inflation.",  href: "/tools/inflation-calculator",            icon: "📉", accent: "bg-amber-500/10" },
  { title: "Take Home Pay Calculator",           description: "See your actual net pay after taxes.",               href: "/tools/take-home-pay-calculator",        icon: "🏠", accent: "bg-purple-500/10" },
];

export default function PayRaiseCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Pay Raise Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description: "Calculate your new salary and monthly increase after a pay raise.",
      url: "https://worthulator.com/tools/pay-raise-calculator",
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
        eyebrowText="Income · Salary"
        title="Pay Raise Calculator"
        description="Enter your current salary and raise percentage to see your new salary, annual increase, and monthly boost instantly."
        chips={["New salary", "Annual & monthly increase", "Quick raise presets"]}
      >
        <CalculatorEngineLoader slug="pay-raise" />
      </SimpleCalculatorHero>
      <InsightStrip text='Negotiating your base salary is one of the highest-ROI moves you can make — <span class="font-semibold text-gray-900">it compounds every year for the rest of your career.</span>' />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="What your raise really means" subtitle="Context that makes the number matter." cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the Pay Raise Calculator Works"
        formula={`New Salary      = Current Salary × (1 + Raise% ÷ 100)
Annual Increase = New Salary − Current Salary
Monthly Increase = Annual Increase ÷ 12`}
        steps={[
          { label: "Enter your current salary", description: "Your gross annual salary before taxes." },
          { label: "Enter your raise percentage", description: "Use a quick preset (2%, 3%, 5%, 8%, 10%) or slide to any value." },
          { label: "Read your results", description: "New salary, annual increase, and the monthly difference instantly." },
        ]}
        paragraphs={[
          "This calculator uses simple percentage arithmetic. The raise is applied to your gross annual salary to give you your new total, the annual uplift, and what that means per month.",
          "Remember: taxes are not included here. Your take-home increase will be somewhat less depending on your tax bracket. Use the Take Home Pay Calculator to see the net difference.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />
      <RelatedCalcCards title="Related Calculators" subtitle="Tools to plan your income and career." items={RELATED_CALCS} />
    </main>
  );
}
