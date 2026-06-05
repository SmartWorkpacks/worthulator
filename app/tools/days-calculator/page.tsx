import type { Metadata } from "next";
import DaysCalculatorLoader from "./DaysCalculatorLoader";
import { calculateDays, type DaysInputs } from "@/lib/calculators/daysEngine";
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
  title: "Days Calculator - Days Until, Days Since & Days Between",
  description:
    "Count the days until a future date, the days since a past date, or the days between any two dates. Includes a business-days-only option and a weeks breakdown.",
  keywords: [
    "days calculator",
    "days until calculator",
    "days since calculator",
    "days between dates",
    "business days calculator",
    "how many days",
  ],
  alternates: { canonical: "https://worthulator.com/tools/days-calculator" },
  robots: { index: true, follow: true },
};

// Deterministic worked examples computed at build from the engine (fixed dates).
const BETWEEN_INPUT: DaysInputs = {
  mode: "between",
  asOfDate: "2025-06-01",
  targetDate: "",
  pastDate: "",
  startDate: "2025-01-01",
  endDate: "2025-12-31",
  businessOnly: false,
  includeEndDay: false,
};
const EX_BETWEEN = calculateDays(BETWEEN_INPUT);
const EX_BIZ = calculateDays({
  ...BETWEEN_INPUT,
  startDate: "2025-01-01",
  endDate: "2025-01-08",
  businessOnly: true,
});

const FAQS = [
  {
    q: "How many days are between two dates?",
    a: `Choose "Days between," enter both dates, and the calculator returns the exact count. For example, from ${EX_BETWEEN.fromLabel} to ${EX_BETWEEN.toLabel} is ${EX_BETWEEN.totalDays} days — that's ${EX_BETWEEN.wholeWeeks} weeks and ${EX_BETWEEN.remainderDays} days.`,
  },
  {
    q: "How do I count the days until a date?",
    a: "Pick the \"Days until\" mode and enter your target date — a holiday, deadline, birthday, or due date. The calculator counts forward from today. If the date has already passed, it tells you how many days ago it was instead.",
  },
  {
    q: "Can I count only working days?",
    a: `Yes. Turn on "business days only" to exclude Saturdays and Sundays. In the week of ${EX_BIZ.fromLabel} to ${EX_BIZ.toLabel} there are ${EX_BIZ.businessDays} business days and ${EX_BIZ.weekendDays} weekend days. Public holidays vary by country and are not subtracted.`,
  },
  {
    q: "Should I include the final day?",
    a: "By default the count is exclusive — it measures the gap between the two dates. Tick \"include the final day\" for an inclusive count, which adds one day. Use inclusive counting when both the first and last day should be counted, such as a hotel stay or event length.",
  },
  {
    q: "How is this different from a date calculator?",
    a: "A date calculator focuses on full durations in years, months, and days and on adding or subtracting time to find a new date. This days calculator is built for one job: a clear, single day count — until, since, or between — with a business-day option.",
  },
];

const STATS = [
  {
    stat: `${EX_BETWEEN.totalDays} days`,
    color: "text-blue-600",
    accent: "bg-blue-500",
    label: `A full calendar year, ${EX_BETWEEN.fromLabel} to ${EX_BETWEEN.toLabel} (${EX_BETWEEN.wholeWeeks} weeks)`,
  },
  {
    stat: "3 modes",
    color: "text-emerald-600",
    accent: "bg-emerald-500",
    label: "Days until a future date, days since a past date, or days between two dates",
  },
  {
    stat: `${EX_BIZ.businessDays} of 7`,
    color: "text-amber-600",
    accent: "bg-amber-500",
    label: "A standard week is 5 business days and 2 weekend days — toggle to count either",
  },
];

