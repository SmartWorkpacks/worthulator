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
  title: "Pomodoro Calculator 2026 – Deep Work Sessions & Focused Hours Per Day",
  description:
    "Calculate how many Pomodoro sessions and focused work hours you can fit into your available time. Choose your session length and see daily and weekly deep work output.",
  keywords: ["pomodoro calculator", "deep work calculator", "pomodoro technique", "focus sessions calculator", "how many pomodoros per day"],
  alternates: { canonical: "https://worthulator.com/tools/pomodoro-calculator" },
};

const FAQS = [
  {
    q: "What is the Pomodoro Technique?",
    a: "The Pomodoro Technique, developed by Francesco Cirillo in the late 1980s, is a time management method that breaks work into focused intervals (traditionally 25 minutes) separated by short breaks (5 minutes). After 4 sessions, you take a longer break (15–30 minutes). The goal is to maintain high concentration during sessions and prevent mental fatigue.",
  },
  {
    q: "How long should a Pomodoro session be?",
    a: "The classic Pomodoro is 25 minutes, but research on deep work suggests longer sessions of 45–90 minutes may produce higher-quality output for complex knowledge work. Shorter sessions (25 min) suit tasks with frequent interruptions; 52-minute sessions with 17-minute breaks emerged from a productivity study as the optimal work-rest ratio; 90-minute sessions align with the brain's ultradian rhythm cycles.",
  },
  {
    q: "How many Pomodoros should I do per day?",
    a: "Most practitioners complete 8–12 Pomodoros (200–300 minutes) per day. Cal Newport's deep work research suggests 4 hours of focused work is near the ceiling for most knowledge workers. Aim for 6–8 quality sessions rather than 12 distracted ones. Track completed sessions over time to find your personal sustainable output level.",
  },
  {
    q: "What should I do during Pomodoro breaks?",
    a: "Short breaks (5 min): stand, stretch, look away from the screen, grab water. Avoid your phone — checking social media during breaks restarts the attention residue cycle. Long breaks (15–30 min): walk, eat, do light physical activity. The restorative value of breaks comes from doing something cognitively different from your work task.",
  },
  {
    q: "Does the Pomodoro Technique work for creative work?",
    a: "Yes, but with modifications. Creative work often requires extended periods of uninterrupted thinking that 25-minute sessions disrupt. Many creatives use 90-minute deep sessions (aligned with ultradian rhythms) with 20-minute breaks instead. The core principle — structured work periods with scheduled rest — applies universally. Experiment with session length until you find your optimal rhythm.",
  },
];

const STATS = [
  { stat: "4 hr", color: "text-emerald-600", accent: "bg-emerald-500", label: "peak daily deep work capacity for most knowledge workers" },
  { stat: "52 min", color: "text-blue-600", accent: "bg-blue-500", label: "work interval found in one study to correlate with highest productivity" },
  { stat: "23 min", color: "text-amber-600", accent: "bg-amber-500", label: "average time to regain full focus after an interruption" },
];

const CONTENT_CARDS = [
  {
    icon: "🍅",
    title: "Protect your sessions fiercely",
    body: "A Pomodoro is only as valuable as its integrity. Interruptions reset your focus — research shows it takes an average of 23 minutes to return to the same level of concentration after a distraction. Put your phone in another room, use website blockers, and let colleagues know you're unavailable. Treat each session as a meeting with your highest-priority work.",
  },
  {
    icon: "📈",
    title: "Track sessions, not time",
    body: "Tracking 'hours worked' rewards seat-time. Tracking completed sessions rewards focus. Aim for a target number of quality sessions each day rather than a target number of hours. A day with 6 clean sessions is more productive than 10 hours of distracted work. Use a physical tally — there's psychological satisfaction in each mark.",
  },
  {
    icon: "🔄",
    title: "Batch shallow tasks together",
    body: "Email, admin, and meetings are 'shallow work' — necessary but cognitively undemanding. Batch these into dedicated blocks rather than scattering them throughout the day. This protects your Pomodoro sessions for deep work and prevents context-switching costs. Block 2 email windows per day instead of checking continuously.",
  },
];

const RELATED_CALCS = [
  { title: "Work Hours Calculator", description: "Total hours from daily hours and days.", href: "/tools/work-hours-calculator", icon: "⏱️", accent: "bg-emerald-500/10" },
  { title: "Commute Time Value Calculator", description: "See what your commute really costs in time.", href: "/tools/commute-time-value", icon: "🚗", accent: "bg-blue-500/10" },
  { title: "Meeting Cost Calculator", description: "The true hourly cost of your meetings.", href: "/tools/meeting-cost-calculator", icon: "💸", accent: "bg-amber-500/10" },
  { title: "Burnout Calculator", description: "Assess your risk of professional burnout.", href: "/tools/burnout-calculator", icon: "🔥", accent: "bg-purple-500/10" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Pomodoro Calculator",
      url: "https://worthulator.com/tools/pomodoro-calculator",
      applicationCategory: "ProductivityApplication",
      description: "Calculate how many deep work sessions and focused hours you can fit into your available work time each day.",
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

export default function PomodoroCalculator() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SimpleCalculatorHero
        eyebrowIcon="🍅"
        eyebrowText="Pomodoro Calculator"
        title="How Many Deep Work Sessions Can You Fit Today?"
        description="Enter your available hours, preferred session length, and days per week to see your total focused work sessions, deep work hours per day, and weekly output."
        chips={["Sessions per day", "Deep work hours", "Weekly total shown"]}
      >
        <CalculatorEngineLoader slug="pomodoro-calculator" />
      </SimpleCalculatorHero>
      <InsightStrip text="Most knowledge workers max out at <span class='font-semibold text-gray-900'>4 hours</span> of genuine deep work per day — quality beats quantity every time." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="Getting the most from focused work sessions" cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the Pomodoro Calculator Works"
        formula="Sessions = floor(Hours Available ÷ (Session Minutes ÷ 60))\nDeep Work Hours = Sessions × (Session Minutes ÷ 60)\nWeekly Output = Deep Work Hours × Days per Week"
        paragraphs={[
          "The calculator divides your available hours by the session length (in hours) to find the maximum number of complete sessions that fit. It does not include break time in the session count — breaks are the space between sessions.",
          "Multiply daily deep work hours by your working days per week to get your weekly focused output. Use this to set realistic expectations for project completion timelines.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
