import type { Metadata } from "next";
import ScreenTimeWithInsights from "@/components/worthcore/ScreenTimeWithInsights";
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
  calculateScreenTime,
  US_AVG_SCREEN_HRS,
} from "@/calculations/lifestyle/screenTime";
import {
  getUSStateMedianWage,
  usStateMedianWageDataset,
} from "@/lib/datasets/regional/usStateMedianWages";

export const metadata: Metadata = {
  title:
    "Screen Time Impact Calculator 2026 – Annual Cost at Your State's Median Wage",
  description:
    "Select your state and see the true opportunity cost of daily screen time — calculated using BLS median hourly wages. Annual cost, weekly hours, lifetime days consumed, and 10-year investment projection.",
  keywords: [
    "screen time calculator",
    "screen time cost",
    "screen time impact",
    "opportunity cost of phone",
    "social media time cost",
    "screen time by state",
  ],
  alternates: {
    canonical: "https://worthulator.com/tools/screen-time-impact",
  },
  robots: { index: true, follow: true },
};

/* ── Step 5c: derive every number in the copy from the live wage dataset ─────
   so FAQ / stat chips / SEO auto-refresh whenever BLS OEWS data updates. ───── */
const NATIONAL_WAGE = usStateMedianWageDataset.national;
const AS_OF = usStateMedianWageDataset.currentPeriodLabel;
const usd0 = (n: number) => `$${Math.round(n).toLocaleString()}`;

const sample = (state: string, hours = 4) =>
  calculateScreenTime(
    { hoursPerDay: hours, yearsAhead: 10, state },
    { medianWage: getUSStateMedianWage(state) },
  );

const EX = sample("National");                       // 4hr/day, national wage
const AVG = sample("National", US_AVG_SCREEN_HRS);   // the US-average person
const CA = sample("California");
const MS = sample("Mississippi");
const MA_WAGE = getUSStateMedianWage("Massachusetts");
const MS_WAGE = getUSStateMedianWage("Mississippi");
const CA_WAGE = getUSStateMedianWage("California");
const AR = sample("Arkansas");
const AR_WAGE = getUSStateMedianWage("Arkansas");

const FAQS = [
  {
    q: "How is the opportunity cost calculated?",
    a: `Opportunity cost = hours/day × 365 days × your state's median hourly wage. At the national median of $${NATIONAL_WAGE.toFixed(2)}/hr, 4 hours/day costs ${usd0(EX.annualCost)}/year. This isn't money you 'lose' — it's the value of what you could earn or produce with that time instead. Select your state for a locally accurate figure.`,
  },
  {
    q: "Why does it use my state's median wage?",
    a: `Wages vary dramatically: Massachusetts pays a median $${MA_WAGE.toFixed(2)}/hr vs Mississippi at $${MS_WAGE.toFixed(2)}/hr. Using your state's BLS median wage (${AS_OF}) makes the opportunity cost locally realistic. A Californian's 4 hours of screen time costs ${usd0(CA.annualCost)}/year; in Mississippi, the same 4 hours costs ${usd0(MS.annualCost)}/year.`,
  },
  {
    q: "What counts as non-work screen time?",
    a: "Social media, streaming, gaming, casual browsing, messaging — any screen use that isn't directly productive work. Work video calls, coding, spreadsheets, and professional tasks don't count. The goal is to measure passive consumption time that could be redirected.",
  },
  {
    q: "How much screen time is average in the US?",
    a: `The average American spends about ${US_AVG_SCREEN_HRS} hours/day on non-work screens (Nielsen 2024). That's ${Math.round(US_AVG_SCREEN_HRS * 365).toLocaleString()} hours/year — ${AVG.daysPerYear} full days. At the national median wage, that's ${usd0(AVG.annualCost)}/year in opportunity cost for the average person.`,
  },
  {
    q: "What would cutting 1 hour per day actually gain me?",
    a: `At the national median of $${NATIONAL_WAGE.toFixed(2)}/hr, cutting 1 hour/day reclaims ${usd0(EX.oneHourAnnualSaving)}/year in opportunity value — 365 hours, or 15.2 full days. Invested at 7% for 10 years, that's ${usd0(EX.oneHourInvested10yr)}. Most people who start tracking screen time reduce it by 1-2 hours within the first week.`,
  },
  {
    q: "Does reducing screen time improve productivity?",
    a: "Yes. A 2018 Journal of Social and Clinical Psychology study found that limiting social media to 30 minutes/day significantly reduced anxiety and depression within 3 weeks. Reduced screen time consistently correlates with better sleep quality (blue light suppresses melatonin for up to 3 hours), which directly improves next-day productivity by 20-30%.",
  },
];

const STATS = [
  {
    stat: usd0(EX.annualCost),
    color: "text-emerald-600",
    accent: "bg-emerald-500",
    label: `Annual opportunity cost of 4hr/day at the national median wage ($${NATIONAL_WAGE.toFixed(2)}/hr)`,
  },
  {
    stat: `${EX.daysPerYear}`,
    color: "text-blue-600",
    accent: "bg-blue-500",
    label:
      "Full days per year consumed by 4 hours of daily screen time",
  },
  {
    stat: usd0(EX.oneHourAnnualSaving),
    color: "text-amber-600",
    accent: "bg-amber-500",
    label: "Annual value of cutting just 1 hour/day at the national median wage",
  },
];

