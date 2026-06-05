import type { Metadata } from "next";
import TimecardCalculatorLoader from "./TimecardCalculatorLoader";
import { calculateTimecard, type TimecardDay } from "@/lib/calculators/timecardEngine";
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
  title: "Timecard Calculator - Weekly Hours, Overtime & Pay",
  description:
    "Add up a full week of clock-in and clock-out times with unpaid breaks. Get daily and weekly hours, automatic overtime past 40 hours, and gross pay at time-and-a-half.",
  keywords: [
    "timecard calculator",
    "time card calculator",
    "weekly hours calculator",
    "work hours calculator",
    "overtime pay calculator",
    "timesheet calculator",
  ],
  alternates: { canonical: "https://worthulator.com/tools/timecard-calculator" },
  robots: { index: true, follow: true },
};

function day(label: string, enabled: boolean, start: number, end: number, brk: number): TimecardDay {
  return { label, enabled, startMinutes: start, endMinutes: end, breakMinutes: brk };
}

// Deterministic worked examples computed at build from the engine.
const WEEKDAYS: TimecardDay[] = [
  day("Mon", true, 9 * 60, 17 * 60, 30),
  day("Tue", true, 9 * 60, 17 * 60, 30),
  day("Wed", true, 9 * 60, 17 * 60, 30),
  day("Thu", true, 9 * 60, 17 * 60, 30),
  day("Fri", true, 9 * 60, 17 * 60, 30),
  day("Sat", false, 0, 0, 0),
  day("Sun", false, 0, 0, 0),
];
const EX = calculateTimecard({ days: WEEKDAYS, hourlyRate: 22, weeklyOvertimeThresholdHours: 40 });

// A 6-day week that crosses into overtime.
const OT_DAYS: TimecardDay[] = Array.from({ length: 6 }, (_, i) =>
  day(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][i], true, 8 * 60, 16 * 60 + 30, 30),
).concat(day("Sun", false, 0, 0, 0));
const EX_OT = calculateTimecard({ days: OT_DAYS, hourlyRate: 22, weeklyOvertimeThresholdHours: 40 });

const money = (n: number) => `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const hrs = (n: number) => `${n.toLocaleString(undefined, { maximumFractionDigits: 2 })} hours`;

const FAQS = [
  {
    q: "How does a timecard calculator work?",
    a: `It totals the time between each day's clock-in and clock-out, subtracts unpaid breaks, then sums the week. A standard Monday–Friday 9-to-5 with a 30-minute lunch comes to ${hrs(EX.totalWorkedHours)} for the week.`,
  },
  {
    q: "When does overtime start?",
    a: `Under the common FLSA rule, hours over 40 in a week are overtime, paid at 1.5× the regular rate. In the six-day example the week totals ${hrs(EX_OT.totalWorkedHours)}, so ${hrs(EX_OT.overtimeHours)} is overtime. You can change the 40-hour threshold if your rules differ.`,
  },
  {
    q: "How are overnight shifts handled?",
    a: "If a day's end time is the same as or earlier than its start time, the calculator treats it as crossing midnight and adds 24 hours. So a 10:00 p.m. to 6:00 a.m. shift correctly counts as 8 hours, not a negative number.",
  },
  {
    q: "Does it account for unpaid breaks?",
    a: "Yes. Each day has its own unpaid-break field in minutes, which is subtracted from that day's clock time before the week is totaled. Set it to zero for paid or no breaks.",
  },
  {
    q: "How is my weekly pay calculated?",
    a: `Regular hours are paid at your rate and overtime hours at 1.5×. At ${money(22)} an hour, the 9-to-5 week is ${money(EX.totalPay)} gross; the six-day overtime week is ${money(EX_OT.totalPay)} because ${hrs(EX_OT.overtimeHours)} earns the time-and-a-half premium.`,
  },
];

const STATS = [
  {
    stat: hrs(EX.totalWorkedHours),
    color: "text-blue-600",
    accent: "bg-blue-500",
    label: "A standard Mon–Fri 9-to-5 week with a 30-minute daily lunch",
  },
  {
    stat: "1.5× after 40h",
    color: "text-amber-600",
    accent: "bg-amber-500",
    label: "Overtime premium on weekly hours past the 40-hour line (FLSA default)",
  },
  {
    stat: money(EX.totalPay),
    color: "text-emerald-600",
    accent: "bg-emerald-500",
    label: `Gross pay for that week at ${money(22)} per hour`,
  },
];

