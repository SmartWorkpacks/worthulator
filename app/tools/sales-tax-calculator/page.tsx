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
  title: "Sales Tax Calculator 2026 – Instant Tax & Total Price",
  description:
    "Calculate the exact sales tax amount and total price for any purchase. Enter the price and your state tax rate for an instant breakdown.",
  keywords: ["sales tax calculator", "tax calculator", "how much is sales tax", "state sales tax", "total price with tax"],
  alternates: { canonical: "https://worthulator.com/tools/sales-tax-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "What is the average US sales tax rate?",
    a: "The average combined state and local sales tax rate in the US is about 7.12% in 2026. State rates range from 0% (Oregon, Montana, New Hampshire, Delaware) to 9.55% (Tennessee). Add local rates and the total can exceed 10% in some cities.",
  },
  {
    q: "Is sales tax calculated on the pre-tax or post-tax price?",
    a: "Always on the pre-tax (listed) price. The tax is a percentage of the base price, added on top. So a $100 item at 8.5% tax = $8.50 tax, for a total of $108.50.",
  },
  {
    q: "Do all states have sales tax?",
    a: "No — Oregon, Montana, New Hampshire, Delaware, and Alaska have no statewide sales tax. However, some Alaskan localities still charge local sales tax. Always check your local jurisdiction.",
  },
  {
    q: "Is sales tax charged on services?",
    a: "It depends on the state. Most states tax tangible goods. Services like haircuts, legal advice, and consulting are taxed in some states but not others. Digital goods and software are increasingly taxed as states update their laws.",
  },
  {
    q: "How do I find my state's exact sales tax rate?",
    a: "The Tax Foundation publishes up-to-date state sales tax tables. Your state's Department of Revenue website is the most accurate source for combined state + local rates in your specific zip code.",
  },
];

const STATS = [
  { stat: "7.12%", color: "text-emerald-600", accent: "bg-emerald-500", label: "Average combined US sales tax rate in 2026" },
  { stat: "5",     color: "text-blue-600",    accent: "bg-blue-500",    label: "US states with zero statewide sales tax" },
  { stat: "10%+",  color: "text-amber-600",   accent: "bg-amber-500",   label: "Combined rate in some US cities — significantly above the national average" },
];

const CONTENT_CARDS = [
  {
    icon: "🗺️",
    title: "Rates vary wildly by location",
    body: "Tennessee has the highest average combined rate at 9.55%. Oregon has zero. The same $500 TV costs $547.75 in Tennessee and $500 in Oregon. For large purchases, the state you buy in genuinely matters.",
  },
  {
    icon: "🛒",
    title: "Groceries and medicine are often exempt",
    body: "Many states exempt groceries and prescription drugs from sales tax entirely, or apply a reduced rate. This varies significantly by state — some only exempt unprepared food, others are broader.",
  },
  {
    icon: "💻",
    title: "Online purchases and tax",
    body: "Since the 2018 South Dakota v. Wayfair Supreme Court ruling, online retailers must collect sales tax in states where they have 'economic nexus.' Expect to pay sales tax on most online purchases now.",
  },
];

const RELATED_CALCS = [
  { title: "Tip Calculator",             description: "Calculate the tip and split any bill evenly.",           href: "/tools/tip-calculator",              icon: "🍽️", accent: "bg-emerald-500/10" },
  { title: "Discount Calculator",        description: "See your final price after any sale or promo.",         href: "/tools/discount-calculator",         icon: "🏷️", accent: "bg-blue-500/10" },
  { title: "Percentage Of Calculator",   description: "Calculate any percentage of any number.",               href: "/tools/percentage-of-calculator",    icon: "%",  accent: "bg-amber-500/10" },
  { title: "Markup Calculator",          description: "Calculate selling price from cost and markup.",         href: "/tools/markup-calculator",           icon: "📦", accent: "bg-purple-500/10" },
];

export default function SalesTaxCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Sales Tax Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description: "Calculate sales tax amount and total price for any purchase.",
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
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <SimpleCalculatorHero
        eyebrowIcon="🧾"
        eyebrowText="Everyday · Quick Math"
        title="Sales Tax Calculator"
        description="Enter the price and your state tax rate to instantly see the tax amount and total price."
        chips={["Tax amount", "Total with tax", "State rate presets"]}
      >
        <CalculatorEngineLoader slug="sales-tax" />
      </SimpleCalculatorHero>
      <InsightStrip text='Sales tax rates vary by over 10 percentage points across the US — <span class="font-semibold text-gray-900">knowing yours matters on every big purchase.</span>' />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="Sales tax — what you need to know" subtitle="The hidden cost on every price tag." cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the Sales Tax Calculator Works"
        formula={`Tax Amount  = Price × (Tax Rate ÷ 100)
Total Price = Price + Tax Amount`}
        steps={[
          { label: "Enter the pre-tax price", description: "The listed price before tax — what you see on the tag or website." },
          { label: "Enter your tax rate", description: "Use the quick presets or check your state's current combined rate." },
          { label: "Read the result", description: "You get the exact tax amount and the final total to pay." },
        ]}
        paragraphs={[
          "Sales tax is always calculated on the base (pre-tax) price, then added on top. The formula is simple: multiply the price by the tax rate as a decimal.",
          "Rates shown here are for reference. Always verify your exact combined state + local rate for your zip code, especially for large purchases.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />
      <RelatedCalcCards title="Related Calculators" subtitle="More tools for everyday money math." items={RELATED_CALCS} />
    </main>
  );
}
