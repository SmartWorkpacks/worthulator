import type { Metadata } from "next";
import HoursCalculatorLoader from "./HoursCalculatorLoader";
import { calculateHours } from "@/lib/calculators/hoursEngine";
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
  title: "Hours Calculator - Time Between Hours, Decimal Hours & Pay",
  description:
    "Calculate hours worked between two times, including overnight shifts and unpaid breaks. Convert to decimal hours, split regular and overtime, and turn it into pay.",
  keywords: [
    "hours calculator",
    "hour calculator",
    "time card calculator",
    "hours worked calculator",
    "decimal hours calculator",
    "overtime hours calculator",
  ],
  alternates: { canonical: "https://worthulator.com/tools/hours-calculator" },
  robots: { index: true, follow: true },
};

// Deterministic worked examples computed at build from the engine.
const EX_STD = calculateHours({
  startMinutes: 9 * 60,
  endMinutes: 17 * 60,
  breakMinutes: 30,
  hourlyRate: 0,
  overtimeThresholdHours: 8,
});
const EX_OT = calculateHours({
  startMinutes: 8 * 60,
  endMinutes: 19 * 60,
  breakMinutes: 0,
  hourlyRate: 20,
  overtimeThresholdHours: 8,
});
const EX_NIGHT = calculateHours({
  startMinutes: 22 * 60,
  endMinutes: 6 * 60,
  breakMinutes: 30,
  hourlyRate: 0,
  overtimeThresholdHours: 8,
});

const FAQS = [
  {
    q: "How do I calculate hours worked between two times?",
    a: `Subtract the start time from the end time, then take off any unpaid break. For example, 09:00 to 17:00 with a 30-minute break is ${EX_STD.clockLabel} of worked time — ${EX_STD.workedHours} decimal hours.`,
  },
  {
    q: "How do I convert hours and minutes to decimal hours?",
    a: `Divide the minutes by 60 and add them to the hours. So ${EX_STD.clockLabel} becomes ${EX_STD.workedHours} hours (${EX_STD.minutesPart} minutes ÷ 60 = ${(EX_STD.minutesPart / 60).toFixed(2)}). Payroll and invoicing systems almost always use decimal hours.`,
  },
  {
    q: "How does the calculator handle overnight shifts?",
    a: `If the end time is at or before the start time, the shift is assumed to cross midnight and 24 hours is added once. For example, 22:00 to 06:00 with a 30-minute break is ${EX_NIGHT.workedHours} worked hours.`,
  },
  {
    q: "How is overtime calculated?",
    a: `Hours above your daily threshold (8 by default) are counted as overtime. Working 08:00 to 19:00 with no break is ${EX_OT.workedHours} hours: ${EX_OT.regularHours} regular and ${EX_OT.overtimeHours} overtime. At $20/hr with a 1.5x premium that is $${EX_OT.totalPay.toFixed(2)} for the day.`,
  },
  {
    q: "Does the break get paid?",
    a: `No — the unpaid break you enter is removed from the worked total before hours and pay are calculated. Leave it at 0 if your break is paid or you did not take one.`,
  },
];

const STATS = [
  {
    stat: `${EX_STD.workedHours} hrs`,
    color: "text-emerald-600",
    accent: "bg-emerald-500",
    label: "Decimal worked hours for a 9-to-5 shift with a 30-minute break",
  },
  {
    stat: "1.5x",
    color: "text-blue-600",
    accent: "bg-blue-500",
    label: "Time-and-a-half premium applied to hours above your daily threshold",
  },
  {
    stat: "Overnight",
    color: "text-amber-600",
    accent: "bg-amber-500",
    label: "Shifts that cross midnight are detected and counted automatically",
  },
];

