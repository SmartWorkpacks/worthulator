import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CalculatorEngineLoader from "@/components/calculator-engine/CalculatorEngineLoader";
import InsightsSection from "@/components/insights/InsightsSection";
import SimpleCalculatorHero from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import StandardFAQSection from "@/src/templates/take-home-pay/StandardFAQSection";
import {
  StatChipsRow,
  ContentCardGrid,
  SEOTextBlock,
  InsightStrip,
  RelatedCalcCards,
} from "@/src/templates/take-home-pay/StandardSEOSection";
import {
  getSalesTaxBySlug,
  ALL_SALES_TAX_SLUGS,
  NATIONAL_AVG_SALES_TAX,
  type StateSalesTaxData,
} from "@/lib/datasets/tax/salesTaxRates";

export function generateStaticParams() {
  return ALL_SALES_TAX_SLUGS.map((slug) => ({ state: slug }));
}

interface Props {
  params: Promise<{ state: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state } = await params;
  const data = getSalesTaxBySlug(state);
  if (!data) return {};

  const rateLabel = data.noTax ? "no sales tax" : `${data.combinedRate}% combined rate`;

  return {
    title: `${data.name} Sales Tax Calculator 2026 | ${data.noTax ? "No Sales Tax" : `${data.combinedRate}%`}`,
    description: `Calculate sales tax in ${data.name} (${rateLabel}). See the exact tax amount, total price, and your annual tax burden — instantly.`,
    keywords: [
      `${data.name.toLowerCase()} sales tax`,
      `${data.name.toLowerCase()} sales tax calculator`,
      `${data.name.toLowerCase()} tax rate`,
      `sales tax calculator ${data.name.toLowerCase()}`,
    ],
    alternates: { canonical: `https://worthulator.com/tools/sales-tax-calculator/${state}` },
    robots: { index: true, follow: true },
  };
}

// ─── SEO content helpers ──────────────────────────────────────────────────────

function buildInsightStrip(d: StateSalesTaxData): string {
  if (d.noTax && d.combinedRate === 0) {
    return `${d.name} has <span class="font-semibold text-gray-900">no state sales tax</span> — shoppers here keep every dollar they spend.`;
  }
  if (d.noTax) {
    return `${d.name} has no statewide sales tax, though <span class="font-semibold text-gray-900">some local areas charge up to ${d.combinedRate}%</span>.`;
  }
  if (d.combinedRate > NATIONAL_AVG_SALES_TAX) {
    const diff = (d.combinedRate - NATIONAL_AVG_SALES_TAX).toFixed(2);
    return `${d.name}'s ${d.combinedRate}% combined rate is <span class="font-semibold text-gray-900">${diff}% above the US average</span> — every purchase costs more here than in most states.`;
  }
  const diff = (NATIONAL_AVG_SALES_TAX - d.combinedRate).toFixed(2);
  return `${d.name}'s ${d.combinedRate}% combined rate is <span class="font-semibold text-gray-900">${diff}% below the US average</span> — shoppers here pay less tax than in most states.`;
}

function buildStats(d: StateSalesTaxData) {
  if (d.noTax && d.combinedRate === 0) {
    return [
      { stat: "0%",    color: "text-emerald-600", accent: "bg-emerald-500", label: `${d.name} state sales tax rate — zero at every checkout` },
      { stat: "5",     color: "text-blue-600",    accent: "bg-blue-500",    label: "US states with no statewide sales tax" },
      { stat: `${NATIONAL_AVG_SALES_TAX}%`, color: "text-amber-600", accent: "bg-amber-500", label: "US national average combined rate — what you'd pay elsewhere" },
    ];
  }
  return [
    { stat: `${d.stateRate}%`,    color: "text-emerald-600", accent: "bg-emerald-500", label: `${d.name} statewide sales tax rate (statutory)` },
    { stat: `${d.combinedRate}%`, color: "text-blue-600",    accent: "bg-blue-500",    label: `${d.name} average combined rate including local taxes` },
    { stat: `#${d.rank}`,         color: "text-amber-600",   accent: "bg-amber-500",   label: `${d.name}'s combined rate rank in the US (1 = highest)` },
  ];
}

