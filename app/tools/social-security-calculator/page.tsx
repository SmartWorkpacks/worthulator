import type { Metadata } from "next";
import SocialSecurityCalculatorLoader from "./SocialSecurityCalculatorLoader";
import SimpleCalculatorHero from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import StandardFAQSection from "@/src/templates/take-home-pay/StandardFAQSection";
import {
  StatChipsRow, ContentCardGrid, SEOTextBlock, InsightStrip, RelatedCalcCards,
} from "@/src/templates/take-home-pay/StandardSEOSection";
import { calculateSocialSecurity, SSA } from "@/lib/calculators/socialSecurityEngine";

// ─── Worked example (single source of truth — uses the SSA 2025 formula) ──────
// 1975 birth (FRA 67), $75k steady income. Numbers below derive from the engine
// so the copy stays consistent with the calculator.
const EX = calculateSocialSecurity({ birthYear: 1975, annualIncome: 75_000, claimingAge: 67 });
const usd = (n: number) => `$${Math.round(n).toLocaleString()}`;
const SY = SSA.year;

export const metadata: Metadata = {
  title: `Social Security Calculator ${SY} – Estimate Your Monthly Benefit`,
  description:
    "Estimate your monthly Social Security retirement benefit and see how claiming at 62 vs full retirement age vs 70 changes it for life. Uses the official SSA bend-point formula.",
  keywords: ["social security calculator", "social security benefit estimator", "social security retirement calculator", "when to claim social security", "social security claiming age calculator"],
  alternates: { canonical: "https://worthulator.com/tools/social-security-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "How is my Social Security benefit calculated?",
    a: `The SSA averages your highest 35 years of inflation-indexed earnings into an AIME (Average Indexed Monthly Earnings), then applies a bend-point formula: 90% of the first $${SSA.bendPoint1.toLocaleString()}, 32% up to $${SSA.bendPoint2.toLocaleString()}, and 15% above (SSA ${SY}). That gives your Primary Insurance Amount — the monthly benefit at full retirement age. This calculator approximates that from a steady income.`,
  },
  {
    q: "What is my full retirement age (FRA)?",
    a: "FRA depends on your birth year. It's 66 for people born 1943–1954, rises by two months per year for 1955–1959, and is 67 for anyone born in 1960 or later. Claiming before FRA permanently reduces your benefit; claiming after increases it.",
  },
  {
    q: "How much less do I get if I claim at 62?",
    a: `Claiming at the earliest age, 62, with an FRA of 67 cuts your benefit by about 30% — you'd receive roughly ${usd(EX.benefitAt62)}/mo instead of the ${usd(EX.benefitAtFra)} full benefit in our example. That reduction is permanent, not just until FRA.`,
  },
  {
    q: "Is it worth waiting until 70?",
    a: `Each year you delay past FRA adds 8% in delayed retirement credits, up to age 70. In the example, waiting from 62 to 70 raises the monthly benefit from about ${usd(EX.benefitAt62)} to ${usd(EX.benefitAt70)} — roughly ${Math.round(((EX.benefitAt70 - EX.benefitAt62) / EX.benefitAt62) * 100)}% more for life. Whether it's "worth it" depends on your health, other income, and how long you expect to live.`,
  },
  {
    q: "Is this the official SSA amount?",
    a: "No — it's an estimate. Your real benefit depends on your full earnings history, future earnings, and annual cost-of-living adjustments. For your official, personalized estimate, create a free account at ssa.gov/myaccount.",
  },
];

const STATS = [
  { stat: `${EX.fraLabel}`, color: "text-violet-600", accent: "bg-violet-500", label: `full retirement age for someone born in 1975 — SSA rules` },
  { stat: usd(EX.benefitAtFra), color: "text-blue-600", accent: "bg-blue-500", label: `estimated full monthly benefit on a $75k steady income (SSA ${SY} formula)` },
  { stat: `+${Math.round(((EX.benefitAt70 - EX.benefitAt62) / EX.benefitAt62) * 100)}%`, color: "text-amber-600", accent: "bg-amber-500", label: `more per month claiming at 70 vs 62 — for the rest of your life` },
];

