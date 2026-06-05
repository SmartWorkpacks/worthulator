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
  title: "Pomodoro Calculator 2026 – Deep Work Sessions & Focused Hours Per Day",
  description:
    "Calculate how many Pomodoro sessions and focused work hours fit your day. Pick session and break length, see focus density, and project your weekly deep-work output.",
  keywords: ["pomodoro calculator", "deep work calculator", "pomodoro technique", "focus sessions calculator", "how many pomodoros per day"],
  alternates: { canonical: "https://worthulator.com/tools/pomodoro-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "What is the Pomodoro Technique?",
    a: "Developed by Francesco Cirillo in the late 1980s, it breaks work into focused intervals (traditionally 25 minutes) separated by short breaks (5 minutes). After 4 sessions you take a longer break (15–30 minutes). The goal is high concentration during sessions and prevention of mental fatigue. This calculator counts how many complete sessions fit your available time, including the breaks between them.",
  },
  {
    q: "How long should a Pomodoro session be?",
    a: "The classic is 25 minutes, but research on deep work suggests 45–90 minutes can produce higher-quality output for complex tasks. A productivity study found a 52-minute work / 17-minute break ratio optimal; 90-minute sessions align with the brain's ultradian rhythm. This tool lets you pick 25, 45, 52, or 90 minutes and recomputes everything instantly.",
  },
  {
    q: "How many Pomodoros should I do per day?",
    a: "Most practitioners complete 8–12 sessions, but Cal Newport's research suggests roughly 4 hours of genuine deep work is the daily ceiling for most knowledge workers. Aim for 6–8 quality sessions over 12 distracted ones — this calculator flags when your configured day pushes past the sustainable ~4-hour deep-work line.",
  },
  {
    q: "What should I do during breaks?",
    a: "Short breaks (5 min): stand, stretch, look away from the screen, get water — avoid your phone, which restarts the attention-residue cycle. Long breaks (15–30 min): walk, eat, do light physical activity. The restorative value comes from doing something cognitively different from your work.",
  },
  {
    q: "Does the technique work for creative work?",
    a: "Yes, with modifications. Creative work often needs longer uninterrupted stretches than 25 minutes, so many creatives use 90-minute deep blocks (ultradian-aligned) with 20-minute breaks. The core principle — structured work periods with scheduled rest — applies universally. Experiment with the session-length options until you find your rhythm.",
  },
];

const STATS = [
  { stat: "4 hr", color: "text-emerald-600", accent: "bg-emerald-500", label: "peak daily deep-work capacity for most knowledge workers" },
  { stat: "52 min", color: "text-blue-600", accent: "bg-blue-500", label: "work interval one study linked to highest productivity" },
  { stat: "23 min", color: "text-amber-600", accent: "bg-amber-500", label: "average time to regain full focus after an interruption" },
];

const CONTENT_CARDS = [
  {
    icon: "🍅",
    title: "Protect your sessions fiercely",
    body: "A session is only as valuable as its integrity. Interruptions reset your focus — it takes an average of 23 minutes to return to full concentration after a distraction. Phone in another room, website blockers on, colleagues notified. Treat each session as a meeting with your highest-priority work.",
  },
  {
    icon: "📈",
    title: "Track sessions, not seat time",
    body: "Counting 'hours worked' rewards time at the desk; counting completed sessions rewards focus. Aim for a target number of clean sessions per day. The calculator's weekly projection shows how those sessions compound — six clean sessions beats ten distracted hours.",
  },
  {
    icon: "🔄",
    title: "Batch shallow tasks together",
    body: "Email, admin, and meetings are necessary but cognitively undemanding. Batch them into dedicated blocks rather than scattering them through the day. This protects your deep-work sessions and cuts the context-switching tax — two email windows a day beats checking continuously.",
  },
];

const RELATED_CALCS = [
  { title: "Work Hours Calculator", description: "Total hours from daily hours and days.", href: "/tools/work-hours-calculator", icon: "⏱️", accent: "bg-emerald-500/10" },
  { title: "Commute Time Value Calculator", description: "See what your commute really costs in time.", href: "/tools/commute-time-value", icon: "🚗", accent: "bg-blue-500/10" },
  { title: "Meeting Cost Calculator", description: "The true hourly cost of your meetings.", href: "/tools/meeting-cost-calculator", icon: "💸", accent: "bg-amber-500/10" },
  { title: "Burnout Calculator", description: "Assess your risk of professional burnout.", href: "/tools/burnout-calculator", icon: "🔥", accent: "bg-purple-500/10" },
];

export default function PomodoroCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Pomodoro Calculator",
      url: "https://worthulator.com/tools/pomodoro-calculator",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description: "Calculate how many deep-work sessions and focused hours fit your available time each day.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <main className="bg-white text-gray-900">
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}
      <SimpleCalculatorHero
        eyebrowIcon="🍅"
        eyebrowText="Work · Focus"
        title="Pomodoro Calculator"
        description="Enter your available hours, session length, break length, and days per week to see how many focus sessions fit, your deep-work hours, focus density, and weekly output."
        chips={["Sessions per day", "Deep-work hours", "Focus density"]}
      >
        <EngineWithInsights slug="pomodoro-calculator" />
      </SimpleCalculatorHero>
      <InsightStrip text="Most knowledge workers max out at <span class='font-semibold text-gray-900'>4 hours</span> of genuine deep work a day — quality beats quantity every time." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="Getting the most from focused work sessions" subtitle="Plan your day around focus, not hours." cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the Pomodoro Calculator Works"
        formula={`Cycle      = Session Minutes + Break Minutes
Sessions   = floor((Available Minutes + Break) ÷ Cycle)
Deep Work  = Sessions × Session Minutes
Density    = Deep-Work Minutes ÷ Available Minutes
Weekly     = Deep-Work Hours × Days per Week`}
        steps={[
          { label: "Enter hours available", description: "How much time you have to work today." },
          { label: "Pick a session length", description: "25 (classic), 45, 52 (study-optimal), or 90 (ultradian)." },
          { label: "Set your break length", description: "5 minutes for short breaks; longer for deep blocks." },
          { label: "Set days per week", description: "Used to project your weekly deep-work output." },
        ]}
        paragraphs={[
          "The calculator fills your available time with sessions and the breaks between them — the final session needs no trailing break — to find how many complete sessions actually fit, then converts that to deep-work hours.",
          "Focus density shows the share of your block spent working versus recovering, and the weekly projection multiplies your daily deep-work hours by your working days. Use it to set realistic project timelines around the hours that genuinely count.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />
      <RelatedCalcCards title="Related Calculators" subtitle="More work and focus tools." items={RELATED_CALCS} />
    </main>
  );
}
