import type { Metadata } from "next";
import PhoneAddictionWithInsights from "@/components/worthcore/PhoneAddictionWithInsights";
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
  calculatePhoneAddiction,
  US_AVG_PHONE_HRS,
  US_AVG_PICKUPS,
  WAKING_HOURS,
} from "@/calculations/lifestyle/phoneAddiction";
import {
  getUSStateMedianWage,
  usStateMedianWageDataset,
} from "@/lib/datasets/regional/usStateMedianWages";

/* ── Step 5c: one source of truth — derive every number in the copy from the
   live BLS median wage + the calc module so FAQ / stats / SEO / JSON-LD all
   auto-refresh when the wage dataset updates. ──────────────────────────────── */
const NATIONAL_WAGE = getUSStateMedianWage("National");
const AS_OF = usStateMedianWageDataset.currentPeriodLabel;
const usd0 = (n: number) => `$${Math.round(n).toLocaleString()}`;
/* Default page scenario: US-average phone use, 86 pickups, 10-year horizon. */
const EX = calculatePhoneAddiction(
  { hoursPerDay: US_AVG_PHONE_HRS, pickupsPerDay: US_AVG_PICKUPS, yearsAhead: 10 },
  { medianWage: NATIONAL_WAGE },
);
/* 40-year life view for the "years of your life" framing. */
const LIFE = calculatePhoneAddiction(
  { hoursPerDay: US_AVG_PHONE_HRS, pickupsPerDay: US_AVG_PICKUPS, yearsAhead: 40 },
  { medianWage: NATIONAL_WAGE },
);
const LIFE_YEARS = Math.round((LIFE.lifetimeDays / 365) * 10) / 10;

export const metadata: Metadata = {
  title: "Phone Addiction Calculator 2026 – Your Screen Time in Years & Dollars",
  description:
    "See what your phone habit really costs: days of life, the share of your waking day, checking frequency, and the opportunity cost at your state's live median wage.",
  keywords: ["phone addiction calculator", "screen time calculator", "how much time on phone", "phone usage calculator", "screen time years calculator"],
  alternates: { canonical: "https://worthulator.com/tools/phone-addiction-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "How much time does the average person spend on their phone?",
    a: `US adults average about ${US_AVG_PHONE_HRS} hours/day of smartphone screen time (data.ai), with Gen Z closer to 6+ hours. At ${US_AVG_PHONE_HRS} hrs/day that's roughly ${EX.yearlyHours.toLocaleString()} hours — about ${Math.round(EX.daysPerYear)} full 24-hour days — every year, or around ${LIFE_YEARS} years across a 40-year adult life.`,
  },
  {
    q: "What is the opportunity cost of phone time?",
    a: `Every hour scrolling is an hour not earning, building, or resting actively. Valued at the US median wage of ${usd0(NATIONAL_WAGE)}/hr (${AS_OF}), ${US_AVG_PHONE_HRS} hrs/day works out to about ${usd0(EX.annualCost)}/year. Choose your state to use your local median wage, or enter your own rate.`,
  },
  {
    q: "Why does the calculator ask for pickups, not just hours?",
    a: `Because checking frequency, not raw hours, is what fragments attention. At ${US_AVG_PICKUPS} pickups/day that's about ${EX.pickupsPerYear.toLocaleString()} interruptions a year — one roughly every ${EX.minutesPerPickup.toFixed(1)} minutes of phone time. Each pickup carries a refocusing cost that an hours-only total misses.`,
  },
  {
    q: "How do I check my actual screen time?",
    a: "iPhone: Settings → Screen Time. Android: Settings → Digital Wellbeing. Both show daily/weekly breakdowns by app and your pickup count. Enter your real daily average and pickups above for an exact figure.",
  },
  {
    q: "What's the most effective way to reduce phone use?",
    a: "Greyscale mode (removes the colour dopamine trigger), app time-limits with a PIN someone else holds, phone-free zones (bedroom, dining table), a notification purge, and keeping the phone out of reach during focused work. Cutting even one hour a day is a large reclaim.",
  },
  {
    q: "Is all phone time bad?",
    a: "No — calls, maps, podcasts, voice messages, and productivity apps are genuinely useful. The cost accumulates in passive scroll time on social and video apps, which is usually where the excess hours and pickups live.",
  },
];

const STATS = [
  { stat: `${US_AVG_PHONE_HRS} hr`, color: "text-rose-600",    accent: "bg-rose-500",    label: "daily average US smartphone screen time (data.ai)" },
  { stat: `~${LIFE_YEARS} yr`,      color: "text-amber-600",   accent: "bg-amber-500",   label: "of life on a phone at the average rate over a 40-year adult life" },
  { stat: `${EX.wakingPct}%`,       color: "text-emerald-600", accent: "bg-emerald-500", label: `of a ${WAKING_HOURS}-hour waking day spent on the phone at the US average` },
];