const CONTENT_CARDS = [
  {
    icon: "🎂",
    title: "Your birth year sets the baseline",
    body: "Full retirement age is 67 for everyone born in 1960 or later. That's the age at which you receive 100% of your calculated benefit — the Primary Insurance Amount. Claiming earlier or later adjusts it by fixed, permanent percentages.",
  },
  {
    icon: "📉",
    title: "Claiming early costs you for life",
    body: `Take benefits at 62 and you lock in about 70% of your full amount — around ${usd(EX.benefitAt62)}/mo versus ${usd(EX.benefitAtFra)} at FRA in our example. It can still be the right call if you need the income or expect a shorter lifespan, but the reduction never goes away.`,
  },
  {
    icon: "📈",
    title: "Delaying is a guaranteed 8%/yr",
    body: `Between FRA and 70, every year you wait adds 8% in delayed retirement credits — a guaranteed, inflation-protected raise that's hard to beat elsewhere. Waiting to 70 yields roughly ${usd(EX.benefitAt70)}/mo in the example, the maximum possible.`,
  },
];

const RELATED_CALCS = [
  { title: "Retirement Calculator", description: "Will your savings last through retirement?", href: "/tools/retirement-calculator", icon: "🏖️", accent: "bg-emerald-500/10" },
  { title: "401(k) Calculator", description: "Project your workplace retirement savings.", href: "/tools/401k-calculator", icon: "💼", accent: "bg-blue-500/10" },
  { title: "FIRE Calculator", description: "When could you retire early?", href: "/tools/fire-calculator", icon: "🔥", accent: "bg-violet-500/10" },
  { title: "Life Expectancy Calculator", description: "A key input to the claiming decision.", href: "/tools/life-expectancy-calculator", icon: "⏳", accent: "bg-amber-500/10" },
];

export default function SocialSecurityCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Social Security Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description: "Estimate your monthly Social Security retirement benefit and compare claiming ages from 62 to 70, using the SSA bend-point formula.",
      url: "https://worthulator.com/tools/social-security-calculator",
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
        eyebrowIcon="🏛️"
        eyebrowText="Retirement · Social Security · Claiming Age"
        title="Social Security Calculator"
        description="Estimate your monthly Social Security benefit and see exactly how claiming at 62, your full retirement age, or 70 changes it — for the rest of your life."
        chips={["Estimated monthly benefit", "Claiming-age comparison", "Full retirement age"]}
      >
        <SocialSecurityCalculatorLoader />
      </SimpleCalculatorHero>

      <InsightStrip
        text={`The single biggest lever is <span class="font-semibold text-gray-900">when you claim</span>: in our example, age 70 pays about ${usd(EX.benefitAt70)}/mo versus ${usd(EX.benefitAt62)} at 62 — for life.`}
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="When you claim matters more than almost anything"
        subtitle="Your benefit is set by a formula — but the claiming age is yours to choose, and it's permanent."
        cards={CONTENT_CARDS}
      />

      <SEOTextBlock
        title="How the Social Security Calculator Works"
        formula={`AIME ≈ (your indexed earnings, capped at $${SSA.wageBase.toLocaleString()}) ÷ 12

PIA (full benefit) = 90% × first $${SSA.bendPoint1.toLocaleString()}
                   + 32% × ($${SSA.bendPoint1.toLocaleString()} to $${SSA.bendPoint2.toLocaleString()})
                   + 15% × (above $${SSA.bendPoint2.toLocaleString()})

Claim before FRA: −5/9 of 1%/mo (first 36 mo), then −5/12 of 1%/mo
Claim after FRA:  +2/3 of 1%/mo (8%/yr) up to age 70`}
        steps={[
          { label: "Enter your birth year", description: "It determines your full retirement age (67 for 1960+)." },
          { label: "Enter your income", description: `A steady-career estimate, capped at the $${SSA.wageBase.toLocaleString()} taxable wage base.` },
          { label: "Choose a claiming age", description: "Anywhere from 62 (earliest) to 70 (maximum)." },
          { label: "See your estimate", description: "Your monthly benefit, and the full 62–70 comparison." },
          { label: "Verify officially", description: "Confirm with your real earnings record at ssa.gov/myaccount." },
        ]}
        paragraphs={[
          `Social Security replaces a share of your pre-retirement income using a progressive formula: lower earnings are replaced at 90%, middle earnings at 32%, and higher earnings at 15% (SSA ${SY} bend points). Because of the caps and bend points, the program intentionally replaces more income for lower earners.`,
          "The claiming-age decision is the part you control. Claiming at 62 can make sense if you need the money or have health concerns; delaying to 70 maximizes a guaranteed, inflation-adjusted income stream. There's no universally correct answer — but seeing the numbers side by side makes the trade-off clear.",
        ]}
      />

      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      <RelatedCalcCards
        title="Related Calculators"
        subtitle="More tools for planning retirement."
        items={RELATED_CALCS}
      />
    </main>
  );
}
