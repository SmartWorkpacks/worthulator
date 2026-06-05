import type { Metadata } from "next";
import EngineWithInsights from "@/components/worthcore/EngineWithInsights";
import SimpleCalculatorHero from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import StandardFAQSection from "@/src/templates/take-home-pay/StandardFAQSection";
import {
  StatChipsRow,
  ContentCardGrid,
  SEOTextBlock,
  InsightStrip,
  RelatedCalcCards,
} from "@/src/templates/take-home-pay/StandardSEOSection";
import InsightTable from "@/components/insights/InsightTable";

export const metadata: Metadata = {
  title: "Car Affordability Calculator 2026 – Max Car Price for Your Income",
  description:
    "Find out the maximum car price and monthly payment you can afford based on your income. Uses the 15% income rule with real loan math.",
  keywords: ["car affordability calculator", "how much car can I afford", "car payment calculator", "auto loan affordability", "car budget calculator"],
  alternates: { canonical: "https://worthulator.com/tools/car-affordability-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "How much car can I afford?",
    a: "The 15% rule: your total monthly car payment (loan + insurance + fuel) should not exceed 15–20% of your take-home pay. This calculator uses 15% of gross monthly income as the max monthly payment benchmark.",
  },
  {
    q: "What is the 20/4/10 rule for car buying?",
    a: "Put 20% down, finance for no more than 4 years, and keep total car costs under 10% of gross income. It's a stricter rule than most dealerships recommend, but it keeps you from being car-poor.",
  },
  {
    q: "Should I buy or lease?",
    a: "Buying builds equity and is cheaper long-term if you keep the car. Leasing gives lower monthly payments and a new car every 2–3 years but you own nothing at the end. If you drive more than 12,000 miles/year or tend to modify your car, buying is usually better.",
  },
  {
    q: "How much does a car really cost per month?",
    a: "Beyond the loan payment, factor in insurance ($100–200+/month), fuel ($100–300/month), maintenance ($50–100/month), and registration. A $400 loan payment can easily become $750–900 in total monthly car costs.",
  },
  {
    q: "What credit score do I need for a good auto loan rate?",
    a: "760+ gets you the best rates (typically 5–7% in 2026). 700–759 is still good. Below 660, you'll likely pay 12–20%+ which significantly increases the total cost of the loan. Improving your credit before buying saves thousands.",
  },
];

const STATS = [
  { stat: "15%",  color: "text-emerald-600", accent: "bg-emerald-500", label: "Max monthly car payment as % of take-home pay — the standard affordability benchmark" },
  { stat: "20%",  color: "text-blue-600",    accent: "bg-blue-500",    label: "Recommended minimum down payment to avoid being underwater on your loan" },
  { stat: "7–9%", color: "text-amber-600",   accent: "bg-amber-500",   label: "Average US auto loan interest rate in 2026 for buyers with good credit" },
];

const CONTENT_CARDS = [
  {
    icon: "🚗",
    title: "The hidden costs of car ownership",
    body: "The loan payment is just the start. Add insurance ($150/mo average), fuel ($150–250/mo), maintenance ($75/mo), and registration. A $35,000 car with a $550 loan payment can easily cost $1,000/month all-in.",
  },
  {
    icon: "📉",
    title: "Depreciation is the real cost",
    body: "New cars lose 15–20% of their value in the first year and up to 50% in 5 years. A $40,000 car is worth $20,000 after 5 years — that's $4,000/year in depreciation alone, before you've paid a cent in interest.",
  },
  {
    icon: "💡",
    title: "The 2-year-old sweet spot",
    body: "Buying a car that's 2–3 years old captures most of the new car depreciation for the previous owner. You get a nearly-new car at 20–30% less than new, and it still has most of its useful life ahead.",
  },
];

const RELATED_CALCS = [
  { title: "Car Loan Calculator",      description: "Calculate monthly payments on any auto loan.",          href: "/tools/car-loan-calculator",         icon: "🚘", accent: "bg-emerald-500/10" },
  { title: "Loan Calculator",          description: "Full loan payment and interest breakdown.",              href: "/tools/loan-calculator",             icon: "💳", accent: "bg-blue-500/10" },
  { title: "Road Trip Cost Calculator",description: "Estimate fuel cost for any road trip.",                  href: "/tools/road-trip-cost",              icon: "🛣️", accent: "bg-amber-500/10" },
  { title: "Commute Cost Calculator",  description: "Calculate your annual fuel cost to drive to work.",     href: "/tools/commute-cost-calculator",     icon: "🏙️", accent: "bg-purple-500/10" },
];

export default function CarAffordabilityCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Car Affordability Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description: "Find the maximum car price and monthly payment you can afford based on your income.",
      url: "https://worthulator.com/tools/car-affordability-calculator",
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
        eyebrowIcon="🚗"
        eyebrowText="Loans · Auto"
        title="Car Affordability Calculator"
        description="Find the maximum car payment, loan amount, and target price you can afford — based on your income and loan terms."
        chips={["15% income rule", "Max loan amount", "Target car price with 20% down"]}
      >
        <EngineWithInsights slug="car-affordability" />
      </SimpleCalculatorHero>
      <InsightStrip text='The loan payment is just the beginning — <span class="font-semibold text-gray-900">insurance, fuel, and maintenance often double the true monthly cost of a car.</span>' />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="What car ownership really costs" subtitle="The numbers dealerships don't show you." cards={CONTENT_CARDS}
      />

      <InsightTable slug="car-affordability" />
      <SEOTextBlock
        title="How the Car Affordability Calculator Works"
        formula={`Max Monthly Payment = Monthly Income × 0.15

Max Loan Amount  = Payment × (1 − (1+r)^−n) ÷ r
                   (present value of annuity formula)

Target Car Price = Max Loan ÷ 0.80
                   (assumes 20% down payment)`}
        steps={[
          { label: "Enter your monthly income", description: "Your gross monthly take-home pay." },
          { label: "Choose loan term", description: "Shorter terms (36–48 months) save interest. Longer terms lower payments but cost more overall." },
          { label: "Enter interest rate", description: "Check current rates — 7–9% is typical for good credit in 2026." },
          { label: "Read your max numbers", description: "Maximum monthly payment, loan amount you qualify for, and target car price assuming 20% down." },
        ]}
        paragraphs={[
          "The 15% rule is a guideline, not a hard limit. It's designed to prevent you from becoming 'car poor' — spending so much on a vehicle that it limits your ability to save or handle unexpected expenses.",
          "This calculator focuses on loan affordability only. Factor in insurance, fuel, and maintenance separately — those costs can add $400–600/month to the true cost of ownership.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />
      <RelatedCalcCards title="Related Calculators" subtitle="More tools for smart car buying." items={RELATED_CALCS} />
    </main>
  );
}
