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
  title: "Work Hours Calculator 2026 – Total Hours, Overtime & Gross Pay",
  description:
    "Calculate total work hours from daily hours, days per week, and weeks. See FLSA overtime, gross pay at your rate, and how it compares to a full-time year.",
  keywords: ["work hours calculator", "hours worked calculator", "timesheet calculator", "overtime calculator", "total hours calculator"],
  alternates: { canonical: "https://worthulator.com/tools/work-hours-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "How many work hours are in a year?",
    a: "A standard full-time schedule of 8 hours/day × 5 days/week × 52 weeks = 2,080 hours per year. Subtract 10 federal holidays (80 hours) and you get roughly 2,000 productive hours. After typical sick days and vacation, most full-time employees work 1,880–1,960 effective hours a year. This calculator shows your total as a fraction of that 2,080-hour benchmark (your FTE).",
  },
  {
    q: "How is overtime calculated?",
    a: "Under the FLSA, overtime is any time over 40 hours in a workweek, paid at 1.5× your regular rate. It's a weekly calculation, not daily — working 10 hours one day and 0 the next only triggers overtime if the week exceeds 40 hours total (California is an exception with daily overtime rules). This calculator splits your hours into regular and overtime on the weekly basis and prices the overtime at time-and-a-half.",
  },
  {
    q: "How do I calculate hours for a freelance invoice?",
    a: "Enter your hours per day, days per week, and the number of weeks the project spanned, then add your hourly rate to get gross billable pay instantly. Always track in 15-minute increments at minimum and log time as you go — reconstructing hours days later is notoriously inaccurate.",
  },
  {
    q: "What counts as part-time hours?",
    a: "There's no single federal definition, but most employers treat under 30–35 hours/week as part-time. For ACA health-insurance purposes, 30 hours/week is the threshold. The calculator reports your full-time equivalent (FTE) so you can see exactly where a schedule sits.",
  },
  {
    q: "How many hours should I work per day for peak productivity?",
    a: "Research on deep work (K. Anders Ericsson) suggests most knowledge workers sustain only 4–6 hours of genuinely focused effort per day. More hours on the clock rarely means proportionally more output — scheduling high-priority work during peak-energy windows beats simply extending the day.",
  },
];

const STATS = [
  { stat: "2,080", color: "text-emerald-600", accent: "bg-emerald-500", label: "standard work hours in a full-time year (8h × 5d × 52)" },
  { stat: "40 hr", color: "text-rose-600",    accent: "bg-rose-500",    label: "weekly FLSA overtime threshold — extra hours pay 1.5×" },
  { stat: "4–6 hr", color: "text-blue-600",   accent: "bg-blue-500",    label: "daily peak productive capacity for most knowledge workers" },
];

const CONTENT_CARDS = [
  {
    icon: "🧾",
    title: "Built for contractor invoicing",
    body: "Enter the hours and weeks a project spanned plus your rate to get billable gross pay instantly. Multiply nothing by hand — the calculator splits regular and overtime hours and prices them correctly so your invoice total is defensible.",
  },
  {
    icon: "⏰",
    title: "Overtime is a weekly calculation",
    body: "The FLSA bases overtime on the workweek, not the day. Anything over 40 hours in a fixed 7-day week is overtime at 1.5×. The calculator applies this per week and scales it across your whole period, so a consistently long week is correctly flagged and priced.",
  },
  {
    icon: "⚖️",
    title: "Track actual vs contracted hours",
    body: "Many fixed-price contracts use estimated hours that are never checked against actuals. If you consistently work 30% more hours than quoted, your effective rate is 30% lower than you think. Running an hours-worked log reveals over-servicing before it erodes your margin.",
  },
];

const RELATED_CALCS = [
  { title: "Working Days Calculator", description: "Count business days between two dates.", href: "/tools/working-days-calculator", icon: "📅", accent: "bg-blue-500/10" },
  { title: "Freelance Rate Calculator", description: "Set a rate that covers your hours and costs.", href: "/tools/freelance-rate-calculator", icon: "🧑‍💻", accent: "bg-amber-500/10" },
  { title: "Overtime Pay Calculator", description: "See how much your overtime hours are worth.", href: "/tools/overtime-pay-calculator", icon: "💰", accent: "bg-purple-500/10" },
  { title: "Take-Home Pay Calculator", description: "What lands in your account after tax.", href: "/tools/take-home-pay-calculator", icon: "💵", accent: "bg-emerald-500/10" },
];

export default function WorkHoursCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Work Hours Calculator",
      url: "https://worthulator.com/tools/work-hours-calculator",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description: "Calculate total work hours, FLSA overtime, and gross pay from daily hours, days per week, and weeks.",
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
        eyebrowIcon="⏱️"
        eyebrowText="Work · Time"
        title="Work Hours Calculator"
        description="Enter your daily hours, days per week, and weeks to get total hours for any period — with FLSA overtime, gross pay at your rate, and a full-time-equivalent comparison."
        chips={["Total hours", "Overtime at 1.5×", "Gross pay"]}
      >
        <EngineWithInsights slug="work-hours-calculator" />
      </SimpleCalculatorHero>
      <InsightStrip text="A standard full-time year is <span class='font-semibold text-gray-900'>2,080 hours</span> — anything over 40 in a week is overtime, paid at time-and-a-half." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="Getting the most from your hours" subtitle="Hours, overtime, and what they're worth." cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the Work Hours Calculator Works"
        formula={`Weekly Hours  = Hours Per Day × Days Per Week
Total Hours   = Weekly Hours × Weeks
Overtime/wk   = max(0, Weekly Hours − 40)
Gross Pay     = Regular Hours × Rate + Overtime Hours × Rate × 1.5
FTE           = Total Hours ÷ 2,080`}
        steps={[
          { label: "Enter hours per day", description: "Your net daily hours after breaks. Use decimals: 7.5 = 7h 30m." },
          { label: "Set days per week", description: "How many days you work in a typical week (1–7)." },
          { label: "Set the weeks in the period", description: "One week, a billing period, or a full 52-week year." },
          { label: "Add your hourly rate", description: "Optional — leave at 0 to skip earnings and just see hours." },
        ]}
        paragraphs={[
          "Hours are a direct multiplication, but overtime makes it cleverer: the calculator applies the FLSA weekly rule, treating any time over 40 hours in a week as overtime payable at 1.5×, then scales that across your whole period.",
          "Gross pay combines regular and overtime hours at your rate, and the full-time-equivalent (FTE) figure tells you instantly whether a schedule is part-time, full-time, or beyond — measured against the standard 2,080-hour work year.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />
      <RelatedCalcCards title="Related Calculators" subtitle="More work and time tools." items={RELATED_CALCS} />
    </main>
  );
}
