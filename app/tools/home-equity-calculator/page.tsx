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
  title: "Home Equity Calculator 2026 – Equity & Borrowing Power",
  description: "Your house has been working harder than you. See how much cash you're actually sitting on.",
  keywords: ["home equity calculator", "home equity loan calculator", "HELOC calculator", "loan to value calculator", "how much equity do I have"],
  alternates: { canonical: "https://worthulator.com/tools/home-equity-calculator" },
};

const FAQS = [
  { q: "What is home equity?", a: "Home equity is the difference between your home's current market value and your remaining mortgage balance. If your home is worth $400,000 and you owe $250,000, you have $150,000 in equity." },
  { q: "How much equity can I borrow against?", a: "Most lenders allow you to borrow up to 80–85% of your home's value (combined across your mortgage and any HELOC/HEL). This is your maximum loan-to-value (LTV) ratio." },
  { q: "What is LTV and why does it matter?", a: "LTV = loan balance ÷ home value × 100. Lenders use it to assess risk. Below 80% LTV qualifies for better rates and avoids PMI. Above 90% often means higher rates or stricter requirements." },
  { q: "What's the difference between a HELOC and a home equity loan?", a: "A HELOC is a revolving line of credit — you draw and repay as needed, usually with a variable rate. A home equity loan gives you a lump sum at a fixed rate. Both use your equity as collateral." },
  { q: "How do I build equity faster?", a: "Make extra principal payments on your mortgage, make home improvements that increase value, or benefit from market appreciation. Extra payments have the most direct impact on equity." },
];

const STATS = [
  { stat: "$299K", color: "text-emerald-600", accent: "bg-emerald-500", label: "average tappable equity for US homeowners" },
  { stat: "80%",   color: "text-amber-600",   accent: "bg-amber-500",   label: "max LTV most lenders allow for HELOC" },
  { stat: "32%",   color: "text-rose-600",    accent: "bg-rose-500",    label: "of US mortgages are fully paid off" },
];

const CONTENT_CARDS = [
  { icon: "🏠", title: "Equity vs net worth", body: "Home equity is your single largest asset in most cases. But it's illiquid — you can't spend it without selling or borrowing against it. Don't confuse a high equity number with financial flexibility." },
  { icon: "💡", title: "Using equity wisely", body: "HELOCs and home equity loans typically have lower rates than personal loans or credit cards. They're best used for home improvements (which build more equity) not consumable spending." },
  { icon: "⚠️", title: "The risk of over-leveraging", body: "Borrowing against your home means your home is collateral. If property values drop or income changes, you could face negative equity — owing more than the home is worth." },
];

const RELATED_CALCS = [
  { icon: "🏦", accent: "bg-blue-500/10",    title: "Mortgage Calculator",            description: "See full amortisation and total interest.",        href: "/tools/mortgage-calculator" },
  { icon: "🏠", accent: "bg-emerald-500/10", title: "House Affordability",            description: "What home price fits your budget?",               href: "/tools/house-affordability-calculator" },
  { icon: "🔄", accent: "bg-amber-500/10",   title: "Mortgage Refinance Calculator",  description: "Is it worth refinancing your current loan?",     href: "/tools/mortgage-refinance-calculator" },
  { icon: "⏳", accent: "bg-purple-500/10",  title: "Down Payment Countdown",         description: "How long until you hit your target deposit?",     href: "/tools/down-payment-countdown" },
];

export default function HomeEquityCalculator() {
  return (
    <>
      <SimpleCalculatorHero
        eyebrowIcon="🏡"
        eyebrowText="Home Equity"
        title="Home Equity Calculator"
        description="Enter your home's current value and mortgage balance to see how much equity you've built, your LTV ratio, and how much you could potentially borrow."
        chips={["Equity amount", "Loan-to-value ratio", "Max borrowable"]}
      >
        <CalculatorEngineLoader slug="home-equity-calculator" />
      </SimpleCalculatorHero>
      <InsightStrip text="Homeowners currently hold a record $32 trillion in equity — but most don't know exactly how much they own or what they could access." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="Making the most of your home equity" cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How home equity and LTV are calculated"
        paragraphs={[
          "Equity = current home value − mortgage balance. LTV (%) = mortgage balance ÷ home value × 100. Max borrowable at 80% LTV = (home value × 0.80) − mortgage balance.",
          "Lenders typically require an appraisal to confirm market value. Your equity on paper may differ from what a lender will use if they appraise conservatively.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
