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
  title: "Meeting Cost Calculator 2026 – The True Dollar Cost of Meetings",
  description:
    "See the true dollar cost of any meeting. Enter the number of attendees, average hourly wage, and duration to calculate the total meeting cost instantly.",
  keywords: ["meeting cost calculator", "cost of a meeting calculator", "how much does a meeting cost", "meeting ROI", "meeting productivity calculator"],
  alternates: { canonical: "https://worthulator.com/tools/meeting-cost-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "How do you calculate the cost of a meeting?",
    a: "Multiply the number of attendees by the average hourly wage by the duration in hours. An 8-person meeting at $50/hour average for 1 hour costs $400. This calculator does that instantly.",
  },
  {
    q: "Should I use salary or loaded cost for the hourly rate?",
    a: "Loaded cost (salary + benefits + overhead) is more accurate for the true cost to the company. Benefits and overhead typically add 30–50% to base salary. Use loaded cost for business decisions, base salary for team conversations.",
  },
  {
    q: "How many hours per year do office workers spend in meetings?",
    a: "Studies consistently show 4–6 hours per week for average employees, and up to 23 hours per week for senior managers. At a fully-loaded rate of $75/hour, that's $300–1,700/week per person — just in meetings.",
  },
  {
    q: "How can I make meetings cost less?",
    a: "Three levers: fewer attendees (every person added multiplies cost), shorter duration (stand-up meetings achieve more in 15 min than most hour-long calls), and higher-quality preparation (an agenda reduces meeting duration by an average of 20 minutes).",
  },
  {
    q: "What is a meeting ROI and how do I calculate it?",
    a: "Meeting ROI = (Value Generated − Meeting Cost) ÷ Meeting Cost. A $400 meeting that produces a decision saving $5,000 has an ROI of 1,150%. A $400 meeting that produces a follow-up meeting has a negative ROI. The problem is most teams never measure it.",
  },
];

const STATS = [
  { stat: "23hr",  color: "text-emerald-600", accent: "bg-emerald-500", label: "Hours per week senior managers spend in meetings on average" },
  { stat: "$37B",  color: "text-blue-600",    accent: "bg-blue-500",    label: "Estimated annual cost of unnecessary meetings to US businesses" },
  { stat: "71%",   color: "text-amber-600",   accent: "bg-amber-500",   label: "Of workers say meetings are unproductive and keep them from doing real work" },
];

const CONTENT_CARDS = [
  {
    icon: "💸",
    title: "The meeting paradox",
    body: "Meetings are called to coordinate work, but too many meetings prevent work from being done. Every person added to a meeting multiplies its cost — and its coordination overhead. The most productive teams treat meeting invites like expensive resources.",
  },
  {
    icon: "📅",
    title: "No-meeting days work",
    body: "Companies like Shopify, Asynchrony Labs, and Basecamp have implemented 'no meeting' days or blocks. Employees consistently report higher productivity and morale. Even one protected deep-work day per week can transform output.",
  },
  {
    icon: "🎯",
    title: "The agenda rule",
    body: "Meetings without an agenda run 37% longer on average and are rated as significantly less productive by participants. A one-line agenda ('Decide on Q3 launch date') transforms a meandering call into a focused decision session.",
  },
];

const RELATED_CALCS = [
  { title: "Commute Cost Calculator",  description: "Calculate your annual cost to drive to work.",         href: "/tools/commute-cost-calculator",     icon: "🚗", accent: "bg-emerald-500/10" },
  { title: "PTO Calculator",           description: "Calculate the cash value of your unused PTO.",         href: "/tools/pto-calculator",              icon: "🏖️", accent: "bg-blue-500/10" },
  { title: "Salary to Hourly",         description: "Break down any salary to an hourly rate.",             href: "/tools/salary-to-hourly-calculator",  icon: "🕐", accent: "bg-amber-500/10" },
  { title: "Freelance Rate Calculator",description: "Calculate what you need to charge as a freelancer.",   href: "/tools/freelance-rate-calculator",    icon: "💻", accent: "bg-purple-500/10" },
];

export default function MeetingCostCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Meeting Cost Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description: "Calculate the true dollar cost of any meeting based on attendees, salary, and duration.",
      url: "https://worthulator.com/tools/meeting-cost-calculator",
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
        eyebrowIcon="📅"
        eyebrowText="Productivity · Work"
        title="Meeting Cost Calculator"
        description="See the real dollar cost of any meeting — enter the number of people, average hourly wage, and how long it runs."
        chips={["Total meeting cost", "Cost per minute", "Annual cost if weekly"]}
      >
        <CalculatorEngineLoader slug="meeting-cost" />
      </SimpleCalculatorHero>
      <InsightStrip text='A 1-hour meeting with 10 people isn&apos;t 1 hour lost — <span class="font-semibold text-gray-900">it&apos;s 10 hours of collective time and often $500+ in salary cost.</span>' />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="The hidden cost of meeting culture" subtitle="Why time spent in meetings is money spent by the business." cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the Meeting Cost Calculator Works"
        formula={`Total Cost          = Attendees × Hourly Wage × (Duration ÷ 60)
Cost Per Minute     = Total Cost ÷ Duration
Annual Cost (weekly) = Total Cost × 52`}
        steps={[
          { label: "Enter number of attendees", description: "Every additional person multiplies the cost." },
          { label: "Set average hourly wage", description: "Use loaded cost (salary + benefits) for accuracy — typically 1.3× base salary." },
          { label: "Set duration in minutes", description: "Use the quick presets: 15, 30, 60, 90, or 120 minutes." },
          { label: "Read the results", description: "Total meeting cost, cost per minute, and projected annual cost if the meeting recurs weekly." },
        ]}
        paragraphs={[
          "This calculator shows the direct salary cost of time spent in meetings. It doesn't capture opportunity cost — the work not done while people are in the meeting — which is often even larger.",
          "The annual cost assumes 52 recurring weeks. If the meeting is biweekly, halve that number. Use these figures to make a business case for shorter, fewer, or asynchronous meetings.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />
      <RelatedCalcCards title="Related Calculators" subtitle="More tools for productivity and work." items={RELATED_CALCS} />
    </main>
  );
}
