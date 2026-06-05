import type { Metadata } from "next";
import SalesTaxWithInsights from "@/components/worthcore/SalesTaxWithInsights";
import SimpleCalculatorHero from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import StandardFAQSection from "@/src/templates/take-home-pay/StandardFAQSection";
import {
  StatChipsRow,
  ContentCardGrid,
  SEOTextBlock,
  InsightStrip,
  RelatedCalcCards,
} from "@/src/templates/take-home-pay/StandardSEOSection";
import SalesTaxCharts from "./SalesTaxCharts";
import {
  NATIONAL_AVG_SALES_TAX,
  SALES_TAX_RATES,
} from "@/lib/datasets/tax/salesTaxRates";
import { calculateSalesTax } from "@/calculations/shopping/salesTax";

export const metadata: Metadata = {
  title:
    "Sales Tax Calculator 2026 – State Sales Tax Rate, Annual Burden & Neighbor Comparison",
  description:
    "Select your state and see the exact sales tax on any purchase, your annual tax burden on monthly spending, how your rate compares to neighboring states, and whether groceries are exempt — using live Tax Foundation 2026 combined rates.",
  keywords: [
    "sales tax calculator",
    "state sales tax rate",
    "sales tax by state",
    "annual sales tax burden",
    "grocery tax exemption",
    "sales tax comparison",
    "combined sales tax rate 2026",
  ],
  alternates: {
    canonical: "https://worthulator.com/tools/sales-tax-calculator",
  },
  robots: { index: true, follow: true },
};

/* ── Step 5c: derive every number in the copy from the live tax dataset ──────
   so FAQ / stat chips / SEO auto-refresh when Tax Foundation rates update. ─── */
const usd0 = (n: number) => `$${Math.round(n).toLocaleString()}`;
const usd2 = (n: number) => `$${n.toFixed(2)}`;
const AVG_ANNUAL_GROCERY = 7_500;
const fvAnnuity = (annual: number, yrs: number) =>
  Math.round(annual * ((Math.pow(1.07, yrs) - 1) / 0.07));

const EX = calculateSalesTax(
  { price: 100, monthlySpend: 800, state: "US Average" },
  {
    combinedRate: NATIONAL_AVG_SALES_TAX,
    stateRate: NATIONAL_AVG_SALES_TAX,
    groceryExempt: false,
    neighbors: [],
    neighborRates: [],
    localNote: "",
  },
);
const TOP_STATE = [...SALES_TAX_RATES].sort(
  (a, b) => b.combinedRate - a.combinedRate,
)[0];
const TOP = calculateSalesTax(
  { price: 100, monthlySpend: 800, state: TOP_STATE.name },
  {
    combinedRate: TOP_STATE.combinedRate,
    stateRate: TOP_STATE.stateRate,
    groceryExempt: TOP_STATE.groceryExempt,
    neighbors: [],
    neighborRates: [],
    localNote: "",
  },
);
const HIGH_LOW_SPREAD = TOP.annualTaxBurden; // vs a 0% state
const AVG_GROCERY_TAX = Math.round(AVG_ANNUAL_GROCERY * (NATIONAL_AVG_SALES_TAX / 100));
const TOP_GROCERY_TAX = Math.round(AVG_ANNUAL_GROCERY * (TOP_STATE.combinedRate / 100));

