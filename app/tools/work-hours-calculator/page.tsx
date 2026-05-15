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
  title: "Work Hours Calculator 2026 – Total Hours from Daily Hours & Days",
  description:
    "Calculate total work hours from daily hours and number of days. Use for timesheets, freelance billing, contractor invoices, or any work period tracking.",
  keywords: ["work hours calculator", "hours worked calculator", "timesheet calculator", "total hours calculator", "how many hours did I work"],
  alternates: { canonical: "https://worthulator.com/tools/work-hours-calculator" },
};

const FAQS = [
  {
    q: "How many work hours are in a year?",
    a: "A standard full-time schedule of 8 hours/day × 5 days/week × 52 weeks = 2,080 hours per year. Subtract 10 federal holidays (80 hours) and you get approximately 2,000 productive work hours. Accounting for average sick days (~6/year) and vacation (10+ days), most full-time employees work 1,880–1,960 effective hours per year.",
  },
  {
    q: "How do I calculate hours for a freelance invoice?",
    a: "Log your actual hours worked per project, multiply by your hourly rate, and add any expenses. For example: 14.5 hours × $85/hr = $1,232.50. Always track in 15-minute increments at minimum, and log time immediately — trying to recall hours worked days later is notoriously inaccurate. Tools like Toggl, Harvest, or even a simple spreadsheet work well.",
  },
  {
    q: "What is a part-time hours range?",
    a: "There is no federal definition of part-time, but most employers consider anything under 30–35 hours/week as part-time. For ACA health insurance purposes, 30 hours/week is the threshold. Part-time employees often work 15–29 hours/week. Below 10 hours/week is typically classified as casual or on-call.",
  },
  {
    q: "How do I calculate overtime on a non-standard schedule?",
    a: "FLSA overtime is calculated on a workweek basis (Sunday–Saturday or any fixed 7-day period). If you work 10 hours on Monday and 0 on Friday, you only earn overtime if your weekly total exceeds 40 hours. The daily schedule doesn't matter federally — only the weekly total (except in California, which has daily overtime rules).",
  },
  {
    q: "How many hours should I work per day for peak productivity?",
    a: "Research on deep work and cognitive performance suggests that most knowledge workers have 4–6 hours of peak productive capacity per day, not 8. Studies by K. Anders Ericsson found elite performers rarely exceed 4 hours of deliberate, focused work daily. More hours worked ≠ more output — scheduling high-priority work during peak energy windows is more effective than extending hours.",
  },
];

const STATS = [
  { stat: "2,080", color: "text-emerald-600", accent: "bg-emerald-500", label: "standard work hours in a year at 8 hrs/day, 5 days/week" },
  { stat: "4–6 hr", color: "text-blue-600", accent: "bg-blue-500", label: "daily peak productive capacity for most knowledge workers" },
  { stat: "15 min", color: "text-amber-600", accent: "bg-amber-500", label: "minimum billing increment used by most professional service firms" },
];

const CONTENT_CARDS = [
  {
    icon: "🧾",
    title: "Use this for contractor invoicing",
    body: "Freelancers and contractors should log hours at the project level, not the week level. Enter the hours worked on a specific project and the number of days it spanned to get total billable hours. Multiply by your rate to generate invoice totals instantly.",
  },
  {
    icon: "📅",
    title: "Convert hours to days and weeks",
    body: "Use this calculator for scheduling and project planning. If a project requires 120 hours of work and you have 3 team members at 6 hours/day each, total capacity is 18 hours/day — meaning the project takes about 6.7 working days. Capacity planning prevents under- and over-delivery commitments.",
  },
  {
    icon: "⚖️",
    title: "Track actual vs contracted hours",
    body: "Many fixed-price contracts are based on estimated hours that are rarely tracked against actuals. Running even a rough hours-worked log reveals whether you're over-servicing clients. If you consistently work 30% more hours than estimated, your effective rate is 30% lower than quoted — adjust your pricing accordingly.",
  },
];

const RELATED_CALCS = [
  { title: "Time Clock Calculator", description: "Calculate hours from clock-in and clock-out times.", href: "/tools/time-clock-calculator", icon: "⏰", accent: "bg-emerald-500/10" },
  { title: "Working Days Calculator", description: "Count business days between two dates.", href: "/tools/working-days-calculator", icon: "📅", accent: "bg-blue-500/10" },
  { title: "Freelance Rate Calculator", description: "Set a rate that covers your hours and costs.", href: "/tools/freelance-rate-calculator", icon: "🧑‍💻", accent: "bg-amber-500/10" },
  { title: "Overtime Pay Calculator", description: "See how much your overtime hours are worth.", href: "/tools/overtime-pay-calculator", icon: "💰", accent: "bg-purple-500/10" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Work Hours Calculator",
      url: "https://worthulator.com/tools/work-hours-calculator",
      applicationCategory: "BusinessApplication",
      description: "Calculate total work hours from daily hours and number of days worked.",
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

export default function WorkHoursCalculator() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SimpleCalculatorHero
        eyebrowIcon="⏱️"
        eyebrowText="Work Hours Calculator"
        title="How Many Hours Have You Worked?"
        description="Enter your daily hours and number of days worked to get your total hours for any period — ideal for timesheets, invoices, and project planning."
        chips={["Total hours calculated", "Average per day shown", "Works for any period"]}
      >
        <CalculatorEngineLoader slug="work-hours-calculator" />
      </SimpleCalculatorHero>
      <InsightStrip text="A standard full-time year is <span class='font-semibold text-gray-900'>2,080 hours</span> — but most workers log closer to 1,900 effective hours after leave and holidays." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="Getting the most from your hours" cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the Work Hours Calculator Works"
        formula="Total Hours = Hours Per Day × Days Worked\nAverage Per Day = Total Hours ÷ Days Worked"
        paragraphs={[
          "This is a direct multiplication calculator. Enter your net daily hours (after breaks) and the number of days worked to get a total. It works for any period — a single week, a billing period, a project, or an entire year.",
          "Use decimal values for partial hours: 7.5 = 7 hours 30 minutes, 8.25 = 8 hours 15 minutes.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