const CONTENT_CARDS = [
  {
    icon: "⏱️",
    title: "Decimal hours are what get paid",
    body: "A timesheet that says 7h 30m is 7.5 hours to a payroll system. Converting cleanly avoids rounding disputes and makes invoices and pay match.",
  },
  {
    icon: "🌙",
    title: "Overnight shifts counted correctly",
    body: "Clock out before you clocked in? The calculator assumes the shift crossed midnight and adds 24 hours once, so night-shift totals stay accurate.",
  },
  {
    icon: "☕",
    title: "Breaks come out first",
    body: "Unpaid breaks are subtracted before hours and pay are computed, so the number you see is the time you actually get paid for.",
  },
];

const RELATED_CALCS = [
  {
    title: "Time Sheet Calculator",
    description: "Add up a full week of shifts and breaks.",
    href: "/tools/time-sheet-calculator",
    icon: "🗓️",
    accent: "bg-blue-500/10",
  },
  {
    title: "Time to Decimal Calculator",
    description: "Convert hours and minutes into decimal time.",
    href: "/tools/time-to-decimal-calculator",
    icon: "🔢",
    accent: "bg-emerald-500/10",
  },
  {
    title: "Work Time Calculator",
    description: "Total worked time across multiple entries.",
    href: "/tools/work-time-calculator",
    icon: "💼",
    accent: "bg-amber-500/10",
  },
  {
    title: "Overtime Calculator",
    description: "Work out overtime pay at time-and-a-half.",
    href: "/tools/overtime-calculator",
    icon: "⏰",
    accent: "bg-violet-500/10",
  },
];

export default function HoursCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Hours Calculator",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description:
        "Calculate hours worked between two times including overnight shifts and breaks, convert to decimal hours, and compute pay with overtime.",
      url: "https://worthulator.com/tools/hours-calculator",
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
        eyebrowIcon="⏱️"
        eyebrowText="Date & Time · Work Hours"
        title="Hours Calculator"
        description="Add up the hours between two times — including overnight shifts and unpaid breaks — then convert to decimal hours and pay with an overtime split."
        chips={["Time between hours", "Decimal hours", "Overtime + pay"]}
      >
        <HoursCalculatorLoader />
      </SimpleCalculatorHero>

      <InsightStrip
        text={`A 09:00–17:00 shift with a 30-minute break is <span class="font-semibold text-gray-900">${EX_STD.workedHours} worked hours</span> (${EX_STD.clockLabel}). An 08:00–19:00 shift with no break is ${EX_OT.workedHours} hours — ${EX_OT.overtimeHours} of them overtime.`}
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="From a pair of clock times to paid hours"
        subtitle="Breaks, overnight shifts, and overtime handled so the total is the one you get paid for."
        cards={CONTENT_CARDS}
      />

      <SEOTextBlock
        title="How the Hours Calculator Works"
        formula={`gross   = endTime − startTime
          (if end ≤ start, add 24h for an overnight shift)
worked  = max(0, gross − unpaid break)
hours   = worked ÷ 60   (decimal)
H:MM    = floor(worked ÷ 60) : (worked mod 60)

regular = min(hours, overtime threshold)
overtime= max(0, hours − overtime threshold)
pay     = regular × rate + overtime × rate × 1.5`}
        steps={[
          { label: "Enter start and end times", description: "Use 24-hour or your locale's time picker; overnight shifts are detected automatically." },
          { label: "Add any unpaid break", description: "Break minutes are removed from the worked total." },
          { label: "Optionally add an hourly rate", description: "See pay for the shift, with overtime at time-and-a-half." },
          { label: "Set your overtime threshold", description: "Hours above this per day count as overtime (8 by default)." },
          { label: "Read decimal and HH:MM", description: "Use decimal hours for payroll and the HH:MM split for your records." },
        ]}
        paragraphs={[
          "Overtime rules vary by country, state, and contract. The 1.5x premium and daily threshold here are a common default, not legal advice — confirm the rules that apply to you.",
          "This tool covers a single shift. For a full week of separate days and breaks, use the time sheet calculator, which totals multiple entries at once.",
        ]}
      />

      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      <RelatedCalcCards
        title="Related Calculators"
        subtitle="Pair this with adjacent time and pay tools."
        items={RELATED_CALCS}
      />
    </main>
  );
}
