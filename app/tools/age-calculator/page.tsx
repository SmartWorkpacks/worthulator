import type { Metadata } from "next";
import AgeCalculatorLoader from "./AgeCalculatorLoader";
import SimpleCalculatorHero from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import StandardFAQSection from "@/src/templates/take-home-pay/StandardFAQSection";
import {
  StatChipsRow, ContentCardGrid, SEOTextBlock, InsightStrip, RelatedCalcCards,
} from "@/src/templates/take-home-pay/StandardSEOSection";
import { calculateAge, US_LIFE_EXPECTANCY_YEARS, DAYS_PER_YEAR } from "@/lib/calculators/ageEngine";

export const metadata: Metadata = {
  title: "Age Calculator 2026 – Exact Age in Years, Months, Days & Next Birthday",
  description:
    "Work out your exact age in years, months and days — plus total days, weeks and hours lived, your next-birthday countdown, and round-number milestones like your billion-second birthday.",
  keywords: ["age calculator", "how old am I", "exact age calculator", "age in days", "birthday calculator", "chronological age calculator"],
  alternates: { canonical: "https://worthulator.com/tools/age-calculator" },
  robots: { index: true, follow: true },
};

/* Worked example — computed at render from the engine (Step 5b: never hardcode).
   Fixed dates keep the copy deterministic: born June 15, 1990 · as of Jan 1, 2026. */
const EX = calculateAge({ birthDateISO: "1990-06-15", asOfDateISO: "2026-01-01" });
const nf = (n: number) => Math.round(n).toLocaleString("en-US");
const TEN_K_DAYS_YEARS = (10_000 / DAYS_PER_YEAR).toFixed(1); // ≈ 27.4 — derived, not sourced

const FAQS = [
  {
    q: "How is my exact age calculated?",
    a: `The calculator takes the calendar difference between your birth date and today, borrowing days from the month before today's date when needed (the standard civil convention). Worked example: someone born June 15, 1990 was, on January 1, 2026, exactly ${EX.years} years, ${EX.months} months and ${EX.days} days old — ${nf(EX.daysLived)} days in total.`,
  },
  {
    q: "How do I work out my age in days?",
    a: `Count the whole days between the two dates. To make this timezone- and DST-proof, the calculator anchors both dates at noon UTC, so the count is always an exact whole number. In the worked example above, ${nf(EX.daysLived)} days breaks down as ${nf(EX.weeksLived)} weeks plus ${EX.weekRemainderDays} days, or ${nf(EX.hoursLived)} hours (days × 24).`,
  },
  {
    q: "What happens if I was born on February 29?",
    a: "You still age like everyone else — you just only see your true calendar birthday in leap years. This calculator follows the most common convention and places your celebrated birthday on February 28 in common years, while the exact years/months/days figure stays mathematically pure. Both are shown, and neither is wrong.",
  },
  {
    q: "Why do different age calculators give slightly different answers?",
    a: "Three choices cause the drift: how days are borrowed across months of different lengths (28–31 days), whether the tool counts the end date inclusively, and whether it handles timezones properly (a calculator using local midnight can be a day off around DST changes). This tool uses the civil borrowing convention, excludes the end date, and anchors at noon UTC.",
  },
  {
    q: "What is a billion-second birthday?",
    a: `It's the moment exactly 1,000,000,000 seconds have passed since you were born — a milestone everyone crosses at about ${EX.billionSeconds.ageAtCrossYears} years old (1 billion ÷ 31,556,952 seconds per average year). The calculator shows your exact date, whether it's ahead of you or already behind you.`,
  },
];

const STATS = [
  { stat: `${US_LIFE_EXPECTANCY_YEARS.toFixed(1)} yrs`, color: "text-violet-600", accent: "bg-violet-500", label: "US life expectancy at birth, 2024 data — CDC/NCHS Data Brief No. 548. A population average, not a prediction." },
  { stat: "366 days", color: "text-blue-600", accent: "bg-blue-500", label: "Length of a leap year — Feb 29 exists because the solar year runs ≈365.2425 days, not 365." },
  { stat: `~${EX.billionSeconds.ageAtCrossYears} yrs`, color: "text-amber-600", accent: "bg-amber-500", label: "The age everyone crosses 1 billion seconds alive — derived: 1,000,000,000 ÷ (365.2425 × 86,400)." },
];

