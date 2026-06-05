import type { Metadata } from "next";
import ProcrastinationCostWithInsights from "@/components/worthcore/ProcrastinationCostWithInsights";
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
  title:
    "Procrastination Cost Calculator 2026 – Annual Cost at Your State's Median Wage",
  description:
    "Select your state and see how much procrastination costs per day, month, and year using BLS median hourly wages. Includes 10-year compound projection, marginal improvement framing, and workplace average comparison.",
  keywords: [
    "procrastination cost calculator",
    "cost of procrastination",
    "productivity calculator",
    "time wasting cost",
    "procrastination by state",
  ],
  alternates: {
    canonical: "https://worthulator.com/tools/procrastination-cost",
  },
  robots: { index: true, follow: true },
};

/* ── Defaults: National $23.11/hr, 2hr/day, 250 days ─────────────────────────
   dailyLoss           = 2 × 23.11 = $46.22
   annualLoss          = $46.22 × 250 = $11,555
   monthlyLoss         = $11,555 / 12 = $963
   halfHourSaving      = ($11,555 / 2) × 0.5 = $2,889
   tenYearLoss         ≈ $159,500 (FV annuity at 7%)
   excessHoursPerDay   = max(0, 2 - 2.09) = 0
   ────────────────────────────────────────────────────────────────────────── */

const FAQS = [
  {
    q: "How is the procrastination cost calculated?",
    a: "Daily cost = hours procrastinated × your state's median hourly wage. Annual cost = daily cost × working days per year. At the national median of $23.11/hr, 2 hours/day × 250 working days = $11,555/year. The 10-year compound figure shows what that money would grow to if invested at 7%.",
  },
  {
    q: "Why does it use my state's median wage?",
    a: "Wages vary significantly: Massachusetts pays $29.88/hr median vs Mississippi at $17.30/hr. Using BLS state data makes the cost realistic to your local economy. A Californian ($27.30/hr) procrastinating 2 hours/day loses $13,650/year; in Mississippi, the same 2 hours costs $8,650/year.",
  },
  {
    q: "How much does the average person procrastinate?",
    a: "Salary.com research found employees waste an average of 2.09 hours/day on non-productive activities including procrastination. DePaul University research (Steel 2007) found ~20% of adults are chronic procrastinators. The total estimated cost to US employers: $544 billion/year.",
  },
  {
    q: "What's the most effective way to reduce procrastination?",
    a: "The 2-minute rule (do anything under 2 minutes immediately), time-blocking specific tasks, removing environmental distractions, and starting with the smallest possible step ('just open the file') are well-evidenced strategies. Self-compassion about past procrastination actually reduces future procrastination more than self-criticism.",
  },
  {
    q: "What would cutting 30 minutes/day save?",
    a: "At the national median of $23.11/hr, 30 minutes less procrastination per day saves $2,889/year — that's $241/month. Over 10 years invested at 7%, it compounds to ~$39,900. A small daily improvement creates a significant long-term financial impact.",
  },
  {
    q: "Is procrastination always bad?",
    a: "Not always. Deliberate delay (waiting for more information before deciding) is rational decision-making. 'Active procrastination' — intentionally delaying to work better under pressure — works for some people. Chronic avoidance of important tasks is the problem this calculator measures.",
  },
];

const STATS = [
  {
    stat: "$11,555",
    color: "text-amber-600",
    accent: "bg-amber-500",
    label:
      "Annual cost of 2hr/day procrastination at the national median wage ($23.11/hr)",
  },
  {
    stat: "2.1hr",
    color: "text-rose-600",
    accent: "bg-rose-500",
    label:
      "Average daily procrastination in US workplaces (Salary.com)",
  },
  {
    stat: "$2,889",
    color: "text-emerald-600",
    accent: "bg-emerald-500",
    label:
      "Annual value of cutting just 30 minutes of daily procrastination",
  },
];

