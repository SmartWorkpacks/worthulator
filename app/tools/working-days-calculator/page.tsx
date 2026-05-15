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
  title: "Working Days Calculator 2026 – Business Days Between Two Dates",
  description:
    "Calculate the number of working days between any two dates, excluding weekends and public holidays. Enter calendar days and holidays to get business days instantly.",
  keywords: ["working days calculator", "business days calculator", "working days between dates", "how many working days", "weekdays calculator"],
  alternates: { canonical: "https://worthulator.com/tools/working-days-calculator" },
};

const FAQS = [
  {
    q: "How do I calculate business days between two dates?",
    a: "Count the total calendar days between the two dates, multiply by 5/7 to estimate weekdays (this approximates the proportion of weekdays in any period), then subtract any public holidays in that range. The formula: Working Days ≈ (Calendar Days × 5/7) − Holidays. For precise results, count each day manually or use a date-aware calendar tool.",
  },
  {
    q: "What counts as a working day?",
    a: "A working day is typically Monday through Friday, excluding public holidays. Some industries (retail, healthcare, hospitality) operate on weekends, so their 'working days' may include Saturday and Sunday. For legal and contract purposes, 'business days' usually means weekdays excluding public bank holidays in the relevant jurisdiction.",
  },
  {
    q: "How many working days are in a year?",
    a: "In the US: 52 weeks × 5 days = 260 weekdays, minus 11 federal holidays = 249 working days. In the UK: 52 weeks × 5 days = 260 weekdays, minus 8 bank holidays in England/Wales = 252 working days. These figures don't account for company-specific holidays or leave.",
  },
  {
    q: "When does a deadline of '5 business days' actually fall?",
    a: "Count forward 5 weekdays from the start date, skipping weekends and public holidays. If a 5-business-day deadline starts on a Thursday, count: Friday (1), Monday (2), Tuesday (3), Wednesday (4), Thursday (5) — arriving the following Thursday. Never count the start date itself.",
  },
  {
    q: "Do Saturdays count as working days for legal notices?",
    a: "In most US jurisdictions, Saturdays do not count as business days for legal notice purposes unless specified. The FRCP (Federal Rules of Civil Procedure) excludes Saturdays, Sundays, and federal holidays from computation of time periods. Always check the specific contract or statute — some explicitly define 'calendar days' vs 'business days' differently.",
  },
];

const STATS = [
  { stat: "249", color: "text-emerald-600", accent: "bg-emerald-500", label: "working days in a standard US year after federal holidays" },
  { stat: "5/7", color: "text-blue-600", accent: "bg-blue-500", label: "ratio of weekdays to calendar days — the basis of the working days formula" },
  { stat: "11", color: "text-amber-600", accent: "bg-amber-500", label: "federal public holidays in the United States in 2026" },
];

const CONTENT_CARDS = [
  {
    icon: "📅",
    title: "Why the 5/7 formula works",
    body: "Any stretch of calendar days contains roughly 5/7 weekdays, because weeks are the fundamental unit of the work calendar. This approximation is accurate to within ±1 day for most ranges. For legal or contractual precision over short periods (under 2 weeks), count days manually to avoid the rounding error.",
  },
  {
    icon: "⚠️",
    title: "Public holidays vary by state and country",
    body: "Federal holidays apply to federal government employees, but private employers are not required to give time off. Each US state has additional holidays. Internationally, working calendars differ significantly — the UK, India, Germany, and Australia all have different holiday counts and dates. Always check your specific regional calendar.",
  },
  {
    icon: "📋",
    title: "Use working days for contract deadlines",
    body: "Contracts, legal notices, and SLAs typically specify deadlines in 'business days' rather than calendar days. Always confirm whether a deadline is calendar days or working days before calculating. Misreading this distinction is a common source of missed deadlines and disputes in commercial contracts.",
  },
];

const RELATED_CALCS = [
  { title: "Time Between Dates Calculator", description: "Convert days to weeks and months.", href: "/tools/time-between-dates-calculator", icon: "📆", accent: "bg-emerald-500/10" },
  { title: "Work Hours Calculator", description: "Total hours from daily hours and days worked.", href: "/tools/work-hours-calculator", icon: "⏱️", accent: "bg-blue-500/10" },
  { title: "Time Clock Calculator", description: "Clock-in to clock-out hours and overtime.", href: "/tools/time-clock-calculator", icon: "⏰", accent: "bg-amber-500/10" },
  { title: "PTO Calculator", description: "Calculate your paid time off balance.", href: "/tools/pto-calculator", icon: "🌴", accent: "bg-purple-500/10" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Working Days Calculator",
      url: "https://worthulator.com/tools/working-days-calculator",
      applicationCategory: "BusinessApplication",
      description: "Calculate the number of working days between two dates, excluding weekends and public holidays.",
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

export default function WorkingDaysCalculator() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SimpleCalculatorHero
        eyebrowIcon="📅"
        eyebrowText="Working Days Calculator"
        title="How Many Business Days Is That?"
        description="Enter the total calendar days in your range and any public holidays to instantly see the number of working days — perfect for deadlines, contracts, and project timelines."
        chips={["Weekends excluded", "Holidays deducted", "Works for any date range"]}
      >
        <CalculatorEngineLoader slug="working-days-calculator" />
      </SimpleCalculatorHero>
      <InsightStrip text="A standard US work year has <span class='font-semibold text-gray-900'>249 working days</span> — never assume a calendar month means 22 business days." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="Working days in planning and contracts" cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the Working Days Calculator Works"
        formula="Working Days ≈ (Calendar Days × 5/7) − Public Holidays"
        paragraphs={[
          "The calculator multiplies total calendar days by 5/7 to estimate weekdays, then subtracts public holidays in the range. This is an approximation accurate to ±1 day for most ranges — for legal precision over short periods, manually count each weekday.",
          "Enter the total days between your two dates (not including the start date) and the number of public bank or federal holidays that fall within that range.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
