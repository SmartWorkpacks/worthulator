import type { Metadata } from "next";
import StreamingTimeWithInsights from "@/components/worthcore/StreamingTimeWithInsights";
import SimpleCalculatorHero from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import StandardFAQSection from "@/src/templates/take-home-pay/StandardFAQSection";
import {
  StatChipsRow,
  ContentCardGrid,
  SEOTextBlock,
  InsightStrip,
  RelatedCalcCards,
} from "@/src/templates/take-home-pay/StandardSEOSection";
import {
  calculateStreamingTime,
  US_AVG_STREAM_HRS,
} from "@/calculations/lifestyle/streamingTime";
import {
  getUSStateMedianWage,
  usStateMedianWageDataset,
} from "@/lib/datasets/regional/usStateMedianWages";

/* ── Step 5c: one source of truth — derive every number in the copy from the
   live BLS median wage + the calc module, so FAQ / stats / SEO / JSON-LD all
   auto-refresh when the wage dataset updates. ──────────────────────────────── */
const NATIONAL_WAGE = getUSStateMedianWage("National");
const AS_OF = usStateMedianWageDataset.currentPeriodLabel;
const usd0 = (n: number) => `$${Math.round(n).toLocaleString()}`;
/* Default page scenario: 3 hrs/day, $50/mo of services, 10-year horizon. */
const EX = calculateStreamingTime(
  { hoursPerDay: 3, yearsAhead: 10, monthlySubCost: 50 },
  { medianWage: NATIONAL_WAGE },
);
/* US-average viewer (3.1 hrs/day) for the "average person" framing. */
const AVG = calculateStreamingTime(
  { hoursPerDay: US_AVG_STREAM_HRS, yearsAhead: 40, monthlySubCost: 50 },
  { medianWage: NATIONAL_WAGE },
);
const AVG_YEARLY_HOURS = AVG.yearlyHours;
const AVG_DAYS_PER_YEAR = Math.round(AVG.daysPerYear);
const AVG_LIFETIME_YEARS = Math.round((AVG.lifetimeDays / 365) * 10) / 10;
/* Years to accumulate 10,000 hours at the US average. */
const HOURS_TO_EXPERT = 10000;
const YEARS_TO_EXPERT = Math.round((HOURS_TO_EXPERT / AVG_YEARLY_HOURS) * 10) / 10;

export const metadata: Metadata = {
  title: "Streaming Time Calculator 2026 – Years of Life & True Cost",
  description:
    "See what your streaming habit really costs: days of life consumed, the opportunity cost at your state's live median wage, and total subscription spend — with a cost-per-hour value read.",
  keywords: ["streaming time calculator", "netflix time calculator", "how much time spent streaming", "streaming cost calculator", "binge watching calculator"],
  alternates: { canonical: "https://worthulator.com/tools/streaming-time-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "How much time does the average person spend streaming?",
    a: `US viewers average about ${US_AVG_STREAM_HRS} hours/day on dedicated streaming (Nielsen's The Gauge). Over a year that's roughly ${AVG_YEARLY_HOURS.toLocaleString()} hours — about ${AVG_DAYS_PER_YEAR} full 24-hour days. Across a 40-year adult life that compounds to around ${AVG_LIFETIME_YEARS} years spent watching.`,
  },
  {
    q: "What is the opportunity cost of streaming?",
    a: `Every hour spent streaming is an hour not spent earning, building, or resting actively. Valued at the US median wage of ${usd0(NATIONAL_WAGE)}/hr (${AS_OF}), 3 hours/day works out to about ${usd0(EX.annualCost)}/year in opportunity cost. Pick your state and the calculator uses your local median wage instead.`,
  },
  {
    q: "How much do streaming subscriptions cost per year?",
    a: `A typical stack (a couple of the big services at standard tiers) runs about $50/month — ${usd0(EX.annualSubCost)}/year, or ${usd0(EX.subTotalCost)} over 10 years. The calculator also shows your cost per hour actually watched: at 3 hrs/day that's about $${EX.costPerHourWatched.toFixed(2)}/hour, which rises fast if you watch less than you pay for.`,
  },
  {
    q: "How is the 'cost per hour watched' useful?",
    a: "It exposes services you pay for but barely use. Heavy viewers get genuine value per hour from their subscriptions — the real cost is their time. Light viewers paying for several services are often paying several dollars per hour watched, which is the signal to trim.",
  },
  {
    q: "What could I do with all that time?",
    a: `${AVG_YEARLY_HOURS.toLocaleString()} hours a year is enough to reach conversational fluency in a language (~600 hrs), earn a private pilot's licence (~250 hrs minimum), or read dozens of books. At the US average, you'd hit ${HOURS_TO_EXPERT.toLocaleString()} hours — the popular "expertise" threshold — in about ${YEARS_TO_EXPERT} years.`,
  },
  {
    q: "How do I find out how much I've actually watched?",
    a: "On Netflix: Account → Profile → Viewing Activity shows every title. Most services have a similar history page. Add up a typical week and divide by 7 for your daily average, then enter it above.",
  },
];