const CONTENT_CARDS = [
  {
    icon: "⏳",
    title: "Days until",
    body: "Count down to a holiday, deadline, birthday, or due date. If the date has already passed, the calculator switches to telling you how long ago it was.",
  },
  {
    icon: "📈",
    title: "Days since",
    body: "Count up from an anniversary, a start date, or any past event to see exactly how many days have gone by.",
  },
  {
    icon: "🗓️",
    title: "Days between & business days",
    body: "Measure the gap between any two dates, switch to business-days-only to skip weekends, and read the result in weeks as well as days.",
  },
];

const RELATED_CALCS = [
  {
    title: "Date Calculator",
    description: "Add or subtract time and get a full duration breakdown.",
    href: "/tools/date-calculator",
    icon: "📅",
    accent: "bg-emerald-500/10",
  },
  {
    title: "Days Between Dates",
    description: "Focus purely on the gap between two dates.",
    href: "/tools/days-between-dates-calculator",
    icon: "↔️",
    accent: "bg-blue-500/10",
  },
  {
    title: "Hours Calculator",
    description: "Total a shift's hours with breaks and overtime.",
    href: "/tools/hours-calculator",
    icon: "🕐",
    accent: "bg-violet-500/10",
  },
  {
    title: "Age Calculator",
    description: "Work out an exact age in years, months, and days.",
    href: "/tools/chronological-age-calculator",
    icon: "🎂",
    accent: "bg-pink-500/10",
  },
];

export default function DaysPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Days Calculator",
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Web",
      description:
        "Count days until a future date, days since a past date, or days between two dates, with a business-days-only option and a weeks breakdown.",
      url: "https://worthulator.com/tools/days-calculator",
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
        eyebrowIcon="🗓️"
        eyebrowText="Date & Time"
        title="Days Calculator"
        description="Count the days until a future date, the days since a past one, or the days between any two dates — with a business-days-only option and a clean weeks breakdown."
        chips={["Days until", "Days since", "Business days"]}
      >
        <DaysCalculatorLoader />
      </SimpleCalculatorHero>

      <InsightStrip
        text={`A full calendar year — ${EX_BETWEEN.fromLabel} to ${EX_BETWEEN.toLabel} — is <span class="font-semibold text-gray-900">${EX_BETWEEN.totalDays} days</span>, or ${EX_BETWEEN.wholeWeeks} weeks and ${EX_BETWEEN.remainderDays} day${EX_BETWEEN.remainderDays === 1 ? "" : "s"}.`}
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="One number, three ways to ask for it"
        subtitle="Built for a single, clear day count — not a wall of date math."
        cards={CONTENT_CARDS}
      />

      <SEOTextBlock
        title="How the Days Calculator Works"
        formula={`spanDays   = (later date − earlier date)   + (include final day ? 1 : 0)
businessDays = weekdays (Mon–Fri) within the span
weekendDays  = Saturdays + Sundays within the span
totalDays    = business-days-only ? businessDays : spanDays
weeks        = spanDays ÷ 7   (shown as whole weeks + leftover days)`}
        steps={[
          { label: "Choose a mode", description: "Days until, days since, or days between." },
          { label: "Enter the date(s)", description: "One date for until/since, two for between." },
          { label: "Pick weekends or not", description: "Optionally count business days only." },
          { label: "Inclusive or exclusive", description: "Include the final day for an inclusive count." },
          { label: "Read the count", description: "Days, business days, and a weeks breakdown." },
        ]}
        paragraphs={[
          "The calculator orders your two dates automatically, so it never returns a negative number — if a target date is already in the past, it simply tells you how many days ago it was. Counts use the Gregorian calendar in UTC, so daylight-saving changes never shift the result by a day.",
          "Business-day counting excludes Saturdays and Sundays but not public holidays, which differ by country and region. For payroll cut-offs or legal deadlines, always confirm the count against the holiday calendar that applies to you.",
        ]}
      />

      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      <RelatedCalcCards
        title="Related Calculators"
        subtitle="More ways to work with dates and time."
        items={RELATED_CALCS}
      />
    </main>
  );
}
