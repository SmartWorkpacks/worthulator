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
import InsightsSection from "@/components/insights/InsightsSection";
import InsightTable from "@/components/insights/InsightTable";

export const metadata: Metadata = {
  title: "Budget Calculator 2026 – Monthly Budget Planner with Savings Rate",
  description:
    "Calculate your monthly leftover, savings rate, and expense ratio. Enter income and all expense categories to instantly see if your budget is healthy or overspending.",
  keywords: ["budget calculator", "monthly budget calculator", "personal budget calculator", "savings rate calculator", "how much should I save"],
  alternates: { canonical: "https://worthulator.com/tools/budget-calculator" },
};

const FAQS = [
  {
    q: "What is a healthy savings rate?",
    a: "Financial experts generally recommend saving at least 20% of take-home pay (the 50/30/20 rule). However, any positive savings rate is better than zero. If you're paying off high-interest debt, directing extra money there can be more valuable than a traditional savings rate. A savings rate above 30% puts you on track for early financial independence.",
  },
  {
    q: "What is the 50/30/20 budget rule?",
    a: "The 50/30/20 rule allocates 50% of take-home pay to needs (housing, food, transport, utilities), 30% to wants (dining out, entertainment, subscriptions), and 20% to savings and debt repayment. It's a simple starting framework — most people need to adjust the percentages based on their cost of living and goals.",
  },
  {
    q: "How do I reduce my expense ratio?",
    a: "Focus on your largest fixed expenses first — housing and transport often make up 40–60% of budgets. Downsizing, refinancing, or moving can have a bigger impact than cutting small discretionary spends. Then audit subscriptions (the average American has 12+ active subscriptions), food costs (meal prepping vs. takeaways), and debt interest rates (refinancing or balance transfers).",
  },
  {
    q: "Should I include irregular expenses in my monthly budget?",
    a: "Yes — irregular expenses like car insurance, annual subscriptions, and holiday spending should be divided by 12 and included as a monthly 'sinking fund' line item. Most budget shortfalls happen not from overspending on daily items, but from irregular costs that weren't planned for. Budget for them monthly so the money is ready.",
  },
  {
    q: "What should I do if my budget shows overspending?",
    a: "Start with the biggest lever: housing. If rent or mortgage is above 35% of take-home, you're likely in a structural deficit that small cuts elsewhere can't fix. Next, look at debt payments — high minimums reduce flexibility significantly. Then tackle subscriptions and food costs as the most controllable variables in most budgets.",
  },
];

const STATS = [
  { stat: "20%", color: "text-emerald-600", accent: "bg-emerald-500", label: "minimum savings rate recommended by most financial planners" },
  { stat: "64%", color: "text-blue-600", accent: "bg-blue-500", label: "of Americans live paycheck to paycheck at some income level" },
  { stat: "$12+", color: "text-amber-600", accent: "bg-amber-500", label: "average number of active subscriptions per US household" },
];

const CONTENT_CARDS = [
  {
    icon: "🏠",
    title: "Housing is the biggest lever",
    body: "If your housing costs exceed 35% of take-home pay, no amount of latte-cutting will fix your budget. Your largest fixed expense has the largest impact. Even a $200/month reduction in rent saves $2,400/year — more than eliminating coffee, gym, and Netflix combined for most people.",
  },
  {
    icon: "📉",
    title: "Debt payments kill savings rate",
    body: "High minimum debt payments are the silent killer of savings rates. A $500/month debt payment on a 22% APR credit card costs $6,000/year with minimal progress on the principal. Prioritising high-interest debt payoff over investing (when rate > 7%) is mathematically sound — use the avalanche or snowball method.",
  },
  {
    icon: "🗓️",
    title: "Budget for irregular expenses monthly",
    body: "Car insurance, annual subscriptions, car registration, and holiday gifts feel like surprises — but they aren't. Divide annual irregular expenses by 12 and set aside that amount each month into a dedicated sinking fund. This eliminates budget emergencies and smooths cash flow.",
  },
];

const RELATED_CALCS = [
  { title: "Emergency Fund Calculator", description: "See how large your safety net should be.", href: "/tools/emergency-fund-calculator", icon: "🛡️", accent: "bg-emerald-500/10" },
  { title: "Debt Payoff Calculator", description: "See when you'll be debt-free.", href: "/tools/debt-payoff-calculator", icon: "💳", accent: "bg-blue-500/10" },
  { title: "Savings Goal Calculator", description: "Plan how long to save for any goal.", href: "/tools/savings-goal-calculator", icon: "🎯", accent: "bg-amber-500/10" },
  { title: "Subscription Auditor", description: "Find and cut recurring costs fast.", href: "/tools/subscription-auditor", icon: "🔍", accent: "bg-purple-500/10" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Budget Calculator",
      url: "https://worthulator.com/tools/budget-calculator",
      applicationCategory: "FinanceApplication",
      description: "Calculate your monthly leftover, savings rate, and whether you are overspending.",
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

export default function BudgetCalculator() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SimpleCalculatorHero
        eyebrowIcon="📊"
        eyebrowText="Budget Calculator"
        title="Is Your Monthly Budget Actually Working?"
        description="Enter your take-home income and all expenses to see your monthly leftover, savings rate, and whether your budget is healthy or heading toward overspending."
        chips={["Savings rate shown", "Expense ratio calculated", "Overspend warning"]}
      >
        <CalculatorEngineLoader slug="budget-calculator" afterResults={<InsightsSection slug="budget-calculator" />} />
      </SimpleCalculatorHero>
      <InsightStrip text="A healthy budget has a savings rate above <span class='font-semibold text-gray-900'>20%</span>. Most overspending traces back to housing — not coffee." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="How to actually improve your budget" cards={CONTENT_CARDS} />
      <InsightTable slug="budget-calculator" />
      <SEOTextBlock
        title="How the Budget Calculator Works"
        formula="Leftover = Income − (Housing + Food + Transport + Debt + Other)"
        paragraphs={[
          "This calculator sums all monthly expense categories and subtracts from take-home income to show your leftover cash, expressed as both a dollar amount and a savings rate percentage.",
          "Savings rate = (Leftover ÷ Income) × 100. Expense ratio = (Total Expenses ÷ Income) × 100. A combined savings rate and expense ratio will always equal 100%.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
