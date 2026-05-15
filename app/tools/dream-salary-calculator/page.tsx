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
  title: "Dream Salary Calculator 2026 – What Salary Do You Actually Need?",
  description: "What's your 'freedom' number? Find the exact salary that actually buys the life you want.",
  keywords: ["dream salary calculator", "what salary do I need", "salary needed calculator", "income needed calculator", "cost of living salary calculator"],
  alternates: { canonical: "https://worthulator.com/tools/dream-salary-calculator" },
};

const FAQS = [
  { q: "How do I calculate the salary I need?", a: "Total monthly expenses (including savings) ÷ (1 − tax rate) × 12. At a 30% effective tax rate: if you need $5,000/month after tax, you need a $5,000 ÷ 0.70 × 12 = $85,700 gross salary." },
  { q: "What is the median US salary?", a: "As of 2024, the median full-time wage in the US is approximately $59,000/year ($1,135/week). This varies enormously by location — median in San Francisco is over $100K; in rural areas, under $45K." },
  { q: "How much should I be saving?", a: "The 50/30/20 rule suggests 20% of after-tax income. At minimum, most planners recommend enough to capture your full employer 401k match, then build to 15% of gross over time." },
  { q: "Does location change the salary I need?", a: "Dramatically. A $90K salary in Austin, TX provides a significantly different lifestyle than the same salary in Manhattan. Cost of living calculators can translate between cities." },
  { q: "What if my dream salary is very high?", a: "That's useful information. It tells you whether your current career path can get there, or whether you need to consider a different field, location, side income, or a lifestyle audit to bring costs down." },
];

const STATS = [
  { stat: "$59K",  color: "text-amber-600",   accent: "bg-amber-500",   label: "US median annual salary (2024)" },
  { stat: "30%",   color: "text-rose-600",    accent: "bg-rose-500",    label: "average effective tax rate on earned income" },
  { stat: "20%",   color: "text-emerald-600", accent: "bg-emerald-500", label: "recommended savings rate (50/30/20 rule)" },
];

const CONTENT_CARDS = [
  { icon: "↩️", title: "Working backwards", body: "Most people set a salary goal arbitrarily — $100K, $200K. Working backwards from actual monthly needs produces a more honest target, often different (sometimes lower, sometimes much higher) than the round-number goal." },
  { icon: "📈", title: "Lifestyle inflation is real", body: "As income rises, expenses tend to rise proportionally. Raising your salary without controlling lifestyle inflation can leave you no closer to financial security. The budget you set today is as important as the salary you earn." },
  { icon: "🎯", title: "The gap is actionable", body: "Knowing the gap between your current salary and your needed salary turns a vague anxiety into a specific target. That target can be a negotiation number, a career pivot trigger, or an invitation to audit whether your 'dream' life is actually what you want." },
];

const RELATED_CALCS = [
  { icon: "💵", accent: "bg-emerald-500/10", title: "Take-Home Pay Calculator",   description: "See what your current salary nets you.",          href: "/tools/take-home-pay-calculator" },
  { icon: "📊", accent: "bg-blue-500/10",    title: "Budget Calculator",          description: "Map your full monthly expenses.",                  href: "/tools/budget-calculator" },
  { icon: "📈", accent: "bg-amber-500/10",   title: "Salary Breakdown",           description: "Where does your income actually go?",             href: "/tools/salary-breakdown-calculator" },
  { icon: "💼", accent: "bg-purple-500/10",  title: "Freelance Rate Calculator",  description: "What should you charge as your own boss?",        href: "/tools/freelance-rate-calculator" },
];

export default function DreamSalaryCalculator() {
  return (
    <>
      <SimpleCalculatorHero
        eyebrowIcon="💭"
        eyebrowText="Dream Salary"
        title="Dream Salary Calculator"
        description="Build your ideal monthly budget — housing, transport, food, lifestyle, savings — and see exactly what gross annual salary you need to afford it all after taxes."
        chips={["Required annual salary", "Monthly net needed", "Gap from median"]}
      >
        <CalculatorEngineLoader slug="dream-salary-calculator" />
      </SimpleCalculatorHero>
      <InsightStrip text="Most people name a salary goal without checking the math. Working backwards from your real monthly needs produces a far more honest — and actionable — target." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="How to set a salary goal that actually means something" cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the required salary is calculated"
        paragraphs={[
          "Monthly net needed = sum of all monthly expenses + savings goal. Required gross salary = (monthly net needed × 12) ÷ (1 − effective tax rate). This calculator assumes a 30% effective rate — adjust mentally for your state and filing status.",
          "Gap = required salary − $59,000 (US median). A positive gap tells you how far above median your lifestyle requires. A negative gap means your 'dream life' is within reach on a median salary.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
