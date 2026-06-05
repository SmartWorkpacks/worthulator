import type { Metadata } from "next";
import RentCalculatorLoader from "./RentCalculatorLoader";
import SimpleCalculatorHero from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import StandardFAQSection from "@/src/templates/take-home-pay/StandardFAQSection";
import {
  StatChipsRow, ContentCardGrid, SEOTextBlock, InsightStrip, RelatedCalcCards,
} from "@/src/templates/take-home-pay/StandardSEOSection";
import { calculateRentAffordability } from "@/lib/calculators/rentAffordabilityEngine";

// ─── Worked example (single source of truth) ─────────────────────────────────
// $72k gross ($6,000/mo), no debt, 30% target.
const EX = calculateRentAffordability({ grossAnnualIncome: 72_000, monthlyDebt: 0, targetRentPct: 30 });
const usd = (n: number) => `$${Math.round(n).toLocaleString()}`;

export const metadata: Metadata = {
  title: "Rent Calculator – How Much Rent Can I Afford?",
  description:
    "Find out how much rent you can afford based on your income and debts. Uses the 30% rule, the 36% debt guideline, and the landlord 3× income rule to set a safe rent budget.",
  keywords: ["rent calculator", "how much rent can i afford", "rent affordability calculator", "30 percent rule rent", "rent budget calculator", "rent to income ratio"],
  alternates: { canonical: "https://worthulator.com/tools/rent-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "How much rent can I afford?",
    a: `The classic rule is to keep rent at or below 30% of your gross (pre-tax) monthly income. On a ${usd(72_000)}/yr salary — ${usd(EX.grossMonthly)}/mo — that's about ${usd(EX.comfortableRent)}/mo. If you carry other debt, the safe ceiling can be lower.`,
  },
  {
    q: "What is the 30% rule for rent?",
    a: "It's a long-standing budgeting guideline: spend no more than 30% of gross monthly income on rent. It leaves room for other essentials, savings, and discretionary spending. It's a starting point, not a hard cap — high earners can often spend less proportionally, and people in expensive cities sometimes spend more.",
  },
  {
    q: "How does my debt affect what I can afford?",
    a: `Lenders and landlords often look at total obligations. A common guideline keeps rent plus monthly debt payments under 36% of gross income. So ${usd(500)}/mo of car and loan payments directly reduces the rent you can safely take on — this calculator subtracts your debts from that 36% ceiling.`,
  },
  {
    q: "What income do landlords require?",
    a: `Many landlords require gross annual income of at least 3× the rent (sometimes 40× the monthly rent). For a ${usd(EX.comfortableRent)}/mo apartment that's roughly ${usd(EX.comfortableRent * 3 * 12)}/yr. If you fall short, a co-signer, guarantor, or larger deposit may help.`,
  },
  {
    q: "Should I always spend the full 30%?",
    a: "No. The right number depends on your other goals. If you're saving aggressively, paying down debt, or want a bigger cushion, aim for 25% or less. If you live somewhere expensive and have few other costs, stretching toward 35% can be reasonable. Use the slider to see your range.",
  },
];

const STATS = [
  { stat: usd(EX.comfortableRent), color: "text-violet-600", accent: "bg-violet-500", label: `comfortable rent on a ${usd(72_000)}/yr income (the 30% rule)` },
  { stat: "30%", color: "text-blue-600", accent: "bg-blue-500", label: `of gross income is the classic rent affordability benchmark` },
  { stat: usd(EX.conservativeRent), color: "text-amber-600", accent: "bg-amber-500", label: `a conservative target (25%) that leaves more room to save` },
];

