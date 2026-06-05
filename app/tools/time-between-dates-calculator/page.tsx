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

export const metadata: Metadata = {
  title: "Time Between Dates Calculator 2026 – Days to Weeks, Months & Business Days",
  description:
    "Convert any number of days into weeks, months, years, and business days. Accurate average month/year lengths for deadlines, countdowns, and planning.",
  keywords: ["time between dates calculator", "days between dates calculator", "days to weeks", "days to months", "date difference calculator"],
  alternates: { canonical: "https://worthulator.com/tools/time-between-dates-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "How do I convert days to weeks and months?",
    a: "Divide by 7 for weeks and by 30.44 (the average calendar month, 365.25 ÷ 12) for months. For example, 91 days = 13 weeks ≈ 3 months. This calculator shows weeks, months, years, and business days at once, plus a 'W weeks and D days' breakdown.",
  },
  {
    q: "How many days is 3 months?",
    a: "Using the average month of 30.44 days, 3 months ≈ 91.3 days. Calendar months vary (89–92 days depending on which months and leap years), but 91 days or 13 weeks is a reliable approximation for a quarter.",
  },
  {
    q: "How many weeks is 6 months?",
    a: "About 26.1 weeks (30.44 days × 6 ÷ 7). In practice 6 calendar months runs 181–184 days, or 25.9–26.3 weeks. The common shorthand is 26 weeks for a half-year.",
  },
  {
    q: "Why use 30.44 days per month instead of 30?",
    a: "Using a flat 30 days introduces cumulative error — 12 × 30 = 360 days, five short of a year. The true average month is 30.44 days (365.25 ÷ 12), which keeps month and year conversions accurate. It matters for billing cycles, proration, and any interest that compounds monthly.",
  },
  {
    q: "How many of those days are business days?",
    a: "Roughly 5 in every 7 days are weekdays, so this calculator also shows the business-day count (≈ days × 5/7). That gap matters: a '30-day' window is only about 21 working days, which changes how a deadline actually lands.",
  },
];

const STATS = [
  { stat: "30.44",  color: "text-emerald-600", accent: "bg-emerald-500", label: "average days per month (365.25 ÷ 12) — accurate month conversions" },
  { stat: "365.25", color: "text-blue-600",    accent: "bg-blue-500",    label: "average days in a year, accounting for leap years" },
  { stat: "5/7",    color: "text-amber-600",   accent: "bg-amber-500",   label: "share of calendar days that are weekdays (business days)" },
];

const CONTENT_CARDS = [
  {
    icon: "🗓️",
    title: "Make deadlines intuitive",
    body: "'90 days' is harder to picture than '13 weeks' or '3 months'. Converting a timeline into the unit that fits the conversation helps stakeholders grasp it instantly. The calculator gives you every unit at once so you can pick the clearest.",
  },
  {
    icon: "⏳",
    title: "Countdowns and milestones",
    body: "Weddings, due dates, visa expirations, contract renewals — any milestone can be expressed in days. Months give a gut-feel sense of distance; weeks give a sense of urgency. Use both perspectives for planning and motivation.",
  },
  {
    icon: "📐",
    title: "Business days vs calendar days",
    body: "Contracts and SLAs usually count business days, not calendar days. Since only about 5 in 7 days are weekdays, a 30-calendar-day window is roughly 21 working days — always confirm which one a deadline means before you plan around it.",
  },
];

const RELATED_CALCS = [
  { title: "Working Days Calculator", description: "Business days in a range, minus holidays.", href: "/tools/working-days-calculator", icon: "📅", accent: "bg-emerald-500/10" },
  { title: "Down Payment Countdown", description: "Track how long until your down payment goal.", href: "/tools/down-payment-countdown", icon: "🏠", accent: "bg-blue-500/10" },
  { title: "Life in Weeks Calculator", description: "See your life visualised in weeks.", href: "/tools/life-in-weeks-calculator", icon: "📆", accent: "bg-amber-500/10" },
  { title: "Savings Goal Calculator", description: "Plan a timeline to reach any savings target.", href: "/tools/savings-goal-calculator", icon: "🎯", accent: "bg-purple-500/10" },
];

export default function TimeBetweenDatesCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Time Between Dates Calculator",
      url: "https://worthulator.com/tools/time-between-dates-calculator",
      applicationCategory: "UtilityApplication",
      operatingSystem: "Web",
      description: "Convert a number of days into weeks, months, years, and business days.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <main className="bg-white text-gray-900">
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <SimpleCalculatorHero
        eyebrowIcon="📆"
        eyebrowText="Time · Conversion"
        title="Time Between Dates Calculator"
        description="Enter the number of days between your two dates to instantly convert to weeks, months, years, and business days — with a clean weeks-and-days breakdown."
        chips={["Days to weeks", "Days to months", "Business days"]}
      >
        <EngineWithInsights slug="time-between-dates-calculator" />
      </SimpleCalculatorHero>
      <InsightStrip text="An average month is <span class='font-semibold text-gray-900'>30.44 days</span> — not 30. Using 30 introduces a 5-day error over a full year." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="Thinking about time more clearly" subtitle="Every unit, from one count of days." cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the Time Between Dates Calculator Works"
        formula={`Weeks         = Days ÷ 7
Months        = Days ÷ 30.44
Years         = Days ÷ 365.25
Business Days ≈ Days × 5/7`}
        steps={[
          { label: "Find the days between your dates", description: "Subtract the earlier date from the later one to get total days." },
          { label: "Enter that day count", description: "Slide to the number of days in your range." },
          { label: "Read every unit at once", description: "Weeks, months, years, business days, and a weeks-and-days breakdown." },
        ]}
        paragraphs={[
          "The calculator divides your day count by 7 for weeks, 30.44 for months, and 365.25 for years — the average month and year lengths, which keep conversions from drifting the way a flat 30-day month does.",
          "It also shows business days (≈ days × 5/7) and a 'W weeks and D days' breakdown, so you can express the same span in whichever unit is clearest for a deadline, countdown, or plan.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />
      <RelatedCalcCards title="Related Calculators" subtitle="More time and planning tools." items={RELATED_CALCS} />
    </main>
  );
}