const FAQS = [
  {
    q: "How is sales tax calculated?",
    a: `Sales tax is always calculated on the pre-tax (listed) price. Multiply the price by the tax rate as a decimal: $100 × ${(NATIONAL_AVG_SALES_TAX / 100).toFixed(4)} = ${usd2(EX.taxAmount)} in tax. The total you pay is $100 + ${usd2(EX.taxAmount)} = ${usd2(EX.totalPrice)}. This calculator uses your state's live combined rate (state + average local) from the Tax Foundation.`,
  },
  {
    q: "What is the average US sales tax rate in 2026?",
    a: `The average combined state and local sales tax rate in the US is ${NATIONAL_AVG_SALES_TAX}% in 2026 (Tax Foundation). State rates range from 0% (Oregon, Montana, New Hampshire, Delaware) to ${TOP_STATE.combinedRate}% (${TOP_STATE.name}). Add local rates and the total can exceed 10% in some cities — Chicago and parts of Los Angeles hit 10.25%.`,
  },
  {
    q: "How much do I actually pay in sales tax per year?",
    a: `At the US average of ${NATIONAL_AVG_SALES_TAX}% on $800/month of taxable spending, you pay ${usd2(EX.monthlyTaxBurden)}/month — ${usd2(EX.annualTaxBurden)}/year, or ${usd2(EX.dailyTaxBurden)} every single day. At ${TOP_STATE.name}'s ${TOP_STATE.combinedRate}%, the same spending costs ${usd2(TOP.annualTaxBurden)}/year. In Oregon, it's $0. The annual difference between the highest and lowest states on $800/month is ${usd0(HIGH_LOW_SPREAD)}.`,
  },
  {
    q: "Which states have no sales tax?",
    a: "Five states have no statewide sales tax: Oregon, Montana, New Hampshire, Delaware, and Alaska. However, some Alaskan boroughs and cities levy their own local sales tax (Juneau is around 5%). The other four have zero sales tax at every level — Montana residents pay no tax on any purchase.",
  },
  {
    q: "Are groceries taxed in my state?",
    a: `It depends on the state. Many states (California, Texas, New York, etc.) exempt unprepared groceries from sales tax entirely. Others — Tennessee, Alabama, Mississippi, Kansas — tax groceries at the full combined rate. On a USDA moderate-cost grocery plan (~$7,500/year), the difference between exempt and taxed at ${TOP_STATE.combinedRate}% is ${usd0(TOP_GROCERY_TAX)}/year for a typical household.`,
  },
  {
    q: "How does my state compare to neighboring states?",
    a: "This calculator automatically compares your state's combined rate to the average of your geographic neighbors. For example, Washington (9.38%) borders Oregon (0%) — a 9.38-point gap that makes cross-border shopping for large purchases (electronics, furniture, appliances) a rational financial decision for residents near the state line.",
  },
];

const STATS = [
  {
    stat: `${NATIONAL_AVG_SALES_TAX}%`,
    color: "text-emerald-600",
    accent: "bg-emerald-500",
    label: "Average combined US sales tax rate in 2026 (Tax Foundation)",
  },
  {
    stat: usd0(EX.annualTaxBurden),
    color: "text-blue-600",
    accent: "bg-blue-500",
    label: "Annual tax burden on $800/month at the US average rate",
  },
  {
    stat: `${TOP_STATE.combinedRate}%`,
    color: "text-amber-600",
    accent: "bg-amber-500",
    label: `Highest combined rate — ${TOP_STATE.name} (2026)`,
  },
];

const CONTENT_CARDS = [
  {
    icon: "🗺️",
    title: "Rates vary wildly — and your neighbors matter",
    body: `${TOP_STATE.name}'s combined rate of ${TOP_STATE.combinedRate}% costs ${usd0(TOP.annualTaxBurden)}/year on $800/month of taxable spending. Oregon's 0% costs nothing. Washington (9.38%) borders Oregon — a fact that drives billions in cross-border shopping. This calculator shows you exactly how your state compares to its neighbors.`,
  },
  {
    icon: "🛒",
    title: "Grocery exemptions save families hundreds",
    body: `States that exempt groceries save a typical household ~${usd0(AVG_GROCERY_TAX)}/year at the average rate. States that don't — Tennessee, Alabama, Mississippi, Kansas — effectively impose a regressive food tax. This calculator tells you whether your state exempts groceries and what that's worth.`,
  },
  {
    icon: "📈",
    title: "The invisible investment drag",
    body: `${usd0(EX.annualTaxBurden)}/year in sales tax invested at 7% compounds to ${usd0(fvAnnuity(EX.annualTaxBurden, 10))} over 10 years and ${usd0(fvAnnuity(EX.annualTaxBurden, 20))} over 20. Sales tax is a fixed cost of where you live — but seeing the annual number makes it a real line item in your financial plan, not just a few cents on every receipt.`,
  },
];