const STATS = [
  { stat: `${US_AVG_STREAM_HRS} hrs`,  color: "text-rose-600",    accent: "bg-rose-500",    label: "average daily US streaming time (Nielsen The Gauge)" },
  { stat: `${AVG_LIFETIME_YEARS} yrs`, color: "text-amber-600",   accent: "bg-amber-500",   label: "of life spent streaming at the average rate over a 40-year adult life" },
  { stat: usd0(EX.annualCost),         color: "text-emerald-600", accent: "bg-emerald-500", label: `yearly opportunity cost of 3 hrs/day at the ${usd0(NATIONAL_WAGE)}/hr US median wage` },
];

const CONTENT_CARDS = [
  { icon: "⏱️", title: "The opportunity cost", body: `Roughly ${HOURS_TO_EXPERT.toLocaleString()} hours of deliberate practice is the popular threshold for mastering a skill. At the US-average streaming rate, you pass that mark in about ${YEARS_TO_EXPERT} years — enough to become genuinely good at almost anything.` },
  { icon: "🏃", title: "Passive vs active leisure", body: "Research consistently shows active leisure (exercise, hobbies, social time, creative work) produces more lasting satisfaction than passive consumption. The calculator values the time so the trade-off is concrete, not abstract." },
  { icon: "📺", title: "Autoplay is designed for this", body: "Streaming services autoplay the next episode within seconds and lean on cliffhangers and variable rewards to keep you watching. Passive consumption is the default; choosing to stop is the deliberate act." },
];

const RELATED_CALCS = [
  { icon: "📱", accent: "bg-rose-500/10",    title: "Screen Time Impact",        description: "The full opportunity cost of all your screen time.", href: "/tools/screen-time-impact" },
  { icon: "📲", accent: "bg-amber-500/10",   title: "Social Media Time",         description: "Same math, different screens.",                     href: "/tools/social-media-time-calculator" },
  { icon: "💸", accent: "bg-blue-500/10",    title: "Subscription Auditor",      description: "Find the recurring spend you've forgotten about.",   href: "/tools/subscription-auditor" },
  { icon: "📅", accent: "bg-purple-500/10",  title: "Life in Weeks",             description: "Visualise all your remaining weeks.",                href: "/tools/life-in-weeks-calculator" },
];

export default function StreamingTimeCalculator() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Streaming Time Calculator",
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Web",
      description: "Calculate the days of life, opportunity cost at the live state median wage, and total subscription spend of a streaming habit.",
      url: "https://worthulator.com/tools/streaming-time-calculator",
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
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      <SimpleCalculatorHero
        eyebrowIcon="📺"
        eyebrowText="Streaming · Time & Money"
        title="Streaming Time Calculator"
        description="How much of your life and money goes to streaming? Get the days consumed, the opportunity cost at your state's live median wage, and your total subscription spend."
        chips={["Days of life consumed", "Opportunity cost at live wage", "Subscription spend + value read"]}
      >
        <StreamingTimeWithInsights />
      </SimpleCalculatorHero>

      <InsightStrip text={`At ${US_AVG_STREAM_HRS} hours/day you'll spend about ${AVG_LIFETIME_YEARS} years streaming over a 40-year adult life — and 3 hrs/day costs roughly ${usd0(EX.annualCost)}/year in time value plus ${usd0(EX.annualSubCost)} in subscriptions.`} />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid title="What your streaming habit actually costs you" cards={CONTENT_CARDS} />

      <SEOTextBlock
        title="How streaming time is calculated"
        formula={`Yearly Hours      = Daily Hours × 365
Days/Year         = Yearly Hours ÷ 24
Opportunity Cost  = Daily Hours × 365 × Median Wage
Subscription/Year = Monthly Cost × 12
Cost per Hour     = Subscription/Year ÷ Yearly Hours
Lifetime Days     = Daily Hours × 365 × Years ÷ 24

Worked example — 3 hrs/day, $50/mo, live ${usd0(NATIONAL_WAGE)}/hr, 10 years:
Time value = ${usd0(EX.annualCost)}/yr · ${AVG_DAYS_PER_YEAR} days/yr
Subscriptions = ${usd0(EX.annualSubCost)}/yr (${usd0(EX.subTotalCost)} over 10 yr)
Cost per hour watched = $${EX.costPerHourWatched.toFixed(2)}`}
        paragraphs={[
          `This calculator does what most "hours on Netflix" tools skip: it values the time. Opportunity cost = daily hours × 365 × your state's live BLS median wage (${usd0(NATIONAL_WAGE)}/hr nationally, ${AS_OF}), so the dollar figure reflects where you actually live. You can enter your own hourly rate to make it exact.`,
          `It also separates the two costs that get conflated — the hard subscription spend (${usd0(EX.annualSubCost)}/year at $50/month) and the value of the time itself (${usd0(EX.annualCost)}/year at 3 hrs/day). The cost-per-hour-watched figure ($${EX.costPerHourWatched.toFixed(2)}/hour in the example) is the quiet tell: the less you watch, the more each hour of subscription costs, which is exactly where unused services hide.`,
        ]}
      />

      <StandardFAQSection faqs={FAQS} />

      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
