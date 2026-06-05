import type { Metadata } from "next";
import IncomeTaxCalculatorLoader from "./IncomeTaxCalculatorLoader";
import { calculateIncomeTax } from "@/lib/calculators/incomeTaxEngine";
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
  title: "Income Tax Calculator - Federal & State Tax by Bracket",
  description:
    "Calculate your income tax broken down bracket by bracket. See federal and state income tax, how much comes from each rate band, your effective and marginal rates, and your income after tax. US and UK.",
  keywords: [
    "income tax calculator",
    "federal income tax calculator",
    "tax bracket calculator",
    "income tax estimator",
    "state income tax calculator",
  ],
  alternates: { canonical: "https://worthulator.com/tools/income-tax-calculator" },
  robots: { index: true, follow: true },
};

const TAX_YEAR = getUSTaxData().taxYear;

// Deterministic worked examples computed at build from the engine.
const EX = calculateIncomeTax({ country: "US", annualIncome: 80_000, filingStatus: "single", stateRatePct: 0, year: 2026 });
const EX_150 = calculateIncomeTax({ country: "US", annualIncome: 150_000, filingStatus: "single", stateRatePct: 0, year: 2026 });
const TOP_BAND = EX.brackets.reduce((max, b) => (b.tax > max.tax ? b : max), EX.brackets[0]);

const money = (n: number) => `$${Math.round(n).toLocaleString()}`;
const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

const FAQS = [
  {
    q: "How is income tax calculated?",
    a: `Income tax is progressive: your income above the standard deduction is split across rate bands, and each band taxes only the income inside it. On ${money(80_000)} (single, ${TAX_YEAR}) the taxable amount is ${money(EX.taxableIncome)}, producing ${money(EX.federalTax)} of federal income tax across the ${EX.brackets.length} bands you reach.`,
  },
  {
    q: "What is my tax bracket?",
    a: `Your bracket is the rate your last dollar is taxed at — ${pct(EX.marginalRate)} in the example. But you do not pay that on all your income: the ${TOP_BAND.ratePct}% band contributes the most tax (${money(TOP_BAND.tax)}), while lower bands tax your earlier dollars less.`,
  },
  {
    q: "What's the difference between effective and marginal tax rate?",
    a: `The marginal rate (${pct(EX.marginalRate)}) is your top bracket; the effective rate (${pct(EX.effectiveTaxRate)}) is total income tax divided by income. The effective rate is always lower because the lowest brackets apply first.`,
  },
  {
    q: "Does this include Social Security and Medicare?",
    a: `No — this calculator is income tax only (federal plus optional state), so you can see your bracket detail clearly. For the full burden including payroll tax (FICA), use the Tax Calculator, which adds Social Security and Medicare.`,
  },
  {
    q: "How much does income tax rise as I earn more?",
    a: `Because higher dollars hit higher brackets, the effective rate climbs. Federal income tax rises from ${money(EX.federalTax)} at ${money(80_000)} to ${money(EX_150.federalTax)} at ${money(150_000)} — an effective rate of ${pct(EX_150.effectiveTaxRate)} versus ${pct(EX.effectiveTaxRate)}.`,
  },
];

const STATS = [
  {
    stat: money(EX.federalTax),
    color: "text-indigo-600",
    accent: "bg-indigo-500",
    label: `Federal income tax on ${money(80_000)} (single, ${TAX_YEAR})`,
  },
  {
    stat: pct(EX.effectiveTaxRate),
    color: "text-blue-600",
    accent: "bg-blue-500",
    label: "Effective income-tax rate on that income",
  },
  {
    stat: pct(EX.marginalRate),
    color: "text-violet-600",
    accent: "bg-violet-500",
    label: "Marginal rate — the band your last dollar falls in",
  },
];

const CONTENT_CARDS = [
  {
    icon: "🪜",
    title: "Brackets are stairs, not a cliff",
    body: "Moving into a higher bracket only taxes the income above the threshold at the higher rate — the rest keeps its lower rates. The bracket breakdown shows exactly how much tax each band adds.",
  },
  {
    icon: "🎯",
    title: "Effective is what you really pay",
    body: "Your marginal rate sounds high, but it applies to your last dollars only. The effective rate — total income tax over your income — is the number that reflects your actual cost.",
  },
  {
    icon: "🏛️",
    title: "Federal plus state",
    body: "Most US states add their own income tax. Pick your state to layer its top marginal rate on top of the federal calculation, or choose a no-tax state to see federal only.",
  },
];