const CONTENT_CARDS = [
  {
    icon: "📐",
    title: "Start with the 30% rule",
    body: `Take 30% of your gross monthly income as a baseline rent budget. On ${usd(EX.grossMonthly)}/mo that's ${usd(EX.comfortableRent)} — enough to live well while keeping money for savings, food, transport, and fun.`,
  },
  {
    icon: "💳",
    title: "Factor in your other debts",
    body: "Rent doesn't exist in a vacuum. A widely used guideline keeps rent plus debt payments under 36% of income. If you have a car loan or student loans, your safe rent ceiling drops accordingly — this tool does that math for you.",
  },
  {
    icon: "🔑",
    title: "Know the landlord's math",
    body: "Most landlords screen for income of about 3× the monthly rent. Knowing the income a place requires before you apply saves time and protects your credit from unnecessary application checks.",
  },
];

const RELATED_CALCS = [
  { title: "Rent vs Buy Calculator", description: "Is renting or buying cheaper for you?", href: "/tools/rent-vs-buy-calculator", icon: "🏠", accent: "bg-emerald-500/10" },
  { title: "Budget Calculator", description: "Build a full 50/30/20 monthly budget.", href: "/tools/budget-calculator", icon: "📊", accent: "bg-blue-500/10" },
  { title: "House Affordability Calculator", description: "How much home could you buy instead?", href: "/tools/house-affordability-calculator", icon: "🏡", accent: "bg-violet-500/10" },
  { title: "Salary to Hourly Calculator", description: "Translate your pay across pay periods.", href: "/tools/salary-to-hourly-calculator", icon: "💵", accent: "bg-amber-500/10" },
];

export default function RentCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Rent Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description: "Calculate how much rent you can afford based on income and debts using the 30% rule and the 36% debt guideline.",
      url: "https://worthulator.com/tools/rent-calculator",
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
        eyebrowIcon="🔑"
        eyebrowText="Renting · Affordability · 30% Rule"
        title="Rent Calculator"
        description="Find out how much rent you can comfortably afford based on your income and debts — with a safe range from conservative to stretch."
        chips={["Recommended rent", "Conservative–stretch range", "Debt-adjusted ceiling"]}
      >
        <RentCalculatorLoader />
      </SimpleCalculatorHero>

      <InsightStrip
        text={`The rule of thumb: keep rent under <span class="font-semibold text-gray-900">30% of gross income</span>. On ${usd(72_000)}/yr that's about ${usd(EX.comfortableRent)}/mo — less if you carry other debt.`}
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="How much rent can you really afford?"
        subtitle="Three simple guidelines landlords and lenders actually use."
        cards={CONTENT_CARDS}
      />

      <SEOTextBlock
        title="How the Rent Calculator Works"
        formula={`Comfortable rent = Gross monthly income × 30%
Conservative = × 25%   ·   Stretch = × 35%

Debt-adjusted ceiling = (Gross monthly × 36%) − monthly debts
Recommended = min(your target %, debt-adjusted ceiling)

Landlord rule: income ≥ 3 × monthly rent`}
        steps={[
          { label: "Enter your gross income", description: "Pre-tax annual income is the standard basis." },
          { label: "Add your monthly debts", description: "Car, student loans, credit card minimums, etc." },
          { label: "Set your target %", description: "30% is the default; lower to save more." },
          { label: "See your rent budget", description: "A recommended figure plus a safe range." },
          { label: "Check the landlord math", description: "We show the income a place typically requires." },
        ]}
        paragraphs={[
          `Rent is usually the biggest line in a monthly budget, so getting it right matters. The 30% rule is the simplest benchmark: on ${usd(72_000)}/yr (${usd(EX.grossMonthly)}/mo), a comfortable rent is about ${usd(EX.comfortableRent)}. Spending much more squeezes everything else — savings, debt payoff, and breathing room.`,
          "Two extra checks sharpen the estimate. First, the 36% guideline: rent plus your other debt payments should stay under about 36% of gross income, so existing loans lower your ceiling. Second, the landlord 3× rule: most require income of roughly three times the rent. Treat the result as a smart starting point and adjust for your city, goals, and lifestyle.",
        ]}
      />

      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      <RelatedCalcCards
        title="Related Calculators"
        subtitle="More tools for housing and budgeting."
        items={RELATED_CALCS}
      />
    </main>
  );
}