const RELATED_CALCS = [
  {
    title: "Tip Calculator",
    description: "Calculate the tip and split any bill evenly.",
    href: "/tools/tip-calculator",
    icon: "🍽️",
    accent: "bg-emerald-500/10",
  },
  {
    title: "Discount Calculator",
    description: "See your final price after any sale or promo.",
    href: "/tools/discount-calculator",
    icon: "🏷️",
    accent: "bg-blue-500/10",
  },
  {
    title: "Subscription Auditor",
    description: "Audit recurring costs and find what to cut.",
    href: "/tools/subscription-auditor",
    icon: "📋",
    accent: "bg-amber-500/10",
  },
  {
    title: "Budget Calculator",
    description: "Build a 50/30/20 budget from your income.",
    href: "/tools/budget-calculator",
    icon: "💰",
    accent: "bg-purple-500/10",
  },
];

export default function SalesTaxCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Sales Tax Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description:
        "Calculate sales tax by state with live Tax Foundation 2026 combined rates, annual burden, neighbor comparison, and grocery exemption context.",
      url: "https://worthulator.com/tools/sales-tax-calculator",
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
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <SimpleCalculatorHero
        eyebrowIcon="🧾"
        eyebrowText="Live Data · State-Aware"
        title="Sales Tax Calculator"
        description="Select your state to instantly see the sales tax on any purchase, your annual tax burden, how your rate compares to neighboring states, and whether groceries are exempt — using live Tax Foundation 2026 combined rates."
        chips={[
          "Live state rate",
          "Annual burden",
          "Neighbor comparison",
          "Grocery exemption",
        ]}
      >
        <SalesTaxWithInsights />
      </SimpleCalculatorHero>
      <InsightStrip
        text={`Sales tax rates range from 0% to ${TOP_STATE.combinedRate}% across the US — on $800/month the annual difference is ${usd0(HIGH_LOW_SPREAD)}. <span class="font-semibold text-gray-900">Select your state to see what you actually pay.</span>`}
      />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid
        title="Sales tax — what the numbers mean"
        subtitle="The hidden cost on every purchase, made visible."
        cards={CONTENT_CARDS}
      />

      <SalesTaxCharts />
      <SEOTextBlock
        title="How the Sales Tax Calculator Works"
        formula={`Tax Amount       = Price × (Combined Rate ÷ 100)
Total Price      = Price + Tax Amount
Monthly Burden   = Monthly Spend × (Combined Rate ÷ 100)
Annual Burden    = Monthly Burden × 12
Grocery Saving   = $7,500 × (Rate ÷ 100)  [if exempt]`}
        steps={[
          {
            label: "Select your state",
            description:
              "The calculator loads your state's live combined sales tax rate (state + average local) from the Tax Foundation. You can also compare to the US average.",
          },
          {
            label: "Enter the purchase price",
            description:
              "The listed price before tax — what you see on the tag, website, or invoice.",
          },
          {
            label: "Enter your monthly taxable spending",
            description:
              "Your typical monthly spending on goods subject to sales tax. The US average is about $800/month. This powers the annual burden, neighbor comparison, and investment opportunity insights.",
          },
        ]}
        paragraphs={[
          `Sales tax is calculated on the base (pre-tax) price: multiply by the combined state + local rate as a decimal. At the US average of ${NATIONAL_AVG_SALES_TAX}%, a $100 purchase generates ${usd2(EX.taxAmount)} in tax for a total of ${usd2(EX.totalPrice)}.`,
          "This calculator uses Tax Foundation 2026 combined rates — the state statutory rate plus the average local rate for each state. It automatically compares your rate to neighboring states, flags whether groceries are exempt, and shows the annual and 10-year investment opportunity cost of your tax burden.",
          `Rates vary dramatically: ${TOP_STATE.name} tops the list at ${TOP_STATE.combinedRate}%, while Oregon, Montana, New Hampshire, and Delaware charge 0%. On $800/month of taxable spending, that's a ${usd0(HIGH_LOW_SPREAD)}/year difference — real money that shows up in annual budget planning.`,
        ]}
      />
      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />
      <RelatedCalcCards
        title="Related Calculators"
        subtitle="More tools for everyday money math."
        items={RELATED_CALCS}
      />
    </main>
  );
}
