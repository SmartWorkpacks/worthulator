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
  title: "Working Days Calculator 2026 – Business Days in Any Date Range",
  description:
    "Estimate working days in any span of calendar days, excluding weekends and public holidays. Supports 5- or 6-day work weeks for accurate business-day planning.",
  keywords: ["working days calculator", "business days calculator", "working days in a range", "how many working days", "weekdays calculator"],
  alternates: { canonical: "https://worthulator.com/tools/working-days-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "How do I estimate business days from a number of calendar days?",
    a: "Multiply the calendar days by the share of the week you work (5/7 for a standard week), then subtract any public holidays in the range. The formula: Working Days ≈ Calendar Days × (Work Days per Week ÷ 7) − Holidays. It's accurate to within about ±1 day for most ranges; for legal precision over short windows, count each weekday manually.",
  },
  {
    q: "What counts as a working day?",
    a: "Typically Monday–Friday, excluding public holidays. But retail, healthcare, and hospitality often run 6-day weeks, so this calculator lets you set work days per week (1–7). For legal and contract purposes, 'business days' usually means weekdays excluding the relevant jurisdiction's public holidays.",
  },
  {
    q: "How many working days are in a year?",
    a: "In the US: 52 weeks × 5 days = 260 weekdays, minus 11 federal holidays = 249 working days. In the UK: 260 weekdays minus 8 bank holidays = 252. These don't account for company-specific holidays or personal leave — subtract those separately.",
  },
  {
    q: "When does a deadline of '5 business days' fall?",
    a: "Count forward 5 weekdays from the start date, skipping weekends and public holidays, and never counting the start date itself. A 5-business-day deadline starting Thursday lands the following Thursday. This tool estimates totals for a range; for a single short deadline, count the weekdays directly.",
  },
  {
    q: "Do Saturdays count as business days?",
    a: "In most US jurisdictions, no — the Federal Rules of Civil Procedure exclude Saturdays, Sundays, and federal holidays from time computations. But if your work week is 6 days, set that here so the estimate reflects your actual schedule.",
  },
];

const STATS = [
  { stat: "249", color: "text-emerald-600", accent: "bg-emerald-500", label: "working days in a standard US year after federal holidays" },
  { stat: "5/7", color: "text-blue-600",    accent: "bg-blue-500",    label: "weekday-to-calendar-day ratio — the basis of the estimate" },
  { stat: "11",  color: "text-amber-600",   accent: "bg-amber-500",   label: "US federal public holidays in 2026" },
];

const CONTENT_CARDS = [
  {
    icon: "📅",
    title: "Why the ratio method works",
    body: "Any stretch of calendar days contains roughly the same share of weekdays as a single week, because weeks are the repeating unit of the work calendar. Multiplying by your work-days-per-week ÷ 7 captures that share, accurate to within about ±1 day for most ranges.",
  },
  {
    icon: "🛒",
    title: "Built for non-standard weeks",
    body: "Not everyone works Monday–Friday. Retail, hospitality, and healthcare frequently run 6-day weeks. Set your real work days per week and the estimate adjusts — a 6-day week produces noticeably more working days over the same calendar span.",
  },
  {
    icon: "📋",
    title: "Use working days for contracts",
    body: "Contracts, legal notices, and SLAs usually specify deadlines in business days, not calendar days. Always confirm which one a deadline means before planning — misreading the distinction is a common source of missed deadlines and disputes.",
  },
];

const RELATED_CALCS = [
  { title: "Time Between Dates Calculator", description: "Convert days to weeks and months.", href: "/tools/time-between-dates-calculator", icon: "📆", accent: "bg-emerald-500/10" },
  { title: "Work Hours Calculator", description: "Total hours from daily hours and days worked.", href: "/tools/work-hours-calculator", icon: "⏱️", accent: "bg-blue-500/10" },
  { title: "PTO Calculator", description: "Calculate your paid time off balance.", href: "/tools/pto-calculator", icon: "🌴", accent: "bg-amber-500/10" },
  { title: "Take-Home Pay Calculator", description: "What lands in your account after tax.", href: "/tools/take-home-pay-calculator", icon: "💵", accent: "bg-purple-500/10" },
];

export default function WorkingDaysCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Working Days Calculator",
      url: "https://worthulator.com/tools/working-days-calculator",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description: "Estimate working days in a calendar range, excluding weekends and public holidays.",
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
        eyebrowIcon="📅"
        eyebrowText="Work · Time"
        title="Working Days Calculator"
        description="Enter the calendar days in your range, any public holidays, and your work-days-per-week to estimate the number of working days — for deadlines, contracts, and project timelines."
        chips={["Weekends excluded", "Holidays deducted", "5- or 6-day weeks"]}
      >
        <EngineWithInsights slug="working-days-calculator" />
      </SimpleCalculatorHero>
      <InsightStrip text="A standard US work year has <span class='font-semibold text-gray-900'>249 working days</span> — never assume a calendar month equals 22 business days." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="Working days in planning and contracts" subtitle="Estimate business days for any range." cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the Working Days Calculator Works"
        formula={`Weekdays      = Calendar Days × (Work Days per Week ÷ 7)
Working Days  ≈ Weekdays − Public Holidays
Working Weeks = Working Days ÷ Work Days per Week`}
        steps={[
          { label: "Enter the calendar days", description: "The total days in your range (not counting the start date)." },
          { label: "Add public holidays", description: "How many bank/federal holidays fall inside the range." },
          { label: "Set work days per week", description: "5 for a standard week, 6 for many retail/hospitality schedules." },
        ]}
        paragraphs={[
          "The calculator multiplies your calendar days by the share of the week you work, then subtracts public holidays. This is an approximation accurate to within about ±1 day for most ranges — for legal precision over short periods, count each weekday manually.",
          "Because the work-days-per-week is adjustable, the tool handles non-standard schedules: a 6-day work week produces more working days over the same span than the default 5-day week.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />
      <RelatedCalcCards title="Related Calculators" subtitle="More time and planning tools." items={RELATED_CALCS} />
    </main>
  );
}