const CONTENT_CARDS = [
  {
    icon: "🗓️",
    title: "A whole week at once",
    body: "Toggle the days you worked and enter each day's start, end, and break. The calculator totals every day into a clean weekly figure — no adding shifts in your head.",
  },
  {
    icon: "⏱️",
    title: "Overtime handled automatically",
    body: "Hours past 40 in the week are split out and paid at time-and-a-half. Adjust the threshold if your workplace uses a different overtime rule.",
  },
  {
    icon: "🌙",
    title: "Overnight shifts just work",
    body: "End times earlier than start times roll over midnight, so graveyard shifts count correctly instead of producing a negative total.",
  },
];

const RELATED_CALCS = [
  {
    title: "Hours Calculator",
    description: "Total a single shift with breaks and overtime.",
    href: "/tools/hours-calculator",
    icon: "🕐",
    accent: "bg-blue-500/10",
  },
  {
    title: "Paycheck Calculator",
    description: "Turn gross pay into take-home after taxes.",
    href: "/tools/paycheck-calculator",
    icon: "💵",
    accent: "bg-emerald-500/10",
  },
  {
    title: "Overtime Calculator",
    description: "Work out overtime pay on its own.",
    href: "/tools/overtime-calculator",
    icon: "⏰",
    accent: "bg-amber-500/10",
  },
  {
    title: "Annual Salary Calculator",
    description: "Convert an hourly wage to yearly pay.",
    href: "/tools/annual-salary-calculator",
    icon: "📅",
    accent: "bg-violet-500/10",
  },
];

export default function TimecardPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Timecard Calculator",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description:
        "Add up a week of clock-in/out times with breaks to get daily and weekly hours, overtime past 40 hours, and gross pay at time-and-a-half.",
      url: "https://worthulator.com/tools/timecard-calculator",
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
        eyebrowIcon="🗂️"
        eyebrowText="Date & Time · Work Hours"
        title="Timecard Calculator"
        description="Add up a full week of clock-in and clock-out times with unpaid breaks — daily and weekly hours, automatic overtime past 40, and gross pay at time-and-a-half."
        chips={["Weekly hours", "Overtime split", "Gross pay"]}
      >
        <TimecardCalculatorLoader />
      </SimpleCalculatorHero>

      <InsightStrip
        text={`A six-day week of 8-hour shifts totals <span class="font-semibold text-gray-900">${hrs(EX_OT.totalWorkedHours)}</span> — with ${hrs(EX_OT.overtimeHours)} paid at time-and-a-half, that's ${money(EX_OT.totalPay)} gross at ${money(22)}/hr.`}
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="Everything a paper timecard does, faster"
        subtitle="A weekly grid that totals hours, splits overtime, and computes pay."
        cards={CONTENT_CARDS}
      />

      <SEOTextBlock
        title="How the Timecard Calculator Works"
        formula={`Per day:  gross = end − start   (if end ≤ start, add 24h for overnight)
          worked = max(0, gross − unpaid break)
Weekly:   totalHours = sum of worked hours across enabled days
          regular  = min(totalHours, 40)
          overtime = max(0, totalHours − 40)
Pay:      regularPay  = regular × rate
          overtimePay = overtime × rate × 1.5
          grossPay    = regularPay + overtimePay`}
        steps={[
          { label: "Toggle your days", description: "Switch on the days you worked; leave the rest off." },
          { label: "Enter clock times", description: "Set each day's start and end — overnight shifts are handled." },
          { label: "Add unpaid breaks", description: "Per-day break minutes are subtracted from that day." },
          { label: "Set your rate", description: "Optional: add an hourly rate to see gross pay." },
          { label: "Read your week", description: "Get weekly hours, the overtime split, and total pay." },
        ]}
        paragraphs={[
          "The calculator treats each day independently, so different start times, end times, and break lengths all total correctly. Weekly overtime is applied to the summed hours rather than per day, matching how most US employers calculate it under the FLSA.",
          "Overtime defaults to hours over 40 per week at 1.5× pay, but the threshold is editable for workplaces with different rules. This is an estimate for planning and record-keeping — your employer's official payroll figures govern.",
        ]}
      />

      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      <RelatedCalcCards
        title="Related Calculators"
        subtitle="From a single shift to your full paycheck."
        items={RELATED_CALCS}
      />
    </main>
  );
}
