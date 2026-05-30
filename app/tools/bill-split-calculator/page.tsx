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
  title: "Bill Split Calculator 2026 – Split the Bill with Tip Evenly",
  description:
    "Split a restaurant bill with tip evenly between any number of people. Enter the bill amount, tip percentage, and number of people to see exactly what each person owes.",
  keywords: ["bill split calculator", "split bill calculator", "restaurant bill splitter", "tip calculator", "how to split bill with tip"],
  alternates: { canonical: "https://worthulator.com/tools/bill-split-calculator" },
};

const FAQS = [
  {
    q: "How do I split a bill with tip evenly?",
    a:
      "Add the tip to the total bill first, then divide by the number of people. For example: $120 bill + 18% tip = $141.60 total. Split 4 ways = $35.40 per person. This calculator does that math instantly.",
  },
  {
    q: "What is a standard tip percentage?",
    a:
      "In the US, 15% is considered the minimum for adequate service, 18–20% is standard for good service, and 20–25% is excellent. For exceptional service or parties of 6+, many restaurants automatically add a 18–20% gratuity. Always check your bill before tipping.",
  },
  {
    q: "Should I tip on the pre-tax or post-tax amount?",
    a:
      "Etiquette varies: tipping on the pre-tax amount is technically correct and slightly more common in the US. However, since sales tax on a meal is typically only 5–10%, the difference is small. Most people tip on the post-tax total for simplicity.",
  },
  {
    q: "How do I split a bill when people ordered different amounts?",
    a:
      "This calculator handles equal splits. For unequal splits, tally individual orders first, then add each person's proportional share of the tip. For example, if you ordered 40% of the food, pay 40% of the tip. Some restaurant apps (and splitting apps like Splitwise) automate this.",
  },
  {
    q: "Is it rude to split the bill at a restaurant?",
    a:
      "Not at all — splitting bills is completely normal in most Western cultures. Simply let your server know when ordering (most restaurants can split the bill by card at the till). Apps like Venmo, Zelle, or Splitwise make post-dinner settling easy without involving the server.",
  },
];

const STATS = [
  { stat: "18–20%", color: "text-emerald-600", accent: "bg-emerald-500", label: "standard US tip for good restaurant service" },
  { stat: "6+", color: "text-blue-600", accent: "bg-blue-500", label: "people in a party often triggers automatic gratuity at restaurants" },
  { stat: "~$36", color: "text-amber-600", accent: "bg-amber-500", label: "average US restaurant spend per person per dining visit" },
];

const CONTENT_CARDS = [
  {
    icon: "📱",
    title: "Ask the server to split the bill",
    body: "Most restaurants will split the bill across multiple cards with no fuss — just ask when you order or before asking for the bill. If splitting isn't possible, one person pays and others transfer via Venmo, Cash App, or Zelle. Settling in-app is faster and avoids awkward cash rounds.",
  },
  {
    icon: "💡",
    title: "Adjust tip for the quality of service",
    body: "Tipping culture in the US is driven by the fact that servers are often paid below minimum wage (as low as $2.13/hr in some states), with tips as their primary income. For standard table service, 18% is appropriate. Consider tipping more for large or complex orders.",
  },
  {
    icon: "🔢",
    title: "Rounding makes splitting easier",
    body: "When splitting a bill evenly, round each person's share up to the nearest dollar. Everyone overpays by cents, the tip percentage effectively increases slightly, and no one needs to mess with change. This is standard practice for groups at restaurants.",
  },
];

const RELATED_CALCS = [
  { title: "Latte Factor Calculator", description: "See how dining out habits cost you.", href: "/tools/latte-factor", icon: "☕", accent: "bg-emerald-500/10" },
  { title: "Grocery Unit Price Calculator", description: "Find the cheapest option per unit.", href: "/tools/grocery-unit-price", icon: "🛒", accent: "bg-blue-500/10" },
  { title: "Discount Calculator", description: "Calculate savings on any discount.", href: "/tools/discount-calculator", icon: "🏷️", accent: "bg-amber-500/10" },
  { title: "Percentage Of Calculator", description: "Quickly calculate any percentage.", href: "/tools/percentage-of-calculator", icon: "📐", accent: "bg-purple-500/10" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Bill Split Calculator",
      url: "https://worthulator.com/tools/bill-split-calculator",
      applicationCategory: "FinanceApplication",
      description: "Split a restaurant bill with tip evenly between any number of people.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function BillSplitCalculator() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SimpleCalculatorHero
        eyebrowIcon="🍽️"
        eyebrowText="Bill Split Calculator"
        title="How Much Does Each Person Owe?"
        description="Split any restaurant bill with tip evenly between your group. Enter the total, tip percentage, and number of people — get the answer in seconds."
        chips={["Tip calculated", "Per-person share", "Total with tip shown"]}
      >
        <CalculatorEngineLoader slug="bill-split-calculator" />
      </SimpleCalculatorHero>
      <InsightStrip text="A 20% tip on a $120 dinner split 4 ways = $35.40 per person. Never do the maths in your head again." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="Splitting bills the smart way"  cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the Bill Split Calculator Works"
        paragraphs={[
          "Tip amount = bill × (tip % ÷ 100). Total with tip = bill + tip amount. Per person = total with tip ÷ number of people.",
          "This calculator assumes an equal split. For unequal splits (different items ordered), you'll need to calculate each person's proportional share of the tip based on what they ordered.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
