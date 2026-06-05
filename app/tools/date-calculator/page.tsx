import type { Metadata } from "next";
import DateCalculatorLoader from "./DateCalculatorLoader";
import { calculateDate } from "@/lib/calculators/dateEngine";
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
  title: "Date Calculator - Days Between Dates & Add/Subtract Days",
  description:
    "Calculate the exact duration between two dates in years, months, days, weeks, and business days — or add and subtract days, weeks, months, or years to find a future or past date.",
  keywords: [
    "date calculator",
    "days between dates",
    "date difference calculator",
    "add days to date",
    "business days calculator",
  ],
  alternates: { canonical: "https://worthulator.com/tools/date-calculator" },
  robots: { index: true, follow: true },
};

// Deterministic worked examples computed at build from the engine.
const DIFF_EXAMPLE = {
  mode: "difference" as const,
  startDate: "2025-01-01",
  endDate: "2025-12-31",
  includeEndDay: false,
  amount: 0,
  unit: "days" as const,
  direction: "add" as const,
};
const ADD_EXAMPLE = {
  mode: "add" as const,
  startDate: "2025-01-01",
  endDate: "",
  includeEndDay: false,
  amount: 90,
  unit: "days" as const,
  direction: "add" as const,
};

const EX_DIFF = calculateDate(DIFF_EXAMPLE);
const EX_ADD = calculateDate(ADD_EXAMPLE);

const FAQS = [
  {
    q: "How many days are between two dates?",
    a: `Enter both dates and the calculator returns the exact gap in days, plus a years/months/days breakdown. For example, from ${EX_DIFF.startLabel} to ${EX_DIFF.endLabel} is ${EX_DIFF.totalDays} days (${EX_DIFF.years}y ${EX_DIFF.months}m ${EX_DIFF.days}d), or ${EX_DIFF.totalWeeks} weeks.`,
  },
  {
    q: "How many business days are between two dates?",
    a: `Business days exclude Saturdays and Sundays. Between ${EX_DIFF.startLabel} and ${EX_DIFF.endLabel} there are ${EX_DIFF.weekdays.toLocaleString()} weekdays and ${EX_DIFF.weekends.toLocaleString()} weekend days. The calculator does not subtract public holidays, which vary by country.`,
  },
  {
    q: "How do I add days to a date?",
    a: `Switch to "Add / subtract" mode, enter a start date and an amount with a unit. For example, 90 days after ${EX_ADD.startLabel} is ${EX_ADD.resultLabel} — day ${EX_ADD.resultDayOfYear} of the year.`,
  },
  {
    q: "Does the calculator include the end day?",
    a: `By default it counts the gap between the two dates (the end day is excluded). Tick "Include the end day" for an inclusive count — useful when both the first and last day should count, such as event or rental durations.`,
  },
  {
    q: "How does it handle months and leap years?",
    a: `Adding months or years clamps to the last valid day when needed (e.g. 31 Jan + 1 month becomes 28 or 29 Feb), and all day counting uses real calendar lengths including leap years. Calculations run in UTC so daylight-saving changes never shift the result.`,
  },
];

const STATS = [
  {
    stat: `${EX_DIFF.totalDays} days`,
    color: "text-emerald-600",
    accent: "bg-emerald-500",
    label: `Full ${DIFF_EXAMPLE.startDate.slice(0, 4)} calendar year measured from the worked example`,
  },
  {
    stat: `${EX_DIFF.weekdays} weekdays`,
    color: "text-blue-600",
    accent: "bg-blue-500",
    label: "Business days in that same span, excluding Saturdays and Sundays",
  },
  {
    stat: "UTC math",
    color: "text-amber-600",
    accent: "bg-amber-500",
    label: "Daylight-saving and timezone shifts never change the day count",
  },
];

