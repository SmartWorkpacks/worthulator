import type { Metadata } from "next";
import TaxCalculatorLoader from "./TaxCalculatorLoader";
import { calculateTax } from "@/lib/calculators/taxEngine";
import { getUSTaxData } from "@/data/tax";
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
  title: "Tax Calculator - Estimate Your Total Income Tax & Take-Home",
  description:
    "Estimate your total annual tax — federal income tax, payroll tax (FICA), and state income tax — with your effective rate, marginal rate, and after-tax income. Supports US and UK for the current tax year.",
  keywords: [
    "tax calculator",
    "income tax calculator",
    "federal tax calculator",
    "effective tax rate calculator",
    "after tax income calculator",
  ],
  alternates: { canonical: "https://worthulator.com/tools/tax-calculator" },
  robots: { index: true, follow: true },
};

const TAX_YEAR = getUSTaxData().taxYear;

// Deterministic worked examples computed at build from the engine.
const EX = calculateTax({ country: "US", annualIncome: 75_000, filingStatus: "single", stateRatePct: 0, year: 2026 });
const EX_150 = calculateTax({ country: "US", annualIncome: 150_000, filingStatus: "single", stateRatePct: 0, year: 2026 });

const money = (n: number) => `$${Math.round(n).toLocaleString()}`;
const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

const FAQS = [
  {
    q: "How much tax will I pay on my income?",
    a: `Your total tax is income tax plus payroll tax and any state income tax. On a ${money(75_000)} salary (single, no state tax) the estimate is about ${money(EX.totalTax)} for the ${TAX_YEAR} tax year — an effective rate of ${pct(EX.effectiveTaxRate)}, leaving ${money(EX.afterTaxIncome)} after tax.`,
  },
  {
    q: "What is the difference between effective and marginal tax rate?",
    a: `Your marginal rate is the bracket your last dollar falls into (${pct(EX.marginalRate)} in the example); your effective rate is total tax divided by income. Because lower brackets tax earlier dollars less, the effective income-tax rate (${pct(EX.incomeTaxEffectiveRate)}) is well below the marginal rate.`,
  },
  {
    q: "Does this include Social Security and Medicare?",
    a: `Yes. For US filers the total includes FICA — Social Security (6.2% up to the wage base) and Medicare (1.45%, plus 0.9% on high earners). In the ${money(75_000)} example, FICA is ${money(EX.socialSecurity + EX.medicare)} on top of ${money(EX.incomeTax)} of federal income tax.`,
  },
  {
    q: "How does income tax change as I earn more?",
    a: `Tax is progressive, so the effective rate climbs with income. The single filer's total tax rises from ${money(EX.totalTax)} at ${money(75_000)} to ${money(EX_150.totalTax)} at ${money(150_000)} — an effective rate of ${pct(EX_150.effectiveTaxRate)} versus ${pct(EX.effectiveTaxRate)}.`,
  },
  {
    q: "Are these tax figures current?",
    a: `The calculator uses the ${TAX_YEAR} statutory tax tables (US IRS brackets and standard deduction; UK HMRC bands, personal allowance, and National Insurance). These are set by law and update on the statutory schedule, not daily — so figures are estimates for planning, not a filed return.`,
  },
];

const STATS = [
  {
    stat: money(EX.totalTax),
    color: "text-rose-600",
    accent: "bg-rose-500",
    label: `Total tax on ${money(75_000)} (single, no state) for ${TAX_YEAR}`,
  },
  {
    stat: pct(EX.effectiveTaxRate),
    color: "text-blue-600",
    accent: "bg-blue-500",
    label: "Effective rate — total tax as a share of income",
  },
  {
    stat: pct(EX.marginalRate),
    color: "text-amber-600",
    accent: "bg-amber-500",
    label: "Marginal rate — the bracket your last dollar hits",
  },
];

