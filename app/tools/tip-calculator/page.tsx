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
  title: "Tip Calculator 2026 – Split the Bill Instantly",
  description:
    "Calculate the exact tip and split any bill evenly. Enter your bill amount, tip percentage, and number of people for an instant per-person breakdown.",
  keywords: ["tip calculator", "bill splitter", "how much to tip", "tip per person", "restaurant bill split", "tip percentage calculator"],
  alternates: { canonical: "https://worthulator.com/tools/tip-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "How much should you tip at a restaurant?",
    a: "In the US, 15–20% is standard for sit-down restaurants. 18% is considered the baseline for acceptable service, 20% for good service, and 25%+ for exceptional. Counter service and fast casual typically warrants 10–15% if you tip at all.",
  },
  {
    q: "How do you calculate a tip quickly in your head?",
    a: "For 20%, move the decimal one place left (10%), then double it. On a $64 bill: 10% = $6.40, doubled = $12.80. For 15%, take 10% and add half — $6.40 + $3.20 = $9.60. Or just use this calculator.",
  },
  {
    q: "Should you tip on the pre-tax or post-tax amount?",
    a: "Tipping on the pre-tax amount is technically correct, but most people tip on the total. The difference is small — on a $60 bill with 8% tax, it's about $1 either way. Tip on whatever feels right.",
  },
  {
    q: "How do you split a bill unequally?",
    a: "This calculator splits evenly. For unequal splits — where people ordered different items — use the bill total for each person individually and run the calculator separately, or note each person's share before tipping.",
  },
  {
    q: "When should you tip more than 20%?",
    a: "Tip above 20% for exceptional service, on very small bills (a $5 coffee still warrants $1–2), or when your group has caused extra work. It's also common to tip more during holidays as a thank-you to regular service workers.",
  },
  {
    q: "Is it rude to split a bill evenly if someone ordered more?",
    a: "It depends on the group. Among close friends, even splits are common and save awkwardness. In mixed company or with big price differences, itemised splits are fairer. Most important is agreeing before the bill arrives.",
  },
];

const STATS = [
  { stat: "18–20%", color: "text-emerald-600", accent: "bg-emerald-500", label: "Standard tip range in the US — 18% is the baseline, 20% is the norm for good service" },
  { stat: "$1",     color: "text-blue-600",    accent: "bg-blue-500",    label: "Difference between tipping on pre-tax vs post-tax on most restaurant bills" },
  { stat: "4 in 5", color: "text-amber-600",   accent: "bg-amber-500",   label: "Americans say they always or usually tip at full-service restaurants" },
];

const CONTENT_CARDS = [
  {
    icon: "🍽️",
    title: "US tipping culture",
    body: "Tipping is effectively mandatory in the US for table service. Servers typically earn a tipped minimum wage well below the standard minimum and depend on tips for the majority of their income. The 20% baseline reflects this reality.",
  },
  {
    icon: "💵",
    title: "Cash vs card tips",
    body: "Cash tips go directly to your server and are often preferred. Card tips get processed and may be subject to a small processing fee paid by the restaurant. If you want your full tip to reach your server, cash is the cleaner option.",
  },
  {
    icon: "👥",
    title: "Large group gratuity",
    body: "Many restaurants automatically add an 18–20% gratuity for groups of 6 or more. Always check the bill before adding an additional tip — you may end up tipping twice. The auto-grat is noted on the menu or the bill itself.",
  },
];

const RELATED_CALCS = [
  {
    title: "Percentage Of Calculator",
    description: "Calculate any percentage of any number instantly.",
    href: "/tools/percentage-of-calculator",
    icon: "%",
    accent: "bg-emerald-500/10",
  },
  {
    title: "Grocery Unit Price Calculator",
    description: "Find the best value when comparing products by price per unit.",
    href: "/tools/grocery-unit-price",
    icon: "🛒",
    accent: "bg-blue-500/10",
  },
  {
    title: "Road Trip Cost Calculator",
    description: "Estimate total fuel cost and split it across passengers.",
    href: "/tools/road-trip-cost",
    icon: "🚗",
    accent: "bg-amber-500/10",
  },
  {
    title: "Discount Calculator",
    description: "See exactly how much you save on a sale or promo code.",
    href: "/tools/discount-calculator",
    icon: "🏷️",
    accent: "bg-purple-500/10",
  },
];

export default function TipCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Tip Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description: "Calculate the exact tip amount and split a restaurant bill evenly across any number of people.",
      url: "https://worthulator.com/tools/tip-calculator",
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
        eyebrowIcon="🍽️"
        eyebrowText="Everyday · Quick Math"
        title="Tip Calculator"
        description="Calculate the tip and split any bill instantly — enter the total, your tip percentage, and number of people."
        chips={["Per-person split", "Round up for cash", "Quick tip presets"]}
      >
        <CalculatorEngineLoader slug="tip-calculator" />
      </SimpleCalculatorHero>

      <InsightStrip
        text='When in doubt, tip 20% — it&apos;s easy to calculate, fair to your server, and <span class="font-semibold text-gray-900">costs less than you think</span> per person.'
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="Everything you need to know about tipping"
        subtitle="The unwritten rules of tipping — simplified."
        cards={CONTENT_CARDS}
      />

      <SEOTextBlock
        title="How the Tip Calculator Works"
        formula={`Tip Amount    = Bill × (Tip% ÷ 100)
Total Bill    = Bill + Tip Amount
Per Person    = Total Bill ÷ Number of People
Tip/Person    = Tip Amount ÷ Number of People
Rounded Tip   = ⌈Tip/Person⌉  (ceiling — rounds up to nearest dollar)`}
        steps={[
          { label: "Enter your bill amount", description: "The total on your restaurant bill before tip. Use the slider or quick-pick buttons for common amounts." },
          { label: "Choose your tip percentage", description: "Pick from the quick presets — 10%, 15%, 18%, 20%, or 25% — or dial in any number with the slider." },
          { label: "Set the number of people", description: "How many people are splitting the bill. The calculator divides tip and total evenly." },
          { label: "Read all four numbers", description: "You get: total tip, full bill total, tip per person, total per person, and a rounded-up cash tip per person." },
        ]}
        paragraphs={[
          "The rounded tip per person is useful when paying cash — it rounds each person's tip up to the nearest whole dollar, making it easy to hand over bills without needing change.",
          "This calculator splits the bill evenly. For unequal splits, calculate each person's share separately based on what they ordered.",
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