const CONTENT_CARDS = [
  {
    icon: "📆",
    title: "Calendar days vs business days",
    body: "A 30-day window is rarely 30 working days. Separating weekdays from weekend days is what turns a date range into a realistic deadline, payroll period, or delivery estimate.",
  },
  {
    icon: "➕",
    title: "Add or subtract any span",
    body: "Project a due date 90 days out, back-date a notice period, or find an anniversary. Month and year math clamps cleanly to valid calendar days, including leap years.",
  },
  {
    icon: "🌍",
    title: "No timezone surprises",
    body: "All arithmetic runs in UTC, so a span never gains or loses a day across daylight-saving boundaries — the same inputs always give the same answer.",
  },
];

const RELATED_CALCS = [
  {
    title: "Hours Calculator",
    description: "Add up worked hours and convert them to decimal time.",
    href: "/tools/hours-calculator",
    icon: "⏱️",
    accent: "bg-blue-500/10",
  },
  {
    title: "Day Calculator",
    description: "Count the number of days from one date to another.",
    href: "/tools/day-calculator",
    icon: "📅",
    accent: "bg-emerald-500/10",
  },
  {
    title: "Chronological Age Calculator",
    description: "Find an exact age in years, months, and days.",
    href: "/tools/chronological-age-calculator",
    icon: "🎂",
    accent: "bg-amber-500/10",
  },
  {
    title: "Time Sheet Calculator",
    description: "Total work hours across a week of shifts.",
    href: "/tools/time-sheet-calculator",
    icon: "🗓️",
    accent: "bg-violet-500/10",
  },
];

export default function DateCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Date Calculator",
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Web",
      description:
        "Calculate the duration between two dates or add and subtract days, weeks, months, and years to find a new date.",
      url: "https://worthulator.com/tools/date-calculator",
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
        eyebrowIcon="📆"
        eyebrowText="Date & Time · Duration"
        title="Date Calculator"
        description="Find the exact time between two dates — in years, months, days, weeks, and business days — or add and subtract a span to land on a new date."
        chips={["Days between dates", "Add / subtract dates", "Business-day count"]}
      >
        <DateCalculatorLoader />
      </SimpleCalculatorHero>

      <InsightStrip
        text={`From ${EX_DIFF.startLabel} to ${EX_DIFF.endLabel} is <span class="font-semibold text-gray-900">${EX_DIFF.totalDays} days</span> — ${EX_DIFF.weekdays.toLocaleString()} of them business days. Add 90 days to a start of ${ADD_EXAMPLE.startDate} and you land on ${EX_ADD.resultLabel}.`}
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="Turn a date range into an answer you can use"
        subtitle="Durations, deadlines, and projected dates without manual calendar counting."
        cards={CONTENT_CARDS}
      />

      <SEOTextBlock
        title="How the Date Calculator Works"
        formula={`totalDays   = (endDate − startDate) ÷ 86,400,000 ms
inclusive   = totalDays + (include end day ? 1 : 0)

Years/Months/Days = calendar difference with day & month borrow
weeks       = floor(totalDays ÷ 7); remainder = totalDays mod 7
weekdays    = count of Monday–Friday across the span
weekends    = span − weekdays

Add mode:
newDate = startDate shifted by ±amount in chosen unit
(month/year overflow clamps to the last valid day)`}
        steps={[
          { label: "Choose a mode", description: "Measure the gap between two dates, or add/subtract a span from one date." },
          { label: "Enter your date(s)", description: "Pick a start date, and an end date or an amount and unit." },
          { label: "Optionally include the end day", description: "Switch between an exclusive gap and an inclusive count." },
          { label: "Read the breakdown", description: "See total days, a years/months/days split, and business-day counts." },
          { label: "Use the result", description: "Project deadlines, back-date notice periods, or confirm durations." },
        ]}
        paragraphs={[
          "Business-day counts exclude weekends but not public holidays, which differ by country and region — subtract those separately if your deadline depends on them.",
          "All date math runs in UTC using real calendar month lengths and leap years, so results are stable regardless of your local timezone or daylight-saving changes.",
        ]}
      />

      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      <RelatedCalcCards
        title="Related Calculators"
        subtitle="Pair this with adjacent date and time tools."
        items={RELATED_CALCS}
      />
    </main>
  );
}