const CONTENT_CARDS = [
  {
    icon: "📈",
    title: "The compound cost is staggering",
    body: "$11,555/year in procrastination cost invested at 7% becomes $159,500 over 10 years and $473,000 over 20. It's not just the lost hour — it's what that hour would have been worth compounding over your career.",
  },
  {
    icon: "🧠",
    title: "Deep work is worth 2-4x more",
    body: "Research by Cal Newport shows focused, uninterrupted work is 2-4× more productive than fragmented attention. An hour of deep work often produces more than 3 hours of distracted work. Cutting procrastination doesn't just save time — it amplifies the value of the time you do use.",
  },
  {
    icon: "💙",
    title: "Self-compassion reduces procrastination",
    body: "Paradoxically, being harsh on yourself about procrastinating makes it worse. Research shows self-forgiveness about past procrastination — combined with a specific plan for the next task — is more effective for long-term change than guilt or shame.",
  },
];

const RELATED_CALCS = [
  {
    icon: "📱",
    accent: "bg-blue-500/10",
    title: "Screen Time Impact",
    description:
      "See the annual cost of non-work screen time at your state's wage.",
    href: "/tools/screen-time-impact",
  },
  {
    icon: "📅",
    accent: "bg-amber-500/10",
    title: "Meeting Cost Calculator",
    description: "Calculate the dollar cost of time spent in meetings.",
    href: "/tools/meeting-cost-calculator",
  },
  {
    icon: "🏠",
    accent: "bg-rose-500/10",
    title: "WFH Savings Calculator",
    description: "See how much working from home actually saves you.",
    href: "/tools/wfh-savings-calculator",
  },
  {
    icon: "📅",
    accent: "bg-purple-500/10",
    title: "Life in Weeks",
    description: "A weekly view of your remaining time.",
    href: "/tools/life-in-weeks-calculator",
  },
];

export default function ProcrastinationCostCalculator() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Procrastination Cost Calculator",
      applicationCategory: "ProductivityApplication",
      operatingSystem: "Web",
      description:
        "Calculate the annual cost of procrastination using your state's BLS median hourly wage.",
      url: "https://worthulator.com/tools/procrastination-cost",
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
        eyebrowIcon="⏰"
        eyebrowText="Live Data · State Wage"
        title="Procrastination Cost Calculator"
        description="Select your state to see the real cost of daily procrastination — calculated using BLS median hourly wages. Annual cost, 30-minute improvement value, and 10-year compound projection."
        chips={[
          "Live state wage",
          "Annual cost",
          "30-min improvement",
          "10-year compound",
        ]}
      >
        <ProcrastinationCostWithInsights />
      </SimpleCalculatorHero>
      <InsightStrip
        text={`2 hours of daily procrastination at the national median wage costs <span class="font-semibold text-gray-900">$11,555/year — $159,500 over a decade when compounded.</span>`}
      />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid
        title="The real price of putting things off"
        subtitle="Procrastination costs more than most people realize — especially when compounded."
        cards={CONTENT_CARDS}
      />
      <SEOTextBlock
        title="How the Procrastination Cost Calculator Works"
        formula={`Daily Cost        = Hours Procrastinated × State Median Wage
Annual Cost       = Daily Cost × Working Days per Year
Monthly Cost      = Annual Cost ÷ 12
30-min Saving     = (Annual Cost ÷ Hours/Day) × 0.5
10-Year FV        = Annual Cost × ((1.07^10 − 1) ÷ 0.07)`}
        steps={[
          {
            label: "Select your state",
            description:
              "Loads your state's BLS median hourly wage (e.g. California $27.30/hr, Mississippi $17.30/hr) as the opportunity cost rate.",
          },
          {
            label: "Enter your daily procrastination hours",
            description:
              "How many hours per working day you spend on non-productive avoidance. Salary.com workplace average is 2.09 hours/day.",
          },
          {
            label: "Set your working days per year",
            description:
              "Standard is 250 (50 weeks × 5 days). Adjust for your schedule — freelancers may work 200-300 days.",
          },
        ]}
        paragraphs={[
          "This calculator uses BLS Occupational Employment and Wage Statistics (OEWS) to determine the median hourly wage in your state. Daily procrastination hours are multiplied by that wage and your working days to compute the annual cost.",
          "At the US national median of $23.11/hr, 2 hours/day × 250 working days costs $11,555/year. The 10-year compound figure ($159,500 at 7%) shows what that money would grow to if invested instead. The 30-minute improvement metric shows the annual value of a small, achievable daily reduction.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />
      <RelatedCalcCards
        title="Related Calculators"
        subtitle="More tools for understanding where your time goes."
        items={RELATED_CALCS}
      />
    </main>
  );
}
