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
  title: "Commute Time Value Calculator 2026 – The Hidden Cost of Your Commute",
  description:
    "Calculate how much of your salary your commute silently steals. See annual hours lost, money equivalent, and your true effective hourly rate once commute time is included.",
  keywords: [
    "commute time value calculator",
    "cost of commute in time",
    "effective hourly rate commute",
    "how much does commuting cost",
    "commute salary loss calculator",
  ],
  alternates: { canonical: "https://worthulator.com/tools/commute-time-value" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "How does my commute reduce my effective hourly rate?",
    a: "Your employer pays you for 2,080 hours per year, but your commute adds unpaid hours on top. If you commute 45 minutes each way and work 235 days, that's 352 extra unpaid hours annually. Your effective rate = (annual salary) ÷ (2,080 + commute hours). For a $35/hr worker, a 45-min commute drops the effective rate to around $29/hr.",
  },
  {
    q: "What percentage of salary does the average commute consume?",
    a: "For a 45-minute daily commute at the US median wage, roughly 8–12% of gross salary value is lost to unpaid commuting time. For lower-wage workers with long commutes this can exceed 20%, effectively pricing them out of certain job markets.",
  },
  {
    q: "Should I include commute time when comparing job offers?",
    a: "Absolutely. A job paying $5,000 more but requiring an extra 30 minutes each way (235 work days) adds 188 hours of unpaid time annually. At $30/hr that's $5,640 in time value — meaning the higher-paying job actually pays less once commute is factored in.",
  },
  {
    q: "How do you calculate the dollar value of commute time?",
    a: "Annual commute hours × hourly wage = value of time lost. The logic: you could be doing something productive with that time. Even at half your work rate, the cost is substantial. Most people dramatically underestimate it until they see it calculated.",
  },
  {
    q: "Does working from home solve the commute cost problem?",
    a: "Fully remote eliminates commute time cost entirely — effectively giving you a raise equal to your commute's time value. One remote day per week reduces the annual cost by 20%. This is why remote work offers with lower stated salaries often have higher real compensation than office roles.",
  },
];

const STATS = [
  { stat: "352hr",  color: "text-emerald-600", accent: "bg-emerald-500", label: "Annual hours lost to a 45-min daily commute over 235 work days" },
  { stat: "10–15%", color: "text-blue-600",    accent: "bg-blue-500",    label: "Of gross salary value silently consumed by a typical US commute" },
  { stat: "$10k+",  color: "text-amber-600",   accent: "bg-amber-500",   label: "Annual time value lost by a $50k/yr worker with a 1-hour daily commute" },
];

const CONTENT_CARDS = [
  {
    icon: "💼",
    title: "Your real salary is lower than you think",
    body: "Your employer pays for 8 hours per day. But if you add a 1-hour commute, you're actually giving 9 hours of your day to that job. Your true hourly rate is your salary divided by all hours given — including transit. For many workers, this is a 10–15% effective pay cut hiding in plain sight.",
  },
  {
    icon: "🔄",
    title: "Use it to negotiate or choose offers",
    body: "When comparing two job offers, calculate the effective hourly rate for both including commute. A downtown job paying $75k with a 60-min commute can easily pay less per real hour than a suburban job at $68k with a 15-min commute — especially when childcare, fuel, and parking are added.",
  },
  {
    icon: "🏡",
    title: "The rent vs commute trade-off",
    body: "Paying $400/month more in rent to halve your commute sounds expensive. But if halving your commute saves $6,000/year in time value, that's a $1,200/year net gain — plus the reclaimed mental bandwidth and reduced stress. The maths of proximity usually favours paying more to live closer.",
  },
];

const RELATED_CALCS = [
  { title: "Commute Cost Calculator",      description: "Calculate your annual fuel cost to drive to work.",       href: "/tools/commute-cost-calculator",      icon: "⛽", accent: "bg-emerald-500/10" },
  { title: "Salary to Hourly Calculator",  description: "Break any annual salary down to an hourly rate.",         href: "/tools/salary-to-hourly-calculator",   icon: "🕐", accent: "bg-blue-500/10" },
  { title: "Pay Raise Calculator",         description: "See how a raise changes your salary and hourly rate.",     href: "/tools/pay-raise-calculator",          icon: "📈", accent: "bg-amber-500/10" },
  { title: "Meeting Cost Calculator",      description: "Calculate the dollar cost of any meeting.",                href: "/tools/meeting-cost-calculator",       icon: "📅", accent: "bg-purple-500/10" },
];

export default function CommuteTimeValuePage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Commute Time Value Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description:
        "Calculate the real salary cost of your commute — annual hours lost, money equivalent, and true effective hourly rate.",
      url: "https://worthulator.com/tools/commute-time-value",
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
        eyebrowIcon="🚇"
        eyebrowText="Transport · Time"
        title="Commute Time Value Calculator"
        description="Find out how many hours and dollars your commute quietly steals from your salary each year — and what your real effective hourly rate is once travel time is included."
        chips={["Hours lost per year", "Salary % consumed", "True effective hourly rate"]}
      >
        <EngineWithInsights slug="commute-time-value" />
      </SimpleCalculatorHero>
      <InsightStrip text='Your commute isn&apos;t free time — <span class="font-semibold text-gray-900">every unpaid hour in transit is a reduction in your real hourly rate, hiding in plain sight.</span>' />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid
        title="The commute tax nobody talks about"
        subtitle="How unpaid transit time silently reduces your effective compensation."
        cards={CONTENT_CARDS}
      />
      <SEOTextBlock
        title="How the Commute Time Value Calculator Works"
        formula={`Annual Commute Hours   = (Daily Mins ÷ 60) × Work Days
Annual Time Cost ($)   = Annual Hours × Hourly Wage
Salary Lost %          = (Time Cost ÷ Annual Salary) × 100
Effective Hourly Rate  = Annual Salary ÷ (2,080 + Commute Hours)`}
        steps={[
          {
            label: "Enter your daily commute time",
            description: "Total door-to-door time both ways. Include waiting, transfers, and walking.",
          },
          {
            label: "Enter your hourly wage",
            description: "Divide your annual salary by 2,080 for a standard 40hr/week rate.",
          },
          {
            label: "Set your work days per year",
            description: "Standard is 235 (52 weeks × 5 days minus ~15 holidays). Adjust for hybrid schedules.",
          },
          {
            label: "Read all four outputs",
            description:
              "Annual hours lost, dollar value of that time, percentage of salary consumed, and your true effective hourly rate.",
          },
        ]}
        paragraphs={[
          "The effective hourly rate is the most revealing number — it shows what you actually earn per hour of your day devoted to work, including getting there and back. It's the number you should use when comparing job offers.",
          "For hybrid workers: reduce work days proportionally. 3 days in office out of 5 means use 141 work days (235 × 0.6). Your commute cost drops by 40% instantly.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />
      <RelatedCalcCards
        title="Related Calculators"
        subtitle="More tools for understanding what work really costs you."
        items={RELATED_CALCS}
      />
    </main>
  );
}
