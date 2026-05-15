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
  title: "Time Between Dates Calculator 2026 – Days, Weeks & Months",
  description:
    "Calculate the number of days, weeks, and months between any two dates. Enter the total days in your range to instantly convert for deadlines, countdowns, and planning.",
  keywords: ["time between dates calculator", "days between dates calculator", "how many weeks between dates", "date difference calculator", "days to weeks months"],
  alternates: { canonical: "https://worthulator.com/tools/time-between-dates-calculator" },
};

const FAQS = [
  {
    q: "How do I calculate the number of days between two dates?",
    a: "Subtract the earlier date from the later date. In most date systems, this gives the difference in days. For example, from January 1 to March 31 is 89 days (in a non-leap year). To convert: divide by 7 for weeks, divide by 30.44 for months (using the average month length). This calculator converts any number of days into all three units instantly.",
  },
  {
    q: "How many days is 3 months?",
    a: "Using an average month length of 30.44 days: 3 months ≈ 91.3 days. Calendar months vary: 3 months could be 89–92 days depending on which months are included and whether there's a leap year. For planning purposes, 91 days or 13 weeks is a reliable approximation for a quarter.",
  },
  {
    q: "How many weeks is 6 months?",
    a: "6 months ≈ 26.1 weeks using the average month length (30.44 days × 6 ÷ 7 = 26.1). In practice, 6 calendar months ranges from 181–184 days, which is 25.9–26.3 weeks. The commonly used approximation is 26 weeks for a half-year.",
  },
  {
    q: "What is the difference between a calendar month and 30 days?",
    a: "A calendar month is the actual month on the calendar (28–31 days depending on the month). 30 days is a fixed unit. These rarely align precisely. February has only 28–29 days; July and August both have 31. For consistent calculations, using the average month of 30.44 days (365.25 ÷ 12) gives the most accurate results across any date range.",
  },
  {
    q: "How do I calculate a countdown in weeks and days?",
    a: "Divide the total days by 7 to get full weeks, then take the remainder for leftover days. For example: 100 days ÷ 7 = 14 weeks and 2 days. This calculator shows weeks as a decimal (14.3) which includes the partial week as a fraction. For an event countdown, round down to get full weeks remaining.",
  },
];

const STATS = [
  { stat: "30.44", color: "text-emerald-600", accent: "bg-emerald-500", label: "average days per month (365.25 ÷ 12) — used for accurate month conversions" },
  { stat: "365.25", color: "text-blue-600", accent: "bg-blue-500", label: "average days in a year accounting for leap years every 4 years" },
  { stat: "52.18", color: "text-amber-600", accent: "bg-amber-500", label: "weeks in a year — slightly more than 52 due to the 0.25-day leap year average" },
];

const CONTENT_CARDS = [
  {
    icon: "🗓️",
    title: "Use for project deadlines",
    body: "When planning a project, convert your timeline into weeks and months to communicate with stakeholders more naturally. '90 days' is harder to visualise than '13 weeks' or '3 months'. Use this calculator to translate any day count into whichever unit makes your deadline most intuitive.",
  },
  {
    icon: "⏳",
    title: "Countdowns and milestones",
    body: "Weddings, due dates, visa expirations, contract renewals — any milestone can be expressed in days. Converting to months gives a gut-feel sense of urgency: 180 days sounds far away; 6 months feels real. Use both perspectives for planning and motivation.",
  },
  {
    icon: "📐",
    title: "Why average month length matters",
    body: "Using 30 days/month introduces cumulative error. Over a year, 12 × 30 = 360 days — 5 days off. Using 30.44 (the true average) keeps calculations accurate. The difference matters for contracts with 'monthly' billing cycles, subscription proration, and interest calculations that compound monthly.",
  },
];

const RELATED_CALCS = [
  { title: "Working Days Calculator", description: "Business days between dates, excluding holidays.", href: "/tools/working-days-calculator", icon: "📅", accent: "bg-emerald-500/10" },
  { title: "Down Payment Countdown", description: "Track how long until your down payment goal.", href: "/tools/down-payment-countdown", icon: "🏠", accent: "bg-blue-500/10" },
  { title: "Life in Weeks Calculator", description: "See your life visualised in weeks.", href: "/tools/life-in-weeks-calculator", icon: "📆", accent: "bg-amber-500/10" },
  { title: "Savings Goal Calculator", description: "Plan a timeline to reach any savings target.", href: "/tools/savings-goal-calculator", icon: "🎯", accent: "bg-purple-500/10" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Time Between Dates Calculator",
      url: "https://worthulator.com/tools/time-between-dates-calculator",
      applicationCategory: "UtilityApplication",
      description: "Convert any number of days into weeks and months for deadlines, countdowns, and project planning.",
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

export default function TimeBetweenDatesCalculator() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SimpleCalculatorHero
        eyebrowIcon="📆"
        eyebrowText="Time Between Dates Calculator"
        title="How Long Is That in Weeks and Months?"
        description="Enter the number of days between your two dates to instantly convert to weeks and months — for deadlines, countdowns, and project planning."
        chips={["Days to weeks", "Days to months", "Accurate averages used"]}
      >
        <CalculatorEngineLoader slug="time-between-dates-calculator" />
      </SimpleCalculatorHero>
      <InsightStrip text="An average month is <span class='font-semibold text-gray-900'>30.44 days</span> — not 30. Using 30 introduces a 5-day error over a full year." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="Thinking about time more clearly" cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the Time Between Dates Calculator Works"
        formula="Weeks = Days ÷ 7\nMonths = Days ÷ 30.44"
        paragraphs={[
          "Enter the total number of days in your date range. The calculator divides by 7 for weeks and by 30.44 (the average calendar month length — 365.25 ÷ 12) for months.",
          "Results are shown as decimals so you can see partial weeks and months. Round down for full completed units, or use the decimal for proportional calculations.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