const RELATED_CALCS = [
  {
    title: "Tax Calculator",
    description: "Total burden including payroll tax (FICA).",
    href: "/tools/tax-calculator",
    icon: "🧾",
    accent: "bg-rose-500/10",
  },
  {
    title: "Paycheck Calculator",
    description: "Your take-home pay per paycheck.",
    href: "/tools/paycheck-calculator",
    icon: "💵",
    accent: "bg-blue-500/10",
  },
  {
    title: "Federal Income Tax Rate Calculator",
    description: "Focus on the federal brackets alone.",
    href: "/tools/federal-income-tax-rate-calculator",
    icon: "🏛️",
    accent: "bg-emerald-500/10",
  },
  {
    title: "After-Tax Income Calculator",
    description: "Turn gross pay into what you keep.",
    href: "/tools/after-tax-income-calculator",
    icon: "🏦",
    accent: "bg-amber-500/10",
  },
];

export default function IncomeTaxCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Income Tax Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description:
        "Calculate federal and state income tax bracket by bracket, with effective and marginal rates and income after tax, for the US and UK.",
      url: "https://worthulator.com/tools/income-tax-calculator",
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
        eyebrowIcon="📋"
        eyebrowText="Finance · Taxes"
        title="Income Tax Calculator"
        description="See your income tax broken down bracket by bracket — federal and state, how much each rate band adds, your effective and marginal rates, and your income after tax."
        chips={["Tax by bracket", "Effective vs marginal", "Federal + state"]}
      >
        <IncomeTaxCalculatorLoader taxYear={TAX_YEAR} />
      </SimpleCalculatorHero>

      <InsightStrip
        text={`A ${money(80_000)} single filer owes about <span class="font-semibold text-gray-900">${money(EX.federalTax)}</span> in federal income tax for ${TAX_YEAR} — an effective rate of ${pct(EX.effectiveTaxRate)}, despite a ${pct(EX.marginalRate)} top bracket.`}
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="How income tax brackets really work"
        subtitle="Graduated rates, the gap between effective and marginal, and adding state tax."
        cards={CONTENT_CARDS}
      />

      <SEOTextBlock
        title="How the Income Tax Calculator Works"
        formula={`taxableIncome = max(0, gross − standardDeduction)
For each bracket [lower, upper) at rate:
    taxedInBand = max(0, min(taxableIncome, upper) − lower)
    taxInBand   = taxedInBand × rate
federalTax    = Σ taxInBand
stateTax      = gross × state rate
totalIncomeTax = federalTax + stateTax
effectiveRate  = totalIncomeTax ÷ gross`}
        steps={[
          { label: "Choose your country", description: "US (federal + state brackets) or UK (HMRC bands)." },
          { label: "Enter gross income", description: "Total annual income before tax." },
          { label: "Set filing status", description: "Single or married — selects US brackets and deduction." },
          { label: "Pick your state", description: "Adds the state's top marginal income tax rate (US)." },
          { label: "Review the breakdown", description: "See tax per bracket, plus effective and marginal rates." },
        ]}
        paragraphs={[
          `Each bracket taxes only the slice of income that falls within it, so the per-band breakdown adds up exactly to your federal income tax. State tax here uses the top marginal rate as a simple estimate; your state return may apply its own brackets and deductions. Payroll taxes (Social Security and Medicare) are intentionally excluded so the bracket detail stays clear.`,
          `Figures use the ${TAX_YEAR} statutory tables — US IRS brackets and standard deduction, and UK HMRC bands with the tapered personal allowance. They are estimates for planning, not tax advice or a filed return.`,
        ]}
      />

      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      <RelatedCalcCards
        title="Related Calculators"
        subtitle="See the full burden, your take-home, and what you keep after tax."
        items={RELATED_CALCS}
      />
    </main>
  );
}