function buildContentCards(d: StateSalesTaxData) {
  const groceryCard = d.groceryExempt
    ? {
        icon: "🛒",
        title: "Groceries are exempt",
        body:  `${d.name} does not charge sales tax on unprepared groceries or prescription drugs. This meaningfully lowers the real tax burden for most households compared to the headline rate.`,
      }
    : {
        icon: "🛒",
        title: "Groceries are taxable",
        body:  `${d.name} applies sales tax to groceries and food items. This adds to the everyday cost of living compared to the 30+ states that fully exempt food from sales tax.`,
      };

  const localCard = {
    icon: "📍",
    title: "Local rates vary by city",
    body:  d.localNote,
  };

  const onlineCard = {
    icon: "💻",
    title: "Online purchases are taxed",
    body:  `Since the 2018 South Dakota v. Wayfair ruling, online retailers must collect sales tax in states where they have economic nexus. Expect to pay ${d.noTax ? "little to no" : `up to ${d.combinedRate}%`} sales tax on most online orders shipped to ${d.name}.`,
  };

  return [groceryCard, localCard, onlineCard];
}

function buildFAQs(d: StateSalesTaxData) {
  const rate = d.noTax && d.combinedRate === 0 ? "0%" : `${d.combinedRate}%`;
  return [
    {
      q: `What is the sales tax rate in ${d.name}?`,
      a: d.noTax && d.combinedRate === 0
        ? `${d.name} has no state or local sales tax. You pay the sticker price at checkout with no tax added.`
        : `The statewide rate in ${d.name} is ${d.stateRate}%. With local taxes included, the average combined rate is approximately ${d.combinedRate}%. ${d.localNote}`,
    },
    {
      q: `Are groceries taxed in ${d.name}?`,
      a: d.groceryExempt
        ? `No — ${d.name} fully exempts unprepared groceries and prescription drugs from sales tax.`
        : `Yes — ${d.name} applies sales tax to groceries. This is less common nationally; most states exempt food from sales tax entirely.`,
    },
    {
      q: `How does ${d.name}'s sales tax compare to the US average?`,
      a: d.noTax && d.combinedRate === 0
        ? `${d.name} has no sales tax, compared to the US national average of ${NATIONAL_AVG_SALES_TAX}%. This is a significant advantage for large purchases.`
        : d.combinedRate > NATIONAL_AVG_SALES_TAX
        ? `At ${rate} combined, ${d.name} is above the US average of ${NATIONAL_AVG_SALES_TAX}%. This means shoppers in ${d.name} pay more sales tax than in most states on the same purchases.`
        : `At ${rate} combined, ${d.name} is below the US national average of ${NATIONAL_AVG_SALES_TAX}% — a relative advantage compared to higher-rate states.`,
    },
    {
      q: `Is sales tax charged on online purchases in ${d.name}?`,
      a: `Yes. Following the 2018 South Dakota v. Wayfair Supreme Court ruling, online retailers with economic nexus in ${d.name} are required to collect sales tax. Most major online retailers now apply the local rate at checkout.`,
    },
  ];
}

