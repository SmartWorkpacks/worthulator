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
  title: "Child Support Calculator 2026 – Monthly Estimate",
  description: "Skip the drama and get the baseline. See what the state math actually looks like for your situation.",
  keywords: ["child support calculator", "child support estimator", "how much child support will I pay", "child support guidelines calculator"],
  alternates: { canonical: "https://worthulator.com/tools/child-support-calculator" },
};

const FAQS = [
  { q: "How is child support calculated?", a: "Most US states use the Income Shares Model: combine both parents' incomes, determine a basic child support obligation from a guideline table, then split it proportionally. This calculator uses that framework as an estimate." },
  { q: "Does custody affect child support?", a: "Yes. Increased physical custody for the paying parent typically reduces the obligation. Shared parenting at 50/50 can significantly reduce or equalise payments depending on the state." },
  { q: "Is this calculator legally accurate?", a: "No — this is an educational estimate only. Child support amounts vary widely by state, and courts consider many additional factors. Always consult a family law attorney and use your state's official guidelines." },
  { q: "What can child support be used for?", a: "Child support is meant to cover housing, food, clothing, medical care, and education. The paying parent does not get to dictate or audit how the money is spent within those categories." },
  { q: "What happens if I miss a child support payment?", a: "Unpaid child support accumulates as arrears and can result in wage garnishment, license suspension, passport denial, and in extreme cases, criminal charges. Contact the court proactively if you can't pay." },
];

const STATS = [
  { stat: "$500",  color: "text-amber-600",   accent: "bg-amber-500",   label: "median monthly child support order in the US" },
  { stat: "30%",   color: "text-rose-600",    accent: "bg-rose-500",    label: "of all child support goes uncollected" },
  { stat: "50",    color: "text-emerald-600", accent: "bg-emerald-500", label: "states — each has its own formula and guidelines" },
];

const CONTENT_CARDS = [
  { icon: "⚖️", title: "The Income Shares Model", body: "Most states estimate what both parents together would spend on the child if they lived together, then divide that obligation proportionally based on income. The parent with less physical custody typically pays their share to the other." },
  { icon: "📝", title: "Deviations from guidelines", body: "Courts can deviate from the guideline amount for: extraordinary medical expenses, private school tuition, special needs, significant travel costs for parenting time, or if one parent has very high or very low income." },
  { icon: "🔄", title: "Modifying an existing order", body: "Support orders can be modified if circumstances change significantly — job loss, income increase, change in custody, or the child moving in with the paying parent. You must file with the court; informal agreements aren't enforceable." },
];

const RELATED_CALCS = [
  { icon: "📊", accent: "bg-blue-500/10",    title: "Budget Calculator",        description: "Build a budget around your new obligations.",     href: "/tools/budget-calculator" },
  { icon: "💵", accent: "bg-emerald-500/10", title: "Take-Home Pay Calculator", description: "See your net income after all deductions.",       href: "/tools/take-home-pay-calculator" },
  { icon: "🧾", accent: "bg-amber-500/10",   title: "Pay Stub Calculator",      description: "Understand every deduction on your paycheck.",    href: "/tools/pay-stub-calculator" },
  { icon: "📈", accent: "bg-purple-500/10",  title: "Salary Breakdown",         description: "Where does your income actually go?",             href: "/tools/salary-breakdown-calculator" },
];

export default function ChildSupportCalculator() {
  return (
    <>
      <SimpleCalculatorHero
        eyebrowIcon="👨‍👧"
        eyebrowText="Child Support"
        title="Child Support Estimator"
        description="Get a rough estimate of monthly child support based on income-share guidelines. Enter both parents' income, number of children, and custody split."
        chips={["Monthly estimate", "Annual total", "Income share ratio"]}
      >
        <CalculatorEngineLoader slug="child-support-calculator" />
      </SimpleCalculatorHero>
      <InsightStrip text="This is a starting estimate only — actual court orders vary by state, income type, and many other factors. Always consult a family law attorney." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="Understanding the child support formula" cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the income-share estimate works"
        paragraphs={[
          "Combined income → guideline table obligation → payer's proportional share → custody adjustment. The formula used here approximates the most common income-share model used in 40+ US states.",
          "This calculator does not account for state-specific tables, tax deductions, healthcare costs, childcare costs, or existing support orders — all of which courts consider. Use it to get a ballpark, not a verdict.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