const CONTENT_CARDS = [
  {
    icon: "📱",
    title: "Your state's wage changes the equation",
    body: `A Californian (median $${CA_WAGE.toFixed(2)}/hr) watching 4hr/day 'loses' ${usd0(CA.annualCost)}/year. An Arkansan ($${AR_WAGE.toFixed(2)}/hr) loses ${usd0(AR.annualCost)}. The same habit costs far more in a high-wage state. This calculator uses BLS OEWS data (${AS_OF}) so the number reflects your local economic reality.`,
  },
  {
    icon: "🧠",
    title: "365 hours per year per hour cut",
    body: `Cutting screen time by 1 hour/day frees 365 hours/year — enough to earn a certification, write a book, get seriously fit, or work a part-time side hustle. At $${NATIONAL_WAGE.toFixed(2)}/hr that's ${usd0(EX.oneHourAnnualSaving)}/year in reclaimed value, or ${usd0(EX.oneHourInvested10yr)} invested over a decade.`,
  },
  {
    icon: "😴",
    title: "Screen time destroys sleep — which destroys the next day",
    body: "Blue light suppresses melatonin for up to 3 hours after use. People who use devices 2+ hours before bed take 30% longer to fall asleep and report significantly lower sleep quality. Poor sleep reduces next-day productivity by 20-30%, amplifying the total cost.",
  },
];

const RELATED_CALCS = [
  {
    title: "Meeting Cost Calculator",
    description: "See the dollar cost of time spent in meetings.",
    href: "/tools/meeting-cost-calculator",
    icon: "📅",
    accent: "bg-emerald-500/10",
  },
  {
    title: "Procrastination Cost Calculator",
    description: "Calculate the real cost of putting things off.",
    href: "/tools/procrastination-cost",
    icon: "⏰",
    accent: "bg-blue-500/10",
  },
  {
    title: "Quit Smoking Calculator",
    description: "See money saved and life regained since quitting.",
    href: "/tools/quit-smoking-calculator",
    icon: "🚭",
    accent: "bg-amber-500/10",
  },
  {
    title: "Salary to Hourly Calculator",
    description: "Find your true hourly rate from annual salary.",
    href: "/tools/salary-to-hourly-calculator",
    icon: "🕐",
    accent: "bg-purple-500/10",
  },
];

export default function ScreenTimeImpactPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Screen Time Impact Calculator",
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Web",
      description:
        "Calculate the true annual opportunity cost of screen time using your state's BLS median hourly wage.",
      url: "https://worthulator.com/tools/screen-time-impact",
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
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <SimpleCalculatorHero
        eyebrowIcon="📱"
        eyebrowText="Live Data · State Wage"
        title="Screen Time Impact Calculator"
        description="Select your state to see the real opportunity cost of daily screen time — calculated using BLS median hourly wages. See your annual cost, weekly hours consumed, and what cutting back would be worth invested."
        chips={[
          "Live state wage",
          "Annual opportunity cost",
          "1-hour reduction value",
          "10-year investment",
        ]}
      >
        <ScreenTimeWithInsights />
      </SimpleCalculatorHero>
      <InsightStrip
        text={`4 hours of screen time per day at the national median wage is <span class="font-semibold text-gray-900">${usd0(EX.annualCost)}/year — ${EX.daysPerYear} full days — consumed by passive scrolling.</span>`}
      />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid
        title="What your screen time is really costing you"
        subtitle="Time, money, and productivity — measured at your state's real wage."
        cards={CONTENT_CARDS}
      />
      <SEOTextBlock
        title="How the Screen Time Impact Calculator Works"
        formula={`Annual Cost ($)          = Hours/Day × 365 × State Median Wage
Weekly Hours             = Hours/Day × 7
Days Consumed            = (Hours/Day × 365 × Years) ÷ 24
1-Hour Saving/Year       = State Median Wage × 365
Excess Daily Hours       = max(0, Your Hours − 4.37 US avg)`}
        steps={[
          {
            label: "Select your state",
            description: `Loads your state's BLS median hourly wage (e.g. California $${CA_WAGE.toFixed(2)}/hr, Mississippi $${MS_WAGE.toFixed(2)}/hr) as the opportunity cost rate.`,
          },
          {
            label: "Enter your daily non-work screen time",
            description: `Hours per day on social media, streaming, gaming — not work. US average is ${US_AVG_SCREEN_HRS} hours/day (Nielsen 2024).`,
          },
          {
            label: "Set your projection period",
            description:
              "1-40 years. At 10 years you see the decade-scale impact; at 30 you see the lifetime scale.",
          },
        ]}
        paragraphs={[
          "This calculator uses BLS Occupational Employment and Wage Statistics (OEWS) to determine the median hourly wage in your state. Screen time hours are multiplied by that wage to compute the annual opportunity cost — the value of what you could earn or produce with that time.",
          `At the US national median of $${NATIONAL_WAGE.toFixed(2)}/hr, 4 hours/day of non-work screen time represents ${usd0(EX.annualCost)}/year. Cutting just 1 hour saves ${usd0(EX.oneHourAnnualSaving)}/year — invested at 7% for 10 years, that compounds to ${usd0(EX.oneHourInvested10yr)}. The calculator shows benchmark comparisons, investment projections, and what your above-average hours cost.`,
        ]}
      />
      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />
      <RelatedCalcCards
        title="Related Calculators"
        subtitle="More tools for understanding where your time and money go."
        items={RELATED_CALCS}
      />
    </main>
  );
}
