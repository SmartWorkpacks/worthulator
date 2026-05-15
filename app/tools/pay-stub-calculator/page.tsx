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
  title: "Pay Stub Calculator 2026 – Decode Your Paycheck",
  description: "Verify the math. Make sure your boss—or the government—isn't taking more than their fair share.",
  keywords: ["pay stub calculator", "paycheck calculator", "how to read a pay stub", "take home pay calculator", "paycheck deductions explained"],
  alternates: { canonical: "https://worthulator.com/tools/pay-stub-calculator" },
};

const FAQS = [
  { q: "What is FICA on my pay stub?", a: "FICA stands for Federal Insurance Contributions Act. It covers Social Security (6.2% of gross, up to $168,600 in 2024) and Medicare (1.45%, no limit). Your employer matches this amount." },
  { q: "What's the difference between gross and net pay?", a: "Gross pay is your salary before any deductions. Net pay (take-home) is what hits your bank account after federal tax, state tax, FICA, and benefit deductions are removed." },
  { q: "Why is my federal tax withholding different each paycheck?", a: "Variable income (overtime, bonuses, commission) changes withholding. Your W-4 settings also affect it — allowances, additional withholding, or filing status changes all impact the number." },
  { q: "What is a pre-tax deduction?", a: "Contributions to 401k, HSA, FSA, and most employer health insurance plans are pre-tax — they reduce your taxable income before federal and state taxes are calculated." },
  { q: "How do I check if my taxes are correct?", a: "Use the IRS Tax Withholding Estimator or run your annualised gross through a tax calculator. If you owe large amounts or get huge refunds each year, adjust your W-4." },
];

const STATS = [
  { stat: "7.65%", color: "text-rose-600",    accent: "bg-rose-500",    label: "FICA taken automatically — plus your employer matches it" },
  { stat: "$600+", color: "text-amber-600",   accent: "bg-amber-500",   label: "average monthly in deductions for a $60K salary" },
  { stat: "22%",   color: "text-emerald-600", accent: "bg-emerald-500", label: "most common marginal rate for median earners" },
];

const CONTENT_CARDS = [
  { icon: "📋", title: "What every line means", body: "Federal witholding = estimated income tax prepayment. State withholding = state equivalent. FICA = Social Security + Medicare. Benefits = your share of health/dental/vision premiums and any 401k contributions." },
  { icon: "⚖️", title: "Pre-tax vs post-tax contributions", body: "401k and HSA contributions reduce your taxable income. Roth 401k and after-tax contributions don't. Check your pay stub to see which type your contributions are — it matters at tax time." },
  { icon: "💰", title: "How to increase your take-home", body: "The legal ways: maximise pre-tax benefit contributions (lowers taxable income), adjust your W-4 withholding if over-withholding, or contribute to an HSA if you have a qualifying health plan." },
];

const RELATED_CALCS = [
  { icon: "💵", accent: "bg-emerald-500/10", title: "Take-Home Pay Calculator",   description: "Full salary-to-pocket breakdown.",                href: "/tools/take-home-pay-calculator" },
  { icon: "📊", accent: "bg-blue-500/10",    title: "Tax Bracket Calculator",     description: "Your effective rate vs your marginal rate.",      href: "/tools/tax-bracket-calculator" },
  { icon: "📈", accent: "bg-amber-500/10",   title: "Salary Breakdown",           description: "How your income is actually spent.",              href: "/tools/salary-breakdown-calculator" },
  { icon: "💼", accent: "bg-purple-500/10",  title: "Self-Employed Tax",          description: "SE tax, quarterly estimates, and deductions.",    href: "/tools/self-employed-tax-calculator" },
];

export default function PayStubCalculator() {
  return (
    <>
      <SimpleCalculatorHero
        eyebrowIcon="💵"
        eyebrowText="Pay Stub"
        title="Pay Stub Calculator"
        description="Enter your gross pay and each deduction to see your net take-home pay, total taxes withheld, and your effective tax rate per pay period."
        chips={["Net take-home pay", "Total taxes withheld", "Effective tax rate"]}
      >
        <CalculatorEngineLoader slug="pay-stub-calculator" />
      </SimpleCalculatorHero>
      <InsightStrip text="The gap between your salary and your take-home can be 25–35%. Knowing exactly where every dollar goes is the first step to managing it." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="Decoding your pay stub" cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How your paycheck is calculated"
        paragraphs={[
          "Net pay = gross pay − federal tax − state tax − FICA − benefits deductions. FICA = 6.2% Social Security + 1.45% Medicare = 7.65% of gross.",
          "Effective rate = total taxes ÷ gross pay × 100. This is the rate that matters for budgeting — not your marginal bracket, which applies only to your highest dollars earned.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