const CONTENT_CARDS = [
  {
    icon: "🧮",
    title: "Three taxes, one bill",
    body: "Your total burden combines federal income tax (progressive brackets after the standard deduction), payroll tax for Social Security and Medicare, and any state income tax. Seeing them together is the real picture.",
  },
  {
    icon: "📊",
    title: "Effective beats marginal for planning",
    body: "Your top bracket is scary, but you never pay that rate on every dollar. The effective rate — what you actually pay overall — is the number that tells you your true take-home.",
  },
  {
    icon: "🌍",
    title: "US and UK supported",
    body: "Switch to the UK to model income tax with the tapered personal allowance and employee National Insurance instead of FICA and state tax. Both use the current statutory tables.",
  },
];

const RELATED_CALCS = [
  {
    title: "Paycheck Calculator",
    description: "See your take-home pay per paycheck.",
    href: "/tools/paycheck-calculator",
    icon: "💵",
    accent: "bg-blue-500/10",
  },
  {
    title: "Income Tax Calculator",
    description: "Drill into income tax bracket by bracket.",
    href: "/tools/income-tax-calculator",
    icon: "📋",
    accent: "bg-emerald-500/10",
  },
  {
    title: "After-Tax Income Calculator",
    description: "Convert gross pay into what you keep.",
    href: "/tools/after-tax-income-calculator",
    icon: "🏦",
    accent: "bg-amber-500/10",
  },
  {
    title: "Tax Withholding Calculator",
    description: "Check whether your withholding is on track.",
    href: "/tools/tax-withholding-calculator",
    icon: "🧾",
    accent: "bg-violet-500/10",
  },
];

export default function TaxCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Tax Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description:
        "Estimate total annual tax — income tax, payroll tax, and state income tax — with effective and marginal rates and after-tax income for the US and UK.",
      url: "https://worthulator.com/tools/tax-calculator",
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
        eyebrowIcon="🧾"
        eyebrowText="Finance · Taxes"
        title="Tax Calculator"
        description="Estimate your total annual tax — income tax, payroll tax, and state income tax — with your effective rate, marginal rate, and after-tax income. US and UK, for the current tax year."
        chips={["Total tax owed", "Effective vs marginal rate", "After-tax income"]}
      >
        <TaxCalculatorLoader taxYear={TAX_YEAR} />
      </SimpleCalculatorHero>

      <InsightStrip
        text={`A ${money(75_000)} salary (single, no state tax) owes about <span class="font-semibold text-gray-900">${money(EX.totalTax)}</span> in total tax for ${TAX_YEAR} — an effective rate of ${pct(EX.effectiveTaxRate)}.`}
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="Understanding your total tax"
        subtitle="Income tax, payroll tax, and state tax — plus the rates that actually matter."
        cards={CONTENT_CARDS}
      />

      <SEOTextBlock
        title="How the Tax Calculator Works"
        formula={`taxableIncome = max(0, gross − standardDeduction)
incomeTax     = progressive over the year's brackets
payrollTax    = Social Security (6.2% to wage base) + Medicare (1.45% + 0.9% high earners)
stateTax      = gross × state rate
totalTax      = incomeTax + payrollTax + stateTax
effectiveRate = totalTax ÷ gross`}
        steps={[
          { label: "Choose your country", description: "US (federal + state) or UK (income tax + National Insurance)." },
          { label: "Enter your gross income", description: "Total annual income before tax." },
          { label: "Set filing status", description: "Single or married — selects US brackets and standard deduction." },
          { label: "Pick your state", description: "Applies the state's top marginal income tax rate (US)." },
          { label: "Review your tax", description: "See total tax, effective and marginal rates, and what you keep." },
        ]}
        paragraphs={[
          `Income tax is applied progressively across brackets after the standard deduction (or UK personal allowance), so only the income within each band is taxed at that band's rate. State tax here uses the top marginal rate as a simple estimate; your actual state return may apply its own brackets and deductions.`,
          `Figures use the ${TAX_YEAR} statutory tax tables — US IRS brackets, standard deduction, and FICA rates, and UK HMRC bands, the tapered personal allowance, and employee National Insurance. They update on the legislative schedule and are estimates for planning, not tax advice.`,
        ]}
      />

      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      <RelatedCalcCards
        title="Related Calculators"
        subtitle="Go from gross pay to take-home and check your withholding."
        items={RELATED_CALCS}
      />
    </main>
  );
}