function buildHowItWorks(d: StateSalesTaxData) {
  const formula = d.noTax && d.combinedRate === 0
    ? `Tax Amount  = $0\nTotal Price = Price (no tax applied)`
    : `Tax Amount  = Price × (${d.combinedRate}% ÷ 100)\nTotal Price = Price + Tax Amount`;

  const steps = d.noTax && d.combinedRate === 0
    ? [
        { label: "Enter your purchase price", description: "The listed price before tax." },
        { label: "Tax rate is automatically 0%", description: `${d.name} has no sales tax — the total is exactly what you see on the price tag.` },
        { label: "Read the total", description: "No additions — the total equals the purchase price." },
      ]
    : [
        { label: "Enter the purchase price", description: "The listed price before tax — what you see on the tag." },
        { label: "Tax rate is pre-set to your state", description: `${d.name}'s ${d.combinedRate}% combined rate is loaded automatically. Adjust if your local rate differs.` },
        { label: "See the full breakdown", description: "Tax amount, total price, monthly burden, and annual tax cost — all instantly." },
      ];

  const paragraphs = [
    d.noTax && d.combinedRate === 0
      ? `${d.name} is one of five US states with no sales tax at any level. You never pay sales tax on purchases here — the price you see is the price you pay.`
      : `In ${d.name}, sales tax is calculated by multiplying the listed price by ${d.combinedRate / 100} (the combined rate as a decimal). Local rates can push the total higher depending on your exact city or county.`,
    `Use the monthly spend input to see your annual tax burden — the total amount you silently pay in sales tax across a year of everyday purchases.`,
  ];

  return { formula, steps, paragraphs };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function StateSalesTaxPage({ params }: Props) {
  const { state } = await params;
  const data = getSalesTaxBySlug(state);
  if (!data) notFound();

  const stats        = buildStats(data);
  const cards        = buildContentCards(data);
  const faqs         = buildFAQs(data);
  const howItWorks   = buildHowItWorks(data);
  const insightStrip = buildInsightStrip(data);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name:                `${data.name} Sales Tax Calculator`,
      applicationCategory: "FinanceApplication",
      operatingSystem:     "Web",
      description:         `Calculate sales tax in ${data.name}. ${data.noTax ? "No sales tax applies." : `Combined rate: ${data.combinedRate}%.`}`,
      url:                 `https://worthulator.com/tools/sales-tax-calculator/${state}`,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })),
    },
  ];

  // Pre-load the state's combined tax rate into the calculator
  const defaults = { taxRate: data.combinedRate };

  return (
    <main className="bg-white text-gray-900">
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <SimpleCalculatorHero
        eyebrowIcon="🧾"
        eyebrowText={`${data.name} · Sales Tax`}
        title={`${data.name} Sales Tax Calculator`}
        description={
          data.noTax && data.combinedRate === 0
            ? `${data.name} has no sales tax. The price you see is the price you pay — no tax added at checkout.`
            : `Calculate the exact sales tax and total price for any purchase in ${data.name}. The combined rate of ${data.combinedRate}% is pre-loaded — just enter your price.`
        }
        chips={["Tax amount", "Total with tax", "Annual tax burden"]}
      >
        <CalculatorEngineLoader
          key={state}
          slug="sales-tax"
          defaults={defaults}
          afterResults={<InsightsSection slug="sales-tax" />}
        />
      </SimpleCalculatorHero>
      <InsightStrip text={insightStrip} />
      <StatChipsRow stats={stats} />
      <ContentCardGrid
        title={`Sales tax in ${data.name} — what you need to know`}
        subtitle={data.noTax ? `One of the few states with no checkout tax.` : `Rate, exemptions, and local variations explained.`}
        cards={cards}
      />
      <SEOTextBlock
        title={`How the ${data.name} Sales Tax Calculator Works`}
        formula={howItWorks.formula}
        steps={howItWorks.steps}
        paragraphs={howItWorks.paragraphs}
      />
      <StandardFAQSection faqs={faqs} bg="bg-gray-50" />
      <RelatedCalcCards
        title="Related Calculators"
        subtitle="More tools for everyday money math."
        items={[
          { title: "Tip Calculator",           description: "Calculate the tip and split any bill.",              href: "/tools/tip-calculator",              icon: "🍽️", accent: "bg-emerald-500/10" },
          { title: "Discount Calculator",      description: "See your final price after any sale or promo.",     href: "/tools/discount-calculator",         icon: "🏷️", accent: "bg-blue-500/10" },
          { title: "Percentage Of Calculator", description: "Calculate any percentage of any number.",           href: "/tools/percentage-of-calculator",    icon: "%",  accent: "bg-amber-500/10" },
          { title: "Take Home Pay",            description: "See your after-tax paycheck by state.",             href: "/tools/take-home-pay-calculator",    icon: "💵", accent: "bg-purple-500/10" },
        ]}
      />
    </main>
  );
}
