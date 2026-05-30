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
  title: "Airbnb Profit Calculator 2026 – Estimate Short-Term Rental Income",
  description:
    "Calculate your estimated Airbnb monthly and annual net profit. Enter nightly rate, occupancy %, platform fee, and monthly expenses to see real take-home income.",
  keywords: ["Airbnb profit calculator", "short term rental income calculator", "STR calculator", "Airbnb earnings estimator"],
  alternates: { canonical: "https://worthulator.com/tools/airbnb-profit" },
};

const FAQS = [
  {
    q: "How much can I make on Airbnb?",
    a:
      "It varies widely by location, property type, and management effort. Urban apartments in major cities can earn $2,000–$5,000+/month. Suburban homes typically earn $1,000–$3,000/month. Rural or seasonal properties might earn $500–$2,000/month during peak season.",
  },
  {
    q: "What is a good Airbnb occupancy rate?",
    a:
      "Urban markets often see 60–75% occupancy for well-managed properties. Beach and mountain vacation rentals typically average 40–60% due to seasonality. Anything above 70% is considered strong. Most hosts aim for 65–70%.",
  },
  {
    q: "What is Airbnb's host service fee?",
    a:
      "Airbnb typically charges hosts a 3% service fee per booking. However, if you opt for Airbnb's Plus or host-only fee structure, it can be higher. Vrbo and other platforms charge 8–15%. This calculator lets you set your exact fee.",
  },
  {
    q: "What expenses should I include?",
    a:
      "Include: mortgage or rent, utilities, Wi-Fi, cleaning fees (if you don't charge separately), restocking supplies (toiletries, linens), insurance, property management fees (if applicable), and any HOA fees. Many hosts underestimate expenses initially.",
  },
  {
    q: "Is Airbnb income taxable?",
    a:
      "Yes — short-term rental income is generally taxable. However, you can deduct a proportional share of mortgage interest, utilities, cleaning, supplies, depreciation, and other business expenses. Consult a tax professional, especially for the 14-day rental rule.",
  },
];

const STATS = [
  { stat: "~$1,900", color: "text-emerald-600", accent: "bg-emerald-500", label: "average monthly income for US Airbnb hosts" },
  { stat: "3%", color: "text-blue-600", accent: "bg-blue-500", label: "Airbnb host service fee taken from each booking" },
  { stat: "70–80%", color: "text-amber-600", accent: "bg-amber-500", label: "occupancy rate in top short-term rental markets" },
];

const CONTENT_CARDS = [
  {
    icon: "📍",
    title: "Location is everything",
    body: "Airbnb revenue varies enormously by market. Nashville, Scottsdale, and beach destinations command premium rates. Suburban and rural properties may struggle with occupancy. Research your local market on AirDNA or Airbnb's own pricing tools before committing.",
  },
  {
    icon: "💸",
    title: "The hidden costs that eat into profit",
    body: "Many first-time hosts overlook cleaning turnover costs, restocking supplies, platform fees on top of host fees, guest damage, and increased utility bills. Build in a 15–20% buffer for unexpected costs when estimating profitability.",
  },
  {
    icon: "📱",
    title: "Dynamic pricing boosts revenue",
    body: "Using dynamic pricing tools (PriceLabs, Beyond, or Airbnb's Smart Pricing) can increase revenue 10–30% by automatically adjusting rates for weekends, events, and seasonal demand. Fixed pricing leaves money on the table.",
  },
];

const RELATED_CALCS = [
  { title: "Self-Employed Tax Calculator", description: "Estimate tax on your Airbnb income.", href: "/tools/self-employed-tax", icon: "🧾", accent: "bg-emerald-500/10" },
  { title: "Passive Income Calculator", description: "Model income from multiple passive streams.", href: "/tools/passive-income-calculator", icon: "💰", accent: "bg-blue-500/10" },
  { title: "Mortgage Calculator", description: "Calculate your mortgage payment.", href: "/tools/mortgage-calculator", icon: "🏦", accent: "bg-amber-500/10" },
  { title: "Down Payment Countdown", description: "Save for your next rental property.", href: "/tools/down-payment-countdown", icon: "🏠", accent: "bg-purple-500/10" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Airbnb Profit Estimator",
      url: "https://worthulator.com/tools/airbnb-profit",
      applicationCategory: "FinanceApplication",
      description: "Estimate monthly Airbnb net income after fees and expenses.",
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

export default function AirbnbProfit() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SimpleCalculatorHero
        eyebrowIcon="🏡"
        eyebrowText="Airbnb Profit"
        title="How Much Could You Make Hosting on Airbnb?"
        description="Estimate your monthly and annual net profit from short-term rentals. Set your nightly rate, occupancy, platform fee, and monthly expenses."
        chips={["Occupancy-based revenue", "Platform fee deducted", "Monthly + annual profit"]}
      >
        <CalculatorEngineLoader slug="airbnb-profit" />
      </SimpleCalculatorHero>
      <InsightStrip text="The average US Airbnb host earns ~$1,900/month — but location and management make the real difference." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="What drives Airbnb profitability"  cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the Airbnb Profit Calculator Works"
        paragraphs={[
          "Monthly gross revenue = nightly rate × (30 days × occupancy rate). Net revenue = gross × (1 - platform fee %). Monthly net profit = net revenue - monthly expenses.",
          "This is a simplified estimate. Actual earnings vary based on seasonality, local regulations, listing quality, reviews, and response time. Use this as a starting point, then verify with local STR market data.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
