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
  title: "Time Clock Calculator 2026 – Daily Hours, Weekly Total & Overtime",
  description:
    "Calculate your daily hours worked, weekly total, and overtime from clock-in and clock-out times. Enter your start time, end time, and break duration instantly.",
  keywords: ["time clock calculator", "hours worked calculator", "overtime calculator", "clock in clock out calculator", "work hours tracker"],
  alternates: { canonical: "https://worthulator.com/tools/time-clock-calculator" },
};

const FAQS = [
  {
    q: "How is overtime calculated in the US?",
    a: "Under the Fair Labor Standards Act (FLSA), non-exempt employees must receive 1.5× their regular pay rate for any hours worked beyond 40 in a workweek. Some states (like California) also require daily overtime for hours beyond 8 in a single day, and double-time for hours beyond 12. This calculator tracks weekly overtime only.",
  },
  {
    q: "Do unpaid breaks count as hours worked?",
    a: "No — unpaid meal breaks (typically 30 minutes or longer) are excluded from hours worked under FLSA. Short rest breaks of 5–20 minutes are considered compensable time and should NOT be deducted. Enter only your unpaid meal/lunch breaks in the break time field.",
  },
  {
    q: "What is the difference between a 9/80 and a 4/10 work schedule?",
    a: "A 4/10 schedule is 4 days × 10 hours = 40 hours/week with 3-day weekends. A 9/80 is 9 hours/day for 8 days + 1 day of 8 hours over two weeks = 80 hours in 9 working days, giving one extra day off per fortnight. Both keep total hours at 40/week on average, so no overtime is triggered.",
  },
  {
    q: "Can my employer round my clock-in times?",
    a: "Yes — the FLSA allows rounding to the nearest 5, 6, or 15 minutes as long as the practice averages out fairly over time. However, rounding that consistently benefits the employer is illegal. Many employers now use exact time tracking to avoid disputes.",
  },
  {
    q: "How many hours is full-time vs part-time?",
    a: "The FLSA does not define full-time or part-time — it's up to employers. The IRS defines full-time as 30+ hours/week for ACA purposes (employer mandate). Most employers define full-time as 35–40 hours. Part-time is typically below 30–35 hours. Benefits eligibility is almost always tied to this threshold.",
  },
];

const STATS = [
  { stat: "40 hr", color: "text-emerald-600", accent: "bg-emerald-500", label: "standard US workweek — overtime kicks in above this under FLSA" },
  { stat: "1.5×", color: "text-blue-600", accent: "bg-blue-500", label: "overtime pay multiplier required for non-exempt US employees" },
  { stat: "4.8 hr", color: "text-amber-600", accent: "bg-amber-500", label: "average daily productive deep work time — most people plateau beyond this" },
];

const CONTENT_CARDS = [
  {
    icon: "⏰",
    title: "Track breaks separately",
    body: "Only subtract unpaid meal breaks (usually 30+ minutes) from your worked hours. Short rest breaks (under 20 minutes) are paid time under FLSA and should not be deducted. If your employer requires you to remain on-premises during a 'break', it is typically compensable time regardless of length.",
  },
  {
    icon: "📋",
    title: "Keep records for 2+ years",
    body: "FLSA requires employers to retain payroll records for at least 3 years and time records for 2 years. Employees should also keep their own records — screenshots, calendar notes, or a time log app. If a wage dispute arises, your records will be critical evidence.",
  },
  {
    icon: "💰",
    title: "Know your overtime threshold",
    body: "Federal overtime exemptions apply to salaried employees earning above $684/week (as of 2026). If you earn below this, you're likely entitled to overtime regardless of job title. 'Exempt' labels on job descriptions do not override the law — actual job duties and pay determine exemption status.",
  },
];

const RELATED_CALCS = [
  { title: "Work Hours Calculator", description: "Calculate total hours from daily hours and days.", href: "/tools/work-hours-calculator", icon: "⏱️", accent: "bg-emerald-500/10" },
  { title: "Overtime Pay Calculator", description: "See exactly how much your overtime is worth.", href: "/tools/overtime-pay-calculator", icon: "💵", accent: "bg-blue-500/10" },
  { title: "True Hourly Wage Calculator", description: "Find your real hourly rate including commute.", href: "/tools/true-hourly-wage", icon: "🧮", accent: "bg-amber-500/10" },
  { title: "Salary to Hourly Calculator", description: "Convert any annual salary to an hourly rate.", href: "/tools/salary-to-hourly-calculator", icon: "📐", accent: "bg-purple-500/10" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Time Clock Calculator",
      url: "https://worthulator.com/tools/time-clock-calculator",
      applicationCategory: "BusinessApplication",
      description: "Calculate daily hours worked, weekly total, and overtime from clock-in and clock-out times.",
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

export default function TimeClockCalculator() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SimpleCalculatorHero
        eyebrowIcon="⏰"
        eyebrowText="Time Clock Calculator"
        title="How Many Hours Did You Work This Week?"
        description="Enter your clock-in, clock-out, break time, and days worked to instantly see your daily hours, weekly total, and any overtime hours above 40."
        chips={["Daily hours shown", "Overtime tracked", "Break time deducted"]}
      >
        <CalculatorEngineLoader slug="time-clock-calculator" />
      </SimpleCalculatorHero>
      <InsightStrip text="Overtime kicks in at <span class='font-semibold text-gray-900'>40 hours</span> per week under FLSA — and must be paid at 1.5× your regular rate." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="Time tracking that protects your pay" cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the Time Clock Calculator Works"
        formula="Daily Hours = (Clock-Out − Clock-In) − Break Hours\nWeekly Hours = Daily Hours × Days Worked\nOvertime = max(0, Weekly Hours − 40)"
        paragraphs={[
          "Clock-in and clock-out times are entered as 24-hour decimal values (e.g. 9.0 for 9:00 AM, 17.5 for 5:30 PM). The difference minus unpaid break time gives net daily hours.",
          "Weekly hours are multiplied by days worked. Any total above 40 hours per week is classified as overtime under the FLSA federal standard.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