const CONTENT_CARDS = [
  { icon: "📱", title: "The attention economy", body: "Every app on your phone employs teams of engineers and psychologists to maximise your time on it — your attention is the product sold to advertisers. Naming that makes usage more intentional." },
  { icon: "🔔", title: "Checking fragments focus", body: `It's not only the hours — it's the frequency. Checking ${US_AVG_PICKUPS}× a day fragments attention in a way that the same hours in one deliberate block doesn't. The calculator surfaces pickups for exactly this reason.` },
  { icon: "🪞", title: "Identity beats willpower", body: "Research shows 'I'm not a heavy phone user' (identity framing) changes behaviour more reliably than 'I'm trying to use my phone less' (willpower framing). Tie the change to who you are." },
];

const RELATED_CALCS = [
  { icon: "📺", accent: "bg-blue-500/10",    title: "Screen Time Impact",        description: "The full opportunity cost of all your screens.",  href: "/tools/screen-time-impact" },
  { icon: "🎬", accent: "bg-rose-500/10",    title: "Streaming Time Calculator", description: "Years and dollars spent streaming.",            href: "/tools/streaming-time-calculator" },
  { icon: "📲", accent: "bg-amber-500/10",   title: "Social Media Time",         description: "Where your social media time really goes.",     href: "/tools/social-media-time-calculator" },
  { icon: "📅", accent: "bg-purple-500/10",  title: "Life in Weeks",             description: "Visualise your remaining weeks.",                href: "/tools/life-in-weeks-calculator" },
];

export default function PhoneAddictionCalculator() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Phone Addiction Calculator",
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Web",
      description: "Calculate the days of life, share of your waking day, checking frequency, and opportunity cost (at the live state median wage) of a smartphone habit.",
      url: "https://worthulator.com/tools/phone-addiction-calculator",
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
        eyebrowIcon="📱"
        eyebrowText="Phone · Time & Money"
        title="Phone Addiction Calculator"
        description="How much of your life and money goes to your phone? Get the days consumed, the share of your waking day, your checking frequency, and the opportunity cost at your state's live median wage."
        chips={["Days of life consumed", "Share of your waking day", "Opportunity cost at live wage"]}
      >
        <PhoneAddictionWithInsights />
      </SimpleCalculatorHero>

      <InsightStrip text={`At the US-average ${US_AVG_PHONE_HRS} hours/day you'll spend about ${LIFE_YEARS} years on your phone over a 40-year adult life — ${EX.wakingPct}% of every waking day, worth roughly ${usd0(EX.annualCost)}/year in time.`} />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid title="What your phone habit is really costing you" cards={CONTENT_CARDS} />

      <SEOTextBlock
        title="How the phone time calculation works"
        formula={`Yearly Hours     = Daily Hours × 365
Days/Year        = Yearly Hours ÷ 24
Waking Share     = Daily Hours ÷ ${WAKING_HOURS} waking hours
Opportunity Cost = Daily Hours × 365 × Median Wage
Pickups/Year     = Pickups/Day × 365
Min per Pickup   = (Daily Hours × 60) ÷ Pickups/Day
Lifetime Days    = Daily Hours × 365 × Years ÷ 24

Worked example — ${US_AVG_PHONE_HRS} hrs/day, ${US_AVG_PICKUPS} pickups, live ${usd0(NATIONAL_WAGE)}/hr, 10 years:
Opportunity cost = ${usd0(EX.annualCost)}/yr · ${Math.round(EX.daysPerYear)} days/yr · ${EX.wakingPct}% of waking day
Pickups = ${EX.pickupsPerYear.toLocaleString()}/yr · one every ${EX.minutesPerPickup.toFixed(1)} min`}
        paragraphs={[
          `This calculator values the time rather than just totalling hours. Opportunity cost = daily hours × 365 × your state's live BLS median wage (${usd0(NATIONAL_WAGE)}/hr nationally, ${AS_OF}), so the dollar figure reflects where you actually live; enter your own rate to make it exact.`,
          `It also tracks two things hours-only tools miss: the share of your ${WAKING_HOURS}-hour waking day the phone consumes (${EX.wakingPct}% at the US average), and your checking frequency — ${US_AVG_PICKUPS} pickups/day is roughly ${EX.pickupsPerYear.toLocaleString()} interruptions a year, about one every ${EX.minutesPerPickup.toFixed(1)} minutes. Checking frequency is the strongest correlate of fragmented attention.`,
        ]}
      />

      <StandardFAQSection faqs={FAQS} />

      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
