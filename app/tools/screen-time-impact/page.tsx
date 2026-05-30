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
  title: "Screen Time Impact Calculator 2026 – The Real Cost of Your Screen Habits",
  description:
    "Calculate the true annual cost of your daily screen time in money and days of life. Enter your hours per day, hourly value, and projection period for an instant result.",
  keywords: ["screen time calculator", "screen time cost calculator", "how much time do I waste on phone", "screen time impact", "social media time cost"],
  alternates: { canonical: "https://worthulator.com/tools/screen-time-impact" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "How much screen time is too much for adults?",
    a: "There's no universal limit, but research consistently links more than 6–7 hours of recreational screen time per day with increased anxiety, poor sleep, and reduced productivity. The average US adult spends about 7 hours per day on screens — most of it not for work.",
  },
  {
    q: "How does this calculator measure opportunity cost?",
    a: "Opportunity cost = hours of screen time × your hourly rate × days per year. If you value your time at $35/hour and spend 4 hours/day on non-work screens, that's $51,100/year in time equivalent. This isn't money you 'lose' — it's the value of what you could do instead.",
  },
  {
    q: "What counts as screen time in this calculator?",
    a: "Only non-work screen time: social media, streaming, gaming, browsing, messaging. Work-related screen use (video calls, spreadsheets, coding) doesn't count — the point is to measure recreational or passive consumption where you're not generating output.",
  },
  {
    q: "What is the average daily screen time in the US?",
    a: "Americans average about 7 hours of daily screen time across all devices. Of that, 3–5 hours is non-work recreational use. Smartphone-specific usage averages 4.5–5 hours/day, with the majority going to social media, YouTube, and messaging apps.",
  },
  {
    q: "Does reducing screen time actually improve productivity?",
    a: "Studies consistently show yes. A 2018 Journal of Social and Clinical Psychology study found that limiting social media to 30 minutes/day significantly reduced loneliness and depression within 3 weeks. Even small reductions (1–2 hours/day) free up substantial time for skills, health, or income-generating activities.",
  },
];

const STATS = [
  { stat: "7hr",  color: "text-emerald-600", accent: "bg-emerald-500", label: "Average daily screen time for US adults across all devices" },
  { stat: "44",   color: "text-blue-600",    accent: "bg-blue-500",    label: "Days per year the average person spends on purely recreational screens" },
  { stat: "$51k", color: "text-amber-600",   accent: "bg-amber-500",   label: "Annual opportunity cost of 4hrs/day on screens for someone who earns $35/hr" },
];

const CONTENT_CARDS = [
  {
    icon: "📱",
    title: "The attention economy is designed against you",
    body: "Every feed, notification, and autoplay is engineered by billion-dollar teams to keep you scrolling. The average app checks for new content every 5–15 minutes. These systems are optimized for engagement, not your wellbeing or productivity.",
  },
  {
    icon: "🧠",
    title: "What you could build with that time",
    body: "One hour per day adds up to 365 hours per year — enough to learn a programming language, complete an online degree, write a book, or get seriously fit. Most people don't lack time; they just haven't seen it measured this concretely.",
  },
  {
    icon: "😴",
    title: "Screen time destroys sleep quality",
    body: "Blue light from screens suppresses melatonin for up to 3 hours after use. People who use devices for 2+ hours before bed take 30% longer to fall asleep and report significantly lower sleep quality. Poor sleep reduces productivity by 20–30% the next day — amplifying the total daily cost of late-night scrolling.",
  },
];

const RELATED_CALCS = [
  { title: "Meeting Cost Calculator",      description: "See the dollar cost of time spent in meetings.",        href: "/tools/meeting-cost-calculator",     icon: "📅", accent: "bg-emerald-500/10" },
  { title: "Commute Cost Calculator",      description: "Calculate your annual fuel cost to drive to work.",     href: "/tools/commute-cost-calculator",     icon: "🚗", accent: "bg-blue-500/10" },
  { title: "Quit Smoking Calculator",      description: "See money saved and life regained since quitting.",     href: "/tools/quit-smoking-calculator",     icon: "🚭", accent: "bg-amber-500/10" },
  { title: "Salary to Hourly Calculator",  description: "Find your true hourly rate from your annual salary.",   href: "/tools/salary-to-hourly-calculator",  icon: "🕐", accent: "bg-purple-500/10" },
];

export default function ScreenTimeImpactPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Screen Time Impact Calculator",
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Web",
      description: "Calculate the real annual cost of your daily screen habits in money and days of life.",
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
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <SimpleCalculatorHero
        eyebrowIcon="📱"
        eyebrowText="Time · Lifestyle"
        title="Screen Time Impact Calculator"
        description="Find out the true annual cost of your daily screen habits — in money, weekly hours, and days of your life consumed over time."
        chips={["Annual opportunity cost", "Weekly hours on screens", "Days consumed over your lifetime"]}
      >
        <CalculatorEngineLoader slug="screen-time-impact" />
      </SimpleCalculatorHero>
      <InsightStrip text='4 hours of screen time per day is <span class="font-semibold text-gray-900">60 full days per year — more than 2 months of waking hours — gone to passive consumption.</span>' />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="What your screen time is really costing you" subtitle="Time, money, sleep, and mental bandwidth — all being quietly drained." cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the Screen Time Impact Calculator Works"
        formula={`Annual Cost ($)    = Hours/Day × 365 × Hourly Rate
Weekly Hours       = Hours/Day × 7
Days Consumed      = (Hours/Day × 365 × Years) ÷ 24`}
        steps={[
          { label: "Enter your daily non-work screen time", description: "Hours per day on social media, streaming, gaming — not work-related use." },
          { label: "Set your hourly value", description: "What is one hour of your time worth? Use your actual rate, or the rate you'd pay someone to do a task." },
          { label: "Set your projection period", description: "1–40 years. Use 10 years to see the decade-scale impact clearly." },
          { label: "Read the results", description: "Annual opportunity cost in dollars, weekly hours consumed, and total days spent over your projection period." },
        ]}
        paragraphs={[
          "This calculator measures opportunity cost — not money directly spent. The 'cost' is the value of what you could do with that time: skills learned, income earned, relationships built, or health improved.",
          "Reducing screen time by just 1 hour per day frees up 365 hours per year. At a $35 hourly rate, that's $12,775 in reclaimed time value annually — and over 15 days of waking time returned to you.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />
      <RelatedCalcCards title="Related Calculators" subtitle="More tools for understanding where your time and money go." items={RELATED_CALCS} />
    </main>
  );
}