const CONTENT_CARDS = [
  {
    icon: "📅",
    title: "Why “months old” is the slippery unit",
    body: "Days and years are fixed-ish; months run 28 to 31 days. When the day-of-month hasn't arrived yet, the calculator borrows the length of the month before today — the standard civil convention used by registries and, for example, pension administrators. That borrowing choice is why two tools can disagree by a day.",
  },
  {
    icon: "🗓️",
    title: "Leap-day birthdays, handled honestly",
    body: "Born February 29? Your true birthday only exists in leap years. This tool celebrates you on February 28 in common years — while keeping the pure calendar age separate. On February 28 of a common year, a leap-day baby born in 2000 is both “24 years, 11 months, 30 days old” and “turning 25 today.” Both are true.",
  },
  {
    icon: "💯",
    title: "Round-number milestones are closer than you think",
    body: `Birthdays come once a year, but day-count milestones arrive every 2.7 years: 10,000 days lands at about ${TEN_K_DAYS_YEARS} years old, 20,000 days in your mid-fifties. The calculator pinpoints your next 1,000-day mark and your billion-second moment to the exact date.`,
  },
];

const RELATED_CALCS = [
  {
    title: "Time Between Dates Calculator",
    description: "Days, weeks, months, and years between any two dates.",
    href: "/tools/time-between-dates-calculator",
    icon: "📆",
    accent: "bg-violet-500/10",
  },
  {
    title: "Biological Age Calculator",
    description: "How lifestyle shifts your body's age vs the calendar.",
    href: "/tools/biological-age-calculator",
    icon: "🧬",
    accent: "bg-emerald-500/10",
  },
  {
    title: "Time to Retirement Calculator",
    description: "Count down the years, months, and paychecks to retirement.",
    href: "/tools/time-to-retirement-calculator",
    icon: "🏖️",
    accent: "bg-blue-500/10",
  },
  {
    title: "Compound Interest Calculator",
    description: "What the years you just counted can do for your money.",
    href: "/tools/compound-interest-calculator",
    icon: "📈",
    accent: "bg-amber-500/10",
  },
];

export default function AgeCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Age Calculator",
      applicationCategory: "UtilityApplication",
      operatingSystem: "Web",
      description: "Calculate your exact age in years, months, and days — plus total days, weeks, and hours lived, next-birthday countdown, and day-count milestones.",
      url: "https://worthulator.com/tools/age-calculator",
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
        eyebrowIcon="🎂"
        eyebrowText="Date & Time · Birthdays · Milestones"
        title="Age Calculator"
        description="Your age, exactly — years, months and days, every day and hour counted, your next birthday's weekday, and the round-number milestones nobody tells you about."
        chips={["Exact years · months · days", "Next-birthday countdown", "Day-count milestones"]}
      >
        <AgeCalculatorLoader />
      </SimpleCalculatorHero>

      <InsightStrip
        text='A year is the bluntest unit you can measure a life in — <span class="font-semibold text-gray-900">the day counts and milestones</span> are where your age gets interesting.'
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="The calendar is messier than it looks"
        subtitle="Exact age is a set of conventions — here are the ones this calculator uses, openly."
        cards={CONTENT_CARDS}
      />

      <SEOTextBlock
        title="How the Age Calculator Works"
        formula={`Years · Months · Days = calendar difference
  (borrow days from the month before the as-of date, then borrow 12 months)

Total Days = whole days between birth date and as-of date (both anchored at noon UTC)
Weeks = Total Days ÷ 7 (+ remainder) · Hours = Total Days × 24 · Seconds = Total Days × 86,400

Next Birthday = first occurrence of your birth month + day on/after the as-of date
  (Feb 29 births → celebrated Feb 28 in common years)

1 Billion Seconds = birth date + 1,000,000,000 s (everyone crosses it at ≈ ${EX.billionSeconds.ageAtCrossYears} yrs)
Lifespan Share = decimal age ÷ ${US_LIFE_EXPECTANCY_YEARS.toFixed(1)} yrs (US life expectancy at birth — CDC/NCHS, 2024 data)`}
        steps={[
          { label: "Enter your birth date", description: "That's all the calculator needs — results appear instantly with totals and milestones." },
          { label: "Optionally set the as-of date", description: "Defaults to today. Pick any other date to see your exact age on a wedding day, anniversary, or deadline." },
          { label: "Read your exact age and milestones", description: "Years/months/days, total day and hour counts, next-birthday weekday, your next 1,000-day mark, and your billion-second date." },
        ]}
        paragraphs={[
          "Exact age looks trivial until you meet the calendar: months run 28 to 31 days, leap years insert a day, and timezones can shave one off. This calculator pins every convention down — civil day-borrowing, noon-UTC day counts, and the February 28 rule for leap-day birthdays — so the same inputs always produce the same, defensible answer.",
          "The milestone projection is the part worth bookmarking: it shows the exact dates you cross your next 1,000-day mark and your billion-second moment, plus which weekday each of your next ten birthdays lands on — useful for planning the party years ahead.",
        ]}
      />

      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      <RelatedCalcCards
        title="Related Calculators"
        subtitle="More tools for time, dates, and what to do with the years."
        items={RELATED_CALCS}
      />
    </main>
  );
}
